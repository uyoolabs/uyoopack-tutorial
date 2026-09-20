/** 규칙이 거절한 이유. 주소의 `?error=` 로 온다. */
export function Notice({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
      {message}
    </p>
  );
}

export async function errorOf(searchParams: Promise<{ error?: string }>): Promise<string | undefined> {
  const { error } = await searchParams;
  return error;
}
