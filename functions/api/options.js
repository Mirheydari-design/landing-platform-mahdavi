export async function onRequestGet(context) {
  const db = context.env.DB;
  const { results } = await db.prepare("SELECT option, description FROM options ORDER BY option").all();
  return new Response(JSON.stringify({ options: results }), {
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
  });
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  const body = await context.request.json().catch(() => ({}));
  const name = (body.name || "").trim();
  const description = (body.description || "").trim();

  if (!name) return new Response(JSON.stringify({ success:false, message:"name required" }), { status:400 });

  await db.prepare("INSERT OR IGNORE INTO options (option, description) VALUES (?1,?2)")
          .bind(name, description).run();

  return new Response(JSON.stringify({ success:true }), {
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

