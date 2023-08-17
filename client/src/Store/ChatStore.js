import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
    notification: [],
    highlightId: null,
  },
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    setNotification(state, action) {
      state.notification = action.payload;
    },
    setHighlightId(state, action) {
      state.highlightId = action.payload;
    },
  },
});

export const chatActions = ChatSlice.actions;
export default ChatSlice.reducer;
