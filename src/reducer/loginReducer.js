export let loginInitialState = {
  username: "",
  password: "",
};

function loginReducer(state, { type, payload }) {
  switch (type) {
    case "username":
      return {
        ...state,
        username: payload.currentValue,
      };

    case "password":
      return {
        ...state,
        password: payload.currentValue,
      };

    default:
      state = { ...state };
  }

  return state;
}

export default loginReducer;
