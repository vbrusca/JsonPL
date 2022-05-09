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
      public JsonObjSysBase call(string name, List<JsonObjSysBase> args, JsonPlState jsonPl, JsonObjSysBase func) {
         Logger.wr("Handling system method: " + name);
         JsonObjSysBase ret = null;
         if (name != null) {
            if (name.Equals("sysJob1")) {
               ret = jsonPl.sysJob1(args, func);

            } else if (name.Equals("sysJob2")) {
               ret = jsonPl.sysJob2(args, func);

            } else if (name.Equals("sysJob3")) {
               ret = jsonPl.sysJob3(args, func);

            } else if (name.Equals("sysGetLastAsgnValue")) {
               ret = jsonPl.lastAsgnValue;

            }
         }
         return ret;
      }
   }
}
