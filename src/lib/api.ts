import { z } from 'zod';
export const paginationSchema=z.object({limit:z.coerce.number().int().min(1).max(50).default(20),offset:z.coerce.number().int().min(0).max(100000).default(0)});
export function paginationFromURL(url:URL) { return paginationSchema.safeParse({limit:url.searchParams.get('limit')??undefined,offset:url.searchParams.get('offset')??undefined}); }
export function safeSearchQuery(value:string) { return value.slice(0,200).replace(/[^\p{L}\p{N}\s-]/gu,' ').trim(); }
export const corsHeaders={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
