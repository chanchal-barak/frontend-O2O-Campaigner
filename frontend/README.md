# O2O Campaigner Frontend Starter

React + Vite frontend wired to the existing O2O Campaigner FastAPI API. This is a separate frontend scaffold; it does not modify the backend repository.

## Included screens
- Public landing page, registration and login
- Role-aware customer, merchant and admin navigation
- Customer nearby offers with live category dropdown, browser geolocation, manual coordinate fallback, radius filter and voucher claim
- Customer voucher list
- Merchant store creation with all live category IDs and browser geolocation, store list and soft-suspend action
- Merchant offer creation, list, publish and cancel
- Merchant invoice creation, billing totals and manual payment-status update
- Basic admin merchant controls

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env` (optional; the default API URL points to the deployed backend).
3. Run `npm install`.
4. Run `npm run dev` and open the URL Vite prints.

## API configuration
Default base URL: `https://o2o-campaigner.onrender.com/api/v1`
Override with `VITE_API_BASE_URL` in `.env`.

## Critical integration notes
- Category choices are fetched from `GET /api/v1/merchant/stores/categories`. The UI never hard-codes category names or UUIDs; the selected category UUID is sent unchanged as `category_id`. This supports all 73 categories currently documented by the backend.
- Customer nearby search calls `GET /api/v1/customer/offers` with `latitude`, `longitude`, `radius_km`, and optional `category_id` query parameters. Browser location is requested only after a user action; manual latitude/longitude is available if permission is denied.
- Merchant store creation calls `POST /api/v1/merchant/stores` with `lat`, `lng`, `category_id`, and the required Google Maps sharing link. Browser location is requested after clicking the capture-location button; manual coordinates are also supported.
- Money fields that use `*_paise` are converted from rupees to integer paise before sending. Fixed-offer `value` is in rupees according to the backend guide; percentage offer `value` is a percentage.
- API errors including 401/403/404/409/422 are surfaced to the user. A 401 clears the session token.
- The backend integration guide says the current FastAPI app does not yet configure CORS middleware. If the frontend is served from a different origin, the backend maintainer must allow the frontend origin in CORS. This frontend does not patch or bypass that backend setting.
- Authentication token is stored in `sessionStorage` for this starter. Review the final deployment's security/session requirements before production use.
- Admin accounts cannot be registered from the UI; the backend guide says they must be provisioned by an authorized operator.
- Billing/invoice paid status is a manual in-app record, not payment-gateway confirmation or external POS integration.

## Before submission
Test all flows against `/docs` and `/openapi.json`. API contracts may change; the live OpenAPI schema is authoritative. In particular, test real account roles, category payloads, store verification, date/time validation, claim conflicts, invoice totals, and CORS from the actual frontend origin.
