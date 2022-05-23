const http = require("http");
const url = require('url');
const host = 'localhost';
const port = 8000;

const data = {
    "clss":{
        "vars": [
            {
                "sys":"var", "name":"ar1",
                "val":{
                   "sys":"val",
                   "type":"int[]",
                   "len":"5",
                   "v":[
                      {"sys":"var", "name":"item0", "val":{"sys":"val", "type":"int", "v":"-4"}},
                      {"sys":"var", "name":"item1", "val":{"sys":"val", "type":"int", "v":"8"}},
                      {"sys":"var", "name":"item2", "val":{"sys":"val", "type":"int", "v":"47"}},
                      {"sys":"var", "name":"item3", "val":{"sys":"val", "type":"int", "v":"21"}},
                      {"sys":"var", "name":"item4", "val":{"sys":"val", "type":"int", "v":"-56"}}
                   ]
                }         
            }            
        ]
    },
    "func": {
        "args": [

        ],        
        "vars": [
            {"sys":"var", "name":"tmp1", "val":{"sys":"val", "type":"int", "v":"5"}},
            {"sys":"var", "name":"nidx", "val":{"sys":"val", "type":"int", "v":"2"}},
            {"sys":"var", "name":"ptr1", "val":{"sys":"val", "type":"string", "v":""}}
        ]
    }
};

//EXAMPLE:
/*
{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"#.vars.ar1.[$.vars.nidx]->(http://localhost:8000/?type=get&ref=)"}}
http://localhost:8000/?type=get&ref=#.vars.ar1.[$.vars.nidx]
*/

/*
{"type":"get", "ref":"#.vars.ar1.[$.vars.nidx]", "error":"false", "result":{fnd object}, "message":"details here"}
*/

