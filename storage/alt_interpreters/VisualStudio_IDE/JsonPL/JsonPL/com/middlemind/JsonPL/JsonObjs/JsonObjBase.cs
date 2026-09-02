using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL.JsonObjs {
   /**
   * A simple class that implements the JsonObj interface. A class that represents
   * a JSON object.
   *
   * @author Victor G. Brusca, Middlemind Games 07/30/2021 0:27 AM EST
   */
   public class JsonObjBase : JsonObj {

      /**
      * A string representing the obj_name of this JSON object.
      */
      public string obj_name;

      /**
      * A string representing the full class obj_name of this JSON object's loader.
      */
      public string loader;

      /**
      * A method that returns this class' JSON object loader.
      *
      * @return A string representing the full class obj_name of this JSON object's loader.
      */
      public string GetLoader() {
         return loader;
      }

      /**
      * A method that sets the class' JSON object loader.
      *
      * @param s A string representing the full class obj_name of this JSON object's loader.
      */
      public void SetLoader(string s) {
         loader = s;
      }

      /**
      * A method that returns the obj_name of this JSON object class.
      *
      * @return A string representing the obj_name of this JSON object.
      */
      public string GetName() {
         return obj_name;
      }

      /**
      * A method that sets the obj_name of the JSON object class.
      *
      * @param s A string representing the obj_name of this JSON object.
      */
      public void SetName(string s) {
         obj_name = s;
      }

      /**
      * A method that is used to print a string representation of this JSON object
      * to standard output.
      */
      public virtual void Print() {
         Print("");
      }

      /**
      * A method that is used to print a string representation of this JSON object
      * to standard output with a string prefix.
      *
      * @param prefix A string that is used as a prefix to the string
      * representation of this JSON object.
      */
      public virtual void Print(string prefix) {
         Logger.wrl(prefix + "ObjName: " + obj_name);
         Logger.wrl(prefix + "Loader: " + loader);
      }
   }
}
