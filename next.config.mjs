/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import path from "path";
import { fileURLToPath } from "url";
import WithPWA from "next-pwa";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = WithPWA({
  dest: "public",
});

/** @type {import("next").NextConfig} */
const config = withPWA({
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  sassOptions: {
    fiber: false,
    includePaths: [path.join(__dirname, "styles")],
  },
});

export default config;
