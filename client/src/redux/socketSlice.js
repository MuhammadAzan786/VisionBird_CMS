import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    clearSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.socket = null;
    },
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;

export const initializeSocket = (user) => (dispatch, getState) => {
  const { socket } = getState().socket;

  if (!socket) {
    if (!user || !user._id) {
      console.error(
        "User or user ID is missing. Socket connection cannot be initialized."
      );
      return;
    }
    const Backend_url =
      import.meta.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_DOMAIN_NAME
        : import.meta.env.VITE_BACKEND_LOCAL_ADDRESS;
    const socketInstance = io(Backend_url, {
      query: { id: user._id },
    });

    socketInstance.on("connect", () => {
      console.log(
        `From Redux: ${user.role} ${user.employeeName} connected to server`
      );
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    dispatch(setSocket(socketInstance));
  }
};

export default socketSlice.reducer;
