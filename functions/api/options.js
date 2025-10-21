export async function onRequestGet(context) {
  const db = context.env.DB;
  const { results } = await db.prepare(
    "SELECT option, description FROM options ORDER BY option"
  ).all();
  return new Response(JSON.stringify({ options: results }), {
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
  });
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  const env = context.env;

  // سوئیچ روشن/خاموش از تنظیمات Pages → Settings → Variables
  const allow = String(env.ADD_OPTIONS_ENABLED ?? "1").toLowerCase();
  const isEnabled = !(allow === "0" || allow === "false" || allow === "off");
  if (!isEnabled) {
    return new Response(JSON.stringify({ success:false, code:"disabled" }), {
      status: 403,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
    });
  }

  const body = await context.request.json().catch(() => ({}));
  let name = (body.option || body.name || "").trim().replace(/\s+/g, " ");
  const description = (body.description || "").trim();

  if (!name) return new Response(JSON.stringify({ success:false, message:"name required" }), { status:400 });

  // محدودیت‌های منطقی
  if (name.length > 64)  return new Response(JSON.stringify({ success:false, message:"name too long" }), { status:400 });
  if (description.length > 160) return new Response(JSON.stringify({ success:false, message:"tagline too long" }), { status:400 });

  // درج (تکراری را نادیده می‌گیرد)
  await db.prepare("INSERT OR IGNORE INTO options (option, description) VALUES (?1,?2)")
          .bind(name, description).run();

  // بفهمیم واقعاً درج شد یا قبلاً وجود داشت
  const { results } = await db.prepare("SELECT option FROM options WHERE option=?1").bind(name).all();
  const created = results.length > 0; // در هر صورت الان وجود دارد

  return new Response(JSON.stringify({ success:true, created }), {
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
  });
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