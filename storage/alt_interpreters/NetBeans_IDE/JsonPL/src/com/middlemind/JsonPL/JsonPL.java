package com.middlemind.JsonPL;

import com.middlemind.JsonPL.FileIO.FileLoader;
import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;
import com.middlemind.JsonPL.Loaders.LoaderSysBase;
import java.util.ArrayList;

/*
 * Name: JsonPL 
 * Desc: The static entry point for this implementation of the JsonPL interpreter.
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

    /*
     * Name: main (init in JavaScript) 
     * Desc: A function to init the test page.
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
                target = root + "test28" + ".json";
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

            //jpl.processUrlFind("http://localhost:8000/?type=get&ref=%23.vars.ar1.2");
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

                /////////////////////////////////////////////////////////////////////////////
                Object bres = false;
                JsonObjSysBase testObj = null;
                jpl = new JsonPlState();
                jpl.program = JsonPL.code;

                tmpJson = "{\"sys\": \"for\", \"start\": {\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"0\"}}, \"stop\": {\"sys\": \"const\", \"val\": {\"sys\":\"val\", \"type\":\"int\", \"v\":\"10\"}}, \"inc\":{\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"1\"}}, \"lines\":[]}";
                try {
                    testObj = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                } catch (Exception e) {
                    jpl.wrErr(e);
                }

                jpl.wr("====================== TEST -3.10: Unit Tests: toArray ======================");
                bres = jpl.toArray("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.toArray(1);
                jpl.wr("1 is " + bres);

                bres = jpl.toArray(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.toArray(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.toArray(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.toArray(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.toArray("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.toArray(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.toArray(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.toArray(true);
                jpl.wr("true is " + bres);

                bres = jpl.toArray(false);
                jpl.wr("false is " + bres);

                bres = jpl.toArray("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -3.00: Unit Tests: toFloat ======================");
                bres = jpl.toFloat("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.toFloat(1);
                jpl.wr("1 is " + bres);

                bres = jpl.toFloat(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.toFloat(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.toFloat(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.toFloat(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.toFloat("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.toFloat(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.toFloat(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.toFloat(true);
                jpl.wr("true is " + bres);

                bres = jpl.toFloat(false);
                jpl.wr("false is " + bres);

                bres = jpl.toFloat("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -2.90: Unit Tests: toStr ======================");
                bres = jpl.toStr(1);
                jpl.wr("1 is " + bres);

                bres = jpl.toStr(1.24);
                jpl.wr("1.24 is " + bres);

                bres = jpl.toStr(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.toStr(new int[]{1, 2, 3});
                jpl.wr("[1,2,3] is " + bres);

                bres = jpl.toStr("{\"test\":\"test\"}");
                jpl.wr("{\"test\":\"test\"} is " + bres);

                bres = jpl.toStr("testing123");
                jpl.wr("testing123 is " + bres);

                bres = jpl.toStr(false);
                jpl.wr("false is " + bres);

                jpl.wr("====================== TEST -2.80: Unit Tests: toInt ======================");
                bres = jpl.toInt("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.toInt(1);
                jpl.wr("1 is " + bres);

                bres = jpl.toInt(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.toInt(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.toInt(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.toInt(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.toInt("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.toInt(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.toInt(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.toInt(true);
                jpl.wr("true is " + bres);

                bres = jpl.toInt(false);
                jpl.wr("false is " + bres);

                bres = jpl.toInt("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -2.70: Unit Tests: toBoolInt ======================");
                bres = jpl.toBoolInt(true);
                jpl.wr("true is " + bres);

                bres = jpl.toBoolInt("true");
                jpl.wr("\"true\" is " + bres);

                bres = jpl.toBoolInt(1);
                jpl.wr("1 is " + bres);

                bres = jpl.toBoolInt(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.toBoolInt("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.toBoolInt("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.toBoolInt("yes");
                jpl.wr("\"yes\" is " + bres);

                bres = jpl.toBoolInt(false);
                jpl.wr("false is " + bres);

                bres = jpl.toBoolInt("false");
                jpl.wr("\"false\" is " + bres);

                bres = jpl.toBoolInt(0);
                jpl.wr("0 is " + bres);

                bres = jpl.toBoolInt(0.0);
                jpl.wr("0.0 is " + bres);

                bres = jpl.toBoolInt("0");
                jpl.wr("\"0\" is " + bres);

                bres = jpl.toBoolInt("0.0");
                jpl.wr("\"0.0\" is " + bres);

                bres = jpl.toBoolInt("no");
                jpl.wr("\"no\" is " + bres);

                bres = jpl.toBoolInt("2");
                jpl.wr("\"2\" is " + bres);

                bres = jpl.toBoolInt("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.toBoolInt(2);
                jpl.wr("2 is " + bres);

                bres = jpl.toBoolInt(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.toBoolInt(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.toBoolInt(new Object());
                jpl.wr("{} is " + bres);

                jpl.wr("====================== TEST -2.70: Unit Tests: toBool ======================");
                bres = jpl.toBool(true);
                jpl.wr("true is " + bres);

                bres = jpl.toBool("true");
                jpl.wr("\"true\" is " + bres);

                bres = jpl.toBool(1);
                jpl.wr("1 is " + bres);

                bres = jpl.toBool(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.toBool("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.toBool("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.toBool("yes");
                jpl.wr("\"yes\" is " + bres);

                bres = jpl.toBool(false);
                jpl.wr("false is " + bres);

                bres = jpl.toBool("false");
                jpl.wr("\"false\" is " + bres);

                bres = jpl.toBool(0);
                jpl.wr("0 is " + bres);

                bres = jpl.toBool(0.0);
                jpl.wr("0.0 is " + bres);

                bres = jpl.toBool("0");
                jpl.wr("\"0\" is " + bres);

                bres = jpl.toBool("0.0");
                jpl.wr("\"0.0\" is " + bres);

                bres = jpl.toBool("no");
                jpl.wr("\"no\" is " + bres);

                bres = jpl.toBool("2");
                jpl.wr("\"2\" is " + bres);

                bres = jpl.toBool("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.toBool(2);
                jpl.wr("2 is " + bres);

                bres = jpl.toBool(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.toBool(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.toBool(new Object());
                jpl.wr("{} is " + bres);

                jpl.wr("====================== TEST -2.60: Unit Tests: getPathAndUrlFromRef ======================");
                bres = jpl.getPathAndUrlFromRef("#.vars.tmp1");
                jpl.wr("\"#.vars.tmp1\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.args.tmp2");
                jpl.wr("\"$.args.tmp2\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("#.vars.tmp1.1");
                jpl.wr("\"#.vars.tmp1.1\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.args.tmp2.tmp");
                jpl.wr("\"$.args.tmp2.tmp\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.vars.tmp3.4");
                jpl.wr("\"$.vars.tmp3.4\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("<#.vars.tmp1>");
                jpl.wr("\"<#.vars.tmp1>\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.vars.[$.vars.tmp3]");
                jpl.wr("\"$.vars.[$.vars.tmp3]\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.vars.tmp1.[$.vars.tmp3]");
                jpl.wr("\"$.vars.tmp1.[$.vars.tmp3]\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("#.vars.tmp1->(http://localhost:8000/)");
                jpl.wr("\"#.vars.tmp1->(http://localhost:8000/)\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.args.tmp2->(http://localhost:8000/)");
                jpl.wr("\"$.args.tmp2->(http://localhost:8000/)\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("#.vars.tmp1.1->(http://localhost:8000/)");
                jpl.wr("\"#.vars.tmp1.1->(http://localhost:8000/)\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.args.tmp2.tmp->(http://localhost:8000/)");
                jpl.wr("\"$.args.tmp2.tmp->(http://localhost:8000/)\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.vars.tmp3.4->(http://localhost:8000/)");
                jpl.wr("\"$.vars.tmp3.4->(http://localhost:8000/)\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("test->(http://localhost:8000/)");
                jpl.wr("\"test->(http://localhost:8000/)\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("<#.vars.tmp1>->(http://localhost:8000/)");
                jpl.wr("\"<#.vars.tmp1>->(http://localhost:8000/)\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.vars.[$.vars.tmp3]->(http://localhost:8000/)");
                jpl.wr("\"$.vars.[$.vars.tmp3]->(http://localhost:8000/)\" is " + bres);

                bres = jpl.getPathAndUrlFromRef("$.vars.tmp1.[$.vars.tmp3]->(http://localhost:8000/)");
                jpl.wr("\"$.vars.tmp1.[$.vars.tmp3]->(http://localhost:8000/)\" is " + bres);

                jpl.wr("====================== TEST -2.50: Unit Tests: getSysObjType ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.getSysObjType(tmp);
                jpl.wr("{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.getSysObjType(testObj);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                tmpJson = "{\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"567\"}}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.getSysObjType(tmp);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.49: Unit Tests: sysGetArrayIdxRef ======================");
                bres = jpl.sysGetArrayIdxRef(jpl.toArray(1), null);
                jpl.wr("1 is " + bres);

                bres = jpl.sysGetArrayIdxRef(jpl.toArray(1.24), null);
                jpl.wr("1.24 is " + bres);

                bres = jpl.sysGetArrayIdxRef(jpl.toArray(-1), null);
                jpl.wr("-1 is " + bres);

                bres = jpl.sysGetArrayIdxRef(jpl.toArray(new int[]{1, 2, 3}), null);
                jpl.wr("[1,2,3] is " + bres);

                bres = jpl.sysGetArrayIdxRef(jpl.toArray("{\"test\":\"test\"}"), null);
                jpl.wr("{\"test\":\"test\"} is " + bres);

                bres = jpl.sysGetArrayIdxRef(jpl.toArray("testing123"), null);
                jpl.wr("testing123 is " + bres);

                bres = jpl.sysGetArrayIdxRef(jpl.toArray(false), null);
                jpl.wr("false is " + bres);

                jpl.wr("====================== TEST -2.48: Unit Tests: sysGetArrayIdxRefStr ======================");
                bres = jpl.sysGetArrayIdxRefStr(jpl.toArray(1), null);
                jpl.wr("1 is " + bres);

                bres = jpl.sysGetArrayIdxRefStr(jpl.toArray(1.24), null);
                jpl.wr("1.24 is " + bres);

                bres = jpl.sysGetArrayIdxRefStr(jpl.toArray(-1), null);
                jpl.wr("-1 is " + bres);

                bres = jpl.sysGetArrayIdxRefStr(jpl.toArray(new int[]{1, 2, 3}), null);
                jpl.wr("[1,2,3] is " + bres);

                bres = jpl.sysGetArrayIdxRefStr(jpl.toArray("{\"test\":\"test\"}"), null);
                jpl.wr("{\"test\":\"test\"} is " + bres);

                bres = jpl.sysGetArrayIdxRefStr(jpl.toArray("testing123"), null);
                jpl.wr("testing123 is " + bres);

                bres = jpl.sysGetArrayIdxRefStr(jpl.toArray(false), null);
                jpl.wr("false is " + bres);

                jpl.wr("====================== TEST -2.47: Unit Tests: sysGetRef ======================");
                bres = jpl.sysGetRef(jpl.toArray(1), null);
                jpl.wr("1 is " + bres);

                bres = jpl.sysGetRef(jpl.toArray(1.24), null);
                jpl.wr("1.24 is " + bres);

                bres = jpl.sysGetRef(jpl.toArray(-1), null);
                jpl.wr("-1 is " + bres);

                bres = jpl.sysGetRef(jpl.toArray(new int[]{1, 2, 3}), null);
                jpl.wr("[1,2,3] is " + bres);

                bres = jpl.sysGetRef(jpl.toArray("{\"test\":\"test\"}"), null);
                jpl.wr("{\"test\":\"test\"} is " + bres);

                bres = jpl.sysGetRef(jpl.toArray("testing123"), null);
                jpl.wr("testing123 is " + bres);

                bres = jpl.sysGetRef(jpl.toArray(false), null);
                jpl.wr("false is " + bres);

                jpl.wr("====================== TEST -2.46: Unit Tests: sysGetRefStr ======================");
                bres = jpl.sysGetRefStr(jpl.toArray(1), null);
                jpl.wr("1 is " + bres);

                bres = jpl.sysGetRefStr(jpl.toArray(1.24), null);
                jpl.wr("1.24 is " + bres);

                bres = jpl.sysGetRefStr(jpl.toArray(-1), null);
                jpl.wr("-1 is " + bres);

                bres = jpl.sysGetRefStr(jpl.toArray(new int[]{1, 2, 3}), null);
                jpl.wr("[1,2,3] is " + bres);

                bres = jpl.sysGetRefStr(jpl.toArray("{\"test\":\"test\"}"), null);
                jpl.wr("{\"test\":\"test\"} is " + bres);

                bres = jpl.sysGetRefStr(jpl.toArray("testing123"), null);
                jpl.wr("testing123 is " + bres);

                bres = jpl.sysGetRefStr(jpl.toArray(false), null);
                jpl.wr("false is " + bres);

                jpl.wr("====================== TEST -2.45: Unit Tests: sysMallocArray ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysMallocArray(jpl.toArray(tmp), null);
                jpl.wr("{\"sys\":\"for\", \"each\":{\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}}, \"lines\":[]} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysMallocArray(jpl.toArray(testObj), null);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                tmpJson = "{\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"567\"}}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysMallocArray(jpl.toArray(tmp), null);
                jpl.wrObjAbr(tmp);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysMallocArray(jpl.toArray("SYS:getLastAsgnValue"), null);
                jpl.wr("\"SYS:getLastAsgnValue\" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.44: Unit Tests: sysMalloc ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysMalloc(jpl.toArray(tmp), null);
                jpl.wr("{\"sys\":\"for\", \"each\":{\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}}, \"lines\":[]} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysMallocArray(jpl.toArray(testObj), null);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                tmpJson = "{\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"567\"}}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysMalloc(jpl.toArray(tmp), null);
                jpl.wrObjAbr(tmp);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysMalloc(jpl.toArray("SYS:getLastAsgnValue"), null);
                jpl.wr("\"SYS:getLastAsgnValue\" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.43: Unit Tests: sysClean ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysClean(jpl.toArray(tmp), null);
                jpl.wr("{\"sys\":\"for\", \"each\":{\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}}, \"lines\":[]} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysClean(jpl.toArray(testObj), null);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                tmpJson = "{\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"567\"}}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysClean(jpl.toArray(tmp), null);
                jpl.wrObjAbr(tmp);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysClean(jpl.toArray("SYS:getLastAsgnValue"), null);
                jpl.wr("\"SYS:getLastAsgnValue\" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.42: Unit Tests: sysWr ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysWr(jpl.toArray(tmp), null, null);
                jpl.wr("{\"sys\":\"for\", \"each\":{\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}}, \"lines\":[]} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysMallocArray(jpl.toArray(testObj), null);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                tmpJson = "{\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"567\"}}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysWr(jpl.toArray(tmp), null, null);
                jpl.wrObjAbr(tmp);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysWr(jpl.toArray("SYS:getLastAsgnValue"), null, null);
                jpl.wr("\"SYS:getLastAsgnValue\" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.41: Unit Tests: sysLen ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysLen(jpl.toArray(tmp), null);
                jpl.wr("{\"sys\":\"for\", \"each\":{\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}}, \"lines\":[]} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysMallocArray(jpl.toArray(testObj), null);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                tmpJson = "{\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"567\"}}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysLen(jpl.toArray(tmp), null);
                jpl.wrObjAbr(tmp);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysLen(jpl.toArray("SYS:getLastAsgnValue"), null);
                jpl.wr("\"SYS:getLastAsgnValue\" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.40: Unit Tests: sysType ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysType(jpl.toArray(tmp), null);
                jpl.wr("{\"sys\":\"for\", \"each\":{\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}}, \"lines\":[]} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysMallocArray(jpl.toArray(testObj), null);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                tmpJson = "{\"sys\":\"const\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"567\"}}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.sysType(jpl.toArray(tmp), null);
                jpl.wrObjAbr(tmp);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.sysType(jpl.toArray("SYS:getLastAsgnValue"), null);
                jpl.wr("\"SYS:getLastAsgnValue\" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.30: Unit Tests: isFullFor ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.isFullFor(tmp);
                jpl.wr("{\"sys\":\"for\", \"each\":{\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}}, \"lines\":[]} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.isFullFor(testObj);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.20: Unit Tests: isForEach ======================");
                tmpJson = "{\"sys\": \"for\", \"each\": {\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}},\"lines\": []}";
                tmp = ldr.ParseJson(tmpJson, "com.middlemind.JsonPL.JsonObjs.JsonObjSysBase");
                bres = jpl.isForEach(tmp);
                jpl.wr("{\"sys\":\"for\", \"each\":{\"sys\":\"ref\", \"val\":{\"sys\":\"val\", \"type\":\"int\", \"v\":\"#.vars.tmp1\"}}, \"lines\":[]} is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                bres = jpl.isForEach(testObj);
                jpl.wrObjAbr(testObj);
                jpl.wr(" is ");
                jpl.wrObjAbr((JsonObjSysBase) bres);

                jpl.wr("====================== TEST -2.10: Unit Tests: isFuncSys ======================");
                bres = jpl.isFuncSys("getMax");
                jpl.wr("\"getMax\" is " + bres);

                bres = jpl.isFuncSys("getMin");
                jpl.wr("\"getMin\" is " + bres);

                bres = jpl.isFuncSys("SYS::wr");
                jpl.wr("\"SYS::wr\" is " + bres);

                bres = jpl.isFuncSys("SYS:getLastAsgnValue");
                jpl.wr("\"SYS:getLastAsgnValue\" is " + bres);

                bres = jpl.isFuncSys("$.vars.tmp3.4");
                jpl.wr("\"$.vars.tmp3.4\" is " + bres);

                bres = jpl.isFuncSys("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -2.00: Unit Tests: isRefStringUrl ======================");
                bres = jpl.isRefStringUrl("#.vars.tmp1");
                jpl.wr("\"#.vars.tmp1\" is " + bres);

                bres = jpl.isRefStringUrl("$.args.tmp2");
                jpl.wr("\"$.args.tmp2\" is " + bres);

                bres = jpl.isRefStringUrl("#.vars.tmp1.1");
                jpl.wr("\"#.vars.tmp1.1\" is " + bres);

                bres = jpl.isRefStringUrl("$.args.tmp2.tmp");
                jpl.wr("\"$.args.tmp2.tmp\" is " + bres);

                bres = jpl.isRefStringUrl("$.vars.tmp3.4");
                jpl.wr("\"$.vars.tmp3.4\" is " + bres);

                bres = jpl.isRefStringUrl("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.isRefStringUrl("<#.vars.tmp1>");
                jpl.wr("\"<#.vars.tmp1>\" is " + bres);

                bres = jpl.isRefStringUrl("$.vars.[$.vars.tmp3]");
                jpl.wr("\"$.vars.[$.vars.tmp3]\" is " + bres);

                bres = jpl.isRefStringUrl("$.vars.tmp1.[$.vars.tmp3]");
                jpl.wr("\"$.vars.tmp1.[$.vars.tmp3]\" is " + bres);

                bres = jpl.isRefStringUrl("#.vars.tmp1->(http://localhost:8000/)");
                jpl.wr("\"#.vars.tmp1->(http://localhost:8000/)\" is " + bres);

                bres = jpl.isRefStringUrl("$.args.tmp2->(http://localhost:8000/)");
                jpl.wr("\"$.args.tmp2->(http://localhost:8000/)\" is " + bres);

                bres = jpl.isRefStringUrl("#.vars.tmp1.1->(http://localhost:8000/)");
                jpl.wr("\"#.vars.tmp1.1->(http://localhost:8000/)\" is " + bres);

                bres = jpl.isRefStringUrl("$.args.tmp2.tmp->(http://localhost:8000/)");
                jpl.wr("\"$.args.tmp2.tmp->(http://localhost:8000/)\" is " + bres);

                bres = jpl.isRefStringUrl("$.vars.tmp3.4->(http://localhost:8000/)");
                jpl.wr("\"$.vars.tmp3.4->(http://localhost:8000/)\" is " + bres);

                bres = jpl.isRefStringUrl("test->(http://localhost:8000/)");
                jpl.wr("\"test->(http://localhost:8000/)\" is " + bres);

                bres = jpl.isRefStringUrl("<#.vars.tmp1>->(http://localhost:8000/)");
                jpl.wr("\"<#.vars.tmp1>->(http://localhost:8000/)\" is " + bres);

                bres = jpl.isRefStringUrl("$.vars.[$.vars.tmp3]->(http://localhost:8000/)");
                jpl.wr("\"$.vars.[$.vars.tmp3]->(http://localhost:8000/)\" is " + bres);

                bres = jpl.isRefStringUrl("$.vars.tmp1.[$.vars.tmp3]->(http://localhost:8000/)");
                jpl.wr("\"$.vars.tmp1.[$.vars.tmp3]->(http://localhost:8000/)\" is " + bres);

                jpl.wr("====================== TEST -1.90: Unit Tests: isRefStringArrayDec ======================");
                bres = jpl.isRefStringArrayDec("#.vars.tmp1");
                jpl.wr("\"#.vars.tmp1\" is " + bres);

                bres = jpl.isRefStringArrayDec("$.args.tmp2");
                jpl.wr("\"$.args.tmp2\" is " + bres);

                bres = jpl.isRefStringArrayDec("#.vars.tmp1.1");
                jpl.wr("\"#.vars.tmp1.1\" is " + bres);

                bres = jpl.isRefStringArrayDec("$.args.tmp2.tmp");
                jpl.wr("\"$.args.tmp2.tmp\" is " + bres);

                bres = jpl.isRefStringArrayDec("$.vars.tmp3.4");
                jpl.wr("\"$.vars.tmp3.4\" is " + bres);

                bres = jpl.isRefStringArrayDec("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.isRefStringArrayDec("<#.vars.tmp1>");
                jpl.wr("\"<#.vars.tmp1>\" is " + bres);

                bres = jpl.isRefStringArrayDec("$.vars.[$.vars.tmp3]");
                jpl.wr("\"$.vars.[$.vars.tmp3]\" is " + bres);

                bres = jpl.isRefStringArrayDec("$.vars.tmp1.[$.vars.tmp3]");
                jpl.wr("\"$.vars.tmp1.[$.vars.tmp3]\" is " + bres);

                jpl.wr("====================== TEST -1.80: Unit Tests: isRefStringArray ======================");
                bres = jpl.isRefStringArray("#.vars.tmp1");
                jpl.wr("\"#.vars.tmp1\" is " + bres);

                bres = jpl.isRefStringArray("$.args.tmp2");
                jpl.wr("\"$.args.tmp2\" is " + bres);

                bres = jpl.isRefStringArray("$.vars.tmp3");
                jpl.wr("\"$.vars.tmp3\" is " + bres);

                bres = jpl.isRefStringArray("#.vars.tmp1.1");
                jpl.wr("\"#.vars.tmp1.1\" is " + bres);

                bres = jpl.isRefStringArray("$.args.tmp2.tmp");
                jpl.wr("\"$.args.tmp2.tmp\" is " + bres);

                bres = jpl.isRefStringArray("$.vars.tmp3.4");
                jpl.wr("\"$.vars.tmp3.4\" is " + bres);

                bres = jpl.isRefStringArray("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.isRefStringArray("<#.vars.tmp1>");
                jpl.wr("\"<#.vars.tmp1>\" is " + bres);

                bres = jpl.isRefStringArray("$.vars.[$.vars.tmp3]");
                jpl.wr("\"$.vars.[$.vars.tmp3]\" is " + bres);

                bres = jpl.isRefStringArray("$.vars.tmp1.[$.vars.tmp3]");
                jpl.wr("\"$.vars.tmp1.[$.vars.tmp3]\" is " + bres);

                jpl.wr("====================== TEST -1.71: Unit Tests: isRefStringDec ======================");
                bres = jpl.isRefStringDec("#.vars.tmp1");
                jpl.wr("\"#.vars.tmp1\" is " + bres);

                bres = jpl.isRefStringDec("$.args.tmp2");
                jpl.wr("\"$.args.tmp2\" is " + bres);

                bres = jpl.isRefStringDec("$.vars.tmp3");
                jpl.wr("\"$.vars.tmp3\" is " + bres);

                bres = jpl.isRefStringDec("#.vars.tmp1.1");
                jpl.wr("\"#.vars.tmp1.1\" is " + bres);

                bres = jpl.isRefStringDec("$.args.tmp2.tmp");
                jpl.wr("\"$.args.tmp2.tmp\" is " + bres);

                bres = jpl.isRefStringDec("$.vars.tmp3.4");
                jpl.wr("\"$.vars.tmp3.4\" is " + bres);

                bres = jpl.isRefStringDec("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.isRefStringDec("<#.vars.tmp1>");
                jpl.wr("\"<#.vars.tmp1>\" is " + bres);

                bres = jpl.isRefStringDec("$.vars.[$.vars.tmp3]");
                jpl.wr("\"$.vars.[$.vars.tmp3]\" is " + bres);

                bres = jpl.isRefStringDec("$.vars.tmp1.[$.vars.tmp3]");
                jpl.wr("\"$.vars.tmp1.[$.vars.tmp3]\" is " + bres);

                jpl.wr("====================== TEST -1.70: Unit Tests: isRefString ======================");
                bres = jpl.isRefString("#.vars.tmp1");
                jpl.wr("\"#.vars.tmp1\" is " + bres);

                bres = jpl.isRefString("$.args.tmp2");
                jpl.wr("\"$.args.tmp2\" is " + bres);

                bres = jpl.isRefString("$.vars.tmp3");
                jpl.wr("\"$.vars.tmp3\" is " + bres);

                bres = jpl.isRefString("#.vars.tmp1.1");
                jpl.wr("\"#.vars.tmp1.1\" is " + bres);

                bres = jpl.isRefString("$.args.tmp2.tmp");
                jpl.wr("\"$.args.tmp2.tmp\" is " + bres);

                bres = jpl.isRefString("$.vars.tmp3.4");
                jpl.wr("\"$.vars.tmp3.4\" is " + bres);

                bres = jpl.isRefString("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.isRefString("<#.vars.tmp1>");
                jpl.wr("\"<#.vars.tmp1>\" is " + bres);

                bres = jpl.isRefString("$.vars.[$.vars.tmp3]");
                jpl.wr("\"$.vars.[$.vars.tmp3]\" is " + bres);

                bres = jpl.isRefString("$.vars.tmp1.[$.vars.tmp3]");
                jpl.wr("\"$.vars.tmp1.[$.vars.tmp3]\" is " + bres);

                jpl.wr("====================== TEST -1.60: Unit Tests: isBaseType ======================");
                bres = jpl.isBaseType("int[]");
                jpl.wr("int[] is " + bres);

                bres = jpl.isBaseType("float[]");
                jpl.wr("float[] is " + bres);

                bres = jpl.isBaseType("bool[]");
                jpl.wr("bool[] is " + bres);

                bres = jpl.isBaseType("string[]");
                jpl.wr("string[] is " + bres);

                bres = jpl.isBaseType("int");
                jpl.wr("int is " + bres);

                bres = jpl.isBaseType("float");
                jpl.wr("float is " + bres);

                bres = jpl.isBaseType("bool");
                jpl.wr("bool is " + bres);

                bres = jpl.isBaseType("string");
                jpl.wr("string is " + bres);

                jpl.wr("====================== TEST -1.60: Unit Tests: isArrayType ======================");
                bres = jpl.isArrayType("int[]");
                jpl.wr("int[] is " + bres);

                bres = jpl.isArrayType("float[]");
                jpl.wr("float[] is " + bres);

                bres = jpl.isArrayType("bool[]");
                jpl.wr("bool[] is " + bres);

                bres = jpl.isArrayType("string[]");
                jpl.wr("string[] is " + bres);

                bres = jpl.isArrayType("int");
                jpl.wr("int is " + bres);

                bres = jpl.isArrayType("float");
                jpl.wr("float is " + bres);

                bres = jpl.isArrayType("bool");
                jpl.wr("bool is " + bres);

                bres = jpl.isArrayType("string");
                jpl.wr("string is " + bres);

                jpl.wr("====================== TEST -1.50: Unit Tests: isObject ======================");
                bres = jpl.isObject("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.isObject(1);
                jpl.wr("1 is " + bres);

                bres = jpl.isObject(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.isObject(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.isObject(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.isObject(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.isObject("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.isObject(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.isObject(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.isObject(true);
                jpl.wr("true is " + bres);

                bres = jpl.isObject(false);
                jpl.wr("false is " + bres);

                bres = jpl.isObject("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -1.50: Unit Tests: isArray ======================");
                bres = jpl.isArray("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.isArray(1);
                jpl.wr("1 is " + bres);

                bres = jpl.isArray(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.isArray(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.isArray(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.isArray(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.isArray("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.isArray(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.isArray(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.isArray(true);
                jpl.wr("true is " + bres);

                bres = jpl.isArray(false);
                jpl.wr("false is " + bres);

                bres = jpl.isArray("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -1.40: Unit Tests: isString ======================");
                bres = jpl.isString("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.isString(1);
                jpl.wr("1 is " + bres);

                bres = jpl.isString(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.isString(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.isString(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.isString(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.isString("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.isString(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.isString(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.isString(true);
                jpl.wr("true is " + bres);

                bres = jpl.isString(false);
                jpl.wr("false is " + bres);

                bres = jpl.isString("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -1.30: Unit Tests: isNumber ======================");
                bres = jpl.isNumber("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.isNumber(1);
                jpl.wr("1 is " + bres);

                bres = jpl.isNumber(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.isNumber(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.isNumber(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.isNumber(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.isNumber("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.isNumber(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.isNumber(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.isNumber(true);
                jpl.wr("true is " + bres);

                bres = jpl.isNumber(false);
                jpl.wr("false is " + bres);

                bres = jpl.isNumber("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -1.20: Unit Tests: isFloat ======================");
                bres = jpl.isFloat("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.isFloat(1);
                jpl.wr("1 is " + bres);

                bres = jpl.isFloat(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.isFloat(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.isFloat(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.isFloat(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.isFloat("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.isFloat(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.isFloat(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.isFloat(true);
                jpl.wr("true is " + bres);

                bres = jpl.isFloat(false);
                jpl.wr("false is " + bres);

                bres = jpl.isFloat("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -1.10: Unit Tests: isInteger ======================");
                bres = jpl.isInteger("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.isInteger(1);
                jpl.wr("1 is " + bres);

                bres = jpl.isInteger(-1);
                jpl.wr("-1 is " + bres);

                bres = jpl.isInteger(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.isInteger(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.isInteger(1.00);
                jpl.wr("1.00 is " + bres);

                bres = jpl.isInteger("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.isInteger(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.isInteger(new Object());
                jpl.wr("{} is " + bres);

                bres = jpl.isInteger(true);
                jpl.wr("true is " + bres);

                bres = jpl.isInteger(false);
                jpl.wr("false is " + bres);

                bres = jpl.isInteger("test");
                jpl.wr("\"test\" is " + bres);

                jpl.wr("====================== TEST -1.00: Unit Tests: isBool ======================");
                bres = jpl.isBool(true);
                jpl.wr("true is " + bres);

                bres = jpl.isBool("true");
                jpl.wr("\"true\" is " + bres);

                bres = jpl.isBool(1);
                jpl.wr("1 is " + bres);

                bres = jpl.isBool(1.0);
                jpl.wr("1.0 is " + bres);

                bres = jpl.isBool("1");
                jpl.wr("\"1\" is " + bres);

                bres = jpl.isBool("1.0");
                jpl.wr("\"1.0\" is " + bres);

                bres = jpl.isBool("yes");
                jpl.wr("\"yes\" is " + bres);

                bres = jpl.isBool(false);
                jpl.wr("false is " + bres);

                bres = jpl.isBool("false");
                jpl.wr("\"false\" is " + bres);

                bres = jpl.isBool(0);
                jpl.wr("0 is " + bres);

                bres = jpl.isBool(0.0);
                jpl.wr("0.0 is " + bres);

                bres = jpl.isBool("0");
                jpl.wr("\"0\" is " + bres);

                bres = jpl.isBool("0.0");
                jpl.wr("\"0.0\" is " + bres);

                bres = jpl.isBool("no");
                jpl.wr("\"no\" is " + bres);

                bres = jpl.isBool("2");
                jpl.wr("\"2\" is " + bres);

                bres = jpl.isBool("test");
                jpl.wr("\"test\" is " + bres);

                bres = jpl.isBool(2);
                jpl.wr("2 is " + bres);

                bres = jpl.isBool(1.25);
                jpl.wr("1.25 is " + bres);

                bres = jpl.isBool(new ArrayList<JsonObjSysBase>());
                jpl.wr("[] is " + bres);

                bres = jpl.isBool(new Object());
                jpl.wr("{} is " + bres);

                /////////////////////////////////////////////////////////////////////////////
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
