package com.middlemind.JsonPL;

/**
 *
 * @author brusc
 */
public class ProcessUrlFindRunner implements Runnable {
    private final JsonPlState main;
    private final String url;
    
    public ProcessUrlFindRunner(JsonPlState Main, String Url) {
        main = Main;
        url = Url;
    }
    
    @Override
    public void run() {
        main.processUrlFindExec(url, true);
    }    
}