const requestListener = function (req, res) {
    //console.log("=======S");
    var queryObj = url.parse(req.url, true).query;    
    //console.log(queryObj);
    var ret = {};
    ret.type = "unknown";
    ret.ref = "unknown";
    ret.error = "true";
    ret.result = {};
    ret.message = "";

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);


    if(typeof queryObj.type !== 'undefined' && typeof queryObj.ref !== 'undefined') {
        console.log("Request looks good!: " + queryObj['type'] + ", " + queryObj['ref']);
        if(queryObj['type'] === "get" || queryObj['type'] === "set") {
            var type = queryObj['type'];
            var val = queryObj['ref'];
            var vals = [];
            if(vals !== null) {
                vals = toStr(val).split(".");
            }
            var isClass = false;
            var isVar = false;
            var isArg = false;
            var name = null;
            var idx = null;
            var isGet = false;

            if(type === "get") {
                isGet = true;
            }

            ret.type = type;
            ret.path = val;

            console.log("Root: " + val);

            if(vals !== null && vals.length >= 1) {
                if(vals[0] === "#") {
                    isClass = true;
                } else if(vals[0] === "$") {
                    isClass = false;
                } else {
                    //return error: unknown root expecting class, #, or func, $
                    ret.error = "true";
                    ret.message = "error: unknown root expecting class, #, or func, $";
                    res.end(JSON.stringify(ret));                    
                    return;
                }
            } else {
                //return error: missing class or func in ref path
                ret.error = "true";
                ret.message = "error: missing class or func in ref path";
                //res.setHeader("Content-Type", "application/json");
                //res.writeHead(200);
                res.end(JSON.stringify(ret));                    
                return;                
            }

            if(vals !== null && vals.length >= 2) {
                if(isClass) {
                    //class, #
                    if(vals[1] === "vars") {
                        isVar = true;
                    } else{
                        //return error: unsupported value type for class, only vars are supported here
                        ret.error = "true";
                        ret.message = "error: unsupported value type for class, only vars are supported here";
                        //res.setHeader("Content-Type", "application/json");
                        //res.writeHead(200);
                        res.end(JSON.stringify(ret));                    
                        return;                        
                    }
                } else {
                    //func, $
                    if(vals[1] === "vars") {                    
                        isVar = true;
                    } else if(vals[1] === "args") {
                        isVar = false;                    
                    } else{
                        //return error: unsupported value type for func, only vars and args are supported here
                        ret.error = "true";
                        ret.message = "error: unsupported value type for func, only vars and args are supported here";
                        //res.setHeader("Content-Type", "application/json");
                        //res.writeHead(200);
                        res.end(JSON.stringify(ret));                    
                        return;                        
                    }                
                }
            } else {
                //return error: missing type in ref path
                ret.error = "true";
                ret.message = "error: missing type in ref path";
                //res.setHeader("Content-Type", "application/json");
                //res.writeHead(200);
                res.end(JSON.stringify(ret));                    
                return;                
            }

            if(vals !== null && vals.length >= 3) {
                if(isClass) {
                    if(isVar) {
                        //vars
                        name = vals[2];
                        fnd = findVar(isClass, name);
                    } else {
                        //return error: unsupported value type for class search, only vars are supported here
                        ret.error = "true";
                        ret.message = "error: unsupported value type for class search, only vars are supported here";
                        //res.setHeader("Content-Type", "application/json");
                        //res.writeHead(200);
                        res.end(JSON.stringify(ret));                    
                        return;                        
                    }
                } else {
                    if(isVar) {
                        //vars
                        name = vals[2];
                        fnd = findVar(isClass, name);
                    } else {
                        //args
                        name = vals[2];
                        fnd = findArg(name);                        
                    }
                }
            } else {
                //return error: missing name in ref path
                ret.error = "true";
                ret.message = "error: missing name in ref path";
                //res.setHeader("Content-Type", "application/json");
                //res.writeHead(200);
                res.end(JSON.stringify(ret));                    
                return;                
            }

            if(vals !== null && vals.length >= 4) {
                if(isClass) {
                    if(isVar) {
                        //vars
                        idx = vals[3];
                        console.log("AAA");
                        if(isString(idx) && !isNumber(idx)) {
                            console.log("BBB");
                            fnd = findArrayItmByName(fnd, idx);
                        } else if(isNumber(idx) && isInteger(idx)) {
                            console.log("CCC: " + idx + ", " + JSON.stringify(fnd));
                            fnd = findArrayItmByIdx(fnd, idx);
                        } else {
                            //return error: unsupported array index type only index or name is supported
                            ret.error = "true";
                            ret.message = "error: unsupported array index type only index or name is supported";
                            //res.setHeader("Content-Type", "application/json");
                            //res.writeHead(200);
                            res.end(JSON.stringify(ret));                    
                            return;                            
                        }
                    } else {
                       //return error: unsupported value type for class array search, only vars are supported here
                       ret.error = "true";
                       ret.message = "error: unsupported value type for class array search, only vars are supported here";
                       //res.setHeader("Content-Type", "application/json");
                       //res.writeHead(200);
                       res.end(JSON.stringify(ret));                    
                       return;                       
                    }
                } else {
                    if(isVar) {
                        //vars
                        idx = vals[3];
                        if(isString(idx) && !isNumber(idx)) {
                            fnd = findArrayItmByName(fnd, idx);

                        } else if(isNumber(idx) && isInteger(idx)) {
                            fnd = findArrayItmByIdx(fnd, idx);

                        } else {
                            //return error: unsupported array index type only index or name is supported
                            ret.error = "true";
                            ret.message = "error: unsupported array index type only index or name is supported";
                            //res.setHeader("Content-Type", "application/json");
                            //res.writeHead(200);
                            res.end(JSON.stringify(ret));                    
                            return;                            
                        }
                    } else {
                        //args
                        idx = vals[3];
                        if(isString(idx) && !isNumber(idx)) {
                            fnd = findArrayItmByName(fnd, idx);
                        } else if(isNumber(idx) && isInteger(idx)) {
                            fnd = findArrayItmByIdx(fnd, idx);
                        } else {
                            //return error: unsupported array index type only index or name is supported
                            ret.error = "true";
                            ret.message = "error: unsupported array index type only index or name is supported";
                            //res.setHeader("Content-Type", "application/json");
                            //res.writeHead(200);
                            res.end(JSON.stringify(ret));                    
                            return;
                        }                        
                    }
                }                
            }

            if(fnd === null) {
                //return errror: could not find a value for the given path
                ret.error = "true";
                ret.message = "errror: could not find a value for the given path";
                //res.setHeader("Content-Type", "application/json");
                //res.writeHead(200);
                res.end(JSON.stringify(ret));                    
                return;                
            } else {
                if(isGet) {
                    //get
                    //RETURN FOUND OBJECT
                    ret.error = "false";
                    ret.message = "notice: found a variable for the information provided";
                    ret.result = fnd;
                    //res.setHeader("Content-Type", "application/json");
                    //res.writeHead(200);
                    res.end(JSON.stringify(ret));
                    return;
                } else {
                    //set
                    var cat = queryObj['cat'];
                    var obj = null;
                    var lstr = null;
                    if(cat === "basic") {
                        fnd.val.v = queryObj['obj'];
                        lstr = queryObj['obj'];
                    } else {
                        fnd.val.v = JSON.parse(queryObj['obj']);
                        lstr = "an array sys obj: " + queryObj['obj'];
                    }
                    
                    ret.error = "false";
                    ret.message = "notice: updated the variable, " + val + ", with the specified value, " + lstr;
                    ret.result = {"sys":"const", "val":{"sys":"val", "type":"bool", "v":"true"}};
                    //res.setHeader("Content-Type", "application/json");
                    //res.writeHead(200);
                    res.end(JSON.stringify(ret));
                    return;                  
                }                
            }
        } else {
            //return error: unsupported request type, + queryObj['type']
            ret.error = "true";
            ret.message = "error: unsupported request type";
            //res.setHeader("Content-Type", "application/json");
            //res.writeHead(200);
            res.end(JSON.stringify(ret));                    
            return;            
        }
    }

    ret.error = "true";
    ret.message = "error: unhandled request";    
    //res.setHeader("Content-Type", "application/json");
    //res.writeHead(200);
    res.end(JSON.stringify(ret));
    return;
};

