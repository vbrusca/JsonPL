using com.middlemind.JsonPL.FileIO;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;

namespace com.middlemind.JsonPL {
   /**
   * A centralized utility class that provides access to a number of helpful static methods.
   * @author Victor G. Brusca, Middlemind Games 03/27/2022 05:32 PM EDT
   */
   public class Utils {
      /*
         WeatherForecast? weatherForecast = 
         JsonSerializer.Deserialize<WeatherForecast>(jsonString);
      */

      /*
         string jsonString = JsonSerializer.Serialize(weatherForecast);
      */

      /**
      * A static method used to write the specified object, in JSON format, to the specified file.
      * @param obj           The object to be converted and written in JSON format.
      * @param name          The name of the object that's being written in JSON format.
      * @param fileName      The file name of the destination output file.
      * @param rootOutputDir The root directory of the destination output file.
      * @throws IOException  Throws an IOException during file IO.
      */
      public static void WriteObject(Object obj, String name, String fileName, String rootOutputDir) {
         //Logger.wrl("Utils: WriteObject: Name: " + name);
         /*
         GsonBuilder builder = new GsonBuilder();
         builder.setPrettyPrinting();
         Gson gson = builder.create();
         String jsonString = gson.toJson(obj);
         */
         String jsonString = JsonSerializer.Serialize(obj);
         FileUnloader.WriteStr(Path.GetFullPath(rootOutputDir, fileName).ToString(), jsonString);
      }

      /**
      * A static method used to write the specified object, in JSON format, to standard output.
      * @param obj       The object to be converted and written in JSON format.
      * @param name      The name of the object that's being written in JSON format.
      */
      public static void PrintObject(Object obj, String name) {
         //Logger.wrl("Utils: PrintObject: Name: '" + name + "'");
         /*
         GsonBuilder builder = new GsonBuilder();
         builder.setPrettyPrinting();
         Gson gson = builder.create();
         String jsonString = gson.toJson(obj);
         */
         String jsonString = JsonSerializer.Serialize(obj);
         //clean = chars
         jsonString = jsonString.Replace("\\u003d", "=");
         Logger.wr(jsonString);
      }

      /**
      * A static method used to check if a string is empty or not.
      *
      * @param s The string to check.
      * @return A Boolean value indicating if the provided string is empty or not.
      */
      public static bool IsStringEmpty(String s) {
         if (s == null || s.Equals("")) {
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
      public static bool IsListEmpty(List<Object> l) {
         if (l == null) {
            return true;
         } else if (l != null && l.Count > 0) {
            return true;
         } else {
            return false;
         }
      }
   }
}
