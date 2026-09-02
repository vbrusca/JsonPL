using com.middlemind.JsonPL.JsonObjs;
using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL
{
    public class ProcessCallRunner
    {
        private JsonObjSysBase lcall;
        private JsonObjSysBase func;
        private JsonPlState main;

        public ProcessCallRunner(JsonObjSysBase Lcall, JsonObjSysBase Func, JsonPlState Main)
        {
            lcall = Lcall;
            func = Func;
            main = Main;
        }

        public void run()
        {
            main.processCall(lcall, func);
        }
    }
}
