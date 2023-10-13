import type { AblyMessageCallback } from "ably/react";
import SupabaseDB from "./supabase-client";
import * as React from "react";
import * as ably from "ably";
import { channel } from "diagnostics_channel";

const clientID = process.env.NEXT_PUBLIC_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ABLY_API;

const useAblyProvider = ({
  userId,
  docId,
  callback,
}: {
  userId: string;
  docId: string;
  callback: any;
}): [usePublishAbly: (payload: any) => void] => {
  const currChannel = `doc-${docId}-change`;
  const supabaseDB = new SupabaseDB();
  const client = new ably.Realtime({ key: apiKey, clientId: clientID });

  React.useEffect(() => {
    client.connect();

    client.connection.on("connected", (val) => {
      console.log("ably connected");
    });

    client.channels.get(currChannel).subscribe((message) => {
      supabaseDB.stream(docId, message.data);
      callback(message);
    });

    return () => {
      client.close();
    };
  }, [docId]);

  const usePublishAbly = (payload: any) => {
    const channel = client.channels.get(currChannel);

    channel.publish(docId, payload);
  };

  return [usePublishAbly];
};

export default useAblyProvider;
