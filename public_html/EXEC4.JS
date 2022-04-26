/**
 * JSON Programming Language
 * EXEC JS
 * Victor G. Brusca 
 * Created on 02/03/2022 1:57 PM EDT
 * Licensed under GNU General Public License v3.0
 */

/** 
 * Name: jsonPlState
 * Desc: Main object. Programming language state.
 */
function jsonPlState() {
   this.version = "0.5.1";
   this.lineNumCurrent = 0;
   this.lineNumPrev = 0;
   this.linNumNext = 0;
   
   this.lastForReturn = null;
   this.lastIfReturn = null;
   
   this.lastBexReturn = null;   
   this.lastExpReturn = null;
   
   this.lastAsgnReturn = null;
   this.lastAsgnValue = null;
   
   this.lastProgramReturn = null;
   this.program = {};
   this.LOGGING = true;
   this.WR_PREFIX = "";
}

/**
 * Name: sysWr
 * Desc: A system level write function.
 * Arg1: args(arg obj, sys=arg & array of)
 * Returns: {(const obj, sys=const)}
 */
jsonPlState.prototype.sysWr = function(args) {
   var s = args[0].val.v;
   console.log("sysWr: " + s);

   var ret = {};
   ret.sys = "val";
   ret.type = "bool";
   ret.v = "true";
   
   var ret2 = {};
   ret2.sys = "const";
   ret2.val = ret;   
   ret = ret2;   
   
   return ret;
};

/**
 * Name: sysGetLastAsgnValue
 * Desc: A system level method to access the last asgn value object.
 * Returns: {(const obj, sys=const)}
 */
jsonPlState.prototype.sysGetLastAsgnValue = function() {   
   return this.lastAsgnValue;
};

/**
 * Name: sysGetLastAsgnValue
 * Desc: A system level method to access the last exp return object.
 * Returns: {(const obj, sys=const)}
 */
jsonPlState.prototype.sysGetLastExpReturn = function() {   
   return this.lastExpReturn;
};

/**
 * Name: getConstBool
 * Desc: A method to quickly access a constant bool value object.
 * Returns: {(const obj, sys=const)}
 */
jsonPlState.prototype.getConstBool = function() {
   var ret = {};
   ret.sys = "val";
   ret.type = "bool";
   ret.v = "false";
   
   var ret2 = {};
   ret2.sys = "const";
   ret2.val = ret;   
   ret = ret2;   
   
   return ret; 
};

/**
 * Name: sysJob1
 * Desc: A system level job method used to demonstrate JCL.
 * Arg1: args(arg obj, sys=arg & array of)
 * Returns: {(const obj, sys=const)}
 */
jsonPlState.prototype.sysJob1 = function(args) {
   this.wr("sysJob1");
   var ret = this.getConstBool();
   ret.val.v = "true";
   return ret;
};

/**
 * Name: sysJob2
 * Desc: A system level job method used to demonstrate JCL.
 * Arg1: args(arg obj, sys=arg & array of)
 * Returns: {(const obj, sys=const)}
 */
jsonPlState.prototype.sysJob2 = function(args) {
   this.wr("sysJob2");
   var ret = this.getConstBool();
   ret.val.v = "true";
   return ret;
};

/**
 * Name: sysJob3
 * Desc: A system level job method used to demonstrate JCL.
 * Arg1: args(arg obj, sys=arg & array of)
 * Returns: {(const obj, sys=const)}
 */
jsonPlState.prototype.sysJob3 = function(args) {
   this.wr("sysJob3");
   var ret = this.getConstBool();
   ret.val.v = "true";
   return ret;
};

/**
 * Name: system
 * Desc: Define system functions.
 */
jsonPlState.prototype.system = {   
   "functions":[
      {
         "sys": "func", 
         "name": "SYS::getLastExpReturn",
         "fname": "sysGetLastExpReturn",
         "args": [
         ]
      },   
      {
         "sys": "func", 
         "name": "SYS::getLastAsgnValue",
         "fname": "sysGetLastAsgnValue",
         "args": [
         ]
      },   
      {
         "sys": "func", 
         "name": "SYS::wr",
         "fname": "sysWr",
         "args": [   
            {
               "sys": "arg",
               "name": "s",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            }
         ]
      },
      {
         "sys": "func", 
         "name": "SYS::job1",
         "fname": "sysJob1",
         "args": []
      },
      {
         "sys": "func", 
         "name": "SYS::job2",
         "fname": "sysJob2",
         "args": []
      },
      {
         "sys": "func", 
         "name": "SYS::job3",
         "fname": "sysJob3",
         "args": []
      }            
   ]
};

/**
 * Name: runProgram
 * Desc: Executes the current program and returns the result.
 * Returns: {(some sys obj)}
 */
jsonPlState.prototype.runProgram = function() {
   if(this.validateSysObjClass(this.program)) {
      var callObj = this.program.call;
      var callFuncName = callObj.name;
      this.wr("runProgram: RUN PROGRAM: " + callFuncName);
      var callFunc = this.findFunc(callFuncName);   
      var ret = this.processCall(callObj, callFunc);
      this.lastProgramReturn = ret;
      //this.wrObj(res); 
      return ret;
   } else {
      this.wr("runProgram: Error: could not validate the class object.");
      return null;
   }
};

/////////////////////////SEARCH METHODS
/**
 * Name: findArg
 * Desc: Search the provided object for an argument with the given name.
 * Arg1: name(string to find)
 * Arg2: obj(func obj, sys=func)
 * Returns: {null | (arg obj, sys=arg)}
 */
