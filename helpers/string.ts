export function getExtension(path: string) {
  const basename = path.split(/[\\/]/).pop();
  if (basename == null || basename === '') return '';
  const pos = basename.lastIndexOf('.');
  if (pos < 1) return '';
  return basename.slice(pos + 1); // extract extension ignoring `.`
}
