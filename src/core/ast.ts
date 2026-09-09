import { createRequire } from "node:module";
import type { Language } from "./types.js";

export interface AstAnalysis { language:Language; source:string; tree:any; root:any; valid:boolean; errorCount:number; }
const require=createRequire(import.meta.url);
function grammarFor(language:Language):any{switch(language){case "cpp":return require("tree-sitter-cpp");case "java":return require("tree-sitter-java");case "python":return require("tree-sitter-python");case "javascript":case "typescript":return require("tree-sitter-javascript");default:return null;}}
function unwrap(m:any){return m?.default??m;}
function countErrors(n:any):number{let c=n?.isError?1:0;for(const x of n?.namedChildren??[])c+=countErrors(x);return c;}
export function parseSource(source:string,language:Language):AstAnalysis|null{try{const g=grammarFor(language);if(!g)return null;const Parser=unwrap(require("tree-sitter"));const p=new Parser();p.setLanguage(unwrap(g));const tree=p.parse(source);const root=tree.rootNode;const errorCount=countErrors(root);return{language,source,tree,root,valid:errorCount===0,errorCount};}catch{return null;}}
export function walk(root:any):any[]{const out:any[]=[];const go=(n:any)=>{out.push(n);for(const c of n.namedChildren??[])go(c);};go(root);return out;}
export function nodesOfType(ast:AstAnalysis,...types:string[]):any[]{const s=new Set(types);return walk(ast.root).filter(n=>s.has(n.type));}
export function identifiers(ast:AstAnalysis):any[]{return nodesOfType(ast,"identifier","property_identifier","field_identifier");}
export function text(ast:AstAnalysis,node:any):string{return ast.source.slice(node.startIndex,node.endIndex);}
export function field(node:any,name:string):any{return node?.childForFieldName?.(name)??null;}
export function namedChildren(node:any):any[]{return node?.namedChildren??[];}
export function ancestors(node:any):any[]{const out:any[]=[];for(let p=node?.parent;p;p=p.parent)out.push(p);return out;}
export function hasAncestor(node:any,types:string[]):boolean{const s=new Set(types);for(let p=node?.parent;p;p=p.parent)if(s.has(p.type))return true;return false;}
export function nodeContainsType(node:any,types:string[]):boolean{const s=new Set(types);const go=(n:any):boolean=>{if(s.has(n.type))return true;for(const c of n.namedChildren??[])if(go(c))return true;return false;};return go(node);}
export function nodeAt(root:any,start:number,end:number):any{let best:any=null;const go=(n:any)=>{if(n.startIndex<=start&&n.endIndex>=end){best=n;for(const c of n.namedChildren??[])go(c);}};go(root);return best;}
