import { useQuery, gql } from "@apollo/client";
import "./App.css";
import React, { useState } from "react";
import { BiGift } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import { TbCircleCheck } from "react-icons/tb";
import {
  toDate,
  parseISO,
  format,
  subWeeks,
  startOfDay,
  startOfMonth,
  addDays,
  isFuture,
  endOfMonth,
  differenceInHours,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";
import { CustomIcon, CustomDivider, Subdivider } from "./App.js";

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

const now = new Date();
const week_ago = subWeeks(now, 1);
export const current = startOfDay(new Date());
var start_pay_period = startOfMonth(current);
var end_pay_period = addDays(startOfMonth(current), 14);
if (!isFuture(end_pay_period)) {
  start_pay_period = end_pay_period;
  end_pay_period = addDays(endOfMonth(current), 1);
}

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
        house_orders {
          id
        }
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

const vendor_id = 12480;
export const StartLetterData = ({ lots }) => {
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
    <StartLetterDev key={dev_info.id} dev_info={dev_info} lots={lots} />
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
    variables: {
      date: format(week_ago, "yyyy-MM-dd"),
      developmentId: dev_info.development_id,
    },
  });
  if (doc_loading) return <p>Loading...</p>;
  if (doc_error) return <p>{doc_error.message}</p>;
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
    const updated_at = toDate(parseISO(doc_info.updated_at));
    var time;
    if (differenceInDays(now, updated_at) > 1) {
      time = differenceInDays(now, updated_at) + "d";
    } else {
      if (differenceInHours(now, updated_at) > 1) {
        time = differenceInHours(now, updated_at) + "h";
      } else {
        time = differenceInMinutes(now, updated_at) + "m";
      }
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
              {doc_info.lot.development.name} | Lot {doc_info.lot.code}
            </p>
            <p className="notif-details">{doc_info.filename}</p>
          </div>
          <p className="notif-time">{time}</p>
        </div>
      </>
    );
  });
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
      return <></>;
    }
    return (
      <StartLetterSL
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
    // variables: { url_id: 224 },
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

      {/* <Text id="start-letter-loc">
        {dev_name} | Lot {lot_code}
      </Text>
      <Text id="start-letter-date">Last Updated: {converted_updated_at}</Text>
      <LinkBox className="start-letter-link">
        <LinkOverlay href={url_data.s3_document_download_url.download_url} />
        <Icon as={FiExternalLink} w="17px" h="17px" />
      </LinkBox> */}
    </div>
  );
};
const GET_WO_APPROVALS = gql`
  query GetWOApprovals($date: timestamp!, $vendorId: Int) {
    kernel_work_order_approval(
      where: {
        work_order: { vendor_id: { _eq: $vendorId } }
        timestamp: { _gte: $date }
      }
      order_by: { work_order_id: asc, timestamp: desc_nulls_last }
      distinct_on: work_order_id
    ) {
      approved_by_user {
        first_name
        last_name
      }
      work_order {
        id
        work_order_items {
          development {
            name
          }
          house_order {
            lot {
              _code
            }
          }
        }
      }
      updated_at
      timestamp
    }
  }
`;
export const WorkOrderApprovals = () => {
  const {
    loading: woa_loading,
    error: woa_error,
    data: woa_data,
  } = useQuery(GET_WO_APPROVALS, {
    variables: { date: format(week_ago, "yyyy-MM-dd"), vendorId: vendor_id },
  });
  if (woa_loading) return <p>Loading...</p>;
  if (woa_error) return <p>{woa_error.message}</p>;
  return (
    <>
      {woa_data.kernel_work_order_approval.map((woa_info) => {
        if (
          woa_info.work_order === null ||
          woa_info.work_order.work_order_items.length === 0
        ) {
          return <></>;
        }
        const updated_at = toDate(parseISO(woa_info.timestamp));
        var time;
        if (differenceInDays(now, updated_at) > 1) {
          time = differenceInDays(now, updated_at) + "d";
        } else {
          if (differenceInHours(now, updated_at) > 1) {
            time = differenceInHours(now, updated_at) + "h";
          } else {
            time = differenceInMinutes(now, updated_at) + "m";
          }
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
                  {woa_info.work_order.work_order_items[0].development.name} |
                  Lot{" "}
                  {
                    woa_info.work_order.work_order_items[0].house_order.lot
                      ._code
                  }
                </p>
                {woa_data.approved_by_user != null && (
                  <p className="notif-details">
                    Approved by: {woa_info.approved_by_user.first_name}{" "}
                    {woa_info.approved_by_user.last_name}
                  </p>
                )}
              </div>
              <p className="notif-time">{time}</p>
            </div>
          </>
        );
      })}
    </>
  );
};
const GET_WO_UPDATES = gql`
  query GetWOUpdates($date: timestamp!, $vendorId: Int) {
    kernel_work_order(
      where: { updated_at: { _gte: $date }, vendor_id: { _eq: $vendorId } }
    ) {
      id
      notes
      updated_at
      work_order_items {
        amount
        development {
          name
        }
        house_order {
          lot {
            _code
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
    variables: { date: format(week_ago, "yyyy-MM-dd"), vendorId: vendor_id },
  });
  if (wou_loading) return <p>Loading...</p>;
  if (wou_error) return <p>{wou_error.message}</p>;
  return (
    <>
      {wou_data.kernel_work_order.map((wou_info) => {
        if (wou_info.work_order_items.length === 0) {
          return <></>;
        }
        const updated_at = toDate(parseISO(wou_info.updated_at));
        var time;
        if (differenceInDays(now, updated_at) > 1) {
          time = differenceInDays(now, updated_at) + "d";
        } else {
          if (differenceInHours(now, updated_at) > 1) {
            time = differenceInHours(now, updated_at) + "h";
          } else {
            time = differenceInMinutes(now, updated_at) + "m";
          }
        }
        return (
          <>
            <CustomDivider />
            <div className="notif-item">
              <CustomIcon type="warning" />
              <div className="notif-item-text">
                <p className="notif-name">Work order has been updated</p>
                <p className="notif-id">KER:{wou_info.id}</p>
                <p className="notif-loc">
                  {wou_info.work_order_items[0].development.name} | Lot{" "}
                  {wou_info.work_order_items[0].house_order.lot._code}
                </p>
                <p className="notif-details">{wou_info.notes}</p>
              </div>
              <p className="notif-time">{time}</p>
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
    kernel_work_order(where: { vendor_id: { _eq: $vendorId } }) {
      id
      vendor_id
      work_order_items(where: { amount: { _gt: "0" } }) {
        amount
        cost_type {
          name
          cost_category {
            name
          }
        }
        development {
          name
        }
        house_order {
          id
          lot {
            _code
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
      // wo_info.activity === null ||
      // wo_info.activity.fs === null ||
      // wo_info.activity.fs.ho === null ||
      // wo_info.activity.fs.ho.lot === null ||
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
// const GET_SCHEDULE = gql`
//   query GetSchedule($vendorId: Int!, $dateStart: date, $dateEnd: date) {
//     kernel_work_order(
//       where: {
//         activity: { planned_start: { _gte: $dateStart, _lte: $dateEnd } }
//         vendor_id: { _eq: $vendorId }
//       }
//       order_by: { activity: { planned_start: asc } }
//     ) {
//       id
//       vendor_id
//       activity {
//         fs: field_schedule {
//           ho: house_order {
//             lot {
//               code: _code
//               development {
//                 name
//               }
//             }
//             id
//           }
//         }
//         planned_duration
//         planned_end
//         planned_start
//         status
//       }
//       work_order_items(where: { amount: { _gt: "0" } }) {
//         amount
//         cost_type {
//           name
//           cost_category {
//             name
//           }
//         }
//       }
//       type
//       notes
//     }
//   }
// `;
// export const Schedule = ({ date_start, date_end }) => {
//   const {
//     loading: s_loading,
//     error: s_error,
//     data: s_data,
//   } = useQuery(GET_SCHEDULE, {
//     variables: {
//       dateStart: date_start,
//       dateEnd: date_end,
//       vendorId: vendor_id,
//     },
//   });
//   if (s_loading) return <p>Loading...</p>;
//   if (s_error) return <p>{s_error.message}</p>;
//   // return <p>test</p>;

