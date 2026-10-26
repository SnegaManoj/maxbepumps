import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowDownRight, ArrowLeft, ArrowRight, Check, ChevronDown, Droplets, Menu, Search, X } from 'lucide-react';
import { categories, productBySlug } from './data/products';

function Brand() {
  return <Link href="/" className="brand" aria-label="MAXBE Pumps home" data-testid="link-brand"><img src="/images/maxbe-pumps-logo.png" alt="MAXBE Pumps — LOW VOLTAGE KING" /></Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [location] = useLocation();
  const productsTrigger = useRef<HTMLButtonElement>(null);
  const applicationsTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); setDropdown(null); }, [location]);
  const openFromKeyboard = (name: string) => {
    setDropdown(name);
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-dropdown="${name}"] a`)?.focus());
  };
  const closeDropdown = () => {
    const previous = dropdown;
    setDropdown(null);
    if (previous === 'products') productsTrigger.current?.focus();
    if (previous === 'applications') applicationsTrigger.current?.focus();
  };
  return <>
    <div className="announcement">MAXBE PUMPS <span aria-hidden="true">/</span> LOW VOLTAGE KING <span className="announcement-note">PRODUCT DETAILS AWAIT OFFICIAL CONFIRMATION</span></div>
    <header className="header"><nav className="nav" aria-label="Main navigation">
      <Brand />
      <div className={`navlinks ${open ? 'open' : ''}`} onKeyDown={event=>{if(event.key==='Escape'&&dropdown){event.preventDefault();closeDropdown();}}}>
        <div className="nav-group">
          <button ref={productsTrigger} className={`nav-trigger ${location.startsWith('/products')?'active':''}`} aria-expanded={dropdown==='products'} aria-controls="products-dropdown" onClick={()=>setDropdown(dropdown==='products'?null:'products')} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();openFromKeyboard('products');}}} data-testid="button-nav-products">Products <ChevronDown size={14}/></button>
          {dropdown==='products'&&<div className="nav-dropdown" id="products-dropdown" data-dropdown="products" aria-label="Product categories">
            <Link href="/products" className="dropdown-feature">All product categories <ArrowRight size={14}/></Link>
            {categories.map(category=><Link href={`/products/${category.slug}`} key={category.slug}>{category.name}</Link>)}
          </div>}
        </div>
        <div className="nav-group">
          <button ref={applicationsTrigger} className={`nav-trigger ${location.startsWith('/applications')?'active':''}`} aria-expanded={dropdown==='applications'} aria-controls="applications-dropdown" onClick={()=>setDropdown(dropdown==='applications'?null:'applications')} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();openFromKeyboard('applications');}}} data-testid="button-nav-applications">Applications <ChevronDown size={14}/></button>
          {dropdown==='applications'&&<div className="nav-dropdown applications-dropdown" id="applications-dropdown" data-dropdown="applications" aria-label="Applications">
            <Link href="/applications/agriculture">Agriculture <span>Field & irrigation</span></Link>
            <Link href="/applications/domestic">Domestic <span>Home water needs</span></Link>
          </div>}
        </div>
        {[
          ['/support/resources','Support'], ['/dealers','Find a dealer'], ['/about','About'], ['/contact','Contact'],
        ].map(([href,label])=><Link key={href} href={href} className={location===href?'active':''} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ','-')}`}>{label}</Link>)}
      </div>
      <Link href="/find-your-pump" className="nav-cta">Find your pump <ArrowRight size={15}/></Link>
      <Link className="mobile-finder" href="/find-your-pump">Find Your Pump <ArrowRight size={15}/></Link>
      <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={()=>{setOpen(!open);if(open)setDropdown(null);}} data-testid="button-menu">{open?<X/>:<Menu/>}</button>
    </nav></header>
  </>;
}

