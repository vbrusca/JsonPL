using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL.Exceptions {
   /**
   * A base class that should be used for all assembler exception classes.
   * 
   * @author Victor G. Brusca, Middlemind Games 08/19/2021 10:37 AM EST
   */
   public class ExceptionBase : Exception
   {
      /**
      * A simple constructor.
      * 
      * @param errorMEssage The error message associated with the specified exception.
      */
      public ExceptionBase(string errorMEssage) : base(errorMEssage) {
      }
   }
}
