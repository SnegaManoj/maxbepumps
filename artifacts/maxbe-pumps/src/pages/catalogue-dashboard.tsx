import { useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowRight, Check, Eye, FileText, Search, X } from 'lucide-react';
import { Link } from 'wouter';
import { ProductImageGallery } from '../components/catalogue/ProductImageGallery';
import { categories, matchesCatalogueCategory, type CatalogueCategoryFilter } from '../data/products';
import { downloadProductCataloguePdf } from '../lib/catalogue-pdf';

function ProductCataloguePreview({
  slugs,
  onClose,
  onDownload,
  exporting,
  error,
}: {
  slugs: string[];
  onClose: () => void;
  onDownload: () => void;
  exporting: boolean;
  error: string;
}) {
  const products = categories.filter(category => slugs.includes(category.slug));

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return <div className="catalogue-preview-backdrop" role="presentation" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section className="catalogue-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="catalogue-preview-title">
      <header className="catalogue-preview-header">
        <div><span className="category-kicker">CATALOGUE PREVIEW</span><h2 id="catalogue-preview-title">{products.length} {products.length === 1 ? 'entry' : 'entries'}</h2></div>
        <button type="button" className="catalogue-icon-button" onClick={onClose} aria-label="Close catalogue preview"><X size={20}/></button>
      </header>
      <div className="catalogue-preview-content">
        {products.map(product => <article className="catalogue-preview-product" key={product.slug}>
          <div className="catalogue-preview-product-copy">
            <p className="category-kicker">CATEGORY / CODE NOT PROVIDED</p>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="catalogue-unverified-note">Product models, specifications, and availability await official confirmation.</p>
          </div>
          <ProductImageGallery productSlug={product.slug} editable={false}/>
        </article>)}
      </div>
      <footer className="catalogue-preview-footer">
        <div><p>MAXBE Pumps · Contact and location details have not been supplied.</p>{error && <p className="catalogue-inline-error" role="alert">{error}</p>}</div>
        <button type="button" className="btn" onClick={onDownload} disabled={exporting}><ArrowDownToLine size={16}/>{exporting ? 'Preparing PDF…' : 'Download this preview'}</button>
      </footer>
    </section>
  </div>;
}

