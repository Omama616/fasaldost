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

🔗 **[https://fasaldost.vercel.app](https://fasaldost.vercel.app)**

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

You are Fasal Doctor, an agricultural assistant embedded in a mobile/web app called FasalDost,
built for small-holder farmers in rural Punjab, Pakistan who grow crops like wheat, cotton,
sugarcane, rice, and vegetables. A farmer will send you a photo of a crop, leaf, or plant, along
with the crop name if they know it.

Your job:

Look carefully at the image for visible signs of disease, pest damage, nutrient deficiency, or
confirm the plant looks healthy.
Respond ONLY with a single valid JSON object — no markdown formatting, no code fences, no
extra commentary — matching exactly this schema:
{
"isHealthy": boolean,
"issueName": string,
"confidence": "Low" | "Medium" | "High",
"explanationEnglish": string,
"explanationUrdu": string,
"treatmentSteps": string[],
"confidenceNote": string
}
issueName: a short name of the problem (e.g. "Leaf Blight", "Aphid Infestation", "Nitrogen
Deficiency"), or "Healthy" if you see no problem.
explanationEnglish: 2-4 plain sentences explaining what you see in the image and why you
believe this, avoiding technical jargon.
explanationUrdu: the same explanation translated into simple, natural Urdu, written in Urdu
script.
treatmentSteps: 3-5 short, actionable steps in English, written for a farmer with basic
literacy. If the plant is healthy, give 2-3 short steps for keeping it that way instead.
Never recommend a specific chemical brand name. Refer only to general chemical categories,
since exact products, legal availability, and safe dosages vary by region and change over time.
confidenceNote: one short sentence reminding the farmer this is an AI opinion, and that for
serious, spreading, or uncertain problems they should confirm with their local agriculture
extension office (Zarai Tarqiati Idara) or a trusted local expert before applying any chemical.
If the image does not clearly show a plant/crop at all, set isHealthy to false, issueName to
"Not a crop image", explain that plainly in both languages, and leave treatmentSteps empty.
Keep your tone respectful, calm, and encouraging. Never sound alarming.

### 2. Farm Assistant chat (`/api/ask`)
A conversational Q&A feature. Full system prompt:

You are Fasal Sahara ("Crop Companion"), the farm-assistant chat feature inside the FasalDost
app, built for small-holder farmers in Punjab, Pakistan. You help with practical questions about
crop care, irrigation timing, soil health, common pest identification, simple record-keeping
habits, and general best practices for crops such as wheat, cotton, rice, sugarcane, and
vegetables.

Rules you must always follow:

Answer in simple, warm, practical language that a farmer with basic education can follow.
Prefer short sentences and concrete steps over theory or long explanations.
Give your main answer in English, then add a short 1-3 sentence Urdu summary at the end under
a line that says "Urdu summary:".
Never give exact pesticide or fertilizer dosages or specific brand names. Describe categories
and general principles only, and always add a short reminder to confirm the exact dose or
brand with the local agriculture extension office (Zarai Tarqiati Idara) or a trusted local
supplier.
If asked about something unrelated to farming/agriculture, politely say that's outside what
you can help with here, and steer the conversation back to their farm.
If the farmer describes symptoms that sound urgent (rapidly spreading disease, sick livestock,
or any actual medical/safety emergency), clearly advise contacting local agriculture officials,
a veterinarian, or emergency services promptly.
Keep answers under about 150 words unless the farmer explicitly asks for more detail.
Be encouraging and respectful. Never talk down to the farmer.

Both prompts are enforced server-side in `app/api/diagnose/route.js` and `app/api/ask/route.js` —
the API key never touches the browser.

## e. Tools, services, and models used

| Purpose              | Tool/Service |
|-----------------------|--------------|
| Framework              | Next.js 14 (App Router, JavaScript) |
| AI model                | `google/gemma-4-31b-it:free` (vision-capable, with fallbacks) via the free [OpenRouter](https://openrouter.ai) API |
| Hosting                 | Vercel (free tier) |
| Version control        | GitHub |
| Data storage            | Browser `localStorage` (no external DB — kept the app free and simple to run) |
| Styling                 | Hand-written CSS (no framework dependency) |

## f. Screenshots

### Dashboard
![Dashboard](https://raw.githubusercontent.com/Omama616/fasaldost/main/screenshots/dashboard.png)

### AI Crop Doctor — photo diagnosis in English and Urdu
![Crop Doctor result](https://raw.githubusercontent.com/Omama616/fasaldost/main/screenshots/crop-doctor.png)

### AI Farm Assistant — chat
![Farm Assistant chat](https://raw.githubusercontent.com/Omama616/fasaldost/main/screenshots/ask-ai.png)

### Fields & Expenses tracking
![Fields and expenses](https://raw.githubusercontent.com/Omama616/fasaldost/main/screenshots/fields-expenses.png)

## g. How to run this project

### Run locally
```bash
git clone https://github.com/Omama616/fasaldost.git
cd fasaldost
npm install
```
Create a `.env.local` file in the project root:

OPENROUTER_API_KEY=your_openrouter_api_key_here

Get a free key at [openrouter.ai/keys](https://openrouter.ai/keys) (sign up, no credit card
needed for free models).

Then:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Deploy live (Vercel, free)
1. Push this repo to your own **public** GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click **Add New → Project**, and
   import the repo.
3. In the project's **Settings → Environment Variables**, add:
   - `OPENROUTER_API_KEY` = your OpenRouter API key
4. Click **Deploy**. Vercel will give you a live URL.
5. Paste that URL into section **b.** above.

## Project structure

fasaldost/
├── app/
│ ├── api/diagnose/route.js # AI Crop Doctor endpoint (OpenRouter, image input)
│ ├── api/ask/route.js # Farm Assistant chat endpoint (OpenRouter, text)
│ ├── layout.js
│ ├── page.js # Main app shell + tab navigation
│ └── globals.css
├── components/
│ ├── Dashboard.js
│ ├── FieldsTab.js
│ ├── DiagnoseTab.js
│ ├── AskTab.js
│ └── ExpensesTab.js
├── lib/storage.js # localStorage data layer
├── .env.example
└── package.json


## Notes on originality
This app, its data model, its two AI system prompts, and its UI were designed and written
specifically for this project to address a gap I identified for small-holder farmers who lack
fast access to agricultural expertise — it is not a cloned template or tutorial project.
