/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = {
	
	ab2str: function (buf) {
		
		return String.fromCharCode.apply(null, new Uint16Array(buf));
		
	},
	
	str2ab: function (str) {
		
		var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
		var bufView = new Uint16Array(buf);
		
		for (var i=0, strLen=str.length; i < strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		
		return buf;
		
	},
	
	hex2ab: function (str) {
		
		//var buf = new ArrayBuffer(str.length/2);
		
		var typedArray = new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
			return parseInt(h, 16)
		}))
		
		return typedArray.buffer;		
	},
	
	ab2hex: function (buffer) { // buffer is an ArrayBuffer
		return [...new Uint8Array(buffer)]
			.map(x => x.toString(16).padStart(2, '0'))
			.join('');
	},
	
	base64ToArrayBuffer: function (base64) {
		var binary_string = atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	},
	
	arrayBufferToBase64: function (buffer) {
		
		var binary = '';
		var bytes = new Uint8Array( buffer );
		var len = bytes.byteLength;
		
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		
		//console.log ("xxxbinary: " + binary);
		
		return btoa( binary );

	},
	
	isBase64(str) {
		if (str ==='' || str.trim() ===''){ return false; }
			try {
				return btoa(atob(str)) == str;
			} catch (err) {
				return false;
		}
	}
	
};