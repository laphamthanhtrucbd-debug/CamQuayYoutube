export function generateMediaFilename(prefix: 'Lumina_Photo' | 'Lumina_Video', extension: string): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return `${prefix}_${yyyy}${mm}${dd}_${hh}${min}${ss}.${extension}`;
}

export function formatReadableTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
