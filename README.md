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

The var object is denoted by the sys attribute value, "sys": "var". The name attribute gives the variable a name that can be used to reference it. The name value should be unique. The val attribute is populated with a val object.

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

### Val Object
The val object is used to hold data with an associated type and is used frequently throughout the JSON objects that constitute the JsonPL.

<pre>
{
   "sys": "val",
   "type": "int",
   "v": 0
}
</pre>

The
