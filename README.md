<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1QXem__msZw0iPdfMYZEvQ4ZgoCO6DzAh

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## CFP Ops

CFP verification operations are documented in [CFP-OPERATIONS.md](./CFP-OPERATIONS.md).
General content fact-check scope is documented in [CONTENT-FACTCHECK.md](./CONTENT-FACTCHECK.md).

Use these files for shared CFP data:

- `supabase-cfp.sql`
- `supabase-cfp-seed.sql`
- `cfp-seed.json`
