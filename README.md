# AI Component Paste Demo

A live demo of [`@bitovi/ai-component-paste`](https://github.com/bitovi/ai-component-paste), a web component that adds an AI-powered **Smart Paste** button to web forms.

**Live demo:** https://ai-component-paste.bitovi-tools.com

## What it does

The demo page shows a "Post a Job" form next to several example job requests written in loose, everyday language. To try it:

1. Click **Copy** on one of the example prompts.
2. Click the Smart Paste (`<ai-paste>`) button on the form.
3. An LLM reads the text and fills in the form: job title, location, salary, contract type, start date, remote toggle, contact email and description.

The demo makes real LLM API calls, so please test it with care.

## How it works

The repo has two parts:

| Part | Path | Description |
|---|---|---|
| UI | [`ui/`](ui/) | A static Vite + TypeScript + Tailwind page that uses the `<ai-paste>` web component. |
| API | [`server/`](server/) | A small [Hono](https://hono.dev) server that sends the pasted text and form field definitions to `extractFormData()` from the library. The LLM call runs on the server, so the API key never reaches the browser. |

API endpoints:

- `POST /extract-form-data` takes `{ text, fields }` and returns the extracted field values.
- `GET /health` is the health check.

## Hosting

The app is hosted on the **Bitovi Cloud Platform (BCP)** and configured in [`deploy/values.yaml`](deploy/values.yaml). It runs as two workloads:

| Workload | Kind | URL | Deploys when |
|---|---|---|---|
| `main` (UI) | Static site (S3 + CloudFront) | https://ai-component-paste.bitovi-tools.com | A push to `main` touches `ui/` ([`deploy-ui.yml`](.github/workflows/deploy-ui.yml)) |
| `api` (server) | Container, port 3000 | https://ai-component-paste-api.bitovi-tools.com | A `v*` tag is pushed ([`deploy.yml`](.github/workflows/deploy.yml)) |

When a release goes out, CI writes the API image tag back into `deploy/values.yaml`, so don't edit that value by hand. The API's secrets, including the LLM API key, come from 1Password at `op://bitovi-platform/ai-component-paste-demo-secrets`.

## Local development

```sh
# API (needs an OpenAI API key)
cd server
npm install
npm run dev                                   # rebuilds dist/index.js on change
OPENAI_API_KEY=... node dist/index.js         # in another terminal, serves :3000

# UI
cd ui
npm install
npm run dev                                   # serves :5173, proxies /extract-form-data to :3000
```
