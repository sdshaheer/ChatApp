import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: false,
    loginUser: {},
  },
  reducers: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
    },
    setLoginUser(state, action) {
      state.loginUser = action.payload;
    },
  },
});

export const authActions = AuthSlice.actions;
export default AuthSlice.reducer;
