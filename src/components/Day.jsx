import React, { useState } from "react";
import Activity from "./Activity";
import SvgIcon from "@material-ui/core/SvgIcon";

const PlusIcon = props => {
  return (
    <SvgIcon {...props}>
      <path d="M 12 2 C 6.476562 2 2 6.476562 2 12 C 2 17.523438 6.476562 22 12 22 C 17.523438 22 22 17.523438 22 12 C 22 6.476562 17.523438 2 12 2 Z M 17 13 L 13 13 L 13 17 L 11 17 L 11 13 L 7 13 L 7 11 L 11 11 L 11 7 L 13 7 L 13 11 L 17 11 Z M 17 13 " />
    </SvgIcon>
  );
};

const Day = props => {
  const [hovered, setHovered] = useState(false);

  const { activities, momentDate } = props;
  const monthStyle = momentDate.month() % 2 === 1 ? " odd" : " even";
  const style = "flex-row".concat(monthStyle);
  const day = momentDate.format("D");
  const month = momentDate.format("MMMM").toUpperCase();

  if (!activities) {
    return (
      <div
        className={style.concat(" empty")}
        role="cell"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="date-header">
          <div className="day-number">{day}</div>
          <div className="month-name">{day === "1" && month}</div>
        </div>
        {hovered && (
          <PlusIcon color="primary" onClick={() => console.log("plus")} />
        )}
      </div>
    );
  }

  const cellStyle = activities.length > 1 ? "flex-cell activity" : "activity";
  return (
    <div className={style} role="cell">
      <div className="date-header">
        <div className="day-number">{day}</div>
        <div className="month-name">{day === "1" && month}</div>
      </div>
      {activities.map((e, idx) => (
        <Activity activity={e} key={idx} style={cellStyle} />
      ))}
    </div>
  );
};

export { Day };
