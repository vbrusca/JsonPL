var code = {
  "sys": "class",
  "name": "test",
  "access": "public",
  "call": {"sys":"call", "name":"testProcedure", "args":[]},
  "vars": [
    {
      "sys": "init",
      "name": "tmp1",
      "val": {
        "sys": "val",
        "type": "int",
        "v": 0
      },
      "access": "public"
    },
    {
      "sys": "decl",
      "name": "tmp2",
	  "val": {
		"sys": "val",
		"type": "bool",
		"v": false
	  },
	  "access": "public"
    }
  ],
  "procs": [
    {
      "sys": "proc",
      "name": "testProcedure",
      "access": "public",
      "args": [
        {
          "sys": "arg",
          "name": "i1",
		  "val": {
			"sys": "val",
			"type": "int",
			"v": 0
		  }
        }
      ],
	  "vars": [
        {
          "sys": "decl",
          "name": "b1",
        "val": {
         "sys": "val",
         "type": "bool",
         "v": false
        }
        }	  
	  ],
      "lines": [
        {
          "sys": "asgn",
          "left": "$this.tmp1",
          "op": "=",
          "right": "$i1"
        },
        {
          "sys": "asgn",
          "left": "$this.tmp1",
          "op": "=",
          "right": {"sys":"decl", "name":"const", "val":{"sys":"val", "type":"int", "v":25}}
        },		
        {
          "sys": "asgn",
          "left": "$b1",
          "op": "=",
          "right": {"sys": "bex", "left": "$this.tmp1", "op": "==", "right": "$i1"}
        },
		
		/*
        {
          "sys": "if",
          "bex": {
            "sys": "bex",
            "left": "$this.tmp1",
            "op": ">",
            "right": 0
          },
          "equ": "true",
          "then": [
            {
              "sys": "ret",
              "val": {
                "sys": "val",
                "type": "int",
                "v": 1
              }
            }
          ],
          "else": [
            {
              "sys": "ret",
              "val": {
                "sys": "val",
                "type": "int",
                "v": 0
              }
            }
          ]
        }
		*/
		
      ]
    }
  ]
};

var prog = code;
var grammar = {};
grammar.class_required = ["sys", "name", "access", "vars"];
grammar.class_optional = ["procs", "call"];

grammar.class_vars = ["init", "decl"];
grammar.class_vars_required = ["sys", "name", "val", "access"];
grammar.class_vars_optional = [];

grammar.class_procs = ["proc"];
grammar.class_procs_required = ["sys", "name", "access", "lines"];
grammar.class_procs_optional = [];

grammar.class_procs_args = ["arg"];
grammar.class_procs_args_required = ["sys", "name", "val"];
grammar.class_procs_args_optional = ["v"];

grammar.class_procs_vars = ["init", "decl"];
grammar.class_procs_vars_required = ["sys", "name", "val"];
grammar.class_procs_vars_optional = [];

grammar.val_required = ["sys", "type", "v"];
grammar.val_optional = [];

grammar.ret_required = ["sys", "val"];
grammar.ret_optional = [];

grammar.class_procs_lines = ["asgn", "if"];

grammar.call_required = ["sys", "name", "args"];
grammar.call_optional = [];

grammar.op_asgn_init = ["="];
grammar.op_bex = ["==", "!=", "<", "<=", ">", ">=", "&&", "||"];
grammar.op_exp = ["+", "-", "/", "*"];
grammar.type_base = ["float", "int", "bool", "string"];

var LOGGING = true;
var VAR_THIS = "$this.";
var VAR_NON_THIS = "$";


//UTIL FUNCTIONS
function wr(s) {
	if(LOGGING === true) {
		console.log(s);
	}
}

function isSysObjBex(obj) {
	if(isSysObj(obj) === true && obj.sys === "bex") {
		return true;
	} else {
		return false;
	}
}

function isSysObjExp(obj) {
	if(isSysObj(obj) === true && obj.sys === "exp") {
		return true;
	} else {
		return false;
	}
}

function isSysObjVal(obj) {
	if(isSysObj(obj) === true && obj.sys === "val") {
		return true;
	} else {
		return false;
	}
}

function isSysObjConst(obj) {
	if(isSysObj(obj) === true && obj.sys === "decl" && obj.name === "const") {
		return true;
	} else {
		return false;
	}
}

function isSysObj(obj) {
	if(obj.hasOwnProperty("sys") === true) {
		return true;
	} else {
		return false;
	}
}

function getSysObjType(obj) {
	if(isSysObj(obj) === true) {
		return obj.sys;
	} else {
		return null;
	}
}

function isVarString(str) {
	if(str.indexOf("$") !== -1) {
		return true;
	} else {
		return false;
	}
}

function isVarThis(str) {
	if(str.indexOf(VAR_THIS) !== -1) {
		return true;
	} else {
		return false;
	}
}

function idxVarThis(str) {
	return str.indexOf(VAR_THIS);
}

function isVarNonThis(str) {
	if(str.indexOf(VAR_NON_THIS) !== -1) {
		return true;
	} else {
		return false;
	}
}

function idxVarNonThis(str) {
	return str.indexOf(VAR_NON_THIS);
}


//EXECUTION METHODS
function executeProgram(prog) {
	wr("");
	wr("Executing program: " + prog.name);
	if(prog.hasOwnProperty("call") === true && prog.call !== null) {
		var callName = prog.call.name;
		var callArgs = prog.call.args;
		var progProc = findProc(prog, callName);
		if(progProc !== null) {
			var progProcLines = progProc.lines;
			for(var i = 0; i < progProcLines.length; i++) {
				var progProcLine = progProcLines[i];
				if(getSysObjType(progProcLine) === "asgn") {
					executeProcedureLine(progProcLine, callName, callArgs, prog, progProc, i);
				}
			}
		} else {
			wr("executeProgram: Error: Executing class missing call function");
			return false;
		}
	} else {
		wr("executeProgram: Notice: Executing class no call function");
		return false;		
	}
	return true;
}

