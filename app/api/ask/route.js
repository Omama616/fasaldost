// AI Farm Assistant
// A simple chat feature for general farming questions, written for
// small-holder farmers in Punjab, Pakistan.
//
// Uses OpenRouter (https://openrouter.ai) as the AI provider, calling a
// free model. OpenRouter's free tier is available more broadly by region
// than calling Google's API directly.

const SYSTEM_PROMPT = `You are Fasal Sahara ("Crop Companion"), the farm-assistant chat feature inside the FasalDost app, built for small-holder farmers in Punjab, Pakistan. You help with practical questions about crop care, irrigation timing, soil health, common pest identification, simple record-keeping habits, and general best practices for crops such as wheat, cotton, rice, sugarcane, and vegetables.

Rules you must always follow:
1. Answer in simple, warm, practical language that a farmer with basic education can follow. Prefer short sentences and concrete steps over theory or long explanations.
2. Give your main answer in English, then add a short 1-3 sentence Urdu summary at the end under a line that says "Urdu summary:".
3. Never give exact pesticide or fertilizer dosages or specific brand names. Describe categories and general principles only, and always add a short reminder to confirm the exact dose or brand with the local agriculture extension office (Zarai Tarqiati Idara) or a trusted local supplier, since dosages depend on local regulations and product concentration.
4. If asked about something unrelated to farming/agriculture, politely say that's outside what you can help with here, and steer the conversation back to their farm.
5. If the farmer describes symptoms that sound urgent (e.g. rapidly spreading disease across a field, sick livestock, or any actual medical or safety emergency), clearly advise them to contact local agriculture officials, a veterinarian, or emergency services promptly, in addition to anything else you say.
6. Keep answers under about 150 words unless the farmer explicitly asks for more detail.
7. Be encouraging and respectful. Many farmers you talk to have limited formal education — never talk down to them.`;

export async function POST(req) {
  try {
    const { question, history } = await req.json();

    if (!question || !question.trim()) {
      return Response.json({ error: "Please type a question." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Server is missing OPENROUTER_API_KEY. Set it in your hosting environment variables." },
        { status: 500 }
      );
    }

    // Map prior chat turns (if any) into OpenAI-style chat messages.
    const priorTurns = (history || []).slice(-8).map((turn) => ({
      role: turn.role === "user" ? "user" : "assistant",
      content: turn.text,
    }));

    const body = {
      // Free models on OpenRouter rotate in and out with little notice, so
      // we list a primary plus fallbacks — OpenRouter tries them in order.
      models: [
        "google/gemma-4-31b-it:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemma-4-26b-a4b-it:free",
      ],
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...priorTurns,
        { role: "user", content: question },
      ],
      temperature: 0.6,
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
      return Response.json({ error: "The AI did not return an answer. Please try rephrasing." }, { status: 502 });
    }

    return Response.json({ answer: text });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong answering your question." }, { status: 500 });
  }
}
