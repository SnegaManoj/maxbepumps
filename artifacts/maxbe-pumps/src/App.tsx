import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Eye, Facebook, Instagram, Menu, MessageCircle, Navigation, PhoneCall, Search, X } from 'lucide-react';
import { ContactFactoryLocation, HomeFactoryLocation } from './components/FactoryLocation';
import { factoryLocation, factoryMapPlaceUrl } from './data/factory';
import { categories, categoryBySlug, productModelBySlug, products, type ProductGalleryView, type ProductModel } from './data/products';
import { socialLinks } from './data/social';
import ProductCatalogueDashboard from './pages/catalogue-dashboard';

const introSessionKey = 'maxbe-cinematic-intro-seen';

function Brand() {
  return <Link href="/" className="brand" aria-label="MAXBE Pumps home" data-testid="link-brand"><img className="site-logo" src="/assets/maxbe-logo-transparent.png" alt="MAXBE Pumps — LOW VOLTAGE KING" /></Link>;
}

function SocialLinks({ className }: { className: string }) {
  return <div className={className} aria-label="MAXBE on social media">
    {socialLinks.map(({ label, url }) => {
      const Icon = label === 'Instagram' ? Instagram : Facebook;
      return <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={`MAXBE on ${label}`}><Icon size={18} aria-hidden="true"/><span>{label}</span></a>;
    })}
  </div>;
}

function CinematicIntro() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      return window.sessionStorage.getItem(introSessionKey) !== 'seen';
    } catch (error) {
      console.warn('MAXBE intro session preference could not be read.', error);
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);
  const finishTimer = useRef<number | null>(null);
  const removeTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!visible) return;
    try {
      window.sessionStorage.setItem(introSessionKey, 'seen');
    } catch (error) {
      console.warn('MAXBE intro session preference could not be saved.', error);
    }
    finishTimer.current = window.setTimeout(() => setLeaving(true), 7200);
    return () => {
      if (finishTimer.current !== null) window.clearTimeout(finishTimer.current);
      if (removeTimer.current !== null) window.clearTimeout(removeTimer.current);
    };
  }, [visible]);
  useEffect(() => {
    if (!leaving) return;
    removeTimer.current = window.setTimeout(() => setVisible(false), 420);
    return () => {
      if (removeTimer.current !== null) window.clearTimeout(removeTimer.current);
    };
  }, [leaving]);
  const skipIntro = () => setLeaving(true);
  if (!visible) return null;
  return <section className={`cinematic-intro${leaving ? ' is-leaving' : ''}`} role="dialog" aria-modal="true" aria-label="MAXBE Pumps brand introduction">
    <div className="intro-atmosphere" aria-hidden="true"/>
    <div className="intro-pump" aria-hidden="true"><img src="/images/maxbe-hero-industrial-pumps.jpg" alt=""/></div>
    <div className="intro-copy">
      <img className="intro-logo" src="/assets/maxbe-logo-transparent.png" alt="MAXBE Pumps — LOW VOLTAGE KING"/>
      <p className="intro-title">MAXBE PUMPS</p>
      <p className="intro-line">POWER IN EVERY ROTATION.</p>
      <p className="intro-line intro-line-secondary">ENGINEERED TO PERFORM.</p>
    </div>
    <button className="intro-skip" type="button" autoFocus onClick={skipIntro}>Skip Intro <ArrowRight size={15}/></button>
  </section>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const productsTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); setDropdown(null); }, [location]);
  const openFromKeyboard = (name: string) => {
    setDropdown(name);
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-dropdown="${name}"] a`)?.focus());
  };
  const closeDropdown = () => {
    const previous = dropdown;
    setDropdown(null);
    if (previous === 'products') productsTrigger.current?.focus();
  };
  return <>
    <header className="header"><nav className="nav" aria-label="Main navigation">
      <Brand />
      <div className={`navlinks ${open ? 'open' : ''}`} onKeyDown={event=>{if(event.key==='Escape'&&dropdown){event.preventDefault();closeDropdown();}}}>
        <Link href="/" className={location==='/'?'active':''}>Home</Link>
        <Link href="/about" className={location==='/about'?'active':''}>About Us</Link>
        <Link href="/dealers" className={location==='/dealers'?'active':''}>Already a Dealer?</Link>
        <Link href="/catalogue" className={location==='/catalogue'?'active':''}>Catalogue</Link>
        <div className="nav-group">
          <button ref={productsTrigger} className={`nav-trigger ${location.startsWith('/products')?'active':''}`} aria-expanded={dropdown==='products'} aria-controls="products-dropdown" onClick={()=>setDropdown(dropdown==='products'?null:'products')} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();openFromKeyboard('products');}}} data-testid="button-nav-products">Products <ChevronDown size={14}/></button>
          {dropdown==='products'&&<div className="nav-dropdown" id="products-dropdown" data-dropdown="products" aria-label="Product categories">
            <Link href="/products" className="dropdown-feature">All product categories <ArrowRight size={14}/></Link>
            {categories.map(category=><Link href={`/products?category=${category.slug}`} key={category.slug}>{category.name}</Link>)}
          </div>}
        </div>
        <Link href="/contact" className={location==='/contact'?'active':''}>Contact</Link>
      </div>
      <a className="header-phone" href="tel:+919488353564" aria-label="Call MAXBE Pumps at 94883 53564"><PhoneCall size={16}/>94883 53564</a>
      <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={()=>{setOpen(!open);if(open)setDropdown(null);}} data-testid="button-menu">{open?<X/>:<Menu/>}</button>
    </nav></header>
  </>;
}

function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-main">
      <div><Brand/><p>MAXBE Industries, Coimbatore — pump categories and product details from the public MAXBE reference website.</p><SocialLinks className="footer-socials"/></div>
      <div className="footer-col"><h4>Our products</h4>{categories.map(category=><Link href={`/products?category=${category.slug}`} key={category.slug}>{category.name}</Link>)}<Link href="/products">All products</Link></div>
      <div className="footer-col"><h4>Company</h4><Link href="/about">About Us</Link><Link href="/dealers">Already a Dealer?</Link><Link href="/catalogue">Catalogue</Link><Link href="/contact">Contact</Link><Link href="/contact#enquiry-form">Get a Quote</Link><Link href="/find-your-pump">Guided pump finder</Link></div>
      <div className="footer-col footer-contact"><h4>Contact Us</h4><a href="tel:+919488353564">94883 53564</a><a href="tel:+919442573564">94425 73564</a><a href="tel:+914222654185">0422-2654185 (Factory)</a><address>{factoryLocation.addressLines.map(line=><span key={line}>{line}</span>)}</address><a href={`mailto:${factoryLocation.email}`}>{factoryLocation.email}</a><a href={`mailto:${factoryLocation.secondaryEmail}`}>{factoryLocation.secondaryEmail}</a><span>{factoryLocation.businessHours}</span><a href={factoryMapPlaceUrl} target="_blank" rel="noopener noreferrer">Get Directions <ArrowRight size={14}/></a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} MAXBE INDUSTRIES · COIMBATORE</span><a href="https://www.maxbepumps.in" target="_blank" rel="noopener noreferrer">www.maxbepumps.in</a></div>
  </div></footer>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const mainRef=useRef<HTMLElement>(null);
  useEffect(()=>{
    const main=mainRef.current;
    if(!main||window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
    const targets=Array.from(main.querySelectorAll<HTMLElement>(
      '.page-hero, main > section, main > nav.category-breadcrumb, main > .notfound'
    ));
    const revealTargets=targets.flatMap(target=>{
      if(target.classList.contains('home-highlights')){
        const panel=target.querySelector<HTMLElement>('.home-highlights-grid');
        return panel?[panel]:[];
      }
      if(target.matches('section')&&target.querySelector('.home-highlights-grid'))return [];
      if(target.classList.contains('product-detail-section')){
        return Array.from(target.querySelectorAll<HTMLElement>('.product-detail-image,.category-detail-copy'));
      }
      return [target];
    });
    revealTargets.forEach((target,index)=>{
      const motion=target.matches('.hero,.page-hero')?'hero'
        :target.classList.contains('about-story-section')||target.closest('.about-story-section')?'story'
        :target.classList.contains('home-category-grid')||target.closest('.home-category-grid')?'supply'
        :target.classList.contains('product-detail-image')?'detail-image'
        :target.classList.contains('category-detail-copy')?'detail-copy'
        :target.classList.contains('catalogue-download-panel')||target.closest('.catalogue-page')?'catalogue'
        :target.classList.contains('contact-enquiry-section')?'contact'
        :target.classList.contains('band')?'next-step':'section';
      target.dataset.scrollReveal=motion;
      target.style.setProperty('--scroll-reveal-delay',`${Math.min(index%3,2)*55}ms`);
    });
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('scroll-reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.01,rootMargin:'0px 0px -7% 0px'});
    revealTargets.forEach(target=>observer.observe(target));
    revealTargets.forEach(target=>target.classList.add('scroll-reveal-ready'));
    return ()=>{
      observer.disconnect();
      revealTargets.forEach(target=>target.classList.remove('scroll-reveal-ready','scroll-reveal-visible'));
    };
  },[location,children]);
  const pageStyles = [
    location === '/about' && 'ui-about',
    location === '/contact' && 'ui-contact',
    location === '/catalogue' && 'ui-catalogue',
    location === '/catalogue-dashboard' && 'ui-catalogue-dashboard',
    (location === '/products' || location.startsWith('/products/')) && 'ui-products',
    (location === '/applications/agriculture' || location === '/applications/domestic') && 'ui-application',
  ].filter(Boolean).join(' ');
  return <div className={`site ${pageStyles ? `ui-enhanced ${pageStyles}` : ''}`}><Header/><main key={location.split('?')[0]} ref={mainRef} className="page-route">{children}</main><Footer/><a className="site-whatsapp-float" href={`https://wa.me/919488353564?text=${encodeURIComponent('Hello MAXBE PUMPS, I would like to enquire about your pumps.')}`} target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp chat with MAXBE Pumps"><MessageCircle size={23}/></a></div>;
}