jsonPlState.prototype.findArg = function(name, obj) {
   for (var i = 0; i < obj.args.length; i++) {
      if (obj.args[i].name === name) {
         return obj.args[i];
      }
   }
   return null;
};

/**
 * Name: findVar
 * Desc: Search the provided object for a variable with the given name.
 * Arg1: name(string to find)
 * Arg2: obj{(func obj, sys=func) | (class obj, sys=class)}
 * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
 */
jsonPlState.prototype.findVar = function(name, obj) {
   for (var i = 0; i < obj.vars.length; i++) {
      if (obj.vars[i].name === name) {
         return obj.vars[i];
      }
   }
   return null;
};

/**
 * Name: findFunc
 * Desc: Search the current program for a func with the given name.
 * Arg1: name(string to find)
 * Returns: {null | (func obj, sys=func)}
 */
jsonPlState.prototype.findFunc = function(name) {
   var prog = this.program;
   for (var i = 0; i < prog.funcs.length; i++) {
      if (prog.funcs[i].name === name) {
         return prog.funcs[i];
      }
   }
   return null;
};

/**
 * Name: findSysFunc
 * Desc: Search the current program's sytem functions for a func with the given name.
 * Arg1: name(string to find)
 * Returns: {null | (func obj, sys=func)}
 */
jsonPlState.prototype.findSysFunc = function(name) {
   var prog = this;
   for (var i = 0; i < prog.system.functions.length; i++) {
      if (prog.system.functions[i].name === name) {
         return prog.system.functions[i];
      }
   }
   return null;
};

/////////////////////////VALIDATION METHODS
/**
 * Name: validateSysObjIf
 * Desc: Validates if the given object is a valid if sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-
      {
         "sys": "if",
         "left": {ref | const | exp | bex | call},
         "op": {op & type of bex},
         "right": {ref | const | exp | bex | call},
         "thn": [asgn | if | for | call | return],
         "els": [asgn | if | for | call | return]
      }
   -!>
 */
jsonPlState.prototype.validateSysObjIf = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "if" && this.validateProperties(obj, ["sys", "left", "op", "right", "thn", "els"])) {
      var tobj = null;
      if(obj.left !== null) {
         tobj = obj.left;
         if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
            if(!this.validateSysObjRef(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate left obj as ref");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate left obj as const");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate left obj as exp");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate left obj as bex");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
               this.wr("validateSysObjFor: Error: could not validate left obj as call");
               return false;
            }            
         } else {
            this.wr("validateSysObjFor: Error: could not validate obj as left");
            return false;
         }
      } else {
         this.wr("validateSysObjIf: Error: could not validate obj as left, null");
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
               this.wr("validateSysObjIf: Error: could not validate right obj as ref");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
            if(!this.validateSysObjConst(tobj)) {
               this.wr("validateSysObjIf: Error: could not validate right obj as const");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
            if(!this.validateSysObjExp(tobj)) {
               this.wr("validateSysObjIf: Error: could not validate right obj as exp");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
            if(!this.validateSysObjBex(tobj)) {
               this.wr("validateSysObjIf: Error: could not validate right obj as bex");
               return false;
            }
         } else if(this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
            if(!this.validateSysObjCall(tobj)) {
               this.wr("validateSysObjIf: Error: could not validate right obj as call");
               return false;
            }            
         } else {
            this.wr("validateSysObjIf: Error: could not validate obj as right");
            return false;
         }
      } else {
         this.wr("validateSysObjIf: Error: could not validate obj as right, null");
         return false;
      }

      if(obj.thn !== null && this.isArray(obj.thn)) {
         tobj = obj.thn;
         var len = tobj.length;
         for(var i = 0; i < len; i++) {
            if(!this.validateSysObjFuncLine(tobj[i])) {
               this.wr("validateSysObjIf: Error: could not validate obj as then, line: " + i);
               return false;
            }
         }
      }

      if(obj.els !== null && this.isArray(obj.els)) {
         tobj = obj.els;
         var len = tobj.length;
         for(var i = 0; i < len; i++) {
            if(!this.validateSysObjFuncLine(tobj[i])) {
               this.wr("validateSysObjIf: Error: could not validate obj as else, line: " + i);
               return false;
            }
         }
      }

      return true;
   }
   return false;
};

/**
 * Name: validateSysObjFor
 * Desc: Validates if the given object is a valid for sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-
      {
         "sys": "for",
         "start": {ref | const | exp | bex | call & type of int},
         "stop": {ref | const | exp | bex | call & type of int},
         "inc": {ref | const | exp | bex | call & type of int},
         "lines": [asgn | if | for | call | return]
      }
   -!>
 */
jsonPlState.prototype.validateSysObjFor = function(obj) {
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
            this.wr("validateSysObjFor: Error: could not validate obj as func, line: " + i);
            return false;
         }
      }      
      
      return true;
   }
   return false;
};

/**
 * Name: validateSysObjClass
 * Desc: Validates if the given object is a valid class sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
   {
      "sys": "class",
      "name": "some name",
      "call": {call},
      "vars": [var],
      "funcs": [func],
      "ret": {val}
   }
   -!>
 */
