const API_BASE = import.meta.env.VITE_API_URL ?? '';

/**
 * Nếu URL là link Google Images (imgres), trích lấy URL ảnh thực từ tham số imgurl.
 * Link dạng: https://www.google.com/imgres?imgurl=https%3A%2F%2F... → trả về URL đã decode.
 */
function resolveDirectImageUrl(url: string): string {
  try {
    if (!url.includes('google.com/imgres') && !url.includes('imgurl=')) return url;
    const parsed = new URL(url);
    const imgurl = parsed.searchParams.get('imgurl');
    return imgurl ? decodeURIComponent(imgurl) : url;
  } catch {
    return url;
  }
}

/**
 * Trả về URL đầy đủ cho ảnh. Nếu API trả về đường dẫn tương đối (vd. /uploads/xxx),
 * sẽ nối với base URL của API để trình duyệt tải đúng từ server.
 * Hỗ trợ cả link Google Images (imgres) → tự trích URL ảnh thực từ tham số imgurl.
 */
export function getImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  const resolved = resolveDirectImageUrl(trimmed);
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) return resolved;
  const base = API_BASE.replace(/\/$/, '');
  const path = resolved.startsWith('/') ? resolved : `/${resolved}`;
  return base ? `${base}${path}` : path;
}