function Meta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | MAXBE Pumps`;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) { desc = document.createElement('meta'); desc.setAttribute('name','description'); document.head.appendChild(desc); }
    desc.setAttribute('content',description);
  },[title,description]);
  return null;
}

function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow">{children}</div>; }
function PageHero({ kicker,title,text }: { kicker:string;title:string;text:string }) {
  return <section className="page-hero">
    <div className="page-hero-media" aria-hidden="true"><img src="/images/submersible-assembly.jpg" alt="" loading="eager" fetchPriority="high"/></div>
    <div className="container"><Eyebrow>{kicker}</Eyebrow><h1>{title}</h1><p>{text}</p></div>
  </section>;
}
function CTA({ title,text,href='/find-your-pump',label='Find your pump' }: { title:string;text:string;href?:string;label?:string }) {
  return <section className="band"><div className="container band-inner"><div><Eyebrow>THE NEXT STEP</Eyebrow><h2>{title}</h2><p>{text}</p></div><Link className="btn" href={href}>{label}<ArrowRight size={16}/></Link></div></section>;
}

const DEMO_COUNTER_VALUE=9;
const DEMO_COUNTER_STORAGE_KEY='maxbe-demo-highlight-count';

function DemoCounter() {
  const [value,setValue]=useState(0);
  useEffect(()=>{
    let fixedValue=DEMO_COUNTER_VALUE;
    try{
      const savedValue=Number(window.localStorage.getItem(DEMO_COUNTER_STORAGE_KEY));
      if(savedValue===DEMO_COUNTER_VALUE)fixedValue=savedValue;
      window.localStorage.setItem(DEMO_COUNTER_STORAGE_KEY,String(fixedValue));
    }catch{}
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setValue(fixedValue);return;}
    const start=performance.now();
    const duration=900;
    let frame=0;
    const tick=(time:number)=>{
      const progress=Math.min((time-start)/duration,1);
      setValue(Math.round(fixedValue*(1-Math.pow(1-progress,3))));
      if(progress<1)frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[]);
  return <strong aria-label={`Demo counter, ${DEMO_COUNTER_VALUE}`}>{value}</strong>;
}

function Home() {
  return <>
    <Meta title="MAXBE PUMPS — Reliable Pumps" description="Explore MAXBE monoblock, open well submersible and V4 submersible pump products."/>
    <section className="hero" aria-label="Hero section">
      <div className="hero-media" role="img" aria-label="Cinematic industrial pump showcase">
        <img className="hero-poster" src="/images/maxbe-hero-industrial-pumps.jpg" alt="" fetchPriority="high"/>
        <div className="hero-visual-caption" aria-hidden="true"><span>ENGINEERED</span><b>01</b></div>
      </div>
      <div className="hero-inner animate-in">
        <div className="hero-copy">
          <div className="hero-brand-lockup"><img src="/assets/maxbe-logo-transparent.png" alt="MAXBE PUMPS — Low Voltage King"/><span className="hero-slogan">Low Voltage <strong>KING</strong></span></div>
          <h1>Monoblock &amp;<br/><em>Submersible Pumps</em></h1>
          <p>Consistent water flow for agriculture, homes and industry, with a product range covering monoblock and submersible pumps.</p>
          <ul className="hero-benefits"><li>Low voltage operation</li><li>Quality checked before dispatch</li><li>Phone and WhatsApp enquiries</li></ul>
          <div className="hero-actions"><Link href="/products" className="btn gold">Explore Products <ArrowRight size={16}/></Link><a href={`https://wa.me/919488353564?text=${encodeURIComponent('Hello MAXBE PUMPS, I would like to enquire about your pumps.')}`} target="_blank" rel="noopener noreferrer" className="btn outline whatsapp-enquiry"><MessageCircle size={16}/>WhatsApp Enquiry</a><a href={factoryMapPlaceUrl} target="_blank" rel="noopener noreferrer" className="hero-directions-link"><Navigation size={17} aria-hidden="true"/>Get Directions<ArrowRight size={15} aria-hidden="true"/></a></div>
          <div className="hero-contact-strip"><a href={`mailto:${factoryLocation.email}`}>{factoryLocation.email}</a><span aria-hidden="true">·</span><a href="https://www.maxbepumps.in" target="_blank" rel="noopener noreferrer">www.maxbepumps.in</a><span aria-hidden="true">·</span><a href="tel:+919488353564">94883 53564</a></div>
        </div>
      </div>
    </section>
    <section className="home-highlights" aria-label="Explore the MAXBE website">
      <div className="container home-highlights-grid">
        <div><DemoCounter/><span>listed pump models · demo count</span></div>
        <div><strong>{categories.length}</strong><span>pump ranges</span></div>
        <div><strong>Since 1992</strong><span>MAXBE Industries · Coimbatore</span></div>
      </div>
    </section>
    <section className="section"><div className="container section-head"><div><Eyebrow>WHAT WE SUPPLY</Eyebrow><h2>Our Product Categories</h2></div><p>Three pump ranges for water needs from domestic wells to deep borewells and agricultural fields.</p></div>
      <div className="container tile-grid home-category-grid">{categories.map((category,index)=><Link href={`/products?category=${category.slug}`} className="tile home-category-tile" key={category.slug}><span className="category-icon">{category.icon}</span><span className="tile-num">PUMP RANGE / 0{index+1}</span><h3>{category.name}</h3><p>{category.description}</p><span className="category-browse">Browse range <ArrowRight size={15}/></span></Link>)}</div>
    </section>
    <section className="section" style={{background:'#f0ece2'}}><div className="container split"><div className="story-panel"><Eyebrow>START WITH THE BASICS</Eyebrow><h3>Useful details to gather</h3><ul><li>Water source: borewell, open well, tank or surface source</li><li>Where the water needs to go</li><li>Approximate height and water requirement, if known</li></ul><span className="status">No model recommendations or specifications confirmed</span></div><div className="story-copy"><Eyebrow>MADE FOR REAL QUESTIONS</Eyebrow><h2>Begin with the water source. Not a model number.</h2><p>Is the water in a borewell, an open well, a tank or a surface source? Where does it need to go? These details help shape a sensible conversation before product selection.</p><p>The official catalogue is awaiting confirmation. Until product information is available, category discovery can still be useful—and product claims stay honest.</p><Link className="text-link" href="/find-your-pump">Try the six-step finder <ArrowRight size={15}/></Link></div></div></section>
    <section className="section"><div className="container section-head"><div><Eyebrow>POPULAR MODELS</Eyebrow><h2>Featured Products</h2></div><p>A selection from each category. Browse the full range and individual model details.</p></div>
      <div className="container catalog-grid home-catalog-grid">{[products[0],products[3],products[6]].map(product=><ProductCard key={product.slug} product={product}/>)}</div>
      <div className="container"><Link className="btn products-all-link" href="/products">View All Products <ArrowRight size={15}/></Link></div>
    </section>
    <section className="section applications-section"><div className="container section-head"><div><Eyebrow>WHERE WATER MATTERS</Eyebrow><h2>Solutions for everyday applications.</h2></div><p>Explore common water-use contexts and the questions that help shape a product conversation.</p></div>
      <div className="container application-cards">
        {[
          ['Agricultural irrigation','Explore water movement for fields and irrigation systems.','/applications/agriculture'],
          ['Residential water supply','Start with household storage, supply and daily water needs.','/applications/domestic'],
          ['Garden watering','Consider source, use pattern and the site when planning garden water.','/applications/domestic'],
        ].map(([title,description,href])=><Link href={href} className="application-card" key={title}><div><span>APPLICATION GUIDE</span><h3>{title}</h3><p>{description}</p><b>Explore application <ArrowRight size={15}/></b></div></Link>)}
      </div>
    </section>
    <section className="section why-section"><div className="container section-head"><div><Eyebrow>WHY MAXBE PUMPS</Eyebrow><h2>A helpful start for your water needs.</h2></div><p>Clear category discovery and application-focused guidance, with product facts kept honest until officially confirmed.</p></div>
      <div className="container tile-grid">{[['01','Agriculture & home','Explore categories for agricultural and domestic water applications.'],['02','Selection assistance','Use practical prompts to gather useful site and water-source details.'],['03','Application focused','Start with the job to be done, not an unverified model number.'],['04','Enquiry support','Share your questions through a clearly identified demo enquiry form.']].map(([n,title,text])=><article className="tile benefit-tile" key={n}><span className="tile-num">{n} / THE MAXBE APPROACH</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <HomeFactoryLocation/>
    <CTA title="Need a pump? Let’s find the right one for you." text="Tell us about your application and water requirement. Contact MAXBE to check product information and availability." href="/contact#enquiry-form" label="Send an enquiry"/>
    <section className="section tight"><div className="container notice"><b>Product information.</b> Model names and specifications shown here are reproduced from the public MAXBE reference website. Please confirm current specifications and availability with MAXBE before purchase.</div></section>
  </>;
}

function ProductCard({ product }: { product: ProductModel }) {
  const category=categoryBySlug(product.categorySlug);
  const whatsappUrl=`https://wa.me/919488353564?text=${encodeURIComponent(`Hello MAXBE PUMPS, I am interested in the ${product.name} (Model: ${product.model}). Please share more details and pricing.`)}`;
  return <article className="product-card">
    <Link href={`/products/${product.slug}`} className="product-card-visual" aria-label={`View ${product.name} ${product.model}`}>
      <div className="home-product-image"><img src={product.image} alt={`Sample image: ${product.name} — ${product.model}`} loading="lazy"/><span>{category?.icon} {category?.name}</span></div>
    </Link>
    <div className="product-body"><div className="category-kicker">{category?.icon} {category?.name}</div><p className="product-model">Model: {product.model}</p><h3>{product.name}</h3><p>{product.description}</p><div className="product-spec-highlights"><span><small>Motor Power</small><b>{product.motorPower}</b></span><span><small>Max Head</small><b>{product.maxHead}</b></span></div><div className="product-card-actions"><Link className="btn product-view-link" href={`/products/${product.slug}`}><Eye size={16} aria-hidden="true"/>View Details</Link><a className="quote-link whatsapp-enquiry" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Enquire <MessageCircle size={14}/></a></div></div>
  </article>;
}

const requiredProductViews: ProductGalleryView['label'][]=['Top','Front','Left','Right'];

function ProductGallery({ product }: { product: ProductModel }) {
  const [selectedIndex,setSelectedIndex]=useState(0);
  const galleryViews=product.galleryViews&&product.galleryViews.length>=requiredProductViews.length
    ? product.galleryViews
    : requiredProductViews.map((label,index)=>({
        label,
        image:product.image,
        alt:`Sample ${label.toLowerCase()}-view placeholder for ${product.name} — ${product.model}`,
      }));
  const selectedView=galleryViews[selectedIndex]??galleryViews[0];

  return <figure className="category-detail-image product-detail-image product-gallery">
    <img className="product-gallery-main-image" key={selectedView.image+selectedView.label} src={selectedView.image} alt={`${selectedView.alt} The same asset is repeated temporarily; this is not a genuine ${selectedView.label.toLowerCase()} angle.`} fetchPriority="high"/>
    <div className="product-gallery-thumbnails" role="group" aria-label={`${product.model} product image views`}>
      {galleryViews.map((view,index)=><button key={view.label} type="button" className={`product-gallery-thumbnail${selectedIndex===index?' is-active':''}`} aria-pressed={selectedIndex===index} aria-label={`Show sample ${view.label} view of ${product.model}`} onClick={()=>setSelectedIndex(index)}>
        <img src={view.image} alt="" loading="lazy"/><span>{view.label}<small>Sample</small></span>
      </button>)}
    </div>
    <figcaption aria-live="polite">{selectedView.label} VIEW · Temporary sample</figcaption>
    <p className="product-gallery-missing">The same existing product image is used for all four sample positions. Replace <code>galleryViews</code> in <code>src/data/products.ts</code> with genuine Top, Front, Left and Right photographs when available.</p>
  </figure>;
}

function Products() {
  const initialFilter=categories.some(category=>category.slug===new URLSearchParams(window.location.search).get('category'))
    ? new URLSearchParams(window.location.search).get('category')!
    : 'all';
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState(initialFilter);
  const shown=products.filter(product=>{
    const category=categoryBySlug(product.categorySlug);
    const matchesText=`${product.name} ${product.model} ${product.description} ${category?.name??''}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesText&&(filter==='all'||product.categorySlug===filter);
  });
  const setCategory=(category: string)=>setFilter(category);
  return <><Meta title="Product Catalogue" description="Browse MAXBE monoblock, open well submersible and V4 submersible pump models."/>
    <PageHero kicker="COMPLETE RANGE" title="Product Catalogue" text="Browse monoblock, open well submersible and V4 borewell pump models."/>
    <section className="section product-listing-section"><div className="container">
      <div className="catalog-tools"><label className="searchbox"><Search size={18}/><input aria-label="Search products" placeholder="Search products…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
        <div className="product-category-filters" role="group" aria-label="Category filters">
          <button type="button" className={filter==='all'?'active':''} onClick={()=>setCategory('all')}>All Products</button>
          {categories.map(category=><button type="button" key={category.slug} className={filter===category.slug?'active':''} onClick={()=>setCategory(category.slug)}>{category.icon} {category.name}</button>)}
        </div>
        <p className="product-result-count" aria-live="polite">{shown.length} {shown.length===1?'product':'products'}</p>
      </div>
      <div className="catalog-grid">{shown.length?shown.map(product=><ProductCard key={product.slug} product={product}/>):<div className="empty">No products match your search. Try another model or category.</div>}</div>
    </div></section>
  </>;
}

function ProductDetail({ params }: { params:{slug?:string} }) {
  const product=params.slug?productModelBySlug(params.slug):undefined;
  if(!product){
    const category=params.slug?categoryBySlug(params.slug):undefined;
    if(!category)return <NotFound/>;
    const categoryProducts=products.filter(item=>item.categorySlug===category.slug);
    return <><Meta title={category.name} description={`${category.name} pump models in the MAXBE product catalogue.`}/><PageHero kicker="PRODUCT RANGE" title={category.name} text={category.description}/><section className="section category-product-range-section"><div className="container"><div className="category-range-heading"><span className="category-icon">{category.icon}</span><div><Eyebrow>PRODUCT RANGE</Eyebrow><h2>{category.name}</h2><p>{category.description}</p></div></div><div className="catalog-grid">{categoryProducts.map(item=><ProductCard product={item} key={item.slug}/>)}</div></div></section></>;
  }
  const category=categoryBySlug(product.categorySlug);
  if(!category)return <NotFound/>;
  const whatsappUrl=`https://wa.me/919488353564?text=${encodeURIComponent(`Hello MAXBE PUMPS, I am interested in the ${product.name} (Model: ${product.model}). Please share more details and pricing.`)}`;
  const related=products.filter(item=>item.categorySlug===product.categorySlug&&item.slug!==product.slug);
  return <><Meta title={`${product.name} ${product.model}`} description={`${product.name}, model ${product.model}. ${product.description}`}/>
    <nav className="container category-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><Link href={`/products?category=${category.slug}`}>{category.name}</Link><span>/</span><span aria-current="page">{product.model}</span></nav>
    <section className="section product-detail-section"><div className="container product-detail-layout">
      <ProductGallery key={product.slug} product={product}/>
      <div className="category-detail-copy">
        <article className="product-detail-summary">
          <span className="category-kicker">{category.icon} {category.name}</span><h1>{product.name}</h1><p className="product-detail-model">Model: {product.model}</p><p>{product.description}</p>
          <h2>Technical Specifications</h2><div className="product-detail-specs">{(product.specifications??[{label:'Motor Power',value:product.motorPower},{label:'Max Head',value:product.maxHead}]).map(spec=><div className="product-specification" key={spec.label}><span>{spec.label}</span><strong>{spec.value}</strong></div>)}</div>
          {product.features&&<><h2>Key Features</h2><ul className="product-feature-list">{product.features.map(feature=><li key={feature}><Check size={16}/>{feature}</li>)}</ul></>}
          {product.applications&&<><h2>Suitable For</h2><div className="product-application-chips">{product.applications.map(application=><span key={application}>{application}</span>)}</div></>}
          <div className="product-detail-actions"><a className="btn product-quote-link" href="#request-quote">Get a Quote <ArrowRight size={16}/></a><a className="btn whatsapp-enquiry" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/>WhatsApp Enquiry</a><a className="btn outline" href="tel:+919488353564"><PhoneCall size={16}/>Call Us</a></div>
          <p className="product-reference-note">Specifications and product information are shown as published on the public MAXBE reference website. Confirm before purchase.</p>
        </article>
      </div>
    </div></section>
    <section className="section product-quote-section" id="request-quote"><div className="container"><div className="section-head"><div><Eyebrow>ENQUIRE ABOUT THIS MODEL</Eyebrow><h2>Request a Quote</h2></div><p>Prepare a product-specific email enquiry draft using your device.</p></div><ContactForm initialProduct={product.slug}/></div></section>
    {related.length>0&&<section className="section related-products-section"><div className="container"><div className="section-head"><div><Eyebrow>MORE IN THIS RANGE</Eyebrow><h2>Related Products</h2></div><p>Other models in {category.name}.</p></div><div className="catalog-grid">{related.map(item=><ProductCard product={item} key={item.slug}/>)}</div></div></section>}
  </>;
}

function Catalogue() {
  return <>
    <Meta title="MAXBE Product Catalogue" description="Browse MAXBE pump ranges and download a product-range overview PDF."/>
    <PageHero kicker="PRODUCT RANGE" title="MAXBE Catalogue" text="Explore the pump categories currently listed on this website."/>
    <section className="section catalogue-page">
      <div className="container">
        <div className="catalogue-download-panel">
          <div><Eyebrow>OFFICIAL PRODUCT BROCHURE</Eyebrow><h2>Catalogue PDF currently unavailable</h2><p>The official MAXBE brochure PDF has not been supplied for this website, so no placeholder or generated file is presented as the brochure. Browse the listed pump ranges below and contact MAXBE to confirm current product information.</p></div>
        </div>
        <div className="catalogue-page-grid">
          {categories.map((category,index)=>{
            const categoryProducts=products.filter(product=>product.categorySlug===category.slug);
            const sampleImage=category.slug==='monoblock'?'/images/samples/monoblock-pump-blue-sample.jpg':category.image.replace('/images/','/images/samples/').replace('.jpg','-sample.jpg');
            return <article className="catalogue-page-card" key={category.slug}>
              <img src={sampleImage} alt={`Sample image for ${category.name}`} loading="lazy"/>
              <div><span className="catalogue-page-index">RANGE / 0{index+1}</span><h2>{category.name}</h2><p>{category.description}</p><p className="catalogue-model-count">{categoryProducts.length} listed models</p><Link className="text-link" href={`/products?category=${category.slug}`}>Browse this range <ArrowRight size={15}/></Link></div>
            </article>;
          })}
        </div>
      </div>
    </section>
  </>;
}

function Application({ kind }: { kind:'agriculture'|'domestic' }) {
  const farm=kind==='agriculture';
  return <><Meta title={farm?'Agricultural applications':'Domestic applications'} description={`Explore water-pump considerations for ${farm?'agriculture and irrigation':'household water management'} with MAXBE Pumps.`}/><PageHero kicker={farm?'APPLICATION · AGRICULTURE':'APPLICATION · DOMESTIC'} title={farm?'Water is part of every field decision.':'Water for the everyday rhythm of home.'} text={farm?'For irrigation, crop water management and farm use, the right starting point is understanding the water source and where it needs to travel.':'For a home, begin with the water source, storage arrangement and the places water needs to reach.'}/>
    <section className="section"><div className="container split"><div className="story-panel application-note"><Eyebrow>{farm?'FIELD CHECKLIST':'HOME CHECKLIST'}</Eyebrow><h3>{farm?'Information to gather':'Household details to note'}</h3><ul>{(farm?['Water source and seasonal variation','Where water needs to travel','Approximate requirement and lifting height, if known']:['Water source and storage arrangement','Floors, tanks or fixtures to be supplied','Approximate height and daily use, if known']).map(item=><li key={item}>{item}</li>)}</ul><span className="status">Planning guidance only · confirm requirements with a qualified professional</span></div><div className="story-copy"><Eyebrow>{farm?'FIELD TO SOURCE':'SOURCE TO TAP'}</Eyebrow><h2>{farm?'Start with the source. Then map the route.':'A useful first conversation starts at home.'}</h2><p>{farm?'Borewell, open well, surface water or a storage tank: each source raises different questions. Note your approximate water requirement and lifting height if you know them.':'Consider where water comes from, whether there is a tank or sump, and which floors or fixtures need supply. Approximate height and usage can help a qualified professional understand the setup.'}</p><p>These pages offer general planning prompts only. MAXBE product range and specifications are awaiting official confirmation.</p><Link href="/find-your-pump" className="btn">Start the preliminary finder <ArrowRight size={15}/></Link></div></div></section>
    <section className="section" style={{background:'#f0ece2'}}><div className="container section-head"><div><Eyebrow>THREE THINGS TO NOTE</Eyebrow><h2>Bring useful context to the conversation.</h2></div><p>Unknown is a valid answer. A qualified professional should verify every installation requirement.</p></div><div className="container tile-grid">{(farm?[['01','Water source','Borewell, open well, surface water or storage.'],['02','Where it goes','Distance, height and irrigation layout, if known.'],['03','Power available','Single-phase, three-phase, solar or not sure.']]:[['01','Water source','Municipal, borewell, tank, sump or another source.'],['02','Building layout','Floors, tank position and approximate height.'],['03','Daily use','Household needs and times of highest demand.']]).map(([n,t,d])=><div className="tile" key={n}><span className="tile-num">{n} / NOTE</span><h3>{t}</h3><p>{d}</p></div>)}</div></section><CTA title="Take what you know. Leave the rest blank." text="The finder accepts unknown flow and head values and offers only a preliminary category direction."/>
  </>;
}

const finderSteps=[
  {title:'What is the application?',subtitle:'Choose the setting closest to your water need.',options:[['agriculture','Agriculture','Irrigation or farm use'],['home','Home','Household water supply'],['commercial','Commercial or industrial','A workplace or facility'],['drainage','Drainage','Moving unwanted water']]},
  {title:'Where does the water come from?',subtitle:'Choose the main source. If it is not listed, use Other.',options:[['borewell','Borewell','Water from a drilled bore'],['open well','Open well','Water from an open well'],['tank or sump','Tank or sump','Stored water'],['surface','Surface water','Canal, pond or similar'],['other','Other','Another source']]},
  {title:'How much water do you need?',subtitle:'An approximate requirement is useful, but you can mark it as unknown.',options:[['unknown','Not sure yet','Leave the quantity open'],['low','Small / intermittent','A limited or occasional requirement'],['moderate','Regular use','A steady requirement'],['high','High / continuous','A substantial or ongoing requirement']]},
  {title:'How high does the water need to travel?',subtitle:'Approximate lifting height or total head, if known. This is optional.',options:[['unknown','Not sure','I do not know the height'],['low','Low lift','Short vertical distance'],['medium','Moderate lift','Some vertical distance'],['high','High lift','Significant vertical distance']]},
  {title:'What power is available?',subtitle:'Solar support is not confirmed for MAXBE. This answer is for discussion only.',options:[['single-phase','Single-phase','Available at the site'],['three-phase','Three-phase','Available at the site'],['solar','Solar','Would like to discuss solar'],['not sure','Not sure','Power needs checking']]},
  {title:'Where will it be installed?',subtitle:'Tell us the installation location. This is required to complete the finder.',options:[['indoors','Indoors','Inside a building or pump room'],['outdoors','Outdoors','Exposed or sheltered outdoor setting'],['well','In or near a well','Well-side installation context'],['other','Other / not sure','Another setting or undecided']]},
];
type Answers=Record<number,string>;

function Finder() {
  const [step,setStep]=useState(0);const [answers,setAnswers]=useState<Answers>({});const [error,setError]=useState('');
  const done=step>=finderSteps.length;const current=finderSteps[Math.min(step,finderSteps.length-1)];const progress=done?100:Math.round(step/finderSteps.length*100);
  const restart=()=>{setAnswers({});setError('');setStep(0);};
  const next=()=>{if([0,1,4,5].includes(step)&&!answers[step]){setError('Choose an answer to continue.');return;}setError('');setStep(step+1);};
  let suggestions:string[]=[];
  if(answers[0]==='agriculture')suggestions=answers[1]==='borewell'?['Borewell Submersible Pumps','Agricultural Irrigation Pumps']:answers[1]==='open well'?['Open Well Submersible Pumps','Agricultural Irrigation Pumps']:['Agricultural Irrigation Pumps'];
   else if(answers[0]==='home')suggestions=answers[1]==='borewell'?['Borewell Submersible Pumps','Monoblock Pumps']:answers[1]==='open well'?['Open Well Submersible Pumps','Monoblock Pumps']:['Monoblock Pumps','Centrifugal Pumps'];
  else if(answers[0]==='drainage')suggestions=['Drainage and Sewage Pumps'];else suggestions=['Centrifugal Pumps','Monoblock Pumps'];
  return <><Meta title="Find your pump" description="A six-step preliminary category finder. Results are not engineering advice or confirmed MAXBE product recommendations."/><PageHero kicker="SIX QUESTIONS · A PRELIMINARY START" title="Find a starting point for your water need." text="Answer what you can. Unknown is okay. This tool suggests categories only—it cannot select or verify a pump."/>
    <section className="section"><div className="container finder"><aside className="finder-rail"><h3>Your starting point</h3><div className="progress-track"><span style={{width:`${progress}%`}}/></div><p style={{fontSize:11,color:'#c5c0b6'}}>{done?'Complete':`STEP ${step+1} OF ${finderSteps.length}`} · {progress}%</p><ol className="step-list">{finderSteps.map((s,i)=><li className={i===step?'current':''} key={s.title}><b>{i<step?<Check size={13}/>:i+1}</b>{s.title}</li>)}</ol><button onClick={restart} className="text-link" style={{background:'none',border:0,cursor:'pointer',color:'#F4B323',padding:0,marginTop:28}}>Restart finder <ArrowRight size={14}/></button></aside>
      <div className="finder-panel">{!done?<><Eyebrow>QUESTION {step+1} / 06</Eyebrow><h2>{current.title}</h2><p>{current.subtitle}</p><div className="option-grid">{current.options.map(([value,label,detail])=><button key={value} onClick={()=>{setAnswers({...answers,[step]:value});setError('');}} className={`option ${answers[step]===value?'selected':''}`} aria-pressed={answers[step]===value}><span>{label}<small>{detail}</small></span>{answers[step]===value&&<Check size={17}/>}</button>)}</div>{error&&<p role="alert" style={{color:'#C91D28',marginTop:15}}>{error}</p>}<div className="finder-actions">{step>0?<button className="btn outline" onClick={()=>{setStep(step-1);setError('');}}><ArrowLeft size={15}/> Back</button>:<span/>}<button className="btn" onClick={next}>Continue <ArrowRight size={15}/></button></div></>:<><Eyebrow>PRELIMINARY CATEGORY DIRECTION</Eyebrow><h2>Your answers point toward…</h2><p>Based only on application and water source, these are categories to discuss—not verified MAXBE models or engineering advice.</p><div className="result-box"><h3>Categories to explore</h3>{suggestions.map(s=><p key={s}><Check size={14} style={{verticalAlign:'middle',marginRight:8,color:'#526B3D'}}/>{s}</p>)}</div><div className="notice">Please confirm the selection with a qualified professional. Water requirement, total head, site conditions, electrical supply and product availability must be professionally checked. Key unknowns: {['water requirement','lifting height'].filter((_,i)=>answers[i+2]==='unknown').join(', ')||'none recorded'}.</div><div className="finder-actions"><button className="btn outline" onClick={restart}>Start again</button><Link className="btn" href="/contact">Continue to demo enquiry <ArrowRight size={15}/></Link></div></>}</div>
    </div></section>
  </>;
}

function ContactForm({dealer=false,initialProduct=''}:{dealer?:boolean;initialProduct?:string}) {
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [selectedProduct,setSelectedProduct]=useState(initialProduct);
  useEffect(()=>setSelectedProduct(initialProduct),[initialProduct]);
  const selectedModel=products.find(product=>product.slug===selectedProduct);
  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    const name=String(data.get('name')??'').trim();
    const phone=String(data.get('phone')??'').trim();
    const email=String(data.get('email')??'').trim();
    const message=String(data.get('message')??'').trim();
    const emailInput=form.elements.namedItem('email');
    const location=String(data.get('location')??'').trim();
    const phoneDigits=phone.replace(/\D/g,'');
    if(!name||!phone||phoneDigits.length<8||phoneDigits.length>15||!message||(dealer&&!location)||!(emailInput instanceof HTMLInputElement)||!emailInput.checkValidity()){
      setError(dealer
        ?'Enter your name, a valid phone number, location and message. If provided, check that your email address is valid.'
        :'Enter your name, a valid phone number and message. If provided, check that your email address is valid.');
      setNotice('');
      return;
    }
    const subject=dealer?'Dealer enquiry':selectedModel?`Quote request: ${selectedModel.model}`:'MAXBE Pumps enquiry';
    const details=[
      `Name: ${name}`,
      `Phone: ${phone}`,
      email?`Email: ${email}`:'',
      selectedModel?`Product: ${selectedModel.name} (${selectedModel.model})`:'',
      dealer?`Location: ${location}`:'',
      '',
      message,
    ].filter((line,index)=>line||index===4).join('\n');
    setError('');
    setNotice('If your device supports email links, an enquiry draft should open. The website has not sent your request; review and send it in your email application.');
    window.location.href=`mailto:${factoryLocation.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
  };
  return <form className="form-card" onSubmit={submit} noValidate>
    {error&&<div className="notice" role="alert" style={{borderLeftColor:'#C91D28',marginBottom:18}}>{error}</div>}
    {notice&&<div className="notice" role="status">{notice} If no draft opens, email <a href={`mailto:${factoryLocation.email}`}>{factoryLocation.email}</a>.</div>}
    <div className="form-grid">
      <div className="field"><label htmlFor="contact-name">Full Name *</label><input id="contact-name" name="name" required autoComplete="name" placeholder="Your name"/></div>
      <div className="field"><label htmlFor="contact-phone">Phone *</label><input id="contact-phone" name="phone" type="tel" required autoComplete="tel" placeholder="94883 53564"/></div>
      <div className="field wide"><label htmlFor="contact-email">Email (optional)</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="your@email.com"/></div>
      <div className="field wide"><label htmlFor="contact-product">Product Interest</label><select id="contact-product" name="product" value={selectedProduct} onChange={event=>setSelectedProduct(event.target.value)}><option value="">— Select a model (optional) —</option>{categories.map(category=><optgroup key={category.slug} label={category.name}>{products.filter(product=>product.categorySlug===category.slug).map(product=><option key={product.slug} value={product.slug}>{product.model}</option>)}</optgroup>)}<option value="general">General Enquiry</option></select></div>
      {dealer&&<div className="field wide"><label htmlFor="contact-location">Location / city / PIN *</label><input id="contact-location" name="location" required autoComplete="postal-code" placeholder="City, district or PIN"/></div>}
      <div className="field wide"><label htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" required rows={4} placeholder={selectedModel?`I'm interested in the ${selectedModel.model}. Please provide more details.`:'Describe your water requirement — source, intended use and location.'}/></div>
    </div>
    <p className="form-delivery-note">Enquiry delivery uses your device’s email application. No backend submission service is configured on this website.</p>
    <button className="btn" type="submit" data-testid="button-submit-enquiry">{selectedModel?'Send Quote Request':'Send an Enquiry'} <ArrowRight size={15}/></button>
  </form>;
}

function Contact({dealer=false}:{dealer?:boolean}) {
  useEffect(()=>{
    if(window.location.hash!=='#enquiry-form')return;
    window.requestAnimationFrame(()=>document.getElementById('enquiry-form')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
  },[]);
  const categoryParam=new URLSearchParams(window.location.search).get('category')??'';
  const productParam=new URLSearchParams(window.location.search).get('product')??'';
  const initialProduct=products.find(product=>product.slug===productParam)?.slug
    ??products.find(product=>product.categorySlug===categoryParam)?.slug
    ??'';
  return <><Meta title={dealer?'Dealer enquiry':'Contact MAXBE INDUSTRIES'} description="Contact MAXBE Industries in Coimbatore about pump products, quotations and factory directions."/><PageHero kicker={dealer?'DEALER NETWORK':'GET IN TOUCH'} title={dealer?'Looking for a nearby dealer?':'Contact Us'} text={dealer?'Contact MAXBE to discuss dealership enquiries.':'Enquire about products, request a quote or visit our factory.'}/>
    {!dealer&&<ContactFactoryLocation/>}
    <section className="section contact-enquiry-section" id="enquiry-form"><div className="container contact-layout"><div className="contact-intro"><Eyebrow>{dealer?'DEALER ENQUIRY':'MAXBE INDUSTRIES · EST. 1992'}</Eyebrow><h2>{dealer?'Discuss a dealership enquiry.':'Send an Enquiry'}</h2><p>We usually respond during business hours. Select a product model if you would like to include it in your message.</p><div className="notice">This form prepares an email draft using your device’s email application. The website does not send or store enquiries.</div><SocialLinks className="contact-social-links"/></div><ContactForm dealer={dealer} initialProduct={initialProduct}/></div></section>
  </>;
}

function Resources() {
  return <><Meta title="Support & resources" description="Official MAXBE support documents have not been supplied. Find honest guidance and next steps."/><PageHero kicker="SUPPORT & RESOURCES" title="Useful guidance, without imaginary downloads." text="No official manuals, product sheets, warranty documents or technical downloads have been supplied. This page keeps that status clear."/>
    <section className="section"><div className="container"><div className="notice">There are currently no official MAXBE documents available on this website. We will not present placeholder files as downloads.</div><div style={{marginTop:48}} className="section-head"><div><Eyebrow>BEFORE PRODUCT SELECTION</Eyebrow><h2>Details worth gathering before you speak with a professional.</h2></div><p>These prompts are general planning guidance, not MAXBE product specifications or engineering recommendations.</p></div><div className="tile-grid">{[['01','Source','Where the water is: borewell, open well, tank, sump, surface or another source.'],['02','Destination','Where it must go and approximate vertical lift or route, if known.'],['03','Use','Approximate volume and pattern of use. “Not sure” is fine.'],['04','Power','What supply exists at the installation site, if known.'],['05','Site','Indoor, outdoor or well-side conditions and constraints.'],['06','Verification','Ask a qualified professional to check the complete installation.']].map(([n,t,d])=><div className="tile" key={n}><span className="tile-num">{n} / PREP</span><h3>{t}</h3><p>{d}</p></div>)}</div><div style={{marginTop:50}}><Link className="btn" href="/find-your-pump">Open the preliminary finder <ArrowRight size={15}/></Link></div></div></section><CTA title="Need a product document?" text="Official product resources are not available yet. You can outline your question in our non-submitting demo form." href="/contact" label="Open demo enquiry"/>
  </>;
}

function About() {
  return <><Meta title="About MAXBE" description="Learn about MAXBE Industries, its Coimbatore beginnings and pump product ranges."/><PageHero kicker="OUR STORY" title="About MAXBE PUMPS" text="A dedicated team committed to supplying water pump solutions for agriculture, homes and industry."/>
    <section className="section about-story-section"><div className="container split"><div className="story-copy about-story-copy"><Eyebrow>WHO WE ARE</Eyebrow><h2>MAXBE INDUSTRIES — Coimbatore’s trusted pump manufacturer</h2><p>Established in 1992 in Coimbatore, MAXBE Industries manufactures and supplies the MAXBE PUMPS brand, known as the “Low Voltage King”.</p><p>The company’s product range includes monoblock pumps, open well submersible pumps and slim 4-inch V4 submersible pumps.</p><p>The MAXBE website describes its pumps as designed for low-voltage conditions common in rural and semi-urban areas.</p><Link className="text-link" href="/products">Browse Our Products <ArrowRight size={15}/></Link></div><div className="story-panel about-brand-panel"><img src="/images/samples/maxbe-hero-industrial-pumps-sample.jpg" alt="Sample image of pump product range"/><p>MAXBE PUMPS · LOW VOLTAGE KING</p><span>MAXBE Industries · Coimbatore · Est. 1992</span></div></div></section>
    <section className="section about-values-section"><div className="container split"><article className="story-panel"><Eyebrow>OUR MISSION</Eyebrow><h3>Reliable water pump solutions</h3><p>To supply water pump solutions for farmers, homeowners and businesses, with product guidance and after-sales support.</p></article><article className="story-panel"><Eyebrow>OUR VISION</Eyebrow><h3>Water that keeps flowing</h3><p>To be a trusted water pump supplier in the region, known for product quality and straightforward advice.</p></article></div></section>
    <section className="section"><div className="container section-head"><div><Eyebrow>CORE VALUES</Eyebrow><h2>What We Stand For</h2></div><p>Principles that guide the product range and customer experience.</p></div><div className="container tile-grid">{[['01','Precision Engineering','Pump products selected for consistent performance.'],['02','Water Expertise','Experience across water use in agriculture, homes and industry.'],['03','Customer Focus','Understand the application before product selection.'],['04','Efficiency First','Consider efficient operation for the intended water use.']].map(([n,title,text])=><article className="tile benefit-tile" key={n}><span className="tile-num">{n} / MAXBE</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="section about-standard-section"><div className="container section-head"><div><Eyebrow>OUR PROCESS</Eyebrow><h2>How We Ensure Quality</h2></div><p>From product selection to after-sales support.</p></div><div className="container tile-grid">{[['01','Design & Selection','Products selected for Indian water conditions and power requirements.'],['02','Quality Check','Units checked before dispatch.'],['03','Delivery','Products prepared for delivery with documentation.'],['04','After-sales','Contact the MAXBE team by phone or WhatsApp.']].map(([n,title,text])=><article className="tile" key={n}><span className="tile-num">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <HomeFactoryLocation/>
    <CTA title="Ready to find the right pump?" text="Contact MAXBE about a product or application." href="/contact" label="Contact Us"/>
  </>;
}

function NotFound() { return <><Meta title="Page not found" description="The requested MAXBE Pumps page could not be found."/><div className="notfound"><div><div className="eyebrow" style={{justifyContent:'center'}}>PAGE NOT FOUND</div><h1>404</h1><p>This route has no water in it. Let’s get you back on track.</p><Link className="btn" href="/">Back to home <ArrowRight size={15}/></Link></div></div></>; }

function App() {
  return <>
    <Shell><Switch>
      <Route path="/" component={Home}/><Route path="/products" component={Products}/><Route path="/products/:slug" component={ProductDetail}/>
      <Route path="/catalogue" component={Catalogue}/>
      <Route path="/catalogue-dashboard" component={ProductCatalogueDashboard}/>
      <Route path="/applications/agriculture"><Application kind="agriculture"/></Route><Route path="/applications/domestic"><Application kind="domestic"/></Route>
      <Route path="/find-your-pump" component={Finder}/><Route path="/support/resources" component={Resources}/>
      <Route path="/dealers"><Contact dealer/></Route><Route path="/about" component={About}/><Route path="/contact"><Contact/></Route>
      <Route component={NotFound}/>
    </Switch></Shell>
    <CinematicIntro />
  </>;
}

export default App;
