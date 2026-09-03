# JsonPL Version 0.5.5 - The Json Programming Language

by<br>
Victor G. Brusca<br>
Carlo Bruscani<br><br>

JsonPL is an experiment at creating a simple scripting language using only JSON formatting to define the language objects. The following is an example of an empty JsonPL program.

<pre>
{"sys": "class", "name": "EmptyProgram0",
    "vars": [],
    "funcs": []
}
</pre>

A slightly more complicated empty program.

<pre>
{"sys": "class", "name": "EmptyProgram1",
    "classes": [],
    "vars": [],
    "funcs": [],
    "comment": "This is a slightly more advanced empty program."
}
</pre>

If you want your program to automatically execute you need to define the "call" and the "ret" attributes of the {class} object like so. This approach uses the fact that the default, implicit return value from an empty function is a bool. Otherwise it would be the last value value assigned to by the function.

<pre>
{"sys": "class", "name": "EmptyProgram2",
    "classes": [],
    "vars": [],
    "call": {"sys": "call", "name": "main", "args": []},
    "ret": {"sys": "val", "type": "bool", "v": "0"},
    "funcs": [
        {"sys": "func", "name": "main",
        "args": [],
        "vars": [],
        "ret": {"sys": "val", "type": "bool", "v": "0"},
        "lines": []
        }
    ],
    "comment": "This is an even slightly more advanced, more advanced, empty program."
}
</pre>

You could also be more explicit.

<pre>
{"sys": "class", "name": "EmptyProgram3",
    "classes": [],
    "vars": [],
    "call": {"sys": "call", "name": "main", "args": []},
    "ret": {"sys": "val", "type": "int", "v": "0"},
    "funcs": [
        {"sys": "func", "name": "main",
        "args": [],
        "vars": [],
        "ret": {"sys": "val", "type": "int", "v": "0"},
        "lines": [
            {"sys": "return", "val": {"sys": "const", "val": {"sys": "val", "type": "int", "v": "1"}}}
        ]}
    ],
    "comment": "This is a slightly more advanced empty program, that's not soo empty."
}
</pre>

The JsonPL language includes the following 16 objects, and that's just about it.

<ul>
    <li>note</li>
    <li>var</li>
    <li>arg</li>
    <li>val</li>
    <li>ref</li>
    <li>op</li>
    <li>const</li>
    <li>call</li>
    <li>return</li>
    <li>bex</li>
    <li>exp</li>
    <li>asgb</li>
    <li>if</li>
    <li>for</li>
    <li>func</li>
    <li>class</li>
</ul>

Let's take a look at each object in turn. We'll start with the lower level objects and work our way to the {class} object.

## Note

A {note} object is an innocuous JsonPL object that is intended to support script documentation. The documentation for the object is as follows. If you see the documentation brackets "{?" and "?}" you know you're looking at the structure of a JsonPL object.

<pre>
{?
    sys: note,
    active: "false"(optional),
    comment: "string"(optional)
?}
</pre>

Note that without the optional "active" attribute the {note} object will set the last return value to a Boolean of value true. You can turn any line of a script off by adding the "active: false" attribute. You can also add a "comment" attribute to any line to aid in commenting a program. Let's take a look at a complete implementation of the object.

<pre>
{"sys": "note",
    "active": "false",
    "comment": "This is an important note!"
}
</pre>

This version will participate in setting the function return type.

<pre>
{"sys": "note",
    "comment": "This is also an important note!"
}
</pre>

The {note} object is considered a statement and can be used with the following objects that we'll briefly outline here, {if}, {for}, and {func}.

<pre>
{?
    sys: if,
    left: {ref | const | exp | bex | call},
    op: {op}(& type="bex"),
    right: {ref | const | exp | bex | call},
    thn: [asgn | if | for | call | return | note],
    els: [asgn | if | for | call | return | note]
?}
</pre>

<pre>
{?
    sys: for,
    start: {ref | const | exp(& return type="int") | bex | call(& return type="int") },
    stop: : {ref | const | exp(& return type="int") | bex | call(& return type="int") },
    inc: {ref | const | exp(& return type="int") | bex | call(& return type="int") },
    lines: [asgn | if | for | call | return | note]
?}
</pre>

<pre>
{?
    sys: for,
    each: {ref | const}(& type="array"),
    lines: [asgn | if | for | call | return | note]
?}
</pre>

<pre>
{?
    sys: func,
    name: "string",
    ret: {val},
    args: [arg],
    vars: [var],
    url: "string"(& where string is a valid url, optional),
    lines: [asgn | if | for | call | return | note]
?}
</pre>

The {note} object is a statement or a line object.

<pre>
line objects: [asgn | for | if | return | call | note]
</pre>

## Var

A {var} object is how you define a variable in JsonPL. Variables can only be defined as part of a {class} or {func} object in the "vars" attribute. The structure of the {var} object is as follows.

<pre>
{?
    sys: var,
    name: "string",
    val: {val},
    pubs: ["string"](& where string is a valid url, optional)
?}
</pre>

The {class} and {func} objects that use the {var} object have the following structure. We'll cover these objects in more details later on but we'll also visit where they are relevant.

