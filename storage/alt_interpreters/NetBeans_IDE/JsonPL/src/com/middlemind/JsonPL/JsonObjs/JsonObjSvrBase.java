package com.middlemind.JsonPL.JsonObjs;

import com.middlemind.JsonPL.Logger;

/**
 *
 * @author Victor G. Brusca, Middlemind Games 03/26/2022 10:10 AM EDT
 */
public class JsonObjSvrBase extends JsonObjBase {

   /**
    *
    */
   public String type;

   /**
    *
    */
   public String path;

   /**
    *
    */
   public Boolean error;

   /**
    *
    */
   public JsonObjSysBase result;

   /**
    *
    */
   public String message;

   /**
    *
    * @return
    */
   public JsonObjSvrBase Clone() {
      JsonObjSvrBase ret = new JsonObjSvrBase();

      if (this.result != null) {
         ret.result = this.result.Clone();
      }

      if (this.type != null) {
         ret.type = new String(this.type.getBytes());
      }

      if (this.path != null) {
         ret.path = new String(this.path.getBytes());
      }
      
      ret.error = this.error;
      
      if (this.message != null) {
         ret.message = new String(this.message.getBytes());
      }
      
      return ret;
   }

   /**
    *
    * @param sysStr
    */
   public JsonObjSvrBase(String ltype, String lref, boolean lerror, String msg, JsonObjSysBase res) {
       type = ltype;
       path = lref;
       error = lerror;
       message = msg;
       result = res;
   }

   /**
    *
    */
   public JsonObjSvrBase() {
   }

   /**
    *
    * @param prefix
    */
   @Override
   public void Print(String prefix) {
      super.Print(prefix);
      Logger.wrl(prefix + "Type: " + type + ", Ref: " + path + ", Error: " + error + ", Message: " + message);
   }
}
