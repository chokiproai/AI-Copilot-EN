import { bingapiModels, bingapiModel, bingapiChat, bingapiImage, getRandomIP } from "./bingapi.js"
import { CUSTOM_OPTIONS,WEB_CONFIG,RAND_IP_COOKIE_NAME,AUTH_KEY_COOKIE_NAME, SYDNEY_ORIGIN , BING_ORIGIN, BING_SOURCE_ORIGIN, BING_SR_ORIGIN, EDGE_ORIGIN, DESIGNER_ORIGIN, DESIGNER_CDN_ORIGIN, DESIGNER_APP_ORIGIN , DESIGNER_APP_EDOG_ORIGIN , DESIGNER_DOCUMENT_ORIGIN , DESIGNER_USERASSETS_ORIGIN , DESIGNER_MEDIASUGGESTION_ORIGIN, DESIGNER_RTC_ORIGIN , KEEP_REQ_HEADERS } from "./OPTIONS.js"
import { rewriteBody } from "./rewriteBody.js"




/**
 * 随机整数 [min,max)
 * @param {number} min
 * @param {number} max
 * @returns
 */
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * 生成随机字符串
 * @param {number} e
 * @returns
 */
const randomString = (e) => {
  e = e || 32;
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678_-+";
  var n = "";
  for (let i = 0; i < e; i++) n += t.charAt(getRandomInt(0, t.length));
  return n;
}





