using com.middlemind.JsonPL;
using com.middlemind.JsonPL.JsonObjs;
using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.Reflection;

/**
* JSON Programming Language
* EXEC JAVA PORT
* Victor G. Brusca 
* Created on 02/03/2022 1:57 PM EDT
* Licensed under GNU General Public License v3.0
*/
namespace com.middlemind.JsonPL
{
    /**
    *
    * @author Victor G. Brusca, Middlemind Games 03/27/2022 11:17 AM EDT
    */
    public class JsonPlState
    {
        /**
         * 
         */
        public string version = "0.5.1";

        /**
         * 
         */
        public int lineNumCurrent = 0;

        /**
         * 
         */
        public int lineNumPrev = 0;

        /**
         * 
         */
        public int linNumNext = 0;

        /**
         * 
         */
        public JsonObjSysBase lastForReturn = null;

        /**
         * 
         */
        public JsonObjSysBase lastIfReturn = null;

        /**
         * 
         */
        public JsonObjSysBase lastBexReturn = null;

        /**
         * 
         */
        public JsonObjSysBase lastExpReturn = null;

        /**
         * 
         */
        public JsonObjSysBase lastAsgnReturn = null;

        /**
         * 
         */
        public JsonObjSysBase lastAsgnValue = null;

        /**
         * 
         */
        public JsonObjSysBase lastProgramReturn = null;

        /**
         * 
         */
        public JsonObjSysBase program = null;

        /**
         * 
         */
        public bool LOGGING = true;

        /**
         * 
         */
        public string WR_PREFIX = "";

        /**
         * 
         */
        public Dictionary<string, List<JsonObjSysBase>> system;

        /**
         * 
         */
        public SystemFunctionHandlerJpl systemFunctionHandler = null;

        /**
         *
         */
        public JsonPlState()
        {
            List<JsonObjSysBase> sfuncs = new List<JsonObjSysBase>();
            system = new Dictionary<string, List<JsonObjSysBase>>();
            system.Add("functions", sfuncs);
        }

        /**
        * Name: sysWr
        * Desc: A system level write function.
        * Arg1: args(arg obj, sys=arg & array of)
        * Returns: {(const obj, sys=const)}
        */
        public JsonObjSysBase sysWr(List<JsonObjSysBase> args)
        {
            string s = args[0].val.v + "";
            this.wr(s);

            JsonObjSysBase ret = new JsonObjSysBase("val");
            ret.type = "bool";
            ret.v = "true";

            JsonObjSysBase ret2 = new JsonObjSysBase("const");
            ret2.val = ret;
            ret = ret2;

            return ret;
        }

        /**
        * Name: sysGetLastAsgnValue
        * Desc: A system level method to access the last asgn value object.
        * Returns: {(const obj, sys=const)}
        */
        public JsonObjSysBase sysGetLastAsgnValue()
        {
            return this.lastAsgnValue;
        }

        /**
        * Name: sysGetLastAsgnValue
        * Desc: A system level method to access the last exp return object.
        * Returns: {(const obj, sys=const)}
        */
        public JsonObjSysBase sysGetLastExpReturn()
        {
            return this.lastExpReturn;
        }

        /**
        * Name: getConstBool
        * Desc: A method to quickly access a constant bool value object.
        * Returns: {(const obj, sys=const)}
        */
        public JsonObjSysBase getConstBool()
        {
            JsonObjSysBase ret = new JsonObjSysBase("val");
            ret.type = "bool";
            ret.v = "false";

            JsonObjSysBase ret2 = new JsonObjSysBase("const");
            ret2.val = ret;
            ret = ret2;

            return ret;
        }

        /**
        * Name: sysJob1
        * Desc: A system level job method used to demonstrate JCL.
        * Arg1: args(arg obj, sys=arg & array of)
        * Returns: {(const obj, sys=const)}
        */
        public JsonObjSysBase sysJob1()
        {
            this.wr("sysJob1");
            JsonObjSysBase ret = this.getConstBool();
            ret.val.v = "true";
            return ret;
        }

        /**
        * Name: sysJob2
        * Desc: A system level job method used to demonstrate JCL.
        * Arg1: args(arg obj, sys=arg & array of)
        * Returns: {(const obj, sys=const)}
        */
        public JsonObjSysBase sysJob2()
        {
            this.wr("sysJob2");
            JsonObjSysBase ret = this.getConstBool();
            ret.val.v = "true";
            return ret;
        }

        /**
        * Name: sysJob3
        * Desc: A system level job method used to demonstrate JCL.
        * Arg1: args(arg obj, sys=arg & array of)
        * Returns: {(const obj, sys=const)}
        */
        public JsonObjSysBase sysJob3()
        {
            this.wr("sysJob3");
            JsonObjSysBase ret = this.getConstBool();
            ret.val.v = "true";
            return ret;
        }

        /**
        * Name: runProgram
        * Desc: Executes the current program and returns the result.
        * Returns: {(some sys obj)}
        */
        public JsonObjSysBase runProgram()
        {
            if (this.validateSysObjClass(this.program))
            {
                JsonObjSysBase callObj = this.program.call;
                string callFuncName = callObj.name;
                this.wr("runProgram: RUN PROGRAM: " + callFuncName);
                JsonObjSysBase callFunc = this.findFunc(callFuncName);

                JsonObjSysBase ret = null;
                ret = this.processCall(callObj, callFunc);
                this.lastProgramReturn = ret;

                //this.wrObj(res);
                return ret;
            }
            else
            {
                this.wr("runProgram: Error: could not validate the class object.");
                return null;
            }
        }

        /////////////////////////SEARCH METHODS
        /**
        * Name: findArg
        * Desc: Search the provided object for an argument with the given name.
        * Arg1: name(string to find)
        * Arg2: obj(func obj, sys=func)
        * Returns: {null | (arg obj, sys=arg)}
        */
        public JsonObjSysBase findArg(string name, JsonObjSysBase obj)
        {
            string str;
            JsonObjSysBase subj;
            for (int i = 0; i < obj.args.Count; i++)
            {
                subj = obj.args[i];
                str = subj.name;
                if (!Utils.IsStringEmpty(str) && str.Equals(name))
                {
                    return subj;
                }
            }
            return null;
        }

        /**
        * Name: findVar
        * Desc: Search the provided object for a variable with the given name.
        * Arg1: name(string to find)
        * Arg2: obj{(func obj, sys=func) | (class obj, sys=class)}
        * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
         */
        public JsonObjSysBase findVar(string name, JsonObjSysBase obj)
        {
            string str;
            JsonObjSysBase subj;
            for (int i = 0; i < obj.vars.Count; i++)
            {
                subj = obj.vars[i];
                str = subj.name;
                if (!Utils.IsStringEmpty(str) && str.Equals(name))
                {
                    return subj;
                }
            }
            return null;
        }

        /**
        * Name: findFunc
        * Desc: Search the current program for a func with the given name.
        * Arg1: name(string to find)
        * Returns: {null | (func obj, sys=func)}
         */
        public JsonObjSysBase findFunc(string name)
        {
            JsonObjSysBase prog = this.program;
            string str;
            JsonObjSysBase subj;
            for (int i = 0; i < prog.funcs.Count; i++)
            {
                subj = prog.funcs[i];
                str = subj.name;
                if (!Utils.IsStringEmpty(str) && str.Equals(name))
                {
                    return subj;
                }
            }
            return null;
        }

