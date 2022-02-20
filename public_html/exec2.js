/*
 * JSON Programming Language
 * EXEC JS
 * Victor G. Brusca 
 * Created on 02/03/2022 1:57 PM EDT
 * Licensed under GNU General Public License v3.0
 */

//, {"sys": "ref", "path": "$.vars.tmp1"}, {"sys": "const", "val":{"sys": "val", "type": "bool", "v": true}}

var code = {
   "sys": "class",
   "name": "test1",
   "call": {"sys": "call", "name": "testFunction1", "args": [{"sys": "ref", "path": "#.vars.tmp1"}]},
   "vars": [
      {
         "sys": "var",
         "name": "tmp1",
         "val": {
            "sys": "val",
            "type": "int",
            "v": 0
         }
      },
      {
         "sys": "var",
         "name": "tmp2",
         "val": {
            "sys": "val",
            "type": "bool",
            "v": false
         }         
      }
   ],
   "funcs": [      
      {
         "sys": "func",
         "name": "testFunction1",
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
               "sys": "var",
               "name": "b1",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": false
               }
            }
         ],
         "ret": {
            "sys": "val",
            "type": "bool",
            "v": false
         },
         "lines": [
            {"sys": "call", "name": "testProcedure", "args": [{"sys": "ref", "path": "$.vars.tmp1"}]}
         ]
      },
      {
         "sys": "func",
         "name": "testFunction2",
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
               "sys": "var",
               "name": "b1",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": false
               }
            }
         ],
         "ret": {
            "sys": "val",
            "type": "bool",
            "v": false
         },
         "lines": [
            {
               "sys": "asgn",
               "left": {"sys":"ref", "path":"$.vars.tmp1"},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys":"ref", "path":"#.args.i1"}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "path":"$.vars.tmp1"},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "path":"#.args.i1"},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "path":"#.vars.b1"},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "bex", "left": {"sys":"ref", "path":"$.vars.tmp1"}, "op": {"sys":"op", "type":"bex", "v":"=="}, "right": {"sys":"ref", "path":"#.args.i1"}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "path":"#.vars.b1"},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "bex", "left": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}, "op": {"sys":"op", "type":"bex", "v":"=="}, "right": {"sys":"ref", "path":"#.args.i1"}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "path":"#.args.i1"},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "exp", "left": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}, "op": {"sys":"op", "type":"exp", "v":"+"}, "right": {"sys":"ref", "path":"#.args.i1"}}
            }
         ]
      }   
   ],
   "ret": {
      "sys": "val",
      "type": "bool",
      "v": false
   }
};

var jsonPlState = {
   "system": {
      "procedures": [

      ],
      "functions":[

      ]
   },
   "program": {},
   "LOGGING": true,
   "WR_PREFIX": ""   
};

jsonPlState.findArg = function(name, obj) {
   for (var i = 0; i < obj.args.length; i++) {
      if (obj.args[i].name === name) {
         return obj.args[i];
      }
   }
   return null;
};

jsonPlState.findVar = function(name, obj) {
   for (var i = 0; i < obj.vars.length; i++) {
      if (obj.vars[i].name === name) {
         return obj.vars[i];
      }
   }
   return null;
};

jsonPlState.processRef = function(obj, func) {
   var path;
   var vls;
   var fnd;
   var prog = this.program;
   
   if(obj.path.indexOf("#.") === 0) {
      //program/class var, arg
      path = obj.path.substring(2);
      vls = path.split(".");
      if(vls[0] === "vars") {
         fnd = this.findVar(vls[1], prog);
         if(fnd !== null) {
            this.wr("processRef: found reference result: " + JSON.stringify(fnd));
            return fnd;
         } else {
            this.wr("processRef: Error: could not find var with name '" + vls[1] + "' in program");
            return null;            
         }
      } else if(vls[0] === "args") {
         fnd = this.findArg(vls[1], prog);
         if(fnd !== null) {
            this.wr("processRef: found reference result: " + JSON.stringify(fnd));            
            return fnd;
         } else {
            this.wr("processRef: Error: could not find arg with name '" + vls[1] + "' in program");
            return null;
         }         
      } else {
         this.wr("processRef: Error: unsupported path '" + vls + "'");
         return null;
      }
      
   } else if(obj.path.indexOf("$.") === 0) {
      //func var, arg
      path = obj.path.substring(2);
      vls = path.split(".");
      if(vls[0] === "vars") {
         fnd = this.findVar(vls[1], func);
         if(fnd !== null) {
            this.wr("processRef: found reference result: " + JSON.stringify(fnd));            
            return fnd;
         } else {
            this.wr("processRef: Error: could not find var with name '" + vls[1] + "' in func");
            return null;            
         }
      } else if(vls[0] === "args") {
         fnd = this.findArg(vls[1], func);
         if(fnd !== null) {
            this.wr("processRef: found reference result: " + JSON.stringify(fnd));            
            return fnd;
         } else {
            this.wr("processRef: Error: could not find arg with name '" + vls[1] + "' in func");
            return null;            
         }         
      } else {
         this.wr("processRef: Error: unsupported path '" + vls + "'");
         return null;
      }
   }
};

