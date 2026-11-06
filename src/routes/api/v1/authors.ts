import { createFileRoute } from '@tanstack/react-router';
import { createJournalPublicClient } from '@/lib/server/supabase-public';
import { corsHeaders } from '@/lib/api';
export const Route=createFileRoute('/api/v1/authors')({staticData:{sitemap:false},server:{handlers:{GET:async()=>{const client=createJournalPublicClient();const {data,error}=await client.from('authors').select('name,slug,role_title,bio,avatar_url').is('deleted_at',null).order('name').limit(100);if(error)return Response.json({error:{code:'server_error',message:'Unable to load resources.'}},{status:500,headers:corsHeaders});return Response.json({data:data??[]},{headers:corsHeaders});},OPTIONS:()=>new Response(null,{status:204,headers:corsHeaders})}}});
