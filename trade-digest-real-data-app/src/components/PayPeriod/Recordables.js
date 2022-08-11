import { useQuery } from "@apollo/client";
import { GET_RECORDABLES } from "./graphql";
import { Subdivider } from "../Structure";
import { Box, LinkBox, LinkOverlay, Icon } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import { vendor_id } from "../../VendorLogic";
import { differenceInDays } from "date-fns";
import { Text } from "@chakra-ui/react";
import { useDates } from "../../hooks/useDates";
import { useEffect } from "react";
import { TbChecklist } from "react-icons/tb";

export const Recordables = () => {
  const { end_pay_period, start_pay_period, current } = useDates();
  useEffect(() => {
    document.querySelectorAll(".circlegraph").forEach((circlegraph) => {
      let circles = circlegraph.querySelectorAll(".circleA, .circleB");
      let angle = 360 - 90,
        dangle = 360 / circles.length;
      angle -= dangle;
      for (let i = 0; i < circles.length; ++i) {
        let circle = circles[i];
        angle += dangle;
        circle.style.transform = `rotate(${angle}deg) translate(${
          circlegraph.clientWidth / 2
        }px) rotate(-${angle}deg)`;
      }
    });
  }, []);
  const { loading, error, data } = useQuery(GET_RECORDABLES, {
    variables: {
      vendorId: vendor_id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 0 {error.message}</p>;
  if (data.kernel_task_recordable.length === 0) {
    return (
      <>
        <Text className="subsection">No Punch Items</Text>
        <Subdivider />
        <div id="no-items-wrapper">
          <Icon
            as={TbChecklist}
            height="150px"
            width="150px"
            color="#BDC4CF"
            margin="20px 0 10px"
          />
          <p id="all-done">All done!</p>
          <p id="no-items-details">
            More punch items will be shown here as they are added, so check back
            soon.
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <Text className="subsection">Remaining Punch Items </Text>
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
        {data.kernel_task_recordable.map((info) => {
          const link = `https://mosaic.build/${info.task.lot.development.name_slug}/${info.task.lot._code}/${info.id}`;
          return (
            <>
              <Subdivider />
              <Box className="punch-item-box">
                <div className="notif-item">
                  <div className="bullet"></div>
                  <div className="notif-item-text">
                    <p className="notif-name">
                      {info.transcript.length > 0
                        ? info.transcript
                        : `No Name Available`}
                    </p>
                    <p className="notif-details">
                      {info.task.lot.development.name} | Lot{" "}
                      {info.task.lot._code}
                    </p>
                  </div>
                  <LinkBox className="punch-item-link">
                    <LinkOverlay href={link} target="_blank" />
                    <Icon as={FiExternalLink} w="23px" h="23px" />
                  </LinkBox>
                </div>
              </Box>
            </>
          );
        })}
      </div>
    </>
  );
};
