(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{12:function(t,e,n){(function(n){var o,a;void 0===(a="function"==typeof(o=function(){"use strict";function e(t,e,n){var o=new XMLHttpRequest;o.open("GET",t),o.responseType="blob",o.onload=function(){s(o.response,e,n)},o.onerror=function(){console.error("could not download file")},o.send()}function o(t){var e=new XMLHttpRequest;e.open("HEAD",t,!1);try{e.send()}catch(t){}return 200<=e.status&&e.status<=299}function a(t){try{t.dispatchEvent(new MouseEvent("click"))}catch(n){var e=document.createEvent("MouseEvents");e.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),t.dispatchEvent(e)}}var i="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof n&&n.global===n?n:void 0,s=i.saveAs||("object"!=typeof window||window!==i?function(){}:"download"in HTMLAnchorElement.prototype?function(t,n,s){var l=i.URL||i.webkitURL,c=document.createElement("a");n=n||t.name||"download",c.download=n,c.rel="noopener","string"==typeof t?(c.href=t,c.origin===location.origin?a(c):o(c.href)?e(t,n,s):a(c,c.target="_blank")):(c.href=l.createObjectURL(t),setTimeout((function(){l.revokeObjectURL(c.href)}),4e4),setTimeout((function(){a(c)}),0))}:"msSaveOrOpenBlob"in navigator?function(t,n,i){if(n=n||t.name||"download","string"!=typeof t)navigator.msSaveOrOpenBlob(function(t,e){return void 0===e?e={autoBom:!1}:"object"!=typeof e&&(console.warn("Deprecated: Expected third argument to be a object"),e={autoBom:!e}),e.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob(["\ufeff",t],{type:t.type}):t}(t,i),n);else if(o(t))e(t,n,i);else{var s=document.createElement("a");s.href=t,s.target="_blank",setTimeout((function(){a(s)}))}}:function(t,n,o,a){if((a=a||open("","_blank"))&&(a.document.title=a.document.body.innerText="downloading..."),"string"==typeof t)return e(t,n,o);var s="application/octet-stream"===t.type,l=/constructor/i.test(i.HTMLElement)||i.safari,c=/CriOS\/[\d]+/.test(navigator.userAgent);if((c||s&&l)&&"object"==typeof FileReader){var r=new FileReader;r.onloadend=function(){var t=r.result;t=c?t:t.replace(/^data:[^;]*;/,"data:attachment/file;"),a?a.location.href=t:location=t,a=null},r.readAsDataURL(t)}else{var d=i.URL||i.webkitURL,u=d.createObjectURL(t);a?a.location=u:location.href=u,a=null,setTimeout((function(){d.revokeObjectURL(u)}),4e4)}});i.saveAs=s.saveAs=s,t.exports=s})?o.apply(e,[]):o)||(t.exports=a)}).call(this,n(5))},19:function(t,e,n){"use strict";n.r(e),n(12),e.default={data:function(){return this.$route.context},methods:{importBackup:function(){this.$app.methods.backups.import()},exportBackup:function(){var t=JSON.stringify({notice:"Please copy the entirety of this page and create a new file with the extension '.eclipse'. Open the new file, and paste the copied text inside.  You will only see this page once, the next launch of Eclipse will not show this.",backup_v2:!0,eclipse:localStorage}),e=new Blob([t],{type:"application/json"}),n=document.createElement("a");n.style.display="none",n.download="backup.eclipse",n.classList.add("external"),n.href=URL.createObjectURL(e),document.body.appendChild(n),n.click()},resetGames:function(){var t=this;this.$app.dialog.confirm("Are you sure you want to clear your installed games? This cannot be undone.",(function(){localStorage.setItem("games","[]"),t.$app.toast.create({text:"Installed games have been reset.",closeTimeout:2e3})}))},resetRepos:function(){var t=this;this.$app.dialog.confirm("Are you sure you want to clear your installed repos? This cannot be undone.",(function(){localStorage.setItem("repos","[]"),t.$app.toast.create({text:"Installed repos have been reset.",closeTimeout:2e3})}))},resetSkins:function(){var t=this;this.$app.dialog.confirm("Are you sure you want to clear your installed skins? This cannot be undone.",(function(){localStorage.setItem("skins",'["https://eclipseemu.me/play/json/skins/default.json"]'),localStorage.setItem("currentSkin",'{"name":"Default","logo":"https://eclipseemu.me/play/img/icons/icon_mobFull.png","author":"Eclipse Team","description":"The default theme for Eclipse.","styles":[[]]}'),t.$app.toast.create({text:"Installed skins have been reset.",closeTimeout:2e3}),window.location.reload()}))},resetSettings:function(){var t=this;this.$app.dialog.confirm("Are you sure you want to clear your settings? This cannot be undone.",(function(){localStorage.setItem("audioStatus","true"),localStorage.setItem("desktopMode",t.$app.device.desktop?"true":"false"),localStorage.setItem("fillScreen","false"),localStorage.setItem("autoSave","60000"),t.$app.toast.create({text:"Settings have been reset.",closeTimeout:2e3}),window.location.reload()}))},resetAll:function(){this.$app.dialog.confirm("Are you sure you want to reset Eclipse to it's default setttings? This cannot be undone.",(function(){localStorage.clear(),window.location.reload()}))}},id:"faade4caf8",render:function(){return'\n<div class="page">\n  <div class="navbar">\n\t<div class="navbar-inner sliding">\n\t  <div class="left">\n\t\t<a href="#" class="link back">\n\t\t  <i class="icon icon-back"></i>\n\t\t  <span class="ios-only">Back</span>\n\t\t</a>\n\t  </div>\n\t  <div class="title">Storage</div>\n\t  <div class="title-large">\n\t\t<div class="title-large-text">Storage</div>\n\t  </div>\n\t</div>\n  </div>\n  <div class="page-content">\n\t<div class="block-title block-title-medium">Storage Usage</div>\n\t<div class="block block-strong">\n\t  <center>\n\t\t<div\n\t\t  class="gauge gauge-init"\n\t\t  data-type="circle"\n\t\t  data-value="'.concat(Math.round(this.storage.usage/this.storage.quota*100*100)/100/100,'"\n\t\t  data-value-text="').concat(Math.round(this.storage.usage/1048576*100)/100,' MiB"\n\t\t  data-value-text-color="#ff3b30"\n\t\t  data-border-color="#ff3b30"\n\t\t  data-label-text="of ').concat(Math.round(this.storage.quota/1048576*100)/100,' MiB"\n\t\t  data-label-text-color="#888888"\n\t\t  data-label-font-weight="700"\n\t\t></div>\n\t  </center>\n\t</div>\n\t<div class="block-footer">\n\t  Eclipse has a limited amount of storage that it can work with, assigned by the web browser. ').concat(-1==navigator.userAgent.toLowerCase().search(/(chrome|android)/i)&&-1!=navigator.userAgent.toLowerCase().search(/safari/i)?"Please note that the given values may not be totally accurate due to limitations in Safari.":"",'\n\t</div>\n\t<div class="list">\n\t\t<ul>\n\t\t\t<li>\n\t\t\t\t<a href="/settings/storage/saves-for-uploads/" class="item-link item-content">\n\t\t\t\t\t<div class="item-inner">\n\t\t\t\t\t\t<div class="item-title">Uploaded Games Saves</div>\n\t\t\t\t\t</div>\n\t\t\t\t</a>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n\t<div class="block-footer">Looking for saves for games in your library? Tap hold or right click on a game to access them.</div>\n\t<div class="block-title block-title-medium">Backups</div>\n\t<div class="list">\n\t  <ul>\n\t\t<li>\n\t\t  <a class="item-link list-button" @click="importBackup">Load Backup</a>\n\t\t</li>\n\t\t<li>\n\t\t  <a class="item-link list-button" @click="exportBackup">Create Backup</a>\n\t\t</li>\n\t  </ul>\n\t</div>\n\t<div class="block-title block-title-medium">Reset</div>\n\t<div class="list">\n\t  <ul>\n\t\t<li>\n\t\t  <a class="item-link list-button text-color-red" @click="resetGames">Reset Games</a>\n\t\t</li>\n\t\t<li>\n\t\t  <a class="item-link list-button text-color-red" @click="resetRepos">Reset Repos</a>\n\t\t</li>\n\t\t<li>\n\t\t  <a class="item-link list-button text-color-red" @click="resetSkins">Reset Skins</a>\n\t\t</li>\n\t\t<li>\n\t\t  <a class="item-link list-button text-color-red" @click="resetSettings">Reset Settings</a>\n\t\t</li>\n\t\t<li>\n\t\t  <a class="item-link list-button text-color-red" @click="resetAll">Reset All Content & Settings</a>\n\t\t</li>\n\t  </ul>\n\t</div>\n  </div>\n</div>\n')},styleScoped:!1}}}]);
//# sourceMappingURL=24.app.js.map