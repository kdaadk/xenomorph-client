import api from "../api";
import { v4 as uuidv4 } from "uuid";
import StreamTypes from "../enums/streamTypes";
import { kalman } from "./kalman";
import { getStreamBy } from "./getStreamBy";
import { getScore } from "./calculateVDOT";
import goTo from "./goTo";

let strava = null;

export const authStrava = stravaApi => {
  const url = stravaApi.oauth.getRequestAccessURL({ scope: "activity:read" });
  goTo(url);
};

export const getStravaActivities = async stravaApi => {
  strava = stravaApi;
  const response = await api.getLastActivity();
  const lastDateActivity = response.data.data[0].startDate;
  const timestampActivity = new Date(lastDateActivity).getTime() / 1000;

  const listActivities = await strava.athlete.listActivities({
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

export const createUser = async () => {
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

const _getStreamsAsync = async id =>
  await strava.streams.activity({
    id: id,
    types: Object.entries(StreamTypes).map(x => x[1])
  });

const _getScoreAsync = async streams => {
  const velocitySmooth = kalman(getStreamBy(StreamTypes.velocity, streams));
  const time = getStreamBy(StreamTypes.time, streams);

  let score = 0;
  for (let i = 1; i < time.length; i++) {
    const velocity = (velocitySmooth[i] + velocitySmooth[i - 1]) / 2;
    const timeInSeconds = time[i] - time[i - 1];
    score += getScore(velocity, timeInSeconds);
  }

  return score.toFixed(2);
};
