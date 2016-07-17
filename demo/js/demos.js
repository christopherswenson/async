var basicCode = [

// part 1

`// In this demo, the buildBlock method will asynchronously
// build a block in the panel on the right.

// Building a block can take some time though!
buildBlock("red", 10, function(err, result) {
  console.log("Block", result, "Built!");
});

// Click "Run Async" in the top corner of this editor to try it!`,

// part 2

`// A Continuation is a wrapper on an asynchronous function.
var red = Async.Continuation(buildBlock, "red", 10);

// The exec method runs the underlying function, and calls
// your callback function.
red.exec(logResult);

// Note: in this demo, the logResult function is defined:
function logResult(err, result) {
  console.log("Error: ", err, "\\nResult:", result);
}`,

// part 3

`var red = Async.Continuation(buildBlock, "red", 10);
var blue = Async.Continuation(buildBlock, "blue", 10);

// To chain Continuations, you can use the then method, which takes
// a function yeilding another Continuation.
red.then(() => blue).exec(logResult);`,

// part 4

`var red = Async.Continuation(buildBlock, "red", 10);
var blue = Async.Continuation(buildBlock, "blue", 10);

// then returns another continuation, so you can keep chaining
red.then(() => blue).then(() => red).exec(logResult);`
]

var errorCode = [

// part 1

`// If an error is passed into an asynchronous method's
// callback function, then the whole Continuation will fail.

// Async.Fail will create such a failing Continuation.
Async.Fail("Oops!").exec(logResult);`,

// part 2

`// Errors short-circuit the evaluation of the Continuation
Async.Continuation(buildBlock, "green", 7)
  .then(() => Async.Fail("Oops!"))
  .then(() => Async.Continuation(buildBlock, "red", 0))
  .exec(logResult);`,

// part 3

`// Because short-circuiting works, errors will propagate!
Async.Fail("This Error Should Propagate")
  .then(() => Async.Fail("This Error Should Never Occur"))
  .exec(logResult);`
]

var sequenceCode = [

// part 1

`// Async.Sequence is a handy constructor that builds a
// Continuation from an array of builders.
var initialize = (value, callback) => callback(null, value);
var square = (value, callback) => callback(null, value * value);
var subtract97 = (value, callback) => callback(null, value - 97);

// With ES6 arrow functions, we can get pretty close
// to Haskell's do notation.
Async.Sequence([ (init) =>
  Async.Continuation(initialize, init), (value) =>
  Async.Continuation(square, value), (value2) =>
  Async.Continuation(subtract97, value2), (result) =>
  Async.Continuation(buildBlock, "yellow", result)
], 10).exec(logResult);`,

// part 2

`// Async.Reduce creates a Continuation that sequences the
// mapping of an asynchronous function on an array.
function add2(val, callback) { callback(null, val + 2) };

Async.Reduce([1, 2, 3, 4], add2).exec(logResult);`,

// part 3

`// Here's a similar example that sequences building a block.
function buildRedBlock(number, callback) {
  buildBlock("red", number, callback);
};

Async.Reduce([1, 2, 3, 4], buildRedBlock).exec(logResult);`,

// part 4

`// What about errors? Do they still short circuit?
function errorOnThree(number, callback) {
  callback(number == 3, number);
};

Async.Reduce([1, 2, 3, 4], errorOnThree).exec(logResult);`

]

var parallelCode = [

// part 1

`// Async.Parallel parallelizes several actions. The optional
// initial value is passed into each one of the builders.

var square = (val, callback) => buildBlock("red", val * val, callback);
var plus3 = (val, callback) => buildBlock("blue", val + 3, callback);
var times3 = (val, callback) => buildBlock("green", val * 3, callback);

Async.Parallel([
  (initial) => Async.Continuation(square, initial),
  (initial) => Async.Continuation(plus3, initial),
  (initial) => Async.Continuation(times3, initial),
], 2).exec(logResult);`,

// part 2

`// Async.Map is performs an asynchronous action for each element
// of an array, in parallel.
Async.Map([1, 2, 3], function(number, callback) {
  buildBlock("purple", number, callback);
}).exec(logResult);`,

// part 3

`// Here's an example of using Map and Reduce together. The colors
// are parallel, but the numbers are sequenced.

var rainbow = ["red", "orange", "yellow", "green", "blue", "purple"];

Async.Map(rainbow, function(color, callback) {
  Async.Reduce([1, 2, 3, 4], function(number, callback) {
    buildBlock(color, number, callback);
  }).exec(callback);
}).exec(logResult);`

]

var customStarterCode = "// build your own custom demo here\n\n\n\n"
