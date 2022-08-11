import { useQuery } from "@apollo/client";
import { useDates } from "../../hooks/useDates";
import { GET_WO_APPROVAL_ID, GET_PLAN_ELEVATION } from "./graphql";
import { format } from "date-fns";
import {
  AccordionItem,
  AccordionButton,
  Tag,
  Text,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { vendor_id } from "../../VendorLogic";

export const SOWWOApprovals = () => {
  const { start_pay_period, end_pay_period } = useDates();
  const { loading, error, data } = useQuery(GET_WO_APPROVAL_ID, {
    variables: {
      vendorId: vendor_id,
      dateStart: format(start_pay_period, "yyyy-MM-dd"),
      dateEnd: format(end_pay_period, "yyyy-MM-dd"),
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return data.kernel_work_order_approval.map((info) => {
    if (
      info.work_order.work_order_items.length === 0 ||
      info.work_order.work_order_items[0].development === null ||
      info.work_order.work_order_items[0].development.name === null ||
      info.work_order.work_order_items[0].house_order === null
    ) {
      return <></>;
    }
    return <SOWWOPlanElevation key={info.id} info={info} />;
  });
};
const SOWWOPlanElevation = ({ info }) => {
  const { loading, error, data } = useQuery(GET_PLAN_ELEVATION, {
    variables: { hoId: info.work_order.work_order_items[0].house_order.id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return (
    <AccordionItem borderBottom="none">
      <h2>
        <AccordionButton fontSize="14px">
          <div className="wov-button-wrapper">
            <Tag
              className="wov-tag"
              borderRadius="none"
              bg="#DFF1EC"
              color="#2E5045"
            >
              Done
            </Tag>
            <div className="wov-button-text-wrapper">
              <Text className="wov-button-id">KER:WO:{info.work_order.id}</Text>
              <Text className="wov-button-loc">
                {info.work_order.work_order_items[0].development.name} | Lot{" "}
                {info.work_order.work_order_items[0].house_order.lot._code}
              </Text>
            </div>
            <AccordionIcon />
          </div>
        </AccordionButton>
      </h2>
      <AccordionPanel
        css={{
          margin: 0,
          padding: "5px 20px",
        }}
      >
        <div className="wov-panel-wrapper">
          <div className="wov-panel-names">
            <p>Plan:</p>
            <p>Elevation:</p>
            <p>Item:</p>
          </div>
          <div className="wov-panel-info">
            <p className="plan">
              {data?.kernel_house_order_calculated[0]?.model_configuration
                ?.model?.name || "-"}
            </p>
            <p className="elevation">
              {data?.kernel_house_order_calculated[0]?.elevation_option_catalog
                ?.name || "-"}
            </p>
            {info.work_order.work_order_items.map((lineitem) => (
              <p className="lineitem" key={lineitem}>
                {lineitem.cost_type.cost_category.name} -{" "}
                {lineitem.cost_type.name}
              </p>
            ))}
          </div>
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
};
