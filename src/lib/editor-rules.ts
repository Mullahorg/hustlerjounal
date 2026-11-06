export const STAFF_ROLES = ['writer', 'editor', 'senior_editor', 'publisher', 'admin', 'super_admin'];
export const PUBLISH_ROLES = ['publisher', 'admin', 'super_admin'];
export const APPROVE_ROLES = ['senior_editor', 'publisher', 'admin', 'super_admin'];
export const ADMIN_ROLES = ['admin', 'super_admin'];
export const POST_STATUSES = ['draft', 'in_review', 'approved', 'scheduled', 'published', 'archived'] as const;
export function canEditPost(roles: string[], owner: string | null, userId: string, status: string) {
 if (roles.some(r => ['editor','senior_editor','publisher','admin','super_admin'].includes(r))) return true;
 return roles.includes('writer') && owner === userId && ['draft','in_review'].includes(status);
}
export function canChangeStatus(roles: string[], owner: string | null, userId: string, current: string, next: string) {
 if (!POST_STATUSES.some(s => s === next) || !canEditPost(roles, owner, userId, current)) return false;
 if (next === 'published' || next === 'scheduled' || (current === 'published' && next === 'archived')) return roles.some(r => PUBLISH_ROLES.includes(r));
 if (next === 'approved') return roles.some(r => APPROVE_ROLES.includes(r)) && current === 'in_review';
 return (next === 'in_review' && current === 'draft') || (next === 'draft' && ['in_review','approved','archived','scheduled'].includes(current)) || (next === 'archived' && current !== 'published');
}
