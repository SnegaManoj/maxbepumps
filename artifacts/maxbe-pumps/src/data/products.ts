export type ProductCategory = {
  name: string;
  slug: string;
  description: string;
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
  { name: 'Borewell Submersible Pumps', slug: 'borewell-submersible-pumps', description: 'Explore this category in the context of water drawn from a borewell. MAXBE range and application details await confirmation.' },
  { name: 'Open Well Submersible Pumps', slug: 'open-well-submersible-pumps', description: 'A category for open-well water system enquiries. Product range details await confirmation.' },
  { name: 'Agricultural Irrigation Pumps', slug: 'agricultural-irrigation-pumps', description: 'Explore water movement questions related to agricultural irrigation. Product availability awaits confirmation.' },
  { name: 'Monoblock Pumps', slug: 'monoblock-pumps', description: 'Browse this pump category while official MAXBE product range information is being confirmed.' },
  { name: 'Low-Voltage Pumps', slug: 'low-voltage-pumps', description: 'The supplied MAXBE brand mark uses the tagline “LOW VOLTAGE KING.” Specific models, applications and electrical details await official confirmation.' },
  { name: 'Centrifugal Pumps', slug: 'centrifugal-pumps', description: 'Explore centrifugal pump category context. MAXBE models, availability and specifications await confirmation.' },
  { name: 'Self-Priming Pumps', slug: 'self-priming-pumps', description: 'A category overview for self-priming pump enquiries. Product information awaits confirmation.' },
  { name: 'Drainage and Sewage Pumps', slug: 'drainage-and-sewage-pumps', description: 'Explore drainage and water-management category context. MAXBE range details await confirmation.' },
  { name: 'Solar Pumps', slug: 'solar-pumps', description: 'Solar-powered water movement is shown here for category discovery only. MAXBE configurations and availability await confirmation.' },
  { name: 'Electric Motors and Pump Accessories', slug: 'electric-motors-and-pump-accessories', description: 'Explore electric motor and pump-component enquiries. MAXBE catalogue details await confirmation.' },
];

export const productBySlug = (slug: string) => categories.find((category) => category.slug === slug);