/**
 * Name: 
 * Desc: 
 * Arg1: 
 * Arg2:
 * Returns: 
 */
findArrayItmByName = function(fnd, name) {
    var len = 0;
    var data = fnd.val.v;
    var ret = null;

    if(data !== null) {
        len = data.length;
        for(var i = 0; i < len; i++) {
            if(data[i].name === name) {
                ret = data[i];
                break;
            }
        }
    }
    return ret;
};

/**
 * Name: 
 * Desc: 
 * Arg1: 
 * Arg2:
 * Returns: 
 */
findArrayItmByIdx = function(fnd, idx) {
    var len = 0;
    var data = fnd.val.v;
    var ret = null;

    if(data !== null) {
        len = data.length;
        for(var i = 0; i < len; i++) {
            if(i === this.toInt(idx)) {
                ret = data[i];
                break;
            }
        }
    }
    return ret;
};

/**
 * Name: 
 * Desc: 
 * Arg1: 
 * Arg2:
 * Returns: 
 */
findArg = function(name) {
    var len = 0;
    var dt = null;
    var ret = null;

    dt = data.func.args;
    if(dt !== null) {
        len = dt.length;
        for(var i = 0; i < len; i++) {
            if(dt[i].name === name) {
                ret = dt[i];
                break;
            }
        }
    }
    return ret;
};

/**
 * Name: 
 * Desc: 
 * Arg1: 
 * Arg2:
 * Returns: 
 */
findVar = function(isClass, name) {
    var len = 0;
    var dt = null;
    var ret = null;

    if(isClass) {
        //class
        dt = data.clss.vars;
    } else {
        //func
        dt = data.func.vars;
    }

    if(dt !== null) {
        len = dt.length;
        for(var i = 0; i < len; i++) {
            if(dt[i].name === name) {
                ret = dt[i];
                break;
            }
        }
    }
    return ret;
};

/**
 * Name: isString
 * Desc: Checks if the given argument is a string. 
 * Arg1: arg(some string)
 * Returns: (true | false)
 */
isString = function (arg) {
    if (arg === null) {
       return false;
    } else if (typeof arg === 'string' || arg instanceof String) {
       return true;
    } else {
       return false;
    }
 };
 
/**
 * Name: isNumber
 * Desc: Checks if the given argument is a number. 
 * Arg1: arg(some value)
 * Returns: (true | false)
 */ 
isNumber = function (arg) {
    var tmp = toInt(arg);
    if (arg === null) {
       return false;
    } else if ((typeof tmp === "number" || tmp instanceof Number) && Number.isNaN(tmp) === false) {
       return true;
    } else {
       return false;
    }
};
 
/**
 * Name: isInteger
 * Desc: Checks if the given argument is an integer. 
 * Arg1: arg(some value)
 * Returns: (true | false)
 */
isInteger = function (arg) {
    var tmp = toInt(arg);
    if (arg === null) {
       return false;
    } else if (isNumber(tmp) && Number.isInteger(tmp) === true) {
       return true;
    } else {
       return false;
    }
};

/**
 * Name: toInt
 * Desc: Converts the value v to an integer representation.
 * Arg1: v(the value to convert)
 * Returns: (the int value of v)
 */
toInt = function (v) {
    return parseInt(v);
};
  
/**
 * Name: toStr
 * Desc: Converts the value v to a string representation.
 * Arg1: v(the value to convert)
 * Returns: (the string value of v)
 */
toStr = function (v) {
    return String(v + "");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

