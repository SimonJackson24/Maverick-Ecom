# Component Library Documentation

## Overview
This document provides documentation for all reusable components in the Wick and Wax Co frontend.

## Component Categories

### Layout Components
- `AdminLayout` - Base layout for admin pages
- `ShopLayout` - Base layout for shop pages
- `Container` - Responsive container component
- `Grid` - Flexible grid system

### Product Components
- `ProductCard` - Product display card
- `ProductGrid` - Grid of product cards
- `ProductDetails` - Detailed product view
- `ScentProfile` - Scent profile display
- `ScentRecommendations` - Scent-based recommendations

### Cart Components
- `CartSummary` - Cart summary sidebar
- `CartItem` - Individual cart item
- `ScentBasedUpsells` - Scent-based upsell suggestions
- `CheckoutFlow` - Multi-step checkout process

### User Components
- `UserProfile` - User profile display/edit
- `OrderHistory` - Order history display
- `WishlistManager` - Wishlist management
- `AddressBook` - Address management

### Form Components
- `TextInput` - Text input field
- `Select` - Dropdown select
- `Checkbox` - Checkbox input
- `RadioGroup` - Radio button group
- `Button` - Button component
- `Form` - Form wrapper

### Feedback Components
- `Toast` - Toast notifications
- `Modal` - Modal dialog
- `LoadingSpinner` - Loading indicator
- `ErrorBoundary` - Error handling

### Analytics Components
- `AnalyticsProvider` - Analytics context provider
- `EventTracker` - Event tracking wrapper

## Usage Guidelines

### Component Props
All components are built with TypeScript and include proper type definitions.

### Styling
Components use Tailwind CSS for styling. Custom styles should be added through the className prop.

### State Management
Components use Apollo Client for data management where applicable.

### Testing
All components include unit tests and storybook stories.

## Best Practices
1. Always use TypeScript props interface
2. Include proper error handling
3. Implement loading states
4. Follow accessibility guidelines
5. Include proper documentation
6. Add unit tests

## Examples
See the `examples` directory for component usage examples.
