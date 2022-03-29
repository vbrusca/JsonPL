package com.middlemind.JsonPL;

import com.middlemind.JsonPL.FileIO.FileLoader;
import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;
import com.middlemind.JsonPL.Loaders.LoaderSysBase;

/**
 * TODO
 * @author Victor G. Brusca, Middlemind Games 03/27/2022 10:37 AM EDT
 */
public class JsonPL {

   /**
    * 
    */
   public static String codeStr = "code.json";
   public static JsonObjSysBase code;
   
   /**
    * 
    */
   public static String code2Str = "code2.json";
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
   @SuppressWarnings({"CallToPrintStackTrace", "UseSpecificCatch", "UnusedAssignment"})
   public static void main(String args[]) {
      Logger.wrl("JsonPL: main: ");
      String tmpStr;
      
      try {
          tmpStr = FileLoader.LoadStr(JsonPL.codeStr);
          JsonPL.codeStr = tmpStr;
      } catch (Exception e) {
         Logger.wrl("Could not read json data file in code file: " + JsonPL.code);
         e.printStackTrace();
         return;
      }
      
      try {
         tmpStr = FileLoader.LoadStr(JsonPL.code2Str);
         JsonPL.code2Str = tmpStr;
      } catch (Exception e) {
         Logger.wrl("Could not read json data file in code2 file: " + JsonPL.code2);
         e.printStackTrace();
         return;
      }
      
      LoaderSysBase ldr = new LoaderSysBase();
      
      /////////////////////////TEST SECTION
      JsonPlState jpl = new JsonPlState();
      try {
         JsonPL.code = ldr.ParseJson(JsonPL.codeStr, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
         JsonPL.code2 = ldr.ParseJson(JsonPL.code2Str, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");               

         jpl.program = JsonPL.code;
         if(!jpl.validateSysObjClass(jpl.program)) {
            jpl.wr("runProgram: Error: could not validate the class object.");
         }
         
         JsonObjSysBase res = null;
         JsonObjSysBase tmp = null;
         String tmpJson;

         /////////////////////////TESTS: REFERENCE
         tmpJson = "{\"sys\": \"ref\", \"val\":{\"sys\": \"val\", \"type\": \"int\", \"v\": \"#.vars.tmp1\"}}";
         tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
         jpl.wr("====================== TEST 1.00: Class Variable Reference ======================");
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
