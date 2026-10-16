/** API origin is configured at build time for GitHub Pages.
 * A Vercel full-stack deployment uses same-origin requests by default. */
export function apiUrl(endpoint: string): string {
  const configured = (import.meta.env.VITE_API_BASE_URL || '').trim();
  const origin = configured.replace(/\/$/, '');
  return origin + '/api/' + endpoint.replace(/^\/?api\//, '').replace(/^\//, '');
}
