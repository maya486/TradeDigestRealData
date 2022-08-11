import { GET_VENDOR } from "./graphql";
import { useQuery } from "@apollo/client";
import { CustomDivider } from "../Structure";
import { vendor_id } from "../../VendorLogic";
import { useEffect } from "react";

export const VendorInfo = ({ setName }) => {
  const { data } = useQuery(GET_VENDOR, {
    variables: { vendorId: vendor_id },
  });
  const name = data?.kernel_vendor[0].name || "";
  useEffect(() => {
    setName(name);
  }, [setName, name]);
  return (
    <>
      <CustomDivider />
      <p id="greeting">Hello, {name}!</p>
    </>
  );
};
