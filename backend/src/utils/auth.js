import crypto from "crypto";

const secret = process.env.TOKEN_SECRET || "gymgenie-local-secret";

export function hashPassword(password) {
  return crypto.createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export function createToken(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function readToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const raw = req.headers.authorization || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;
  const user = readToken(token);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  req.user = user;
  next();
}

