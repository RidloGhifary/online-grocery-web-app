export default function createQueryParams({ url, params }: { url?: string; params: Record<string, any> }): string {
  const hasValidParams = Object.values(params).some(value => value !== undefined && value !== null);

  if (!hasValidParams) {
    return url || '';
  }

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null) // Filter out undefined or null values
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return url ? `${url}?${queryString}` : queryString;
}
