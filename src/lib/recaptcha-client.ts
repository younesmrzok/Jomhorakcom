export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let recaptchaScriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is only available in the browser."));
  }

  if (window.grecaptcha?.ready && window.grecaptcha?.execute) {
    return Promise.resolve();
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("google-recaptcha-v3");

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "google-recaptcha-v3";
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA."));
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

export async function getRecaptchaToken(action: "login" | "register") {
  const siteKey = RECAPTCHA_SITE_KEY.trim();

  if (!siteKey) {
    throw new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing.");
  }

  await loadRecaptchaScript(siteKey);

  return new Promise<string>((resolve, reject) => {
    const grecaptcha = window.grecaptcha;

    if (!grecaptcha?.ready || !grecaptcha?.execute) {
      reject(new Error("reCAPTCHA API not ready."));
      return;
    }

    grecaptcha.ready(async () => {
      try {
        const token = await grecaptcha.execute(siteKey, { action });
        if (!token) {
          reject(new Error("Empty reCAPTCHA token."));
          return;
        }
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  });
}
