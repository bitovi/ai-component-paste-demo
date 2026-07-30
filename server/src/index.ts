import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import { extractFormData, FormField } from "@bitovi/ai-component-paste/extractor";

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true }));

app.post("/extract-form-data", async (c) => {
  const { text, fields } = await c.req.json<{ text: string; fields: FormField[] }>();

  const formData = await extractFormData(text, fields);

  return c.json(formData);
});

// Serve the built UI (ui/dist) same-origin, resolved from the app root (cwd).
app.use("/*", serveStatic({ root: "./ui/dist" }));

serve({
  fetch: app.fetch,
  port: 3000,
});