const challengeResponseBody = `
<html>

<head>
  <script type="text/javascript">
    (() => {
      const verify = async () => {
        const IG = window.parent._G.IG;
        const convId = window.parent.CIB.manager.conversation.id;
        const rid = window.parent.CIB.manager.conversation.messages[0].requestId;
        const iframeid = new URL(window.location.href).searchParams.get('iframeid');
        const TA = window.parent._G.AT;
        const T = await window.parent.aesEncrypt(TA, IG);
        const params = new URLSearchParams();
        params.append("IG", IG);
        params.append("iframeid", iframeid);
        params.append("convId", convId);
        params.append("rid", rid);
        params.append("T", T);
        const res = await fetch('/challenge/verify?' + params, { credentials: 'include' });
        if (!res.ok) {
          if (res.status === 451) {
            throw decodeURI(window.parent.base58Decode(window.parent._G.TIP)) + '. ' + decodeURI(window.parent.base58Decode(window.parent._G.TIPC));
            window.parent.window.$dialog.warning({
							title: decodeURI(window.parent.base58Decode(window.parent._G.TIP)),
							content: decodeURI(window.parent.base58Decode(window.parent._G.TIPC)),
							maskClosable: false,
							closable: false,
							closeOnEsc: false,
						});
          } else {
            throw await res.text();
          }
        }
        const rjson = await res.text();
        if (rjson.indexOf("cct=") < 0) {
          throw "Bypass 服务似乎没有正常工作！请检查BYPASS_SERVER环境变量是否正确配置。";
        }
      }
      window.addEventListener("load", async () => {
        const successDIV = document.getElementById("success");
        const verifyingDIV = document.getElementById("verifying");
        const failDIV = document.getElementById("fail");
        const errorText = document.getElementById("error-text");
        await new Promise((t) => setTimeout(t, 1000));
        try {
          await verify();
        } catch (error) {
          console.error("verify error", error);
          verifyingDIV.style.display = "none";
          failDIV.style.display = "flex";
          errorText.innerText = error;
          errorText.style.display = "block";
          setTimeout(() => location.reload(), 2500);
          return;
        }
        verifyingDIV.style.display = "none";
        successDIV.style.display = "flex";
        setTimeout(() => window.parent.postMessage("verificationComplete", "*"), 2000);
      });
    })();
  </script>
  <style>
    .verifyContainer {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 300px;
      height: 63px;
      background-color: #fafafa;
      border: 1px solid #e0e0e0;
      padding: 0 10px;
    }

    #success-icon {
      display: flex;
      margin-right: 8px;
      border-radius: 50%;
      box-shadow: inset 0 0 0 #038127;
      width: 30px;
      height: 30px;
      animation: scale-up-center 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
      stroke-width: 6px;
      stroke: #f8f8f8;
      stroke-miterlimit: 10;
    }

    #spinner-icon {
      display: flex;
      margin-right: 8px;
      width: 30px;
      height: 30px;
      animation: rotate 5s linear infinite;
    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes scale-up-center {
      0% {
        transform: scale(0.01);
      }

      100% {
        transform: scale(1);
      }
    }

    .circle {
      stroke-width: 3px;
      stroke-linecap: round;
      stroke: #000000;
      stroke-dasharray: 0, 100, 0;
      stroke-dashoffset: 200;
      stroke-miterlimit: 1;
      stroke-linejoin: round;
    }

    .success-circle {
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: #1d1f20;
      fill: #1d1f20;
    }

    .cb-container {
      display: flex;
      align-items: center;
      margin-left: 11px;
    }

    #fail-icon {
      display: flex;
      margin-right: 8px;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      stroke-width: 6px;
      stroke: #f8f8f8;
      stroke-miterlimit: 10;
      box-shadow: inset 0 0 0 #1d1f20;
      animation: fillfail-offlabel 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
    }

    .failure-circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: #1d1f20;
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    @keyframes stroke {
      100% {
        stroke-dashoffset: 0;
      }
    }

    @keyframes fillfail-offlabel {
      100% {
        box-shadow: inset 0 0 0 30px #1d1f20;
      }
    }
  </style>
</head>

<body>
  <p id="error-text" style="font-size: 10px;margin: 0;border: 0;color: red;display: none;"></p>
  <div id="verifyContainer" class="verifyContainer">
    <div id="success" class="cb-container" style="display: none;align-items: center; visibility: visible;" role="alert">
      <svg id="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" aria-hidden="true">
        <circle class="success-circle" cx="26" cy="26" r="25"></circle>
        <path class="p1" d="m13,26l9.37,9l17.63,-18"></path>
      </svg>
      <span id="success-text">成功！</span>
    </div>
    <div id="verifying" class="cb-container" style="display: flex; visibility: visible;align-items: center;">
      <svg id="spinner-icon" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
        class="">
        <line x1="15" x2="15" y1="1.5" y2="5.5" class="circle"></line>
        <line x1="24.5459" x2="24.5459" y1="5.45405" y2="10.45405" transform="rotate(45 24.5459 5.45405)"
          class="circle"></line>
        <line x1="28.5" x2="28.5" y1="15" y2="20" transform="rotate(90 28.5 15)" class="circle"></line>
        <line x1="24.5459" x2="24.5459" y1="24.546" y2="29.546" transform="rotate(135 24.5459 24.546)" class="circle">
        </line>
        <line x1="15" x2="15" y1="28.5" y2="33.5" transform="rotate(180 15 28.5)" class="circle"></line>
        <line x1="5.4541" x2="5.4541" y1="24.5459" y2="29.5459" transform="rotate(-135 5.4541 24.5459)" class="circle">
        </line>
        <line x1="1.5" x2="1.5" y1="15" y2="20" transform="rotate(-90 1.5 15)" class="circle"></line>
        <line x1="5.45408" x2="5.45408" y1="5.45404" y2="10.45404" transform="rotate(-45 5.45408 5.45404)"
          class="circle"></line>
      </svg>
      <div id="verifying-msg">
        <span id="verifying-text">人机验证中...</span>
      </div>
    </div>
    <div id="fail" class="cb-container" style="display: none; visibility: visible;" role="alert">
      <svg id="fail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" aria-hidden="true">
        <circle class="failure-circle" cx="26" cy="26" r="25" fill="none"></circle>
        <path class="failure-cross" fill="none" d="M14.1 27.2 l24.124.2"></path>
      </svg>
      <div id="failure-msg">
        <span id="fail-text">失败！</span>
        <br><span id="fr-helper"><a href="https://github.com/Harry-zklcdc/go-bingai-pass"
            id="fr-helper-link">遇到问题？</a></span>
      </div>
    </div>
  </div>
</body>

</html>
`;

/**
 * challenge
 * @param {Request} request
 * @returns
 */
const challenge = async (request) => {
  if (request.method != 'GET') {
    return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
  }

  const currentUrl = new URL(request.url);
  const newRes = new Response(challengeResponseBody.replaceAll('{{%s}}', currentUrl.searchParams.get('iframeid')));
  newRes.headers.set('Content-Type', 'text/html; charset=utf-8');
  return newRes
};

/**
 * verify
 * @param {Request} request
 * @param {String} cookie
 * @returns
 */
