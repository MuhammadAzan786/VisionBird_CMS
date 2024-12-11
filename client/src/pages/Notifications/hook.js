import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket } from "../../redux/socketSlice";

export const useNotificationHook = () => {
  const socket = useSelector((state) => state.socket.socket);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [state, setState] = useState("check");
  useEffect(() => {
    if (socket) {
      const handleNotification = (data) => {
        console.log("ye aagya data", data);
        setState(data);
      };

      socket.on("notification1", handleNotification);

      return () => {
        socket.off("notification1", handleNotification);
      };
    } else {
      dispatch(initializeSocket(currentUser));
    }
  }, [socket]);
};
