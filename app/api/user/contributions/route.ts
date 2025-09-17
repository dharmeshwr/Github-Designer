import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { decryptToken } from "@/lib/crypto";
import { Octokit } from "@octokit/rest";
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sid = cookieStore.get("sid")?.value;

    if (!sid) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const githubId = await redis.get<string>(sid);

    if (!githubId) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    await connectDB();
    const user = await User.findOne({ githubId }).exec();

    if (!user) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const yearParam = url.searchParams.get("year");

    const cacheKey = `contributions:${githubId}:${yearParam}`;

    const cachedData = await redis.get<string>(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData, { status: 200 });
    }

    let from: string, to: string;

    if (yearParam === "rolling") {
      const now = new Date();
      const fromDate = new Date(now);
      fromDate.setFullYear(now.getFullYear() - 1);
      from = fromDate.toISOString();
      to = now.toISOString();
    } else {
      const defaultYear = new Date().getFullYear() - 1;
      const yearNum = yearParam ? parseInt(yearParam, 10) : defaultYear;
      const year = Number.isFinite(yearNum) ? yearNum : defaultYear;

      from = new Date(Date.UTC(year, 0, 1, 0, 0, 0)).toISOString();
      to = new Date(Date.UTC(year, 11, 31, 23, 59, 59)).toISOString();
    }

    const rawToken = decryptToken(user.encryptedToken);
    const octokit = new Octokit({ auth: rawToken });

    const query = `
      query ($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  color
                }
              }
            }
          }
        }
      }
    `;
    const vars = { login: user.login, from, to };

    const resp = await octokit.request("POST /graphql", { query, variables: vars });
    const calendar =
      resp.data?.user?.contributionsCollection?.contributionCalendar ??
      resp.data?.data?.user?.contributionsCollection?.contributionCalendar ??
      null;

    if (!calendar) {
      console.warn("no calendar in response", resp);
      return NextResponse.json({ error: "no contributions found" }, { status: 500 });
    }

    const flatCalender = calendar.weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
      }))
    );

    const responsePayload = { calendar: flatCalender, totalContributions: calendar.totalContributions, year: yearParam === "default" ? null : yearParam, from, to };

    await redis.set(cacheKey, JSON.stringify(responsePayload), { ex: 30 });

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("fetch contributions error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
