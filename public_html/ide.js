/*
 * JSON Programming Language
 * IDE JS
 * Victor G. Brusca 
 * Created on 02/12/2022 4:41 PM EDT
 * Licensed under GNU General Public License v3.0
 */
var rows = {};
var row = -1;
var objId = -1;

function cont(arr, elm) {
   for(var i = 0; i < arr.length; i++) {
      if(arr[i] === elm) {
         return true;
      }
   }
   return false;
}

function getObjId() {
   return ++objId;
}

function processOpts(rawOpts) {
   if(rawOpts === null || rawOpts === "") {
      return null;
   }
   
   var itms = rawOpts.split("&");
   var ret = {};
   for(var i = 0; i < itms.length; i += 2) {
      ret[itms[i]] = itms[i+1];
   }
   return ret;
}

function createHtmlForm(ideObj, indent, cfg) {
   wr("createHtmlForm: " + indent);
   row++;
   cfg.row = row;
   var props = Object.keys(ideObj);
  
   //Add open/close support to the main form
   var dvMain = createHtmlDiv(indent, cfg);
   //dvMain.style.clear = "both";
   dvMain.id = "mainDiv_" + row;
   //dvMain.style.width = "100%";

   var attr = ideObj.lookup.properName;
   var dvName = createHtmlDiv(0, cfg);
   dvName.id = "mainNameDiv_" + row;
   //dv.style.width = "100%";
   //dvName.style.clear = "both";
   
   var dvInner = createHtmlDiv(0, cfg);   
   dvInner.id = "mainInnerDiv_" + row;
   var span = createHtmlSpan(attr, cfg);

   dvInner.appendChild(span);
   dvInner.appendChild(createHtmlBr(cfg));
   dvName.appendChild(dvInner);   
   dvMain.appendChild(dvName);
   
   var dvOpen = createHtmlDiv(0, cfg);
   dvOpen.id = "mainOpenDiv_" + row;
   //dvOpen.style.clear = "both";

   var dvClosed = createHtmlDiv(0, cfg);
   dvClosed.id = "mainCloseDiv_" + row;            

   dvClosed.appendChild(createHtmlSpan("+", cfg));
   dvClosed.style.display = "none";   
   //dvClosed.style.clear = "both";
   
   this.hndl = function(e) {
      wr("Click handler");
      if(this.closed.style.display === "none") {
         this.open.style.display = "none";
         this.closed.style.display = "";
      } else {
         this.open.style.display = "";
         this.closed.style.display = "none";                  
      }
   }.bind({"row": row, "elem": sel, "open": dvOpen, "closed": dvClosed});
   dvName.addEventListener('click', hndl, false);            

   this.hndl = function(e) {
      wr("Click handler");
      if(this.closed.style.display === "none") {
         this.open.style.display = "none";
         this.closed.style.display = "";
      } else {
         this.open.style.display = "";
         this.closed.style.display = "none";                  
      }
   }.bind({"row": row, "elem": sel, "open": dvOpen, "closed": dvClosed});            
   dvClosed.addEventListener('click', hndl, false);  
            
   dvMain.appendChild(dvClosed);
   dvMain.appendChild(dvOpen);
   
   row++;
   cfg.row = row;   
   
   for(var p in props) {
      attr = props[p];
      if(attr !== "lookup") {
         if(cont(ideObj.lookup.visible, attr) === true) {
            var dvRowMain = createHtmlDiv(indent, cfg);
            if(row % 2 === 0) {
               dvRowMain.style.backgroundColor = "#cccccc";
            } else {
               dvRowMain.style.backgroundColor = "#eeeeee";               
            }
            
            dvRowMain.style.border = "1px solid black";
            dvRowMain.style.width = cfg.width;            
            dvRowMain.id = "rowDiv_" + row;
            dvRowMain.style.clear = "both";
            
            var dvRowName = createHtmlDiv(0, cfg);
            dvRowName.id = "nameDiv_" + row;
            span = createHtmlSpan(attr + ":", cfg);
            dvRowName.appendChild(span);
            dvRowMain.appendChild(dvRowName);
            
            var dvRowOpen = createHtmlDiv(0, cfg);
            dvRowOpen.id = "openDiv_" + row;
            
            var dvRowClosed = createHtmlDiv(0, cfg);
            dvRowClosed.id = "closeDiv_" + row;            
            
            dvRowClosed.appendChild(createHtmlSpan("+", cfg));
            dvRowClosed.style.display = "none";
            
            var rowOpts = null;
            cfg.rowOpts = null;
            
            this.hndl = function(e) {
               wr("Click handler");
               if(this.closed.style.display === "none") {
                  this.open.style.display = "none";
                  this.closed.style.display = "";
               } else {
                  this.open.style.display = "";
                  this.closed.style.display = "none";                  
               }
            }.bind({"row": row, "elem": sel, "open": dvRowOpen, "closed": dvRowClosed});
            dvRowName.addEventListener('click', hndl, false);            

            this.hndl = function(e) {
               wr("Click handler");
               if(this.closed.style.display === "none") {
                  this.open.style.display = "none";
                  this.closed.style.display = "";
               } else {
                  this.open.style.display = "";
                  this.closed.style.display = "none";                  
               }
            }.bind({"row": row, "elem": sel, "open": dvRowOpen, "closed": dvRowClosed});            
            dvRowClosed.addEventListener('click', hndl, false);            

            dvRowMain.appendChild(dvRowClosed);
            dvRowMain.appendChild(dvRowOpen);
            dvRowOpen.appendChild(createHtmlDivClear(0, cfg));
            
            wr("=============================:" + ideObj.lookup[attr]);
            if(ideObj.lookup[attr].indexOf("~") !== -1) {
               rowOpts = ideObj.lookup[attr].substring(ideObj.lookup[attr].indexOf("~") + 1);
               wr("==================Found row opts: " + rowOpts);
               ideObj.lookup[attr] = (ideObj.lookup[attr].split("~")[0]);
               cfg.rowOpts = rowOpts;
            }
            
            if(ideObj.lookup[attr] === "string") {
               var txt = createHtmlInputText(ideObj[attr], cfg);
               txt.setAttribute("id", "txt_" + row);
               txt.setAttribute("data", "update");                  
               dvRowOpen.appendChild(txt);

               this.hndl = function(e) {
                  var data = this.elem.getAttribute("data");
                  if(data === "update") {
                     this.ideObj[this.attr] = txt.value;
                     wr("Updating ideObj attr: " + this.attr);
                  }

               }.bind({"row": row, "elem": txt, "parent": dvRowMain, "cfg": cfg, "indent": (indent + 1), "attr": attr, "ideObj": ideObj});
               txt.addEventListener('change', hndl, false);

            } else if(ideObj.lookup[attr].indexOf("obj::sys::val") === 0) {               
               dvRowOpen.appendChild(createHtmlForm(createObjVal(processOpts(cfg.rowOpts)), (indent + 1), cfg));
                              
            } else if(ideObj.lookup[attr].indexOf("obj::sys::ret") === 0) {               
               dvRowOpen.appendChild(createHtmlForm(createObjRet(), (indent + 1), cfg));               
                                                            
            } else if(cont(ideObj.lookup.add, attr) === true) {
               wr("Found data type for add: " + ideObj.lookup[attr]);
               if(ideObj.lookup[attr].indexOf("array::") !== -1) {
                  var start = ideObj.lookup[attr].indexOf("{");
                  var stop = ideObj.lookup[attr].indexOf("}");
                  var list = ideObj.lookup[attr].substring(start + 1, stop);
                  var vals = list.split(",");
                  var v = null;
                  var opts = null;
                  var sdv = createHtmlDiv(0, cfg);                  
                  var sel = createHtmlInputSelect(cfg);
                  sel.setAttribute("id", "add_" + row);
                  sel.setAttribute("data", "add");                  
                  
                  for(var i = 0; i < vals.length; i++) {
                     cfg.opts = null;
                     
                     if(vals[i].indexOf("~") !== -1) {
                        opts = vals[i].substring(vals[i].indexOf("~") + 1);
                        wr("==================Found opts: " + opts);
                        vals[i] = (vals[i].split("~")[0]);
                        cfg.opts = opts;
                     }
                     
                     if(vals[i].indexOf("=") !== -1) {
                        v = vals[i].split("=");
                        if(v[1].indexOf("^") === -1) {
                           addOption(sel, v[1], v[0], cfg);                           
                        } else {
                           v = v[1].split("^");
                           addOption(sel, v[0], v[1], cfg);
                        }
                     } else {
                        v = vals[i];
                        addOption(sel, v, v, cfg);
                     }                     
                  }
                  
                  sdv.appendChild(sel);
                  dvRowOpen.appendChild(sdv);                  
                  dvRowOpen.appendChild(createHtmlDivClear(0, cfg));
                  
                  this.hndl = function(e) {
                     wr("Handle Selection: " + ideObj.sys + ", " + this.indent);
                     var selOpt = this.elem.options[this.elem.selectedIndex];
                     var data = this.elem.getAttribute("data");
                     this.parent.appendChild(createHtmlDivClear(0, cfg));
                     
                     if(data === "add") {
                        if(selOpt.value === "obj::sys::decl") {
                           this.parent.appendChild(createHtmlForm(createObjDecl(), this.indent, this.cfg));
                           
                        } else if(selOpt.value === "obj::sys::init") {
                           this.parent.appendChild(createHtmlForm(createObjInit(), this.indent, this.cfg));
                           
                        } else if(selOpt.value === "obj::sys::const") {
                           this.parent.appendChild(createHtmlForm(createObjConst(), this.indent, this.cfg));                           
                        
                        } else if(selOpt.value === "obj::sys::proc") {
                           this.parent.appendChild(createHtmlForm(createObjProc(), this.indent, this.cfg));
                        
                        } else if(selOpt.value === "obj::sys::func") {
                           this.parent.appendChild(createHtmlForm(createObjFunc(), this.indent, this.cfg));
                                                
                        } else if(selOpt.value === "obj::sys::call") {
                           this.parent.appendChild(createHtmlForm(createObjCall(), this.indent, this.cfg));
                        
                        } else if(selOpt.value === "obj::sys::fcall") {
                           this.parent.appendChild(createHtmlForm(createObjFcall(), this.indent, this.cfg));                        
                        
                        } else if(selOpt.value === "obj::sys::asgn") {
                           this.parent.appendChild(createHtmlForm(createObjAsgn(), this.indent, this.cfg));                           
                        
                        } else if(selOpt.value === "obj::sys::ret") {
                           this.parent.appendChild(createHtmlForm(createObjRet(), this.indent, this.cfg));
                           
                        } else if(selOpt.value === "obj::sys::arg") {
                           this.parent.appendChild(createHtmlForm(createObjArg(), this.indent, this.cfg));                        
                                                                        
                        } else if(selOpt.value === "obj::sys::val") {
                           this.parent.appendChild(createHtmlForm(createObjVal(), this.indent, this.cfg));                           
                           
                        }
                        
                        if(this.ideObj.sys === "val") {
                           wr("Setting ideObj." + this.attr + " to value " + selOpt.value);
                           this.ideObj[this.attr] = selOpt.value;
                        }
                     }
                     wr(this.row + " Selected Index: " + this.elem.selectedIndex + " Row: " + row + " Val: " + selOpt.value + " Txt: " + selOpt.text + " Data: " + this.elem.getAttribute("data")); 
                  
                  }.bind({"row": row, "elem": sel, "parent": dvRowOpen, "cfg": cfg, "indent": (indent + 1), "attr": attr, "ideObj": ideObj});
                  sel.addEventListener('change', hndl, false);            
               }
            }
            
            dvOpen.appendChild(dvRowMain);
            dvMain.appendChild(dvOpen);
            rows[dvRowMain.id] = {"div": dvRowMain, "ideObj": ideObj};
            row++;
            cfg.row = row;
         }
      }
   }
   
   return dvMain;
}

