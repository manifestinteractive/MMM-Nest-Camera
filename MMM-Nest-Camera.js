/* global Module */

/* Magic Mirror
 * Module: MMM-Nest-Camera
 *
 * By Peter Schmalfeldt
 * MIT Licensed.
 */

Module.register('MMM-Nest-Camera', {
	requiresVersion: '2.1.0',

	defaults: {
		whereFilter: null,
		size: 'large',
		mode: 'image'
	},

	interval: null,
	loaded: false,
	error: null,
	cameras: [],

	start: function() {
		var self = this;

    this.whereFilter = this.config.whereFilter;
    this.size = this.config.size,
    this.mode = this.config.mode;

		getCameras(this.config, function (response) {
			if (!response.success || !response.data) {
				self.error = response.message;
			} else {
				self.cameras = response.data;
			}

			self.loaded = true;
			self.updateDom();
			self.scheduleUpdate();
		})
	},

	getScripts: function () {
		return [
			this.file('nest.js')
		];
	},

	getStyles: function () {
		return [
			'MMM-Nest-Camera.css'
		];
	},

	getDom: function() {
		var self = this;
		var $cameras = document.getElementById('nest-cameras');
		var existing = ($cameras);
		var wrapper = ($cameras) ? $cameras : document.createElement('div');

		wrapper.id = 'nest-cameras'

		if (this.error) {
			wrapper.innerHTML = '<?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 19.5 18.2" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path transform="translate(-6.2 -6.7)" d="M18.1,24.9H13.8V19.4a2.1,2.1,0,0,1,4.2,0v5.5Zm6-8.1-1.8-1.5v9.5H19.9V19.3a3.9,3.9,0,1,0-7.8,0v5.5H9.6V15.3L7.8,16.8l-1.6-2L16,6.7l4.3,3.6V9.1h2V12l3.4,2.8Z" fill="#666666"/></svg><br />' + this.error;
			wrapper.className = 'dimmed light small';

			return wrapper;
		}

		if (!this.loaded && !existing) {
			wrapper.innerHTML = '<div id="nest-loading"><?xml version="1.0" encoding="UTF-8"?><svg viewBox="0 0 19.5 18.2" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path transform="translate(-6.2 -6.7)" d="M18.1,24.9H13.8V19.4a2.1,2.1,0,0,1,4.2,0v5.5Zm6-8.1-1.8-1.5v9.5H19.9V19.3a3.9,3.9,0,1,0-7.8,0v5.5H9.6V15.3L7.8,16.8l-1.6-2L16,6.7l4.3,3.6V9.1h2V12l3.4,2.8Z" fill="#666666"/></svg><br />...</div>';
			wrapper.className = 'dimmed light small';
    } else {
			document.getElementById('nest-loading').style.display = 'none';
		}

		for (var i = 0; i < this.cameras.length; i++) {
			if (this.mode === 'video') {
				var video = document.createElement('div');
				var iframe = document.createElement('iframe');
				var title = document.createElement('div');

				title.innerHTML = this.cameras[i].name;
				title.className = 'dimmed light small';

				iframe.setAttribute('src', this.cameras[i].video);
				iframe.setAttribute('frameborder', 0);
				iframe.setAttribute('seamless', true);
				iframe.setAttribute('scrolling', 'no');
				iframe.setAttribute('allowtransparency', true);
				iframe.setAttribute('name', this.cameras[i].name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_'));
				iframe.setAttribute('id', 'nest_camera_' + this.cameras[i].name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_'));

				video.appendChild(title);
				video.appendChild(iframe);

				video.className = 'camera camera__' + this.size;

				wrapper.appendChild(video);
			} else {
				var $camera = document.getElementById('nest-camera-' + i);

				var image = document.createElement('div');
				var title = document.createElement('div');

				title.innerHTML = this.cameras[i].name;
				title.className = 'camera-title';

				image.id = 'nest-camera-' + i;
				image.style.backgroundImage = 'url(' + this.cameras[i].image + '&timesamp=' + new Date().getTime() + ')';

				image.appendChild(title);

				image.className = 'image image__' + this.size;

				wrapper.appendChild(image);
			}
		}

		return wrapper;
	},

	updateImage: function (id, image) {
		// preload the image before swapping it out to prevent flickering
		var snapshot = new Image();
		var imageURL = image + '&timesamp=' + new Date().getTime();
		snapshot.src = imageURL;
		snapshot.onload = function () {
			document.getElementById('nest-camera-' + id).style.backgroundImage = 'url("' + imageURL + '")';
		}
	},

	scheduleUpdate: function() {
		var self = this;
		var nextLoad = (this.mode === 'image') ? 5000 : 0;

		// only need to reload images
		if (this.mode === 'image') {
			for (var i = 0; i < this.cameras.length; i++) {
				this.updateImage(i, this.cameras[i].image)
			}

			setTimeout(function(){
				self.scheduleUpdate();
			}, 3000);
		}
	}
});
