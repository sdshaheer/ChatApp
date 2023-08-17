import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AuthSliceReducer from "./AuthStore";
import ModalSliceReducer from "./ModalStore";
import ChatSliceReducer from "./ChatStore";

const reducer = combineReducers({
  auth: AuthSliceReducer,
  modal: ModalSliceReducer,
  chat: ChatSliceReducer,
});

const store = configureStore({ reducer });
export default store;
