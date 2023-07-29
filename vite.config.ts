import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import stylelint from "vite-plugin-stylelint";
import { execSync } from "child_process";
import { readFileSync } from "fs";
const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const packageJson = JSON.parse(
  readFileSync("./package.json").toString("utf-8"),
);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    react(),
    stylelint({
      fix: true,
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
});
