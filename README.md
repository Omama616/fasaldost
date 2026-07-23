# 🌾 FasalDost — AI Crop Doctor & Farm Diary

**FasalDost** ("Crop Friend") is a free, mobile-friendly web app that helps small-holder farmers
diagnose crop problems from a photo, get farming advice in plain English and Urdu, and keep a
simple digital record of their fields and expenses.

## a. The problem, and who it's for

Small-holder farmers in rural Punjab (and similar regions) often grow up to a handful of acres of
wheat, cotton, rice, sugarcane, or vegetables. When something goes wrong with a crop — a strange
spot on a leaf, wilting, an insect they don't recognize — the nearest agriculture extension
office may be far away, and by the time they get advice, the problem has often spread. At the
same time, most farmers keep no organized record of what they've spent per field, making it hard
to know which crop is actually profitable.

FasalDost puts a basic "agriculture officer in your pocket" on any phone with a camera and a
browser: photograph the problem, get an instant, structured diagnosis with a plain-language
explanation in **both English and Urdu**, and log field expenses as you go — all for free, with
no app-store install and no login required.

## b. Live app

🔗 **[YOUR_LIVE_URL_HERE](YOUR_LIVE_URL_HERE)**

## c. Features

- **Dashboard** — quick overview of your fields, total acreage, total spend, and issues detected.
- **My Fields** — add/remove fields with crop type, area (acres), and sowing date.
- **🩺 AI Crop Doctor** — upload or take a photo of a crop/leaf; the AI returns:
  - whether the plant looks healthy or not, and its confidence level
  - the likely issue name (disease / pest / deficiency)
  - a plain-language explanation in **English and Urdu**
  - 3–5 concrete treatment/next steps (never a specific chemical brand — general categories only,
    with a reminder to confirm dosage locally)
  - a history of all past checks
- **💬 Ask AI (Farm Assistant)** — a chat you can ask any farming question, any time, with answers
  ending in a short Urdu summary.
- **💰 Expenses** — log spend per field by category (seed, fertilizer, pesticide, labor, water,
  equipment, other) and see running totals.
- All data is stored locally in the farmer's own browser (`localStorage`) — no account needed, no
  server database, and nothing to leak.
- Fully responsive — works on a basic Android phone browser.

## d. The AI feature

FasalDost uses **OpenRouter** (a free, multi-provider AI API) calling a free, vision-capable
model (`google/gemma-4-31b-it:free`, with automatic fallback models configured in case that one
is ever rotated out) for two AI features, each driven by a custom system prompt written for this
app (not a generic prompt):

> **Why OpenRouter instead of calling Google directly?** Google's own Gemini API free tier is not
> available to every account/region (some accounts see a hard `limit: 0` on the free tier for
> certain models). OpenRouter re-exposes several models under its own free tier with broader
> availability, so the app works reliably regardless of where it's deployed or which account
> created the key.

### 1. AI Crop Doctor (`/api/diagnose`)
Takes a photo (+ optional crop name) and returns a strict JSON diagnosis. Full system prompt:
