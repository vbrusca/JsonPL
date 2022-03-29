using com.middlemind.JsonPL.JsonObjs;
using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL {
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
      public JsonObjSysBase call(String name, List<JsonObjSysBase> args, JsonPlState jsonPl) {
         Logger.wr("Handling system method: " + name);
         JsonObjSysBase ret = null;
         if (name != null) {
            if (name.Equals("sysJob1")) {
               ret = jsonPl.sysJob1();

            } else if (name.Equals("sysJob2")) {
               ret = jsonPl.sysJob2();

            } else if (name.Equals("sysJob3")) {
               ret = jsonPl.sysJob3();

            } else if (name.Equals("sysGetLastAsgnValue")) {
               ret = jsonPl.lastAsgnValue;

            }
         }
         return ret;
      }
   }
}
