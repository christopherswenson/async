
var basicCode = [

// part 1

"// In this demo, the buildBlock method will asynchronously\n// build a block in the panel on the right.\n\n// Building a block can take some time though!\nbuildBlock(\"red\", 10, function(err, result) {\n  console.log(\"Block\", result, \"Built!\");\n});\n\n// Click \"Run Async\" in the top corner of this editor to try it!",

// part 2

"// A Continuation is a wrapper on an asynchronous function.\nvar red = Async.Continuation(buildBlock, \"red\", 10);\n\n// The exec method runs the underlying function, and calls\n// your callback function.\nred.exec(logResult);\n\n// Note: in this demo, the logResult function is defined:\nfunction logResult(err, result) {\n  console.log(\"Error: \", err, \"\\nResult:\", result);\n}",

// part 3

"var red = Async.Continuation(buildBlock, \"red\", 10);\nvar blue = Async.Continuation(buildBlock, \"blue\", 10);\n\n// To chain Continuations, you can use the then method, which takes\n// a function yeilding another Continuation.\nred.then(() => blue).exec(logResult);",

// part 4

"var red = Async.Continuation(buildBlock, \"red\", 10);\nvar blue = Async.Continuation(buildBlock, \"blue\", 10);\n\n// then returns another continuation, so you can keep chaining\nred.then(() => blue).then(() => red).exec(logResult);"];

var errorCode = [

// part 1

"// If an error is passed into an asynchronous method's\n// callback function, then the whole Continuation will fail.\n\n// Async.Fail will create such a failing Continuation.\nAsync.Fail(\"Oops!\").exec(logResult);",

// part 2

"// Errors short-circuit the evaluation of the Continuation\nAsync.Continuation(buildBlock, \"green\", 7)\n  .then(() => Async.Fail(\"Oops!\"))\n  .then(() => Async.Continuation(buildBlock, \"red\", 0))\n  .exec(logResult);",

// part 3

"// Because short-circuiting works, errors will propagate!\nAsync.Fail(\"This Error Should Propagate\")\n  .then(() => Async.Fail(\"This Error Should Never Occur\"))\n  .exec(logResult);"];

var sequenceCode = [

// part 1

"// Async.Sequence is a handy constructor that builds a\n// Continuation from an array of builders.\nvar initialize = (value, callback) => callback(null, value);\nvar square = (value, callback) => callback(null, value * value);\nvar subtract97 = (value, callback) => callback(null, value - 97);\n\n// With ES6 arrow functions, we can get pretty close\n// to Haskell's do notation.\nAsync.Sequence([ (init) =>\n  Async.Continuation(initialize, init), (value) =>\n  Async.Continuation(square, value), (value2) =>\n  Async.Continuation(subtract97, value2), (result) =>\n  Async.Continuation(buildBlock, \"yellow\", result)\n], 10).exec(logResult);",

// part 2

"// Async.Reduce creates a Continuation that sequences the\n// mapping of an asynchronous function on an array.\nfunction add2(val, callback) { callback(null, val + 2) };\n\nAsync.Reduce([1, 2, 3, 4], add2).exec(logResult);",

// part 3

"// Here's a similar example that sequences building a block.\nfunction buildRedBlock(number, callback) {\n  buildBlock(\"red\", number, callback);\n};\n\nAsync.Reduce([1, 2, 3, 4], buildRedBlock).exec(logResult);",

// part 4

"// What about errors? Do they still short circuit?\nfunction errorOnThree(number, callback) {\n  callback(number == 3, number);\n};\n\nAsync.Reduce([1, 2, 3, 4], errorOnThree).exec(logResult);"];

var parallelCode = [

// part 1

"// Async.Parallel parallelizes several actions. The optional\n// initial value is passed into each one of the builders.\n\nvar square = (val, callback) => buildBlock(\"red\", val * val, callback);\nvar plus3 = (val, callback) => buildBlock(\"blue\", val + 3, callback);\nvar times3 = (val, callback) => buildBlock(\"green\", val * 3, callback);\n\nAsync.Parallel([\n  (initial) => Async.Continuation(square, initial),\n  (initial) => Async.Continuation(plus3, initial),\n  (initial) => Async.Continuation(times3, initial),\n], 2).exec(logResult);",

// part 2

"// Async.Map is performs an asynchronous action for each element\n// of an array, in parallel.\nAsync.Map([1, 2, 3], function(number, callback) {\n  buildBlock(\"purple\", number, callback);\n}).exec(logResult);",

// part 3

"// Here's an example of using Map and Reduce together. The colors\n// are parallel, but the numbers are sequenced.\n\nvar rainbow = [\"red\", \"orange\", \"yellow\", \"green\", \"blue\", \"purple\"];\n\nAsync.Map(rainbow, function(color, callback) {\n  Async.Reduce([1, 2, 3, 4], function(number, callback) {\n    buildBlock(color, number, callback);\n  }).exec(callback);\n}).exec(logResult);"];

var customStarterCode = "// build your own custom demo here\n\n\n\n";
