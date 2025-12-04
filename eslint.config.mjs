// eslint.config.mjs
import nextConfig from "eslint-config-next";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // Next.js 公式の Flat Config を丸ごと採用
  ...nextConfig,

  // 自作ルール、追加プラグイン
  {
    plugins: {
      import: importPlugin,
    },

    rules: {
      // import 順
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

  // prettier を一番最後に当てる（競合回避）
  prettierConfig,

  // 無視パターン
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]);
