export type ProductCategory = {
  name: string;
  slug: string;
  description: string;
  image: string;
  tag: string;
};

export type CatalogueCategoryFilter = 'all' | 'agriculture' | 'domestic';

export function matchesCatalogueCategory(category: ProductCategory, filter: CatalogueCategoryFilter): boolean {
  if (filter === 'all') return true;
  const agricultural = /agricultural|borewell|open-well|solar/.test(category.slug);
  return filter === 'agriculture'
    ? agricultural
    : /low-voltage|monoblock|centrifugal|self-priming/.test(category.slug);
}

export const categories: ProductCategory[] = [
  {
    name: 'Borewell Submersible Pumps',
    slug: 'borewell-submersible-pumps',
    description: 'High-lift submersible pumps engineered for deep agricultural and residential borewells.',
    image: '/images/submersible-pump.jpg',
    tag: 'DEEP WELL',
  },
  {
    name: 'Open Well Submersible Pumps',
    slug: 'open-well-submersible-pumps',
    description: 'Submerged pumps designed for open wells, canals, sumps, and irrigation tanks.',
    image: '/images/submersible-assembly.jpg',
    tag: 'OPEN WELL',
  },
  {
    name: 'Agricultural Irrigation Pumps',
    slug: 'agricultural-irrigation-pumps',
    description: 'Heavy-duty pumps delivering high discharge for flood, drip, and sprinkler irrigation.',
    image: '/images/centrifugal-pump.jpg',
    tag: 'AGRICULTURE',
  },
  {
    name: 'Monoblock Pumps',
    slug: 'monoblock-pumps',
    description: 'Compact, efficient monoblock pumps for farm water transfer and household supply.',
    image: '/images/monoblock-pump.jpg',
    tag: 'MONOBLOCK',
  },
  {
    name: 'Low-Voltage Pumps',
    slug: 'low-voltage-pumps',
    description: 'Engineered to start and run smoothly under severe low-voltage rural conditions.',
    image: '/images/low-voltage-pump.jpg',
    tag: 'LOW VOLTAGE KING',
  },
  {
    name: 'Centrifugal Pumps',
    slug: 'centrifugal-pumps',
    description: 'High-volume centrifugal pumps for agricultural circulation and bulk water transfer.',
    image: '/images/centrifugal-pump.jpg',
    tag: 'HIGH FLOW',
  },
  {
    name: 'Self-Priming Pumps',
    slug: 'self-priming-pumps',
    description: 'Instant self-priming pumps ideal for domestic overhead tanks and garden watering.',
    image: '/images/self-priming-pump.jpg',
    tag: 'SELF-PRIMING',
  },
  {
    name: 'Drainage and Sewage Pumps',
    slug: 'drainage-and-sewage-pumps',
    description: 'Robust solids-handling pumps for dirty water, drainage, and agricultural runoff.',
    image: '/images/drainage-pump.jpg',
    tag: 'DRAINAGE',
  },
  {
    name: 'Solar Pumps',
    slug: 'solar-pumps',
    description: 'Solar-powered pumping systems designed for off-grid rural and agricultural fields.',
    image: '/images/low-voltage-pump.jpg',
    tag: 'SOLAR POWERED',
  },
  {
    name: 'Electric Motors & Spares',
    slug: 'electric-motors-and-pump-accessories',
    description: 'High-torque induction motors, control starter panels, and certified pump accessories.',
    image: '/images/low-voltage-pump.jpg',
    tag: 'MOTORS & SPARES',
  },
];

export const productBySlug = (slug: string) => categories.find((category) => category.slug === slug);