<pre>
{?
    sys: func,
    name: "string",
    ret: {val},
    args: [arg],
    vars: [var],
    url: "string"(& where string is a valid url, optional)
    lines: [asgn | for | if | return | call | note]
?}
</pre>

<pre>
{?
    sys: class,
    name: "string",
    ret: {val},
    call: {call},
    classes: [class](optional),
    vars: [var],
    funcs: [func]
?}
</pre>

The "pubs" array attribute let's you make assignment to the variable a publication event. Each URL in the array will be sent a GET HTTP message with the root URL and a representation of the variable's value.

## Arg

The {arg} object is used to define the arguments of a function. The structure of the {arg} object is as follows.

<pre>
{?
    sys: arg,
    name: "string",
    val: {val}
?}
</pre>

The {arg} object is used with the {func} object.

<pre>
{?
    sys: func,
    name: "string",
    ret: {val},
    args: [arg],
    vars: [var],
    url: "string"(& where string is a valid url, optional)
    lines: [asgn | for | if | return | call | note]
?}
</pre>

That wraps up the {arg} object.

## Val

The {val} object is a bit unusual in that it rarely appears alone. Most of the time the {val} object works with {const} or {ref} objects to define a value for those object types. The non-array form is as follows.

<pre>
{?
    sys: val,
    type: "string"(& where string is one of int, float, string, bool),
    "v": "a valid value for the given type"
?}
</pre>

The array form of the {val} object has a bit more information an is shown subsequently.

