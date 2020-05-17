import {
  UPDATE_ACTIVITIES,
  updateActivities
} from "../actions/activities-actions";

const activitiesReducer = (state = [], { type, payload }) => {
  switch (type) {
    case UPDATE_ACTIVITIES:
      return updateActivities(payload.activities, state);
    default:
      return state;
  }
};

export default activitiesReducer;
