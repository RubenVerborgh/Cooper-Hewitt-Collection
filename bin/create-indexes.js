#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

// Parse arguments
var args = process.argv.slice(2),
    dir = args[0];
if (!dir)
  return console.log('usage: create-indexes directory'), process.exit(1);

// Create output file
var output = fs.createWriteStream(path.join(dir, 'index.json'));

// Find all files
var find = exec('find ' + dir + ' -type f', indexFiles),
    first = true;

// Indexes the specified file list
function indexFiles(error, fileList) {
  var files = fileList.split('\n');
  files.forEach(function (file) {
    if (/\.json$/.test(file) && !/index\.json$/.test(file)) {
      output.write(first ? '[\n' : ',\n'), first = false;
      indexFile(file);
    }
  });
  output.write('\n]\n');
}

// Writes the JSON file to the index file
function indexFile(jsonFile) {
  var contents = JSON.parse(fs.readFileSync(jsonFile));
  output.write(JSON.stringify({ file: jsonFile, title: contents.name || contents.title }));
}
