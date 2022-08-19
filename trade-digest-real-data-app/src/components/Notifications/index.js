import { WorkOrderApprovals } from "./WorkOrderApprovals";
import { DocData } from "./DocData";
import { useDates } from "../../hooks/useDates";
import {
  differenceInMinutes,
  differenceInDays,
  differenceInHours,
} from "date-fns";
import { CustomDivider, CustomIcon, ReportHeader } from "../Structure";
import { WorkOrderUpdates } from "./WorkOrderUpdates";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

export const Notifications = () => {
  const { now } = useDates();
  var notifs = [];
  const woa = WorkOrderApprovals();
  var woaAccordion = null;
  if (woa.length > 3) {
    woaAccordion = (
      <NotifAccordion
        title="Work orders have been approved"
        icon_type="success"
        data={woa}
      />
    );
  } else {
    notifs = notifs.concat(woa);
  }
  const wou = WorkOrderUpdates();
  var wouAccordion = null;
  if (wou.length > 3) {
    wouAccordion = (
      <NotifAccordion
        title="Work orders have been updated"
        icon_type="warning"
        data={wou}
      />
    );
  } else {
    notifs = notifs.concat(wou);
  }
  const doc = DocData();
  var docAccordion = null;
  if (doc.length > 3) {
    docAccordion = (
      <NotifAccordion
        title="Documents have been updated"
        icon_type="warning"
        data={doc}
      />
    );
  } else {
    notifs = notifs.concat(doc);
  }
  if (
    notifs.length === 0 &&
    woaAccordion === null &&
    wouAccordion === null &&
    docAccordion === null
  ) {
    return <NoNotifs />;
  }
  notifs.sort((a, b) => differenceInMinutes(b.timestamp, a.timestamp));
  return (
    <>
      <ReportHeader text="Notifications" />
      <div>
        <div className="notifs">
          {woaAccordion}
          {docAccordion}
          {wouAccordion}
          {notifs.map((notif) => {
            const time = TimeToText({ now: now, timestamp: notif.timestamp });
            switch (notif.type) {
              case "wo-update":
                return <WOU notif={notif} time={time} />;
              case "wo-approval":
                return <WOA notif={notif} time={time} />;
              case "doc":
                return <DOC notif={notif} time={time} />;
              default:
                return null;
            }
          })}
        </div>
      </div>
    </>
  );
};

const NoNotifs = () => {
  return (
    <>
      <ReportHeader text="Notifications" />
      <div className="overflow-wrapper">
        <div className="notifs">
          <CustomDivider />
          <div className="notif-item">
            <CustomIcon type="info" />
            <div className="notif-item-text">
              <p className="notif-name">
                No Notifications from the past 7 days!
              </p>
              <p className="notif-id">
                Stay tuned! When there are work order or document updates, they
                will show up here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const WOU = ({ notif, time }) => {
  return (
    <div key={notif.id}>
      <CustomDivider />
      <div className="notif-item">
        <CustomIcon type="warning" />
        <div className="notif-item-text">
          <p className="notif-name">Work order has been updated</p>
          <p className="notif-id">KER:{notif.id}</p>
          <p className="notif-loc">
            {notif.dev} | Lot {notif.lot}
          </p>
          <p className="notif-details">{notif.notes}</p>
        </div>
        <p className="notif-time">{time}</p>
      </div>
    </div>
  );
};

const WOA = ({ notif, time }) => {
  return (
    <div key={notif.id}>
      <CustomDivider />
      <div className="notif-item">
        <CustomIcon type="success" />
        <div className="notif-item-text">
          <p className="notif-name">Work order has been approved</p>
          <p className="notif-id">KER:{notif.id}</p>
          <p className="notif-loc">
            {notif.dev} | Lot {notif.lot}
          </p>
          {notif.approved_by_user != null && (
            <p className="notif-details">
              Approved by: {notif.approved_by_user.first_name}{" "}
              {notif.approved_by_user.last_name}
            </p>
          )}
        </div>
        <p className="notif-time">{time}</p>
      </div>
    </div>
  );
};

const DOC = ({ notif, time }) => {
  return (
    <div key={notif.id}>
      <CustomDivider />
      <div className="notif-item">
        <CustomIcon type="warning" />
        <div className="notif-item-text">
          <p className="notif-name">Document has been updated</p>
          <p className="notif-id">ID:{notif.id}</p>
          <p className="notif-loc">
            {notif.dev} | Lot {notif.lot}
          </p>
          <p className="notif-details">{notif.filename}</p>
        </div>
        <p className="notif-time">{time}</p>
      </div>
    </div>
  );
};

const NotifAccordion = ({ data, icon_type, title }) => {
  const { now } = useDates();
  return (
    <Accordion allowToggle className="overflow-wrapper">
      <AccordionItem borderBottom="None" borderTop="None">
        <h2>
          <AccordionButton css={{ margin: "0", padding: "0" }}>
            <Box flex="1" textAlign="left">
              <CustomDivider />
              <div className="notif-item">
                <CustomIcon type={icon_type} />
                <div className="notif-item-text">
                  <p className="notif-name">
                    {data.length} {title}
                  </p>
                  <p className="notif-id">
                    Expand this notification for more details
                  </p>
                </div>
                <AccordionIcon />
              </div>
            </Box>
          </AccordionButton>
        </h2>
        <AccordionPanel css={{ margin: "0", padding: "0" }}>
          {data.map((notif) => {
            const time = TimeToText({ now: now, timestamp: notif.timestamp });
            switch (title) {
              case "Work orders have been updated":
                return <WOU notif={notif} time={time} />;
              case "Work orders have been approved":
                return <WOA notif={notif} time={time} />;
              case "Documents have been updated":
                return <DOC notif={notif} time={time} />;
              default:
                return null;
            }
          })}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const TimeToText = ({ timestamp, now }) => {
  var time;
  if (differenceInDays(now, timestamp) >= 1) {
    time = differenceInDays(now, timestamp) + "d";
  } else {
    if (differenceInHours(now, timestamp) >= 1) {
      time = differenceInHours(now, timestamp) + "h";
    } else {
      time = differenceInMinutes(now, timestamp) + "m";
    }
  }
  return time;
};
