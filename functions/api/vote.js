function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type":"application/json", "access-control-allow-origin":"*", ...extra }
  });
}

export async function onRequestGet({ env }) {
  try {
    // فقط «آخرین» رأی هر کاربر شمرده می‌شود
    const sql = `
      WITH last_ts AS (
        SELECT userId, MAX(ts) AS ts
        FROM votes
        GROUP BY userId
      )
      SELECT v.option AS option, COUNT(*) AS count
      FROM votes v
      JOIN last_ts l ON l.userId = v.userId AND l.ts = v.ts
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
    const { option, userId } = await request.json().catch(() => ({}));
    if (!option || !userId) {
      return json({ success: false, message: "missing fields" }, 400);
    }
    const ts = Date.now();
    await env.DB.prepare("INSERT INTO votes (ts,userId,option) VALUES (?1,?2,?3)")
            .bind(ts, userId, option).run();
    return json({ success: true });
  } catch (err) {
    return json({ error: "POST /api/vote failed", detail: String(err) }, 500);
  }
}

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