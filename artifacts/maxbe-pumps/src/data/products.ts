export type ProductCategory = {
  name: string;
  slug: string;
  description: string;
  image?: string;
  imageLabel?: string;
};

export type DemoProduct = {
  name: string;
  slug: string;
  categorySlug: string;
  concept: string;
  image?: string;
  specs: {
    power: string;
    flow: string;
    head: string;
    supply: string;
  };
};

export const categories: ProductCategory[] = [
  { name: 'Borewell Submersible Pumps', slug: 'borewell-submersible-pumps', description: 'For water drawn from a borewell. Catalogue availability and specifications are awaiting confirmation.', image: '/images/submersible-pump.jpg', imageLabel: 'Illustrative unbranded pump image' },
  { name: 'Open Well Submersible Pumps', slug: 'open-well-submersible-pumps', description: 'A category for open-well applications. Product range details have not yet been supplied.' },
  { name: 'Agricultural Irrigation Pumps', slug: 'agricultural-irrigation-pumps', description: 'For irrigation planning across farms and fields. Confirm product availability with the MAXBE team.', image: '/images/field-irrigation.jpg', imageLabel: 'Illustrative agricultural image' },
  { name: 'Monoblock Pumps', slug: 'monoblock-pumps', description: 'Monoblock category information is awaiting official catalogue confirmation.', image: '/images/monoblock-pump.jpg', imageLabel: 'Illustrative unbranded pump image' },
  { name: 'Low-Voltage Pumps', slug: 'low-voltage-pumps', description: 'Low-voltage pump category for discovery only. Supported uses, models and electrical specifications are awaiting official catalogue confirmation.' },
  { name: 'Centrifugal Pumps', slug: 'centrifugal-pumps', description: 'Category listed for discovery; range details and availability are awaiting confirmation.' },
  { name: 'Self-Priming Pumps', slug: 'self-priming-pumps', description: 'Category listed for discovery; range details and availability are awaiting confirmation.' },
  { name: 'Drainage and Sewage Pumps', slug: 'drainage-and-sewage-pumps', description: 'For drainage and water-management enquiries. Official range details have not been supplied.' },
  { name: 'Solar Pumps', slug: 'solar-pumps', description: 'Solar product availability and supported configurations are not yet confirmed.' },
  { name: 'Electric Motors and Pump Accessories', slug: 'electric-motors-and-pump-accessories', description: 'Motors and accessory catalogue information is awaiting confirmation.' },
];

export const productBySlug = (slug: string) => categories.find((category) => category.slug === slug);

// Every model name and value below is invented, illustrative demo content.
// Do not publish, select, purchase, install, or engineer from these values.
export const demoProducts: DemoProduct[] = [
  {
    name: 'Fieldline Demo 01',
    slug: 'fieldline-demo-01',
    categorySlug: 'agricultural-irrigation-pumps',
    concept: 'Illustrative surface irrigation concept',
    specs: { power: '0.75 kW (demo)', flow: '120 L/min (demo)', head: '24 m (demo)', supply: 'Single-phase (demo)' },
  },
  {
    name: 'Wellpath Demo 02',
    slug: 'wellpath-demo-02',
    categorySlug: 'borewell-submersible-pumps',
    concept: 'Illustrative borewell submersible concept',
    specs: { power: '1.1 kW (demo)', flow: '68 L/min (demo)', head: '42 m (demo)', supply: 'Three-phase (demo)' },
  },
  {
    name: 'Openwell Demo 04',
    slug: 'openwell-demo-04',
    categorySlug: 'open-well-submersible-pumps',
    concept: 'Illustrative open-well submersible concept',
    specs: { power: '0.9 kW (demo)', flow: '95 L/min (demo)', head: '18 m (demo)', supply: 'Single-phase (demo)' },
  },
  {
    name: 'Rivermark Demo 05',
    slug: 'rivermark-demo-05',
    categorySlug: 'monoblock-pumps',
    concept: 'Illustrative monoblock transfer concept',
    specs: { power: '1.5 kW (demo)', flow: '155 L/min (demo)', head: '31 m (demo)', supply: 'Three-phase (demo)' },
  },
];

export const demoProductBySlug = (slug: string) => demoProducts.find((product) => product.slug === slug);
