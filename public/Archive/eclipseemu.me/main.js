function patchXSS(item) {
	switch (typeof item) {
		case "string":
			return item.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\\/g, "&#92;").replace(/`/g, "&#96;");
			break;
		case "object":
			var object = item;
			var keys = Object.keys(object);
			for (var i = 0; i < keys.length; i++) {
				object[keys[i]] = patchXSS(object[keys[i]]);
			}
			return object;
			break;
		default:
			return item;
	}
}

Array.prototype.shuffle = function () {
	var currentIndex = this.length,
		temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = this[currentIndex];
		this[currentIndex] = this[randomIndex];
		this[randomIndex] = temporaryValue;
	}
	return this;
}

// if (location.protocol)

const eclipse = {
	init: {
		home: () => {
			// Fetch Repos
			// fetch('https://eclipseemu.me/play/json/repos/featured.json').then(res => res.json()).then(response => {
			// 	var array = response.shuffle();
			// 	document.getElementById("repos_list").innerHTML = array.map(el => `<div class="col-md-4">
			// 	<div class="card border-0 shadow mb-3">
			// 	  <div class="embed-responsive embed-responsive-1by1">
			// 		<img class="embed-responsive-item" onerror="this.src='https://eclipseemu.me/play/static/img/default-cover.png'" src="${patchXSS(el.icon)}" alt="Card image cap">
			// 	  </div>
			// 	  <div class="card-body">
			// 		<h5 class="card-title">${el.name}</h5>
			// 		<a href="https://eclipseemu.me/play/?q=skin&url=${patchXSS(el.link)}" class="card-link text-danger">Add</a>
			// 		<a href="#" onclick="eclipse.copy.repo('${patchXSS(el.name.replace("'", "\&apos;"))}', '${patchXSS(el.link)}')" class="card-link text-danger">Copy Link</a>
			// 	  </div>
			// 	</div>
			//   </div>`).filter((el, i) => {
			// 		return (i < 3);
			// 	}).join('')
			// }).catch(err => console.error(err));
			// Fetch Skins
			fetch('https://eclipseemu.me/play/json/skins/featured.json').then(res => res.json()).then(response => {
				var array = response.shuffle();
				document.getElementById("skins_list").innerHTML = array.map(el => `<div class="col-md-4">
					<div class="card border-0 mb-3">
					<div class="embed-responsive embed-responsive-1by1">
						<img class="embed-responsive-item" onerror="this.src='https://eclipseemu.me/play/static/img/default-cover.png'" src="${patchXSS(el.icon)}" alt="Card image cap">
					</div>
					<div class="card-body">
						<h5 class="card-title">${patchXSS(el.name)}</h5>
						<a href="https://eclipseemu.me/play/?q=repo&url=${patchXSS(el.link)}" class="card-link text-danger">Add</a>
						<a href="#" onclick="eclipse.copy.skin('${patchXSS(el.name.replace("'", "\&apos;"))}', '${patchXSS(el.link)}')" class="card-link text-danger">Copy Link</a>
					</div>
					</div>
				</div>`
				).filter((el, i) => i < 3).join('')
			}).catch(err => console.error(err));
			eclipse.init.downloads();
		},
		faq: function () {
			fetch('https://eclipseemu.me/assets/json/faq.json').then(res => res.json()).then(response => {
				document.getElementById("faq_list").innerHTML = response.faq.map(faq => `<h5 class="card-title mt-5 font-weight-bold">${faq.question}</h5>
				<p class="card-text">${faq.answer}</p>`).join('');
			}).catch(err => console.error(err));
		},
		downloads: function () {
			fetch("https://eclipseemu.me/assets/json/downloads.json").then(res => res.json()).then(links => {
				var current_os_dl_btn = document.getElementById("download-current_os-link");
				if (navigator.appVersion.indexOf("Win") != -1) {
					var rI = Math.floor(Math.random() * links.windows.length);
					current_os_dl_btn.setAttribute("href", links.windows[rI]);
					current_os_dl_btn.innerHTML = "Download for Windows";
				} else if (navigator.appVersion.indexOf("iPhone") != -1) {
					current_os_dl_btn.style.display = "none";
					document.getElementById("download-current_os-link").style.display = "none";
				} else if (navigator.appVersion.indexOf("Mac") != -1) {
					var rI = Math.floor(Math.random() * links.macos.length);
					current_os_dl_btn.setAttribute("href", links.macos[rI]);
					current_os_dl_btn.innerHTML = "Download for macOS";
				} else if (navigator.appVersion.indexOf("Linux") != -1) {
					var rI = Math.floor(Math.random() * links.linux.length);
					current_os_dl_btn.setAttribute("href", links.linux[rI]);
					current_os_dl_btn.innerHTML = "Download for Linux";
				} else {
					current_os_dl_btn.setAttribute("style", "display:none;");
				}
				document.getElementById("download-web-link").setAttribute("href", links.web[Math.floor(Math.random() * links.web.length)]);
				document.getElementById("download-windows-link").setAttribute("href", links.windows[Math.floor(Math.random() * links.windows.length)]);
				document.getElementById("download-macos-link").setAttribute("href", links.macos[Math.floor(Math.random() * links.macos.length)]);
				document.getElementById("download-linux-link").setAttribute("href", links.linux[Math.floor(Math.random() * links.linux.length)]);
				document.getElementById("download-ios-link").setAttribute("href", links.ios[Math.floor(Math.random() * links.ios.length)]);
			}).catch(err => console.error(err));
		}
	},
	copy: {
		skin: function (name, url) {
			prompt("Here's the link for the \"" + name.replace("&apos;", "\'") + "\" skin", url);
		},
		repo: function (name, url) {
			prompt("Here's the link for the \"" + name.replace("&apos;", "\'") + "\" repo", url);
		}
	}
}