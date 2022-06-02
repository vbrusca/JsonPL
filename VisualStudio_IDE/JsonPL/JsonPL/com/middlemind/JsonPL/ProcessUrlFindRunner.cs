using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL
{
    public class ProcessUrlFindRunner
    {
        private JsonPlState main;
        private string url;

        public ProcessUrlFindRunner(JsonPlState Main, string Url)
        {
            main = Main;
            url = Url;
        }

        public void run()
        {
            main.processUrlFindExec(url, true);
        }
    }
}
