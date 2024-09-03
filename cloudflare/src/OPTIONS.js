// 同查找 _U 一样, 查找 KievRPSSecAuth 的值并替换下方的xxx
export const CUSTOM_OPTIONS = {
    KievRPSSecAuth: '',
    _RwBf: '',
    MUID: '',
    _U: '',

    BYPASS_SERVER: '',
    APIKEY: '',
    Go_Proxy_BingAI_BLANK_API_KEY: false,

    Go_Proxy_BingAI_AUTH_KEY: '',

    INFO: '',
    NIGHTLY: false,
}

export const WEB_CONFIG = {
    WORKER_URL: '', // 如无特殊需求请，保持为''
};


export const RAND_IP_COOKIE_NAME = 'BingAI_Rand_IP';
export const AUTH_KEY_COOKIE_NAME = 'BingAI_Auth_Key';

export const SYDNEY_ORIGIN = 'https://sydney.bing.com';
export const BING_ORIGIN = 'https://www.bing.com';
export const BING_SOURCE_ORIGIN = 'https://th.bing.com';
export const BING_SR_ORIGIN = 'https://sr.bing.com';
export const EDGE_ORIGIN = 'https://edgeservices.bing.com';
export const DESIGNER_ORIGIN = 'https://designer.microsoft.com';
export const DESIGNER_CDN_ORIGIN = 'https://cdn.designerapp.osi.office.net';
export const DESIGNER_APP_ORIGIN = 'https://designerapp.officeapps.live.com';
export const DESIGNER_APP_EDOG_ORIGIN = 'https://designerapp.edog.officeapps.live.com';
export const DESIGNER_DOCUMENT_ORIGIN = 'https://document.designerapp.officeapps.live.com';
export const DESIGNER_USERASSETS_ORIGIN = 'https://userassets.designerapp.officeapps.live.com';
export const DESIGNER_MEDIASUGGESTION_ORIGIN = 'https://mediasuggestion.designerapp.officeapps.live.com';
export const DESIGNER_RTC_ORIGIN = 'https://rtc.designerapp.officeapps.live.com';
export const KEEP_REQ_HEADERS = [
  'accept',
  'accept-encoding',
  'accept-language',
  'authorization',
  'connection',
  'cookie',
  'upgrade',
  'user-agent',
  'sec-websocket-extensions',
  'sec-websocket-key',
  'sec-websocket-version',
  'x-request-id',
  'content-length',
  'content-type',
  'access-control-request-headers',
  'access-control-request-method',
  'sec-ms-gec',
  'sec-ms-gec-version',
  'x-client-data',
  'x-ms-client-request-id',
  'x-ms-useragent',
];




export function init_CUSTOM_OPTIONS(env) {
    CUSTOM_OPTIONS.KievRPSSecAuth = env.USER_KievRPSSecAuth || '';
    CUSTOM_OPTIONS._RwBf = env.USER_RwBf || '';
    CUSTOM_OPTIONS.MUID = env.USER_MUID || '';
    CUSTOM_OPTIONS._U = env.Go_Proxy_BingAI_USER_TOKEN || '';
    CUSTOM_OPTIONS.BYPASS_SERVER = env.BYPASS_SERVER || '';
    CUSTOM_OPTIONS.APIKEY = env.APIKEY || '';
    CUSTOM_OPTIONS.Go_Proxy_BingAI_BLANK_API_KEY = (env.Go_Proxy_BingAI_BLANK_API_KEY != '' && env.Go_Proxy_BingAI_BLANK_API_KEY != undefined && env.Go_Proxy_BingAI_BLANK_API_KEY != null);
    CUSTOM_OPTIONS.INFO = env.INFO || '';
    CUSTOM_OPTIONS.NIGHTLY = (env.NIGHTLY != '' && env.NIGHTLY != undefined && env.NIGHTLY != null);
    CUSTOM_OPTIONS.Go_Proxy_BingAI_AUTH_KEY = env.Go_Proxy_BingAI_AUTH_KEY != undefined && env.Go_Proxy_BingAI_AUTH_KEY != null && env.Go_Proxy_BingAI_AUTH_KEY != '' ? env.Go_Proxy_BingAI_AUTH_KEY.split(',') : [];
}
