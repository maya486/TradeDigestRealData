import { useDates } from "../../hooks/useDates";
import { differenceInDays } from "date-fns";
import { ReportHeader, Subdivider } from "../Structure";
import { Text, Accordion } from "@chakra-ui/react";
import { Recordables } from "./Recordables";
import { WorkOrderData } from "./WorkOrderData";
import { SOWWOApprovals } from "./SOWWOApprovals";
import { useEffect } from "react";

export const PayPeriod = ({ lots }) => {
  const { end_pay_period, start_pay_period, current } = useDates();
  // useEffect(() => {
  //   document.querySelectorAll(".circlegraph").forEach((circlegraph) => {
  //     let circles = circlegraph.querySelectorAll(".circleA, .circleB");
  //     let angle = 360 - 90,
  //       dangle = 360 / circles.length;
  //     angle -= dangle;
  //     for (let i = 0; i < circles.length; ++i) {
  //       let circle = circles[i];
  //       angle += dangle;
  //       circle.style.transform = `rotate(${angle}deg) translate(${
  //         circlegraph.clientWidth / 2
  //       }px) rotate(-${angle}deg)`;
  //     }
  //   });
  // }, []);
  return (
    <>
      <ReportHeader text="Pay Period" />
      <Recordables />
      {/* <Text className="subsection">Remaining Punch Items </Text>
      <Subdivider />
      <div className="upp-wrapper">
        <div className="circlegraph">
          {[
            ...Array(differenceInDays(end_pay_period, start_pay_period) + 1),
          ].map((x, i) => (
            <div
              className={`${
                i > differenceInDays(current, start_pay_period)
                  ? "circleB"
                  : "circleA"
              }`}
              key={i}
            />
          ))}
        </div>
        <div className="inner-progress-text">
          <Text id="countdown-text">
            {differenceInDays(end_pay_period, current)} Days
          </Text>
          <Text id="countdown-helper">Until Next Pay Run</Text>
        </div>
      </div>
      <div className="punch-items-wrapper overflow-wrapper">
        <Recordables />
      </div> */}
      <Text className="subsection">This Pay Period Work Orders</Text>
      <Accordion allowMultiple className="wo-accordion overflow-wrapper">
        <WorkOrderData lots={lots} />
        <SOWWOApprovals />
      </Accordion>
    </>
  );
};
