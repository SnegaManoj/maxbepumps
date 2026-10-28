export const PRODUCT_IMAGE_VIEWS = ['Top View', 'Front View', 'Left View', 'Right View'] as const;

export type ProductImageView = (typeof PRODUCT_IMAGE_VIEWS)[number];
export type ProductImageSlot = ProductImageView | 'Explore Front View';

const DATABASE_NAME = 'maxbe-product-catalogue';
const STORE_NAME = 'product-images';
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('Browser image storage is unavailable.'));
  }

  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Could not open browser image storage.'));
      request.onblocked = () => reject(new Error('Browser image storage is blocked by another tab.'));
    });
  }

  return databasePromise;
}

function imageKey(productSlug: string, slot: ProductImageSlot): string {
  return `${productSlug}:${slot}`;
}

export async function readProductImage(productSlug: string, slot: ProductImageSlot): Promise<Blob | undefined> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(imageKey(productSlug, slot));
    request.onsuccess = () => resolve(request.result as Blob | undefined);
    request.onerror = () => reject(request.error ?? new Error('Could not read the saved product image.'));
  });
}

export async function saveProductImage(productSlug: string, slot: ProductImageSlot, file: File): Promise<void> {
  if (!allowedTypes.has(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Choose an image smaller than 10 MB.');
  }

  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(file, imageKey(productSlug, slot));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save the product image.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving the product image was cancelled.'));
  });
}

export async function deleteProductImage(productSlug: string, slot: ProductImageSlot): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(imageKey(productSlug, slot));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not remove the saved product image.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Removing the product image was cancelled.'));
  });
}
