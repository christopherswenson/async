
var fakeConsole = jQuery.extend({}, console);
fakeConsole.log = function() {
  var args = Array.prototype.slice.call(arguments);
  args.map(function(arg) {
    return String(arg);
  }).join(" ").split("\n").forEach(function(line) {
    insertInConsole(line, "log");
  });
}

var insertInConsole = function(text, type) {
  var line = document.createElement("pre")
  line.classList.add(type);
  line.innerHTML = text;
  log.appendChild(line)
}

var inCustomDemo = function() {
  return location.hash == "#custom";
}

var store = document.getElementById("store");
var log = document.getElementById("console");

var buildBlock = function(color, number, callback) {
  var block = document.createElement("div");
  block.classList.add("block");
  block.classList.add(color);
  block.innerHTML = number;

  var time = Math.floor((Math.random() * 2000));
  setTimeout(function() {
    store.appendChild(block);
    if (callback instanceof Function) callback(null, number);
  }, time)
}

function logResult(err, result) {
  fakeConsole.log("Errors:", err, "\nResult:", result);
}

function formatError(err) {
  return String(err);
}

var run = function(code) {
  cleanDiv(document.getElementById("store"));
  try {
    insertInConsole("Async started.", "event");
    new Function("Async", "buildBlock", "console", "logResult", code)(Async, buildBlock, fakeConsole, logResult);
  } catch (err) {
    insertInConsole(formatError(err), "error");
    console.log("error", err);
  }

}

function cleanDiv(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function clean() {
  cleanDiv(log);
  cleanDiv(store);
}

var demos = {
  "#basic": basicCode,
  "#errors": errorCode,
  "#parallel": parallelCode,
  "#sequence": sequenceCode
}

function placeEditorArea(outer) {

  var cornerStop = document.createElement("div");
  outer.appendChild(cornerStop);
  cornerStop.classList.add("btn-corner-stop");

  var cornerButton = document.createElement("span");
  cornerStop.appendChild(cornerButton);
  cornerButton.classList.add("btn-corner");
  cornerButton.classList.add("noselect");
  cornerButton.innerHTML = "Run Async";

  var editorContainer = document.createElement("div");
  outer.appendChild(editorContainer);
  editorContainer.classList.add("well");
  editorContainer.classList.add("colored");
  editorContainer.classList.add("editor-container");

  var textarea = document.createElement("textarea");
  editorContainer.appendChild(textarea);
  textarea.classList = ["well"];
  textarea.value = "";

  var editor = makeEditor(textarea);
  cornerButton.onclick = () => run(editor.getValue());
  return editor;
}

function makeEditor(textarea) {
  var editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: "javascript",
    viewPortMargin: Infinity,
    theme: "colorful",
    tabSize: 2
  });

  editor.on('change', function(editor) {
    if (inCustomDemo()) {
      window.localStorage.setItem("async-demo-code", editor.getValue());
    }
  });

  editor.setOption("extraKeys", {
    "Cmd-Enter": function() {
      run(editor.getValue());
    }
  });

  return editor;
}

function loadFromHash() {
  location.hash = location.hash || "#basic";

  var demoArea = document.getElementById("demo-area");
  cleanDiv(demoArea);

  if (demos.keys().contains(location.hash)) {
    var segments = demos[location.hash];
    return segments.map(function(code) {
      var editor = placeEditorArea(demoArea);
      editor.setValue(code);
    });
  } else if (inCustomDemo()) {
    var editor = placeEditorArea(demoArea);
    editor.setValue(window.localStorage.getItem("async-demo-code") || customStarterCode);
    return [editor];
  }
}

var editors = loadFromHash();

window.onhashchange = loadFromHash;

