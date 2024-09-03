import { init_CUSTOM_OPTIONS } from "./src/OPTIONS"
import { workerFetch } from './src/worker'


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
        if (currentUrl.pathname === '/') {
            let res = new Response('', {
                status: 302,
            });
            res.headers.set('location', '/web/');
            return res;
        }
        if (currentUrl.pathname.indexOf('/web/') === 0) {
            return env.ASSETS.fetch(request);
        }
        return workerFetch(request, env, ctx);
    }
}