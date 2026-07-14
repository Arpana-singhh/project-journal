import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// This route is never cached: every request must re-check the caller's
// session cookie and can carry a request-specific body/query.
export const dynamic = "force-dynamic";

// Headers that must not be blindly forwarded from the browser to Express -
// either because they describe *this* hop (host/content-length/...), or
// because auth is decided by the proxy itself, never by a client-supplied header/cookie.
const STRIPPED_REQUEST_HEADERS = [
  "cookie",
  "authorization",
  "host",
  "content-length",
  "transfer-encoding",
];

// Headers that describe the proxy -> browser hop (or would conflict with
// values Next.js/undici will set correctly on the outgoing response) and so
// must not be copied verbatim from the Express response.
const STRIPPED_RESPONSE_HEADERS = [
  "set-cookie",
  "content-length",
  "content-encoding",
  "transfer-encoding",
];

async function handleProxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const backendBaseUrl = process.env.API_BASE_URL;

  if (!backendBaseUrl) {
    return NextResponse.json(
      { success: false, message: "Backend URL is not configured" },
      { status: 500 }
    );
  }

  const { path } = await context.params;
  const targetUrl = `${backendBaseUrl}/${path.join("/")}${request.nextUrl.search}`;

  const forwardedHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!STRIPPED_REQUEST_HEADERS.includes(key.toLowerCase())) {
      forwardedHeaders.set(key, value);
    }
  });

  // Read the backend access token straight out of the HttpOnly NextAuth
  // cookie, entirely server-side. The browser never sees this value.
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token?.accessToken) {
    forwardedHeaders.set("Authorization", `Bearer ${token.accessToken}`);
  }

  const methodHasBody = !["GET", "HEAD"].includes(request.method);

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers: forwardedHeaders,
    body: methodHasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  backendResponse.headers.forEach((value, key) => {
    if (!STRIPPED_RESPONSE_HEADERS.includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  const responseBody = await backendResponse.arrayBuffer();

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

export const GET = handleProxyRequest;
export const POST = handleProxyRequest;
export const PUT = handleProxyRequest;
export const PATCH = handleProxyRequest;
export const DELETE = handleProxyRequest;
