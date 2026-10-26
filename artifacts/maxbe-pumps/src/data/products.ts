export type ProductCategory = {
  name: string;
  slug: string;
  description: string;
  image?: string;
  imageLabel: string;
};

export const categories: ProductCategory[] = [
  { name: 'Borewell Submersible Pumps', slug: 'borewell-submersible-pumps', description: 'Explore this category in the context of water drawn from a borewell. MAXBE range and application details await confirmation.', image: '/images/submersible-assembly.jpg', imageLabel: 'Illustrative unbranded submersible assembly' },
  { name: 'Open Well Submersible Pumps', slug: 'open-well-submersible-pumps', description: 'A category for open-well water system enquiries. Product range details await confirmation.', image: '/images/submersible-assembly.jpg', imageLabel: 'Illustrative unbranded submersible assembly' },
  { name: 'Agricultural Irrigation Pumps', slug: 'agricultural-irrigation-pumps', description: 'Explore water movement questions related to agricultural irrigation. Product availability awaits confirmation.', image: '/images/solar-water-pump.jpg', imageLabel: 'Illustrative unbranded pump and solar installation' },
  { name: 'Monoblock Pumps', slug: 'monoblock-pumps', description: 'Browse this pump category while official MAXBE product range information is being confirmed.', image: '/images/low-voltage-pump.jpg', imageLabel: 'Illustrative unbranded pump and motor' },
  { name: 'Low-Voltage Pumps', slug: 'low-voltage-pumps', description: 'The supplied MAXBE brand mark uses the tagline “LOW VOLTAGE KING.” Specific models, applications and electrical details await official confirmation.', image: '/images/low-voltage-pump.jpg', imageLabel: 'Illustrative unbranded pump and motor' },
  { name: 'Centrifugal Pumps', slug: 'centrifugal-pumps', description: 'Explore centrifugal pump category context. MAXBE models, availability and specifications await confirmation.', image: '/images/centrifugal-pump.jpg', imageLabel: 'Illustrative unbranded centrifugal pump' },
  { name: 'Self-Priming Pumps', slug: 'self-priming-pumps', description: 'A category overview for self-priming pump enquiries. Product information awaits confirmation.', image: '/images/self-priming-pump.jpg', imageLabel: 'Illustrative unbranded self-priming pump' },
  { name: 'Drainage and Sewage Pumps', slug: 'drainage-and-sewage-pumps', description: 'Explore drainage and water-management category context. MAXBE range details await confirmation.', image: '/images/drainage-pump.jpg', imageLabel: 'Illustrative unbranded drainage pump' },
  { name: 'Solar Pumps', slug: 'solar-pumps', description: 'Solar-powered water movement is shown here for category discovery only. MAXBE configurations and availability await confirmation.', image: '/images/solar-water-pump.jpg', imageLabel: 'Illustrative unbranded solar water pump installation' },
  { name: 'Electric Motors and Pump Accessories', slug: 'electric-motors-and-pump-accessories', description: 'Explore electric motor and pump-component enquiries. MAXBE catalogue details await confirmation.', image: '/images/electric-motors.jpg', imageLabel: 'Illustrative unbranded electric motors' },
];

export const productBySlug = (slug: string) => categories.find((category) => category.slug === slug);
