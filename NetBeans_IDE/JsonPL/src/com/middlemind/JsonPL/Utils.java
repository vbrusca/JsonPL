package com.middlemind.JsonPL;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.middlemind.JsonPL.FileIO.FileUnloader;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

/**
 *
 * @author Victor G. Brusca, Middlemind Games 03/27/2022 05:32 PM EDT
 */
public class Utils {
    /**
     * A static method used to write the specified object, in JSON format, to the specified file.
     * @param obj           The object to be converted and written in JSON format.
     * @param name          The name of the object that's being written in JSON format.
     * @param fileName      The file name of the destination output file.
     * @param rootOutputDir The root directory of the destination output file.
     * @throws IOException  Throws an IOException during file IO.
     */
    public static void WriteObject(Object obj, String name, String fileName, String rootOutputDir) throws IOException {
        //Logger.wrl("Utils: WriteObject: Name: " + name);
        GsonBuilder builder = new GsonBuilder();
        builder.setPrettyPrinting();
        Gson gson = builder.create();            
        String jsonString = gson.toJson(obj);
        FileUnloader.WriteStr(Paths.get(rootOutputDir, fileName).toString(), jsonString);
    }
    
    /**
     * A static method used to write the specified object, in JSON format, to standard output.
     * @param obj       The object to be converted and written in JSON format.
     * @param name      The name of the object that's being written in JSON format.
     */
    public static void PrintObject(Object obj, String name) {
        //Logger.wrl("Utils: PrintObject: Name: '" + name + "'");
        GsonBuilder builder = new GsonBuilder();
        builder.setPrettyPrinting();
        Gson gson = builder.create();            
        String jsonString = gson.toJson(obj);
        Logger.wr(jsonString);        
    }
    
   /**
    * A static method used to check if a string is empty or not.
    *
    * @param s The string to check.
    * @return A Boolean value indicating if the provided string is empty or not.
    */
   public static boolean IsStringEmpty(String s) {
      if (s == null || s.equals("")) {
         return true;
      } else {
         return false;
      }
   }

   /**
    * A static method used to check if a List if empty or not.
    *
    * @param l The List to check.
    * @return A Boolean value indicating if the provided string is empty or not.
    */
   public static boolean IsListEmpty(List l) {
      if (l == null) {
         return true;
      } else if (l != null && l.isEmpty()) {
         return true;
      } else {
         return false;
      }
   }    
}
