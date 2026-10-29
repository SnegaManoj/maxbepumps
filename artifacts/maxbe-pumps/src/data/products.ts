export type ProductCategory = {
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
};

export type ProductModel = {
  slug: string;
  name: string;
  model: string;
  categorySlug: string;
  description: string;
  image: string;
  galleryViews?: ProductGalleryView[];
  motorPower: string;
  maxHead: string;
  specifications?: { label: string; value: string }[];
  features?: string[];
  applications?: string[];
};

export type ProductGalleryView = {
  label: 'Top' | 'Front' | 'Left' | 'Right';
  image: string;
  alt: string;
};

export type CatalogueCategoryFilter = 'all' | 'agriculture' | 'domestic';

export function matchesCatalogueCategory(category: ProductCategory, filter: CatalogueCategoryFilter): boolean {
  if (filter === 'all') return true;
  return filter === 'agriculture'
    ? category.slug === 'v4-submersible'
    : category.slug === 'monoblock' || category.slug === 'openwell';
}

export const categories: ProductCategory[] = [
  {
    name: 'Monoblock Pumps',
    slug: 'monoblock',
    description: 'Surface-mounted pumps for domestic water supply, garden irrigation and light agriculture.',
    image: '/images/samples/monoblock-pump-blue-sample.jpg',
    icon: '🔧',
  },
  {
    name: 'Open Well Submersible',
    slug: 'openwell',
    description: 'Submersible pumps for open wells, sumps and rainwater harvesting pits.',
    image: '/images/samples/submersible-assembly-sample.jpg',
    icon: '💧',
  },
  {
    name: 'V4 Submersible Pumps',
    slug: 'v4-submersible',
    description: '4-inch borewell pumps for deep installations in agriculture and buildings.',
    image: '/images/samples/submersible-pump-sample.jpg',
    icon: '⚡',
  },
];

