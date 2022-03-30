using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace com.middlemind.JsonPL.FileIO {
   /**
   * A class that is used to write data to a file.
   *
   * @author Victor G. Brusca, Middlemind Games 08/07/2021 11:47 AM EST
   */
   public class FileUnloader {
      /**
       * A static method that writes the specified string to the target destination
       * file.
       *
       * @param file The file to write the data to.
       * @param str The string to write to the file.
       * @throws IOException An IO exception is thrown if there is a file error.
       */
      public static void WriteStr(String file, String str) {
         FileInfo fInf = new FileInfo(file);
         DirectoryInfo directory = new DirectoryInfo(fInf.Directory.FullName);
         if (!directory.Exists) {
            Directory.CreateDirectory(directory.FullName);
         }

         FileStream fs = new FileStream(file, FileMode.Create);
         StreamWriter sw = new StreamWriter(fs);
         sw.Write(str);
         sw.Flush();
         sw.Close();
      }

      /**
       * A static method that writes the specified list of strings to the target
       * destination file.
       *
       * @param file The file to write the data to.
       * @param strs The list of strings to write to the file.
       * @throws IOException An IO exception is thrown if there is a file error.
       */
      public static void WriteList(String file, List<String> strs) {
         FileInfo fInf = new FileInfo(file);
         DirectoryInfo directory = new DirectoryInfo(fInf.Directory.FullName);
         if (!directory.Exists) {
            Directory.CreateDirectory(directory.FullName);
         }

         FileStream fs = new FileStream(file, FileMode.Create);
         StreamWriter sw = new StreamWriter(fs);
         foreach(String s in strs) {
            sw.Write(s + System.Environment.NewLine);
         }

         sw.Flush();
         sw.Close();
      }

      /**
       * A static method that writes the specified byte array to the target
       * destination file.
       *
       * @param file The file to write the data to.
       * @param buff The byte array to write to the file.
       * @throws IOException An IO exception is thrown if there is a file error.
       */
      public static void WriteBuffer(String file, byte[] buff) {
         FileInfo fInf = new FileInfo(file);
         DirectoryInfo directory = new DirectoryInfo(fInf.Directory.FullName);
         if (!directory.Exists) {
            Directory.CreateDirectory(directory.FullName);
         }

         File.WriteAllBytes(file, buff);
      }
   }
}
