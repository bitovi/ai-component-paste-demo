import { Hono } from "hono";
import { serve } from "@hono/node-server";

import { extractFormData, FormField } from "@bitovi/ai-component-paste/extractor";

const app = new Hono();

app.post("/extract-form-data", async (c) => {
  const { text, fields } = await c.req.json<{ text: string; fields: FormField[] }>();

  const formData = await extractFormData(text, fields);

  return c.json(formData);
});

serve({
  fetch: app.fetch,
  port: 3000,
});
