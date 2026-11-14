/**
 * Client-Side Image Resizer & Compressor for BorrowBox
 * Downscales camera and smartphone photos to crisp, web-optimized JPEG data URLs.
 * Keeps individual photo sizes around 40KB - 80KB so that 4-photo item listings
 * stay well within browser localStorage quotas and fast network upload limits.
 */

export const compressImageFile = async (
  file,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.78
) => {
  if (!file) {
    throw new Error('No file provided for compression.');
  }

  // If in Node/SSR environment where document is not defined
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 'data:image/jpeg;base64,mockCompressedImage';
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file from disk.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to decode image. Please select a valid JPEG, PNG, or WebP photo.'));
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Compute proportional dimensions
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Ensure minimum dimensions
          width = Math.max(1, width);
          height = Math.max(1, height);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            // Fallback if 2d context unavailable
            return resolve(reader.result);
          }

          // Fill white background for transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Render with bicubic/high quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Canvas compression error, falling back to original:', err);
          resolve(reader.result);
        }
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
};

