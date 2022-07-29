import { useQuery, gql } from "@apollo/client";
import "./App.css";
import React, { useState } from "react";
import { BiGift } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import { TbCircleCheck } from "react-icons/tb";
import { toDate, parseISO, format } from "date-fns";
import { CustomIcon, CustomDivider } from "./App.js";

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
  background,
} from "@chakra-ui/react";
import { CheckIcon, InfoIcon } from "@chakra-ui/icons";
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
const GET_DOC_UPDATES = gql`
  query GetDocUpdates($date: timestamp!, $developmentId: Int) {
    kernel_delivery_document(
      where: {
        updated_at: { _gte: $date }
        is_latest_version: { _eq: true }
        development_id: { _eq: $developmentId }
      }
      limit: 3
    ) {
      filename
      version
      updated_at
      lot {
        development {
          name
          id
        }
        id
        code: _code
      }
      id
    }
  }
`;

const vendor_id = 12417;
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
    <StartLetterDev key={dev_info.id} dev_info={dev_info} />
  ));
};
export const DocData = () => {
  const {
    loading: dev_loading,
    error: dev_error,
    data: dev_data,
  } = useQuery(GET_DEVELOPMENT, {
    variables: { vendor_id },
  });
  if (dev_loading) return <p>Loading...</p>;
  if (dev_error) return <p>{dev_error.message}</p>;
  // console.log("docData");
  // console.log(dev_data.kernel_development_vendor_selection.length);
  return dev_data.kernel_development_vendor_selection.map((dev_info) => (
    <DocDev key={dev_info.id} dev_info={dev_info} />
  ));
};
const DocDev = ({ dev_info }) => {
  const {
    loading: doc_loading,
    error: doc_error,
    data: doc_data,
  } = useQuery(GET_DOC_UPDATES, {
    variables: { date: "2022-07-27", devlopmentId: dev_info.development_id },
  });
  if (doc_loading) return <p>Loading...</p>;
  if (doc_error) return <p>{doc_error.message}</p>;
  console.log("docDev");
  console.log(doc_data);
  console.log(dev_info.development_id);
  return doc_data.kernel_delivery_document.map((doc_info) => {
    if (
      doc_info.lot === null ||
      doc_info.id === null ||
      doc_info.lot.code === null ||
      doc_info.lot.development.name === null ||
      doc_info.filename === null
    ) {
      return <></>;
    }
    return (
      <>
        <CustomDivider />
        <div className="notif-item">
          <CustomIcon type="warning" />
          <div className="notif-item-text">
            <p className="notif-name">Document has been updated</p>
            <p className="notif-id">ID:{doc_info.id}</p>
            <p className="notif-loc">
              {doc_info.lot.development.name} | {doc_info.lot.code}
            </p>
            <p className="notif-details">{doc_info.filename}</p>
          </div>
          <p className="notif-time">time</p>
        </div>
      </>
    );
  });
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
    // variables: { url_id: 224 },
  });
  if (url_loading) return <p>Loading...</p>;
  if (url_error) return <p>Error 2 {url_error.message}</p>;
  const converted_updated_at = format(
    toDate(parseISO(updated_at)),
    "MM/dd/yyyy"
  );
  // console.log(converted_updated_at);
  return (
    <div className="start-letter-wrapper">
      <Text id="start-letter-loc">
        {dev_name} | Lot {lot_code}
      </Text>
      <Text id="start-letter-date">Last Updated: {converted_updated_at}</Text>
      <LinkBox className="start-letter-link">
        <LinkOverlay href={url_data.s3_document_download_url.download_url} />
        <Icon as={FiExternalLink} w="17px" h="17px" />
      </LinkBox>
    </div>
  );
};
const GET_WO_APPROVALS = gql`
  query GetWOApprovals($vendorId: Int, $date: timestamp!) {
    kernel_work_order_approval(
      where: {
        work_order: {
          vendor_id: { _eq: $vendorId }
          updated_at: { _gte: $date }
        }
      }
    ) {
      approved_by_user {
        first_name
        last_name
      }
      work_order {
        id
        activity {
          fs: field_schedule {
            ho: house_order {
              lot {
                code: _code
                development {
                  name
                }
              }
            }
          }
        }
      }
      updated_at
    }
  }
`;
export const WorkOrderApprovals = () => {
  const {
    loading: woa_loading,
    error: woa_error,
    data: woa_data,
  } = useQuery(GET_WO_APPROVALS, {
    variables: { date: "2022-01-25", vendorId: vendor_id },
  });
  if (woa_loading) return <p>Loading...</p>;
  if (woa_error) return <p>{woa_error.message}</p>;
  return (
    <>
      {woa_data.kernel_work_order_approval.map((woa_info) => {
        if (
          woa_info.work_order === null ||
          // woa_info.work_order.work_order_items.length === 0
          woa_info.work_order.activity === null ||
          woa_info.work_order.activity.fs === null ||
          woa_info.work_order.activity.fs.ho === null ||
          woa_info.work_order.activity.fs.ho.lot === null ||
          woa_info.work_order.activity.fs.ho.lot.development === null ||
          woa_info.work_order.activity.fs.ho.lot.development.name === null
        ) {
          return <></>;
        }
        return (
          <>
            <CustomDivider />
            <div className="notif-item">
              <CustomIcon type="success" />
              <div className="notif-item-text">
                <p className="notif-name">Work order has been approved</p>
                <p className="notif-id">KER:{woa_info.work_order.id}</p>
                <p className="notif-loc">
                  {woa_info.work_order.activity.fs.ho.lot.development.name} |{" "}
                  {woa_info.work_order.activity.fs.ho.lot.code}
                </p>
                {woa_data.approved_by_user != null && (
                  <p className="notif-details">
                    Approved by: {woa_info.approved_by_user.first_name}{" "}
                    {woa_info.approved_by_user.last_name}
                  </p>
                )}
              </div>
              <p className="notif-time">time</p>
            </div>
          </>
        );
      })}
    </>
  );
};
const GET_WO_UPDATES = gql`
  query GetWOUpdates($vendorId: Int, $date: timestamp!) {
    kernel_work_order(
      where: { updated_at: { _gte: $date }, vendor_id: { _eq: $vendorId } }
      limit: 5
    ) {
      id
      notes
      updated_at
      activity {
        s: _source_id
        fs: field_schedule {
          ho: house_order {
            lot {
              code: _code
              development {
                name
              }
            }
          }
        }
      }
    }
  }
`;
export const WorkOrderUpdates = () => {
  const {
    loading: wou_loading,
    error: wou_error,
    data: wou_data,
  } = useQuery(GET_WO_UPDATES, {
    variables: { date: "2022-06-25", vendorId: vendor_id },
  });
  if (wou_loading) return <p>Loading...</p>;
  if (wou_error) return <p>{wou_error.message}</p>;
  return (
    <>
      {wou_data.kernel_work_order.map((wou_info) => {
        if (
          wou_info.activity === null ||
          wou_info.activity.fs === null ||
          wou_info.activity.fs.ho === null ||
          wou_info.activity.fs.ho.lot === null
        ) {
          return <></>;
        }
        // incNum();
        return (
          <>
            <CustomDivider />
            <div className="notif-item">
              <CustomIcon type="warning" />
              <div className="notif-item-text">
                <p className="notif-name">Work order has been updated</p>
                <p className="notif-id">KER:{wou_info.id}</p>
                <p className="notif-loc">
                  {wou_info.activity.fs.ho.lot.development.name} |{" "}
                  {wou_info.activity.fs.ho.lot.code}
                </p>
                <p className="notif-details">{wou_info.notes}</p>
              </div>
              <p className="notif-time">time</p>
            </div>
          </>
        );
      })}
    </>
  );
};
export const Notifs = () => {
  return (
    <div className="notifs">
      <WorkOrderUpdates />
      <WorkOrderApprovals />
      <DocData />
    </div>
  );
};

