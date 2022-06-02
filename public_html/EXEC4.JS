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
class jsonPlState {
   constructor() {
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
      this.objId = -1;
      this.VERBOSE = true;

      this.lastProcessUrlFindPath = null;
   }

   /**
    * Name: sysWr
    * Desc: A system level write function.
    * Arg1: args(an array of {arg} objects)
    * Arg2: func(the {func} this system function is called from)
    * Arg3: sep(an optional string separator)
    * Returns: const(a {const} bool object)
    */   
   sysWr(args, func, sep) {
      var ret = {};
      ret.sys = "val";
      ret.type = "bool";
      ret.v = "false";

      var ret2 = {};
      ret2.sys = "const";
      ret2.val = ret;
      ret = ret2;

      if (args === null) {
         this.wr("sysWr: Error: args cannot be null");
         return ret;
      } else if (func === null) {
         this.wr("sysWr: Error: func cannot be null");
         return ret;
      }

      var len = args.length;
      var i = 0;
      var s = "";

      if (sep === null || sep === "" || sep === undefined) {
         sep = null;
      }

      for (; i < len; i++) {
         if (args[i] !== null && this.isSysObj(args[i]) && this.isSysObjVal(args[i].val)) {
            if (this.isArray(args[i].val.v)) {
               this.sysWr(this.toArray(args[i].val.v), func, ", ");
            } else {
               s += this.toStr(args[i].val.v);
               if (sep !== null) {
                  if (i < len - 1) {
                     s += sep;
                  }
               }
            }
         } else {
            this.wr("sysWr: Error: could not process argument " + i + ", unknown object type");
            return ret;
         }
      }

      this.wr(s);
      ret2.val.v = "true";
      return ret;
   }

   /**
    * Name: sysGetLastAsgnValue
    * Desc: A system level method to access the last asgn value object.
    * Returns: const(a {const} bool object)
    */   
   sysGetLastAsgnValue(args, func) {
      if (this.lastAsgnValue !== null) {
         return this.lastAsgnValue;
      } else {
         return this.getConstBool();
      }
   }
   
   /**
    * Name: sysGetLastAsgnValue
    * Desc: A system level method to access the last exp return object.
    * Returns: const(a {const} bool object)
    */   
   sysGetLastExpReturn(args, func) {
      if (this.lastExpReturn !== null) {
         return this.lastExpReturn;
      } else {
         return this.getConstBool();
      }
   }
   
   /**
    * Name: getConstBool
    * Desc: A method to quickly access a constant bool value object.
    * Returns: const(a {const} bool object)
    */
   getConstBool() {
      var ret = {};
      ret.sys = "val";
      ret.type = "bool";
      ret.v = "false";

      var ret2 = {};
      ret2.sys = "const";
      ret2.val = ret;
      ret = ret2;

      return ret;
   }

   /**
    * Name: getConst
    * Desc: A method to quickly access a constant value object.
    * Arg1: type(a valid type string)
    * Arg2: val(a value object)
    * Returns: const(a {const} object)
    */
   getConst(type, val) {
      var ret = {};
      ret.sys = "val";
      ret.type = type;
      ret.v = val;

      var ret2 = {};
      ret2.sys = "const";
      ret2.val = ret;
      ret = ret2;

      return ret;
   }

   /**
    * Name: getRef
    * Desc: A method to quickly access a ref object.
    * Arg1: type(a valid type string)
    * Arg2: val(a {val} object)
    * Returns: ref(a {ref} object)
    */
   getRef(type, val) {
      var ret = {};
      ret.sys = "val";
      ret.type = type;
      ret.v = val;

      var ret2 = {};
      ret2.sys = "ref";
      ret2.val = ret;
      ret = ret2;

      return ret;
   }

   /**
    * Name: getPathAndUrlFromRef
    * Desc: A function to get the reference path string and the target URL from a URL variable reference.
    * Arg1: path(some string with a URL variable reference)
    * Returns: ret(an [] with the url, path as members)
    */
   getPathAndUrlFromRef(path) {
      if (this.isRefStringUrl(path)) {
         //check for URL
         var urlStart = path.indexOf("->(");
         var hasUrl = false;

         var nvs = null;
         var nurl = null;
         var npath = null;
         if (urlStart !== -1) {
            nvs = path.split("->(");
            npath = nvs[0].trim();
            nurl = nvs[1].substring(0, nvs[1].length - 1).trim();
            hasUrl = true;
            return [nurl, npath];
         }
      }

      return null;
   }

   /**
    * Name: sysJob1
    * Desc: A system level job method used to demonstrate JCL.
    * Arg1: args(an array of {arg} objects)
    * Arg2: func(the {func} this system function is called from)
    * Returns: const(a {const} bool value)
    */
   sysJob1(args, func) {
      this.wr("sysJob1");
      var ret = this.getConstBool();
      ret.val.v = "true";
      return ret;
   }

   /**
    * Name: sysJob2
    * Desc: A system level job method used to demonstrate JCL.
    * Arg1: args(an array of {arg} objects)
    * Arg2: func(the {func} this system function is called from)
    * Returns: const(a {const} bool value)
    */
   sysJob2(args, func) {
      this.wr("sysJob2");
      var ret = this.getConstBool();
      ret.val.v = "true";
      return ret;
   }

   /**
    * Name: sysJob3
    * Desc: A system level job method used to demonstrate JCL.
    * Arg1: args(an array of {arg} objects)
    * Arg2: func(the {func} this system function is called from)
    * Returns: const(a {const} bool value)
    */
   sysJob3(args, func) {
      this.wr("sysJob3");
      var ret = this.getConstBool();
      ret.val.v = "true";
      return ret;
   }

   /**
    * Name: runProgram
    * Desc: Executes the current program and returns the result.
    * Returns: ret(some {const}, {ref} object)
    */
   runProgram() {
      if (this.validateSysObjClass(this.program)) {
         var start = Date.now();
         var callObj = this.program.call;
         var callFuncName = null;

         if (!this.isObject(callObj.name)) {
            callFuncName = this.toStr(callObj.name);
         } else {
            if (this.isSysObjConst(callObj.name)) {
               callFuncName = this.toStr((callObj.name).val.v);
            } else if (this.isSysObjRef(callObj.name)) {
               this.wr("runProgram: Error: cannot process call name {ref} objects at the class level.");
               return null;
            } else {
               this.wr("runProgram: Error: cannot process unknown call name objects at the class level.");
               return null;
            }
         }

         this.wr("runProgram: Call: " + callFuncName);
         var callFunc = this.findFunc(callFuncName);

         var ret = null;
         ret = this.processCall(callObj, callFunc);
         this.lastProgramReturn = ret;

         this.wr("runProgram: Results: ");
         this.wrObj(ret);

         var duration = Date.now() - start;
         this.wr("runProgram: Execution time: " + duration / 1000.0 + "s");
         return ret;
      } else {
         this.wr("runProgram: Error: could not validate the class object.");
         return null;
      }
   }

   /////////////////////////SEARCH METHODS
   /**
    * Name: findArg
    * Desc: Search the provided object for an argument with the given name.
    * Arg1: name(string to find)
    * Arg2: obj(a {func} object to search args for)
    * Returns: ret(null or {arg} object)
    */
   findArg(name, obj) {
      var str;
      var subj;
      for (var i = 0; i < obj.args.length; i++) {
         subj = obj.args[i];
         str = this.toStr(subj.name);
         if (str !== null && str !== "" && str === name) {
            return subj;
         }
      }
      return null;
   }

   /**
    * Name: findVar
    * Desc: Search the provided object for a variable with the given name.
    * Arg1: name(string to find)
    * Arg2: obj(a {func} or {class} object to search)
    * Returns: ret(null, {val} or {arg} object)
    */
   findVar(name, obj) {
      var str;
      var subj;
      for (var i = 0; i < obj.vars.length; i++) {
         subj = obj.vars[i];
         str = this.toStr(subj.name);
         if (str !== null && str !== "" && str === name) {
            return subj;
         }
      }
      return null;
   }

   /**
    * Name: findFunc
    * Desc: Search the current program for a func with the given name.
    * Arg1: name(string to find)
    * Returns: ret(null or {func} object)
    */
   findFunc(name) {
      var prog = this.program;
      var str;
      var subj;
      for (var i = 0; i < prog.funcs.length; i++) {
         subj = prog.funcs[i];
         str = this.toStr(subj.name);
         if (str !== null && str !== "" && str === name) {
            return subj;
         }
      }
      return null;
   }

   /**
    * Name: findSysFunc
    * Desc: Search the current program's system functions for a func with the given name.
    * Arg1: name(string to find)
    * Returns: ret(null or {func} object)
    */
   findSysFunc(name) {
      var prog = this;
      var str;
      var subj;
      var sFuncs = prog.system.functions;

      for (var i = 0; i < sFuncs.length; i++) {
         subj = sFuncs[i];
         str = this.toStr(subj.name);
         if (str !== null && str !== "" && str === name) {
            return subj;
         }
      }
      return null;
   }

