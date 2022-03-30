using com.middlemind.JsonPL.JsonObjs;
using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL {
   /**
   *
   * @author Victor G. Brusca, Middlemind Games 03/28/2022 06:25 PM EDT
   */
   public interface SystemFunctionHandler {
      public JsonObjSysBase call(string name, List<JsonObjSysBase> args);
   }
}
