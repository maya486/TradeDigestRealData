import { gql } from "@apollo/client";

export const GET_VENDOR = gql`
  query GetVendor($vendorId: Int!) {
    kernel_vendor(where: { id: { _eq: $vendorId } }) {
      name
    }
  }
`;
