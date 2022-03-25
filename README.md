# JsonPL Version 0.5.1
## JsonPL Details
Some details about the scripting language as it exists in version 0.5.1.

1. JsonPL is a typed language supporting the following basic data types, int, float, bool, and string.
2. JsonPL supports the following conventions, variable declaration, argument definition, assignment, boolean expressions, numeric expressions, if statements, for loops, and return statements.
3. JsonPL inherently supports late binding and easy transmission of programs as text.

## JsonPL Objects
In this section we'll take a look at all of the different JSON objects supported by JsonPL.

### Class Object
The class object is the highest level object and is used to define a class or a program. A class is a module of code that contains functions and variables.
A program is a class that has a call attribute defined.

<pre>
var code = {
   "sys": "class",
   "name": "Program1",
   "call": { ... },
   "vars": [
      ...
   ],
   "funcs": [
      ...
   ],
   "ret": {
      "sys": "val",
      "type": "bool",
      "v": false
   }
}
</pre>

<pre>
Struct Definition:  
{
   "sys": "class",
   "name": "some name",
   "call": {call},
   "vars": [var],
   "funcs": [func],
   "ret": {val}
}
</pre>

The class object is denoted by the sys attribute value, "sys": "class". The object supports a name attribute which designates the name of the class. If this class is executeable, a program, then the call attribute will be set with a valid call object. The class variables are defined in the vars section while the associated class functions are defined in the funcs attribute. Lastly the ret attribute defines the return type of this class when it's executed as a program. The next object we'll look at is the var object.

### Var Object
The var object is used to define variables that are associated with a class or a function. An example with two variable entries is shown here.

<pre>
{
   "sys": "var",
   "name": "tmp1",
   "val": {
      "sys": "val",
      "type": "int",
      "v": 5
   }
},
{
   "sys": "var",
   "name": "tmp2",
   "val": {
      "sys": "val",
      "type": "bool",
      "v": false
   }         
}
</pre>

The var object is denoted by the sys attribute value, "sys": "var". The name attribute gives the variable a name that can be used to reference it. The name value should be unique. The val attribute is populated with a val object. Variables can only be declared in the vars section of a class or function object.

### Arg Object
The arg object is used to define arguments that are associated with a function. An example is shown here.

<pre>
{
   "sys": "arg",
   "name": "i1",
   "val": {
      "sys": "val",
      "type": "int",
      "v": 0
   }
}
</pre>

The arg object is denoted by the sys attribute value, "sys": "arg". The name attribute gives the argument a name that can be used to reference it. The name value should be unique. The arg attribute is populated with a val object in much the same way the var object is structures. This JSON object structure is repeated for a few different JSON objects.

### Val Object (Sub Object)
The val object is used to hold data with an associated type and is used frequently throughout the JSON objects that constitute the JsonPL.

<pre>
{
   "sys": "val",
   "type": "int",
   "v": 0
}
</pre>

The val object is the workhorse of the JsonPL. It is used to define a value with associated data type.

### Ref Object (Argument Object)
The ref object is used to reference a variable or an argument at the class or local function level.

<pre>
{
   "sys": "ref", 
   "val": {
      "sys": "val", 
      "type": "int", 
      "v": "#.vars.tmp1"
   }
}
</pre>

The ref object is denoted by the sys attribute value, "sys": "ref". The ref object has one attribute val, which contains a special val object. This val object has to be set to the type of the target variable or argument. It also must use a special string to denote which variable or argument it references. In this case we have two options.

1. Class Variable: $.vars.some_variable_name
2. Function Variables: #.vars.some_variable_name
3. Function Arguments: #.args.some_variable_name

Ref objects can be used as arguments to asgn, exp, bex, call, for, and if objects. Another object that can also be used in this fashion is the const object. Let's take a look.

### Const Object (Argument Object)
The const object is the second, and only other argument object, supported by JsonPL. In this object we define the value as a constant.

<pre>
{
   "sys": "const", 
   "val": {
      "sys": "val", 
      "type": "string", 
      "v": "hello world"
   }
}
</pre>

The structure of this object is similar to the val, arg, ret, and ref objects. The object is denoted by a sys value of const, "sys" = "const". The only thing unique about this object is that its val object has a hard coded v attribute with a value that matches the type specified.

### Call Object (Argument, Line Object)
A call object is the first object we've reviewed that can be used as a function, for, or if object line. Let's take a look at the object.

<pre>
{
   "sys": "call", 
   "name": "testFunction1", 
   "args": [
      {
         "sys": "ref", 
         "val": {
            "sys": "val", 
            "type": "int", 
            "v": "#.vars.tmp1"
         }
      }
   ]
}
</pre>

<pre>
Struct Definition: 
{
   "sys": "call", 
   "name": "some name", 
   "args": [ref | const]
}
</pre>

The call object is denoted by the sys attribute value, "sys": "call". This object is used in a few different places. First it's used as part of a program, a class object with a defined call attribute. It's also used as an argument in many, but not all, places. Lastly, it can be used as a line in a function, for, or if object. The name attribute should be the name of the function. The value of the name attribute should be unique to its class. The next attribute args is an array that holds ref or const objects.

### Return Object (Line Object)
The return object is a line object. This means that it can only be used in the lines of a function, for, or if object. 

<pre>
{
   "sys": "return",
   "val": {
      "sys": "val",
      "type": "bool",
      "v": true
   }
}
</pre>

The call object is denoted by the sys attribute value, "sys": "return". The return object has a structure similar to objects we've seen before. It only has a val attribute defined. As mentioned earlier, this object can be used in a function, for, or if object and it triggers a return from the current function.

### Asgn Object (Line Object)
The asgn object is used to assign value to a ref object. The left attribute has to be a ref object but the right attribute can take a ref, const, exp, bex, or call object.

<pre>
{
   "sys": "asgn",
   "left": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "$.vars.tmp1"}},
   "op": {"sys":"op", "type":"asgn", "v":"="},
   "right": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "$.args.i1"}}
}
</pre>

<pre>
Struct Definition:
{
   "sys": "asgn",
   "left": {ref},
   "op": {op & type of asgn}, 
   "right": {ref | const | exp | bex | call}
}
</pre>
