export const RECAPTCHA_SITE_KEY = "6LfV6TYtAAAAAB17OtJJ3rWBfpd-JUrrfg1HTOHp";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let recaptchaScriptPromise: Promise<void> | null = null;

function waitForRecaptcha(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("reCAPTCHA is only available in the browser."));
      return;
    }

    const start = Date.now();

    const check = () => {
      if (window.grecaptcha?.ready && window.grecaptcha?.execute) {
        window.grecaptcha.ready(() => resolve());
        return;
      }

      if (Date.now() - start > timeout) {
        reject(new Error("reCAPTCHA API not ready."));
        return;
      }

      setTimeout(check, 200);
    };

    check();
  });
}

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
      // The script tag may already exist but grecaptcha can still take a moment
      // to become available, so resolve and let waitForRecaptcha handle readiness.
      resolve();
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
  await waitForRecaptcha();

  const token = await window.grecaptcha!.execute(siteKey, { action });

  if (!token) {
    throw new Error("Empty reCAPTCHA token.");
  }

  return token;
}
