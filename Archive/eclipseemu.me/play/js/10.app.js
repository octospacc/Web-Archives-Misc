(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{25:function(t,e,n){"use strict";n.r(e),e.default={data:function(){return this.$route.context},methods:{uploadBoxart:function(){document.getElementById("BoxartUploader").click()},handleBoxartUpload:function(t){var e=document.getElementById("BoxartUploader").files[0],n=new FileReader;n.onload=function(t){document.getElementById("edit_game_boxart").value=t.target.result},n.onerror=function(t){console.log("Error: ",t)},n.readAsDataURL(e)},saveData:function(t){for(var e=JSON.parse(localStorage.getItem("games")),n=this.$route.context.game,i="",a=document.getElementById("edit_game_system").children,s=a.length-1;0<=s;s--)1==a[s].selected&&(i=a[s].value);var l={name:document.getElementById("edit_game_name").value,link:document.getElementById("edit_game_link").value,boxart:document.getElementById("edit_game_boxart").value,system:i.toLowerCase(),id:n.id};e.forEach((function(t,i){if((t=JSON.parse(t)).id===n.id){e.splice(i,1),e.push(JSON.stringify(l));var a=e.length-1,s=i,o=e[a];e[a]=e[s],e[s]=o,localStorage.setItem("games",JSON.stringify(e))}}))}},id:"d6b93710cb",render:function(){var t=this;return'\n   <div class="popup">\n      <div class="view">\n         <div class="page">\n            <div class="navbar">\n               <div class="navbar-inner">\n                  <div class="left">\n                     \x3c!-- Link to close popup --\x3e\n                     <a class="link popup-close">\n                     <i class="icon f7-icons ios-only">close</i>\n                     <i class="icon material-icons md-only">close</i>\n                     </a>\n                  </div>\n                  <div class="title">Edit</div>\n                  <div class="right">\n                     \x3c!-- Link to close popup --\x3e\n                     <a href="#" @click="saveData" class="link popup-close">Save</a>\n                  </div>\n               </div>\n            </div>\n            <div class="page-content">\n               <div class="block" style="text-align: center;">\n                  <img src="'.concat(-1<this.game.boxart.indexOf(" ")?encodeURI(this.game.boxart):this.game.boxart,'" style="border-radius: 5px; max-height: 256px; max-width: 256px">\n                  <h1>').concat(this.game.name,"</h1>\n                  <p>").concat(this.$app.methods.game.expandSystem(this.game.system),'</p>\n               </div>\n               <input style="display:none" type="file" name="boxart" accept="image/jpeg, image/png, image/gif" @change="handleBoxartUpload" id="BoxartUploader">\n               <div class="block-title block-title-medium">Edit Info</div>\n               <div class="list">\n                  <ul>\n                     <li class="item-content item-input">\n                        <div class="item-inner">\n                           <div class="item-title item-label">Name</div>\n                           <div class="item-input-wrap">\n                              <input type="text" id="edit_game_name" placeholder="Name" name="name" value="').concat(this.game.name,'">\n                              <span class="input-clear-button"></span>\n                           </div>\n                        </div>\n                     </li>\n                     <li class="item-content item-input">\n                        <div class="item-inner">\n                           <div class="item-title item-label">Link</div>\n                           <div class="item-input-wrap">\n                              <input type="url" id="edit_game_link" placeholder="Link" name="link" value="').concat(this.game.link,'">\n                              <span class="input-clear-button"></span>\n                           </div>\n                        </div>\n                     </li>\n                     <li class="item-content item-input">\n                        <div class="item-inner">\n                           <div class="item-title item-label">Boxart</div>\n                           <div class="item-input-wrap">\n                              \t<input type="url" id="edit_game_boxart" placeholder="Boxart" name="boxart" value="').concat(this.game.boxart,'">\n                              \t<span class="input-clear-button"></span>\n                            \t<div class="item-input-info">\n                            \t\t<button @click="uploadBoxart" class="button button-small" style="text-align: left; margin-right: -16px; padding: 0px;">Upload Boxart</button>\n                            \t</div>\n                           </div>\n                        </div>\n                     </li>\n                     <li class="item-content item-input system-list-item-edit">\n                        <div class="item-inner">\n                           <div class="item-title item-label">System</div>\n                           <div class="item-input-wrap">\n                              <select name="system" id="edit_game_system">\n                                 <option>Unsupported System</option>\n                                 ').concat(this.$app.methods.game.systemList().map((function(e){return'\n                                 \t<option value="'.concat(e.short,'" ').concat(e.short.toLowerCase()==t.game.system.toLowerCase()?"selected":"",">").concat(e.full,"</option>\n                                 ")})).join(""),"\n                              </select>\n                           </div>\n                        </div>\n                     </li>\n                  </ul>\n               </div>\n            </div>\n         </div>\n      </div>\n   </div>\n")},styleScoped:!1}}}]);
//# sourceMappingURL=10.app.js.map