export function getImageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path; // already a full URL
  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '');
  return `${apiOrigin}${path}`;
}