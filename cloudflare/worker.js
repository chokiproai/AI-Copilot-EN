import { CUSTOM_OPTIONS,init_CUSTOM_OPTIONS } from "./src/OPTIONS"
import { workerFetch } from './src/worker'
import { rewriteBody } from "./src/rewriteBody.js"

export default {
    /**
     * fetch
     * @param {Request} request
     * @param {*} env
     * @param {*} ctx
     * @returns
     */
    async fetch(request, env, ctx) {
        init_CUSTOM_OPTIONS(env);
        const currentUrl = new URL(request.url);
        if (currentUrl.pathname === '/' || currentUrl.pathname.indexOf('/web/') === 0) {
            return home(currentUrl.pathname);
        }
        return workerFetch(request, env, ctx);
    }
}

/**
 * home
 * @param {string} pathname
 * @returns
 */
async function home(pathname){
    let baseUrl;
    if (CUSTOM_OPTIONS.NIGHTLY) {
        baseUrl = 'https://raw.githubusercontent.com/Harry-zklcdc/go-proxy-bingai/nightly/';
    } else {
        baseUrl = 'https://raw.githubusercontent.com/Harry-zklcdc/go-proxy-bingai/master/';
    }
    let url;
    if (pathname.indexOf('/web/') === 0) {
        url = pathname.replace('/web/', baseUrl + 'web/');
        if (pathname == '/web/') {
            url += 'index.html';
        }
    } else {
        let res = new Response('', {
            status: 302,
        });
        res.headers.set("location", "/web/");
        return res;
    }
    const res = await fetch(url);
    const result = await rewriteBody(res);
    const newRes = new Response(result.body, res);
    if (pathname.endsWith('.js')) {
        newRes.headers.set('content-type', 'application/javascript');
    } else if (pathname.endsWith('.css')) {
        newRes.headers.set('content-type', 'text/css');
    } else if (pathname.endsWith('.svg')) {
        newRes.headers.set('content-type', 'image/svg+xml');
    } else if (pathname.endsWith('.ico') || pathname.endsWith('.png')) {
        newRes.headers.set('content-type', 'image/png');
    } else {
        newRes.headers.set('content-type', 'text/html; charset=utf-8');
    }
    newRes.headers.delete('content-security-policy');
    return newRes;
};