<pre>
{?
    sys: val,
    type: "string"(& where string is one of int[], float[], string[], bool[]),
    strict: "bool",
    len: "int",
    v: [a valid array of the given type"]    
?}
</pre>

An example of implementing an array is shown next.

<pre>
{"sys": "var", "name": "ar1", 
    "val": {"sys": "val", 
        "type": "int[]", 
        "strict": "true", 
        "len": "2", 
        "v": [
            {"sys": "var", "name": "itm0", "val": {"sys": "val", "type": "int", "v": "0"}},
            {"sys": "var", "name": "itm1", "val": {"sys": "val", "type": "int", "v": "1"}}
        ]
    }
}
</pre>

The {val} object is used directly with the {func} and {class} objects in the "ret" attribute of those objects. It is also used with {const} and {ref} objects.

<pre>
{?
    sys: const,
    val: {val}
?}
</pre>

<pre>
{?
    sys: ref,
    val: {val}(& val.v as a valid reference string like $.args.tmp1, $.vars.tmp1, #.vars.tmp1, etc)
?}
</pre>

We will go deeper into reference strings when we review the {reF} object.

## Ref

The {ref} object is used to reference other function variables, arguments or class variables. You can reference another variable or argument from any reference at any time using a static, or data driven reference string. The structure of the {ref} object is as follows.

<pre>
{?
    sys: ref,
    val: {val}(& where val has the type of the value it references or is a string holding a reference string to process)
?}
</pre>

<pre>
local class variable reference:                             #.vars.tmp1
local function variable reference:                          $.vars.tmp1
local function argument refernce:                           $.args.tmp1
local class variable array element reference by index:      #.vars.tmp1.0
local class variable array element reference by name:       #.vars.tmp1.itm0
local function variable array element reference by index:   $.vars.tmp1.0
local function variable array element reference by name:    $.vars.tmp1.itm0
local function argument array element reference by index:   $.args.tmp1.0
local function argument array element reference by name:    $.args.tmp1.itm0
</pre>

You can use brackets, [], to data drive the reference string. For instance given the following class variable entries with the given values.

<pre>
tmp1        string  "itm0"
tmpInt      int     12
ptrTmpInt   string  "#.vars.tmpInt"
ptr2        string  "tmpInt"
ptr3        string  "tmpA"
tmpA        int[]   (an array of integers)
</pre>

Some example of using brackets are:

<pre>
[#.vars.ptrTmpInt] -> #.vars.tmpInt -> current value of tmpInt
#.vars.[#.vars.ptr2] -> #.vars.tmpInt -> current value of tmpInt
</pre>

This process works for "#.vars" as well as "$.vars" and "$.args" so long as the reference string you build is valid. The brackets can't be nested but you can use multiple in one reference string and the string will get resolved until it reaches the referenced value. This comes in handy with array variables.

<pre>
#.vars.[#.vars.ptr3].0 -> #.vars.tmpA.0
#.vars.[#.vars.ptr3].[#.vars.tmp1] -> #.vars.tmpA.itm0
</pre>

You also have access to another type of replacement, a one time, non-nestable replacement bracket, <>. Here is an example of using it to configure a remote variable. Given the following variable.

<pre>
{
    "sys": "var", "name": "ptr1",
    "val": {"sys": "val", "type": "string", "v": "#.vars.remote1"}
}
</pre>

A reference to a remote variable with the name "remote1" can be made using the following {ref} object.

<pre>
{
    "sys": "ref",
    "val": {"sys": "val", "type": "string", "v": "<#.vars.ptr1>->(http://localhost:8000?jsonpl=true)"}
}
</pre>

In this scenario the "<#.vars.ptr1>" resolves to "#.vars.remote1" which is retrieved by requesting it from the URL provided in the "->()" bracket. This type of replacement is different from the standard brackets, [], which would result in JsonPL trying to process the reference "#.vars.remote1" against the local class vars which will result in an error. The remote variable operator "->()" allows you to bring in data from other source into your program.

## Op

The {op} object is used to describe the operation preformed by {asgn}, {exp}, {bex}, and {if} objects. The structure of the {op} object is listed here.

<pre>
{?
    sys: op,
    type: "string"(& type is one of asgn, exp, bex),
    v: "string"(& where the string is a valid value for the given op type)
?}
</pre>

The different values you can set for a given {op} object are.

<pre>
asgn    (== or =), +=, -=, *=, **=, /=, %=
bex     ==, <=, <, >, >=, !=
exp     +, -, /, *, **, %
</pre>

The {op} object is used with the following objects {asgn}, {if}, {exp}, {bex} that we'll quickly describe here.

<pre>
{?
    sys: asgn,
    left: {ref},
    op: {op}(& type="asgn"),
    right: {ref | const | exp | bex | call},
    url: "string"(& where string is a valid url, optional)
?}
</pre>

<pre>
{?
    sys: if,
    left: {ref | const | exp | bex | call},
    op: {op}(& type="bex"),
    right: {ref | const | exp | bex | call},
    thn: [asgn | if | for | call | return | note],
    els: [asgn | if | for | call | return | note]    
?}
</pre>

<pre>
{?
    sys: exp,
    left: {ref | const | exp | bex | call},
    op: {op}(& type="exp"),
    right: {ref | const | exp | bex | call},
?}
</pre>

<pre>
{?
    sys: bex,
    left: {ref | const | exp | bex | call},
    op: {op}(& type="bex"),
    right: {ref | const | exp | bex | call},
?}
</pre>

## Const

The {const} object is used to define a constant value in a script. It has the following structure.

<pre>
{?
    sys: const,
    val: {val}
?}
</pre>

The {const} object plugs into a large number of other objects so we won't detail them here. It can be used for {func} arguments in the {class} object's "call" attribute. You'll see the {const} object around the {exp}, {bex}, {asgn}, {for}, and {if} objects.

## Call

The {call} object defines how you can execute a function. There are a few ways to use the {call} object. The simplest way is to reference a local class function, like so.

<pre>
{?
    sys: call,
    name:   "string"(& where string is the name of a local class function),
        or
            "string"->(url)(& where url is a valid url, optional),
        or
            {const | ref}(& where the val.v resolves to a valid function name),

    args: [arg]
    url: "string"(& where string is a valid url, optional)    
?}
</pre>

An example of an actual {call} object looks like this.

<pre>
{
	"sys": "class",
	"name": "ExampleProgram80_Remote",
	"ret": {"sys": "val", "type": "int", "v": "0"},
	"call": {"sys": "call", "name": "main", "args": [
      	{"sys": "const", "val": {"sys": "val", "type": "int", "v": "10"}}
    ]},
    ...
}
</pre>

In this example the {call} object is the default {call} object for the {class} and passes in a {const} integer value of 10 as an argument. There are different reference strings that work with the {call} object.

<pre>
local class function short:                 "main"
local class function long:                  "#.funcs.main"
local library class function long:          "#.classes.OtherClass.SomeFunction"
local library class functoin short:         "@.OtherClass.SomeFunction
local library class default function long:  "#.classes.OtherClass"
local library class default functoin short: "@.OtherClass"
</pre>

Library class function calls with no explicit function named use the {class} object's "call" attribute. To call specific methods you can use the explicit form shown prior.

<pre>
#.classes.OtherClass.SomeFunction
@.OtherClass.SomeFunction
</pre>

Some examples of using the {call} object.

<pre>
{"sys": "call", "name": "SYS::wr", "args": [
    {"sys": "const", "val": {"sys": "val", "type": "string", "v": "Found variable values"}},
    {"sys": "const", "val": {"sys": "val", "type": "string", "v": ", "}},
    {"sys": "const", "val": {"sys": "val", "type": "string", "v": "#.vars.ptr1 = "}},
    {"sys": "ref", "val": {"sys": "val", "type": "int", "v": "#.vars.ptr1"}}
]},
{"sys": "call", "name": "@.InnerClass.main2", "args": []},
{"sys": "call", "name": {"sys": "const", "val": {"sys": "val", "type": "string", "v": "@.InnerClass.main2"}}, "args": []},
{"sys": "call", "name": {"sys": "const", "val": {"sys": "val", "type": "string", "v": "#.classes.InnerClass.main2"}}, "args": []},
{"sys": "call", "name": {"sys": "ref", "val": {"sys": "val", "type": "string", "v": "#.vars.ptr1"}}, "args": []},
</pre>

You can also use a remote value to call a server function and return its results. The results are expected to be in JsonPL object form.

<pre>
{
    "sys": "call",
    "name": "test"->(http://localhost:8000?jsonpl=true)",
    "args": []
}
</pre>

You can also use the optional "url" attribute to accomplish the same thing using the name attribute for the remote function name.

<pre>
{"sys": "call", "name": "SYS::wr", "args": [
    {"sys": "const", "val": {"sys": "val", "type": "string", "v": "Executing remote function main2 at URL 'http://localhost:8000/?jsonpl=true'."}}
]},
{"sys": "call", "name": "main2", "args": [
        {"sys": "const", "val": {"sys": "val", "type": "int", "v": "10"}},
        {"sys": "const", "val": {"sys": "val", "type": "string", "v": "category"}},
        {"sys": "const", "val": {"sys": "val", "type": "bool", "v": "false"}}
    ],
    "url": "http://localhost:8000/?jsonpl=true"
},
</pre>

Lastly, there is a special hook into the function name that lets you call a system function, "SYS::". You can call a system function like so.

<pre>
{
    "sys": "call",
    "name": "SYS::wr",
    "args": [ref | const]
}
</pre>

There a few system functions you can use that I'll list here. You must use the "SYS::" prefix to denote a system function.

<ul>
    <li>
        <b>getLastExpReturn():</b> A function that returns a copy of the last value returned from an {exp} object that was processed.
    </li>
    <li>
        <b>getLastBexReturn():</b> A function that returns a copy of the last value returned from an {bex} object that was processed.
    </li>
    <li>
        <b>getLastAsgnReturn():</b> A function that returns a copy of the last value returned from an {asgn} object that was processed.
    </li>
    <li>
        <b>getLastAsgnValue():</b> A function that returns a copy of the last value asigned by the last {asgn} object that was processed.
    </li>
    <li>
        <b>wr(any number of valid args [ref | const]):</b> Writes to the output defined by the "wr" function. Defaults to the browser console but can be redefined at the prototype level to add visual, DOM based, logging. This is considered standard output.
    </li>
    <li>
        <b>wrApp(any number of valid args [ref | const]):</b> Writes to the output defined by the "wrApp" function. Defaults to the browser console but can be redefined at the prototype level to add visual, DOM based, logging. This is considered application output.
    </li>
    <li>
        <b>wrFuncArgs():</b> A function that writes to standard output the arguments that were passed to the function where this {call} object was called from.
    </li>
    <li>
        <b>wrFuncVars():</b> A function that writes to standard output the variables that were configured for the function where this {call} object was called from.
    </li>
    <li>
        <b>wrClassVars():</b> A function that writes to standard output the variables that were configured for the class where this {call} object was called from.
    </li>
    <li>
        <b>wrInt(int i):</b><br>
        <b>wrFloat(float f):</b><br>
        <b>wrBool(bool b):</b><br>
        <b>wrStr(string s):</b> Writes out basic data types to standard output.
    </li>
    <li>
        <b>len(string variableName):</b> Returns the length of the variable with the given name.
    </li>
    <li>
        <b>type(string variableName):</b> Returns the type of the variable with the given name.
    </li>
    <li>
        <b>getRef(string varOrArgName, bool isVariable, string functionName):</b> A function that returns a new {ref} object pointing to an argument or variable for the given function. If no function name is provided that a class level reference string will be used in the returned {ref} object.
    </li>
    <li>
        <b>getRefStr(string varOrArgName, bool isVariable, string functionName):</b> A function that returns a new reference string pointing to an argument or variable for the given function. If no function name is provided that a class level reference string will be used in the returned {ref} object.
    </li>
    <li>
        <b>getArrayIndexRef(string varOrArgName, bool isVariable, string functionName, string index):</b> A function that returns a new {ref} object that points to the array element described by the arguments provided.
    </li>
    <li>
        <b>getArrayIndexRefStr(string varOrArgName, bool isVariable, string functionName, string index):</b> A function that returns a new reference string that points to the array element described by the arguments provided.
    </li>
    <li>
        <b>mlc(bool isClassVariable, string variableName, string variableType, string variableValue):</b> A malloc function that creates a new variable of the given type and value and adds it to the local {func} or {class} object.
    </li>
    <li>
        <b>amlc(bool isClassVariable, string variableName, string variableType, int arrayLength, bool strict):</b> A malloc function that creates a new array variable of the given type and strictness and adds it to the local {func} or {class} object.
    </li>
    <li>
        <b>cln(bool isClassVariable, string variableName):</b> A function that is the reverse of the mlc function. This function removes the specified variables from the local {func} or {class} object.
    </li>
    <li>
        <b>getElementTextContent(string elementId):</b> A function that returns the value of the textContent, if any, for the specified DOM element.
    </li>
    <li>
        <b>setElementTextContent(string elementId, string textContent):</b> A function that sets the textContent attribute for the specified DOM element, if any.
    </li>
    <li>
        <b>getElementAttr(string elementId, string attrName):</b> A function that returns the value of the specified attribute for the specified DOM element, if any.
    </li>
    <li>
        <b>setElementAttr(string elementId, string attrName, string attrValue):</b> A function that sets the value of the specified attribute for the specified DOM element, if any.
    </li>
    <li>
        <b>getElementStyle(string elementId):</b> A function that returns the value of the specified DOM element's style attribute.
    </li>
    <li>
        <b>setElementStyle(string elementId, string styleStr):</b> A function that sets the value of the specified DOM element's style attribute.
    </li>
    <li>
        <b>getElementInnerHtml(string elementId):</b> A function that returns the value of the innerHtml attribute, if any, for the specified DOM element.
    </li>
    <li>
        <b>setElementInnerHtml(string elementId, string innerHtml):</b> A function that sets the innerHtml attribute of the specified DOM element, if any.
    </li>
    <li>
        <b>appendNewChildElementToContainer(string newElementTagName, string newElementId, bool prepend, string parentElementId):</b> A function that creates and adds a new DOM element either prepend or append to the specified container element, if any.
    </li>
    <li>
        <b>appendNewChildElementToParent(string newElementTagName, string newElementId, bool prepend, string parentElementId):</b> A function that creates and adds a new DOM element either prepend or append to the specified JsonPL specified parent container element, if any.
    </li>
    <li>
        <b>cnvIntToStr(int i):</b><br>
        <b>cnvIntToFloat(in i):</b><br>
        <b>cnvIntToBool(int i):</b><br>
        <b>cnvFloatToStr(float f):</b><br>
        <b>cnvFloatToInt(float f):</b><br>
        <b>cnvFloatToBool(float f):</b><br>
        <b>cnvBoolToStr(bool b):</b><br>
        <b>cnvBoolToFloat(bool b):</b><br>
        <b>cnvBoolToInt(bool b):</b><br>
        <b>cnvStrToInt(string s):</b><br>
        <b>cnvStrToFloat(string s):</b><br>        
        <b>cnvStrToBool(string s):</b> Although the {asgn} object handles type conversion there are system level functions you can call to explicitly convert certain values from one type to another.
    </li>
    <li>
        <b>setClickEventHandler(string elementId):</b> A function that sets the click event handler to the JsonPL local function "eventWireUpClick" function which should be defined via the jsonPlState prototype in the local environment.
    </li>
</ul>

Redefining the "eventWireUpClick" function to work in the local environment.

<pre>
jsonPlState.prototype.eventWireUpClick = function(event) {
    localEventWireUpClick(event);
}
</pre>

And the hand-off to JsonPL.

<pre>
function localEventWireUpClick(event) {
    var targetElement = event.target;
    var targetId = targetElement.id;
    var eventType = event.type;
    var eventPath = targetId + "." + eventType;
    var callObj = {"sys": "call", "name": eventPath, "args": [
        {"sys": "const", "val": {"sys": "val", "type": "string", "v": targetId}}
        {"sys": "const", "val": {"sys": "val", "type": "string", "v": eventType}}        
    ]};
    jpl.runClassFunc(callObj);
}
</pre>

That brings us to the end of the {call} object's review.

## Return

Return types are defined for the {class} and {func} objects and are either explicitly done with a {return} object or implicitly done by letting the function return the return value of the last line processed by the {func} object. The {class} object also has a return type but this is to define the return type of the default function that is automatically called by the {class} objects' "call" attribute. Let's take a look at the format of the {return} object.

<pre>
{?
    sys: return,
    val: {ref | const}
?}
</pre>

An example of a {return} object from the exit point of a {func} object looks as follows.

<pre>
{"sys": "return", "val": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 0}}}
</pre>

The expected return type for {class} and {func} objects is defined in the "ret" attribute of those objects which defines the type of value to expect as the result of the function or default class function call.

## Bex

A {bex} object stands for boolean expression. It is used to process a boolean expression and return a resulting value. The structure of the {bex} object is as follows.

<pre>
{?
    sys: bex,
    left: {ref | const | exp | bex | call},
    op: {op}(& type="bex"),
    right: {ref | const | exp | bex | call}
?}
</pre>

This object simply compares two values using the provided operator and returns a boolean value. An example of a {bex} object in action is shown subsequently.

<pre>
{"sys":"asgn",
    "left":{"sys":"ref", "val":{"sys":"val", "type":"bool", "v":"$.vars.tmpBool1"}},
    "op":{"sys":"op", "type":"asgn", "v":"="},
    "right":{"sys":"bex",
        "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.tmpInt1"}},
        "op":{"sys":"op", "type":"bex", "v":">"},
        "right":{"sys":"const", "val":{"sys":"val", "type":"int", "v":"1"}}
    }
}
</pre>