function createHtmlSpan(txt, cfg) {
   var span = document.createElement("span");
   span.setAttribute("style", "margin: " + cfg.margin + "px; font-size: " + cfg.fontSize + "px;");   
   const newContent = document.createTextNode(txt);
   span.appendChild(newContent);
   return span;
}

function createHtmlInputText(txt, cfg) {
   var ret = document.createElement("input");
   ret.setAttribute("type", "text");
   ret.setAttribute("style", "margin: " + cfg.margin + "px; font-size: " + cfg.fontSize + "px;");   
   ret.setAttribute("value", txt);
   return ret;
}

function createHtmlInputSelectOption(text, value, cfg) {
   var ret = document.createElement("option");
   ret.style.fontSize = cfg.fontSize;
   ret.setAttribute("text", text);
   ret.innerHTML = text;
   ret.setAttribute("value", value);   
   return ret;
}

function addOption(sel, text, value, cfg) {
   sel.appendChild(createHtmlInputSelectOption(text, value, cfg));
}

function createHtmlInputSelect(cfg) {
   var ret = document.createElement("select");
   ret.setAttribute("style", "margin: " + cfg.margin + "px; min-width: 200px; font-size: " + cfg.fontSize + "px;");
   ret.appendChild(createHtmlInputSelectOption("SELECT ONE", "empty", cfg));
   return ret;
}

