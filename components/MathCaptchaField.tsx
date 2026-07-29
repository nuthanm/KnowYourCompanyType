"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCaptchaApiUrl } from "@/lib/site-meta";

type CaptchaState =
  | { status: "loading" }
  | { status: "ready"; challenge: string; token: string }
  | { status: "error"; message: string };

async function fetchCaptcha(): Promise<{ challenge: string; token: string }> {
  const res = await fetch(getCaptchaApiUrl(), { method: "GET", headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Unable to load CAPTCHA challenge.");
  const json = (await res.json()) as { ok?: boolean; challenge?: string; token?: string };
  if (!json.ok || !json.challenge || !json.token) throw new Error("CAPTCHA challenge is invalid.");
  return { challenge: json.challenge, token: json.token };
}

export function MathCaptchaField({
  answer,
  onAnswerChange,
  onTokenChange,
  resetKey = 0,
  error,
}: {
  answer: string;
  onAnswerChange: (val: string) => void;
  onTokenChange: (token: string) => void;
  resetKey?: number;
  error?: string;
}) {
  const [state, setState] = useState<CaptchaState>({ status: "loading" });
  const onTokenChangeRef = useRef(onTokenChange);
  onTokenChangeRef.current = onTokenChange;

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const { challenge, token } = await fetchCaptcha();
      setState({ status: "ready", challenge, token });
      onTokenChangeRef.current(token);
    } catch {
      setState({ status: "error", message: "CAPTCHA is unavailable right now. Please refresh and try again." });
      onTokenChangeRef.current("");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, resetKey]);

  const challenge = state.status === "ready" ? state.challenge : null;

  return (
    <div className="form-field captcha-field">
      <label htmlFor="captchaAnswer" className="captcha-label">
        Quick check:{" "}
        <span className="captcha-challenge">
          {state.status === "loading" && "Loading…"}
          {state.status === "error" && "Unavailable"}
          {state.status === "ready" && `${challenge} = ?`}
        </span>
        <button
          type="button"
          className="captcha-refresh"
          aria-label="Refresh CAPTCHA"
          onClick={() => void load()}
          disabled={state.status === "loading"}
        >
          ↻
        </button>
      </label>
      <input
        id="captchaAnswer"
        type="number"
        inputMode="numeric"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Your answer"
        autoComplete="off"
        className="captcha-input"
        disabled={state.status !== "ready"}
      />
      {error && <p className="form-error">{error}</p>}
      {state.status === "error" && <p className="form-error">{state.message}</p>}
    </div>
  );
}