jsonPlState.prototype.validateSysObjClass = function(obj) {
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

/**
 * Name: validateSysObjFuncLine
 * Desc: Validates if the given object is a valid function line sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
   [asgn | for | if | return | call]
   -!>
 */
jsonPlState.prototype.validateSysObjFuncLine = function(obj) {
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

/**
 * Name: validateSysObjFunc
 * Desc: Validates if the given object is a valid func sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "func",
         "name": "some name",
         "args": [arg], 
         "vars": [var],
         "ret": {val},
         "lines": [asgn | for | if | return | call]
      }
   -!>
 */
jsonPlState.prototype.validateSysObjFunc = function(obj) {
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

/**
 * Name: validateSysObjAsgn
 * Desc: Validates if the given object is a valid asgn sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "asgn",
         "left": {ref},
         "op": {op & type of asgn}, 
         "right": {ref | const | exp | bex | call}
      }
   -!>
 */
jsonPlState.prototype.validateSysObjAsgn = function(obj) {
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

/**
 * Name: validateSysObjBex
 * Desc: Validates if the given object is a valid bex sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "bex",
         "left": {ref | const | exp | bex | call},
         "op": {op & type of bex}, 
         "right": {ref | const | exp | bex | call}
      }
   -!>
 */
jsonPlState.prototype.validateSysObjBex = function(obj) {
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

/**
 * Name: validateSysObjExp
 * Desc: Validates if the given object is a valid exp sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "exp",
         "left": {ref | const | exp | bex | call},
         "op": {op & type of exp}, 
         "right": {ref | const | exp | bex | call}
      }
   -!>
 */
jsonPlState.prototype.validateSysObjExp = function(obj) {
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

/**
 * Name: validateSysObjCall
 * Desc: Validates if the given object is a valid call sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "call", 
         "name": "some name", 
         "args": [ref | const]
      }
   -!>
 */
jsonPlState.prototype.validateSysObjCall = function(obj) {
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

/**
 * Name: validateSysObjCall
 * Desc: Validates if the given object is a valid call sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "op", 
         "type": "asgn | bex | exp", 
         "v": "some valid op value"
      }
   -!>
 */
jsonPlState.prototype.validateSysObjOp = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "op" && this.validateProperties(obj, ["sys", "type", "v"])) {
      if(!(obj.type === "asgn" || obj.type === "bex" || obj.type === "exp")) {
         return false;
      }
      return true;
   }
   return false;
};

/**
* Name: validateSysObjArray
* Desc: Validates if the given object is a valid array sys object.
* Arg1: obj(sys obj to check)
* Returns: {false | true}
* Struct: <!-  
   {
      "sys": "array",
      "name": "a1",
      "len": #,
      "val": {
         "sys": "val",
         "type": "int",
         "v": [some_array]
      }
   }
  -!>
 */
jsonPlState.prototype.validateSysObjArray = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "array" && this.validateProperties(obj, ["sys", "name", "len", "val"])) {
      if(!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

/**
 * Name: validateSysObjConst
 * Desc: Validates if the given object is a valid const sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "const", 
         "val": {val}
      }
   -!>
 */
jsonPlState.prototype.validateSysObjConst = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "const" && this.validateProperties(obj, ["sys", "val"])) {
      if(!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

/**
 * Name: validateSysObjVar
 * Desc: Validates if the given object is a valid var sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "var",
         "name": "some name",
         "val": {val}
      }
   -!>
 */
jsonPlState.prototype.validateSysObjVar = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "var" && this.validateProperties(obj, ["sys", "name", "val"])) {
      if(!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

/**
 * Name: validateSysObjArg
 * Desc: Validates if the given object is a valid arg sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "arg",
         "name": "some name",
         "val": {val}
      }
   -!>
 */
jsonPlState.prototype.validateSysObjArg = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "arg" && this.validateProperties(obj, ["sys", "name", "val"])) {
      if(!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

/**
 * Name: validateSysObjVal
 * Desc: Validates if the given object is a valid val sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "val",
         "type": "int | float | string | bool & type of string",
         "v": "some valid value"
      }
   -!>
 */
jsonPlState.prototype.validateSysObjVal = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "val" && this.validateProperties(obj, ["sys", "type", "v"])) {
      if(!(obj.type === "int" || obj.type === "float" || obj.type === "string" || obj.type === "bool" || obj.type === "array")) {
         return false;
      }
      return true;
   }
   return false;
};

/**
 * Name: validateSysObjRef
 * Desc: Validates if the given object is a valid ref sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "ref",
         "val": {val}
      }  
   -!>(with value like #.vars.tmp1 or $.vars.tmp1)
 */
jsonPlState.prototype.validateSysObjRef = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "ref" && this.validateProperties(obj, ["sys", "val"])) {
      if(!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

/**
 * Name: validateSysObjReturn
 * Desc: Validates if the given object is a valid return sys object.
 * Arg1: obj(sys obj to check)
 * Returns: {false | true}
 * Struct: <!-  
      {
         "sys": "return",
         "val": {val}
      }  
   -!>
 */
jsonPlState.prototype.validateSysObjReturn = function(obj) {
   if(this.isSysObj(obj) && this.getSysObjType(obj) === "return" && this.validateProperties(obj, ["sys", "val"])) {
      if(!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
         return false;
      }
      return true;
   }
   return false;
};

/**
 * Name: validateProperties
 * Desc: Validates if the given object has each of the array elements soecified in req.
 * Arg1: obj(sys obj to check)
 * Arg2: req(array of attribute name to check for)
 * Returns: {false | true}
 */
jsonPlState.prototype.validateProperties = function(obj, req) {
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

/////////////////////////UTILITY METHODS
/**
 * Name: wr
 * Desc: Writes a string to standard output if LOGGING is on.
 *       Sets the WR_PREFIX to each string written. 
 * Arg1: s(string to write)
 */
jsonPlState.prototype.wr = function(s) {
   if (this.LOGGING === true) {
      console.log(this.WR_PREFIX + s);
   }
};

/**
 * Name: getVersion
 * Desc: A method to access the version of this JsonPL interpreter.
 * Returns: {(string version number)}
 */
jsonPlState.prototype.getVersion = function() {
   this.wr(this.version);
   return this.version;
};

/**
 * Name: cloneJsonObj
 * Desc: A method to clone the given JSON object argument.
 * Arg1: jsonObj(the JSON object to clone)
 * Returns: {(cloned JSON object)}
 */
jsonPlState.prototype.cloneJsonObj = function(jsonObj) {
   return JSON.parse(JSON.stringify(jsonObj));
};

/**
 * Name: wrObj
 * Desc: Writes a JSON object to standard output if LOGGING is on.
 *       Sets the WR_PREFIX to each object written.
 *       Prints object using pretty JSON.stringify call. 
 * Arg1: s(string to write)
 */
jsonPlState.prototype.wrObj = function(s) {
   if (this.LOGGING === true) {
      console.log(this.WR_PREFIX + JSON.stringify(s, null, 2));
   }
};

/////////////////////////GENERIC OBJECT ID METHODS
/**
 * Name: isObject
 * Desc: Checks if the given argument is a JSON object. 
 * Arg1: arg(JSON object)
 * Returns: (true | false)
 */
jsonPlState.prototype.isObject = function(arg) {
   if(arg === null) {
      return false;
   } else if(typeof arg === "object") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isArray
 * Desc: Checks if the given argument is an array. 
 * Arg1: arg(javascript array)
 * Returns: (true | false)
 */
jsonPlState.prototype.isArray = function(arg) {
   if (arg === null) {
      return false;
   } else {
      return Array.isArray(arg);
   }
};

/**
 * Name: isString
 * Desc: Checks if the given argument is a string. 
 * Arg1: arg(some string)
 * Returns: (true | false)
 */
jsonPlState.prototype.isString = function(arg) {
   if (arg === null) {
      return false;
   } else if (typeof arg === 'string' || arg instanceof String) {
      return true;
   } else {
      return false;
   }
};

/////////////////////////SYS OBJECT ID METHODS
/**
 * Name: isSysObjIf
 * Desc: Checks if the given object is an if sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjIf = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "if") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjRef
 * Desc: Checks if the given object is a ref sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjRef = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "ref") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjBex
 * Desc: Checks if the given object is a bex sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjBex = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "bex") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjExp
 * Desc: Checks if the given object is an exp sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjExp = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "exp") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjVal
 * Desc: Checks if the given object is a val sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjVal = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "val") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjAsgn
 * Desc: Checks if the given object is an asgn sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjAsgn = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "asgn") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjArray
 * Desc: Checks if the given object is an array sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjArray = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "array") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjConst
 * Desc: Checks if the given object is a const sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjConst = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "const") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjVar
 * Desc: Checks if the given object is a var sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjVar = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "var") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjCall
 * Desc: Checks if the given object is a call sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjCall = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "call") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjFunc
 * Desc: Checks if the given object is a func sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjFunc = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "func") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjFor
 * Desc: Checks if the given object is a for sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjFor = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "for") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObjReturn
 * Desc: Checks if the given object is a return sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObjReturn = function(obj) {
   if (this.isSysObj(obj) === true && obj.sys === "return") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: isSysObj
 * Desc: Checks if the given object is a sys object. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.isSysObj = function(obj) {
   if (obj !== null && obj.hasOwnProperty("sys") === true && this.isObject(obj) === true) {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: getSysObjType
 * Desc: Gets the value of the sys attribute of the given sys object.. 
 * Arg1: obj(sys obj to check)
 * Returns: (true | false)
 */
jsonPlState.prototype.getSysObjType = function(obj) {
   if (this.isSysObj(obj) === true) {
      return obj.sys;
   } else {
      return null;
   }
};

/////////////////////////PROCESS METHODS
/**
 * Name: processRef
 * Desc: Processes a class var or func var or arg reference string.
 * Arg1: objRef(string ref encoding)
 * Arg2: func(func obj, sys=func)
 * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
 */
jsonPlState.prototype.processRef = function(objRef, func) {
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
   
   //this.wr("OBJ REF");
   //this.wrObj(objRef);
   path = (objRef.val.v + "");   
   //this.wr("===============================================Found path: " + path);
   vls = path.split(".");
   
   var inDynRef = false;
   var nvls = [];
   var tt = null;
   for(var k = 0; k < vls.length; k++) {
      //this.wr("___________________________________:"+ vls[k].indexOf("["));
      if(inDynRef && vls[k].indexOf("]") !== -1) {    
         inDynRef = false;
         tt += "." + vls[k];
         nvls.push(tt);         
      } else if(!inDynRef && vls[k].indexOf("[") !== -1) {
         inDynRef = true;
         tt = vls[k];
      } else if(inDynRef) {
         tt += "." + vls[k];
      } else {
         if(vls[k] !== null) {
            nvls.push(vls[k]);
         }
      }
   }
      
   vls = [];
   for(var k = 0; k < nvls.length; k++) {
      if(nvls[k] !== null) {
         vls[k] = nvls[k];
      }
   }
         
   var foundSource = false;
   var isFunc = false;
   var foundType = false;   
   var isVars = false;
   var foundName = false;   
   var name = null;
   var itm = null;
   var foundIndex = false;
   var idx = -1;
   var type = null;
   
   //this.wr("===============================================Found entries: " + vls.length);
   for(var k = 0; k < vls.length; k++) {      
      var c = vls[k];
      //this.wr("===============================================Found entry: " + k + ", " + vls[k]);      
      
      if(!foundSource) {
         //program/class         
         if(c === '#') {
            isFunc = false;
            foundSource = true;
         } else if(c === '$') {
            isFunc = true;
            foundSource = true;
         } else {
            this.wr("processRef: Error: could not find correct the ref, for source, " + c);
         }
      } else if(!foundType) { 
         //program/class
         if(!isFunc) {
            if(c === 'vars') {
               isVars = true;
               foundType = true;
            } else {
               this.wr("processRef: Error: could not find, for type, " + c + ", for source isFunc = " + isFunc);
            }
         //function
         } else if(isFunc) {
            if(c === 'vars') {
               isVars = true;               
               foundType = true;
            } else if(c === 'args') {
               isVars = false;
               foundType = true;               
            } else {
               this.wr("processRef: Error: could not find, for type, " + c + ", for source isFunc = " + isFunc);
            }
         } else {
            //err
         }         
      } else if(!foundName) {
         //program/class
         name = c;
         var tmp = null;
         //lookup use of string var here
         if(c.indexOf('[') === 0) {
            var nc = c.replace('[', '');
            nc = nc.replace(']', '');

            tmp = {};
            tmp.sys = "ref";
            tmp.val = {};
            tmp.val.sys = "val";
            tmp.val.type = "string";
            tmp.val.v = nc;
            
            tmp = this.processRef(tmp, func);
            if(tmp !== null && tmp.val.type === 'string') {
               name = this.toStr(tmp.val.v);
            } else {
               this.wr("processRef: Error: could not lookup object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
            }
         }
              
         //this.wr("processRef: looking for name: " + name);
         if(!isFunc) {
            //class find name            
            if(isVars) {
               fnd = this.findVar(name, prog);
            } else {
               this.wr("processRef: Error: could not find, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
            }
         //function
         } else {
            //function find name
            if(isVars) {
               fnd = this.findVar(name, func);
            } else {
               fnd = this.findArg(name, func);
            }            
         }
         
         if(fnd !== null) {
            type = fnd.val.type;
         } else {
            this.wr("processRef: Error: could not find an object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
         }
      } else if(!foundIndex) {
         idx = this.toInt(c);
         //lookup use of string var here
         if(c.indexOf('[') === 0) {
            var nc = c.replace('[', '');
            nc = nc.replace('\\]', '');
            
            tmp = {};
            tmp.sys = "ref";
            tmp.val = {};
            tmp.val.sys = "val";
            tmp.val.type = "string";
            tmp.val.v = nc;
            
            tmp = this.processRef(tmp, func);
            if(tmp !== null && tmp.val.type === 'string') {
               idx = this.toStr(tmp.val.v + "");
            } else {
               this.wr("processRef: Error: could not lookup object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
            }
         }         
         
         if(type === 'array') {
            fnd = fnd.val.v[this.toInt(idx)];
         } else {
               this.wr("processRef: Error: index entry is only for vars/args of type array, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
         }
      }      
   }
   return fnd;
   
   /*
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
            //this.wrObj(func.args);
            return fnd;
         } else {
            this.wr("processRef: Error: could not find arg with name '" + vls[1] + "' in func: " + func.name);
            //this.wrObj(func.args);
            return null;            
         }         
      } else {
         this.wr("processRef: Error: unsupported path '" + vls + "'");
         return null;
      }
   }
   return null;
   */
};

//TODO
jsonPlState.prototype.toBoolInt = function(v) {
   var vb = v + "";
   vb = vb.toLowerCase();
   if(vb === "true") {
      return 1;
   } else if(vb === "1") {
      return 1;
   } else if(vb === "yes") {
      return 1;
   } else {
      return 0;
   }
};

//TODO
jsonPlState.prototype.toInt = function(v) {
   return parseInt(v);
};

//TODO
jsonPlState.prototype.toFloat = function(v) {
   return parseFloat(v);
};

//TODO
jsonPlState.prototype.toStr = function(v) {
   return String(v + "");
};


//TODO
jsonPlState.prototype.toBool = function(v) {
   var vb = v + "";
   vb = vb.toLowerCase();
   if(vb === "true") {
      return true;
   } else if(vb === "1") {
      return true;
   } else if(vb === "yes") {
      return true;
   } else {
      return false;
   }
};

/**
 * Name: processIf
 * Desc: Processes an if statement. Returns the value of the Boolean if statement expression.
 * Arg1: objIf(if obj, sys=if)
 * Arg2: func(func obj, sys=func)
 * Returns: {null | (const obj, sys=const)}
 */
jsonPlState.prototype.processIf = function(objIf, func) {
   var left = null;
   var op = null;
   var right = null;
   var thn = null;
   var els = null;
             
   if(!this.isSysObjIf(objIf)) {
      this.wr("processFor: Error: argument objIf is not an if obj");
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processFor: Error: argument func is not a func obj");
      return null;
   }

   left = objIf.left;
   op = objIf.op;
   right = objIf.right;
   thn = objIf.thn;
   els = objIf.els;
   
   if(this.isSysObjConst(left)) {
      //do nothing
      
   } else if(this.isSysObjRef(left)) {
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
      
      var ret2 = {};
      ret2.sys = "const";
      
      var ret3 = null;
      
      if(op.v === "==") {
         if(left.val.type === "int") {
            if(parseInt(left.val.v) === parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) === parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) === this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v) === String(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === "!=") {
         if(left.val.type === "int") {
            if(parseInt(left.val.v) !== parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) !== parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) !== this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v) !== String(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === "<") {
         if(left.val.type === "int") {
            if(parseInt(left.val.v) < parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) < parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) < this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v).length < String(right.val.v).length) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === ">") {
        if(left.val.type === "int") {
            if(parseInt(left.val.v) > parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) > parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) > this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v).length > String(right.val.v).length) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === "<=") {
        if(left.val.type === "int") {
            if(parseInt(left.val.v) <= parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) <= parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) <= this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v).length <= String(right.val.v).length) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === ">=") {
        if(left.val.type === "int") {
            if(parseInt(left.val.v) >= parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) >= parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) >= this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v).length >= String(right.val.v).length) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else {
         this.wr("processBex: Error: unknown operator: " + op.v);
         return null;               
      }
      
      if(this.toBool(ret.v) === true) {
         //run thn lines
         ret3 = this.processIfForLines(thn, func);
      } else {
         //run els lines
         ret3 = this.processIfForLines(els, func);            
      }
      
      ret2.val = ret;
      ret = ret2;      
      this.lastIfReturn = ret;
      
      if(this.isSysObjReturn(ret3)) {
         return ret3;
      } else {      
         return ret;
      }      
   } else {
      this.wr("processBex: Error: type mismatch: " + left.val.type + " - " + right.val.type);
      return null;
   }
};

/**
 * Name: processIfForLines
 * Desc: Processes an array of if statement or for loop lines.
 *       Returns the last value returned by the last line or returns the return value if encountered.
 * Arg1: objLines(array of lines)
 * Arg2: func(func obj, sys=func)
 * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
 */
jsonPlState.prototype.processIfForLines = function(objLines, func) {
   if(objLines !== null && this.isArray(objLines) && objLines.length > 0) {
      var j = 0;
      var len = objLines.length;
      var ret = null;
      var line = null;
      
      for(j = 0; j < len; j++) {
         line = objLines[j];
         
         //support comments
         if(line.hasOwnProperty("active") && line.active === false) {
            continue;
         }
                  
         if(this.isSysObjAsgn(line)) {
            ret = this.processAsgn(line, func);
         
         } else if(this.isSysObjCall(line)) {
            ret = this.processCall(line, func);
      
         } else if(this.isSysObjFor(line)) {
            ret = this.processFor(line, func);         
      
         } else if(this.isSysObjIf(line)) {
            ret = this.processIf(line, func);

         } else if(this.isSysObjReturn(line)) {
            return line;
         }
         
         if(ret === null) {
            this.wr("processIfForLines: Error: processing line returned null: " + j);
            return null;
         }
      }
      return ret;
   } else {
      this.wr("processIfForLines: Warning: provided lines array is null");
      var ret = {};
      ret.sys = "val";
      ret.type = "bool";
      ret.v = "true";
      
      var ret2 = {};
      ret2.sys = "const";
      ret2.val = ret;   
      ret = ret2;   
      return ret;
   }
};

/**
 * Name: processFor
 * Desc: Processes a for loop. Returns the last loop iteration value.
 * Arg1: objFor(for obj, sys=for)
 * Arg2: func(func obj, sys=func)
 * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
 */
jsonPlState.prototype.processFor = function(objFor, func) {
   var start = null;
   var stop = null;
   var inc = null;

   if(!this.isSysObjFor(objFor)) {
      this.wr("processFor: Error: argument objRef is not a for obj");
      return null;
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processFor: Error: argument func is not a func obj");
      return null;
   }

   start = objFor.start;
   if(this.isSysObjConst(start)) {
      //do nothing
      
   } else if(this.isSysObjRef(start)) {
      start = this.processRef(start, func);
      
   } else if(this.isSysObjExp(start)) {
      start = this.processExp(start, func);
      
   } else if(this.isSysObjBex(start)) {
      start = this.processBex(start, func);      
      
   } else if(this.isSysObjCall(start)) {
      start = this.processCall(start, func);
      
   } else {
      this.wr("processFor: Error: argument start unsuppoorted type: " + start.sys);
      return null;
   }

   if(start === null) {
      this.wr("processFor: Error: argument start is null");
      return null;
   }

   stop = objFor.stop;
   if(this.isSysObjConst(start)) {
      //do nothing
      
   } else if(this.isSysObjRef(stop)) {
      stop = this.processRef(stop, func);
      
   } else if(this.isSysObjExp(stop)) {
      stop = this.processExp(stop, func);
      
   } else if(this.isSysObjBex(stop)) {
      stop = this.processBex(stop, func);
      
   } else if(this.isSysObjCall(stop)) {
      stop = this.processCall(stop, func);
      
   } else {
      this.wr("processFor: Error: argument stop unsuppoorted type: " + stop.sys);
      return null;
   }

   if(stop === null) {
      this.wr("processFor: Error: argument stop is null");
      return null;
   }

   inc = objFor.inc;
   if(this.isSysObjConst(inc)) {
      //do nothing
      
   } else if(this.isSysObjRef(inc)) {
      inc = this.processRef(inc, func);
      
   } else if(this.isSysObjExp(inc)) {
      inc = this.processExp(inc, func);
      
   } else if(this.isSysObjBex(inc)) {
      inc = this.processBex(inc, func);
      
   } else if(this.isSysObjCall(inc)) {
      inc = this.processCall(inc, func); 
      
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

   var ret = {};
   ret.sys = "val";
   ret.type = "int";
   ret.v = 0 + "";
   
   var ret2 = {};
   ret2.sys = "const";
   ret2.val = ret;   
   ret = ret2;

   var ret3 = null;
   var i = 0;
   var incAmt = parseInt(inc.val.v);
   var lenAmt = parseInt(stop.val.v);
   var startAmt = parseInt(start.val.v);
   for (i = startAmt; i < lenAmt; i += incAmt) {
      ret3 = this.processIfForLines(objFor.lines, func);
      if(ret3 === null) {
         this.wr("processFor: Error: process loop iteration " + i + " returned a null value.");
         return null;
      } else if(this.isSysObjReturn(ret3)) {
         return ret3;
      } else {
         ret.val.v = i + "";
         this.lastForReturn = ret;
      }
   }
   return ret;
};

/**
 * Name: processAsgn
 * Desc: Processes an assigment. Returns true value.
 * Arg1: objAsgn(asgn obj, sys=asgn)
 * Arg2: func(func obj, sys=func)
 * Returns: {null | (const obj, sys=const)}
 */
jsonPlState.prototype.processAsgn = function(objAsgn, func) {
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
      return null;
   }   
   
   if(left.val.type === right.val.type) {
      left.val.v = right.val.v;

      var ret = {};
      ret.sys = "val";
      ret.type = "bool";
      ret.v = "true";
      
      var ret2 = {};
      ret2.sys = "const";
      ret2.val = ret;
      
      ret = ret2;
      this.lastAsgnValue = this.cloneJsonObj(left);
      this.lastAsgnReturn = ret;
      return ret;
   } else {
      this.wr("processAsgn: Error: type mismatch: " + left.val.type + " - " + right.val.type);
      return null;      
   }
};

/**
 * Name: processBex
 * Desc: Processes a boolean expression. Returns Boolean result of the expression.
 * Arg1: objBex(bex obj, sys=bex)
 * Arg2: func(func obj, sys=func)
 * Returns: {null | (const obj, sys=const)}
 */
jsonPlState.prototype.processBex = function(objBex, func) {
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
      
   if(this.isSysObjConst(left)) {
      //do nothing
      
   } else if(this.isSysObjRef(left)) {
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
      
      var ret2 = {};
      ret2.sys = "const";
         
      if(op.v === "==") {
         if(left.val.type === "int") {
            if(parseInt(left.val.v) === parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) === parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) === this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v) === String(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === "!=") {
         if(left.val.type === "int") {
            if(parseInt(left.val.v) !== parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) !== parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) !== this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v) !== String(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === "<") {
         if(left.val.type === "int") {
            if(parseInt(left.val.v) < parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) < parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) < this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v).length < String(right.val.v).length) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === ">") {
        if(left.val.type === "int") {
            if(parseInt(left.val.v) > parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) > parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) > this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v).length > String(right.val.v).length) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === "<=") {
        if(left.val.type === "int") {
            if(parseInt(left.val.v) <= parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) <= parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) <= this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v).length <= String(right.val.v).length) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }
      } else if(op.v === ">=") {
        if(left.val.type === "int") {
            if(parseInt(left.val.v) >= parseInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "float") {
            if(parseFloat(left.val.v) >= parseFloat(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(left.val.v) >= this.toBoolInt(right.val.v)) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }
         } else if(left.val.type === "string") {
            if(String(left.val.v).length >= String(right.val.v).length) {
               ret.v = "true";
            } else {
               ret.v = "false";
            }               
         }         
      } else {
         this.wr("processBex: Error: unknown operator: " + op.v);
         return null;               
      }
      
      ret2.val = ret;  
      ret = ret2;               
      this.lastBexReturn = ret;
      return ret;      
   } else {
      this.wr("processBex: Error: type mismatch: " + left.val.type + " - " + right.val.type);
      return null;
   }
};

/**
 * Name: processFunc
 * Desc: Processes a function's lines. Returns last statement or return value.
 * Arg1: objFunc(bex obj, sys=func)
 * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
 */
jsonPlState.prototype.processFunc = function(objFunc) {
   if(!this.isSysObjFunc(objFunc)) {
      this.wr("processFunc: Error: argument objRef is not a call func");
      return null;
   }
   
   var ret3 = null;   
   ret3 = this.processIfForLines(objFunc.lines, objFunc);      
   return ret3;
};

/**
 * Name: processCall
 * Desc: Processes a function call. Returns last statement or return value from executing the function's lines.
 * Arg1: objCall(call obj, sys=call)
 * Arg2: func(func obj, sys=func)
 * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
 */
jsonPlState.prototype.processCall = function(objCall, func) {
   var name = null;
   var args = null;
   var funcDef = null;
   var funcArgs = null;
   var tmpArg = null;   
   var ret = null;
   var sysFunc = false;
   
   if(!this.isSysObjCall(objCall)) {
      this.wr("processCall: Error: argument objRef is not a call obj");
      return null;
      
   } else if(!this.isSysObjFunc(func)) {
      this.wr("processCall: Error: argument func is not a func obj");
      return null;
   }
   
   name = objCall.name;
   args = this.cloneJsonObj(objCall.args);
   funcDef = this.findFunc(name);
   if(funcDef !== null) {
      funcArgs = funcDef.args;
      
   } else {
      sysFunc = true;
      funcDef = this.findSysFunc(name);
      if(funcDef !== null) {
         funcArgs = funcDef.args;
      } else {
         this.wr("processCall: Error: no function found with name: " + name);
         return null;         
      }
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
                  args[i].name = funcArgs[i].name;
               } else {
                  this.wr("processCall: Error: could not process argument index, " + i + ", with path: " + args[i].val.v);
                  return null;
               }
            }
         }
         
         if(sysFunc) {
            var err = true;
            var lret = null;
            try {
               lret = this[funcDef.fname](args);            
               err = false;
            } catch (e) {
               lret = null;
               err = true;               
            }
            
            if(lret === null) {               
               var ret = {};
               ret.sys = "val";
               ret.type = "bool";
               ret.v = err + "";

               var ret2 = {};
               ret2.sys = "const";
               ret2.val = ret;  
               ret = ret2;
               return ret;
            } else {
               return lret;
            }            
         } else {
            //backup default args
            funcDef.args_def = this.cloneJsonObj(funcDef.args);
            funcDef.args = args;
            
            //backup default ret
            funcDef.ret_def = this.cloneJsonObj(funcDef.ret);    
            ret = this.processFunc(funcDef);
            
            //this.wr("RET_DEF");
            //this.wrObj(funcDef.ret_def);
            
            if(ret.val.type !== funcDef.ret_def.type) {
               this.wr("processCall: Error: function return type mismatch, return type " + ret.val.type + " expected " + funcDef.ret_def.type);
               return null;
            }
            
            //restore args and ret
            funcDef.args = this.cloneJsonObj(funcDef.args_def);
            funcDef.ret = this.cloneJsonObj(funcDef.ret_def);
            
            return ret;
         }
      } else {
         this.wr("processCall: Error: function argument length mismatch, func arg def: " + funcArgs.length + ", call arg: " + args.length);
         return null;         
      }
   } else {
      this.wr("processCall: Error: function arguments is null");               
      return null;
   }      
};