function createHtmlBr(cfg) {
   return document.createElement("br");   
}

function createHtmlDiv(indent, cfg) {
   wr("createHtmlDiv: " + (indent * 30));
   var indt = (indent * 30);
   var ret = document.createElement("div");
   ret.id = "div_" + cfg.row;
   ret.setAttribute("style", "float: left; margin: " + cfg.margin + "px;");
   
   var child = document.createElement("div");
   child.id = "spacerDiv_" + cfg.row;
   child.setAttribute("style", "float: left; margin: 0px; width: " + indt + "px;");   

   ret.appendChild(child);
   return ret;
}

function createHtmlDivClear(indent, cfg) {
   wr("createHtmlDivClear: " + indent);
   var ret = document.createElement("div");
   ret.id = "clearDiv_" + cfg.row;
   ret.setAttribute("style", "float: left; clear:both; margin: 0px;");
   return ret;
}

function createObjProgram() {
   return {
      "sys": "class",
      "name": "program1",
      "access": "public",
      "call": {},
      "vars": [],
      "procs": [],
      "funcs": [],
      "ret": {},
      "lookup": {
         "properName": "JSON PL Program",
         "sys": "string",
         "name": "string",
         "access": "string",
         "call": "obj::sys::call",
         "vars": "array::{obj::sys::decl=Add Variable Declaraion,obj::sys::init=Add Variable Initialization}",
         "procs": "array::{obj::sys::proc=Add Procedure}",
         "funcs": "array::{obj::sys::func=Add Function}",
         "ret": "obj::sys::ret",
         "visible": ["name", "call", "vars", "procs", "funcs", "ret"],
         "invisible": ["sys", "access"],
         "add": ["vars", "procs", "funcs"]
      }
   };
}

