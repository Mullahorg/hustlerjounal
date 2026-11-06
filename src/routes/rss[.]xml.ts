import { createFileRoute } from '@tanstack/react-router';
import { createJournalPublicClient } from '@/lib/server/supabase-public';
import { escapeXML } from '@/lib/sitemap';
import { cardRoute } from '@/components/content/article-card';
export const Route = createFileRoute('/rss.xml')({
 staticData:{sitemap:false},
 server:{handlers:{GET:async ({request})=>{
  const client=createJournalPublicClient(); const category=new URL(request.url).searchParams.get('category');
  let query=client.from('posts').select('title,slug,type,excerpt,published_at,category:categories!inner(slug)').eq('status','published').is('deleted_at',null).lte('published_at',new Date().toISOString()).order('published_at',{ascending:false}).limit(50);
  if(category) query=query.eq('category.slug',category);
  const {data,error}=await query; if(error) throw error;
  const items=(data??[]).map(post=>{
   const url='https://hustlerjounal.lovable.app'+cardRoute(post).replace('$slug',encodeURIComponent(post.slug));
   return `<item><title>${escapeXML(post.title)}</title><link>${escapeXML(url)}</link><guid isPermaLink="true">${escapeXML(url)}</guid><description>${escapeXML(post.excerpt??'')}</description>${post.published_at?`<pubDate>${new Date(post.published_at).toUTCString()}</pubDate>`:''}</item>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Hustler Journal</title><link>https://hustlerjounal.lovable.app</link><description>Practical guides, honest stories, and product updates from HustlerLink.</description><language>en</language>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=300'}});
 }}}
});
