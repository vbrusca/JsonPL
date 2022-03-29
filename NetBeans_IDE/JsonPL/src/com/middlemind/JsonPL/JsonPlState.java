package com.middlemind.JsonPL;

import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

/*
* JSON Programming Language
* EXEC JAVA PORT
* Victor G. Brusca 
* Created on 02/03/2022 1:57 PM EDT
* Licensed under GNU General Public License v3.0
*/

/**
 *
 * @author Victor G. Brusca, Middlemind Games 03/27/2022 11:17 AM EDT
 */
@SuppressWarnings("UnusedAssignment")
public class JsonPlState {

   public String version = "0.5.1";
   public int lineNumCurrent = 0;
   public int lineNumPrev = 0;
   public int linNumNext = 0;

   public JsonObjSysBase lastForReturn = null;
   public JsonObjSysBase lastIfReturn = null;

   public JsonObjSysBase lastBexReturn = null;
   public JsonObjSysBase lastExpReturn = null;

   public JsonObjSysBase lastAsgnReturn = null;
   public JsonObjSysBase lastAsgnValue = null;

   public JsonObjSysBase lastProgramReturn = null;
   public JsonObjSysBase program = null;
   public boolean LOGGING = true;
   public String WR_PREFIX = "";

   public Hashtable<String, List<JsonObjSysBase>> system;

   public SystemFunctionHandlerJpl systemFunctionHandler = null;

   /**
    *
    */
   public JsonPlState() {
      List<JsonObjSysBase> sfuncs = new ArrayList<>();
      system = new Hashtable<>();
      system.put("functions", sfuncs);
   }

   /*
   * Name: sysWr
   * Desc: A system level write function.
   * Arg1: args(arg obj, sys=arg & array of)
   * Returns: {(const obj, sys=const)}
    */
   public JsonObjSysBase sysWr(List<JsonObjSysBase> args) throws Exception {
      String s = args.get(0).val.v + "";
      this.wr(s);

      JsonObjSysBase ret = new JsonObjSysBase("val");
      ret.type = "bool";
      ret.v = "true";

      JsonObjSysBase ret2 = new JsonObjSysBase("const");
      ret2.val = ret;
      ret = ret2;

      return ret;
   }

   /*
   * Name: sysGetLastAsgnValue
   * Desc: A system level method to access the last asgn value object.
   * Returns: {(const obj, sys=const)}
    */
   public JsonObjSysBase sysGetLastAsgnValue() {
      return this.lastAsgnValue;
   }

   /*
   * Name: sysGetLastAsgnValue
   * Desc: A system level method to access the last exp return object.
   * Returns: {(const obj, sys=const)}
    */
   public JsonObjSysBase sysGetLastExpReturn() {
      return this.lastExpReturn;
   }

   /*
   * Name: getConstBool
   * Desc: A method to quickly access a constant bool value object.
   * Returns: {(const obj, sys=const)}
    */
   public JsonObjSysBase getConstBool() {
      JsonObjSysBase ret = new JsonObjSysBase("val");
      ret.type = "bool";
      ret.v = "false";

      JsonObjSysBase ret2 = new JsonObjSysBase("const");
      ret2.val = ret;
      ret = ret2;

      return ret;
   }

   /*
   * Name: sysJob1
   * Desc: A system level job method used to demonstrate JCL.
   * Arg1: args(arg obj, sys=arg & array of)
   * Returns: {(const obj, sys=const)}
    */
   public JsonObjSysBase sysJob1() {
      this.wr("sysJob1");
      JsonObjSysBase ret = this.getConstBool();
      ret.val.v = "true";
      return ret;
   }

   /*
   * Name: sysJob2
   * Desc: A system level job method used to demonstrate JCL.
   * Arg1: args(arg obj, sys=arg & array of)
   * Returns: {(const obj, sys=const)}
    */
   public JsonObjSysBase sysJob2() {
      this.wr("sysJob2");
      JsonObjSysBase ret = this.getConstBool();
      ret.val.v = "true";
      return ret;
   }

   /*
   * Name: sysJob3
   * Desc: A system level job method used to demonstrate JCL.
   * Arg1: args(arg obj, sys=arg & array of)
   * Returns: {(const obj, sys=const)}
    */
   public JsonObjSysBase sysJob3() {
      this.wr("sysJob3");
      JsonObjSysBase ret = this.getConstBool();
      ret.val.v = "true";
      return ret;
   }

   /*
   * Name: runProgram
   * Desc: Executes the current program and returns the result.
   * Returns: {(some sys obj)}
    */
   public JsonObjSysBase runProgram() {
      if(this.validateSysObjClass(this.program)) {
         JsonObjSysBase callObj = this.program.call;
         String callFuncName = callObj.name;
         this.wr("runProgram: RUN PROGRAM: " + callFuncName);
         JsonObjSysBase callFunc = this.findFunc(callFuncName);

         JsonObjSysBase ret = null;
         ret = this.processCall(callObj, callFunc);
         this.lastProgramReturn = ret;

         //this.wrObj(res);
         return ret;
      } else {
         this.wr("runProgram: Error: could not validate the class object.");
         return null;         
      }
   }

   /////////////////////////SEARCH METHODS
   /*
   * Name: findArg
   * Desc: Search the provided object for an argument with the given name.
   * Arg1: name(string to find)
   * Arg2: obj(func obj, sys=func)
   * Returns: {null | (arg obj, sys=arg)}
    */
   public JsonObjSysBase findArg(String name, JsonObjSysBase obj) {
      String str;
      JsonObjSysBase subj;
      for (int i = 0; i < obj.args.size(); i++) {
         subj = obj.args.get(i);
         str = subj.name;
         if (!Utils.IsStringEmpty(str) && str.equals(name)) {
            return subj;
         }
      }
      return null;
   }

