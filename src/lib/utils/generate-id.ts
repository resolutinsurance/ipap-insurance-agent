import ShortUniqueId from "short-unique-id";

export enum Dictionary {
  Alpha = "alpha",
  AlphaLower = "alpha_lower",
  AlphaUpper = "alpha_upper",
  Alphanum = "alphanum",
  AlphanumLower = "alphanum_lower",
  AlphanumUpper = "alphanum_upper",
  Hex = "hex",
}

export const uuid = new ShortUniqueId({
  length: 6,
  dictionary: Dictionary.AlphanumUpper,
});

export function randomUUID(options: { length: number; dictionary?: Dictionary }) {
  const id = new ShortUniqueId(options);
  return id.rnd();
}
