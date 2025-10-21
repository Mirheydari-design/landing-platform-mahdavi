// /functions/api/propose.js
// ثبت پیشنهاد جدید (گزینه + اطلاعات شخصی)
// مرحله ۱: ذخیره در جدول proposals
// مرحله ۲: افزودن گزینه به جدول options

function j(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*", ...extra }
  });
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json().catch(()=> ({}));
    const name = (body.name || body.option || '').trim();
    const tagline = (body.description || body.tagline || '').trim();
    const full_name = (body.full_name || '').trim();
    const phone = (body.phone || '').trim();
    const national_id = (body.national_id || '').trim();

    if (!name) return j({ success:false, message:"name required" }, 400);

    // ذخیره در جدول proposals
    await env.DB.prepare(`
      INSERT INTO proposals (option_name, tagline, full_name, phone, national_id)
      VALUES (?1, ?2, ?3, ?4, ?5)
    `).bind(name, tagline, full_name, phone, national_id).run();

    // ذخیره گزینه در جدول options (برای نمایش عمومی)
    await env.DB.prepare(`
      INSERT OR IGNORE INTO options (option, description)
      VALUES (?1, ?2)
    `).bind(name, tagline).run();

    return j({ success:true, stored:true });
  } catch (err) {
    return j({ success:false, error:String(err) }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status:204,
    headers:{
      "access-control-allow-origin":"*",
      "access-control-allow-methods":"POST,OPTIONS",
      "access-control-allow-headers":"content-type",
      "access-control-max-age":"86400"
    }
  });
}