The {bex} object is used in {asgn}, {if}, {bex}, and {exp} objects. We've seen most of these objects already so I won't list them in any detail here.

## Exp

The {exp}, expression, object is used to combine values and return the results. Processing the {exp} object involves trying to convert between data types automatically as best it can. The form of the {exp} object follows.

<pre>
{?
    sys: exp,
    left: {ref | const | exp | bex | call},
    op: {op}(& type="exp"),
    right: {ref | const | exp | bex | call}
?}
</pre>

And, an example of the {exp} object in action.

<pre>
{"sys":"asgn",
    "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}},
    "op":{"sys":"op", "type":"asgn", "v":"="},
    "right":{"sys":"exp",
        "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}},
        "op":{"sys":"op", "type":"exp", "v":"+"},
        "right":{"sys":"const", "val":{"sys":"val", "type":"int", "v":"1"}}
    }
}
</pre>

This example is a long winded way to increment the value in the "$.vars.idx" local function variable.

## Asgn

The {asgn} object is used to assign a value to a variable or argument using a {ref} object. The {asgn} object takes an {op} object of type "asgn" which supports the following operators, ==, =, +=, -=, *=, **=, /=, and %=. Next let's take a look at what the structure of the {asgn} object looks like.

<pre>
{?
    sys: asgn,
    left: {ref},
    op: {op}(& type="asgn"),
    right: {ref | const | exp | bex | call},
    url: "string"(& where string is a valid url, optional)
?}
</pre>

