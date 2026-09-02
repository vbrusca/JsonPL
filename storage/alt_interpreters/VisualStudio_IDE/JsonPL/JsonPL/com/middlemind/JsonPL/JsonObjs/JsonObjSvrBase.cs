using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL.JsonObjs
{
    /**
    *
    * @author Victor G. Brusca, Middlemind Games 03/26/2022 10:10 AM EDT
    */
    public class JsonObjSvrBase : JsonObjBase
    {

        /**
         *
         */
        public string type;

        /**
         *
         */
        public string path;

        /**
        *
        */
        public bool error;

        /**
         *
         */
        public JsonObjSysBase result;

        /**
         *
         */
        public string message;

        /**
        * 
        * @return 
        */
        public JsonObjSvrBase Clone()
        {
            JsonObjSvrBase ret = new JsonObjSvrBase();

            if (this.result != null)
            {
                ret.result = this.result.Clone();
            }

            if (this.type != null)
            {
                ret.type = new string(this.type.ToCharArray());
            }

            if (this.path != null)
            {
                ret.path = new string(this.path.ToCharArray());
            }

            ret.error = this.error;

            if (this.message != null)
            {
                ret.message = new string(this.message.ToCharArray());
            }

            return ret;
        }

        /**
        * 
        * @param sysStr 
        */
        public JsonObjSvrBase(string ltype, string lref, bool lerror, string msg, JsonObjSysBase res)
        {
            type = ltype;
            path = lref;
            error = lerror;
            message = msg;
            result = res;
        }

        /**
        * 
        */
        public JsonObjSvrBase()
        {
        }

        /**
        *
        * @param prefix
        */
        public override void Print(string prefix)
        {
            base.Print(prefix);
            Logger.wrl(prefix + "Type: " + type + ", Ref: " + path + ", Error: " + error + ", Message: " + message);
        }
    }
}
