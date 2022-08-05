import "./App.css";
import {
  StartLetterData,
  WorkOrderData,
  Notifs,
  SOWWOApprovals,
  Recordables,
} from "./graph";
import { BiGift } from "react-icons/bi";
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
  Divider,
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
const NotifItem = ({ name, loc, details, icon_type, time, id }) => {
  return (
    <div className="notif-item">
      <CustomIcon type={icon_type} />
      <div className="notif-item-text">
        <p className="notif-name">{name}</p>
        <p className="notif-id">{id}</p>
        <p className="notif-loc">{loc}</p>
        <p className="notif-details">{details}</p>
      </div>
      <p className="notif-time">{time}</p>
    </div>
  );
};
const PunchItem = ({ name, details, href }) => {
  return (
    <div className="notif-item">
      <div className="bullet"></div>
      <div className="notif-item-text">
        <p className="notif-name">{name}</p>
        <p className="notif-details">{details}</p>
      </div>
      <LinkBox className="punch-item-link">
        <LinkOverlay href={href} />
        {/* <div id="punch-item-button">[Icon]</div> */}
        <Icon as={FiExternalLink} w="23px" h="23px" />
      </LinkBox>
    </div>
  );
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
      // height="30px"
      // borderRadius="15px"
      borderRadius="inherit"
      _active={{
        backgroundColor: "white",
        // borderRadius: "15px",
        borderRadius: "inherit",
      }}
      _selected={{
        backgroundColor: "white",
        // borderRadius: "15px",
        borderRadius: "inherit",
      }}
    >
      {text}
    </Tab>
  );
};
const WOVButton = ({ id, loc, isPaid }) => {
  return (
    <div className="wov-button-wrapper">
      {isPaid ? (
        <Tag
          className="wov-tag"
          borderRadius="none"
          bg="#DFF1EC"
          color="#2E5045"
        >
          Done
        </Tag>
      ) : (
        <Tag
          className="wov-tag"
          borderRadius="none"
          bg="#F5F4FA"
          color="#27364F"
        >
          Open
        </Tag>
      )}
      <div className="wov-button-text-wrapper">
        <Text className="wov-button-id">KER:{id}</Text>
        <Text className="wov-button-loc">{loc}</Text>
      </div>
      <AccordionIcon />
    </div>
  );
};
const MTButton = ({ info, icon_type }) => {
  return (
    <>
      <div className="mt-button-wrapper">
        {/* <div id="punch-item-button" fontSize="14px">
            [Icon]
          </div> */}
        {/* <Icon as={TbCircleCheck} w="17px" h="17px" /> */}
        <CustomIcon type={icon_type} className="mt-button-icon" />
        <Text className="mt-button-type">{icon_type}</Text>
        <Text className="mt-button-info">{info}</Text>
        <AccordionIcon className="mt-button-dropdown" />
      </div>
    </>
  );
};
const CustomAccordionButton = ({ id, loc, isPaid = false }) => {
  return (
    <h2>
      <AccordionButton fontSize="14px">
        <WOVButton id={id} loc={loc} isPaid={isPaid} />
      </AccordionButton>
    </h2>
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
const WOVPanel = ({ plan, item_list, elevation }) => {
  return (
    <>
      <div className="wov-panel-wrapper">
        <div className="wov-panel-names">
          <p>Plan:</p>
          <p>Elevation:</p>
          <p>Item:</p>
        </div>
        <div className="wov-panel-info">
          <p id="plan">{plan}</p>
          <p id="elevation">{elevation}</p>
          {item_list.map((lineitem) => (
            <p className="lineitem" key={lineitem}>
              {lineitem}
            </p>
          ))}
        </div>
      </div>
      {/* <div className="wov-panel-wrapper">
          <p id="plan">{plan}</p>
        </div>
        <div className="wov-panel-wrapper">
          <p id="item">{item}</p>
          <p id="elevation">{elevation}</p>
        </div> */}
    </>
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
const CustomAccordionPanel = ({ plan, item_list, elevation }) => {
  return (
    <AccordionPanel
      css={{
        margin: 0,
        padding: "5px 20px",
      }}
    >
      <WOVPanel plan={plan} item_list={item_list} elevation={elevation} />
    </AccordionPanel>
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
        // borderTop: "1px solid #DBDDE1",
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
const RewardItem = ({ name, isClaimed, num }) => {
  return (
    <>
      <div className="reward-item-wrapper">
        <div className="reward-item-text">
          <p id="name">{name}</p>
          <p id="fulfill">Fulfill {num} Punch Items</p>
        </div>
        <div className="reward-item-tag">
          {isClaimed ? (
            <Tag borderRadius="2px" bg="#DFF1EC">
              <TagLeftIcon
                className="check-icon"
                boxSize="12px"
                as={CheckIcon}
                color="#1CC38D"
              />
              <TagLabel className="claim-label">Claimed</TagLabel>
            </Tag>
          ) : (
            <Tag borderRadius="2px" bg="#FBF9F6">
              <TagLabel className="claim-label">Claim</TagLabel>
            </Tag>
          )}
        </div>
      </div>
    </>
  );
};
const DemoAccordion = ({ isPaid = false, wv_arr = [0, 1, 0, 1] }) => {
  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <CustomAccordionButton
          id={wv_arr[0] === 1 ? "WO:201986" : "VPO:201986"}
          // id="KER:201986"
          loc="Jasper 1C | Lot 5"
          isPaid={isPaid}
        />
        <CustomAccordionPanel
          plan="5-Plex"
          item_list={["item_name #1"]}
          elevation="A"
        />
      </AccordionItem>
      <AccordionItem>
        <CustomAccordionButton
          id={wv_arr[1] === 1 ? "WO:201987" : "VPO:201987"}
          loc="Jasper 1C | Lot 5"
          isPaid={isPaid}
        />
        <CustomAccordionPanel
          plan="5-Plex"
          item_list={["item_name #1", "item name #2"]}
          elevation="A"
        />
      </AccordionItem>
      <AccordionItem>
        <CustomAccordionButton
          id={wv_arr[2] === 1 ? "WO:201988" : "VPO:201988"}
          loc="Jasper 1C | Lot 5"
          isPaid={isPaid}
        />
        <CustomAccordionPanel
          plan="5-Plex"
          item_list={["item_name #1", "item_name #2", "item_name #3"]}
          elevation="A"
        />
      </AccordionItem>
      <AccordionItem>
        <CustomAccordionButton
          id={wv_arr[3] === 1 ? "WO:201989" : "VPO:201989"}
          loc="Jasper 1C | Lot 5"
          isPaid={isPaid}
        />
        <CustomAccordionPanel
          plan="5-Plex"
          item_list={["item_name #1", "item_name #2", "item_name #3"]}
          elevation="A"
        />
      </AccordionItem>
    </Accordion>
  );
};
const StartLetter = ({ loc, date, href, plan, elevation }) => {
  return (
    <div className="start-letter-wrapper">
      <div className="start-letter-text">
        <Text className="start-letter-loc">{loc}</Text>
        <Text className="start-letter-plan-elevation">
          Plan: {plan} | Elevation: {elevation}
        </Text>
        <Text className="start-letter-date">Last Updated: {date}</Text>
      </div>
      <LinkBox className="start-letter-link">
        <LinkOverlay href={href} />
        <Icon as={FiExternalLink} w="17px" h="17px" />
      </LinkBox>
    </div>
  );
};

const TimelineItem = ({ name, loc, dates }) => {
  return (
    <>
      {/* <Subdivider /> */}
      <div className="timeline-divider" />
      <Box
        className="timeline-item-box"
        css={{ padding: "0px 15px", margin: "10px" }}
      >
        <p className="timeline-item-name">{name}</p>
        <div className="timeline-item-details">
          <p className="timeline-item-loc">{loc}</p>
          <p>{dates}</p>
        </div>
      </Box>
    </>
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
        {/* <Box className="notifs"> */}
        {/* <p id="notif-header">Notifications (###)</p> */}
        {/* <CustomDivider />
          <NotifItem
            name="Work order has been updated"
            loc="KER:00264 | Jasper 1C | Lot 72"
            details="Added contract adjustment for 3/21/22 increase"
            icon_type="warning"
          />
          <CustomDivider />
          <NotifItem
            name="Work order has been approved"
            loc="KER:00264 | Jasper 1C | Lot 72"
            details="Approved by Cletus Caroland"
            icon_type="success"
          /> */}
        {/* <div className="notifss">
            <WorkOrderApprovals />
            <WorkOrderUpdates />
            <DocData />
          </div> */}
        <div className="overflow-wrapper">
          <Notifs />
        </div>
        {/* </Box> */}
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
              ></div>
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
          {/* <Box className="punch-item-box">
            <PunchItem
              name="Inspect footing for cracks"
              details="Jasper 1C | Lot 5"
              href="#"
            />
          </Box>
          <Subdivider />
          <Box className="punch-item-box">
            <PunchItem
              name="Framing inspection failed, fix some anchor bolts"
              details="Jasper 1C | Lot 5"
              href="#"
            />
          </Box> */}
          <Recordables />
        </div>
        <Text className="subsection">This Pay Period Work Orders</Text>
        <Accordion allowMultiple className="wo-accordion overflow-wrapper">
          <WorkOrderData lots={lots} />
          <SOWWOApprovals />
        </Accordion>
        {/* <Accordion allowMultiple className="wo-accordion">
          <AccordionItem>
            <CustomAccordionButton
              id="WO:441566"
              loc="Jasper 1C | Lot 317"
              isPaid={false}
            />
            <CustomAccordionPanel
              plan="3020"
              item_list={["Framing Labor - Framing Labor"]}
              elevation="A"
            />
          </AccordionItem>
          <AccordionItem>
            <CustomAccordionButton
              id="WO:441572"
              loc="Jasper 1C | Lot 317"
              isPaid={false}
            />
            <CustomAccordionPanel
              plan="3020"
              item_list={["Framing Labor - Siding Labor"]}
              elevation="A"
            />
          </AccordionItem>
          <AccordionItem>
            <CustomAccordionButton
              id="WO:442801"
              loc="Jasper 1C | Lot 321"
              isPaid={false}
            />
            <CustomAccordionPanel
              plan="3020"
              item_list={["Framing Labor - Framing Labor"]}
              elevation="A"
            />
          </AccordionItem>
          <AccordionItem>
            <CustomAccordionButton
              id="WO:442078"
              loc="Jasper 1C | Lot 331"
              isPaid={false}
            />
            <CustomAccordionPanel
              plan="2672"
              item_list={[
                "Framing Labor - Framing Labor",
                "Framing Labor - Framing Labor",
                "Framing Labor - Framing Labor",
              ]}
              elevation="A"
            />
          </AccordionItem>
          <AccordionItem>
            <CustomAccordionButton
              id="WO:442802"
              loc="Jasper 1C | Lot 331"
              isPaid={false}
            />
            <CustomAccordionPanel
              plan="2672"
              item_list={["Framing Labor - Siding Labor"]}
              elevation="A"
            />
          </AccordionItem>
        </Accordion> */}
        <ReportHeader text="Two Weeks Schedule" />
        <div id="schedule-wrapper">
          <div id="schedule-divider">
            <div id="timeline-line" />
          </div>
          <div className="timeline-wrapper">
            {/* <TimelineItem
              loc="Jasper 1C | Lot 5"
              dates="Mon - Wed"
              name="Framing Crane"
            />
            <TimelineItem
              loc="Jasper 1C | Lot 5"
              dates="Mon - Fri"
              name="Framing Siding"
            /> */}
            {/* <Schedule date_start="2022-06-06" date_end="2022-06-12" /> */}
            <TwoWeekActivities activities={activities} setLots={setLots} />
            {/* <Schedule date_start="2022-06-13" date_end="2022-06-19" /> */}
            {/* <TimelineItem
              loc="Jasper 1C | Lot 6"
              dates="Mon - Wed"
              name="Framing Crane"
            />
            <TimelineItem
              loc="Jasper 1C | Lot 7"
              dates="Thu - Fri"
              name="Framing Crane"
            /> */}
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

        {/* <ReportHeader text="Scope of Work" />
        <Tabs className="work-tabs" variant="line">
          <TabList css={{}}>
            <CustomTab text="Start Letter" />
            <CustomTab text="Work Orders" />
            <CustomTab text="VPOs" />
            <CustomTab text="Approved" />
          </TabList>
          <TabPanels>
            <TabPanel
              css={{
                margin: 0,
                padding: 0,
                maxHeight: 400,
                overflow: "scroll",
              }}
            >
              <StartLetter loc="Jasper 1C | Lot 5" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 6" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 7" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 8" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 9" date="07/07/2022" href="#" />
              <StartLetterData />
            </TabPanel>
            <TabPanel
              css={{
                margin: 0,
                padding: 0,
                maxHeight: 400,
                overflow: "scroll",
              }}
            >
              <DemoAccordion isWO={true} wv_arr={[1, 1, 1, 1]} />
              <Accordion allowMultiple>
                <WorkOrderData />
              </Accordion>
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <DemoAccordion isWO={false} wv_arr={[0, 0, 0, 0]} />
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <DemoAccordion isPaid={true} wv_arr={[1, 0, 1, 0]} />

              <Accordion allowMultiple>
                <SOWWOApprovals />
              </Accordion>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <ReportHeader text="Material Tracking" />
        <Tabs className="work-tabs" variant="line">
          <TabList css={{ border: "1px solid #DCDFE2" }}>
            <CustomTab text="Delivered Items" />
            <CustomTab text="Pending Items" />
          </TabList>
          <TabPanels>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <Accordion allowMultiple>
                <AccordionItem>
                  <CustomMTAccordionButton
                    date="June 7, 2022"
                    info="1/2-in Plywood for headers"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="5, 6, 7, 8"
                    isDelivered={true}
                    date="07/07/2022"
                  />
                </AccordionItem>
                <AccordionItem>
                  <CustomMTAccordionButton
                    date="June 7, 2022"
                    info="16d framing nails"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="5, 6, 7, 8"
                    isDelivered={true}
                    date="07/07/2022"
                  />
                </AccordionItem>
                <AccordionItem>
                  <CustomMTAccordionButton
                    date="June 7, 2022"
                    info="8d framing nails"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="5, 6, 7, 8"
                    isDelivered={true}
                    date="07/07/2022"
                  />
                </AccordionItem>
                <AccordionItem>
                  <CustomMTAccordionButton
                    date="May 29, 2022"
                    info="2 x 6 studs"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="5, 6, 7, 8"
                    isDelivered={true}
                    date="07/07/2022"
                  />
                </AccordionItem>
              </Accordion>
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <Accordion allowMultiple>
                <AccordionItem>
                  <CustomMTAccordionButton
                    date="June 7, 2022"
                    info="1/2-in Plywood for headers"
                    icon_type="on-the-way"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="5, 6, 7, 8"
                    isDelivered={false}
                    date="07/23/2022"
                  />
                </AccordionItem>
                <AccordionItem>
                  <CustomMTAccordionButton
                    date="June 7, 2022"
                    info="16d framing nails"
                    icon_type="delayed"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="5, 6, 7, 8"
                    isDelivered={false}
                    date="07/23/2022"
                  />
                </AccordionItem>
                <AccordionItem>
                  <CustomMTAccordionButton
                    date="June 7, 2022"
                    info="8d framing nails"
                    icon_type="order-placed"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="5, 6, 7, 8"
                    isDelivered={false}
                    date="07/23/2022"
                  />
                </AccordionItem>
                <AccordionItem>
                  <CustomMTAccordionButton
                    date="May 29, 2022"
                    info="2 x 6 studs"
                    icon_type="order-placed"
                  />
                  <CustomMTAccordionPanel
                    code="FM4505"
                    quantity="2500"
                    id="524917889015W4"
                    lots="5, 6, 7, 8"
                    isDelivered={false}
                    date="07/23/2022"
                  />
                </AccordionItem>
              </Accordion>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <ReportHeader text="Rewards" />
        <div className="rewards-wrapper">
          <Icon as={BiGift} w={40} h={40} color="#27364F" padding="20px" />
          <p id="rewards-description">
            EARN REWARDS
            <br /> by fulfilling punch items!
          </p>
          <div className="punch-items-remaining-wrapper">
            <p id="remaining-number">8</p>
            <p id="remaining-text">Punch Items Fulfilled</p>
          </div>
        </div>
        <CustomDivider />
        <RewardItem isClaimed={true} num="5" name="Gift Card #1" />
        <CustomDivider />
        <RewardItem isClaimed={false} num="10" name="Gift Card #2" />
        <CustomDivider /> */}
      </div>
    </ChakraProvider>
  );
}
