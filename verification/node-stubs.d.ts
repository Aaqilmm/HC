declare module "node:module" { export function createRequire(url:string): any; }
declare module "node:assert/strict" { const x:any; export default x; export = x; }
declare module "node:test" { const x:any; export default x; }