function createObjCall() {
   return {
      "sys": "call",
      "name": "procedure1",
      "args": [],
      "ret": {},
      "lookup": {
         "properName": "Call Procedure Obj",
         "sys": "string",
         "name": "array::{string=Program Procedures^list_prog_procs}",
         "args": "array::{obj::sys::arg=Add Argument Call~call&true}",
         "ret": "obj::sys::ret",
         "visible": ["name", "args"],
         "invisible": ["sys", "ret"],
         "add": ["args", "name"]
      }
   };
}

function createObjFcall() {
   return {
      "sys": "fcall",
      "name": "function1",
      "arg": {},
      "ret": {},
      "lookup": {
         "properName": "Call Function Obj",
         "sys": "string",
         "name": "string",
         "arg": "obj::sys::arg~~call&true",
         "ret": "obj::sys::ret",
         "visible": ["name", "arg"],
         "invisible": ["sys", "ret"],
         "add": []
      }
   };
}

function createObjVal(opts) {
   var ret = {
      "sys": "val",
      "type": "string",
      "name": "val" + getObjId(),
      "v": 0,
      "lookup": {
         "properName": "Value Obj",
         "sys": "string",
         "type": "array::{string=Integer^int,string=Boolean^bool,string=String^string,string=Float^float}",
         "v": "string",
         "visible": ["type", "v"],
         "invisible": ["sys"],
         "add": ["type"]
      }      
   };
   
   if(opts !== null && (opts.no_v === true || opts.no_v === "true")) {
      ret.lookup.invisible = ["sys", "v"];
      ret.lookup.visible = ["type"];
   } 
   
   return ret; 
}

