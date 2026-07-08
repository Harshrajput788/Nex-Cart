export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")            
    .replace(/[^a-z0-9]+/g, "-")     
    .replace(/^-+|-+$/g, "");        
};