import { useState } from 'react';
import { ArrowUpRight, ExternalLink, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { directionsFromLocation, factoryDirectionsUrl, factoryLocation, factoryMapEmbedUrl, factoryMapPlaceUrl } from '../data/factory';

function locationErrorMessage(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) return 'Location permission was denied. You can still open the factory address in Google Maps.';
  if (error.code === error.TIMEOUT) return 'Your location could not be found in time. You can still open the factory address in Google Maps.';
  return 'Your location is unavailable right now. You can still open the factory address in Google Maps.';
}

export function FactoryContactDetails({ allowCurrentLocation = false }: { allowCurrentLocation?: boolean }) {
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [directionsFallback, setDirectionsFallback] = useState('');

  const getDirectionsFromCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('This browser does not support location access. You can still open the factory address in Google Maps.');
      setDirectionsFallback(factoryDirectionsUrl);
      return;
    }

    setLocationError('');
    setDirectionsFallback('');
    setLocating(true);

    let directionsWindow: Window | null = null;
    try {
      directionsWindow = window.open('about:blank', '_blank');
      if (directionsWindow) directionsWindow.opener = null;

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLocating(false);
          const directionsUrl = directionsFromLocation(coords.latitude, coords.longitude);
          if (directionsWindow && !directionsWindow.closed) {
            directionsWindow.location.replace(directionsUrl);
          } else {
            setLocationError('Your location was found. Open the directions link below to continue in Google Maps.');
            setDirectionsFallback(directionsUrl);
          }
        },
        error => {
          directionsWindow?.close();
          setLocating(false);
          setLocationError(locationErrorMessage(error));
          setDirectionsFallback(factoryDirectionsUrl);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } catch {
      directionsWindow?.close();
      setLocating(false);
      setLocationError('Location access could not be started. You can still open the factory address in Google Maps.');
      setDirectionsFallback(factoryDirectionsUrl);
    }
  };

  return <div className="factory-contact-details">
    <div className="factory-contact-name"><MapPin size={19} aria-hidden="true"/><h3>{factoryLocation.name}</h3></div>
    <div className="factory-contact-row"><MapPin size={17} aria-hidden="true"/><address>{factoryLocation.addressLines.map(line => <span key={line}>{line}</span>)}</address></div>
    <div className="factory-contact-row"><Phone size={17} aria-hidden="true"/><span><b>Phone:</b> {factoryLocation.phone}</span></div>
    <div className="factory-contact-row"><Mail size={17} aria-hidden="true"/><span><b>Email:</b> <a href={`mailto:${factoryLocation.email}`}>{factoryLocation.email}</a></span></div>
    <a className="factory-directions-link" href={factoryDirectionsUrl} target="_blank" rel="noopener noreferrer">
      <Navigation size={16} aria-hidden="true"/>Get Directions<ArrowUpRight size={14} aria-hidden="true"/>
    </a>
    {allowCurrentLocation && <>
      <button className="factory-current-location-button" type="button" onClick={getDirectionsFromCurrentLocation} disabled={locating}>
        <MapPin size={16} aria-hidden="true"/>{locating ? 'Finding your location…' : 'Use My Current Location'}
      </button>
      {locationError && <p className="factory-location-feedback" role="status">{locationError}</p>}
      {directionsFallback && <a className="factory-fallback-directions" href={directionsFallback} target="_blank" rel="noopener noreferrer">Open directions in Google Maps <ExternalLink size={14} aria-hidden="true"/></a>}
    </>}
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
        <article className="contact-factory-card"><FactoryContactDetails allowCurrentLocation/></article>
        <FactoryMap variant="large"/>
      </div>
    </div>
  </section>;
}
