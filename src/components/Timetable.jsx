import React, { useEffect, useReducer } from "react";
import "../styles/Timetable.css";
import "../styles/Timetable.scss";
import groupBy from "lodash/groupBy";
import moment from "moment";
import Week from "./Week";

import { UPDATE_ACTIVITIES } from "../actions/activities-actions";
import activitiesReducer from "../reducers/activities-reducer";
import api from "../api";

const useActivitiesApi = initialActivities => {
  const init = initialActivities => {
    return { activities: initialActivities };
  };
  const [state, dispatch] = useReducer(
    activitiesReducer,
    initialActivities,
    init
  );

  useEffect(() => {
    const fetchActivities = async () => await api.getActivities();
    fetchActivities().then(r =>
      dispatch({
        type: UPDATE_ACTIVITIES,
        payload: { activities: r.data.data }
      })
    );
  }, []);

  return state;
};

const Timetable = props => {
  const { activities } = useActivitiesApi([]);
  const headers = moment.weekdays().concat("Total");
  if (!activities || activities.length === 0) {
    return (
      <div className="timetable table-container" role="table">
        <div className="flex-table header headers">
          {headers.map(d => (
            <div key={d} className="flex-row weekdays" role="columnheader">
              {d}
            </div>
          ))}
        </div>
      </div>
    );
  }

  activities.sort((a, b) =>
    a.startDate > b.startDate ? 1 : b.startDate > a.startDate ? -1 : 0
  );
  const activitiesOfWeeksObj = groupBy(activities, e =>
    moment(new Date(e.startDate)).week()
  );
  const activitiesOfWeeksModel = Object.keys(activitiesOfWeeksObj).map(key => ({
    week: key,
    activities: activitiesOfWeeksObj[key]
  }));

  const lastWeek = Math.max(
    ...activitiesOfWeeksModel.map(m => parseInt(m.week))
  );
  const emptyWeeks = Array.from(Array(7).keys(), x => lastWeek + x + 1);

  return (
    <div className="timetable table-container" role="table">
      <div className="flex-table header headers">
        {headers.map(d => (
          <div key={d} className="flex-row weekdays" role="columnheader">
            {d}
          </div>
        ))}
      </div>
      {activitiesOfWeeksModel.map(model => (
        <Week
          activities={model.activities}
          week={model.week}
          year={2020}
          key={model.week}
        />
      ))}
      {emptyWeeks.map(week => (
        <Week week={week} year={2020} key={week} />
      ))}
    </div>
  );
};

export { Timetable };
