export async function onRequestPost({ request, env }) {
  try {
    const { prompt, model = "gemini-2.5-flash", generationConfig } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid 'prompt'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const keys = [
      env.GEMINI_API_KEY_1,
      env.GEMINI_API_KEY_2,
      env.GEMINI_API_KEY_3,
      env.GEMINI_API_KEY_4
    ].filter(Boolean);

    if (keys.length === 0) {
      return new Response(JSON.stringify({ error: "No Gemini API keys configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const pickKey = () => keys[Math.floor(Math.random() * keys.length)];

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    if (generationConfig && typeof generationConfig === "object") {
      requestBody.generationConfig = generationConfig;
    }

    let lastError;
    for (let i = 0; i < keys.length; i++) {
      const key = pickKey();
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });

        const text = await res.text();
        if (!res.ok) {
          lastError = new Error(`Upstream error ${res.status}: ${text}`);
          continue;
        }

        return new Response(text, {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    return new Response(JSON.stringify({ error: "All Gemini API keys failed", detail: String(lastError || "unknown") }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad request", detail: String(e) }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}


