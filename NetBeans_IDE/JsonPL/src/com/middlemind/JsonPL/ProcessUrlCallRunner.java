package com.middlemind.JsonPL;

/**
 *
 * @author brusc
 */
public class ProcessUrlCallRunner implements Runnable {
    private final JsonPlState main;
    private final String url;
    
    public ProcessUrlCallRunner(JsonPlState Main, String Url) {
        main = Main;
        url = Url;
    }
    
    @Override
    public void run() {
        main.processUrlCallExec(url, true);
    }    
}
