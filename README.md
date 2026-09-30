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

In Wolin Admin, open **Reservations → New reservation**, select the future planned start date, and send the reservation agreement. The signed document records the date and full program terms. The client signs and pays a **$300 non-refundable deposit**, then returns to that same secure agreement link on the planned date to pay the **$3,199 balance**, with the deposit credit already included. The program total remains **$3,499 before applicable tax**.

The date gate uses **America/Denver**. Signing-link expiry applies before signature; the completed agreement remains available for the later payment. Deposit and balance are tracked separately, and the program is paid in full only after both succeed. This creates no subscription or automatic charge, and does not send an automatic start-date reminder. Service starts after payment, account access, and onboarding are complete. Sent agreement dates are immutable; schedule changes require written agreement with the client.

Stripe configuration lives in `api/_lib/reservations.ts`: two separate live one-time products and Payment Links, with stage-specific signed references for reconciliation. Share the client's link from the signed agreement or Admin payment panel; generic Stripe catalog links do not identify the reservation. The webhook validates the agreement, stage, amount, currency, deposit, and date before recording a balance payment. Refunded payments require review and cannot grant a deposit credit. The template is `local-virality-reservation`. Database changes are in migration `20260930020037_add_social_reservations.sql`; signing data remains accessible only through server-side credentials.

Run `npm test`, `npm run lint`, and `npm run build` before deployment. Tests simulate deposit and balance confirmation, Denver date boundaries, signing, admin creation, failures, forged references, duplicate events, and refunds without charging a card or sending a real email. The reservation is intentionally absent from the public offers catalog.
