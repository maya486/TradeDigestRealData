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

export const Notifications = () => {
  const { now } = useDates();
  var notifs = [];
  notifs = notifs.concat(WorkOrderApprovals());
  notifs = notifs.concat(WorkOrderUpdates());
  notifs = notifs.concat(DocData());
  notifs.sort((a, b) => differenceInMinutes(b.timestamp, a.timestamp));
  return (
    <>
      <ReportHeader text="Notifications" />
      <div className="overflow-wrapper">
        <div className="notifs">
          {notifs.map((notif) => {
            var time;
            if (differenceInDays(now, notif.timestamp) > 1) {
              time = differenceInDays(now, notif.timestamp) + "d";
            } else {
              if (differenceInHours(now, notif.timestamp) > 1) {
                time = differenceInHours(now, notif.timestamp) + "h";
              } else {
                time = differenceInMinutes(now, notif.timestamp) + "m";
              }
            }
            switch (notif.type) {
              case "wo-update":
                return (
                  <div key={notif.id}>
                    <CustomDivider />
                    <div className="notif-item">
                      <CustomIcon type="warning" />
                      <div className="notif-item-text">
                        <p className="notif-name">
                          Work order has been updated
                        </p>
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
              case "wo-approval":
                return (
                  <div key={notif.id}>
                    <CustomDivider />
                    <div className="notif-item">
                      <CustomIcon type="success" />
                      <div className="notif-item-text">
                        <p className="notif-name">
                          Work order has been approved
                        </p>
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
              case "doc":
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
              default:
                return null;
            }
          })}
        </div>
      </div>
    </>
  );
  // return (
  //   // <div className="notifs">
  //   //   {notifs.map((notif) => {
  //   //     var time;
  //   //     if (differenceInDays(now, notif.timestamp) > 1) {
  //   //       time = differenceInDays(now, notif.timestamp) + "d";
  //   //     } else {
  //   //       if (differenceInHours(now, notif.timestamp) > 1) {
  //   //         time = differenceInHours(now, notif.timestamp) + "h";
  //   //       } else {
  //   //         time = differenceInMinutes(now, notif.timestamp) + "m";
  //   //       }
  //   //     }
  //   //     switch (notif.type) {
  //   //       case "wo-update":
  //   //         return (
  //   //           <>
  //   //             <CustomDivider />
  //   //             <div className="notif-item">
  //   //               <CustomIcon type="warning" />
  //   //               <div className="notif-item-text">
  //   //                 <p className="notif-name">Work order has been updated</p>
  //   //                 <p className="notif-id">KER:{notif.id}</p>
  //   //                 <p className="notif-loc">
  //   //                   {notif.dev} | Lot {notif.lot}
  //   //                 </p>
  //   //                 <p className="notif-details">{notif.notes}</p>
  //   //               </div>
  //   //               <p className="notif-time">{time}</p>
  //   //             </div>
  //   //           </>
  //   //         );
  //   //       case "wo-approval":
  //   //         return (
  //   //           <>
  //   //             <CustomDivider />
  //   //             <div className="notif-item">
  //   //               <CustomIcon type="success" />
  //   //               <div className="notif-item-text">
  //   //                 <p className="notif-name">Work order has been approved</p>
  //   //                 <p className="notif-id">KER:{notif.id}</p>
  //   //                 <p className="notif-loc">
  //   //                   {notif.dev} | Lot {notif.lot}
  //   //                 </p>
  //   //                 {notif.approved_by_user != null && (
  //   //                   <p className="notif-details">
  //   //                     Approved by: {notif.approved_by_user.first_name}{" "}
  //   //                     {notif.approved_by_user.last_name}
  //   //                   </p>
  //   //                 )}
  //   //               </div>
  //   //               <p className="notif-time">{time}</p>
  //   //             </div>
  //   //           </>
  //   //         );
  //   //       case "doc":
  //   //         return (
  //   //           <>
  //   //             <CustomDivider />
  //   //             <div className="notif-item">
  //   //               <CustomIcon type="warning" />
  //   //               <div className="notif-item-text">
  //   //                 <p className="notif-name">Document has been updated</p>
  //   //                 <p className="notif-id">ID:{notif.id}</p>
  //   //                 <p className="notif-loc">
  //   //                   {notif.dev} | Lot {notif.lot}
  //   //                 </p>
  //   //                 <p className="notif-details">{notif.filename}</p>
  //   //               </div>
  //   //               <p className="notif-time">{time}</p>
  //   //             </div>
  //   //           </>
  //   //         );
  //   //       default:
  //   //         return <></>;
  //   //     }
  //   //   })}
  //   // </div>
  // );
};
