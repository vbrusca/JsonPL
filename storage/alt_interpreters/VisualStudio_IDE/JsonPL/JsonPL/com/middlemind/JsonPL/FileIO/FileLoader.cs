using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace com.middlemind.JsonPL.FileIO {
   /**
   * A class that is used to load a file's contents into different data
   * structures.
   *
   * @author Victor G. Brusca, Middlemind Games 07/19/2021 6:44 PM EST
   */
   public class FileLoader {

      /**
      * A static method that is used to load a file's contents into a list of
      * strings.
      *
      * @param file The target file to load.
      * @return A list of strings representing the contents of the file.
      * @throws IOException An IO exception is thrown if there is a file error.
      */
      public static List<string> Load(string file) {
         return new List<string>(System.IO.File.ReadAllLines(Path.GetFullPath(file)));
      }

      /**
      * A static method that is used to load a file's contents into a string.
      *
      * @param file The target file to load.
      * @return A string representing the contents of the file.
      * @throws IOException An IO exception is thrown if there is a file error.
      */
      public static string LoadStr(string file) {
         return System.IO.File.ReadAllText(Path.GetFullPath(file));
      }

      /**
       * A static method that is used to load a file's contents into an array of
       * bytes.
       *
       * @param file The target file to load.
       * @return A byte array representing the contents of the file.
       * @throws IOException An IO exception is thrown if there is a file error.
       */
      public static byte[] LoadBin(string file) {
         return System.IO.File.ReadAllBytes(Path.GetFullPath(file));
      }
   }
}
