importScripts('https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.bundle.js');

self.__uv$config = {
    prefix: '/uv/service/',
    bare: 'https://tomp.app/', // Public bare server
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.handler.js',
    bundle: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.sw.js',
};

importScripts('https://unpkg.com/@titaniumnetwork-dev/ultraviolet@2.0.0/dist/uv.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => {
            if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
                return await sw.fetch(event);
            }
            return await fetch(event.request);
        })()
    );
});
