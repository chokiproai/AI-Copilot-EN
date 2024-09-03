import { WEB_CONFIG, BING_ORIGIN, BING_SOURCE_ORIGIN, EDGE_ORIGIN, DESIGNER_ORIGIN, DESIGNER_CDN_ORIGIN, DESIGNER_APP_ORIGIN , DESIGNER_APP_EDOG_ORIGIN , DESIGNER_DOCUMENT_ORIGIN , DESIGNER_USERASSETS_ORIGIN , DESIGNER_MEDIASUGGESTION_ORIGIN, DESIGNER_RTC_ORIGIN } from "./OPTIONS.js"

const replaceURL = (body) => {
    body = body.replaceAll(BING_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
    body = body.replaceAll(EDGE_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", ""));
    body = body.replaceAll(BING_SOURCE_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/th');
    body = body.replaceAll(DESIGNER_CDN_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-cdn');
    body = body.replaceAll(DESIGNER_APP_EDOG_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-app-edog');
    body = body.replaceAll(DESIGNER_DOCUMENT_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-document');
    body = body.replaceAll(DESIGNER_USERASSETS_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-userassets');
    body = body.replaceAll(DESIGNER_MEDIASUGGESTION_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-mediasuggestion');
    body = body.replaceAll(DESIGNER_RTC_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-rtc');
    body = body.replaceAll(DESIGNER_APP_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer-app');
    body = body.replaceAll(DESIGNER_ORIGIN.replace("http://", "").replace("https://", ""), WEB_CONFIG.WORKER_URL.replace("http://", "").replace("https://", "") + '/designer');
    return body
  }
  
export const rewriteBody = async (res) => {
    const content_type = res.headers.get("Content-Type") || "";
    let encoding = null;
    let body = res.body;
    if (content_type.startsWith("text/html") || res.url.endsWith("js")) {
      let decodedContent = new TextDecoder("utf-8").decode(new Int8Array(await res.clone().arrayBuffer()));
      if (decodedContent) {
        // @ts-ignore
        body = replaceURL(decodedContent);
      }
    }
    return { body, encoding };
  }