jsonPlState.execFunction = function(func, funcArgs) {
   //process ref args
   for(var i = 0; i < funcArgs.length; i++) {
      if(this.isSysObjRef(funcArgs[i])) {
         funcArgs[i] = this.processRef(funcArgs[i], func);
      }
   }  
   
   //check if args match up
   if(func.args.length === funcArgs.length) {
      for(var i = 0; i < funcArgs.length; i++) {
         if(funcArgs[i].val.type !== func.args[i].val.type) {
            this.wr("execFunction: Error: argument type mismatch at argument index " + i);
            return null;
         }
      }
   } else {
      this.wr("execFunction: Error: argument length mismatch");
      return null;
   }
   
   //store default args vals as v_def attr
   for(var i = 0; i < func.args.length; i++) {
      func.args[i].val.v_def = func.args[i].val.v;
      func.args[i].val.v = funcArgs[i].val.v;
   }
   func.ret.v_def = func.ret.v;
   
   //process function
   for(var i = 0; i < func.lines.length; i++) {
      this.wr("");
      this.wr("Processing Line: " + i + " with source: " + JSON.stringify(func.lines[i]));
      if(this.isSysObjAsgn(func.lines[i])) {
         //process asgn
         
      } else if(this.isSysObjIf(func.lines[i])) {
         //process if
         
      } else if(this.isSysObjFor(func.lines[i])) {
         //process for
         
      } else if(this.isSysObjReturn(func.lines[i])) {
         //process return
         
      } else if(this.isSysObjCall(func.lines[i])) {
         //process call 
         
      }
   }
   
   var ret = {"sys": "val", "type": func.ret.type, "v": func.ret.v};
   
   //reset ret default value
   func.ret = {"sys": "val", "type": func.ret.type, "v": func.ret.v_def}; 
   
   //restore default args vals from v_def attr
   for(var i = 0; i < func.args.length; i++) {
      func.args[i].val = {"sys": "val", "type": func.args[i].val.type, "v": func.args[i].val.v_def};
   }
   
   this.wr("execFunction: found result: " + JSON.stringify(ret));
   return ret;
};

jsonPlState.execProgram = function() {
   var obj = this.program;
   if(this.validateSysObjClass(obj)) {
      if(obj.call !== null) {
         var funcName = obj.call.name;
         var funcArgs = obj.call.args;
         var func = this.findFunc(funcName);
         this.wr("Looking for function with name: " + funcName);
         if(func !== null) {
            if(func.ret.type === obj.ret.type) {
               var res = this.execFunction(func, funcArgs);
               if(res === null) {
                  this.wr("execProgram: Error: executing function: " + funcName + " with args:" + JSON.stringify(funcArgs));
                  return false;
               } else {
                  this.wr("execProgram: setting return value to result: '" + res.v + "'");
                  obj.ret.v = res.v;
               }
            } else {
               this.wr("execProgram: Error: executing function: " + funcName + " has wrong return type, '" + func.ret.type + "' vs '" + obj.ret.type + "'");
               return false;               
            }
         } else {
            this.wr("execProgram: Error: no class function found");
            return false;            
         }
      } else {
         this.wr("execProgram: Error: no class call obj found");
         return false;
      }
   } else {
      this.wr("execProgram: Error: could not validate obj as class");
      return false;
   }
   
   return true;
};

jsonPlState.findFunc = function(name) {
   var prog = this.program;
   for (var i = 0; i < prog.funcs.length; i++) {
      if (prog.funcs[i].name === name) {
         return prog.funcs[i];
      }
   }
   return null;
};

jsonPlState.validateSysObjClass = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "class" && this.validateProperties(obj, ["sys", "name", "vars", "funcs", "ret", "call"])) {
      if(!this.validateSysObjVal(obj.ret)) {
         this.wr("validateSysObjClass: Error: could not validate obj as val");
         return false;
      }
      
      if(obj.call !== null && !this.validateSysObjCall(obj.call)) {
         this.wr("validateSysObjClass: Error: could not validate obj as call");         
         return false;
      }
      
      for(var i = 0; i < obj.vars.length; i++) {
         if(!this.validateSysObjVar(obj.vars[i])) {
            this.wr("validateSysObjClass: Error: could not validate obj as var");
            return false;
         }
      }
      
      for(var i = 0; i < obj.funcs.length; i++) {
         if(!this.validateSysObjFunc(obj.funcs[i])) {
            this.wr("validateSysObjClass: Error: could not validate obj as func: " + obj.funcs[i].name);
            return false;
         }
      }
      
      return true;
   }
   return false;
};

