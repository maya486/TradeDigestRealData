import { gql } from "@apollo/client";

export const GET_RECORDABLES = gql`
  query GetRecordables($vendorId: Int) {
    kernel_task_recordable(
      where: { task: { vendor_id: { _eq: $vendorId } }, status: { _eq: todo } }
    ) {
      task {
        title
        lot {
          _code
          development {
            id
            name
            name_slug
          }
        }
      }
      status
      transcript
      s3_document {
        object_url
        id
      }
      id
      original_transcript
    }
  }
`;
export const GET_WO = gql`
  query GetWO($vendorId: Int) {
    kernel_work_order(where: { vendor_id: { _eq: $vendorId } }) {
      id
      vendor_id
      work_order_items(where: { amount: { _gt: "0" } }) {
        amount
        cost_type {
          name
          cost_category {
            name
          }
        }
        development {
          id
          name
        }
        house_order {
          id
          lot {
            _code
          }
        }
      }
    }
  }
`;
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
export const GET_WO_APPROVAL_ID = gql`
  query GetWOApprovalId(
    $vendorId: Int!
    $dateStart: timestamp
    $dateEnd: timestamp
  ) {
    kernel_work_order_approval(
      where: {
        timestamp: { _gte: $dateStart, _lte: $dateEnd }
        work_order: { vendor_id: { _eq: $vendorId } }
      }
      distinct_on: work_order_id
    ) {
      id
      work_order_id
      work_order {
        id
        work_order_items {
          amount
          cost_type {
            name
            cost_category {
              name
            }
          }
          development {
            id
            name
          }
          house_order {
            id
            lot {
              _code
            }
          }
        }
      }
    }
  }
`;
