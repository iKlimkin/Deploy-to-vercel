import request from "supertest";
import { CreateVideoT, app } from "./settings";

export const createVideo = async (inputData: CreateVideoT) => {
  return request(app).post("/videos/").send(inputData);
};


