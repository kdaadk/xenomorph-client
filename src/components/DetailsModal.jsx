import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { ActivityMap } from "./ActivityMap";
import { getStreamBy } from "../shared/getStreamBy";
import api from "../api";
import { kalman } from "../shared/kalman";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import "../shared/stringExtensions";
import "../styles/DetailsModal.scss";
import { getSections } from "../shared/getSections";
import { VelocityChart } from "./VelocityChart";
import TextField from "@material-ui/core/TextField";
import { SatisfactionRating } from "./SatisfactionRating";
import { SectionTable } from "./SectionTable";
import { getAverageVelocity } from "../shared/getAverageVelocity";
import StreamTypes from "../enums/streamTypes";

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
};

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    height: 950,
    width: 950,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5]
  }
}));

const getStreams = async id => {
  const response = await api.getStream(id);
  return response.data.data;
};

const DetailsModal = props => {
  const { openModal, setOpenModal, activity } = props;
  const [isRun] = useState(activity.type === "Run");
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const [satisfaction, setSatisfaction] = useState(
    Number(activity.satisfaction)
  );
  const [comment, setComment] = useState(Number(activity.comment));
  const [open, setOpen] = useState(Boolean(openModal));

  const handleClose = async () => {
    activity.comment = comment;
    activity.satisfaction = satisfaction;
    await api.updateActivity(activity).then(() => {
      setOpenModal(false);
      setOpen(false);
    });
  };

  const handleCommentChange = event => setComment(event.currentTarget.value);

  const [streams, setStreams] = useState({
    loading: false,
    velocity: [],
    distance: [], 
    latlng: [],
    sections: []
  });

  useEffect(() => {
    setStreams({ loading: true, distance: [], velocity: [], latlng: [], sections: [] });
    getStreams(activity.stravaActivityId).then(doc => {
      const time = getStreamBy(StreamTypes.time, doc.streams);
      const velocity = kalman(getStreamBy(StreamTypes.velocity, doc.streams));
      const distance = getStreamBy(StreamTypes.distance, doc.streams);
      const sections = getSections(velocity, distance, time, activity);
      setStreams({
        loading: false,
        distance: distance,
        velocity: velocity,
        latlng: getStreamBy(StreamTypes.latlng, doc.streams),
        sections: sections
      });
    });
  }, [activity]);

  const body = (
    <Fade in={open}>
      <div style={modalStyle} className={classes.paper}>
        {!streams.loading && (
            <div className={classes.root} id="details-modal-content">
              <div className="row">
                {isRun && (
                    <SectionTable
                        className="sections-table"
                        sections={streams.sections}
                    />
                )}
                <div className="map" style={{ width: isRun ? "74%" : "100%" }}>
                  <ActivityMap
                      center={activity.startPoint}
                      latlng={streams.latlng}
                  />
                  <div className="main-info">
                <span className="column">
                  Avg speed:{" "}
                  {getAverageVelocity(activity.distance, activity.time)}
                </span>
                    <span className="column">Distance: {activity.distance}</span>
                    <span className="column">
                  Time: {activity.time.toString().toHHMMSS()}
                </span>
                  </div>
                  <div className="input-info">
                    <SatisfactionRating
                        defaultValue={satisfaction}
                        setValue={setSatisfaction}
                    />
                    <TextField
                        style={{ width: "70%", marginLeft: "5%" }}
                        label="Comment"
                        defaultValue={activity.comment}
                        onChange={handleCommentChange}
                    />
                  </div>
                </div>
              </div>
              <VelocityChart
                  className="chart"
                  distance={streams.distance}
                  velocity={streams.velocity}
              />
            </div>
        )}        
      </div>
    </Fade>
  );

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      {body}
    </Modal>
  );
};

export { DetailsModal };
