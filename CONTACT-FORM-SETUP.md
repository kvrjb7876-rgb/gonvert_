# Contact form delivery setup

The corporate, Pharma, and Energy inquiry forms post to `/api/contact`. The endpoint validates all public input and sends through Resend only when server-side configuration is present. Corporate inquiries retain the visitor's selected Pharma or Energy context while using the shared public recipient.

Required Vercel environment variables:

- `RESEND_API_KEY` — Resend API key, stored only in Vercel.
- `CONTACT_FROM_EMAIL` — verified sender, for example `GONVERT Website <website@updates.gonvert.com>`.
- `CONTACT_TO_EMAIL` — optional; defaults to the public recipient `info@gonvert.com`.

Before enabling production delivery:

1. Add and verify the chosen sender domain in Resend.
2. Add the variables to the Vercel Production and Preview environments.
3. Redeploy.
4. Submit one corporate Pharma, one corporate Energy, one Pharma-site, and one Energy-site test inquiry and confirm subject, body, recipient, and Reply-To.

Without the first two variables, the endpoint deliberately returns HTTP 503 and the form preserves visitor input while directing the visitor to `info@gonvert.com`.
