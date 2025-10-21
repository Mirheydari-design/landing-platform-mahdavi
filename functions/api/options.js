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
  const platformName = (body.name || "").trim();
  const platformTagline = (body.description || "").trim();
  const submitterName = (body.submitterName || "").trim();
  const submitterPhone = (body.phone || "").trim();
  const submitterNationalId = (body.nationalId || "").trim();

  if (!platformName) return new Response(JSON.stringify({ success:false, message:"platform name required" }), { status:400 });
  if (!submitterName) return new Response(JSON.stringify({ success:false, message:"submitter name required" }), { status:400 });
  if (!submitterPhone) return new Response(JSON.stringify({ success:false, message:"phone required" }), { status:400 });
  if (!submitterNationalId) return new Response(JSON.stringify({ success:false, message:"nationalId required" }), { status:400 });

  // Basic validation
  if (!/^09\d{9}$/.test(submitterPhone)) {
    return new Response(JSON.stringify({ success:false, message:"invalid phone format" }), { status:400 });
  }
  if (!/^\d{10}$/.test(submitterNationalId)) {
    return new Response(JSON.stringify({ success:false, message:"invalid nationalId format" }), { status:400 });
  }

  await db.prepare("INSERT OR IGNORE INTO options (option, description, submitterName, phone, nationalId) VALUES (?1,?2,?3,?4,?5)")
          .bind(platformName, platformTagline, submitterName, submitterPhone, submitterNationalId).run();

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

