import { User } from "next-auth";

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
    };
  }
}
