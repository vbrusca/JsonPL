package com.middlemind.JsonPL;

import com.middlemind.JsonPL.FileIO.FileLoader;
import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;
import com.middlemind.JsonPL.Loaders.LoaderSysBase;
import java.util.ArrayList;

/**
 * TODO
 *
 * @author Victor G. Brusca, Middlemind Games 03/27/2022 10:37 AM EDT
 */
public class JsonPL {

   /**
    *
    */
   public static String sfuncsStr = "system_functions.json";

   /**
    *
    */
   public static JsonObjSysBase sfuncs;

   /**
    *
    */
   public static String codeStr = "code.json";

   /**
    *
    */
   public static JsonObjSysBase code;

   /**
    *
    */
   public static String code2Str = "code2.json";

   /**
    *
    */
   public static JsonObjSysBase code2;

   /**
    * Name: main (init in JavaScript) Desc: A function to init the test page.
    *
    * @param args
    */
   @SuppressWarnings({"CallToPrintStackTrace", "UseSpecificCatch", "UnusedAssignment"})
   public static void main(String[] args) {
      Logger.wrl("JsonPL: main: ");
      String tmpStr;
      LoaderSysBase ldr = null;
      JsonPlState jpl = null;
      JsonObjSysBase res = null;
      JsonObjSysBase tmp = null;
      String tmpJson = null;
      String desc = null;
      String root = "";

      if (args.length >= 1) {
         String target = root + args[0] + ".json";
         String json = null;

         if (args.length == 2) {
            //TODO: test15, test16, 
            //TODO: test17, test18, test19, test20, 
            //TODO: test21, test22, test23            
            target = root + "test20" + ".json";
         }

         Logger.wrl("JsonPL: running program: " + target);
         try {
            tmpStr = FileLoader.LoadStr(target);
            json = tmpStr;
         } catch (Exception e) {
            Logger.wrl("Could not read json data file in code file: " + target);
            e.printStackTrace();
            return;
         }

         try {
            tmpStr = FileLoader.LoadStr(JsonPL.sfuncsStr);
            JsonPL.sfuncsStr = tmpStr;
         } catch (Exception e) {
            Logger.wrl("Could not read json data file in sfuncs file: " + JsonPL.sfuncsStr);
            e.printStackTrace();
            return;
         }

         ldr = new LoaderSysBase();
         jpl = new JsonPlState();
         res = null;
         tmp = null;
         tmpJson = null;
         desc = null;

         try {
            JsonPL.sfuncs = ldr.ParseJson(JsonPL.sfuncsStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (jpl.system.containsKey("functions")) {
               jpl.system.remove("functions");
            }
            jpl.system.put("functions", JsonPL.sfuncs.funcs);

            jpl.program = ldr.ParseJson(json, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjClass(jpl.program)) {
               jpl.wr("runProgram: Error: could not validate the class object.");
               return;
            }

            if (target.equals("test0.json")) {
               desc = "A test to demonstrate getting a length from a class variable of type array.";
            } else {
               desc = "Running program: " + target;
            }

            jpl.wr(desc);
            jpl.wr("====================== Program Results ======================");
            jpl.runProgram();

         } catch (Exception e) {
            Logger.wrl("Could not read json data file in code file: " + target);
            e.printStackTrace();
         }

      } else {
         Logger.wrl("JsonPL: running program: default demo");
         try {
            tmpStr = FileLoader.LoadStr(JsonPL.codeStr);
            JsonPL.codeStr = tmpStr;
         } catch (Exception e) {
            Logger.wrl("Could not read json data file in code file: " + JsonPL.codeStr);
            e.printStackTrace();
            return;
         }

         try {
            tmpStr = FileLoader.LoadStr(JsonPL.code2Str);
            JsonPL.code2Str = tmpStr;
         } catch (Exception e) {
            Logger.wrl("Could not read json data file in code2 file: " + JsonPL.code2Str);
            e.printStackTrace();
            return;
         }

         try {
            tmpStr = FileLoader.LoadStr(JsonPL.sfuncsStr);
            JsonPL.sfuncsStr = tmpStr;
         } catch (Exception e) {
            Logger.wrl("Could not read json data file in sfuncs file: " + JsonPL.sfuncsStr);
            e.printStackTrace();
            return;
         }

         ldr = new LoaderSysBase();

         /////////////////////////TEST SECTION
         jpl = new JsonPlState();
         try {
            JsonPL.code = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            JsonPL.code2 = ldr.ParseJson(JsonPL.code2Str, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            JsonPL.sfuncs = ldr.ParseJson(JsonPL.sfuncsStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");

            if (jpl.system.containsKey("functions")) {
               jpl.system.remove("functions");
            }
            jpl.system.put("functions", JsonPL.sfuncs.funcs);
            jpl.program = JsonPL.code;
            if (!jpl.validateSysObjClass(jpl.program)) {
               jpl.wr("runProgram: Error: could not validate the class object.");
               return;
            }

            res = null;
            tmp = null;
            tmpJson = null;

            /////////////////////////////////////////////////////////////////////////////
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.[$.vars.name1]\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjRef(tmp)) {
               jpl.wr("!invalid JSON");
               return;
            }
            jpl.wr("====================== TEST 0.00: Dynamic Class Variable Reference ======================");
            jpl.wrObj(tmp);
            jpl.wr("REF 1:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

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
            res = jpl.processRef(tmp, code.funcs.get(0));
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
            res = jpl.processRef(tmp, code.funcs.get(0));
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
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"[#.vars.tmp5]\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjRef(tmp)) {
               jpl.wr("!invalid JSON");
               return;
            }
            jpl.validateSysObjRef(tmp);
            jpl.wr("====================== TEST 1.30: Full Dynamic Variable Reference ======================");
            jpl.wrObj(tmp);
            jpl.wr("REF 4:");
            res = jpl.processRef(tmp, code.funcs.get(0));
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
            tmpJson = String.join("\n", "{",
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
            res = jpl.processAsgn(tmp, code.funcs.get(0));
            jpl.wr("ASGN RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST ASGN VALUE:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF #.vars.tmp1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

            tmpJson = String.join("\n", "{",
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
            res = jpl.processAsgn(tmp, code.funcs.get(0));
            jpl.wr("ASGN RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST ASGN VALUE:");
            jpl.wrObj(res);

            tmpJson = String.join("\n",
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
            res = jpl.processAsgn(tmp, code.funcs.get(0));
            jpl.wr("ASGN RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST ASGN VALUE:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastExpReturn\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST EXP RETURN:");
            jpl.wrObj(res);

            tmpJson = String.join("\n",
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
            res = jpl.processAsgn(tmp, code.funcs.get(0));
            jpl.wr("ASGN RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST ASGN VALUE:");
            jpl.wrObj(res);

            tmpJson = String.join("\n",
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
            res = jpl.processAsgn(tmp, code.funcs.get(0));
            jpl.wr("ASGN RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST ASGN VALUE:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF #.vars.tmp1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
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
            tmpJson = String.join("\n",
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
            res = jpl.processBex(tmp, code.funcs.get(0));
            jpl.wr("BEX RESULT: (EXPECTS: FALSE)");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF $.args.i1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

            tmpJson = String.join("\n",
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
            res = jpl.processBex(tmp, code.funcs.get(0));
            jpl.wr("BEX RESULT: (EXPECTS: TRUE)");
            jpl.wrObj(res);

            ///////////////////////////TESTS: NUMERIC EXPRESSIONS
            tmpJson = String.join("\n",
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
            res = jpl.processExp(tmp, code.funcs.get(0));
            jpl.wr("EXP RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF $.args.i1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

            ///////////////////////////TESTS: FUNCTION CALLS
            tmpJson = "{\"sys\": \"call\", \"name\": \"testFunction2\", \"args\": [{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}]}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("====================== TEST 5.00: Function Call ======================");
            jpl.wrObj(tmp);
            res = jpl.processCall(tmp, code.funcs.get(1));
            jpl.wr("CALL RESULT:");
            jpl.wrObj(res);
            jpl.wr("CALL FUNCS[1] ARGS:");
            jpl.wrObjList(code.funcs.get(1).args);

            tmpJson = String.join("\n",
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
            res = jpl.processIf(tmp, code.funcs.get(0));
            jpl.wr("IF RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF $.args.i1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF #.vars.tmp1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST ASGN VALUE:");
            jpl.wrObj(res);

            tmpJson = String.join("\n",
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
            res = jpl.processFor(tmp, code.funcs.get(0));
            jpl.wr("FOR RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF $.args.i1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF #.vars.tmp1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST ASGN VALUE:");
            jpl.wrObj(res);

            jpl.wr("====================== TEST 7.10: For Loop ======================");
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF $.args.i1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);
            tmpJson = String.join("\n",
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
            res = jpl.processFor(tmp, code.funcs.get(0));
            jpl.wr("FOR RESULT:");
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"$.args.i1\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.wr("REF $.args.i1 VAL:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);
            tmpJson = "{\"sys\": \"call\", \"name\": \"SYS::getLastAsgnValue\", \"args\": []}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            res = jpl.processCall(tmp, code.funcs.get(0));
            jpl.wr("LAST ASGN VALUE:");
            jpl.wrObj(res);

            jpl.wr("====================== TEST 8.00: Call Statement ======================");
            JsonObjSysBase callObj = code.call;
            String callFuncName = jpl.toStr(callObj.name);
            JsonObjSysBase callFunc = jpl.findFunc(callFuncName);
            res = jpl.processCall(callObj, callFunc);
            jpl.wr("RUN FUNCTION 1: " + callFuncName);
            jpl.wrObj(res);

            res = jpl.processCall(callObj, callFunc);
            jpl.wr("RUN FUNCTION 2: " + callFuncName);
            jpl.wrObj(res);

            jpl = new JsonPlState();
            if (jpl.system.containsKey("functions")) {
               jpl.system.remove("functions");
            }
            jpl.system.put("functions", JsonPL.sfuncs.funcs);

            tmp = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.program = tmp;
            tmp = jpl.program;
            jpl.wr("====================== TEST 9.00: Full Program 1 ======================");
            jpl.wrObj(tmp);
            jpl.runProgram();

            jpl.wr("====================== TEST 10.00: Full Program 2 ======================");
            String[] jplData = new String[]{"33", "true"};
            tmp = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            JsonObjSysBase jplCode = tmp;

            jpl.wr("TEST METHOD");
            tmpJson = String.join("\n",
                    "public static String test(String[] dataFromAjax, JsonObjSysBase jplCodeFromAjax) {",
                    "   Logger.wrl(\"test method\");",
                    "   JsonPlState jpl = new JsonPlState();",
                    "",
                    "   if(jpl.system.containsKey(\"functions\")) {",
                    "      jpl.system.remove(\"functions\");",
                    "   }",
                    "   jpl.system.put(\"functions\", JsonPL.sfuncs.funcs);",
                    "   jpl.program = jplCodeFromAjax;",
                    "   jpl.program.vars.get(0).val.v = dataFromAjax[0];",
                    "   jpl.program.vars.get(1).val.v = dataFromAjax[1];",
                    "   JsonObjSysBase tmp = jpl.runProgram();",
                    "   return tmp.val.v;",
                    "}"
            );
            jpl.wr(tmpJson);

            jpl.wr("TEST METHOD DATA");
            jpl.wr("{\"33\", \"true\"}");

            String jplRes = test(jplData, jplCode);
            jpl.wr("Example Code Result: " + jplRes);

            jpl = new JsonPlState();
            if (jpl.system.containsKey("functions")) {
               jpl.system.remove("functions");
            }
            jpl.system.put("functions", JsonPL.sfuncs.funcs);
            tmp = ldr.ParseJson(JsonPL.code2Str, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            jpl.program = tmp;
            tmp = jpl.program;
            jpl.wr("====================== TEST 11.00: Full Program 3 ======================");
            jpl.wrObj(tmp);
            jpl.runProgram();

            /////////////////////////////////////////////////////////////////////////////
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.[$.vars.name1]\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjRef(tmp)) {
               jpl.wr("!invalid JSON");
               return;
            }
            jpl.wr("====================== TEST 12.00: Dynamic Class Variable Reference ======================");
            jpl.wrObj(tmp);
            jpl.wr("REF 1:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.[$.vars.[$.vars.name2]]\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjRef(tmp)) {
               jpl.wr("!invalid JSON");
               return;
            }
            jpl.wr("====================== TEST 12.01: Dynamic Class Variable Reference 2 ======================");
            jpl.wrObj(tmp);
            jpl.wr("REF 1:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

            /////////////////////////////////////////////////////////////////////////////
            //tmp = '{"sys": "ref", "val":{"sys": "val", "type": "int", "v": "#.vars.[$.vars.[$.vars.name2]]"}};';
            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"@(repl::classOrFunc).vars.[$.@(repl::varsOrArgs).[$.vars.@(repl::varOrArgName)]]\"}}";
            jpl.wr("====================== TEST 13.00: Pre-Processing Replacement Directives Prep ======================");
            jpl.wr("Check for replace directives in string form.");
            if (jpl.hasReplDirectives(tmpJson)) {
               jpl.wr("Found replace directives...");
               jpl.wr("Before: " + tmpJson);
               ArrayList<String> keys = new ArrayList<String>();
               ArrayList<String> vals = new ArrayList<String>();
               keys.add("varOrArgName");
               vals.add("name2");

               keys.add("varsOrArgs");
               vals.add("vars");

               keys.add("classOrFunc");
               vals.add("#");

               String[] keysA = new String[keys.size()];
               keysA = keys.toArray(keysA);

               String[] valsA = new String[vals.size()];
               valsA = vals.toArray(valsA);

               tmpJson = jpl.processReplDirectives(keysA, valsA, tmpJson);
               jpl.wr("After: " + tmpJson);
            }

            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjRef(tmp)) {
               jpl.wr("!invalid JSON");
               return;
            }

            jpl.wr("====================== TEST 13.00: Pre-Processing Replacement Directives Execution ======================");
            jpl.wrObj(tmp);
            jpl.wr("REF 1:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

            /////////////////////////TESTS: REFERENCE ARRAY            
            jpl = new JsonPlState();
            jpl.program = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");

            if (!jpl.validateSysObjClass(jpl.program)) {
               jpl.wr("runProgram: Error: could not validate the class object.");
               return;
            }

            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp4\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjRef(tmp)) {
               jpl.wr("!invalid JSON");
               return;
            }
            jpl.wr("====================== TEST 13.01: Class Variable Array Reference ======================");
            jpl.wrObj(tmp);
            jpl.wr("REF 1:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);

            tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp4.0\"}}";
            tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
            if (!jpl.validateSysObjRef(tmp)) {
               jpl.wr("!invalid JSON");
               return;
            }
            jpl.wr("====================== TEST 13.02: Class Variable Array Index Reference ======================");
            jpl.wrObj(tmp);
            jpl.wr("REF 1:");
            res = jpl.processRef(tmp, code.funcs.get(0));
            jpl.wrObj(res);
         } catch (Exception e) {
            Logger.wrl("Error!");
            e.printStackTrace();
         }
      }
   }

   public static String test(String[] dataFromAjax, JsonObjSysBase jplCodeFromAjax) {
      Logger.wrl("test method");
      JsonPlState jpl = new JsonPlState();

      if (jpl.system.containsKey("functions")) {
         jpl.system.remove("functions");
      }
      jpl.system.put("functions", JsonPL.sfuncs.funcs);

      jpl.program = jplCodeFromAjax;
      jpl.program.vars.get(0).val.v = dataFromAjax[0];
      jpl.program.vars.get(1).val.v = dataFromAjax[1];
      var tmp = jpl.runProgram();
      return (tmp.val.v + "");
   }
}
