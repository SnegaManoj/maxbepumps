import { ArrowUpRight, ExternalLink, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { factoryDirectionsUrl, factoryLocation, factoryMapEmbedUrl, factoryMapPlaceUrl } from '../data/factory';

export function FactoryContactDetails() {

  return <div className="factory-contact-details">
    <div className="factory-contact-name"><MapPin size={19} aria-hidden="true"/><h3>{factoryLocation.name}</h3></div>
    <div className="factory-contact-row"><MapPin size={17} aria-hidden="true"/><address>{factoryLocation.addressLines.map(line => <span key={line}>{line}</span>)}</address></div>
    <div className="factory-contact-row"><Phone size={17} aria-hidden="true"/><span><b>Phone:</b> {factoryLocation.phones.map((phone,index)=><span className="factory-phone-link" key={phone.href}>{index>0&&' · '}<a href={phone.href}>{phone.value}</a>{phone.label==='Factory'?' (Factory)':''}</span>)}</span></div>
    <div className="factory-contact-row"><Mail size={17} aria-hidden="true"/><span><b>Email:</b> <a href={`mailto:${factoryLocation.email}`}>{factoryLocation.email}</a></span></div>
    <div className="factory-contact-row factory-business-hours"><span><b>Business hours:</b> {factoryLocation.businessHours}</span></div>
    <a className="factory-directions-link" href={factoryDirectionsUrl} target="_blank" rel="noopener noreferrer">
      <Navigation size={16} aria-hidden="true"/>Get Directions<ArrowUpRight size={14} aria-hidden="true"/>
    </a>
  </div>;
}

export function FactoryMap({ variant }: { variant: 'compact' | 'large' }) {
  return <div className={`factory-map factory-map-${variant}`}>
    <div className="factory-map-viewport">
      <iframe
        title={`Google Maps location for ${factoryLocation.name}`}
        src={factoryMapEmbedUrl}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
    <a className="factory-map-search-link" href={factoryMapPlaceUrl} target="_blank" rel="noopener noreferrer">
      Open factory pin in Google Maps <ExternalLink size={15} aria-hidden="true"/>
    </a>
  </div>;
}

export function HomeFactoryLocation() {
  return <section className="section home-factory-section" aria-labelledby="home-factory-heading">
    <div className="container">
      <div className="section-head">
        <div><div className="eyebrow">FIND US IN</div><h2 id="home-factory-heading">Our Factory, Coimbatore</h2></div>
        <p>Find our factory and contact the MAXBE team.</p>
      </div>
      <div className="home-factory-card">
        <FactoryContactDetails/>
        <FactoryMap variant="compact"/>
      </div>
    </div>
  </section>;
}

export function ContactFactoryLocation() {
  return <section className="section contact-factory-section" aria-labelledby="contact-factory-heading">
    <div className="container">
      <div className="section-head">
        <div><div className="eyebrow">FIND US IN</div><h2 id="contact-factory-heading">Our Factory, Coimbatore</h2></div>
        <p>Visit or contact our factory using the details below.</p>
      </div>
      <div className="contact-factory-layout">
        <article className="contact-factory-card"><FactoryContactDetails/></article>
        <FactoryMap variant="large"/>
      </div>
    </div>
  </section>;
}
