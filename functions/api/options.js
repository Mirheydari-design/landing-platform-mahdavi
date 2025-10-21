/**
 * /functions/api/options.js
 * وظیفه: خواندن و افزودن گزینه‌های رأی‌گیری
 */

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    }
  });
}

// ✅ GET: لیست گزینه‌ها
export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB
      .prepare("SELECT option, description FROM options ORDER BY option")
      .all();
    return json({ options: results || [] });
  } catch (err) {
    return json({ success: false, error: String(err) }, 500);
  }
}

// ✅ POST: افزودن گزینه جدید
export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json().catch(() => ({}));

    // ورودی‌ها
    const name = (body.name || body.option || "").trim();
    const description = (body.description || "").trim();

    // اعتبارسنجی
    if (!name) return json({ success: false, message: "name required" }, 400);
    if (name.length > 64) return json({ success: false, message: "name too long" }, 400);
    if (description.length > 160) return json({ success: false, message: "tagline too long" }, 400);

    // درج در دیتابیس
    await env.DB.prepare(
      "INSERT OR IGNORE INTO options (option, description) VALUES (?1, ?2)"
    ).bind(name, description).run();

    // تأیید درج
    const { results } = await env.DB
      .prepare("SELECT option FROM options WHERE option = ?1")
      .bind(name)
      .all();

    return json({ success: true, created: results.length > 0 });
  } catch (err) {
    // ✅ مهم: همیشه JSON برگردان تا "<!DOCTYPE" خطا ندهد
    return json({ success: false, error: String(err) }, 500);
  }
}

// ✅ OPTIONS: برای CORS
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
