package com.middlemind.JsonPL;

import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;
import java.util.List;

/**
 *
 * @author Victor G. Brusca, Middlemind Games 03/28/2022 06:29 PM EDT
 */
public class SystemFunctionHandlerJpl {

   public SystemFunctionHandlerJpl() {
      
   }
   
   public JsonObjSysBase call(String name, List<JsonObjSysBase> args, JsonPlState jsonPl) {
      JsonObjSysBase ret = null;
      if(name != null) {
         if(name.equals("sysJob1")) {
            ret = jsonPl.sysJob1();
            
         } else if(name.equals("sysJob2")) {
            ret = jsonPl.sysJob2();
            
         } else if(name.equals("sysJob3")) {
            ret = jsonPl.sysJob3();
            
         }
      }
      return ret;
   }
}
