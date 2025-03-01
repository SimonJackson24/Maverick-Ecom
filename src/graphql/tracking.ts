import { gql } from '@apollo/client';

export const GET_SHIPMENT_TRACKING = gql`
  query GetShipmentTracking($trackingNumber: String!) {
    shipmentTracking(trackingNumber: $trackingNumber) {
      consignmentNumber
      status
      estimatedDelivery
      events {
        eventDateTime
        eventDescription
        location
        status
      }
    }
  }
`;