        /**
        * Name: findSysFunc
        * Desc: Search the current program's sytem functions for a func with the given name.
        * Arg1: name(string to find)
        * Returns: {null | (func obj, sys=func)}
         */
        public JsonObjSysBase findSysFunc(string name)
        {
            JsonPlState prog = this;
            string str;
            JsonObjSysBase subj;
            List<JsonObjSysBase> sFuncs = prog.system["functions"];

            for (int i = 0; i < sFuncs.Count; i++)
            {
                subj = sFuncs[i];
                str = subj.name;
                if (!Utils.IsStringEmpty(str) && str.Equals(name))
                {
                    return subj;
                }
            }
            return null;
        }

        /////////////////////////UTILITY METHODS
        /**
        * Name: wr
        * Desc: Writes a string to standard output if LOGGING is on.
        *       Sets the WR_PREFIX to each string written. 
        * Arg1: s(string to write)
        */
        public void wr(string s)
        {
            if (this.LOGGING == true)
            {
                Logger.wrl(this.WR_PREFIX + s);
            }
        }

        /**
        * Name: getVersion
        * Desc: A method to access the version of this JsonPL interpreter.
        * Returns: {(string version number)}
        */
        public string getVersion()
        {
            this.wr(this.version);
            return this.version;
        }

        /**
        * Name: cloneJsonObj
        * Desc: A method to clone the given JSON object argument.
        * Arg1: jsonObj(the JSON object to clone)
        * Returns: {(cloned JSON object)}
        */
        public JsonObjSysBase cloneJsonObj(JsonObjSysBase jsonObj)
        {
            return jsonObj.Clone();
        }

        //TODO
        public List<JsonObjSysBase> cloneJsonObjList(List<JsonObjSysBase> jsonObjLst)
        {
            List<JsonObjSysBase> ret = new List<JsonObjSysBase>();
            for (int i = 0; i < jsonObjLst.Count; i++)
            {
                ret.Add(jsonObjLst[i].Clone());
            }
            return ret;
        }

        /**
        * Name: wrObj
        * Desc: Writes a JSON object to standard output if LOGGING is on.
        *       Sets the WR_PREFIX to each object written.
        *       Prints object using pretty JSON.stringify call. 
        * Arg1: s(string to write)
        */
        public void wrObj(JsonObjSysBase jsonObj)
        {
            if (this.LOGGING == true)
            {
                Utils.PrintObject(jsonObj, "wrObj");
                this.wr("");
            }
        }

        //TODO
        public void wrObj(List<JsonObjSysBase> jsonObjs)
        {
            if (this.LOGGING == true)
            {
                for (int i = 0; i < jsonObjs.Count; i++)
                {
                    Utils.PrintObject(jsonObjs[i], "wrObj");
                    this.wr("");
                }
            }
        }