function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-main">
      <div><Brand/><p>Explore pump and motor categories. Product range, specifications and availability are awaiting official confirmation.</p></div>
      <div className="footer-col"><h4>Explore</h4><Link href="/products">Product categories</Link><Link href="/find-your-pump">Guided pump finder</Link><Link href="/applications/agriculture">Agriculture</Link><Link href="/applications/domestic">Domestic</Link></div>
      <div className="footer-col"><h4>Help & information</h4><Link href="/support/resources">Resources</Link><Link href="/dealers">Dealer enquiry</Link><Link href="/about">About MAXBE</Link><Link href="/contact">Contact</Link></div>
      <div className="footer-col"><h4>Start here</h4><p>Know your water source? Take the first step with our preliminary finder.</p><Link className="text-link" href="/find-your-pump">Start the finder <ArrowRight size={14}/></Link></div>
    </div>
    <div className="footer-bottom"><span>MAXBE PUMPS · LOW VOLTAGE KING</span><span>LOCAL DEMO FORM · NO ENQUIRY DATA IS SENT OR STORED</span></div>
  </div></footer>;
}

function Shell({ children }: { children: ReactNode }) { return <div className="site"><Header/><main>{children}</main><Footer/></div>; }

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
  return <>
    <Meta title="Water, where it matters" description="Explore MAXBE Pumps categories for agricultural irrigation, household water needs and water management."/>
    <section className="hero">
      <img className="hero-img" src="/images/maxbe-hero-industrial-pumps.jpg" alt="Unbranded illustrative arrangement of a submersible pump, motor pump and centrifugal pump"/>
      <div className="hero-inner animate-in"><div className="hero-copy"><Eyebrow>MAXBE PUMPS</Eyebrow><h1>MAXBE PUMPS.<br/><em>LOW VOLTAGE<br/>KING.</em></h1><p>Explore pump and motor categories, map your application and identify the details to confirm before choosing equipment.</p><div className="hero-actions"><Link href="/products" className="btn gold">Explore categories <ArrowRight size={16}/></Link><Link href="/find-your-pump" className="btn outline">Find a starting point</Link></div></div></div>
      <div className="image-note">Unbranded generated sample · not MAXBE product photography</div>
    </section>
    <section className="section"><div className="container section-head"><div><Eyebrow>START WITH YOUR NEED</Eyebrow><h2>A clearer way to find your way to water.</h2></div><p>Every installation starts with a different source, setting and purpose. Choose the path that looks like yours.</p></div>
      <div className="container tile-grid">{[['01','For the field','Explore the questions behind irrigation and agricultural water movement.','/applications/agriculture'],['02','For the home','Start with household storage, supply and daily water needs.','/applications/domestic'],['03','Not sure yet?','Answer a few simple questions for a preliminary category direction.','/find-your-pump']].map(([n,t,d,h])=><Link href={h} className="tile" key={n}><span className="tile-num">{n} / PATHWAY</span><h3>{t}</h3><p>{d}</p><ArrowDownRight className="tile-arrow" size={20}/></Link>)}</div>
    </section>
    <section className="section" style={{background:'#f0ece2'}}><div className="container split"><div className="story-image"><img src="/images/submersible-assembly.jpg" alt="Unbranded stainless-steel submersible pump sample on a light studio background"/><span className="image-label">Generated sample image · not MAXBE product photography</span></div><div className="story-copy"><Eyebrow>MADE FOR REAL QUESTIONS</Eyebrow><h2>Begin with the water source. Not a model number.</h2><p>Is the water in a borewell, an open well, a tank or a surface source? Where does it need to go? These details help shape a sensible conversation before product selection.</p><p>The official catalogue is awaiting confirmation. Until product information is available, category discovery can still be useful—and product claims stay honest.</p><Link className="text-link" href="/find-your-pump">Try the six-step finder <ArrowRight size={15}/></Link></div></div></section>
    <section className="section"><div className="container section-head"><div><Eyebrow>THE CATEGORY LANDSCAPE</Eyebrow><h2>Explore the kinds of systems people ask about.</h2></div><Link className="text-link" href="/products">All categories <ArrowRight size={15}/></Link></div>
      <div className="container catalog-grid">{categories.slice(0,6).map(c=><CategoryCard key={c.slug} category={c}/>)}</div>
    </section>
    <section className="section tight"><div className="container notice"><b>Product information note.</b> MAXBE product models, technical specifications, official product photography and availability have not been provided for this website. Images are illustrative placeholders, not verified MAXBE products.</div></section>
    <CTA title="A few details can make the next conversation better." text="Use the guided finder to organise the basics. It is a preliminary starting point, not engineering advice."/>
  </>;
}

