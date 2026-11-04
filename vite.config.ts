import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },

    importProtection: {
      client: {
        // Keep the default protection for *.server.* files,
        // but drop the **/server/** directory pattern that is
        // blocking src/lib/server/*.functions.ts.
        files: ["**/*.server.*"],
      },
    },
  },
});
