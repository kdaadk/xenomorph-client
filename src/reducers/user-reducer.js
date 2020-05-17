import { UPDATE_USER, updateUser } from "../actions/user-actions";

const userReducer = (state = "", { type, payload }) => {
  switch (type) {
    case UPDATE_USER:
      return updateUser(payload.activities, state);
    default:
      return state;
  }
};

export default userReducer;
