import { useQuery } from "@apollo/client";
import {
  GET_DEVELOPMENT,
  GET_PLAN_ELEVATION,
  GET_START_LETTER,
  GET_START_LETTER_URL,
} from "./graphql";
import { format, toDate, parseISO } from "date-fns";
import { FiExternalLink } from "react-icons/fi";
import { LinkBox, LinkOverlay, Text, Icon } from "@chakra-ui/react";
import { vendor_id } from "../../VendorLogic";

export const StartLetterData = ({ lots }) => {
  const {
    loading: dev_loading,
    error: dev_error,
    data: dev_data,
  } = useQuery(GET_DEVELOPMENT, {
    variables: { vendorId: vendor_id },
  });
  if (dev_loading) return <p>Loading...</p>;
  if (dev_error) return <p>{dev_error.message}</p>;
  return dev_data.kernel_development_vendor_selection.map((dev_info) => (
    <StartLetterDev key={dev_info.id} dev_info={dev_info} lots={lots} />
  ));
};
const StartLetterDev = ({ dev_info, lots }) => {
  const {
    loading: sl_loading,
    error: sl_error,
    data: sl_data,
  } = useQuery(GET_START_LETTER, {
    variables: dev_info.development_id,
  });
  if (sl_loading) return <p>Loading...</p>;
  if (sl_error) return <p>Error 1 {dev_info.development_id}</p>;

  return sl_data.kernel_delivery_document.map((sl_info) => {
    if (
      sl_info?.lot?._code === null ||
      dev_info.development.name === null ||
      sl_info.lot.house_orders.id === null
    ) {
      return <></>;
    }
    var is_valid_loc = false;
    for (var i = 0; i < lots.length; i++) {
      if (
        lots[i].lot === sl_info.lot._code &&
        lots[i].dev === dev_info.development.name
      ) {
        is_valid_loc = true;
      }
    }
    if (!is_valid_loc) {
      return null;
    }
    return (
      <StartLetterSL
        key={sl_info.id}
        sl_info={sl_info}
        lot_code={sl_info?.lot?._code}
        updated_at={sl_info.updated_at}
        dev_name={dev_info.development.name}
        lots={lots}
        ho_id={sl_info.lot.house_orders.id}
      />
    );
  });
};
const StartLetterSL = ({
  sl_info,
  lot_code,
  updated_at,
  dev_name,
  lots,
  ho_id,
}) => {
  const { loading, error, data } = useQuery(GET_PLAN_ELEVATION, {
    variables: { hoId: ho_id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <StartLetterHO
      sl_info={sl_info}
      lot_code={lot_code}
      updated_at={updated_at}
      dev_name={dev_name}
      lots={lots}
      plan={
        data.kernel_house_order_calculated[0]?.model_configuration?.model
          ?.name || "-"
      }
      elevation={
        data.kernel_house_order_calculated[0]?.elevation_option_catalog?.name ||
        "-"
      }
    />
  );
};
const StartLetterHO = ({
  sl_info,
  lot_code,
  updated_at,
  dev_name,
  lots,
  plan,
  elevation,
}) => {
  const {
    loading: url_loading,
    error: url_error,
    data: url_data,
  } = useQuery(GET_START_LETTER_URL, {
    variables: { url_id: sl_info.s3_document_id },
  });
  if (url_loading) return <p>Loading...</p>;
  if (url_error) return <p>Error 2 {url_error.message}</p>;
  const converted_updated_at = format(
    toDate(parseISO(updated_at)),
    "MM/dd/yyyy"
  );

  return (
    <div className="start-letter-wrapper">
      <div className="start-letter-text">
        <Text className="start-letter-loc">
          {dev_name} | Lot {lot_code}
        </Text>
        <Text className="start-letter-plan-elevation">
          Plan: {plan} | Elevation: {elevation}
        </Text>
        <Text className="start-letter-date">
          Last Updated: {converted_updated_at}
        </Text>
      </div>
      <LinkBox className="start-letter-link">
        <LinkOverlay
          href={url_data.s3_document_download_url.download_url}
          target="_blank"
        />
        <Icon as={FiExternalLink} w="17px" h="17px" />
      </LinkBox>
    </div>
  );
};
