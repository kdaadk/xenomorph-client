export const UPDATE_ACTIVITIES = "activities:updateActivities";

export const updateActivities = (newActivities, state) => {
  return { ...state, activities: newActivities };
};
