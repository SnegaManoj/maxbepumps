import { SAMPLE_PRODUCT_IMAGE } from '../data/products';

export function SampleProductImage({
  src = SAMPLE_PRODUCT_IMAGE,
  alt = 'MAXBE pump sample reference image',
  className = '',
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  return <span className={`sample-product-image${className ? ` ${className}` : ''}`}>
    <img src={src} alt={alt} loading="lazy"/>
    <span className="sample-product-image-watermark" aria-hidden="true">SAMPLE IMAGE</span>
  </span>;
}
