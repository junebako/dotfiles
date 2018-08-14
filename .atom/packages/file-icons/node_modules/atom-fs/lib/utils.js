"use strict";

const fs   = require("fs");
const path = require("path");

module.exports = {
	nerf,
	normalisePath,
	sipFile,
	statify,

	// Non-breaking fs functions
	lstat:    nerf(fs.lstatSync),
	realpath: nerf(fs.realpathSync),
};


/**
 * Generate an exception-proof version of a function.
 *
 * @param {Function} fn
 * @param {Object} [context]
 * @return {Function}
 */
function nerf(fn, context = null){
	if("function" !== typeof fn)
		throw new TypeError("Argument must be a function");
	
	let lastError = null;
	const handler = function(...args){
		let result = null;
		try      { result = fn.call(context, ...args); }
		catch(e) { lastError = e; }
		return result;
	};
	return Object.defineProperty(handler, "lastError", {
		get: () => lastError,
		set: to => lastError = to
	});
}


/**
 * Normalise path separators.
 *
 * Well-formed URIs (those prefixed by `protocol://`)
 * are returned unmodified unless `clobber` is truthy.
 *
 * @example "C:\User\foo\..\bar" -> "C:/User/bar"
 * @param {String} input
 * @param {Boolean} [clobber=false]
 * @return {String}
 */
function normalisePath(input, clobber = false){
	if(!clobber && /^\w*:\/\//.test(input))
		return input;
	input = path.resolve(input || "");
	return "win32" === process.platform
		? input.replace(/\\/g, "/")
		: input;
}


/**
 * Synchronously read a number of bytes from a file.
 *
 * Previously named "sampleFile", renamed to eliminate ambiguity.
 * 
 * @param {String} path   - Path to file
 * @param {Number} length - Maximum number of bytes to read
 * @param {Number} offset - Offset to start reading from
 * @return {Array} An array of two values: the loaded data-string, and a
 * boolean indicating if the file was small enough to be fully loaded.
 */
function sipFile(path, length, offset = 0){
	if(!path || length < 1)
		return [null, false];
	
	let data = Buffer.alloc(length);
	const fd = fs.openSync(path, "r");
	const bytesRead = fs.readSync(fd, data, 0, length, offset);
	
	let isComplete = false;
	
	data = data.toString();
	if(bytesRead < data.length){
		isComplete = true;
		data = data.substring(0, bytesRead);
	}
	
	return [data, isComplete];
}


/**
 * Use a plain object to generate an {@link fs.Stats} instance.
 *
 * Actual {@link fs.Stats} objects are returned unmodified.
 *
 * @see {@link https://nodejs.org/api/all.html#fs_class_fs_stats}
 * @param {Object} input
 * @return {fs.Stats}
 */
function statify(input){
	if(!input) return null;
	
	if("function" === typeof input.isSymbolicLink)
		return input;
	
	const output = Object.create(fs.Stats.prototype);
	for(const key in input){
		const value = input[key];
		
		switch(key){
			case "atime":
			case "ctime":
			case "mtime":
			case "birthtime":
				output[key] = !(value instanceof Date)
					? new Date(value)
					: value;
				break;
			default:
				output[key] = value;
		}
	}
	
	return output;
}
