import "./App.css";
import {
  StartLetterData,
  WorkOrderData,
  Notifs,
  SOWWOApprovals,
  Recordables,
} from "./graph";
import { FiExternalLink } from "react-icons/fi";
import { TbCircleCheck } from "react-icons/tb";
import { IoWarning } from "react-icons/io5";
import { useEffect, useState } from "react";
import {
  BsFillCheckCircleFill,
  BsExclamationCircle,
  BsThreeDots,
} from "react-icons/bs";
import { getSchedules } from "./firebase/test.js";
import { RiTruckLine } from "react-icons/ri";
import logo from "./images/logo.png";
import {
  Text,
  ChakraProvider,
  Box,
  LinkBox,
  LinkOverlay,
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
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { getAuth, signInAnonymously } from "firebase/auth";
import { TwoWeekActivities } from "./WeekActivities";
import {
  format,
  addDays,
  startOfMonth,
  isFuture,
  endOfMonth,
  startOfDay,
  differenceInDays,
} from "date-fns";

export const current = startOfDay(new Date());
var start_pay_period = startOfMonth(current);
var end_pay_period = addDays(startOfMonth(current), 14);
if (!isFuture(end_pay_period)) {
  start_pay_period = end_pay_period;
  end_pay_period = addDays(endOfMonth(current), 1);
}
console.log("current");
console.log(current);
console.log("start");
console.log(start_pay_period);
console.log("end");
console.log(end_pay_period);

const name = "Framing Legacy";
export const CustomDivider = () => {
  return <div className="divider" />;
};
export const Subdivider = () => {
  return <div className="subdivider" />;
};
const BigDivider = () => {
  return <div className="bigdivider" />;
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
const ReportHeader = ({ text }) => {
  return (
    <div className="report-header">
      <BigDivider />
      <p className="report-header-title">{text}</p>
    </div>
  );
};
const CustomTab = ({ text }) => {
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
const CustomMTAccordionButton = ({ date, info, icon_type }) => {
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
const CustomMTAccordionPanel = ({
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

export function App() {
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
  const [activities, setActivities] = useState([]);
  const [lots, setLots] = useState([]);
  useEffect(() => {
    const fetchSchedules = async () => {
      const auth = getAuth();
      await signInAnonymously(auth);
      const fetchedActivities = await getSchedules();
      setActivities(fetchedActivities);
    };

    fetchSchedules();
  }, [setActivities]);
  return (
    <ChakraProvider>
      <p id="real-data">Real Data</p>
      <div className="App">
        <header className="App-header">
          <div className="img-wrapper">
            <img
              src={logo}
              className="App-logo"
              alt="logo"
              height="80"
              width="200"
            />
          </div>

          <Text id="date">{format(current, "MMM d, Y")}</Text>
        </header>
        <CustomDivider />
        <p id="greeting">Hello, {name}!</p>
        <ReportHeader text="Notifications" />
        <div className="overflow-wrapper">
          <Notifs />
        </div>
        <ReportHeader text="Pay Period" />
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
          <Recordables />
        </div>
        <Text className="subsection">This Pay Period Work Orders</Text>
        <Accordion allowMultiple className="wo-accordion overflow-wrapper">
          <WorkOrderData lots={lots} />
          <SOWWOApprovals />
        </Accordion>
        <ReportHeader text="Two Weeks Schedule" />
        <div id="schedule-wrapper">
          <div id="schedule-divider">
            <div id="timeline-line" />
          </div>
          <div className="timeline-wrapper">
            <TwoWeekActivities activities={activities} setLots={setLots} />
          </div>
        </div>
        <ReportHeader text="Start Letters for This Week's Lots" />
        <div className="overflow-wrapper">
          <StartLetterData lots={lots} />
        </div>
        <ReportHeader text="Material Tracking" />
        <div className="material-wrapper">
          <Tabs variant="unstyled">
            <TabList
              css={{
                background: "#DBDDE1",
                borderRadius: "25px",
                height: "40px",
                outline: "4px solid #DBDDE1",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <CustomTab text="Delivered Items" />
              <CustomTab text="Pending Items" />
            </TabList>
            <TabPanels paddingTop="20px">
              <TabPanel css={{ margin: 0, padding: 0 }}>
                <Accordion allowMultiple>
                  <AccordionItem borderBottom="none">
                    <CustomMTAccordionButton
                      date="Jul 10, 2022"
                      info="16d framing nails"
                      icon_type="Delivered"
                    />
                    <CustomMTAccordionPanel
                      code="FM4505"
                      quantity="2500"
                      id="524917889015W4"
                      lots="319, 331"
                      isDelivered={true}
                      date="07/07/2022"
                    />
                  </AccordionItem>
                  <AccordionItem borderBottom="none">
                    <CustomMTAccordionButton
                      date="Jul 10, 2022"
                      info="8d framing nails"
                      icon_type="Delivered"
                    />
                    <CustomMTAccordionPanel
                      code="FM4505"
                      quantity="2500"
                      id="524917889015W4"
                      lots="319, 331"
                      isDelivered={true}
                      date="07/10/2022"
                    />
                  </AccordionItem>
                </Accordion>
              </TabPanel>
              <TabPanel css={{ margin: 0, padding: 0 }}>
                <Accordion allowMultiple>
                  <AccordionItem borderBottom="none">
                    <CustomMTAccordionButton
                      date="Jul 19, 2022"
                      info="1/2-in Plywood for headers"
                      icon_type="On The Way"
                    />
                    <CustomMTAccordionPanel
                      code="FM4505"
                      quantity="2500"
                      id="524917889015W4"
                      lots="338, 312"
                      isDelivered={false}
                      date="07/23/2022"
                    />
                  </AccordionItem>
                  <AccordionItem borderBottom="none">
                    <CustomMTAccordionButton
                      date="Jul 19, 2022"
                      info="2 x 6 studs"
                      icon_type="Order Placed"
                    />
                    <CustomMTAccordionPanel
                      code="FM4505"
                      quantity="2500"
                      id="524917889015W4"
                      lots="338, 312"
                      isDelivered={false}
                      date="08/02/2022"
                    />
                  </AccordionItem>
                  <AccordionItem borderBottom="none">
                    <CustomMTAccordionButton
                      date="Jul 19, 2022"
                      info="20d framing nails"
                      icon_type="Delayed"
                    />
                    <CustomMTAccordionPanel
                      code="FM4505"
                      quantity="2500"
                      id="524917889015W4"
                      lots="338, 312"
                      isDelivered={false}
                      date="07/31/2022"
                    />
                  </AccordionItem>
                </Accordion>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </ChakraProvider>
  );
}