function CategoryCard({ category }: { category: typeof categories[number] }) {
  return <article className="product-card" data-testid={`card-category-${category.slug}`}>
    <Link href={`/products/${category.slug}`} className="product-image-link" aria-label={`View ${category.name} details`}><div className="product-visual"><img src={category.image} alt={`${category.imageLabel}; sample image, not verified MAXBE product photography`}/><span>{category.imageLabel} · sample image</span></div></Link>
    <div className="product-body"><div className="category-kicker">CATEGORY / DETAILS AWAITING CONFIRMATION</div><h3>{category.name}</h3><p>{category.description}</p><div className="product-card-actions"><Link className="text-link" href={`/products/${category.slug}`}>View details <ArrowRight size={14}/></Link><Link className="quote-link" href="/contact">Enquire / request a quote <ArrowRight size={14}/></Link></div></div>
  </article>;
}

function Products() {
  const [query,setQuery]=useState(''); const [filter,setFilter]=useState('all');
  const shown=categories.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())&&(filter==='all'||(filter==='agriculture'?/agricultural|borewell|open-well|solar/.test(c.slug):/low-voltage|monoblock|centrifugal|self-priming/.test(c.slug))));
  return <><Meta title="Product categories" description="Search MAXBE Pumps category listings. Product availability and specifications are awaiting catalogue confirmation."/><PageHero kicker="PRODUCT DISCOVERY" title="Find the right category to explore." text="A catalogue overview to help you navigate the landscape. Category listings are not confirmation that MAXBE manufactures or currently offers these products."/>
    <section className="section"><div className="container"><div className="notice" style={{marginBottom:26}}>Categories are shown for discovery only. Official catalogue, model names, availability and specifications have not been supplied.</div>
      <div className="catalog-tools"><label className="searchbox"><Search size={18}/><input aria-label="Search product categories" data-testid="input-category-search" placeholder="Search categories…" value={query} onChange={e=>setQuery(e.target.value)}/></label><select className="select" aria-label="Filter categories" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All categories</option><option value="agriculture">Agriculture</option><option value="domestic">Domestic & general</option></select></div>
      <h2 style={{fontSize:30,letterSpacing:'-.04em',margin:'34px 0 18px'}}>Explore categories</h2>
      <div className="catalog-grid">{shown.length?shown.map(c=><CategoryCard key={c.slug} category={c}/>):<div className="empty">No categories match that search. Try another term.</div>}</div>
      <div className="catalog-footnote">No model-level specifications are published because verified MAXBE catalogue information has not yet been supplied. Sample photographs are illustrative only.</div>
    </div></section><CTA title="Need help narrowing the question?" text="Our six-step finder gives you a preliminary category direction based on your application and water source."/>
  </>;
}

function ProductDetail({ params }: { params:{slug?:string} }) {
  const category=params.slug?productBySlug(params.slug):undefined;
  if(!category)return <NotFound/>;
  return <><Meta title={category.name} description={`${category.name} category overview. MAXBE product details are awaiting official catalogue confirmation.`}/><PageHero kicker="CATEGORY OVERVIEW" title={category.name} text="A category listing for discovery. Product availability, models and technical details are awaiting official MAXBE catalogue confirmation."/>
    <section className="section"><div className="container split"><div className="story-copy"><Eyebrow>WHAT WE CAN CONFIRM</Eyebrow><h2>Category information, not a product promise.</h2><p>{category.description}</p><p>There are no verified MAXBE models, specifications, product comparisons, warranty details or availability to display yet.</p><div className="notice">This category does not confirm that MAXBE manufactures or currently offers this product type.</div><Link className="btn" style={{marginTop:24}} href="/contact">Ask a category question <ArrowRight size={15}/></Link></div><div className={category.slug==='electric-motors-and-pump-accessories'?'product-detail-gallery':''}>{category.image?<div className="story-image"><img src={category.image} alt={`${category.imageLabel}; illustrative placeholder only`}/><span className="image-label">{category.imageLabel} · not an actual MAXBE product</span></div>:<div className="product-visual" style={{minHeight:400}}><Droplets size={55}/></div>}{category.slug==='electric-motors-and-pump-accessories'&&<div className="story-image"><img src="/images/motor-components.jpg" alt="Generated illustrative sample of unbranded motor and pump components, not verified MAXBE parts"/><span className="image-label">Illustrative component samples · not MAXBE product photography</span></div>}</div></div>
    <div className="container" style={{marginTop:58}}><h2>Product details</h2><div className="compare-wrap"><table className="spec-table"><thead><tr><th>Information</th><th>Current status</th></tr></thead><tbody>{['Models','Technical specifications','Availability','Official product image','Warranty and service'].map(row=><tr key={row}><td>{row}</td><td>Not provided — awaiting confirmation</td></tr>)}</tbody></table></div>
    </div></section><CTA title="Have a specific water need?" text="Share the application and source in a demo enquiry, or use the preliminary finder."/>
  </>;
}

