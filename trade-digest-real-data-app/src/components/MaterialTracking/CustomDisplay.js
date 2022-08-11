import {
  Tab,
  Text,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";
import { CustomIcon } from "../Structure";

export const CustomTab = ({ text }) => {
  return (
    <Tab
      className="tab"
      color="#04203E"
      width="50%"
      fontWeight="700"
      borderRadius="inherit"
      _active={{
        backgroundColor: "white",
        borderRadius: "inherit",
      }}
      _selected={{
        backgroundColor: "white",
        borderRadius: "inherit",
      }}
    >
      {text}
    </Tab>
  );
};
const MTButton = ({ info, icon_type }) => {
  return (
    <>
      <div className="mt-button-wrapper">
        <CustomIcon type={icon_type} className="mt-button-icon" />
        <Text className="mt-button-type">{icon_type}</Text>
        <Text className="mt-button-info">{info}</Text>
        <AccordionIcon className="mt-button-dropdown" />
      </div>
    </>
  );
};
export const CustomMTAccordionButton = ({ date, info, icon_type }) => {
  return (
    <h2>
      <AccordionButton fontSize="14px">
        <MTButton date={date} info={info} icon_type={icon_type} />
      </AccordionButton>
    </h2>
  );
};
const MTPanel = ({ code, quantity, id, lots, isDelivered, date }) => {
  return (
    <>
      <div className="mt-panel-wrapper">
        <div className="mt-panel-names">
          <p>Tracking ID: </p>
          {isDelivered ? <p>Delivered On:</p> : <p>Est. Delivery Date:</p>}
          <p id="code">Item Code:</p>
          <p id="quantity">Qty: </p>
          <p>For Lot: </p>
        </div>
        <div className="mt-panel-info">
          <p>{id}</p>
          <p>{date}</p>
          <p>{code}</p>
          <p>{quantity}</p>
          <p>{lots}</p>
        </div>
      </div>
    </>
  );
};
export const CustomMTAccordionPanel = ({
  code,
  quantity,
  id,
  lots,
  isDelivered,
  date,
}) => {
  return (
    <AccordionPanel
      css={{
        margin: 0,
        padding: "5px 20px",
      }}
    >
      <MTPanel
        code={code}
        quantity={quantity}
        id={id}
        lots={lots}
        isDelivered={isDelivered}
        date={date}
      />
    </AccordionPanel>
  );
};
