import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

// Koden er kopiert in fra setup til Kinde og behandler alle Kinde autorisering endepunkter
// request: NextRequest -> NextRequest er bare typen til request
export async function GET(request: NextRequest, { params }: any) {
    const endpoint = params.kindeAuth;
    return handleAuth(request, endpoint);
}