        /////////////////////////GENERIC OBJECT ID METHODS
        /**
        * Name: isObject
        * Desc: Checks if the given argument is a JSON object. 
        * Arg1: arg(JSON object)
        * Returns: (true | false)
        */
        public bool isObject(Object arg)
        {
            if (arg is JsonObjSysBase)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
        * Name: isArray
        * Desc: Checks if the given argument is an array. 
        * Arg1: arg(javascript array)
        * Returns: (true | false)
        */
        //TODO
        public bool isArray(Object arg)
        {
            if (arg is IList || arg is Array)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
        * Name: isString
        * Desc: Checks if the given argument is a string. 
        * Arg1: arg(some string)
        * Returns: (true | false)
         */
        public bool isString(Object arg)
        {
            if (arg is string)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /////////////////////////SYS OBJECT ID METHODS
        /**
        * Name: isSysObjIf
        * Desc: Checks if the given object is an if sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
        */
        public bool isSysObjIf(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("if"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjRef
        * Desc: Checks if the given object is a ref sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
        */
        public bool isSysObjRef(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("ref"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjBex
        * Desc: Checks if the given object is a bex sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
        */
        public bool isSysObjBex(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("bex"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjExp
        * Desc: Checks if the given object is an exp sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
        */
        public bool isSysObjExp(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("exp"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjVal
        * Desc: Checks if the given object is a val sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
        */
        public bool isSysObjVal(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = this.getSysObjType(obj);
                //this.wr("ObjSys: " + objSys + ", " + Utils.IsStringEmpty(objSys) + ", " + objSys.Equals("val"));
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("val"))
                {
                    return true;
                }
            }
            //this.wr("not sys object");
            return false;
        }

        /**
        * Name: isSysObjAsgn
        * Desc: Checks if the given object is an asgn sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
        */
        public bool isSysObjAsgn(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("asgn"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjArray
        * Desc: Checks if the given object is an array sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public bool isSysObjArray(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("array"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjConst
        * Desc: Checks if the given object is a const sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public bool isSysObjConst(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("const"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjVar
        * Desc: Checks if the given object is a var sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public bool isSysObjVar(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("var"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjCall
        * Desc: Checks if the given object is a call sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public bool isSysObjCall(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("call"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjFunc
        * Desc: Checks if the given object is a func sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public bool isSysObjFunc(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("func"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjFor
        * Desc: Checks if the given object is a for sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public bool isSysObjFor(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("for"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObjReturn
        * Desc: Checks if the given object is a return sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public bool isSysObjReturn(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("return"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
        * Name: isSysObj
        * Desc: Checks if the given object is a sys object. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public bool isSysObj(JsonObjSysBase obj)
        {
            if (obj != null && !Utils.IsStringEmpty(obj.sys) && this.isObject(obj) == true)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
        * Name: getSysObjType
        * Desc: Gets the value of the sys attribute of the given sys object.. 
        * Arg1: obj(sys obj to check)
        * Returns: (true | false)
         */
        public string getSysObjType(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj))
            {
                return obj.sys;
            }
            else
            {
                return null;
            }
        }

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
        public bool validateSysObjIf(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("if")) && this.validateProperties(obj, new string[] { "sys", "left", "op", "right", "thn", "els" }))
            {
                JsonObjSysBase tobj = null;
                if (obj.left != null)
                {
                    tobj = obj.left;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as ref");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as const");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as exp");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as bex");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as call");
                            return false;
                        }
                    }
                    else
                    {
                        this.wr("validateSysObjFor: Error: could not validate obj as left");
                        return false;
                    }
                }
                else
                {
                    this.wr("validateSysObjIf: Error: could not validate obj as left, null");
                    return false;
                }

                if (obj.op != null)
                {
                    tobj = obj.op;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("op"))
                    {
                        if (!this.validateSysObjOp(tobj))
                        {
                            return false;
                        }
                        else if (!tobj.type.Equals("bex"))
                        {
                            return false;
                        }
                        else if (!(tobj.v.Equals("==") || tobj.v.Equals("!=") || tobj.v.Equals("<") || tobj.v.Equals(">") || tobj.v.Equals("<=") || tobj.v.Equals(">=")))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }

                if (obj.right != null)
                {
                    tobj = obj.right;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as ref");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as const");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as exp");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as bex");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as call");
                            return false;
                        }
                    }
                    else
                    {
                        this.wr("validateSysObjIf: Error: could not validate obj as right");
                        return false;
                    }
                }
                else
                {
                    this.wr("validateSysObjIf: Error: could not validate obj as right, null");
                    return false;
                }

                if (obj.thn != null && this.isArray(obj.thn))
                {
                    List<JsonObjSysBase> tobjLst = obj.thn;
                    var len = tobjLst.Count;
                    for (var i = 0; i < len; i++)
                    {
                        if (!this.validateSysObjFuncLine(tobjLst[i]))
                        {
                            this.wr("validateSysObjIf: Error: could not validate obj as then, line: " + i);
                            return false;
                        }
                    }
                }

                if (obj.els != null && this.isArray(obj.els))
                {
                    List<JsonObjSysBase> tobjLst = obj.els;
                    var len = tobjLst.Count;
                    for (var i = 0; i < len; i++)
                    {
                        if (!this.validateSysObjFuncLine(tobjLst[i]))
                        {
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
        public bool validateSysObjFor(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("for")) && this.validateProperties(obj, new string[] { "sys", "start", "stop", "inc", "lines" }))
            {
                JsonObjSysBase tobj = null;
                if (obj.start != null)
                {
                    tobj = obj.start;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as const");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as call");
                            return false;
                        }
                    }
                    else
                    {
                        this.wr("validateSysObjFor: Error: could not validate obj as right");
                        return false;
                    }
                }
                else
                {
                    this.wr("validateSysObjFor: Error: could not validate obj as right, null");
                    return false;
                }

                if (obj.stop != null)
                {
                    tobj = obj.stop;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as const");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as call");
                            return false;
                        }
                    }
                    else
                    {
                        this.wr("validateSysObjFor: Error: could not validate obj as right");
                        return false;
                    }
                }
                else
                {
                    this.wr("validateSysObjFor: Error: could not validate obj as right, null");
                    return false;
                }

                if (obj.inc != null)
                {
                    tobj = obj.inc;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as ref");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as const");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as exp");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as bex");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate right obj as call");
                            return false;
                        }
                    }
                    else
                    {
                        this.wr("validateSysObjFor: Error: could not validate obj as right");
                        return false;
                    }
                }
                else
                {
                    this.wr("validateSysObjFor: Error: could not validate obj as right, null");
                    return false;
                }

                for (var i = 0; i < obj.lines.Count; i++)
                {
                    if (!this.validateSysObjFuncLine(obj.lines[i]))
                    {
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
        public bool validateSysObjClass(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("class")) && this.validateProperties(obj, new string[] { "sys", "name", "vars", "funcs", "ret", "call" }))
            {
                if (!this.validateSysObjVal(obj.ret))
                {
                    this.wr("validateSysObjClass: Error: could not validate obj as val");
                    return false;
                }

                if (obj.call != null && !this.validateSysObjCall(obj.call))
                {
                    this.wr("validateSysObjClass: Error: could not validate obj as call");
                    return false;
                }

                for (var i = 0; i < obj.vars.Count; i++)
                {
                    if (!this.validateSysObjVar(obj.vars[i]))
                    {
                        this.wr("validateSysObjClass: Error: could not validate obj as var");
                        return false;
                    }
                }

                for (var i = 0; i < obj.funcs.Count; i++)
                {
                    if (!this.validateSysObjFunc(obj.funcs[i]))
                    {
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
        * Desc: Validates if the given object is a valid function line sys object.
        * Arg1: obj(sys obj to check)
        * Returns: {false | true}
        * Struct: <!-  
          [asgn | for | if | return | call]
          -!>
         */
        public bool validateSysObjFuncLine(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj))
            {
                if (this.getSysObjType(obj).Equals("asgn"))
                {
                    if (!this.validateSysObjAsgn(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as asgn");
                        return false;
                    }
                }
                else if (this.getSysObjType(obj).Equals("for"))
                {
                    if (!this.validateSysObjFor(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as for");
                        return false;
                    }
                }
                else if (this.getSysObjType(obj).Equals("if"))
                {
                    if (!this.validateSysObjIf(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as if");
                        return false;
                    }
                }
                else if (this.getSysObjType(obj).Equals("return"))
                {
                    if (!this.validateSysObjReturn(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as return");
                        return false;
                    }
                }
                else if (this.getSysObjType(obj).Equals("call"))
                {
                    if (!this.validateSysObjCall(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as call");
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            return true;
        }

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
        public bool validateSysObjFunc(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("func")) && this.validateProperties(obj, new string[] { "sys", "name", "args", "vars", "ret", "lines" }))
            {
                if (!this.validateSysObjVal(obj.ret))
                {
                    this.wr("validateSysObjFunc: Error: could not validate obj as val");
                    return false;
                }

                for (var i = 0; i < obj.vars.Count; i++)
                {
                    if (!this.validateSysObjVar(obj.vars[i]))
                    {
                        this.wr("validateSysObjFunc: Error: could not validate obj as var");
                        return false;
                    }
                }

                for (var i = 0; i < obj.args.Count; i++)
                {
                    if (!this.validateSysObjArg(obj.args[i]))
                    {
                        this.wr("validateSysObjFunc: Error: could not validate obj as arg");
                        return false;
                    }
                }

                for (var i = 0; i < obj.lines.Count; i++)
                {
                    if (!this.validateSysObjFuncLine(obj.lines[i]))
                    {
                        this.wr("validateSysObjFunc: Error: could not validate obj as func line: " + i);
                        return false;
                    }
                }

                return true;
            }
            return false;
        }

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
        public bool validateSysObjAsgn(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("asgn")) && this.validateProperties(obj, new string[] { "sys", "left", "op", "right" }))
            {
                JsonObjSysBase tobj = null;
                if (obj.left != null)
                {
                    tobj = obj.left;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate left obj as ref");
                            return false;
                        }
                    }
                    else
                    {
                        this.wr("validateSysObjAsgn: Error: could not validate left obj as ref");
                        return false;
                    }
                }
                else
                {
                    this.wr("validateSysObjAsgn: Error: could not validate left obj as ref, null");
                    return false;
                }

                if (obj.op != null)
                {
                    tobj = obj.op;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("op"))
                    {
                        if (!this.validateSysObjOp(tobj))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate obj as op");
                            return false;
                        }
                        else if (!tobj.type.Equals("asgn"))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate obj as op type");
                            return false;
                        }
                        else if (!tobj.v.Equals("="))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate obj as op code");
                            return false;
                        }
                    }
                    else
                    {
                        this.wr("validateSysObjAsgn: Error: could not validate obj as op");
                        return false;
                    }
                }
                else
                {
                    this.wr("validateSysObjAsgn: Error: could not validate obj as op, null");
                    return false;
                }

                if (obj.right != null)
                {
                    tobj = obj.right;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate right obj as ref");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate right obj as const");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate right obj as exp");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate right obj as bex");
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            this.wr("validateSysObjAsgn: Error: could not validate right obj as call");
                            return false;
                        }
                    }
                    else
                    {
                        this.wr("validateSysObjAsgn: Error: could not validate obj as right");
                        return false;
                    }
                }
                else
                {
                    this.wr("validateSysObjAsgn: Error: could not validate obj as right, null");
                    return false;
                }

                return true;
            }
            return false;
        }

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
        public bool validateSysObjBex(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("bex")) && this.validateProperties(obj, new string[] { "sys", "left", "op", "right" }))
            {
                JsonObjSysBase tobj = null;
                if (obj.left != null)
                {
                    tobj = obj.left;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }

                if (obj.op != null)
                {
                    tobj = obj.op;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("op"))
                    {
                        if (!this.validateSysObjOp(tobj))
                        {
                            return false;
                        }
                        else if (!tobj.type.Equals("bex"))
                        {
                            return false;
                        }
                        else if (!(tobj.v.Equals("==") || tobj.v.Equals("!=") || tobj.v.Equals("<") || tobj.v.Equals(">") || tobj.v.Equals("<=") || tobj.v.Equals(">=")))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }

                if (obj.right != null)
                {
                    tobj = obj.right;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }

                return true;
            }
            return false;
        }

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
        public bool validateSysObjExp(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("exp")) && this.validateProperties(obj, new string[] { "sys", "left", "op", "right" }))
            {
                JsonObjSysBase tobj = null;
                if (obj.left != null)
                {
                    tobj = obj.left;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }

                if (obj.op != null)
                {
                    tobj = obj.op;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("op"))
                    {
                        if (!this.validateSysObjOp(tobj))
                        {
                            return false;
                        }
                        else if (!tobj.type.Equals("exp"))
                        {
                            return false;
                        }
                        else if (!(tobj.v.Equals("+") || tobj.v.Equals("-") || tobj.v.Equals("/") || tobj.v.Equals("*")))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }

                if (obj.right != null)
                {
                    tobj = obj.right;
                    if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("exp"))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("bex"))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            return false;
                        }
                    }
                    else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("call"))
                    {
                        if (!this.validateSysObjCall(tobj))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }

                return true;
            }
            return false;
        }

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
        public bool validateSysObjCall(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("call")) && this.validateProperties(obj, new string[] { "sys", "name", "args" }))
            {
                if (obj.args != null)
                {
                    for (int i = 0; i < obj.args.Count; i++)
                    {
                        JsonObjSysBase tobj = obj.args[i];
                        //this.wr("validateSysObjCall: found " + tobj.sys + " at index " + i + ", " + tobj.val.type);
                        if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("ref"))
                        {
                            if (!this.validateSysObjRef(tobj))
                            {
                                //this.wr("validateSysObjCall: Error: could not validate ref");
                                return false;
                            }
                        }
                        else if (this.isSysObj(tobj) && this.getSysObjType(tobj).Equals("const"))
                        {
                            //this.wr("validateSysObjCall: Error: could not validate const");
                            if (!this.validateSysObjConst(tobj))
                            {
                                return false;
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

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
        public bool validateSysObjOp(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("op")) && this.validateProperties(obj, new string[] { "sys", "type", "v" }))
            {
                if (!(obj.type.Equals("asgn") || obj.type.Equals("bex") || obj.type.Equals("exp")))
                {
                    return false;
                }
                return true;
            }
            return false;
        }

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
        public bool validateSysObjArray(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("array")) && this.validateProperties(obj, new string[] { "sys", "name", "len", "val" }))
            {
                if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val))
                {
                    return false;
                }
                return true;
            }
            return false;
        }

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
        public bool validateSysObjConst(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("const")) && this.validateProperties(obj, new string[] { "sys", "val" }))
            {
                if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val))
                {
                    return false;
                }
                return true;
            }
            return false;
        }

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
        public bool validateSysObjVar(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("var")) && this.validateProperties(obj, new string[] { "sys", "name", "val" }))
            {
                if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val))
                {
                    return false;
                }
                return true;
            }
            return false;
        }

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
        public bool validateSysObjArg(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("arg")) && this.validateProperties(obj, new string[] { "sys", "name", "val" }))
            {
                if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val))
                {
                    return false;
                }
                return true;
            }
            return false;
        }

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
             },
             {
                "sys": "val",
                "type": "int | float | string | bool & type of string",
                "va": "some valid array"
             }
          -!>
         */
        public bool validateSysObjVal(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            //this.wr("validateSysObjVal: type: 000: " + obj.type + ", " + obj.v);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("val")) && this.validateProperties(obj, new string[] { "sys", "type", "v" }))
            {
                //this.wr("validateSysObjVal: type");
                if (!(obj.type.Equals("int") || obj.type.Equals("float") || obj.type.Equals("string") || obj.type.Equals("bool") || obj.type.Equals("array")))
                {
                    //this.wr("validateSysObjVal: type: AAA");
                    return false;
                }
                //this.wr("validateSysObjVal: type: BBB");         
                return true;
            }

            //this.wr("validateSysObjVal: type: CCC");      
            return false;
        }

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
        public bool validateSysObjRef(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            //this.wr("validateSysObjRef: Found sys: " + sysType);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("ref")) && this.validateProperties(obj, new string[] { "sys", "val" }))
            {
                if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val))
                {
                    //this.wr("validateSysObjRef: Error: could not validate val object: ");// + this.validateSysObjVal(obj) + ", " + this.isSysObjVal(obj.val));
                    return false;
                }
                return true;
            }
            return false;
        }

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
        public bool validateSysObjReturn(JsonObjSysBase obj)
        {
            string sysType = this.getSysObjType(obj);
            if (this.isSysObj(obj) && (!Utils.IsStringEmpty(sysType) && sysType.Equals("return")) && this.validateProperties(obj, new string[] { "sys", "val" }))
            {
                if (!this.isSysObjVal(obj.val) || !this.validateSysObjVal(obj.val))
                {
                    return false;
                }
                return true;
            }
            return false;
        }

        /**
        * Name: validateProperties
        * Desc: Validates if the given object has each of the array elements soecified in req.
        * Arg1: obj(sys obj to check)
        * Arg2: req(array of attribute name to check for)
        * Returns: {false | true}
         */
        public bool validateProperties(JsonObjSysBase obj, string[] req)
        {
            FieldInfo fld = null;
            for (int i = 0; i < req.Length; i++)
            {
                try
                {
                    fld = obj.GetType().GetField(req[i]);
                    if (fld == null)
                    {
                        this.wr("Field '" + req[i] + "' is null");
                        return false;
                    }

                }
                catch (Exception e)
                {
                    Logger.wrlErr(e.ToString());
                    return false;
                }
            }
            return true;
        }

        /////////////////////////PROCESS METHODS
        /**
        * Name: processRef
        * Desc: Processes a class var or func var or arg reference string.
        * Arg1: objRef(string ref encoding)
        * Arg2: func(func obj, sys=func)
        * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
         */
        public JsonObjSysBase processRef(JsonObjSysBase objRef, JsonObjSysBase func)
        {
            string path = null;
            string[] vls = null;
            JsonObjSysBase fnd = null;
            JsonObjSysBase prog = this.program;

            if (!this.isSysObjRef(objRef))
            {
                this.wr("processRef: Error: argument objRef is not a ref obj");
                return null;
            }
            else if (!this.isSysObjFunc(func))
            {
                this.wr("processRef: Error: argument objRef is not a func obj");
                return null;
            }

            //this.wr("OBJ REF");
            //this.wrObj(objRef);

            path = (objRef.val.v + "");
            //this.wr("===============================================Found path: " + path);
            vls = path.Split(".");

            bool inDynRef = false;
            List<string> nvls = new List<string>();
            string tt = null;
            int obrk = 0;
            for (var k = 0; k < vls.Length; k++)
            {
                if (inDynRef && vls[k].IndexOf("]") != -1)
                {
                    obrk--;
                    for (int i = vls[k].IndexOf("]") + 1; i < vls[k].Length; i++)
                    {
                        if (vls[k].ToCharArray()[i] == ']')
                        {
                            obrk--;
                        }
                    }

                    //this.wr("___________________________________:NewBracket: " + obrk); 
                    tt += "." + vls[k];
                    if (obrk == 0)
                    {
                        inDynRef = false;
                        nvls.Add(tt);
                    }
                }
                else if (!inDynRef && vls[k].IndexOf("[") != -1)
                {
                    obrk = 1;
                    inDynRef = true;
                    tt = vls[k];
                }
                else if (inDynRef)
                {
                    if (vls[k].IndexOf("[") != -1)
                    {
                        obrk++;
                        //this.wr("___________________________________:NewBracket: " + obrk);            
                    }
                    tt += "." + vls[k];
                }
                else
                {
                    if (vls[k] != null)
                    {
                        nvls.Add(vls[k]);
                    }
                }
            }

            vls = new string[nvls.Count];
            for (var k = 0; k < nvls.Count; k++)
            {
                if (nvls[k] != null)
                {
                    vls[k] = nvls[k];
                }
            }

            bool foundSource = false;
            bool isFunc = false;
            bool foundType = false;
            bool isVars = false;
            bool foundName = false;
            string name = null;
            JsonObjSysBase itm = null;
            bool foundIndex = false;
            int idx = -1;
            string type = null;

            //this.wr("===============================================Found entries: " + vls.length);
            for (int k = 0; k < vls.Length; k++)
            {
                String c = vls[k];
                //this.wr("===============================================Found entry: " + k + ", " + vls[k]);      

                if (!foundSource)
                {
                    //program/class         
                    if (c != null && c.Equals("#"))
                    {
                        isFunc = false;
                        foundSource = true;
                    }
                    else if (c != null && c.Equals("$"))
                    {
                        isFunc = true;
                        foundSource = true;
                    }
                    else
                    {
                        this.wr("processRef: Error: could not find correct the ref, for source, " + c);
                    }
                }
                else if (!foundType)
                {
                    //program/class
                    if (!isFunc)
                    {
                        if (c != null && c.Equals("vars"))
                        {
                            isVars = true;
                            foundType = true;
                        }
                        else
                        {
                            this.wr("processRef: Error: could not find, for type, " + c + ", for source isFunc = " + isFunc);
                        }
                        //function
                    }
                    else
                    {
                        if (c != null && c.Equals("vars"))
                        {
                            isVars = true;
                            foundType = true;
                        }
                        else if (c != null && c.Equals("args"))
                        {
                            isVars = false;
                            foundType = true;
                        }
                        else
                        {
                            this.wr("processRef: Error: could not find, for type, " + c + ", for source isFunc = " + isFunc);
                        }
                    }
                }
                else if (!foundName)
                {
                    //program/class
                    name = c;
                    JsonObjSysBase tmp = null;
                    //lookup use of string var here
                    if (c.IndexOf("[") == 0)
                    {
                        string nc = c.Substring(1, c.Length - 2);

                        tmp = new JsonObjSysBase();
                        tmp.sys = "ref";
                        tmp.val = new JsonObjSysBase();
                        tmp.val.sys = "ref";
                        tmp.val.v = nc;

                        tmp = processRef(tmp, func);
                        if (tmp.val.type.Equals("string"))
                        {
                            name = toStr(tmp.val.v + "");
                        }
                        else
                        {
                            this.wr("processRef: Error: could not lookup object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                        }
                    }

                    //this.wr("processRef: looking for name: " + name);
                    if (!isFunc)
                    {
                        //class find name            
                        if (isVars)
                        {
                            fnd = this.findVar(name, prog);
                        }
                        else
                        {
                            this.wr("processRef: Error: could not find, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                        }
                        //function
                    }
                    else
                    {
                        //function find name
                        if (isVars)
                        {
                            fnd = this.findVar(name, func);
                        }
                        else
                        {
                            fnd = this.findArg(name, func);
                        }
                    }

                    if (fnd != null)
                    {
                        type = fnd.val.type;
                    }
                    else
                    {
                        this.wr("processRef: Error: could not find an object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                    }
                }
                else if (!foundIndex)
                {
                    idx = toInt(c);
                    JsonObjSysBase tmp = null;
                    //lookup use of string var here
                    if (c.IndexOf("[") == 0)
                    {
                        string nc = c.Substring(1, c.Length - 2);

                        tmp = new JsonObjSysBase();
                        tmp.sys = "ref";
                        tmp.val = new JsonObjSysBase();
                        tmp.val.sys = "ref";
                        tmp.val.v = nc;

                        tmp = processRef(tmp, func);
                        if (tmp.val.type.Equals("int"))
                        {
                            idx = toInt(tmp.val.v + "");
                        }
                        else
                        {
                            this.wr("processRef: Error: could not lookup object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                        }
                    }

                    if (type.Equals("array"))
                    {
                        fnd = (JsonObjSysBase)((List<Object>)fnd.val.v)[idx];
                    }
                    else
                    {
                        this.wr("processRef: Error: index entry is only for vars/args of type array, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                    }
                }
            }
            return fnd;
        }

        //TODO
        public int toBoolInt(string v)
        {
            string vb = v + "";
            vb = vb.ToLower();
            if (vb.Equals("true"))
            {
                return 1;
            }
            else if (vb.Equals("1"))
            {
                return 1;
            }
            else if (vb.Equals("yes"))
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }

        //TODO
        public int toInt(string v)
        {
            return int.Parse(v);
        }

        //TODO
        public float toFloat(string v)
        {
            return float.Parse(v);
        }

        //TODO
        public string toStr(string v)
        {
            return (v + "");
        }

        //TODO
        public bool toBool(string v)
        {
            string vb = v + "";
            vb = vb.ToLower();
            if (vb.Equals("true"))
            {
                return true;
            }
            else if (vb.Equals("1"))
            {
                return true;
            }
            else if (vb.Equals("yes"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
        * Name: processIf
        * Desc: Processes an if statement. Returns the value of the bool if statement expression.
        * Arg1: objIf(if obj, sys=if)
        * Arg2: func(func obj, sys=func)
        * Returns: {null | (const obj, sys=const)}
         */
        public JsonObjSysBase processIf(JsonObjSysBase objIf, JsonObjSysBase func)
        {
            JsonObjSysBase left = null;
            JsonObjSysBase op = null;
            JsonObjSysBase right = null;
            List<JsonObjSysBase> thn = null;
            List<JsonObjSysBase> els = null;

            if (!this.isSysObjIf(objIf))
            {
                this.wr("processFor: Error: argument objIf is not an if obj");
            }
            else if (!this.isSysObjFunc(func))
            {
                this.wr("processFor: Error: argument func is not a func obj");
                return null;
            }

            left = objIf.left;
            op = objIf.op;
            right = objIf.right;
            thn = objIf.thn;
            els = objIf.els;

            //Logger.wrl("===============================ThnLineCount: " + thn.Count);
            //Logger.wrl("===============================ElsLineCount: " + els.Count);

            if (this.isSysObjConst(left))
            {
                //do nothing

            }
            else if (this.isSysObjRef(left))
            {
                left = this.processRef(left, func);

            }
            else if (this.isSysObjBex(left))
            {
                left = this.processBex(left, func);

            }
            else if (this.isSysObjExp(left))
            {
                left = this.processExp(left, func);

            }
            else if (this.isSysObjCall(left))
            {
                left = this.processCall(left, func);

            }
            else
            {
                this.wr("processBex: Error: argument left must be a ref obj");
                return null;
            }

            if (left == null)
            {
                this.wr("processBex: Error: error processing left");
                return null;
            }

            if (this.isSysObjConst(right))
            {
                //do nothing

            }
            else if (this.isSysObjRef(right))
            {
                right = this.processRef(right, func);

            }
            else if (this.isSysObjBex(right))
            {
                right = this.processBex(right, func);

            }
            else if (this.isSysObjExp(right))
            {
                right = this.processExp(right, func);

            }
            else if (this.isSysObjCall(right))
            {
                right = this.processCall(right, func);

            }
            else
            {
                this.wr("processBex: Error: argument right is an unknown obj: " + this.getSysObjType(right));
                return null;
            }

            if (right == null)
            {
                this.wr("processBex: Error: error processing right");
                return null;
            }

            if (left.val.type.Equals(right.val.type))
            {
                JsonObjSysBase ret = new JsonObjSysBase("val");
                ret.type = "bool";
                ret.v = null;

                JsonObjSysBase ret2 = new JsonObjSysBase("const");
                JsonObjSysBase ret3 = null;

                if (op.v.Equals("=="))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") == int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") == float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") == this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Equals((string)right.val.v))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals("!="))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") != int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") != float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") != this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (!((string)left.val.v).Equals((string)right.val.v))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals("<"))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") < int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") < float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") < this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Length < ((string)right.val.v).Length)
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals(">"))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") > int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") > float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") > this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Length > ((string)right.val.v).Length)
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals("<="))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") <= int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") <= float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") <= this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Length <= ((string)right.val.v).Length)
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals(">="))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") >= int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") >= float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") >= this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Length >= ((string)right.val.v).Length)
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else
                {
                    this.wr("processBex: Error: unknown operator: " + op.v);
                    return null;
                }

                //Logger.wrl("===============================Ret.v: " + ret.v + " ToBool: " + this.toBool(ret.v));

                if (this.toBool((ret.v + "")) == true)
                {
                    //run thn lines
                    //Logger.wrl("===============================Running then lines");
                    ret3 = this.processIfForLines(thn, func);
                }
                else
                {
                    //run els lines
                    //Logger.wrl("===============================Running els lines");
                    ret3 = this.processIfForLines(els, func);
                }

                ret2.val = ret;
                ret = ret2;
                this.lastIfReturn = ret;

                if (this.isSysObjReturn(ret3))
                {
                    return ret3;
                }
                else
                {
                    return ret;
                }
            }
            else
            {
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
        public JsonObjSysBase processIfForLines(List<JsonObjSysBase> objLines, JsonObjSysBase func)
        {
            if (objLines != null && this.isArray(objLines) && objLines.Count > 0)
            {
                int j = 0;
                int len = objLines.Count;
                JsonObjSysBase ret = null;
                JsonObjSysBase line = null;

                for (j = 0; j < len; j++)
                {
                    line = objLines[j];

                    //support comments
                    if (line.active == false)
                    {
                        continue;
                    }

                    if (this.isSysObjAsgn(line))
                    {
                        ret = this.processAsgn(line, func);

                    }
                    else if (this.isSysObjCall(line))
                    {
                        ret = this.processCall(line, func);

                    }
                    else if (this.isSysObjFor(line))
                    {
                        ret = this.processFor(line, func);

                    }
                    else if (this.isSysObjIf(line))
                    {
                        ret = this.processIf(line, func);

                    }
                    else if (this.isSysObjReturn(line))
                    {
                        return line;
                    }

                    if (ret == null)
                    {
                        this.wr("processIfForLines: Error: processing line returned null: " + j);
                        return null;
                    }
                }
                return ret;
            }
            else
            {
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

        /**
        * Name: processFor
        * Desc: Processes a for loop. Returns the last loop iteration value.
        * Arg1: objFor(for obj, sys=for)
        * Arg2: func(func obj, sys=func)
        * Returns: {null | (const obj, sys=const) | (return obj, sys=return)}
         */
        public JsonObjSysBase processFor(JsonObjSysBase objFor, JsonObjSysBase func)
        {
            JsonObjSysBase start = null;
            JsonObjSysBase stop = null;
            JsonObjSysBase inc = null;

            if (!this.isSysObjFor(objFor))
            {
                this.wr("processFor: Error: argument objRef is not a for obj");
                return null;
            }
            else if (!this.isSysObjFunc(func))
            {
                this.wr("processFor: Error: argument func is not a func obj");
                return null;
            }

            start = objFor.start;
            if (this.isSysObjConst(start))
            {
                //do nothing

            }
            else if (this.isSysObjRef(start))
            {
                start = this.processRef(start, func);

            }
            else if (this.isSysObjExp(start))
            {
                start = this.processExp(start, func);

            }
            else if (this.isSysObjBex(start))
            {
                start = this.processBex(start, func);

            }
            else if (this.isSysObjCall(start))
            {
                start = this.processCall(start, func);

            }
            else
            {
                this.wr("processFor: Error: argument start unsuppoorted type: " + start.sys);
                return null;
            }

            if (start == null)
            {
                this.wr("processFor: Error: argument start is null");
                return null;
            }

            stop = objFor.stop;
            if (this.isSysObjConst(start))
            {
                //do nothing

            }
            else if (this.isSysObjRef(stop))
            {
                stop = this.processRef(stop, func);

            }
            else if (this.isSysObjExp(stop))
            {
                stop = this.processExp(stop, func);

            }
            else if (this.isSysObjBex(stop))
            {
                stop = this.processBex(stop, func);

            }
            else if (this.isSysObjCall(stop))
            {
                stop = this.processCall(stop, func);

            }
            else
            {
                this.wr("processFor: Error: argument stop unsuppoorted type: " + stop.sys);
                return null;
            }

            if (stop == null)
            {
                this.wr("processFor: Error: argument stop is null");
                return null;
            }

            inc = objFor.inc;
            if (this.isSysObjConst(inc))
            {
                //do nothing

            }
            else if (this.isSysObjRef(inc))
            {
                inc = this.processRef(inc, func);

            }
            else if (this.isSysObjExp(inc))
            {
                inc = this.processExp(inc, func);

            }
            else if (this.isSysObjBex(inc))
            {
                inc = this.processBex(inc, func);

            }
            else if (this.isSysObjCall(inc))
            {
                inc = this.processCall(inc, func);

            }
            else
            {
                this.wr("processFor: Error: argument inc unsuppoorted type: " + inc.sys);
                return null;
            }

            if (inc == null)
            {
                this.wr("processFor: Error: argument inc is null");
                return null;
            }

            if (!start.val.type.Equals("int"))
            {
                this.wr("processFor: Error: argument start unsuppoorted type: " + start.sys);
                return null;

            }
            else if (!stop.val.type.Equals("int"))
            {
                this.wr("processFor: Error: argument stop unsuppoorted type: " + stop.sys);
                return null;

            }
            else if (!inc.val.type.Equals("int"))
            {
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
            int incAmt = int.Parse(inc.val.v + "");
            int lenAmt = int.Parse(stop.val.v + "");
            int startAmt = int.Parse(start.val.v + "");
            for (i = startAmt; i < lenAmt; i += incAmt)
            {
                ret3 = this.processIfForLines(objFor.lines, func);
                if (ret3 == null)
                {
                    this.wr("processFor: Error: process loop iteration " + i + " returned a null value.");
                    return null;
                }
                else if (this.isSysObjReturn(ret3))
                {
                    return ret3;
                }
                else
                {
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
        public JsonObjSysBase processAsgn(JsonObjSysBase objAsgn, JsonObjSysBase func)
        {
            JsonObjSysBase left = null;
            JsonObjSysBase op = null;
            JsonObjSysBase right = null;

            if (!this.isSysObjAsgn(objAsgn))
            {
                this.wr("processAsgn: Error: argument objRef is not a asgn obj");
                return null;

            }
            else if (!this.isSysObjFunc(func))
            {
                this.wr("processAsgn: Error: argument func is not a func obj");
                return null;
            }

            left = objAsgn.left;
            op = objAsgn.op;
            right = objAsgn.right;

            left = this.processRef(left, func);
            if (left == null)
            {
                this.wr("processAsgn: Error: error processing left");
                return null;
            }

            if (this.isSysObjConst(right))
            {
                //do nothing      
            }
            else if (this.isSysObjRef(right))
            {
                right = this.processRef(right, func);

            }
            else if (this.isSysObjBex(right))
            {
                right = this.processBex(right, func);

            }
            else if (this.isSysObjExp(right))
            {
                right = this.processExp(right, func);

            }
            else if (this.isSysObjCall(right))
            {
                right = this.processCall(right, func);

            }
            else
            {
                this.wr("processAsgn: Error: argument right is an unknown obj: " + this.getSysObjType(right));
                return null;
            }

            if (right == null)
            {
                this.wr("processAsgn: Error: error processing right");
                return null;
            }

            if (left.val.type.Equals(right.val.type))
            {
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
            }
            else
            {
                this.wr("processAsgn: Error: type mismatch: " + left.val.type + " - " + right.val.type);
                return null;
            }
        }

        /**
        * Name: processBex
        * Desc: Processes a bool expression. Returns bool result of the expression.
        * Arg1: objBex(bex obj, sys=bex)
        * Arg2: func(func obj, sys=func)
        * Returns: {null | (const obj, sys=const)}
         */
        public JsonObjSysBase processBex(JsonObjSysBase objBex, JsonObjSysBase func)
        {
            JsonObjSysBase left = null;
            JsonObjSysBase op = null;
            JsonObjSysBase right = null;

            if (!this.isSysObjBex(objBex))
            {
                this.wr("processBex: Error: argument objRef is not a asgn obj");
                return null;

            }
            else if (!this.isSysObjFunc(func))
            {
                this.wr("processBex: Error: argument func is not a func obj");
                return null;
            }

            left = objBex.left;
            op = objBex.op;
            right = objBex.right;

            if (this.isSysObjConst(left))
            {
                //do nothing

            }
            else if (this.isSysObjRef(left))
            {
                left = this.processRef(left, func);

            }
            else if (this.isSysObjBex(left))
            {
                left = this.processBex(left, func);

            }
            else if (this.isSysObjExp(left))
            {
                left = this.processExp(left, func);

            }
            else if (this.isSysObjCall(left))
            {
                left = this.processCall(left, func);

            }
            else
            {
                this.wr("processBex: Error: argument left must be a ref obj");
                return null;
            }

            if (left == null)
            {
                this.wr("processBex: Error: error processing left");
                return null;
            }

            if (this.isSysObjConst(right))
            {
                //do nothing

            }
            else if (this.isSysObjRef(right))
            {
                right = this.processRef(right, func);

            }
            else if (this.isSysObjBex(right))
            {
                right = this.processBex(right, func);

            }
            else if (this.isSysObjExp(right))
            {
                right = this.processExp(right, func);

            }
            else if (this.isSysObjCall(right))
            {
                right = this.processCall(right, func);

            }
            else
            {
                this.wr("processBex: Error: argument right is an unknown obj: " + this.getSysObjType(right));
                return null;
            }

            if (right == null)
            {
                this.wr("processBex: Error: error processing right");
                return null;
            }

            if (left.val.type.Equals(right.val.type))
            {
                JsonObjSysBase ret = new JsonObjSysBase("val");
                ret.type = "bool";
                ret.v = null;

                JsonObjSysBase ret2 = new JsonObjSysBase("const");

                if (op.v.Equals("=="))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") == int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") == float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") == this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Equals((string)right.val.v))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals("!="))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") != int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") != float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") != this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (!((string)left.val.v).Equals((string)right.val.v))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals("<"))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") < int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") < float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") < this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Length < ((string)right.val.v).Length)
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals(">"))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") > int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") > float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") > this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Length > ((string)right.val.v).Length)
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals("<="))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") <= int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") <= float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") <= this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Length <= ((string)right.val.v).Length)
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else if (op.v.Equals(">="))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(left.val.v + "") >= int.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(left.val.v + "") >= float.Parse(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(left.val.v + "") >= this.toBoolInt(right.val.v + ""))
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                    else if (left.val.type.Equals("string"))
                    {
                        if (((string)left.val.v).Length >= ((string)right.val.v).Length)
                        {
                            ret.v = "true";
                        }
                        else
                        {
                            ret.v = "false";
                        }
                    }
                }
                else
                {
                    this.wr("processBex: Error: unknown operator: " + op.v);
                    return null;
                }

                ret2.val = ret;
                ret = ret2;
                this.lastBexReturn = ret;
                return ret;
            }
            else
            {
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
        public JsonObjSysBase processFunc(JsonObjSysBase objFunc)
        {
            if (!this.isSysObjFunc(objFunc))
            {
                this.wr("processFunc: Error: argument objRef is not a call func");
                return null;
            }

            JsonObjSysBase ret3 = null;
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
        public JsonObjSysBase processCall(JsonObjSysBase objCall, JsonObjSysBase func)
        {
            string name = null;
            List<JsonObjSysBase> args = null;
            JsonObjSysBase funcDef = null;
            List<JsonObjSysBase> funcArgs = null;
            JsonObjSysBase tmpArg = null;
            JsonObjSysBase ret = null;
            bool sysFunc = false;

            if (!this.isSysObjCall(objCall))
            {
                this.wr("processCall: Error: argument objRef is not a call obj");
                return null;

            }
            else if (!this.isSysObjFunc(func))
            {
                this.wr("processCall: Error: argument func is not a func obj");
                return null;
            }

            name = objCall.name;
            args = this.cloneJsonObjList(objCall.args);
            funcDef = this.findFunc(name);
            if (funcDef != null)
            {
                funcArgs = funcDef.args;

            }
            else
            {
                sysFunc = true;
                funcDef = this.findSysFunc(name);
                if (funcDef != null)
                {
                    funcArgs = funcDef.args;
                }
                else
                {
                    this.wr("processCall: Error: no function found with name: " + name);
                    return null;
                }
            }

            if (funcArgs != null)
            {
                if (args.Count == funcArgs.Count)
                {
                    for (var i = 0; i < args.Count; i++)
                    {
                        if (!args[i].val.type.Equals(funcArgs[i].val.type))
                        {
                            this.wr("processCall: Error: type mismatch at argument index, " + i + ", func arg def: " + funcArgs[i].val.type + ", call arg: " + args[i].val.type);
                            return null;
                        }

                        if (this.isSysObjRef(args[i]))
                        {
                            tmpArg = null;
                            tmpArg = this.processRef(args[i], func);
                            if (tmpArg != null)
                            {
                                args[i].val.v = tmpArg.val.v;
                                args[i].name = funcArgs[i].name;
                            }
                            else
                            {
                                this.wr("processCall: Error: could not process argument index, " + i + ", with path: " + args[i].val.v);
                                return null;
                            }
                        }
                    }

                    if (sysFunc)
                    {
                        bool err = false;
                        JsonObjSysBase lret = null;
                        try
                        {
                            string lname = funcDef.fname;
                            if (lname.Equals("sysJob1"))
                            {
                                lret = sysJob1();

                            }
                            else if (lname.Equals("sysJob2"))
                            {
                                lret = sysJob2();

                            }
                            else if (lname.Equals("sysJob3"))
                            {
                                lret = sysJob3();

                            }
                            else if (lname.Equals("sysGetLastAsgnValue"))
                            {
                                lret = lastAsgnValue;

                            }
                            else
                            {
                                if (this.systemFunctionHandler != null)
                                {
                                    lret = this.systemFunctionHandler.call(funcDef.fname, args, this);
                                    err = false;
                                }
                                else
                                {
                                    lret = null;
                                    err = true;
                                }
                            }
                        }
                        catch (Exception e)
                        {
                            lret = null;
                            err = true;
                        }

                        if (lret == null)
                        {
                            JsonObjSysBase ret1 = new JsonObjSysBase("val");
                            ret1.type = "bool";
                            ret1.v = err + "";

                            JsonObjSysBase ret2 = new JsonObjSysBase("const");
                            ret2.val = ret1;
                            ret1 = ret2;
                            return ret1;
                        }
                        else
                        {
                            return lret;
                        }
                    }
                    else
                    {
                        //backup default args
                        funcDef.args_def = this.cloneJsonObjList(funcDef.args);
                        funcDef.args = args;

                        //backup default ret
                        funcDef.ret_def = this.cloneJsonObj(funcDef.ret);
                        ret = this.processFunc(funcDef);

                        //this.wr("RET_DEF");
                        //this.wrObj(funcDef.ret_def);
                        if (!ret.val.type.Equals(funcDef.ret_def.type))
                        {
                            this.wr("processCall: Error: function return type mismatch, return type " + ret.val.type + " expected " + funcDef.ret_def.type);
                            return null;
                        }

                        //restore args and ret
                        funcDef.args = this.cloneJsonObjList(funcDef.args_def);
                        funcDef.ret = this.cloneJsonObj(funcDef.ret_def);

                        return ret;
                    }
                }
                else
                {
                    this.wr("processCall: Error: function argument length mismatch, func arg def: " + funcArgs.Count + ", call arg: " + args.Count);
                    return null;
                }
            }
            else
            {
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
        public JsonObjSysBase processExp(JsonObjSysBase objExp, JsonObjSysBase func)
        {
            JsonObjSysBase left = null;
            JsonObjSysBase op = null;
            JsonObjSysBase right = null;

            if (!this.isSysObjExp(objExp))
            {
                this.wr("processExp: Error: argument objRef is not a asgn obj");
                return null;

            }
            else if (!this.isSysObjFunc(func))
            {
                this.wr("processExp: Error: argument func is not a func obj");
                return null;
            }

            left = objExp.left;
            op = objExp.op;
            right = objExp.right;

            if (this.isSysObjConst(left))
            {
                //do nothing

            }
            else if (this.isSysObjRef(left))
            {
                left = this.processRef(left, func);

            }
            else if (this.isSysObjBex(left))
            {
                left = this.processBex(left, func);

            }
            else if (this.isSysObjExp(left))
            {
                left = this.processExp(left, func);

            }
            else if (this.isSysObjCall(left))
            {
                left = this.processCall(left, func);

            }
            else
            {
                this.wr("processExp: Error: argument left must be a ref obj");
                return null;
            }

            if (left == null)
            {
                this.wr("processExp: Error: error processing left");
                return null;
            }

            if (this.isSysObjConst(right))
            {
                //do nothing

            }
            else if (this.isSysObjRef(right))
            {
                right = this.processRef(right, func);

            }
            else if (this.isSysObjBex(right))
            {
                right = this.processBex(right, func);

            }
            else if (this.isSysObjExp(right))
            {
                right = this.processExp(right, func);

            }
            else if (this.isSysObjCall(right))
            {
                right = this.processCall(right, func);

            }
            else
            {
                this.wr("processExp: Error: argument right is an unknown obj: " + this.getSysObjType(right));
                return null;
            }

            if (right == null)
            {
                this.wr("processExp: Error: error processing right");
                return null;
            }

            if (left.val.type.Equals(right.val.type) && (left.val.type.Equals("int") || left.val.type.Equals("float") || left.val.type.Equals("bool")))
            {
                var ret = new JsonObjSysBase("val");
                ret.type = left.val.type;
                ret.v = null;

                var ret2 = new JsonObjSysBase("const");
                ret2.val = ret;

                if (op.v.Equals("+"))
                {
                    if (left.val.type.Equals("int"))
                    {
                        ret.v = (int.Parse(left.val.v + "") + int.Parse(right.val.v + "")) + "";
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        ret.v = (float.Parse(left.val.v + "") + float.Parse(right.val.v + "")) + "";
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        ret.v = (this.toBoolInt(left.val.v + "") + this.toBoolInt(right.val.v + "")) + "";
                    }
                }
                else if (op.v.Equals("-"))
                {
                    if (left.val.type.Equals("int"))
                    {
                        ret.v = (int.Parse(left.val.v + "") - int.Parse(right.val.v + "")) + "";
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        ret.v = (float.Parse(left.val.v + "") - float.Parse(right.val.v + "")) + "";
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        ret.v = (this.toBoolInt(left.val.v + "") - this.toBoolInt(right.val.v + "")) + "";
                    }
                }
                else if (op.v.Equals("/"))
                {
                    if (left.val.type.Equals("int"))
                    {
                        if (int.Parse(right.val.v + "") == 0)
                        {
                            this.wr("processExp: Error: divide by zero error");
                            return null;
                        }
                        else
                        {
                            ret.v = (int.Parse(left.val.v + "") / int.Parse(right.val.v + "")) + "";
                        }
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        if (float.Parse(right.val.v + "") == 0)
                        {
                            this.wr("processExp: Error: divide by zero error");
                            return null;
                        }
                        else
                        {
                            ret.v = (float.Parse(left.val.v + "") / float.Parse(right.val.v + "")) + "";
                        }
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        if (this.toBoolInt(right.val.v + "") == 0)
                        {
                            this.wr("processExp: Error: divide by zero error");
                            return null;
                        }
                        else
                        {
                            ret.v = (this.toBoolInt(left.val.v + "") / this.toBoolInt(right.val.v + "")) + "";
                        }
                    }
                }
                else if (op.v.Equals("*"))
                {
                    if (left.val.type.Equals("int"))
                    {
                        ret.v = (int.Parse(left.val.v + "") * int.Parse(right.val.v + "")) + "";
                    }
                    else if (left.val.type.Equals("float"))
                    {
                        ret.v = (float.Parse(left.val.v + "") * float.Parse(right.val.v + "")) + "";
                    }
                    else if (left.val.type.Equals("bool"))
                    {
                        ret.v = (this.toBoolInt(left.val.v + "") * this.toBoolInt(right.val.v + "")) + "";
                    }
                }
                else
                {
                    this.wr("processExp: Error: unknown operator: " + op.v);
                    return null;
                }

                if (left.val.type.Equals("int"))
                {
                    ret.v = int.Parse(ret.v + "") + "";
                }
                else if (left.val.type.Equals("float"))
                {
                    ret.v = float.Parse(ret.v + "") + "";
                }
                else if (left.val.type.Equals("bool"))
                {
                    ret.v = (this.toBool(ret.v + "")) + "";
                }

                ret = ret2;
                this.lastExpReturn = ret;
                return ret;
            }
            else
            {
                this.wr("processExp: Error: type mismatch: " + left.val.type + " - " + right.val.type);
                return null;
            }
        }

        /**
         * Name: hasReplDirectives Desc: A function to determine if the given string
         * has any replacement directives defined. Arg1: src(the JSON text to check)
         * Returns: {true | false}
         */
        public bool hasReplDirectives(String src)
        {
            if (src == null)
            {
                this.wr("hasReplDirectives: Error: argument src cannot be null.");
                return false;
            }

            if (src.IndexOf("&(repl::") == -1)
            {
                return false;
            }
            else
            {
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
        public string processReplDirectives(string[] keys, string[] values, string src)
        {
            if (keys == null)
            {
                this.wr("ReplDirectives: Error: argument keys cannot be null.");
                return null;
            }

            if (values == null)
            {
                this.wr("ReplDirectives: Error: argument values cannot be null.");
                return null;
            }

            if (values.Length != keys.Length)
            {
                this.wr("ReplDirectives: Error: argument keys and values must have the same length.");
                return null;
            }

            if (src == null)
            {
                this.wr("ReplDirectives: Error: argument src cannot be null.");
                return null;
            }

            string nsrc = this.toStr(src);
            for (int i = 0; i < keys.Length; i++)
            {
                string fnd = "&(repl::" + keys[i] + ")";
                nsrc = nsrc.Replace(fnd, values[i]);
            }

            return nsrc;
        }
    }
}