const GET_WO = gql`
  query GetWO($vendorId: Int) {
    kernel_work_order(
      where: {
        _or: [
          {
            activity: {
              status: { _eq: Scheduled }
              _and: { planned_start: { _lte: "2022-08-3", _gte: "2022-07-27" } }
            }
          }
          { activity: { status: { _eq: Started } } }
        ]
        vendor_id: { _eq: $vendorId }
      }
    ) {
      id
      vendor_id
      activity {
        fs: field_schedule {
          ho: house_order {
            lot {
              code: _code
              development {
                name
              }
            }
            model_configuration_id
            model_configuration {
              model {
                name
              }
            }
            id
          }
        }
        planned_duration
        planned_end
        planned_start
        status
      }
      work_order_items(where: { amount: { _gt: "0" } }) {
        amount
        cost_type {
          name
          cost_category {
            name
          }
        }
      }
    }
  }
`;
const GET_PLAN_ELEVATION = gql`
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
export const WorkOrderData = () => {
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
      wo_info.activity === null ||
      wo_info.activity.fs === null ||
      wo_info.activity.fs.ho === null ||
      wo_info.activity.fs.ho.lot === null ||
      wo_info.work_order_items.length === 0
    ) {
      return <></>;
    }
    return <WorkOrderHO wo_info={wo_info} />;
  });
};
const WorkOrderHO = ({ wo_info }) => {
  // console.log(wo_info.activity.fs.ho.id);
  const {
    loading: ho_loading,
    error: ho_error,
    data: ho_data,
  } = useQuery(GET_PLAN_ELEVATION, {
    variables: { hoId: wo_info.activity.fs.ho.id },
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
                {wo_info.activity.fs.ho.lot.development.name} | Lot{" "}
                {wo_info.activity.fs.ho.lot.code}
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
            {/* <p>test{ho_data.kernel_house_order_calculated[0].id}test</p> */}
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
const GET_SCHEDULE = gql`
  query GetSchedule($vendorId: Int!, $dateStart: date, $dateEnd: date) {
    kernel_work_order(
      where: {
        activity: { planned_start: { _gte: $dateStart, _lte: $dateEnd } }
        vendor_id: { _eq: $vendorId }
      }
      order_by: { activity: { planned_start: asc } }
    ) {
      id
      vendor_id
      activity {
        fs: field_schedule {
          ho: house_order {
            lot {
              code: _code
              development {
                name
              }
            }
            id
          }
        }
        planned_duration
        planned_end
        planned_start
        status
      }
      work_order_items(where: { amount: { _gt: "0" } }) {
        amount
        cost_type {
          name
          cost_category {
            name
          }
        }
      }
      type
      notes
    }
  }
