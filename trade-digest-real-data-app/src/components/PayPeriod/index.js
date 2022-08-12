import { ReportHeader } from "../Structure";
import { Text, Accordion } from "@chakra-ui/react";
import { Recordables } from "./Recordables";
import { WorkOrderData } from "./WorkOrderData";
import { SOWWOApprovals } from "./SOWWOApprovals";

export const PayPeriod = ({ lots }) => {
  return (
    <>
      <ReportHeader text="Pay Period" />
      <Recordables />
      <Text className="subsection">This Pay Period Work Orders</Text>
      <Accordion allowMultiple className="wo-accordion overflow-wrapper">
        <WorkOrderData lots={lots} />
        <SOWWOApprovals />
      </Accordion>
    </>
  );
};
