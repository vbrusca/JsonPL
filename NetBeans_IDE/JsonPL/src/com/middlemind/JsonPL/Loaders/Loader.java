package com.middlemind.JsonPL.Loaders;

import com.middlemind.JsonPL.Exceptions.ExceptionLoader;
import com.middlemind.JsonPL.JsonObjs.JsonObjBase;
import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;

/**
 * An interface used to define the basic loader class implementation.
 *
 * @author Victor G. Brusca, Middlemind Games 07/27/2021 6:02 PM EST
 */
public interface Loader {

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
   public JsonObjBase ParseJson(String json, String targetClass) throws ExceptionLoader;
}
