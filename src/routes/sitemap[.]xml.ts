import { createFileRoute } from '@tanstack/react-router';
import { getRouterInstance } from '@tanstack/react-start';
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from '@/lib/sitemap';
import { collectPages } from '@/lib/pagination';
import { cardRoute } from '@/components/content/article-card';
import { createJournalPublicClient } from '@/lib/server/supabase-public';
const BASE_URL = 'https://hustlerjounal.lovable.app';
export const Route = createFileRoute('/sitemap.xml')({
 staticData: { sitemap: false },
 server: { handlers: { GET: async () => {
  const router = await getRouterInstance();
  const entries: SitemapEntry[] = sitemapStaticPaths(router).map(path => ({ path }));
  const client = createJournalPublicClient();
  const posts = await collectPages(async (start,end) => {
   const { data,error } = await client.from('posts').select('slug,type,updated_at').eq('status','published').is('deleted_at',null).lte('published_at',new Date().toISOString()).order('id').range(start,end);
   if(error) throw error; return data ?? [];
  });
  for(const post of posts) {
   const to = cardRoute(post);
   const location = router.buildLocation({ to, params: { slug: post.slug }, search: () => ({}), hash: '' });
   const match = router.getMatchedRoutes(location.pathname);
   if (!match.foundRoute || !isSitemapRouteIncluded(match.foundRoute)) continue;
   const path = sitemapPathForLocation(router,location,match.foundRoute.id);
   if(path) entries.push({path,lastmod:post.updated_at});
  }
  for(const table of ['categories','authors','topics','series'] as const) {
   const rows = await collectPages(async (start,end) => {
    const {data,error}=await client.from(table).select('slug').is('deleted_at',null).order('id').range(start,end);
    if(error) throw error; return data ?? [];
   });
   const destinations = { categories: '/categories/$slug', authors: '/authors/$slug', topics: '/topics/$slug', series: '/series/$slug' } as const;
   for(const row of rows) {
    const location=router.buildLocation({to:destinations[table],params:{slug:row.slug},search:()=>({}),hash:''});
    const match=router.getMatchedRoutes(location.pathname);
    if(!match.foundRoute) continue;
    const path=sitemapPathForLocation(router,location,match.foundRoute.id);
    if(path) entries.push({path});
   }
  }
  return new Response(sitemapXML(BASE_URL,entries),{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300'}});
 } } }
});
