/*
 * JSON Programming Language
 * EXEC JS
 * Victor G. Brusca 
 * Created on 02/03/2022 1:57 PM EDT
 * Licensed under GNU General Public License v3.0
 */
var code = {
   "sys": "class",
   "name": "test",
   "access": "public",
   "call": {"sys": "call", "name": "testProcedure", "args": []},
   "vars": [
      {
         "sys": "init",
         "name": "tmp1",
         "val": {
            "sys": "val",
            "type": "int",
            "v": 0
         },
         "access": "public"
      },
      {
         "sys": "decl",
         "name": "tmp2",
         "val": {
            "sys": "val",
            "type": "bool",
            "v": false
         },
         "access": "public"
      }
   ],
   "procs": [
      {
         "sys": "proc",
         "name": "testProcedure",
         "access": "public",
         "args": [
            {
               "sys": "arg",
               "name": "i1",
               "val": {
                  "sys": "val",
                  "type": "int",
                  "v": 0
               }
            }
         ],
         "vars": [
            {
               "sys": "decl",
               "name": "b1",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": false
               }
            }
         ],
         "ret": {
            "sys": "ret",
            "name": "r1",
            "val": {
               "sys": "val",
               "type": "bool",
               "v": false
            }
         },
         "lines": [
            {
               "sys": "asgn",
               "left": "$this.tmp1",
               "op": "=",
               "right": "$i1"
            },
            {
               "sys": "asgn",
               "left": "$this.tmp1",
               "op": "=",
               "right": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 25}}
            },
            {
               "sys": "asgn",
               "left": "$i1",
               "op": "=",
               "right": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 25}}
            },
            {
               "sys": "asgn",
               "left": "$b1",
               "op": "=",
               "right": {"sys": "bex", "left": "$this.tmp1", "op": "==", "right": "$i1"}
            },
            {
               "sys": "asgn",
               "left": "$b1",
               "op": "=",
               "right": {"sys": "bex", "left": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 25}}, "op": "==", "right": "$i1"}
            },
            {
               "sys": "for",
               "start": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 0}},
               "stop": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 10}},
               "inc": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 1}},
               "for_lines": [
                  {"sys": "fcall", "name": "print", "arg": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "string", "v": "test"}}},
                  {"sys": "fcall", "name": "int2str", "arg": "$LOOP_VAR_0"}
               ]
            },
            {
               "sys": "if",
               "left": "$b1",
               "op": "==",
               "right": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "bool", "v": true}},
               "if_lines": [
                  {
                     "sys": "asgn",
                     "left": "$i1",
                     "op": "=",
                     "right": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 40}}
                  }
               ],
               "else_lines": [
                  {
                     "sys": "asgn",
                     "left": "$i1",
                     "op": "=",
                     "right": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 41}}
                  }
               ]
            },
            {
               "sys": "if",
               "left": "$b1",
               "op": "!=",
               "right": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "bool", "v": true}},
               "if_lines": [
                  {
                     "sys": "asgn",
                     "left": "$i1",
                     "op": "=",
                     "right": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 42}}
                  }
               ],
               "else_lines": [
                  {
                     "sys": "asgn",
                     "left": "$i1",
                     "op": "=",
                     "right": {"sys": "decl", "name": "const", "val": {"sys": "val", "type": "int", "v": 43}}
                  }
               ]
            }
         ]
      }
   ],
   "funcs": [      
   ],
   "ret": {      
   }
};

var prog = code;
var grammar = {};

//GRAMMAR
grammar.class_required = ["sys", "name", "access", "vars"];
grammar.class_optional = ["procs", "call"];

grammar.class_vars = ["init", "decl"];
grammar.class_vars_required = ["sys", "name", "val", "access"];
grammar.class_vars_optional = [];

grammar.class_procs = ["proc"];
grammar.class_procs_required = ["sys", "name", "access", "lines"];
grammar.class_procs_optional = [];

grammar.class_procs_args = ["arg"];
grammar.class_procs_args_required = ["sys", "name", "val"];
grammar.class_procs_args_optional = ["v"];

grammar.class_procs_vars = ["init", "decl"];
grammar.class_procs_vars_required = ["sys", "name", "val"];
grammar.class_procs_vars_optional = [];

grammar.class_procs_ret = ["ret"];
grammar.class_procs_ret_required = ["sys", "name", "val"];
grammar.class_procs_ret_optional = [];

grammar.asgn_required = ["sys", "left", "op", "right"];
grammar.asgn_optional = [];

grammar.if_required = ["sys", "left", "op", "right", "if_lines"];
grammar.if_optional = ["else_lines"];

grammar.for_required = ["sys", "start", "stop", "inc", "for_lines"];
grammar.for_optional = [];

grammar.val_required = ["sys", "type", "v"];
grammar.val_optional = [];

grammar.ret_required = ["sys", "val"];
grammar.ret_optional = [];

grammar.call_required = ["sys", "name", "args"];
grammar.call_optional = [];

grammar.fcall_required = ["sys", "name", "arg"];
grammar.fcall_optional = [];

grammar.args_required = ["sys", "name", "val"];
grammar.args_optional = ["v"];

grammar.func_required = ["sys", "name"];
grammar.func_optional = ["arg", "ret"];

grammar.var_required = ["sys", "name", "val"];
grammar.var_optional = ["access"];

//LINES
grammar.class_procs_lines = ["asgn", "if", "for", "call", "fcall"];
grammar.class_procs_if_lines = ["asgn", "if", "for", "call", "fcall"];
grammar.class_procs_else_lines = ["asgn", "if", "for", "call", "fcall"];
grammar.class_procs_for_lines = ["asgn", "if", "for", "call", "fcall"];

//OPS
grammar.op_asgn_init = ["="];
grammar.op_bex = ["==", "!=", "<", "<=", ">", ">=", "&&", "||"];
grammar.op_exp = ["+", "-", "/", "*"];

//TYPES
grammar.type_base = ["float", "int", "bool", "string"];

var functions = [];
functions.push({
   "sys": "func",
   "name": "print",
   "arg": {
      "sys": "arg",
      "name": "s",
      "val": {
         "sys": "val",
         "type": "string",
         "v": ""
      }
   },
   "ret": null   
});

functions.push({
   "sys": "func",
   "name": "int2str",
   "arg": {
      "sys": "arg",
      "name": "i",
      "val": {
         "sys": "val",
         "type": "int",
         "v": null
      }
   },
   "ret": {
      "sys": "ret",
      "name": "r1",
      "val": {
         "sys": "val",
         "type": "string",
         "v": null
      }
   }
});

var LOGGING = true;
var VAR_THIS = "$this.";
var VAR_NON_THIS = "$";
var WR_PREFIX = "";
var PRINT_LINE_OBJ = false;

//UTIL FUNCTIONS
function wr(s) {
   if (LOGGING === true) {
      console.log(WR_PREFIX + s);
   }
}

function isObject(arg) {
   if(arg === null) {
      return false;
   } else if(typeof arg === "object" || typeof arg === 'function') {
      return true;
   } else {
      return false;
   }
}

function isArray(arg) {
   if (arg === null) {
      return false;
   } else {
      return Array.isArray(arg);
   }
}

