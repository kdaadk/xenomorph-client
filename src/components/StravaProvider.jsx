import React, { useEffect } from "react";
import getUrlParameter from "../shared/getUrlParameter";
import strava, { updateAccessToken } from "../shared/strava";
import goTo from "../shared/goTo";
import Cookies from "universal-cookie";
import api from "../api";
import { getScore } from "../shared/calculateVDOT";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { getStreamBy } from "../shared/getStreamBy";
import { kalman } from "../shared/kalman";
import { v4 as uuidv4 } from "uuid";

let stravaApi = strava;
const StreamTypes = [
  "velocity_smooth",
  "time",
  "distance",
  "latlng",
  "heartrate",
  "cadence",
  "altitude"
];

const StravaProvider = props => {
  useEffect(() => {
    const fetchToken = async () => await stravaApi.oauth.getToken(code);

    const cookies = new Cookies();
    const authCode = cookies.get("auth_code");
    const code = getUrlParameter("code");

    if (code && code !== authCode) {
      fetchToken().then(r => {
        const accessToken = r.access_token;
        cookies.set("auth_code", code);
        cookies.set("access_token", accessToken);

        stravaApi = updateAccessToken(r.access_token);
      });
    }

    const accessToken = cookies.get("access_token");
    if (accessToken) {
      stravaApi = updateAccessToken(accessToken);
    }
  }, []);

  const _auth = () => {
    const url = strava.oauth.getRequestAccessURL({ scope: "activity:read" });
    goTo(url);
  };

  const _getStravaActivities = async () => {
    const response = await api.getLastActivity();
    const lastDateActivity = response.data.data[0].startDate;
    const timestampActivity = new Date(lastDateActivity).getTime() / 1000;

    const listActivities = await stravaApi.athlete.listActivities({
      per_page: "30",
      after: timestampActivity
    }); // 01/01/2020: "1577836800"

    const newActivities = [];
    const newStreams = [];
    for (const a of listActivities) {
      const streams = await _getStreamsAsync(a.id);

      if (a.type === "Run" || a.type === "Ride") {
        newActivities.push({
          _id: uuidv4(),
          stravaActivityId: a.id,
          userId: a.athlete.id,
          type: a.type,
          startDate: a.start_date,
          startPoint: a.start_latlng,
          distance: a.distance,
          time: a.moving_time,
          VDOT: 61,
          mapPolyline: a.map.summary_polyline,
          score: a.type === "Run" && (await _getScoreAsync(streams))
        });
        newStreams.push({
          _id: a.id,
          streams: streams
        });
      }
    }

    await api
      .insertActivities(newActivities)
      .then(async () => await api.insertStreams(newStreams))
      .then(() => window.location.reload());
  };

  const _getStreamsAsync = async id =>
    await stravaApi.streams.activity({ id: id, types: StreamTypes });

  const _getScoreAsync = async streams => {
    const velocitySmooth = kalman(getStreamBy("velocity_smooth", streams));
    const time = getStreamBy("time", streams);

    let score = 0;
    for (let i = 1; i < time.length; i++) {
      const velocity = (velocitySmooth[i] + velocitySmooth[i - 1]) / 2;
      const timeInSeconds = time[i] - time[i - 1];
      score += getScore(velocity, timeInSeconds);
    }

    return score.toFixed(2);
  };

  return (
    <div>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
      >
        <Button onClick={() => _auth()}>Auth Strava</Button>
        <Button onClick={() => _getStravaActivities()}>
          Get last activities from Strava
        </Button>
      </ButtonGroup>
    </div>
  );

  /*const _createUser = async () => {
    await api
      .updateUser({
        _id: uuidv4(),
        stravaUserId: 23648965,
        login: "klopovdmitriy@gmail.com",
        firstName: "Dmitriy",
        lastName: "Klopov",
        height: 173,
        weight: [
          {
            date: new Date(),
            value: 65.5
          }
        ],
        VDOT: [
          {
            date: new Date(),
            value: 59
          }
        ]
      })
      .then(() => console.log("created"));
  };*/
};

export { StravaProvider };
