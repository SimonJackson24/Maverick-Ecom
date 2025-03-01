import nodemailer from 'nodemailer';
import Slack from '@slack/webhook';
import { SuspiciousActivity } from '../models/SuspiciousActivity';

interface AlertOptions {
  type: string;
  activityId: string;
  patterns: Array<{
    type: string;
    severity: string;
    details: string;
  }>;
}

export class NotificationService {
  private static emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  private static slackWebhook = new Slack.IncomingWebhook(
    process.env.SLACK_WEBHOOK_URL || ''
  );

  static async sendUrgentAlert(options: AlertOptions) {
    try {
      await Promise.all([
        this.sendEmailAlert(options),
        this.sendSlackAlert(options),
      ]);

      // Update notification status
      await SuspiciousActivity.findByIdAndUpdate(options.activityId, {
        notificationSent: true,
        notificationTimestamp: new Date(),
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  private static async sendEmailAlert(options: AlertOptions) {
    const subject = `🚨 High Severity Alert: Suspicious Payment Activity Detected`;
    const html = this.generateAlertEmailHtml(options);

    await this.emailTransporter.sendMail({
      from: process.env.ALERT_EMAIL_FROM,
      to: process.env.ALERT_EMAIL_TO?.split(','),
      subject,
      html,
    });
  }

  private static async sendSlackAlert(options: AlertOptions) {
    const blocks = this.generateSlackBlocks(options);

    await this.slackWebhook.send({
      blocks,
    });
  }

  private static generateAlertEmailHtml(options: AlertOptions): string {
    const patterns = options.patterns
      .map(
        (p) => `
        <tr>
          <td><strong>${p.type}</strong></td>
          <td style="color: ${p.severity === 'high' ? 'red' : 'orange'}">${
          p.severity
        }</td>
          <td>${p.details}</td>
        </tr>
      `
      )
      .join('');

    return `
      <html>
        <body>
          <h2>🚨 Suspicious Payment Activity Detected</h2>
          <p>Activity ID: ${options.activityId}</p>
          <table border="1" cellpadding="5">
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>Details</th>
            </tr>
            ${patterns}
          </table>
          <p>
            <a href="${process.env.DASHBOARD_URL}/suspicious-activity/${
      options.activityId
    }">
              View in Dashboard
            </a>
          </p>
        </body>
      </html>
    `;
  }

  private static generateSlackBlocks(options: AlertOptions): Array<any> {
    return [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Suspicious Payment Activity Alert',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Activity ID:* ${options.activityId}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: options.patterns
            .map(
              (p) =>
                `• *${p.type}* (${p.severity})\n>${p.details}`
            )
            .join('\n\n'),
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View in Dashboard',
              emoji: true,
            },
            url: `${process.env.DASHBOARD_URL}/suspicious-activity/${options.activityId}`,
          },
        ],
      },
    ];
  }
}