The optional "url" attribute allows the {asgn} object to work on a remote variable. The {asgn} object works with the {for} or {if}, {func}, objects. An example of a simple, local, {asgn} is listed subsequently.

<pre>
{"sys":"asgn",
	"left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}},
	"op":{"sys":"op", "type":"asgn", "v":"="},
	"right":{"sys":"exp",
		"left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}},
		"op":{"sys":"op", "type":"exp", "v":"+"},
		"right":{"sys":"const", "val":{"sys":"val", "type":"int", "v":"1"}}
	}
}
</pre>

That concludes the review of the {asgn} object.

## If

The {if} objects provides basic branching logic in a JsonPL program. Let's take a look at the structure of the {if} object.

<pre>
{?
    sys: if,
    left: {ref | const | exp | bex | call},
    op: {op}(& type="bex"),
    right: {ref | const | exp | bex | call},
    thn: [asgn | if | for | call | return | note],
    els: [asgn | if | for | call | return | note]
?}
</pre>

There's not too much more to talk about regarding the {if} object so let's see what an actual implementation of one actually looks like.

<pre>
{"sys": "if",
    "left": {"sys": "ref", "val": {"sys": "val", "type": "int", "v":"#.vars.classInt"}},
	"op": {"sys": "op", "type": "bex", "v": "=="},
	"right": {"sys": "const", "val": {"sys": "val", "type": "int", "v": 0}},
	"thn": [
		{"sys": "call", "name": "SYS::wr", "args": [
		    {"sys": "const", "val": {"sys": "val", "type": "string", "v": "ClassInt is equal to zero!"}}
		]}
	],
	"els": [
        {"sys": "call", "name": "SYS::wr", "args": [
            {"sys": "const", "val": {"sys": "val", "type": "string", "v": "ClassInt is NOT equal to zero!"}}
        ]}
    ]
}
</pre>

