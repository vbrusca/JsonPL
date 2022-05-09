package com.middlemind.JsonPL;

import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;
import java.util.List;

/**
 *
 * @author Victor G. Brusca, Middlemind Games 03/28/2022 06:29 PM EDT
 */
public class SystemFunctionHandlerJpl {

   /**
    * 
    */
   public SystemFunctionHandlerJpl() {
      
   }
   
   /**
    * 
    * @param name
    * @param args
    * @param jsonPl
    * @return 
    */
   public JsonObjSysBase call(String name, List<JsonObjSysBase> args, JsonPlState jsonPl, JsonObjSysBase func) {
      Logger.wr("Handling system method: " + name);
      JsonObjSysBase ret = null;
      if(name != null) {
         if(name.equals("sysJob1")) {
            ret = jsonPl.sysJob1(args, func);
            
         } else if(name.equals("sysJob2")) {
            ret = jsonPl.sysJob2(args, func);
            
         } else if(name.equals("sysJob3")) {
            ret = jsonPl.sysJob3(args, func);
            
         } else if(name.equals("sysGetLastAsgnValue")) {
            ret = jsonPl.lastAsgnValue;
           
         }
      }
      return ret;
   }
}
