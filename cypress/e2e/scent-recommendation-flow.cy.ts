describe('Scent Recommendation Flow', () => {
  beforeEach(() => {
    // Reset any test data and visit the home page
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GetScentProfile') {
        req.reply({
          data: {
            product: {
              scent_profile: {
                primary_notes: [{ name: 'Lavender', intensity: 8 }],
                middle_notes: [{ name: 'Rose', intensity: 7 }],
                base_notes: [{ name: 'Vanilla', intensity: 9 }],
                intensity: 'MODERATE',
                mood: ['Relaxing'],
                season: ['Spring', 'Summer']
              }
            }
          }
        });
      }
    }).as('getScentProfile');

    cy.visit('/');
  });

  it('completes full scent recommendation journey', () => {
    // 1. Navigate to featured products
    cy.get('[data-testid="featured-products"]').should('be.visible');
    cy.get('[data-testid="product-card"]').first().click();

    // 2. View product details and scent profile
    cy.get('[data-testid="product-details"]').should('be.visible');
    cy.get('[data-testid="scent-profile"]').should('be.visible');
    
    // Verify scent profile details
    cy.get('[data-testid="primary-notes"]').should('contain', 'Lavender');
    cy.get('[data-testid="intensity-badge"]').should('contain', 'MODERATE');

    // 3. Check similar scent recommendations
    cy.get('[data-testid="scent-recommendations"]').should('be.visible');
    cy.get('[data-testid="recommendation-card"]').should('have.length.at.least', 1);

    // 4. Add to cart and view upsells
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-notification"]').should('be.visible');
    cy.get('[data-testid="view-cart-button"]').click();

    // 5. Verify scent-based upsells in cart
    cy.get('[data-testid="scent-based-upsells"]').should('be.visible');
    cy.get('[data-testid="upsell-card"]').should('have.length.at.least', 1);

    // 6. Add recommended product to cart
    cy.get('[data-testid="upsell-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    // 7. Verify cart update
    cy.get('[data-testid="cart-items"]').should('have.length', 2);
  });

  it('filters products by scent preferences', () => {
    // 1. Navigate to product listing
    cy.visit('/products');

    // 2. Open scent filter
    cy.get('[data-testid="scent-filter"]').click();

    // 3. Select scent preferences
    cy.get('[data-testid="scent-intensity-filter"]').select('MODERATE');
    cy.get('[data-testid="scent-note-filter"]').within(() => {
      cy.get('input[type="checkbox"]').first().check();
    });

    // 4. Verify filtered results
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    cy.get('[data-testid="intensity-badge"]').should('contain', 'MODERATE');
  });

  it('saves and applies user scent preferences', () => {
    // 1. Login as test user
    cy.login('testuser@example.com', 'password123');

    // 2. Navigate to preferences
    cy.visit('/account/preferences');

    // 3. Set scent preferences
    cy.get('[data-testid="scent-preferences-form"]').within(() => {
      // Select favorite notes
      cy.get('[data-testid="favorite-notes"]').within(() => {
        cy.get('input[value="Lavender"]').check();
        cy.get('input[value="Vanilla"]').check();
      });

      // Select preferred intensity
      cy.get('[data-testid="preferred-intensity"]').select(['LIGHT', 'MODERATE']);

      // Select seasonal preferences
      cy.get('[data-testid="seasonal-preferences"]').within(() => {
        cy.get('input[value="Spring"]').check();
        cy.get('input[value="Summer"]').check();
      });

      cy.get('button[type="submit"]').click();
    });

    // 4. Verify preferences are saved
    cy.get('[data-testid="preferences-saved"]').should('be.visible');

    // 5. Navigate to product listing
    cy.visit('/products');

    // 6. Verify personalized recommendations
    cy.get('[data-testid="personalized-recommendations"]').should('be.visible');
    cy.get('[data-testid="recommendation-card"]').should('have.length.at.least', 1);
  });

  it('handles scent profile interactions on mobile', () => {
    cy.viewport('iphone-x');

    // 1. Navigate to product details
    cy.visit('/products/1');

    // 2. Expand scent profile
    cy.get('[data-testid="scent-profile-toggle"]').click();

    // 3. Verify mobile layout
    cy.get('[data-testid="scent-profile"]').should('be.visible');
    cy.get('[data-testid="note-tooltip"]').should('not.be.visible');

    // 4. Test note tooltips
    cy.get('[data-testid="note-label"]').first().click();
    cy.get('[data-testid="note-tooltip"]').should('be.visible');

    // 5. Verify responsive recommendations
    cy.get('[data-testid="scent-recommendations"]').should('be.visible');
    cy.get('[data-testid="recommendation-card"]').should('have.length.at.least', 1);
  });

  it('tracks scent interaction analytics', () => {
    // Intercept analytics calls
    cy.intercept('POST', '/api/analytics', (req) => {
      req.reply({ success: true });
    }).as('analyticsCall');

    // 1. View product with scent profile
    cy.visit('/products/1');
    cy.wait('@analyticsCall').its('request.body').should('include', {
      event: 'view_scent_profile'
    });

    // 2. Interact with scent notes
    cy.get('[data-testid="note-label"]').first().click();
    cy.wait('@analyticsCall').its('request.body').should('include', {
      event: 'view_note_details'
    });

    // 3. Click recommendation
    cy.get('[data-testid="recommendation-card"]').first().click();
    cy.wait('@analyticsCall').its('request.body').should('include', {
      event: 'click_scent_recommendation'
    });
  });
});
