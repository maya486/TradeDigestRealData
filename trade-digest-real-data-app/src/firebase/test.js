import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
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
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { TbChevronsDownLeft } from "react-icons/tb";
import { toDate, parseISO, format, parse } from "date-fns";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_apiId,
  measurementId: process.env.REACT_APP_measurementId,
};

const createFirebaseApp = () => {
  return firebase.initializeApp(firebaseConfig);
};

const db = getFirestore(createFirebaseApp());
const activityNames = [
  "Lumber Drop",
  "Pick Up All Rough Trades",
  "Framing - Truss Drop",
  "Framing - Truss Drop Final",
  "Strap & Sheer Inspection - Building Department",
  "Framing Pickup",
  "1st Floor Frame",
  "2nd Floor Frame",
  "Framing Snap lines",
];
const getActivities = async ({ id, development, lot }) => {
  try {
    const activitiesRef = collection(db, `schedule/${id}/activities`);
    const activitiesQuery = await query(
      activitiesRef,
      where("title", "in", activityNames)
    );
    const activities = await getDocs(activitiesQuery);

    const activitiesData = activities.docs.map(async (activity) => {
      return {
        id: activity.id,
        ...activity.data(),
        dates: activity.data().dates,
        development: development,
        lot: lot,
      };
    });
    return await Promise.all(activitiesData);
  } catch (err) {
    console.log("Activities err");
    console.log(err);
  }
};

const filterActivitiesByDate = ({ activities, start_date, end_date }) => {
  const filtered = [];
  activities.forEach((activity) => {
    if (activity.start >= start_date && activity.start < end_date) {
      filtered.push(activity);
    }
  });
  return filtered;
};

export const getSchedules = async () => {
  try {
    const scheduleRef = collection(db, "schedule");
    const scheduleQuery = await query(
      scheduleRef,
      where("developmentId", "in", [251])
    );
    const scheduleIds = [];

    const querySnapshot = await getDocs(scheduleQuery);

    const result = [];

    querySnapshot.forEach((doc) => {
      result.push(doc.data());
      scheduleIds.push({
        id: doc.id,
        development: doc.data().developmentName,
        lot: doc.data().lotCode,
      });
    });
    const activitiesPromises = scheduleIds.map(getActivities);
    const activities = await Promise.all(activitiesPromises);
    const activities_list = [];
    activities.forEach((schedule) => {
      schedule.forEach((activity) => {
        let dates = "";
        activity.dates.forEach(({ date }) => {
          dates += date;
          dates += " ";
        });
        activities_list.push({
          dev: activity.development,
          lot: activity.lot,
          title: activity.title,
          status: activity.status,
          start: parse(activity.dates[0].date, "MM/dd/yyyy", new Date()),
          end: parse(
            activity.dates[activity.dates.length - 1].date,
            "MM/dd/yyyy",
            new Date()
          ),
        });
      });
    });
    return activities_list;
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};
// new Date(2022, 7, 1)
export const GetWeekActivities = ({ activities, start_date, end_date }) => {
  const filtered = filterActivitiesByDate({
    activities: activities,
    start_date: start_date,
    end_date: end_date,
  });
  return (
    <>
      {filtered.map((activity) => {
        const start = format(activity.start, "ccc");
        const end = format(activity.end, "ccc");
        return (
          <Box
            className="timeline-item-box"
            boxShadow={"md"}
            css={{ padding: "10px 20px", margin: "10px" }}
          >
            <p className="timeline-item-name">{activity.title}</p>
            <div className="timeline-item-details">
              <p className="timeline-item-loc">
                {activity.dev} | {activity.lot}
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
