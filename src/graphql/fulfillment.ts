import { gql } from '@apollo/client';

export const FULFILLMENT_ITEM_FRAGMENT = gql`
  fragment FulfillmentItemFields on FulfillmentItem {
    id
    orderId
    productId
    productName
    sku
    quantity
    pickedQuantity
    location
    notes
  }
`;

export const FULFILLMENT_FRAGMENT = gql`
  fragment FulfillmentFields on Fulfillment {
    id
    orderId
    status
    items {
      ...FulfillmentItemFields
    }
    pickedBy
    packedBy
    shippingLabel {
      provider
      trackingNumber
      url
      createdAt
    }
    notes
    createdAt
    updatedAt
  }
  ${FULFILLMENT_ITEM_FRAGMENT}
`;

export const PICK_LIST_FRAGMENT = gql`
  fragment PickListFields on PickList {
    id
    fulfillmentIds
    status
    assignedTo
    items {
      productId
      productName
      sku
      location
      totalQuantity
      pickedQuantity
    }
    createdAt
    completedAt
  }
`;

export const GET_FULFILLMENTS = gql`
  query GetFulfillments($status: [FulfillmentStatus!]) {
    fulfillments(status: $status) {
      ...FulfillmentFields
    }
  }
  ${FULFILLMENT_FRAGMENT}
`;

export const GET_FULFILLMENT = gql`
  query GetFulfillment($id: ID!) {
    fulfillment(id: $id) {
      ...FulfillmentFields
    }
  }
  ${FULFILLMENT_FRAGMENT}
`;

export const GET_PICK_LISTS = gql`
  query GetPickLists($status: [PickListStatus!]) {
    pickLists(status: $status) {
      ...PickListFields
    }
  }
  ${PICK_LIST_FRAGMENT}
`;

export const CREATE_PICK_LIST = gql`
  mutation CreatePickList($fulfillmentIds: [ID!]!) {
    createPickList(fulfillmentIds: $fulfillmentIds) {
      ...PickListFields
    }
  }
  ${PICK_LIST_FRAGMENT}
`;

export const UPDATE_FULFILLMENT_STATUS = gql`
  mutation UpdateFulfillmentStatus(
    $id: ID!
    $status: FulfillmentStatus!
    $notes: String
  ) {
    updateFulfillmentStatus(id: $id, status: $status, notes: $notes) {
      ...FulfillmentFields
    }
  }
  ${FULFILLMENT_FRAGMENT}
`;

export const UPDATE_PICK_LIST = gql`
  mutation UpdatePickList(
    $id: ID!
    $items: [UpdatePickListItemInput!]!
  ) {
    updatePickList(id: $id, items: $items) {
      ...PickListFields
    }
  }
  ${PICK_LIST_FRAGMENT}
`;

export const COMPLETE_PICK_LIST = gql`
  mutation CompletePickList($id: ID!) {
    completePickList(id: $id) {
      ...PickListFields
    }
  }
  ${PICK_LIST_FRAGMENT}
`;

export const GENERATE_PACKING_SLIP = gql`
  mutation GeneratePackingSlip($fulfillmentId: ID!) {
    generatePackingSlip(fulfillmentId: $fulfillmentId) {
      id
      fulfillmentId
      orderNumber
      customerName
      shippingAddress {
        line1
        line2
        city
        state
        postalCode
        country
      }
      items {
        productName
        sku
        quantity
      }
      specialInstructions
      createdAt
    }
  }
`;

export const FULFILLMENT_UPDATED_SUBSCRIPTION = gql`
  subscription OnFulfillmentUpdated {
    fulfillmentUpdated {
      ...FulfillmentFields
    }
  }
  ${FULFILLMENT_FRAGMENT}
`;

export const PICK_LIST_UPDATED_SUBSCRIPTION = gql`
  subscription OnPickListUpdated {
    pickListUpdated {
      ...PickListFields
    }
  }
  ${PICK_LIST_FRAGMENT}
`;
