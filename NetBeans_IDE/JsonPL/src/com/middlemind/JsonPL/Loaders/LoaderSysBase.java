package com.middlemind.JsonPL.Loaders;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.middlemind.JsonPL.Exceptions.ExceptionLoader;
import com.middlemind.JsonPL.JsonObjs.JsonObj;
import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;
import java.lang.reflect.InvocationTargetException;

/**
 * A class used to load JSON bit series object data.
 *
 * @author Victor G. Brusca, Middlemind Games 07/30/2021 8:35 AM EST
 */
public class LoaderSysBase implements Loader {

   /**
    * A string representing the name of this class. This is used to define the
    * class in JSON output files.
    */
   public String obj_name = "LoaderSysBase";

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
   @Override
   public JsonObjSysBase ParseJson(String json, String targetClass) throws ExceptionLoader {
      GsonBuilder builder = new GsonBuilder();
      builder.setPrettyPrinting();

      Gson gson = builder.create();
      try {
         JsonObjSysBase jsonObj = (JsonObjSysBase) Class.forName(targetClass).getConstructor().newInstance();
         jsonObj = gson.fromJson(json, jsonObj.getClass());

         //jsonObj.obj_name = targetClass;
         //jsonObj.loader = getClass().getName();
         jsonObj.obj_name = null;
         jsonObj.loader = null;

         return jsonObj;
      } catch (ClassNotFoundException | NoSuchMethodException | InstantiationException | IllegalAccessException | InvocationTargetException e) {
         throw new ExceptionLoader("Could not find target class, " + targetClass + ", in loader " + getClass().getName());
      }
   }
}
