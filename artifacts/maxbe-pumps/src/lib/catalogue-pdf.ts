import { readProductImage, PRODUCT_IMAGE_VIEWS, type ProductImageView } from '../data/product-images';
import type { ProductCategory } from '../data/products';

type PdfImage = { data: string; width: number; height: number };
type PdfLogo = PdfImage;

const pageMargin = 42;
const footerHeight = 38;
const brandRed: [number, number, number] = [246, 2, 2];
const ink: [number, number, number] = [17, 17, 17];
const muted: [number, number, number] = [90, 90, 90];

function printableText(value: string): string {
  return value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E]/g, '');
}

async function loadLogo(): Promise<PdfLogo> {
  const response = await fetch('/assets/maxbe-logo-transparent.png');
  if (!response.ok) throw new Error('The existing MAXBE logo could not be loaded for the catalogue.');
  const bitmap = await createImageBitmap(await response.blob());
  const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('This browser could not prepare the MAXBE logo for the PDF.');
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return { data: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height };
}

async function blobToPng(blob: Blob): Promise<PdfImage> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('This browser could not prepare an uploaded image for the PDF.');
  }
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return { data: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height };
}

function fitImage(image: PdfImage, x: number, y: number, width: number, height: number) {
  const scale = Math.min(width / image.width, height / image.height);
  const fittedWidth = image.width * scale;
  const fittedHeight = image.height * scale;
  return { x: x + (width - fittedWidth) / 2, y: y + (height - fittedHeight) / 2, width: fittedWidth, height: fittedHeight };
}

