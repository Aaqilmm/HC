import type { Language } from "./types.js";
import { codeWithoutComments } from "./syntax.js";

export function isIdentifierStart(ch: string): boolean { return /[A-Za-z_$]/.test(ch); }
export function isIdentifierPart(ch: string): boolean { return /[A-Za-z0-9_$]/.test(ch); }
export function maskStringsAndComments(code: string, language: Language): string { return codeWithoutComments(code, language); }
export function hasExplicitConstraint(constraints: string[], pattern: RegExp): boolean { return constraints.some(item => pattern.test(item)); }
export function randomChance(min: number, max: number, rng: () => number = Math.random): boolean { return rng() < min + rng() * (max - min); }
export function choose<T>(items: T[], rng: () => number = Math.random): T { return items[Math.floor(rng() * items.length)]; }
