// /functions/api/vote.js
// Count = آخرین رأی هر userId

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*", ...extra }
  });
}

export async function onRequestGet({ env }) {
  try {
    // آخرین رأی هر کاربر
    const sql = `
      WITH last_ts AS (
        SELECT userId, MAX(ts) AS ts
        FROM votes
        WHERE userId IS NOT NULL AND userId <> ''
        GROUP BY userId
      )
      SELECT v.option AS option, COUNT(*) AS count
      FROM votes v
      JOIN last_ts l ON l.userId = v.userId AND l.ts = v.ts
      GROUP BY v.option
      ORDER BY count DESC
    `;
    const { results } = await env.DB.prepare(sql).all();
    const counts = {};
    (results || []).forEach(r => { counts[r.option] = Number(r.count || 0); });
    return json({ counts });
  } catch (err) {
    return json({ error: "GET /api/vote failed", detail: String(err) }, 500);
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json().catch(() => ({}));
    const option = (body.option || "").trim();
    const userId = (body.userId || "").trim();
    if (!option || !userId) return json({ success: false, message: "missing fields" }, 400);

    const ts = Date.now();
    // جدول votes باید ستون‌های ts, userId, option را داشته باشد (تو قبلاً اضافه کردی)
    await env.DB
      .prepare("INSERT INTO votes (ts, userId, option) VALUES (?1, ?2, ?3)")
      .bind(ts, userId, option)
      .run();

    return json({ success: true });
  } catch (err) {
    return json({ error: "POST /api/vote failed", detail: String(err) }, 500);
  }
}

// CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400"
    }
  });
}
