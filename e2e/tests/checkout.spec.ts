describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('should complete guest checkout successfully', () => {
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().click()
    cy.get('[data-testid="add-to-cart"]').click()
    cy.get('[data-testid="cart-count"]').should('have.text', '1')

    // Start checkout
    cy.get('[data-testid="checkout-button"]').click()

    // Fill guest email
    cy.get('[data-testid="guest-email"]').type('test@example.com')
    cy.get('[data-testid="continue-button"]').click()

    // Fill shipping address
    cy.get('[data-testid="shipping-first-name"]').type('John')
    cy.get('[data-testid="shipping-last-name"]').type('Doe')
    cy.get('[data-testid="shipping-address1"]').type('123 Test St')
    cy.get('[data-testid="shipping-city"]').type('Test City')
    cy.get('[data-testid="shipping-state"]').select('CA')
    cy.get('[data-testid="shipping-zip"]').type('12345')
    cy.get('[data-testid="continue-button"]').click()

    // Select shipping method
    cy.get('[data-testid="shipping-method-standard"]').click()
    cy.get('[data-testid="continue-button"]').click()

    // Fill payment details
    cy.get('[data-testid="card-number"]').type('4242424242424242')
    cy.get('[data-testid="card-expiry"]').type('1230')
    cy.get('[data-testid="card-cvc"]').type('123')
    cy.get('[data-testid="continue-button"]').click()

    // Verify order confirmation
    cy.url().should('include', '/order-confirmation')
    cy.get('[data-testid="order-number"]').should('exist')
  })

  it('should show scent-based recommendations during checkout', () => {
    // Add scented product to cart
    cy.get('[data-testid="product-card"]').first().click()
    cy.get('[data-testid="add-to-cart"]').click()

    // Start checkout
    cy.get('[data-testid="checkout-button"]').click()

    // Verify scent-based recommendations
    cy.get('[data-testid="scent-recommendations"]').should('exist')
    cy.get('[data-testid="recommendation-card"]').should('have.length.at.least', 1)
  })

  it('should handle payment errors gracefully', () => {
    // Add product to cart and start checkout
    cy.get('[data-testid="product-card"]').first().click()
    cy.get('[data-testid="add-to-cart"]').click()
    cy.get('[data-testid="checkout-button"]').click()

    // Complete checkout until payment
    cy.get('[data-testid="guest-email"]').type('test@example.com')
    cy.get('[data-testid="continue-button"]').click()

    // Use declined card
    cy.get('[data-testid="card-number"]').type('4000000000000002')
    cy.get('[data-testid="card-expiry"]').type('1230')
    cy.get('[data-testid="card-cvc"]').type('123')
    cy.get('[data-testid="continue-button"]').click()

    // Verify error message
    cy.get('[data-testid="payment-error"]').should('be.visible')
  })
})
