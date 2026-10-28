import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowDownRight, ArrowLeft, ArrowRight, Check, ChevronDown, Menu, MessageCircle, Search, X } from 'lucide-react';
import { ExploreCategoryImage, ProductImageGallery } from './components/catalogue/ProductImageGallery';
import { ContactFactoryLocation, HomeFactoryLocation } from './components/FactoryLocation';
import { categories, matchesCatalogueCategory, productBySlug, type CatalogueCategoryFilter } from './data/products';
import { ForwardProductShowcase } from './components/ForwardProductShowcase';
import ProductCatalogueDashboard from './pages/catalogue-dashboard';

const configuredWhatsAppNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const whatsAppNumber = configuredWhatsAppNumber.length >= 8 && configuredWhatsAppNumber.length <= 15 ? configuredWhatsAppNumber : '';

function WhatsAppLink({ productName, floating=false }: { productName?: string; floating?: boolean }) {
  if (!whatsAppNumber) return null;
  const message = productName
    ? `Hello MAXBE Pumps, I have an enquiry about ${productName}.`
    : 'Hello MAXBE Pumps, I have an enquiry.';
  return <a className={`whatsapp-link${floating?' whatsapp-floating':''}`} href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label={floating?'Enquire on WhatsApp':'Contact MAXBE Pumps on WhatsApp'}><MessageCircle size={16}/>{floating?'WhatsApp':'WhatsApp'}</a>;
}

function Brand() {
  return <Link href="/" className="brand" aria-label="MAXBE Pumps home" data-testid="link-brand"><img className="site-logo" src="/assets/maxbe-logo.png" alt="MAXBE Pumps — LOW VOLTAGE KING" /></Link>;
}

function PumpLoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    const imageLoads = Array.from(document.images)
      .filter(image => !image.complete)
      .map(image => new Promise<void>(resolve => {
        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
      }));
    const hasPendingWork = document.readyState !== 'complete' || imageLoads.length > 0;

    if (!hasPendingWork) {
      setVisible(false);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let hideTimer = 0;
    let removeTimer = 0;
    let timeoutTimer = 0;
    document.documentElement.classList.add('is-loading');

    const documentLoad = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>(resolve => window.addEventListener('load', () => resolve(), { once: true }));
    const ready = Promise.all([documentLoad, ...imageLoads]);
    const timeout = new Promise<void>(resolve => {
      timeoutTimer = window.setTimeout(resolve, 6000);
    });

    void Promise.race([ready, timeout]).then(() => {
      if (disposed) return;
      window.clearTimeout(timeoutTimer);
      const minimumTime = reduceMotion ? 0 : 950;
      const remainingTime = Math.max(0, minimumTime - (performance.now() - startedAt));
      hideTimer = window.setTimeout(() => {
        if (disposed) return;
        setLeaving(true);
        removeTimer = window.setTimeout(() => {
          if (!disposed) {
            document.documentElement.classList.remove('is-loading');
            setVisible(false);
          }
        }, reduceMotion ? 0 : 320);
      }, remainingTime);
    });

    return () => {
      disposed = true;
      document.documentElement.classList.remove('is-loading');
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, []);

  if (!visible) return null;
  return <div className={`pump-loader${leaving ? ' is-leaving' : ''}`} role="status" aria-label="Preparing your pumping experience">
    <div className="pump-loader-card">
      <img className="pump-loader-logo" src="/assets/maxbe-logo.png" alt="MAXBE PUMPS — LOW VOLTAGE KING" />
      <p className="pump-loader-message">Preparing your pumping experience...</p>
      <div className="pump-loader-track" aria-hidden="true"><span /></div>
    </div>
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const [scrolled,setScrolled]=useState(false);
  useEffect(() => { setOpen(false); setDropdown(null); }, [location]);
  useEffect(() => {
    const updateScrollState=()=>setScrolled(window.scrollY>16);
    updateScrollState();
    window.addEventListener('scroll',updateScrollState,{passive:true});
    return ()=>window.removeEventListener('scroll',updateScrollState);
  },[]);
  const openFromKeyboard = (name: string) => {
    setDropdown(name);
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-dropdown="${name}"] a`)?.focus());
  };
  const closeDropdown = () => {
    const previous = dropdown;
    setDropdown(null);
    if (previous) document.querySelector<HTMLButtonElement>(`[aria-controls="${previous}-dropdown"]`)?.focus();
  };
  return <>
    <div className="announcement">MAXBE PUMPS <span aria-hidden="true">/</span> LOW VOLTAGE KING <span className="announcement-note">PRODUCT DETAILS AWAIT OFFICIAL CONFIRMATION</span></div>
    <header className={`header${scrolled?' is-scrolled':''}`}><nav className="nav" aria-label="Main navigation">
      <Brand />
      <div className={`navlinks ${open ? 'open' : ''}`} onKeyDown={event=>{if(event.key==='Escape'&&dropdown){event.preventDefault();closeDropdown();}}}>
        <Link href="/" className={location==='/'?'active':''}>Home</Link>
        <div className="nav-group">
          <button className={`nav-trigger ${location.startsWith('/products')?'active':''}`} aria-expanded={dropdown==='products'} aria-controls="products-dropdown" onClick={()=>setDropdown(dropdown==='products'?null:'products')} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();openFromKeyboard('products');}}} data-testid="button-nav-products">Products <ChevronDown size={14}/></button>
          {dropdown==='products'&&<div className="nav-dropdown" id="products-dropdown" data-dropdown="products" aria-label="Product categories">
            <Link href="/products" className="dropdown-feature">All product categories <ArrowRight size={14}/></Link>
            {categories.map(category=><Link href={`/products/${category.slug}`} key={category.slug}>{category.name}</Link>)}
          </div>}
        </div>
        <Link href="/support/resources" className={location==='/support/resources'?'active':''}>Service</Link>
        <Link href="/dealers" className={location==='/dealers'?'active':''}>Dealers</Link>
        <Link href="/contact" className={location==='/contact'?'active':''}>Contact</Link>
      </div>
      <Link href="/contact" className="nav-cta">Request a Quote <ArrowRight size={15}/></Link>
      <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={()=>{setOpen(!open);if(open)setDropdown(null);}} data-testid="button-menu">{open?<X/>:<Menu/>}</button>
    </nav></header>
  </>;
}

function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-main">
      <div><Brand/><p>Explore pump and motor categories. Product range, specifications and availability are awaiting official confirmation.</p></div>
      <div className="footer-col"><h4>Explore</h4><Link href="/products">Product categories</Link><Link href="/catalogue-dashboard">Product catalogue dashboard</Link><Link href="/find-your-pump">Guided pump finder</Link><Link href="/applications/agriculture">Agriculture</Link><Link href="/applications/domestic">Domestic</Link></div>
      <div className="footer-col"><h4>Help & information</h4><Link href="/support/resources">Resources</Link><Link href="/dealers">Dealer enquiry</Link><Link href="/about">About MAXBE</Link><Link href="/contact">Contact</Link></div>
      <div className="footer-col"><h4>Start here</h4><p>Know your water source? Take the first step with our preliminary finder.</p><Link className="text-link" href="/find-your-pump">Start the finder <ArrowRight size={14}/></Link>{whatsAppNumber&&<WhatsAppLink/>}</div>
    </div>
    <div className="footer-bottom"><span>MAXBE PUMPS · LOW VOLTAGE KING</span><span>ENQUIRIES ARE CONFIRMED ONLY AFTER DELIVERY ACKNOWLEDGEMENT</span></div>
  </div></footer>;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const pageStyles = [
    location === '/about' && 'ui-about',
    location === '/contact' && 'ui-contact',
    location === '/catalogue-dashboard' && 'ui-catalogue-dashboard',
    (location === '/products' || location.startsWith('/products/')) && 'ui-products',
    (location === '/applications' || location === '/applications/agriculture' || location === '/applications/domestic') && 'ui-application',
  ].filter(Boolean).join(' ');
  return <div className={`site ${pageStyles ? `ui-enhanced ${pageStyles}` : ''}`}><Header/><main>{children}</main><Footer/>{whatsAppNumber&&<WhatsAppLink floating/>}</div>;
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
  return <section className="page-hero"><div className="container animate-in"><Eyebrow>{kicker}</Eyebrow><h1>{title}</h1><p>{text}</p></div></section>;
}
function CTA({ title,text,href='/find-your-pump',label='Find your pump' }: { title:string;text:string;href?:string;label?:string }) {
  return <section className="band"><div className="container band-inner"><div><Eyebrow>THE NEXT STEP</Eyebrow><h2>{title}</h2><p>{text}</p></div><Link className="btn" href={href}>{label}<ArrowRight size={16}/></Link></div></section>;
}

function Home() {
  const slides = [
    { eyebrow: 'PUMP CATEGORY SAMPLE 01', title: <>Reliable Pumps.<br/><em>Clear Choices.</em></>, text: 'Explore illustrative pump categories while official product appearance and specifications are confirmed.', primary: 'Explore Products', href: '/products', secondary: 'Get a Quote', secondaryHref: '/contact', image: '/images/centrifugal-pump.jpg', position: 'center' },
    { eyebrow: 'PUMP CATEGORY SAMPLE 02', title: <>Explore Submersible.<br/><em>Pump Categories.</em></>, text: 'Browse category information and contact MAXBE for verified model details.', primary: 'View Categories', href: '/products', secondary: 'Request Quote', secondaryHref: '/contact', image: '/images/submersible-pump.jpg', position: 'center' },
    { eyebrow: 'PUMP CATEGORY SAMPLE 03', title: <>Find a Starting Point.<br/><em>Ask the Right Questions.</em></>, text: 'Use the pump finder for preliminary category guidance, not a confirmed product recommendation.', primary: 'Open Pump Finder', href: '/find-your-pump', secondary: 'Contact Us', secondaryHref: '/contact', image: '/images/self-priming-pump.jpg', position: 'center' },
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(preference.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => setActiveSlide(current => (current + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length]);

  const moveSlide = (direction: number) => setActiveSlide(current => (current + direction + slides.length) % slides.length);
  const slide = slides[activeSlide];

  return <>
    <Meta title="Reliable water solutions" description="High-efficiency agricultural and domestic water pumps from MAXBE Pumps."/>
    <section className="hero hero-carousel hero-sample-product" aria-label="MAXBE product category samples" aria-roledescription="carousel" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setPaused(false);}} onTouchStart={event=>{touchStart.current=event.touches[0]?.clientX??null;}} onTouchEnd={event=>{if(touchStart.current===null)return;const distance=(event.changedTouches[0]?.clientX??touchStart.current)-touchStart.current;if(Math.abs(distance)>48){moveSlide(distance<0?1:-1);setPaused(true);}touchStart.current=null;}} onKeyDown={event=>{if(event.key==='ArrowLeft')moveSlide(-1);if(event.key==='ArrowRight')moveSlide(1);}} tabIndex={0}>
      <div className="hero-media" aria-hidden="true"><img key={slide.image} src={slide.image} alt="" style={{ objectPosition: slide.position }}/></div>
      <span className="hero-sample-label">SAMPLE IMAGE</span>
      <div className="hero-inner"><div className="hero-copy hero-copy-enter" key={activeSlide}>
        <Eyebrow>{slide.eyebrow}</Eyebrow><h1>{slide.title}</h1><p>{slide.text}</p>
        <div className="hero-actions"><Link href={slide.href} className="btn gold">{slide.primary} <ArrowRight size={16}/></Link><Link href={slide.secondaryHref} className="btn outline">{slide.secondary}</Link></div>
      </div></div>
      <div className="hero-controls" aria-label="Hero slide controls">
        <button type="button" className="hero-control" aria-label="Previous slide" onClick={()=>moveSlide(-1)}><ArrowLeft size={18}/></button>
        <div className="hero-pagination" role="group" aria-label="Choose a slide">{slides.map((item,index)=><button type="button" key={item.eyebrow} className={`hero-dot${activeSlide===index?' active':''}`} aria-label={`Show slide ${index+1}: ${item.eyebrow}`} aria-current={activeSlide===index?'true':undefined} onClick={()=>setActiveSlide(index)}/>)}</div>
        <button type="button" className="hero-control" aria-label="Next slide" onClick={()=>moveSlide(1)}><ArrowRight size={18}/></button>
        <button type="button" className="hero-control hero-play-control" aria-label={paused?'Play automatic slides':'Pause automatic slides'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?<ArrowRight size={15}/>:<span aria-hidden="true">Ⅱ</span>}</button>
        <span className="hero-slide-count" aria-live="polite">0{activeSlide+1} / 0{slides.length}</span>
      </div>
    </section>

    {/* Forward-Moving 3D Product Showcase */}
    <ForwardProductShowcase />

    {/* Applications Section */}
    <section className="section applications-section"><div className="container section-head"><div><Eyebrow>APPLICATIONS</Eyebrow><h2>Water Solutions for Field and Home</h2></div><p>Purpose-built pumping solutions tailored for farm irrigation and everyday water management.</p></div>
      <div className="container application-cards">
        {[
          ['Agricultural Irrigation','High-flow pumps for borewells, open wells, and field irrigation.','/applications/agriculture'],
          ['Residential Water Supply','Dependable booster and transfer pumps for household overhead tanks.','/applications/domestic'],
          ['Garden & Utility','Efficient water movement for landscaping, sumps, and utility transfer.','/applications/domestic'],
        ].map(([title,description,href])=><Link href={href} className="application-card" key={title}><div><span>APPLICATION GUIDE</span><h3>{title}</h3><p>{description}</p><b>Explore guide <ArrowRight size={15}/></b></div></Link>)}
      </div>
    </section>

    {/* Why MAXBE Section */}
    <section className="section why-section"><div className="container section-head"><div><Eyebrow>THE MAXBE ADVANTAGE</Eyebrow><h2>Engineered for Power & Longevity</h2></div><p>Built with quality components for high flow rates and low-voltage reliability.</p></div>
      <div className="container tile-grid">{[
        ['01','Low-Voltage King','Designed to start and run smoothly even during severe rural voltage drops.'],
        ['02','Robust Quality','Engineered with corrosion-resistant components for extended operational life.'],
        ['03','Field Proven','Consistent water discharge and head pressure for demanding farm conditions.'],
        ['04','Direct Factory Support','Prompt assistance, dealer support, and responsive customer service.']
      ].map(([n,title,text])=><article className="tile benefit-tile" key={n}><span className="tile-num">{n} / ADVANTAGE</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <HomeFactoryLocation/>
    <section className="section tight"><div className="container notice"><b>Product Information Note:</b> Specifications, models, and availability are subject to official factory confirmation.</div></section>
    <CTA title="Ready to Find the Right Pump for Your Needs?" text="Connect with our technical team for product recommendations, specifications, and fast quotes."/>
  </>;
}

function CategoryCard({ category }: { category: typeof categories[number] }) {
  const [location] = useLocation();
  return <article className={`product-card${location===`/products/${category.slug}`?' selected':''}`} data-testid={`card-category-${category.slug}`}>
    <Link href={`/products/${category.slug}`} className="product-card-visual" aria-label={`Open ${category.name} category overview`}>
      <div className="home-product-image">
        <img className="sample-pump-image" src={category.image} alt={`Sample pump image for ${category.name}`} loading="lazy" />
      </div>
    </Link>
    <div className="product-body">
      <span className="sample-image-label">SAMPLE IMAGE</span>
      <p className="sample-image-disclaimer">Illustrative only · not verified MAXBE product photography</p>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <div className="product-card-actions">
        <Link className="text-link" href={`/products/${category.slug}`}>View details <ArrowRight size={14}/></Link>
        <Link className="quote-link" href={`/contact?category=${category.slug}`}>Get Quote <ArrowRight size={14}/></Link>
        <WhatsAppLink productName={category.name}/>
      </div>
    </div>
  </article>;
}

function Products() {
  const [query,setQuery]=useState(''); const [filter,setFilter]=useState<CatalogueCategoryFilter>('all');
  const shown=categories.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())&&matchesCatalogueCategory(c,filter));
  return <><Meta title="Product Categories" description="Explore MAXBE Pumps agricultural, domestic, and industrial pump categories."/><PageHero kicker="PRODUCT CATALOGUE" title="Agricultural & Domestic Pumps" text="High-efficiency water pumps engineered for borewells, open wells, farm irrigation, and household supply."/>
    <section className="section"><div className="container">
      <div className="catalog-tools"><label className="searchbox"><Search size={18}/><input aria-label="Search product categories" data-testid="input-category-search" placeholder="Search categories…" value={query} onChange={e=>setQuery(e.target.value)}/></label><select className="select" aria-label="Filter categories" value={filter} onChange={e=>setFilter(e.target.value as CatalogueCategoryFilter)}><option value="all">All categories</option><option value="agriculture">Agriculture</option><option value="domestic">Domestic & general</option></select></div>
      <h2 style={{fontSize:30,letterSpacing:'-.04em',margin:'34px 0 18px'}}>Explore categories</h2>
      <div className="catalog-grid">{shown.length?shown.map(c=><CategoryCard key={c.slug} category={c}/>):<div className="empty">No categories match that search. Try another term.</div>}</div>
      <div className="catalog-footnote">Factory models, ratings, and custom configurations available upon enquiry.</div>
    </div></section><CTA title="Need help choosing the right pump?" text="Our quick 6-step finder matches pump categories to your water source and depth." href="/find-your-pump" label="Open Pump Finder"/>
  </>;
}

function ProductDetail({ params }: { params:{slug?:string} }) {
  const category=params.slug?productBySlug(params.slug):undefined;
  if(!category)return <NotFound/>;
  return <><Meta title={category.name} description={`${category.name} - high-performance water pump engineered by MAXBE Pumps.`}/><PageHero kicker="PRODUCT CATEGORY" title={category.name} text={category.description}/>
    <section className="section"><div className="container product-detail-layout">
      <article className="product-detail-summary selected"><Eyebrow>ENGINEERED FOR POWER</Eyebrow><span className="category-kicker">CATEGORY OVERVIEW</span><h2>{category.name}</h2><p>{category.description}</p><div className="notice">Heavy-duty construction, copper-wound motor, and consistent water discharge under low-voltage conditions.</div><Link className="btn" style={{marginTop:24}} href={`/contact?category=${category.slug}`}>Request a Quote <ArrowRight size={15}/></Link></article>
      <div className="product-facts" aria-label="Product specifications overview">{[['Voltage Stability','Engineered for low-voltage power supply'],['Build Quality','High-grade cast iron & copper winding'],['Applications','Agriculture, domestic & commercial'],['Factory Warranty','Direct support & service assistance']].map(([label,value])=><article className="product-fact" key={label}><h3>{label}</h3><p>{value}</p></article>)}</div>
    </div></section><CTA title={`Interested in ${category.name}?`} text="Get specifications, pricing, and availability directly from our factory team." href={`/contact?category=${category.slug}`} label="Get Quote"/>
    <section className="section catalogue-category-gallery"><div className="container">
      <div className="section-head"><div><Eyebrow>PRODUCT GALLERY</Eyebrow><h2>Product Image Views</h2></div><p>Detailed angles and views for {category.name}.</p></div>
      <ProductImageGallery productSlug={category.slug}/>
    </div></section>
    <section className="section catalogue-explore-section"><div className="container catalogue-explore-layout">
      <div><Eyebrow>MORE PUMP CATEGORIES</Eyebrow><h2>{category.name}</h2><p>{category.description}</p><Link className="btn" href="/products">All Categories <ArrowRight size={15}/></Link></div>
      <ExploreCategoryImage productSlug={category.slug}/>
    </div></section>
  </>;
}

function ApplicationsOverview() {
  const guides=[
    {title:'Agricultural Irrigation',text:'Borewells, open wells, and drip irrigation for crops and farms.',image:'/images/field-irrigation.jpg',href:'/applications/agriculture',alt:'Agricultural irrigation field context'},
    {title:'Domestic Water Supply',text:'Booster systems, overhead tanks, and household water supply.',image:'/images/home-water-system.jpg',href:'/applications/domestic',alt:'Domestic water-use context'},
  ];
  return <><Meta title="Applications" description="Explore MAXBE Pumps solutions for agriculture and domestic water management."/><PageHero kicker="APPLICATIONS" title="Pumps Built for Every Water Need" text="Select your application to find recommended pump types, lifting heights, and installation guidance."/><section className="section"><div className="container application-overview-grid">{guides.map(guide=><Link className="application-overview-card" href={guide.href} key={guide.href}><img src={guide.image} loading="lazy" alt={guide.alt}/><div><Eyebrow>APPLICATION GUIDE</Eyebrow><h2>{guide.title}</h2><p>{guide.text}</p><span>Open guide <ArrowRight size={15}/></span></div></Link>)}</div></section></>;
}

function Application({ kind }: { kind:'agriculture'|'domestic' }) {
  const farm=kind==='agriculture';
  return <><Meta title={farm?'Agricultural Applications':'Domestic Applications'} description={`Explore MAXBE pumps for ${farm?'farm irrigation and borewells':'household water supply and booster pressure'}.`}/><PageHero kicker={farm?'APPLICATION · AGRICULTURE':'APPLICATION · DOMESTIC'} title={farm?'High-Flow Pumping for Farm & Field':'Dependable Water for Home & Everyday Life'} text={farm?'Borewells, open wells, and drip lines engineered to run reliably even during rural voltage drops.':'Boost water pressure and fill overhead tanks quickly with whisper-quiet, energy-efficient pumps.'}/>
    <section className="section"><div className="container split"><div className="story-panel application-note"><Eyebrow>{farm?'FIELD CHECKLIST':'HOME CHECKLIST'}</Eyebrow><h3>{farm?'Key Details to Check':'Household Details to Note'}</h3><ul>{(farm?['Water source depth and seasonal water levels','Delivery distance and vertical lift (head)','Power supply (single-phase, three-phase, or solar)']:['Source type (sump, municipal line, or well)','Number of floors and tank height','Daily volume and peak water usage']).map(item=><li key={item}>{item}</li>)}</ul><span className="status">Need help? Our engineers can calculate the exact pump capacity</span></div><div className="story-copy"><Eyebrow>{farm?'SOURCE TO FIELD':'SOURCE TO TAP'}</Eyebrow><h2>{farm?'From Deep Wells to Crop Rows':'Continuous Water for Every Tap'}</h2><p>{farm?'Borewells and open wells require pumps with high lift and reliable low-voltage motor windings to handle fluctuations in rural power.':'Ensure steady pressure across every floor and fixture with compact monoblock and booster pumps built for efficiency.'}</p><Link href="/find-your-pump" className="btn">Use the Pump Finder <ArrowRight size={15}/></Link></div></div></section>
    <section className="section" style={{background:'#F7F4EB'}}><div className="container section-head"><div><Eyebrow>QUICK CHECKLIST</Eyebrow><h2>Three Things to Note</h2></div><p>Helpful parameters when selecting your pump model.</p></div><div className="container tile-grid">{(farm?[['01','Water Source','Borewell, open well, pond, or storage sump.'],['02','Distance & Head','Vertical lifting height and pipeline length.'],['03','Power Supply','Single-phase, three-phase, or solar drive.']]:[['01','Water Source','Borewell, municipal supply, or ground sump.'],['02','Building Height','Total floors and overhead tank position.'],['03','Daily Usage','Family size and peak hour water demand.']]).map(([n,t,d])=><div className="tile" key={n}><span className="tile-num">{n} / NOTE</span><h3>{t}</h3><p>{d}</p></div>)}</div></section><CTA title="Ready to select your pump?" text="Try our interactive 6-step pump selector or speak directly with our team." href="/find-your-pump" label="Start Pump Finder"/>
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
  return <><Meta title="Find Your Pump" description="Answer 6 quick questions to find the ideal pump category for your application."/><PageHero kicker="PUMP SELECTOR" title="Find the Right Pump in 6 Steps" text="Answer a few simple questions to find the pump category that matches your water source and depth."/>
    <section className="section"><div className="container finder"><aside className="finder-rail"><h3>Pump Finder</h3><div className="progress-track"><span style={{width:`${progress}%`}}/></div><p style={{fontSize:11,color:'#c5c0b6'}}>{done?'Complete':`STEP ${step+1} OF ${finderSteps.length}`} · {progress}%</p><ol className="step-list">{finderSteps.map((s,i)=><li className={i===step?'current':''} key={s.title}><b>{i<step?<Check size={13}/>:i+1}</b>{s.title}</li>)}</ol><button onClick={restart} className="text-link" style={{background:'none',border:0,cursor:'pointer',color:'#F4B323',padding:0,marginTop:28}}>Restart <ArrowRight size={14}/></button></aside>
      <div className="finder-panel">{!done?<><Eyebrow>STEP {step+1} OF 06</Eyebrow><h2>{current.title}</h2><p>{current.subtitle}</p><div className="option-grid">{current.options.map(([value,label,detail])=><button key={value} onClick={()=>{setAnswers({...answers,[step]:value});setError('');}} className={`option ${answers[step]===value?'selected':''}`} aria-pressed={answers[step]===value}><span>{label}<small>{detail}</small></span>{answers[step]===value&&<Check size={17}/>}</button>)}</div>{error&&<p role="alert" style={{color:'#C91D28',marginTop:15}}>{error}</p>}<div className="finder-actions">{step>0?<button className="btn outline" onClick={()=>{setStep(step-1);setError('');}}><ArrowLeft size={15}/> Back</button>:<span/>}<button className="btn" onClick={next}>Continue <ArrowRight size={15}/></button></div></>:<><Eyebrow>RECOMMENDED CATEGORIES</Eyebrow><h2>Pumps Matching Your Needs</h2><p>Based on your water source and application, here are the best pump categories to consider:</p><div className="result-box"><h3>Recommended Categories</h3>{suggestions.map(name=>{const category=categories.find(item=>item.name===name);return <p key={name}><Check size={14} style={{verticalAlign:'middle',marginRight:8,color:'#526B3D'}}/>{category?<Link className="finder-result-link" href={`/products/${category.slug}`}>{name}</Link>:name}{category&&<Link className="finder-result-quote" href={`/contact?category=${category.slug}`}>Request Quote <ArrowRight size={13}/></Link>}</p>;})}</div><div className="notice">Our technical team can verify dynamic head, flow rate, and pipe sizing before purchase.</div><div className="finder-actions"><button className="btn outline" onClick={restart}>Start again</button><Link className="btn" href="/contact?category=not-sure">Request a Quote <ArrowRight size={15}/></Link></div></>}</div>
    </div></section>
  </>;
}

function ContactForm({dealer=false}:{dealer?:boolean}) {
  const [submitted,setSubmitted]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState('');
  const [selectedCategory,setSelectedCategory]=useState(()=>{
    const requestedCategory=new URLSearchParams(window.location.search).get('category')||'';
    return categories.some(category=>category.slug===requestedCategory)?requestedCategory:(dealer?'not-sure':'');
  });

  const submit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(submitting)return;
    const form=event.currentTarget;
    const data=new FormData(form);
    const emailInput=form.elements.namedItem('contact-email') as HTMLInputElement;
    const phone=String(data.get('phone')||'').trim();
    const phoneDigits=phone.replace(/\D/g,'').length;
    const requiredFields=['name','email','category','message',...(dealer?['businessName','state','city','businessType']:['enquiryType'])];
    const missingRequired=requiredFields.some(name=>!String(data.get(name)||'').trim());
    if(missingRequired||!emailInput.checkValidity()||(phone&&(phoneDigits<7||phoneDigits>15))||(dealer&&(!phone||phoneDigits<7||phoneDigits>15))){
      setError(dealer?'Please provide your name, business details, valid phone and email, category, and message.':'Please provide your name, valid email, category, and message.');
      setSubmitted(false);
      return;
    }

    setError('');
    setSubmitting(true);
    try{
      const payload=Object.fromEntries(data.entries());
      const response=await fetch('/api/enquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(typeof result.error==='string'?result.error:'Your enquiry could not be submitted. Please try again.');
      setSubmitted(true);
      form.reset();
      setSelectedCategory(dealer?'not-sure':'');
    }catch(reason){
      setError(reason instanceof Error?reason.message:'Your enquiry could not be submitted. Please try again.');
      setSubmitted(false);
    }finally{
      setSubmitting(false);
    }
  };

  return <form className="form-card" onSubmit={submit} noValidate>
    {submitted&&<div className="success" role="status"><b>Enquiry received!</b> Our team will contact you shortly.</div>}
    {error&&<div className="notice" role="alert" style={{borderLeftColor:'var(--maxbe-red)',marginBottom:18}}>{error}</div>}
    <div className="enquiry-honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <div className="form-grid">
      <div className="field"><label htmlFor="contact-name">Your Name *</label><input id="contact-name" name="name" required autoComplete="name" data-testid="input-name" maxLength={120} placeholder="Name"/></div>
      <div className="field"><label htmlFor="contact-phone">Phone Number {dealer?'*':'(optional)'}</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" required={dealer} data-testid="input-phone" maxLength={40} placeholder="Your phone number"/></div>
      <div className="field"><label htmlFor="contact-email">Email Address *</label><input id="contact-email" name="email" type="email" required autoComplete="email" data-testid="input-email" maxLength={254} placeholder="you@example.com"/></div>
      {!dealer&&<div className="field"><label htmlFor="contact-location">Location / City (optional)</label><input id="contact-location" name="city" autoComplete="postal-code" data-testid="input-location" maxLength={100} placeholder="City, district or PIN"/></div>}
      {dealer&&<>
        <div className="field"><label htmlFor="business-name">Business Name *</label><input id="business-name" name="businessName" required autoComplete="organization" maxLength={160} placeholder="Business or firm name"/></div>
        <div className="field"><label htmlFor="dealer-state">State *</label><input id="dealer-state" name="state" required autoComplete="address-level1" maxLength={80} placeholder="State"/></div>
        <div className="field"><label htmlFor="dealer-city">District / City *</label><input id="dealer-city" name="city" required autoComplete="address-level2" maxLength={100} placeholder="District or city"/></div>
        <div className="field"><label htmlFor="business-type">Business Type *</label><select id="business-type" name="businessType" defaultValue="" required><option value="" disabled>Select business type</option><option value="retailer">Retailer</option><option value="distributor">Distributor</option><option value="installer">Installer / contractor</option><option value="other">Other</option></select></div>
      </>}
      {!dealer&&<div className="field"><label htmlFor="enquiry-type">Enquiry Type *</label><select id="enquiry-type" name="enquiryType" defaultValue="" required><option value="" disabled>Select an enquiry type</option><option value="customer">Product enquiry</option><option value="quote">Price quote</option><option value="service">Service & support</option></select></div>}
      {dealer&&<input type="hidden" name="enquiryType" value="dealer"/>}
      <div className="field"><label htmlFor="category">Product Category *</label><select id="category" name="category" value={selectedCategory} onChange={event=>setSelectedCategory(event.target.value)} required><option value="">Choose a category</option><option value="not-sure">Not sure / General</option>{categories.map(category=><option key={category.slug} value={category.slug}>{category.name}</option>)}</select></div>
      <div className="field wide"><label htmlFor="model">Model or Capacity (optional)</label><input id="model" name="model" maxLength={100} placeholder="HP rating, phase, or model if known"/></div>
      <div className="field wide"><label htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" required rows={4} maxLength={2000} placeholder="Describe your water source, application, or question."/></div>
    </div>
    <button className="btn" type="submit" disabled={submitting} data-testid="button-submit-enquiry">{submitting?'Sending enquiry…':'Send enquiry'} <ArrowRight size={15}/></button>
  </form>;
}

function Contact({dealer=false}:{dealer?:boolean}) {
  return <><Meta title={dealer?'Dealer Network':'Contact Us'} description={dealer?'Partner with MAXBE Pumps as an authorized regional dealer.':'Contact MAXBE Pumps factory in Coimbatore or submit a product enquiry.'}/><PageHero kicker={dealer?'DEALER NETWORK':'GET IN TOUCH'} title={dealer?'Partner with MAXBE Pumps':'We’re Here to Help'} text={dealer?'Expand your business with durable, fast-selling agricultural and domestic water pumps.':'Reach out for product specifications, pricing, dealership queries, or technical assistance.'}/>
    {!dealer&&<ContactFactoryLocation/>}
    <section className="section"><div className="container contact-layout"><div className="contact-intro"><Eyebrow>{dealer?'DEALER ENQUIRY':'FACTORY DESK'}</Eyebrow><h2>{dealer?'Join Our Distribution Network':'Direct Factory Communication'}</h2><p>{dealer?'Submit your business profile and location to discuss dealership terms, margins, and territory support.':'Send us your product requirements or visit our Coimbatore manufacturing facility.'}</p>{!whatsAppNumber&&<p className="contact-config-note">WhatsApp enquiries are active when VITE_WHATSAPP_NUMBER is configured.</p>}</div><ContactForm dealer={dealer}/></div></section>
  </>;
}

function Resources() {
  return <><Meta title="Service & Support" description="MAXBE Pumps technical support, installation guidance, and factory assistance."/><PageHero kicker="SERVICE & SUPPORT" title="Technical Support & Service" text="Prompt service guidance, installation tips, and factory support for all MAXBE pump owners."/>
    <section className="section"><div className="container"><div className="section-head"><div><Eyebrow>PRE-INSTALLATION CHECKLIST</Eyebrow><h2>Details to Gather Before Setup</h2></div><p>Ensure smooth installation and maximum pump efficiency.</p></div><div className="tile-grid">{[['01','Source','Borewell depth, water level, open well or sump.'],['02','Destination','Overhead tank height and horizontal delivery length.'],['03','Flow Rate','Required liters per hour or daily farm volume.'],['04','Power Grid','Single-phase or three-phase supply stability.'],['05','Site Space','Sheltered mounting and proper foundation.'],['06','Pipe Sizing','Correct suction and delivery pipe diameters.']].map(([n,t,d])=><div className="tile" key={n}><span className="tile-num">{n} / PREP</span><h3>{t}</h3><p>{d}</p></div>)}</div>
      <section className="support-faqs" aria-labelledby="support-faq-heading"><div className="section-head"><div><Eyebrow>COMMON QUESTIONS</Eyebrow><h2 id="support-faq-heading">Frequently Asked Questions</h2></div></div><details className="support-faq"><summary>How do MAXBE pumps handle low voltage?</summary><p>MAXBE pumps are specifically engineered with heavy copper windings and custom stampings to start and pump efficiently during voltage dips.</p></details><details className="support-faq"><summary>How do I select the right HP rating?</summary><p>Our pump selector recommends ideal categories based on your depth and water source, or you can contact our technical team for custom sizing.</p></details><details className="support-faq"><summary>Are replacement parts readily available?</summary><p>Yes, standard impellers, mechanical seals, bearings, and motor parts are manufactured to standard specs for fast replacement.</p></details><details className="support-faq"><summary>How do I contact customer support?</summary><p>You can use the contact form on this website, call our Coimbatore office, or email maxbeindustries@yahoo.co.in directly.</p></details></section>
      <div className="support-actions"><Link className="btn" href="/contact">Contact Support <ArrowRight size={15}/></Link><a className="text-link" href="mailto:maxbeindustries@yahoo.co.in">Email the Factory <ArrowRight size={14}/></a></div>
    </div></section><CTA title="Have a sizing or installation question?" text="Our technical support team is ready to assist you." href="/contact" label="Contact Us"/>
  </>;
}

function About() {
  return <><Meta title="About MAXBE" description="MAXBE Pumps - Low Voltage King. Reliable agricultural and domestic water pumps."/><PageHero kicker="ABOUT MAXBE" title="MAXBE Pumps — LOW VOLTAGE KING" text="Manufacturing high-performance agricultural and domestic pumps built to pump reliably even under severe voltage drops."/>
    <section className="section"><div className="container split"><div className="story-copy"><Eyebrow>ENGINEERED RELIABILITY</Eyebrow><h2>Built for Demanding Fields and Homes</h2><p>MAXBE Pumps are designed and manufactured in Coimbatore, Tamil Nadu—India’s premier pump engineering hub.</p><p>With reinforced motor windings, durable cast-iron construction, and precision impellers, every MAXBE pump delivers maximum discharge with minimal power consumption.</p><Link className="text-link" href="/products">Explore Pump Range <ArrowRight size={15}/></Link></div><div className="story-panel"><Eyebrow>CORE STRENGTHS</Eyebrow><h3>Why Choose MAXBE</h3><ul><li>Low-voltage starting capability</li><li>100% pure copper winding</li><li>High-flow hydraulic design</li><li>Direct factory support & spare parts</li></ul><span className="status">Engineered in Coimbatore · Trusted across agriculture</span></div></div></section>
    <section className="section about-standard-section"><div className="container section-head"><div><Eyebrow>OUR PRINCIPLES</Eyebrow><h2>The MAXBE Quality Standard</h2></div><p>Built on engineering excellence and long-lasting performance.</p></div><div className="container tile-grid">{[['01','Robust Quality','Premium metallurgy and tight tolerances ensure years of trouble-free operation.'],['02','Low-Voltage King','Specially wound motors thrive in rural areas where voltage dips are common.'],['03','Customer Trust','Dedicated dealer network and responsive after-sales service.']].map(([n,t,d])=><div className="tile" key={n}><span className="tile-num">{n} / PRINCIPLE</span><h3>{t}</h3><p>{d}</p></div>)}</div></section><CTA title="Find the Perfect Pump for Your Needs" text="Browse our full product catalogue or try the 6-step pump selector." href="/products" label="Explore Products"/>
  </>;
}

function NotFound() { return <><Meta title="Page not found" description="The requested MAXBE Pumps page could not be found."/><div className="notfound"><div><div className="eyebrow" style={{justifyContent:'center'}}>PAGE NOT FOUND</div><h1>404</h1><p>This route has no water in it. Let’s get you back on track.</p><Link className="btn" href="/">Back to home <ArrowRight size={15}/></Link></div></div></>; }

function App() {
  return <>
    <Shell><Switch>
      <Route path="/" component={Home}/><Route path="/products" component={Products}/><Route path="/products/:slug" component={ProductDetail}/>
      <Route path="/catalogue-dashboard" component={ProductCatalogueDashboard}/>
      <Route path="/applications" component={ApplicationsOverview}/><Route path="/applications/agriculture"><Application kind="agriculture"/></Route><Route path="/applications/domestic"><Application kind="domestic"/></Route>
      <Route path="/find-your-pump" component={Finder}/><Route path="/support/resources" component={Resources}/>
      <Route path="/dealers"><Contact dealer/></Route><Route path="/about" component={About}/><Route path="/contact"><Contact/></Route>
      <Route component={NotFound}/>
    </Switch></Shell>
    <PumpLoadingScreen />
  </>;
}

export default App;
