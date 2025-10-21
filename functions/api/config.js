export async function onRequestGet({ env }) {
  const allow = String(env.ADD_OPTIONS_ENABLED ?? "1").toLowerCase();
  const allowAddOptions = !(allow === "0" || allow === "false" || allow === "off");
  return new Response(JSON.stringify({ allowAddOptions }), {
    headers: { "content-type":"application/json", "access-control-allow-origin":"*" }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400"
    }
  });
}
