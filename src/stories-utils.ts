import manifest from '../custom-elements.json';

/**
 * Pulls a component's class-level JSDoc description out of the generated Custom Elements
 * Manifest, so each story's docs page description is sourced from the same `@slot`/`@part`
 * JSDoc comment as the props table, instead of being duplicated by hand in the story file.
 */
export function componentDescription(tagName: string): string {
  for (const mod of manifest.modules) {
    const decl = mod.declarations?.find((d: { tagName?: string }) => d.tagName === tagName);
    if (decl && 'description' in decl) {
      return (decl as { description: string }).description;
    }
  }
  return '';
}

/** Same idea as componentDescription, but for one @Prop's own JSDoc comment (attribute-level). */
export function propDescription(tagName: string, propName: string): string {
  for (const mod of manifest.modules) {
    const decl = mod.declarations?.find((d: { tagName?: string }) => d.tagName === tagName) as
      | { attributes?: { name: string; description?: string }[] }
      | undefined;
    const attr = decl?.attributes?.find(a => a.name === propName);
    if (attr?.description) return attr.description;
  }
  return '';
}
