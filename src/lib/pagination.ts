export async function collectPages<T>(fetchPage: (offset: number, end: number) => Promise<T[]>, pageSize = 1000): Promise<T[]> {
 const rows: T[] = [];
 for (let offset = 0; ; ) {
  const batch = await fetchPage(offset, offset + pageSize - 1);
  if (batch.length === 0) break;
  rows.push(...batch); offset += batch.length;
 }
 return rows;
}
