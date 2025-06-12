import React from "react";

import { Websocket } from "@/services/ws";
import { useAuthToken } from "@/states/Auth.state";

export const WsConnector = () => {
  const ws = Websocket.getInstance();
  const token = useAuthToken();

  React.useEffect(() => {
    if (token) ws.connect();
    else ws.close();
  }, [token]);

  return null;
};