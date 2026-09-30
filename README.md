# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Private 90-day reservations

In Wolin Admin, open **Reservations → New reservation**, select a future planned start date, and send the **$300 non-refundable deposit agreement**. This document reserves the date only. Once it is signed and paid, open its payment panel and choose **Prepare $3,199 program agreement**. Send that separate agreement, which has its own signing link, PDF, Stripe product, checkout link, and payment record. The client signs it separately and purchases the program on the recorded start date. The paid deposit is credited once, so the two purchases total **$3,499 before applicable tax**.

The regular **$3,499 program agreement** and reserved **$3,199 program agreement** share the same service terms and require a start date; only their title and price differ. Program checkout opens on that date in **America/Denver**. Signing-link expiry applies before signature; a signed agreement remains available for its later payment. The paid deposit's link never becomes program checkout. One signed, paid deposit can be linked to one active program agreement for the same client, business, and date. Void an unused program agreement before creating a replacement.

These are one-time purchases, with no subscription, automatic charge, or automatic start-date reminder. Service starts after signature, payment, account access, and onboarding are complete. Sent agreement dates are immutable; schedule changes require written agreement with the client.

Stripe configuration lives in `api/_lib/payment-links.ts` and `api/_lib/reservations.ts`. Share the client's checkout from their signed agreement or Admin payment panel; generic Stripe catalog links do not identify the agreement. The webhook validates each agreement's signed reference, product link, amount, currency, and start date. Reserved program payments also require the linked paid deposit. Refunded payments require review and cannot grant a deposit credit. Templates are `local-virality-reservation`, `local-virality-90-day-reserved`, and `local-virality-90-day`. Database changes are in the social reservation migrations; signing data remains accessible only through server-side credentials.

Run `npm test`, `npm run lint`, and `npm run build` before deployment. Tests simulate deposit and balance confirmation, Denver date boundaries, signing, admin creation, failures, forged references, duplicate events, and refunds without charging a card or sending a real email. The reservation is intentionally absent from the public offers catalog.