function isString(arg) {
   if (arg === null) {
      return false;
   } else if (typeof arg === 'string' || arg instanceof String) {
      return true;
   } else {
      return false;
   }
}

function isSysObjIf(obj) {
   if (isSysObj(obj) === true && obj.sys === "if") {
      return true;
   } else {
      return false;
   }
}

function isSysObjBex(obj) {
   if (isSysObj(obj) === true && obj.sys === "bex") {
      return true;
   } else {
      return false;
   }
}

function isSysObjExp(obj) {
   if (isSysObj(obj) === true && obj.sys === "exp") {
      return true;
   } else {
      return false;
   }
}

function isSysObjVal(obj) {
   if (isSysObj(obj) === true && obj.sys === "val") {
      return true;
   } else {
      return false;
   }
}

function isSysObjAsgn(obj) {
   if (isSysObj(obj) === true && obj.sys === "asgn") {
      return true;
   } else {
      return false;
   }
}

function isSysObjDecl(obj) {
   if (isSysObj(obj) === true && obj.sys === "decl") {
      return true;
   } else {
      return false;
   }
}

function isSysObjInit(obj) {
   if (isSysObj(obj) === true && obj.sys === "init") {
      return true;
   } else {
      return false;
   }
}

function isSysObjProcCall(obj) {
   if (isSysObj(obj) === true && obj.sys === "call") {
      return true;
   } else {
      return false;
   }
}

function isSysObjFuncCall(obj) {
   if (isSysObj(obj) === true && obj.sys === "fcall") {
      return true;
   } else {
      return false;
   }
}

function isSysObjFunc(obj) {
   if (isSysObj(obj) === true && obj.sys === "func") {
      return true;
   } else {
      return false;
   }
}

function isSysObjProc(obj) {
   if (isSysObj(obj) === true && obj.sys === "proc") {
      return true;
   } else {
      return false;
   }
}

function isSysObjFor(obj) {
   if (isSysObj(obj) === true && obj.sys === "for") {
      return true;
   } else {
      return false;
   }
}

function isSysObjConst(obj) {
   if (isSysObj(obj) === true && obj.sys === "decl" && obj.name === "const") {
      return true;
   } else {
      return false;
   }
}

function isSysObj(obj) {
   if (obj !== null && obj.hasOwnProperty("sys") === true && isObject(obj) === true) {
      return true;
   } else {
      return false;
   }
}

function getSysObjType(obj) {
   if (isSysObj(obj) === true) {
      return obj.sys;
   } else {
      return null;
   }
}

function isVarString(str) {
   if (str !== null && str.indexOf(VAR_NON_THIS) !== -1) {
      return true;
   } else {
      return false;
   }
}

function isVarThis(str) {
   if (str !== null && str.indexOf(VAR_THIS) !== -1) {
      return true;
   } else {
      return false;
   }
}

function idxVarThis(str) {
   return str.indexOf(VAR_THIS);
}

function isVarNonThis(str) {
   if (str.indexOf(VAR_NON_THIS) !== -1) {
      return true;
   } else {
      return false;
   }
}

function idxVarNonThis(str) {
   return str.indexOf(VAR_NON_THIS);
}


//EXECUTION METHODS
function executeProgram(prog) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";

   wr("executeProgram: Executing program...");   
   if (!validateGrammarClass(prog)) {
      wr("executeProgram: Error: validating class grammar");
      return false;
   }

   if (!validateGrammarClassVars(prog)) {
      wr("executeProgram: Error: validating class variables");
      return false;
   }

   if (!validateGrammarClassProcs(prog)) {
      wr("executeProgram: Error: validating class procedures");
      return false;
   }

   wr("executeProgram: Name: " + prog.name);
   if (prog !== null && prog.hasOwnProperty("call") === true && prog.call !== null && (isSysObjProcCall(prog.call) === true || isSysObjFuncCall(prog.call) === true)) {
      var callName = prog.call.name;
      var callArgs = prog.call.args;
      
      //TODO: Add support to branch and handle func calls
      var progProc = findProc(prog, callName);

      if (progProc !== null) {
         var progProcLines = progProc.lines;
   
         var progProcLine = null;
         var objType = null;
         var res = false;
         for (var i = 0; i < progProcLines.length; i++) {
            progProcLine = progProcLines[i];
            objType = getSysObjType(progProcLine);
            
            wr("");
            wr("Line Start: " + i + ":================================================================");
            //line processing
            if (objType === "asgn") {
               res = executeProcedureLineAsgn(progProcLine, callName, callArgs, prog, progProc, i);

            } else if (objType === "if") {
               res = executeProcedureLineIf(progProcLine, callName, callArgs, prog, progProc, i);

            } else if (objType === "for") {
               res = executeProcedureLineFor(progProcLine, callName, callArgs, prog, progProc, i);

            } else if (objType === "fcall") {
               res = executeProcedureLineFuncCall(progProcLine, callName, callArgs, prog, progProc, i);
               
            } else if (objType === "call") {
               //TODO: Implement this
               res = executeProcedureLineProcCall(progProcLine, callName, callArgs, prog, progProc, i);               
               wr("executeProgram: Error: executeProcedureLineProcCall not implemented");
               return false;
               
            } else {
               wr("executeProgram: Error: unsupported line type: " + objType + " at line number: " + i);
               return false;
            }
            
            if(!res) {
               wr("executeProgram: Error: exception encountered on line: " + i);
               return false;
            }
            
            wr("Line Stop: " + i + ":================================================================");            
         }

         WR_PREFIX = prevPrefix;
         return true;
      } else {
         wr("executeProgram: Error: executing program missing CALL procedure in CLASS object");
         WR_PREFIX = prevPrefix;
         return false;
      }
      return true;
   } else {
      wr("executeProgram: Error: executing class no CALL procedure");
      WR_PREFIX = prevPrefix;
      return false;
   }
}

