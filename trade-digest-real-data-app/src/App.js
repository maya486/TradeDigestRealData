import "./App.css";
import {
  StartLetterData,
  WorkOrderData,
  Notifs,
  SOWWOApprovals,
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
import { getSchedules, GetWeekActivities } from "./firebase/test.js";
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

const date = "Fri Jun 10, 2022";
const name = "Staple 3";
export const CustomDivider = () => {
  return <div className="divider" />;
};
const Subdivider = () => {
  return <div className="subdivider" />;
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
    case "delivered":
      return <Icon as={TbCircleCheck} w="16px" h="16px" color="#3E4C63" />;
    case "delayed":
      return (
        <Icon as={BsExclamationCircle} w="16px" h="16px" color="#3E4C63" />
      );
    case "order-placed":
      return <Icon as={BsThreeDots} w="16px" h="16px" color="#3E4C63" />;
    case "on-the-way":
      return <Icon as={RiTruckLine} w="16px" h="16px" color="#3E4C63" />;
  }
  return <Icon as={TbCircleCheck} w="16px" h="16px" color="black" />;
};
const NotifItem = ({ name, loc, details, icon_type }) => {
  return (
    <div className="notif-item">
      <CustomIcon type={icon_type} />
      <div className="notif-item-text">
        <p className="notif-name">{name}</p>
        <p className="notif-loc">{loc}</p>
        <p className="notif-details">{details}</p>
      </div>
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
      <CustomDivider />
      <p className="report-header-title">{text}</p>
      <CustomDivider />
    </div>
  );
};
const CustomTab = ({ text }) => {
  return (
    <Tab
      className="tab"
      _active={{
        color: "#27364F",
        fontWeight: "700",
        borderBottom: "2px solid #27364F",
      }}
      _selected={{
        color: "#27364F",
        fontWeight: "700",
        borderBottom: "2px solid #27364F",
      }}
    >
      {text}
    </Tab>
  );
};
const WOVButton = ({ id, loc, isPaid }) => {
  return (
    <>
      <div className="wov-button-wrapper">
        <Text className="wov-button-id">{id}</Text>
        {isPaid ? (
          <Tag
            className="wov-tag"
            borderRadius="none"
            bg="#DFF1EC"
            color="#2E5045"
          >
            Paid
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
        {/* <Tag borderRadius="none" bg="#F5F4FA">
            Open
          </Tag> */}
        <Text className="wov-button-loc">{loc}</Text>
        <></>
      </div>
      <AccordionIcon />
    </>
  );
};
const MTButton = ({ date, info, icon_type }) => {
  return (
    <>
      <div className="wov-button-wrapper">
        {/* <div id="punch-item-button" fontSize="14px">
            [Icon]
          </div> */}
        {/* <Icon as={TbCircleCheck} w="17px" h="17px" /> */}
        <CustomIcon type={icon_type} />
        <Text className="mt-button-date">{date}</Text>
        <Text className="mt-button-info">{info}</Text>
        <></>
      </div>
      <AccordionIcon />
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
      bg="#F2F0ED"
      css={{
        margin: 0,
        padding: "5px 20px",
        borderTop: "1px solid #DBDDE1",
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
      bg="#F2F0ED"
      css={{
        margin: 0,
        padding: "5px 20px",
        borderTop: "1px solid #DBDDE1",
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
const StartLetter = ({ loc, date, href }) => {
  return (
    <div className="start-letter-wrapper">
      <Text id="start-letter-loc">{loc}</Text>
      <Text id="start-letter-date">Last Updated: {date}</Text>
      <LinkBox className="start-letter-link">
        <LinkOverlay href={href} />
        <Icon as={FiExternalLink} w="17px" h="17px" />
      </LinkBox>
    </div>
  );
};
const TimelineNode = ({ isRed = false, text }) => {
  return (
    <div className="timeline-node">
      <div className="timeline-bullet" />
      <div className="timeline-node-text">{text}</div>
    </div>
  );
};
const TimelineItem = ({ name, loc, dates }) => {
  return (
    <Box
      className="timeline-item-box"
      boxShadow={"md"}
      css={{ padding: "10px 20px", margin: "10px" }}
    >
      <p className="timeline-item-name">{name}</p>
      <div className="timeline-item-details">
        <p className="timeline-item-loc">{loc}</p>
        <p>{dates}</p>
      </div>
    </Box>
  );
};
export function App() {
  useEffect(() => {
    const fetchSchedules = async () => {
      const auth = getAuth();
      await signInAnonymously(auth);
      const fetchedActivities = await getSchedules();
      setActivities(fetchedActivities);
    };

    fetchSchedules();
  }, []);
  const [activities, setActivities] = useState([]);

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

          <Text id="date">{date}</Text>
        </header>
        <CustomDivider />
        <p id="greeting">Hello, {name}!</p>
        <Box className="notifs" boxShadow={"md"}>
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
          <Notifs />
        </Box>
        <ReportHeader text="This Pay Period" />
        <div className="upp-wrapper">
          <CircularProgress
            id="circle-progress"
            size="240px"
            value={20}
            thickness="7px"
            color="#FC1E68"
          />
          <div className="inner-progress-text">
            <Text id="countdown-text">4 Days</Text>
            <Text id="countdown-helper">Until Next Pay Run</Text>
          </div>
        </div>
        <Text className="punch-items-text">
          Remaining Punch Items to Check-off Work Orders:{" "}
        </Text>
        <Subdivider />
        <div className="punch-items-wrapper">
          <Box className="punch-item-box" boxShadow={"lg"}>
            <PunchItem
              name="Inspect footing for cracks"
              details="Jasper 1C | Lot 5"
              href="#"
            />
          </Box>
          <Box className="punch-item-box" boxShadow={"lg"}>
            <PunchItem
              name="Framing inspection failed, fix some anchor bolts"
              details="Jasper 1C | Lot 5"
              href="#"
            />
          </Box>
        </div>
        <Text id="schedule-title">Upcoming Schedule Items:</Text>
        <Subdivider />
        <div id="schedule-wrapper">
          <div id="schedule-divider">
            <div id="timeline-line" />
          </div>
          <div className="timeline-wrapper">
            <TimelineNode isRed={true} text="Aug 1, 2022" />
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
            <GetWeekActivities
              activities={activities}
              start_date={new Date(2022, 7, 1)}
              end_date={new Date(2022, 7, 8)}
            />
            <TimelineNode text="Aug 8, 2022" />
            <GetWeekActivities
              activities={activities}
              start_date={new Date(2022, 7, 8)}
              end_date={new Date(2022, 7, 15)}
            />
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
            <TimelineNode text="Aug 15, 2022" />
          </div>
        </div>
        <ReportHeader text="Scope of Work" />
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
              {/* <StartLetter loc="Jasper 1C | Lot 5" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 6" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 7" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 8" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 9" date="07/07/2022" href="#" /> */}
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
              {/* <DemoAccordion isWO={true} wv_arr={[1, 1, 1, 1]} /> */}
              <Accordion allowMultiple>
                <WorkOrderData />
              </Accordion>
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <DemoAccordion isWO={false} wv_arr={[0, 0, 0, 0]} />
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              {/* <DemoAccordion isPaid={true} wv_arr={[1, 0, 1, 0]} /> */}

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
        <CustomDivider />
      </div>
    </ChakraProvider>
  );
}