export default function ProductCatalogueDashboard() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CatalogueCategoryFilter>('all');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? '');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const shownProducts = useMemo(() => categories.filter(category =>
    category.name.toLowerCase().includes(query.trim().toLowerCase())
    && matchesCatalogueCategory(category, filter),
  ), [filter, query]);
  const activeProduct = categories.find(category => category.slug === activeSlug);
  const selectedProducts = categories.filter(category => selectedSlugs.includes(category.slug));
  const previewSlugs = selectedProducts.length ? selectedSlugs : activeProduct ? [activeProduct.slug] : [];
  const allVisibleSelected = shownProducts.length > 0 && shownProducts.every(category => selectedSlugs.includes(category.slug));

  const toggleProduct = (slug: string) => {
    setSelectedSlugs(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
  };

  const toggleVisibleProducts = () => {
    setSelectedSlugs(current => {
      const next = new Set(current);
      if (allVisibleSelected) shownProducts.forEach(category => next.delete(category.slug));
      else shownProducts.forEach(category => next.add(category.slug));
      return [...next];
    });
  };

  const downloadSelected = async () => {
    if (!selectedProducts.length) {
      setPdfError('Select one or more catalogue entries to download.');
      return;
    }
    setExporting(true);
    setPdfError('');
    try {
      await downloadProductCataloguePdf(selectedProducts);
    } catch (reason) {
      setPdfError(reason instanceof Error ? reason.message : 'The catalogue PDF could not be generated.');
    } finally {
      setExporting(false);
    }
  };

  const downloadPreview = async () => {
    const products = categories.filter(category => previewSlugs.includes(category.slug));
    if (!products.length) return;
    setExporting(true);
    setPdfError('');
    try {
      await downloadProductCataloguePdf(products);
    } catch (reason) {
      setPdfError(reason instanceof Error ? reason.message : 'The catalogue PDF could not be generated.');
    } finally {
      setExporting(false);
    }
  };

  return <>
    <div className="catalogue-dashboard page-hero">
      <div className="container catalogue-dashboard-heading">
        <div>
          <div className="eyebrow">PRODUCT MANAGEMENT · LOCAL BROWSER VIEW</div>
          <h1>Product Catalogue</h1>
          <p>Browse available category records, manage image views in this browser, and prepare a shareable catalogue PDF.</p>
        </div>
        <div className="catalogue-dashboard-actions">
          <button type="button" className="btn outline" onClick={() => setPreviewOpen(true)} disabled={!previewSlugs.length}><Eye size={16}/>Catalogue preview</button>
          <button type="button" className="btn gold" onClick={() => void downloadSelected()} disabled={exporting || !selectedProducts.length}><ArrowDownToLine size={16}/>{exporting ? 'Preparing PDF…' : `Download PDF${selectedProducts.length ? ` · ${selectedProducts.length}` : ''}`}</button>
        </div>
      </div>
    </div>
    <section className="section catalogue-dashboard-section">
      <div className="container">
        <div className="catalogue-trust-note">
          <FileText size={18} aria-hidden="true"/>
          <p>Only category names and descriptions are currently available. No verified product models, codes, technical specifications, addresses, email addresses, or phone numbers have been supplied. Image uploads are saved in this browser and are not shared with a server.</p>
        </div>
        <div className="catalogue-dashboard-toolbar">
          <label className="searchbox"><Search size={18}/><input aria-label="Search catalogue entries" placeholder="Search catalogue…" value={query} onChange={event => setQuery(event.target.value)}/></label>
          <label className="catalogue-filter-label">Category
            <select className="select" aria-label="Filter by category" value={filter} onChange={event => setFilter(event.target.value as CatalogueCategoryFilter)}>
              <option value="all">All categories</option><option value="agriculture">Agriculture</option><option value="domestic">Domestic &amp; general</option>
            </select>
          </label>
          <div className="catalogue-count"><strong>{shownProducts.length}</strong><span>of {categories.length} catalogue entries</span></div>
          <button type="button" className="catalogue-select-visible" onClick={toggleVisibleProducts} disabled={!shownProducts.length}>{allVisibleSelected ? 'Deselect visible' : 'Select visible'} <Check size={15}/></button>
        </div>
        {pdfError && <p className="catalogue-inline-error catalogue-pdf-error" role="alert">{pdfError}</p>}
        <div className="catalogue-dashboard-grid">
          {shownProducts.map(product => {
            const isActive = activeSlug === product.slug;
            const isIncluded = selectedSlugs.includes(product.slug);
            return <article className={`catalogue-entry-card${isActive ? ' selected' : ''}`} key={product.slug}>
              <Link href={`/products/${product.slug}`} className="catalogue-entry-image-link" aria-label={`Open category overview for ${product.name}`}>
                <div className="catalogue-entry-image" aria-label={`${product.name} image area; no image uploaded`}><span>PRODUCT IMAGE · NOT UPLOADED</span><small>1200 × 800 px</small></div>
              </Link>
              <div className="catalogue-entry-body">
                <label className="catalogue-entry-checkbox"><input type="checkbox" checked={isIncluded} onChange={() => toggleProduct(product.slug)} aria-label={`Include ${product.name} in PDF`}/><span>Include in PDF</span></label>
                <span className="category-kicker">CATEGORY LISTING · CODE NOT PROVIDED</span>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="catalogue-entry-actions">
                  <button type="button" className="catalogue-details-button" aria-pressed={isActive} onClick={() => {
                    setActiveSlug(product.slug);
                    document.getElementById('catalogue-product-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>Product details <ArrowRight size={14}/></button>
                  <Link href={`/products/${product.slug}`} className="catalogue-link-button">Category overview</Link>
                </div>
              </div>
            </article>;
          })}
          {!shownProducts.length && <div className="catalogue-empty">No catalogue entries match this search and category.</div>}
        </div>

        {activeProduct && <section id="catalogue-product-details" className="catalogue-product-detail">
          <header className="catalogue-detail-heading">
            <div><span className="category-kicker">SELECTED CATALOGUE ENTRY</span><h2>{activeProduct.name}</h2><p>{activeProduct.description}</p></div>
            <Link href={`/products/${activeProduct.slug}`} className="catalogue-link-button">Explore category <ArrowRight size={15}/></Link>
          </header>
          <div className="catalogue-detail-content">
            <section className="catalogue-detail-panel">
              <h3>Four-angle product views</h3>
              <p>Upload optional JPG, PNG, or WebP views. The frames remain empty until you add an image.</p>
              <ProductImageGallery productSlug={activeProduct.slug}/>
              <p className="catalogue-local-note">Image views are saved locally in this browser only.</p>
            </section>
            <div className="catalogue-detail-side">
              <section className="catalogue-detail-panel">
                <h3>Available specifications</h3>
                <dl className="catalogue-spec-list">
                  <div><dt>Product name</dt><dd>{activeProduct.name}</dd></div>
                  <div><dt>Category</dt><dd>{activeProduct.name}</dd></div>
                  <div><dt>Product code / SKU</dt><dd>Not supplied</dd></div>
                  <div><dt>Technical specifications</dt><dd>Awaiting official confirmation</dd></div>
                  <div><dt>Dimensions and materials</dt><dd>Not supplied</dd></div>
                </dl>
                <p className="catalogue-unverified-note">This record is a category listing, not a confirmed MAXBE product model.</p>
              </section>
              <section className="catalogue-detail-panel catalogue-contact-panel">
                <h3>Company and contact</h3>
                <dl className="catalogue-spec-list">
                  <div><dt>Company</dt><dd>MAXBE Pumps</dd></div>
                  <div><dt>Address / location</dt><dd>Not supplied</dd></div>
                  <div><dt>Email / phone</dt><dd>Not supplied</dd></div>
                  <div><dt>Website</dt><dd>Not supplied</dd></div>
                </dl>
              </section>
            </div>
          </div>
        </section>}
      </div>
    </section>
    {previewOpen && <ProductCataloguePreview slugs={previewSlugs} onClose={() => setPreviewOpen(false)} onDownload={() => void downloadPreview()} exporting={exporting} error={pdfError}/>}
  </>;
}
