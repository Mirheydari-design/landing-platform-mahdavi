export async function onRequestGet(context) {
  const db = context.env.DB;
  // «آخرین رأی هر کاربر» → شمارش بر اساس همون
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
  const { results } = await db.prepare(sql).all();

  const counts = {};
  for (const row of results) counts[row.option] = row.count;

  return new Response(JSON.stringify({ counts }), {
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
  });
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  const { option, userId } = await context.request.json().catch(() => ({}));
  if (!option || !userId) {
    return new Response(JSON.stringify({ success:false, message:"missing fields" }), { status:400 });
  }
  const ts = Date.now();
  await db.prepare("INSERT INTO votes (ts,userId,option) VALUES (?1,?2,?3)")
          .bind(ts, userId, option).run();

  return new Response(JSON.stringify({ success:true }), {
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
  });
}

