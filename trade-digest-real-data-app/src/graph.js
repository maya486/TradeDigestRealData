import { useQuery, gql } from "@apollo/client";
import "./App.css";
import { BiGift } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import { TbCircleCheck } from "react-icons/tb";
import { toDate, parseISO, format } from "date-fns";
import {
  Text,
  ChakraProvider,
  Box,
  CircularProgress,
  LinkBox,
  LinkOverlay,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Icon,
  Stack,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
// import "react-dates/initialize";
// import {
//   DateRangePicker,
//   SingleDatePicker,
//   DayPickerRangeController,
// } from "react-dates";

const GET_DEVELOPMENT = gql`
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
const GET_START_LETTER = gql`
  query GetStartLetter($development_id: Int) {
    kernel_delivery_document(
      distinct_on: lot_id
      order_by: { lot_id: asc, version: desc_nulls_last }
      where: {
        delivery_document_type_id: { _eq: 1 }
        development_id: { _eq: $development_id }
      }
    ) {
      filename
      s3_document_id
      version
      development_id
      lot {
        _code
        id
      }
      development {
        name
      }
      lot_id
      updated_at
    }
  }
`;
// const GET_START_LETTER = gql`
//   query GetStartLetter($development_id: Int) {
//     kernel_delivery_document(
//       where: { development_id: { _eq: $development_id } }
//     ) {
//       development_id
//       filename
//     }
//   }
// `;

const GET_START_LETTER_URL = gql`
  query GetStartLetterUrl($url_id: Int!) {
    s3_document_download_url(id: $url_id) {
      download_url
    }
  }
`;
const vendor_id = 375;
export const StartLetterData = () => {
  const {
    loading: dev_loading,
    error: dev_error,
    data: dev_data,
  } = useQuery(GET_DEVELOPMENT, {
    variables: { vendor_id },
  });
  if (dev_loading) return <p>Loading...</p>;
  if (dev_error) return <p>Error 0</p>;
  return dev_data.kernel_development_vendor_selection.map((dev_info) => (
    <StartLetterDev dev_info={dev_info} />
  ));
};
const StartLetterDev = ({ dev_info }) => {
  const {
    loading: sl_loading,
    error: sl_error,
    data: sl_data,
  } = useQuery(GET_START_LETTER, {
    variables: dev_info.development_id,
  });
  if (sl_loading) return <p>Loading...</p>;
  if (sl_error) return <p>Error 1 {dev_info.development_id}</p>;
  return sl_data.kernel_delivery_document.map((sl_info) => (
    <StartLetterSL
      sl_info={sl_info}
      lot_code={sl_info?.lot?._code}
      updated_at={sl_info.updated_at}
      dev_name={dev_info.development.name}
    />
  ));
};
const StartLetterSL = ({ sl_info, lot_code, updated_at, dev_name }) => {
  const {
    loading: url_loading,
    error: url_error,
    data: url_data,
  } = useQuery(GET_START_LETTER_URL, {
    variables: { url_id: sl_info.s3_document_id },
  });
  if (url_loading) return <p>Loading...</p>;
  if (url_error) return <p>Error 2</p>;
  const converted_updated_at = format(
    toDate(parseISO(updated_at)),
    "MM/dd/yyyy"
  );
  console.log(converted_updated_at);
  return (
    <div className="start-letter-wrapper">
      <Text id="start-letter-loc">
        {dev_name} | Lot {lot_code}
      </Text>
      <Text id="start-letter-date">Last Updated: {converted_updated_at}</Text>
      <LinkBox className="punch-item-link">
        <LinkOverlay href={url_data.s3_document_download_url.download_url} />
        <Icon as={FiExternalLink} w="17px" h="17px" />
      </LinkBox>
    </div>
  );
};

// function DisplayLocations({ vid }) {
//   const {
//     loading: url_loading,
//     error: url_error,
//     data: url_data,
//   } = useQuery(GET_START_LETTER_URL, { variables: { url_id: 2063 } });
//   if (url_loading) return <p>Loading...</p>;
//   if (url_error) return <p>Error 1 test</p>;
//   return (
//     <div className="start-letter-wrapper">
//       <p>{url_data.s3_document_download_url.download_url}</p>
//       {/* <Text id="start-letter-loc">
//         {dev_name}|{lot_code}
//       </Text>
//       <Text id="start-letter-date">Last Updated: {updated_at}</Text>
//       <LinkBox className="punch-item-link">
//         <LinkOverlay href={url_data.s3_document_download_url.download_url} />
//         <Icon as={FiExternalLink} w="17px" h="17px" />
//       </LinkBox> */}
//     </div>
//   );
//   return url_data.s3_document_download_url.map((url_info) => (
//     <div className="start-letter-wrapper">
//       <Text id="start-letter-loc">
//         {dev_name}|{lot_code}
//       </Text>
//       <Text id="start-letter-date">Last Updated: {updated_at}</Text>
//       <LinkBox className="punch-item-link">
//         <LinkOverlay href={url_info.download_url} />
//         <Icon as={FiExternalLink} w="17px" h="17px" />
//       </LinkBox>
//     </div>
//   ));
// }

// export default function GraphApp() {
//   return (
//     <div>
//       <h2>My first Apollo app 🚀</h2>
//       <br />
//       {/* <DisplayLocations /> */}
//       <StartLetter />
//     </div>
//   );
// }

// vendor_id --> development_id  && {development_name}
// query MyQuery {
//     kernel_development_vendor_selection(where: {vendor_id: {_eq: 54}}) {
//       id
//       development_id
//       vendor_id
//       development {
//         name
//       }
//       vendor {
//         name
//       }
//     }
//   }

// development_id --> s3_document_id for latest start letters for every lot in development && {lot_code} && {updated_at}
// query MyQuery {
//     kernel_delivery_document(distinct_on: lot_id, order_by: {lot_id: asc, version: desc_nulls_last}, where: {delivery_document_type_id: {_eq: 1}, development_id: {_eq: 35}}) {
//       filename
//       s3_document_id
//       version
//       development_id
//       lot {
//         _code
//         id
//       }
//       development {
//         name
//       }
//       lot_id
//       updated_at
//     }
//   }

// s3_document_id --> {download_url}
// query MyQuery {
//     s3_document_download_url(id: 2063) {
//       download_url
//     }
//   }