function executeProcedureLineForClause(procLine, callName, callArgs, prog, proc, lineNum) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";
   
   if (isSysObjFor(procLine) === true) {
      if (validateGrammarClassProcsForClause(procLine) === false) {
         wr("executeProcedureLineForClause: Error: can't validate FOR line number: " + lineNum + " with source: " + JSON.stringify(procLine));
         return false;
      }

      var forLines = procLine.for_lines;
      if (forLines !== null && forLines.length > 0) {
         var len = forLines.length;
         
         wr("executeProcedureLineForClause: line number: " + lineNum + " with clause lines count: " + forLines.length);
         
         var progProcLine = null;
         var objType = null;
         var res = false;         
         for (var i = 0; i < len; i++) {
            progProcLine = forLines[i];
            objType = getSysObjType(progProcLine);

            //line processing
            if (objType === "asgn") {
               res = executeProcedureLineAsgn(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "if") {
               res = executeProcedureLineIf(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "for") {
               res = executeProcedureLineFor(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "fcall") {
               res = executeProcedureLineFuncCall(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "call") {
               //TODO: Implement this
               res = executeProcedureLineProcCall(progProcLine, callName, callArgs, prog, proc, (lineNum + i));
               wr("executeProgram: Error: executeProcedureLineProcCall not implemented");
               return false;

            } else {
               wr("executeProcedureLineForClause: Error: unsupported line type: " + objType + " at line number: " + lineNum + " inner line: " + i);
               return false;
            }
            
            if(!res) {
               wr("executeProcedureLineForClause: Error: exception encountered  at line number: " + lineNum + " inner line: " + i);
               return false;
            }            
         }
         
         wr("executeProcedureLineForClause: Result: processed " + len + " lines");
         WR_PREFIX = prevPrefix;
         return true;
      } else {
         wr("executeProcedureLineForClause: Result: No lines found");
         WR_PREFIX = prevPrefix;
         return true;
      }      
   } else {
      wr("executeProcedureLineForClause: Error: This is not a FOR statement");
      WR_PREFIX = prevPrefix;
      return false;
   }
}

function executeProcedureLineIfClause(procLine, callName, callArgs, prog, proc, lineNum) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";
   
   if (isSysObjIf(procLine) === true) {
      if (validateGrammarClassProcsIfClause(procLine) === false) {
         wr("executeProcedureLineIfClause: Error: can't validate IF line number: " + lineNum + " with source: " + JSON.stringify(procLine));
         return false;
      }
      
      var ifLines = procLine.if_lines;
      if (ifLines !== null && ifLines.length > 0) {
         var len = ifLines.length;
       
         wr("executeProcedureLineIfClause: line number: " + lineNum + " with clause lines count: " + ifLines.length);         
         
         var progProcLine = null;
         var objType = null;
         var res = false;   
         
         wr("If Start: " + lineNum + "================================================================");         
         for (var i = 0; i < len; i++) {
            progProcLine = ifLines[i];
            objType = getSysObjType(progProcLine);

            //line processing
            if (objType === "asgn") {
               res = executeProcedureLineAsgn(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "if") {
               res = executeProcedureLineIf(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "for") {
               res = executeProcedureLineFor(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "fcall") {
               res = executeProcedureLineFuncCall(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "call") {
               //TODO: Implement this
               res = executeProcedureLineProcCall(progProcLine, callName, callArgs, prog, proc, (lineNum + i));
               wr("executeProgram: Error: executeProcedureLineProcCall not implemented");
               return false;

            } else {
               wr("executeProgram: Error: unsupported line type: " + objType + " at line number: " + (lineNum + i));
               return false;
            }
            
            if(!res) {
               wr("executeProgram: Error: exception encountered on line: " + i);
               return false;
            }
         }
         wr("If Stop: " + lineNum + "================================================================");         
         
         wr("executeProcedureLineIfClause: returning true");         
         WR_PREFIX = prevPrefix;
         return true;
      } else {
         wr("executeProcedureLineIfClause: Result: no lines found");
         WR_PREFIX = prevPrefix;
         return true;
      }
   } else {
      wr("executeProcedureLineIfClause: Error: this is not an IF object");
      WR_PREFIX = prevPrefix;
      return false;
   }
}

function executeProcedureLineElseClause(procLine, callName, callArgs, prog, proc, lineNum) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";

   if (isSysObjIf(procLine) === true) {
      if (validateGrammarClassProcsElseClause(procLine) === false) {
         wr("executeProcedureLineElseClause: Error: can't validate IF line number: " + lineNum + " with source: " + JSON.stringify(procLine));
         return false;
      }

      var elseLines = procLine.else_lines;
      if (elseLines !== null && elseLines.length > 0) {
         var len = elseLines.length;
         
         wr("executeProcedureLineElseClause: line number: " + lineNum + " with clause lines count: " + elseLines.length);         
         
         var progProcLine = null;
         var objType = null;
         var res = false;         

         wr("Else Start: " + lineNum + "================================================================");         
         for (var i = 0; i < len; i++) {
            var progProcLine = elseLines[i];
            var objType = getSysObjType(progProcLine);

            //line processing
            if (objType === "asgn") {
               res = executeProcedureLineAsgn(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "if") {
               res = executeProcedureLineIf(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "for") {
               res = executeProcedureLineFor(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "fcall") {
               res = executeProcedureLineFuncCall(progProcLine, callName, callArgs, prog, proc, (lineNum + i));

            } else if (objType === "call") {
               //TODO: Implement this
               res = executeProcedureLineProcCall(progProcLine, callName, callArgs, prog, proc, (lineNum + i));
               wr("executeProgram: Error: executeProcedureLineProcCall not implemented");
               return false;

            } else {
               wr("executeProcedureLineElseClause: Error: unsupported line type: " + objType + " at line number: " + lineNum + " inner line: " + i);
               return false;
            }
            
            if(!res) {
               wr("executeProgram: Error: exception encountered at line number: " + lineNum + " inner line: " + i);
               return false;
            }            
         }
         wr("Else Stop: " + lineNum + "================================================================");         
         
         WR_PREFIX = prevPrefix;
         return true;
      } else {
         wr("executeProcedureLineElseClause: Result:  no lines found");
         WR_PREFIX = prevPrefix;
         return true;
      }
   } else {
      wr("executeProcedureLineElseClause: Error: not an IF object");
      WR_PREFIX = prevPrefix;
      return false;
   }
}

function executeProcedureLineIf(procLine, callName, callArgs, prog, proc, lineNum) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";
   
   if (isSysObjIf(procLine) === true) {
      if (validateGrammarClassProcsIf(procLine) === false) {
         wr("executeProcedureLineIf: Error: can't validate IF line number: " + lineNum + " with source: " + JSON.stringify(procLine));
         return false;
      }
            
      if(PRINT_LINE_OBJ) {
         wr("executeProcedureLineIf: line number: " + lineNum + " with source: " + JSON.stringify(procLine));         
      } else {
         wr("executeProcedureLineIf: line number: " + lineNum);         
      }

      //handle if line
      var left = procLine.left;
      var op = procLine.op;
      var right = procLine.right;

      var leftVar = null;
      var leftVarType = null;
      var rightVar = null;
      var rightVarType = null;

      //left arg
      if (isSysObj(left) === true) {
         if (isSysObjBex(right) === true) {
            leftVar = processBexObject(left, prog, proc);
         } else if (isSysObjExp(right) === true) {
            //TODO: Implement this
            leftVar = processExpObject(left, prog, proc);
            wr("executeProcedureLineAsgn: Error: processExpObject not implemented yet");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(left) === true) {
            leftVar = left;
         } else {         
            wr("executeProcedureLineAsgn: Error: left value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         }
      } else if (isVarString(left) === true) {
         leftVar = processVarString(left, prog, proc);
      } else {
         wr("executeProcedureLineAsgn: Error: left value unsupported");
         WR_PREFIX = prevPrefix;
         return false;
      }
      leftVarType = leftVar.sys;     
     
     
      //right arg
      if (isSysObj(right) === true) {
         if (isSysObjBex(right) === true) {
            rightVar = processBexObject(right, prog, proc);
         } else if (isSysObjExp(right) === true) {
            //TODO: Implement this
            rightVar = processExpObject(right, prog, proc);
            wr("executeProcedureLineAsgn: Error: right value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(right) === true) {
            rightVar = right;
         } else {         
            wr("executeProcedureLineAsgn: Error: right value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         }
      } else if (isVarString(right) === true) {
         rightVar = processVarString(right, prog, proc);
      } else {
         wr("executeProcedureLineAsgn: Error: right value must be a $VAR");
         WR_PREFIX = prevPrefix;
         return false;
      }
      rightVarType = rightVar.sys;     
     
      if (rightVar === null) {
         wr("executeProcedureLineIf: Error: right value of assignment statement is null");
         return false;

      } else if (leftVar === null) {
         wr("executeProcedureLineIf: Error: left value of assignment statement is null");
         return false;

      } else if (validateOpBex(op) === false) {
         wr("executeProcedureLineIf: Error: operator is not a valid BEX operator, '" + op + "'");
         return false;

      } else if (rightVar.val === null) {
         wr("executeProcedureLineIf: Error: the right val is null.");
         return false;

      } else if (leftVar.val === null) {
         wr("executeProcedureLineIf: Error: the left val is null.");
         return false;

      } else if (rightVar.val.v === null) {
         wr("executeProcedureLineIf: Error: the right value has not been assigned to and is null.");
         return false;

      } else if (leftVar.val.type.trim() !== rightVar.val.type.trim()) {
         wr("executeProcedureLineIf: Error: right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
         return false;
      }
      
      var res = false;
      if (op === "==") {
         if (leftVar.val.v === rightVar.val.v) {
            wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' = '" + rightVar.name + "', values: " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineIfClause(procLine, callName, callArgs, prog, proc, lineNum);
         } else {
            wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' = '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineElseClause(procLine, callName, callArgs, prog, proc, lineNum);
         }

      } else if (op === "!=") {
         if (leftVar.val.v !== rightVar.val.v) {
            wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' != '" + rightVar.name + "', values " + leftVar.val.v + " != " + rightVar.val.v);
            res = executeProcedureLineIfClause(procLine, callName, callArgs, prog, proc, lineNum);
         } else {
            wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' != '" + rightVar.name + "', values " + leftVar.val.v + " != " + rightVar.val.v);
            res = executeProcedureLineElseClause(procLine, callName, callArgs, prog, proc, lineNum);
         }

      } else if (op === "<=") {
         if (leftVar.val.v <= rightVar.val.v) {
            wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' <= '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineIfClause(procLine, callName, callArgs, prog, proc, lineNum);
         } else {
            wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' <= '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineElseClause(procLine, callName, callArgs, prog, proc, lineNum);
         }

      } else if (op === ">=") {
         if (leftVar.val.v >= rightVar.val.v) {
            wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' >= '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineIfClause(procLine, callName, callArgs, prog, proc, lineNum);
         } else {
            wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' >= '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineElseClause(procLine, callName, callArgs, prog, proc, lineNum);
         }

      } else if (op === "<") {
         if (leftVar.val.v < rightVar.val.v) {
            wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' < '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineIfClause(procLine, callName, callArgs, prog, proc, lineNum);
         } else {
            wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' < '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineElseClause(procLine, callName, callArgs, prog, proc, lineNum);
         }

      } else if (op === ">") {
         if (leftVar.val.v > rightVar.val.v) {
            wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' > '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineIfClause(procLine, callName, callArgs, prog, proc, lineNum);
         } else {
            wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' > '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
            res = executeProcedureLineElseClause(procLine, callName, callArgs, prog, proc, lineNum);
         }

      } else {
         wr("executeProcedureLineIf: Error: unknown boolean operand");
         return false;
      }
      
      wr("executeProcedureLineIf: returning true");
      WR_PREFIX = prevPrefix;
      return true;
   } else {
      wr("executeProcedureLineIf: Error: not an IF object");
      WR_PREFIX = prevPrefix;
      return false;
   }
}

function executeProcedureLineAsgn(procLine, callName, callArgs, prog, proc, lineNum) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";
   
   if (isSysObjAsgn(procLine) === true) {
      if (validateGrammarClassProcsAsgn(procLine) === false) {
         wr("executeProcedureLineAsgn: Error: can't validate IF line number: " + lineNum + " with source: " + JSON.stringify(procLine));
         WR_PREFIX = prevPrefix;
         return false;
      }

      if(PRINT_LINE_OBJ) {
         wr("executeProcedureLineAsgn: line number: " + lineNum + " with source: " + JSON.stringify(procLine));
      } else {
         wr("executeProcedureLineAsgn: line number: " + lineNum);         
      }
      
      //handle assignment line
      var left = procLine.left;
      var op = procLine.op;
      var right = procLine.right;

      var leftVar = null;
      var leftVarType = null;
      var rightVar = null;
      var rightVarType = null;

      //left arg
      if (isSysObj(left) === true) {
         if (isSysObjBex(left) === true) {
            leftVar = processBexObject(left, prog, proc);
         } else if (isSysObjExp(left) === true) {
            //TODO: Implement this
            leftVar = processExpObject(left, prog, proc);
            wr("executeProcedureLineAsgn: Error: processExpObject not implemented yet");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(left) === true) {
            leftVar = left;
         } else {
            wr("executeProcedureLineAsgn: Error: left value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         }
      } else if (isVarString(left) === true) {
         leftVar = processVarString(left, prog, proc);
      } else {
         wr("executeProcedureLineAsgn: Error: left value unsupported");
         WR_PREFIX = prevPrefix;
         return false;
      }
      leftVarType = leftVar.sys;

      //right arg
      if (isSysObj(right) === true) {
         if (isSysObjBex(right) === true) {
            rightVar = processBexObject(right, prog, proc);
         } else if (isSysObjExp(right) === true) {
            //TODO: Implement this
            rightVar = processExpObject(right, prog, proc);
            wr("executeProcedureLineAsgn: Error: right value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(right) === true) {
            rightVar = right;
         } else {         
            wr("executeProcedureLineAsgn: Error: right value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         }
      } else if (isVarString(right) === true) {
         rightVar = processVarString(right, prog, proc);
      } else {
         wr("executeProcedureLineAsgn: Error: right value unsupported");
         WR_PREFIX = prevPrefix;
         return false;
      }
      rightVarType = rightVar.sys;

      if (rightVar === null) {
         wr("executeProcedureLineAsgn: Error: right value of assignment statement is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (leftVar === null) {
         wr("executeProcedureLineAsgn: Error: left value of assignment statement is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (validateOpAsgnInit(op) === false) {
         wr("executeProcedureLineAsgn: Error: operator is not valid, '" + op + "'");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (rightVar.val === null) {
         wr("executeProcedureLineAsgn: Error: the right val is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (leftVar.val === null) {
         wr("executeProcedureLineAsgn: Error: the left val is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (rightVar.val.v === null) {
         wr("executeProcedureLineAsgn: Error: the right value has not been assigned to and is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (leftVar.val.type.trim() !== rightVar.val.type.trim()) {
         wr("executeProcedureLineAsgn: Error: right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
         WR_PREFIX = prevPrefix;
         return false;
      }

      if (op === "=") {
         wr("executeProcedureLineAsgn: Notice: setting '" + leftVar.name + "' to the value of '" + rightVar.name + "', values: " + leftVar.val.v + ", " + rightVar.val.v);
         leftVar.val.v = rightVar.val.v;
      } else {
         wr("executeProcedureLineAsgn: Error: unknown operand");
         WR_PREFIX = prevPrefix;
         return false;
      }

      WR_PREFIX = prevPrefix;
      return true;
   } else {
      wr("executeProcedureLineAsgn: Error: not an ASGN object");
      WR_PREFIX = prevPrefix;
      return false;
   }
}

function executeProcedureLineFor(procLine, callName, callArgs, prog, proc, lineNum) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";
   
   if (isSysObjFor(procLine) === true) {
      if (validateGrammarClassProcsFor(procLine) === false) {
         wr("executeProcedureLineFor: Error: can't validate FOR line number: " + lineNum + " with source: " + JSON.stringify(procLine));
         WR_PREFIX = prevPrefix;
         return false;
      }

      if(PRINT_LINE_OBJ) {
         wr("executeProcedureLineFor: line number: " + lineNum + " with source: " + JSON.stringify(procLine));
      } else {
         wr("executeProcedureLineFor: line number: " + lineNum);
      }
      
      //handle for line
      var start = procLine.start;
      var stop = procLine.stop;
      var inc = procLine.inc;

      var startVar = null;
      var startVarType = null;
      var stopVar = null;
      var stopVarType = null;
      var incVar = null;
      var incVarType = null;

      //start arg
      if (isSysObj(start) === true) {
         if (isSysObjBex(start) === true) {
            //error
            wr("executeProcedureLineFor: Error: start value cannot be a BEX object");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjExp(start) === true) {
            //TODO: implement this
            wr("executeProcedureLineFor: Error: start value cannot be an EXP object yet");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(start) === true) {
            startVar = start;
         } else {
            wr("executeProcedureLineAsgn: Error: start value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         }
      } else if (isVarString(start) === true) {
         startVar = processVarString(start, prog, proc);
      } else {
         wr("executeProcedureLineFor: Error: start value must be a $VAR");
         WR_PREFIX = prevPrefix;
         return false;
      }
      startVarType = startVar.sys;

      //stop arg
      if (isSysObj(stop) === true) {
         if (isSysObjBex(stop) === true) {
            //error
            wr("executeProcedureLineFor: Error: stop value cannot be a BEX object");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjExp(stop) === true) {
            //TODO: implement this
            wr("executeProcedureLineFor: Error: stop value cannot be an EXP object");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(stop) === true) {
            stopVar = stop;
         } else {
            wr("executeProcedureLineAsgn: Error: stop value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         }
      } else if (isVarString(stop) === true) {
         stopVar = processVarString(stop, prog, proc);
      } else {
         wr("executeProcedureLineFor: Error: stop value must be a $VAR");
         WR_PREFIX = prevPrefix;
         return false;
      }
      stopVarType = stopVar.sys;

      //inc arg
      if (isSysObj(inc) === true) {
         if (isSysObjBex(inc) === true) {
            //error
            wr("executeProcedureLineFor: Error: inc value cannot be a BEX object");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjExp(inc) === true) {
            //TODO: implement this
            wr("executeProcedureLineFor: Error: inc value cannot be an EXP object");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(inc) === true) {
            incVar = inc;
         } else {
            wr("executeProcedureLineFor: Error: inc value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         }
      } else if (isVarString(inc) === true) {
         incVar = processVarString(inc, prog, proc);
      } else {
         wr("executeProcedureLineFor: Error: inc value must be a $VAR");
         WR_PREFIX = prevPrefix;
         return false;
      }
      incVarType = incVar.sys;

      if (startVar === null) {
         wr("executeProcedureLineFor: Error: start value of assignment statement is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (stopVar === null) {
         wr("executeProcedureLineFor: Error: stop value of assignment statement is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (incVar === null) {
         wr("executeProcedureLineFor: Error: inc value of assignment statement is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (startVar.val === null) {
         wr("executeProcedureLineFor: Error: the start val is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (stopVar.val === null) {
         wr("executeProcedureLineFor: Error: the stop val is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (incVar.val === null) {
         wr("executeProcedureLineFor: Error: the inc val is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (startVar.val.v === null) {
         wr("executeProcedureLineFor: Error: the start value has not been assigned to and is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (stopVar.val.v === null) {
         wr("executeProcedureLineFor: Error: the stop value has not been assigned to and is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (incVar.val.v === null) {
         wr("executeProcedureLineFor: Error: the inc value has not been assigned to and is null.");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (startVar.val.type.trim() !== stopVar.val.type.trim()) {
         wr("executeProcedureLineFor: Error: start value type and stop value type do not match, start type, '" + startVar.val.type + "', stop type, '" + stopVar.val.type + "'");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (stopVar.val.type.trim() !== incVar.val.type.trim()) {
         wr("executeProcedureLineFor: Error: stop value type and inc value type do not match, stop type, '" + stopVar.val.type + "', inc type, '" + incVar.val.type + "'");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (incVar.val.type.trim() !== startVar.val.type.trim()) {
         wr("executeProcedureLineFor: Error: inc value type and start value type do not match, inc type, '" + incVar.val.type + "', start type, '" + startVar.val.type + "'");
         WR_PREFIX = prevPrefix;
         return false;
      }

      var cnt = findVarLike("LOOP_VAR", prog, proc, false);
      var lVarName = "LOOP_VAR_" + cnt;
      var obj = {"sys": "init", "name": lVarName, "val": {"sys": "val", "type": "int", "v": 0}, "access": "private"};
      obj.val.v = startVar.val.v;
      proc.vars.push(obj);
      wr("executeProcedureLineFor: adding loop var");

      var prevPrefix2 = WR_PREFIX;
      WR_PREFIX += "\t";
      
      var res = false;
      
      wr("For Start: " + lineNum + "================================================================");
      for (var i = startVar.val.v; i < stopVar.val.v; i += incVar.val.v) {
         obj.val.v = i;
         wr("");
         wr("Iteration Start: " + i + "================================================================");
         res = executeProcedureLineForClause(procLine, callName, callArgs, prog, proc, (lineNum + i));
         
         if(!res) {
            wr("executeProcedureLineFor: Error: exception encountered on line: " + (lineNum + i));
            WR_PREFIX = prevPrefix;
            return false;
         }
         
         wr("Iteration Stop: " + i + "================================================================");         
      }
      wr("For Stop: " + lineNum + "================================================================");      

      WR_PREFIX = prevPrefix2;
      delVar(lVarName, prog, proc, false);

      wr("executeProcedureLineFor: removing loop var");
      WR_PREFIX = prevPrefix;
      return true;
   } else {
      wr("executeProcedureLineFor: Error: not a FOR object");      
      WR_PREFIX = prevPrefix;      
      return false;
   }
}

function executeProcedureLineFuncCall(procLine, callName, callArgs, prog, proc, lineNum) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";
   
   if (isSysObjFuncCall(procLine) === true) {
      if (validateGrammarClassProcsFuncCall(procLine) === false) {
         wr("executeProcedureLineFuncCall: Error: can't validate CALL line number: " + lineNum + " with source: " + JSON.stringify(procLine));
         WR_PREFIX = prevPrefix;
         return false;
      }

      if(PRINT_LINE_OBJ) {
         wr("executeProcedureLineFuncCall: line number: " + lineNum + " with source: " + JSON.stringify(procLine));
      } else {
         wr("executeProcedureLineFuncCall: line number: " + lineNum);
      }
      
      //handle call line
      var name = procLine.name;
      var arg = procLine.arg;

      var nameVar = null;
      var nameVarType = null;
      var argVar = null;
      var argVarType = null;

      //name arg     
      if (isSysObj(name) === true) {
         if (isSysObjBex(name) === true) {
            //error
            wr("executeProcedureLineFuncCall: Error: name value can't be a BEX object");
            WR_PREFIX = prevPrefix;
            return false;
         } else if(isSysObjExp(name) === true) {
            //TODO: implement this
            wr("executeProcedureLineFuncCall: Error: name value can't be a EXP object");            
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(name) === true) {
            nameVar = name;
         } else {
            wr("executeProcedureLineFuncCall: Error: name value unsupported object");
            WR_PREFIX = prevPrefix;
            return false;
         }
      } else if (isVarString(name) === true) {
         nameVar = processVarString(name, prog, proc);
      } else if (isString(name) === true) {
         //generate var string
         nameVar = { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "string", "v": name } };               
      } else {
         wr("executeProcedureLineFuncCall: Error: name value must be a $VAR");
         WR_PREFIX = prevPrefix;
         return false;
      }
      nameVarType = nameVar.sys;

      //args arg
      var sysFunc = findSystemFunc(name);
      if(arg === null) {
         if(sysFunc !== null && isSysObjFunc(sysFunc) === true) {
            if(sysFunc.hasOwnProperty("arg") === false || sysFunc.arg === null) {
               //execute the system function
               processSystemFunc(sysFunc, argVar, prog, proc);
               wr("executeProcedureLineFuncCall: Found result " + sysFunc.ret.val.v);
            } else {
               wr("executeProcedureLineFuncCall: Error: expected no arguments for system function '" + name + "'");
               WR_PREFIX = prevPrefix;
               return false;
            }
         }            
      } else {
         //arg arg
         if (isSysObj(arg) === true) {
            if (isSysObjBex(arg) === true) {
               //error
               wr("executeProcedureLineFuncCall: Error: start value cannot be a BEX object");
               WR_PREFIX = prevPrefix;
               return false;
            } else if (isSysObjExp(arg) === true) {
               //TODO: implement this
               wr("executeProcedureLineFuncCall: Error: start value cannot be an EXP object");
               WR_PREFIX = prevPrefix;
               return false;
            } else if (isSysObjFuncCall(arg) === true) {
               //call func
               wr("executeProcedureLineFuncCall: Error: start value cannot be an FCALL object");
               WR_PREFIX = prevPrefix;
               return false;
            } else if (isSysObjProcCall(arg) === true) {
               //call proc
               wr("executeProcedureLineFuncCall: Error: start value cannot be an CALL object");
               WR_PREFIX = prevPrefix;
               return false;
            } else if (isSysObjConst(arg) === true) {
               argVar = arg;
            }
         } else if (isVarString(arg) === true) {
            argVar = processVarString(arg, prog, proc);
         } else {
            wr("executeProcedureLineFuncCall: Error: start value must be a $VAR");
            WR_PREFIX = prevPrefix;
            return false;
         }
         argVarType = argVar.sys;

         var sysFunc = findSystemFunc(name);
         if(sysFunc !== null && isSysObjFunc(sysFunc) === true) {
            if(findFuncArgMatch(sysFunc, argVar) === true) {
               //execute the system function
               processSystemFunc(sysFunc, argVar, prog, proc);
            } else {
               wr("executeProcedureLineFuncCall: Error: could not find matching arguments for system function '" + name + "'");
               WR_PREFIX = prevPrefix;
               return false;
            }
         }

         //General process
         //find the function in the system list
         //find the function in the prodecure list
         //find the function in the class list
         //match args
      }

      WR_PREFIX = prevPrefix;
      return true;
   } else {
      wr("executeProcedureLineFuncCall: Error: not a CALL object");
      WR_PREFIX = prevPrefix;      
      return false;
   }
}


//FIND FUNCTIONS
function findFuncArgMatch(func, inArg) {
   if (func.arg.val.type.trim() === inArg.val.type.trim()) {
      return true;
   } else {
      return false;
   }
}

function findProcArgMatch(proc, inArgs) {
   var cnt = 0;
   var found = [];
   var len = proc.args.length;
   for (var i = 0; i < len; i++) {
      var sysArg = proc.args[i];
      for (var j = 0; j < inArgs.length; j++) {
         if (sysArg.val.type.trim() === inArgs[j].val.type.trim() && found.contains(j) === false) {
            found.push(j);
            cnt++;
         }
      }
   }

   if (cnt === len) {
      return true;
   } else {
      return false;
   }
}

function findSystemFunc(name) {
   for (var i = 0; i < functions.length; i++) {
      if (functions[i].name === name) {
         return functions[i];
      }
   }
   return null;
}

function findVar(name, prog, proc, useProg) {
   if (useProg === true) {
      for (var i = 0; i < prog.vars.length; i++) {
         if (prog.vars[i].name === name) {
            return prog.vars[i];
         }
      }
   } else {
      for (var i = 0; i < proc.vars.length; i++) {
         if (proc.vars[i].name === name) {
            return proc.vars[i];
         }
      }
   }
   return null;
}

function findVarLike(name, prog, proc, useProg) {
   var count = 0;
   if (useProg === true) {
      for (var i = 0; i < prog.vars.length; i++) {
         if (prog.vars[i].name === name) {
            count++;
         }
      }
   } else {
      for (var i = 0; i < proc.vars.length; i++) {
         if (proc.vars[i].name === name) {
            count++;
         }
      }
   }
   return count;
}

function delVar(name, prog, proc, useProg) {
   if (useProg === true) {
      var tmp = [];
      for (var i = 0; i < prog.vars.length; i++) {
         if (prog.vars[i].name !== name) {
            tmp.push(prog.vars[i]);
         }
      }
      prog.vars = tmp;

   } else {
      var tmp = [];
      for (var i = 0; i < proc.vars.length; i++) {
         if (proc.vars[i].name !== name) {
            tmp.push(prog.vars[i]);
         }
      }
      prog.vars = tmp;
   }
}

function findArg(name, proc) {
   for (var i = 0; i < proc.args.length; i++) {
      if (proc.args[i].name === name) {
         return proc.args[i];
      }
   }
   return null;
}

function findProc(prog, name) {
   for (var i = 0; i < prog.procs.length; i++) {
      if (prog.procs[i].name === name) {
         return prog.procs[i];
      }
   }
   return null;
}


//PROCESS METHODS

function processSystemFunc(sysFunc, arg, prog, proc) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";
   
   if(sysFunc.name === "int2str") {
      wr(JSON.stringify(arg));
      wr("processSystemFunc: Name: " + sysFunc.name + ", " + arg.val.v);      
      sysFunc.ret.val.v = Number(arg.val.v);
      
   } else if(sysFunc.name === "print") {      
      wr(JSON.stringify(arg));
      wr("processSystemFunc: Name: " + sysFunc.name + ", " + arg.val.v);
   
      /*
      if (isSysObj(left) === true) {
         if (isSysObjBex(left) === true) {
            leftVar = processBexObject(left, prog, proc);
         } else if (isSysObjConst(left) === true) {
            leftVar = left;
         }

      } else if (isVarString(left) === true) {
         leftVar = processVarString(left, prog, proc);

      } else {
         wr("processBexObject: Error: left value is invalid");
         return false;
      }
       */
   }
   WR_PREFIX = prevPrefix;
}

//process a variable string
function processVarString(varString, prog, proc) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";
   
   wr("processVarString: processing var string, '" + varString + "'");   
   
   var thisStr = VAR_THIS;
   var nonThisStr = VAR_NON_THIS;
   var idxThis = String(varString).indexOf(thisStr);
   var idxDs = String(varString).indexOf(nonThisStr);
   var varName = null;
   var fnd = null;

   if (idxThis !== -1) {
      varName = varString.substring(thisStr.length);
      fnd = findVar(varName, prog, proc, true);

   } else if (idxDs !== -1) {
      //check proc vars
      varName = varString.substring(nonThisStr.length);
      fnd = findVar(varName, prog, proc, false);

      if (fnd === null) {
         //check proc args
         fnd = findArg(varName, proc);
      }
   }
   wr("processVarString: Notice: found var name, '" + varName + "'");

   if (fnd === null) {
      wr("processVarString: Error: could not find variable with name, '" + varName + "'");
   }

   wr("processVarString: Notice: returning '" + JSON.stringify(fnd) + "'");
   WR_PREFIX = prevPrefix;
   return fnd;
}

//process numeric expression object
function processExpObject(expObject, prog, proc) {
   if (isSysObjBex(expObject) === true) {
      
   }   
}

//process boolean expression object
function processBexObject(bexObject, prog, proc) {
   var prevPrefix = WR_PREFIX;
   WR_PREFIX += "\t";

   if (isSysObjBex(bexObject) === true) {      
      wr("processBexObject: Notice: processing bex object, '" + JSON.stringify(bexObject) + "'");         
         
      var left = bexObject.left;
      var op = bexObject.op;
      var right = bexObject.right;

      var leftVar = null;
      var leftVarType = null;
      var rightVar = null;
      var rightVarType = null;

      //left arg
      if (isSysObj(left) === true) {
         if (isSysObjBex(left) === true) {
            leftVar = processBexObject(left, prog, proc);
         } else if(isSysObjExp(left) === true) {
            wr("processBexObject: Error: left var can't be an EXP object.... yet");
            WR_PREFIX = prevPrefix;
            return false;
         } else if (isSysObjConst(left) === true) {
            leftVar = left;
         }

      } else if (isVarString(left) === true) {
         leftVar = processVarString(left, prog, proc);

      } else {
         wr("processBexObject: Error: left value is invalid");
         WR_PREFIX = prevPrefix;
         return false;
      }
      leftVarType = leftVar.sys;

      //right arg
      if (isSysObj(right) === true) {
         if (isSysObjBex(right) === true) {
            rightVar = processBexObject(right, prog, proc);
         } else if (isSysObjConst(right) === true) {
            rightVar = right;
         }

      } else if (isVarString(right) === true) {
         rightVar = processVarString(right, prog, proc);

      } else {
         wr("processBexObject: Error: right value is invalid");
         WR_PREFIX = prevPrefix;
         return false;
      }
      rightVarType = rightVar.sys;

      if (rightVar === null) {
         wr("processBexObject: Error: right value of assignment statement is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (leftVar === null) {
         wr("processBexObject: Error: left value of assignment statement is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (validateOpBex(op) === false) {
         wr("processBexObject: Error: operator is not valid, '" + op + "'");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (rightVar.val === null) {
         wr("processBexObject: Error: the right val is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (leftVar.val === null) {
         wr("processBexObject: Error: the left val is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (rightVar.val.v === null) {
         wr("processBexObject: Error: the right value has not been assigned to and is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (leftVar.val.v === null) {
         wr("processBexObject: Error: the left value has not been assigned to and is null");
         WR_PREFIX = prevPrefix;
         return false;

      } else if (leftVar.val.type.trim() !== rightVar.val.type.trim()) {
         wr("processBexObject: Error: right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
         WR_PREFIX = prevPrefix;
         return false;
      }

      wr("processBexObject: Notice: comparing with: " + op);
      var res = null;
      var ret = null;
      if (op === "==") {
         res = (leftVar.val.v === rightVar.val.v);

      } else if (op === "!=") {
         res = (leftVar.val.v !== rightVar.val.v);

      } else if (op === "<") {
         res = (leftVar.val.v < rightVar.val.v);

      } else if (op === ">") {
         res = (leftVar.val.v > rightVar.val.v);

      } else if (op === "<=") {
         res = (leftVar.val.v <= rightVar.val.v);

      } else if (op === ">=") {
         res = (leftVar.val.v >= rightVar.val.v);

      } else if (op === "&&") {
         res = (leftVar.val.v && rightVar.val.v);

      } else if (op === "||") {
         res = (leftVar.val.v || rightVar.val.v);
      }

      ret = {"sys": "decl", "name": "processBexObject", "val": {"sys": "val", "type": "bool", "v": res}};
      wr("processBexObject: Notice: comparing '" + leftVar.val.v + "' to the value of '" + rightVar.val.v + "', value, (" + res + "), operator, '" + op + "'");      
      wr("processBexObject: Notice: returning '" + JSON.stringify(ret));
      WR_PREFIX = prevPrefix;      
      return ret;
   } else {
      wr("processBexObject: Error: not a BEX object");
      WR_PREFIX = prevPrefix;
      return null;
   }
}


//VALIDATE FUNCTIONS
//validate operation assign, init
function validateOpAsgnInit(opString) {
   if (grammar.op_asgn_init.indexOf(opString) === -1) {
      return false;
   } else {
      return true;
   }
}

//validate operation boolean expression
function validateOpBex(opString) {
   if (grammar.op_bex.indexOf(opString) === -1) {
      return false;
   } else {
      return true;
   }
}

//validate properties
function validateProperties(obj, req) {
   if (obj === null || req === null) {
      return false;
   }

   for (var i = 0; i < req.length; i++) {
      var r = req[i];
      if (obj.hasOwnProperty(r) === false) {
         wr("validateProperties: Error: missing property: " + r);
         return false;
      }
   }
   return true;
}

function validateGrammarClass(prog) {
   if (prog === null || prog.hasOwnProperty("sys") === false || validateProperties(prog, grammar.class_required) === false) {
      wr("validateGrammarClass: Error: invalid class entry: " + JSON.stringify(prog));
      return false;
   }
   return true;
}

function validateGrammarClassVars(prog) {
   if (prog !== null && prog.hasOwnProperty("vars") === true) {
      for (var i = 0; i < prog.vars.length; i++) {
         var progVar = prog.vars[i];
         validateGrammarVar(progVar);
      }
   }
   return true;
}

function validateGrammarVar(varEntry) {
   if (varEntry === null || varEntry.hasOwnProperty("sys") === false || validateProperties(varEntry, grammar.var_required) === false || grammar.class_vars.indexOf(varEntry.sys) === -1) {
      wr("validateGrammarVar: Error: validateGrammarVar: invalid VAR entry: " + JSON.stringify(varEntry));
      return false;
   }
   return true;
}

function validateGrammarArg(argEntry) {
   if (argEntry === null || argEntry.hasOwnProperty("sys") === false || validateProperties(argEntry, grammar.arg_required) === false) {
      wr("validateGrammarArg: Error: validateGrammarArg: invalid ARG entry: " + JSON.stringify(argEntry));
      return false;
   } else if (argEntry.val === null || argEntry.hasOwnProperty("sys") === false || validateProperties(argEntry.val, grammar.val_required) === false) {
      wr("validateGrammarArg: Error: validateGrammarArg: invalid ARG entry: " + JSON.stringify(argEntry));
      return false;
   }
   return true;
}

function validateGrammarClassCall(prog) {
   if (prog !== null && prog.hasOwnProperty("call") === true) {
      var progCall = prog.call;
      if (progCall === null || progCall.hasOwnProperty("sys") === false || validateProperties(progCall, grammar.call_required) === false) {
         wr("validateGrammarClassCall: Error: invalid CALL entry: " + JSON.stringify(progCall));
         return false;
      }
   }
   return true;
}

function validateGrammarClassProcs(prog) {
   //class
   if (prog !== null && prog.hasOwnProperty("procs") === true) {
      //procs
      for (var i = 0; i < prog.procs.length; i++) {
         var proc = prog.procs[i];
         //proc
         if (proc === null || proc.hasOwnProperty("sys") === false || validateProperties(proc, grammar.class_procs_required) === false || grammar.class_procs.indexOf(proc.sys) === -1) {
            wr("validateGrammarClassProcs: Error: invalid proc entry: " + JSON.stringify(proc));
            return false;
         } else {
            //args
            if (proc !== null && proc.hasOwnProperty("args") === true) {
               for (var i = 0; i < proc.args.length; i++) {
                  var procArg = proc.args[i];
                  if (procArg === null || procArg.hasOwnProperty("sys") === false || validateProperties(procArg, grammar.class_procs_args_required) === false || grammar.class_procs_args.indexOf(procArg.sys) === -1) {
                     wr("validateGrammarClassProcs: Error: invalid proc arg entry: " + JSON.stringify(procArg));
                     return false;
                  }
               }
            }

            //vars
            if (proc !== null && proc.hasOwnProperty("vars") === true) {
               for (var i = 0; i < proc.vars.length; i++) {
                  var procVar = proc.vars[i];
                  if (procVar === null || procVar.hasOwnProperty("sys") === false || validateProperties(procVar, grammar.class_procs_vars_required) === false || grammar.class_procs_vars.indexOf(procVar.sys) === -1) {
                     wr("validateGrammarClassProcs: Error: invalid proc arg entry: " + JSON.stringify(procVar));
                     return false;
                  }
               }
            }

            //ret
            if (proc !== null && proc.hasOwnProperty("ret") === true && proc.ret !== null && proc.ret !== "") {
               var procRet = proc.ret;
               if (procRet === null && procRet.hasOwnProperty("sys") === false && validateProperties(procRet, grammar.class_procs_ret_required) === false || grammar.class_procs_ret.indexOf(procRet.sys) === -1) {
                  wr("validateGrammarClassProcs: Error: invalid proc ret entry: " + JSON.stringify(procRet));
                  return false;
               }
            }

            //lines
            if (proc !== null && proc.hasOwnProperty("lines") === true) {
               for (var i = 0; i < proc.lines.length; i++) {
                  var procLine = proc.lines[i];
                  if (procLine === null || procLine.hasOwnProperty("sys") === false || grammar.class_procs_lines.indexOf(procLine.sys) === -1) {
                     wr("validateGrammarClassProcs: Error: invalid proc line entry: " + JSON.stringify(procLine));
                     return false;
                  }
               }
            }
         }
      }
   }
   return true;
}

function validateGrammarClassProcsIf(procLine) {
   if (procLine !== null && validateProperties(procLine, grammar.if_required) === false) {
      wr("validateGrammarClassProcsIf: Error: invalid if line entry: " + JSON.stringify(procLine));
      return false;
   } else {
      return true;
   }
}

function validateGrammarClassProcsFor(procLine) {
   if (procLine !== null && validateProperties(procLine, grammar.for_required) === false) {
      wr("validateGrammarClassProcsFor: Error: invalid for line entry: " + JSON.stringify(procLine));
      return false;
   } else {
      return true;
   }
}

function validateGrammarClassProcsCall(procLine) {
   if (procLine !== null && validateProperties(procLine, grammar.call_required) === false) {
      wr("validateGrammarClassProcsCall: Error: invalid for line entry: " + JSON.stringify(procLine));
      return false;
   } else {
      return true;
   }
}

function validateGrammarClassProcsFuncCall(procLine) {
   if (procLine !== null && validateProperties(procLine, grammar.fcall_required) === false) {
      wr("validateGrammarClassProcsFuncCall: Error: invalid for line entry: " + JSON.stringify(procLine));
      return false;
   } else {
      return true;
   }
}

function validateGrammarClassProcsAsgn(procLine) {
   if (procLine !== null && validateProperties(procLine, grammar.asgn_required) === false) {
      wr("validateGrammarClassProcsIf: Error: invalid if line entry: " + JSON.stringify(procLine));
      return false;
   } else {
      return true;
   }
}

function validateGrammarClassProcsIfClause(procLine) {
   if (procLine !== null && procLine.hasOwnProperty("if_lines") === true) {
      //if lines
      for (var i = 0; i < procLine.if_lines.length; i++) {
         var ifLine = procLine.if_lines[i];
         if (ifLine === null || ifLine.hasOwnProperty("sys") === false || grammar.class_procs_if_lines.indexOf(ifLine.sys) === -1) {
            wr("validateGrammarClassProcsIfClause: Error: invalid if line entry: " + JSON.stringify(ifLine));
            return false;
         }
      }
      return true;
   }
   return false;
}

function validateGrammarClassProcsForClause(procLine) {
   if (procLine.hasOwnProperty("for_lines") === true) {
      //for lines
      for (var i = 0; i < procLine.for_lines.length; i++) {
         var forLine = procLine.for_lines[i];
         if (forLine === null || forLine.hasOwnProperty("sys") === false || grammar.class_procs_for_lines.indexOf(forLine.sys) === -1) {
            wr("validateGrammarClassProcsForClause: Error: invalid for line entry: " + JSON.stringify(forLine));
            return false;
         }
      }
      return true;
   }
   return true;
}

function validateGrammarClassProcsElseClause(procLine) {
   if (procLine.hasOwnProperty("else_lines") === true) {
      //else lines
      for (var i = 0; i < procLine.else_lines.length; i++) {
         var elseLine = procLine.else_lines[i];
         if (elseLine === null || elseLine.hasOwnProperty("sys") === false || grammar.class_procs_else_lines.indexOf(elseLine.sys) === -1) {
            wr("validateGrammarClassProcsElseClause: Error: invalid else line entry: " + JSON.stringify(elseLine));
            return false;
         }
      }
      return true;
   }
   return false;
}


//MAIN EXEC
var lres = false;
wr("STARTING JSON-PL EXEC:");
//TODO: Add initialization step
//TODO: Add validating all system functions to the init process
lres = executeProgram(prog);
wr("Execute Class: " + lres);
wr("ENDING JSON-PL EXEC:");