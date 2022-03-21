/*
 * JSON Programming Language
 * EXEC JS
 * Victor G. Brusca 
 * Created on 02/03/2022 1:57 PM EDT
 * Licensed under GNU General Public License v3.0
 */

var code = {
   "sys": "class",
   "name": "test1",
   "call": {"sys": "call", "name": "testFunction2", "args": [{"sys": "ref", "val":{"sys": "val", "type": "int", "v": "#.vars.tmp1"}}]},
   "vars": [
      {
         "sys": "var",
         "name": "tmp1",
         "val": {
            "sys": "val",
            "type": "int",
            "v": 5
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
            {"sys": "call", "name": "testFunction3", "args": [{"sys": "ref", "val":{"sys": "val", "type": "int", "v": "$.args.i1"}}]}
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
            },
            {
               "sys": "var",
               "name": "tmp1",
               "val": {
                  "sys": "val",
                  "type": "int",
                  "v": 5
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
               "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "$.vars.tmp1"}},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.args.i1"}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "$.vars.tmp1"}},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.args.i1"}},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.vars.b1"}},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "bex", "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "$.vars.tmp1"}}, "op": {"sys":"op", "type":"bex", "v":"=="}, "right": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.args.i1"}}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.vars.b1"}},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "bex", "left": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}, "op": {"sys":"op", "type":"bex", "v":"=="}, "right": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.args.i1"}}}
            },
            {
               "sys": "asgn",
               "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.args.i1"}},
               "op": {"sys":"op", "type":"asgn", "v":"="},
               "right": {"sys": "exp", "left": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}, "op": {"sys":"op", "type":"exp", "v":"+"}, "right": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.args.i1"}}}
            }
         ]
      },
      {
         "sys": "func",
         "name": "testFunction3",
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
            {"sys":"return", "val": {"sys": "val", "type": "bool", "v":"true"}}
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
   "lineNumCurrent": 0,
   "lineNumPrev": 0,
   "linNumNext": 0,
   "program": {},
   "LOGGING": true,
   "WR_PREFIX": ""   
};