export const products: ProductModel[] = [
  {
    slug: 'maxbe-monoblock-0-5hp',
    name: 'MAXBE Monoblock Pump',
    model: 'MB-0.5HP',
    categorySlug: 'monoblock',
    description: 'Compact self-priming monoblock pump for domestic water supply, garden irrigation and small-scale agriculture.',
    image: '/images/samples/monoblock-pump-blue-sample.jpg',
    motorPower: '0.5 HP (0.37 kW)',
    maxHead: 'Up to 25 m',
    specifications: [
      { label: 'Motor Power', value: '0.5 HP (0.37 kW)' },
      { label: 'Voltage', value: '220–240 V, 50 Hz, Single Phase' },
      { label: 'Max Flow Rate', value: 'Up to 30 LPM' },
      { label: 'Max Head', value: 'Up to 25 m' },
      { label: 'Suction Head', value: 'Up to 7 m' },
      { label: 'Outlet Size', value: '25 mm (1 inch)' },
      { label: 'Body Material', value: 'Cast Iron' },
      { label: 'Impeller', value: 'Brass' },
      { label: 'Motor Type', value: 'TEFC (Totally Enclosed Fan Cooled)' },
      { label: 'Insulation Class', value: 'F' },
    ],
    features: ['Self-priming up to 7 m', 'Compact lightweight design', 'Thermal overload protection', 'Low noise operation', 'Easy maintenance access'],
    applications: ['Domestic water supply', 'Garden irrigation', 'Small farms', 'Water boosting'],
  },
  {
    slug: 'maxbe-monoblock-1hp',
    name: 'MAXBE Monoblock Pump',
    model: 'MB-1HP',
    categorySlug: 'monoblock',
    description: 'A single-phase monoblock pump for medium-duty household and agricultural water use.',
    image: '/images/samples/monoblock-pump-blue-sample.jpg',
    motorPower: '1 HP (0.75 kW)',
    maxHead: 'Up to 32 m',
    specifications: [
      { label: 'Motor Power', value: '1 HP (0.75 kW)' },
      { label: 'Voltage', value: '220–240 V, 50 Hz, Single Phase' },
      { label: 'Max Flow Rate', value: 'Up to 50 LPM' },
      { label: 'Max Head', value: 'Up to 32 m' },
      { label: 'Suction Head', value: 'Up to 7 m' },
      { label: 'Outlet Size', value: '25 mm (1 inch)' },
      { label: 'Body Material', value: 'Cast Iron' },
      { label: 'Impeller', value: 'Brass' },
      { label: 'Motor Type', value: 'TEFC' },
      { label: 'Insulation Class', value: 'F' },
    ],
    features: ['Heavy-duty cast iron body', 'Stainless steel shaft', 'Built-in thermal protection', 'Smooth vibration-free operation', 'Wide voltage tolerance'],
    applications: ['Domestic water supply', 'Agriculture', 'Water boosting', 'Industrial light duty'],
  },
  {
    slug: 'maxbe-monoblock-2hp',
    name: 'MAXBE Monoblock Pump',
    model: 'MB-2HP',
    categorySlug: 'monoblock',
    description: 'A 2 HP monoblock pump for agriculture, irrigation and industrial fluid transfer.',
    image: '/images/samples/monoblock-pump-blue-sample.jpg',
    motorPower: '2 HP (1.5 kW)',
    maxHead: 'Up to 35 m',
  },
  {
    slug: 'maxbe-openwell-0-5hp',
    name: 'MAXBE Open Well Submersible Pump',
    model: 'OW-0.5HP',
    categorySlug: 'openwell',
    description: 'A single-phase submersible pump for open wells, sump pits and rainwater harvesting tanks.',
    image: '/images/samples/submersible-assembly-sample.jpg',
    motorPower: '0.5 HP (0.37 kW)',
    maxHead: 'Up to 15 m',
    specifications: [
      { label: 'Motor Power', value: '0.5 HP (0.37 kW)' },
      { label: 'Voltage', value: '220–240 V, 50 Hz, Single Phase' },
      { label: 'Max Flow Rate', value: 'Up to 40 LPM' },
      { label: 'Max Head', value: 'Up to 15 m' },
      { label: 'Max Submergence', value: '10 m' },
      { label: 'Outlet Size', value: '32 mm (1.25 inch)' },
      { label: 'Body Material', value: 'Cast Iron + SS304' },
      { label: 'Impeller', value: 'Nylon / Noryl' },
      { label: 'Cable Length', value: '10 m (standard)' },
      { label: 'Protection', value: 'IP68' },
    ],
    features: ['Fully submersible waterproof design', 'IP68 rated motor enclosure', 'Stainless steel shaft and fasteners', 'Thermal overload protection', 'Suitable for slightly sandy water'],
    applications: ['Open wells', 'Sump pits', 'Rainwater tanks', 'Residential water supply'],
  },
  {
    slug: 'maxbe-openwell-1hp',
    name: 'MAXBE Open Well Submersible Pump',
    model: 'OW-1HP',
    categorySlug: 'openwell',
    description: 'A 1 HP open well submersible pump for medium-depth wells and agricultural sump applications.',
    image: '/images/samples/submersible-assembly-sample.jpg',
    motorPower: '1 HP (0.75 kW)',
    maxHead: 'Up to 20 m',
  },
  {
    slug: 'maxbe-openwell-2hp',
    name: 'MAXBE Open Well Submersible Pump',
    model: 'OW-2HP',
    categorySlug: 'openwell',
    description: 'A 2 HP open well submersible pump for deep wells and heavy agricultural irrigation.',
    image: '/images/samples/submersible-assembly-sample.jpg',
    motorPower: '2 HP (1.5 kW)',
    maxHead: 'Up to 25 m',
  },
  {
    slug: 'maxbe-v4-submersible-1hp',
    name: 'MAXBE V4 Submersible Pump',
    model: 'V4-1HP',
    categorySlug: 'v4-submersible',
    description: 'A 4-inch borewell submersible pump for deep installations.',
    image: '/images/samples/submersible-pump-sample.jpg',
    motorPower: '1 HP (0.75 kW)',
    maxHead: 'Up to 60 m',
    specifications: [
      { label: 'Motor Power', value: '1 HP (0.75 kW)' },
      { label: 'Voltage', value: '220–240 V, 50 Hz, Single Phase' },
      { label: 'Max Flow Rate', value: 'Up to 60 LPM' },
      { label: 'Max Head', value: 'Up to 60 m' },
      { label: 'Borewell Size', value: '4 inch (100 mm) minimum' },
      { label: 'Stages', value: '4' },
      { label: 'Outlet Size', value: '32 mm (1.25 inch)' },
      { label: 'Body Material', value: 'SS304 Bowl Assembly' },
      { label: 'Impeller', value: 'Engineered Polymer' },
      { label: 'Cable Length', value: 'As per depth requirement' },
      { label: 'Protection', value: 'IP68' },
    ],
    features: ['Slim 4-inch profile for narrow borewells', 'Stainless steel bowl and diffuser', 'High head multi-stage design', 'Sand-resistant floating impeller', 'Thermal motor protection'],
    applications: ['Deep borewells', 'Residential water supply', 'Farm irrigation', 'Community water schemes'],
  },
  {
    slug: 'maxbe-v4-submersible-2hp',
    name: 'MAXBE V4 Submersible Pump',
    model: 'V4-2HP',
    categorySlug: 'v4-submersible',
    description: 'A 2 HP V4 borewell submersible pump for deep, high-head agricultural and residential applications.',
    image: '/images/samples/submersible-pump-sample.jpg',
    motorPower: '2 HP (1.5 kW)',
    maxHead: 'Up to 90 m',
  },
  {
    slug: 'maxbe-v4-submersible-3hp',
    name: 'MAXBE V4 Submersible Pump',
    model: 'V4-3HP',
    categorySlug: 'v4-submersible',
    description: 'A 3 HP V4 submersible pump for high-demand deep borewell applications.',
    image: '/images/samples/submersible-pump-sample.jpg',
    motorPower: '3 HP (2.24 kW)',
    maxHead: 'Up to 120 m',
  },
];

export const productBySlug = (slug: string) => categories.find((category) => category.slug === slug);
export const productModelBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((category) => category.slug === slug);
