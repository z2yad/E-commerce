import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
//server routes
//this page on demand عند الطلب
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender //ssg
  },
  {
    path: 'products',
    renderMode: RenderMode.Server //ssr
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Prerender //ssg
    ,
    async getPrerenderParams(): Promise<{ id: string; }[]> {
      //call api to get products ids
      const ids = Array.from({ length: 30 }, (_, i) => i + 1);
      console.log(`[prerender]Generating  ${ids.length} products pages (ids 1-30)`);
      //prams is string
      return ids.map(id => ({ id: id.toString() }));
    },
    //CRITICAL :FALLBACK TO SSR FOR PRODUCT OUTSIDE TOP 30
    //this is ensure products 31+ are stil server-rendered (not found 404)
    fallback: PrerenderFallback.Server //ssr
  },
  {
    path: 'cart',
    renderMode: RenderMode.Client //csr
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Client //csr
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client //csr
  }
];
