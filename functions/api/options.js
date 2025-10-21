// /functions/api/options.js
// خواندن/افزودن گزینه‌ها (JSON پایدار) — ترتیب rowid ASC تا جدیدها انتهای لیست باشند

function j(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*", ...extra }
  });
}

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB
      .prepare("SELECT option, description FROM options ORDER BY rowid ASC")
      .all();
    return j({ options: results || [] });
  } catch (err) {
    return j({ success: false, error: String(err) }, 500);
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = (body.name || body.option || "").trim();
    const description = (body.description || "").trim();

    if (!name) return j({ success: false, message: "name required" }, 400);
    if (name.length > 64) return j({ success: false, message: "name too long" }, 400);
    if (description.length > 160) return j({ success: false, message: "tagline too long" }, 400);

    await env.DB
      .prepare("INSERT OR IGNORE INTO options (option, description) VALUES (?1, ?2)")
      .bind(name, description)
      .run();

    const { results } = await env.DB
      .prepare("SELECT option FROM options WHERE option = ?1")
      .bind(name)
      .all();

    return j({ success: true, created: (results || []).length > 0 });
  } catch (err) {
    return j({ success: false, error: String(err) }, 500);
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
