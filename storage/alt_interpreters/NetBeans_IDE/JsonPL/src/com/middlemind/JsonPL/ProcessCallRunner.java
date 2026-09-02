package com.middlemind.JsonPL;

import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;

/**
 *
 * @author brusc
 */
public class ProcessCallRunner implements Runnable {
    private final JsonObjSysBase lcall;
    private final JsonObjSysBase func;
    private final JsonPlState main;
    
    public ProcessCallRunner(JsonObjSysBase Lcall, JsonObjSysBase Func, JsonPlState Main) {
        lcall = Lcall;
        func = Func;
        main = Main;
    }
    
    @Override
    public void run() {
        main.processCall(lcall, func);
    }    
}
