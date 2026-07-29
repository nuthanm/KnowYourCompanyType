import { jsonResponse } from "@/lib/api/cors";
import { corsPreflightResponse } from "@/lib/api/cors";
import { createCaptchaChallenge } from "@/lib/security/math-captcha";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function GET(request: Request) {
  const { challenge, token } = createCaptchaChallenge();
  return jsonResponse({ ok: true, challenge, token }, request);
}
