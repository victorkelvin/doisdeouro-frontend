// Utilitário simples de cache para imagens base64
const imageCache = new Map();

export function getCachedImage(key, base64) {
  if (imageCache.has(key)) {
    return imageCache.get(key);
  }
  imageCache.set(key, base64);
  return base64;
}
