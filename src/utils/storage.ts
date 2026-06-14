// 安全解析 localStorage/sessionStorage 的 JSON 数据，避免数据损坏导致崩溃
export function safeGet<T>(key: string, fallback: T, source: Storage = localStorage): T {
  try {
    const raw = source.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
