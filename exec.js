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
      "type": "bool"
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
          "type": "int"
        }
      ],
	  "vars": [
        {
          "sys": "decl",
          "name": "b1",
          "type": "bool"
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
grammar.class_vars_required_init = ["sys", "name", "type", "val", "access"];
grammar.class_vars_optional_init = [];
grammar.class_vars_required_decl = ["sys", "name", "type", "access"];
grammar.class_vars_optional_decl = [];

grammar.class_procs = ["proc"];
grammar.class_procs_required_proc = ["sys", "name", "access", "lines"];
grammar.class_procs_optional_proc = [];

grammar.class_procs_args = ["arg"];
grammar.class_procs_args_required_arg = ["sys", "name", "type"];
grammar.class_procs_args_optional_arg = ["v"];

grammar.class_procs_vars = ["init", "decl"];
grammar.class_procs_vars_required_init = ["sys", "name", "type", "val"];
grammar.class_procs_vars_optional_init = [];
grammar.class_procs_vars_required_decl = ["sys", "name", "type"];
grammar.class_procs_vars_optional_decl = [];

grammar.val_required = ["sys", "type", "v"];
grammar.val_optional = [];

grammar.ret_required = ["sys", "val"];
grammar.ret_optional = [];

grammar.class_procs_lines = ["asgn", "if"];

grammar.call_required = ["sys", "name", "args"];
grammar.call_optional = [];

function executeClass(prog) {
	if(prog.hasOwnProperty("call") === true && prog.call !== null) {
		var callName = prog.call.name;
		var callArgs = prog.call.args;
		var progProc = findProc(prog, callName);
		if(progProc !== null) {
			var progProcLines = progProc.lines;
			for(var i = 0; i < progProcLines.length; i++) {
				var progProcLine = progProcLines[i];
				executeProcLine(progProcLine, callName, callArgs, prog);
			}
		} else {
			console.log("Error: executing class missing call function");
		}
	}
}

function executeProcLine(procLine, callName, callArgs, prog) {
	
}

function findProc(prog, name) {
	for(var i = 0; i < prog.procs.length; i++) {
		if(prog.procs[i].name === name) {
			return prog.procs[i];
		}
	}
	return null;
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
			if(progVar.hasOwnProperty("sys") === false || grammar.class_vars.indexOf(progVar.sys) === -1) {
				console.log("Error: invalid var entry: " + JSON.stringify(progVar));
				return false;
			}
		}
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
			if(validateProperties(proc, grammar.class_procs_required_proc) === false) {
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
						if(validateProperties(procArg, grammar.class_procs_args_required_arg) === false) {
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
						if(procVar.hasOwnProperty("sys") === true && procVar.sys === "init" && validateProperties(procArg, grammar.class_procs_vars_required_init) === false) {
							console.log("Error: invalid proc arg entry: " + JSON.stringify(procVar));
							return false;
							
						} else if(procVar.hasOwnProperty("sys") === true && procVar.sys === "decs" && validateProperties(procArg, grammar.class_procs_vars_required_decl) === false) {
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
validateGrammarClassProcs(prog
execClass(prog);