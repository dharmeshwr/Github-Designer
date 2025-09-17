import crypto from "crypto";

const KEY_HEX = process.env.ENCRYPTION_KEY;
if (!KEY_HEX) throw new Error("ENCRYPTION_KEY is not set in env (generate with `openssl rand -hex 32`)");

const KEY = Buffer.from(KEY_HEX, "hex");
if (KEY.length !== 32) throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters)");

const ALGO = "aes-256-gcm";

export function encryptToken(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptToken(payload: string): string {
  const [ivHex, tagHex, encryptedHex] = payload.split(":");
  if (!ivHex || !tagHex || !encryptedHex) throw new Error("Invalid encrypted payload");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
