import { createHmac, randomInt } from "node:crypto";

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET ?? "dev-captcha-secret";
const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

type CaptchaOp = "+" | "-" | "*";

function generateChallenge(): { question: string; answer: number } {
  const ops: CaptchaOp[] = ["+", "-", "*"];
  const op = ops[randomInt(0, ops.length)] as CaptchaOp;
  let a: number;
  let b: number;

  if (op === "*") {
    a = randomInt(2, 10);
    b = randomInt(2, 10);
  } else if (op === "-") {
    a = randomInt(5, 20);
    b = randomInt(1, a);
  } else {
    a = randomInt(1, 20);
    b = randomInt(1, 20);
  }

  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  return { question: `${a} ${op} ${b}`, answer };
}

function signToken(answer: number, expiresAt: number): string {
  const payload = `${answer}:${expiresAt}`;
  const sig = createHmac("sha256", CAPTCHA_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function createCaptchaChallenge(): { challenge: string; token: string } {
  const { question, answer } = generateChallenge();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const token = signToken(answer, expiresAt);
  return { challenge: question, token };
}

export function verifyCaptchaToken(token?: string, answer?: number): boolean {
  if (!token || answer === undefined || !Number.isFinite(answer)) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [rawAnswer, rawExpiry, sig] = parts;
    const expectedAnswer = Number(rawAnswer);
    const expiresAt = Number(rawExpiry);
    if (!Number.isFinite(expectedAnswer) || !Number.isFinite(expiresAt)) return false;
    if (Date.now() > expiresAt) return false;
    const payload = `${rawAnswer}:${rawExpiry}`;
    const expectedSig = createHmac("sha256", CAPTCHA_SECRET).update(payload).digest("hex");
    if (sig !== expectedSig) return false;
    return expectedAnswer === answer;
  } catch {
    return false;
  }
}
