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
          "left": "b1",
          "op": "=",
          "right": {
            "sys": "bex",
            "left": "$this.tmp1",
            "op": "==",
            "right": "$i1"
          }
        },
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
grammar.type_base = ["int", "bool", "string"];

var LOGGING = true;

function wr(s) {
	if(LOGGING === true) {
		console.log(s);
	}
}

function executeClass(prog) {
	if(prog.hasOwnProperty("call") === true && prog.call !== null) {
		var callName = prog.call.name;
		var callArgs = prog.call.args;
		var progProc = findProc(prog, callName);
		if(progProc !== null) {
			var progProcLines = progProc.lines;
			for(var i = 0; i < progProcLines.length; i++) {
				var progProcLine = progProcLines[i];
				executeProcLine(progProcLine, callName, callArgs, prog, progProc);
			}
		} else {
			wr("Error: executing class missing call function");
		}
	}
}

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
	wr("Notice: processVarString: Found var name, '" + varName + "'");

	if(fnd === null) {
		wr("Error: Could not find variable with name, '" + varName + "'");
	}
	return fnd;
}

function executeProcLine(procLine, callName, callArgs, prog, proc) {
	if(procLine.sys === "asgn") {
		var left = procLine.left;
		var op = procLine.op;
		var right = procLine.right;
		var leftVar = processVarString(left, prog, proc);
		var rightVar = processVarString(right, prog, proc);
		
		if(rightVar === null) {
			wr("Error: Right value of assignment statement is null");
			return false;
			
		} else if(leftVar === null) {
			wr("Error: Left value of assignment statement is null");			
			return false;
			
		} else if(leftVar.val.type.trim() !== rightVar.val.type.trim()) {
			wr("Error: Right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
			return false;
			
		} else if(validateOpAsgnInit(op) === false) {
			wr("Error: Operator is not valid, '" + op + "'");
			return false;
			
		} else if(rightVar.val.v === null) {
			wr("Error: The right value has not been assigned to and is null.");
			return false;
			
		}
		
		if(op === "=") {
			wr("Notice: executeProcLine: Setting '" + leftVar.name + "' to the value of '" + rightVar.name + "', value, " + rightVar.val.v);
			leftVar.val.v = rightVar.val.v;
		}
	}
}

function findProc(prog, name) {
	for(var i = 0; i < prog.procs.length; i++) {
		if(prog.procs[i].name === name) {
			return prog.procs[i];
		}
	}
	return null;
}

function validateOpAsgnInit(opString) {
	if(grammar.op_asgn_init.indexOf(opString) === -1) {
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

console.log("test");
validateGrammarClass(prog);
validateGrammarClassVars(prog);
validateGrammarClassProcs(prog);
executeClass(prog);