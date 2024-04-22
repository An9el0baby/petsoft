// import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

// export function middleware(request: Request) {
//   console.log(request.url);
//   return NextResponse.next();
// }

export default auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
