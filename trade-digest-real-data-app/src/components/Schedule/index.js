import { ReportHeader } from "../Structure";
import { TwoWeekActivities } from "./TwoWeekActivities";
import { useEffect, useState } from "react";
import { getSchedules } from "./GetActivities";
import { getAuth, signInAnonymously } from "firebase/auth";

export const Schedule = ({ setLots, name }) => {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const fetchSchedules = async () => {
      const auth = getAuth();
      await signInAnonymously(auth);
      const fetchedActivities = await getSchedules(name);
      setActivities(fetchedActivities);
    };

    fetchSchedules();
  }, [name, setActivities]);
  return (
    <>
      <ReportHeader text="Two Weeks Schedule" />
      <div id="schedule-wrapper">
        <div id="schedule-divider">
          <div id="timeline-line" />
        </div>
        <div className="timeline-wrapper">
          <TwoWeekActivities activities={activities} setLots={setLots} />
        </div>
      </div>
    </>
  );
};
