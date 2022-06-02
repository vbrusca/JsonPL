using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL
{
    public class ProcessUrlSetRunner
    {
        private JsonPlState main;
        private string url;

        public ProcessUrlSetRunner(JsonPlState Main, string Url)
        {
            main = Main;
            url = Url;
        }

        public void run()
        {
            main.processUrlSetExec(url, true);
        }
    }
}