`;
export const Schedule = ({ date_start, date_end }) => {
  const {
    loading: s_loading,
    error: s_error,
    data: s_data,
  } = useQuery(GET_SCHEDULE, {
    variables: {
      dateStart: date_start,
      dateEnd: date_end,
      vendorId: vendor_id,
    },
  });
  if (s_loading) return <p>Loading...</p>;
  if (s_error) return <p>{s_error.message}</p>;
  // return <p>test</p>;

  // return <p>test</p>;
  return (
    <>
      {s_data.kernel_work_order.map((s_info) => {
        if (
          // woa_info.work_order.work_order_items.length === 0
          s_info.activity === null ||
          s_info.activity.fs === null ||
          s_info.activity.fs.ho === null ||
          s_info.activity.fs.ho.lot === null ||
          s_info.activity.fs.ho.lot.development === null ||
          s_info.activity.fs.ho.lot.development.name === null ||
          s_info.work_order_items.length === 0 ||
          s_info.activity.planned_start === null ||
          s_info.activity.planned_end === null
        ) {
          return <></>;
        }
        const start = format(
          toDate(parseISO(s_info.activity.planned_start)),
          "MM/dd"
        );
        const end = format(
          toDate(parseISO(s_info.activity.planned_end)),
          "MM/dd"
        );
        // return <></>;

        return (
          <Box
            className="timeline-item-box"
            boxShadow={"md"}
            css={{ padding: "10px 20px", margin: "10px" }}
          >
            <p className="timeline-item-name">
              {s_info.work_order_items[0].cost_type.cost_category.name}
            </p>
            <div className="timeline-item-details">
              <p className="timeline-item-loc">
                {s_info.activity.fs.ho.lot.development.name} |{" "}
                {s_info.activity.fs.ho.lot.code}
              </p>
              <p>
                {start} - {end}
              </p>
            </div>
          </Box>
        );
      })}
    </>
  );
};

const GET_WO_APPROVAL_ID = gql`
  query GetWOApprovalId(
    $vendorId: Int!
    $dateStart: timestamp
    $dateEnd: timestamp
  ) {
    kernel_work_order_approval(
      where: {
        work_order: {
          vendor_id: { _eq: $vendorId }
          updated_at: { _gte: $dateStart, _lte: $dateEnd }
        }
      }
    ) {
      work_order_id
    }
  }
`;
export const SOWWOApprovals = () => {
  const { loading, error, data } = useQuery(GET_WO_APPROVAL_ID, {
    variables: {
      vendorId: vendor_id,
      dateStart: "2022-06-27",
      dateEnd: "2022-12-25",
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return data.kernel_work_order_approval.map((info) => (
    <SOWWOId id={info.work_order_id} />
  ));
};
const GET_WO_FROM_ID = gql`
  query GetWOFromID($WOId: Int) {
    kernel_work_order(where: { id: { _eq: $WOId } }) {
      id
      vendor_id
      activity {
        fs: field_schedule {
          ho: house_order {
            lot {
              code: _code
              development {
                name
              }
            }
            id
          }
        }
        planned_duration
        planned_end
        planned_start
        status
      }
      work_order_items(where: { amount: { _gt: "0" } }) {
        amount
        cost_type {
          name
          cost_category {
            name
          }
        }
      }
      type
      notes
    }
  }
`;
export const SOWWOId = ({ id }) => {
  const { loading, error, data } = useQuery(GET_WO_FROM_ID, {
    variables: {
      WOId: id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 0</p>;
  // return <></>;
  return data.kernel_work_order.map((info) => {
    if (
      info.activity === null ||
      info.activity.fs === null ||
      info.activity.fs.ho === null ||
      info.activity.fs.ho.lot === null ||
      info.work_order_items.length === 0
    ) {
      return <></>;
    }

    return <SOWWOPlanElevation info={info} />;
  });
};
const SOWWOPlanElevation = ({ info }) => {
  // console.log(wo_info.activity.fs.ho.id);

  const { loading, error, data } = useQuery(GET_PLAN_ELEVATION, {
    variables: { hoId: info.activity.fs.ho.id },
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
              <Text className="wov-button-id">WO:{info.id}</Text>
              <Text className="wov-button-loc">
                {info.activity.fs.ho.lot.development.name} | Lot{" "}
                {info.activity.fs.ho.lot.code}
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
            {info.work_order_items.map((lineitem) => (
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