jsonPlState.validateSysObjFuncLine = function(obj) {
   if(this.isSysObj(obj)) {
      if(this.getSysObjType(obj) === "asgn") {
         if(!this.validateSysObjAsgn(obj)) {
            this.wr("validateSysObjFuncLine: Error: could not validate obj as asgn");
            return false;
         }         
      } else if(this.getSysObjType(obj) === "for") {
         if(!this.validateSysObjFor(obj)) {
            this.wr("validateSysObjFuncLine: Error: could not validate obj as for");
            return false;
         }
      } else if(this.getSysObjType(obj) === "if") {
         if(!this.validateSysObjIf(obj)) {
            this.wr("validateSysObjFuncLine: Error: could not validate obj as if");
            return false;
         }
      } else if(this.getSysObjType(obj) === "return") {
         if(!this.validateSysObjReturn(obj)) {
            this.wr("validateSysObjFuncLine: Error: could not validate obj as return");
            return false;
         }
      } else if(this.getSysObjType(obj) === "call") {
         if(!this.validateSysObjCall(obj)) {
            this.wr("validateSysObjFuncLine: Error: could not validate obj as call");
            return false;
         }         
      }      
   }
   return true;
};

jsonPlState.validateSysObjFunc = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "func" && this.validateProperties(obj, ["sys", "name", "args", "vars", "ret", "lines"])) {
      if(!this.validateSysObjVal(obj.ret)) {
         this.wr("validateSysObjFunc: Error: could not validate obj as val");
         return false;
      }
            
      for(var i = 0; i < obj.vars.length; i++) {
         if(!this.validateSysObjVar(obj.vars[i])) {
            this.wr("validateSysObjFunc: Error: could not validate obj as var");
            return false;
         }
      }
      
      for(var i = 0; i < obj.args.length; i++) {
         if(!this.validateSysObjArg(obj.args[i])) {
            this.wr("validateSysObjFunc: Error: could not validate obj as arg");
            return false;
         }
      }      
      
      for(var i = 0; i < obj.lines.length; i++) {
         if(!this.validateSysObjFuncLine(obj.lines[i])) {
            this.wr("validateSysObjFunc: Error: could not validate obj as func line: " + i);
            return false;
         }
      }
      
      return true;
   }
   return false;
};

jsonPlState.validateSysObjAsgn = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "asgn" && this.validateProperties(obj, ["sys", "left", "op", "right"])) {
      var tobj = null;
      if(obj.left !== null) {
         tobj = obj.left;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               this.wr("validateSysObjAsgn: Error: could not validate left obj as ref");
               return false;
            }
         } else {
            this.wr("validateSysObjAsgn: Error: could not validate left obj as ref");            
            return false;
         }
      } else{
         this.wr("validateSysObjAsgn: Error: could not validate left obj as ref, null");
         return false;
      }
      
      if(obj.op !== null) {
         tobj = obj.op;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "op") {
            if(!this.validateSysObjOp(tobj)) {
               this.wr("validateSysObjAsgn: Error: could not validate obj as op");
               return false;
            } else if(tobj.type !== 'asgn') {
               this.wr("validateSysObjAsgn: Error: could not validate obj as op type");               
               return false;
            }else if(tobj.v !== '=') {
               this.wr("validateSysObjAsgn: Error: could not validate obj as op code");               
               return false;
            }
         } else {
            this.wr("validateSysObjAsgn: Error: could not validate obj as op");
            return false;
         }
      } else {
         this.wr("validateSysObjAsgn: Error: could not validate obj as op, null");         
         return false;
      }   
      
      if(obj.right !== null) {
         tobj = obj.right;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               this.wr("validateSysObjAsgn: Error: could not validate right obj as ref");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               this.wr("validateSysObjAsgn: Error: could not validate right obj as const");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               this.wr("validateSysObjAsgn: Error: could not validate right obj as exp");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               this.wr("validateSysObjAsgn: Error: could not validate right obj as bex");
               return false;
            }                            
         } else {
            this.wr("validateSysObjAsgn: Error: could not validate obj as right");
            return false;
         }
      } else {
         this.wr("validateSysObjAsgn: Error: could not validate obj as right, null");
         return false;
      }
      
      return true;
   }
   return false;
};

