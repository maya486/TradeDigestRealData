import React from "react";

export const TimelineNode = ({ isRed = false, text }) => {
  return (
    <div className="timeline-node">
      <div className="timeline-bullet" />
      <div className="timeline-node-text">{text}</div>
    </div>
  );
};
