import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowDown, ArrowLeft, ArrowRight, Building2, Check, ChevronDown, CircleHelp, Droplets, Eye, Facebook, Factory, Gauge, House, Instagram, MapPin, Menu, Moon, Phone, PhoneCall, Play, RotateCcw, Search, Sprout, Sun, Waves, Zap, X, type LucideIcon } from 'lucide-react';
import { FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { ContactFactoryLocation, HomeFactoryLocation } from './components/FactoryLocation';
import { SampleProductImage } from './components/SampleProductImage';
import { factoryLocation, factoryMapPlaceUrl } from './data/factory';
import { categories, categoryBySlug, homepageCategoryVideos, motionFocusVideos, productModelBySlug, productVideos, products, SAMPLE_PRODUCT_IMAGE, type ProductGalleryView, type ProductModel, type ProductVideo } from './data/products';
import { socialLinks } from './data/social';
import ProductCatalogueDashboard from './pages/catalogue-dashboard';
import './pages/finder.css';

function isSampleAsset(src: string) {
  return /(?:^|\/)samples\//i.test(src);
}

function Brand() {
  return <Link href="/" className="brand" aria-label="MAXBE Pumps home" data-testid="link-brand"><img className="site-logo" src="/assets/maxbe-logo-transparent.png" alt="MAXBE Pumps logo" /></Link>;
}

function SocialLinks({ className }: { className: string }) {
  return <div className={className} aria-label="MAXBE on social media">
    {socialLinks.map(({ label, url }) => {
      const Icon = label === 'Instagram' ? Instagram : label === 'YouTube' ? FaYoutube : Facebook;
      return <a key={label} className={`social-link-expand social-link-${label.toLowerCase()}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open MAXBE Pumps on ${label}`}><Icon size={18} aria-hidden="true"/><span aria-hidden="true">{label}</span></a>;
    })}
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [location] = useLocation();
  const productsTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); setDropdown(null); }, [location]);
  const toggleTheme = () => {
    const nextIsDarkMode = !isDarkMode;
    setIsDarkMode(nextIsDarkMode);
    document.documentElement.classList.toggle('dark', nextIsDarkMode);
    document.documentElement.style.colorScheme = nextIsDarkMode ? 'dark' : 'light';
    try {
      window.localStorage.setItem('maxbe-theme', nextIsDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Unable to save the MAXBE Pumps theme preference.', error);
    }
  };
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
        <Link href="/about" className={location==='/about'?'active':''}>About</Link>
        <div className="nav-group">
          <button ref={productsTrigger} className={`nav-trigger ${location.startsWith('/products')?'active':''}`} aria-expanded={dropdown==='products'} aria-controls="products-dropdown" onClick={()=>setDropdown(dropdown==='products'?null:'products')} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();openFromKeyboard('products');}}} data-testid="button-nav-products">Products <ChevronDown size={14}/></button>
          {dropdown==='products'&&<div className="nav-dropdown" id="products-dropdown" data-dropdown="products" aria-label="Product categories">
            <Link href="/products" className="dropdown-feature">All product categories <ArrowRight size={14}/></Link>
            {categories.map(category=><Link href={`/products?category=${category.slug}`} key={category.slug}>{category.name}</Link>)}
          </div>}
        </div>
        <Link href="/catalogue" className={location==='/catalogue'?'active':''}>Catalogue</Link>
        <Link href="/dealers" className={`nav-action nav-action-dealer ${location==='/dealers'?'active':''}`}>Find a Dealer</Link>
        <Link href="/find-your-pump" className={`nav-action nav-action-finder ${location==='/find-your-pump'?'active':''}`}>Find a Pump</Link>
        <Link href="/contact" className={location==='/contact'?'active':''}>Contact</Link>
      </div>
      <button
        type="button"
        className={`theme-toggle${isDarkMode ? ' is-dark' : ''}`}
        role="switch"
        aria-checked={isDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleTheme}
        data-testid="button-theme-toggle"
      >
        <Sun className="theme-toggle-sun" size={15} aria-hidden="true" />
        <Moon className="theme-toggle-moon" size={14} aria-hidden="true" />
        <span className="theme-toggle-thumb" aria-hidden="true" />
      </button>
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
      <div className="footer-col"><h4>Company</h4><Link href="/about">About Us</Link><Link href="/become-a-dealer">Become a Dealer</Link><Link href="/dealers">Find a Dealer</Link><Link href="/catalogue">Catalogue</Link><Link href="/contact">Contact Us</Link><Link href="/find-your-pump">Guided Pump Finder</Link></div>
      <div className="footer-col footer-contact"><h4>Contact us</h4><a href="tel:+919488353564">94883 53564</a><a href="tel:+919442573564">94425 73564</a><a href="tel:+914222654185">0422-2654185 (Factory)</a><address>{factoryLocation.addressLines.map(line=><span key={line}>{line}</span>)}</address><a href={`mailto:${factoryLocation.email}`}>{factoryLocation.email}</a><a href={`mailto:${factoryLocation.secondaryEmail}`}>{factoryLocation.secondaryEmail}</a><span>{factoryLocation.businessHours}</span><a href={factoryMapPlaceUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowRight size={14}/></a></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} MAXBE Industries · Coimbatore</span><a href="https://www.maxbepumps.in" target="_blank" rel="noopener noreferrer">www.maxbepumps.in</a></div>
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
  return <div className={`site ${pageStyles ? `ui-enhanced ${pageStyles}` : ''}`}><Header/><main key={location.split('?')[0]} ref={mainRef} className="page-route">{children}</main><Footer/><a className="site-whatsapp-float social-link-expand social-link-whatsapp" href={`https://wa.me/919488353564?text=${encodeURIComponent('Hello MAXBE Pumps, I would like to enquire about your pumps.')}`} target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp chat with MAXBE Pumps"><FaWhatsapp size={23} aria-hidden="true"/><span aria-hidden="true">WhatsApp</span></a></div>;
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
    <div className="page-hero-media" aria-hidden="true"><img src="/images/submersible-assembly.jpg" alt="" loading="eager" fetchPriority="high"/><span>Illustrative equipment visual</span></div>
    <div className="container"><Eyebrow>{kicker}</Eyebrow><h1>{title}</h1><p>{text}</p></div>
  </section>;
}
function CTA({ title,text,href='/find-your-pump',label='Find your pump' }: { title:string;text:string;href?:string;label?:string }) {
  return <section className="band"><div className="container band-inner"><div><Eyebrow>The next step</Eyebrow><h2>{title}</h2><p>{text}</p></div><Link className="btn" href={href}>{label}<ArrowRight size={16}/></Link></div></section>;
}

function HomepageVideoBackground() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const videoCategories = categories.filter(category => homepageCategoryVideos[category.slug]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);
  if (reducedMotion || videoFailed || !videoCategories.length) return null;
  const activeCategory = videoCategories[videoIndex % videoCategories.length];
  const src = homepageCategoryVideos[activeCategory.slug];
  if (!src) return null;
  return <video
    key={activeCategory.slug}
    className="hero-video"
    src={src}
    poster={isSampleAsset(activeCategory.image)?undefined:activeCategory.image}
    autoPlay
    muted
    playsInline
    aria-hidden="true"
    onEnded={() => setVideoIndex(index => (index + 1) % videoCategories.length)}
    onError={() => setVideoFailed(true)}
  />;
}

