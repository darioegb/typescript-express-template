import { Roles } from "../enums";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Roles;
    img?: string;
}
