import request from "supertest";
import { CreateVideoModel } from "./models/CreateVideoModel";
import { app } from "./app";

export const createVideo = async (inputData: CreateVideoModel) => {
  return request(app).post("/videos/").send(inputData);
};