function Application({ kind }: { kind:'agriculture'|'domestic' }) {
  const farm=kind==='agriculture';
  return <><Meta title={farm?'Agricultural applications':'Domestic applications'} description={`Explore water-pump considerations for ${farm?'agriculture and irrigation':'household water management'} with MAXBE Pumps.`}/><PageHero kicker={farm?'APPLICATION · AGRICULTURE':'APPLICATION · DOMESTIC'} title={farm?'Water is part of every field decision.':'Water for the everyday rhythm of home.'} text={farm?'For irrigation, crop water management and farm use, the right starting point is understanding the water source and where it needs to travel.':'For a home, begin with the water source, storage arrangement and the places water needs to reach.'}/>
    <section className="section"><div className="container split"><div className="story-image"><img src={farm?'/images/solar-water-pump.jpg':'/images/low-voltage-pump.jpg'} alt={farm?'Illustrative unbranded water pump beside solar panels in an agricultural field':'Illustrative unbranded electric pump and motor on a neutral studio background'}/><span className="image-label">Generated sample image · not a MAXBE installation</span></div><div className="story-copy"><Eyebrow>{farm?'FIELD TO SOURCE':'SOURCE TO TAP'}</Eyebrow><h2>{farm?'Start with the source. Then map the route.':'A useful first conversation starts at home.'}</h2><p>{farm?'Borewell, open well, surface water or a storage tank: each source raises different questions. Note your approximate water requirement and lifting height if you know them.':'Consider where water comes from, whether there is a tank or sump, and which floors or fixtures need supply. Approximate height and usage can help a qualified professional understand the setup.'}</p><p>These pages offer general planning prompts only. MAXBE product range and specifications are awaiting official confirmation.</p><Link href="/find-your-pump" className="btn">Start the preliminary finder <ArrowRight size={15}/></Link></div></div></section>
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

function ContactForm({dealer=false}:{dealer?:boolean}) {
  const [submitted,setSubmitted]=useState(false);const [error,setError]=useState('');
  const [selectedCategory,setSelectedCategory]=useState('');
  const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const form=e.currentTarget;const data=new FormData(form);const email=String(data.get('email')||'');const emailValid=(form.elements.namedItem('contact-email') as HTMLInputElement).checkValidity();const location=String(data.get('location')||'').trim();const phone=String(data.get('phone')||'').trim();if(!String(data.get('name')||'').trim()||!email||!emailValid||!String(data.get('enquiryType')||'')||!String(data.get('category')||'')||!String(data.get('message')||'').trim()||(dealer&&(!location||!phone))){setError(dealer?'Please add your name, a valid email address, phone, enquiry type, category, location and message.':'Please add your name, a valid email address, enquiry type, category and message.');setSubmitted(false);return;}setError('');setSubmitted(true);};
  return <form className="form-card" onSubmit={submit} noValidate>{submitted&&<div className="success" role="status"><b>Demo form complete.</b> Your information has not been sent or stored. This is a front-end demonstration only.</div>}{error&&<div className="notice" role="alert" style={{borderLeftColor:'#C91D28',marginBottom:18}}>{error}</div>}
    <div className="form-grid">
      <div className="field"><label htmlFor="contact-name">Your name *</label><input id="contact-name" name="name" required autoComplete="name" data-testid="input-name" placeholder="Name"/></div>
      <div className="field"><label htmlFor="contact-phone">Phone number {dealer?'*':'(optional)'}</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" required={dealer} data-testid="input-phone" placeholder="Your phone number"/></div>
      <div className="field"><label htmlFor="contact-email">Email address *</label><input id="contact-email" name="email" type="email" required autoComplete="email" data-testid="input-email" placeholder="you@example.com"/></div>
      <div className="field"><label htmlFor="contact-location">Location / city / PIN {dealer?'*':'(optional)'}</label><input id="contact-location" name="location" required={dealer} autoComplete="postal-code" data-testid="input-location" placeholder="City, district or PIN"/></div>
      <div className="field"><label htmlFor="enquiry-type">Enquiry type *</label><select id="enquiry-type" name="enquiryType" defaultValue="" required><option value="" disabled>Select an enquiry type</option><option value="customer">Customer</option><option value="product">Product</option><option value="dealer">Dealer / distributor</option><option value="service">Service / support</option></select></div>
      <div className="field"><label htmlFor="category">Product category *</label><select id="category" name="category" value={selectedCategory} onChange={event=>setSelectedCategory(event.target.value)} required><option value="">Choose a category</option><option value="not-sure">Not sure / not applicable</option>{categories.map(category=><option key={category.slug} value={category.slug}>{category.name}</option>)}</select></div>
       <div className="field wide"><label htmlFor="model">Model (optional)</label><input id="model" name="model" disabled={!selectedCategory||selectedCategory==='not-sure'} placeholder="Model information awaiting confirmation"/><small>Verified MAXBE model names are not currently available.</small></div>
      <div className="field wide"><label htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" required rows={4} placeholder="Share your application, water source or question."/></div>
    </div>
    <p style={{fontSize:11,color:'#777065',lineHeight:1.6}}>Demo only: details are validated in your browser and are not sent or stored. Dealer and company contact records are not available on this site.</p><button className="btn" type="submit" data-testid="button-submit-enquiry">Review demo enquiry <ArrowRight size={15}/></button>
  </form>;
}

