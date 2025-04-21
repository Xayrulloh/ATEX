import { connect, NatsConnection, StringCodec } from "nats";

let nats: NatsConnection;

export const getNatsClient = async (): Promise<NatsConnection> => {
  if (!nats) {
    nats = await connect({ servers: "nats://localhost:4222" });
    console.log("🔌 Connected to NATS");
  }

  return nats;
};

export const sc = StringCodec();
