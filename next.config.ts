import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Connects next-intl to i18n/request.ts (language for each page).
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
   /* config options here */
   cacheComponents: true,
   partialPrefetching: true,
   turbopack: {
      rules: {
         "*.css": {
            loaders: ["@tailwindcss/turbopack"],
            as: "*.css",
         },
      },
   },
};

export default withNextIntl(nextConfig);