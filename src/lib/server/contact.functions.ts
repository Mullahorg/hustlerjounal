import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { createJournalPublicClient } from './supabase-public';
export const sendContactMessage=createServerFn({method:'POST'})
 .inputValidator(z.object({name:z.string().trim().min(1).max(80),email:z.string().email().max(254),reason:z.string().min(1).max(100),message:z.string().trim().min(10).max(5000)}))
 .handler(async ({data})=>{
  const client=createJournalPublicClient();
  const {error}=await client.from('contact_messages').insert(data);
  return error?{ok:false,error:'Could not send your message. Please try again.'}:{ok:true};
 });
