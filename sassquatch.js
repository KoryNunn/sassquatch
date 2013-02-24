var scss = require('node-sass'),
	fs = require('fs'),
	path = '../';

fs.watch(path, function(eventType, filename){
	var ext = filename.split('.').pop();
	if(ext === 'scss' || ext === 'sass'){
		fs.readFile(path + filename, function(error, scssFile){
			if(error){
				console.log(error);
				return;
			}
			scss.render(scssFile.toString(), function(error, css){
				if(error){
					console.log(error);
					return;
				}
				fs.writeFile(path + filename.split('.').slice(0,-1).join('.') + '.css', css, function(error){
					if(error){
						console.log(error);
					}
				});
			});			
		})
	}
})