That's all there is to the {if} object implementation.

## For

The {for} object provides support for basic looping. There are two versions of the {for} object. One version has explicit loop control while a second version is a for-each with implicit loop control determined by the array it is looping over. Let's take a look at the structure of both versions of the {for} object. The implicit control {for} object is shown next.

<pre>
{?
    sys: for,
    start: {ref | const | exp | bex | call}(& return type="int"),
    stop: {ref | const | exp | bex | call}(& return type="int"),
    inc: {ref | const | exp | bex | call}(& return type="int"),
    lines: [asgn | if | for | call | return | note]
?}
</pre>

Now, let's take a look at the for-each version of the {for} object.

<pre>
{?
    sys: for,
    each: {ref : const}(& type of array),
    lines: [asgn | if | for | call | return | note]
?}
</pre>

The structures are sort of what you'd expect given the context. Now let's take a look at an actual implementation of both types of {for} loop objects.

<pre>
{"sys": "for",
    "start": {"sys": "const", "val": {"sys": "val", "type": "int", "v": "0"}},
    "stop": {"sys": "const", "val": {"sys": "val", "type": "int", "v": "10"}},
    "inc": {"sys": "const", "val": {"sys": "val", "type": "int", "v": "1"}},
    "lines": [
        {"sys": "call", "name": "SYS::wrInt", "args": [
            {"sys": "ref", "val": {"sys": "val", "type": "int", "v": "#.vars.classInt"}}
        ]},
        {"sys": "asgn",
            "left": {"sys": "ref", "val": {"sys": "val", "type": "int", "v": "#.vars.classInt"}},
            "op": {"sys": "op", "type": "asgn", "v": "+="},
            "right": {"sys": "const", "val": {"sys": "val", "type": "int", "v": "1"}}
        }
    ]
}
</pre>

And the for-each version of the {for} object which references an array to loop over.

<pre>
{"sys": "for",
    "each": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.vars.ar1"}},
    "lines": [
        {"sys":"asgn",
            "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}},
            "op":{"sys":"op", "type":"asgn", "v":"="},
            "right":{"sys":"exp",
                "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}},
                "op":{"sys":"op", "type":"exp", "v":"+"},
                "right":{"sys":"const", "val":{"sys":"val", "type":"int", "v":"1"}}
            }
        },
        {"sys":"asgn",
            "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.nidx"}},
            "op":{"sys":"op", "type":"asgn", "v":"="},
            "right":{"sys":"exp",
                "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.nidx"}},
                "op":{"sys":"op", "type":"exp", "v":"+"},
                "right":{"sys":"const", "val":{"sys":"val", "type":"int", "v":"1"}}
            }
        }
    ]
}
</pre>

That's really all there is to talk about regarding the {for} object.

## Func

The {func} object is how you define a function in JsonPL. Function can have variables and arguments. Functions are called with the {call} object. Let's take a look at the structure of the {func} object.

<pre>
{?
    sys: func,
    name: "string",
    ret: {val},
    args: [args],
    vars: [var],
    url: "string"(& where string is a valid url, optional),
    lines: [asgn | for | if | return | call | note],
    pubs: ["string"](& where string is a valid url)
?}
</pre>

