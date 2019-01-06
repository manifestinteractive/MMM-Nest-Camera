var getCameras = function (config, callback) {
	if (!config || !config.token) {
		return callback({
			success: false,
			message: 'Please run getNestToken.sh and put your token in the config.js file',
			data: null
		});
	}

	var url = 'https://developer-api.nest.com/devices?auth=' + config.token;
	var req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status === 200) {
				if (this.response == '{}') {
					return callback({
						success: true,
						message: 'Token works, but no data received. Make sure you are using the master account.',
						data: null
					});
				} else {
					var data = JSON.parse(this.response);

					if (!data.cameras || JSON.stringify(data.cameras) === '{}') {
						return callback({
							success: true,
							message: 'No Cameras.',
							data: null
						});
					}

					var cameras = [];

					for (var camera in data.cameras) {
						if (!data.cameras.hasOwnProperty(camera)) {
							continue;
						}

						var cam = data.cameras[camera];

						if (cam.is_online && cam.is_public_share_enabled) {
							if (!config.whereFilter || (typeof config.whereFilter === 'object' && config.whereFilter.length > 0 && config.whereFilter.indexOf(cam.where_name) > -1)) {
								cameras.push({
									name: cam.where_name,
									video: cam.public_share_url.replace('video.nest.com/live', 'video.nest.com/embedded/live') + '?autoplay=1&playsinline=1&webkit-playsinline=1&mute=1&controls=0',
									image: cam.snapshot_url
								});
							}
						} else if (cam.is_online) {
							if (!config.whereFilter || (typeof config.whereFilter === 'object' && config.whereFilter.length > 0 && config.whereFilter.indexOf(cam.where_name) > -1)) {
								cameras.push({
									name: cam.where_name,
									image: cam.snapshot_url
								});
							}
						}
					}

					return callback({
						success: true,
						message: null,
						data: cameras
					});
				}
			} else {
				return callback({
					success: false,
					message: 'Nest Error - Status: ' + this.status,
					data: null
				})
			}
		}
	};
	req.send();
}