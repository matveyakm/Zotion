export function parseLinkAttributes(href) {
    const colorMatch = href.match(/\/\/color=#([0-9a-fA-F]{6})/);
    if (colorMatch) return { legacyColor: colorMatch[1] };
  
    const styleMatch = href.match(/#([0-9a-fA-F.]+)#/);
    if (!styleMatch) return null;
  
    const attributes = styleMatch[1].split('.');
    return { attributes };
  }
  