function Contact({dealer=false}:{dealer?:boolean}) {
  return <><Meta title={dealer?'Dealer enquiry':'Contact'} description={dealer?'Dealer listings are not available yet. Use the demo enquiry form to outline your region and need.':'Send a demo enquiry about MAXBE category information. No information is sent or stored.'}/><PageHero kicker={dealer?'DEALER NETWORK':'GET IN TOUCH'} title={dealer?'Looking for a nearby dealer?':'Let’s start with your question.'} text={dealer?'MAXBE dealer records and locations have not been supplied. We cannot show or verify a dealer near you. Share a region in this demo enquiry instead.':'Use the form to outline a category or application question. This demo does not send or store your information.'}/>
    <section className="section"><div className="container contact-layout"><div className="contact-intro"><Eyebrow>{dealer?'NO VERIFIED DEALER DIRECTORY':'A DEMO ENQUIRY'}</Eyebrow><h2>{dealer?'Dealer information is not available yet.':'A useful conversation begins with context.'}</h2><p>{dealer?'We do not have official dealer names, addresses, regions or contact details to publish. No dealer search is performed.':'No official phone number, email or address has been supplied, so we will not invent contact details. This form is a local demonstration only.'}</p><div className="notice">Nothing you type is transmitted or saved. A success message only confirms the local demo interaction.</div></div><ContactForm dealer={dealer}/></div></section>
  </>;
}

