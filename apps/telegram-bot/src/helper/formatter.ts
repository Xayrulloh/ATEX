export function format(id: string, name: string, description: string) {
  return `Id: <code>${id}</code>\nName: ${name}\n\n<blockquote>${description}</blockquote>`;
}