//   // return <p>test</p>;
//   return (
//     <>
//       {s_data.kernel_work_order.map((s_info) => {
//         if (
//           // woa_info.work_order.work_order_items.length === 0
//           s_info.activity === null ||
//           s_info.activity.fs === null ||
//           s_info.activity.fs.ho === null ||
//           s_info.activity.fs.ho.lot === null ||
//           s_info.activity.fs.ho.lot.development === null ||
//           s_info.activity.fs.ho.lot.development.name === null ||
//           s_info.work_order_items.length === 0 ||
//           s_info.activity.planned_start === null ||
//           s_info.activity.planned_end === null
//         ) {
//           return <></>;
//         }
//         const start = format(
//           toDate(parseISO(s_info.activity.planned_start)),
//           "MM/dd"
//         );
//         const end = format(
//           toDate(parseISO(s_info.activity.planned_end)),
//           "MM/dd"
//         );
//         // return <></>;

//         return (
//           <>
//             <div className="timeline-divider" />
//             <Box
//               className="timeline-item-box"
//               css={{ padding: "0px 15px", margin: "10px" }}
//             >
//               <p className="timeline-item-name">
//                 {s_info.work_order_items[0].cost_type.cost_category.name}
//               </p>
//               <div className="timeline-item-details">
//                 <p className="timeline-item-loc">
//                   {s_info.activity.fs.ho.lot.development.name} |{" "}
//                   {s_info.activity.fs.ho.lot.code}
//                 </p>
//                 <p>
//                   {start} - {end}
//                 </p>
//               </div>
//             </Box>
//           </>
//         );
//       })}
//     </>
//   );
// };

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
      distinct_on: work_order_id
    ) {
      work_order_id
      work_order {
        id
        work_order_items {
          amount
          cost_type {
            name
            cost_category {
              name
            }
          }
          development {
            name
          }
          house_order {
            id
            lot {
              _code
            }
          }
        }
      }
    }
  }
