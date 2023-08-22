import { Role } from "@/utils/types";

export default class User {
  constructor(
    public name: string,
    public reqNo: string,
    public department: any,
    public role: Role
  ) {}
}
