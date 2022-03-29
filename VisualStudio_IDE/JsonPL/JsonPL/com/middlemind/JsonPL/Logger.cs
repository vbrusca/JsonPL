using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL {
   /**
   * A centralized logging class used to write text to standard output and error.
   *
   * @author Victor G. Brusca, Middlemind Games 07/19/2021 06:56 PM EST
   */
   public class Logger {

      /**
      * A static flag that controls this class' logging behavior.
      */
      public static bool LOGGING_ON = true;

      /**
      * A static logging method that writes the provided text, followed by a new
      * line, to standard output.
      *
      * @param s The specified text to write.
      */
      public static void wrl(String s) {
         if (LOGGING_ON) {
            System.Console.Out.WriteLine(s);
            System.Diagnostics.Debug.WriteLine(s);
         }
      }

      /**
      * A static logging method that writes the provided text to standard output.
      *
      * @param s The specified text to write.
      */
      public static void wr(String s) {
         if (LOGGING_ON) {
            System.Console.Out.Write(s);
            System.Diagnostics.Debug.Write(s);
         }
      }

      /**
      * A static logging method that writes the provided text, followed by a new
      * line, to standard error.
      *
      * @param s The specified text to write.
      */
      public static void wrlErr(String s) {
         if (LOGGING_ON) {
            System.Console.Error.WriteLine(s);
            System.Diagnostics.Debug.WriteLine("Error: " + s);
         }
      }
   }
}
