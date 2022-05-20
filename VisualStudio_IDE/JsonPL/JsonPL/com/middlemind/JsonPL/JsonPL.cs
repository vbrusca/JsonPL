using com.middlemind.JsonPL.FileIO;
using com.middlemind.JsonPL.JsonObjs;
using com.middlemind.JsonPL.Loaders;
using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL
{
    /**
    * TODO
    * 
    * @author Victor G. Brusca, Middlemind Games 03/27/2022 10:37 AM EDT
    */
    public class JsonPL
    {

        /**
         * 
         */
        public static string sfuncsStr = "../../../cfg/system_functions.json";

        /**
         * 
         */
        public static JsonObjSysBase sfuncs;

        /**
         * 
         */
        public static string codeStr = "../../../cfg/code.json";

        /**
         * 
         */
        public static JsonObjSysBase code;

        /**
         * 
         */
        public static string code2Str = "../../../cfg/code2.json";

        /**
         * 
         */
        public static JsonObjSysBase code2;

        /**
         * Name: main (init in JavaScript)
         * Desc: A function to init the test page.
         * @param args 
         */
        public static void Main(string[] args)
        {
            Logger.wrl("JsonPL: main: ");
            string tmpStr;
            LoaderSysBase ldr = null;
            JsonPlState jpl = null;
            JsonObjSysBase res = null;
            JsonObjSysBase tmp = null;
            string tmpJson = null;
            string desc = null;
            string root = "../../../cfg/";

            if (args.Length >= 1)
            {
                string target = root + args[0] + ".json";
                string json = null;

                if (args.Length == 2)
                {
                    //TODO: test14, test15, test16, 
                    //TODO: test17, test19, test20, 
                    //TODO: test21, test23            
                    target = root + "test21" + ".json";
                }

                Logger.wrl("JsonPL: running program: " + target);
                try
                {
                    tmpStr = FileLoader.LoadStr(target);
                    json = tmpStr;
                }
                catch (Exception e)
                {
                    Logger.wrl("Could not read json data file in code file: " + target);
                    Logger.wrlErr(e.Message);
                    Logger.wrlErr(e.StackTrace);
                    return;
                }

                try
                {
                    tmpStr = FileLoader.LoadStr(JsonPL.sfuncsStr);
                    JsonPL.sfuncsStr = tmpStr;
                }
                catch (Exception e)
                {
                    Logger.wrl("Could not read json data file in sfuncs file: " + JsonPL.sfuncsStr);
                    Logger.wrlErr(e.Message);
                    Logger.wrlErr(e.StackTrace);
                    return;
                }

                ldr = new LoaderSysBase();
                jpl = new JsonPlState();
                res = null;
                tmp = null;
                tmpJson = null;
                desc = null;

                try
                {
                    JsonPL.sfuncs = ldr.ParseJson(JsonPL.sfuncsStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (jpl.system.ContainsKey("functions"))
                    {
                        jpl.system.Remove("functions");
                    }
                    jpl.system.Add("functions", JsonPL.sfuncs.funcs);

                    jpl.program = ldr.ParseJson(json, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjClass(jpl.program))
                    {
                        jpl.wr("runProgram: Error: could not validate the class object.");
                        return;
                    }

                    if (target.Equals("test0.json"))
                    {
                        desc = "A test to demonstrate getting a length from a class variable of type array.";
                    }
                    else
                    {
                        desc = "Running program: " + target;
                    }

                    jpl.wr(desc);
                    jpl.wr("====================== Program Results ======================");
                    jpl.runProgram();

                }
                catch (Exception e)
                {
                    Logger.wrl("Could not read json data file in code file: " + target);
                    Logger.wrlErr(e.Message);
                    Logger.wrlErr(e.StackTrace);
                }

            }
            else
            {
                Logger.wrl("JsonPL: running program: default demo");
                try
                {
                    tmpStr = FileLoader.LoadStr(JsonPL.codeStr);
                    JsonPL.codeStr = tmpStr;
                }
                catch (Exception e)
                {
                    Logger.wrl("Could not read json data file in code file: " + JsonPL.codeStr);
                    Logger.wrlErr(e.ToString());
                    return;
                }

                try
                {
                    tmpStr = FileLoader.LoadStr(JsonPL.code2Str);
                    JsonPL.code2Str = tmpStr;
                }
                catch (Exception e)
                {
                    Logger.wrl("Could not read json data file in code2 file: " + JsonPL.code2Str);
                    Logger.wrlErr(e.ToString());
                    return;
                }

                try
                {
                    tmpStr = FileLoader.LoadStr(JsonPL.sfuncsStr);
                    JsonPL.sfuncsStr = tmpStr;
                }
                catch (Exception e)
                {
                    Logger.wrl("Could not read json data file in sfuncs file: " + JsonPL.sfuncsStr);
                    Logger.wrlErr(e.ToString());
                    return;
                }

                ldr = new LoaderSysBase();

                /////////////////////////TEST SECTION
                jpl = new JsonPlState();
                try
                {
                    JsonPL.code = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    JsonPL.code2 = ldr.ParseJson(JsonPL.code2Str, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    JsonPL.sfuncs = ldr.ParseJson(JsonPL.sfuncsStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");

                    if (jpl.system.ContainsKey("functions"))
                    {
                        jpl.system.Remove("functions");
                    }
                    jpl.system.Add("functions", JsonPL.sfuncs.funcs);
                    jpl.program = JsonPL.code;
                    if (!jpl.validateSysObjClass(jpl.program))
                    {
                        jpl.wr("runProgram: Error: could not validate the class object.");
                        return;
                    }

                    res = null;
                    tmp = null;
                    tmpJson = null;


                    /////////////////////////////////////////////////////////////////////////////
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.[$.vars.name1]\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 0.00: Class Variable Reference ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 1:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);


                    /////////////////////////TESTS: REFERENCE
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 1.00: Class Variable Reference ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 1:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);

                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 1.10: Function Argument Reference ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 2:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);

                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.vars.b1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 1.20: Function Variable Reference ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 3:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);

                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"[#.vars.tmp5]\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.validateSysObjRef(tmp);
                    jpl.wr("====================== TEST 1.30: Full Dynamic Variable Reference ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 4:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);


                    /////////////////////////TESTS: ASSIGNMENT
                    /*
                    {
                       "sys": "asgn",
                       "left": {ref},
                       "op": {op & type of asgn}, 
                       "right": {ref | const | exp | bex | call}
                    }
                    */
                    tmpJson = string.Join("\n", "{",
                       "\"sys\": \"asgn\",",
                       "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                       "\"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjAsgn(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 2.00: Assignment (Class variable to function argument) ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processAsgn(tmp, code.funcs[0]);
                    jpl.wr("ASGN RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST ASGN VALUE:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF #.vars.tmp1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);

                    tmpJson = string.Join("\n", "{",
                       "\"sys\": \"asgn\",",
                       "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                       "\"right\": {\"sys\":\"const\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"32\"}}",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjAsgn(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 2.10: Assignment (Constant value to function argument) ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processAsgn(tmp, code.funcs[0]);
                    jpl.wr("ASGN RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST ASGN VALUE:");
                    jpl.wrObj(res);

                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"asgn\",",
                       "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                       "\"right\": {\"sys\": \"exp\", \"left\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\", \"type\": \"int\", \"v\": \"25\"}}, \"op\": {\"sys\":\"op\", \"type\":\"exp\", \"v\":\"+\"}, \"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}}",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 2.20: Assignment (Expression value to function argument) ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processAsgn(tmp, code.funcs[0]);
                    jpl.wr("ASGN RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST ASGN VALUE:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastExpReturn\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST EXP RETURN:");
                    jpl.wrObj(res);

                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"asgn\",",
                       "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.vars.b1\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                       "\"right\": {\"sys\": \"bex\", \"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}, \"op\": {\"sys\":\"op\", \"type\":\"bex\", \"v\":\"==\"}, \"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}}",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 2.30: Assignment (Boolean Expression value to function variable) ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processAsgn(tmp, code.funcs[0]);
                    jpl.wr("ASGN RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST ASGN VALUE:");
                    jpl.wrObj(res);

                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"asgn\",",
                       "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.vars.b1\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                       "\"right\": {\"sys\": \"call\", \"name\": \"testFunction3\", \"args\": [{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}]}",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 2.40: Assignment (Function Call value to function variable) ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processAsgn(tmp, code.funcs[0]);
                    jpl.wr("ASGN RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST ASGN VALUE:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF #.vars.tmp1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);


                    ///////////////////////////TESTS: BOOLEAN EXPRESSIONS
                    /* 
                    {
                       "sys": "bex",
                       "left": {ref | const | exp | bex | call},
                       "op": {op & type of bex}, 
                       "right": {ref | const | exp | bex | call}
                    }
                    */
                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"bex\",",
                       "\"left\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\", \"type\": \"int\", \"v\": \"25\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"bex\", \"v\":\"==\"},",
                       "\"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 3.00: Boolean Expression (Function argument to Constant value) ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processBex(tmp, code.funcs[0]);
                    jpl.wr("BEX RESULT: (EXPECTS: FALSE)");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF $.args.i1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);

                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"bex\",",
                       "\"left\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\", \"type\": \"int\", \"v\": \"25\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"bex\", \"v\":\">=\"},",
                       "\"right\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\", \"type\": \"int\", \"v\": \"25\"}}",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 3.05: Boolean Expression (Constant value to Constant value) ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processBex(tmp, code.funcs[0]);
                    jpl.wr("BEX RESULT: (EXPECTS: TRUE)");
                    jpl.wrObj(res);


                    ///////////////////////////TESTS: NUMERIC EXPRESSIONS
                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"exp\",",
                       "\"left\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\", \"type\": \"int\", \"v\": \"25\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"exp\", \"v\":\"+\"},",
                       "\"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 4.00: Expression ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processExp(tmp, code.funcs[0]);
                    jpl.wr("EXP RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF $.args.i1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);


                    ///////////////////////////TESTS: FUNCTION CALLS
                    tmpJson = "{\"sys\": \"call\", \"name\": \"testFunction2\", \"args\": [{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}]}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 5.00: Function Call ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processCall(tmp, code.funcs[1]);
                    jpl.wr("CALL RESULT:");
                    jpl.wrObj(res);
                    jpl.wr("CALL FUNCS[1] ARGS:");
                    jpl.wrObjList(code.funcs[1].args);

                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"if\",",
                       "\"left\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\",\"type\": \"bool\",\"v\": \"true\"}},",
                       "\"op\": {\"sys\":\"op\", \"type\":\"bex\", \"v\":\"==\"},",
                       "\"right\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\",\"type\": \"bool\",\"v\": \"true\"}},",
                       "\"thn\": [",
                          "{",
                             "\"sys\": \"asgn\",",
                             "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}},",
                             "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                             "\"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}",
                          "}",
                       "],",
                       "\"els\": [",
                          "{",
                             "\"sys\": \"asgn\",",
                             "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}},",
                             "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                             "\"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}",
                          "}",
                       "]",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 6.00: If Statement ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processIf(tmp, code.funcs[0]);
                    jpl.wr("IF RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF $.args.i1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF #.vars.tmp1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST ASGN VALUE:");
                    jpl.wrObj(res);

                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"for\",",
                       "\"start\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\",\"type\": \"int\",\"v\": \"0\"}},",
                       "\"stop\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\",\"type\": \"int\",\"v\": \"10\"}},",
                       "\"inc\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\",\"type\": \"int\",\"v\": \"1\"}},",
                       "\"lines\": [",
                          "{",
                             "\"sys\": \"asgn\",",
                             "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}},",
                             "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                             "\"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}",
                          "}",
                       "]",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("====================== TEST 7.00: For Loop ======================");
                    jpl.wrObj(tmp);
                    res = jpl.processFor(tmp, code.funcs[0]);
                    jpl.wr("FOR RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF $.args.i1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF #.vars.tmp1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST ASGN VALUE:");
                    jpl.wrObj(res);

                    jpl.wr("====================== TEST 7.10: For Loop ======================");
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF $.args.i1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);
                    tmpJson = string.Join("\n",
                       "{",
                       "\"sys\": \"for\",",
                       "\"start\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\",\"type\": \"int\",\"v\": \"0\"}},",
                       "\"stop\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\",\"type\": \"int\",\"v\": \"10\"}},",
                       "\"inc\": {\"sys\": \"const\", \"val\": {\"sys\": \"val\",\"type\": \"int\",\"v\": \"1\"}},",
                       "\"lines\": [",
                          "{",
                             "\"sys\": \"asgn\",",
                             "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}},",
                             "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
                             "\"right\": {\"sys\": \"exp\", \"left\": {\"sys\": \"ref\", \"val\": {\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}, \"op\": {\"sys\":\"op\", \"type\":\"exp\", \"v\":\"+\"}, \"right\": {\"sys\":\"const\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"1\"}}}",
                          "}",
                       "]",
                       "}"
                    );
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");

                    jpl.wrObj(tmp);
                    res = jpl.processFor(tmp, code.funcs[0]);
                    jpl.wr("FOR RESULT:");
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.wr("REF $.args.i1 VAL:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);
                    tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    res = jpl.processCall(tmp, code.funcs[0]);
                    jpl.wr("LAST ASGN VALUE:");
                    jpl.wrObj(res);

                    jpl.wr("====================== TEST 8.00: Call Statement ======================");
                    JsonObjSysBase callObj = code.call;
                    string callFuncName = jpl.toStr(callObj.name);
                    JsonObjSysBase callFunc = jpl.findFunc(callFuncName);
                    res = jpl.processCall(callObj, callFunc);
                    jpl.wr("RUN FUNCTION 1: " + callFuncName);
                    jpl.wrObj(res);

                    res = jpl.processCall(callObj, callFunc);
                    jpl.wr("RUN FUNCTION 2: " + callFuncName);
                    jpl.wrObj(res);

                    jpl = new JsonPlState();
                    if (jpl.system.ContainsKey("functions"))
                    {
                        jpl.system.Remove("functions");
                    }
                    jpl.system.Add("functions", JsonPL.sfuncs.funcs);

                    tmp = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.program = tmp;
                    tmp = jpl.program;
                    jpl.wr("====================== TEST 9.00: Full Program 1 ======================");
                    jpl.wrObj(tmp);
                    jpl.runProgram();

                    jpl.wr("====================== TEST 10.00: Full Program 2 ======================");
                    string[] jplData = new string[] { "33", "true" };
                    tmp = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    JsonObjSysBase jplCode = tmp;

                    jpl.wr("TEST METHOD");
                    tmpJson = string.Join("\n",
                       "public static string test(string[] dataFromAjax, JsonObjSysBase jplCodeFromAjax) {",
                       "   Logger.wrl(\"test method\");",
                       "   JsonPlState jpl = new JsonPlState();",
                       "",
                       "   if(jpl.system.containsKey(\"functions\")) {",
                       "      jpl.system.remove(\"functions\");",
                       "   }",
                       "   jpl.system.put(\"functions\", JsonPL.sfuncs.funcs);",
                       "   jpl.program = jplCodeFromAjax;",
                       "   jpl.program.vars[0].val.v = dataFromAjax[0];",
                       "   jpl.program.vars[1].val.v = dataFromAjax[1];",
                       "   JsonObjSysBase tmp = jpl.runProgram();",
                       "   return tmp.val.v;",
                       "}"
                    );
                    jpl.wr(tmpJson);

                    jpl.wr("TEST METHOD DATA");
                    jpl.wr("{\"33\", \"true\"}");

                    string jplRes = test(jplData, jplCode);
                    jpl.wr("Example Code Result: " + jplRes);

                    jpl = new JsonPlState();
                    if (jpl.system.ContainsKey("functions"))
                    {
                        jpl.system.Remove("functions");
                    }
                    jpl.system.Add("functions", JsonPL.sfuncs.funcs);
                    tmp = ldr.ParseJson(JsonPL.code2Str, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    jpl.program = tmp;
                    tmp = jpl.program;
                    jpl.wr("====================== TEST 11.00: Full Program 3 ======================");
                    jpl.wrObj(tmp);
                    jpl.runProgram();


                    /////////////////////////////////////////////////////////////////////////////
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.[$.vars.name1]\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 12.00: Class Variable Reference ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 1:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);

                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.[$.vars.[$.vars.name2]]\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 12.01: Dynamic Class Variable Reference 2 ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 1:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);


                    /////////////////////////////////////////////////////////////////////////////
                    //tmp = '{"sys": "ref", "val":{"sys": "val", "type": "int", "v": "#.vars.[$.vars.[$.vars.name2]]"}};';
                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"@(repl::classOrFunc).vars.[$.@(repl::varsOrArgs).[$.vars.@(repl::varOrArgName)]]\"}}";
                    jpl.wr("====================== TEST 13.00: Pre-Processing Replacement Directives Prep ======================");
                    jpl.wr("Check for replace directives in string form.");
                    if (jpl.hasReplDirectives(tmpJson))
                    {
                        jpl.wr("Found replace directives...");
                        jpl.wr("Before: " + tmpJson);
                        List<String> keys = new List<String>();
                        List<String> vals = new List<String>();
                        keys.Add("varOrArgName");
                        vals.Add("name2");

                        keys.Add("varsOrArgs");
                        vals.Add("vars");

                        keys.Add("classOrFunc");
                        vals.Add("#");

                        string[] keysA = new string[keys.Count];
                        keysA = keys.ToArray();

                        string[] valsA = new string[vals.Count];
                        valsA = vals.ToArray();

                        tmpJson = jpl.processReplDirectives(keysA, valsA, tmpJson);
                        jpl.wr("After: " + tmpJson);
                    }

                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }

                    jpl.wr("====================== TEST 13.00: Pre-Processing Replacement Directives Execution ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 1:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);


                    /////////////////////////TESTS: REFERENCE ARRAY            
                    jpl = new JsonPlState();
                    jpl.program = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");

                    if (!jpl.validateSysObjClass(jpl.program))
                    {
                        jpl.wr("runProgram: Error: could not validate the class object.");
                        return;
                    }

                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp4\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 13.01: Class Variable Array Reference ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 1:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);

                    tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp4.0\"}}";
                    tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                    if (!jpl.validateSysObjRef(tmp))
                    {
                        jpl.wr("!invalid JSON");
                        return;
                    }
                    jpl.wr("====================== TEST 13.02: Class Variable Array Index Reference ======================");
                    jpl.wrObj(tmp);
                    jpl.wr("REF 1:");
                    res = jpl.processRef(tmp, code.funcs[0]);
                    jpl.wrObj(res);
                }
                catch (Exception e)
                {
                    Logger.wrl("Error!");
                    Logger.wrlErr(e.ToString());
                }
            }
        }

        public static string test(string[] dataFromAjax, JsonObjSysBase jplCodeFromAjax)
        {
            Logger.wrl("test method");
            JsonPlState jpl = new JsonPlState();

            if (jpl.system.ContainsKey("functions"))
            {
                jpl.system.Remove("functions");
            }
            jpl.system.Add("functions", JsonPL.sfuncs.funcs);

            jpl.program = jplCodeFromAjax;
            jpl.program.vars[0].val.v = dataFromAjax[0];
            jpl.program.vars[1].val.v = dataFromAjax[1];
            var tmp = jpl.runProgram();
            return (tmp.val.v + "");
        }
    }
}
