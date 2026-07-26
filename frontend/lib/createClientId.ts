export function createClientId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