const motionFocusViews = [
  { id: 'overview', title: 'Product overview', description: 'A clear view of the pump category and its overall design.' },
  { id: 'details', title: 'Construction details', description: 'Close-up footage of product details, once verified footage is available.' },
  { id: 'application', title: 'Pumping application', description: 'A product-specific pumping demonstration, when supplied by MAXBE.' },
] as const;

function MotionInFocus() {
  return <section className="section motion-focus-section" aria-labelledby="motion-focus-heading">
    <div className="container">
      <div className="section-head"><div><Eyebrow>Motion in Focus</Eyebrow><h2 id="motion-focus-heading">Motors, Pumps and Machinery at Work</h2></div><p>Nine video slots cover the three listed categories. Original MAXBE product footage has not been supplied, so no unrelated or sample footage is shown.</p></div>
      <div className="container motion-focus-grid">
        {categories.flatMap(category => motionFocusViews.map(view => {
          const clipId = `${category.slug}-${view.id}`;
          return <article className="motion-focus-card" key={clipId}>
            <div className="motion-focus-poster">
              <span className="motion-focus-icon" aria-hidden="true">{category.icon}</span>
              <span>Original MAXBE footage pending</span>
            </div>
            <div className="motion-focus-copy">
              <span className="category-kicker">{category.name}</span>
              <h3>{view.title}</h3>
              <p>{view.description}</p>
              <ProductVideoControl
                title={category.name}
                reference={view.title}
                poster={isSampleAsset(category.image)?undefined:category.image}
                video={motionFocusVideos[clipId]}
                unavailableText="Verified product video coming soon."
              />
            </div>
          </article>;
        }))}
      </div>
    </div>
  </section>;
}

