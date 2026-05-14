const cdnImage = (category, slug, imageCount = 1) => {
  const base = `https://cdn.dummyjson.com/product-images/${category}/${encodeURIComponent(slug)}`;
  const thumbnail = `${base}/thumbnail.webp`;

  return {
    thumbnail,
    images: [
      thumbnail,
      ...Array.from({ length: imageCount }, (_, index) => `${base}/${index + 1}.webp`),
    ],
  };
};

const productImages = {
  midnightBloom: cdnImage('fragrances', 'chanel-coco-noir-eau-de', 3),
  goldenOud: cdnImage('fragrances', 'gucci-bloom-eau-de', 3),
  crystalSerum: cdnImage('skin-care', 'olay-ultra-moisture-shea-butter-body-wash', 3),
  hydraCream: cdnImage('skin-care', 'vaseline-men-body-and-face-lotion', 3),
  leatherWallet: cdnImage('womens-bags', "heshe-women's-leather-bag", 3),
  silkScarf: cdnImage('tops', 'tartan-dress', 4),
  sunglasses: cdnImage('sunglasses', 'black-sun-glasses', 3),
  headphones: cdnImage('mobile-accessories', 'apple-airpods-max-silver', 1),
  smartWatch: cdnImage('mobile-accessories', 'apple-watch-series-4-gold', 3),
  projector: cdnImage('mobile-accessories', 'tv-studio-camera-pedestal', 1),
  cashmereTurtleneck: cdnImage('tops', 'gray-dress', 4),
  woolBlazer: cdnImage('womens-dresses', 'marni-red-&-black-suit', 4),
  roseParfum: cdnImage('fragrances', "dior-j'adore", 3),
  whiteTeaMist: cdnImage('fragrances', 'dolce-shine-eau-de', 3),
  retinolComplex: cdnImage('skin-care', 'attitude-super-leaves-hand-soap', 3),
  eyeCream: cdnImage('beauty', 'powder-canister', 1),
  spfShield: cdnImage('beauty', 'red-nail-polish', 1),
  pocketSquare: cdnImage('mens-shirts', 'men-check-shirt', 4),
  calfskinBelt: cdnImage('mens-watches', 'brown-leather-belt-watch', 3),
  cufflinks: cdnImage('womens-jewellery', 'green-oval-earring', 3),
  chargingPad: cdnImage('mobile-accessories', 'apple-airpower-wireless-charger', 1),
  earbuds: cdnImage('mobile-accessories', 'apple-airpods', 3),
  cardCase: cdnImage('womens-bags', 'prada-women-bag', 3),
  woolBeanie: cdnImage('mens-shirts', 'gigabyte-aorus-men-tshirt', 4),
  silkShirt: cdnImage('mens-shirts', 'blue-&-black-check-shirt', 4),
  oudCandle: cdnImage('fragrances', 'calvin-klein-ck-one', 3),
  eyePatches: cdnImage('beauty', 'eyeshadow-palette-with-mirror', 1),
  moneyClip: cdnImage('mens-watches', 'rolex-submariner-watch', 3),
  speakerOrb: cdnImage('mobile-accessories', 'amazon-echo-plus', 2),
  chinos: cdnImage('mens-shirts', 'man-plaid-shirt', 4),
};

const productImagesByTitle = {
  'Essence Midnight Bloom': productImages.midnightBloom,
  'Golden Oud Elixir': productImages.goldenOud,
  'Crystal Luminance Serum': productImages.crystalSerum,
  'Obsidian Hydra Cream': productImages.hydraCream,
  'Premium Leather Wallet': productImages.leatherWallet,
  'Silk Knit Scarf': productImages.silkScarf,
  'Noir Aviator Sunglasses': productImages.sunglasses,
  'Pro Wireless ANC Headphones': productImages.headphones,
  'Smart Luxury Watch': productImages.smartWatch,
  '4K Portable Projector': productImages.projector,
  'Cashmere Turtleneck': productImages.cashmereTurtleneck,
  'Tailored Wool Blazer': productImages.woolBlazer,
  'Rose Absolute Parfum': productImages.roseParfum,
  'White Tea Body Mist': productImages.whiteTeaMist,
  'Retinol Night Complex': productImages.retinolComplex,
  'Eye Revival Eye Cream': productImages.eyeCream,
  'SPF 50+ Invisible Shield': productImages.spfShield,
  'Linen Pocket Square': productImages.pocketSquare,
  'Calfskin Belt': productImages.calfskinBelt,
  'Gold Plated Cufflinks': productImages.cufflinks,
  'Wireless Charging Pad': productImages.chargingPad,
  'Noise-Isolating Earbuds': productImages.earbuds,
  'Slim Leather Card Case': productImages.cardCase,
  'Merino Wool Beanie': productImages.woolBeanie,
  'Silk Dress Shirt': productImages.silkShirt,
  'Amber Oud Candle': productImages.oudCandle,
  'Vitamin C Eye Patches': productImages.eyePatches,
  'Titanium Money Clip': productImages.moneyClip,
  'Bluetooth Speaker Orb': productImages.speakerOrb,
  'Slim-Fit Chinos': productImages.chinos,
};

module.exports = {
  productImages,
  productImagesByTitle,
};
