import { ScentProfile } from '../../src/types/scent';

describe('Scent Features End-to-End Tests', () => {
  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      // Mock GraphQL responses
      if (req.body.operationName === 'GetProductScentProfile') {
        req.reply({ fixture: 'scentProfile.json' });
      }
      if (req.body.operationName === 'GetSimilarScents') {
        req.reply({ fixture: 'similarScents.json' });
      }
      if (req.body.operationName === 'GetScentBasedUpsells') {
        req.reply({ fixture: 'scentUpsells.json' });
      }
    }).as('graphqlCalls');

    cy.visit('/');
  });

  describe('Product Catalog Integration', () => {
    it('displays scent attributes in product listings', () => {
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="scent-profile-preview"]').should('be.visible');
        cy.get('[data-testid="intensity-badge"]').should('be.visible');
        cy.get('[data-testid="primary-notes"]').should('be.visible');
      });
    });

    it('allows filtering products by scent attributes', () => {
      cy.get('[data-testid="filter-button"]').click();
      cy.get('[data-testid="scent-filters"]').within(() => {
        cy.get('[data-testid="intensity-filter"]').select('MODERATE');
        cy.get('[data-testid="note-filter"]').check(['Lavender', 'Vanilla']);
        cy.get('[data-testid="mood-filter"]').check('Relaxing');
      });
      cy.get('[data-testid="apply-filters"]').click();
      cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    });
  });

  describe('Product Detail Scent Profile', () => {
    beforeEach(() => {
      cy.visit('/products/test-product-1');
    });

    it('displays complete scent profile information', () => {
      cy.get('[data-testid="scent-profile"]').within(() => {
        // Check all scent notes
        cy.get('[data-testid="top-notes"]').should('be.visible');
        cy.get('[data-testid="middle-notes"]').should('be.visible');
        cy.get('[data-testid="base-notes"]').should('be.visible');
        
        // Check intensity and mood
        cy.get('[data-testid="intensity-badge"]').should('be.visible');
        cy.get('[data-testid="mood-tags"]').should('be.visible');
      });
    });

    it('shows scent note details on interaction', () => {
      cy.get('[data-testid="note-button"]').first().click();
      cy.get('[data-testid="note-details"]').should('be.visible')
        .and('contain', 'Intensity');
    });

    it('displays seasonal recommendations', () => {
      cy.get('[data-testid="seasonal-badge"]').should('be.visible');
      cy.get('[data-testid="seasonal-recommendations"]').should('be.visible');
    });
  });

  describe('Scent-Based Recommendations', () => {
    it('shows similar scent recommendations', () => {
      cy.visit('/products/test-product-1');
      cy.get('[data-testid="scent-recommendations"]').within(() => {
        cy.get('[data-testid="recommendation-card"]')
          .should('have.length.at.least', 1);
        cy.get('[data-testid="matching-notes"]').should('be.visible');
      });
    });

    it('updates recommendations when changing product', () => {
      cy.visit('/products/test-product-1');
      cy.get('[data-testid="recommendation-card"]').first().click();
      cy.get('[data-testid="scent-recommendations"]').should('be.visible');
      cy.get('@graphqlCalls').its('response.body').should('exist');
    });
  });

  describe('Shopping Cart Integration', () => {
    it('suggests complementary scents in cart', () => {
      // Add product to cart
      cy.visit('/products/test-product-1');
      cy.get('[data-testid="add-to-cart"]').click();
      cy.get('[data-testid="view-cart"]').click();

      // Check upsells
      cy.get('[data-testid="scent-based-upsells"]').should('be.visible');
      cy.get('[data-testid="upsell-card"]').should('have.length.at.least', 1);
    });

    it('updates upsells when cart changes', () => {
      // Add first product
      cy.visit('/products/test-product-1');
      cy.get('[data-testid="add-to-cart"]').click();
      
      // Add recommended product
      cy.get('[data-testid="recommendation-card"]').first().within(() => {
        cy.get('[data-testid="add-to-cart"]').click();
      });

      // Verify upsells update
      cy.get('[data-testid="view-cart"]').click();
      cy.get('[data-testid="scent-based-upsells"]').should('be.visible');
      cy.get('@graphqlCalls').its('response.body').should('exist');
    });
  });

  describe('User Preferences', () => {
    beforeEach(() => {
      cy.login('testuser@example.com', 'password123');
    });

    it('saves and applies scent preferences', () => {
      // Set preferences
      cy.visit('/account/preferences');
      cy.get('[data-testid="scent-preferences"]').within(() => {
        cy.get('[data-testid="favorite-notes"]').check(['Lavender', 'Vanilla']);
        cy.get('[data-testid="preferred-intensity"]').select('MODERATE');
        cy.get('[data-testid="save-preferences"]').click();
      });

      // Verify preferences are applied
      cy.visit('/');
      cy.get('[data-testid="personalized-recommendations"]').should('be.visible');
    });

    it('shows personalized recommendations based on preferences', () => {
      cy.visit('/');
      cy.get('[data-testid="personalized-recommendations"]').within(() => {
        cy.get('[data-testid="recommendation-card"]')
          .should('have.length.at.least', 1);
        cy.get('[data-testid="preference-match"]').should('be.visible');
      });
    });
  });

  describe('Performance and Error Handling', () => {
    it('handles slow network gracefully', () => {
      cy.intercept('POST', '/graphql', (req) => {
        req.on('response', (res) => {
          res.setDelay(2000);
        });
      });

      cy.visit('/products/test-product-1');
      cy.get('[data-testid="loading-skeleton"]').should('be.visible');
      cy.get('[data-testid="scent-profile"]').should('be.visible');
    });

    it('handles GraphQL errors gracefully', () => {
      cy.intercept('POST', '/graphql', {
        statusCode: 500,
        body: { errors: [{ message: 'Internal server error' }] }
      });

      cy.visit('/products/test-product-1');
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="retry-button"]').should('be.visible');
    });

    it('recovers from failed recommendations', () => {
      cy.intercept('POST', '/graphql', (req) => {
        if (req.body.operationName === 'GetSimilarScents') {
          req.reply({ statusCode: 500 });
        }
      });

      cy.visit('/products/test-product-1');
      cy.get('[data-testid="recommendations-error"]').should('be.visible');
      cy.get('[data-testid="retry-recommendations"]').click();
      cy.get('[data-testid="scent-recommendations"]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('supports keyboard navigation', () => {
      cy.visit('/products/test-product-1');
      cy.get('[data-testid="scent-profile"]').within(() => {
        cy.get('[data-testid="note-button"]').first().focus().type('{enter}');
        cy.get('[data-testid="note-details"]').should('be.visible');
      });
    });

    it('announces dynamic content updates', () => {
      cy.visit('/products/test-product-1');
      cy.get('[aria-live="polite"]').should('exist');
      cy.get('[data-testid="recommendation-card"]').first().click();
      cy.get('[aria-live="polite"]').should('not.be.empty');
    });
  });
});
