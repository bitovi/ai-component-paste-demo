import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import { extractFormData, FormField } from "@bitovi/ai-component-paste/extractor";

const app = new Hono();

// The UI is served from its own origin (S3/CloudFront), so it calls this API
// cross-origin. localhost is the Vite dev server.
app.use(
  "/*",
  cors({
    origin: ["https://ai-component-paste.bitovi-tools.com", "http://localhost:5173"],
  })
);

app.get("/health", (c) => c.json({ ok: true }));

app.post("/extract-form-data", async (c) => {
  const { text, fields } = await c.req.json<{ text: string; fields: FormField[] }>();

  const formData = await extractFormData(text, fields);

  return c.json(formData);
});

serve({
  fetch: app.fetch,
  port: 3000,
});
