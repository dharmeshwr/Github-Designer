"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { redis } from "@/lib/redis";

export async function getCurrentUser(): Promise<Partial<IUser> | null> {
  const cookieStore = await cookies();

  const sid = cookieStore.get("sid")?.value;
  if (!sid) return null;

  const id = await redis.get(sid);
  if (!id) return null;

  await connectDB();
  const user = await User.findOne({ githubId: String(id) }).lean().exec();
  if (!user) return null;

  const { encryptedToken, githubId, _id, __v, login, ...safeUser } = user as any;
  return safeUser as Partial<IUser>;
}

export async function logout() {
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid")?.value;

  if (sid) {
    await redis.del(sid);
    cookieStore.delete("sid");
  }
  redirect("/");
}
