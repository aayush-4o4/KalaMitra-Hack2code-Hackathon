/**
 * Photo enhancement and cropping utilities for social media platforms
 */

export interface CropDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlatformSpecs {
  name: string;
  aspectRatio: number;
  width: number;
  height: number;
  description: string;
}

export const PLATFORM_SPECS: Record<string, PlatformSpecs> = {
  instagram_square: {
    name: 'Instagram Post',
    aspectRatio: 1,
    width: 1080,
    height: 1080,
    description: 'Square format for Instagram feed posts'
  },
  instagram_story: {
    name: 'Instagram Story',
    aspectRatio: 9/16,
    width: 1080,
    height: 1920,
    description: 'Vertical format for Instagram stories'
  },
  whatsapp_status: {
    name: 'WhatsApp Status',
    aspectRatio: 9/16,
    width: 1080,
    height: 1920,
    description: 'Vertical format for WhatsApp status updates'
  },
  facebook_post: {
    name: 'Facebook Post',
    aspectRatio: 16/9,
    width: 1200,
    height: 675,
    description: 'Landscape format for Facebook posts'
  }
};

/**
 * Calculate crop dimensions to maintain aspect ratio
 */
export function calculateCropDimensions(
  imageWidth: number,
  imageHeight: number,
  targetAspectRatio: number
): CropDimensions {
  const currentAspectRatio = imageWidth / imageHeight;
  
  let cropWidth = imageWidth;
  let cropHeight = imageHeight;
  let x = 0;
  let y = 0;
  
  if (currentAspectRatio > targetAspectRatio) {
    // Image is too wide, crop width
    cropWidth = imageHeight * targetAspectRatio;
    x = (imageWidth - cropWidth) / 2;
  } else if (currentAspectRatio < targetAspectRatio) {
    // Image is too tall, crop height
    cropHeight = imageWidth / targetAspectRatio;
    y = (imageHeight - cropHeight) / 2;
  }
  
  return { x, y, width: cropWidth, height: cropHeight };
}

/**
 * Apply basic image enhancements using canvas
 */
export function enhanceImageCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
): void {
  // Draw original image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Apply enhancements
  for (let i = 0; i < data.length; i += 4) {
    // Increase contrast (simple method)
    const factor = 1.1;
    data[i] = Math.min(255, data[i] * factor);     // Red
    data[i + 1] = Math.min(255, data[i + 1] * factor); // Green
    data[i + 2] = Math.min(255, data[i + 2] * factor); // Blue
    
    // Increase saturation slightly
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const saturationFactor = 1.15;
    
    data[i] = Math.min(255, gray + (data[i] - gray) * saturationFactor);
    data[i + 1] = Math.min(255, gray + (data[i + 1] - gray) * saturationFactor);
    data[i + 2] = Math.min(255, gray + (data[i + 2] - gray) * saturationFactor);
  }
  
  // Put enhanced image data back
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Convert canvas to blob for download
 */
export function canvasToBlob(canvas: HTMLCanvasElement, quality: number = 0.9): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/jpeg', quality);
  });
}

/**
 * Download image from canvas
 */
export function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, 'image/jpeg', 0.9);
}