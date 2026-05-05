import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';

const PRODUCT_PRERENDER_LIMIT = 30;
const PRODUCT_PRERENDER_API_URL =
  process.env['PRODUCT_PRERENDER_API_URL'] ??
  `http://localhost:5000/api/v1/products?limit=${PRODUCT_PRERENDER_LIMIT}`;

type ProductListResponse = {
  products?: Array<{ id?: string }>;
};

const getPrerenderProductParams = async (): Promise<{ id: string }[]> => {
  try {
    const response = await fetch(PRODUCT_PRERENDER_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = (await response.json()) as ProductListResponse;
    const ids = (payload.products ?? [])
      .map((product) => product.id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    console.log(`[prerender] Generating ${ids.length} product pages from API ids`);

    return ids.map((id) => ({ id }));
  } catch (error) {
    console.warn(
      `[prerender] Failed to fetch product ids from ${PRODUCT_PRERENDER_API_URL}. Falling back to SSR only.`,
      error
    );
    return [];
  }
};

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'products',
    renderMode: RenderMode.Server,
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getPrerenderProductParams,
    fallback: PrerenderFallback.Server,
  },
  {
    path: 'cart',
    renderMode: RenderMode.Client,
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'register',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/products',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/orders',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/users',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/settings',
    renderMode: RenderMode.Client,
  },
  {
    path: 'privacy',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'terms',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