function Home() {
  return <>
    <Meta title="MAXBE Pumps | Reliable Pumping Solutions" description="Discover MAXBE monoblock, open well submersible and V4 submersible pump ranges for water applications."/>
    <section className="hero" aria-label="Hero section">
      <div className="hero-media" aria-label="Illustrative pump equipment visual">
        <div className="hero-visual-placeholder" aria-hidden="true">
          <img src="/images/maxbe-hero-industrial-pumps.jpg" alt="" fetchPriority="high"/>
          <span>Illustrative pump equipment · MAXBE product photography pending</span>
        </div>
        <HomepageVideoBackground/>
        <div className="hero-visual-caption" aria-hidden="true"><span>Product imagery illustrative</span><b>01</b></div>
      </div>
      <div className="hero-inner animate-in">
        <div className="hero-copy">
          <div className="hero-brand-lockup"><img src="/assets/maxbe-logo-transparent.png" alt="MAXBE Pumps logo"/><span className="hero-slogan">LOW VOLTAGE KING</span></div>
          <h1>Reliable Pumping Solutions<br/><em>for Every Need</em></h1>
          <p>Discover dependable pumping solutions for agricultural, domestic, and industrial water applications with MAXBE PUMPS.</p>
          <ul className="hero-benefits"><li>Three listed MAXBE pump ranges</li><li>Product details and enquiry options</li><li>Help confirming your requirements</li></ul>
          <div className="hero-actions"><Link href="/products" className="btn">Explore Our Products <ArrowRight size={16}/></Link><Link href="/find-your-pump" className="btn outline home-find-pump">Find Your Pump <ArrowRight size={16}/></Link><Link href="/catalogue" className="hero-directions-link">View Catalogue<ArrowRight size={15} aria-hidden="true"/></Link></div>
          <div className="hero-contact-strip"><a href={`mailto:${factoryLocation.email}`}>{factoryLocation.email}</a><span aria-hidden="true">·</span><a href="https://www.maxbepumps.in" target="_blank" rel="noopener noreferrer">www.maxbepumps.in</a><span aria-hidden="true">·</span><a href="tel:+919488353564">94883 53564</a></div>
        </div>
      </div>
    </section>
    <section className="home-highlights" aria-label="Explore the MAXBE website">
      <div className="container home-highlights-grid">
        <div><strong>{products.length}</strong><span>listed product models</span></div>
        <div><strong>{categories.length}</strong><span>pump ranges</span></div>
        <div><strong>Since 1992</strong><span>MAXBE Industries · Coimbatore</span></div>
      </div>
    </section>
    <section className="section home-about-section"><div className="container home-about-grid"><div className="home-about-visual"><SampleProductImage alt="MAXBE pump sample reference image"/><span>Sample pump image · not official catalogue photography</span></div><div className="home-about-copy"><Eyebrow>About MAXBE</Eyebrow><h2>Water movement starts with the right questions.</h2><p>MAXBE Industries is based in Coimbatore and lists monoblock, open well submersible, and V4 submersible pump ranges. Start with your water source and application, then confirm current product details with the MAXBE team.</p><Link className="text-link" href="/about">Learn about MAXBE <ArrowRight size={15}/></Link></div></div></section>
    <section className="section"><div className="container section-head"><div><Eyebrow>What we supply</Eyebrow><h2>Explore our product categories</h2></div><p>Browse the three MAXBE ranges currently listed on this website. Product imagery is illustrative until official photographs are supplied.</p></div>
      <div className="container tile-grid home-category-grid">{categories.map((category,index)=><Link href={`/products?category=${category.slug}`} className="tile home-category-tile" key={category.slug}><span className="home-category-visual"><SampleProductImage src={category.image} alt={`${category.name} sample reference image`}/><small>Sample pump image</small></span><span className="tile-num">Pump range / 0{index+1}</span><h3>{category.name}</h3><p>{category.description}</p><span className="category-browse">Browse range <ArrowRight size={15}/></span></Link>)}</div>
    </section>
    <section className="section section-alternate"><div className="container split"><div className="story-panel"><Eyebrow>Start with the basics</Eyebrow><h3>Useful details to gather</h3><ul><li>Water source: borewell, open well, tank or surface source</li><li>Where the water needs to go</li><li>Approximate height and water requirement, if known</li></ul><span className="status">No model recommendations or specifications confirmed</span></div><div className="story-copy"><Eyebrow>Made for real questions</Eyebrow><h2>Begin with the water source. Not a model number.</h2><p>Is the water in a borewell, an open well, a tank or a surface source? Where does it need to go? These details help shape a sensible conversation before product selection.</p><p>The official catalogue is awaiting confirmation. Until product information is available, category discovery can still be useful—and product claims stay honest.</p><Link className="text-link" href="/find-your-pump">Try the six-step finder <ArrowRight size={15}/></Link></div></div></section>
    <section className="section"><div className="container section-head"><div><Eyebrow>Popular models</Eyebrow><h2>Featured products</h2></div><p>A selection from each category. Browse the full range and individual model details.</p></div>
      <div className="container catalog-grid home-catalog-grid">{[products[0],products[3],products[6]].map(product=><ProductCard key={product.slug} product={product} featured/>)}</div>
      <div className="container"><Link className="btn products-all-link" href="/products">View all products <ArrowRight size={15}/></Link></div>
    </section>
    <MotionInFocus/>
    <section className="section applications-section"><div className="container section-head"><div><Eyebrow>Where water matters</Eyebrow><h2>Solutions for everyday applications.</h2></div><p>Explore common water-use contexts and the questions that help shape a product conversation.</p></div>
      <div className="container application-cards">
        {[
          ['Agricultural irrigation','Explore water movement for fields and irrigation systems.','/applications/agriculture'],
          ['Residential water supply','Start with household storage, supply and daily water needs.','/applications/domestic'],
          ['Garden watering','Consider source, use pattern and the site when planning garden water.','/applications/domestic'],
        ].map(([title,description,href])=><Link href={href} className="application-card" key={title}><div><span>Application guide</span><h3>{title}</h3><p>{description}</p><b>Explore application <ArrowRight size={15}/></b></div></Link>)}
      </div>
    </section>
    <section className="section home-discovery-section"><div className="container home-discovery-grid"><article><span className="home-discovery-icon"><Search size={22}/></span><Eyebrow>Guided selection</Eyebrow><h2>Find your pump</h2><p>Answer a few practical questions and explore the listed MAXBE categories that may be relevant. Final selection should be confirmed with the team.</p><Link className="btn" href="/find-your-pump">Start pump finder <ArrowRight size={15}/></Link></article><article><span className="home-discovery-icon"><MapPin size={22}/></span><Eyebrow>Dealer availability</Eyebrow><h2>Find a dealer</h2><p>Share your location with MAXBE to ask about dealer availability. The website does not yet include a verified dealer directory.</p><Link className="btn outline" href="/dealers">Check in your area <ArrowRight size={15}/></Link></article><article><span className="home-discovery-icon"><Building2 size={22}/></span><Eyebrow>Business enquiry</Eyebrow><h2>Become a dealer</h2><p>Share your business details with MAXBE to discuss potential dealership opportunities and available products.</p><Link className="btn outline" href="/become-a-dealer#enquiry-form">Apply for dealership <ArrowRight size={15}/></Link></article></div></section>
    <section className="section home-enquiry-section"><div className="container home-enquiry-panel"><div><Eyebrow>Talk to MAXBE</Eyebrow><h2>Have a water requirement to discuss?</h2><p>Share your application, water source, and location. The MAXBE team can help confirm available product information.</p></div><Link className="btn" href="/contact#enquiry-form">Send an enquiry <ArrowRight size={15}/></Link></div></section>
    <section className="section why-section"><div className="container section-head"><div><Eyebrow>Why MAXBE Pumps</Eyebrow><h2>A helpful start for your water needs.</h2></div><p>Clear category discovery and application-focused guidance, with product facts kept honest until officially confirmed.</p></div>
      <div className="container tile-grid">{[['01','Agriculture & home','Explore categories for agricultural and domestic water applications.'],['02','Selection assistance','Use practical prompts to gather useful site and water-source details.'],['03','Application focused','Start with the job to be done, not an unverified model number.'],['04','Enquiry support','Send your questions directly to the MAXBE team.']].map(([n,title,text])=><article className="tile benefit-tile" key={n}><span className="tile-num">{n} / The MAXBE approach</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <HomeFactoryLocation/>
    <CTA title="Need a pump? Let’s find the right one for you." text="Tell us about your application and water requirement. Contact MAXBE to check product information and availability." href="/contact#enquiry-form" label="Send an enquiry"/>
    <section className="section tight"><div className="container notice"><b>Product information.</b> Model names and specifications shown here are reproduced from the public MAXBE reference website. Please confirm current specifications and availability with MAXBE before purchase.</div></section>
  </>;
}

function ProductCard({ product, featured = false }: { product: ProductModel; featured?: boolean }) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const category=categoryBySlug(product.categorySlug);
  const whatsappUrl=`https://wa.me/919488353564?text=${encodeURIComponent(`Hello MAXBE Pumps, I am interested in the ${product.name} (model: ${product.model}). Please share more details and pricing.`)}`;
  const expandOnTouch = (action: string) => (event: ReactMouseEvent<HTMLElement>) => {
    if (window.matchMedia('(hover: none)').matches && expandedAction !== action) {
      event.preventDefault();
      setExpandedAction(action);
    }
  };
  return <article className="product-card">
    <Link href={`/products/${product.slug}`} className="product-card-visual" aria-label={`View ${product.name} ${product.model}`}>
      <div className="home-product-image"><SampleProductImage src={product.image} alt={`${product.name} ${product.model} sample reference image`}/><span className="product-category-badge">{category?.icon} {category?.name}</span></div>
    </Link>
    <div className="product-body"><div className="category-kicker">{category?.icon} {category?.name}</div><p className="product-model">Model: {product.model}</p><h3>{product.name}</h3><p>{product.description}</p>
      <div className="product-spec-highlights"><span><small>Motor power</small><b>{product.motorPower}</b></span><span><small>Max head</small><b>{product.maxHead}</b></span></div>
      {featured
        ? <div className="product-card-actions home-feature-actions">
            <div className={`home-feature-action-wrap${expandedAction === 'details' ? ' is-expanded' : ''}`}>
              <Link className="btn product-view-link home-feature-action" href={`/products/${product.slug}`} aria-label="View details" title="View details" onClick={expandOnTouch('details')}><Eye size={18} aria-hidden="true"/><span>View details</span></Link>
            </div>
            <div className={`home-feature-action-wrap${expandedAction === 'call' ? ' is-expanded' : ''}`}>
              <a className="btn outline product-call-link home-feature-action" href="tel:+919488353564" aria-label="Call Us" title="Call Us" onClick={expandOnTouch('call')}><Phone size={18} aria-hidden="true"/><span>Call Us</span></a>
            </div>
            <div className={`home-feature-action-wrap home-feature-video-wrap${expandedAction === 'video' ? ' is-expanded' : ''}`}>
              <ProductVideoControl title={product.name} reference={product.model} poster={isSampleAsset(product.image)?undefined:product.image} video={productVideos[product.slug]??{type:'link',src:'https://youtu.be/oVi2zkgylWo?si=g3-Q_1wx1seD_iJB'}} compact expanded={expandedAction === 'video'} onCompactClick={expandOnTouch('video')}/>
            </div>
          </div>
        : <>
            <div className="product-card-actions"><Link className="btn product-view-link" href={`/products/${product.slug}`}><Eye size={16} aria-hidden="true"/>View details</Link><a className="btn outline product-call-link" href="tel:+919488353564"><Phone size={16} aria-hidden="true"/>Call Us</a><a className="quote-link whatsapp-enquiry" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Enquire <FaWhatsapp size={16} aria-hidden="true"/></a></div>
            <ProductVideoControl title={product.name} reference={product.model} poster={isSampleAsset(product.image)?undefined:product.image} video={productVideos[product.slug]??{type:'link',src:'https://youtu.be/oVi2zkgylWo?si=g3-Q_1wx1seD_iJB'}}/>
          </>}
    </div>
  </article>;
}

function ProductVideoControl({ title, reference, poster, video, unavailableText = 'Product video coming soon.', compact = false, expanded = false, onCompactClick }: { title: string; reference: string; poster?: string; video?: ProductVideo; unavailableText?: string; compact?: boolean; expanded?: boolean; onCompactClick?: (event: ReactMouseEvent<HTMLElement>) => void }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  if (!video) return <p className="product-video-unavailable">{unavailableText}</p>;

  if (video.type === 'link') {
    return <a className={`product-video-button${compact ? ` home-feature-action${expanded ? ' is-expanded' : ''}` : ''}`} href={video.src} target="_blank" rel="noopener noreferrer" aria-label={compact ? 'Play Product Video' : undefined} title={compact ? 'Play Product Video' : undefined} onClick={compact ? onCompactClick : undefined}>
      <Play size={18} aria-hidden="true"/><span>Play Product Video</span>
    </a>;
  }

  return <>
    <button className={`product-video-button${compact ? ` home-feature-action${expanded ? ' is-expanded' : ''}` : ''}`} type="button" aria-label={compact ? 'Play Product Video' : undefined} title={compact ? 'Play Product Video' : undefined} onClick={event => {
      if (compact && onCompactClick) {
        onCompactClick(event);
        if (event.defaultPrevented) return;
      }
      setFailed(false);
      setOpen(true);
    }}>
      <Play size={18} aria-hidden="true"/><span>Play Product Video</span>
    </button>
    {open && <div className="product-video-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget) setOpen(false);
    }}>
      <section className="product-video-dialog" role="dialog" aria-modal="true" aria-label={`${title} ${reference} product video`}>
        <header><h2>{title} · {reference}</h2><button type="button" className="product-video-close" onClick={() => setOpen(false)} aria-label="Close product video"><X size={20}/></button></header>
        {failed
          ? <p className="product-video-error" role="alert">This product video could not be loaded.</p>
          : video.type === 'file'
            ? <video src={video.src} poster={poster} controls playsInline onError={() => setFailed(true)}>Your browser does not support video playback.</video>
            : <iframe src={video.src} title={`${title} · ${reference} product video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen/>}
      </section>
    </div>}
  </>;
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
    <SampleProductImage src={SAMPLE_PRODUCT_IMAGE} className="product-gallery-sample-image" alt={`${product.name} ${product.model} sample reference image`}/>
    <div className="product-gallery-thumbnails" role="group" aria-label={`${product.model} product image views`}>
      {galleryViews.map((view,index)=><button key={view.label} type="button" className={`product-gallery-thumbnail${selectedIndex===index?' is-active':''}`} aria-pressed={selectedIndex===index} aria-label={`Show sample ${view.label} view of ${product.model}`} onClick={()=>setSelectedIndex(index)}>
        <SampleProductImage className="product-gallery-thumbnail-image" alt=""/><span>{view.label}<small>Sample</small></span>
      </button>)}
    </div>
    <figcaption aria-live="polite">Sample reference image · {selectedView.label} view not verified.</figcaption>
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
  return <><Meta title="Product catalogue" description="Browse MAXBE monoblock, open well submersible and V4 submersible pump models."/>
    <PageHero kicker="MAXBE product ranges" title="Explore Our Pumping Solutions" text="Browse the monoblock, open well submersible, and V4 submersible pump ranges currently listed by MAXBE."/>
    <section className="section product-listing-section"><div className="container">
      <div className="catalog-tools"><label className="searchbox"><Search size={18}/><input aria-label="Search products" placeholder="Search products…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
        <div className="product-category-filters" role="group" aria-label="Category filters">
          <button type="button" className={filter==='all'?'active':''} onClick={()=>setCategory('all')}>All products</button>
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
    return <><Meta title={category.name} description={`${category.name} pump models in the MAXBE product catalogue.`}/><PageHero kicker="Product range" title={category.name} text={category.description}/><section className="section category-product-range-section"><div className="container"><div className="category-range-heading"><span className="category-icon">{category.icon}</span><div><Eyebrow>Product range</Eyebrow><h2>{category.name}</h2><p>{category.description}</p></div></div><div className="catalog-grid">{categoryProducts.map(item=><ProductCard product={item} key={item.slug}/>)}</div></div></section></>;
  }
  const category=categoryBySlug(product.categorySlug);
  if(!category)return <NotFound/>;
  const whatsappUrl=`https://wa.me/919488353564?text=${encodeURIComponent(`Hello MAXBE Pumps, I am interested in the ${product.name} (model: ${product.model}). Please share more details and pricing.`)}`;
  const related=products.filter(item=>item.categorySlug===product.categorySlug&&item.slug!==product.slug);
  return <><Meta title={`${product.name} ${product.model}`} description={`${product.name}, model ${product.model}. ${product.description}`}/>
    <nav className="container category-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><Link href={`/products?category=${category.slug}`}>{category.name}</Link><span>/</span><span aria-current="page">{product.model}</span></nav>
    <section className="section product-detail-section"><div className="container product-detail-layout">
      <ProductGallery key={product.slug} product={product}/>
      <div className="category-detail-copy">
        <article className="product-detail-summary">
          <span className="category-kicker">{category.icon} {category.name}</span><h1>{product.name}</h1><p className="product-detail-model">Model: {product.model}</p><p>{product.description}</p>
          <h2>Technical specifications</h2><div className="product-detail-specs">{(product.specifications??[{label:'Motor power',value:product.motorPower},{label:'Max head',value:product.maxHead}]).map(spec=><div className="product-specification" key={spec.label}><span>{spec.label}</span><strong>{spec.value}</strong></div>)}</div>
          {product.features&&<><h2>Key features</h2><ul className="product-feature-list">{product.features.map(feature=><li key={feature}><Check size={16}/>{feature}</li>)}</ul></>}
          {product.applications&&<><h2>Suitable for</h2><div className="product-application-chips">{product.applications.map(application=><span key={application}>{application}</span>)}</div></>}
          <div className="product-detail-actions"><div className="product-detail-button-slot whatsapp-enquiry-slot"><a className="btn whatsapp-enquiry" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Enquiry"><FaWhatsapp size={18} aria-hidden="true"/><span>WhatsApp Enquiry</span></a></div><div className="product-detail-button-slot call-us-slot"><a className="btn outline" href="tel:+919488353564" aria-label="Call Us"><Phone size={18} aria-hidden="true"/><span>Call Us</span></a></div><div className="product-detail-video-slot"><ProductVideoControl title={product.name} reference={product.model} poster={isSampleAsset(product.image)?undefined:product.image} video={productVideos[product.slug]??{type:'link',src:'https://youtu.be/oVi2zkgylWo?si=g3-Q_1wx1seD_iJB'}}/></div></div>
          <p className="product-reference-note">Specifications and product information are shown as published on the public MAXBE reference website. Confirm before purchase.</p>
        </article>
      </div>
    </div></section>
    <section className="section product-enquiry-section"><div className="container"><div className="section-head"><div><Eyebrow>Enquire about this model</Eyebrow><h2>Send an enquiry</h2></div><p>Prepare a product-specific email enquiry draft using your device.</p></div><ContactForm initialProduct={product.slug}/></div></section>
    {related.length>0&&<section className="section related-products-section"><div className="container"><div className="section-head"><div><Eyebrow>More in this range</Eyebrow><h2>Related products</h2></div><p>Other models in {category.name}.</p></div><div className="catalog-grid">{related.map(item=><ProductCard product={item} key={item.slug}/>)}</div></div></section>}
  </>;
}

function Catalogue() {
  return <>
    <Meta title="MAXBE product catalogue" description="Browse MAXBE pump ranges and download a product-range overview PDF."/>
    <PageHero kicker="Product information" title="Explore Our Product Catalogue" text="Browse our range of MAXBE pumping solutions and access product information."/>
    <section className="section catalogue-page">
      <div className="container">
        <div className="catalogue-download-panel">
          <div><Eyebrow>Official product brochure</Eyebrow><h2>Catalogue PDF currently unavailable</h2><p>The official MAXBE brochure PDF has not been supplied for this website, so no placeholder or generated file is presented as the brochure. Browse the listed pump ranges below and contact MAXBE to confirm current product information.</p><button className="btn catalogue-unavailable-button" type="button" disabled title="The official MAXBE catalogue PDF has not been supplied">Download Catalogue PDF · Unavailable</button></div>
        </div>
        <div className="catalogue-page-grid">
          {categories.map((category,index)=>{
            const categoryProducts=products.filter(product=>product.categorySlug===category.slug);
            return <article className="catalogue-page-card" key={category.slug}>
              <div className="catalogue-category-placeholder" role="img" aria-label={`${category.name} product photography pending`}><span>{category.icon}</span><small>Product photography pending</small></div>
              <div><span className="catalogue-page-index">Range / 0{index+1}</span><h2>{category.name}</h2><p>{category.description}</p><p className="catalogue-model-count">{categoryProducts.length} listed models</p><Link className="text-link" href={`/products?category=${category.slug}`}>Browse this range <ArrowRight size={15}/></Link></div>
            </article>;
          })}
        </div>
      </div>
    </section>
    <CTA title="Need product or dealership information?" text="Talk with MAXBE about the listed ranges, current availability, or a potential dealership enquiry." href="/become-a-dealer#enquiry-form" label="Enquire about dealership"/>
  </>;
}

function Application({ kind }: { kind:'agriculture'|'domestic' }) {
  const farm=kind==='agriculture';
  return <><Meta title={farm?'Agricultural applications':'Domestic applications'} description={`Explore water-pump considerations for ${farm?'agriculture and irrigation':'household water management'} with MAXBE Pumps.`}/>  <PageHero kicker={farm?'Application · Agriculture':'Application · Domestic'} title={farm?'Water is part of every field decision.':'Water for the everyday rhythm of home.'} text={farm?'For irrigation, crop water management and farm use, the right starting point is understanding the water source and where it needs to travel.':'For a home, begin with the water source, storage arrangement and the places water needs to reach.'}/>
    <section className="section"><div className="container split"><div className="story-panel application-note"><Eyebrow>{farm?'Field checklist':'Home checklist'}</Eyebrow><h3>{farm?'Information to gather':'Household details to note'}</h3><ul>{(farm?['Water source and seasonal variation','Where water needs to travel','Approximate requirement and lifting height, if known']:['Water source and storage arrangement','Floors, tanks or fixtures to be supplied','Approximate height and daily use, if known']).map(item=><li key={item}>{item}</li>)}</ul><span className="status">Planning guidance only · confirm requirements with a qualified professional</span></div><div className="story-copy"><Eyebrow>{farm?'Field to source':'Source to tap'}</Eyebrow><h2>{farm?'Start with the source. Then map the route.':'A useful first conversation starts at home.'}</h2><p>{farm?'Borewell, open well, surface water or a storage tank: each source raises different questions. Note your approximate water requirement and lifting height if you know them.':'Consider where water comes from, whether there is a tank or sump, and which floors or fixtures need supply. Approximate height and usage can help a qualified professional understand the setup.'}</p><p>These pages offer general planning prompts only. MAXBE product range and specifications are awaiting official confirmation.</p><Link href="/find-your-pump" className="btn">Start the preliminary finder <ArrowRight size={15}/></Link></div></div></section>
    <section className="section section-alternate"><div className="container section-head"><div><Eyebrow>Three things to note</Eyebrow><h2>Bring useful context to the conversation.</h2></div><p>Unknown is a valid answer. A qualified professional should verify every installation requirement.</p></div><div className="container tile-grid">{(farm?[['01','Water source','Borewell, open well, surface water or storage.'],['02','Where it goes','Distance, height and irrigation layout, if known.'],['03','Power available','Single-phase, three-phase, solar or not sure.']]:[['01','Water source','Municipal, borewell, tank, sump or another source.'],['02','Building layout','Floors, tank position and approximate height.'],['03','Daily use','Household needs and times of highest demand.']]).map(([n,t,d])=><div className="tile" key={n}><span className="tile-num">{n} / Note</span><h3>{t}</h3><p>{d}</p></div>)}</div></section><CTA title="Take what you know. Leave the rest blank." text="The finder accepts unknown flow and head values and offers only a preliminary category direction."/>
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

const finderOptionIcons:Record<string,LucideIcon>={
  agriculture:Sprout,
  home:House,
  commercial:Building2,
  drainage:Waves,
  borewell:ArrowDown,
  'open well':Droplets,
  'tank or sump':Gauge,
  surface:Waves,
  other:CircleHelp,
  unknown:CircleHelp,
  low:ArrowDown,
  moderate:Gauge,
  high:Zap,
  'single-phase':Zap,
  'three-phase':Zap,
  solar:Zap,
  'not sure':CircleHelp,
  indoors:House,
  outdoors:Factory,
  well:Droplets,
};

function Finder() {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<Answers>({});
  const [error,setError]=useState('');
  const selectorRef=useRef<HTMLElement|null>(null);
  const done=step>=finderSteps.length;
  const current=finderSteps[Math.min(step,finderSteps.length-1)];
  const progress=done?100:Math.round(step/finderSteps.length*100);
  const restart=()=>{setAnswers({});setError('');setStep(0);};
  const next=()=>{
    if([0,1,4,5].includes(step)&&!answers[step]){setError('Choose an answer to continue.');return;}
    setError('');
    setStep(step+1);
  };
  const startFinder=()=>{
    selectorRef.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  };
  const suggestedCategories=answers[1]==='borewell'
    ?categories.filter(category=>category.slug==='v4-submersible')
    :answers[1]==='open well'
      ?categories.filter(category=>category.slug==='openwell')
      :categories;
  const selectedAnswers=finderSteps.map((question,index)=>({
    question:question.title,
    answer:question.options.find(([value])=>value===answers[index])?.[1]??'Not specified',
  }));
  return <div className="pump-finder-page">
    <Meta title="Find a Pump" description="Answer six questions to explore MAXBE pump categories. This preliminary guide does not replace a confirmed pump selection."/>
    <section className="pump-finder-hero">
      <div className="pump-finder-hero-inner">
        <div className="pump-finder-hero-copy">
          <span className="pump-finder-eyebrow"><span/>MAXBE PUMP SELECTOR</span>
          <h1>Find the Right Pump for Your Water Needs</h1>
          <p>Discover the right MAXBE pump category based on your application, water source, and installation requirements. Answer a few simple questions to get started.</p>
          <button className="pump-finder-primary" type="button" onClick={startFinder}>START FINDING YOUR PUMP <ArrowRight size={17}/></button>
          <span className="pump-finder-hero-note"><Check size={15}/> Six simple questions <span aria-hidden="true">·</span> Preliminary category guidance</span>
        </div>
        <div className="pump-finder-hero-art" role="img" aria-label="Illustrative industrial water pump graphic, not a product photograph">
          <div className="pump-finder-art-orbit pump-finder-art-orbit-one"/>
          <div className="pump-finder-art-orbit pump-finder-art-orbit-two"/>
          <div className="pump-finder-art-waterline"/>
          <svg className="pump-finder-pump-svg" viewBox="0 0 480 360" aria-hidden="true">
            <ellipse cx="243" cy="306" rx="164" ry="17" fill="#183153" opacity=".11"/>
            <path d="M75 302h335" fill="none" stroke="#183153" strokeWidth="5" strokeLinecap="round" opacity=".22"/>
            <path d="M152 275v24m159-24v24" stroke="#183153" strokeWidth="13" strokeLinecap="round"/>
            <path d="M126 270h214v18H126z" rx="8" fill="#183153"/>
            <rect x="131" y="185" width="157" height="87" rx="22" fill="#183153"/>
            <path d="M147 199v59m18-61v63m18-63v63m18-63v63m18-63v63m18-63v63" stroke="#6F88A5" strokeWidth="5" strokeLinecap="round" opacity=".7"/>
            <path d="M280 203c18-18 50-17 65 0l17 20v33l-19 18h-63z" fill="#D71920"/>
            <circle cx="337" cy="239" r="22" fill="#fff" opacity=".95"/>
            <circle cx="337" cy="239" r="12" fill="#E6AD32"/>
            <path d="M218 185v-24h57v24" fill="#183153"/>
            <path d="M244 161v-44h37v-31h43" fill="none" stroke="#183153" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M321 86h46" stroke="#D71920" strokeWidth="13" strokeLinecap="round"/>
            <path d="M126 226h-35v46h35" fill="#183153"/>
            <circle cx="92" cy="249" r="12" fill="#E6AD32"/>
            <path d="M131 280h213" stroke="#fff" strokeWidth="3" opacity=".45"/>
            <path d="M111 320c15-10 30-10 45 0s30 10 45 0 30-10 45 0 30 10 45 0 30-10 45 0 30 10 45 0" fill="none" stroke="#4EA6CB" strokeWidth="5" strokeLinecap="round" opacity=".75"/>
          </svg>
          <div className="pump-finder-art-label"><span className="pump-finder-art-label-dot"/><span>INDUSTRIAL PUMP<br/><small>Illustrative category visual</small></span></div>
          <div className="pump-finder-art-drop"><Droplets size={23}/></div>
        </div>
      </div>
      <div className="pump-finder-hero-bottom"><span>MONOBLOCK</span><i/><span>OPEN WELL</span><i/><span>V4 SUBMERSIBLE</span></div>
    </section>

    <section className="pump-finder-selector" ref={selectorRef} aria-labelledby="pump-finder-selector-title">
      <div className="pump-finder-section-heading">
        <div><span className="pump-finder-eyebrow"><span/>A SIMPLE SIX-STEP GUIDE</span><h2 id="pump-finder-selector-title">Start with what you know.</h2></div>
        <p>Choose the closest answer. If you’re unsure, leave it open and discuss it with MAXBE.</p>
      </div>
      <div className="pump-finder-workspace">
        <aside className="pump-finder-progress-card">
          <div className="pump-finder-progress-heading"><span>YOUR PROGRESS</span><strong>{done?finderSteps.length:step+1}<small> / {finderSteps.length}</small></strong></div>
          <div className="pump-finder-progress-track" role="progressbar" aria-label="Pump finder progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{width:`${progress}%`}}/></div>
          <p className="pump-finder-progress-copy">{done?'Questions complete':'A few details help start the conversation.'}</p>
          <ol className="pump-finder-step-list">
            {finderSteps.map((question,index)=><li key={question.title} className={index===step?'is-current':index<step?'is-complete':''}>
              <button type="button" onClick={()=>{if(index<step){setStep(index);setError('');}}} disabled={index>=step} aria-current={index===step?'step':undefined} aria-label={index<step?`Edit answer ${index+1}: ${question.title}`:`Question ${index+1}: ${question.title}`}>
                <span className="pump-finder-step-number">{index<step?<Check size={14}/>:`0${index+1}`}</span><span>{question.title}</span>{index<step&&<span className="pump-finder-edit-label">EDIT</span>}
              </button>
            </li>)}
          </ol>
          <button className="pump-finder-restart" type="button" onClick={restart}><RotateCcw size={15}/>Restart selection</button>
        </aside>

        <div className="pump-finder-question-card" aria-live="polite">
          {!done?<div key={step} className="pump-finder-question-content">
            <div className="pump-finder-question-meta"><span>QUESTION {String(step+1).padStart(2,'0')}</span><span>{String(finderSteps.length-step).padStart(2,'0')} TO GO</span></div>
            <h2>{current.title}</h2>
            <p className="pump-finder-question-subtitle">{current.subtitle}</p>
            <div className="pump-finder-answer-grid">
              {current.options.map(([value,label,detail])=>{
                const OptionIcon=finderOptionIcons[value]??CircleHelp;
                const selected=answers[step]===value;
                return <button key={value} type="button" onClick={()=>{setAnswers({...answers,[step]:value});setError('');}} className={`pump-finder-answer${selected?' is-selected':''}`} aria-pressed={selected}>
                  <span className="pump-finder-answer-icon"><OptionIcon size={20} strokeWidth={1.8}/></span>
                  <span className="pump-finder-answer-copy"><strong>{label}</strong><small>{detail}</small></span>
                  <span className="pump-finder-answer-check">{selected&&<Check size={15}/>}</span>
                </button>;
              })}
            </div>
            {error&&<p className="pump-finder-error" role="alert">{error}</p>}
            <div className="pump-finder-question-actions">
              <button className="pump-finder-secondary" type="button" onClick={()=>{setStep(Math.max(0,step-1));setError('');}} disabled={step===0}><ArrowLeft size={16}/>Back</button>
              <button className="pump-finder-primary" type="button" onClick={next}>NEXT QUESTION <ArrowRight size={16}/></button>
            </div>
          </div>:<div className="pump-finder-result">
            <span className="pump-finder-eyebrow"><span/>YOUR PRELIMINARY RESULT</span>
            <h2>Your Pump Selection Starting Point</h2>
            <p className="pump-finder-result-intro">Your answers are a helpful conversation starter. Explore the MAXBE categories below; the result does not confirm product suitability.</p>
            <div className="pump-finder-result-categories">
              {suggestedCategories.map((category,index)=>{
                const CategoryIcon=index===0&&category.slug==='v4-submersible'?Zap:category.slug==='openwell'?Droplets:category.slug==='monoblock'?Gauge:Factory;
                return <article className={`pump-finder-category-card pump-finder-category-${category.slug}`} key={category.slug}>
                  <div className="pump-finder-category-visual" role="img" aria-label={`${category.name} illustration; verified MAXBE product photography is unavailable`}>
                    <span className="pump-finder-category-mark"><CategoryIcon size={31} strokeWidth={1.6}/></span>
                    <span className="pump-finder-photo-note">CATEGORY ILLUSTRATION</span>
                    <span className="pump-finder-category-watermark" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
                  </div>
                  <div className="pump-finder-category-copy"><span className="pump-finder-category-kicker">MAXBE PRODUCT CATEGORY</span><h3>{category.name}</h3><p>{category.description}</p><Link className="pump-finder-category-link" href={`/products?category=${category.slug}`}>VIEW PRODUCTS <ArrowRight size={15}/></Link></div>
                </article>;
              })}
            </div>
            <div className="pump-finder-answer-summary"><div className="pump-finder-summary-heading"><div><span className="pump-finder-category-kicker">YOUR RESPONSES</span><h3>Details to discuss</h3></div><button type="button" onClick={()=>{setStep(0);setError('');}}>Edit answers</button></div><dl>{selectedAnswers.map(item=><div key={item.question}><dt>{item.question}</dt><dd>{item.answer}</dd></div>)}</dl></div>
            <p className="pump-finder-disclaimer"><CircleHelp size={17}/><span>This is preliminary category guidance only. Final pump selection, product specifications, availability and installation requirements must be confirmed with the MAXBE team.</span></p>
            <div className="pump-finder-result-actions"><Link className="pump-finder-secondary" href="/dealers">Find a Dealer <ArrowRight size={16}/></Link><Link className="pump-finder-primary" href="/contact">Contact MAXBE <ArrowRight size={16}/></Link></div>
          </div>}
        </div>
      </div>
    </section>

    <section className="pump-finder-support">
      <div className="pump-finder-support-mark"><PhoneCall size={27}/></div>
      <div className="pump-finder-support-copy"><span className="pump-finder-eyebrow"><span/>PERSONAL GUIDANCE</span><h2>Need Help Choosing the Right Pump?</h2><p>Not sure which category matches your water source or installation? Share what you know with MAXBE and confirm the right next step with the team.</p></div>
      <div className="pump-finder-support-actions"><Link className="pump-finder-primary" href="/contact">CONTACT MAXBE <ArrowRight size={16}/></Link><Link className="pump-finder-support-link" href="/dealers">Find a Dealer <ArrowRight size={15}/></Link></div>
    </section>
  </div>;
}

function ContactForm({dealer=false,initialProduct='',initialLocation=''}:{dealer?:boolean;initialProduct?:string;initialLocation?:string}) {
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
    const phoneFormatValid=/^[+()\d.\-\s]+$/.test(phone);
    if(!name||!phone||!phoneFormatValid||phoneDigits.length<8||phoneDigits.length>15||!message||(dealer&&!location)||!(emailInput instanceof HTMLInputElement)||!emailInput.checkValidity()){
      const missing= [
        !name&&'your name',
        (!phone||!phoneFormatValid||phoneDigits.length<8||phoneDigits.length>15)&&'a valid phone number',
        dealer&&!location&&'your location',
        !message&&'a message',
      ].filter(Boolean);
      setError(emailInput instanceof HTMLInputElement&&!emailInput.checkValidity()
        ?'Enter a valid email address, or leave the optional email field empty.'
        :`Please provide ${missing.join(', ')}.`);
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
    ].filter((line,index)=>line||index===5).join('\n');
    setError('');
    setNotice('If your device supports email links, an enquiry draft should open. The website has not sent your request; review and send it in your email application.');
    window.location.href=`mailto:${factoryLocation.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
  };
  return <form className="form-card" onSubmit={submit} noValidate>
    {error&&<div className="notice" role="alert" style={{borderLeftColor:'#C91D28',marginBottom:18}}>{error}</div>}
    {notice&&<div className="notice" role="status">{notice}</div>}
    <div className="form-grid">
      <div className="field"><label htmlFor="contact-name">Full name *</label><input id="contact-name" name="name" required autoComplete="name" placeholder="Your name"/></div>
      <div className="field"><label htmlFor="contact-phone">Phone *</label><input id="contact-phone" name="phone" type="tel" required autoComplete="tel" placeholder="94883 53564"/></div>
      <div className="field wide"><label htmlFor="contact-email">Email (optional)</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="your@email.com"/></div>
      <div className="field wide"><label htmlFor="contact-product">Product interest</label><select id="contact-product" name="product" value={selectedProduct} onChange={event=>setSelectedProduct(event.target.value)}><option value="">— Select a model (optional) —</option>{categories.map(category=><optgroup key={category.slug} label={category.name}>{products.filter(product=>product.categorySlug===category.slug).map(product=><option key={product.slug} value={product.slug}>{product.model}</option>)}</optgroup>)}<option value="general">General enquiry</option></select></div>
      {dealer&&<div className="field wide"><label htmlFor="contact-location">Location / city / PIN *</label><input id="contact-location" name="location" required autoComplete="postal-code" defaultValue={initialLocation} placeholder="City, district or PIN"/></div>}
      <div className="field wide"><label htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" required rows={4} placeholder={selectedModel?`I'm interested in the ${selectedModel.model}. Please provide more details.`:'Describe your water requirement — source, intended use and location.'}/></div>
    </div>
    <p className="form-delivery-note">Enquiry delivery uses your device’s email application. The website does not send or store enquiries.</p>
    <button className="btn" type="submit" data-testid="button-submit-enquiry">Send an enquiry <ArrowRight size={15}/></button>
  </form>;
}

function Contact({dealer=false}:{dealer?:boolean}) {
  useEffect(()=>{
    if(window.location.hash!=='#enquiry-form')return;
    window.requestAnimationFrame(()=>document.getElementById('enquiry-form')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
  },[]);
  const categoryParam=new URLSearchParams(window.location.search).get('category')??'';
  const productParam=new URLSearchParams(window.location.search).get('product')??'';
  const locationParam=new URLSearchParams(window.location.search).get('location')??'';
  const initialProduct=products.find(product=>product.slug===productParam)?.slug
    ??products.find(product=>product.categorySlug===categoryParam)?.slug
    ??'';
  return <><Meta title={dealer?'Become a dealer':'Contact MAXBE Industries'} description="Contact MAXBE Industries in Coimbatore about pump products, dealership enquiries and factory directions."/><PageHero kicker={dealer?'Dealer network':'Get in touch'} title={dealer?'Grow Your Business with Maxbe Pumps':'Contact Us'} text={dealer?'Are you a motor dealer, pump distributor, agricultural equipment supplier, or industrial products retailer? Connect with Maxbe Pumps to discuss potential dealership opportunities and explore the available product range.':'Enquire about products or visit our factory.'}/>
    {!dealer&&<ContactFactoryLocation/>}
    <section className="section contact-enquiry-section" id="enquiry-form"><div className="container contact-layout"><div className="contact-intro"><Eyebrow>{dealer?'Dealer enquiry':'MAXBE Industries · Est. 1992'}</Eyebrow><h2>{dealer?'Apply for dealership':'Send an enquiry'}</h2><p>{dealer?'Share your business and location details through the form. MAXBE can then review the enquiry and respond using the contact information you provide. No dealership terms or availability are guaranteed.':'We usually respond during business hours. Select a product model if you would like to include it in your message.'}</p><div className="notice">This form prepares an email draft using your device’s email application. The website does not send or store enquiries.</div><SocialLinks className="contact-social-links"/></div><ContactForm dealer={dealer} initialProduct={initialProduct} initialLocation={dealer?locationParam:''}/></div></section>
  </>;
}

function FindDealer() {
  return <><Meta title="Find a dealer" description="Ask MAXBE Industries to check dealer availability in your area. A verified dealer directory is not available on this website."/><PageHero kicker="Dealer network" title="Find a MAXBE Pumps dealer" text="Tell us your city or PIN and the MAXBE team can respond about dealer availability. No verified dealer directory has been supplied for this website."/>
    <section className="section"><div className="container find-dealer-panel">
      <div><Eyebrow>Dealer availability</Eyebrow><h2>Check availability in your area</h2><p>Enter your city, district or PIN to send a dealer-availability enquiry to MAXBE. The website does not currently have a verified directory to display search results.</p>
        <form className="find-dealer-search" action="/become-a-dealer#enquiry-form" method="get"><label htmlFor="dealer-search-location">City, district or PIN</label><div><input id="dealer-search-location" name="location" autoComplete="postal-code" placeholder="e.g. Coimbatore or PIN code"/><button className="btn" type="submit">Ask MAXBE <ArrowRight size={15}/></button></div></form>
      </div>
      <div className="find-dealer-actions"><a className="btn" href="tel:+919488353564"><PhoneCall size={16}/>Call MAXBE</a><Link className="btn outline" href="/contact#enquiry-form">General enquiry</Link></div>
    </div></section>
  </>;
}

function Resources() {
  return <><Meta title="Support & resources" description="Official MAXBE support documents have not been supplied. Find honest guidance and next steps."/><PageHero kicker="Support & resources" title="Useful guidance, without imaginary downloads." text="No official manuals, product sheets, warranty documents or technical downloads have been supplied. This page keeps that status clear."/>
    <section className="section"><div className="container"><div className="notice">There are currently no official MAXBE documents available on this website. We will not present placeholder files as downloads.</div><div style={{marginTop:48}} className="section-head"><div><Eyebrow>Before product selection</Eyebrow><h2>Details worth gathering before you speak with a professional.</h2></div><p>These prompts are general planning guidance, not MAXBE product specifications or engineering recommendations.</p></div><div className="tile-grid">{[['01','Source','Where the water is: borewell, open well, tank, sump, surface or another source.'],['02','Destination','Where it must go and approximate vertical lift or route, if known.'],['03','Use','Approximate volume and pattern of use. “Not sure” is fine.'],['04','Power','What supply exists at the installation site, if known.'],['05','Site','Indoor, outdoor or well-side conditions and constraints.'],['06','Verification','Ask a qualified professional to check the complete installation.']].map(([n,t,d])=><div className="tile" key={n}><span className="tile-num">{n} / Prep</span><h3>{t}</h3><p>{d}</p></div>)}</div><div style={{marginTop:50}}><Link className="btn" href="/find-your-pump">Open the preliminary finder <ArrowRight size={15}/></Link></div></div></section><CTA title="Need a product document?" text="Official product resources are not available yet. Send your question to MAXBE using the contact form." href="/contact" label="Contact MAXBE"/>
  </>;
}

function About() {
  return <><Meta title="About MAXBE" description="Learn about MAXBE Industries, its Coimbatore beginnings and pump product ranges."/><PageHero kicker="About MAXBE PUMPS" title="About MAXBE PUMPS" text="Committed to delivering dependable pumping solutions for diverse water requirements."/>
    <section className="section about-story-section"><div className="container split"><div className="story-copy about-story-copy"><Eyebrow>Company overview</Eyebrow><h2>MAXBE Industries · Coimbatore</h2><p>Public company information lists MAXBE Industries as established in 1992 and based in Coimbatore.</p><p>The pump ranges currently listed are monoblock, open well submersible, and V4 submersible pumps.</p><p>Further details about manufacturing facilities, current capabilities, and product availability should be confirmed directly with MAXBE.</p><Link className="text-link" href="/products">Explore the product ranges <ArrowRight size={15}/></Link></div><div className="story-panel about-brand-panel"><div className="about-image-placeholder" role="img" aria-label="MAXBE product photography pending"><span>Product photographs pending</span><p>Original MAXBE product images have not been supplied for this website.</p></div><p>MAXBE Industries · Coimbatore</p><span>Established 1992 · Public company information</span></div></div></section>
    <section className="section about-values-section"><div className="container section-head"><div><Eyebrow>Our journey</Eyebrow><h2>A company timeline, based on published information.</h2></div><p>Only one company milestone is currently available in the information reviewed for this website.</p></div><div className="container about-process-grid"><article className="about-process-step"><span className="about-process-marker" aria-hidden="true">1992</span><h3>MAXBE Industries established</h3><p>Public company information lists 1992 as the establishment year. No additional dated milestones are published here.</p></article></div></section>
    <section className="section about-values-section section-alternate"><div className="container about-information-grid"><article className="story-panel"><Eyebrow>Mission &amp; vision</Eyebrow><h3>Official statements not supplied</h3><p>No company-published mission or vision statements were available in the information reviewed for this website. MAXBE can provide its current statements directly.</p></article><article className="story-panel"><Eyebrow>Company values &amp; capabilities</Eyebrow><h3>Confirm with MAXBE</h3><p>Detailed company values, facility capabilities, certifications, and manufacturing information have not been supplied. We have not added unverified claims.</p></article></div></section>
    <section className="section about-standard-section"><div className="container section-head"><div><Eyebrow>Product ranges</Eyebrow><h2>Explore MAXBE pump categories</h2></div><p>Browse currently listed ranges and ask MAXBE to confirm specifications and suitability for your installation.</p></div><div className="container tile-grid about-product-ranges">{categories.map((category,index)=><Link className="tile" key={category.slug} href={`/products?category=${category.slug}`}><span className="tile-num">Range / 0{index+1}</span><h3>{category.name}</h3><p>{category.description}</p><span className="category-browse">Explore category <ArrowRight size={15}/></span></Link>)}</div></section>
    <HomeFactoryLocation/>
    <CTA title="Ready to find the right pump?" text="Contact MAXBE about a product or application." href="/contact" label="Contact us"/>
  </>;
}

function NotFound() { return <><Meta title="Page not found" description="The requested MAXBE Pumps page could not be found."/><div className="notfound"><div><div className="eyebrow" style={{justifyContent:'center'}}>Page not found</div><h1>404</h1><p>This route has no water in it. Let’s get you back on track.</p><Link className="btn" href="/">Back to home <ArrowRight size={15}/></Link></div></div></>; }

function App() {
  return <>
    <Shell><Switch>
      <Route path="/" component={Home}/><Route path="/products" component={Products}/><Route path="/products/:slug" component={ProductDetail}/>
      <Route path="/catalogue" component={Catalogue}/>
      <Route path="/catalogue-dashboard" component={ProductCatalogueDashboard}/>
      <Route path="/applications/agriculture"><Application kind="agriculture"/></Route><Route path="/applications/domestic"><Application kind="domestic"/></Route>
      <Route path="/find-your-pump" component={Finder}/><Route path="/support/resources" component={Resources}/>
      <Route path="/become-a-dealer"><Contact dealer/></Route><Route path="/dealers" component={FindDealer}/><Route path="/about" component={About}/><Route path="/contact"><Contact/></Route>
      <Route component={NotFound}/>
    </Switch></Shell>
  </>;
}

export default App;
