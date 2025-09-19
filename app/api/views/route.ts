import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { randomUUID } from "crypto";

const TOTAL_VIEWS_KEY = "heatmap-site:unique_views";

export async function GET() {
  try {
    const cookieStore = await cookies();
    let visitorId = cookieStore.get("visitor-id")?.value;

    if (!visitorId) {
      visitorId = randomUUID();

      const res = NextResponse.json({ newUser: true });
      res.cookies.set("visitor-id", visitorId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: false,
      });

      await redis.incr(TOTAL_VIEWS_KEY);

      return res;
    }

    const count = await redis.get<number>(TOTAL_VIEWS_KEY);

    return NextResponse.json({ newUser: false, views: count ?? 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch views" }, { status: 500 });
  }
}
