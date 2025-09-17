import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { randomUUID } from "crypto";
import { connectDB } from "@/lib/db";
import { encryptToken } from "@/lib/crypto";
import { redis } from "@/lib/redis";
import User, { IUser } from "@/models/User";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await response.json();
  if (!data.access_token) {
    return new Response("Failed to get access token: " + JSON.stringify(data), { status: 400 });
  }
  const accessToken = data.access_token as string;

  const octokit = new Octokit({ auth: accessToken });
  const { data: gitUser } = await octokit.request("GET /user");
  const { data: emails } = await octokit.request("GET /user/emails");
  const verified = emails.find((e: any) => e.verified) || emails[0] || null;
  const email = verified ? verified.email : null;

  await connectDB();

  const encryptedToken = encryptToken(accessToken);

  const filter = { githubId: String(gitUser.id) };
  const update = {
    githubId: String(gitUser.id),
    login: gitUser.login,
    name: gitUser.name ?? gitUser.login,
    email,
    encryptedToken,
  };
  const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

  const user = await User.findOneAndUpdate(filter, update, opts) as Partial<IUser>;

  const sessionId = randomUUID();
  const sessionTTL = 60 * 60 * 24 * 1;

  await redis.set(sessionId, user.githubId, { ex: sessionTTL });

  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.set({
    name: "sid",
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionTTL,
  });
  return res;
}
