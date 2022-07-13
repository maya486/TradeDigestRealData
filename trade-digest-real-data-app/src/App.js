import "./App.css";
import { StartLetterData } from "./graph";
import { BiGift } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import { TbCircleCheck } from "react-icons/tb";
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

function App() {
  const date = "Fri Jun 10, 2022";
  const name = "Staple 3";
  const Divider = () => {
    return <div className="divider" />;
  };
  const Subdivider = () => {
    return <div className="subdivider" />;
  };
  const NotifItem = ({ name, details, timestamp }) => {
    return (
      <div className="notif-item">
        <div className="bullet"></div>
        <div className="notif-item-text">
          <p className="notif-name">{name}</p>
          <p className="notif-details">{details}</p>
          <p className="notif-timestamp">{timestamp}</p>
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
        <Divider />
        <p className="report-header-title">{text}</p>
        <Divider />
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
  const WOVButton = ({ id, loc }) => {
    return (
      <>
        <div className="wov-button-wrapper">
          <Text className="wov-button-id">{id}</Text>
          <Tag borderRadius="none" bg="#F5F4FA">
            Open
          </Tag>
          <Text className="wov-button-loc">{loc}</Text>
          <></>
        </div>
        <AccordionIcon />
      </>
    );
  };
  const MTButton = ({ date, info }) => {
    return (
      <>
        <div className="wov-button-wrapper">
          {/* <div id="punch-item-button" fontSize="14px">
            [Icon]
          </div> */}
          <Icon as={TbCircleCheck} w="17px" h="17px" />
          <Text className="mt-button-date">{date}</Text>
          <Text className="mt-button-info">{info}</Text>
          <></>
        </div>
        <AccordionIcon />
      </>
    );
  };
  const CustomAccordionButton = ({ id, loc }) => {
    return (
      <h2>
        <AccordionButton fontSize="14px">
          <WOVButton id={id} loc={loc} />
        </AccordionButton>
      </h2>
    );
  };
  const CustomMTAccordionButton = ({ date, info }) => {
    return (
      <h2>
        <AccordionButton fontSize="14px">
          <MTButton date={date} info={info} />
        </AccordionButton>
      </h2>
    );
  };
  const WOVPanel = ({ title, plan, item, elevation }) => {
    return (
      <>
        <div className="wov-panel-wrapper">
          <p id="title">{title}</p>
          <p id="plan">{plan}</p>
        </div>
        <div className="wov-panel-wrapper">
          <p id="item">{item}</p>
          <p id="elevation">{elevation}</p>
        </div>
      </>
    );
  };
  const MTPanel = ({ code, quantity, id }) => {
    return (
      <>
        <div className="mt-panel-wrapper">
          <p id="code">Item Code: {code}</p>
          <p id="quantity">Qty: {quantity}</p>
        </div>
        <div className="mt-panel-wrapper">
          <p id="id">Tracking ID: {id}</p>
        </div>
      </>
    );
  };
  const CustomAccordionPanel = ({ title, plan, item, elevation }) => {
    return (
      <AccordionPanel
        bg="#F2F0ED"
        css={{
          margin: 0,
          padding: "5px 20px",
          borderTop: "1px solid #DBDDE1",
        }}
      >
        <WOVPanel title={title} plan={plan} item={item} elevation={elevation} />
      </AccordionPanel>
    );
  };
  const CustomMTAccordionPanel = ({ code, quantity, id }) => {
    return (
      <AccordionPanel
        bg="#F2F0ED"
        css={{
          margin: 0,
          padding: "5px 20px",
          borderTop: "1px solid #DBDDE1",
        }}
      >
        <MTPanel code={code} quantity={quantity} id={id} />
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
  const DemoAccordion = () => {
    return (
      <Accordion allowMultiple>
        <AccordionItem>
          <CustomAccordionButton id="KER:201986" loc="Jasper 1C | Lot 5" />
          <CustomAccordionPanel
            title="Draw 1 - Material"
            plan="Plan: 5-Plex"
            item="Item/Notes"
            elevation="Elevation:-"
          />
        </AccordionItem>

        <AccordionItem>
          <CustomAccordionButton id="KER:201987" loc="Jasper 1C | Lot 5" />
          <CustomAccordionPanel
            title="Draw 2 - Labor"
            plan="Plan: 5-Plex"
            item="Item/Notes"
            elevation="Elevation:-"
          />
        </AccordionItem>
        <AccordionItem>
          <CustomAccordionButton id="KER:201988" loc="Jasper 1C | Lot 5" />
          <CustomAccordionPanel
            title="Draw 1 - Material"
            plan="Plan: 5-Plex"
            item="Item/Notes"
            elevation="Elevation:-"
          />
        </AccordionItem>
        <AccordionItem>
          <CustomAccordionButton id="KER:201989" loc="Jasper 1C | Lot 5" />
          <CustomAccordionPanel
            title="Draw 2 - Labor"
            plan="Plan: 5-Plex"
            item="Item/Notes"
            elevation="Elevation:-"
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
        <LinkBox className="punch-item-link">
          <LinkOverlay href={href} />
          <Icon as={FiExternalLink} w="17px" h="17px" />
        </LinkBox>
      </div>
    );
  };
  return (
    <ChakraProvider>
      <p id="real-data">Real Data</p>
      <div className="App">
        <header className="App-header">
          <img src="logo.svg" className="App-logo" alt="logo" />
          <Text id="date">{date}</Text>
        </header>
        <Divider />
        <p id="greeting">Hello, {name}!</p>
        <Box className="notifs" boxShadow={"md"}>
          <p id="notif-header">Notifications (2)</p>
          <Divider />
          <NotifItem
            name="Work order price update"
            details="KER:00264 | Jasper 1C | Lot 72"
            timestamp="2 hours ago"
          />
          <Divider />
          <NotifItem
            name="Work order has been approved"
            details="KER:00264 | Jasper 1C | Lot 72"
            timestamp="6 hours ago"
          />
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
          <Text id="punch-items-text">
            Remaining Punch Items to Check-off Work Orders:{" "}
          </Text>
        </div>
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
        <ReportHeader text="Scope of Work" />
        <Tabs className="work-tabs" variant="line">
          <TabList css={{ border: "1px solid #DCDFE2" }}>
            <CustomTab text="Start Letter" />
            <CustomTab text="Work Orders" />
            <CustomTab text="VPOs" />
            <CustomTab text="Approved" />
          </TabList>
          <TabPanels>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              {/* <StartLetter loc="Jasper 1C | Lot 5" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 6" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 7" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 8" date="07/07/2022" href="#" />
              <StartLetter loc="Jasper 1C | Lot 9" date="07/07/2022" href="#" /> */}
              <StartLetterData />
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <DemoAccordion />
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <DemoAccordion />
            </TabPanel>
            <TabPanel css={{ margin: 0, padding: 0 }}>
              <DemoAccordion />
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
                  />
                </AccordionItem>
              </Accordion>
            </TabPanel>
            <TabPanel>
              <p>idk</p>
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
            <p id="remaining-number">29</p>
            <p id="remaining-text">Punch Items Fulfilled</p>
          </div>
        </div>
        <Divider />
        <RewardItem isClaimed={true} num="5" name="Gift Card #1" />
        <Divider />
        <RewardItem isClaimed={false} num="10" name="Gift Card #2" />
        <Divider />
      </div>
    </ChakraProvider>
  );
}

export default App;
