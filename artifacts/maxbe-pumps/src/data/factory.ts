export const factoryLocation = {
  name: 'Our Factory, Coimbatore',
  addressLines: [
    '264/5, Kurukkampalayam Road, Ganeshapuram,',
    'MGC Palayam Post, Coimbatore – 641107',
    'Tamil Nadu, India',
  ],
  address: '264/5, Kurukkampalayam Road, Ganeshapuram, MGC Palayam Post, Coimbatore 641107, Tamil Nadu, India',
  phone: '94883 535649 / 4425 735640422-2654185',
  email: 'maxbeindustries@yahoo.co.in',
} as const;

// Coordinates come from the Google Maps listing whose displayed address matches the factory.
const factoryMapLatitude = 11.1649397;
const factoryMapLongitude = 77.0569817;
export const factoryMapCoordinates = `${factoryMapLatitude},${factoryMapLongitude}`;

export const factoryMapPlaceUrl =
  `https://www.google.com/maps/place/Maxbe+Industries/@${factoryMapCoordinates},17z/data=!3m1!4b1!4m6!3m5!1s0x3ba8fb09a0da959d:0x8a2011673a116068!8m2!3d${factoryMapLatitude}!4d${factoryMapLongitude}!16s%2Fg%2F11h_fsz7j3`;
export const factoryMapEmbedUrl =
  `https://www.google.com/maps?q=${encodeURIComponent(factoryMapCoordinates)}&z=17&output=embed`;
export const factoryDirectionsUrl =
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(factoryMapCoordinates)}&travelmode=driving`;

export function directionsFromLocation(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    api: '1',
    origin: `${latitude},${longitude}`,
    destination: factoryMapCoordinates,
    travelmode: 'driving',
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
