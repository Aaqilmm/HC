export type Language = "cpp" | "python" | "java" | "javascript" | "typescript" | "unknown";
export interface ProcessRequest { code:string; language:Language; isCodingProblem:boolean; userConstraints?:string[]; seed?:number; }
export interface ProcessResult { code:string; changed:boolean; appliedRules:string[]; skipped:boolean; reason?:string; }
export interface RuleContext { language:Language; userConstraints:string[]; rng?:()=>number; ast?:import("./ast.js").AstAnalysis; }
export interface Rule { id:string; name:string; apply(code:string, context:RuleContext):string; }
