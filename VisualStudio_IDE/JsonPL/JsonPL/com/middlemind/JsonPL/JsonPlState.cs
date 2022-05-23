using com.middlemind.JsonPL;
using com.middlemind.JsonPL.JsonObjs;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using System.Collections;
using System.Reflection;
using Newtonsoft.Json.Linq;
using com.middlemind.JsonPL.Loaders;
using System.Net;
using System.IO;
using System.Web;

/**
* JSON Programming Language
* EXEC JS C# PORT
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
        public int objId = -1;

        /**
         * 
         */
        public bool VERBOSE = true;

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
        public string lastProcessUrlFindPath = null;

        /**
         * Generic class constructor.
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
        * Arg1: args(an array of {arg} objects) 
        * Arg2: func(the {func} this system function is called from) 
        * Returns: const(a {const} bool object) 
        */
        public JsonObjSysBase sysWr(List<JsonObjSysBase> args, JsonObjSysBase func, string sep)
        {
            int len = args.Count;
            int i = 0;
            string s = "";

            if (sep == null || (sep != null && sep.Equals("")))
            {
                sep = null;
            }

            for (; i < len; i++)
            {
                if (this.isArray(args[i].val.v))
                {
                    this.sysWr(this.toArray(args[i].val.v), func, ", ");
                }
                else
                {
                    s += this.toStr(args[i].val.v);
                    if (sep != null)
                    {
                        if (i < len - 1)
                        {
                            s += sep;
                        }
                    }
                }
            }
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
        public JsonObjSysBase sysGetLastAsgnValue(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            return this.lastAsgnValue;
        }

        /**
        * Name: sysGetLastAsgnValue
        * Desc: A system level method to access the last exp return object.
        * Returns: {(const obj, sys=const)}
        */
        public JsonObjSysBase sysGetLastExpReturn(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            return this.lastExpReturn;
        }

        /**
        * Name: getConstBool 
        * Desc: A method to quickly access a constant bool value object. 
        * Returns: const(a {const} bool object)
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
         * Name: getConst
         * Desc: A method to quickly access a constant value object.
         * Arg1: type(a valid type string)
         * Arg2: val(a value object)
         * Returns: const(a {const} object)
         */
        public JsonObjSysBase getConst(string type, object val)
        {
            JsonObjSysBase ret = new JsonObjSysBase("val");
            ret.type = type;
            ret.v = val;

            JsonObjSysBase ret2 = new JsonObjSysBase("const");
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
        public JsonObjSysBase getRef(string type, object val)
        {
            JsonObjSysBase ret = new JsonObjSysBase("val");
            ret.type = type;
            ret.v = val;

            JsonObjSysBase ret2 = new JsonObjSysBase("ref");
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

        public string[] getPathAndUrlFromRef(string path)
        {
            //this.wr("getPathAndUrlFromRef: Receiving: " + path);
            if (this.isRefStringUrl(path))
            {
                //check for URL
                int urlStart = path.IndexOf("->(");
                bool hasUrl = false;

                string[] nvs = null;
                string nurl = null;
                string npath = null;
                if (urlStart != -1)
                {
                    nvs = path.Split("->(");
                    npath = nvs[0].Trim();
                    nurl = nvs[1].Substring(0, nvs[1].Length - 2).Trim();
                    hasUrl = true;
                    //this.wr("getPathAndUrlFromRef: Returning: " + nurl + ", " + npath);
                    return new string[] { nurl, npath };
                }
            }

            //this.wr("getPathAndUrlFromRef: Returning: null");
            return null;
        }

        /**
         * Name: sysJob1 
         * Desc: A system level job method used to demonstrate JCL.
         * Arg1: args(an array of {arg} objects) 
         * Arg2: func(the {func} this system function is called from) 
         * Returns: const(a {const} bool value)
         */
        public JsonObjSysBase sysJob1(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            this.wr("sysJob1");
            JsonObjSysBase ret = this.getConstBool();
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
        public JsonObjSysBase sysJob2(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            this.wr("sysJob2");
            JsonObjSysBase ret = this.getConstBool();
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
        public JsonObjSysBase sysJob3(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            this.wr("sysJob3");
            JsonObjSysBase ret = this.getConstBool();
            ret.val.v = "true";
            return ret;
        }

        /**
        * Name: runProgram 
        * Desc: Executes the current program and returns the result. 
        * Returns: ret(some {const}, {ref} object)
        */
        public JsonObjSysBase runProgram()
        {
            if (this.validateSysObjClass(this.program))
            {
                long start = System.DateTime.Now.Ticks;
                JsonObjSysBase callObj = this.program.call;
                string callFuncName = null;

                if (!this.isObject(callObj.name))
                {
                    callFuncName = this.toStr(callObj.name);
                }
                else
                {
                    if (this.isSysObjConst((JsonObjSysBase)callObj.name))
                    {
                        callFuncName = this.toStr(((JsonObjSysBase)callObj.name).val.v);
                    }
                    else if (this.isSysObjRef((JsonObjSysBase)callObj.name))
                    {
                        this.wr("runProgram: Error: cannot process call name {ref} objects at the class level.");
                        return null;
                    }
                    else
                    {
                        this.wr("runProgram: Error: cannot process unknown call name objects at the class level.");
                        return null;
                    }
                }

                this.wr("runProgram: Call: " + callFuncName);
                JsonObjSysBase callFunc = this.findFunc(callFuncName);

                JsonObjSysBase ret = null;
                ret = this.processCall(callObj, callFunc);
                this.lastProgramReturn = ret;

                this.wr("runProgram: Results: ");
                this.wrObj(ret);

                long duration = System.DateTime.Now.Ticks - start;
                TimeSpan ts = new TimeSpan(duration);
                this.wr("runProgram: Execution time: " + ts.Milliseconds / 1000.0 + "s");
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
        * Arg2: obj(a {func} object to search args for)
        * Returns: ret(null or {arg} object)
        */
        public JsonObjSysBase findArg(string name, JsonObjSysBase obj)
        {
            string str;
            JsonObjSysBase subj;
            for (int i = 0; i < obj.args.Count; i++)
            {
                subj = obj.args[i];
                str = this.toStr(subj.name);
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
        * Arg2: obj(a {func} or {class} object to search) 
        * Returns: ret(null, {val} or {arg} object)
        */
        public JsonObjSysBase findVar(string name, JsonObjSysBase obj)
        {
            string str;
            JsonObjSysBase subj;
            for (int i = 0; i < obj.vars.Count; i++)
            {
                subj = obj.vars[i];
                str = this.toStr(subj.name);
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
        * Returns: ret(null or {func} object)
        */
        public JsonObjSysBase findFunc(string name)
        {
            JsonObjSysBase prog = this.program;
            string str;
            JsonObjSysBase subj;
            for (int i = 0; i < prog.funcs.Count; i++)
            {
                subj = prog.funcs[i];
                str = this.toStr(subj.name);
                if (!Utils.IsStringEmpty(str) && str.Equals(name))
                {
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
        public JsonObjSysBase findSysFunc(string name)
        {
            JsonPlState prog = this;
            string str;
            JsonObjSysBase subj;
            List<JsonObjSysBase> sFuncs = prog.system["functions"];

            for (int i = 0; i < sFuncs.Count; i++)
            {
                subj = sFuncs[i];
                str = this.toStr(subj.name);
                if (!Utils.IsStringEmpty(str) && str.Equals(name))
                {
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
        public bool validateSysObjIf(JsonObjSysBase obj)
        {
            if (this.isSysObjIf(obj) && this.validateProperties(obj, new string[] { "sys", "left", "op", "right", "thn" }))
            {
                JsonObjSysBase tobj = null;
                if (obj.left != null)
                {
                    tobj = obj.left;
                    if (this.isSysObjRef(tobj))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as ref");
                            return false;
                        }
                    }
                    else if (this.isSysObjConst(tobj))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as const");
                            return false;
                        }
                    }
                    else if (this.isSysObjExp(tobj))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as exp");
                            return false;
                        }
                    }
                    else if (this.isSysObjBex(tobj))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            this.wr("validateSysObjFor: Error: could not validate left obj as bex");
                            return false;
                        }
                    }
                    else if (this.isSysObjCall(tobj))
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
                    if (this.isSysObjOp(tobj))
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
                    if (this.isSysObjRef(tobj))
                    {
                        if (!this.validateSysObjRef(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as ref");
                            return false;
                        }
                    }
                    else if (this.isSysObjConst(tobj))
                    {
                        if (!this.validateSysObjConst(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as const");
                            return false;
                        }
                    }
                    else if (this.isSysObjExp(tobj))
                    {
                        if (!this.validateSysObjExp(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as exp");
                            return false;
                        }
                    }
                    else if (this.isSysObjBex(tobj))
                    {
                        if (!this.validateSysObjBex(tobj))
                        {
                            this.wr("validateSysObjIf: Error: could not validate right obj as bex");
                            return false;
                        }
                    }
                    else if (this.isSysObjCall(tobj))
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
                    int len = tobjLst.Count;
                    for (int i = 0; i < len; i++)
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
                    int len = tobjLst.Count;
                    for (int i = 0; i < len; i++)
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
         * Name: isForEach
         * Desc: Determines if the given argument, obj, is a for each loop
         * Arg1: obj(the object to inspect)
         * Returns: ret(some bool, true or false)
         */
        public bool isForEach(JsonObjSysBase obj)
        {
            return (this.isSysObjFor(obj) && !this.isFullFor(obj));
        }

        /**
         * Name: isFullFor
         * Desc: Determines if the given argument, obj, is a full for loop
         * Arg1: obj(the object to inspect)
         * Returns: ret(some bool, true or false)
         */
        public bool isFullFor(JsonObjSysBase obj)
        {
            if (obj == null)
            {
                return false;
            }
            else if (this.isSysObjFor(obj) == true)
            {
                if (this.validateProperties(obj, new String[] { "sys", "start", "stop", "inc", "lines" }) == true)
                {
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
        public bool validateSysObjFor(JsonObjSysBase obj)
        {
            if (this.isSysObjFor(obj) && (this.validateProperties(obj, new string[] { "sys", "start", "stop", "inc", "lines" }) || this.validateProperties(obj, new string[] { "sys", "each", "lines" })))
            {
                JsonObjSysBase tobj = null;
                bool fullList = this.isFullFor(obj);

                if (fullList)
                {
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
                }
                else
                {
                    if (obj.each != null)
                    {
                        tobj = obj.each;
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
                        else
                        {
                            this.wr("validateSysObjFor: Error: could not validate obj as right");
                            return false;
                        }
                    }
                }

                for (int i = 0; i < obj.lines.Count; i++)
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
        public bool validateSysObjClass(JsonObjSysBase obj)
        {
            if (this.isSysObjClass(obj) && this.validateProperties(obj, new string[] { "sys", "name", "vars", "funcs", "ret", "call" }))
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

                for (int i = 0; i < obj.vars.Count; i++)
                {
                    if (!this.validateSysObjVar(obj.vars[i]))
                    {
                        this.wr("validateSysObjClass: Error: could not validate obj as var");
                        return false;
                    }
                }

                for (int i = 0; i < obj.funcs.Count; i++)
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
        * Desc: Validates if the given object is a valid function line object. 
        * Arg1: obj(an {asgn}, {for}, {if}, {return}, {call} object to check) 
        * Returns: ret(some bool, true or false) 
        * Struct:
        * [asgn | for | if | return | call]
        */
        public bool validateSysObjFuncLine(JsonObjSysBase obj)
        {
            if (this.isSysObjFuncLine(obj))
            {
                if (this.getSysObjType(obj).Equals("asgn"))
                {
                    if (!this.validateSysObjAsgn(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as asgn");
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
                else if (this.getSysObjType(obj).Equals("for"))
                {
                    if (!this.validateSysObjFor(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as for");
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
                else if (this.getSysObjType(obj).Equals("if"))
                {
                    if (!this.validateSysObjIf(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as if");
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
                else if (this.getSysObjType(obj).Equals("return"))
                {
                    if (!this.validateSysObjReturn(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as return");
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
                else if (this.getSysObjType(obj).Equals("call"))
                {
                    if (!this.validateSysObjCall(obj))
                    {
                        this.wr("validateSysObjFuncLine: Error: could not validate obj as call");
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
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
        public bool validateSysObjFunc(JsonObjSysBase obj)
        {
            if (this.isSysObjFunc(obj) && this.validateProperties(obj, new string[] { "sys", "name", "args", "vars", "ret", "lines" }))
            {
                if (!this.validateSysObjVal(obj.ret))
                {
                    this.wr("validateSysObjFunc: Error: could not validate obj as val");
                    return false;
                }

                for (int i = 0; i < obj.vars.Count; i++)
                {
                    if (!this.validateSysObjVar(obj.vars[i]))
                    {
                        this.wr("validateSysObjFunc: Error: could not validate obj as var");
                        return false;
                    }
                }

                for (int i = 0; i < obj.args.Count; i++)
                {
                    if (!this.validateSysObjArg(obj.args[i]))
                    {
                        this.wr("validateSysObjFunc: Error: could not validate obj as arg");
                        return false;
                    }
                }

                for (int i = 0; i < obj.lines.Count; i++)
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
        public bool validateSysObjAsgn(JsonObjSysBase obj)
        {
            if (this.isSysObjAsgn(obj) && this.validateProperties(obj, new string[] { "sys", "left", "op", "right" }))
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
        public bool validateSysObjBex(JsonObjSysBase obj)
        {
            if (this.isSysObjBex(obj) && this.validateProperties(obj, new string[] { "sys", "left", "op", "right" }))
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
        public bool validateSysObjExp(JsonObjSysBase obj)
        {
            if (this.isSysObjExp(obj) && this.validateProperties(obj, new string[] { "sys", "left", "op", "right" }))
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
        public bool validateSysObjCall(JsonObjSysBase obj)
        {
            if (this.isSysObjCall(obj) && this.validateProperties(obj, new string[] { "sys", "name", "args" }))
            {
                if (obj.name is JObject) {
                    obj.name = this.processLinkedTreeMap((JObject)obj.name);
                }

                if (obj.name != null)
                {
                    if (!this.isString(obj.name) && !this.isSysObjConst((JsonObjSysBase)obj.name) && !this.isSysObjRef((JsonObjSysBase)obj.name))
                    {
                        this.wr("validateSysObjCall: Error: name is of unknown object type");
                        return false;
                    }
                }

                if (obj.args != null)
                {
                    for (int i = 0; i < obj.args.Count; i++)
                    {
                        JsonObjSysBase tobj = obj.args[i];
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
                        else
                        {
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
        public bool validateSysObjOp(JsonObjSysBase obj)
        {
            if (this.isSysObjOp(obj) && this.validateProperties(obj, new string[] { "sys", "type", "v" }))
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
        public bool validateSysObjConst(JsonObjSysBase obj)
        {
            if (this.isSysObjConst(obj) && this.validateProperties(obj, new string[] { "sys", "val" }))
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
        public bool validateSysObjVar(JsonObjSysBase obj)
        {
            if (this.isSysObjVar(obj) && this.validateProperties(obj, new string[] { "sys", "name", "val" }))
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
        public bool validateSysObjArg(JsonObjSysBase obj)
        {
            if (this.isSysObjArg(obj) && this.validateProperties(obj, new string[] { "sys", "name", "val" }))
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
        public bool validateSysObjVal(JsonObjSysBase obj)
        {
            //this.wr("validateSysObjVal: Receiving: ");
            //this.wrObj(obj);
            if (this.isSysObjVal(obj) && this.validateProperties(obj, new string[] { "sys", "type", "v" }))
            {
                if (
                    !(obj.type.Equals("int") || obj.type.Equals("float") || obj.type.Equals("string") || obj.type.Equals("bool"))
                    && !(obj.type.Equals("int[]") || obj.type.Equals("float[]") || obj.type.Equals("string[]") || obj.type.Equals("bool[]"))
                )
                {
                    return false;
                }

                bool isArray = false;
                int arrayLen = 0;
                if (obj.type.Equals("int[]") || obj.type.Equals("float[]") || obj.type.Equals("string[]") || obj.type.Equals("bool[]"))
                {
                    isArray = true;
                    if (!this.validateProperties(obj, new string[] { "len" }))
                    {
                        this.wr("validateSysObjVal: Error: array is missing length: " + obj.v + ", type: " + obj.type);
                        return false;
                    }
                    else
                    {
                        if (!this.isInteger(obj.len) || this.toInt(obj.len) < 0)
                        {
                            this.wr("validateSysObjVal: Error: array length is invalid: " + obj.v + ", type: " + obj.type + ", " + obj.len + ", " + this.isInteger(obj.len));
                            return false;
                        }
                        else
                        {
                            arrayLen = this.toInt(obj.len);
                        }
                    }
                }

                //ignore references
                string tmp = this.toStr(obj.v);
                if (tmp.IndexOf("#.") == -1 && tmp.IndexOf("$.") == -1)
                {
                    if (!isArray)
                    {
                        //base data types
                        if (obj.type.Equals("int"))
                        {
                            if (!this.isInteger(this.toInt(obj.v)))
                            {
                                this.wr("validateSysObjVal: Error: value is not an int value: " + obj.v + ", type: " + obj.type);
                                return false;
                            }
                            else
                            {
                                obj.v = this.toInt(obj.v);
                            }
                        }
                        else if (obj.type.Equals("float"))
                        {
                            if (!this.isFloat(this.toFloat(obj.v)))
                            {
                                this.wr("validateSysObjVal: Error: value is not a float value: " + obj.v + ", type: " + obj.type);
                                return false;
                            }
                            else
                            {
                                obj.v = this.toFloat(obj.v);
                            }
                        }
                        else if (obj.type.Equals("string"))
                        {
                            if (!this.isString(this.toStr(obj.v)))
                            {
                                this.wr("validateSysObjVal: Error: value is not a string value: " + obj.v + ", type: " + obj.type);
                                return false;
                            }
                            else
                            {
                                obj.v = this.toStr(obj.v);
                            }
                        }
                        else if (obj.type.Equals("bool"))
                        {
                            if (!this.isBool(this.toBool(obj.v)))
                            {
                                this.wr("validateSysObjVal: Error: value is not a bool value: " + obj.v + ", type: " + obj.type);
                                return false;
                            }
                            else
                            {
                                obj.v = this.toBool(obj.v);
                            }
                        }
                        else
                        {
                            this.wr("validateSysObjVal: Error: unknown object type: " + obj.v + ", type: " + obj.type);
                            return false;
                        }
                    }
                    else
                    {
                        //this.wr("===========================");
                        //this.wrObjList((List<JsonObjSysBase>)obj.v);

                        List<JsonObjSysBase> tmpA = this.toArray(obj.v);

                        //this.wr("===========================");                 
                        //this.wrObjList(tmpA);
                        //this.wr("===========================");    

                        int arrayLenActual = tmpA.Count;
                        if (arrayLenActual != arrayLen)
                        {
                            this.wr("validateSysObjVal: Error: array length mismatch: " + obj.v + ", type: " + obj.type);
                            return false;
                        }

                        bool skipArVer = false;
                        if (this.validateProperties(obj, new String[] { "strict" }) == true && this.isBool(obj.strict) && this.toBoolInt(obj.strict) == 0)
                        {
                            skipArVer = true;
                        }

                        //array data types
                        if (obj.type.Equals("int[]"))
                        {
                            if (!this.isArray(obj.v))
                            {
                                this.wr("validateSysObjVal: Error: value is not an array value: " + obj.v + ", type: " + obj.type);
                                return false;
                            }
                            else
                            {
                                for (int i = 0; i < arrayLenActual; i++)
                                {
                                    JsonObjSysBase ltmp = (JsonObjSysBase)tmpA[i];
                                    if (!this.isArrayType(ltmp.val.type) && (!this.isSysObjVar(ltmp) || (!skipArVer && !ltmp.val.type.Equals("int"))))
                                    {
                                        this.wr("validateSysObjVal: Error: array element " + i + " has the wrong type, expected 'int' but found '" + ltmp.val.type + "'");
                                        return false;
                                    }
                                }
                            }
                        }
                        else if (obj.type.Equals("float[]"))
                        {
                            if (!this.isArray(obj.v))
                            {
                                this.wr("validateSysObjVal: Error: value is not an array value: " + obj.v + ", type: " + obj.type);
                                return false;
                            }
                            else
                            {
                                for (int i = 0; i < arrayLenActual; i++)
                                {
                                    JsonObjSysBase ltmp = (JsonObjSysBase)tmpA[i];
                                    if (!this.isArrayType(ltmp.val.type) && (!this.isSysObjVar(ltmp) || (!skipArVer && !ltmp.val.type.Equals("float"))))
                                    {
                                        this.wr("validateSysObjVal: Error: array element " + i + " has the wrong type, expected 'float' but found '" + ltmp.val.type + "'");
                                        return false;
                                    }
                                }
                            }
                        }
                        else if (obj.type.Equals("string[]"))
                        {
                            if (!this.isArray(obj.v))
                            {
                                this.wr("validateSysObjVal: Error: value is not an array value: " + obj.v + ", type: " + obj.type);
                                return false;
                            }
                            else
                            {
                                for (int i = 0; i < arrayLenActual; i++)
                                {
                                    JsonObjSysBase ltmp = (JsonObjSysBase)tmpA[i];
                                    if (!this.isArrayType(ltmp.val.type) && (!this.isSysObjVar(ltmp) || (!skipArVer && !ltmp.val.type.Equals("string"))))
                                    {
                                        this.wr("validateSysObjVal: Error: array element " + i + " has the wrong type, expected 'string' but found '" + ltmp.val.type + "'");
                                        return false;
                                    }
                                }
                            }
                        }
                        else if (obj.type.Equals("bool[]"))
                        {
                            if (!this.isArray(obj.v))
                            {
                                this.wr("validateSysObjVal: Error: value is not an array value: " + obj.v + ", type: " + obj.type);
                                return false;
                            }
                            else
                            {
                                for (int i = 0; i < arrayLenActual; i++)
                                {
                                    JsonObjSysBase ltmp = (JsonObjSysBase)tmpA[i];
                                    if (!this.isArrayType(ltmp.val.type) && (!this.isSysObjVar(ltmp) || (!skipArVer && !ltmp.val.type.Equals("bool"))))
                                    {
                                        this.wr("validateSysObjVal: Error: array element " + i + " has the wrong type, expected 'bool' but found '" + ltmp.val.type + "'");
                                        return false;
                                    }
                                }
                            }
                        }
                        else
                        {
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
        public bool validateSysObjRef(JsonObjSysBase obj)
        {
            if (this.isSysObjRef(obj) && this.validateProperties(obj, new string[] { "sys", "val" }))
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
        * Name: validateSysObjReturn 
        * Desc: Validates if the given object is a valid return object. 
        * Arg1: obj(a {return} object to check)
        * Returns: ret(some bool, true or false)
        * Struct:
        * {
        *   "sys": "return",
        *   "val": {val}
        * }
        */
        public bool validateSysObjReturn(JsonObjSysBase obj)
        {
            if (this.isSysObjReturn(obj) && this.validateProperties(obj, new string[] { "sys", "val" }))
            {
                if (!this.isSysObjRef(obj.val) && !this.isSysObjConst(obj.val))
                {
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
        public bool validateProperties(JsonObjSysBase obj, string[] req)
        {
            if (obj == null || req == null)
            {
                return false;
            }

            FieldInfo fld = null;
            for (int i = 0; i < req.Length; i++)
            {
                try
                {
                    fld = obj.GetType().GetField(req[i]);
                    if (fld == null || fld.GetValue(obj) == null)
                    {
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


        /////////////////////////UTILITY METHODS
        /**
         * Name: wrErr 
         * Desc: Writes a string to standard error if LOGGING is on.
         * Arg1: e(exception to write)
         */
        public void wrErr(Exception e)
        {
            if (this.LOGGING == true)
            {
                this.wr(e.Message);
                this.wr(e.StackTrace);
            }
        }

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
        * Returns: ret(cloned JSON object)
        */
        public JsonObjSysBase cloneJsonObj(JsonObjSysBase jsonObj)
        {
            return jsonObj.Clone();
        }

        /**
        * Name: cloneJsonObjList
        * Desc: A method to clone the given JSON object list argument. 
        * Arg1: jsonObj(the JSON object list to do a shallow clone) 
        * Returns: ret(cloned JSON object)
        */
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

        /**
        * Name: wrObjList
        * Desc: Writes a JSON object list to write to standard output if LOGGING is on. 
        *       Sets the WR_PREFIX to each object written. 
        *       Prints object using pretty JSON.stringify call. 
        * Arg1: jsonObj(jsonObj list to write)
        */
        public void wrObjList(List<JsonObjSysBase> jsonObjs)
        {
            if (this.LOGGING == true)
            {
                for (int i = 0; i < jsonObjs.Count; i++)
                {
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
        public void wrVal(JsonObjSysBase v)
        {
            if (this.LOGGING == true)
            {
                if (this.isSysObjValArray(v))
                {
                    this.wr(this.WR_PREFIX + "Val Obj: Type: " + v.type + " len: " + v.len);
                }
                else
                {
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
        public JsonObjSysBase sysLen(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            JsonObjSysBase s = args[0];

            //this.wr("sysType: AAA: ");
            //this.wrObj(s);

            JsonObjSysBase ret = this.getConst("int", "0");
            s = this.getRef("string", s.val.v);
            JsonObjSysBase v = this.processRef(s, func);

            //this.wr("sysType: CCC: ");
            //this.wrObj(v);   

            if (v != null)
            {
                v = v.val;
            }

            //this.wr("sysType: DDD: ");
            //this.wrObj(v);

            if (v != null && this.isSysObj(v))
            {
                if (this.isSysObjValArray(v))
                {
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
        public JsonObjSysBase sysType(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            JsonObjSysBase s = args[0];

            //this.wr("sysType: AAA: ");
            //this.wrObj(s);

            JsonObjSysBase ret = this.getConst("string", "");
            s = this.getRef("string", s.val.v);
            JsonObjSysBase v = this.processRef(s, func);

            //this.wr("sysType: CCC: ");
            //this.wrObj(v);   

            if (v != null)
            {
                v = v.val;
            }

            //this.wr("sysType: DDD: ");
            //this.wrObj(v);

            if (v != null && this.isSysObj(v))
            {
                ret = this.getConst("string", this.toStr(v.type));
            }

            //this.wr("sysType: EEE: ");
            //this.wrVal(ret.val);
            return ret;
        }

        /**
         * Name: sysGetRefStr
         * Desc: Returns a string object with a reference to the {val} or {arg} object specified.
         * Arg1: v(a {val} obj to get the reference for)
         * Arg2: isVar(bool indicating is the v object is a {var} or {arg})
         * Arg3: funcName(the name of the function to lookup the variable in, blank for class level)
         */
        public JsonObjSysBase sysGetRefStr(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            JsonObjSysBase ret = this.sysGetRef(args, func);
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
        public JsonObjSysBase sysGetArrayIdxRefStr(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            JsonObjSysBase ret = this.sysGetArrayIdxRef(args, func);
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
        public JsonObjSysBase sysGetArrayIdxRef(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            JsonObjSysBase ret = this.sysGetRef(args, func);
            string idx = this.toStr(args[3].val.v);
            ret.val.v += "." + idx;
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
        public JsonObjSysBase sysGetRef(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            string name = this.toStr(args[0].val.v);
            bool isVar = this.toBool(args[1].val.v);
            string funcName = this.toStr(args[2].val.v);
            JsonObjSysBase ret = this.getRef("string", "");

            //this.wr("sysGetRef: AAA");
            if (name != null && !name.Equals(""))
            {
                if (funcName == null || funcName.Equals(""))
                {
                    //this.wr("sysGetRef: BBB");
                    //lookup class variable
                    JsonObjSysBase v = this.findVar(name, this.program);
                    if (v != null)
                    {
                        ret = this.getRef(v.val.type, "#.vars." + v.name);
                    }
                    //this.wr("sysGetRef: CCC");
                }
                else
                {
                    //this.wr("sysGetRef: DDD");
                    JsonObjSysBase lfunc = this.findFunc(funcName);
                    if (lfunc != null)
                    {
                        if (isVar)
                        {
                            //lookup function variable
                            var v1 = this.findVar(name, lfunc);
                            if (v1 != null)
                            {
                                ret = this.getRef(v1.val.type, "$.vars." + v1.name);
                            }
                        }
                        else
                        {
                            //lookup function arg
                            var v2 = this.findArg(name, func);
                            if (v2 != null)
                            {
                                ret = this.getRef(v2.val.type, "$.args." + v2.name);
                            }
                        }
                    }
                    //this.wr("sysGetRef: EEE");
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
        public JsonObjSysBase sysMalloc(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            bool isClassVar = this.toBool(args[0].val.v);
            string name = this.toStr(args[1].val.v);
            string type = this.toStr(args[2].val.v);
            string val = this.toStr(args[3].val.v);
            JsonObjSysBase ret = this.getConst("string", "");
            JsonObjSysBase prog = this.program;

            if (this.isArrayType(type))
            {
                this.wr("sysMalloc: Error: IsClassVar: " + isClassVar + ", Name: " + name + ", type of array not supported by this system function");
                return ret;
            }

            if (name == null || (name != null && name.Equals("")))
            {
                this.objId += 1;
                name = "objId_" + this.objId;
            }

            JsonObjSysBase res = null;
            if (isClassVar == true)
            {
                res = this.findVar(name, prog);
            }
            else
            {
                res = this.findVar(name, func);
            }

            if (res == null)
            {
                JsonObjSysBase vtmp = new JsonObjSysBase("var");
                vtmp.name = name;
                vtmp.val = new JsonObjSysBase("val");
                vtmp.val.type = type;
                vtmp.val.v = val;

                //this.wr("sysMalloc: Adding variable: ");
                //this.wrObj(vtmp);

                if (isClassVar == true)
                {
                    prog.vars.Add(vtmp);
                    ret.val.v = "#.vars." + name;
                }
                else
                {
                    func.vars.Add(vtmp);
                    ret.val.v = "$.vars." + name;
                }

            }
            else
            {
                if (isClassVar == true)
                {
                    ret.val.v = "#.vars." + name;
                }
                else
                {
                    ret.val.v = "$.vars." + name;
                }
                this.wr("sysMalloc: Warning: IsClassVar: " + isClassVar + ", Name: " + name + " already exists.");
            }

            //this.wr("sysMalloc: Returning: ");
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
        public JsonObjSysBase sysMallocArray(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            JsonObjSysBase tt = null;
            bool isClassVar = this.toBool(args[0].val.v);
            string name = this.toStr(args[1].val.v);
            string type = this.toStr(args[2].val.v);
            int len = this.toInt(args[3].val.v);
            bool strict = this.toBool(args[4].val.v);
            JsonObjSysBase ret = this.getConst("string", "");
            JsonObjSysBase prog = this.program;

            if (!this.isArrayType(type))
            {
                this.wr("sysMallocArray: Error: IsClassVar: " + isClassVar + ", Name: " + name + ", non-array types are NOT supported by this system function");
                return ret;
            }

            if (name == null || (name != null && name.Equals("")))
            {
                this.objId += 1;
                name = "objId_" + this.objId;
            }

            JsonObjSysBase res = null;
            if (isClassVar == true)
            {
                res = this.findVar(name, prog);
            }
            else
            {
                res = this.findVar(name, func);
            }

            if (res == null)
            {
                JsonObjSysBase vtmp = new JsonObjSysBase("var");
                vtmp.name = name;
                vtmp.val = new JsonObjSysBase("val");
                vtmp.val.type = type;
                vtmp.val.len = len;
                vtmp.val.strict = strict;
                vtmp.val.v = new List<JsonObjSysBase>();

                if (args.Count > 5)
                {
                    int llen = args.Count;
                    for (int i = 5; i < llen; i++)
                    {
                        string itm = this.toStr(args[i].val.v);
                        string[] itms = itm.Split(","); //name,type,value
                        if (itms != null && itms.Length == 3)
                        {
                            JsonObjSysBase otmp = new JsonObjSysBase("var");
                            otmp.name = itms[0];
                            otmp.val = new JsonObjSysBase("val");
                            otmp.val.type = itms[1];
                            if (!itms[2].Equals("null"))
                            {
                                otmp.val.v = itms[2];
                            }
                            else
                            {
                                otmp.val.v = "";
                            }
                            ((List<JsonObjSysBase>)vtmp.val.v).Add(otmp);
                        }
                        else
                        {
                            this.wr("sysMallocArray: Error: could not parse array entry encoded string, " + itm);
                            return ret;
                        }
                    }
                }

                if (!this.validateSysObjVar(vtmp))
                {
                    this.wr("sysMallocArray: Error: could not validate newly created array");
                    return ret;
                }

                //this.wr("sysMallocArray: Adding variable: " + prog.vars.length);
                //this.wrObj(vtmp);

                if (isClassVar == true)
                {
                    prog.vars.Add(vtmp);
                    ret.val.v = "#.vars." + name;
                }
                else
                {
                    func.vars.Add(vtmp);
                    ret.val.v = "$.vars." + name;
                }

                //this.wr("sysMallocArray: Done Adding variable: " + prog.vars.length);

            }
            else
            {
                if (isClassVar == true)
                {
                    ret.val.v = "#.vars." + name;
                }
                else
                {
                    ret.val.v = "$.vars." + name;
                }
                this.wr("sysMallocArray: Warning: IsClassVar: " + isClassVar + ", Name: " + name + " already exists.");
            }

            //this.wr("sysMallocArray: Returning: ");
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
        public JsonObjSysBase sysClean(List<JsonObjSysBase> args, JsonObjSysBase func)
        {
            //this.wr("sysClean: Info: Receiving ");
            //this.wrObj(args[0]);
            //this.wrObj(args[1]);

            bool isClassVar = this.toBool(args[0].val.v);
            string name = this.toStr(args[1].val.v);
            JsonObjSysBase ret = this.getConst("bool", "false");
            JsonObjSysBase res = null;
            JsonObjSysBase prog = this.program;
            JsonObjSysBase refDec = null;
            //process ref for name
            if (this.isSysObjRef(args[1]))
            {
                if (this.isRefStringArray(args[1].val.v))
                {
                    this.wr("sysClean: Error: cannot handle an array item reference, " + args[1].val.v + ", for arg name");
                    return ret;
                }

                refDec = this.processRef(args[1], func);
                if (refDec != null)
                {
                    name = this.toStr(refDec.name);
                }
                else
                {
                    this.wr("sysClean: Error: could not resolve referece value, " + args[1].val.v + ", for arg name");
                    return ret;
                }
            }

            //this.wr("sysClean: LookingFor: " + isClassVar + ", " + name);

            JsonObjSysBase obj = null;
            if (isClassVar == true)
            {
                obj = prog;
            }
            else
            {
                obj = func;
            }
            res = this.findVar(name, obj);

            //this.wr("sysClean: Found: " + isClassVar + ", " + name);
            //this.wrObj(res);

            if (res != null)
            {
                if (obj != null)
                {
                    //this.wr("sysClean: Info: Starting var array length: " + obj.vars.length);
                    bool found = false;
                    int i = 0;
                    for (; i < obj.vars.Count; i++)
                    {
                        if (obj.vars[i].name.Equals(name))
                        {
                            //this.wr("sysClean: Info: Removing var with name: " + name);
                            found = true;
                            break;
                        }
                    }

                    if (found)
                    {
                        obj.vars.RemoveAt(i);
                        ret.val.v = "true";
                    }
                    //this.wr("sysClean: Info: Ending var array length: " + obj.vars.length);
                }
                return ret;

            }
            else
            {
                this.wr("sysClean: Error: IsClassVar: " + isClassVar + ", Name: " + name + " does NOT exist");
                return ret;
            }
        }


        /////////////////////////GENERIC OBJECT ID METHODS
        /**
        * Name: isObject 
        * Desc: Checks if the given argument is a JSON object. 
        * Arg1: arg(a JSON object) 
        * Returns: ret(some bool, true or false)
        */
        public bool isObject(object arg)
        {
            if (arg == null)
            {
                return false;
            }
            else if (arg is JsonObjSysBase)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
         * Name: isRefString
         * Desc: Checks if the given argument is a reference string. 
         * Arg1: s(some string with a valid reference value)
         * Returns: ret(some bool, true or false)
         */
        public bool isRefString(object s)
        {
            string ns = this.toStr(s);
            if (ns.IndexOf("$.") == 0 || ns.IndexOf("#.") == 0)
            {
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

        public bool isRefStringUrl(object s)
        {
            string ns = this.toStr(s);
            if (ns.IndexOf("->(") != -1)
            {
                return true;
            }
            return false;
        }

        /*
         * Name: isFuncSys
         * Desc: Checks if the given argument is a system function. 
         * Arg1: s(some string with a valid reference value)
         * Returns: ret(some bool, true or false)
         */

        //TODO: sync
        
        public bool isFuncSys(object s)
        {
            string ns = this.toStr(s);
            if (ns.IndexOf("SYS::") != -1)
            {
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
        public bool isRefStringArray(object s)
        {
            if (this.isRefString(s))
            {
                string ns = this.toStr(s);
                int len = ns.Length;
                int cnt = 0;
                for (int i = 0; i < len; i++)
                {
                    if (ns.ToCharArray()[i] == '.')
                    {
                        cnt++;
                    }
                }

                if (cnt == 3)
                {
                    return true;
                }
            }
            return false;
        }

        /**
         * Name: isRefStringDec
         * Desc: Checks if the given argument is a decoded, no [], reference string. 
         * Arg1: s(some string with a valid reference value)
         * Returns: ret(some bool, true or false)
         */
        public bool isRefStringDec(object s)
        {
            if (this.isRefString(s))
            {
                string ns = this.toStr(s);
                if (ns.IndexOf("[") == -1 && ns.IndexOf("]") == -1)
                {
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
        public bool isRefStringArrayDec(object s)
        {
            if (this.isRefStringDec(s) && this.isRefStringArray(s))
            {
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
        public bool isArrayType(object type)
        {
            string ns = this.toStr(type);
            if (ns.Equals("int[]") || ns.Equals("float[]") || ns.Equals("string[]") || ns.Equals("bool[]"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
         * Name: isBaseType
         * Desc: Checks if the given argument is a base type string. 
         * Arg1: type(some string with a valid type value)
         * Returns: ret(some bool, true or false)
         */
        public bool isBaseType(object type)
        {
            string ns = this.toStr(type);
            if (ns.Equals("int") || ns.Equals("float") || ns.Equals("string") || ns.Equals("bool"))
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
        * Arg1: arg(some array object) 
        * Returns: ret(some bool, true or false)
        */
        public bool isArray(object arg)
        {
            if (arg == null)
            {
                return false;
            }
            else if (arg is IList)
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
        public bool isString(object arg)
        {
            if (arg == null)
            {
                return false;
            }
            else if (arg is string)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
         * Name: isNumber
         * Desc: Checks if the given argument is a number. 
         * Arg1: arg(some value)
         * Returns: (true | false)
         */
        public bool isNumber(object arg)
        {
            if (arg == null)
            {
                return false;
            }
            else if (this.isInteger(arg))
            {
                return true;
            }
            else if (this.isFloat(arg))
            {
                return true;
            }
            else if (arg is int || arg is float)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
         * Name: isInteger
         * Desc: Checks if the given argument is an integer. 
         * Arg1: arg(some value)
         * Returns: (true | false)
         */
        public bool isInteger(object arg)
        {
            int ti = -1;
            bool isIntStr = int.TryParse(this.toStr(arg), out ti);
        
            if (arg == null)
            {
                return false;
            }
            else if(isIntStr)
            {
                return true;
            }
            else if (arg is int)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /**
         * Name: isFloat
         * Desc: Checks if the given argument is a float. 
         * Arg1: arg(some value)
         * Returns: (true | false)
         */
        public bool isFloat(object arg)
        {
            bool isFltStr = false;
            try
            {
                float.Parse(this.toStr(arg));
                isFltStr = true;
            }
            catch (Exception e)
            {
                isFltStr = false;
            }

            if (arg == null)
            {
                return false;
            }
            else if (isFltStr) 
            {
                return true;
            }
            else if (arg is float) 
            {
                return true;
            } else
            {
                return false;
            }
        }

        /**
         * Name: isBool
         * Desc: Checks if the given argument is a bool. 
         * Arg1: arg(some value)
         * Returns: (true | false)
         */
        public bool isBool(object arg)
        {
            bool isBlStr = false;
            try
            {
                Boolean.Parse(this.toStr(arg));
                isBlStr = true;
            }
            catch (Exception e)
            {
                isBlStr = false;
            }

            if (arg == null)
            {
                return false;
            }
            else if (arg is bool)
            {
                return true;
            }
            else if (isBlStr)
            {
                return true;
            }
            else if (this.isInteger(arg) && (int)arg == 1 || (int)arg == 0)
            {
                return true;
            }
            else if (this.isFloat(arg) && (float)arg == 1.0 || (float)arg == 0.0)
            {
                return true;
            }
            else if (this.isString(arg) && (((string)arg).Equals("yes") || ((string)arg).Equals("no") || ((string)arg).Equals("true") || ((string)arg).Equals("false") || ((string)arg).Equals("1") || ((string)arg).Equals("0") || ((string)arg).Equals("1.0") || ((string)arg).Equals("0.0")))
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
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("val"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
         * Name: isSysObjArg 
         * Desc: Checks if the given object is an {arg} object.
         * Arg1: obj(sys obj to check)
         * Returns: (true | false)
         */
        public bool isSysObjArg(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = this.getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("arg"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
         * Name: isSysObjValArray
         * Desc: Checks if the given object is a val sys object array. 
         * Arg1: obj(sys obj to check)
         * Returns: (true | false)
         */
        public bool isSysObjValArray(JsonObjSysBase obj)
        {
            if (this.isSysObjVal(obj) == true && this.validateProperties(obj, new string[] { "len" }) && this.isInteger(obj.len) && this.isArray(obj.v))
            {
                return true;
            }
            else
            {
                return false;
            }
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
         * Name: isSysObjClass
         * Desc: Checks if the given object is a {class} object.
         * Arg1: obj(sys obj to check) 
         * Returns: (true | false)
         */
        public bool isSysObjClass(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = this.getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("class"))
                {
                    return true;
                }
            }
            return false;
        }

        /**
         * Name: isSysObjFuncLine
         * Desc: Checks if the given object is a functio line sys object. 
         * Arg1: obj(sys obj to check)
         * Returns: (true | false)
         */
        public bool isSysObjFuncLine(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj))
            {
                if (this.getSysObjType(obj).Equals("asgn"))
                {
                    return true;
                }
                else if (this.getSysObjType(obj).Equals("for"))
                {
                    return true;
                }
                else if (this.getSysObjType(obj).Equals("if"))
                {
                    return true;
                }
                else if (this.getSysObjType(obj).Equals("return"))
                {
                    return true;
                }
                else if (this.getSysObjType(obj).Equals("call"))
                {
                    return true;
                }
                else
                {
                    return false;
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
         * Name: isSysObjOp
         * Desc: Checks if the given object is an op sys object. 
         * Arg1: obj(sys obj to check)
         * Returns: (true | false)
         */
        public bool isSysObjOp(JsonObjSysBase obj)
        {
            if (this.isSysObj(obj) == true)
            {
                string objSys = getSysObjType(obj);
                if (!Utils.IsStringEmpty(objSys) && objSys.Equals("op"))
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
        * Desc: Gets the value of the sys attribute of the given sys object.
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


        /////////////////////////PROCESS METHODS
        /*
         * From: https://zetcode.com/csharp/getpostrequest/
         * Name: processUrlFind
         * Desc: 
         * Arg1: 
         * Arg2: 
         * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
         */
        public JsonObjSysBase processUrlFind(string url)
        {
            if (this.VERBOSE)
            {
                this.wr("processUrlFind: Received url: " + url);
            }

            if (Utils.IsStringEmpty(url))
            {
                this.wr("processUrlFind: Error: url is not properly defined");
                return null;
            }

            if (url.Length >= 2048)
            {
                this.wr("processUrlFind: Warning: maximum URL length with get params has been reached!");
            }

            try
            {
                var request = WebRequest.Create(url);
                request.Method = "GET";
                //request.ContentType = "application/json";

                request.Timeout = 5000;

                using var webResponse = request.GetResponse();
                using var webStream = webResponse.GetResponseStream();

                using var reader = new StreamReader(webStream);
                string responseText = reader.ReadToEnd();

                if (!Utils.IsStringEmpty(responseText))
                {
                    LoaderSvrBase ldr = new LoaderSvrBase();
                    JsonObjSvrBase obj = (JsonObjSvrBase)ldr.ParseJson(responseText, "com.middlemind.JsonPL.JsonObjs.JsonObjSvrBase");
                    if (this.toBool(obj.error) == false)
                    {
                        if (this.VERBOSE)
                        {
                            this.wr("processUrlFind: Notice: found response: " + obj.message + ", " + responseText);
                        }

                        return obj.result;
                    }
                    else
                    {
                        this.wr("processUrlFind: Error: ref request had issues: " + obj.message + ", " + responseText);
                        return null;
                    }
                }
                else
                {
                    this.wr("processUrlFind: Error: bad response received");
                }
            }
            catch (Exception e)
            {
                this.wr("processUrlFind: Error: exception caught processing request");
                this.wrErr(e);
            }
            return null;
        }

        /**
         * Name: processUrlSet
         * Desc: A function used to set the value of a URL variable.
         * Arg1: url(some complete URL with set message generated by JsonPL)
         * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
         */
        public JsonObjSysBase processUrlSet(string url)
        {
            if (this.VERBOSE)
            {
                this.wr("processUrlSet: Received url: " + url);
            }

            if (Utils.IsStringEmpty(url))
            {
                this.wr("processUrlFind: Error: url is not properly defined");
                return null;
            }

            if (url.Length >= 2048)
            {
                this.wr("processUrlFind: Warning: maximum URL length with get params has been reached!");
            }

            try
            {
                var request = WebRequest.Create(url);
                request.Method = "GET";
                //request.ContentType = "application/json";

                request.Timeout = 5000;

                using var webResponse = request.GetResponse();
                using var webStream = webResponse.GetResponseStream();

                using var reader = new StreamReader(webStream);
                string responseText = reader.ReadToEnd();

                if (!Utils.IsStringEmpty(responseText))
                {
                    LoaderSvrBase ldr = new LoaderSvrBase();
                    JsonObjSvrBase obj = (JsonObjSvrBase)ldr.ParseJson(responseText, "com.middlemind.JsonPL.JsonObjs.JsonObjSvrBase");
                    if (this.toBool(obj.error) == false)
                    {
                        if (this.VERBOSE)
                        {
                            this.wr("processUrlSet: Notice: found response: " + obj.message + ", " + responseText);
                        }

                        return obj.result;
                    }
                    else
                    {
                        this.wr("processUrlSet: Error: ref request had issues: " + obj.message + ", " + responseText);
                        return null;
                    }
                }
                else
                {
                    this.wr("processUrlSet: Error: bad response received");
                }
            }
            catch (Exception e)
            {
                this.wr("processUrlSet: Error: exception caught processing request");
                this.wrErr(e);
            }
            return null;
        }

        /**
         * Name: processUrlCall
         * Desc: A function used to call a URL function.
         * Arg1: url(some complete URL with set message generated by JsonPL)
         * Returns: {null | (var obj, sys=var) | (arg obj, sys=arg)}
         */
        public JsonObjSysBase processUrlCall(string url)
        {
            if (this.VERBOSE)
            {
                this.wr("processUrlCall: Received url: " + url);
            }

            if (Utils.IsStringEmpty(url))
            {
                this.wr("processUrlCall: Error: url is not properly defined");
                return null;
            }

            if (url.Length >= 2048)
            {
                this.wr("processUrlCall: Warning: maximum URL length with get params has been reached!");
            }

            try
            {
                var request = WebRequest.Create(url);
                request.Method = "GET";
                //request.ContentType = "application/json";

                request.Timeout = 5000;

                using var webResponse = request.GetResponse();
                using var webStream = webResponse.GetResponseStream();

                using var reader = new StreamReader(webStream);
                string responseText = reader.ReadToEnd();

                if (!Utils.IsStringEmpty(responseText))
                {
                    LoaderSvrBase ldr = new LoaderSvrBase();
                    JsonObjSvrBase obj = (JsonObjSvrBase)ldr.ParseJson(responseText, "com.middlemind.JsonPL.JsonObjs.JsonObjSvrBase");
                    if (this.toBool(obj.error) == false)
                    {
                        if (this.VERBOSE)
                        {
                            this.wr("processUrlCall: Notice: found response: " + obj.message + ", " + responseText);
                        }

                        return obj.result;
                    }
                    else
                    {
                        this.wr("processUrlCall: Error: ref request had issues: " + obj.message + ", " + responseText);
                        return null;
                    }
                }
                else
                {
                    this.wr("processUrlCall: Error: bad response received");
                }
            }
            catch (Exception e)
            {
                this.wr("processUrlCall: Error: exception caught processing request");
                this.wrErr(e);
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
        public JsonObjSysBase processRef(JsonObjSysBase objRef, JsonObjSysBase func)
        {
            return processRef(objRef, func, null);
        }

        public JsonObjSysBase processRef(JsonObjSysBase objRef, JsonObjSysBase func, string url)
        {
            string path = null;
            string[] vls = null;
            JsonObjSysBase fnd = null;
            JsonObjSysBase prog = this.program;

            if (this.VERBOSE)
            {
                this.wr("processRef: Receiving: ");
                this.wrObj(objRef);
            }

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

            path = this.toStr(objRef.val.v);

            if (this.VERBOSE)
            {
                this.wr("processRef: Initial Path: " + path);
            }

            //check for URL
            int urlStart = path.IndexOf("->(");
            bool hasUrl = false;
            bool forceLocal = false;

            if (this.VERBOSE)
            {
                this.wr("processRef: Url Start Index: " + urlStart);
            }

            string[] nvs = null;
            string nurl = null;
            string npath = null;

            if (url == null)
            {
                this.lastProcessUrlFindPath = null;
            }

            if (urlStart != -1)
            {
                nvs = path.Split("->(");
                npath = nvs[0].Trim();
                nurl = nvs[1].Substring(0, nvs[1].Length - 1).Trim();

                if (this.VERBOSE)
                {
                    this.wr("processRef: New Path: " + npath);
                    this.wr("processRef: New URL: " + nurl);
                }

                hasUrl = true;
                url = nurl;
                path = npath;
            }

            if (url != null && !Utils.IsStringEmpty(url))
            {
                hasUrl = true;
            }

            if (this.VERBOSE)
            {
                this.wr("processRef: Has URL: " + hasUrl);
            }

            //check for forced local de-reference for outer bracket only
            if (path.ToCharArray()[0] == '<')
            {
                path = path.Replace("<", "[");
                path = path.Replace(">", "]");
                forceLocal = true;
            }

            if (path.ToCharArray()[0] == '[')
            {
                int cnt = 0;
                int i = 0;
                char[] cs = path.ToCharArray();
                int llen = path.Length;
                for (; i < llen; i++)
                {
                    if (cs[i] == '[')
                    {
                        cnt += 1;
                    }
                    else if (cs[i] == ']')
                    {
                        cnt -= 1;
                    }

                    if (cnt == 0)
                    {
                        break;
                    }
                }

                string nc = path.Substring(1, i - 1);
                i += 1;

                JsonObjSysBase tmp = new JsonObjSysBase();
                tmp.sys = "ref";
                tmp.val = new JsonObjSysBase();
                tmp.val.sys = "val";
                tmp.val.type = "string";
                tmp.val.v = nc;

                if (this.VERBOSE)
                {
                    this.wr("processRef: Initial De-Reference:");
                    this.wrObj(tmp);
                }

                if (!forceLocal)
                {
                    tmp = this.cloneJsonObj(this.processRef(tmp, func, url));
                }
                else
                {
                    tmp = this.cloneJsonObj(this.processRef(tmp, func, null));
                }

                if (path.Length >= i)
                {
                    tmp.val.v += path.Substring(i);
                }

                if (tmp != null)
                {
                    path = this.toStr(tmp.val.v);
                    if (path.IndexOf("[") == -1 && path.IndexOf("#.") == -1 && path.IndexOf("$.") == -1)
                    {
                        if (this.VERBOSE)
                        {
                            this.wr("processRef: Returning: ");
                            this.wrObj(tmp);
                        }
                        return tmp;
                    }
                }
                else
                {
                    this.wr("processRef: Error 1: could not lookup object, for ref path: " + path);
                }
            }

            vls = path.Split(".");

            bool inDynRef = false;
            List<string> nvls = new List<string>();
            string tt = null;
            int obrk = 0;
            for (int k = 0; k < vls.Length; k++)
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
            for (int k = 0; k < nvls.Count; k++)
            {
                if (nvls[k] != null)
                {
                    vls[k] = nvls[k];

                    if (this.VERBOSE)
                    {
                        this.wr("processRef: path idx: " + k + " val: " + vls[k]);
                    }
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

            for (int k = 0; k < vls.Length; k++)
            {
                string c = vls[k];

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
                        return null;
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
                            return null;
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
                            return null;
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
                        tmp.val.sys = "val";
                        tmp.val.type = "string";
                        tmp.val.v = nc;

                        tmp = this.cloneJsonObj(this.processRef(tmp, func, url));
                        if (tmp != null && tmp.val.type.Equals("string"))
                        {
                            name = this.toStr(tmp.val.v + "");
                        }
                        else
                        {
                            this.wr("processRef: Error 2: could not lookup object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                            return null;
                        }
                    }

                    if (!isFunc)
                    {
                        //class find name            
                        if (isVars)
                        {
                            if (hasUrl)
                            {
                                try
                                {
                                    if (this.lastProcessUrlFindPath == null)
                                    {
                                        this.lastProcessUrlFindPath = "#.vars." + name;
                                    }
                                    fnd = this.processUrlFind(url + "?type=get&ref=" + HttpUtility.UrlEncode("#.vars." + name));
                                }
                                catch (Exception e)
                                {
                                    this.wrErr(e);
                                    fnd = null;
                                }
                            }
                            else
                            {
                                fnd = this.findVar(name, prog);
                            }
                        }
                        else
                        {
                            this.wr("processRef: Error: could not find, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                            return null;
                        }
                        //function
                    }
                    else
                    {
                        //function find name
                        if (isVars)
                        {
                            if (hasUrl)
                            {
                                try
                                {
                                    if (this.lastProcessUrlFindPath == null)
                                    {
                                        this.lastProcessUrlFindPath = "$.vars." + name;
                                    }
                                    fnd = this.processUrlFind(url + "?type=get&ref=" + HttpUtility.UrlEncode("$.vars." + name));
                                }
                                catch (Exception e)
                                {
                                    this.wrErr(e);
                                    fnd = null;
                                }
                            }
                            else
                            {
                                fnd = this.findVar(name, func);
                            }
                        }
                        else
                        {
                            if (hasUrl)
                            {
                                try
                                {
                                    if (this.lastProcessUrlFindPath == null)
                                    {
                                        this.lastProcessUrlFindPath = "$.args." + name;
                                    }
                                    fnd = this.processUrlFind(url + "?type=get&ref=" + HttpUtility.UrlEncode("$.args." + name));
                                }
                                catch (Exception e)
                                {
                                    this.wrErr(e);
                                    fnd = null;
                                }
                            }
                            else
                            {
                                fnd = this.findArg(name, func);
                            }
                        }
                    }

                    if (fnd != null)
                    {
                        type = fnd.val.type;
                        foundName = true;
                    }
                    else
                    {
                        this.wr("processRef: Error: could not find an object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                        return null;
                    }
                }
                else if (!foundIndex)
                {
                    string lidx = this.toStr(c);
                    JsonObjSysBase tmp = null;

                    //lookup use of string var here
                    if (c.IndexOf("[") == 0)
                    {
                        string nc = c.Substring(1, c.Length - 2);

                        tmp = new JsonObjSysBase();
                        tmp.sys = "ref";
                        tmp.val = new JsonObjSysBase();
                        tmp.val.sys = "val";
                        tmp.val.type = "string";
                        tmp.val.v = nc;

                        tmp = this.cloneJsonObj(this.processRef(tmp, func, url));
                        if (tmp != null && tmp.val.type.Equals("int"))
                        {
                            idx = this.toInt(tmp.val.v);
                            lidx = this.toStr(tmp.val.v);
                        }
                        else
                        {
                            this.wr("processRef: Error 3: could not lookup object, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                            return null;
                        }
                    }

                    if (this.isSysObjValArray(fnd.val))
                    {
                        if (this.isNumber(lidx))
                        {
                            idx = this.toInt(lidx);
                            fnd = (JsonObjSysBase)(this.toArray(fnd.val.v))[idx];

                            if (hasUrl && this.lastProcessUrlFindPath != null)
                            {
                                this.lastProcessUrlFindPath += "." + idx;
                            }

                            foundIndex = true;
                        }
                        else
                        {
                            List<JsonObjSysBase> ar = this.toArray(fnd.val.v);
                            int len = ar.Count;
                            string target = this.toStr(lidx);
                            for (int l = 0; l < len; l++)
                            {
                                if (((JsonObjSysBase)ar[l]).name.Equals(target))
                                {
                                    if (hasUrl && this.lastProcessUrlFindPath != null)
                                    {
                                        this.lastProcessUrlFindPath += "." + target;
                                    }

                                    fnd = (JsonObjSysBase)ar[l];
                                    foundIndex = true;
                                    break;
                                }
                            }
                        }
                    }
                    else
                    {
                        this.wr("processRef: Error: index entry is only for vars/args of type array, for name, " + name + ", for type isVars, " + isVars + ", for source isFunc = " + isFunc);
                        return null;
                    }
                }
            }

            if (fnd != null)
            {
                if (this.isArray(fnd.val.v) == false)
                {
                    string ns = this.toStr(fnd.val.v);
                    if (ns.IndexOf("$") == -1 && ns.IndexOf("#") == -1)
                    {
                        if (fnd.val.type.Equals("int"))
                        {
                            fnd.val.v = this.toInt(fnd.val.v);
                        }
                        else if (fnd.val.type.Equals("float"))
                        {
                            fnd.val.v = this.toFloat(fnd.val.v);
                        }
                        else if (fnd.val.type.Equals("string"))
                        {
                            fnd.val.v = this.toStr(fnd.val.v);
                        }
                        else if (fnd.val.type.Equals("bool"))
                        {
                            fnd.val.v = this.toBool(fnd.val.v);
                        }
                        fnd.val.v = this.toStr(fnd.val.v);
                    }
                }
                else
                {
                    fnd.val.v = this.toArray(fnd.val.v);
                    List<JsonObjSysBase> al = (List<JsonObjSysBase>)fnd.val.v;
                    for (int z = 0; z < al.Count; z++)
                    {
                        JsonObjSysBase nd = al[z];
                        String nds = this.toStr(nd.val.v);
                        if (nds.IndexOf("$") == -1 && nds.IndexOf("#") == -1)
                        {
                            if (nd.val.type.Equals("int"))
                            {
                                nd.val.v = this.toInt(nd.val.v);
                            }
                            else if (nd.val.type.Equals("float"))
                            {
                                nd.val.v = this.toFloat(nd.val.v);
                            }
                            else if (nd.val.type.Equals("string"))
                            {
                                nd.val.v = this.toStr(nd.val.v);
                            }
                            else if (nd.val.type.Equals("bool"))
                            {
                                nd.val.v = this.toBool(nd.val.v);
                            }
                            nd.val.v = this.toStr(nd.val.v);
                        }
                    }
                }
            }

            if (this.VERBOSE)
            {
                this.wr("processRef: Returning: ");
                this.wrObj(fnd);
            }
            return fnd;
        }

        /**
        * Name: toBoolInt
        * Desc: Converts the bool value v to an integer representation.
        * Arg1: v(the value to convert)
        * Returns: (0 | 1)
        */
        public int toBoolInt(object v)
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

        /**
        * Name: toInt
        * Desc: Converts the value v to an integer representation.
        * Arg1: v(the value to convert)
        * Returns: (the int value of v)
        */
        public int toInt(object v)
        {
            string s = this.toStr(v);
            if (s.IndexOf(".") != -1)
            {
                s = this.toStr((int)float.Parse(s));
            }
            return int.Parse(s);
        }

        /**
        * Name: toFloat
        * Desc: Converts the value v to a float representation.
        * Arg1: v(the value to convert)
        * Returns: (the float value of v)
        */
        public float toFloat(object v)
        {
            return float.Parse(this.toStr(v));
        }

        /**
        * Name: toStr
        * Desc: Converts the value v to a string representation.
        * Arg1: v(the value to convert)
        * Returns: (the string value of v)
        */
        public string toStr(object v)
        {
            return (v + "");
        }

        /**
         *
         */
        public JsonObjSysBase processLinkedTreeMap(JObject t)
        {
            LoaderSysBase ldr = new LoaderSysBase();
            JsonObjSysBase obj  = (JsonObjSysBase)ldr.ParseJson(t.ToString(), "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            return obj;
        }

        /**
        * Name: toArray
        * Desc: Converts the value v to an array representation.
        * Arg1: v(the value to convert)
        * Returns: (the array value of v)
        */
        public List<JsonObjSysBase> toArray(object v)
        {
            if (this.isArray(v))
            {
                //special case array comes in from JSON ready incorrectly
                if (v is JArray)
                {
                    JArray jar = (JArray)v;
                    List<JsonObjSysBase> al = new List<JsonObjSysBase>();
                    for (int i = 0; i < jar.Count; i++)
                    {
                        JsonObjSysBase jtmp = jar[i].ToObject<JsonObjSysBase>();
                        al.Add(jtmp);
                    }
                    return al;
                }
                else
                {
                    return (List<JsonObjSysBase>)v;
                }
            }
            else
            {
                List<JsonObjSysBase> ret = new List<JsonObjSysBase>();
                ret.Add((JsonObjSysBase)v);
                return ret;
            }
        }

        /**
        * Name: toBool
        * Desc: Converts the value v to a bool representation.
        * Arg1: v(the value to convert)
        * Returns: (the bool value of v)
        */
        public bool toBool(object v)
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

            //this.wr("left:");
            //this.wrObj(left);

            //this.wr("right:");
            //this.wrObj(right);


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

                if (this.toBool((ret.v + "")) == true)
                {
                    //run thn lines
                    ret3 = this.processIfForLines(thn, func);
                }
                else
                {
                    //run els lines
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
                    if (line.active != null && this.toBool(line.active) == false)
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
                        if (this.isSysObjRef(line.val))
                        {
                            ret = this.processRef(line.val, func);
                        }
                        else
                        {
                            ret = line.val;
                        }
                        return ret;
                    }

                    //this.wr("processIfForLines:---------------------------");
                    //this.wrObj(ret);        

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
                //this.wr("processIfForLines: Warning: provided lines array is null");
                JsonObjSysBase ret = new JsonObjSysBase("val");
                ret.type = "bool";
                ret.v = "true";

                JsonObjSysBase ret2 = new JsonObjSysBase("const");
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
            JsonObjSysBase each = null;

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

            bool fullLst = this.isFullFor(objFor);
            if (fullLst)
            {
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
                if (this.isSysObjConst(stop))
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
            }
            else
            {
                each = objFor.each;
                if (this.isSysObjConst(each))
                {
                    //do nothing

                }
                else if (this.isSysObjRef(each))
                {
                    each = this.processRef(each, func);

                }
                else
                {
                    this.wr("processFor: Error: argument stop unsuppoorted type: " + each.sys);
                    return null;
                }

                start = this.getConst("int", "0");
                stop = this.getConst("int", each.val.len);
                inc = this.getConst("int", "1");
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

            //this.wr("processFor: BBB: " + incAmt + ", " + lenAmt + ", " + startAmt);
            //this.wrObj(stop);       

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

            bool leftIsBasic = false;
            bool leftIsArray = false;
            bool leftIsRef = false;
            JsonObjSysBase leftOrig = null;

            bool rightIsBasic = false;
            bool rightIsArray = false;
            bool rightIsRef = false;
            JsonObjSysBase rightOrig = null;

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

            leftOrig = left;
            rightOrig = right;

            if (this.isSysObjRef(left))
            {
                leftIsRef = true;
            }

            if (this.isSysObjRef(right))
            {
                rightIsRef = true;
            }

            //this.wr("-----------------111:");
            //this.wrObj(left);

            bool hasUrl = this.isRefStringUrl(left.val.v);
            bool hasUrlAttr = this.validateProperties(objAsgn, new string[] { "url" });
            string[] vals = null;
            string url = null;
            string path = null;

            if (hasUrl && !hasUrlAttr)
            {
                //if inherent url is detected
                vals = this.getPathAndUrlFromRef(this.toStr(left.val.v));
            }
            else if (hasUrlAttr)
            {
                //allow url attribute to override inherent url
                if (this.VERBOSE)
                {
                    this.wr("processAsgn: URL Attribute override found.");
                }

                hasUrl = true;
                vals = new string[] { objAsgn.url, "unknown_ref_path" };
            }
            else
            {
                hasUrl = false;
            }

            left = this.processRef(left, func);

            if (this.VERBOSE)
            {
                this.wr("processAsgn: HasUrl: " + hasUrl + ", HasUrlAttr:" + hasUrlAttr);
            }

            if (hasUrl)
            {
                path = this.lastProcessUrlFindPath;
                url = vals[0];

                if (this.VERBOSE)
                {
                    this.wr("processAsgn: Path: " + path);
                    this.wr("processAsgn: Url: " + url);
                }
            }

            if (left == null)
            {
                this.wr("processAsgn: Error: error processing left");
                return null;
            }

            //this.wr("-----------------2222:");
            //this.wrObj(this.program.vars); 

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

            if (this.isSysObjValArray(left))
            {
                leftIsArray = true;
            }
            else
            {
                leftIsBasic = true;
            }

            if (this.isSysObjValArray(right))
            {
                rightIsArray = true;
            }
            else
            {
                rightIsBasic = true;
            }

            JsonObjSysBase ret = new JsonObjSysBase("val");
            ret.type = "bool";
            ret.v = "true";

            JsonObjSysBase ret2 = new JsonObjSysBase("const");
            ret2.val = ret;
            ret = ret2;

            //this.wr("-----left before:");
            //this.wrObj(left);
            //this.wr("-----left before 000:");
            //this.wrObj(this.program.vars);   

            //this.wr("-----right before:");
            //this.wrObj(right); 

            if (left.val.type.Equals(right.val.type))
            {
                if (leftIsBasic && rightIsBasic)
                {
                    //both are basic, dereference if need be, and copy value
                    if (hasUrl)
                    {
                        try
                        {
                            this.processUrlSet(url + "?type=set&ref=" + HttpUtility.UrlEncode(path) + "&cat=basic&obj=" + HttpUtility.UrlEncode(this.toStr(right.val.v)));
                        }
                        catch (Exception e)
                        {
                            this.wrErr(e);
                            this.wr("processAsgn: Error: could not update the remote variable");
                            ret.val.v = "false";
                            this.lastAsgnValue = this.cloneJsonObj(left);
                            this.lastAsgnReturn = ret;
                            return ret;
                        }
                    }
                    else
                    {
                        left.val.v = right.val.v;
                    }

                    //this.wr("-----left after:");
                    //this.wrObj(left);
                    //this.wr("-----left after AAA:");
                    //this.wrObj(this.program.vars);

                    this.lastAsgnValue = this.cloneJsonObj(left);
                    this.lastAsgnReturn = ret;
                    return ret;
                }
                else if (leftIsArray && rightIsArray && rightIsRef)
                {
                    //both are array refs, copy reference
                    if (hasUrl)
                    {
                        try
                        {
                            this.processUrlSet(url + "?type=set&ref=" + HttpUtility.UrlEncode(path) + "&cat=basic&obj=" + HttpUtility.UrlEncode(this.toStr(rightOrig.val.v)));
                        }
                        catch (Exception e)
                        {
                            this.wrErr(e);
                            this.wr("processAsgn: Error: could not update the remote variable");
                            ret.val.v = "false";
                            this.lastAsgnValue = this.cloneJsonObj(left);
                            this.lastAsgnReturn = ret;
                            return ret;
                        }
                    }
                    else
                    {
                        leftOrig.val.v = rightOrig.val.v;
                    }

                    //this.wr("-----left after:");
                    //this.wrObj(left);
                    //this.wr("-----left after AAA:");
                    //this.wrObj(this.program.vars); 

                    this.lastAsgnValue = this.cloneJsonObj(left);
                    this.lastAsgnReturn = ret;
                    return ret;
                }
                else if (leftIsArray && rightIsArray && !rightIsRef)
                {
                    //left is array ref, right is array const, copy value
                    //left.val.v = new List<JsonObjSysBase>();
                    List<JsonObjSysBase> tmpA = new List<JsonObjSysBase>(); //this.toArray(left.val.v);
                    List<JsonObjSysBase> tmpB = this.toArray(right.val.v);
                    for (int i = 0; i < tmpB.Count; i++)
                    {
                        tmpA.Add(tmpB[i]);
                    }

                    if (hasUrl)
                    {
                        try
                        {
                            this.processUrlSet(url + "?type=set&ref=" + HttpUtility.UrlEncode(path) + "&cat=basic&obj=" + HttpUtility.UrlEncode(Utils.JSONstringify(tmpA)));
                        }
                        catch (Exception e)
                        {
                            this.wrErr(e);
                            this.wr("processAsgn: Error: could not update the remote variable");
                            ret.val.v = "false";
                            this.lastAsgnValue = this.cloneJsonObj(left);
                            this.lastAsgnReturn = ret;
                            return ret;
                        }
                    }
                    else
                    {
                        left.val.v = tmpA;
                    }


                    //this.wr("-----left after:");
                    //this.wrObj(left);
                    //this.wr("-----left after AAA:");
                    //this.wrObj(this.program.vars);          

                    this.lastAsgnValue = this.cloneJsonObj(left);
                    this.lastAsgnReturn = ret;
                    return ret;
                }
                else
                {
                    this.wr("processAsgn: Error: type mismatch: " + left.val.type + " - " + right.val.type + ", left is array: " + leftIsArray + ", left is ref: " + leftIsRef + ", right is array: " + rightIsArray + ", right is ref: " + rightIsRef);
                    ret.val.v = "false";
                    this.lastAsgnValue = this.cloneJsonObj(left);
                    this.lastAsgnReturn = ret;
                    return ret;
                }
            }
            else
            {
                this.wr("processAsgn: Error: type mismatch: " + left.val.type + " - " + right.val.type + ", left is array: " + leftIsArray + ", left is ref: " + leftIsRef + ", right is array: " + rightIsArray + ", right is ref: " + rightIsRef);
                ret.val.v = "false";
                this.lastAsgnValue = this.cloneJsonObj(left);
                this.lastAsgnReturn = ret;
                return ret;
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
            bool urlFunc = false;

            if (this.VERBOSE)
            {
                this.wr("processCall: Receiving:");
                this.wrObj(objCall);
            }

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

            if (!this.isString(objCall.name) && this.isSysObjConst((JsonObjSysBase)objCall.name))
            {
                if (((JsonObjSysBase)objCall.name).val.type.Equals("string"))
                {
                    name = this.toStr(((JsonObjSysBase)objCall.name).val.v);
                }
                else
                {
                    return null;
                }
            }
            else if (!this.isString(objCall.name) && this.isSysObjRef((JsonObjSysBase)objCall.name))
            {
                var tnm = this.processRef((JsonObjSysBase)objCall.name, func);
                if (tnm != null && tnm.val.type.Equals("string"))
                {
                    name = this.toStr(tnm.val.v);
                }
                else
                {
                    return null;
                }
            }
            else
            {
                name = this.toStr(objCall.name);
            }

            if (this.VERBOSE)
            {
                this.wr("processCall: Function Name: " + name);
            }

            //handle function name url
            bool hasUrl = this.isRefStringUrl(name);
            bool hasSys = this.isFuncSys(name);
            string[] vals = null;
            string url = null;

            if (hasUrl)
            {
                vals = this.getPathAndUrlFromRef(name);
                url = vals[0];
                name = vals[1];

                if (this.VERBOSE)
                {
                    this.wr("processCall: Function Name: " + name);
                    this.wr("processCall: Url: " + url);
                }
            }

            args = this.cloneJsonObjList(objCall.args);

            if (!hasSys && !hasUrl)
            {
                //normal function
                urlFunc = false;
                sysFunc = false;
                funcDef = this.findFunc(name);
                if (funcDef != null)
                {
                    funcArgs = funcDef.args;
                }
                else
                {
                    this.wr("processCall: Error: no normal function found with name: " + name);
                    return null;
                }
            }
            else if (hasSys && !hasUrl)
            {
                //system function
                urlFunc = false;
                sysFunc = true;
                funcDef = this.findSysFunc(name);
                if (funcDef != null)
                {
                    funcArgs = funcDef.args;
                }
                else
                {
                    this.wr("processCall: Error: no system function found with name: " + name);
                    return null;
                }
            }
            else if (!hasSys && hasUrl)
            {
                //url function
                urlFunc = true;
                sysFunc = false;
                funcDef = null;
                funcArgs = new List<JsonObjSysBase>();
            }
            else
            {
                this.wr("processCall: Error: unknown function name type: " + name);
                return null;
            }

            if (funcArgs != null)
            {
                if (args.Count >= funcArgs.Count || funcArgs.Count == 0)
                {
                    if (funcArgs.Count == 0)
                    {
                        for (int i = 0; i < args.Count; i++)
                        {
                            if (this.isSysObjRef(args[i]))
                            {
                                tmpArg = null;
                                tmpArg = this.processRef(args[i], func);
                                if (tmpArg != null)
                                {
                                    args[i].val.v = tmpArg.val.v;
                                }
                                else
                                {
                                    this.wr("processCall: Error: could not process argument index, " + i + ", with path: " + args[i].val.v);
                                    return null;
                                }
                            }
                        }
                    }
                    else
                    {
                        for (int i = 0; i < args.Count; i++)
                        {
                            if (i < funcArgs.Count)
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
                                else
                                {
                                    args[i].name = funcArgs[i].name;
                                }
                            }
                        }
                    }

                    if (sysFunc)
                    {
                        //call system function
                        if (funcDef != null)
                        {
                            bool err = false;
                            JsonObjSysBase lret = null;
                            try
                            {
                                string lname = funcDef.fname;
                                if (lname.Equals("sysJob1"))
                                {
                                    lret = this.sysJob1(args, func);

                                }
                                else if (lname.Equals("sysJob2"))
                                {
                                    lret = this.sysJob2(args, func);

                                }
                                else if (lname.Equals("sysJob3"))
                                {
                                    lret = this.sysJob3(args, func);

                                }
                                else if (lname.Equals("sysGetLastAsgnValue"))
                                {
                                    lret = this.lastAsgnValue;

                                }
                                else if (lname.Equals("sysGetLastExpReturn"))
                                {
                                    lret = this.lastAsgnValue;

                                }
                                else if (lname.Equals("sysWr"))
                                {
                                    lret = this.sysWr(args, func, "");

                                }
                                else if (lname.Equals("sysLen"))
                                {
                                    lret = this.sysLen(args, func);

                                }
                                else if (lname.Equals("sysType"))
                                {
                                    lret = this.sysType(args, func);

                                }
                                else if (lname.Equals("sysGetRef"))
                                {
                                    lret = this.sysGetRef(args, func);

                                }
                                else if (lname.Equals("sysGetRefStr"))
                                {
                                    lret = this.sysGetRefStr(args, func);

                                }
                                else if (lname.Equals("sysGetArrayIdxRef"))
                                {
                                    lret = this.sysGetArrayIdxRef(args, func);

                                }
                                else if (lname.Equals("sysGetArrayIdxRefStr"))
                                {
                                    lret = this.sysGetArrayIdxRefStr(args, func);

                                }
                                else if (lname.Equals("sysMalloc"))
                                {
                                    lret = this.sysMalloc(args, func);

                                }
                                else if (lname.Equals("sysMallocArray"))
                                {
                                    lret = this.sysMallocArray(args, func);

                                }
                                else if (lname.Equals("sysClean"))
                                {
                                    lret = this.sysClean(args, func);

                                }
                                else
                                {
                                    this.wr("processCall: Warning: system function not found, falling back to handler ");
                                    if (this.systemFunctionHandler != null)
                                    {
                                        lret = this.systemFunctionHandler.call(funcDef.fname, args, this, func);
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
                                this.wr("processCall: Error calling system function: ");
                                this.wrErr(e);
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
                            this.wr("processCall: Error: funcDef should be defined");
                            return null;
                        }

                    }
                    else if (hasUrl)
                    {
                        //call URL function
                        //?type=call&name=urlFunc1&args=
                        try
                        {
                            ret = this.processUrlCall(url + "?type=call&name=" + HttpUtility.UrlEncode(name) + "&args=" + HttpUtility.UrlEncode(Utils.JSONstringify(args)));
                        }
                        catch (Exception e)
                        {
                            ret = null;
                        }

                        if (ret != null)
                        {
                            var lret = this.getConst(ret.val.type, ret.val.v);
                            if (this.VERBOSE)
                            {
                                this.wr("processCall: Returning:");
                                this.wrObj(lret);
                            }

                            return lret;
                        }
                        else
                        {
                            this.wr("processCall: Error: function returned a null value");
                            return null;
                        }

                    }
                    else
                    {
                        //call normal function                        
                        if (funcDef != null)
                        {
                            //backup default args
                            funcDef.vars_def = this.cloneJsonObjList(funcDef.vars);
                            funcDef.args_def = this.cloneJsonObjList(funcDef.args);
                            funcDef.args = args;

                            if (this.VERBOSE)
                            {
                                this.wr("processCall: Process Function: " + funcDef.name);
                            }

                            //backup default ret
                            funcDef.ret_def = this.cloneJsonObj(funcDef.ret);
                            ret = this.processFunc(funcDef);

                            //restore args and ret
                            funcDef.vars = funcDef.vars_def;
                            funcDef.args = funcDef.args_def;
                            funcDef.ret = funcDef.ret_def;

                            if (ret != null)
                            {
                                if (!(ret.val.type.Equals(funcDef.ret_def.type)))
                                {
                                    this.wr("processCall: Error: function return type mismatch, return type " + ret.val.type + " expected " + funcDef.ret_def.type);
                                    return null;
                                }
                                else
                                {
                                    JsonObjSysBase lret = this.getConst(ret.val.type, ret.val.v);
                                    if (this.VERBOSE)
                                    {
                                        this.wr("processCall: Returning:");
                                        this.wrObj(lret);
                                    }

                                    return lret;
                                }
                            }
                            else
                            {
                                this.wr("processCall: Error: function returned a null value");
                                return null;
                            }
                        }
                        else
                        {
                            this.wr("processCall: Error: function returned a null value");
                            return null;
                        }
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
                JsonObjSysBase ret = new JsonObjSysBase("val");
                ret.type = left.val.type;
                ret.v = null;

                JsonObjSysBase ret2 = new JsonObjSysBase("const");
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
        public bool hasReplDirectives(string src)
        {
            if (src == null)
            {
                this.wr("hasReplDirectives: Error: argument src cannot be null.");
                return false;
            }

            if (src.IndexOf("@(repl::") == -1)
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
            nsrc = nsrc.Replace("\\u0026", "&");
            nsrc = nsrc.Replace("\\u003d", "=");
            nsrc = nsrc.Replace("\\u003e", ">");

            nsrc = nsrc.Replace("\\\\u0026", "&");
            nsrc = nsrc.Replace("\\\\u003d", "=");
            nsrc = nsrc.Replace("\\\\u003e", ">");

            for (int i = 0; i < keys.Length; i++)
            {
                string fnd = "@(repl::" + keys[i] + ")";
                nsrc = nsrc.Replace(fnd, values[i]);
            }

            return nsrc;
        }
    }
}
