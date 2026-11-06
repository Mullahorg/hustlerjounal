import { describe, expect, it } from 'vitest';
import { canEditPost, canChangeStatus } from './editor-rules';
describe('Editorial permissions', () => {
 it('a writer cannot edit another writer draft', () => expect(canEditPost(['writer'],'other','me','draft')).toBe(false));
 it('a writer can edit their own draft', () => expect(canEditPost(['writer'],'me','me','draft')).toBe(true));
 it('an editor cannot publish', () => expect(canChangeStatus(['editor'],'other','me','approved','published')).toBe(false));
 it('a media manager cannot publish', () => expect(canChangeStatus(['media_manager'],'me','me','approved','published')).toBe(false));
 it('a moderator cannot edit posts', () => expect(canEditPost(['moderator'],'me','me','draft')).toBe(false));
 it('a publisher can publish approved content', () => expect(canChangeStatus(['publisher'],'other','me','approved','published')).toBe(true));
 it('invalid statuses cannot be applied', () => expect(canChangeStatus(['admin'],'me','me','draft','invalid')).toBe(false));
});
