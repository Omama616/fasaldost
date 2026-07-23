// AI Crop Doctor
// Takes a photo of a crop/leaf and returns a structured diagnosis in
// English and Urdu, written for small-holder farmers with basic literacy.
//
// Uses OpenRouter (https://openrouter.ai) as the AI provider, calling a
// free, vision-capable model. OpenRouter's free tier is available more
// broadly by region than calling Google's API directly.

const SYSTEM_PROMPT = `You are Fasal Doctor, an agricultural assistant embedded in a mobile/web app called FasalDost, built for small-holder farmers in rural Punjab, Pakistan who grow crops like wheat, cotton, sugarcane, rice, and vegetables. A farmer will send you a photo of a crop, leaf, or plant, along with the crop name if they know it.

Your job:
1. Look carefully at the image for visible signs of disease, pest damage, nutrient deficiency, or confirm the plant looks healthy.
2. Respond ONLY with a single valid JSON object — no markdown formatting, no code fences, no extra commentary before or after — matching exactly this schema:
{
  "isHealthy": boolean,
  "issueName": string,
  "confidence": "Low" | "Medium" | "High",
  "explanationEnglish": string,
  "explanationUrdu": string,
  "treatmentSteps": string[],
  "confidenceNote": string
}
3. issueName: a short name of the problem (e.g. "Leaf Blight", "Aphid Infestation", "Nitrogen Deficiency"), or "Healthy" if you see no problem.
4. explanationEnglish: 2-4 plain sentences explaining what you see in the image and why you believe this, avoiding technical jargon.
5. explanationUrdu: the same explanation translated into simple, natural Urdu, written in Urdu script.
6. treatmentSteps: 3-5 short, actionable steps in English, written for a farmer with basic literacy (e.g. "Remove and burn affected leaves to stop it spreading", "Improve field drainage since standing water encourages this disease"). If the plant is healthy, give 2-3 short steps for keeping it that way instead.
7. Never recommend a specific chemical brand name. Refer only to general chemical categories (e.g. "a broad-spectrum fungicide", "a nitrogen-rich fertilizer") since exact products, legal availability, and safe dosages vary by region and change over time.
8. confidenceNote: one short sentence reminding the farmer this is an AI opinion, and that for serious, spreading, or uncertain problems they should confirm with their local agriculture extension office (Zarai Tarqiati Idara) or a trusted local expert before applying any chemical.
9. If the image does not clearly show a plant/crop at all, set isHealthy to false, issueName to "Not a crop image", explain that plainly in both languages, and leave treatmentSteps as an empty array.
10. Keep your tone respectful, calm, and encouraging. Never sound alarming, even for serious problems.`;

function extractJson(text) {
  // Models sometimes wrap JSON in ```json fences despite instructions not to.
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST(req) {
  try {
    const { imageBase64, mimeType, cropName } = await req.json();

    if (!imageBase64) {
      return Response.json({ error: "No image provided." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Server is missing OPENROUTER_API_KEY. Set it in your hosting environment variables." },
        { status: 500 }
      );
    }

    const userPrompt = cropName
      ? `The farmer says this crop is: ${cropName}. Analyze the attached photo and respond following the JSON schema exactly.`
      : `The farmer did not specify the crop name. Analyze the attached photo and respond following the JSON schema exactly.`;

    const dataUrl = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;

    const body = {
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      temperature: 0.4,
    };

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenRouter error:", errText);
      return Response.json({ error: "The AI service failed to respond. Please try again." }, { status: 502 });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return Response.json({ error: "The AI did not return a result. Please try another photo." }, { status: 502 });
    }

    let parsed;
    try {
      parsed = extractJson(text);
    } catch {
      console.error("Could not parse AI response:", text);
      return Response.json({ error: "Could not understand the AI's response. Please try again." }, { status: 502 });
    }

    return Response.json(parsed);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong analyzing the photo." }, { status: 500 });
  }
}
