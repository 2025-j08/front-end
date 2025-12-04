// eslint.config.mjs
import nextConfig from "eslint-config-next";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // ① Next.js の Flat Config
  ...nextConfig,

  // ② import 順序など、自分の追加ルール
  {
    plugins: {
      import: importPlugin,
    },

    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
        },
      ],
    },
  },

  // ③ Prettier 
  prettierConfig,

  // ④ ignores
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]);