   /*
   * Name: findVar
   * Desc: Search the provided object for a variable with the given name.
   * Arg1: name(string to find)
   * Arg2: obj{(func obj, sys=func) | (class obj, sys=class)}
   * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
    */
   public JsonObjSysBase findVar(String name, JsonObjSysBase obj) {
      String str;
      JsonObjSysBase subj;
      for (int i = 0; i < obj.vars.size(); i++) {
         subj = obj.vars.get(i);
         str = subj.name;
         if (!Utils.IsStringEmpty(str) && str.equals(name)) {
            return subj;
         }
      }
      return null;
   }

   /*
   * Name: findFunc
   * Desc: Search the current program for a func with the given name.
   * Arg1: name(string to find)
   * Returns: {null | (func obj, sys=func)}
    */
   public JsonObjSysBase findFunc(String name) {
      JsonObjSysBase prog = this.program;
      String str;
      JsonObjSysBase subj;
      for (int i = 0; i < prog.funcs.size(); i++) {
         subj = prog.funcs.get(i);
         str = subj.name;
         if (!Utils.IsStringEmpty(str) && str.equals(name)) {
            return subj;
         }
      }
      return null;
   }

   /*
   * Name: findSysFunc
   * Desc: Search the current program's sytem functions for a func with the given name.
   * Arg1: name(string to find)
   * Returns: {null | (func obj, sys=func)}
    */
   public JsonObjSysBase findSysFunc(String name) {
      JsonPlState prog = this;
      String str;
      JsonObjSysBase subj;
      List<JsonObjSysBase> sFuncs = prog.system.get("functions");

      for (int i = 0; i < sFuncs.size(); i++) {
         subj = sFuncs.get(i);
         str = subj.name;
         if (!Utils.IsStringEmpty(str) && str.equals(name)) {
            return subj;
         }
      }
      return null;
   }

   /////////////////////////UTILITY METHODS
   /*
   * Name: wr
   * Desc: Writes a string to standard output if LOGGING is on.
   *       Sets the WR_PREFIX to each string written. 
   * Arg1: s(string to write)
    */
   public void wr(String s) {
      if (this.LOGGING == true) {
         Logger.wrl(this.WR_PREFIX + s);
      }
   }

   /*
   * Name: getVersion
   * Desc: A method to access the version of this JsonPL interpreter.
   * Returns: {(string version number)}
    */
   public String getVersion() {
      this.wr(this.version);
      return this.version;
   }

   /*
   * Name: cloneJsonObj
   * Desc: A method to clone the given JSON object argument.
   * Arg1: jsonObj(the JSON object to clone)
   * Returns: {(cloned JSON object)}
    */
   public JsonObjSysBase cloneJsonObj(JsonObjSysBase jsonObj) {
      return jsonObj.Clone();
   }

   //TODO
   public List<JsonObjSysBase> cloneJsonObjList(List<JsonObjSysBase> jsonObjLst) {
      List<JsonObjSysBase> ret = new ArrayList<>();
      for (int i = 0; i < jsonObjLst.size(); i++) {
         ret.add(jsonObjLst.get(i).Clone());
      }
      return ret;
   }

   /*
   * Name: wrObj
   * Desc: Writes a JSON object to standard output if LOGGING is on.
   *       Sets the WR_PREFIX to each object written.
   *       Prints object using pretty JSON.stringify call. 
   * Arg1: s(string to write)
    */
   public void wrObj(JsonObjSysBase jsonObj) {
      if (this.LOGGING == true) {
         Utils.PrintObject(jsonObj, "wrObj");
         this.wr("");
      }
   }

   /////////////////////////GENERIC OBJECT ID METHODS
   /*
   * Name: isObject
   * Desc: Checks if the given argument is a JSON object. 
   * Arg1: arg(JSON object)
   * Returns: (true | false)
    */
   public boolean isObject(Object arg) {
      if (arg instanceof JsonObjSysBase) {
         return true;
      } else {
         return false;
      }
   }

   /*
   * Name: isArray
   * Desc: Checks if the given argument is an array. 
   * Arg1: arg(javascript array)
   * Returns: (true | false)
    */
   public boolean isArray(Object arg) {
      if (arg instanceof List || arg instanceof ArrayList) {
         return true;
      } else {
         return false;
      }
   }

   /*
   * Name: isString
   * Desc: Checks if the given argument is a string. 
   * Arg1: arg(some string)
   * Returns: (true | false)
    */
   public boolean isString(Object arg) {
      if (arg instanceof String) {
         return true;
      } else {
         return false;
      }
   }

