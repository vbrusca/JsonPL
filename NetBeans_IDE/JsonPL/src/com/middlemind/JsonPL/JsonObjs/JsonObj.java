package com.middlemind.JsonPL.JsonObjs;

/**
 * An interface that represents a generic JSON object. This class is used as the
 * base of all Java classes that are used to represent JSON objects.
 *
 * @author Victor G. Brusca, Middlemind Games 07/30/2021 06:46 AM EST
 */
public interface JsonObj {

   /**
    * A method that returns the full class name of the loading class for this
    * JSON object.
    *
    * @return The full class name of the class used to load this JSON object.
    */
   public String GetLoader();

   /**
    * A method that sets the full class name of the loading class for this JSON
    * object.
    *
    * @param s The full class name of the class used to load this JSON object.
    */
   public void SetLoader(String s);

   /**
    * A method that returns the name of this JSON object.
    *
    * @return A string representing the name of this JSON object.
    */
   public String GetName();

   /**
    * A method that sets the name of this JSON object.
    *
    * @param s A string representing the name of this JSON object.
    */
   public void SetName(String s);

   /**
    * A method used to print a representation of this JSON object to standard
    * output.
    */
   public void Print();

   /**
    * A method used to print a string representation of this JSON object to
    * standard output with a prefix.
    *
    * @param prefix A prefix to print before the string representation of this
    * JSON object.
    */
   public void Print(String prefix);
}
