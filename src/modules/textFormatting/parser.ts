// parser.ts

type LinkAttributes =
  { attributes: string[] } | null;

export function parseLinkAttributes(href: string): LinkAttributes {

  const styleMatch = href.match(/#([0-9a-fA-F.]+)#/);
  if (!styleMatch) return null;

  const attributes = styleMatch[1].split('.');
  return { attributes };
}
