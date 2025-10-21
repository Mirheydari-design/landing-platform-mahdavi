function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*", ...extra }
  });
}

// هش ساده‌ی IP با سالت
async function sha256Hex(s) {
  const buf = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestGet({ env }) {
  try {
    // شمارش «آخرین رأی هر شهر» (اگر city نبود، با ip_hash گروه‌بندی کن)
    const sql = `
      WITH last_votes AS (
        SELECT COALESCE(city, ip_hash) AS k, MAX(ts) AS ts
        FROM votes
        GROUP BY k
      )
      SELECT v.option AS option, COUNT(*) AS count
      FROM votes v
      JOIN last_votes l
        ON l.k = COALESCE(v.city, v.ip_hash) AND l.ts = v.ts
      GROUP BY v.option
    `;
    const { results } = await env.DB.prepare(sql).all();
    const counts = {};
    results.forEach(r => counts[r.option] = Number(r.count || 0));
    return json({ counts });
  } catch (err) {
    return json({ error: "GET /api/vote failed", detail: String(err) }, 500);
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const { option } = await request.json().catch(() => ({}));
    if (!option) return json({ success: false, message: "missing option" }, 400);

    const ts = Date.now();

    const headers = request.headers;
    const ua = headers.get("user-agent") || "";
    const ref = headers.get("referer") || "";
    const ip = headers.get("cf-connecting-ip") || "";
    const country = (request.cf && request.cf.country) || ""; // Pages Functions
    const city = (request.cf && request.cf.city) || "";

    const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop";
    const path = new URL(request.url).pathname;
    const salt = env.IP_SALT || "";
    const ip_hash = ip ? await sha256Hex(ip + salt) : "";

    await env.DB.prepare(`
      INSERT INTO votes (ts, option, ip_hash, ua, device, country, city, ref, path)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
    `).bind(ts, opt
