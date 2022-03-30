using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL.Exceptions {
   /**
   * A specific implementation of the ExceptionBase class.
   *
   * @author Victor G. Brusca, Middlemind Games 07/30/2021 6:52 AM EST
   */
   public class ExceptionLoader : ExceptionBase
   {
      /**
      * A simple constructor.
      *
      * @param errorMEssage The error message associated with the specified
      * exception.
      */
      public ExceptionLoader(string errorMEssage) : base(errorMEssage) {
      }
   }
}
