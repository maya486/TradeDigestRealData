import { TbCircleCheck } from "react-icons/tb";
import { IoWarning } from "react-icons/io5";
import {
  BsFillCheckCircleFill,
  BsExclamationCircle,
  BsThreeDots,
} from "react-icons/bs";
import { RiTruckLine } from "react-icons/ri";
import { Icon } from "@chakra-ui/react";
import { IoInformationCircleSharp } from "react-icons/io5";

export const CustomDivider = () => {
  return <div className="divider" />;
};
export const Subdivider = () => {
  return <div className="subdivider" />;
};
export const CustomIcon = ({ type }) => {
  // eslint-disable-next-line default-case
  switch (type) {
    case "warning":
      return <Icon as={IoWarning} w="18px" h="18px" color="#FBA01C" />;
    case "success":
      return (
        <Icon as={BsFillCheckCircleFill} w="16px" h="16px" color="#31A881" />
      );
    case "info":
      return (
        <Icon as={IoInformationCircleSharp} w="16px" h="16px" color="#747F8F" />
      );
    case "Delivered":
      return <Icon as={TbCircleCheck} w="16px" h="16px" color="#3E4C63" />;
    case "Delayed":
      return (
        <Icon as={BsExclamationCircle} w="16px" h="16px" color="#3E4C63" />
      );
    case "Order Placed":
      return <Icon as={BsThreeDots} w="16px" h="16px" color="#3E4C63" />;
    case "On The Way":
      return <Icon as={RiTruckLine} w="16px" h="16px" color="#3E4C63" />;
  }
  return <Icon as={TbCircleCheck} w="16px" h="16px" color="black" />;
};
const BigDivider = () => {
  return <div className="bigdivider" />;
};
export const ReportHeader = ({ text }) => {
  return (
    <div className="report-header">
      <BigDivider />
      <p className="report-header-title">{text}</p>
    </div>
  );
};
