importScripts('resource://gre/modules/workers/require.js');
//var PromiseWorker = require('resource://gre/modules/workers/PromiseWorker.js');
var PromiseWorker = require('chrome://promiseworker/content/modules/workers/PromiseWorker.js');

var worker = new PromiseWorker.AbstractWorker();
worker.dispatch = function(method, args = []) {
  return self[method](...args);
},
worker.postMessage = function(...args) {
  self.postMessage(...args);
};
worker.close = function() {
  self.close();
};
worker.log = function(...args) {
  dump("Worker: " + args.join(" ") + "\n");
};
self.addEventListener("message", msg => worker.handleMessage(msg));

var user32 = ctypes.open('user32.dll');

var msgBox = user32.declare('MessageBoxW',
                         ctypes.winapi_abi,
                         ctypes.int32_t,
                         ctypes.int32_t,
                         ctypes.jschar.ptr,
                         ctypes.jschar.ptr,
                         ctypes.int32_t);

function ask(msg) {
	var MB_OK = 0;
	var MB_YESNO = 4;
	var IDYES = 6;
	var IDNO = 7;
	var IDCANCEL = 2;

	var ret = msgBox(0, msg, "Asking Question", MB_YESNO);
	if (ret == IDYES) {
		return 'user clicked yes!'; //resolve promise by returning
	} else {
		throw new Error('user clicked no so reject the promise'); //reject promise by throwing
	}
}

//self.addEventListener("message", msg => self.handleMessage(msg));