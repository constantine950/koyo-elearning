import { Request } from "express";
import { IUser } from "./user";

export interface Context {
  req: Request;
  user?: IUser;
}
