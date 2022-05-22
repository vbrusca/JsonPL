package com.middlemind.JsonPL.JsonObjs;

import com.middlemind.JsonPL.JsonPlState;
import com.middlemind.JsonPL.Logger;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Victor G. Brusca, Middlemind Games 03/26/2022 10:10 AM EDT
 */
public class JsonObjSysBase extends JsonObjBase {

   /**
    *
    */
   public String sys;

   /**
    *
    */
   public Object name;

   /**
    *
    */
   public String fname;

   /**
    *
    */
   public List<JsonObjSysBase> args;

   /**
    *
    */
   public List<JsonObjSysBase> vars_def;

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
   public String type;

   /**
    *
    */
   public Object v;

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
   public JsonObjSysBase each;

   /**
    *
    */
   public Boolean active;

   /**
    *
    */
   public Integer len;

   /**
    *
    */
   public Boolean strict;

   /**
    * 
    */
   public String url;
   
   /**
    *
    * @return
    */
   public JsonObjSysBase Clone() {
      JsonObjSysBase ret = new JsonObjSysBase();
      if (this.args != null) {
         ret.args = new ArrayList<>();
         for (int i = 0; i < this.args.size(); i++) {
            ret.args.add(this.args.get(i).Clone());
         }
      }

      if (this.call != null) {
         ret.call = call.Clone();
      }

      if (this.els != null) {
         ret.els = new ArrayList<>();
         for (int i = 0; i < this.els.size(); i++) {
            ret.els.add(this.els.get(i).Clone());
         }
      }

      if (this.fname != null) {
         ret.fname = new String(this.fname.getBytes());
      }

      if (this.funcs != null) {
         ret.funcs = new ArrayList<>();
         for (int i = 0; i < this.funcs.size(); i++) {
            ret.funcs.add(this.funcs.get(i).Clone());
         }
      }

      if (this.inc != null) {
         ret.inc = this.inc.Clone();
      }

      if (this.left != null) {
         ret.left = this.left.Clone();
      }

      if (this.lines != null) {
         ret.lines = new ArrayList<>();
         for (int i = 0; i < this.lines.size(); i++) {
            ret.lines.add(this.lines.get(i).Clone());
         }
      }

      if (this.loader != null) {
         ret.loader = new String(this.loader.getBytes());
      }

      JsonPlState jpl = new JsonPlState();
      if (this.name != null) {
         if (jpl.isString(this.name)) {
            ret.name = jpl.toStr(this.name);
         } else {
            this.name = jpl.cloneJsonObj((JsonObjSysBase) this.name);
         }
      }

      if (this.obj_name != null) {
         ret.obj_name = new String(this.obj_name.getBytes());
      }

      if (this.op != null) {
         ret.op = this.op.Clone();
      }

      if (this.ret != null) {
         ret.ret = this.ret.Clone();
      }

      if (this.right != null) {
         ret.right = this.right.Clone();
      }

      if (this.start != null) {
         ret.start = this.start.Clone();
      }

      if (this.stop != null) {
         ret.stop = this.stop.Clone();
      }

      if (this.each != null) {
         ret.each = this.each.Clone();
      }

      if (this.sys != null) {
         ret.sys = new String(this.sys.getBytes());
      }

      if (this.thn != null) {
         ret.thn = new ArrayList<>();
         for (int i = 0; i < this.thn.size(); i++) {
            ret.thn.add(this.thn.get(i).Clone());
         }
      }

      if (this.type != null) {
         ret.type = new String(this.type.getBytes());
      }

      if (this.v != null) {
         if (this.type != null && !this.type.equals("array")) {
            ret.v = new String((this.v + "").getBytes());
         } else {
            ArrayList<Object> tmp = (ArrayList<Object>) this.v;
            ret.v = new ArrayList<Object>(tmp);
         }
      }

      if (this.val != null) {
         ret.val = this.val.Clone();
      }

      if (this.vars != null) {
         ret.vars = new ArrayList<>();
         for (int i = 0; i < this.vars.size(); i++) {
            ret.vars.add(this.vars.get(i).Clone());
         }
      }

      if (this.ret_def != null) {
         ret.ret_def = this.ret_def.Clone();
      }

      if (this.args_def != null) {
         ret.args_def = new ArrayList<>();
         for (int i = 0; i < this.args_def.size(); i++) {
            ret.args_def.add(this.args_def.get(i).Clone());
         }
      }

      ret.active = this.active;
      ret.len = this.len;
      ret.strict = this.strict;
      
      if (this.url != null) {
         ret.url = new String(this.url.getBytes());
      }      
      
      return ret;
   }

   /**
    *
    * @param sysStr
    */
   public JsonObjSysBase(String sysStr) {
      sys = sysStr;
   }

   /**
    *
    */
   public JsonObjSysBase() {
   }

   /**
    *
    * @param prefix
    */
   @Override
   public void Print(String prefix) {
      super.Print(prefix);
      Logger.wrl(prefix + "Sys: " + sys);
   }
}
