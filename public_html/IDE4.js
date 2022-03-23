/*
 * JSON Programming Language
 * IDE JS
 * Victor G. Brusca 
 * Created on 02/12/2022 4:41 PM EDT
 * Licensed under GNU General Public License v3.0
 */

function createHtmlSpan(txt, name, cfg) {
   var span = document.createElement("span");
   span.setAttribute("style", "margin: " + cfg.margin + "px; font-size: " + cfg.fontSize + "px;");   
   const newContent = document.createTextNode(txt);
   span.appendChild(newContent);
   span.id = name;
   return span;
}

function createHtmlInputText(name, cfg) {
   var ret = document.createElement("input");
   ret.setAttribute("type", "text");
   ret.setAttribute("style", "margin: " + cfg.margin + "px; font-size: " + cfg.fontSize + "px;");   
   ret.setAttribute("id", name);
   return ret;
}

function createHtmlInputButton(name, val, cfg) {
   var ret = document.createElement("input");
   ret.setAttribute("type", "button");
   ret.setAttribute("style", "margin: " + cfg.margin + "px; font-size: " + cfg.fontSize + "px;");   
   ret.setAttribute("id", name);
   ret.setAttribute("value", val);
   return ret;
}

function createHtmlInputSelectOption(txt, val, cfg) {
   var ret = document.createElement("option");
   ret.style.fontSize = cfg.fontSize;
   ret.setAttribute("text", txt);
   ret.innerHTML = txt;
   ret.setAttribute("value", val);   
   return ret;
}

function addOption(sel, txt, val, cfg) {
   sel.appendChild(createHtmlInputSelectOption(txt, val, cfg));
}

function createHtmlInputSelect(name, cfg) {
   var ret = document.createElement("select");
   ret.setAttribute("style", "margin: " + cfg.margin + "px; min-width: 200px; font-size: " + cfg.fontSize + "px;");
   ret.appendChild(createHtmlInputSelectOption("SELECT ONE", "empty", cfg));
   ret.setAttribute("id", name);   
   return ret;
}

function createHtmlBr(cfg) {
   return document.createElement("br");   
}

function createHtmlDiv(indt, cfg, name) {
   var ret = document.createElement("div");
   ret.id = name;
   ret.setAttribute("style", "float: left; margin: " + cfg.margin + "px;");
   
   var child = document.createElement("div");
   child.id = name + "_spacer_div";
   child.setAttribute("style", "float: left; margin: 0px; width: " + indt + "px;");
   
   ret.appendChild(child);
   return ret;
}

function createHtmlDivHidden(indt, cfg, name) {
   var ret = document.createElement("div");
   ret.id = name;
   ret.setAttribute("style", "float: left; margin: " + cfg.margin + "px; display: none;");
   
   var child = document.createElement("div");
   child.id = name + "_spacer_div";
   child.setAttribute("style", "float: left; margin: 0px; width: " + indt + "px;");   

   ret.appendChild(child);
   return ret;
}

function createHtmlDivClear(indt, cfg, name) {
   var ret = document.createElement("div");
   ret.id = name;
   ret.setAttribute("style", "float: left; clear:both; margin: 0px;");
   return ret;
}