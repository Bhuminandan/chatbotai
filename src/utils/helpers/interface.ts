import { ROLESNAME } from "../constants";

export interface CurrentUser {
    username: string;
    userId: number;
    role_id: number;
    role_name: ROLESNAME;
    distId: number;
  }