export const capitalize = (text: string) => {
  return text.length > 1
    ? text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    : text.toUpperCase();
};

export const asBoolean = (booleanLike: string) => booleanLike.trim().toLowerCase() === 'true';
