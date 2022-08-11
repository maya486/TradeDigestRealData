import { gql } from "@apollo/client";

export const GET_PLAN_ELEVATION = gql`
  query MyQuery($hoId: Int) {
    kernel_house_order_calculated(where: { id: { _eq: $hoId } }) {
      id
      _code
      elevation_option_catalog {
        id
        name
      }
      model_configuration_id
      model_configuration {
        model {
          name
        }
      }
    }
  }
`;
export const GET_DEVELOPMENT = gql`
  query GetDevelopment($vendorId: Int!) {
    kernel_development_vendor_selection(
      where: { vendor_id: { _eq: $vendorId } }
    ) {
      id
      development_id
      vendor_id
      development {
        id
        name
      }
      vendor {
        name
      }
    }
  }
`;
export const GET_START_LETTER = gql`
  query GetStartLetter($development_id: Int) {
    kernel_delivery_document(
      distinct_on: lot_id
      order_by: { lot_id: asc, version: desc_nulls_last }
      where: {
        delivery_document_type_id: { _eq: 1 }
        development_id: { _eq: $development_id }
      }
    ) {
      id
      filename
      s3_document_id
      version
      development_id
      lot {
        _code
        id
        house_orders {
          id
        }
      }
      development {
        id
        name
      }
      lot_id
      updated_at
    }
  }
`;
export const GET_START_LETTER_URL = gql`
  query GetStartLetterUrl($url_id: Int!) {
    s3_document_download_url(id: $url_id) {
      download_url
    }
  }
`;
