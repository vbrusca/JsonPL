var code = {
  "sys": "class",
  "name": "test",
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

var prog = code; //JSON.parse(code);
validateGrammarVars(prog);
validateGrammarProcs(prog);

var grammar = {};
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

function validateGrammarVars(prog) {
	if(prog.hasOwnProperty("vars") === true) {
		for(var v in prog.vars) {
			if(v.hasOwnProperty("sys") === false || grammar.class_vars.contains(v.sys) === false) {
				return "Error: invalid var entry: " + JSON.stringify(v);
			}
		}
	}
}

function validateGrammarProcs(prog) {
	//class
	if(prog.hasOwnProperty("procs") === true) {
		//procs
		for(var v in prog.procs) {
			//proc
			if(v.hasOwnProperty("sys") === false || grammar.class_procs.contains(v.sys) === false) {
				return "Error: invalid var entry: " + JSON.stringify(v);
			} else {
				
				if(v.hasOwnProperty("args") === true) {
					for(var a in v.args) {
						if(a.hasOwnProperty("sys") === false || grammar.class_procs_args.contains(a.sys) === false) {
							return "Error: invalid arg entry: " + JSON.stringify(a);
						}
					}
				}
				
				if(v.hasOwnProperty("vars") === true) {
					for(var b in v.vars) {
						if(b.hasOwnProperty("sys") === false || grammar.class_procs_vars.contains(b.sys) === false) {
							return "Error: invalid var entry: " + JSON.stringify(b);
						}
					}
				}
			}
		}		
	}
}

console.log("test");