jsonPlState.validateSysObjBex = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "bex" && this.validateProperties(obj, ["sys", "left", "op", "right"])) {
      var tobj = null;
      if(obj.left !== null) {
         tobj = obj.left;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               return false;
            }
         } else {
            return false;
         }
      } else{
         return false;
      }
      
      if(obj.op !== null) {
         tobj = obj.op;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "op") {
            if(!this.validateSysObjOp(tobj)) {
               return false;
            } else if(tobj.type !== 'bex') {
               return false;
            } else if(!(tobj.v === "==" || tobj.v === "!=" || tobj.v === "<" || tobj.v === ">" || tobj.v === "<=" || tobj.v === ">=")) {
               return false;
            }
         } else {
            return false;
         }
      } else {
         return false;
      }   
      
      if(obj.right !== null) {
         tobj = obj.right;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               return false;
            }                            
         } else {
            return false;
         }
      } else {
         return false;
      }
      
      return true;
   }
   return false;
};

jsonPlState.validateSysObjExp = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "exp" && this.validateProperties(obj, ["sys", "left", "op", "right"])) {
      var tobj = null;
      if(obj.left !== null) {
         tobj = obj.left;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               return false;
            }
         } else {
            return false;
         }
      } else{
         return false;
      }
      
      if(obj.op !== null) {
         tobj = obj.op;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "op") {
            if(!this.validateSysObjOp(tobj)) {
               return false;
            } else if(tobj.type !== 'exp') {
               return false;
            } else if(!(tobj.v === "+" || tobj.v === "-" || tobj.v === "/" || tobj.v === "*")) {
               return false;
            }
         } else {
            return false;
         }
      } else {
         return false;
      }   
      
      if(obj.right !== null) {
         tobj = obj.right;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               return false;
            }                            
         } else {
            return false;
         }
      } else {
         return false;
      }
      
      return true;
   }
   return false;
};

jsonPlState.validateSysObjCall = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "call" && this.validateProperties(obj, ["sys", "name", "args"])) {
      if(obj.args !== null) {
         for(var i = 0; i < obj.args.length; i++) {
            var tobj = obj.args[i];
            if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
               if(!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
               if(!this.validateSysObjConst(tobj)) {
                  return false;
               }               
            } else {
               return false;
            }
         }
      }
      return true;
   }
   return false;
};

jsonPlState.validateSysObjOp = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "op" && this.validateProperties(obj, ["sys", "type", "v"])) {
      if(!(obj.type === "asgn" || obj.type === "bex" || obj.type === "exp")) {
         return false;
      }
      return true;
   }
   return false;
};

jsonPlState.validateSysObjConst = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "const" && this.validateProperties(obj, ["sys", "val"])) {
      if(!this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

jsonPlState.validateSysObjVar = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "var" && this.validateProperties(obj, ["sys", "name", "val"])) {
      if(!this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

jsonPlState.validateSysObjArg = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "arg" && this.validateProperties(obj, ["sys", "name", "val"])) {
      if(!this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

jsonPlState.validateSysObjVal = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "val" && this.validateProperties(obj, ["sys", "type", "v"])) {
      if(!(obj.type === "int" || obj.type === "float" || obj.type === "string" || obj.type === "bool")) {
         return false;
      }
      return true;
   }
   return false;
};

jsonPlState.validateSysObjRef = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "ref" && this.validateProperties(obj, ["sys", "path"]) && this.isString(obj.path)) {
      return true;
   }
   return false;
};

jsonPlState.validateSysObjReturn = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "return" && this.validateProperties(obj, ["sys", "val"])) {
      if(!this.isSysObjRef(obj.val) && !this.isSysObjConst(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

jsonPlState.validateProperties = function(obj, req) {
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
};

jsonPlState.wr = function(s) {
   if (this.LOGGING === true) {
      console.log(this.WR_PREFIX + s);
   }
};

jsonPlState.isObject = function(arg) {
   if(arg === null) {
      return false;
   } else if(typeof arg === "object") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isArray = function(arg) {
   if (arg === null) {
      return false;
   } else {
      return Array.isArray(arg);
   }
};

jsonPlState.isString = function(arg) {
   if (arg === null) {
      return false;
   } else if (typeof arg === 'string' || arg instanceof String) {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjIf = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "if") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjRef = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "ref") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjBex = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "bex") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjExp = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "exp") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjVal = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "val") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjAsgn = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "asgn") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjConst = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "const") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjVar = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "var") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjCall = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "call") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjFunc = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "func") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjFor = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "for") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObjReturn = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "return") {
      return true;
   } else {
      return false;
   }
};

jsonPlState.isSysObj = function(obj) {
   if (obj !== null && obj.hasOwnProperty("sys") === true && this.isObject(obj) === true) {
      return true;
   } else {
      return false;
   }
};

jsonPlState.getSysObjType = function(obj) {
   if (this.isSysObj(obj) === true) {
      return obj.sys;
   } else {
      return null;
   }
};

jsonPlState.program = code;
jsonPlState.execProgram();