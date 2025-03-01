import React, { useState, useEffect } from 'react';
import { Tabs, Form, Input, Switch, Select, InputNumber, Upload, Button, Space, Table, TimePicker, Radio } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { SystemSettingsService } from '../../services/SystemSettingsService';
import { SystemSettings } from '../../types/settings';
import { SettingsValidator } from '../../utils/settingsValidator';
import { notification } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;

export const SystemSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await SystemSettingsService.getSettings();
      setSettings(data);
      form.setFieldsValue(data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: SystemSettings) => {
    try {
      setLoading(true);
      const errors = SettingsValidator.validateAll(values);
      if (Object.keys(errors).length > 0) {
        throw new Error('Validation failed');
      }
      await SystemSettingsService.updateSettings(values);
      notification.success({
        message: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update settings',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={settings}
        className="max-w-4xl"
      >
        <Tabs defaultActiveKey="general">
          <TabPane tab="General" key="general">
            <Form.Item name={['general', 'siteName']} label="Site Name">
              <Input />
            </Form.Item>
            <Form.Item name={['general', 'supportEmail']} label="Support Email">
              <Input />
            </Form.Item>
            <Form.Item name={['general', 'phoneNumber']} label="Phone Number">
              <Input />
            </Form.Item>
            <Form.Item name={['general', 'timezone']} label="Timezone">
              <Select>
                <Option value="UTC">UTC</Option>
                <Option value="America/New_York">America/New_York</Option>
                <Option value="Europe/London">Europe/London</Option>
                <Option value="Asia/Tokyo">Asia/Tokyo</Option>
              </Select>
            </Form.Item>
          </TabPane>
          <TabPane tab="Inventory" key="inventory">
            <Form.Item name={['inventory', 'lowStockThreshold']} label="Low Stock Threshold">
              <InputNumber />
            </Form.Item>
            <Form.Item name={['inventory', 'enableAutoReorder']} label="Enable Auto Reorder" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['inventory', 'autoReorderThreshold']} label="Auto Reorder Threshold">
              <InputNumber />
            </Form.Item>
            <Form.Item name={['inventory', 'defaultSupplier']} label="Default Supplier">
              <Input />
            </Form.Item>
          </TabPane>
          <TabPane tab="Notifications" key="notifications">
            <Form.Item name={['notifications', 'enableEmailNotifications']} label="Enable Email Notifications" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['notifications', 'enableSmsNotifications']} label="Enable SMS Notifications" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['notifications', 'lowStockAlerts']} label="Low Stock Alerts" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['notifications', 'orderStatusUpdates']} label="Order Status Updates" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['notifications', 'customerReviewAlerts']} label="Customer Review Alerts" valuePropName="checked">
              <Switch />
            </Form.Item>
          </TabPane>
          <TabPane tab="Security" key="security">
            <Form.Item name={['security', 'requireTwoFactor']} label="Require Two-Factor Authentication" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['security', 'passwordExpiryDays']} label="Password Expiry (Days)">
              <InputNumber />
            </Form.Item>
            <Form.Item name={['security', 'sessionTimeoutMinutes']} label="Session Timeout (Minutes)">
              <InputNumber />
            </Form.Item>
            <Form.Item name={['security', 'maxLoginAttempts']} label="Max Login Attempts">
              <InputNumber />
            </Form.Item>
          </TabPane>
          <TabPane tab="Analytics" key="analytics">
            <Form.Item name={['analytics', 'enableGoogleAnalytics']} label="Enable Google Analytics" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['analytics', 'googleAnalyticsId']} label="Google Analytics ID">
              <Input />
            </Form.Item>
            <Form.Item name={['analytics', 'enableHeatmaps']} label="Enable Heatmaps" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['analytics', 'trackUserBehavior']} label="Track User Behavior" valuePropName="checked">
              <Switch />
            </Form.Item>
          </TabPane>
          <TabPane tab="Scents" key="scents">
            <Form.Item name={['scents', 'enableSeasonalRecommendations']} label="Enable Seasonal Recommendations" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['scents', 'enablePersonalization']} label="Enable Personalization" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['scents', 'defaultIntensityLevel']} label="Default Intensity Level">
              <Select>
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['scents', 'maxScentCombinations']} label="Max Scent Combinations">
              <InputNumber />
            </Form.Item>
          </TabPane>
          <TabPane tab="Cart & Checkout" key="cart">
            <Form.Item label="Minimum Order Amount" name={['cart', 'minimumOrderAmount']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Maximum Order Amount" name={['cart', 'maximumOrderAmount']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Cart Expiry Hours" name={['cart', 'cartExpiryHours']}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Enable Cart Merging" name={['cart', 'enableCartMerging']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Guest Cart" name={['cart', 'enableGuestCart']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Upsells" name={['cart', 'enableUpsells']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Guest Checkout" name={['checkout', 'enableGuestCheckout']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Address Validation" name={['checkout', 'enableAddressValidation']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Order Notes" name={['checkout', 'enableOrderNotes']}>
              <Switch />
            </Form.Item>
          </TabPane>

          <TabPane tab="Payment" key="payment">
            <Form.Item label="Enabled Payment Methods" name={['payment', 'enabledPaymentMethods']}>
              <Select mode="multiple">
                <Option value="stripe">Stripe</Option>
                <Option value="paypal">PayPal</Option>
                <Option value="bank_transfer">Bank Transfer</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Enable Test Mode" name={['payment', 'enableTestMode']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Partial Payments" name={['payment', 'enablePartialPayments']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Refunds" name={['payment', 'enableRefunds']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Payment Plans" name={['payment', 'enablePaymentPlans']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Default Currency" name={['payment', 'defaultCurrency']}>
              <Select>
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="GBP">GBP</Option>
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="Tax" key="tax">
            <Form.Item label="Enable Automatic Tax" name={['tax', 'enableAutomaticTax']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Default Tax Rate" name={['tax', 'defaultTaxRate']}>
              <InputNumber min={0} max={1} step={0.01} />
            </Form.Item>
            <Form.Item label="Enable VAT" name={['tax', 'enableVAT']}>
              <Switch />
            </Form.Item>
            <Form.Item label="VAT Number" name={['tax', 'vatNumber']}>
              <Input />
            </Form.Item>
            <Form.Item label="Enable Tax Exemptions" name={['tax', 'enableTaxExemptions']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Automatic Tax Filing" name={['tax', 'enableAutomaticTaxFiling']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Tax Filing Frequency" name={['tax', 'taxFilingFrequency']}>
              <Select>
                <Option value="monthly">Monthly</Option>
                <Option value="quarterly">Quarterly</Option>
                <Option value="annually">Annually</Option>
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="Customers" key="customers">
            <Form.Item label="Enable Customer Accounts" name={['customers', 'enableCustomerAccounts']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Require Email Verification" name={['customers', 'requireEmailVerification']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Social Login" name={['customers', 'enableSocialLogin']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enabled Social Providers" name={['customers', 'enabledSocialProviders']}>
              <Select mode="multiple">
                <Option value="google">Google</Option>
                <Option value="facebook">Facebook</Option>
                <Option value="apple">Apple</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Enable Customer Rewards" name={['customers', 'enableCustomerRewards']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Reward Points Ratio" name={['customers', 'rewardPointsRatio']}>
              <InputNumber min={0} step={0.01} />
            </Form.Item>
            <Form.Item label="Enable Customer Tags" name={['customers', 'enableCustomerTags']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Customer Segmentation" name={['customers', 'enableCustomerSegmentation']}>
              <Switch />
            </Form.Item>
          </TabPane>

          <TabPane tab="Content" key="content">
            <Form.Item label="Enable Blog" name={['content', 'enableBlog']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Posts Per Page" name={['content', 'postsPerPage']}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Enable Comments" name={['content', 'enableComments']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Require Comment Approval" name={['content', 'requireCommentApproval']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Featured Images" name={['content', 'enableFeaturedImages']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable SEO" name={['content', 'enableSEO']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Default Meta Description" name={['content', 'defaultMetaDescription']}>
              <Input.TextArea />
            </Form.Item>
          </TabPane>

          <TabPane tab="Backup" key="backup">
            <Form.Item label="Enable Auto Backup" name={['backup', 'enableAutoBackup']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Backup Frequency" name={['backup', 'backupFrequency']}>
              <Select>
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Backup Retention Days" name={['backup', 'backupRetentionDays']}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Include Media Files" name={['backup', 'includeMediaFiles']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Backup Encryption" name={['backup', 'backupEncryption']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Storage Provider" name={['backup', 'storageProvider']}>
              <Select>
                <Option value="s3">Amazon S3</Option>
                <Option value="local">Local Storage</Option>
                <Option value="google">Google Cloud</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Enable Versioning" name={['backup', 'enableVersioning']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Max Versions" name={['backup', 'maxVersions']}>
              <InputNumber min={1} />
            </Form.Item>
          </TabPane>

          <TabPane tab="Email" key="email">
            <h3>Template Settings</h3>
            <Form.Item label="Default Template" name={['email', 'templateSettings', 'defaultTemplate']}>
              <Select>
                <Option value="default">Default</Option>
                <Option value="minimal">Minimal</Option>
                <Option value="modern">Modern</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Enable Custom Templates" name={['email', 'templateSettings', 'customTemplates']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Dynamic Content" name={['email', 'templateSettings', 'enableDynamicContent']}>
              <Switch />
            </Form.Item>
            
            <h3>Campaign Settings</h3>
            <Form.Item label="Enable Campaigns" name={['email', 'campaignSettings', 'enableCampaigns']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Max Campaigns Per Month" name={['email', 'campaignSettings', 'maxCampaignsPerMonth']}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Require Double Opt-In" name={['email', 'campaignSettings', 'requireDoubleOptIn']}>
              <Switch />
            </Form.Item>

            <h3>Analytics Settings</h3>
            <Form.Item label="Track Opens" name={['email', 'analyticsSettings', 'trackOpens']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Track Clicks" name={['email', 'analyticsSettings', 'trackClicks']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Heatmap" name={['email', 'analyticsSettings', 'enableHeatmap']}>
              <Switch />
            </Form.Item>
          </TabPane>

          <TabPane tab="Subscription" key="subscription">
            <Form.Item label="Enable Subscriptions" name={['subscription', 'enableSubscriptions']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Trial Period Days" name={['subscription', 'trialPeriodDays']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Enable Pause/Resume" name={['subscription', 'enablePauseResume']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Skip Delivery" name={['subscription', 'enableSkipDelivery']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Max Skips Per Year" name={['subscription', 'maxSkipsPerYear']}>
              <InputNumber min={0} />
            </Form.Item>

            <h3>Cancellation Policy</h3>
            <Form.Item label="Require Reason" name={['subscription', 'cancellationPolicy', 'requireReason']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Offer Discount" name={['subscription', 'cancellationPolicy', 'offerDiscount']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Discount Percentage" name={['subscription', 'cancellationPolicy', 'discountPercentage']}>
              <InputNumber min={0} max={100} />
            </Form.Item>
          </TabPane>

          <TabPane tab="Loyalty" key="loyalty">
            <Form.Item label="Enable Loyalty Program" name={['loyalty', 'enableLoyaltyProgram']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Points Name" name={['loyalty', 'pointsName']}>
              <Input />
            </Form.Item>
            <Form.Item label="Points Per Dollar" name={['loyalty', 'pointsPerDollar']}>
              <InputNumber min={0} step={0.1} />
            </Form.Item>
            <Form.Item label="Minimum Points to Redeem" name={['loyalty', 'minimumPointsToRedeem']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Points Expiry (Months)" name={['loyalty', 'pointsExpiryMonths']}>
              <InputNumber min={0} />
            </Form.Item>

            <h3>Special Events</h3>
            <Form.Item label="Enable Birthday Rewards" name={['loyalty', 'specialEvents', 'enableBirthday']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Birthday Points" name={['loyalty', 'specialEvents', 'birthdayPoints']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Enable Anniversary Rewards" name={['loyalty', 'specialEvents', 'enableAnniversary']}>
              <Switch />
            </Form.Item>

            <h3>Referral Program</h3>
            <Form.Item label="Enable Referrals" name={['loyalty', 'referralProgram', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Referrer Points" name={['loyalty', 'referralProgram', 'referrerPoints']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Referee Discount (%)" name={['loyalty', 'referralProgram', 'refereeDiscount']}>
              <InputNumber min={0} max={100} />
            </Form.Item>
          </TabPane>

          <TabPane tab="Support" key="support">
            <h3>Live Chat</h3>
            <Form.Item label="Enable Live Chat" name={['support', 'enableLiveChat']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Chat Provider" name={['support', 'chatProvider']}>
              <Select>
                <Option value="whatsapp">WhatsApp</Option>
                <Option value="intercom">Intercom</Option>
                <Option value="zendesk">Zendesk</Option>
                <Option value="crisp">Crisp</Option>
              </Select>
            </Form.Item>

            <Form.Item 
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.support?.chatProvider !== currentValues.support?.chatProvider
              }
            >
              {({ getFieldValue }) => 
                getFieldValue(['support', 'chatProvider']) === 'whatsapp' && (
                  <>
                    <Form.Item label="WhatsApp Business Number" name={['support', 'whatsapp', 'businessNumber']}>
                      <Input />
                    </Form.Item>
                    <Form.Item label="WhatsApp API Key" name={['support', 'whatsapp', 'apiKey']}>
                      <Input.Password />
                    </Form.Item>
                    <Form.Item label="Enable Group Chat" name={['support', 'whatsapp', 'enableGroupChat']}>
                      <Switch />
                    </Form.Item>
                    <Form.Item label="Message Cleanup Delay (ms)" name={['support', 'whatsapp', 'messageCleanupDelay']}>
                      <InputNumber min={0} />
                    </Form.Item>
                  </>
                )
              }
            </Form.Item>

            <Form.Item label="Operating Hours Start" name={['support', 'chatSettings', 'operatingHours', 'start']}>
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item label="Operating Hours End" name={['support', 'chatSettings', 'operatingHours', 'end']}>
              <TimePicker format="HH:mm" />
            </Form.Item>

            <h3>Ticket System</h3>
            <Form.Item label="Enable Ticket System" name={['support', 'ticketSystem', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Auto Assignment" name={['support', 'ticketSystem', 'autoAssignment']}>
              <Switch />
            </Form.Item>

            <h3>Knowledge Base</h3>
            <Form.Item label="Enable Knowledge Base" name={['support', 'knowledgeBase', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Categories" name={['support', 'knowledgeBase', 'categoriesEnabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Search" name={['support', 'knowledgeBase', 'searchEnabled']}>
              <Switch />
            </Form.Item>
          </TabPane>

          <TabPane tab="Search" key="search">
            <Form.Item label="Search Engine" name={['search', 'engine']}>
              <Select>
                <Option value="elasticsearch">Elasticsearch</Option>
                <Option value="algolia">Algolia</Option>
                <Option value="custom">Custom</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Enable Instant Search" name={['search', 'enableInstantSearch']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Min Characters" name={['search', 'minCharacters']}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Enable Spellcheck" name={['search', 'enableSpellcheck']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Autocomplete" name={['search', 'enableAutocomplete']}>
              <Switch />
            </Form.Item>

            <h3>Scent Filtering</h3>
            <Form.Item label="Enable Scent Filtering" name={['search', 'scentFiltering', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Enable Combinations" name={['search', 'scentFiltering', 'combinations']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Max Combinations" name={['search', 'scentFiltering', 'maxCombinations']}>
              <InputNumber min={1} />
            </Form.Item>
          </TabPane>

          <TabPane tab="Performance" key="performance">
            <h3>Caching</h3>
            <Form.Item label="Enable Caching" name={['performance', 'caching', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Cache Provider" name={['performance', 'caching', 'provider']}>
              <Select>
                <Option value="redis">Redis</Option>
                <Option value="memcached">Memcached</Option>
                <Option value="custom">Custom</Option>
              </Select>
            </Form.Item>
            <Form.Item label="TTL (seconds)" name={['performance', 'caching', 'ttl']}>
              <InputNumber min={0} />
            </Form.Item>

            <h3>Image Optimization</h3>
            <Form.Item label="Enable Optimization" name={['performance', 'images', 'optimization']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Quality" name={['performance', 'images', 'quality']}>
              <InputNumber min={1} max={100} />
            </Form.Item>
            <Form.Item label="Max Width" name={['performance', 'images', 'maxWidth']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Max Height" name={['performance', 'images', 'maxHeight']}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Enable Lazy Loading" name={['performance', 'images', 'lazyLoading']}>
              <Switch />
            </Form.Item>

            <h3>CDN</h3>
            <Form.Item label="Enable CDN" name={['performance', 'cdn', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="CDN Provider" name={['performance', 'cdn', 'provider']}>
              <Select>
                <Option value="cloudflare">Cloudflare</Option>
                <Option value="akamai">Akamai</Option>
                <Option value="fastly">Fastly</Option>
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="WhatsApp" key="whatsapp">
            <h3>API Configuration</h3>
            <Form.Item label="Enable WhatsApp" name={['whatsapp', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="API URL" name={['whatsapp', 'apiUrl']}>
              <Input />
            </Form.Item>
            <Form.Item label="Access Token" name={['whatsapp', 'accessToken']}>
              <Input.Password />
            </Form.Item>
            <Form.Item label="Business Phone Number" name={['whatsapp', 'businessPhoneNumber']}>
              <Input />
            </Form.Item>
            <Form.Item label="Business Name" name={['whatsapp', 'businessName']}>
              <Input />
            </Form.Item>

            <h3>Support Group</h3>
            <Form.Item label="Group ID" name={['whatsapp', 'supportGroup', 'groupId']}>
              <Input />
            </Form.Item>
            <Form.Item label="Notify New Customer" name={['whatsapp', 'supportGroup', 'notifyNewCustomer']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Max Agents" name={['whatsapp', 'supportGroup', 'maxAgents']}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Message Cleanup Delay (ms)" name={['whatsapp', 'supportGroup', 'messageCleanupDelay']}>
              <InputNumber min={0} step={1000} />
            </Form.Item>

            <h3>Webhook</h3>
            <Form.Item label="Enable Webhook" name={['whatsapp', 'webhook', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Verify Token" name={['whatsapp', 'webhook', 'verifyToken']}>
              <Input.Password />
            </Form.Item>
            <Form.Item label="Notification URL" name={['whatsapp', 'webhook', 'notificationUrl']}>
              <Input />
            </Form.Item>

            <h3>Message Templates</h3>
            <Form.Item label="Welcome Message" name={['whatsapp', 'templates', 'welcome']}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Agent Response Template" name={['whatsapp', 'templates', 'agentResponse']}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Out of Hours Message" name={['whatsapp', 'templates', 'outOfHours']}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Session End Message" name={['whatsapp', 'templates', 'sessionEnd']}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Error Message" name={['whatsapp', 'templates', 'error']}>
              <Input.TextArea />
            </Form.Item>

            <h3>Chat Widget</h3>
            <Form.Item label="Enable Widget" name={['whatsapp', 'widget', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Position" name={['whatsapp', 'widget', 'position']}>
              <Select>
                <Option value="bottom-right">Bottom Right</Option>
                <Option value="bottom-left">Bottom Left</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Primary Color" name={['whatsapp', 'widget', 'theme', 'primaryColor']}>
              <Input type="color" />
            </Form.Item>
            <Form.Item label="Text Color" name={['whatsapp', 'widget', 'theme', 'textColor']}>
              <Input type="color" />
            </Form.Item>
            <Form.Item label="Background Color" name={['whatsapp', 'widget', 'theme', 'backgroundColor']}>
              <Input type="color" />
            </Form.Item>
            <Form.Item label="Initial Message" name={['whatsapp', 'widget', 'initialMessage']}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Input Placeholder" name={['whatsapp', 'widget', 'placeholder']}>
              <Input />
            </Form.Item>
            <Form.Item label="Require Name" name={['whatsapp', 'widget', 'requireName']}>
              <Switch />
            </Form.Item>

            <h3>Operating Hours</h3>
            <Form.Item label="Enable Operating Hours" name={['whatsapp', 'operatingHours', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Timezone" name={['whatsapp', 'operatingHours', 'timezone']}>
              <Select>
                <Option value="UTC">UTC</Option>
                <Option value="America/New_York">America/New_York</Option>
                <Option value="Europe/London">Europe/London</Option>
                <Option value="Asia/Tokyo">Asia/Tokyo</Option>
              </Select>
            </Form.Item>
            <Form.List name={['whatsapp', 'operatingHours', 'schedule']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'day']}
                        rules={[{ required: true, message: 'Day is required' }]}
                      >
                        <Select style={{ width: 120 }}>
                          <Option value="monday">Monday</Option>
                          <Option value="tuesday">Tuesday</Option>
                          <Option value="wednesday">Wednesday</Option>
                          <Option value="thursday">Thursday</Option>
                          <Option value="friday">Friday</Option>
                          <Option value="saturday">Saturday</Option>
                          <Option value="sunday">Sunday</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'start']}
                        rules={[{ required: true, message: 'Start time is required' }]}
                      >
                        <TimePicker format="HH:mm" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'end']}
                        rules={[{ required: true, message: 'End time is required' }]}
                      >
                        <TimePicker format="HH:mm" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Operating Hours
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <h3>Auto Response</h3>
            <Form.Item label="Enable Auto Response" name={['whatsapp', 'autoResponse', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Out of Hours Message" name={['whatsapp', 'autoResponse', 'outOfHoursMessage']}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Queue Message" name={['whatsapp', 'autoResponse', 'queueMessage']}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Max Queue Size" name={['whatsapp', 'autoResponse', 'maxQueueSize']}>
              <InputNumber min={1} />
            </Form.Item>

            <h3>Analytics</h3>
            <Form.Item label="Enable Analytics" name={['whatsapp', 'analytics', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Track Response Time" name={['whatsapp', 'analytics', 'trackMetrics', 'responseTime']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Track Resolution Rate" name={['whatsapp', 'analytics', 'trackMetrics', 'resolutionRate']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Track Customer Satisfaction" name={['whatsapp', 'analytics', 'trackMetrics', 'customerSatisfaction']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Track Agent Performance" name={['whatsapp', 'analytics', 'trackMetrics', 'agentPerformance']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Retention Days" name={['whatsapp', 'analytics', 'retentionDays']}>
              <InputNumber min={1} />
            </Form.Item>

            <h3>Rate Limiting</h3>
            <Form.Item label="Enable Rate Limiting" name={['whatsapp', 'rateLimit', 'enabled']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Max Messages Per Minute" name={['whatsapp', 'rateLimit', 'maxMessagesPerMinute']}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Max Sessions Per Day" name={['whatsapp', 'rateLimit', 'maxSessionsPerDay']}>
              <InputNumber min={1} />
            </Form.Item>

            <h3>Security</h3>
            <Form.Item label="Encrypt Messages" name={['whatsapp', 'security', 'encryptMessages']}>
              <Switch />
            </Form.Item>
            <Form.Item label="Allowed Country Codes" name={['whatsapp', 'security', 'allowedCountryCodes']}>
              <Select mode="tags" />
            </Form.Item>
            <Form.Item label="Blocked Words" name={['whatsapp', 'security', 'blockWords']}>
              <Select mode="tags" />
            </Form.Item>
            <Form.Item label="Max File Size (bytes)" name={['whatsapp', 'security', 'maxFileSize']}>
              <InputNumber min={0} step={1024} />
            </Form.Item>
            <Form.Item label="Allowed File Types" name={['whatsapp', 'security', 'allowedFileTypes']}>
              <Select mode="tags" placeholder="e.g., .jpg, .pdf" />
            </Form.Item>
          </TabPane>

          <TabPane tab="WhatsApp" key="whatsapp">
          </TabPane>
        </Tabs>

        <div className="mt-6">
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Settings
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};
