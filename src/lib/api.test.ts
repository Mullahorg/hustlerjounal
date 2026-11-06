import { expect,it } from 'vitest';
import { paginationFromURL,safeSearchQuery } from './api';
it('accepts the default public pagination',()=>expect(paginationFromURL(new URL('https://example.test')).success).toBe(true));
it('rejects malformed pagination',()=>expect(paginationFromURL(new URL('https://example.test?limit=bad')).success).toBe(false));
it('caps the API page size at 50',()=>expect(paginationFromURL(new URL('https://example.test?limit=51')).success).toBe(false));
it('removes raw filter metacharacters from search',()=>expect(safeSearchQuery('escrow),status.eq.draft')).toBe('escrow  status eq draft'));
