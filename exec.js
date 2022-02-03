/*
 * JSON Programming Language
 * Victor G. Brusca 
 * Created on 02/03/2022 1:57 PM EDT
 * Licensed under GNU General Public License v3.0
 */
var code = {
    "sys": "class",
    "name": "test",
    "access": "public",
    "call": { "sys": "call", "name": "testProcedure", "args": [] },
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
            "ret": {
                "sys": "ret",
                "name": "r1",
                "val": {
                    "sys": "val",
                    "type": "bool",
                    "v": false
                }
            },
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
                    "right": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "int", "v": 25 } }
                },
                {
                    "sys": "asgn",
                    "left": "$i1",
                    "op": "=",
                    "right": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "int", "v": 25 } }
                },
                {
                    "sys": "asgn",
                    "left": "$b1",
                    "op": "=",
                    "right": { "sys": "bex", "left": "$this.tmp1", "op": "==", "right": "$i1" }
                },
                {
                    "sys": "asgn",
                    "left": "$b1",
                    "op": "=",
                    "right": { "sys": "bex", "left": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "int", "v": 25 } }, "op": "==", "right": "$i1" }
                },
                {
                    "sys": "for",
                    "start": { "sys": "val", "type": "int", "v": 0 },
                    "stop": { "sys": "val", "type": "int", "v": 10 },
                    "inc": { "sys": "val", "type": "int", "v": 1 },
                    "for_lines": [
                    ]
                },
                {
                    "sys": "if",
                    "left": "$b1",
                    "op": "==",
                    "right": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "bool", "v": true } },
                    "if_lines": [
                        {
                            "sys": "asgn",
                            "left": "$i1",
                            "op": "=",
                            "right": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "int", "v": 40 } }
                        }
                    ],
                    "else_lines": [
                        {
                            "sys": "asgn",
                            "left": "$i1",
                            "op": "=",
                            "right": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "int", "v": 41 } }
                        }
                    ]
                },
                {
                    "sys": "if",
                    "left": "$b1",
                    "op": "!=",
                    "right": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "bool", "v": true } },
                    "if_lines": [
                        {
                            "sys": "asgn",
                            "left": "$i1",
                            "op": "=",
                            "right": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "int", "v": 42 } }
                        }
                    ],
                    "else_lines": [
                        {
                            "sys": "asgn",
                            "left": "$i1",
                            "op": "=",
                            "right": { "sys": "decl", "name": "const", "val": { "sys": "val", "type": "int", "v": 43 } }
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

grammar.class_procs_ret = ["ret"];
grammar.class_procs_ret_required = ["sys", "name", "val"];
grammar.class_procs_ret_optional = [];

grammar.if_required = ["sys", "left", "op", "right", "if_lines"];
grammar.if_optional = ["else_lines"];

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
    if (LOGGING === true) {
        console.log(s);
    }
}

function isSysObjIf(obj) {
    if (isSysObj(obj) === true && obj.sys === "if") {
        return true;
    } else {
        return false;
    }
}

function isSysObjBex(obj) {
    if (isSysObj(obj) === true && obj.sys === "bex") {
        return true;
    } else {
        return false;
    }
}

function isSysObjExp(obj) {
    if (isSysObj(obj) === true && obj.sys === "exp") {
        return true;
    } else {
        return false;
    }
}

function isSysObjVal(obj) {
    if (isSysObj(obj) === true && obj.sys === "val") {
        return true;
    } else {
        return false;
    }
}

function isSysObjConst(obj) {
    if (isSysObj(obj) === true && obj.sys === "decl" && obj.name === "const") {
        return true;
    } else {
        return false;
    }
}

function isSysObj(obj) {
    if (obj.hasOwnProperty("sys") === true) {
        return true;
    } else {
        return false;
    }
}

function getSysObjType(obj) {
    if (isSysObj(obj) === true) {
        return obj.sys;
    } else {
        return null;
    }
}

function isVarString(str) {
    if (str.indexOf(VAR_NON_THIS) !== -1) {
        return true;
    } else {
        return false;
    }
}

function isVarThis(str) {
    if (str.indexOf(VAR_THIS) !== -1) {
        return true;
    } else {
        return false;
    }
}

function idxVarThis(str) {
    return str.indexOf(VAR_THIS);
}

function isVarNonThis(str) {
    if (str.indexOf(VAR_NON_THIS) !== -1) {
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
    wr("executeProgram: Name: " + prog.name);
    if (prog.hasOwnProperty("call") === true && prog.call !== null) {
        var callName = prog.call.name;
        var callArgs = prog.call.args;
        var progProc = findProc(prog, callName);

        if (progProc !== null) {
            var progProcLines = progProc.lines;

            for (var i = 0; i < progProcLines.length; i++) {
                var progProcLine = progProcLines[i];
                var objType = getSysObjType(progProcLine);

                if (objType === "asgn") {
                    executeProcedureLineAsgn(progProcLine, callName, callArgs, prog, progProc, i);

                } else if (objType === "if") {
                    executeProcedureLineIf(progProcLine, callName, callArgs, prog, progProc, i);

                } else {
                    wr("executeProgram: Error: Unsupported line type: " + objType);
                }
            }

        } else {
            wr("executeProgram: Error: Executing program missing call function");
            return false;
        }

    } else {
        wr("executeProgram: Notice: Executing class no call function");
        return false;
    }
    return true;
}

function executeProcedureLineIfClause(ifLines, callName, callArgs, prog, proc, lineNum) {
    if (ifLines !== null && ifLines.length > 0) {
        wr("executeProcedureLineIfClause: line number: " + lineNum + " with clause lines count: " + ifLines.length);
        var len = ifLines.length;
        for (var i = 0; i < len; i++) {
            var progProcLine = ifLines[i];
            var objType = getSysObjType(progProcLine);

            if (objType === "asgn") {
                executeProcedureLineAsgn(progProcLine, callName, callArgs, prog, proc, i);

            } else if (objType === "if") {
                executeProcedureLineIf(progProcLine, callName, callArgs, prog, proc, i);

            } else {
                wr("executeProgram: Error: Unsupported line type: " + objType + " at line number: " + (lineNum + i));
                return false;
            }
        }
    } else {
        wr("executeProcedureLineIfClause: Result: No lines found");
        return true;
    }
}

function executeProcedureLineElseClause(elseLines, callName, callArgs, prog, proc, lineNum) {
    if (elseLines !== null && elseLines.length > 0) {
        wr("executeProcedureLineElseClause: line number: " + lineNum + " with clause lines count: " + elseLines.length);
        var len = elseLines.length;
        for (var i = 0; i < len; i++) {
            var progProcLine = elseLines[i];
            var objType = getSysObjType(progProcLine);

            if (objType === "asgn") {
                executeProcedureLineAsgn(progProcLine, callName, callArgs, prog, proc, i);

            } else if (objType === "if") {
                executeProcedureLineIf(progProcLine, callName, callArgs, prog, proc, i);

            } else {
                wr("executeProgram: Error: Unsupported line type: " + objType + " at line number: " + (lineNum + i));
                return false;
            }
        }
    } else {
        wr("executeProcedureLineElseClause: Result:  No lines found");
        return true;
    }
}

function executeProcedureLineIf(procLine, callName, callArgs, prog, proc, lineNum) {
    if (procLine.sys === "if") {
        wr("");
        wr("executeProcedureLineIf: line number: " + lineNum + " with source: " + JSON.stringify(procLine));

        //handle assignment line
        var left = procLine.left;
        var op = procLine.op;
        var right = procLine.right;

        var leftVar = null;
        var leftVarType = null;
        var rightVar = null;
        var rightVarType = null;

        //left arg
        if (isSysObj(left) === true) {
            if (isSysObjBex(left) === true) {
                leftVar = processBexObject(left, prog, proc);
            } else if (isSysObjConst(left) === true) {
                leftVar = left;
            }

        } else if (isVarString(left) === true) {
            leftVar = processVarString(left, prog, proc);

        } else {
            wr("executeProcedureLineIf: Error: Left-hand value must be a var string");
            return false;
        }
        leftVarType = leftVar.sys;

        //right arg
        if (isSysObj(right) === true) {
            if (isSysObjBex(right) === true) {
                rightVar = processBexObject(right, prog, proc);
            } else if (isSysObjConst(right) === true) {
                rightVar = right;
            }

        } else if (isVarString(right) === true) {
            rightVar = processVarString(right, prog, proc);

        } else {
            wr("executeProcedureLineIf: Error: Left-hand value must be a var string");
            return false;
        }
        rightVarType = rightVar.sys;

        wr("executeProcedureLineIf: Notice: Checking left: '" + JSON.stringify(leftVar));
        wr("executeProcedureLineIf: Notice: Checking right: '" + JSON.stringify(rightVar));
        if (rightVar === null) {
            wr("executeProcedureLineIf: Error: Right value of assignment statement is null");
            return false;

        } else if (leftVar === null) {
            wr("executeProcedureLineIf: Error: Left value of assignment statement is null");
            return false;

        } else if (validateOpBex(op) === false) {
            wr("executeProcedureLineIf: Error: Operator is not valid, '" + op + "'");
            return false;

        } else if (rightVar.val === null) {
            wr("executeProcedureLineIf: Error: The right val is null.");
            return false;

        } else if (leftVar.val === null) {
            wr("executeProcedureLineIf: Error: The left val is null.");
            return false;

        } else if (rightVar.val.v === null) {
            wr("executeProcedureLineIf: Error: The right value has not been assigned to and is null.");
            return false;

        } else if (leftVar.val.type.trim() !== rightVar.val.type.trim()) {
            wr("executeProcedureLineIf: Error: Right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
            return false;
        }

        if (op === "==") {
            if (leftVar.val.v === rightVar.val.v) {
                wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' = '" + rightVar.name + "', values: " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineIfClause(procLine.if_lines, callName, callArgs, prog, proc, lineNum);
            } else {
                wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' = '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineElseClause(procLine.else_lines, callName, callArgs, prog, proc, lineNum);
            }

        } else if (op === "!=") {
            if (leftVar.val.v !== rightVar.val.v) {
                wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' != '" + rightVar.name + "', values " + leftVar.val.v + " != " + rightVar.val.v);
                executeProcedureLineIfClause(procLine.if_lines, callName, callArgs, prog, proc, lineNum);
            } else {
                wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' != '" + rightVar.name + "', values " + leftVar.val.v + " != " + rightVar.val.v);
                executeProcedureLineElseClause(procLine.else_lines, callName, callArgs, prog, proc, lineNum);
            }

        } else if (op === "<=") {
            if (leftVar.val.v <= rightVar.val.v) {
                wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' <= '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineIfClause(procLine.if_lines, callName, callArgs, prog, proc, lineNum);
            } else {
                wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' <= '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineElseClause(procLine.else_lines, callName, callArgs, prog, proc, lineNum);
            }

        } else if (op === ">=") {
            if (leftVar.val.v >= rightVar.val.v) {
                wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' >= '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineIfClause(procLine.if_lines, callName, callArgs, prog, proc, lineNum);
            } else {
                wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' >= '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineElseClause(procLine.else_lines, callName, callArgs, prog, proc, lineNum);
            }

        } else if (op === "<") {
            if (leftVar.val.v < rightVar.val.v) {
                wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' < '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineIfClause(procLine.if_lines, callName, callArgs, prog, proc, lineNum);
            } else {
                wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' < '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineElseClause(procLine.else_lines, callName, callArgs, prog, proc, lineNum);
            }

        } else if (op === ">") {
            if (leftVar.val.v > rightVar.val.v) {
                wr("executeProcedureLineIf: Result: TRUE: names: '" + leftVar.name + "' > '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineIfClause(procLine.if_lines, callName, callArgs, prog, proc, lineNum);
            } else {
                wr("executeProcedureLineIf: Result: FALSE: names: '" + leftVar.name + "' > '" + rightVar.name + "', values " + leftVar.val.v + " = " + rightVar.val.v);
                executeProcedureLineElseClause(procLine.else_lines, callName, callArgs, prog, proc, lineNum);
            }

        } else {
            wr("executeProcedureLineIf: Result: Unknown boolean operand");
            return false;
        }
    } else {
        wr("executeProcedureLineIf: Result: Not an IF object");
        return false;
    }
}

function executeProcedureLineAsgn(procLine, callName, callArgs, prog, proc, lineNum) {
    if (procLine.sys === "asgn") {
        wr("");
        wr("executeProcedureLineAsgn: line number: " + lineNum + " with source: " + JSON.stringify(procLine));

        //handle assignment line
        var left = procLine.left;
        var op = procLine.op;
        var right = procLine.right;

        var leftVar = null;
        var leftVarType = null;
        var rightVar = null;
        var rightVarType = null;

        //left arg
        if (isSysObj(left) === true) {
            wr("executeProcedureLineAsgn: Error: Left-hand value cannot be an object");
            return false;

        } else if (isVarString(left) === true) {
            leftVar = processVarString(left, prog, proc);

        } else {
            wr("executeProcedureLineAsgn: Error: Left-hand value must be a var string");
            return false;
        }
        leftVarType = leftVar.sys;

        //right arg
        if (isSysObj(right) === true) {
            if (isSysObjBex(right) === true) {
                rightVar = processBexObject(right, prog, proc);
            } else if (isSysObjConst(right) === true) {
                rightVar = right;
            }

        } else if (isVarString(right) === true) {
            rightVar = processVarString(right, prog, proc);

        } else {
            wr("executeProcedureLineAsgn: Error: Left-hand value must be a var string");
            return false;
        }
        rightVarType = rightVar.sys;

        wr("executeProcedureLineAsgn: Notice: Checking left: '" + JSON.stringify(leftVar));
        wr("executeProcedureLineAsgn: Notice: Checking right: '" + JSON.stringify(rightVar));
        if (rightVar === null) {
            wr("executeProcedureLineAsgn: Error: Right value of assignment statement is null");
            return false;

        } else if (leftVar === null) {
            wr("executeProcedureLineAsgn: Error: Left value of assignment statement is null");
            return false;

        } else if (validateOpAsgnInit(op) === false) {
            wr("executeProcedureLineAsgn: Error: Operator is not valid, '" + op + "'");
            return false;

        } else if (rightVar.val === null) {
            wr("executeProcedureLineAsgn: Error: The right val is null.");
            return false;

        } else if (leftVar.val === null) {
            wr("executeProcedureLineAsgn: Error: The left val is null.");
            return false;

        } else if (rightVar.val.v === null) {
            wr("executeProcedureLineAsgn: Error: The right value has not been assigned to and is null.");
            return false;

        } else if (leftVar.val.type.trim() !== rightVar.val.type.trim()) {
            wr("executeProcedureLineAsgn: Error: Right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
            return false;
        }

        if (op === "=") {
            wr("executeProcedureLineAsgn: Notice: Setting '" + leftVar.name + "' to the value of '" + rightVar.name + "', values: " + leftVar.val.v + ", " + rightVar.val.v);
            leftVar.val.v = rightVar.val.v;
        } else {
            wr("executeProcedureLineAsgn: Result: Unknown operand");
            return false;
        }
    } else {
        wr("executeProcedureLineAsgn: Result: Not an ASGN object");
        return false;
    }
}


//FIND FUNCTIONS
function findVar(name, prog, proc, useProg) {
    if (useProg === true) {
        for (var i = 0; i < prog.vars.length; i++) {
            if (prog.vars[i].name === name) {
                return prog.vars[i];
            }
        }
    } else {
        for (var i = 0; i < proc.vars.length; i++) {
            if (proc.vars[i].name === name) {
                return proc.vars[i];
            }
        }
    }
    return null;
}

function findArg(name, proc) {
    for (var i = 0; i < proc.args.length; i++) {
        if (proc.args[i].name === name) {
            return proc.args[i];
        }
    }
    return null;
}

function findProc(prog, name) {
    for (var i = 0; i < prog.procs.length; i++) {
        if (prog.procs[i].name === name) {
            return prog.procs[i];
        }
    }
    return null;
}


//PROCESS METHODS
//process a variable string
function processVarString(varString, prog, proc) {
    wr("processVarString: Processing var string, '" + varString + "'");
    var thisStr = VAR_THIS; //"$this.";
    var nonThisStr = VAR_NON_THIS; //"$";
    var idxThis = String(varString).indexOf(thisStr);
    var idxDs = String(varString).indexOf(nonThisStr);
    var varName = null;
    var fnd = null;

    if (idxThis !== -1) {
        varName = varString.substring(thisStr.length);
        fnd = findVar(varName, prog, proc, true);

    } else if (idxDs !== -1) {
        //check proc vars
        varName = varString.substring(nonThisStr.length);
        fnd = findVar(varName, prog, proc, false);

        if (fnd === null) {
            //check proc args
            fnd = findArg(varName, proc);
        }
    }
    wr("processVarString: Notice: Found var name, '" + varName + "'");

    if (fnd === null) {
        wr("processVarString: Error: Could not find variable with name, '" + varName + "'");
    }

    wr("processVarString: Notice: Returning '" + JSON.stringify(fnd) + "'");
    return fnd;
}

//process boolean expression object
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
    if (isSysObj(left) === true) {
        if (isSysObjBex(left) === true) {
            leftVar = processBexObject(left, prog, proc);
        } else if (isSysObjConst(left) === true) {
            leftVar = left;
        }

    } else if (isVarString(left) === true) {
        leftVar = processVarString(left, prog, proc);

    } else {
        wr("processBexObject: Error: Left-hand value is invalid");
        return false;
    }
    leftVarType = leftVar.sys;

    //right arg
    if (isSysObj(right) === true) {
        if (isSysObjBex(right) === true) {
            rightVar = processBexObject(right, prog, proc);
        } else if (isSysObjConst(right) === true) {
            rightVar = right;
        }

    } else if (isVarString(right) === true) {
        rightVar = processVarString(right, prog, proc);

    } else {
        wr("processBexObject: Error: Right-hand value is invalid");
        return false;
    }
    rightVarType = rightVar.sys;

    if (rightVar === null) {
        wr("processBexObject: Error: Right value of assignment statement is null");
        return false;

    } else if (leftVar === null) {
        wr("processBexObject: Error: Left value of assignment statement is null");
        return false;

    } else if (validateOpBex(op) === false) {
        wr("processBexObject: Error: Operator is not valid, '" + op + "'");
        return false;

    } else if (rightVar.val === null) {
        wr("processBexObject: Error: The right val is null");
        return false;

    } else if (leftVar.val === null) {
        wr("processBexObject: Error: The left val is null");
        return false;

    } else if (rightVar.val.v === null) {
        wr("processBexObject: Error: The right value has not been assigned to and is null");
        return false;

    } else if (leftVar.val.v === null) {
        wr("processBexObject: Error: The left value has not been assigned to and is null");
        return false;

    } else if (leftVar.val.type.trim() !== rightVar.val.type.trim()) {
        wr("processBexObject: Error: Right value type and left value type do not match, left type, '" + leftVar.val.type + "', right type, '" + rightVar.val.type + "'");
        return false;
    }

    wr("processBexObject: Notice: Comparing with: " + op);
    var res = null;
    var ret = null;
    if (op === "==") {
        res = (leftVar.val.v === rightVar.val.v);

    } else if (op === "!=") {
        res = (leftVar.val.v !== rightVar.val.v);

    } else if (op === "<") {
        res = (leftVar.val.v < rightVar.val.v);

    } else if (op === ">") {
        res = (leftVar.val.v > rightVar.val.v);

    } else if (op === "<=") {
        res = (leftVar.val.v <= rightVar.val.v);

    } else if (op === ">=") {
        res = (leftVar.val.v >= rightVar.val.v);

    } else if (op === "&&") {
        res = (leftVar.val.v && rightVar.val.v);

    } else if (op === "||") {
        res = (leftVar.val.v || rightVar.val.v);
    }

    ret = { "sys": "decl", "name": "processBexObject", "val": { "sys": "val", "type": "bool", "v": res } };
    wr("processBexObject: Notice: Comparing '" + leftVar.val.v + "' to the value of '" + rightVar.val.v + "', value, (" + res + "), operator, '" + op + "'");
    wr("processBexObject: Notice: Returning '" + JSON.stringify(ret));
    return ret;
}


//VALIDATE FUNCTIONS
//validate operation assign, init
function validateOpAsgnInit(opString) {
    if (grammar.op_asgn_init.indexOf(opString) === -1) {
        return false;
    } else {
        return true;
    }
}

//validate operation boolean expression
function validateOpBex(opString) {
    if (grammar.op_bex.indexOf(opString) === -1) {
        return false;
    } else {
        return true;
    }
}

function validateGrammarClass(prog) {
    if (validateProperties(prog, grammar.class_required) === false) {
        wr("validateGrammarClass: Error: invalid class entry: " + JSON.stringify(prog));
        return false;
    }
    return true;
}

function validateGrammarClassVars(prog) {
    if (prog.hasOwnProperty("vars") === true) {
        for (var i = 0; i < prog.vars.length; i++) {
            var progVar = prog.vars[i];
            validateGrammarVar(progVar);
        }
    }
    return true;
}

function validateGrammarVar(varEntry) {
    if (varEntry.hasOwnProperty("sys") === false || grammar.class_vars.indexOf(varEntry.sys) === -1) {
        wr("validateGrammarVar: Error: validateGrammarVar: Invalid var entry: " + JSON.stringify(varEntry));
        return false;
    }
    return true;
}

function validateGrammarClassCall(prog) {
    if (prog.hasOwnProperty("call") === true) {
        var progCall = prog.call;
        if (validateProperties(progCall, grammar.call_required) === false) {
            wr("validateGrammarClassCall: Error: invalid call entry: " + JSON.stringify(progCall));
            return false;
        }
    }
    return true;
}

function validateProperties(obj, req) {
    for (var i = 0; i < req.length; i++) {
        var r = req[i];
        if (obj.hasOwnProperty(r) === false) {
            wr("validateProperties: Missing property: " + r);
            return false;
        }
    }
    return true;
}

function validateGrammarClassProcs(prog) {
    //class
    if (prog.hasOwnProperty("procs") === true) {
        //procs
        for (var i = 0; i < prog.procs.length; i++) {
            var proc = prog.procs[i];
            //proc
            if (validateProperties(proc, grammar.class_procs_required) === false) {
                wr("validateGrammarClassProcs: Error: invalid proc entry: " + JSON.stringify(proc));
                return false;

            } else if (proc.hasOwnProperty("sys") === false || grammar.class_procs.indexOf(proc.sys) === -1) {
                wr("validateGrammarClassProcs: Error: invalid proc entry: " + JSON.stringify(proc));
                return false;

            } else {
                //args
                if (proc.hasOwnProperty("args") === true) {
                    for (var i = 0; i < proc.args.length; i++) {
                        var procArg = proc.args[i];
                        if (validateProperties(procArg, grammar.class_procs_args_required) === false) {
                            wr("validateGrammarClassProcs: Error: invalid proc arg entry: " + JSON.stringify(procArg));
                            return false;

                        } else if (procArg.hasOwnProperty("sys") === false || grammar.class_procs_args.indexOf(procArg.sys) === -1) {
                            wr("validateGrammarClassProcs: Error: invalid proc arg entry: " + JSON.stringify(procArg));
                            return false;

                        }
                    }
                }

                //vars
                if (proc.hasOwnProperty("vars") === true) {
                    for (var i = 0; i < proc.vars.length; i++) {
                        var procVar = proc.vars[i];
                        if (procVar.hasOwnProperty("sys") === true && validateProperties(procVar, grammar.class_procs_vars_required) === false) {
                            wr("validateGrammarClassProcs: Error: invalid proc arg entry: " + JSON.stringify(procVar));
                            return false;

                        } else if (procVar.hasOwnProperty("sys") === false || grammar.class_procs_vars.indexOf(procVar.sys) === -1) {
                            wr("validateGrammarClassProcs: Error: invalid proc var entry: " + JSON.stringify(procVar));
                            return false;

                        }
                    }
                }

                //ret
                if (proc.hasOwnProperty("ret") === true && proc.ret != null && proc.ret != "") {
                    var procRet = proc.ret;
                    if (procRet.hasOwnProperty("sys") === true && validateProperties(procRet, grammar.class_procs_ret_required) === false) {
                        wr("validateGrammarClassProcs: Error: invalid proc ret entry: " + JSON.stringify(procRet));
                        return false;

                    } else if (procRet.hasOwnProperty("sys") === false || grammar.class_procs_ret.indexOf(procRet.sys) === -1) {
                        wr("validateGrammarClassProcs: Error: invalid proc ret entry: " + JSON.stringify(procRet));
                        return false;

                    }
                }

                //lines
                if (proc.hasOwnProperty("lines") === true) {
                    for (var i = 0; i < proc.lines.length; i++) {
                        var procLine = proc.lines[i];
                        if (procLine.hasOwnProperty("sys") === false || grammar.class_procs_lines.indexOf(procLine.sys) === -1) {
                            wr("validateGrammarClassProcs: Error: invalid proc line entry: " + JSON.stringify(procLine));
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
wr("STARTING JSON-PL EXEC:");

lres = validateGrammarClass(prog);
wr("Validate Grammar: Class: " + lres);

lres = validateGrammarClassVars(prog);
wr("Validate Grammar: Class Variables: " + lres);

lres = validateGrammarClassProcs(prog);
wr("Validate Grammar: Class Procedures: " + lres);

lres = executeProgram(prog);
wr("Execute Class: " + lres);