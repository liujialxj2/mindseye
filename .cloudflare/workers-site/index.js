import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false;

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      );
    }
    event.respondWith(new Response('Internal Error', { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  let options = {};

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      };
    }

    // 检查请求是否为API路径
    if (url.pathname.startsWith('/api/')) {
      // 这里可以处理API请求
      return new Response('API endpoint', { status: 200 });
    }

    // 处理SPA路由
    const parsedUrl = new URL(event.request.url);
    // 如果路径不是静态资源，则返回index.html
    if (!parsedUrl.pathname.includes('.')) {
      options.mapRequestToAsset = req => {
        return getAssetFromKV(event, {
          ...options,
          mapRequestToAsset: () => new Request(`${new URL(req.url).origin}/index.html`, req),
        });
      };
    }

    const page = await getAssetFromKV(event, options);

    // 允许页面被嵌入到iframe中
    const response = new Response(page.body, page);
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Feature-Policy', 'none');

    return response;
  } catch (e) {
    // 如果请求的资源不存在，返回index.html（用于SPA路由）
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        });

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 200,
        });
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
} 