#!/usr/bin/env node

var program = require('commander'),
    scss = require('node-sass'),
    fs = require('fs'),
    watchPath = './',
    outputPath = './';
    

program
  .version('0.0.1')
  .option('-v, --verbose', 'Verbose output')
  .option('-o, --output [path]', 'Output Path [default ./]')
  .option('-w, --watch [path]', 'Watch Path [default ./]')
  .parse(process.argv);


 if(program.watch){
    watchPath = program.watch;
 }

 if(program.output){
    outputPath = program.output;
 }

function hasError(error){
    if(error){
        console.log(error);
        return true;
    }
}
    
function renderSass(callback){
    return function(filename, sass){
        log('Rendering Sass from ' + filename);

        scss.render(sass.toString(), function(error, css){
            if(!hasError(error)){
                callback(filename, css);
            }
        });
    };
}
    
function readSass(filename, callback){
    log('Reading Sass from ' + filename);

    fs.readFile(watchPath + filename, function(error, scssFile){
            if(!hasError(error)){
                callback(filename, scssFile.toString());
            }
    });
}

function writeCss(filename, css){
    filename = filename.split('.').slice(0,-1).join('.') + '.css';
    
    log('Writing Css to ' + filename);

    fs.writeFile(outputPath + filename, css, function(error){
        hasError(error);
    });
}

function log(message){
    if(program.verbose){
        console.log(message);
    }
}

log('Watching ' + watchPath + ' for changes.');
log('Output path is ' + outputPath);

fs.watch(watchPath, function(eventType, filename){
    var ext;

    if(eventType !== 'change'){
        return;
    }

    ext = filename.split('.').pop();

    if(ext === 'scss' || ext === 'sass'){
        readSass(filename, renderSass(writeCss));
    }
});