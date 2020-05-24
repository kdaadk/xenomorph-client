import React, { useState } from "react";
import runner from "../images/runner.png";
import cycle from "../images/cycle.png";
import ski from "../images/ski.png";
import { DetailsModal } from "./DetailsModal";

const Activity = props => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const setDetailsModalState = value => setOpenDetailsModal(value);

  const renderActivity = (type, imgSrc, activity) => {
    return (
      activity.type === type && (
        <span>
          <img src={imgSrc} alt={type} width="32" height="32" />
          <span> {getDescription(activity)}</span>
        </span>
      )
    );
  };

  const getDescription = activity => {
    return `${(activity.distance / 1000).toFixed(0)} km ${(
      activity.time / 60
    ).toFixed(0)} min`;
  };

  let { activity, style } = props;

  if (activity.score > 20 && activity.type === "Run")
    style = style.concat(" hard-work");

  return (
    <div>
      <button
        className={style}
        role="cell"
        onClick={() => setDetailsModalState(true)}
      >
        {activity.type === "Run" && (
          <span>
            <img src={runner} alt="Run" width="32" height="32" />
            {`${(activity.distance / 1000).toFixed(0)} km ${
              activity.score
            } score`}
          </span>
        )}
        {renderActivity("Ride", cycle, activity)}
        {renderActivity("Ski", ski, activity)}
      </button>
      {openDetailsModal && (
        <DetailsModal
          openModal={openDetailsModal}
          setOpenModal={setDetailsModalState}
          activity={activity}
        />
      )}
    </div>
  );
};

export { Activity };