function executeProcedureLine(procLine, callName, callArgs, prog, proc, lineNum) {	
	if(procLine.sys === "asgn") {
		wr("");
		wr("Execute procedure line number: " + lineNum + " with source: " + JSON.stringify(procLine));
		
		//handle assignment line
		var left = procLine.left;
		var op = procLine.op;
		var right = procLine.right;
		
		var leftVar = null;
		var leftVarType = null;
		var rightVar = null;
		var rightVarType = null;
		
		//left arg
		if(isSysObj(left) === true) {
			wr("executeProcLine: Error: Left-hand value cannot be an object");
			return false;
		
		} else if(isVarString(left) === true) {
			leftVar = processVarString(left, prog, proc);
		
		} else {
			wr("executeProcLine: Error: Left-hand value must be a var string");
			return false;
		}
		leftVarType = leftVar.sys;
		
		//right arg
		if(isSysObj(right) === true) {
			if(isSysObjBex(right) === true) {
				rightVar = processBexObject(right, prog, proc);
			} else if(isSysObjConst(right) === true) {
				rightVar = right;				
			}
			
		} else if(isVarString(right) === true) {
			rightVar = processVarString(right, prog, proc);
						
		} else {
			wr("executeProcLine: Error: Left-hand value must be a var string");
			return false;
		}
		rightVarType = rightVar.sys;		
		
		wr("executeProcLine: Notice: Checking left: '" + JSON.stringify(leftVar));
		wr("executeProcLine: Notice: Checking right: '" + JSON.stringify(rightVar));		
		if(rightVar === null) {
			wr("executeProcLine: Error: Right value of assignment statement is null");
			return false;
			
		} else if(leftVar === null) {
			wr("executeProcLine: Error: Left value of assignment statement is null");			
			return false;
		
		} else if(validateOpAsgnInit(op) === false) {
			wr("executeProcLine: Error: Operator is not valid, '" + op + "'");
			return false;
			
		} else if(rightVar.val === null) {
			wr("executeProcLine: Error: The right val is null.");
			return false;
			
		} else if(leftVar.val === null) {
			wr("executeProcLine: Error: The left val is null.");
			return false;
			
		} else if(rightVar.val.v === null) {
			wr("executeProcLine: Error: The right value has not been assigned to and is null.");
			return false;
			
		} else if(leftVar.val.type.trim() !== rightVar.val.type.trim()) {
			wr("executeProcLine: Error: Right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
			return false;			
		}
		
		if(op === "=") {
			wr("executeProcLine: Notice: Setting '" + leftVar.name + "' to the value of '" + rightVar.name + "', value, " + rightVar.val.v);
			leftVar.val.v = rightVar.val.v;
		}
	} else {
		return false;
	}
}


//FIND FUNCTIONS
function findVar(name, prog, proc, useProg) {
	if(useProg === true) {
		for(var i = 0; i < prog.vars.length; i++) {
			if(prog.vars[i].name === name) {
				return prog.vars[i];
			}
		}
	} else {
		for(var i = 0; i < proc.vars.length; i++) {
			if(proc.vars[i].name === name) {
				return proc.vars[i];
			}
		}		
	}
	return null;
}

function findArg(name, proc) {
	for(var i = 0; i < proc.args.length; i++) {
		if(proc.args[i].name === name) {
			return proc.args[i];
		}
	}
	return null;
}

function findProc(prog, name) {
	for(var i = 0; i < prog.procs.length; i++) {
		if(prog.procs[i].name === name) {
			return prog.procs[i];
		}
	}
	return null;
}


//PROCESS METHODS
function processVarString(varString, prog, proc) {
	wr("Notice: processVarString: Processing var string, '" + varString + "'");
	var thisStr = "$this.";
	var nonThisStr = "$";
	var idxThis = String(varString).indexOf(thisStr);
	var idxDs = String(varString).indexOf(nonThisStr);
	var varName = null;
	var fnd = null;
	
	if(idxThis !== -1) {
		varName = varString.substring(thisStr.length);
		fnd = findVar(varName, prog, proc, true);

	} else if(idxDs !== -1) {
		//check proc vars
		varName = varString.substring(nonThisStr.length);
		fnd = findVar(varName, prog, proc, false);

		if(fnd === null) {
			//check proc args
			fnd = findArg(varName, proc);
		}
	}
	wr("processVarString: Notice: Found var name, '" + varName + "'");

	if(fnd === null) {
		wr("processVarString: Error: Could not find variable with name, '" + varName + "'");
	}
	
	wr("processVarString: Notice: Returning '" + JSON.stringify(fnd) + "'");
	return fnd;
}

function processBexObject(bexObject, prog, proc) {
	wr("processBexObject: Notice: Processing bex object, '" + JSON.stringify(bexObject) + "'");
	var left = bexObject.left;
	var op = bexObject.op;
	var right = bexObject.right;

	var leftVar = null;
	var leftVarType = null;
	var rightVar = null;
	var rightVarType = null;
	
	//left arg
	if(isSysObj(left) === true) {
		if(isSysObjBex(left) === true) {
			leftVar = processBexObject(left, prog, proc);
		} else if(isSysObjConst(left) === true) {
			leftVar = left;
		}
		
	} else if(isVarString(left) === true) {
		leftVar = processVarString(left, prog, proc);
		
	} else {
		wr("processBexObject: Error: Left-hand value is invalid");
		return false;
	}
	leftVarType = leftVar.sys;
	
	//right arg
	if(isSysObj(right) === true) {
		if(isSysObjBex(right) === true) {
			rightVar = processBexObject(right, prog, proc);
		} else if(isSysObjConst(right) === true) {
			rightVar = right;
		}
		
	} else if(isVarString(right) === true) {
		rightVar = processVarString(right, prog, proc);
					
	} else {
		wr("processBexObject: Error: Right-hand value is invalid");
		return false;
	}
	rightVarType = rightVar.sys;
	
	if(rightVar === null) {
		wr("processBexObject: Error: Right value of assignment statement is null");
		return false;
		
	} else if(leftVar === null) {
		wr("processBexObject: Error: Left value of assignment statement is null");			
		return false;
	
	} else if(validateOpBex(op) === false) {
		wr("processBexObject: Error: Operator is not valid, '" + op + "'");
		return false;
		
	} else if(rightVar.val === null) {
		wr("processBexObject: Error: The right val is null");
		return false;
		
	} else if(leftVar.val === null) {
		wr("processBexObject: Error: The left val is null");
		return false;
		
	} else if(rightVar.val.v === null) {
		wr("processBexObject: Error: The right value has not been assigned to and is null");
		return false;
		
	} else if(leftVar.val.v === null) {
		wr("processBexObject: Error: The left value has not been assigned to and is null");
		return false;		
		
	} else if(leftVar.val.type.trim() !== rightVar.val.type.trim()) {
		wr("processBexObject: Error: Right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
		return false;			
	}
	
	wr("processBexObject: Notice: Comparing with: " + op);
	var res = null;
	var ret = null;
	if(op === "==") {
		res = (leftVar.val.v === rightVar.val.v);

	} else if(op === "!=") {
		res = (leftVar.val.v !== rightVar.val.v);
		
	} else if(op === "<") {
		res = (leftVar.val.v < rightVar.val.v);
		
	} else if(op === ">") {
		res = (leftVar.val.v > rightVar.val.v);		

	} else if(op === "<=") {
		res = (leftVar.val.v <= rightVar.val.v);

	} else if(op === ">=") {
		res = (leftVar.val.v >= rightVar.val.v);

	} else if(op === "&&") {
		res = (leftVar.val.v && rightVar.val.v);

	} else if(op === "||") {
		res = (leftVar.val.v || rightVar.val.v);
	}
	
	ret = {"sys":"decl", "name":"processBexObject", "val":{"sys":"val", "type":"bool", "v":res}};
	wr("processBexObject: Notice: Comparing '" + leftVar.val.v + "' to the value of '" + rightVar.val.v + "', value, (" + res + "), operator, '" + op + "'");
	wr("processBexObject: Notice: Returning '" + JSON.stringify(ret));
	return ret; 
}


//VALIDATE FUNCTIONS
function validateOpAsgnInit(opString) {
	if(grammar.op_asgn_init.indexOf(opString) === -1) {
		return false;
	} else {
		return true;
	}
}

function validateOpBex(opString) {
	if(grammar.op_bex.indexOf(opString) === -1) {
		return false;
	} else {
		return true;
	}
}

function validateGrammarClass(prog) {
	if(validateProperties(prog, grammar.class_required) === false) {
		console.log("Error: invalid class entry: " + JSON.stringify(prog));
		return false;
	}
	return true;
}

function validateGrammarClassVars(prog) {
	if(prog.hasOwnProperty("vars") === true) {
		for(var i = 0; i < prog.vars.length; i++) {
			var progVar = prog.vars[i];
			validateGrammarVar(progVar);
		}
	}
	return true;
}

function validateGrammarVar(varEntry) {
	if(varEntry.hasOwnProperty("sys") === false || grammar.class_vars.indexOf(varEntry.sys) === -1) {
		console.log("Error: validateGrammarVar: Invalid var entry: " + JSON.stringify(varEntry));
		return false;
	}
	return true;
}

function validateGrammarClassCall(prog) {
	if(prog.hasOwnProperty("call") === true) {
		var progCall = prog.call;
		if(validateProperties(progCall, grammar.call_required) === false) {
			console.log("Error: invalid call entry: " + JSON.stringify(progCall));
			return false;
		}
	}
	return true;
}

function validateProperties(obj, req) {
	for(var i = 0; i < req.length; i++) {
		var r = req[i];
		if(obj.hasOwnProperty(r) === false) {
			console.log("Missing property: " + r);
			return false;
		}
	}
	return true;
}

function validateGrammarClassProcs(prog) {
	//class
	if(prog.hasOwnProperty("procs") === true) {
		//procs
		for(var i = 0; i < prog.procs.length; i++) {
			var proc = prog.procs[i];
			//proc
			if(validateProperties(proc, grammar.class_procs_required) === false) {
				console.log("Error: invalid proc entry: " + JSON.stringify(proc));
				return false;
				
			} else if(proc.hasOwnProperty("sys") === false || grammar.class_procs.indexOf(proc.sys) === -1) {
				console.log("Error: invalid proc entry: " + JSON.stringify(proc));
				return false;
				
			} else {
				//args
				if(proc.hasOwnProperty("args") === true) {
					for(var i = 0; i < proc.args.length; i++) {
						var procArg = proc.args[i];
						if(validateProperties(procArg, grammar.class_procs_args_required) === false) {
							console.log("Error: invalid proc arg entry: " + JSON.stringify(procArg));
							return false;
							
						} else if(procArg.hasOwnProperty("sys") === false || grammar.class_procs_args.indexOf(procArg.sys) === -1) {
							console.log("Error: invalid proc arg entry: " + JSON.stringify(procArg));
							return false;
							
						}
					}
				}
				
				//vars
				if(proc.hasOwnProperty("vars") === true) {
					for(var i = 0; i < proc.vars.length; i++) {
						var procVar = proc.vars[i];						
						if(procVar.hasOwnProperty("sys") === true && validateProperties(procArg, grammar.class_procs_vars_required) === false) {
							console.log("Error: invalid proc arg entry: " + JSON.stringify(procVar));
							return false;
														
						} else if(procVar.hasOwnProperty("sys") === false || grammar.class_procs_vars.indexOf(procVar.sys) === -1) {
							console.log("Error: invalid proc var entry: " + JSON.stringify(procVar));
							return false;
							
						}
					}
				}
				
				//lines
				if(proc.hasOwnProperty("lines") === true) {
					for(var i = 0; i < proc.lines.length; i++) {
						var procLine = proc.lines[i];
						if(procLine.hasOwnProperty("sys") === false || grammar.class_procs_lines.indexOf(procLine.sys) === -1) {
							console.log("Error: invalid proc line entry: " + JSON.stringify(procLine));
							return false;
						}						
					}
				}
			}
		}		
	}
	return true;
}


//MAIN EXEC
var lres = false;
console.log("STARTING JSON-PL EXEC:");

lres = validateGrammarClass(prog);
console.log("Validate Grammar: Class: " + lres);

lres = validateGrammarClassVars(prog);
console.log("Validate Grammar: Class Variables: " + lres);

lres = validateGrammarClassProcs(prog);
console.log("Validate Grammar: Class Procedures: " + lres);

lres = executeProgram(prog);
console.log("Execute Class: " + lres);