const verify = async (request, cookie) => {
  if (request.method != 'GET') {
    return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
  }

  let reqCookies = request.headers.get('Cookie').split('; ');
  let bypassServer = CUSTOM_OPTIONS.BYPASS_SERVER;
  for (let i = 0; i < reqCookies.length; i++) {
    let cookie = reqCookies[i];
    if (cookie.startsWith('BingAI_Pass_Server')) {
      let tmp = cookie.replace('BingAI_Pass_Server=', '');
      if (tmp !== '') {
        bypassServer = tmp;
        break;
      }
    }
  }

  const currentUrl = new URL(request.url);
  let req = {
    'IG': currentUrl.searchParams.get('IG'),
    'iframeid': currentUrl.searchParams.get('iframeid'),
    'cookies': cookie,
    'convId': currentUrl.searchParams.get('convId'),
    'rid': currentUrl.searchParams.get('rid'),
    'T': currentUrl.searchParams.get('T'),
    'host': WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""),
  }
  const newReq = new Request(bypassServer, {
    method: 'POST',
    body: JSON.stringify(req),
  });
  const res = await fetch(newReq)
  if (res.status != 200) {
    if (res.status === 451) {
      return Response.json({ code: 451, message: "Verification Failed", data: null }, { status: 451 })
    }
    return Response.json({ code: 500, message: "Server Error", data: null }, { status: res.status })
  }
  const resData = await res.json();

  const cookies = resData.result.cookies.split('; ')
  const newRes = Response.json(JSON.stringify(resData));
  for (let v of cookies) {
    newRes.headers.append('Set-Cookie', v + '; path=/');
  }
  return newRes;
};

/**
 * pass
 * @param {Request} request
 * @param {String} cookie
 * @returns
 */
const pass = async (request, cookie) => {
  if (request.method != 'POST') {
    return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
  }

  let resqBody = JSON.parse(await request.text());

  let reqCookies = request.headers.get('Cookie').split('; ');
  let bypassServer = CUSTOM_OPTIONS.BYPASS_SERVER;
  for (let i = 0; i < reqCookies.length; i++) {
    let cookie = reqCookies[i];
    if (cookie.startsWith('BingAI_Pass_Server')) {
      let tmp = cookie.replace('BingAI_Pass_Server=', '');
      if (tmp !== '') {
        bypassServer = tmp;
        break;
      }
    }
  }

  let req = {
    'IG': resqBody['IG'],
    'iframeid': "local-gen-" + crypto.randomUUID(),
    'cookies': cookie,
    'convId': '',
    'rid': '',
    'T': resqBody['T'],
  }
  const newReq = new Request(bypassServer, {
    method: 'POST',
    body: JSON.stringify(req),
  });
  return await fetch(newReq);
};


const login = async (url, headers) => {
  const newReq = new Request(BING_ORIGIN + '/fd/auth/signin?action=interactive&provider=windows_live_id&return_url=https%3a%2f%2fwww.bing.com%2fchat%3fq%3dBing%2bAI%26FORM%3dhpcodx%26wlsso%3d1%26wlexpsignin%3d1&src=EXPLICIT&sig=001DD71D5A386F753B1FC3055B306E8F', {
    method: 'GET',
    headers: headers,
    redirect: 'manual',
  });
  return fetch(newReq);
}

/**
 * bingapi
 * @param {Request} request
 * @param {String} cookie
 * @returns
 */
const bingapi = async (request, cookie) => {
  if (!CUSTOM_OPTIONS.Go_Proxy_BingAI_BLANK_API_KEY && CUSTOM_OPTIONS.APIKEY == '') {
    CUSTOM_OPTIONS.APIKEY = 'sk-' + randomString(32);
  }
  const currentUrl = new URL(request.url);
  if ((currentUrl.pathname.startsWith('/v1/models/')) || (currentUrl.pathname.startsWith('/api/v1/models/'))) {
    return bingapiModel(request, Object.assign({ cookie: cookie }, CUSTOM_OPTIONS));
  }
  if (currentUrl.pathname.startsWith('/v1/models') || currentUrl.pathname.startsWith('/api/v1/models')) {
    return bingapiModels(request, Object.assign({ cookie: cookie }, CUSTOM_OPTIONS));
  }
  if (currentUrl.pathname.startsWith('/v1/chat/completions') || currentUrl.pathname.startsWith('/api/v1/chat/completions')) {
    if (request.method == 'OPTIONS') {
      return Response.json({ code: 200, message: 'OPTIONS', data: null }, {
        headers: {
          "Allow": "POST, OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
        }
      });
    }
    if (request.method != 'POST') {
      return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
    }
    return bingapiChat(request, Object.assign({ cookie: cookie }, CUSTOM_OPTIONS));
  }
  if (currentUrl.pathname.startsWith('/v1/images/generations') || currentUrl.pathname.startsWith('/api/v1/images/generations')) {
    if (request.method == 'OPTIONS') {
      return Response.json({ code: 200, message: 'OPTIONS', data: null }, {
        headers: {
          "Allow": "POST, OPTIONS",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
        }
      });
    }
    if (request.method != 'POST') {
      return Response.json({ code: 405, message: 'Method Not Allowed', data: null }, { status: 405 });
    }
    return bingapiImage(request, Object.assign({ cookie: cookie }, CUSTOM_OPTIONS));
  }
  return Response.json({ code: 404, message: 'API No Found', data: null }, { status: 404 });
};