`;
export const SOWWOApprovals = () => {
  const { loading, error, data } = useQuery(GET_WO_APPROVAL_ID, {
    variables: {
      vendorId: vendor_id,

      dateStart: format(start_pay_period, "yyyy-MM-dd"),
      dateEnd: format(end_pay_period, "yyyy-MM-dd"),
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  // console.log(data.kernel_work_order_approval.length);
  return data.kernel_work_order_approval.map((info) => {
    if (
      info.work_order.work_order_items.length === 0 ||
      info.work_order.work_order_items[0].development === null ||
      info.work_order.work_order_items[0].development.name === null ||
      info.work_order.work_order_items[0].house_order === null
    ) {
      return <></>;
    }
    // var is_valid_loc = false;
    // for (var i = 0; i < lots.length; i++) {
    //   if (
    //     lots[i].lot === wo_info.work_order_items[0].house_order.lot._code &&
    //     lots[i].dev === wo_info.work_order_items[0].development.name
    //   ) {
    //     is_valid_loc = true;
    //   }
    // }
    // if (!is_valid_loc) {
    //   return <></>;
    // }
    // return <></>;
    return <SOWWOPlanElevation info={info} />;
  });
};
// const GET_WO_FROM_ID = gql`
//   query GetWOFromID($WOId: Int) {
//     kernel_work_order(where: { id: { _eq: $WOId } }) {
//       id
//       vendor_id
//       activity {
//         fs: field_schedule {
//           ho: house_order {
//             lot {
//               code: _code
//               development {
//                 name
//               }
//             }
//             id
//           }
//         }
//         planned_duration
//         planned_end
//         planned_start
//         status
//       }
//       work_order_items(where: { amount: { _gt: "0" } }) {
//         amount
//         cost_type {
//           name
//           cost_category {
//             name
//           }
//         }
//       }
//       type
//       notes
//     }
//   }
// `;
// export const SOWWOId = ({ id }) => {
//   const { loading, error, data } = useQuery(GET_WO_FROM_ID, {
//     variables: {
//       WOId: id,
//     },
//   });
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error 0</p>;
//   // return <></>;
//   return data.kernel_work_order.map((info) => {
//     if (
//       info.activity === null ||
//       info.activity.fs === null ||
//       info.activity.fs.ho === null ||
//       info.activity.fs.ho.lot === null ||
//       info.work_order_items.length === 0
//     ) {
//       return <></>;
//     }

//     return <SOWWOPlanElevation info={info} />;
//   });
// };
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

const TEST = gql`
  query GetRecordables($vendorId: Int) {
    kernel_task_recordable(
      where: { task: { vendor_id: { _eq: $vendorId } }, status: { _eq: todo } }
    ) {
      task {
        title
        lot {
          _code
          development {
            name
            name_slug
          }
        }
      }
      status
      transcript
      s3_document {
        object_url
        id
      }
      id
      original_transcript
    }
  }
`;
export const Recordables = () => {
  const { loading, error, data } = useQuery(TEST, {
    variables: {
      vendorId: vendor_id,
    },
  });
  // console.log(vendor_id);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 0 {error.message}</p>;
  // return <></>;
  // console.log(data);
  return data.kernel_task_recordable.map((info) => {
    // if (
    //   info.activity === null ||
    //   info.activity.fs === null ||
    //   info.activity.fs.ho === null ||
    //   info.activity.fs.ho.lot === null ||
    //   info.work_order_items.length === 0
    // ) {
    //   return <></>;
    // }
    // console.log(info);
    const link = `https://mosaic.build/${info.task.lot.development.name_slug}/${info.task.lot._code}/${info.id}`;
    return (
      <>
        <Subdivider />
        <p>WHAT</p>
        <Box className="punch-item-box">
          <div className="notif-item">
            <div className="bullet"></div>
            <div className="notif-item-text">
              <p className="notif-name">
                {/* {info.transcript.length > 35
                  ? `${info.transcript.substring(0, 35)}...`
                  : info.transcript.length === 0
                  ? `Name Not Available`
                  : info.transcript} */}
                {info.transcript.length > 0
                  ? info.transcript
                  : `No Name Available`}
              </p>
              <p className="notif-details">
                {info.task.lot.development.name} | Lot {info.task.lot._code}
              </p>
            </div>
            <LinkBox className="punch-item-link">
              <LinkOverlay href={link} target="_blank" />
              {/* <div id="punch-item-button">[Icon]</div> */}
              <Icon as={FiExternalLink} w="23px" h="23px" />
            </LinkBox>
          </div>
        </Box>
      </>
    );
  });
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
