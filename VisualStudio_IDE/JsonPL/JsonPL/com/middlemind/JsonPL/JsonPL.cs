using com.middlemind.JsonPL.FileIO;
using com.middlemind.JsonPL.JsonObjs;
using com.middlemind.JsonPL.Loaders;
using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL {
   /**
   * TODO
   * @author Victor G. Brusca, Middlemind Games 03/27/2022 10:37 AM EDT
   */
   public class JsonPL {
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

      //EXTRA DEMO CODE
      /*
          ,
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
      */

      /**
       * TODO
       * @param args 
       */
   public static void Main(string[] args) {
         Logger.wrl("JsonPL: main: ");
         string tmpStr;

         try {
            tmpStr = FileLoader.LoadStr(JsonPL.codeStr);
            JsonPL.codeStr = tmpStr;
         } catch (Exception e) {
            Logger.wrl("Could not read json data file in code file: " + JsonPL.codeStr);
            Logger.wrlErr(e.ToString());
            return;
         }

         try {
            tmpStr = FileLoader.LoadStr(JsonPL.code2Str);
            JsonPL.code2Str = tmpStr;
         } catch (Exception e) {
            Logger.wrl("Could not read json data file in code2 file: " + JsonPL.code2Str);
            Logger.wrlErr(e.ToString());
            return;
         }

         try {
            tmpStr = FileLoader.LoadStr(JsonPL.sfuncsStr);
            JsonPL.sfuncsStr = tmpStr;
         } catch (Exception e) {
            Logger.wrl("Could not read json data file in sfuncs file: " + JsonPL.sfuncsStr);
            Logger.wrlErr(e.ToString());
            return;
         }

         LoaderSysBase ldr = new LoaderSysBase();

         /////////////////////////TEST SECTION
         JsonPlState jpl = new JsonPlState();
         try {
            JsonPL.code = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            JsonPL.code2 = ldr.ParseJson(JsonPL.code2Str, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            JsonPL.sfuncs = ldr.ParseJson(JsonPL.sfuncsStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");

            if (jpl.system.ContainsKey("functions")) {
               jpl.system.Remove("functions");
            }
            jpl.system.Add("functions", JsonPL.sfuncs.funcs);
            jpl.program = JsonPL.code;
            if (!jpl.validateSysObjClass(jpl.program)) {
               jpl.wr("runProgram: Error: could not validate the class object.");
               return;
            }

            JsonObjSysBase res = null;
            JsonObjSysBase tmp = null;
            string tmpJson;

            /////////////////////////TESTS: REFERENCE
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjRef(tmp)) {
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
            if (!jpl.validateSysObjRef(tmp)) {
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
            if (!jpl.validateSysObjRef(tmp)) {
               jpl.wr("!invalid JSON");
               return;
            }
            jpl.wr("====================== TEST 1.20: Function Variable Reference ======================");
            jpl.wrObj(tmp);
            jpl.wr("REF 3:");
            res = jpl.processRef(tmp, code.funcs[0]);
            jpl.wrObj(res);

            /////////////////////////TESTS: ASSIGNMENT
            /*
            <!-  
               {
                  "sys": "asgn",
                  "left": {ref},
                  "op": {op & type of asgn}, 
                  "right": {ref | const | exp | bex | call}
               }
            -!>
            */
            tmpJson = string.Join("\n", "{",
               "\"sys\": \"asgn\",",
               "\"left\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}},",
               "\"op\": {\"sys\":\"op\", \"type\":\"asgn\", \"v\":\"=\"},",
               "\"right\": {\"sys\":\"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}",
               "}"
            );
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjAsgn(tmp)) {
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
            if (!jpl.validateSysObjAsgn(tmp)) {
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
            <!-  
               {
                  "sys": "bex",
                  "left": {ref | const | exp | bex | call},
                  "op": {op & type of bex}, 
                  "right": {ref | const | exp | bex | call}
               }
            -!>
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
            res = jpl.processCall(tmp, code.funcs[0]);
            jpl.wr("CALL RESULT:");
            jpl.wrObj(res);
            jpl.wr("CALL FUNCS[1] ARGS:");
            jpl.wrObj(code.funcs[1].args);

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
            string callFuncName = callObj.name;
            JsonObjSysBase callFunc = jpl.findFunc(callFuncName);
            res = jpl.processCall(callObj, callFunc);
            jpl.wr("RUN FUNCTION 1: " + callFuncName);
            jpl.wrObj(res);

            res = jpl.processCall(callObj, callFunc);
            jpl.wr("RUN FUNCTION 2: " + callFuncName);
            jpl.wrObj(res);

            jpl = new JsonPlState();
            if (jpl.system.ContainsKey("functions")) {
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
            if (jpl.system.ContainsKey("functions")) {
               jpl.system.Remove("functions");
            }
            jpl.system.Add("functions", JsonPL.sfuncs.funcs);
            tmp = ldr.ParseJson(JsonPL.code2Str, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.program = tmp;
            tmp = jpl.program;
            jpl.wr("====================== TEST 11.00: Full Program 3 ======================");
            jpl.wrObj(tmp);
            jpl.runProgram();

         } catch (Exception e) {
            Logger.wrl("Error!");
            Logger.wrlErr(e.ToString());
         }
      }

      public static string test(string[] dataFromAjax, JsonObjSysBase jplCodeFromAjax) {
         Logger.wrl("test method");
         JsonPlState jpl = new JsonPlState();

         if (jpl.system.ContainsKey("functions")) {
            jpl.system.Remove("functions");
         }
         jpl.system.Add("functions", JsonPL.sfuncs.funcs);

         jpl.program = jplCodeFromAjax;
         jpl.program.vars[0].val.v = dataFromAjax[0];
         jpl.program.vars[1].val.v = dataFromAjax[1];
         var tmp = jpl.runProgram();
         return tmp.val.v;
      }
   }
}