   /////////////////////////VALIDATION METHODS
   /**
    * Name: validateSysObjIf
    * Desc: Validates if the given object is a valid if object.
    * Arg1: obj(an {if} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *    "sys": "if",
    *    "left": {ref | const | exp | bex | call},
    *    "op": {op & type of bex},
    *    "right": {ref | const | exp | bex | call},
    *    "thn": [asgn | if | for | call | return],
    *    "els": [asgn | if | for | call | return]
    * }
    */
   validateSysObjIf(obj) {
      if (this.isSysObjIf(obj) && this.validateProperties(obj, ["sys", "left", "op", "right", "thn"])) { //, "els"
         var tobj = null;
         if (obj.left !== null) {
            tobj = obj.left;
            if (this.isSysObjRef(tobj)) {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate left obj as ref");
                  return false;
               }
            } else if (this.isSysObjConst(tobj)) {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate left obj as const");
                  return false;
               }
            } else if (this.isSysObjExp(tobj)) {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate left obj as exp");
                  return false;
               }
            } else if (this.isSysObjBex(tobj)) {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate left obj as bex");
                  return false;
               }
            } else if (this.isSysObjCall(tobj)) {
               if (!this.validateSysObjCall(tobj)) {
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

         if (obj.op !== null) {
            tobj = obj.op;
            if (this.isSysObjOp(tobj)) {
               if (!this.validateSysObjOp(tobj)) {
                  return false;
               } else if (tobj.type !== 'bex') {
                  return false;
               } else if (!(tobj.v === "==" || tobj.v === "!=" || tobj.v === "<" || tobj.v === ">" || tobj.v === "<=" || tobj.v === ">=")) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.right !== null) {
            tobj = obj.right;
            if (this.isSysObjRef(tobj)) {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjIf: Error: could not validate right obj as ref");
                  return false;
               }
            } else if (this.isSysObjConst(tobj)) {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjIf: Error: could not validate right obj as const");
                  return false;
               }
            } else if (this.isSysObjExp(tobj)) {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjIf: Error: could not validate right obj as exp");
                  return false;
               }
            } else if (this.isSysObjBex(tobj)) {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjIf: Error: could not validate right obj as bex");
                  return false;
               }
            } else if (this.isSysObjCall(tobj)) {
               if (!this.validateSysObjCall(tobj)) {
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

         if (obj.thn !== null && this.isArray(obj.thn)) {
            tobj = obj.thn;
            var len = tobj.length;
            for (var i = 0; i < len; i++) {
               if (!this.validateSysObjFuncLine(tobj[i])) {
                  this.wr("validateSysObjIf: Error: could not validate obj as then, line: " + i);
                  return false;
               }
            }
         }

         if (obj.els !== null && this.isArray(obj.els)) {
            tobj = obj.els;
            var len = tobj.length;
            for (var i = 0; i < len; i++) {
               if (!this.validateSysObjFuncLine(tobj[i])) {
                  this.wr("validateSysObjIf: Error: could not validate obj as else, line: " + i);
                  return false;
               }
            }
         }

         return true;
      }
      return false;
   }

   /**
    * Name: isForEach
    * Desc: Determines if the given argument, obj, is a for each loop
    * Arg1: obj(the object to inspect)
    * Returns: ret(some bool, true or false)
    */
   isForEach(obj) {
      return (this.isSysObjFor(obj) && !this.isFullFor(obj) && this.validateProperties(obj, ["each"]));
   }
   
   /**
    * Name: isFullFor
    * Desc: Determines if the given argument, obj, is a full for loop
    * Arg1: obj(the object to inspect)
    * Returns: ret(some bool, true or false)
    */
   isFullFor(obj) {
      if (obj === null) {
         return false;
      } else if (this.isSysObjFor(obj) === true) {
         if (this.validateProperties(obj, ["sys", "start", "stop", "inc", "lines"]) === true) {
            return true;
         }
      }
      return false;
   }

   /**
    * Name: validateSysObjFor
    * Desc: Validates if the given object is a valid for object.
    * Arg1: obj(a {for} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * //full version
    * {
    *   "sys": "for",
    *   "start": {ref | const | exp | bex | call & type of int},
    *   "stop": {ref | const | exp | bex | call & type of int},
    *   "inc": {ref | const | exp | bex | call & type of int},
    *   "lines": [asgn | if | for | call | return]
    * }
    *
    * //for-each version
    * {
    *   "sys": "for",
    *   "each": {ref | const & of type array}
    *   "lines": [asgn | if | for | call | return]
    * }
    */
   validateSysObjFor(obj) {
      if (this.isSysObjFor(obj) && (this.validateProperties(obj, ["sys", "start", "stop", "inc", "lines"]) || this.validateProperties(obj, ["sys", "each", "lines"]))) {
         var tobj = null;
         var fullLst = this.isFullFor(obj);

         if (fullLst) {
            if (obj.start !== null) {
               tobj = obj.start;
               if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
                  if (!this.validateSysObjRef(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
                  if (!this.validateSysObjConst(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as const");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
                  if (!this.validateSysObjExp(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
                  if (!this.validateSysObjBex(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
                  if (!this.validateSysObjCall(tobj)) {
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

            if (obj.stop !== null) {
               tobj = obj.stop;
               if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
                  if (!this.validateSysObjRef(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
                  if (!this.validateSysObjConst(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as const");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
                  if (!this.validateSysObjExp(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
                  if (!this.validateSysObjBex(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
                  if (!this.validateSysObjCall(tobj)) {
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

            if (obj.inc !== null) {
               tobj = obj.inc;
               if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
                  if (!this.validateSysObjRef(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
                  if (!this.validateSysObjConst(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as const");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
                  if (!this.validateSysObjExp(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
                  if (!this.validateSysObjBex(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
                  if (!this.validateSysObjCall(tobj)) {
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
         } else {
            if (obj.each !== null) {
               tobj = obj.each;
               if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
                  if (!this.validateSysObjRef(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
                  if (!this.validateSysObjConst(tobj)) {
                     this.wr("validateSysObjFor: Error: could not validate right obj as const");
                     return false;
                  }
               } else {
                  this.wr("validateSysObjFor: Error: could not validate obj as right");
                  return false;
               }
            }
         }

         for (var i = 0; i < obj.lines.length; i++) {
            if (!this.validateSysObjFuncLine(obj.lines[i])) {
               this.wr("validateSysObjFor: Error: could not validate obj as func, line: " + i);
               return false;
            }
         }

         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjClass
    * Desc: Validates if the given object is a valid class object.
    * Arg1: obj(a {class} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "class",
    *   "name": "some name",
    *   "call": {call},
    *   "vars": [var],
    *   "funcs": [func],
    *   "ret": {val}
    * }
    */
   validateSysObjClass(obj) {
      if (this.isSysObjClass(obj) && this.validateProperties(obj, ["sys", "name", "vars", "funcs", "ret", "call"])) {
         if (!this.validateSysObjVal(obj.ret)) {
            this.wr("validateSysObjClass: Error: could not validate obj as val");
            return false;
         }

         if (obj.call !== null && !this.validateSysObjCall(obj.call)) {
            this.wr("validateSysObjClass: Error: could not validate obj as call");
            return false;
         }

         for (var i = 0; i < obj.vars.length; i++) {
            if (!this.validateSysObjVar(obj.vars[i])) {
               this.wr("validateSysObjClass: Error: could not validate obj as var: " + obj.vars[i].name);
               return false;
            }
         }

         for (var i = 0; i < obj.funcs.length; i++) {
            if (!this.validateSysObjFunc(obj.funcs[i])) {
               this.wr("validateSysObjClass: Error: could not validate obj as func: " + obj.funcs[i].name);
               return false;
            }
         }

         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjFuncLine
    * Desc: Validates if the given object is a valid function line object.
    * Arg1: obj(an {asgn}, {for}, {if}, {return}, {call} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * [asgn | for | if | return | call]
    */
   validateSysObjFuncLine(obj) {
      if (this.isSysObjFuncLine(obj)) {
         if (this.getSysObjType(obj) === "asgn") {
            if (!this.validateSysObjAsgn(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as asgn");
               return false;
            } else {
               return true;
            }
         } else if (this.getSysObjType(obj) === "for") {
            if (!this.validateSysObjFor(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as for");
               return false;
            } else {
               return true;
            }
         } else if (this.getSysObjType(obj) === "if") {
            if (!this.validateSysObjIf(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as if");
               return false;
            } else {
               return true;
            }
         } else if (this.getSysObjType(obj) === "return") {
            if (!this.validateSysObjReturn(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as return");
               return false;
            } else {
               return true;
            }
         } else if (this.getSysObjType(obj) === "call") {
            if (!this.validateSysObjCall(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as call");
               return false;
            } else {
               return true;
            }
         } else {
            return false;
         }
      }
      return false;
   }

   /**
    * Name: validateSysObjFunc
    * Desc: Validates if the given object is a valid func object.
    * Arg1: obj(a {func} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "func",
    *   "name": "some name",
    *   "args": [arg],
    *   "vars": [var],
    *   "ret": {val},
    *   "lines": [asgn | for | if | return | call]
    * }
    */
   validateSysObjFunc(obj) {
      if (this.isSysObjFunc(obj) && this.validateProperties(obj, ["sys", "name", "args", "vars", "ret", "lines"])) {
         if (!this.validateSysObjVal(obj.ret)) {
            this.wr("validateSysObjFunc: Error: could not validate obj as val");
            return false;
         }

         for (var i = 0; i < obj.vars.length; i++) {
            if (!this.validateSysObjVar(obj.vars[i])) {
               this.wr("validateSysObjFunc: Error: could not validate obj as var");
               return false;
            }
         }

         for (var i = 0; i < obj.args.length; i++) {
            if (!this.validateSysObjArg(obj.args[i])) {
               this.wr("validateSysObjFunc: Error: could not validate obj as arg");
               return false;
            }
         }

         for (var i = 0; i < obj.lines.length; i++) {
            if (!this.validateSysObjFuncLine(obj.lines[i])) {
               this.wr("validateSysObjFunc: Error: could not validate obj as func line: " + i + ", " + obj.lines[i].sys);
               return false;
            }
         }

         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjAsgn
    * Desc: Validates if the given object is a valid asgn object.
    * Arg1: obj(a {asgn} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "asgn",
    *   "left": {ref},
    *   "op": {op & type of asgn},
    *   "right": {ref | const | exp | bex | call}
    * }
    */
   validateSysObjAsgn(obj) {
      if (this.isSysObjAsgn(obj) && this.validateProperties(obj, ["sys", "left", "op", "right"])) {
         var tobj = null;
         if (obj.left !== null) {
            tobj = obj.left;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate left obj as ref");
                  return false;
               }
            } else {
               this.wr("validateSysObjAsgn: Error: could not validate left obj as ref");
               return false;
            }
         } else {
            this.wr("validateSysObjAsgn: Error: could not validate left obj as ref, null");
            return false;
         }

         if (obj.op !== null) {
            tobj = obj.op;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "op") {
               if (!this.validateSysObjOp(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate obj as op");
                  return false;
               } else if (tobj.type !== 'asgn') {
                  this.wr("validateSysObjAsgn: Error: could not validate obj as op type");
                  return false;
               } else if (tobj.v !== "=" && tobj.v !== "+=") {
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

         if (obj.right !== null) {
            tobj = obj.right;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate right obj as ref");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate right obj as const");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate right obj as exp");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate right obj as bex");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
               if (!this.validateSysObjCall(tobj)) {
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
   }

   /**
    * Name: validateSysObjBex
    * Desc: Validates if the given object is a valid bex object.
    * Arg1: obj(a {bex} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "bex",
    *   "left": {ref | const | exp | bex | call},
    *   "op": {op & type of bex},
    *   "right": {ref | const | exp | bex | call}
    * }
    */
   validateSysObjBex(obj) {
      if (this.isSysObjBex(obj) && this.validateProperties(obj, ["sys", "left", "op", "right"])) {
         var tobj = null;
         if (obj.left !== null) {
            tobj = obj.left;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
               if (!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
               if (!this.validateSysObjConst(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
               if (!this.validateSysObjExp(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
               if (!this.validateSysObjBex(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
               if (!this.validateSysObjCall(tobj)) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.op !== null) {
            tobj = obj.op;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "op") {
               if (!this.validateSysObjOp(tobj)) {
                  return false;
               } else if (tobj.type !== 'bex') {
                  return false;
               } else if (!(tobj.v === "==" || tobj.v === "!=" || tobj.v === "<" || tobj.v === ">" || tobj.v === "<=" || tobj.v === ">=")) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.right !== null) {
            tobj = obj.right;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
               if (!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
               if (!this.validateSysObjConst(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
               if (!this.validateSysObjExp(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
               if (!this.validateSysObjBex(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
               if (!this.validateSysObjCall(tobj)) {
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
   }

   /**
    * Name: validateSysObjExp
    * Desc: Validates if the given object is a valid exp object.
    * Arg1: obj(a {exp} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "exp",
    *   "left": {ref | const | exp | bex | call},
    *   "op": {op & type of exp},
    *   "right": {ref | const | exp | bex | call}
    * }
    */
   validateSysObjExp(obj) {
      if (this.isSysObjExp(obj) && this.validateProperties(obj, ["sys", "left", "op", "right"])) {
         var tobj = null;
         if (obj.left !== null) {
            tobj = obj.left;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
               if (!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
               if (!this.validateSysObjConst(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
               if (!this.validateSysObjExp(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
               if (!this.validateSysObjBex(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
               if (!this.validateSysObjCall(tobj)) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.op !== null) {
            tobj = obj.op;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "op") {
               if (!this.validateSysObjOp(tobj)) {
                  return false;
               } else if (tobj.type !== 'exp') {
                  return false;
               } else if (!(tobj.v === "+" || tobj.v === "-" || tobj.v === "/" || tobj.v === "*")) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.right !== null) {
            tobj = obj.right;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
               if (!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
               if (!this.validateSysObjConst(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "exp") {
               if (!this.validateSysObjExp(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "bex") {
               if (!this.validateSysObjBex(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "call") {
               if (!this.validateSysObjCall(tobj)) {
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
   }

   /**
    * Name: validateSysObjCall
    * Desc: Validates if the given object is a valid call object.
    * Arg1: obj(a {call} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "call",
    *   "name": name(string | {const} | {ref}),
    *   "args": [ref | const]
    * }
    */
   validateSysObjCall(obj) {
      if (this.isSysObjCall(obj) && this.validateProperties(obj, ["sys", "name", "args"])) {
         if (obj.name !== null) {
            if (!this.isString(obj.name) && !this.isSysObjConst(obj.name) && !this.isSysObjRef(obj.name)) {
               this.wr("validateSysObjCall: Error: name is of unknown object type");
               return false;
            }
         }

         if (obj.args !== null) {
            for (var i = 0; i < obj.args.length; i++) {
               var tobj = obj.args[i];
               if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "ref") {
                  if (!this.validateSysObjRef(tobj)) {
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj) === "const") {
                  if (!this.validateSysObjConst(tobj)) {
                     return false;
                  }
               } else {
                  this.wr("validateSysObjCall: Error: Unhandled sys obj type: " + tobj.sys);
                  return false;
               }
            }
         }
         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjOp
    * Desc: Validates if the given object is a valid {op} object.
    * Arg1: obj(a {op} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "op",
    *   "type": "asgn | bex | exp",
    *   "v": "some valid op value"
    * }
    */
   validateSysObjOp(obj) {
      if (this.isSysObjOp(obj) && this.validateProperties(obj, ["sys", "type", "v"])) {
         if (!(obj.type === "asgn" || obj.type === "bex" || obj.type === "exp")) {
            return false;
         }
         return true;
      }
      return false;
   }

   /**
       * Name: validateSysObjConst
       * Desc: Validates if the given object is a valid const object.
       * Arg1: obj(a {const} object to check)
       * Returns: ret(some bool, true or false)
       * Struct:
       * {
       *   "sys": "const",
       *   "val": {val}
       * }
       */
   validateSysObjConst(obj) {
      if (this.isSysObjConst(obj) && this.validateProperties(obj, ["sys", "val"])) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjVar
    * Desc: Validates if the given object is a valid var object.
    * Arg1: obj(a {var} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "var",
    *   "name": "some name",
    *   "val": {val}
    * }
    */
   validateSysObjVar(obj) {
      if (this.isSysObjVar(obj) && this.validateProperties(obj, ["sys", "name", "val"])) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjArg
    * Desc: Validates if the given object is a valid arg object.
    * Arg1: obj(a {arg} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "arg",
    *   "name": "some name",
    *   "val": {val}
    * }
    */
   validateSysObjArg(obj) {
      if (this.isSysObjArg(obj) && this.validateProperties(obj, ["sys", "name", "val"])) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjVal
    * Desc: Validates if the given object is a valid val object.
    * Arg1: obj(a {val} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "val",
    *   "type": "int | float | string | bool & type of string",
    *   "v": "some valid value"
    * }
    */
   validateSysObjVal(obj) {
      //this.wr("validateSysObjVal: Receiving: ");
      //this.wrObj(obj);   
      if (this.isSysObjVal(obj) && this.validateProperties(obj, ["sys", "type", "v"])) {
         if (!(obj.type === "int" || obj.type === "float" || obj.type === "string" || obj.type === "bool")
            && !(obj.type === "int[]" || obj.type === "float[]" || obj.type === "string[]" || obj.type === "bool[]")) {
            return false;
         }

         var isArray = false;
         var arrayLen = 0;
         if (obj.type === "int[]" || obj.type === "float[]" || obj.type === "string[]" || obj.type === "bool[]") {
            isArray = true;
            if (!this.validateProperties(obj, ["len"])) {
               this.wr("validateSysObjVal: Error: array is missing length: " + obj.v + ", type: " + obj.type);
               return false;
            } else {
               if (!this.isInteger(obj.len) || this.toInt(obj.len) < 0) {
                  this.wr("validateSysObjVal: Error: array length is invalid: " + obj.v + ", type: " + obj.type + ", " + obj.len + ", " + this.isInteger(obj.len));
                  return false;
               } else {
                  arrayLen = this.toInt(obj.len);
               }
            }
         }

         //ignore references
         var tmp = this.toStr(obj.v);
         if (tmp.indexOf("#.") === -1 && tmp.indexOf("$.") === -1) {
            if (!isArray) {
               //base data types
               if (obj.type === "int") {
                  if (!this.isInteger(this.toInt(obj.v))) {
                     this.wr("validateSysObjVal: Error: value is not an int value: " + obj.v + ", type: " + obj.type);
                     return false;
                  } else {
                     obj.v = this.toInt(obj.v);
                  }
               } else if (obj.type === "float") {
                  if (!this.isFloat(this.toFloat(obj.v))) {
                     this.wr("validateSysObjVal: Error: value is not a float value: " + obj.v + ", type: " + obj.type);
                     return false;
                  } else {
                     obj.v = this.toFloat(obj.v);
                  }
               } else if (obj.type === "string") {
                  if (!this.isString(this.toStr(obj.v))) {
                     this.wr("validateSysObjVal: Error: value is not a string value: " + obj.v + ", type: " + obj.type);
                     return false;
                  } else {
                     obj.v = this.toStr(obj.v);
                  }
               } else if (obj.type === "bool") {
                  if (!this.isBool(this.toBool(obj.v))) {
                     this.wr("validateSysObjVal: Error: value is not a boolean value: " + obj.v + ", type: " + obj.type);
                     return false;
                  } else {
                     obj.v = this.toBool(obj.v);
                  }
               } else {
                  this.wr("validateSysObjVal: Error: unknown object type: " + obj.v + ", type: " + obj.type);
                  return false;
               }
            } else {
               var tmpA = this.toArray(obj.v);
               var arrayLenActual = tmpA.length;
               if (arrayLenActual !== arrayLen) {
                  this.wr("validateSysObjVal: Error: array length mismatch: " + obj.v + ", type: " + obj.type);
                  return false;
               }

               var skipArVer = false;
               if (this.validateProperties(obj, ["strict"]) === true && this.isBool(obj.strict) && this.toBoolInt(obj.strict) === 0) {
                  skipArVer = true;
               }

               //array data types
               if (obj.type === "int[]") {
                  if (!this.isArray(obj.v)) {
                     this.wr("validateSysObjVal: Error: value is not an array value: " + obj.v + ", type: " + obj.type);
                     return false;
                  } else {
                     for (var i = 0; i < arrayLenActual; i++) {
                        var ltmp = tmpA[i];
                        if (!this.isArrayType(ltmp.val.type) && (!this.isSysObjVar(ltmp) || (!skipArVer && ltmp.val.type !== "int"))) {
                           this.wr("validateSysObjVal: Error: array element " + i + " has the wrong type, expected 'int' but found '" + ltmp.val.type + "'");
                           return false;
                        }
                     }
                  }
               } else if (obj.type === "float[]") {
                  if (!this.isArray(obj.v)) {
                     this.wr("validateSysObjVal: Error: value is not an array value: " + obj.v + ", type: " + obj.type);
                     return false;
                  } else {
                     for (var i = 0; i < arrayLenActual; i++) {
                        var ltmp = tmpA[i];
                        if (!this.isArrayType(ltmp.val.type) && (!this.isSysObjVar(ltmp) || (!skipArVer && ltmp.val.type !== "float"))) {
                           this.wr("validateSysObjVal: Error: array element " + i + " has the wrong type, expected 'float' but found '" + ltmp.val.type + "'");
                           return false;
                        }
                     }
                  }
               } else if (obj.type === "string[]") {
                  if (!this.isArray(obj.v)) {
                     this.wr("validateSysObjVal: Error: value is not an array value: " + obj.v + ", type: " + obj.type);
                     return false;
                  } else {
                     for (var i = 0; i < arrayLenActual; i++) {
                        var ltmp = tmpA[i];
                        if (!this.isArrayType(ltmp.val.type) && (!this.isSysObjVar(ltmp) || (!skipArVer && ltmp.val.type !== "string"))) {
                           this.wr("validateSysObjVal: Error: array element " + i + " has the wrong type, expected 'string' but found '" + ltmp.val.type + "'");
                           return false;
                        }
                     }
                  }
               } else if (obj.type === "bool[]") {
                  if (!this.isArray(obj.v)) {
                     this.wr("validateSysObjVal: Error: value is not an array value: " + obj.v + ", type: " + obj.type);
                     return false;
                  } else {
                     for (var i = 0; i < arrayLenActual; i++) {
                        var ltmp = tmpA[i];
                        if (!this.isArrayType(ltmp.val.type) && (!this.isSysObjVar(ltmp) || (!skipArVer && ltmp.val.type !== "bool"))) {
                           this.wr("validateSysObjVal: Error: array element " + i + " has the wrong type, expected 'bool' but found '" + ltmp.val.type + "'");
                           return false;
                        }
                     }
                  }
               } else {
                  this.wr("validateSysObjVal: Error: unknown array object type: " + obj.v + ", type: " + obj.type);
                  return false;
               }
            }
         }
         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjRef
    * Desc: Validates if the given object is a valid ref object.
    * Arg1: obj(a {ref} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "ref",
    *   "val": {val & with value like #.vars.tmp1 or $.vars.tmp1}
    * }
    */
   validateSysObjRef(obj) {
      if (this.isSysObjRef(obj) && this.validateProperties(obj, ["sys", "val"])) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /**
    * Name: validateSysObjReturn
    * Desc: Validates if the given object is a valid return object.
    * Arg1: obj(a {return} object to check)
    * Returns: ret(some bool, true or false)
    * Struct:
    * {
    *   "sys": "return",
    *   "val": {ref} | {const}
    * }
    */
   validateSysObjReturn(obj) {
      if (this.isSysObjReturn(obj) && this.validateProperties(obj, ["sys", "val"])) {
         if (!this.isSysObjRef(obj.val) && !this.isSysObjConst(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /**
    * Name: validateProperties
    * Desc: Validates if the given object has each of the array elements specified in req.
    * Arg1: obj({sys} obj to check)
    * Arg2: req(array of attribute names to check for)
    * Returns: ret(some bool, true or false)
    */
   validateProperties(obj, req) {
      if (obj === null || req === null) {
         return false;
      }

      for (var i = 0; i < req.length; i++) {
         var r = req[i];
         if (obj.hasOwnProperty(r) === false) {
            return false;
         }
      }
      return true;
   }

   /////////////////////////UTILITY METHODS
   /**
    * Name: wrErr
    * Desc: Writes a string to standard error if LOGGING is on.
    * Arg1: e(exception to write)
    */
   wrErr(e) {
      if (this.LOGGING === true) {
         console.log(e);
      }
   }

   /**
    * Name: wr
    * Desc: Writes a string to standard output if LOGGING is on.
    *       Sets the WR_PREFIX to each string written.
    * Arg1: s(string to write)
    */
   wr(s) {
      if (this.LOGGING === true) {
         console.log(this.WR_PREFIX + s);
      }
   }

   /**
    * Name: getVersion
    * Desc: A method to access the version of this JsonPL interpreter.
    * Returns: ret(string version number)
    */
   getVersion() {
      this.wr(this.version);
      return this.version;
   }
   
   /**
    * Name: cloneJsonObj
    * Desc: A method to clone the given JSON object argument.
    * Arg1: jsonObj(the JSON object to clone)
    * Returns: ret(cloned JSON object)
    */
   cloneJsonObj(jsonObj) {
      return JSON.parse(JSON.stringify(jsonObj));
   }
   
   /**
    * Name: cloneJsonObjList
    * Desc: A method to clone the given JSON object list argument.
    * Arg1: jsonObj(the JSON object list to do a shallow clone)
    * Returns: ret(cloned JSON object)
    */
   cloneJsonObjList(jsonObj) {
      return JSON.parse(JSON.stringify(jsonObj));
   }

   /**
    * Name: wrObj
    * Desc: Writes a JSON object to standard output if LOGGING is on.
    *       Sets the WR_PREFIX to each object written.
    *       Prints object using pretty JSON.stringify call.
    * Arg1: jsonObj(jsonObj to write)
    */
   wrObj(jsonObj) {
      if (this.LOGGING === true) {
         this.wr(JSON.stringify(jsonObj, null, 2));
         this.wr("");
      }
   }

   /**
    * Name: wrObjAbr
    * Desc: Writes a JSON object to standard output if LOGGING is on.
    *       Sets the WR_PREFIX to each object written.
    *       Prints object using NON pretty JSON.stringify call.
    * Arg1: jsonObj(jsonObj to write)
    */
   wrObjAbr(jsonObj) {
      if (this.LOGGING === true) {
         this.wr(JSON.stringify(jsonObj));
      }
   }

   /**
    * Name: wrObjList
    * Desc: Writes a JSON object list to write to standard output if LOGGING is on.
    *       Sets the WR_PREFIX to each object written.
    *       Prints object using pretty JSON.stringify call.
    * Arg1: jsonObj(jsonObj list to write)
    */
   wrObjList(jsonObjs) {
      if (this.LOGGING === true) {
         for (var i = 0; i < jsonObjs.length; i++) {
            this.wrObj(jsonObjs[i]);
         }
      }
   }

   /**
    * Name: wrVal
    * Desc: Writes a JSON val object to standard output if LOGGING is on.
    *       Sets the WR_PREFIX to each object written.
    *       Prints object using pretty JSON.stringify call.
    * Arg1: v({val} obj to write)
    */
   wrVal(v) {
      if (this.LOGGING === true) {
         if (this.isSysObjValArray(v)) {
            this.wr(this.WR_PREFIX + "Val Obj: Type: " + v.type + " len: " + v.len);
         } else {
            this.wr(this.WR_PREFIX + "Val Obj: Type: " + v.type + " v: " + v.v);
         }
      }
   }

   /**
    * Name: sysLen
    * Desc: Returns the length of the given object.
    *       Non-array objects return a value of 0.
    * Arg1: args(array of {arg} objects)
    * Arg2: func(the associated {func} object if any)
    * Returns: ret(a {const} object)
    */
   sysLen(args, func) {
      var s = null;
      var ret = null;
      var v = null;

      ret = this.getConst("int", "0");
      if (args === null) {
         this.wr("sysLen: Error: args cannot be null");
         return ret;
      } else if (func === null) {
         this.wr("sysLen: Error: func cannot be null");
         return ret;
      }
      s = args[0];

      if (s !== null && this.isObject(s) && this.isSysObj(s)) {
         s = this.getRef("string", s.val.v);
         v = this.processRef(s, func);
      } else {
         this.wr("sysLen: Error: reference argument cannt be null");
         return ret;
      }

      if (v !== null) {
         v = v.val;
      }

      if (v !== null && this.isSysObj(v)) {
         if (this.isSysObjValArray(v)) {
            ret = this.getConst("int", this.toStr(v.len));
         }
      }

      //this.wrVal(ret.val);
      return ret;
   }

   /**
    * Name: sysType
    * Desc: Returns the type of the given class {sys}} object.
    * Arg1: args(array of {arg} objects)
    * Arg2: func(the associated {func} object if any)
    * Returns: ret(a {ref} object)
    */
   sysType(args, func) {
      var s = null;
      var ret = null;
      var v = null;

      ret = this.getConst("string", "");
      if (args === null) {
         this.wr("sysType: Error: args cannot be null");
         return ret;
      } else if (func === null) {
         this.wr("sysType: Error: func cannot be null");
         return ret;
      }
      s = args[0];

      if (s !== null && this.isObject(s) && this.isSysObj(s)) {
         s = this.getRef("string", s.val.v);
         v = this.processRef(s, func);
      } else {
         this.wr("sysType: Error: reference argument cannt be null");
         return ret;
      }

      if (v !== null) {
         v = v.val;
      }

      if (v !== null && this.isSysObj(v)) {
         ret = this.getConst("string", this.toStr(v.type));
      }

      //this.wrVal(ret.val);
      return ret;
   }

   /**
    * Name: sysGetRefStr
    * Desc: Returns a string object with a reference to the {val} or {arg} object specified.
    * Arg1: args(a list of {arg} objects)
    * Arg2: func(the {func} object associated with this function call)
    * Returns: ret(a {const} object)
    */
   sysGetRefStr(args, func) {
      var ret = this.sysGetRef(args, func);
      ret.sys = "const";
      ret.val.type = "string";
      //this.wrVal(ret.val);
      return ret;
   }

   /**
    * Name: sysGetArrayIdxRefStr
    * Desc: Returns a string object with a reference to the specified array item.
    * Arg1: args(a list of {arg} objects)
    * Arg2: func(the {func} object associated with this function call)
    * Returns: ret(a {const} object)
    */
   sysGetArrayIdxRefStr(args, func) {
      var ret = this.sysGetArrayIdxRef(args, func);
      ret.sys = "const";
      ret.val.type = "string";
      //this.wrVal(ret.val);
      return ret;
   }

   /**
    * Name: sysGetArrayIdxRef
    * Desc: Returns a {ref}} to the specified array item.
    * Arg1: args(a list of {arg} objects)
    * Arg2: func(the {func} object associated with this function call)
    * Returns: ret(a {const} object)
    */
   sysGetArrayIdxRef(args, func) {
      var ret = this.sysGetRef(args, func);
      var idx = null;
      if (this.toStr(ret.val.v) !== "") {
         idx = this.toStr(args[3].val.v);
         ret.val.v += "." + idx;
      }
      //this.wrVal(ret.val);
      return ret;
   }

   /**
    * Name: sysGetRef
    * Desc: Returns a string object with a reference to the {val} or {arg} object specified.
    * Arg1: v(a {val} obj to get the reference for)
    * Arg2: isVar(bool indicating is the v object is a {var} or {arg})
    * Arg3: funcName(the name of the function to lookup the variable in, blank for class level)
    * Returns: ret(a {ref} object)
    */
   sysGetRef(args, func) {
      var ret = this.getRef("string", "");

      if (args === null) {
         this.wr("sysGetRef: Error: args cannot be null");
         return ret;
      } else if (func === null) {
         this.wr("sysGetRef: Error: func cannot be null");
         return ret;
      }

      if (this.isArray(args)) {
         for (var i = 0; i < args.length; i++) {
            if (!this.isSysObj(args[i]) || !this.isSysObjVal(args[i].val)) {
               this.wr("sysGetRef: Error: arg " + i + " is not a known object type");
               return ret;
            }
         }
      } else {
         this.wr("sysGetRef: Error: arg is not an array object");
         return ret;
      }

      var name = this.toStr(args[0].val.v);
      var isVar = this.toBool(args[1].val.v);
      var funcName = this.toStr(args[2].val.v);

      if (name !== null && name !== "") {
         if (funcName === null || funcName === "") {
            //lookup class variable
            var v = this.findVar(name, this.program);
            if (v !== null) {
               ret = this.getRef(v.val.type, "#.vars." + v.name);
            }
         } else {
            var lfunc = this.findFunc(funcName);
            if (lfunc !== null) {
               if (isVar) {
                  //lookup function variable
                  var v1 = this.findVar(name, lfunc);
                  if (v1 !== null) {
                     ret = this.getRef(v1.val.type, "$.vars." + v1.name);
                  }
               } else {
                  //lookup function arg
                  var v2 = this.findArg(name, lfunc);
                  if (v2 !== null) {
                     ret = this.getRef(v2.val.type, "$.args." + v2.name);
                  }
               }
            }
         }
      }
      //this.wrVal(ret.val);
      return ret;
   }

   /**
    * Name: sysMalloc
    * Desc: Returns a {ref} object with a reference to the newly created, non-array, variable {val} or {arg} object specified.
    * Arg1: isClassVar(a {const} obj with a bool value indicating if this is a new class or func variable)
    * Arg2: name(a {const} string indicating the name of the new var, blank value uses program object ID instead)
    * Arg3: type(a {const} string representing the variable type to allocate)
    * Arg4: val(a {const} or {ref} used as the value for the new variable)
    * Returns: ret(a {ref} object)
    */
   sysMalloc(args, func) {
      var ret = this.getConst("string", "");

      if (args === null) {
         this.wr("sysMalloc: Error: args cannot be null");
         return ret;
      } else if (func === null) {
         this.wr("sysMalloc: Error: func cannot be null");
         return ret;
      }

      if (this.isArray(args)) {
         for (var i = 0; i < args.length; i++) {
            if (!this.isSysObj(args[i]) || !this.isSysObjVal(args[i].val)) {
               this.wr("sysMalloc: Error: arg " + i + " is not a known object type");
               return ret;
            }
         }
      } else {
         this.wr("sysMalloc: Error: arg is not an array object");
         return ret;
      }

      var isClassVar = this.toBool(args[0].val.v);
      var name = this.toStr(args[1].val.v);
      var type = this.toStr(args[2].val.v);
      var val = this.toStr(args[3].val.v);
      var prog = this.program;

      if (this.isArrayType(type)) {
         this.wr("sysMalloc: Error: IsClassVar: " + isClassVar + ", Name: " + name + ", type of array not supported by this system function");
         return ret;
      }

      if (name === null || name === "" || name === undefined) {
         this.objId += 1;
         name = "objId_" + this.objId;
      }

      var res = null;
      if (isClassVar === true) {
         res = this.findVar(name, prog);
      } else {
         res = this.findVar(name, func);
      }

      if (res === null) {
         var vtmp = {};
         vtmp.sys = "var";
         vtmp.name = name;
         vtmp.val = {};
         vtmp.val.sys = "val";
         vtmp.val.type = type;
         vtmp.val.v = val;

         if (isClassVar === true) {
            prog.vars.push(vtmp);
            ret.val.v = "#.vars." + name;
         } else {
            func.vars.push(vtmp);
            ret.val.v = "$.vars." + name;
         }
      } else {
         if (isClassVar === true) {
            ret.val.v = "#.vars." + name;
         } else {
            ret.val.v = "$.vars." + name;
         }
         this.wr("sysMalloc: Warning: IsClassVar: " + isClassVar + ", Name: " + name + " already exists.");
      }

      //this.wrObj(ret);   
      return ret;
   }

   /**
    * Name: sysMallocArray
    * Desc: Returns a {ref} object with a reference to the newly created, non-array, variable {val} or {arg} object specified.
    * Arg1: isClassVar(a {const} obj with a bool value indicating if this is a new class or func variable)
    * Arg2: name(a {const} string indicating the name of the new var, blank value uses program object ID instead)
    * Arg3: type(a {const} string representing the variable type to allocate)
    * Arg4: len(a {const} or {ref} with an integer representing the array length)
    * Returns: ret(a {ref} object)
    */
   sysMallocArray(args, func) {
      var ret = this.getConst("string", "");

      if (args === null) {
         this.wr("sysMallocArray: Error: args cannot be null");
         return ret;
      } else if (func === null) {
         this.wr("sysMallocArray: Error: func cannot be null");
         return ret;
      }

      if (this.isArray(args)) {
         for (var i = 0; i < args.length; i++) {
            if (!this.isSysObj(args[i]) || !this.isSysObjVal(args[i].val)) {
               this.wr("sysMallocArray: Error: arg " + i + " is not a known object type");
               return ret;
            }
         }
      } else {
         this.wr("sysMallocArray: Error: arg is not an array object");
         return ret;
      }

      var tt = null;
      var isClassVar = this.toBool(args[0].val.v);
      var name = this.toStr(args[1].val.v);
      var type = this.toStr(args[2].val.v);
      var len = this.toInt(args[3].val.v);
      var strict = this.toBool(args[4].val.v);
      var prog = this.program;

      if (!this.isArrayType(type)) {
         this.wr("sysMallocArray: Error: IsClassVar: " + isClassVar + ", Name: " + name + ", non-array types are NOT supported by this system function");
         return ret;
      }

      if (name === null || name === "" || name === undefined) {
         this.objId += 1;
         name = "objId_" + this.objId;
      }

      var res = null;
      if (isClassVar === true) {
         res = this.findVar(name, prog);
      } else {
         res = this.findVar(name, func);
      }

      if (res === null) {
         var vtmp = {};
         vtmp.sys = "var";
         vtmp.name = name;
         vtmp.val = {};
         vtmp.val.sys = "val";
         vtmp.val.type = type;
         vtmp.val.len = len;
         vtmp.val.strict = strict;
         vtmp.val.v = [];

         if (args.length > 5) {
            var len = args.length;
            for (var i = 5; i < len; i++) {
               var itm = args[i].val.v;
               var itms = itm.split(","); //name,type,value
               if (itms !== null && itms.length === 3) {
                  var otmp = {};
                  otmp.sys = "var";
                  otmp.name = itms[0];
                  otmp.val = {};
                  otmp.val.sys = "val";
                  otmp.val.type = itms[1];
                  if (itms[2] !== "null") {
                     otmp.val.v = itms[2];
                  } else {
                     otmp.val.v = "";
                  }
                  vtmp.val.v.push(otmp);
               } else {
                  this.wr("sysMallocArray: Error: could not parse array entry encoded string, " + itm);
                  return ret;
               }
            }
         }

         if (!this.validateSysObjVar(vtmp)) {
            this.wr("sysMallocArray: Error: could not validate newly created array");
            return ret;
         }

         if (isClassVar === true) {
            prog.vars.push(vtmp);
            ret.val.v = "#.vars." + name;
         } else {
            func.vars.push(vtmp);
            ret.val.v = "$.vars." + name;
         }
      } else {
         if (isClassVar === true) {
            ret.val.v = "#.vars." + name;
         } else {
            ret.val.v = "$.vars." + name;
         }
         this.wr("sysMallocArray: Warning: IsClassVar: " + isClassVar + ", Name: " + name + " already exists.");
      }

      //this.wrObj(ret);   
      return ret;
   }

   /**
    * Name: sysClean
    * Desc: Removes the variable specified from the class or function vars..
    * Arg1: isClassVar(a {const} object with a bool value indicating if this is a new class or func variable)
    * Arg2: name(a {const} or {ref} string indicating the name of the var to delete)
    * Returns: ret(a {const} object with a bool value indicating the operation was successful)
    */
   sysClean(args, func) {
      var ret = this.getConst("bool", "false");

      if (args === null) {
         this.wr("sysClean: Error: args cannot be null");
         return ret;
      } else if (func === null) {
         this.wr("sysClean: Error: func cannot be null");
         return ret;
      }

      if (this.isArray(args)) {
         if (!this.isSysObj(args[0]) || !this.isSysObjVal(args[0].val)) {
            this.wr("sysClean: Error: arg 0 is not a known object type");
            return ret;
         }

         if (!this.isSysObj(args[1]) || !this.isSysObjVal(args[1].val)) {
            this.wr("sysClean: Error: arg 1 is not a known object type");
            return ret;
         }
      } else {
         this.wr("sysClean: Error: arg is not an array object");
         return ret;
      }

      var isClassVar = this.toBool(args[0].val.v);
      var name = this.toStr(args[1].val.v);
      var res = null;
      var prog = this.program;
      var refDec = null;
      //process ref for name
      if (this.isSysObjRef(args[1])) {
         if (this.isRefStringArray(args[1].val.v)) {
            this.wr("sysClean: Error: cannot handle an array item reference, " + args[1].val.v + ", for arg name");
            return ret;
         }

         refDec = this.processRef(args[1], func);
         if (refDec !== null) {
            name = this.toStr(refDec.name);
         } else {
            this.wr("sysClean: Error: could not resolve referece value, " + args[1].val.v + ", for arg name");
            return ret;
         }
      }

      var obj = null;
      if (isClassVar === true) {
         obj = prog;
      } else {
         obj = func;
      }
      res = this.findVar(name, obj);

      if (res !== null) {
         if (obj !== null) {
            for (var i = 0; i < obj.vars.length; i++) {
               if (obj.vars[i].name === name) {
                  //this.wr("sysClean: Info: Removing var with name: " + name);
                  obj.vars.splice(i, 1);
                  ret.val.v = "true";
                  break;
               }
            }
            //this.wr("sysClean: Info: Ending var array length: " + obj.vars.length);
         }
         return ret;

      } else {
         this.wr("sysClean: Error: IsClassVar: " + isClassVar + ", Name: " + name + " does NOT exist");
         return ret;
      }
   }

   /////////////////////////GENERIC OBJECT ID METHODS
   /**
    * Name: isObject
    * Desc: Checks if the given argument is a JSON object.
    * Arg1: arg(a JSON object)
    * Returns: (true | false)
    */
   isObject(arg) {
      if (arg === null) {
         return false;
      } else if (typeof arg === "object" && this.isArray(arg) === false) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isRefStringClass
    * Desc: Checks if the given argument is a class reference string.
    * Arg1: s(some string with a valid reference value)
    * Returns: ret(some bool, true or false)
    */
   isRefStringClass(s) {
      var ns = this.toStr(s);
      if (ns.indexOf("@.") === 0) {
         return true;
      }
      return false;
   }

   /**
    * Name: isRefString
    * Desc: Checks if the given argument is a reference string.
    * Arg1: s(some string with a valid reference value)
    * Returns: ret(some bool, true or false)
    */
   isRefString(s) {
      var ns = this.toStr(s);
      if (ns.indexOf("$.") === 0 || ns.indexOf("#.") === 0 || ns.indexOf("[$.") == 0 || ns.indexOf("[#.") == 0 || ns.indexOf("<$.") == 0 || ns.indexOf("<#.") == 0) {
         return true;
      }
      return false;
   }

   /**
    * Name: isRefStringUrl
    * Desc: Checks if the given argument is a URL reference string.
    * Arg1: s(some string with a valid reference value)
    * Returns: ret(some bool, true or false)
    */
   isRefStringUrl(s) {
      var ns = this.toStr(s);
      if (ns.indexOf("->(") !== -1) {
         return true;
      }
      return false;
   }

   /**
    * Name: isFuncSys
    * Desc: Checks if the given argument is a system function.
    * Arg1: s(some string with a valid reference value)
    * Returns: ret(some bool, true or false)
    */
   isFuncSys(s) {
      var ns = this.toStr(s);
      if (ns.indexOf("SYS::") !== -1) {
         return true;
      }
      return false;
   }

   /**
    * Name: isRefStringArray
    * Desc: Checks if the given argument is an array item reference string.
    * Arg1: s(some string with a valid array reference value)
    * Returns: ret(some bool, true or false)
    */
   isRefStringArray(s) {
      if (this.isRefString(s)) {
         var ns = this.toStr(s);
         var len = ns.length;
         var cnt = 0;
         for (var i = 0; i < len; i++) {
            if (ns.charAt(i) === '.') {
               cnt++;
            }
         }

         if (cnt === 3) {
            return true;
         }
      }
      return false;
   }

   /**
    * Name: isRefStringDec
    * Desc: Checks if the given argument is a decoded, no [] or <>, reference string.
    * Arg1: s(some string with a valid reference value)
    * Returns: ret(some bool, true or false)
    */
   isRefStringDec(s) {
      if (this.isRefString(s)) {
         var ns = this.toStr(s);
         if (ns.indexOf("[") === -1 && ns.indexOf("]") === -1 && ns.indexOf("<") === -1 && ns.indexOf(">") === -1) {
            return true;
         }
      }
      return false;
   }

   /**
    * Name: isRefStringArrayDec
    * Desc: Checks if the given argument is a decoded, no [], array item reference string.
    * Arg1: s(some string with a valid array item reference value)
    * Returns: ret(some bool, true or false)
    */
   isRefStringArrayDec(s) {
      if (this.isRefStringDec(s) && this.isRefStringArray(s)) {
         return true;
      }
      return false;
   }

   /**
    * Name: isArrayType
    * Desc: Checks if the given argument is an array type string.
    * Arg1: type(some string with a valid type value)
    * Returns: ret(some bool, true or false)
    */
   isArrayType(type) {
      var ns = this.toStr(type);
      if (ns === "int[]" || ns === "float[]" || ns === "string[]" || ns === "bool[]") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isBaseType
    * Desc: Checks if the given argument is a base type string.
    * Arg1: type(some string with a valid type value)
    * Returns: ret(some bool, true or false)
    */
   isBaseType(type) {
      var ns = this.toStr(type);
      if (ns === "int" || ns === "float" || ns === "string" || ns === "bool") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isArray
    * Desc: Checks if the given argument is an array.
    * Arg1: arg(some array object)
    * Returns: ret(some bool, true or false)
    */
   isArray(arg) {
      if (arg === null) {
         return false;
      } else {
         return Array.isArray(arg);
      }
   }

   /**
    * Name: isString
    * Desc: Checks if the given argument is a string.
    * Arg1: arg(some string)
    * Returns: (true | false)
    */
   isString(arg) {
      if (arg === null) {
         return false;
      } else if (typeof arg === 'string' || arg instanceof String) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isNumber
    * Desc: Checks if the given argument is a number.
    * Arg1: arg(some value)
    * Returns: (true | false)
    */
   isNumber(arg) {
      var tmp = this.toInt(arg);
      if (arg === null) {
         return false;
      } else if ((typeof tmp === "number" || tmp instanceof Number) && Number.isNaN(tmp) === false) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isInteger
    * Desc: Checks if the given argument is an integer.
    * Arg1: arg(some value)
    * Returns: (true | false)
    */
   isInteger(arg) {
      var tmp = this.toInt(arg);
      if (arg === null) {
         return false;
      } else if (this.isNumber(tmp) && Number.isInteger(tmp) === true && !this.isFloat(arg)) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isFloat
    * Desc: Checks if the given argument is a float.
    * Arg1: arg(some value)
    * Returns: (true | false)
    */
   isFloat(arg) {
      var tmp = this.toStr(arg);
      if (arg === null) {
         return false;
      } else if (this.isNumber(arg) && Number.isInteger(arg) === false && tmp.indexOf(".") !== -1) {
         return true;
      } else {
         return false;
      }
   }
   /**
    * Name: isBool
    * Desc: Checks if the given argument is a bool.
    * Arg1: arg(some value)
    * Returns: (true | false)
    */
   isBool(arg) {
      var vb = this.toStr(arg);
      vb = vb.toLowerCase();
      if (arg === null) {
         return false;
      } else if (typeof arg === 'boolean' || arg instanceof Boolean) {
         return true;
      } else if (this.isInteger(arg) && arg === 1 || arg === 0) {
         return true;
      } else if (this.isFloat(arg) && arg === 1.0 || arg === 0.0) {
         return true;
      } else if (this.isString(arg) && (vb === "yes" || vb === "no" || vb === "true" || vb === "false" || vb === "1" || vb === "0" || vb === "1.0" || vb === "0.0")) {
         return true;
      } else {
         return false;
      }
   }

   /////////////////////////OBJECT ID METHODS
   /**
    * Name: isSysObjIf
    * Desc: Checks if the given object is an if object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjIf(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "if") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjRef
    * Desc: Checks if the given object is a ref object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjRef(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "ref") {
         return true;
      } else {
         return false;
      }
   }
   
   /**
    * Name: isSysObjBex
    * Desc: Checks if the given object is a bex object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjBex(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "bex") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjExp
    * Desc: Checks if the given object is an exp object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjExp(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "exp") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjVal
    * Desc: Checks if the given object is a val object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjVal(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "val") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjArg
    * Desc: Checks if the given object is an {arg} object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjArg(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "arg") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjValArray
    * Desc: Checks if the given object is a val object array.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjValArray(obj) {
      if (this.isSysObjVal(obj) === true && this.validateProperties(obj, ["len"]) && this.isInteger(obj.len) && this.isArray(obj.v)) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjAsgn
    * Desc: Checks if the given object is an asgn object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjAsgn(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "asgn") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjConst
    * Desc: Checks if the given object is a const object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjConst(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "const") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjVar
    * Desc: Checks if the given object is a var object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjVar(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "var") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjCall
    * Desc: Checks if the given object is a call object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjCall(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "call") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjClass
    * Desc: Checks if the given object is a {class} object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjClass(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "class") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjFuncLine
    * Desc: Checks if the given object is a functio line object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjFuncLine(obj) {
      if (this.isSysObj(obj)) {
         if (this.getSysObjType(obj) === "asgn") {
            return true;

         } else if (this.getSysObjType(obj) === "for") {
            return true;

         } else if (this.getSysObjType(obj) === "if") {
            return true;

         } else if (this.getSysObjType(obj) === "return") {
            return true;

         } else if (this.getSysObjType(obj) === "call") {
            return true;

         } else {
            return false;
         }
      }
      return false;
   }

   /**
    * Name: isSysObjFunc
    * Desc: Checks if the given object is a func object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjFunc(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "func") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjFor
    * Desc: Checks if the given object is a for object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjFor(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "for") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjOp
    * Desc: Checks if the given object is an op object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjOp(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "op") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObjReturn
    * Desc: Checks if the given object is a return object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObjReturn(obj) {
      if (this.isSysObj(obj) === true && obj.sys === "return") {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: isSysObj
    * Desc: Checks if the given object is a object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   isSysObj(obj) {
      if (obj !== null && obj.hasOwnProperty("sys") === true && this.isObject(obj) === true) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * Name: getSysObjType
    * Desc: Gets the value of the sys attribute of the given object.
    * Arg1: obj(sys obj to check)
    * Returns: (true | false)
    */
   getSysObjType(obj) {
      if (this.isObject(obj) === true && this.isSysObj(obj) === true) {
         return obj.sys;
      } else {
         return null;
      }
   }

   /////////////////////////PROCESS METHODS
   /**
    * Name: processUrlFind
    * Desc: A function that's used to process a URL variable reference by asking the target URL.
    * Arg1: url(some complete URL with get message generated by JsonPL)
    * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
    */
   processUrlFind(url, async=false) {
      if (this.VERBOSE) {
         this.wr("processUrlFind: Received url: " + url);
      }

      if (url === null || url === '') {
         this.wr("processUrlFind: Error: url is not properly defined");
         return null;
      }

      if (url.length >= 2048) {
         this.wr("processUrlFind: Warning: maximum URL length with get params has been reached!");
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, async);
      if(async) {
         xhr.onload = function () {
            var that = this;
            //that.wr('DONE: ', xhr.status);
            if (xhr.status === 200 || xhr.status === 0) {
               var obj = JSON.parse(xhr.responseText);
               if (this.toBool(obj.error) === false) {
                  if (this.VERBOSE) {
                     that.wr("processUrlFind: Notice: found response: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
                  }
      
                  return obj.result;
               } else {
                  that.wr("processUrlFind: Error: ref request had issues: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
                  return null;
               }
            } else {
               that.wr("processUrlFind: Error: bad status code received: " + xhr.status);
            }
         }.bind(this);
      }

      xhr.send();
      if(async) {
         return null;
      }
      
      if(!async) {
         if (xhr.status === 200 || xhr.status === 0) {
            var obj = JSON.parse(xhr.responseText);
            if (this.toBool(obj.error) === false) {
               if (this.VERBOSE) {
                  this.wr("processUrlFind: Notice: found response: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
               }

               return obj.result;
            } else {
               this.wr("processUrlFind: Error: ref request had issues: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
               return null;
            }
         } else {
            this.wr("processUrlFind: Error: bad status code received: " + xhr.status);
         }
      }
      return null;
   }

   /**
    * Name: processUrlSet
    * Desc: A function used to set the value of a URL variable.
    * Arg1: url(some complete URL with set message generated by JsonPL)
    * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
    */
   processUrlSet(url, async=false) {
      if (this.VERBOSE) {
         this.wr("processUrlSet: Received url: " + url);
      }

      if (url === null || url === '') {
         this.wr("processUrlSet: Error: url is not properly defined");
         return null;
      }

      if (url.length >= 2048) {
         this.wr("processUrlSet: Warning: maximum URL length with get params has been reached!");
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, async);
      if(async) {
         xhr.onload = function () {
            var that = this;            
            //that.wr('DONE: ', xhr.status);
            if (xhr.status === 200 || xhr.status === 0) {
               var obj = JSON.parse(xhr.responseText);
               if (this.toBool(obj.error) === false) {
                  if (this.VERBOSE) {
                     that.wr("processUrlSet: Notice: found response: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
                  }
      
                  return obj.result;
               } else {
                  that.wr("processUrlSet: Error: ref request had issues: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
                  return null;
               }
            } else {
               that.wr("processUrlSet: Error: bad status code received: " + xhr.status);
            }
         }.bind(this);
      }

      xhr.send();
      if(async) {
         return null;
      }
      
      if(!async) {
         if (xhr.status === 200 || xhr.status === 0) {
            var obj = JSON.parse(xhr.responseText);
            if (this.toBool(obj.error) === false) {
               if (this.VERBOSE) {
                  this.wr("processUrlSet: Notice: found response: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
               }

               return obj.result;
            } else {
               this.wr("processUrlSet: Error: ref request had issues: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
               return null;
            }
         } else {
            this.wr("processUrlSet: Error: bad status code received: " + xhr.status);
         }
      }
      return null;
   }

   /**
    * Name: processUrlCall
    * Desc: A function used to call a URL function.
    * Arg1: url(some complete URL with set message generated by JsonPL)
    * Returns: {null | (const obj, sys=var) | (ref obj, sys=arg)}
    */
   processUrlCall(url, async=false) {
      if (this.VERBOSE) {
         this.wr("processUrlCall: Received url: " + url);
      }

      if (url === null || url === '') {
         this.wr("processUrlCall: Error: url is not properly defined");
         return null;
      }

      if (url.length >= 2048) {
         this.wr("processUrlCall: Warning: maximum URL length with get params has been reached!");
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, async);
      if(async) {
         xhr.onload = function () {
            var that = this;
            //that.wr('DONE: ', xhr.status);
            if (xhr.status === 200 || xhr.status === 0) {
               var obj = JSON.parse(xhr.responseText);
               if (this.toBool(obj.error) === false) {
                  if (this.VERBOSE) {
                     that.wr("processUrlCall: Notice: found response: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
                  }
      
                  return obj.result;
               } else {
                  that.wr("processUrlCall: Error: ref request had issues: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
                  return null;
               }
            } else {
               that.wr("processUrlCall: Error: bad status code received: " + xhr.status);
            }
         }.bind(this);
      }

      xhr.send();
      if(async) {
         return null;
      }
      
      if(!async) {
         if (xhr.status === 200 || xhr.status === 0) {
            var obj = JSON.parse(xhr.responseText);
            if (this.toBool(obj.error) === false) {
               if (this.VERBOSE) {
                  this.wr("processUrlCall: Notice: found response: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
               }

               return obj.result;
            } else {
               this.wr("processUrlCall: Error: ref request had issues: " + obj.message + ", " + xhr.responseText + ", " + xhr.status);
               return null;
            }
         } else {
            this.wr("processUrlCall: Error: bad status code received: " + xhr.status);
         }
      }
      return null;
   }

   /**
    * Name: processRef
    * Desc: Processes a class var or func var or arg reference string.
    * Arg1: objRef(string ref encoding)
    * Arg2: func(func obj, sys=func)
    * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
    */
   processRef(objRef, func, url=null) {
      var path = null;
      var vls = null;
      var fnd = null;
      var prog = this.program;

      if (this.VERBOSE) {
         this.wr("processRef: Receiving: ");
         this.wrObj(objRef);
      }

      if (!this.isSysObjRef(objRef)) {
         this.wr("processRef: Error: argument objRef is not a ref obj");
         return null;
      } else if (!this.isSysObjFunc(func)) {
         this.wr("processRef: Error: argument objRef is not a func obj");
         return null;
      }

      path = this.toStr(objRef.val.v);

      if (this.VERBOSE) {
         this.wr("processRef: Initial Path: " + path);
      }

      //check for URL
      var urlStart = path.indexOf("->(");
      var hasUrl = false;
      var forceLocal = false;

      if (this.VERBOSE) {
         this.wr("processRef: Url Start Index: " + urlStart);
      }

      var nvs = null;
      var nurl = null;
      var npath = null;

      if (url === null) {
         this.lastProcessUrlFindPath = null;
      }

      if (urlStart !== -1) {
         nvs = path.split("->(");
         npath = nvs[0].trim();
         nurl = nvs[1].substring(0, nvs[1].length - 1).trim();

         if (this.VERBOSE) {
            this.wr("processRef: New Path: " + npath);
            this.wr("processRef: New URL: " + nurl);
         }

         hasUrl = true;
         url = nurl;
         path = npath;
      }

      if (url !== null) {
         hasUrl = true;
      }

      if (this.VERBOSE) {
         this.wr("processRef: Has URL: " + hasUrl);
      }

      //check for forced local de-reference for outer bracket only
      if (path.charAt(0) === '<') {
         path = path.replaceAll("<", "[");
         path = path.replaceAll(">", "]");
         forceLocal = true;
      }

      if (path.charAt(0) === '[') {
         var cnt = 0;
         var i = 0;
         var cs = path;
         var llen = path.length;
         for (; i < llen; i++) {
            if (cs.charAt(i) === "[") {
               cnt += 1;
            } else if (cs.charAt(i) === "]") {
               cnt -= 1;
            }

            if (cnt === 0) {
               break;
            }
         }

         var nc = path.substring(1, i);
         i += 1;

         tmp = {};
         tmp.sys = "ref";
         tmp.val = {};
         tmp.val.sys = "val";
         tmp.val.type = "string";
         tmp.val.v = nc;

         if (this.VERBOSE) {
            this.wr("processRef: Initial De-Reference:");
            this.wrObj(tmp);
         }

         if (!forceLocal) {
            tmp = this.cloneJsonObj(this.processRef(tmp, func, url));
         } else {
            tmp = this.cloneJsonObj(this.processRef(tmp, func, null));
         }

         if (tmp !== null) {
            if (path.length >= i) {
               tmp.val.v += path.substring(i);
            }

            path = this.toStr(tmp.val.v);
            if (path.indexOf("[") === -1 && path.indexOf("#.") === -1 && path.indexOf("$.") === -1) {
               if (this.VERBOSE) {
                  this.wr("processRef: Returning: ");
                  this.wrObj(tmp);
               }
               return tmp;
            }
         } else {
            this.wr("processRef: Error 1: could not lookup object, for ref path: " + path);
            return null;
         }
      }

      vls = path.split(".");

      var inDynRef = false;
      var nvls = [];
      var tt = null;
      var obrk = 0;
      for (var k = 0; k < vls.length; k++) {
         if (inDynRef && vls[k].indexOf("]") !== -1) {
            obrk--;
            for (var i = vls[k].indexOf("]") + 1; i < vls[k].length; i++) {
               if (vls[k].charAt(i) === ']') {
                  obrk--;
               }
            }

            tt += "." + vls[k];
            if (obrk === 0) {
               inDynRef = false;
               nvls.push(tt);
            }
         } else if (!inDynRef && vls[k].indexOf("[") !== -1) {
            obrk = 1;
            inDynRef = true;
            tt = vls[k];
         } else if (inDynRef) {
            if (vls[k].indexOf("[") !== -1) {
               obrk++;
            }
            tt += "." + vls[k];
         } else {
            if (vls[k] !== null) {
               nvls.push(vls[k]);
            }
         }
      }

      vls = [];
      for (var k = 0; k < nvls.length; k++) {
         if (nvls[k] !== null) {
            vls[k] = nvls[k];

            if (this.VERBOSE) {
               this.wr("processRef: path idx: " + k + " val: " + vls[k]);
            }
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

      for (var k = 0; k < vls.length; k++) {
         var c = vls[k];

         if (!foundSource) {
            //program/class         
            if (c === '#') {
               isFunc = false;
               foundSource = true;
            } else if (c === '$') {
               isFunc = true;
               foundSource = true;
            } else {
               this.wr("processRef: Error: could not find correct the ref, for source, " + c + ", ref path: " + path);
               return null;
            }
         } else if (!foundType) {
            //program/class
            if (!isFunc) {
               if (c === 'vars') {
                  isVars = true;
                  foundType = true;
               } else {
                  this.wr("processRef: Error: could not find, for type, " + c + ", for source isFunc = " + isFunc + ", ref path: " + path);
                  return null;
               }
               //function
            } else {
               if (c === 'vars') {
                  isVars = true;
                  foundType = true;
               } else if (c === 'args') {
                  isVars = false;
                  foundType = true;
               } else {
                  this.wr("processRef: Error: could not find, for type, " + c + ", for source isFunc = " + isFun + ", ref path: " + pathc);
                  return null;
               }
            }
         } else if (!foundName) {
            //program/class
            name = c;
            var tmp = null;
            //lookup use of string var here
            if (c.indexOf('[') === 0) {
               var nc = c.substring(1, c.length - 1);

               tmp = {};
               tmp.sys = "ref";
               tmp.val = {};
               tmp.val.sys = "val";
               tmp.val.type = "string";
               tmp.val.v = nc;

               tmp = this.cloneJsonObj(this.processRef(tmp, func, url));
               if (tmp !== null && tmp.val.type === "string") {
                  name = this.toStr(tmp.val.v);
               } else {
                  this.wr("processRef: Error 2: could not lookup object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc + ", ref path: " + path);
                  return null;
               }
            }

            if (!isFunc) {
               //class find name            
               if (isVars) {
                  if (hasUrl) {
                     if (this.lastProcessUrlFindPath === null) {
                        this.lastProcessUrlFindPath = "#.vars." + name;
                     }
                     fnd = this.processUrlFind(url + "&type=get&ref=" + encodeURIComponent("#.vars." + name));
                  } else {
                     fnd = this.findVar(name, prog);
                  }
               } else {
                  this.wr("processRef: Error: could not find, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc + ", ref path: " + path);
                  return null;
               }
               //function
            } else {
               //function find name
               if (isVars) {
                  if (hasUrl) {
                     if (this.lastProcessUrlFindPath === null) {
                        this.lastProcessUrlFindPath = "$.vars." + name;
                     }
                     fnd = this.processUrlFind(url + "&type=get&ref=" + encodeURIComponent("$.vars." + name));
                  } else {
                     fnd = this.findVar(name, func);
                  }
               } else {
                  if (hasUrl) {
                     if (this.lastProcessUrlFindPath === null) {
                        this.lastProcessUrlFindPath = "$.args." + name;
                     }
                     fnd = this.processUrlFind(url + "&type=get&ref=" + encodeURIComponent("$.args." + name));
                  } else {
                     fnd = this.findArg(name, func);
                  }
               }
            }

            if (fnd !== null) {
               type = fnd.val.type;
               foundName = true;
            } else {
               this.wr("processRef: Error: could not find an object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc + ", ref path: " + path);
               return null;
            }
         } else if (!foundIndex) {
            var lidx = this.toStr(c);
            tmp = null;

            //lookup use of string var here
            if (c.indexOf('[') === 0) {
               var nc = c.substring(1, c.length - 1);

               tmp = {};
               tmp.sys = "ref";
               tmp.val = {};
               tmp.val.sys = "val";
               tmp.val.type = "string";
               tmp.val.v = nc;

               tmp = this.cloneJsonObj(this.processRef(tmp, func, url));
               if (tmp !== null && tmp.val.type === "int") {
                  idx = this.toInt(tmp.val.v);
                  lidx = this.toStr(tmp.val.v);
               } else {
                  this.wr("processRef: Error 3: could not lookup object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc + ", ref path: " + path);
                  return null;
               }
            }

            if (this.isSysObjValArray(fnd.val)) {
               if (this.isNumber(lidx)) {
                  idx = this.toInt(lidx);
                  fnd = (this.toArray(fnd.val.v)[idx]);

                  if (hasUrl && this.lastProcessUrlFindPath !== null) {
                     this.lastProcessUrlFindPath += "." + idx;
                  }

                  foundIndex = true;
               } else {
                  var ar = this.toArray(fnd.val.v);
                  var len = ar.length;
                  var target = this.toStr(lidx);
                  for (var l = 0; l < len; l++) {
                     if (ar[l].name === target) {

                        if (hasUrl && this.lastProcessUrlFindPath !== null) {
                           this.lastProcessUrlFindPath += "." + target;
                        }

                        fnd = ar[l];
                        foundIndex = true;
                        break;
                     }
                  }
               }
            } else {
               this.wr("processRef: Error: index entry is only for vars/args of type array, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc + ", ref path: " + path);
               return null;
            }
         }
      }

      //clean up values, v, force to string formating
      if (fnd != null) {
         if (this.isArray(fnd.val.v) == false) {
            var ns = this.toStr(fnd.val.v);
            if (ns.indexOf("$") === -1 && ns.indexOf("#") === -1) {
               fnd.val.v = ns;
            }
         } else {
            fnd.val.v = this.toArray(fnd.val.v);
            for (var z = 0; z < fnd.val.v.length; z++) {
               var nd = fnd.val.v[z];
               var nds = this.toStr(nd.val.v);
               if (nds.indexOf("$") === -1 && nds.indexOf("#") === -1) {
                  nd.val.v = nds;
               }
            }
         }
      }

      if (this.VERBOSE) {
         this.wr("processRef: Returning: ");
         this.wrObj(fnd);
      }
      return fnd;
   }

   /**
    * Name: toBoolInt
    * Desc: Converts the boolean value v to an integer representation.
    * Arg1: v(the value to convert)
    * Returns: (0 | 1)
    */
   toBoolInt(v) {
      if (this.toBool(v)) {
         return 1;
      } else {
         return 0;
      }
   }

   /**
    * Name: toInt
    * Desc: Converts the value v to an integer representation.
    * Arg1: v(the value to convert)
    * Returns: (the int value of v)
    */
   toInt(v) {
      return parseInt(v);
   }

   /**
    * Name: toFloat
    * Desc: Converts the value v to a float representation.
    * Arg1: v(the value to convert)
    * Returns: (the float value of v)
    */
   toFloat(v) {
      return parseFloat(v);
   }

   /**
    * Name: toStr
    * Desc: Converts the value v to a string representation.
    * Arg1: v(the value to convert)
    * Returns: (the string value of v)
    */
   toStr(v) {
      if (this.isObject(v)) {
         return JSON.stringify(v);
      } else if (this.isArray(v)) {
         return JSON.stringify(v);
      } else {
         return String(v + "");
      }
   }

   /**
    * Name: toArray
    * Desc: Converts the value v to an array representation.
    * Arg1: v(the value to convert)
    * Returns: (the array value of v)
    */
   toArray(v) {
      if (this.isArray(v)) {
         return v;
      } else {
         var ret = [];
         ret.push(v);
         return ret;
      }
   }

   /**
    * Name: toBool
    * Desc: Converts the value v to a boolean representation.
    * Arg1: arg(the value to convert)
    * Returns: (the bool value of v)
    */
   toBool(arg) {
      var vb = this.toStr(arg);
      vb = vb.toLowerCase();
      if (arg === null) {
         return false;

      } else if (typeof arg === 'boolean' || arg instanceof Boolean) {
         return arg;

      } else if (this.isInteger(arg) && arg === 1) {
         return true;

      } else if (this.isInteger(arg) && arg === 0) {
         return false;

      } else if (this.isFloat(arg) && arg === 1.0) {
         return true;

      } else if (this.isFloat(arg) && arg === 0.0) {
         return false;

      } else if (this.isString(arg) && (vb === "yes" || vb === "true" || vb === "1" || vb === "1.0")) {
         return true;

      } else if (this.isString(arg) && (vb === "no" || vb === "false" || vb === "0" || vb === "0.0")) {
         return false;

      } else {
         return false;
      }
   }

   /**
    * Name: processIf
    * Desc: Processes an if statement. Returns the value of the Boolean if statement expression.
    * Arg1: objIf(if obj, sys=if)
    * Arg2: func(func obj, sys=func)
    * Returns: {null | (const obj, sys=const)}
    */
   processIf(objIf, func) {
      var left = null;
      var op = null;
      var right = null;
      var thn = null;
      var els = null;

      if (!this.isSysObjIf(objIf)) {
         this.wr("processFor: Error: argument objIf is not an if obj");
      } else if (!this.isSysObjFunc(func)) {
         this.wr("processFor: Error: argument func is not a func obj");
         return null;
      }

      left = objIf.left;
      op = objIf.op;
      right = objIf.right;
      thn = objIf.thn;
      els = objIf.els;

      if (this.isSysObjConst(left)) {
         //do nothing
      } else if (this.isSysObjRef(left)) {
         left = this.processRef(left, func);

      } else if (this.isSysObjBex(left)) {
         left = this.processBex(left, func);

      } else if (this.isSysObjExp(left)) {
         left = this.processExp(left, func);

      } else if (this.isSysObjCall(left)) {
         left = this.processCall(left, func);

      } else {
         this.wr("processBex: Error: argument left must be a ref obj");
         return null;
      }

      if (left === null) {
         this.wr("processBex: Error: error processing left");
         return null;
      }

      if (this.isSysObjConst(right)) {
         //do nothing
      } else if (this.isSysObjRef(right)) {
         right = this.processRef(right, func);

      } else if (this.isSysObjBex(right)) {
         right = this.processBex(right, func);

      } else if (this.isSysObjExp(right)) {
         right = this.processExp(right, func);

      } else if (this.isSysObjCall(right)) {
         right = this.processCall(right, func);

      } else {
         this.wr("processBex: Error: argument right is an unknown obj: " + this.getSysObjType(right));
         return null;
      }

      if (right === null) {
         this.wr("processBex: Error: error processing right");
         return null;
      }

      //this.wr("left:");
      //this.wrObj(left);
      //this.wr("right:");
      //this.wrObj(right);   
      if (left.val.type === right.val.type) {
         var ret = {};
         ret.sys = "val";
         ret.type = "bool";
         ret.v = null;

         var ret2 = {};
         ret2.sys = "const";

         var ret3 = null;

         if (op.v === "==") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) === parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) === parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) === this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v) === String(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === "!=") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) !== parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) !== parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) !== this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v) !== String(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === "<") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) < parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) < parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) < this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v).length < String(right.val.v).length) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === ">") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) > parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) > parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) > this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v).length > String(right.val.v).length) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === "<=") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) <= parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) <= parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) <= this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v).length <= String(right.val.v).length) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === ">=") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) >= parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) >= parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) >= this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v).length >= String(right.val.v).length) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else {
            this.wr("processBex: Error: unknown operator: " + op.v);
            return null;
         }

         if (this.toBool(ret.v) === true) {
            //run thn lines
            if (thn != null && thn.length > 0) {
               ret3 = this.processIfForLines(thn, func);
            }
         } else {
            //run els lines
            if (els != null && els.length > 0) {
               ret3 = this.processIfForLines(els, func);
            }
         }

         ret2.val = ret;
         ret = ret2;
         this.lastIfReturn = ret;

         if (this.isSysObjReturn(ret3)) {
            return ret3;
         } else {
            return ret;
         }
      } else {
         this.wr("processBex: Error: type mismatch: " + left.val.type + " - " + right.val.type);
         return null;
      }
   }

   /**
    * Name: processIfForLines
    * Desc: Processes an array of if statement or for loop lines.
    *       Returns the last value returned by the last line or returns the return value if encountered.
    * Arg1: objLines(array of lines)
    * Arg2: func(func obj, sys=func)
    * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
    */
   processIfForLines(objLines, func) {
      if (objLines !== null && this.isArray(objLines) && objLines.length > 0) {
         var j = 0;
         var len = objLines.length;
         var ret = null;
         var line = null;

         for (j = 0; j < len; j++) {
            line = objLines[j];

            //support comments
            if (line.hasOwnProperty("active") && line.active === false) {
               continue;
            }

            if (this.isSysObjAsgn(line)) {
               ret = this.processAsgn(line, func);

            } else if (this.isSysObjCall(line)) {
               ret = this.processCall(line, func);

            } else if (this.isSysObjFor(line)) {
               ret = this.processFor(line, func);

            } else if (this.isSysObjIf(line)) {
               ret = this.processIf(line, func);

            } else if (this.isSysObjReturn(line)) {
               if (this.isSysObjRef(line.val)) {
                  ret = this.processRef(line.val, func);
               } else {
                  ret = line.val;
               }
               return ret;
            }

            //this.wr("processIfForLines:---------------------------");
            //this.wrObj(ret);
            if (ret === null) {
               this.wr("processIfForLines: Error: processing line returned null: " + j);
               return null;
            }
         }
         return ret;
      } else {
         //this.wr("processIfForLines: Warning: provided lines array is null");
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
   }

   /**
    * Name: processFor
    * Desc: Processes a for loop. Returns the last loop iteration value.
    * Arg1: objFor(for obj, sys=for)
    * Arg2: func(func obj, sys=func)
    * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
    */
   processFor(objFor, func) {
      var start = null;
      var stop = null;
      var inc = null;
      var each = null;

      if (!this.isSysObjFor(objFor)) {
         this.wr("processFor: Error: argument objRef is not a for obj");
         return null;
      } else if (!this.isSysObjFunc(func)) {
         this.wr("processFor: Error: argument func is not a func obj");
         return null;
      }

      var fullLst = this.isFullFor(objFor);
      if (fullLst) {
         //this.wr("processFor: AAA");
         start = objFor.start;
         if (this.isSysObjConst(start)) {
            //do nothing
         } else if (this.isSysObjRef(start)) {
            start = this.processRef(start, func);

         } else if (this.isSysObjExp(start)) {
            start = this.processExp(start, func);

         } else if (this.isSysObjBex(start)) {
            start = this.processBex(start, func);

         } else if (this.isSysObjCall(start)) {
            start = this.processCall(start, func);

         } else {
            this.wr("processFor: Error: argument start unsuppoorted type: " + start.sys);
            return null;
         }

         if (start === null) {
            this.wr("processFor: Error: argument start is null");
            return null;
         }

         stop = objFor.stop;
         if (this.isSysObjConst(stop)) {
            //do nothing
         } else if (this.isSysObjRef(stop)) {
            stop = this.processRef(stop, func);

         } else if (this.isSysObjExp(stop)) {
            stop = this.processExp(stop, func);

         } else if (this.isSysObjBex(stop)) {
            stop = this.processBex(stop, func);

         } else if (this.isSysObjCall(stop)) {
            stop = this.processCall(stop, func);

         } else {
            this.wr("processFor: Error: argument stop unsuppoorted type: " + stop.sys);
            return null;
         }

         if (stop === null) {
            this.wr("processFor: Error: argument stop is null");
            return null;
         }

         inc = objFor.inc;
         if (this.isSysObjConst(inc)) {
            //do nothing
         } else if (this.isSysObjRef(inc)) {
            inc = this.processRef(inc, func);

         } else if (this.isSysObjExp(inc)) {
            inc = this.processExp(inc, func);

         } else if (this.isSysObjBex(inc)) {
            inc = this.processBex(inc, func);

         } else if (this.isSysObjCall(inc)) {
            inc = this.processCall(inc, func);

         } else {
            this.wr("processFor: Error: argument inc unsuppoorted type: " + inc.sys);
            return null;
         }

         if (inc === null) {
            this.wr("processFor: Error: argument inc is null");
            return null;
         }
      } else {
         each = objFor.each;
         if (this.isSysObjConst(each)) {
            //do nothing
         } else if (this.isSysObjRef(each)) {
            each = this.processRef(each, func);

         } else {
            this.wr("processFor: Error: argument stop unsuppoorted type: " + each.sys);
            return null;
         }

         start = this.getConst("int", "0");
         stop = this.getConst("int", each.val.len);
         inc = this.getConst("int", "1");
      }

      if (start.val.type !== "int") {
         this.wr("processFor: Error: argument start unsuppoorted type: " + start.sys);
         return null;

      } else if (stop.val.type !== "int") {
         this.wr("processFor: Error: argument stop unsuppoorted type: " + stop.sys);
         return null;

      } else if (inc.val.type !== "int") {
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
      var incAmt = this.toInt(inc.val.v);
      var lenAmt = this.toInt(stop.val.v);
      var startAmt = this.toInt(start.val.v);

      //this.wr("processFor: BBB: " + incAmt + ", " + lenAmt + ", " + startAmt);
      //this.wrObj(stop);
      for (i = startAmt; i < lenAmt; i += incAmt) {
         ret3 = this.processIfForLines(objFor.lines, func);
         if (ret3 === null) {
            this.wr("processFor: Error: process loop iteration " + i + " returned a null value.");
            return null;
         } else if (this.isSysObjReturn(ret3)) {
            return ret3;
         } else {
            ret.val.v = i + "";
            this.lastForReturn = ret;
         }
      }
      return ret;
   }

   /**
    * Name: processAsgn
    * Desc: Processes an assigment. Returns true value.
    * Arg1: objAsgn(asgn obj, sys=asgn)
    * Arg2: func(func obj, sys=func)
    * Returns: {null | (const obj, sys=const)}
    */
   processAsgn(objAsgn, func) {
      var left = null;
      var op = null;
      var right = null;

      var leftIsBasic = false;
      var leftIsArray = false;
      var leftIsRef = false;
      var leftOrig = null;

      var rightIsBasic = false;
      var rightIsArray = false;
      var rightIsRef = false;
      var rightOrig = null;

      if (!this.isSysObjAsgn(objAsgn)) {
         this.wr("processAsgn: Error: argument objRef is not a asgn obj");
         return null;
      } else if (!this.isSysObjFunc(func)) {
         this.wr("processAsgn: Error: argument func is not a func obj");
         return null;
      }

      left = objAsgn.left;
      op = objAsgn.op;
      right = objAsgn.right;

      leftOrig = left;
      rightOrig = right;

      if (this.isSysObjRef(left)) {
         leftIsRef = true;
      }

      if (this.isSysObjRef(right)) {
         rightIsRef = true;
      }

      var hasUrl = this.isRefStringUrl(left.val.v);
      var hasUrlAttr = this.validateProperties(objAsgn, ["url"]);
      var vals = null;
      var url = null;
      var path = null;
      var origRefVal = null;

      if (hasUrl && !hasUrlAttr) {
         //if inherent url is detected
         vals = this.getPathAndUrlFromRef(this.toStr(left.val.v));
      } else if (hasUrlAttr) {
         //allow url attribute to override inherent url
         if (this.VERBOSE) {
            this.wr("processAsgn: URL Attribute override found.");
         }

         hasUrl = true;
         vals = [objAsgn.url, "unknown_ref_path"];
      } else {
         hasUrl = false;
      }

      origRefVal = this.toStr(left.val.v);
      left = this.processRef(left, func);

      if (this.VERBOSE) {
         this.wr("processAsgn: HasUrl: " + hasUrl + ", HasUrlAttr:" + hasUrlAttr);
      }

      if (hasUrl) {
         path = this.lastProcessUrlFindPath;
         url = vals[0];

         if (this.VERBOSE) {
            this.wr("processAsgn: Path: " + path);
            this.wr("processAsgn: Url: " + url);
         }
      }

      if (left === null) {
         this.wr("processAsgn: Error: error processing left");
         return null;
      }

      var hasPubs = false;
      if (this.validateProperties(left, ["pubs"]) && this.isArray(left.pubs)) {
         hasPubs = true;
         path = origRefVal;
      }

      if (this.VERBOSE) {
         this.wr("processAsgn: has publications: " + hasPubs + ", Found: " + this.toStr(left.pubs) + ", Path: " + origRefVal);
      }

      if (this.isSysObjConst(right)) {
         //do nothing, all set      
      } else if (this.isSysObjRef(right)) {
         right = this.processRef(right, func);

      } else if (this.isSysObjBex(right)) {
         right = this.processBex(right, func);

      } else if (this.isSysObjExp(right)) {
         right = this.processExp(right, func);

      } else if (this.isSysObjCall(right)) {
         right = this.processCall(right, func);

      } else {
         this.wr("processAsgn: Error: argument right is an unknown obj: " + this.getSysObjType(right));
         return null;
      }

      if (right === null) {
         this.wr("processAsgn: Error: error processing right");
         return null;
      }

      if (this.isSysObjValArray(left)) {
         leftIsArray = true;
      } else {
         leftIsBasic = true;
      }

      if (this.isSysObjValArray(right)) {
         rightIsArray = true;
      } else {
         rightIsBasic = true;
      }

      var ret = {};
      ret.sys = "val";
      ret.type = "bool";
      ret.v = "true";

      var ret2 = {};
      ret2.sys = "const";
      ret2.val = ret;
      ret = ret2;

      if (left.val.type === right.val.type) {
         if (leftIsBasic && rightIsBasic) {
            //both are basic, dereference if need be, and copy value
            var nval = null;
            if (objAsgn.op.v === "+=") {
               this.wr("Left val type: " + left.val.type + "," + left.val.type + ", " + left.val.v + ", " + right.val.v);

               if (left.val.type === "int") {
                  nval = this.toStr(this.toInt(left.val.v) + this.toInt(right.val.v));
               } else if (left.val.type === "float") {
                  nval = this.toStr(this.toFloat(left.val.v) + this.toFloat(right.val.v));
               } else if (left.val.type === "bool") {
                  var ll = this.toBool(left.val.v);
                  var lr = this.toBool(right.val.v);
                  if (ll || lr) {
                     nval = "true";
                  } else {
                     nval = "false";
                  }
               } else if (left.val.type === "string") {
                  nval = this.toStr(left.val.v) + this.toStr(right.val.v);
               } else {
                  this.wr("processAsgn: Error: append operator not supported in this case: " + left.val.type + " - " + right.val.type + ", left is array: " + leftIsArray + ", left is ref: " + leftIsRef + ", right is array: " + rightIsArray + ", right is ref: " + rightIsRef);
                  ret.val.v = "false";
                  this.lastAsgnValue = this.cloneJsonObj(left);
                  this.lastAsgnReturn = ret;
                  return ret;
               }
            } else {
               nval = this.toStr(right.val.v);
            }

            if (hasUrl) {
               //url, path, obj
               //?type=set&ref=   &cat=   &obj=
               this.processUrlSet(url + "&type=set&ref=" + encodeURIComponent(path) + "&cat=basic&obj=" + encodeURIComponent(nval));
            } else {
               left.val.v = nval;
            }

            if (hasPubs) {
               for (var k = 0; k < left.pubs.length; k++) {
                  var nurl = null;
                  if (this.isString(left.pubs[k])) {
                     nurl = left.pubs[k];
                     this.processUrlSet(nurl + "&type=set&ref=" + encodeURIComponent(path) + "&cat=basic&obj=" + encodeURIComponent(nval), true);
                  }
               }
            }

            this.lastAsgnValue = this.cloneJsonObj(left);
            this.lastAsgnReturn = ret;
            return ret;
         } else if (leftIsArray && rightIsArray && rightIsRef) {
            //both are array refs, dereference if need be, and copy reference
            if (objAsgn.op.v === "+=") {
               this.wr("processAsgn: Error: append operator not supported in this case: " + left.val.type + " - " + right.val.type + ", left is array: " + leftIsArray + ", left is ref: " + leftIsRef + ", right is array: " + rightIsArray + ", right is ref: " + rightIsRef);
               ret.val.v = "false";
               this.lastAsgnValue = this.cloneJsonObj(left);
               this.lastAsgnReturn = ret;
               return ret;
            }

            if (hasUrl) {
               //url, path, obj
               this.processUrlSet(url + "&type=set&ref=" + encodeURIComponent(path) + "&cat=basic&obj=" + encodeURIComponent(this.toStr(rightOrig.val.v)));
            } else {
               leftOrig.val.v = rightOrig.val.v;
            }

            if (hasPubs) {
               for (var k = 0; k < left.pubs.length; k++) {
                  var nurl = null;
                  if (this.isString(left.pubs[k])) {
                     nurl = left.pubs[k];
                     this.processUrlSet(nurl + "&type=set&ref=" + encodeURIComponent(path) + "&cat=basic&obj=" + encodeURIComponent(this.toStr(rightOrig.val.v)), true);
                  }
               }
            }

            this.lastAsgnValue = this.cloneJsonObj(left);
            this.lastAsgnReturn = ret;
            return ret;
         } else if (leftIsArray && rightIsArray && !rightIsRef) {
            //left is array ref, right is array const, copy value
            var tmpA = null;
            if (objAsgn.op.v === "+=") {
               tmpA = this.toArray(left.val.v);
            } else {
               tmpA = [];
            }

            var tmpB = this.toArray(right.val.v);
            for (var i = 0; i < tmpB.size(); i++) {
               tmpA.push(tmpB[i]);
            }

            if (hasUrl) {
               //url, path, obj
               this.processUrlSet(url + encodeURIComponent(path) + "&cat=array&obj=" + encodeURIComponent(JSON.stringify(tmpA)));
            } else {
               left.val.v = tmpA;
            }

            if (hasPubs) {
               for (var k = 0; k < left.pubs.length; k++) {
                  var nurl = null;
                  if (this.isString(left.pubs[k])) {
                     nurl = left.pubs[k];
                     this.processUrlSet(nurl + "&type=set&ref=" + encodeURIComponent(path) + "&cat=array&obj=" + encodeURIComponent(JSON.stringify(tmpA)), true);
                  }
               }
            }

            this.lastAsgnValue = this.cloneJsonObj(left);
            this.lastAsgnReturn = ret;
            return ret;
         } else {
            this.wr("processAsgn: Error: type mismatch: " + left.val.type + " - " + right.val.type + ", left is array: " + leftIsArray + ", left is ref: " + leftIsRef + ", right is array: " + rightIsArray + ", right is ref: " + rightIsRef + ", op val: " + objAsgn.op.v);
            ret.val.v = "false";
            this.lastAsgnValue = this.cloneJsonObj(left);
            this.lastAsgnReturn = ret;
            return ret;
         }
      } else {
         this.wr("processAsgn: Error: type mismatch: " + left.val.type + " - " + right.val.type + ", left is array: " + leftIsArray + ", left is ref: " + leftIsRef + ", right is array: " + rightIsArray + ", right is ref: " + rightIsRef);
         ret.val.v = "false";
         this.lastAsgnValue = this.cloneJsonObj(left);
         this.lastAsgnReturn = ret;
         return ret;
      }
   }

   /**
    * Name: processBex
    * Desc: Processes a boolean expression. Returns Boolean result of the expression.
    * Arg1: objBex(bex obj, sys=bex)
    * Arg2: func(func obj, sys=func)
    * Returns: {null | (const obj, sys=const)}
    */
   processBex(objBex, func) {
      var left = null;
      var op = null;
      var right = null;

      if (!this.isSysObjBex(objBex)) {
         this.wr("processBex: Error: argument objRef is not a asgn obj");
         return null;
      } else if (!this.isSysObjFunc(func)) {
         this.wr("processBex: Error: argument func is not a func obj");
         return null;
      }

      left = objBex.left;
      op = objBex.op;
      right = objBex.right;

      if (this.isSysObjConst(left)) {
         //do nothing
      } else if (this.isSysObjRef(left)) {
         left = this.processRef(left, func);

      } else if (this.isSysObjBex(left)) {
         left = this.processBex(left, func);

      } else if (this.isSysObjExp(left)) {
         left = this.processExp(left, func);

      } else if (this.isSysObjCall(left)) {
         left = this.processCall(left, func);

      } else {
         this.wr("processBex: Error: argument left must be a ref obj");
         return null;
      }

      if (left === null) {
         this.wr("processBex: Error: error processing left");
         return null;
      }

      if (this.isSysObjConst(right)) {
         //do nothing
      } else if (this.isSysObjRef(right)) {
         right = this.processRef(right, func);

      } else if (this.isSysObjBex(right)) {
         right = this.processBex(right, func);

      } else if (this.isSysObjExp(right)) {
         right = this.processExp(right, func);

      } else if (this.isSysObjCall(right)) {
         right = this.processCall(right, func);

      } else {
         this.wr("processBex: Error: argument right is an unknown obj: " + this.getSysObjType(right));
         return null;
      }

      if (right === null) {
         this.wr("processBex: Error: error processing right");
         return null;
      }

      if (left.val.type === right.val.type) {
         var ret = {};
         ret.sys = "val";
         ret.type = "bool";
         ret.v = null;

         var ret2 = {};
         ret2.sys = "const";

         if (op.v === "==") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) === parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) === parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) === this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v) === String(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === "!=") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) !== parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) !== parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) !== this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v) !== String(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === "<") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) < parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) < parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) < this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v).length < String(right.val.v).length) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === ">") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) > parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) > parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) > this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v).length > String(right.val.v).length) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === "<=") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) <= parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) <= parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) <= this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v).length <= String(right.val.v).length) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v === ">=") {
            if (left.val.type === "int") {
               if (parseInt(left.val.v) >= parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "float") {
               if (parseFloat(left.val.v) >= parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(left.val.v) >= this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type === "string") {
               if (String(left.val.v).length >= String(right.val.v).length) {
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
   }

   /**
    * Name: processFunc
    * Desc: Processes a function's lines. Returns last statement or return value.
    * Arg1: objFunc(bex obj, sys=func)
    * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
    */
   processFunc(objFunc) {
      if (!this.isSysObjFunc(objFunc)) {
         this.wr("processFunc: Error: argument objRef is not a call func");
         return null;
      }

      var ret3 = null;
      ret3 = this.processIfForLines(objFunc.lines, objFunc);
      return ret3;
   }
   
   /**
    * Name: processCall
    * Desc: Processes a function call. Returns last statement or return value from executing the function's lines.
    * Arg1: objCall(call obj, sys=call)
    * Arg2: func(func obj, sys=func)
    * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
    */

   //TODO: sync
   
   processCall(objCall, func) {
      var name = null;
      var args = null;
      var funcDef = null;
      var funcArgs = null;
      var tmpArg = null;
      var ret = null;
      var sysFunc = false;
      var urlFunc = false;

      if (this.VERBOSE) {
         this.wr("processCall: Receiving:");
         this.wrObj(objCall);
      }

      if (!this.isSysObjCall(objCall)) {
         this.wr("processCall: Error: argument objRef is not a call obj");
         return null;
      } else if (!this.isSysObjFunc(func)) {
         this.wr("processCall: Error: argument func is not a func obj");
         return null;
      }

      if (!this.isString(objCall.name) && this.isSysObjConst(objCall.name)) {
         if (objCall.name.val.type === "string") {
            name = this.toStr(objCall.name.val.v);
         } else {
            return null;
         }
      } else if (!this.isString(objCall.name) && this.isSysObjRef(objCall.name)) {
         var tnm = this.processRef(objCall.name, func);
         if (tnm !== null && tnm.val.type === "string") {
            name = this.toStr(tnm.val.v);
         } else {
            return null;
         }
      } else {
         name = this.toStr(objCall.name);
      }

      if (this.VERBOSE) {
         this.wr("processCall: Function Name: " + name);
      }

      //handle function name url
      var hasUrl = this.isRefStringUrl(name);
      var hasSys = this.isFuncSys(name);
      var vals = null;
      var url = null;

      if (hasUrl) {
         vals = this.getPathAndUrlFromRef(name);
         url = vals[0];
         name = vals[1];

         if (this.VERBOSE) {
            this.wr("processCall: Function Name: " + name);
            this.wr("processCall: Url: " + url);
         }
      }

      args = this.cloneJsonObjList(objCall.args);

      if (!hasSys && !hasUrl) {
         //normal function
         urlFunc = false;
         sysFunc = false;
         funcDef = this.findFunc(name);
         if (funcDef !== null) {
            funcArgs = funcDef.args;
         } else {
            this.wr("processCall: Error: no normal function found with name: " + name);
            return null;
         }
      } else if (hasSys && !hasUrl) {
         //system function
         urlFunc = false;
         sysFunc = true;
         funcDef = this.findSysFunc(name);
         if (funcDef !== null) {
            funcArgs = funcDef.args;
         } else {
            this.wr("processCall: Error: no system function found with name: " + name);
            return null;
         }
      } else if (!hasSys && hasUrl) {
         //url function
         urlFunc = true;
         sysFunc = false;
         funcDef = null;
         funcArgs = [];
      } else {
         this.wr("processCall: Error: unknown function name type: " + name);
         return null;
      }

      var hasPubs = false;
      if (funcDef != null && this.validateProperties(funcDef, ["pubs"]) && this.isArray(funcDef.pubs)) {
         hasPubs = true;
      }

      if (this.VERBOSE) {
         if(hasPubs) {
            this.wr("processCall: has publications: " + hasPubs + ", Found: " + this.toStr(funcDef.pubs) + ", Path: " + name);
         } else {
            this.wr("processCall: has publications: " + hasPubs + ", Path: " + name);
         }
      }

      if (funcArgs !== null) {
         if (args.length >= funcArgs.length || funcArgs.length === 0) {
            if (funcArgs.length === 0) {
               for (var i = 0; i < args.length; i++) {
                  if (this.isSysObjRef(args[i])) {
                     tmpArg = null;
                     tmpArg = this.processRef(args[i], func);
                     if (tmpArg !== null) {
                        args[i].val.v = tmpArg.val.v;
                     } else {
                        this.wr("processCall: Error: could not process argument index, " + i + ", with path: " + args[i].val.v);
                        return null;
                     }
                  }
               }
            } else {
               for (var i = 0; i < args.length; i++) {
                  if (i < funcArgs.length) {
                     if (args[i].val.type !== funcArgs[i].val.type) {
                        this.wr("processCall: Error: type mismatch at argument index, " + i + ", func arg def: " + funcArgs[i].val.type + ", call arg: " + args[i].val.type);
                        return null;
                     }

                     if (this.isSysObjRef(args[i])) {
                        tmpArg = null;
                        tmpArg = this.processRef(args[i], func);
                        if (tmpArg !== null) {
                           args[i].val.v = tmpArg.val.v;
                           args[i].name = funcArgs[i].name;
                        } else {
                           this.wr("processCall: Error: could not process argument index, " + i + ", with path: " + args[i].val.v);
                           return null;
                        }
                     } else {
                        args[i].name = funcArgs[i].name;
                     }
                  }
               }
            }

            if (sysFunc) {
               //call system function
               if (funcDef !== null) {
                  var err = true;
                  var lret = null;
                  try {
                     lret = this[funcDef.fname](args, func);
                     err = false;
                  } catch (e) {
                     this.wr("processCall: Error calling system function: ");
                     this.wrErr(e);
                     lret = null;
                     err = true;
                  }

                  if (hasPubs) {
                     for (var k = 0; k < funcDef.pubs.length; k++) {
                        var nurl = null;
                        if (this.isString(funcDef.pubs[k])) {
                           nurl = funcDef.pubs[k];
                           this.processUrlCall(nurl + "&type=call&name=" + encodeURIComponent(name) + "&args=" + encodeURIComponent(JSON.stringify(args)), true);
                        }
                     }
                  }
      
                  if (lret === null) {
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
                  this.wr("processCall: Error: funcDef should be defined");
                  return null;
               }

            } else if (hasUrl) {
               //call URL function
               //?type=call&name=urlFunc1&args=
               ret = this.processUrlCall(url + "&type=call&name=" + encodeURIComponent(name) + "&args=" + encodeURIComponent(JSON.stringify(args)));
               if (ret !== null) {
                  var lret = this.getConst(ret.val.type, ret.val.v);
                  if (this.VERBOSE) {
                     this.wr("processCall: Returning:");
                     this.wrObj(lret);
                  }

                  if (hasPubs) {
                     for (var k = 0; k < funcDef.pubs.length; k++) {
                        var nurl = null;
                        if (this.isString(funcDef.pubs[k])) {
                           nurl = funcDef.pubs[k];
                           this.processUrlCall(nurl + "&type=call&name=" + encodeURIComponent(name) + "&args=" + encodeURIComponent(JSON.stringify(args)), true);
                        }
                     }
                  }
      
                  return lret;
               } else {
                  this.wr("processCall: Error: function returned a null value");
                  return null;
               }

            } else {
               //call normal function 
               if (funcDef !== null) {
                  //backup default args and vars
                  funcDef.vars_def = this.cloneJsonObjList(funcDef.vars);
                  funcDef.args_def = this.cloneJsonObjList(funcDef.args);
                  funcDef.args = args;

                  if (this.VERBOSE) {
                     this.wr("processCall: Process Function: " + funcDef.name);
                  }

                  //backup default ret
                  funcDef.ret_def = this.cloneJsonObj(funcDef.ret);
                  ret = this.processFunc(funcDef);

                  //restore args and ret
                  funcDef.vars = funcDef.vars_def;
                  funcDef.args = funcDef.args_def;
                  funcDef.ret = funcDef.ret_def;

                  if (ret !== null) {
                     if ((ret.val.type !== funcDef.ret_def.type)) {
                        this.wr("processCall: Error: function return type mismatch, return type " + ret.val.type + " expected " + funcDef.ret_def.type);
                        return null;
                     } else {
                        var lret = this.getConst(ret.val.type, ret.val.v);
                        if (this.VERBOSE) {
                           this.wr("processCall: Returning:");
                           this.wrObj(lret);
                        }

                        if (hasPubs) {
                           for (var k = 0; k < funcDef.pubs.length; k++) {
                              var nurl = null;
                              if (this.isString(funcDef.pubs[k])) {
                                 nurl = funcDef.pubs[k];
                                 this.processUrlCall(nurl + "&type=call&name=" + encodeURIComponent(name) + "&args=" + encodeURIComponent(JSON.stringify(args)), true);
                              }
                           }
                        }

                        return lret;
                     }
                  } else {
                     this.wr("processCall: Error: function returned a null value");
                     return null;
                  }
               } else {
                  this.wr("processCall: Error: funcDef should be defined");
                  return null;
               }
            }

         } else {
            this.wr("processCall: Error: function argument length mismatch, func arg def: " + funcArgs.length + ", call arg: " + args.length);
            return null;
         }
      } else {
         this.wr("processCall: Error: function arguments is null");
         return null;
      }
   }

   /**
    * Name: processExp
    * Desc: Processes an expression. Returns the value of the expression.
    * Arg1: objExp(exp obj, sys=exp)
    * Arg2: func(func obj, sys=func)
    * Returns: {null | (const obj, sys=const)}
    */
   processExp(objExp, func) {
      var left = null;
      var op = null;
      var right = null;

      if (!this.isSysObjExp(objExp)) {
         this.wr("processExp: Error: argument objRef is not a asgn obj");
         return null;

      } else if (!this.isSysObjFunc(func)) {
         this.wr("processExp: Error: argument func is not a func obj");
         return null;
      }

      left = objExp.left;
      op = objExp.op;
      right = objExp.right;

      if (this.isSysObjConst(left)) {
         //do nothing
      } else if (this.isSysObjRef(left)) {
         left = this.processRef(left, func);

      } else if (this.isSysObjBex(left)) {
         left = this.processBex(left, func);

      } else if (this.isSysObjExp(left)) {
         left = this.processExp(left, func);

      } else if (this.isSysObjCall(left)) {
         left = this.processCall(left, func);

      } else {
         this.wr("processExp: Error: argument left must be a ref obj");
         return null;
      }

      if (left === null) {
         this.wr("processExp: Error: error processing left");
         return null;
      }

      if (this.isSysObjConst(right)) {
         //do nothing
      } else if (this.isSysObjRef(right)) {
         right = this.processRef(right, func);

      } else if (this.isSysObjBex(right)) {
         right = this.processBex(right, func);

      } else if (this.isSysObjExp(right)) {
         right = this.processExp(right, func);

      } else if (this.isSysObjCall(right)) {
         right = this.processCall(right, func);

      } else {
         this.wr("processExp: Error: argument right is an unknown obj: " + this.getSysObjType(right));
         return null;
      }

      if (right === null) {
         this.wr("processExp: Error: error processing right");
         return null;
      }

      if (left.val.type === right.val.type && (left.val.type === "int" || left.val.type === "float" || left.val.type === "bool")) {
         var ret = {};
         ret.sys = "val";
         ret.type = left.val.type;
         ret.v = null;

         var ret2 = {};
         ret2.sys = "const";
         ret2.val = ret;

         if (op.v === "+") {
            if (left.val.type === "int") {
               ret.v = parseInt(left.val.v) + parseInt(right.val.v);
            } else if (left.val.type === "float") {
               ret.v = parseFloat(left.val.v) + parseFloat(right.val.v);
            } else if (left.val.type === "bool") {
               ret.v = this.toBoolInt(left.val.v) + this.toBoolInt(right.val.v);
            }
         } else if (op.v === "-") {
            if (left.val.type === "int") {
               ret.v = parseInt(left.val.v) - parseInt(right.val.v);
            } else if (left.val.type === "float") {
               ret.v = parseFloat(left.val.v) - parseFloat(right.val.v);
            } else if (left.val.type === "bool") {
               ret.v = this.toBoolInt(left.val.v) - this.toBoolInt(right.val.v);
            }
         } else if (op.v === "/") {
            if (left.val.type === "int") {
               if (parseInt(right.val.v) === 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = parseInt(left.val.v) / parseInt(right.val.v);
               }
            } else if (left.val.type === "float") {
               if (parseFloat(right.val.v) === 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = parseFloat(left.val.v) / parseFloat(right.val.v);
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(right.val.v) === 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = this.toBoolInt(left.val.v) / this.toBoolInt(right.val.v);
               }
            }
         } else if (op.v === "%") {
            if (left.val.type === "int") {
               if (parseInt(right.val.v) === 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = parseInt(left.val.v) % parseInt(right.val.v);
               }
            } else if (left.val.type === "float") {
               if (parseFloat(right.val.v) === 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = parseFloat(left.val.v) % parseFloat(right.val.v);
               }
            } else if (left.val.type === "bool") {
               if (this.toBoolInt(right.val.v) === 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = this.toBoolInt(left.val.v) % this.toBoolInt(right.val.v);
               }
            }

         } else if (op.v === "*") {
            if (left.val.type === "int") {
               ret.v = parseInt(left.val.v) * parseInt(right.val.v);
            } else if (left.val.type === "float") {
               ret.v = parseFloat(left.val.v) * parseFloat(right.val.v);
            } else if (left.val.type === "bool") {
               ret.v = this.toBoolInt(left.val.v) * this.toBoolInt(right.val.v);
            }
         } else {
            this.wr("processExp: Error: unknown operator: " + op.v);
            return null;
         }

         if (left.val.type === "int") {
            ret.v = parseInt(ret.v) + "";
         } else if (left.val.type === "float") {
            ret.v = parseFloat(ret.v) + "";
         } else if (left.val.type === "bool") {
            ret.v = this.toBool(ret.v) + "";
         }

         ret = ret2;
         this.lastExpReturn = ret;
         return ret;
      } else if (left.val.type === right.val.type && left.val.type === "string" && op.v === "+") {
         var ret = {};
         ret.sys = "val";
         ret.type = left.val.type;
         ret.v = this.toStr(left.val.v) + this.toStr(right.val.v);

         var ret2 = {};
         ret2.sys = "const";
         ret2.val = ret;

         ret = ret2;
         this.lastExpReturn = ret;
         return ret;
      } else {
         this.wr("processExp: Error: type mismatch: " + left.val.type + " - " + right.val.type);
         return null;
      }
   }

   /**
    * Name: hasReplDirectives
    * Desc: A function to determine if the given string has any replacement directives defined.
    * Arg1: src(the JSON text to check)
    * Returns: {true | false}
    */
   hasReplDirectives(src) {
      if (src === null) {
         this.wr("hasReplDirectives: Error: argument src cannot be null.");
         return false;
      }

      if (src.toLowerCase().indexOf("@(repl::") === -1) {
         return false;
      } else {
         return true;
      }
   }

   /**
    * Name: processReplDirectives
    * Desc: A function to process replacement directive in a string using provided key, value pairs.
    * Arg1: keys(an array of keys)
    * Arg2: values(an array of key values)
    * Arg3: src(the JSON text to process)
    * Returns: string(new, adjusted, JSON string)
    */
   processReplDirectives(keys, values, src) {
      if (keys === null) {
         this.wr("processReplDirectives: Error: argument keys cannot be null.");
         return null;
      }

      if (values === null) {
         this.wr("processReplDirectives: Error: argument values cannot be null.");
         return null;
      }

      if (values.length !== keys.length) {
         this.wr("processReplDirectives: Error: argument keys and values must have the same length.");
         return null;
      }

      if (src === null) {
         this.wr("processReplDirectives: Error: argument src cannot be null.");
         return null;
      }

      var nsrc = this.toStr(src);
      for (var i = 0; i < keys.length; i++) {
         var fnd = "@(repl::" + keys[i] + ")";
         nsrc = nsrc.replaceAll(fnd, values[i]);
      }

      return nsrc;
   }
}

/**
 * Name: system
 * Desc: Define system function signatures.
 */
jsonPlState.prototype.system = {
   "functions": [
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
         ]
      },
      {
         "sys": "func",
         "name": "SYS::wrInt",
         "fname": "sysWr",
         "args": [
            {
               "sys": "arg",
               "name": "s",
               "val": {
                  "sys": "val",
                  "type": "int",
                  "v": ""
               }
            }
         ]
      },
      {
         "sys": "func",
         "name": "SYS::wrFloat",
         "fname": "sysWr",
         "args": [
            {
               "sys": "arg",
               "name": "s",
               "val": {
                  "sys": "val",
                  "type": "float",
                  "v": ""
               }
            }
         ]
      },
      {
         "sys": "func",
         "name": "SYS::wrStr",
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
         "name": "SYS::wrBool",
         "fname": "sysWr",
         "args": [
            {
               "sys": "arg",
               "name": "s",
               "val": {
                  "sys": "val",
                  "type": "bool",
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
      },
      {
         "sys": "func",
         "name": "SYS::len",
         "fname": "sysLen",
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
         "name": "SYS::type",
         "fname": "sysType",
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
         "name": "SYS::getRef",
         "fname": "sysGetRef",
         "args": [
            {
               "sys": "arg",
               "name": "name",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "isVar",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": "false"
               }
            },
            {
               "sys": "arg",
               "name": "funcName",
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
         "name": "SYS::getRefStr",
         "fname": "sysGetRefStr",
         "args": [
            {
               "sys": "arg",
               "name": "name",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "isVar",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": "false"
               }
            },
            {
               "sys": "arg",
               "name": "funcName",
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
         "name": "SYS::getArrayIdxRef",
         "fname": "sysGetArrayIdxRef",
         "args": [
            {
               "sys": "arg",
               "name": "name",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "isVar",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": "false"
               }
            },
            {
               "sys": "arg",
               "name": "funcName",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "idx",
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
         "name": "SYS::getArrayIdxRefStr",
         "fname": "sysGetArrayIdxRefStr",
         "args": [
            {
               "sys": "arg",
               "name": "name",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "isVar",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": "false"
               }
            },
            {
               "sys": "arg",
               "name": "funcName",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "idx",
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
         "name": "SYS::mlc",
         "fname": "sysMalloc",
         "args": [
            {
               "sys": "arg",
               "name": "isClassVar",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": "false"
               }
            },
            {
               "sys": "arg",
               "name": "name",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "type",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "val",
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
         "name": "SYS::cln",
         "fname": "sysClean",
         "args": [
            {
               "sys": "arg",
               "name": "isClassVar",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": "false"
               }
            },
            {
               "sys": "arg",
               "name": "name",
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
         "name": "SYS::amlc",
         "fname": "sysMallocArray",
         "args": [
            {
               "sys": "arg",
               "name": "isClassVar",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": "false"
               }
            },
            {
               "sys": "arg",
               "name": "name",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "type",
               "val": {
                  "sys": "val",
                  "type": "string",
                  "v": ""
               }
            },
            {
               "sys": "arg",
               "name": "len",
               "val": {
                  "sys": "val",
                  "type": "int",
                  "v": "0"
               }
            },
            {
               "sys": "arg",
               "name": "strict",
               "val": {
                  "sys": "val",
                  "type": "bool",
                  "v": "false"
               }
            }
         ]
      }      
   ]
};

/**
 * Desc: Add error protected export for use with Node JS
 */
try {
   if(typeof module !== "undefined") {
      module.exports = jsonPlState;
   }
} catch(e) {
   console.log(e);
}






































































































