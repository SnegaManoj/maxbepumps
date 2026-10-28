# MAXBE Pumps

MAXBE Pumps product discovery, application guidance, pump finder, and enquiry website.

## Run Locally (PowerShell)

From the workspace root, start the frontend:

```powershell
$env:PORT = "5173"
$env:BASE_PATH = "/"
$env:API_PROXY_TARGET = "http://127.0.0.1:3000"
corepack pnpm --filter @workspace/maxbe-pumps dev
```

To enable enquiry delivery, start the API in a second terminal. Set `ENQUIRY_WEBHOOK_URL` to a trusted HTTPS endpoint that accepts the MAXBE enquiry JSON payload; store the real URL in the deployment's secret/environment settings, not in source control.

```powershell
$env:PORT = "3000"
$env:ENQUIRY_WEBHOOK_URL = "https://your-configured-endpoint"
corepack pnpm --filter @workspace/api-server build
corepack pnpm --filter @workspace/api-server start
```

Set `VITE_WHATSAPP_NUMBER` to the verified international business WhatsApp number using digits only before starting/building the frontend. WhatsApp actions remain hidden if this value is absent or invalid. Enquiry requests return an error, not success, until a delivery webhook is configured and acknowledges them.

## Checks

- `corepack pnpm --filter @workspace/maxbe-pumps typecheck`
- `corepack pnpm --filter @workspace/api-server typecheck`
- `corepack pnpm --filter @workspace/maxbe-pumps build`
- `corepack pnpm --filter @workspace/api-server build`
- `corepack pnpm run typecheck`
- `corepack pnpm run build`

## Stack and Source

- Frontend: React, TypeScript, Vite, Wouter, and the existing CSS design system.
- API: Express 5; `/api/enquiries` validates and rate-limits submissions and forwards only to the server-configured HTTPS webhook.
- Product categories: `artifacts/maxbe-pumps/src/data/products.ts`.
- Brand styles and responsive layouts: `artifacts/maxbe-pumps/src/index.css`.
- API entry and routes: `artifacts/api-server/src/`.

## Production Requirements

- Configure an HTTPS enquiry receiver and verify its acknowledgement contract.
- Configure the verified WhatsApp number if WhatsApp enquiries are wanted.
- Verify product range, model specifications, product photography, manuals, warranty/service terms, and dealer details before publishing those claims.
- The current rate limiter is process-local; use shared rate limiting for a multi-instance deployment.
- No 3D model, official product brochure, or verified dealer directory is currently included.
