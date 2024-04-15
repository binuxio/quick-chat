import { UserObject } from "./user.types";

export const usersMap = new Map<number, { currentSocketIDs: string[] }>()