/**
 * Name: processExp
 * Desc: Processes an expression. Returns the value of the expression.
 * Arg1: objExp(exp obj, sys=exp)
 * Arg2: func(func obj, sys=func)
 * Returns: {null | (const obj, sys=const)}
 */
jsonPlState.prototype.processExp = function(objExp, func) {
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
      
   if(this.isSysObjConst(left)) {
      //do nothing
      
   } else if(this.isSysObjRef(left)) {
      left = this.processRef(left, func);
      
   } else if(this.isSysObjBex(left)) {
      left = this.processBex(left, func);
      
   } else if(this.isSysObjExp(left)) {
      left = this.processExp(left, func);
      
   } else if(this.isSysObjCall(left)) {      
      left = this.processCall(left, func);
      
   } else {
      this.wr("processExp: Error: argument left must be a ref obj");
      return null;
   }
   
   if(left === null) {
      this.wr("processExp: Error: error processing left");
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
      this.wr("processExp: Error: argument right is an unknown obj: " + this.getSysObjType(right));
      return null;
   }
   
   if(right === null) {
      this.wr("processExp: Error: error processing right");
      return null;
   }   
   
   if(left.val.type === right.val.type && (left.val.type === "int" || left.val.type === "float" || left.val.type === "bool")) {
      var ret = {};
      ret.sys = "val";
      ret.type = left.val.type;
      ret.v = null;

      var ret2 = {};
      ret2.sys = "const";
      ret2.val = ret;         
         
      if(op.v === "+") {
         if(left.val.type === "int") {
            ret.v = parseInt(left.val.v) + parseInt(right.val.v); 
         } else if(left.val.type === "float") {
            ret.v = parseFloat(left.val.v) + parseFloat(right.val.v); 
         } else if(left.val.type === "bool") {
            ret.v = this.toBoolInt(left.val.v) + this.toBoolInt(right.val.v); 
         }                  
      } else if(op.v === "-") {
         if(left.val.type === "int") {
            ret.v = parseInt(left.val.v) - parseInt(right.val.v); 
         } else if(left.val.type === "float") {
            ret.v = parseFloat(left.val.v) - parseFloat(right.val.v); 
         } else if(left.val.type === "bool") {
            ret.v = this.toBoolInt(left.val.v) - this.toBoolInt(right.val.v); 
         }         
      } else if(op.v === "/") {
         if(left.val.type === "int") {
            if(parseInt(right.val.v) === 0) {
               this.wr("processExp: Error: divide by zero error");
               return null;
               
            } else {
               ret.v = parseInt(left.val.v) / parseInt(right.val.v);
            }
         } else if(left.val.type === "float") {
            if(parseFloat(right.val.v) === 0) {
               this.wr("processExp: Error: divide by zero error");
               return null;
               
            } else {
               ret.v = parseFloat(left.val.v) / parseFloat(right.val.v);
            }
         } else if(left.val.type === "bool") {
            if(this.toBoolInt(right.val.v) === 0) {
               this.wr("processExp: Error: divide by zero error");
               return null;
               
            } else {
               ret.v = this.toBoolInt(left.val.v) / this.toBoolInt(right.val.v);
            }
         }
      } else if(op.v === "*") {
         if(left.val.type === "int") {
            ret.v = parseInt(left.val.v) * parseInt(right.val.v); 
         } else if(left.val.type === "float") {
            ret.v = parseFloat(left.val.v) * parseFloat(right.val.v); 
         } else if(left.val.type === "bool") {
            ret.v = this.toBoolInt(left.val.v) * this.toBoolInt(right.val.v); 
         }         
      } else {
         this.wr("processExp: Error: unknown operator: " + op.v);
         return null;               
      }
      
      if(left.val.type === "int") {
         ret.v = parseInt(ret.v) + "";
      } else if(left.val.type === "float") {
         ret.v = parseFloat(ret.v) + "";         
      } else if(left.val.type === "bool") {
         ret.v = this.toBool(ret.v) + "";
      }
      
      ret = ret2;
      this.lastExpReturn = ret;
      return ret;      
   } else {
      this.wr("processExp: Error: type mismatch: " + left.val.type + " - " + right.val.type);
      return null;
   }
};