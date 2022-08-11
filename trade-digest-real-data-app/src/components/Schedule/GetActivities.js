import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Box } from "@chakra-ui/react";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import {
  isAfter,
  format,
  parse,
  isSameDay,
  differenceInDays,
  endOfWeek,
} from "date-fns";

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
const getActivities = async ({ id, development, lot, name }) => {
  try {
    const activitiesRef = collection(db, `schedule/${id}/activities`);
    const activitiesQuery = await query(
      activitiesRef,
      where("vendor", "==", name)
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

export const getSchedules = async (name) => {
  try {
    const scheduleRef = collection(db, "schedule");
    const scheduleQuery = await query(
      scheduleRef
      // where("developmentId", "in", [35])
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
        name: name,
      });
    });
    const activitiesPromises = scheduleIds.map(getActivities);
    const activities = await Promise.all(activitiesPromises);
    const activities_list = [];
    activities.forEach((schedule) => {
      schedule.forEach((activity) => {
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

export const filterActivitiesByDate = ({
  activities,
  start_date,
  end_date,
}) => {
  const filtered = [];
  const lots = [];
  activities.forEach((activity) => {
    if (
      activity.start >= start_date &&
      activity.start < end_date &&
      activity.dev !== "Template"
    ) {
      filtered.push(activity);
      lots.push({ dev: activity.dev, lot: activity.lot });
    }
  });
  filtered.sort((a, b) => differenceInDays(a.start, b.start));
  return { lots, filtered };
};

// new Date(2022, 7, 1)
export const GetWeekActivities = ({ filtered }) => {
  return (
    <>
      {filtered.map((activity) => {
        try {
          var date;
          if (isSameDay(activity.start, activity.end)) {
            date = format(activity.start, "ccc");
          } else {
            date = format(activity.start, "ccc") + " - ";
            if (isAfter(activity.end, endOfWeek(activity.start))) {
              date += format(activity.end, "ccc MMM d");
            } else {
              date += format(activity.end, "ccc");
            }
          }

          return (
            <>
              {/* <Subdivider /> */}
              <div className="timeline-divider" />
              <Box
                className="timeline-item-box"
                css={{ padding: "0px 15px", margin: "10px" }}
              >
                <p className="timeline-item-name">{activity.title}</p>
                <div className="timeline-item-details">
                  <p className="timeline-item-loc">
                    {activity.dev} | Lot {activity.lot}
                  </p>
                  <p>{date}</p>
                </div>
              </Box>
            </>
          );
        } catch (err) {
          console.log("err");
          console.log(err);
          return null;
        }
      })}
    </>
  );
};
