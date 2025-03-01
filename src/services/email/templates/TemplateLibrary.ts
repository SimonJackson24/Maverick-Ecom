interface TemplateSection {
  id: string;
  name: string;
  content: string;
  preview?: string;
}

export const headerTemplates: TemplateSection[] = [
  {
    id: 'minimal-header',
    name: 'Minimal Header',
    content: `
      <div style="padding: 20px; text-align: center;">
        <img src="{{logoUrl}}" alt="Wick & Wax Co" style="max-width: 150px;">
      </div>
    `
  },
  {
    id: 'seasonal-header',
    name: 'Seasonal Header',
    content: `
      <div style="background-color: {{seasonalColor}}; padding: 40px 20px; text-align: center;">
        <img src="{{logoUrl}}" alt="Wick & Wax Co" style="max-width: 150px; margin-bottom: 20px;">
        <h1 style="color: white; font-family: {{headingFont}}; margin: 0;">{{seasonalHeading}}</h1>
      </div>
    `
  },
  {
    id: 'premium-header',
    name: 'Premium Header',
    content: `
      <div style="background: linear-gradient(to right, #1a1a1a, #4a4a4a); padding: 40px 20px; text-align: center;">
        <img src="{{logoUrl}}" alt="Wick & Wax Co" style="max-width: 180px; margin-bottom: 25px;">
        <h1 style="color: white; font-family: {{headingFont}}; margin: 0; letter-spacing: 2px;">{{heading}}</h1>
      </div>
    `
  }
];

export const productTemplates: TemplateSection[] = [
  {
    id: 'grid-products',
    name: 'Product Grid',
    content: `
      <div style="padding: 20px;">
        <h2 style="font-family: {{headingFont}}; margin-bottom: 20px;">{{sectionTitle}}</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          {{#each products}}
          <div style="text-align: center;">
            <img src="{{imageUrl}}" alt="{{name}}" style="width: 100%; max-width: 200px; margin-bottom: 10px;">
            <h3 style="font-family: {{../headingFont}}; margin: 0;">{{name}}</h3>
            <p style="color: #666; margin: 5px 0;">{{price}}</p>
            <a href="{{url}}" style="display: inline-block; padding: 8px 20px; background-color: {{../primaryColor}}; color: white; text-decoration: none; border-radius: 4px;">Shop Now</a>
          </div>
          {{/each}}
        </div>
      </div>
    `
  },
  {
    id: 'featured-product',
    name: 'Featured Product',
    content: `
      <div style="padding: 20px; background-color: {{backgroundColor}};">
        <div style="max-width: 600px; margin: 0 auto; display: flex; align-items: center;">
          <div style="flex: 1; padding-right: 20px;">
            <h2 style="font-family: {{headingFont}}; color: {{textColor}};">{{product.name}}</h2>
            <p style="color: {{textColor}}; margin: 10px 0;">{{product.description}}</p>
            <p style="font-size: 24px; color: {{primaryColor}}; margin: 15px 0;">{{product.price}}</p>
            <a href="{{product.url}}" style="display: inline-block; padding: 12px 30px; background-color: {{primaryColor}}; color: white; text-decoration: none; border-radius: 4px;">Shop Now</a>
          </div>
          <div style="flex: 1;">
            <img src="{{product.imageUrl}}" alt="{{product.name}}" style="width: 100%;">
          </div>
        </div>
      </div>
    `
  }
];

