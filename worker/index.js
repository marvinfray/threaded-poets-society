/**
 * Walt Proxy — Cloudflare Worker
 *
 * Sits between the /walt page and the Hugging Face Inference API.
 * Keeps the HF token server-side; the browser never sees it.
 *
 * Required Worker secrets (set via wrangler or the CF dashboard):
 *   HF_TOKEN — a free Hugging Face read token
 *
 * Optional Worker vars (set in wrangler.toml [vars]):
 *   ALLOWED_ORIGIN — the GitHub Pages origin, e.g. https://marvinfray.github.io
 *                    Restricts browser cross-origin access to the known site.
 */

const HF_MODEL = "Qwen/Qwen2.5-1.5B-Instruct";
const HF_API   = `https://api-inference.huggingface.co/models/${HF_MODEL}/v1/chat/completions`;

// Walt's character and constraints live here.
// Keep in sync with walt-system-prompt.md in the repository root.
const WALT_SYSTEM_PROMPT = `You are Walt, the Thread Guide for Threaded Poets Society.

You are not a generic chatbot.
You are not here to impress.
You are not here to write over the user.

You help people notice the thread inside an experience.

Your role is to listen carefully, reflect gently, ask one good question at a time, and help the user shape their own words into poetry.

Your tone is calm, spacious, human, and grounded.
You may be poetic, but never performative.
You should prefer the user's own images and phrases over your own.
You should avoid clichés.
You should not rush to produce a finished poem.

When helping a user, follow this rhythm:
1. Notice what is alive in their words.
2. Reflect it back simply.
3. Ask one grounding question.
4. Help them find images, tensions, repetitions, and possible lines.
5. Only draft a poem when the user asks or when enough material has emerged.
6. When drafting, preserve the user's language as much as possible.
7. Offer revisions as invitations, not corrections.

If the user wants to submit a poem, help them prepare:
- title
- author name or chosen attribution
- poem body
- optional context note
- tags or themes
- consent confirmation

Never submit anything automatically.

Keep your replies short — one gentle reflection and one question at a time.
Do not list or enumerate unless the user asks for that structure.
Write in plain prose.`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");

    // Enforce origin restriction for browser requests when ALLOWED_ORIGIN is set.
    // curl and server-to-server calls (no Origin header) are allowed for testing.
    // TODO: add token-bucket rate limiting here before any public launch.
    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
      return new Response("Forbidden", { status: 403 });
    }

    // CORS preflight
    if (request.method === "OPTIONS") {
      return corsify(new Response(null, { status: 204 }), origin, env);
    }

    if (request.method !== "POST") {
      return corsify(new Response("Method not allowed", { status: 405 }), origin, env);
    }

    if (!env.HF_TOKEN) {
      return corsify(
        new Response(JSON.stringify({ error: "HF_TOKEN secret is not configured." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }),
        origin,
        env
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return corsify(new Response("Bad request: invalid JSON.", { status: 400 }), origin, env);
    }

    // Expect { messages: [ { role, content }, ... ] } — user/assistant turns only.
    // The system prompt is always injected here, not trusted from the client.
    const userMessages = (body.messages || []).filter(
      (m) => m.role === "user" || m.role === "assistant"
    );

    if (userMessages.length === 0) {
      return corsify(new Response("Bad request: no messages provided.", { status: 400 }), origin, env);
    }

    const hfRes = await fetch(HF_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: "system", content: WALT_SYSTEM_PROMPT },
          ...userMessages,
        ],
        max_tokens: 400,
        temperature: 0.82,
      }),
    });

    const data = await hfRes.json();
    return corsify(
      new Response(JSON.stringify(data), {
        status: hfRes.status,
        headers: { "Content-Type": "application/json" },
      }),
      origin,
      env
    );
  },
};

function corsify(response, origin, env) {
  const headers = new Headers(response.headers);
  // Echo back the specific allowed origin rather than * when we can.
  const allowedOrigin = env.ALLOWED_ORIGIN || origin || "*";
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, { status: response.status, headers });
}
