package api

import (
	"adams549659584/go-proxy-bingai/common"
	"adams549659584/go-proxy-bingai/common/helper"
	"net/http"
)

const respChallengeHtml = `
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
`

func ChallengeHandler(w http.ResponseWriter, r *http.Request) {
	if !helper.CheckAuth(r) {
		helper.UnauthorizedResult(w)
		return
	}

	if r.Method != "GET" {
		helper.CommonResult(w, http.StatusMethodNotAllowed, "Method Not Allowed", nil)
		return
	}

	if r.URL.Query().Get("h") != "" {
		tmpReq := r.URL.Query()
		tmpReq.Del("h")
		r.URL.RawQuery = tmpReq.Encode()

		common.NewSingleHostReverseProxy(common.BING_URL).ServeHTTP(w, r)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(respChallengeHtml))
}
