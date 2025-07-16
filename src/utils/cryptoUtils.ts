import crypto from "crypto";
import { Config } from "../config";

const algorithm = "aes-256-cbc";
const secret = Config.ENCRYPTION_KEY!;
const iv = crypto.randomBytes(16);

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secret, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encrypted: string): string {
  const [ivHex, data] = encrypted.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secret, "hex"),
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