export const scentProfileTemplates: TemplateSection[] = [
  {
    id: 'scent-profile-minimal',
    name: 'Minimal Scent Profile',
    content: `
      <div style="padding: 20px; background-color: #f8f8f8;">
        <h3 style="font-family: {{headingFont}}; margin-bottom: 15px;">Your Scent Profile</h3>
        <div style="display: flex; gap: 20px;">
          <div>
            <strong>Favorite Notes:</strong>
            <p>{{scentProfile.notes}}</p>
          </div>
          <div>
            <strong>Preferred Intensity:</strong>
            <p>{{scentProfile.intensity}}</p>
          </div>
          <div>
            <strong>Mood:</strong>
            <p>{{scentProfile.mood}}</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'scent-profile-detailed',
    name: 'Detailed Scent Profile',
    content: `
      <div style="padding: 30px; background: linear-gradient(to right, {{gradientStart}}, {{gradientEnd}});">
        <div style="max-width: 600px; margin: 0 auto; color: white;">
          <h2 style="font-family: {{headingFont}}; margin-bottom: 20px;">Your Personalized Scent Journey</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div style="text-align: center; padding: 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px;">
              <h4 style="margin: 0 0 10px 0;">Favorite Notes</h4>
              {{#each scentProfile.notes}}
              <span style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 255, 255, 0.2); border-radius: 20px; margin: 2px;">{{this}}</span>
              {{/each}}
            </div>
            <div style="text-align: center; padding: 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px;">
              <h4 style="margin: 0 0 10px 0;">Intensity</h4>
              <div style="font-size: 24px;">{{scentProfile.intensity}}</div>
            </div>
            <div style="text-align: center; padding: 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 8px;">
              <h4 style="margin: 0 0 10px 0;">Mood</h4>
              <div style="font-size: 24px;">{{scentProfile.mood}}</div>
            </div>
          </div>
        </div>
      </div>
    `
  }
];

export const recommendationTemplates: TemplateSection[] = [
  {
    id: 'recommendations-carousel',
    name: 'Recommendations Carousel',
    content: `
      <div style="padding: 20px;">
        <h2 style="font-family: {{headingFont}}; margin-bottom: 20px;">Recommended for You</h2>
        <div style="display: flex; gap: 20px; overflow-x: auto; padding: 10px 0;">
          {{#each recommendations}}
          <div style="flex: 0 0 200px; text-align: center;">
            <img src="{{imageUrl}}" alt="{{name}}" style="width: 100%; margin-bottom: 10px;">
            <h3 style="font-family: {{../headingFont}}; margin: 0; font-size: 16px;">{{name}}</h3>
            <p style="color: #666; margin: 5px 0;">{{price}}</p>
            <a href="{{url}}" style="display: inline-block; padding: 8px 20px; background-color: {{../primaryColor}}; color: white; text-decoration: none; border-radius: 4px;">View</a>
          </div>
          {{/each}}
        </div>
      </div>
    `
  },
  {
    id: 'recommendations-grid',
    name: 'Recommendations Grid',
    content: `
      <div style="padding: 20px; background-color: {{backgroundColor}};">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="font-family: {{headingFont}}; margin-bottom: 20px; text-align: center;">Personalized Picks</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            {{#each recommendations}}
            <div style="background-color: white; padding: 15px; border-radius: 8px; text-align: center;">
              <img src="{{imageUrl}}" alt="{{name}}" style="width: 100%; margin-bottom: 10px;">
              <h3 style="font-family: {{../headingFont}}; margin: 0; font-size: 16px;">{{name}}</h3>
              <p style="color: #666; margin: 5px 0;">{{price}}</p>
              <a href="{{url}}" style="display: inline-block; padding: 8px 20px; background-color: {{../primaryColor}}; color: white; text-decoration: none; border-radius: 4px;">Shop Now</a>
            </div>
            {{/each}}
          </div>
        </div>
      </div>
    `
  }
];

export const footerTemplates: TemplateSection[] = [
  {
    id: 'footer-simple',
    name: 'Simple Footer',
    content: `
      <div style="padding: 20px; background-color: #f8f8f8; text-align: center;">
        <div style="margin-bottom: 20px;">
          <a href="{{socialLinks.facebook}}" style="margin: 0 10px;"><img src="{{socialIcons.facebook}}" alt="Facebook"></a>
          <a href="{{socialLinks.instagram}}" style="margin: 0 10px;"><img src="{{socialIcons.instagram}}" alt="Instagram"></a>
          <a href="{{socialLinks.pinterest}}" style="margin: 0 10px;"><img src="{{socialIcons.pinterest}}" alt="Pinterest"></a>
        </div>
        <p style="color: #666; margin: 10px 0;">© {{currentYear}} Wick & Wax Co. All rights reserved.</p>
        <p style="color: #666; font-size: 12px;">
          <a href="{{unsubscribeUrl}}" style="color: #666; text-decoration: underline;">Unsubscribe</a> |
          <a href="{{preferencesUrl}}" style="color: #666; text-decoration: underline;">Update Preferences</a>
        </p>
      </div>
    `
  },
  {
    id: 'footer-detailed',
    name: 'Detailed Footer',
    content: `
      <div style="padding: 40px 20px; background-color: #1a1a1a; color: white;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-bottom: 40px;">
            <div>
              <h4 style="margin: 0 0 15px 0;">Contact Us</h4>
              <p style="margin: 5px 0;">{{contactEmail}}</p>
              <p style="margin: 5px 0;">{{phoneNumber}}</p>
            </div>
            <div>
              <h4 style="margin: 0 0 15px 0;">Quick Links</h4>
              <p style="margin: 5px 0;"><a href="{{shopUrl}}" style="color: white; text-decoration: none;">Shop</a></p>
              <p style="margin: 5px 0;"><a href="{{aboutUrl}}" style="color: white; text-decoration: none;">About Us</a></p>
              <p style="margin: 5px 0;"><a href="{{faqUrl}}" style="color: white; text-decoration: none;">FAQ</a></p>
            </div>
            <div>
              <h4 style="margin: 0 0 15px 0;">Follow Us</h4>
              <div style="display: flex; gap: 10px;">
                <a href="{{socialLinks.facebook}}" style="color: white;"><img src="{{socialIcons.facebook}}" alt="Facebook"></a>
                <a href="{{socialLinks.instagram}}" style="color: white;"><img src="{{socialIcons.instagram}}" alt="Instagram"></a>
                <a href="{{socialLinks.pinterest}}" style="color: white;"><img src="{{socialIcons.pinterest}}" alt="Pinterest"></a>
              </div>
            </div>
          </div>
          <div style="text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px;">
            <p style="margin: 10px 0;">© {{currentYear}} Wick & Wax Co. All rights reserved.</p>
            <p style="margin: 10px 0; font-size: 12px;">
              <a href="{{unsubscribeUrl}}" style="color: white; text-decoration: underline;">Unsubscribe</a> |
              <a href="{{preferencesUrl}}" style="color: white; text-decoration: underline;">Update Preferences</a> |
              <a href="{{privacyUrl}}" style="color: white; text-decoration: underline;">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    `
  }
];
