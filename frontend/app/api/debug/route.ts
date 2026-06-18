export const dynamic = 'force-dynamic';

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  let result: Record<string, unknown> = {
    NEXT_PUBLIC_API_URL_env: process.env.NEXT_PUBLIC_API_URL,
    resolvedApiUrl: apiUrl,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${apiUrl}/issues`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    result = {
      ...result,
      fetchStatus: res.status,
      fetchOk: res.ok,
      fetchStatusText: res.statusText,
    };
  } catch (err: unknown) {
    result = {
      ...result,
      fetchError: err instanceof Error ? err.message : String(err),
    };
  }

  return Response.json(result);
}