export async function workerFetch(request, env, ctx,home) {


    const currentUrl = new URL(request.url);
    if (WEB_CONFIG.WORKER_URL == '') {
      WEB_CONFIG.WORKER_URL = currentUrl.origin;
    }
    // if (currentUrl.pathname === '/' || currentUrl.pathname.startsWith('/github/')) {

    if (currentUrl.pathname.startsWith('/sysconf')) {
      let isAuth = true;
      if (CUSTOM_OPTIONS.Go_Proxy_BingAI_AUTH_KEY.length > 0) {
        const cookieStr = request.headers.get('Cookie') || '';
        let cookieObjects = {};
        cookieStr.split(';').forEach(item => {
          if (!item) {
            return;
          }
          const arr = item.split('=');
          const key = arr[0].trim();
          const val = arr.slice(1, arr.length+1).join('=').trim();
          cookieObjects[key] = val;
        })
        if (CUSTOM_OPTIONS.Go_Proxy_BingAI_AUTH_KEY.indexOf(cookieObjects[AUTH_KEY_COOKIE_NAME]) == -1) {
          isAuth = false;
        }
      }
      return Response.json({ code: 200, message: 'success', data: { isSysCK: false, isAuth: isAuth, info: CUSTOM_OPTIONS.INFO } })
    }
    let targetUrl;
    if (currentUrl.pathname.startsWith('/sydney')) {
      targetUrl = new URL(SYDNEY_ORIGIN + currentUrl.pathname + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/th')) {
      targetUrl = new URL(BING_SOURCE_ORIGIN + currentUrl.pathname.replaceAll('/th/th', '/th') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/edgesvc')) {
      targetUrl = new URL(EDGE_ORIGIN + currentUrl.pathname + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/opaluqu')) {
      targetUrl = new URL(BING_SR_ORIGIN + currentUrl.pathname + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer/')) {
      targetUrl = new URL(DESIGNER_ORIGIN + currentUrl.pathname.replaceAll('/designer/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-cdn/')) {
      targetUrl = new URL(DESIGNER_CDN_ORIGIN + currentUrl.pathname.replaceAll('/designer-cdn/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-app/')) {
      targetUrl = new URL(DESIGNER_APP_ORIGIN + currentUrl.pathname.replaceAll('/designer-app/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-app-edog/')) {
      targetUrl = new URL(DESIGNER_APP_EDOG_ORIGIN + currentUrl.pathname.replaceAll('/designer-app-edog/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-document/')) {
      targetUrl = new URL(DESIGNER_DOCUMENT_ORIGIN + currentUrl.pathname.replaceAll('/designer-document/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-userassets/')) {
      targetUrl = new URL(DESIGNER_USERASSETS_ORIGIN + currentUrl.pathname.replaceAll('/designer-userassets/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-mediasuggestion/')) {
      targetUrl = new URL(DESIGNER_MEDIASUGGESTION_ORIGIN + currentUrl.pathname.replaceAll('/designer-mediasuggestion/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/designer-rtc/')) {
      targetUrl = new URL(DESIGNER_RTC_ORIGIN + currentUrl.pathname.replaceAll('/designer-rtc/', '/') + currentUrl.search);
    } else if (currentUrl.pathname.startsWith('/api/ms/login')) {
      targetUrl = new URL(CUSTOM_OPTIONS.BYPASS_SERVER + currentUrl.pathname + currentUrl.search);
    } else {
      targetUrl = new URL(BING_ORIGIN + currentUrl.pathname + currentUrl.search);
    }

    const newHeaders = new Headers();
    request.headers.forEach((value, key) => {
      // console.log(`old : ${key} : ${value}`);
      if (KEEP_REQ_HEADERS.includes(key)) {
        newHeaders.set(key, value);
      }
    });
    newHeaders.set('host', targetUrl.host);
    newHeaders.set('origin', BING_ORIGIN);
    if (request.headers.has('referer') && request.headers.get('referer').indexOf('web/compose.html') != -1) {
      newHeaders.set('referer', 'https://edgeservices.bing.com/edgesvc/compose');
    } else {
      newHeaders.set('referer', 'https://www.bing.com/chat?q=Bing+AI&showconv=1&FORM=hpcodx');
    }
    const randIP = getRandomIP();
    // console.log('randIP : ', randIP);
    newHeaders.set('X-Forwarded-For', randIP);
    const cookie = request.headers.get('Cookie') || '';
    let cookies = cookie;

    if (!cookie.includes('KievRPSSecAuth=')) {
      if (CUSTOM_OPTIONS.KievRPSSecAuth.length !== 0) {
        cookies += '; KievRPSSecAuth=' + CUSTOM_OPTIONS.KievRPSSecAuth;
      } else {
        cookies += '; KievRPSSecAuth=' + randomString(512);
      }
    }
    if (!cookie.includes('_RwBf=')) {
      if (CUSTOM_OPTIONS._RwBf.length !== 0) {
        cookies += '; _RwBf=' + CUSTOM_OPTIONS._RwBf
      }
    }
    if (!cookie.includes('MUID=')) {
      if (CUSTOM_OPTIONS.MUID.length !== 0) {
        cookies += '; MUID=' + CUSTOM_OPTIONS.MUID
      }
    }
    if (!cookie.includes('_U=')) {
      if (CUSTOM_OPTIONS._U.length !== 0) {
        const _Us = CUSTOM_OPTIONS._U.split(',');
        cookies += '; _U=' + _Us[getRandomInt(0, _Us.length)];
      }
    }

    if (currentUrl.pathname === '/turing/captcha/challenge') {
      if (currentUrl.searchParams.get('h') != '' && currentUrl.searchParams.get('h') != null && currentUrl.searchParams.get('h') != undefined) {
        let params = currentUrl.searchParams;
        params.delete('h');
        targetUrl = new URL(BING_ORIGIN + '/turing/captcha/challenge' + (params.toString() == '' ? '' : '?' + params.toString()));
      } else {
        return challenge(request);
      }
    }
    if (currentUrl.pathname === '/challenge/verify') {
      return verify(request, cookies);
    }
    if (currentUrl.pathname.startsWith('/v1') || currentUrl.pathname.startsWith('/api/v1')) {
      return bingapi(request, cookies);
    }
    if (currentUrl.pathname === '/pass') {
      return pass(request, cookies);
    }

    const cookieStr = cookies;
    let cookieObjects = {};
    cookieStr.split(';').forEach(item => {
      if (!item) {
        return;
      }
      const arr = item.split('=');
      const key = arr[0].trim();
      const val = arr.slice(1, arr.length+1).join('=').trim();
      cookieObjects[key] = val;
    })
    delete cookieObjects[RAND_IP_COOKIE_NAME];

    cookies = Object.keys(cookieObjects).map(key => key + '=' + cookieObjects[key]).join('; ');

    newHeaders.set('Cookie', cookies);
    const oldUA = request.headers.get('user-agent') || '';
    const isMobile = oldUA.includes('Mobile') || oldUA.includes('Android');
    if (isMobile) {
      newHeaders.set(
        'user-agent',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.7 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410427012'
      );
    } else {
      newHeaders.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.35');
    }

    if (currentUrl.pathname.startsWith('/fd/auth/signin')) {
      return login(currentUrl, newHeaders);
    }

    // newHeaders.forEach((value, key) => console.log(`${key} : ${value}`));
    const newReq = new Request(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'manual',
    });

    // console.log('request url : ', newReq.url);
    const res = await fetch(newReq);
    const result = await rewriteBody(res);
    const newRes = new Response(result.body, res);
    let setCookies = res.headers.getAll('set-cookie')
    if (setCookies.length > 0) {
      newRes.headers.set('set-cookie', '')
      setCookies.forEach(v => {
        const tmp = v.split('; ')
        newRes.headers.append('set-cookie', tmp[0] + '; path=/')
      })
    }
    result.encoding && newRes.headers.set("Content-Encoding", result.encoding);
    newRes.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
    newRes.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
    newRes.headers.set('Access-Control-Allow-Credentials', 'true');
    newRes.headers.set('Access-Control-Allow-Headers', '*');
    return newRes;
  }

