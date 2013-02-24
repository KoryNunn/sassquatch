var scss = require('node-sass'),
	fs = require('fs'),
	path = '../';
	
function hasError(error){
	if(error){
		console.log(error);
		return true;
	}
}
	
function renderSass(callback){
	return function(filename, sass){
		scss.render(sass.toString(), function(error, css){
			hasError(error) || callback(filename, css);
		});
	};
}
	
function readSass(filename, callback){
	fs.readFile(path + filename, function(error, scssFile){
		hasError(error) || callback(filename, scssFile.toString());
	});
}

function writeCss(filename, css){	
	fs.writeFile(path + filename.split('.').slice(0,-1).join('.') + '.css', css, function(error){
		hasError(error);
	});
}

fs.watch(path, function(eventType, filename){
	var ext;

	if(eventType !== 'change'){
		return;
	}

	ext = filename.split('.').pop();

	if(ext === 'scss' || ext === 'sass'){
		readSass(filename, renderSass(writeCss));
	}
})