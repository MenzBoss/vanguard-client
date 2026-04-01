# Client

Setup for Web3Forms integration:

- Copy `.env.example` to `.env` in the `client/` folder.
- Set `VITE_WEB3FORMS_ACCESS_KEY` to the access key from https://web3forms.com.
- Restart the dev server if it's running (`npm run dev` inside `client`).

Behavior:
- If `VITE_WEB3FORMS_ACCESS_KEY` is set, the contact form will submit directly to Web3Forms.
- If not set, the form falls back to the existing `/contact` server endpoint.