export async function generateProductCataloguePdf(products: ProductCategory[]): Promise<Blob> {
  if (!products.length) throw new Error('Select at least one catalogue entry before downloading a PDF.');
  const { jsPDF } = await import('jspdf');

  const [logo, imageEntries] = await Promise.all([
    loadLogo(),
    Promise.all(products.map(async product => {
      const entries = await Promise.all(PRODUCT_IMAGE_VIEWS.map(async view => {
        const blob = await readProductImage(product.slug, view);
        return blob ? [view, await blobToPng(blob)] as const : undefined;
      }));
      return [product.slug, new Map(entries.filter((entry): entry is readonly [ProductImageView, PdfImage] => Boolean(entry)))] as const;
    })),
  ]);
  const imagesByProduct = new Map(imageEntries);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - pageMargin * 2;
  let hasPage = false;
  let currentProduct: ProductCategory | undefined;

  const addHeader = (continued = false) => {
    if (hasPage) pdf.addPage();
    hasPage = true;
    pdf.setFillColor(...brandRed);
    pdf.rect(0, 0, pageWidth, 10, 'F');
    const fittedLogo = fitImage(logo, pageMargin, 24, 108, 38);
    pdf.addImage(logo.data, 'PNG', fittedLogo.x, fittedLogo.y, fittedLogo.width, fittedLogo.height, undefined, 'FAST');
    pdf.setTextColor(...brandRed);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('PRODUCT CATALOGUE', pageWidth - pageMargin, 39, { align: 'right' });
    if (continued && currentProduct) {
      pdf.setTextColor(...muted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text('CONTINUED', pageWidth - pageMargin, 52, { align: 'right' });
    }
    return 78;
  };

  const newFlowPage = () => addHeader(true);

  for (const product of products) {
    currentProduct = product;
    let y = addHeader();
    pdf.setTextColor(...brandRed);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    const titleLines = pdf.splitTextToSize(printableText(product.name), contentWidth);
    pdf.text(titleLines, pageMargin, y + 22);
    y += titleLines.length * 25 + 18;

    pdf.setTextColor(...muted);
    pdf.setFontSize(9);
    pdf.text('CATEGORY OVERVIEW', pageMargin, y);
    y += 20;

    pdf.setTextColor(...ink);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Description', pageMargin, y);
    y += 16;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...muted);
    const descriptionLines: string[] = pdf.splitTextToSize(printableText(product.description), contentWidth);
    for (const line of descriptionLines) {
      if (y + 15 > pageHeight - footerHeight - pageMargin) y = newFlowPage();
      pdf.text(line, pageMargin, y);
      y += 14;
    }
    y += 14;

    if (y + 92 > pageHeight - footerHeight - pageMargin) y = newFlowPage();
    pdf.setTextColor(...ink);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Available product information', pageMargin, y);
    y += 10;

    const tableRows = [['Category', product.name]];
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    for (const [label, value] of tableRows) {
      y += 10;
      pdf.setDrawColor(231, 224, 214);
      pdf.line(pageMargin, y + 8, pageWidth - pageMargin, y + 8);
      pdf.setTextColor(...muted);
      pdf.text(label, pageMargin + 8, y);
      pdf.setTextColor(...ink);
      pdf.text(pdf.splitTextToSize(printableText(value), contentWidth - 142), pageMargin + 142, y);
      y += 16;
    }
    pdf.setFillColor(245, 241, 235);
    pdf.roundedRect(pageMargin, y + 4, contentWidth, 32, 4, 4, 'F');
    pdf.setTextColor(...muted);
    pdf.setFontSize(8);
    pdf.text('Verified model-specific technical specifications have not been supplied.', pageMargin + 10, y + 23);
    y += 50;

    const galleryHeight = 276;
    if (y + galleryHeight + 20 > pageHeight - footerHeight - pageMargin) y = newFlowPage();
    pdf.setTextColor(...ink);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Four-angle product views', pageMargin, y);
    y += 12;

    const gap = 12;
    const cardWidth = (contentWidth - gap) / 2;
    const cardHeight = 116;
    const rowGap = 11;
    const images = imagesByProduct.get(product.slug);
    PRODUCT_IMAGE_VIEWS.forEach((view, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = pageMargin + column * (cardWidth + gap);
      const top = y + row * (cardHeight + rowGap);
      pdf.setDrawColor(225, 219, 210);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(x, top, cardWidth, cardHeight, 4, 4, 'FD');
      pdf.setTextColor(...brandRed);
      pdf.setFontSize(8);
      pdf.text(view.toUpperCase(), x + 10, top + 16);
      const image = images?.get(view);
      if (image) {
        const fitted = fitImage(image, x + 12, top + 24, cardWidth - 24, cardHeight - 32);
        pdf.addImage(image.data, 'PNG', fitted.x, fitted.y, fitted.width, fitted.height, undefined, 'FAST');
      } else {
        pdf.setTextColor(...muted);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.text('No image uploaded', x + cardWidth / 2, top + 76, { align: 'center' });
      }
    });
    y += cardHeight * 2 + rowGap + 20;

    if (y + 66 > pageHeight - footerHeight - pageMargin) y = newFlowPage();
    pdf.setFillColor(245, 241, 235);
    pdf.roundedRect(pageMargin, y, contentWidth, 58, 4, 4, 'F');
    pdf.setTextColor(...brandRed);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('MAXBE PUMPS', pageMargin + 12, y + 18);
    pdf.setTextColor(...muted);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Confirm model specifications and availability directly with MAXBE.', pageMargin + 12, y + 36);
  }

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setDrawColor(231, 224, 214);
    pdf.line(pageMargin, pageHeight - footerHeight, pageWidth - pageMargin, pageHeight - footerHeight);
    pdf.setTextColor(...muted);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('MAXBE PUMPS  ·  WEBSITE-GENERATED PRODUCT RANGE OVERVIEW', pageMargin, pageHeight - 17);
    pdf.text(`${page} / ${pageCount}`, pageWidth - pageMargin, pageHeight - 17, { align: 'right' });
  }

  return pdf.output('blob');
}

export async function downloadProductCataloguePdf(products: ProductCategory[]): Promise<void> {
  const blob = await generateProductCataloguePdf(products);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = products.length === 1
    ? `maxbe-${products[0].slug}-catalogue.pdf`
    : 'maxbe-product-range-overview.pdf';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
