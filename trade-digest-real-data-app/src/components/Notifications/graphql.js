import { gql } from "@apollo/client";
export const GET_DEVELOPMENT = gql`
  query GetDevelopment($vendor_id: Int!) {
    kernel_development_vendor_selection(
      where: { vendor_id: { _eq: $vendor_id } }
    ) {
      id
      development_id
      vendor_id
      development {
        name
      }
      vendor {
        name
      }
    }
  }
`;
export const GET_WO_UPDATES = gql`
  query GetWOUpdates($date: timestamp!, $vendorId: Int) {
    kernel_work_order(
      where: { updated_at: { _gte: $date }, vendor_id: { _eq: $vendorId } }
    ) {
      id
      notes
      updated_at
      work_order_items {
        amount
        development {
          name
        }
        house_order {
          lot {
            _code
          }
        }
      }
    }
  }
`;
export const GET_WO_APPROVALS = gql`
  query GetWOApprovals($date: timestamp!, $vendorId: Int) {
    kernel_work_order_approval(
      where: {
        work_order: { vendor_id: { _eq: $vendorId } }
        timestamp: { _gte: $date }
      }
      order_by: { work_order_id: asc, timestamp: desc_nulls_last }
      distinct_on: work_order_id
    ) {
      approved_by_user {
        first_name
        last_name
      }
      work_order {
        id
        work_order_items {
          development {
            name
          }
          house_order {
            lot {
              _code
            }
          }
        }
      }
      updated_at
      timestamp
    }
  }
`;
export const GET_DOC_DATA = gql`
  query GetDevelopment($date: timestamp!, $vendorId: Int!) {
    kernel_development_vendor_selection(
      where: { vendor_id: { _eq: $vendorId } }
    ) {
      id
      development_id
      vendor_id
      development {
        name
        delivery_documents(
          where: {
            is_latest_version: { _eq: true }
            updated_at: { _gte: $date }
          }
        ) {
          filename
          version
          id
          updated_at
          lot {
            _code
          }
        }
      }
      vendor {
        name
      }
    }
  }
`;
