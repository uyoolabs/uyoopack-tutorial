/** 규칙이 거절한 이유. 주소의 `?error=` 로 온다. 색만으로 말하지 않고 문장이 선다(명세 CON-5). */
export function Notice({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mb-4 rounded-control border border-warn-line bg-warn-soft px-4 py-3 text-sm font-medium text-warn">
      {message}
    </p>
  );
}

export async function errorOf(searchParams: Promise<{ error?: string }>): Promise<string | undefined> {
  const { error } = await searchParams;
  return error;
}
