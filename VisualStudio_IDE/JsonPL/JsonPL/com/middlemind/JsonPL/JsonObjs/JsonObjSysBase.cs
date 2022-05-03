using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL.JsonObjs
{
    /**
    *
    * @author Victor G. Brusca, Middlemind Games 03/26/2022 10:10 AM EDT
    */
    public class JsonObjSysBase : JsonObjBase
    {

        /**
        *
        */
        public string sys;

        /**
        *
        */
        public string name;

        /**
        * 
        */
        public string fname;

        /**
        *
        */
        public List<JsonObjSysBase> args;

        /**
        *
        */
        public List<JsonObjSysBase> args_def;

        /**
        * 
        */
        public JsonObjSysBase call;

        /**
        * 
        */
        public List<JsonObjSysBase> vars;

        /**
        * 
        */
        public List<JsonObjSysBase> funcs;

        /**
        * 
        */
        public JsonObjSysBase ret;

        /**
        * 
        */
        public JsonObjSysBase ret_def;

        /**
        *
        */
        public List<JsonObjSysBase> lines;

        /**
        *
        */
        public JsonObjSysBase left;

        /**
        *
        */
        public JsonObjSysBase op;

        /**
        *
        */
        public JsonObjSysBase right;

        /**
        *
        */
        public JsonObjSysBase val;

        /**
        *
        */
        public string type;

        /**
        *
        */
        public object v;

        /**
        *
        */
        public List<JsonObjSysBase> thn;

        /**
        *
        */
        public List<JsonObjSysBase> els;

        /**
        *
        */
        public JsonObjSysBase start;

        /**
        *
        */
        public JsonObjSysBase stop;

        /**
        *
        */
        public JsonObjSysBase inc;

        /**
        * 
        */
        public Object active;

        /**
        * 
        */
        public Object len;

        /**
        * 
        * @return 
        */
        public JsonObjSysBase Clone()
        {
            JsonObjSysBase ret = new JsonObjSysBase();
            if (this.args != null)
            {
                ret.args = new List<JsonObjSysBase>();
                for (int i = 0; i < this.args.Count; i++)
                {
                    ret.args.Add(this.args[i].Clone());
                }
            }

            if (this.call != null)
            {
                ret.call = call.Clone();
            }

            if (this.els != null)
            {
                ret.els = new List<JsonObjSysBase>();
                for (int i = 0; i < this.els.Count; i++)
                {
                    ret.els.Add(this.els[i].Clone());
                }
            }

            if (this.fname != null)
            {
                ret.fname = new string(this.fname.ToCharArray());
            }

            if (this.funcs != null)
            {
                ret.funcs = new List<JsonObjSysBase>();
                for (int i = 0; i < this.funcs.Count; i++)
                {
                    ret.funcs.Add(this.funcs[i].Clone());
                }
            }

            if (this.inc != null)
            {
                ret.inc = this.inc.Clone();
            }

            if (this.left != null)
            {
                ret.left = this.left.Clone();
            }

            if (this.lines != null)
            {
                ret.lines = new List<JsonObjSysBase>();
                for (int i = 0; i < this.lines.Count; i++)
                {
                    ret.lines.Add(this.lines[i].Clone());
                }
            }

            if (this.loader != null)
            {
                ret.loader = new string(this.loader.ToCharArray());
            }

            if (this.name != null)
            {
                ret.name = new string(this.name.ToCharArray());
            }

            if (this.obj_name != null)
            {
                ret.obj_name = new string(this.obj_name.ToCharArray());
            }

            if (this.op != null)
            {
                ret.op = this.op.Clone();
            }

            if (this.ret != null)
            {
                ret.ret = this.ret.Clone();
            }

            if (this.right != null)
            {
                ret.right = this.right.Clone();
            }

            if (this.start != null)
            {
                ret.start = this.start.Clone();
            }

            if (this.stop != null)
            {
                ret.stop = this.stop.Clone();
            }

            if (this.sys != null)
            {
                ret.sys = new string(this.sys.ToCharArray());
            }

            if (this.thn != null)
            {
                ret.thn = new List<JsonObjSysBase>();
                for (int i = 0; i < this.thn.Count; i++)
                {
                    ret.thn.Add(this.thn[i].Clone());
                }
            }

            if (this.type != null)
            {
                ret.type = new string(this.type.ToCharArray());
            }

            if (this.v != null)
            {
                if (this.type != null && !this.type.Equals("array"))
                {
                    ret.v = new string((this.v + "").ToCharArray());
                }
                else
                {
                    List<Object> tmp = (List<Object>)this.v;
                    ret.v = new List<Object>(tmp);
                }
            }

            if (this.val != null)
            {
                ret.val = this.val.Clone();
            }

            if (this.vars != null)
            {
                ret.vars = new List<JsonObjSysBase>();
                for (int i = 0; i < this.vars.Count; i++)
                {
                    ret.vars.Add(this.vars[i].Clone());
                }
            }

            if (this.ret_def != null)
            {
                ret.ret_def = this.ret_def.Clone();
            }

            if (this.args_def != null)
            {
                ret.args_def = new List<JsonObjSysBase>();
                for (int i = 0; i < this.args_def.Count; i++)
                {
                    ret.args_def.Add(this.args_def[i].Clone());
                }
            }

            ret.active = this.active;
            return ret;
        }

        /**
        * 
        * @param sysStr 
        */
        public JsonObjSysBase(string sysStr)
        {
            sys = sysStr;
        }

        /**
        * 
        */
        public JsonObjSysBase()
        {
        }

        /**
        *
        * @param prefix
        */
        public override void Print(string prefix)
        {
            base.Print(prefix);
            Logger.wrl(prefix + "Sys: " + sys);
        }
    }
}
