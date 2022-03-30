using com.middlemind.JsonPL.Exceptions;
using com.middlemind.JsonPL.JsonObjs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL.Loaders {
   /**
   * A class used to load JSON bit series object data.
   *
   * @author Victor G. Brusca, Middlemind Games 07/30/2021 8:35 AM EST
   */
   public class LoaderSysBase : Loader {

      /**
      * A string representing the name of this class. This is used to define the
      * class in JSON output files.
      */
      public string obj_name = "LoaderSysBase";

      /**
      * A method used to parse and load JSON data files.
      *
      * @param json The contents of the JSON file to load.
      * @param targetClass A full java class representation of the Java class to
      * load the JSON data into.
      * @return A JsonObj instance the represents the JSON data loaded.
      * @throws ExceptionLoader An exception is thrown if there is an issue during
      * the JSON data load.
      */
      public JsonObjSysBase ParseJson(string json, string targetClass) {
         Type type = null;

         try {
            type = Type.GetType(targetClass);
            JsonObjSysBase jsonObj = (JsonObjSysBase)Activator.CreateInstance(type);


            //jsonObj = JsonSerializer.Deserialize<JsonObjSysBase>(json, opts);
            jsonObj = JsonConvert.DeserializeObject<JsonObjSysBase>(json);
            //Logger.wrl("Json: " + json);

            jsonObj.obj_name = targetClass;
            jsonObj.loader = type.FullName;

            //Logger.wrl("Deserialized: " + jsonObj.sys);

            return jsonObj;
         } catch (Exception e) {
            throw new ExceptionLoader("Could not find target class, " + targetClass + ", in loader " + type.FullName);
         }
      }
   }
}
