import { useQuery } from "@apollo/client";
import { GET_WO, GET_PLAN_ELEVATION } from "./graphql";
import {
  AccordionItem,
  AccordionButton,
  Tag,
  Text,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { vendor_id } from "../../VendorLogic";

export const WorkOrderData = ({ lots }) => {
  const {
    loading: wo_loading,
    error: wo_error,
    data: wo_data,
  } = useQuery(GET_WO, {
    variables: { vendorId: vendor_id },
  });
  if (wo_loading) return <p>Loading...</p>;
  if (wo_error) return <p>{wo_error.message}</p>;
  return wo_data.kernel_work_order.map((wo_info) => {
    if (
      wo_info.work_order_items.length === 0 ||
      wo_info.work_order_items[0].development === null ||
      wo_info.work_order_items[0].development.name === null ||
      wo_info.work_order_items[0].house_order === null
    ) {
      return <></>;
    }
    var is_valid_loc = false;
    for (var i = 0; i < lots.length; i++) {
      if (
        lots[i].lot === wo_info.work_order_items[0].house_order.lot._code &&
        lots[i].dev === wo_info.work_order_items[0].development.name
      ) {
        is_valid_loc = true;
      }
    }
    if (!is_valid_loc) {
      return <></>;
    }
    return <WorkOrderHO wo_info={wo_info} />;
  });
};
const WorkOrderHO = ({ wo_info }) => {
  const {
    loading: ho_loading,
    error: ho_error,
    data: ho_data,
  } = useQuery(GET_PLAN_ELEVATION, {
    variables: { hoId: wo_info.work_order_items[0].house_order.id },
  });
  if (ho_loading) return <p>Loading...</p>;
  if (ho_error) return <p>{ho_error.message}</p>;
  return (
    <AccordionItem borderBottom="none">
      <h2>
        <AccordionButton fontSize="14px">
          <div className="wov-button-wrapper">
            <Tag
              className="wov-tag"
              borderRadius="none"
              bg="#F5F4FA"
              color="#27364F"
            >
              Open
            </Tag>
            <div className="wov-button-text-wrapper">
              <Text className="wov-button-id">KER:WO:{wo_info.id}</Text>
              <Text className="wov-button-loc">
                {wo_info.work_order_items[0].development.name} | Lot{" "}
                {wo_info.work_order_items[0].house_order.lot._code}
              </Text>
            </div>
          </div>
          <AccordionIcon />
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
            <p id="plan">
              {ho_data?.kernel_house_order_calculated[0]?.model_configuration
                ?.model?.name || "-"}
            </p>
            <p id="elevation">
              {ho_data?.kernel_house_order_calculated[0]
                ?.elevation_option_catalog?.name || "-"}
            </p>
            {wo_info.work_order_items.map((lineitem) => (
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
