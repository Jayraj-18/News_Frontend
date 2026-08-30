const isCloudinaryUrl = (url) => url.includes('res.cloudinary.com');
const isUnsplashUrl = (url) => url.includes('images.unsplash.com');

export const getOptimizedImageUrl = (url, { width, height } = {}) => {
  if (!url || url.startsWith('data:image')) return url;

  if (isCloudinaryUrl(url)) {
    const transformation = [
      width && `w_${width}`,
      height && `h_${height}`,
      'c_fill',
      'q_auto:eco',
      'f_auto'
    ].filter(Boolean).join(',');

    return url.replace('/image/upload/', `/image/upload/${transformation}/`);
  }

  if (isUnsplashUrl(url)) {
    const optimizedUrl = new URL(url);
    if (width) optimizedUrl.searchParams.set('w', width);
    if (height) optimizedUrl.searchParams.set('h', height);
    optimizedUrl.searchParams.set('fit', 'crop');
    optimizedUrl.searchParams.set('auto', 'format');
    optimizedUrl.searchParams.set('q', '65');
    return optimizedUrl.toString();
  }

  return url;
};

export const getResponsiveImageSrcSet = (url, widths, height) =>
  widths
    .map((width) => `${getOptimizedImageUrl(url, { width, height })} ${width}w`)
    .join(', ');