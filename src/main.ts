import "dotenv/config";
import "reflect-metadata";

import * as http from "http";
import { AddressInfo } from "net";

import { app } from "./config/express";
import { APP_PORT } from "./constants/env";
import { dataSource } from "./data-source";

async function bootstrap() {
  try {
    await dataSource.initialize();

    const server = http.createServer(app);

    server.listen(process.env[APP_PORT] || 0, async () => {
      const { port } = server.address() as AddressInfo;
      console.log(`Server up on port ${port}!`);
    });
  } catch (error) {
    console.log("error", error);
  }
}

bootstrap();
