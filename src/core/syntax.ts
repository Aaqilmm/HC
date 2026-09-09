import type { Language } from "./types.js";

export type TokenKind = "id" | "number" | "string" | "comment" | "op" | "punct" | "ws" | "newline";

export interface Token {
  kind: TokenKind;
  text: string;
  start: number;
  end: number;
  line: number;
  depth: number;
}

const multiOps = [
  ">>>=", "===", "!==", "**=", "&&=", "||=", "??=", "<<=", ">>=", "->*", "...",
  "==", "!=", "<=", ">=", "++", "--", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=",
  "&&", "||", "<<", ">>", "->", "::", "=>", "**", "//", "??", "?."
];

function isIdStart(ch: string): boolean { return /[A-Za-z_$]/.test(ch); }
function isIdPart(ch: string): boolean { return /[A-Za-z0-9_$]/.test(ch); }

export function tokenize(code: string, language: Language, keepWhitespace = true): Token[] {
  const out: Token[] = [];
  let i = 0, line = 1, depth = 0;
  let quote = "";

  const push = (kind: TokenKind, start: number, end: number, text = code.slice(start, end), d = depth) => {
    if (keepWhitespace || (kind !== "ws" && kind !== "newline" && kind !== "comment")) {
      out.push({ kind, text, start, end, line, depth: d });
    }
  };

  while (i < code.length) {
    const start = i, ch = code[i], next = code[i + 1] ?? "";
    if (ch === "\n") { push("newline", i, i + 1); i++; line++; continue; }
    if (ch === " " || ch === "\t" || ch === "\r") {
      while (i < code.length && /[ \t\r]/.test(code[i])) i++;
      push("ws", start, i); continue;
    }

    const hashComment = language === "python" && ch === "#";
    const slashComment = (language !== "python") && ch === "/" && next === "/";
    const blockComment = ch === "/" && next === "*";
    if (hashComment || slashComment) {
      i += hashComment ? 1 : 2;
      while (i < code.length && code[i] !== "\n") i++;
      push("comment", start, i); continue;
    }
    if (blockComment) {
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) { if (code[i] === "\n") line++; i++; }
      if (i < code.length) i += 2;
      push("comment", start, i); continue;
    }

    if (ch === '"' || ch === "'" || (ch === "`" && (language === "javascript" || language === "typescript"))) {
      quote = ch; i++;
      let escaped = false;
      while (i < code.length) {
        const c = code[i++];
        if (c === "\n") line++;
        if (escaped) { escaped = false; continue; }
        if (c === "\\") { escaped = true; continue; }
        if (c === quote) break;
      }
      push("string", start, i); quote = ""; continue;
    }

    if (isIdStart(ch)) { i++; while (i < code.length && isIdPart(code[i])) i++; push("id", start, i); continue; }
    if (/\d/.test(ch)) { i++; while (i < code.length && /[A-Za-z0-9_.]/.test(code[i])) i++; push("number", start, i); continue; }

    let op = "";
    for (const candidate of multiOps) if (code.startsWith(candidate, i)) { op = candidate; break; }
    if (op) { i += op.length; push("op", start, i); continue; }
    if ("=+-*/%<>!&|^~?:".includes(ch)) { i++; push("op", start, i); continue; }

    i++;
    const d = depth;
    if (ch === "{" || ch === "(" || ch === "[") { push("punct", start, i, ch, depth); depth++; }
    else if (ch === "}" || ch === ")" || ch === "]") { depth = Math.max(0, depth - 1); push("punct", start, i, ch, depth); }
    else push("punct", start, i, ch, d);
  }
  return out;
}

export function codeWithoutComments(code: string, language: Language): string {
  return tokenize(code, language).map(t => t.kind === "comment" ? " ".repeat(t.text.length) : t.text).join("");
}

export function replaceRanges(code: string, replacements: Array<{start:number; end:number; text:string}>): string {
  const sorted = [...replacements].sort((a,b) => b.start-a.start);
  let out = code;
  for (const r of sorted) out = out.slice(0,r.start)+r.text+out.slice(r.end);
  return out;
}

export function matchingBrace(code: string, open: number): number {
  const openCh = code[open], closeCh = openCh === "{" ? "}" : openCh === "(" ? ")" : "]";
  let depth = 0;
  for (let i=open;i<code.length;i++) {
    const c=code[i];
    if (c === '"' || c === "'" || c === "`") {
      const q=c; i++;
      while(i<code.length){ if(code[i]==="\\") {i+=2; continue;} if(code[i]===q) break; i++; }
      continue;
    }
    if(c===openCh) depth++; else if(c===closeCh && --depth===0) return i;
  }
  return -1;
}

export function lineCount(text: string): number { return text.length ? text.split("\n").length : 0; }
