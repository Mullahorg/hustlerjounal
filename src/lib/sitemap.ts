import type { AnyRoute, AnyRouter, ParsedLocation } from '@tanstack/react-router';
declare module '@tanstack/react-router' { interface StaticDataRouteOption { sitemap: boolean | 'exclude-subtree' } }
export const sitemapRouteInventoryVersion = 1;
type RouteMatch = { routeParams: Record<string, unknown>; foundRoute?: AnyRoute; parseError?: unknown } | [AnyRoute[], Record<string, unknown>, AnyRoute | undefined];
export function isSitemapRouteIncluded(route: AnyRoute | undefined): boolean {
 if (!route || route.isRoot || route.options.staticData?.sitemap !== true) return false;
 for (let parent = route.parentRoute; parent; parent = parent.parentRoute) if (parent.options.staticData?.sitemap === 'exclude-subtree') return false;
 return true;
}
export function sitemapStaticPaths(router: AnyRouter): string[] {
 const paths = new Set<string>();
 for (const route of Object.values(router.routesById) as AnyRoute[]) {
  if (!isSitemapRouteIncluded(route) || /[$*]/.test(route.fullPath)) continue;
  const path = sitemapPathForLocation(router, router.buildLocation({ to: route.fullPath }), route.id);
  if (path !== undefined) paths.add(path);
 }
 return [...paths].sort();
}
export function sitemapPathForLocation(router: AnyRouter, location: Pick<ParsedLocation, 'pathname' | 'publicHref'>, routeId: string): string | undefined {
 if (!isSafeSitemapPath(location.pathname) || !isSafeSitemapPath(location.publicHref)) return undefined;
 const result = router.getMatchedRoutes(location.pathname) as RouteMatch;
 const [params, route] = Array.isArray(result) ? [result[1], result[2]] : [result.routeParams, result.parseError ? undefined : result.foundRoute];
 return params['**'] === undefined && route?.id === routeId && isSitemapRouteIncluded(route) ? location.publicHref : undefined;
}
export interface SitemapEntry { path: string; lastmod?: string }
function isSafeSitemapPath(path: string): boolean {
 if (!path.startsWith('/') || path.startsWith('//') || /[?#\\]/.test(path)) return false;
 try { return decodeURI(new URL(path, 'https://sitemap.invalid').pathname) === decodeURI(path); } catch { return false; }
}
export function escapeXML(value: string): string {
 const chars: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
 return value.replace(/[&<>"']/g, c => chars[c] ?? c);
}
export function sitemapXML(baseURL: string, entries: SitemapEntry[]): string {
 const origin = new URL(baseURL);
 if (!/^https?:$/.test(origin.protocol) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('Invalid sitemap origin');
 const seen = new Set<string>(); const urls: string[] = [];
 for (const entry of entries) {
  if (!isSafeSitemapPath(entry.path)) throw new Error('Invalid sitemap path');
  const url = new URL(entry.path, origin).href;
  if (seen.has(url)) continue; seen.add(url);
  urls.push(`<url><loc>${escapeXML(url)}</loc>${entry.lastmod ? `<lastmod>${escapeXML(entry.lastmod)}</lastmod>` : ''}</url>`);
 }
 return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
}
