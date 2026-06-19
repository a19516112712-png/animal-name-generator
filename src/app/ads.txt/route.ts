import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google.com, pub-6710458178434465, DIRECT, f08c47fec0942fa0", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

export const dynamic = "force-static";
