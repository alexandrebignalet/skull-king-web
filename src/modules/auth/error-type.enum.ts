import { ValuesOf } from "@/utils";

export const errorTypes = {
  UPDATE_USER: "UPDATE_USER",
  REGISTER: "REGISTER",
  LOGIN: "LOGIN"
} as const;

export type ErrorType = ValuesOf<typeof errorTypes>;
