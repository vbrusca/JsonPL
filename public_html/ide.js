/*
 * JSON Programming Language
 * IDE JS
 * Victor G. Brusca 
 * Created on 02/12/2022 4:41 PM EDT
 * Licensed under GNU General Public License v3.0
 */
function createHtmlForm(obj) {
   var props = obj.entries();
   var offsetY = 0;
   var offsetX = 0;
   var line = 0;
   var count = 0;
   var len = props.length;
   var main = document.createElement("div");
   
   for(var p in props) {
      var span = createHtmlSpan(p);
      main.appendChild(span);
      main.appendChild(createHtmlBr());
      count++;
   }
   
   return main;
}

function createHtmlSpan(txt) {
   var span = document.createElement("span");   
   const newContent = document.createTextNode(txt);
   span.appendChild(newContent);
}

function createHtmlInputText() {
   return document.createElement("input", ["type", "input"]);   
}

function createHtmlBr() {
   return document.createElement("br");   
}