function createObjRet() {
   return {
      "sys": "ret",
      "name": "ret" + getObjId(),
      "val": {},
      "lookup": {
         "properName": "Return Obj",
         "sys": "string",
         "name": "string",
         "val": "obj::sys::val",
         "visible": ["name", "val"],
         "invisible": ["sys"],
         "add": []         
      }      
   };
}

function createObjAsgn() {
   return {
      "sys": "asgn",
      "name": "asgn" + getObjId(),
      "left": {},
      "op": "",
      "right": {},
      "lookup": {
         "properName": "Assignment Obj",
         "sys": "string",
         "left": "array::{string=Program Variable^program_var,string=Local Variable^local_var}",
         "op": "=",
         "right": "array::{string=Program Variable^program_var,string=Local Variable^local_var,obj::sys::const=Constant,obj::sys::bex=Boolean Expression,obj::sys::exp=Numeric Expression,obj::sys::call=Procedure Call,obj::sys::fcall=Function Call}",
         "visible": ["left", "right"],
         "invisible": ["sys", "op", "name"],
         "add": ["left", "right"]
      }      
   };
}

function createObjArg() {
   return {
      "sys": "arg",
      "name": "arg" + getObjId(),
      "val": {},
      "lookup": {
         "properName": "Argument Obj",
         "sys": "string",
         "name": "string",
         "val": "obj::sys::val",
         "visible": ["name", "val"],
         "invisible": ["sys"],
         "add": []         
      }      
   };
}

function createObjDecl() {
   return {
      "sys": "decl",
      "name": "decl" + getObjId(),
      "val": {},
      "access": "public",
      "lookup": {
         "properName": "Variable Declare Obj",
         "sys": "string",
         "name": "string",
         "val": "obj::sys::val~no_v&true",
         "access": "string",
         "visible": ["name", "val"],
         "invisible": ["sys", "access"],
         "add": []
      }
   };
}

function createObjConst() {
   return {
      "sys": "decl",
      "name": "const",
      "val": {},
      "access": "public",
      "lookup": {
         "properName": "Variable Declare Constant Obj",
         "sys": "string",
         "name": "string",
         "val": "obj::sys::val",
         "access": "string",
         "visible": ["name", "val"],
         "invisible": ["sys", "access"],
         "add": []         
      }
   };
}

function createObjInit() {
   return {
      "sys": "init",
      "name": "init" + getObjId(),
      "val": {},
      "access": "public",
      "lookup": {
         "properName": "Variable Initialize Obj",
         "sys": "string",
         "name": "string",
         "val": "obj::sys::val",
         "access": "string",
         "visible": ["name", "val"],
         "invisible": ["sys", "access"],
         "add": []
      }      
   };
}

function createObjProc() {
   return {
      "sys": "proc",
      "name": "proc" + getObjId(),
      "access": "public",
      "args": [],
      "vars": [],
      "ret": {},
      "lines": [],
      "lookup": {
         "properName": "Procedure Obj",
         "sys": "string",
         "name": "string",
         "access": "string",
         "args": "array::{obj::sys::arg=Add Argument}",
         "vars": "array::{obj::sys::decl=Add Variable Declaraion,obj::sys::init=Add Variable Initialization}",
         "ret": "obj::sys::ret",
         "lines": "array::{obj::sys::asgn=Add Variable Assignment}",
         "visible": ["name", "args", "vars", "lines", "ret"],
         "invisible": ["sys", "access"],
         "add": ["args", "vars", "lines"]
      }
   };
}

function createObjFunc() {
   return {
      "sys": "func",
      "name": "func" + getObjId(),
      "access": "public",
      "arg": {},
      "vars": [],
      "ret": {},
      "lines": [],
      "lookup": {
         "properName": "Function Obj",
         "sys": "string",
         "name": "string",
         "access": "string",
         "arg": "obj::sys::arg",
         "vars": "array::{obj::sys::decl=Add Variable Declaraion,obj::sys::init=Add Variable Initialization}",
         "ret": "obj::sys::ret",
         "lines": "array::{obj::sys::asgn=Add Variable Assignment,obj::sys::if=Add If Statement,obj::sys::for=Add For Loop}",
         "visible": ["name", "arg", "vars", "lines", "ret"],
         "invisible": ["sys", "access"],
         "add": ["arg", "vars", "lines"]
      }
   };
}