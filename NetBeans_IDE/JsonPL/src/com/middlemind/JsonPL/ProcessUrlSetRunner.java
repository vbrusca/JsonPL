package com.middlemind.JsonPL;

/**
 *
 * @author brusc
 */
public class ProcessUrlSetRunner implements Runnable {
    private final JsonPlState main;
    private final String url;
    
    public ProcessUrlSetRunner(JsonPlState Main, String Url) {
        main = Main;
        url = Url;
    }
    
    @Override
    public void run() {
        main.processUrlSetExec(url, true);
    }    
}
