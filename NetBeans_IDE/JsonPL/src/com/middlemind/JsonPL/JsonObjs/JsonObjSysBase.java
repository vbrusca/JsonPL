package com.middlemind.JsonPL.JsonObjs;

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
   public String name;  
   
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
   public String v;   
   
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
   public boolean active = true;
   
   /**
    * 
    * @return 
    */
   public JsonObjSysBase Clone() {
      JsonObjSysBase ret = new JsonObjSysBase();      
      if(this.args != null) {
         ret.args = new ArrayList<>();
         for(int i = 0; i < this.args.size(); i++) {
            ret.args.add(this.args.get(i).Clone());
         }
      }

      if(this.call != null) {
         ret.call = call.Clone();
      }
      
      if(this.els != null) {
         ret.els = new ArrayList<>();
         for(int i = 0; i < this.els.size(); i++) {
            ret.els.add(this.els.get(i).Clone());
         }
      }
      
      if(this.fname != null) {
         ret.fname = new String(this.fname.getBytes());
      }
      
      if(this.funcs != null) {
         ret.funcs = new ArrayList<>();
         for(int i = 0; i < this.funcs.size(); i++) {
            ret.funcs.add(this.funcs.get(i).Clone());
         }
      }
      
      if(this.inc != null) {
         ret.inc = this.inc.Clone();
      }
      
      if(this.left != null) {
         ret.left = this.left.Clone();
      }
      
      if(this.lines != null) {
         ret.lines = new ArrayList<>();
         for(int i = 0; i < this.lines.size(); i++) {
            ret.lines.add(this.lines.get(i).Clone());
         }
      }
      
      if(this.loader != null) {
         ret.loader = new String(this.loader.getBytes());
      }
      
      if(this.name != null) {
         ret.name = new String(this.name.getBytes());
      }
      
      if(this.obj_name != null) {
         ret.obj_name = new String(this.obj_name.getBytes());
      }
      
      if(this.op != null) {
         ret.op = this.op.Clone();
      }
      
      if(this.ret != null) {
         ret.ret = this.ret.Clone();
      }
      
      if(this.right != null) {
         ret.right = this.right.Clone();
      }      
      
      if(this.start != null) {
         ret.start = this.start.Clone();
      }      
      
      if(this.stop != null) {
         ret.stop = this.stop.Clone();
      }
      
      if(this.sys != null) {
         ret.sys = new String(this.sys.getBytes());
      }      
            
      if(this.thn != null) {
         ret.thn = new ArrayList<>();
         for(int i = 0; i < this.thn.size(); i++) {
            ret.thn.add(this.thn.get(i).Clone());
         }
      }
      
      if(this.type != null) {
         ret.type = new String(this.type.getBytes());
      }
      
      if(this.v != null) {
         ret.v = new String(this.v.getBytes());         
      }
      
      if(this.val != null) {
         ret.val = this.val.Clone();
      }
      
      if(this.vars != null) {
         ret.vars = new ArrayList<>();
         for(int i = 0; i < this.vars.size(); i++) {
            ret.vars.add(this.vars.get(i).Clone());
         }
      }
      
      if(this.ret_def != null) {
         ret.ret_def = this.ret_def.Clone();
      }
      
      if(this.args_def != null) {
         ret.args_def = new ArrayList<>();
         for(int i = 0; i < this.args_def.size(); i++) {
            ret.args_def.add(this.args_def.get(i).Clone());
         }
      }      
      
      ret.active = this.active;
      return ret;
   }
   
   /**
    * 
    * @param sysStr 
    */
   public JsonObjSysBase(String sysStr) {
      sys = sysStr;
      //Link();
   }
   
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
   
   /**
    * 
    */
   /*
   @Override
   public final void Link() {
      Logger.wrl("Link: " + sys);
      if(sys != null) {
         if(sys.equals("arg")) {
            sys_type = SysType.ARG;
         } else if(sys.equals("asgn")) {
            sys_type = SysType.ASGN;
         } else if(sys.equals("bex")) {
            sys_type = SysType.BEX;
         } else if(sys.equals("call")) {
            sys_type = SysType.CALL;
         } else if(sys.equals("class")) {
            sys_type = SysType.CLASS; 
         } else if(sys.equals("const")) {
            sys_type = SysType.CONST; 
         } else if(sys.equals("exp")) {
            sys_type = SysType.EXP;
         } else if(sys.equals("func")) {
            sys_type = SysType.FUNC;
         } else if(sys.equals("op")) {
            sys_type = SysType.OP;
         } else if(sys.equals("ref")) {
            sys_type = SysType.REF;
         } else if(sys.equals("return")) {
            sys_type = SysType.RETURN;
         } else if(sys.equals("val")) {
            sys_type = SysType.VAL;
         } else if(sys.equals("var")) {
            sys_type = SysType.VAR;
         }
      }
   }
   */
}
