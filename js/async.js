
// module

var Async = {}

Async.Continuation = function(method) {
    var continuation = {
        method: method,
        args: Array.prototype.slice.call(arguments, 1)
    };

    continuation.exec = function(callback) {
        continuation.method.apply(null, continuation.args.concat(callback));
    }

    continuation.then = function(makeDo) {
        return Async.Continuation(function(callback) {
            continuation.exec(function(err) {
                if (err != null) callback(err);
                else {
                    var results = Array.prototype.slice.call(arguments, 1);
                    makeDo.apply(continuation, results).exec(callback);
                }
            });
        });
    }

    continuation.print = function() {
        continuation.exec(function(err, result) {
            console.log(err, result);
        });
    }

    return continuation;
}

Async.Fail = function(err) {
    var fail = function(message, callback) {
        return callback(message);
    }

    return Async.Continuation(fail, err);
}

Async.Sequence = function(makers, initial) {
    return makers.reduce(function(continuation, maker) {
        return continuation.then(maker);
    }, Async.Identity(initial));
}

Async.Parallel = function(builders, initial) {
    return Async.Continuation(function(callback) {
        var numComplete = 0;
        var errs = null;
        var results = null;
        var complete = function(err, result) {
            if (err) errs = (errs || []).concat(err);
            if (result) results = (results || []).concat(result);
            numComplete++;
            if (numComplete == builders.length) {
                return callback(errs, results);
            }
        }

        builders.forEach(function(builder) {
            builder(initial).exec(complete);
        });
    });
}

Async.Reduce = function(array, transform) {
    return array.reduce(function(continuation, element) {
        return continuation.then(function(accumulation) {
            function async(callback) {
                function complete(err, result) {
                    if (err) callback(err);
                    else callback(null, accumulation.concat(result));
                }
                return Async.Continuation(transform, element).exec(complete);
            }
            return Async.Continuation(async);
        });
    }, Async.Identity([]));
}

Async.Map = function(array, transform) {
    return Async.Parallel(array.map(function(element) {
        return function() {
            return Async.Continuation(transform, element);
        }
    }));
}

Async.Identity = function(value) {
    return Async.Continuation(function(callback) {
        callback(null, value);
    });
}

// TODO

// Async.Filter, Async.If, Async.Unless, Async.Every, Async.Reject, Async.Some
// This is basically a less full-featured http://caolan.github.io/async/docs.html

