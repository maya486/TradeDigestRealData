import React, { useEffect, useMemo } from "react";
import { TimelineNode } from "./components/TimelineNode";
import { filterActivitiesByDate, GetWeekActivities } from "./firebase/test";

export const WeekActivities = ({ activities, setLots }) => {
  const firstWeek = useMemo(() => {
    return filterActivitiesByDate({
      activities: activities,
      start_date: new Date(2022, 7, 1),
      end_date: new Date(2022, 7, 8),
    });
  }, [activities]);

  const secondWeek = useMemo(() => {
    return filterActivitiesByDate({
      activities: activities,
      start_date: new Date(2022, 7, 8),
      end_date: new Date(2022, 7, 15),
    });
  }, [activities]);

  useEffect(() => {
    setLots(firstWeek?.lots || []);
  }, [firstWeek, setLots]);

  return (
    <>
      <TimelineNode isRed={true} text="This Week: July 18 - July 24" />
      <GetWeekActivities filtered={firstWeek?.filtered || []} />
      <TimelineNode text="Next Week: July 25 - July 31" />
      <GetWeekActivities filtered={secondWeek?.filtered || []} />
      <TimelineNode text="Following Week: August 1 - August 7" />
    </>
  );
};