   /////////////////////////SYS OBJECT ID METHODS
   /*
   * Name: isSysObjIf
   * Desc: Checks if the given object is an if sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjIf(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("if")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjRef
   * Desc: Checks if the given object is a ref sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjRef(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("ref")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjBex
   * Desc: Checks if the given object is a bex sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjBex(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("bex")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjExp
   * Desc: Checks if the given object is an exp sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjExp(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("exp")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjVal
   * Desc: Checks if the given object is a val sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjVal(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = this.getSysObjType(obj);
         //this.wr("ObjSys: " + objSys + ", " + Utils.IsStringEmpty(objSys) + ", " + objSys.equals("val"));
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("val")) {
            return true;
         }
      }
      //this.wr("not sys object");
      return false;
   }

   /*
   * Name: isSysObjAsgn
   * Desc: Checks if the given object is an asgn sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjAsgn(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("asgn")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjConst
   * Desc: Checks if the given object is a const sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjConst(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("const")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjVar
   * Desc: Checks if the given object is a var sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjVar(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("var")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjCall
   * Desc: Checks if the given object is a call sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjCall(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("call")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjFunc
   * Desc: Checks if the given object is a func sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjFunc(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("func")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjFor
   * Desc: Checks if the given object is a for sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjFor(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("for")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObjReturn
   * Desc: Checks if the given object is a return sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObjReturn(JsonObjSysBase obj) {
      if (this.isSysObj(obj) == true) {
         String objSys = getSysObjType(obj);
         if (!Utils.IsStringEmpty(objSys) && objSys.equals("return")) {
            return true;
         }
      }
      return false;
   }

   /*
   * Name: isSysObj
   * Desc: Checks if the given object is a sys object. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public boolean isSysObj(JsonObjSysBase obj) {
      if (obj != null && !Utils.IsStringEmpty(obj.sys) && this.isObject(obj) == true) {
         return true;
      } else {
         return false;
      }
   }

   /*
   * Name: getSysObjType
   * Desc: Gets the value of the sys attribute of the given sys object.. 
   * Arg1: obj(sys obj to check)
   * Returns: (true | false)
    */
   public String getSysObjType(JsonObjSysBase obj) {
      if (this.isSysObj(obj)) {
         return obj.sys;
      } else {
         return null;
      }
   }

