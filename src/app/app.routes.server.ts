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
      const ids = Array.from({ length: 100 }, (_, i) => i + 1);
      console.log(`[prerender]Generating  ${ids.length} products pages (ids 1-100)`);
      //prams is string
      return ids.map(id => ({ id: id.toString() }));
    },
    //CRITICAL :FALLBACK TO SSR FOR PRODUCT OUTSIDE TOP 100
    //this is ensure products 101+ are stil server-rendered (not found 404)
    fallback: PrerenderFallback.Server //ssr
  }
];
