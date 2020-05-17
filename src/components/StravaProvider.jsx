import React, { Component } from "react";
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

class StravaProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authCode: getUrlParameter("code"),
      cookies: new Cookies()
    };
  }

  async componentDidMount() {
    const { cookies } = this.state;
    const authCode = cookies.get("auth_code");
    const code = getUrlParameter("code");

    if (code && code !== authCode) {
      const payload = await stravaApi.oauth.getToken(code);
      const accessToken = payload.access_token;

      cookies.set("auth_code", code, { path: "/home" });
      cookies.set("access_token", accessToken, { path: "/home" });

      stravaApi = updateAccessToken(payload.access_token);
    }

    const accessToken = cookies.get("access_token");
    if (accessToken) {
      stravaApi = updateAccessToken(accessToken);
    }
  }

  render() {
    return (
      <div>
        <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          <Button onClick={() => this._auth()}>Auth Strava</Button>
          <Button onClick={() => this._getStravaActivities()}>
            Get last activities from Strava
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  _auth() {
    const url = strava.oauth.getRequestAccessURL({ scope: "activity:read" });
    goTo(url);
  }

  _getStravaActivities = async () => {
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
      const streams = await this._getStreamsAsync(a.id);

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
          score: a.type === "Run" && (await this._getScoreAsync(streams))
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

  _getStreamsAsync = async id =>
    await stravaApi.streams.activity({ id: id, types: StreamTypes });

  _getScoreAsync = async streams => {
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

  _createUser = async () => {
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
  };
}

export { StravaProvider };