jsonPlState.processRef = function(objRef, func) {
   var path = null;
   var vls = null;
   var fnd = null;
   var prog = this.program;
   
   if(!this.isSysObjRef(objRef)) {
      this.wr("processRef: Error: argument objRef is not a ref obj");
      return null;                  
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processRef: Error: argument objRef is not a func obj");
      return null;
   }   
   
   if(objRef.val.v.indexOf("#.") === 0) {
      //program/class var
      path = objRef.val.v.substring(2);
      vls = path.split(".");
      if(vls[0] === "vars") {
         fnd = this.findVar(vls[1], prog);
         if(fnd !== null) {
            //this.wr("processRef: found reference result: " + this.wrObj(fnd));
            return fnd;
         } else {
            this.wr("processRef: Error: could not find var with name '" + vls[1] + "' in program func: " + func.name);
            return null;
         }
      } else {
         this.wr("processRef: Error: unsupported path '" + vls + "'");
         return null;
      }
      
   } else if(objRef.val.v.indexOf("$.") === 0) {
      //func var, arg
      path = objRef.val.v.substring(2);
      vls = path.split(".");
      if(vls[0] === "vars") {
         fnd = this.findVar(vls[1], func);
         if(fnd !== null) {
            //this.wr("processRef: found reference result: " + this.wrObj(fnd));            
            return fnd;
         } else {
            this.wr("processRef: Error: could not find var with name '" + vls[1] + "' in func: " + func.name);
            return null;            
         }
      } else if(vls[0] === "args") {
         fnd = this.findArg(vls[1], func);
         if(fnd !== null) {
            //this.wr("processRef: found reference result: " + this.wrObj(fnd));            
            return fnd;
         } else {
            this.wr("processRef: Error: could not find arg with name '" + vls[1] + "' in func: " + func.name);
            return null;            
         }         
      } else {
         this.wr("processRef: Error: unsupported path '" + vls + "'");
         return null;
      }
   }
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

jsonPlState.findFunc = function(name) {
   var prog = this.program;
   for (var i = 0; i < prog.funcs.length; i++) {
      if (prog.funcs[i].name === name) {
         return prog.funcs[i];
      }
   }
   return null;
};

jsonPlState.validateSysObjFor = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "for" && this.validateProperties(obj, ["sys", "start", "stop", "inc", "lines"])) {
      var tobj = null;
      if(obj.start !== null) {
         tobj = obj.start;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as ref");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as const");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as exp");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as bex");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as call");
               return false;
            }            
         } else {
            this.wr("validateSysObjFor: Error: could not validate obj as right");
            return false;
         }
      } else {
         this.wr("validateSysObjFor: Error: could not validate obj as right, null");
         return false;
      }

      if(obj.stop !== null) {
         tobj = obj.stop;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as ref");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as const");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as exp");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as bex");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as call");
               return false;
            }            
         } else {
            this.wr("validateSysObjFor: Error: could not validate obj as right");
            return false;
         }
      } else {
         this.wr("validateSysObjFor: Error: could not validate obj as right, null");
         return false;
      }
      
      if(obj.inc !== null) {
         tobj = obj.inc;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as ref");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as const");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as exp");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as bex");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate right obj as call");
               return false;
            }            
         } else {
            this.wr("validateSysObjFor: Error: could not validate obj as right");
            return false;
         }
      } else {
         this.wr("validateSysObjFor: Error: could not validate obj as right, null");
         return false;
      }      
      
      for(var i = 0; i < obj.lines.length; i++) {
         if(!this.validateSysObjFuncLine(obj.lines[i])) {
            this.wr("validateSysObjFor: Error: could not validate obj as func line: " + i);
            return false;
         }
      }      
      
      return true;
   }
   return false;
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
      } else {
         return false;
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
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
               this.wr("validateSysObjAsgn: Error: could not validate right obj as call");
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
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
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
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
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
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
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
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
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
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "ref" && this.validateProperties(obj, ["sys", "val"])) {
      if(!this.isSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

jsonPlState.validateSysObjReturn = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "return" && this.validateProperties(obj, ["sys", "val"])) {
      if(!this.isSysObjVal(obj.val)) {
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
         this.wr("validateProperties: Error: missing property: " + r);
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

jsonPlState.wrObj = function(s) {
   if (this.LOGGING === true) {
      console.log(this.WR_PREFIX + JSON.stringify(s, null, 2));
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

/*
{
   "sys": "if",
   "left": {},
   "op": {},
   "right": {}
}
*/
jsonPlState.processIf = function(objIf, func) {

};

jsonPlState.processFor = function(objFor, func) {
   var start = null;
   var stop = null;
   var inc = null;
   var line = null;

   if(!this.isSysObjFor(objFor)) {
      this.wr("processFor: Error: argument objRef is not a call func");
      return null;
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processFor: Error: argument func is not a func obj");
      return null;
   }

   start = objFor.start;
   if(this.isSysObjRef(start)) {
      start = this.processRef(start, func);
   } else if(this.isSysObjExp(start)) {
      start = this.processExp(start, func);
   } else {
      this.wr("processFor: Error: argument start unsuppoorted type: " + start.sys);
      return null;
   }

   if(start === null) {
      this.wr("processFor: Error: argument start is null");
      return null;
   }

   stop = objFor.stop;
   if(this.isSysObjRef(stop)) {
      stop = this.processRef(stop, func);
   } else if(this.isSysObjExp(stop)) {
      stop = this.processExp(stop, func);
   } else {
      this.wr("processFor: Error: argument stop unsuppoorted type: " + stop.sys);
      return null;
   }

   if(stop === null) {
      this.wr("processFor: Error: argument stop is null");
      return null;
   }

   inc = objFor.inc;
   if(this.isSysObjRef(inc)) {
      inc = this.processRef(inc, func);
   } else if(this.isSysObjExp(inc)) {
      inc = this.processExp(inc, func);
   } else {
      this.wr("processFor: Error: argument inc unsuppoorted type: " + inc.sys);
      return null;
   }

   if(inc === null) {
      this.wr("processFor: Error: argument inc is null");
      return null;
   }

   if(start.val.type !== "int") {
      this.wr("processFor: Error: argument start unsuppoorted type: " + start.sys);
      return null;

   } else if(stop.val.type !== "int") {
      this.wr("processFor: Error: argument stop unsuppoorted type: " + stop.sys);
      return null;

   } else if(inc.val.type !== "int") {
      this.wr("processFor: Error: argument inc unsuppoorted type: " + inc.sys);
      return null;
   }

   var res = {};
   res.sys = "val";
   res.type = "bool";
   res.v = true;

   for(var i = start.val.v; i < stop.val.v; i++) {
      for(var j = 0; j < objFor.lines.length; j++) {
         line = objFor.lines[i];
      
         if(this.isSysObjAsgn(line)) {
            this.processAsgn(line, func);
         
         } else if(this.isSysObjCall(line)) {
            this.processCall(line, func);
      
         } else if(this.isSysObjFor(line)) {
            this.processFor(line, func);         
      
         } else if(this.isSysObjIf(line)) {
            this.processIf(line, func);

         }
      }
   }
   
   return res;
};

//returns objVal
jsonPlState.processAsgn = function(objAsgn, func) {
   var left = null;
   var op = null;
   var right = null;

   if(!this.isSysObjAsgn(objAsgn)) {
      this.wr("processAsgn: Error: argument objRef is not a asgn obj");
      return null;
      
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processAsgn: Error: argument func is not a func obj");
      return null;
   }
   
   left = objAsgn.left;
   op = objAsgn.op;
   right = objAsgn.right;
   
   left = this.processRef(left, func);
   if(left === null) {
      this.wr("processAsgn: Error: error processing left");
      return null;
   }

   if(this.isSysObjConst(right)) {
      //do nothing      
   } else if(this.isSysObjRef(right)) {      
      right = this.processRef(right, func);
      
   } else if(this.isSysObjBex(right)) {
      right = this.processBex(right, func);
      
   } else if(this.isSysObjExp(right)) {
      right = this.processExp(right, func);
      
   } else if(this.isSysObjCall(right)) {      
      right = this.processCall(right, func);
      
   } else {
      this.wr("processAsgn: Error: argument right is an unknown obj: " + this.getSysObjType(right));
      return null;
   }
   
   if(right === null) {
      this.wr("processAsgn: Error: error processing right");
      return false;
   }   
   
   if(left.val.type === right.val.type) {
      left.val.v = right.val.v;

      var res = {};
      res.sys = "val";
      res.type = "bool";
      res.v = true;
      return res;
   } else {
      this.wr("processAsgn: Error: type mismatch: " + left.val.type + " - " + right.val.type);
      return null;      
   }
};

//returns objVal
jsonPlState.processBex = function(objBex, func) {
   var left = null;
   var op = null;
   var right = null;

   if(!this.isSysObjBex(objBex)) {
      this.wr("processBex: Error: argument objRef is not a asgn obj");
      return null;
      
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processBex: Error: argument func is not a func obj");
      return null;
   }
   
   left = objBex.left;
   op = objBex.op;
   right = objBex.right;
      
   if(this.isSysObjRef(left)) {
      left = this.processRef(left, func);
      
   } else if(this.isSysObjBex(left)) {
      left = this.processBex(left, func);
      
   } else if(this.isSysObjExp(left)) {
      left = this.processExp(left, func);
      
   } else if(this.isSysObjCall(left)) {      
      left = this.processCall(left, func);
      
   } else {
      this.wr("processBex: Error: argument left must be a ref obj");
      return null;
   }
   
   if(left === null) {
      this.wr("processBex: Error: error processing left");
      return null;
   }

   if(this.isSysObjRef(right)) {      
      right = this.processRef(right, func);
      
   } else if(this.isSysObjBex(right)) {
      right = this.processBex(right, func);
      
   } else if(this.isSysObjExp(right)) {
      right = this.processExp(right, func);
      
   } else if(this.isSysObjCall(right)) {      
      right = this.processCall(right, func);

   } else {
      this.wr("processBex: Error: argument right is an unknown obj: " + this.getSysObjType(right));
      return null;
   }
   
   if(right === null) {
      this.wr("processBex: Error: error processing right");
      return null;
   }   
   
   if(left.val.type === right.val.type) {
      var ret = {};
      ret.sys = "val";
      ret.type = "bool";
      ret.v = null;
      
      if(op.v === "==") {
         if(left.val.v === right.val.v) {
            ret.v = true;
         } else {
            ret.v = false;
         }
         return ret;
         
      } else if(op.v === "!=") {
         if(left.val.v !== right.val.v) {
            ret.v = true;
         } else {
            ret.v = false;
         }
         return ret;
         
      } else if(op.v === "<") {
         if(left.val.v < right.val.v) {
            ret.v = true;
         } else {
            ret.v = false;
         }
         return ret;
         
      } else if(op.v === ">") {         
         if(left.val.v > right.val.v) {
            ret.v = true;
         } else {
            ret.v = false;
         }
         return ret;
         
      } else if(op.v === "<=") {         
         if(left.val.v <= right.val.v) {
            ret.v = true;
         } else {
            ret.v = false;
         }
         return ret;
         
      } else if(op.v === ">=") {         
         if(left.val.v >= right.val.v) {
            ret.v = true;
         } else {
            ret.v = false;
         }
         return ret;
         
      } else {
         this.wr("processBex: Error: unknown operator: " + op.v);
         return null;               
      }
   } else {
      this.wr("processBex: Error: type mismatch: " + left.val.type + " - " + right.val.type);
      return null;
   }
   
   return null;
};

//returns objVal
jsonPlState.processFunc = function(objFunc) {
   if(!this.isSysObjFunc(objFunc)) {
      this.wr("processFunc: Error: argument objRef is not a call func");
      return null;
   }

   var func = objFunc;
   var line = null;
   for(var i = 0; i < objFunc.lines.length; i++) {
      line = objFunc.lines[i];
      
      if(this.isSysObjAsgn(line)) {
         this.processAsgn(line, objFunc);
         
      } else if(this.isSysObjCall(line)) {
         this.processCall(line, objFunc);
      
      } else if(this.isSysObjFor(line)) {
         this.processFor(line, objFunc);         
      
      } else if(this.isSysObjIf(line)) {
         this.processIf(line, objFunc);
      
      } else if(this.isSysObjReturn(line)) {
         if(line.val.type === objFunc.ret.type) {
            objFunc.ret = line.val;
            
         } else {
            this.wr("processFunc: Error: argument return value is not the correct type: " + line.val.type + " instead of " + objFunc.ret.type);
            return null;
         }
      }
   }
   
   return objFunc.ret;
};

//returns objVal
jsonPlState.processCall = function(objCall, func) {
   var name = null;
   var args = null;
   var funcDef = null;
   var funcArgs = null;
   var tmpArg = null;   
   var res = null;
   
   if(!this.isSysObjCall(objCall)) {
      this.wr("processCall: Error: argument objRef is not a call obj");
      return null;
      
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processCall: Error: argument func is not a func obj");
      return null;
   }
   
   name = objCall.name;
   args = objCall.args;
   funcDef = this.findFunc(name);
   if(funcDef !== null) {
      funcArgs = funcDef.args;
      
   } else {
      this.wr("processCall: Error: no function found with name: " + name);
      return null;
   }
   
   if(funcArgs !== null) {
      if(args.length === funcArgs.length) {         
         for(var i = 0; i < args.length; i++) {
            if(args[i].val.type !== funcArgs[i].val.type) {
               this.wr("processCall: Error: type mismatch at argument index, " + i + ", func arg def: " + funcArgs[i].val.type + ", call arg: " + args[i].val.type);
               return null;
            }
            
            if(this.isSysObjRef(args[i])) {
               tmpArg = null;
               tmpArg = this.processRef(args[i], func);
               if(tmpArg !== null) {
                  args[i].val.v = tmpArg.val.v;
               } else {
                  this.wr("processCall: Error: could not process argument index, " + i + ", with path: " + args[i].val.v);
                  return null;
               }
            }
         }
         
         //backup default args
         funcDef.args_def = funcDef.args;
         funcDef.args = args;
         
         //backup default ret
         funcDef.ret_def = funcDef.ret;
         
         //res = this.processFunc(funcDef);
         
         //restore args and ret
         funcDef.args = funcDef.args_def;
         funcDef.ret = funcDef.ret_def;
         
         return res;
      } else {
         this.wr("processCall: Error: function argument length mismatch, func arg def: " + funcArgs.length + ", call arg: " + args.length);
         return null;         
      }
   } else {
      this.wr("processCall: Error: function arguments is null");               
      return null;
   }      
};

//returns objVal
jsonPlState.processExp = function(objExp, func) {
   var left = null;
   var op = null;
   var right = null;

   if(!this.isSysObjExp(objExp)) {
      this.wr("processExp: Error: argument objRef is not a asgn obj");
      return null;
      
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processExp: Error: argument func is not a func obj");
      return null;
   }
   
   left = objExp.left;
   op = objExp.op;
   right = objExp.right;
      
   if(this.isSysObjRef(left)) {
      left = this.processRef(left, func);
      
   } else if(this.isSysObjBex(left)) {
      left = this.processBex(left, func);
      
   } else if(this.isSysObjExp(left)) {
      left = this.processExp(left, func);
      
   } else if(this.isSysObjCall(left)) {      
      left = this.processCall(left, func);
      
   } else {
      this.wr("processBex: Error: argument left must be a ref obj");
      return null;
   }
   
   if(left === null) {
      this.wr("processBex: Error: error processing left");
      return null;
   }

   if(this.isSysObjRef(right)) {      
      right = this.processRef(right, func);
      
   } else if(this.isSysObjBex(right)) {
      right = this.processBex(right, func);
      
   } else if(this.isSysObjExp(right)) {
      right = this.processExp(right, func);
      
   } else if(this.isSysObjCall(right)) {      
      right = this.processCall(right, func);
      
   } else {
      this.wr("processBex: Error: argument right is an unknown obj: " + this.getSysObjType(right));
      return null;
   }
   
   if(right === null) {
      this.wr("processBex: Error: error processing right");
      return null;
   }   
   
   if(left.val.type === right.val.type) {
      var ret = {};
      ret.sys = "val";
      ret.type = left.val.type;
      ret.v = null;
      
      if(op.v === "+") {
         ret.v = left.val.v + right.val.v;
         return ret;
         
      } else if(op.v === "-") {
         ret.v = left.val.v - right.val.v;
         return ret;
         
      } else if(op.v === "/") {
         if(right.val.v !== 0) {
            this.wr("processExp: Error: divide by zero error");
            return null;
            
         } else {
            ret.v = left.val.v / right.val.v;
         }
         return ret;
         
      } else if(op.v === "*") {
         ret.v = left.val.v * right.val.v;
         return ret;
         
      } else {
         this.wr("processExp: Error: unknown operator: " + op.v);
         return null;               
      }
   } else {
      this.wr("processExp: Error: type mismatch: " + left.val.type + " - " + right.val.type);
      return null;
   }
   
   return null;
};

jsonPlState.program = code;
jsonPlState.processRef({"sys": "ref", "val":{"sys": "val", "type": "int", "v": "#.vars.tmp1"}}, code.funcs[0]);
jsonPlState.processRef({"sys": "ref", "val":{"sys": "val", "type": "int", "v": "$.args.i1"}}, code.funcs[0]);
jsonPlState.processRef({"sys": "ref", "val":{"sys": "val", "type": "int", "v": "$.vars.b1"}}, code.funcs[0]);

var res = null;
var tmp = {
   "sys": "asgn",
   "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "$.args.i1"}},
   "op": {"sys":"op", "type":"asgn", "v":"="},
   "right": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.vars.tmp1"}}
};
jsonPlState.processAsgn(tmp, code.funcs[0]);
jsonPlState.wrObj(code.funcs[0].args);

tmp = {
   "sys": "bex", 
   "left": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}, 
   "op": {"sys":"op", "type":"bex", "v":"=="}, 
   "right": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "$.args.i1"}}
};
res = jsonPlState.processBex(tmp, code.funcs[0]);
jsonPlState.wrObj(res);

tmp = {
   "sys": "exp", 
   "left": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 25}}, 
   "op": {"sys":"op", "type":"exp", "v":"+"}, 
   "right": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "$.args.i1"}}
};
res = jsonPlState.processExp(tmp, code.funcs[0]);
jsonPlState.wrObj(res);

tmp = {
   "sys": "call", 
   "name": "testFunction2", 
   "args": [
      {
         "sys": "ref", 
         "val":{
            "sys": "val", 
            "type": "int", 
            "v": "#.vars.tmp1"
         }
      }
   ]   
};
res = jsonPlState.processCall(tmp, code.funcs[0]);
jsonPlState.wrObj(res);

tmp = {
   "sys": "return",
   "val":{
      "sys": "val", 
      "type": "int", 
      "v": "202"
   }
};

