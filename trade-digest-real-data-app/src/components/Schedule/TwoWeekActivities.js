import React, { useEffect, useMemo } from "react";
// import { TimelineNode } from "../TimelineNode";
import { filterActivitiesByDate, GetWeekActivities } from "./GetActivities";
import { addWeeks, startOfWeek, format, endOfWeek, startOfDay } from "date-fns";
export const current = startOfDay(new Date());
const this_week = startOfWeek(current);
const next_week = addWeeks(this_week, 1);
const following_week = addWeeks(this_week, 2);

const TimelineNode = ({ isRed = false, text }) => {
  return (
    <div className="timeline-node">
      <div className="timeline-bullet" />
      <div className="timeline-node-text">{text}</div>
    </div>
  );
};

export const TwoWeekActivities = ({ activities, setLots }) => {
  const firstWeek = useMemo(() => {
    return filterActivitiesByDate({
      activities: activities,
      start_date: this_week,
      end_date: next_week,
    });
  }, [activities]);

  const secondWeek = useMemo(() => {
    return filterActivitiesByDate({
      activities: activities,
      start_date: next_week,
      end_date: following_week,
    });
  }, [activities]);

  useEffect(() => {
    setLots(firstWeek?.lots || []);
  }, [firstWeek, setLots]);

  return (
    <>
      <TimelineNode
        isRed={true}
        text={
          "This Week: " +
          format(this_week, "MMM d") +
          " - " +
          format(endOfWeek(this_week), "MMM d")
        }
      />
      <div>
        <GetWeekActivities filtered={firstWeek?.filtered || []} />
      </div>
      <TimelineNode
        text={
          "Next Week: " +
          format(next_week, "MMM d") +
          " - " +
          format(endOfWeek(next_week), "MMM d")
        }
      />
      <div>
        <GetWeekActivities filtered={secondWeek?.filtered || []} />
      </div>
      <TimelineNode
        text={
          "Following Week: " +
          format(following_week, "MMM d") +
          " - " +
          format(endOfWeek(following_week), "MMM d")
        }
      />
    </>
  );
};
