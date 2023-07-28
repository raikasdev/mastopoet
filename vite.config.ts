import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import stylelint from "vite-plugin-stylelint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { execSync } from "child_process"; // A node library, safe to ignore

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
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
