const SUPERMARKET_CATEGORY = {
  name: 'Supermarket',
  slug: 'supermarket',
  description: 'Fresh groceries and everyday supermarket essentials',
};

const DUMMYJSON_GROCERIES_URL = 'https://dummyjson.com/products/category/groceries?limit=0';

const unique = (items) => [...new Set(items.filter(Boolean))];

const toSupermarketProduct = (product) => ({
  title: product.title,
  description: product.description,
  price: product.price,
  discountPercentage: product.discountPercentage || 0,
  rating: product.rating || 0,
  stock: product.stock || 0,
  brand: product.brand || 'Lumina Market',
  category: SUPERMARKET_CATEGORY.slug,
  thumbnail: product.thumbnail,
  images: unique([product.thumbnail, ...(product.images || [])]),
  isFeatured: false,
  tags: unique([SUPERMARKET_CATEGORY.slug, 'groceries', ...(product.tags || [])]),
});

const getSupermarketProducts = async () => {
  const response = await fetch(DUMMYJSON_GROCERIES_URL);

  if (!response.ok) {
    throw new Error(`DummyJSON groceries request failed with ${response.status}`);
  }

  const data = await response.json();
  return (data.products || []).map(toSupermarketProduct);
};

module.exports = {
  SUPERMARKET_CATEGORY,
  getSupermarketProducts,
};
