'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob'),
	chalk = require('chalk'),
	path = require('path'),
	config = require('./config'),
	mongoose = require('mongoose');

/**
 * Module init function.
 */
module.exports = function() {
	
	function getAbsolutePathToModelFiles(){
		var pathToThisFolder = __dirname;
		var pathToThisFolderWithForwardSlashes = pathToThisFolder.replace(/\\/g,'/');
		var pathToThisFolderArray = pathToThisFolderWithForwardSlashes.split('/');

		pathToThisFolderArray.pop();	
		var parentPath = pathToThisFolderArray.join('/');
		 return parentPath + '/node_modules/bizsitegenie-models/**/*.js';
	}

	/**
	 * Before we begin, lets set the environment variable
	 * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
	 */
	glob('./config/env/' + process.env.NODE_ENV + '.js', {
		sync: true
	}, function(err, environmentFiles) {
		if (!environmentFiles.length) {
			if (process.env.NODE_ENV) {
				console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
			} else {
				console.error(chalk.red('NODE_ENV is not defined! Using default development environment'));
			}

			process.env.NODE_ENV = 'development';
		} else {
			console.log(chalk.black.bgWhite('Application loaded using the "' + process.env.NODE_ENV + '" environment configuration'));
		}
	});

	config.getGlobbedFiles(getAbsolutePathToModelFiles()).forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Bootstrap db connection
	var db = mongoose.connect(config.db, function(err) {
		if (err) {
			console.error(chalk.red('Could not connect to MongoDB!'));
			console.log(chalk.red(err));
		}
	});

	
};