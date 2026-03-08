// parser.ts

type LinkAttributes = { attributes: string[] } | null;

// Парсит атрибуты из href ссылки, если они есть, и возвращает объект с массивом атрибутов. Если атрибутов нет, возвращает null.
export function parseLinkAttributes(href: string): LinkAttributes {
  const styleMatch = href.match(/#([0-9a-fA-F.]+)#/);
  if (!styleMatch) return null;

  const attributes = styleMatch[1].split('.');
  return { attributes };
}
