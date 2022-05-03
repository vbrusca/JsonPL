using com.middlemind.JsonPL.FileIO;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace com.middlemind.JsonPL {
   /**
   * A centralized utility class that provides access to a number of helpful static methods.
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
      public static void WriteObject(Object obj, string name, string fileName, string rootOutputDir) {
         //Logger.wrl("Utils: WriteObject: Name: " + name);
         string jsonString = JsonConvert.SerializeObject(obj);
         FileUnloader.WriteStr(Path.GetFullPath(rootOutputDir, fileName).ToString(), jsonString);
      }

      /**
      * A static method used to write the specified object, in JSON format, to standard output.
      * @param obj       The object to be converted and written in JSON format.
      * @param name      The name of the object that's being written in JSON format.
      */
      public static void PrintObject(Object obj, string name) {
         //Logger.wrl("Utils: PrintObject: Name: '" + name + "'");
         string jsonString = JsonConvert.SerializeObject(obj, Formatting.Indented, new JsonSerializerSettings {
            NullValueHandling = NullValueHandling.Ignore
         });
         //clean = chars
         jsonString = jsonString.Replace("\\u003d", "=");
         jsonString = jsonString.Replace("\\u0026", "&");
         Logger.wrl(jsonString);
      }

      /**
      * A static method used to check if a string is empty or not.
      *
      * @param s The string to check.
      * @return A Boolean value indicating if the provided string is empty or not.
      */
      public static bool IsStringEmpty(string s) {
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