Similar to the {var} object the {func} object can publish it's calls to a list or URLs. Let's see some examples of the {func} object in action.

<pre>
{"sys": "func", "name": "main", 
    "ret": {"sys": "val", "type": "int", "v": "0"},
    "args": [],
    "vars": [],
    "lines": [
        {"sys": "call", "name": "SYS::wr", "args": [
            {"sys": "const", "val": {"sys": "val", "type": "string", "v": "Hello world!"}}
        ]},
        {"sys": "return", "val": {"sys": "const", "val": {"sys": "val", "type": "int", "v": "1"}}}
    ]
}
</pre>

A slightly more complex {func} object.

<pre>
{"sys":"func", "name":"flipIdxs", "args":[ 
        {"sys":"arg", "name":"toIdx", "val":{"sys":"val", "type":"int", "v":"0"}},
        {"sys":"arg", "name":"fromIdx", "val":{"sys":"val", "type":"int", "v":"0"}}
    ],
    "vars":[
        {"sys":"var", "name":"tmp", "val":{"sys":"val", "type":"int", "v":"-1"}}
    ],
    "ret":{"sys":"val", "type":"bool", "v":"false"},
    "lines":[
        {"sys":"asgn",
        "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.tmp"}},
        "op":{"sys":"op", "type":"asgn", "v":"="},
        "right":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"#.vars.ar1.[$.args.toIdx]"}}
        },
        {"sys":"asgn",
        "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"#.vars.ar1.[$.args.toIdx]"}},
        "op":{"sys":"op", "type":"asgn", "v":"="},
        "right":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"#.vars.ar1.[$.args.fromIdx]"}}
        },
        {"sys":"asgn",
        "left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"#.vars.ar1.[$.args.fromIdx]"}},
        "op":{"sys":"op", "type":"asgn", "v":"="},
        "right":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.tmp"}}
        },
        {"sys":"return", "val":{"sys":"const", "val":{"sys":"val", "type":"bool", "v":"true"}}}                     
    ]
},
</pre>

And, another slightly more complex {func} object.

<pre>
{"sys":"func", "name":"getSmallestIdx",
    "args":[ 
        {"sys":"arg", "name":"start", "val":{"sys":"val", "type":"int", "v":"0"}},
        {"sys":"arg", "name":"stop", "val":{"sys":"val", "type":"int", "v":"0"}}
    ],
    "vars":[
        {"sys":"var", "name":"idx", "val":{"sys":"val", "type":"int", "v":"-1"}},
        {"sys":"var", "name":"sml", "val":{"sys":"val", "type":"int", "v":"0"}},
        {"sys":"var", "name":"smlIdx", "val":{"sys":"val", "type":"int", "v":"0"}}                                          
    ],
    "ret":{"sys":"val", "type":"int", "v":"-1"},
    "lines":[
        {"sys": "for",
			"each": {"sys":"ref", "val":{"sys": "val", "type": "int", "v": "#.vars.ar1"}},
			"lines": [
				{"sys":"asgn",
				"left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}},
				"op":{"sys":"op", "type":"asgn", "v":"="},
				"right":{"sys":"exp",
					"left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}},
					"op":{"sys":"op", "type":"exp", "v":"+"},
					"right":{"sys":"const", "val":{"sys":"val", "type":"int", "v":"1"}}
    				}
                },                            
				{"sys":"if",
				"left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"#.vars.ar1.[$.vars.idx]"}},
				"op":{"sys":"op", "type":"bex", "v":"<"},
				"right":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.sml"}},
				"thn":[
					{"sys":"asgn",
					"left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.sml"}},
					"op":{"sys":"op", "type":"asgn", "v":"="},
					"right":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"#.vars.ar1.[$.vars.idx]"}}
                    },
                    {"sys":"asgn",
					"left":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.smlIdx"}},
					"op":{"sys":"op", "type":"asgn", "v":"="},
					"right":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"$.vars.idx"}}
                    }
				],
				"els":[]}
			]
        },
        {"sys":"return", "val":{"sys":"ref", "val":{"sys":"val", "type":"int", "v":"[$.vars.smlIdx]"}}}
    ]
}
</pre>

That concludes the review of the {func} object.

## Class

The {class} object is the main object in JsonPL for describing a program. It supports encapsulating code in functions, a default access point via the {class} object's "call" attribute, and library classes via the {class} objects "classes" attribute. Let's take a look at the structure of the {class} object.

<pre>
{?
    sys: class,
    name: "string",
    ret: {val},
    call: {call},
    classes: [class](optional),
    vars: [var],
    funcs: [func]
?}
</pre>

A few real word examples will reinforce all the JsonPL objects we've looked at this far.

<pre>
{
	"sys": "class",
	"name": "ExampleProgram1_HelloWorld",
	"ret": {"sys": "val", "type": "int", "v": "0"},
  	"call": {"sys": "call", "name": "main", "args": []},
  	"classes": [],
  	"vars": [],
  	"funcs": [
		{"sys": "func", "name": "main", 
		"ret": {"sys": "val", "type": "int", "v": "0"},
      		"args": [],
      		"vars": [],
      		"lines": [
        		{"sys": "call", "name": "SYS::wr", "args": [
            			{"sys": "const", "val": {"sys": "val", "type": "string", "v": "Hello world!"}}
      			]},
			{"sys": "return", "val": {"sys": "const", "val": {"sys": "val", "type": "int", "v": "1"}}}
  	  	]}
  	],
  	"comment": "Example program that prints a hello world message to the console."
}
</pre>

