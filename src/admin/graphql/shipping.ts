import { gql } from '@apollo/client';

export const GET_SHIPPING_SETTINGS = gql`
  query GetShippingSettings {
    shippingSettings {
      royalMail {
        enabled
        clientId
        clientSecret
        environment
        defaultService
        autoGenerateLabels
        autoCreateManifest
        defaultPackageTypes {
          small {
            length
            width
            height
            weight
          }
          medium {
            length
            width
            height
            weight
          }
          large {
            length
            width
            height
            weight
          }
        }
      }
      zones {
        id
        name
        countries
        regions
        postcodes
        methods {
          id
          name
          carrier
          cost
          conditions {
            type
            value
          }
        }
      }
      rules {
        id
        name
        priority
        conditions {
          type
          operator
          value
          zone
        }
        actions {
          type
          value
        }
        active
      }
    }
  }
`;

export const UPDATE_SHIPPING_SETTINGS = gql`
  mutation UpdateShippingSettings($input: ShippingSettingsInput!) {
    updateShippingSettings(input: $input) {
      royalMail {
        enabled
        clientId
        environment
        defaultService
        autoGenerateLabels
        autoCreateManifest
      }
    }
  }
`;

export const UPDATE_SHIPPING_ZONE = gql`
  mutation UpdateShippingZone($id: ID!, $input: ShippingZoneInput!) {
    updateShippingZone(id: $id, input: $input) {
      id
      name
      countries
      regions
      postcodes
      methods {
        id
        name
        carrier
        cost
        conditions {
          type
          value
        }
      }
    }
  }
`;

export const DELETE_SHIPPING_ZONE = gql`
  mutation DeleteShippingZone($id: ID!) {
    deleteShippingZone(id: $id) {
      id
    }
  }
`;

export const CREATE_SHIPPING_ZONE = gql`
  mutation CreateShippingZone($input: ShippingZoneInput!) {
    createShippingZone(input: $input) {
      id
      name
      countries
      regions
      postcodes
      methods {
        id
        name
        carrier
        cost
        conditions {
          type
          value
        }
      }
    }
  }
`;

export const UPDATE_SHIPPING_RULE = gql`
  mutation UpdateShippingRule($id: ID!, $input: ShippingRuleInput!) {
    updateShippingRule(id: $id, input: $input) {
      id
      name
      priority
      conditions {
        type
        operator
        value
        zone
      }
      actions {
        type
        value
      }
      active
    }
  }
`;

export const DELETE_SHIPPING_RULE = gql`
  mutation DeleteShippingRule($id: ID!) {
    deleteShippingRule(id: $id) {
      id
    }
  }
`;

export const CREATE_SHIPPING_RULE = gql`
  mutation CreateShippingRule($input: ShippingRuleInput!) {
    createShippingRule(input: $input) {
      id
      name
      priority
      conditions {
        type
        operator
        value
        zone
      }
      actions {
        type
        value
      }
      active
    }
  }
`;

export const UPDATE_LABEL_SETTINGS = gql`
  mutation UpdateLabelSettings($input: LabelSettingsInput!) {
    updateLabelSettings(input: $input) {
      paperSize
      labelFormat
      defaultService
      autoGenerate
      autoManifest
      manifestTime
      returnAddress {
        name
        company
        street
        city
        postcode
        country
        phone
      }
      customizations {
        logo
        qrCode
        orderNumber
        customMessage
      }
    }
  }
`;

export const CREATE_SHIPPING_LABEL = gql`
  mutation CreateShippingLabel($orderId: ID!) {
    createShippingLabel(orderId: $orderId) {
      success
      trackingNumber
      labelUrl
      estimatedDelivery {
        from
        to
      }
      cost {
        amount
        currency
      }
    }
  }
`;

export const GET_SHIPPING_RATES = gql`
  query GetShippingRates($input: ShippingRateInput!) {
    shippingRates(input: $input) {
      serviceCode
      serviceName
      cost {
        amount
        currency
      }
      estimatedDelivery {
        from
        to
      }
      features {
        tracked
        signature
        insurance
      }
    }
  }
`;

export const CREATE_BULK_SHIPPING_LABELS = gql`
  mutation CreateBulkShippingLabels($orderIds: [ID!]!) {
    createBulkShippingLabels(orderIds: $orderIds) {
      success
      labelUrl
      shipments {
        orderId
        trackingNumber
        status
        estimatedDelivery {
          from
          to
        }
      }
      errors {
        orderId
        message
      }
    }
  }
`;

export const GET_PENDING_SHIPMENTS = gql`
  query GetPendingShipments {
    pendingShipments {
      id
      orderNumber
      customerName
      shippingAddress {
        street
        city
        postcode
        country
      }
      items {
        id
        productName
        quantity
        weight
      }
      status
      createdAt
    }
  }
`;

export const DOWNLOAD_BULK_LABELS = gql`
  mutation DownloadBulkLabels($shipmentIds: [ID!]!) {
    downloadBulkLabels(shipmentIds: $shipmentIds) {
      success
      combinedLabelUrl
      individualLabels {
        shipmentId
        labelUrl
      }
    }
  }
`;

export const CREATE_BULK_MANIFEST = gql`
  mutation CreateBulkManifest($shipmentIds: [ID!]!) {
    createBulkManifest(shipmentIds: $shipmentIds) {
      success
      manifestUrl
      manifestNumber
      totalShipments
      manifestDate
      errors {
        shipmentId
        message
      }
    }
  }
`;

export const BULK_UPDATE_TRACKING = gql`
  mutation BulkUpdateTracking($shipmentIds: [ID!]!) {
    bulkUpdateTracking(shipmentIds: $shipmentIds) {
      success
      shipments {
        shipmentId
        trackingNumber
        status
        lastUpdate
        currentLocation
        events {
          timestamp
          status
          location
          description
        }
      }
      errors {
        shipmentId
        message
      }
    }
  }
`;

export const TRACK_SHIPMENT = gql`
  query TrackShipment($trackingNumber: String!) {
    trackShipment(trackingNumber: $trackingNumber) {
      trackingNumber
      status
      estimatedDelivery {
        from
        to
      }
      events {
        timestamp
        status
        location
        description
      }
    }
  }
`;
