export function idToCode(id: string) {
  return id.replace(/-/g, "/");
}
export function codeToId(code: string) {
  return code.replace(/\//g, "-");
}