<pre>
{
	"sys": "class",
	"name": "ExampleProgram6_WritingValues",
	"ret": {"sys": "val", "type": "int", "v": "0"},
  	"call": {"sys": "call", "name": "#.funcs.main", "args": []},
  	"classes": [],
  	"vars": [
		{"sys": "var", "name": "funcInt1", "val": {"sys": "val", "type": "int", "v": "11"}}
	],
  	"funcs": [
		{"sys": "func", "name": "main", 
		"ret": {"sys": "val", "type": "int", "v": "0"},
      		"args": [],
      		"vars": [],
      		"lines": [
        		{"sys": "call", "name": "SYS::wrInt",
          		"args": [
            			{"sys": "ref", "val": {"sys": "val", "type": "int", "v": "#.vars.funcInt1"}}
      			]},
			{"sys": "return", "val": {"sys": "ref", "val": {"sys": "val", "type": "int", "v": "#.vars.funcInt1"}}}
  	  	]}
  	],
  	"comments": "Example program that prints out an integer. Takes no arguments and references the class variable. This example uses a more formal function calling name in the class's call attribute. Also this example program returns a value that is a reference to a local class variables."
}
</pre>

<pre>
{
	"sys": "class",
	"name": "ExampleProgram8_WritingValuesAdv",
	"ret": {"sys": "val", "type": "int", "v": "0"},
  	"call": {"sys": "call", "name": "#.funcs.main", "args": [
		{"sys": "const", "val": {"sys": "val", "type":"int", "v":55}},
		{"sys": "ref", "val": {"sys": "val", "type": "int", "v": "<#.vars.classVar2>"}}
	]},
  	"classes": [],
  	"vars": [
		{"sys": "var", "name": "classVar1", "val": {"sys": "val", "type": "int", "v": "65"}},
		{"sys": "var", "name": "classVar2", "val": {"sys": "val", "type": "string", "v": "#.vars.classVar3"}},
		{"sys": "var", "name": "classVar3", "val": {"sys": "val", "type": "int", "v": "85"}}
	],
  	"funcs": [
		{"sys": "func", "name": "main", 
		"ret": {"sys": "val", "type": "int", "v": "0"},
      		"args": [
			{"sys": "arg", "name": "funcArg1", "val": {"sys": "val", "type": "int", "v": 0}},
			{"sys": "arg", "name": "funcArg2", "val": {"sys": "val", "type": "int", "v": 0}}
		],
      		"vars": [
			{"sys": "var", "name": "funcVar1", "val": {"sys": "val", "type": "int", "v": "75"}}
		],
      		"lines": [
        		{"sys": "call", "name": "SYS::wr",
          		"args": [
            			{"sys": "const", "val": {"sys": "val", "type": "string", "v": "Hello world!"}}
      			]},
        		{"sys": "call", "name": "SYS::wrApp",
          		"args": [
            			{"sys": "ref", "val": {"sys": "val", "type": "int", "v": "#.vars.classVar1"}}
      			]},
        		{"sys": "call", "name": "SYS::wrInt",
          		"args": [
            			{"sys": "ref", "val": {"sys": "val", "type": "int", "v": "$.args.funcArg1"}}
      			]},
        		{"sys": "call", "name": "SYS::wrInt",
          		"args": [
            			{"sys": "ref", "val": {"sys": "val", "type": "int", "v": "$.args.funcArg2"}}
      			]},
        		{"sys": "call", "name": "SYS::wr",
          		"args": [
            			{"sys": "ref", "val": {"sys": "val", "type": "int", "v": "$.vars.funcVar1"}}
      			]},
			{"sys": "return", "val": {"sys": "const", "val": {"sys": "val", "type": "int", "v": "1"}}}
  	  	]}
  	],
  	"comment": "Example program that prints a hello world message followed by writing class vars, function args, and function vars, demonstrating the reference path for those objects."
}
</pre>

## Executing JsonPL Code

You can run JsonPL code as shown in the following example.

<pre>
var ljpl = new jsonPlState();
var lcodeStr = txtAreaSrc.value;
ljpl.program = JSON.parse(lcodeStr);

if(!ljpl.validateSysObjClass(ljpl.program)) {
    ljpl.wr("runProgram: Error: could not validate the class object.");
    return;
}

ljpl.wr("====================== Program Results ======================");
ljpl.runProgram();
</pre>

The best place to find JsonPL resources are listed here.

<pre>
A simple program execution environment that examplifies configuring a page's DOM, event handling, and program execution:
<b>/public_html/RUN_SIMPLE.HTML</b>

A series of programs demonstrating the JsonPL language:
<b>/public_html/example_programs</b>

An web example server that can handle providing endpoints for the JsonPL example programs that use remote server requests:
<b>/public_html/svr/RUN_EXEC4SVR_ADVNC_SVR.BAT</b>
</pre>