function Resources() {
  return <><Meta title="Support & resources" description="Official MAXBE support documents have not been supplied. Find honest guidance and next steps."/><PageHero kicker="SUPPORT & RESOURCES" title="Useful guidance, without imaginary downloads." text="No official manuals, product sheets, warranty documents or technical downloads have been supplied. This page keeps that status clear."/>
    <section className="section"><div className="container"><div className="notice">There are currently no official MAXBE documents available on this website. We will not present placeholder files as downloads.</div><div style={{marginTop:48}} className="section-head"><div><Eyebrow>BEFORE PRODUCT SELECTION</Eyebrow><h2>Details worth gathering before you speak with a professional.</h2></div><p>These prompts are general planning guidance, not MAXBE product specifications or engineering recommendations.</p></div><div className="tile-grid">{[['01','Source','Where the water is: borewell, open well, tank, sump, surface or another source.'],['02','Destination','Where it must go and approximate vertical lift or route, if known.'],['03','Use','Approximate volume and pattern of use. “Not sure” is fine.'],['04','Power','What supply exists at the installation site, if known.'],['05','Site','Indoor, outdoor or well-side conditions and constraints.'],['06','Verification','Ask a qualified professional to check the complete installation.']].map(([n,t,d])=><div className="tile" key={n}><span className="tile-num">{n} / PREP</span><h3>{t}</h3><p>{d}</p></div>)}</div><div style={{marginTop:50}}><Link className="btn" href="/find-your-pump">Open the preliminary finder <ArrowRight size={15}/></Link></div></div></section><CTA title="Need a product document?" text="Official product resources are not available yet. You can outline your question in our non-submitting demo form." href="/contact" label="Open demo enquiry"/>
  </>;
}

function About() {
  return <><Meta title="About MAXBE" description="MAXBE Pumps brand overview. Company history and verified product information await confirmation."/><PageHero kicker="ABOUT MAXBE" title="MAXBE Pumps. LOW VOLTAGE KING." text="The supplied MAXBE brand mark identifies the brand and its LOW VOLTAGE KING tagline. Company history, manufacturing details and verified product facts await confirmation."/>
    <section className="section"><div className="container split"><div className="story-copy"><Eyebrow>ABOUT THIS BRAND SITE</Eyebrow><h2>Useful discovery. Honest information.</h2><p>This site helps visitors explore pump and motor category topics and organise useful questions before a product conversation.</p><p>Company history, manufacturing details, years in business, certifications, customers, dealer coverage and product performance are not confirmed here.</p><Link className="text-link" href="/products">Browse category listings <ArrowRight size={15}/></Link></div><div className="story-image"><img src="/images/maxbe-hero-industrial-pumps.jpg" alt="Generated sample arrangement of unbranded pump and motor equipment"/><span className="image-label">Generated sample imagery · not MAXBE product photography</span></div></div></section>
    <section className="section" style={{background:'#292e30',color:'#f8f7f5'}}><div className="container section-head"><div><Eyebrow>THE MAXBE STANDARD FOR THIS WEBSITE</Eyebrow><h2>Three things we will not guess.</h2></div><p style={{color:'#c5c0b6'}}>The catalogue will become more useful when the details are verified.</p></div><div className="container tile-grid">{[['01','Product facts','Models and technical specifications need official confirmation.'],['02','Availability','Category listings are discovery aids, not a promise of supply.'],['03','People & places','No invented customers, dealers, addresses or contact details.']].map(([n,t,d])=><div className="tile" key={n} style={{background:'#343a3b',borderColor:'#4b5051',color:'#f8f7f5'}}><span className="tile-num" style={{color:'#d6b9bd'}}>{n} / PRINCIPLE</span><h3>{t}</h3><p style={{color:'#c5c0b6'}}>{d}</p></div>)}</div></section><CTA title="Start with your application." text="Explore categories, follow a use-case path or try the six-step preliminary finder." href="/products" label="Explore products"/>
  </>;
}

function NotFound() { return <><Meta title="Page not found" description="The requested MAXBE Pumps page could not be found."/><div className="notfound"><div><div className="eyebrow" style={{justifyContent:'center'}}>PAGE NOT FOUND</div><h1>404</h1><p>This route has no water in it. Let’s get you back on track.</p><Link className="btn" href="/">Back to home <ArrowRight size={15}/></Link></div></div></>; }

function App() {
  return <Shell><Switch>
    <Route path="/" component={Home}/><Route path="/products" component={Products}/><Route path="/products/:slug" component={ProductDetail}/>
    <Route path="/applications/agriculture"><Application kind="agriculture"/></Route><Route path="/applications/domestic"><Application kind="domestic"/></Route>
    <Route path="/find-your-pump" component={Finder}/><Route path="/support/resources" component={Resources}/>
    <Route path="/dealers"><Contact dealer/></Route><Route path="/about" component={About}/><Route path="/contact"><Contact/></Route>
    <Route component={NotFound}/>
  </Switch></Shell>;
}

export default App;
