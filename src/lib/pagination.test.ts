import { expect, it } from 'vitest';
import { collectPages } from './pagination';
it('collects every batch rather than stopping at the first page', async () => {
 const values = [1,2,3,4,5];
 expect(await collectPages(async (start,end) => values.slice(start,end+1),2)).toEqual(values);
});
it('fails instead of returning partial data when a later page fails', async () => {
 await expect(collectPages(async start => { if(start) throw new Error('unavailable'); return [1,2]; },2)).rejects.toThrow('unavailable');
});