   /////////////////////////VALIDATION METHODS
   /*
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
   public boolean validateSysObjIf(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("if")) && this.validateProperties(obj, new String[]{"sys", "left", "op", "right", "thn", "els"})) {
         JsonObjSysBase tobj = null;
         if (obj.left != null) {
            tobj = obj.left;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate left obj as ref");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate left obj as const");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate left obj as exp");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate left obj as bex");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
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

         if (obj.op != null) {
            tobj = obj.op;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("op")) {
               if (!this.validateSysObjOp(tobj)) {
                  return false;
               } else if (!tobj.type.equals("bex")) {
                  return false;
               } else if (!(tobj.v.equals("==") || tobj.v.equals("!=") || tobj.v.equals("<") || tobj.v.equals(">") || tobj.v.equals("<=") || tobj.v.equals(">="))) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.right != null) {
            tobj = obj.right;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjIf: Error: could not validate right obj as ref");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjIf: Error: could not validate right obj as const");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjIf: Error: could not validate right obj as exp");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjIf: Error: could not validate right obj as bex");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
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

         if (obj.thn != null && this.isArray(obj.thn)) {
            List<JsonObjSysBase> tobjLst = obj.thn;
            var len = tobjLst.size();
            for (var i = 0; i < len; i++) {
               if (!this.validateSysObjFuncLine(tobjLst.get(i))) {
                  this.wr("validateSysObjIf: Error: could not validate obj as then, line: " + i);
                  return false;
               }
            }
         }

         if (obj.els != null && this.isArray(obj.els)) {
            List<JsonObjSysBase> tobjLst = obj.els;
            var len = tobjLst.size();
            for (var i = 0; i < len; i++) {
               if (!this.validateSysObjFuncLine(tobjLst.get(i))) {
                  this.wr("validateSysObjIf: Error: could not validate obj as else, line: " + i);
                  return false;
               }
            }
         }

         return true;
      }
      return false;
   }

   /*
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
   public boolean validateSysObjFor(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("for")) && this.validateProperties(obj, new String[]{"sys", "start", "stop", "inc", "lines"})) {
         JsonObjSysBase tobj = null;
         if (obj.start != null) {
            tobj = obj.start;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as const");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
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

         if (obj.stop != null) {
            tobj = obj.stop;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as const");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
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

         if (obj.inc != null) {
            tobj = obj.inc;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as const");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
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

         for (var i = 0; i < obj.lines.size(); i++) {
            if (!this.validateSysObjFuncLine(obj.lines.get(i))) {
               this.wr("validateSysObjFor: Error: could not validate obj as func, line: " + i);
               return false;
            }
         }

         return true;
      }
      return false;
   }

   /*
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
   public boolean validateSysObjClass(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("class")) && this.validateProperties(obj, new String[]{"sys", "name", "vars", "funcs", "ret", "call"})) {
         if (!this.validateSysObjVal(obj.ret)) {
            this.wr("validateSysObjClass: Error: could not validate obj as val");
            return false;
         }

         if (obj.call != null && !this.validateSysObjCall(obj.call)) {
            this.wr("validateSysObjClass: Error: could not validate obj as call");
            return false;
         }

         for (var i = 0; i < obj.vars.size(); i++) {
            if (!this.validateSysObjVar(obj.vars.get(i))) {
               this.wr("validateSysObjClass: Error: could not validate obj as var");
               return false;
            }
         }

         for (var i = 0; i < obj.funcs.size(); i++) {
            if (!this.validateSysObjFunc(obj.funcs.get(i))) {
               this.wr("validateSysObjClass: Error: could not validate obj as func: " + obj.funcs.get(i).name);
               return false;
            }
         }

         return true;
      }
      return false;
   }

   /*
   * Name: validateSysObjFuncLine
   * Desc: Validates if the given object is a valid function line sys object.
   * Arg1: obj(sys obj to check)
   * Returns: {false | true}
   * Struct: <!-  
     [asgn | for | if | return | call]
     -!>
    */
   public boolean validateSysObjFuncLine(JsonObjSysBase obj) {
      if (this.isSysObj(obj)) {
         if (this.getSysObjType(obj).equals("asgn")) {
            if (!this.validateSysObjAsgn(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as asgn");
               return false;
            }
         } else if (this.getSysObjType(obj).equals("for")) {
            if (!this.validateSysObjFor(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as for");
               return false;
            }
         } else if (this.getSysObjType(obj).equals("if")) {
            if (!this.validateSysObjIf(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as if");
               return false;
            }
         } else if (this.getSysObjType(obj).equals("return")) {
            if (!this.validateSysObjReturn(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as return");
               return false;
            }
         } else if (this.getSysObjType(obj).equals("call")) {
            if (!this.validateSysObjCall(obj)) {
               this.wr("validateSysObjFuncLine: Error: could not validate obj as call");
               return false;
            }
         } else {
            return false;
         }
      }
      return true;
   }

   /*
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
   public boolean validateSysObjFunc(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("func")) && this.validateProperties(obj, new String[] {"sys", "name", "args", "vars", "ret", "lines"})) {
         if (!this.validateSysObjVal(obj.ret)) {
            this.wr("validateSysObjFunc: Error: could not validate obj as val");
            return false;
         }

         for (var i = 0; i < obj.vars.size(); i++) {
            if (!this.validateSysObjVar(obj.vars.get(i))) {
               this.wr("validateSysObjFunc: Error: could not validate obj as var");
               return false;
            }
         }

         for (var i = 0; i < obj.args.size(); i++) {
            if (!this.validateSysObjArg(obj.args.get(i))) {
               this.wr("validateSysObjFunc: Error: could not validate obj as arg");
               return false;
            }
         }

         for (var i = 0; i < obj.lines.size(); i++) {
            if (!this.validateSysObjFuncLine(obj.lines.get(i))) {
               this.wr("validateSysObjFunc: Error: could not validate obj as func line: " + i);
               return false;
            }
         }

         return true;
      }
      return false;
   }

   /*
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
   public boolean validateSysObjAsgn(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("asgn")) && this.validateProperties(obj, new String[]{"sys", "left", "op", "right"})) {
         JsonObjSysBase tobj = null;
         if (obj.left != null) {
            tobj = obj.left;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
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

         if (obj.op != null) {
            tobj = obj.op;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("op")) {
               if (!this.validateSysObjOp(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate obj as op");
                  return false;
               } else if (!tobj.type.equals("asgn")) {
                  this.wr("validateSysObjAsgn: Error: could not validate obj as op type");
                  return false;
               } else if (!tobj.v.equals("=")) {
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

         if (obj.right != null) {
            tobj = obj.right;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate right obj as ref");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate right obj as const");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate right obj as exp");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  this.wr("validateSysObjAsgn: Error: could not validate right obj as bex");
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
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

   /*
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
   public boolean validateSysObjBex(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("bex")) && this.validateProperties(obj, new String[]{"sys", "left", "op", "right"})) {
         JsonObjSysBase tobj = null;
         if (obj.left != null) {
            tobj = obj.left;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
               if (!this.validateSysObjCall(tobj)) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.op != null) {
            tobj = obj.op;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("op")) {
               if (!this.validateSysObjOp(tobj)) {
                  return false;
               } else if (!tobj.type.equals("bex")) {
                  return false;
               } else if (!(tobj.v.equals("==") || tobj.v.equals("!=") || tobj.v.equals("<") || tobj.v.equals(">") || tobj.v.equals("<=") || tobj.v.equals(">="))) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.right != null) {
            tobj = obj.right;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
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

   /*
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
   public boolean validateSysObjExp(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("exp")) && this.validateProperties(obj, new String[]{"sys", "left", "op", "right"})) {
         JsonObjSysBase tobj = null;
         if (obj.left != null) {
            tobj = obj.left;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
               if (!this.validateSysObjCall(tobj)) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.op != null) {
            tobj = obj.op;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("op")) {
               if (!this.validateSysObjOp(tobj)) {
                  return false;
               } else if (!tobj.type.equals("exp")) {
                  return false;
               } else if (!(tobj.v.equals("+") || tobj.v.equals("-") || tobj.v.equals("/") || tobj.v.equals("*"))) {
                  return false;
               }
            } else {
               return false;
            }
         } else {
            return false;
         }

         if (obj.right != null) {
            tobj = obj.right;
            if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
               if (!this.validateSysObjRef(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
               if (!this.validateSysObjConst(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("exp")) {
               if (!this.validateSysObjExp(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("bex")) {
               if (!this.validateSysObjBex(tobj)) {
                  return false;
               }
            } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("call")) {
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

   /*
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
   public boolean validateSysObjCall(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("call")) && this.validateProperties(obj, new String[]{"sys", "name", "args"})) {
         if (obj.args != null) {
            for (int i = 0; i < obj.args.size(); i++) {
               JsonObjSysBase tobj = obj.args.get(i);
               //this.wr("validateSysObjCall: found " + tobj.sys + " at index " + i + ", " + tobj.val.type);
               if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("ref")) {
                  if (!this.validateSysObjRef(tobj)) {
                     //this.wr("validateSysObjCall: Error: could not validate ref");
                     return false;
                  }
               } else if (this.isSysObj(tobj) && this.getSysObjType(tobj).equals("const")) {
                  //this.wr("validateSysObjCall: Error: could not validate const");
                  if (!this.validateSysObjConst(tobj)) {
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
   }

   /*
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
   public boolean validateSysObjOp(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("op")) && this.validateProperties(obj, new String[]{"sys", "type", "v"})) {
         if (!(obj.type.equals("asgn") || obj.type.equals("bex") || obj.type.equals("exp"))) {
            return false;
         }
         return true;
      }
      return false;
   }

   /*
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
   public boolean validateSysObjConst(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("const")) && this.validateProperties(obj, new String[]{"sys", "val"})) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /*
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
   public boolean validateSysObjVar(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("var")) && this.validateProperties(obj, new String[]{"sys", "name", "val"})) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /*
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
   public boolean validateSysObjArg(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("arg")) && this.validateProperties(obj, new String[]{"sys", "name", "val"})) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /*
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
   public boolean validateSysObjVal(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      //this.wr("validateSysObjVal: type: 000: " + obj.type + ", " + obj.v);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("val")) && this.validateProperties(obj, new String[]{"sys", "type", "v"})) {
         //this.wr("validateSysObjVal: type");
         if (!(obj.type.equals("int") || obj.type.equals("float") || obj.type.equals("string") || obj.type.equals("bool"))) {
            //this.wr("validateSysObjVal: type: AAA");
            return false;
         }
         //this.wr("validateSysObjVal: type: BBB");         
         return true;
      }
      
      //this.wr("validateSysObjVal: type: CCC");      
      return false;
   }

   /*
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
   public boolean validateSysObjRef(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      //this.wr("validateSysObjRef: Found sys: " + sysType);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("ref")) && this.validateProperties(obj, new String[]{"sys", "val"})) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            //this.wr("validateSysObjRef: Error: could not validate val object: ");// + this.validateSysObjVal(obj) + ", " + this.isSysObjVal(obj.val));
            return false;
         }
         return true;
      }
      return false;
   }

   /*
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
   public boolean validateSysObjReturn(JsonObjSysBase obj) {
      String sysType = this.getSysObjType(obj);
      if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.equals("return")) && this.validateProperties(obj, new String[]{"sys", "val"})) {
         if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val)) {
            return false;
         }
         return true;
      }
      return false;
   }

   /*
   * Name: validateProperties
   * Desc: Validates if the given object has each of the array elements soecified in req.
   * Arg1: obj(sys obj to check)
   * Arg2: req(array of attribute name to check for)
   * Returns: {false | true}
    */
   public boolean validateProperties(JsonObjSysBase obj, String[] req) {
      Class clss = null;
      Field fld = null;
      for (int i = 0; i < req.length; i++) {
         try {
            clss = obj.getClass();
            fld = clss.getField(req[i]);

            if (fld.get(obj) == null) {
               this.wr("Field '" + req[i] + "' is null");
               return false;
            }

         } catch (Exception e) {
            e.printStackTrace();
            return false;
         }
      }
      return true;
   }

   /////////////////////////PROCESS METHODS
   /*
   * Name: processRef
   * Desc: Processes a class var or func var or arg reference string.
   * Arg1: objRef(string ref encoding)
   * Arg2: func(func obj, sys=func)
   * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
    */
   public JsonObjSysBase processRef(JsonObjSysBase objRef, JsonObjSysBase func) {
      String path = null;
      String[] vls = null;
      JsonObjSysBase fnd = null;
      JsonObjSysBase prog = this.program;

      if (!this.isSysObjRef(objRef)) {
         this.wr("processRef: Error: argument objRef is not a ref obj");
         return null;
      } else if (!this.isSysObjFunc(func)) {
         this.wr("processRef: Error: argument objRef is not a func obj");
         return null;
      }

      //this.wr("OBJ REF");
      //this.wrObj(objRef);
      if (objRef.val.v.toString().indexOf("#.") == 0) {
         //program/class var
         path = objRef.val.v.toString().substring(2);
         vls = path.split("\\.");
         if (vls[0].equals("vars")) {
            fnd = this.findVar(vls[1], prog);
            if (fnd != null) {
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

      } else if (objRef.val.v.toString().indexOf("$.") == 0) {
         //func var, arg
         path = objRef.val.v.toString().substring(2);
         vls = path.split("\\.");
         if (vls[0].equals("vars")) {
            fnd = this.findVar(vls[1], func);
            if (fnd != null) {
               //this.wr("processRef: found reference result: " + this.wrObj(fnd));            
               return fnd;
            } else {
               this.wr("processRef: Error: could not find var with name '" + vls[1] + "' in func: " + func.name);
               return null;
            }
         } else if (vls[0].equals("args")) {
            fnd = this.findArg(vls[1], func);
            if (fnd != null) {
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
   }

   //TODO
   public int toBoolInt(String v) {
      String vb = v + "";
      vb = vb.toLowerCase();
      if(vb.equals("true")) {
         return 1;
      } else if(vb.equals("1")) {
         return 1;
      } else if(vb.equals("yes")) {
         return 1;
      } else {
         return 0;
      }
   }

   //TODO
   public boolean toBool(String v) {
      String vb = v + "";
      vb = vb.toLowerCase();
      if(vb.equals("true")) {
         return true;
      } else if(vb.equals("1")) {
         return true;
      } else if(vb.equals("yes")) {
         return true;
      } else {
         return false;
      }
   }

   /*
   * Name: processIf
   * Desc: Processes an if statement. Returns the value of the Boolean if statement expression.
   * Arg1: objIf(if obj, sys=if)
   * Arg2: func(func obj, sys=func)
   * Returns: {null | (const obj, sys=const)}
    */
   public JsonObjSysBase processIf(JsonObjSysBase objIf, JsonObjSysBase func) {
      JsonObjSysBase left = null;
      JsonObjSysBase op = null;
      JsonObjSysBase right = null;
      List<JsonObjSysBase> thn = null;
      List<JsonObjSysBase> els = null;

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

      if (left == null) {
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

      if (right == null) {
         this.wr("processBex: Error: error processing right");
         return null;
      }

      if (left.val.type.equals(right.val.type)) {
         JsonObjSysBase ret = new JsonObjSysBase("val");
         ret.type = "bool";
         ret.v = null;

         JsonObjSysBase ret2 = new JsonObjSysBase("const");
         JsonObjSysBase ret3 = null;

         if (op.v.equals("==")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) == Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) == Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) == this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).equals((String) right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals("!=")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) != Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) != Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) != this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (!((String) left.val.v).equals((String) right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals("<")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) < Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) < Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) < this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).length() < ((String) right.val.v).length()) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals(">")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) > Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) > Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) > this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).length() > ((String) right.val.v).length()) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals("<=")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) <= Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) <= Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) <= this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).length() <= ((String) right.val.v).length()) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals(">=")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) >= Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) >= Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) >= this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).length() >= ((String) right.val.v).length()) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else {
            this.wr("processBex: Error: unknown operator: " + op.v);
            return null;
         }

         if (this.toBool(ret.v) == true) {
            //run thn lines
            ret3 = this.processIfForLines(thn, func);
         } else {
            //run els lines
            ret3 = this.processIfForLines(els, func);
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

   /*
   * Name: processIfForLines
   * Desc: Processes an array of if statement or for loop lines.
   *       Returns the last value returned by the last line or returns the return value if encountered.
   * Arg1: objLines(array of lines)
   * Arg2: func(func obj, sys=func)
   * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
    */
   public JsonObjSysBase processIfForLines(List<JsonObjSysBase> objLines, JsonObjSysBase func) {
      if (objLines != null && this.isArray(objLines) && objLines.size() > 0) {
         int j = 0;
         int len = objLines.size();
         JsonObjSysBase ret = null;
         JsonObjSysBase line = null;

         for (j = 0; j < len; j++) {
            line = objLines.get(j);

            //support comments
            if (line.active == false) {
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
               return line;
            }

            if (ret == null) {
               this.wr("processIfForLines: Error: processing line returned null: " + j);
               return null;
            }
         }
         return ret;
      } else {
         this.wr("processIfForLines: Warning: provided lines array is null");
         var ret = new JsonObjSysBase("val");
         ret.type = "bool";
         ret.v = "true";

         var ret2 = new JsonObjSysBase("const");
         ret2.sys = "const";
         ret2.val = ret;
         ret = ret2;
         return ret;
      }
   }

   /*
   * Name: processFor
   * Desc: Processes a for loop. Returns the last loop iteration value.
   * Arg1: objFor(for obj, sys=for)
   * Arg2: func(func obj, sys=func)
   * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
    */
   public JsonObjSysBase processFor(JsonObjSysBase objFor, JsonObjSysBase func) {
      JsonObjSysBase start = null;
      JsonObjSysBase stop = null;
      JsonObjSysBase inc = null;

      if (!this.isSysObjFor(objFor)) {
         this.wr("processFor: Error: argument objRef is not a for obj");
         return null;
      } else if (!this.isSysObjFunc(func)) {
         this.wr("processFor: Error: argument func is not a func obj");
         return null;
      }

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

      if (start == null) {
         this.wr("processFor: Error: argument start is null");
         return null;
      }

      stop = objFor.stop;
      if (this.isSysObjConst(start)) {
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

      if (stop == null) {
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

      if (inc == null) {
         this.wr("processFor: Error: argument inc is null");
         return null;
      }

      if (!start.val.type.equals("int")) {
         this.wr("processFor: Error: argument start unsuppoorted type: " + start.sys);
         return null;

      } else if (!stop.val.type.equals("int")) {
         this.wr("processFor: Error: argument stop unsuppoorted type: " + stop.sys);
         return null;

      } else if (!inc.val.type.equals("int")) {
         this.wr("processFor: Error: argument inc unsuppoorted type: " + inc.sys);
         return null;
      }

      JsonObjSysBase ret = new JsonObjSysBase("val");
      ret.type = "int";
      ret.v = 0 + "";

      JsonObjSysBase ret2 = new JsonObjSysBase("const");
      ret2.sys = "const";
      ret2.val = ret;
      ret = ret2;

      JsonObjSysBase ret3 = null;
      int i = 0;
      int incAmt = Integer.parseInt(inc.val.v);
      int lenAmt = Integer.parseInt(stop.val.v);
      int startAmt = Integer.parseInt(start.val.v);
      for (i = startAmt; i < lenAmt; i += incAmt) {
         ret3 = this.processIfForLines(objFor.lines, func);
         if (ret3 == null) {
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

   /*
   * Name: processAsgn
   * Desc: Processes an assigment. Returns true value.
   * Arg1: objAsgn(asgn obj, sys=asgn)
   * Arg2: func(func obj, sys=func)
   * Returns: {null | (const obj, sys=const)}
    */
   public JsonObjSysBase processAsgn(JsonObjSysBase objAsgn, JsonObjSysBase func) {
      JsonObjSysBase left = null;
      JsonObjSysBase op = null;
      JsonObjSysBase right = null;

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

      left = this.processRef(left, func);
      if (left == null) {
         this.wr("processAsgn: Error: error processing left");
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
         this.wr("processAsgn: Error: argument right is an unknown obj: " + this.getSysObjType(right));
         return null;
      }

      if (right == null) {
         this.wr("processAsgn: Error: error processing right");
         return null;
      }

      if (left.val.type.equals(right.val.type)) {
         left.val.v = right.val.v;

         var ret = new JsonObjSysBase("val");
         ret.type = "bool";
         ret.v = "true";

         var ret2 = new JsonObjSysBase("const");
         ret2.val = ret;

         ret = ret2;
         this.lastAsgnValue = this.cloneJsonObj(left);
         this.lastAsgnReturn = ret;
         return ret;
      } else {
         this.wr("processAsgn: Error: type mismatch: " + left.val.type + " - " + right.val.type);
         return null;
      }
   }

   /*
   * Name: processBex
   * Desc: Processes a boolean expression. Returns Boolean result of the expression.
   * Arg1: objBex(bex obj, sys=bex)
   * Arg2: func(func obj, sys=func)
   * Returns: {null | (const obj, sys=const)}
    */
   public JsonObjSysBase processBex(JsonObjSysBase objBex, JsonObjSysBase func) {
      JsonObjSysBase left = null;
      JsonObjSysBase op = null;
      JsonObjSysBase right = null;

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

      if (left == null) {
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

      if (right == null) {
         this.wr("processBex: Error: error processing right");
         return null;
      }

      if (left.val.type.equals(right.val.type)) {
         JsonObjSysBase ret = new JsonObjSysBase("val");
         ret.type = "bool";
         ret.v = null;

         JsonObjSysBase ret2 = new JsonObjSysBase("const");

         if (op.v.equals("==")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) == Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) == Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) == this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).equals((String) right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals("!=")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) != Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) != Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) != this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (!((String) left.val.v).equals((String) right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals("<")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) < Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) < Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) < this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).length() < ((String) right.val.v).length()) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals(">")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) > Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) > Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) > this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).length() > ((String) right.val.v).length()) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals("<=")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) <= Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) <= Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) <= this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).length() <= ((String) right.val.v).length()) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            }
         } else if (op.v.equals(">=")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(left.val.v) >= Integer.parseInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(left.val.v) >= Float.parseFloat(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(left.val.v) >= this.toBoolInt(right.val.v)) {
                  ret.v = "true";
               } else {
                  ret.v = "false";
               }
            } else if (left.val.type.equals("string")) {
               if (((String) left.val.v).length() >= ((String) right.val.v).length()) {
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

   /*
   * Name: processFunc
   * Desc: Processes a function's lines. Returns last statement or return value.
   * Arg1: objFunc(bex obj, sys=func)
   * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
    */
   public JsonObjSysBase processFunc(JsonObjSysBase objFunc) {
      if (!this.isSysObjFunc(objFunc)) {
         this.wr("processFunc: Error: argument objRef is not a call func");
         return null;
      }

      JsonObjSysBase ret3 = null;
      ret3 = this.processIfForLines(objFunc.lines, objFunc);
      return ret3;
   }

   /*
   * Name: processCall
   * Desc: Processes a function call. Returns last statement or return value from executing the function's lines.
   * Arg1: objCall(call obj, sys=call)
   * Arg2: func(func obj, sys=func)
   * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
    */
   public JsonObjSysBase processCall(JsonObjSysBase objCall, JsonObjSysBase func) {
      String name = null;
      List<JsonObjSysBase> args = null;
      JsonObjSysBase funcDef = null;
      List<JsonObjSysBase> funcArgs = null;
      JsonObjSysBase tmpArg = null;
      JsonObjSysBase ret = null;
      boolean sysFunc = false;

      if (!this.isSysObjCall(objCall)) {
         this.wr("processCall: Error: argument objRef is not a call obj");
         return null;

      } else if (!this.isSysObjFunc(func)) {
         this.wr("processCall: Error: argument func is not a func obj");
         return null;
      }

      name = objCall.name;
      args = this.cloneJsonObjList(objCall.args);
      funcDef = this.findFunc(name);
      if (funcDef != null) {
         funcArgs = funcDef.args;

      } else {
         sysFunc = true;
         funcDef = this.findSysFunc(name);
         if (funcDef != null) {
            funcArgs = funcDef.args;
         } else {
            this.wr("processCall: Error: no function found with name: " + name);
            return null;
         }
      }

      if (funcArgs != null) {
         if (args.size() == funcArgs.size()) {
            for (var i = 0; i < args.size(); i++) {
               if (!args.get(i).val.type.equals(funcArgs.get(i).val.type)) {
                  this.wr("processCall: Error: type mismatch at argument index, " + i + ", func arg def: " + funcArgs.get(i).val.type + ", call arg: " + args.get(i).val.type);
                  return null;
               }

               if (this.isSysObjRef(args.get(i))) {
                  tmpArg = null;
                  tmpArg = this.processRef(args.get(i), func);
                  if (tmpArg != null) {
                     args.get(i).val.v = tmpArg.val.v;
                     args.get(i).name = funcArgs.get(i).name;
                  } else {
                     this.wr("processCall: Error: could not process argument index, " + i + ", with path: " + args.get(i).val.v);
                     return null;
                  }
               }
            }

            if (sysFunc) {
               boolean err = true;
               JsonObjSysBase lret = null;
               try {
                  if (this.systemFunctionHandler != null) {
                     lret = this.systemFunctionHandler.call(funcDef.fname, args, this);
                     err = false;
                  } else {
                     lret = null;
                     err = true;
                  }
               } catch (Exception e) {
                  lret = null;
                  err = true;
               }

               if (lret == null) {
                  JsonObjSysBase ret1 = new JsonObjSysBase("val");
                  ret1.type = "bool";
                  ret1.v = err + "";

                  JsonObjSysBase ret2 = new JsonObjSysBase("const");
                  ret2.val = ret1;
                  ret1 = ret2;
                  return ret1;
               } else {
                  return lret;
               }
            } else {
               //backup default args
               funcDef.args_def = this.cloneJsonObjList(funcDef.args);
               funcDef.args = args;

               //backup default ret
               funcDef.ret_def = this.cloneJsonObj(funcDef.ret);
               ret = this.processFunc(funcDef);

               //this.wr("RET_DEF");
               //this.wrObj(funcDef.ret_def);
               if (!ret.val.type.equals(funcDef.ret_def.type)) {
                  this.wr("processCall: Error: function return type mismatch, return type " + ret.val.type + " expected " + funcDef.ret_def.type);
                  return null;
               }

               //restore args and ret
               funcDef.args = this.cloneJsonObjList(funcDef.args_def);
               funcDef.ret = this.cloneJsonObj(funcDef.ret_def);

               return ret;
            }
         } else {
            this.wr("processCall: Error: function argument length mismatch, func arg def: " + funcArgs.size() + ", call arg: " + args.size());
            return null;
         }
      } else {
         this.wr("processCall: Error: function arguments is null");
         return null;
      }
   }

   /*
   * Name: processExp
   * Desc: Processes an expression. Returns the value of the expression.
   * Arg1: objExp(exp obj, sys=exp)
   * Arg2: func(func obj, sys=func)
   * Returns: {null | (const obj, sys=const)}
    */
   public JsonObjSysBase processExp(JsonObjSysBase objExp, JsonObjSysBase func) {
      JsonObjSysBase left = null;
      JsonObjSysBase op = null;
      JsonObjSysBase right = null;

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

      if (left == null) {
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

      if (right == null) {
         this.wr("processExp: Error: error processing right");
         return null;
      }

      if (left.val.type.equals(right.val.type) && (left.val.type.equals("int") || left.val.type.equals("float") || left.val.type.equals("bool"))) {
         var ret = new JsonObjSysBase("val");
         ret.type = left.val.type;
         ret.v = null;

         var ret2 = new JsonObjSysBase("const");
         ret2.val = ret;

         if (op.v.equals("+")) {
            if (left.val.type.equals("int")) {
               ret.v = (Integer.parseInt(left.val.v) + Integer.parseInt(right.val.v)) + "";               
            } else if (left.val.type.equals("float")) {
               ret.v = (Float.parseFloat(left.val.v) + Float.parseFloat(right.val.v)) + "";
            } else if (left.val.type.equals("bool")) {
               ret.v = (this.toBoolInt(left.val.v) + this.toBoolInt(right.val.v)) + "";
            }
         } else if (op.v.equals("-")) {
            if (left.val.type.equals("int")) {
               ret.v = (Integer.parseInt(left.val.v) - Integer.parseInt(right.val.v)) + "";
            } else if (left.val.type.equals("float")) {
               ret.v = (Float.parseFloat(left.val.v) - Float.parseFloat(right.val.v)) + "";
            } else if (left.val.type.equals("bool")) {
               ret.v = (this.toBoolInt(left.val.v) - this.toBoolInt(right.val.v)) + "";
            }
         } else if (op.v.equals("/")) {
            if (left.val.type.equals("int")) {
               if (Integer.parseInt(right.val.v) == 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = (Integer.parseInt(left.val.v) / Integer.parseInt(right.val.v)) + "";
               }
            } else if (left.val.type.equals("float")) {
               if (Float.parseFloat(right.val.v) == 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = (Float.parseFloat(left.val.v) / Float.parseFloat(right.val.v)) + "";
               }
            } else if (left.val.type.equals("bool")) {
               if (this.toBoolInt(right.val.v) == 0) {
                  this.wr("processExp: Error: divide by zero error");
                  return null;
               } else {
                  ret.v = (this.toBoolInt(left.val.v) / this.toBoolInt(right.val.v)) + "";
               }
            }
         } else if (op.v.equals("*")) {
            if (left.val.type.equals("int")) {
               ret.v = (Integer.parseInt(left.val.v) * Integer.parseInt(right.val.v)) + "";
            } else if (left.val.type.equals("float")) {
               ret.v = (Float.parseFloat(left.val.v) * Float.parseFloat(right.val.v)) + "";
            } else if (left.val.type.equals("bool")) {
               ret.v = (this.toBoolInt(left.val.v) * this.toBoolInt(right.val.v)) + "";
            }
         } else {
            this.wr("processExp: Error: unknown operator: " + op.v);
            return null;
         }

         if (left.val.type.equals("int")) {
            ret.v = Integer.parseInt(ret.v) + "";
         } else if (left.val.type.equals("float")) {
            ret.v = Float.parseFloat(ret.v) + "";
         } else if (left.val.type.equals("bool")) {
            ret.v = (this.toBool(ret.v)) + "";
         }

         ret = ret2;
         this.lastExpReturn = ret;
         return ret;
      } else {
         this.wr("processExp: Error: type mismatch: " + left.val.type + " - " + right.val.type);
         return null;
      }
   }
}
