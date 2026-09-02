using System;
using System.Collections.Generic;
using System.Text;

namespace com.middlemind.JsonPL
{
    public class ProcessUrlCallRunner
    {
        private JsonPlState main;
        private string url;

        public ProcessUrlCallRunner(JsonPlState Main, string Url)
        {
            main = Main;
            url = Url;
        }

        public void run()
        {
            main.processUrlCallExec(url, true);
        }
    }
}
