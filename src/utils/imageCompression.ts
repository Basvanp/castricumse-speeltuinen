/**
 * Image compression utility for mobile uploads
 * Compresses images to max 1600px width and <1MB file size
 */

export interface CompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeKB: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.7,
  maxSizeKB: 1024, // 1MB
};

/**
 * Compresses an image file using Canvas API
 */
export const compressImage = async (
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<File> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let blobUrl: string | null = null;

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const handleImageLoad = () => {
      // Clean up blob URL
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > opts.maxWidth) {
          height = (height * opts.maxWidth) / width;
          width = opts.maxWidth;
        }
      } else {
        if (height > opts.maxHeight) {
          width = (width * opts.maxHeight) / height;
          height = opts.maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with progressive quality reduction
      const attemptCompression = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            const sizeKB = blob.size / 1024;
            console.log(`Compression attempt: quality=${quality}, size=${sizeKB.toFixed(1)}KB`);

            // If size is acceptable or quality is already very low, use this result
            if (sizeKB <= opts.maxSizeKB || quality <= 0.1) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              console.log(`Final compressed file: ${(compressedFile.size / 1024).toFixed(1)}KB`);
              resolve(compressedFile);
            } else {
              // Try with lower quality
              attemptCompression(Math.max(quality - 0.1, 0.1));
            }
          },
          'image/jpeg',
          quality
        );
      };

      // Start compression attempt
      attemptCompression(opts.quality);
    };

    img.onload = handleImageLoad;

    img.onerror = () => {
      // Clean up blob URL on error too
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      reject(new Error('Failed to load image'));
    };

    // Load the image
    blobUrl = URL.createObjectURL(file);
    img.src = blobUrl;
  });
};

/**
 * Validates if file is JPEG and shows appropriate error message
 */
export const validateJPEGFile = (file: File): { isValid: boolean; errorMessage?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg'];
  
  if (!allowedTypes.includes(file.type)) {
    const isHEIC = file.name.toLowerCase().includes('.heic');
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    
    let errorMessage = "Alleen JPEG-bestanden zijn toegestaan voor camera-uploads.";
    
    if (isHEIC) {
      errorMessage = "HEIC-bestanden worden niet ondersteund. Wijzig je camera-instellingen naar JPEG.";
    } else if (isPNG) {
      errorMessage = "PNG-bestanden bevatten geen GPS-data. Gebruik JPEG vanaf de camera.";
    } else if (isGIF) {
      errorMessage = "GIF-bestanden worden niet ondersteund. Gebruik JPEG vanaf de camera.";
    }
    
    return { isValid: false, errorMessage };
  }
  
  return { isValid: true };
};