import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import {
  deleteProductImage,
  PRODUCT_IMAGE_VIEWS,
  readProductImage,
  saveProductImage,
  type ProductImageSlot,
} from '../../data/product-images';

type StoredImage = { blob: Blob; url: string };

function useProductImage(productSlug: string, slot: ProductImageSlot) {
  const [image, setImage] = useState<StoredImage>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const imageUrl = useRef('');

  useEffect(() => {
    let active = true;
    let currentUrl = '';
    setImage(undefined);
    setError('');
    void readProductImage(productSlug, slot).then(blob => {
      if (active && blob) {
        currentUrl = URL.createObjectURL(blob);
        imageUrl.current = currentUrl;
        setImage({ blob, url: currentUrl });
      }
    }).catch(reason => {
      if (active) setError(reason instanceof Error ? reason.message : 'Could not load the saved image.');
    });
    return () => {
      active = false;
      if (imageUrl.current) {
        URL.revokeObjectURL(imageUrl.current);
        imageUrl.current = '';
      }
    };
  }, [productSlug, slot]);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      await saveProductImage(productSlug, slot, file);
      const url = URL.createObjectURL(file);
      if (imageUrl.current) URL.revokeObjectURL(imageUrl.current);
      imageUrl.current = url;
      setImage({ blob: file, url });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save the image.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError('');
    try {
      await deleteProductImage(productSlug, slot);
      if (imageUrl.current) URL.revokeObjectURL(imageUrl.current);
      imageUrl.current = '';
      setImage(undefined);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not remove the image.');
    } finally {
      setBusy(false);
    }
  };

  return { image, error, busy, upload, remove };
}

function ProductImageFrame({
  productSlug,
  slot,
  label,
  aspectRatio,
  dimensions,
  editable = true,
}: {
  productSlug: string;
  slot: ProductImageSlot;
  label: string;
  aspectRatio: string;
  dimensions?: string;
  editable?: boolean;
}) {
  const { image, error, busy, upload, remove } = useProductImage(productSlug, slot);

  return <article className="catalogue-image-card">
    <div className={`catalogue-image-frame${image ? ' has-image' : ''}`} style={{ aspectRatio }} aria-label={`${label} image frame`}>
      {image ? <img src={image.url} alt={`${label} of ${productSlug.replaceAll('-', ' ')}`} /> : <div className="catalogue-image-empty"><ImagePlus size={20} aria-hidden="true"/><span>Image not uploaded</span></div>}
      <span className="catalogue-image-label">{label}</span>
    </div>
    {dimensions && <p className="catalogue-image-dimensions">Intended image size: {dimensions}</p>}
    {editable && <>
      <div className="catalogue-image-actions">
        <label className={`catalogue-upload-button${busy ? ' is-busy' : ''}`}>
          <ImagePlus size={15} aria-hidden="true"/>{busy ? 'Saving…' : image ? 'Replace image' : 'Upload image'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label={`Upload ${label} image`}
            disabled={busy}
            onChange={event => {
              void upload(event.currentTarget.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </label>
        {image && <button className="catalogue-image-remove" type="button" onClick={() => void remove()} disabled={busy} aria-label={`Remove ${label} image`}><Trash2 size={15}/></button>}
      </div>
      {error && <p className="catalogue-inline-error" role="alert">{error}</p>}
    </>}
  </article>;
}

export function ProductImageGallery({ productSlug, editable = true }: { productSlug: string; editable?: boolean }) {
  return <div className="catalogue-image-grid">
    {PRODUCT_IMAGE_VIEWS.map(view => <ProductImageFrame key={view} productSlug={productSlug} slot={view} label={view} aspectRatio="1 / 1" editable={editable}/>)}
  </div>;
}

export function ExploreCategoryImage({ productSlug, editable = true }: { productSlug: string; editable?: boolean }) {
  return <ProductImageFrame
    productSlug={productSlug}
    slot="Explore Front View"
    label="Front View"
    aspectRatio="4 / 3"
    dimensions="1200 × 900 px"
    editable={editable}
  />;
}
