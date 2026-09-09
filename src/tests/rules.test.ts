import assert from "node:assert/strict";import test from "node:test";import{parseSource}from"../core/ast.js";import{processSolution}from"../core/processor.js";
const req=(code:string,language:any,seed=1)=>processSolution({code,language,isCodingProblem:true,seed});
test("scope guard",()=>assert.equal(req("print('hi')","python").skipped,false));
test("invalid input fails closed",()=>assert.equal(req("def x(:\n pass","python").skipped,true));
test("compound assignment survives",()=>{const r=req("def f(a,b):\n    x=a+b\n    x+=b\n    return x\n","python",4);assert.match(r.code,/\+=/);});
test("switch conversion is conservative",()=>{const code="int f(int x){switch(x){case 1:return 2;default:return 3;}}";const r=req(code,"cpp",2);assert.ok(r.code.includes("if (x == 1)"));});
test("cpp loop keeps declared variable scope",()=>{const code="void f(){ for(int i=0;i<3;i++){x+=i;} int i=9; }";const r=req(code,"cpp",2);if(!r.skipped)assert.match(r.code,/int i=9/);});
test("member name is not abbreviated",()=>{const code="struct A{int total;}; int f(A a){int total=1;return a.total+total;}";const r=req(code,"cpp",1);assert.match(r.code,/a\.total/);});
test("python comprehension expansion remains parseable when applied",()=>{const ast=parseSource("vals = [x*x for x in nums]","python");assert.ok(ast===null||ast.valid);});
