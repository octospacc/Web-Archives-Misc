// AURORA SKINS JS (OpenSkin)
// Created by Skitty

function loadSkins() {
  var currentSkin = localStorage.getItem('currentSkin');
  var skins = JSON.parse(localStorage.getItem('skins'));
  
  OpenSkin.get(currentSkin, true);
  
  $$('.skin-list').html('');
  skins.forEach(loadSkinCell);
  
  app.request.json(currentSkin, function(json) {
    $$('.current-skin').html('<li><div class="item-content"><div class="item-media"><img src="'+safe(json.logo)+'" width="44" style="border-radius:5px;" /></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+safe(json.name)+'</div></div><div class="item-subtitle">'+safe(json.author)+'</div></div></div></li>');
  });
}

function loadSkinCell(skin) {
  app.request.json(JSON.parse(skin).url, function(json) {
    if (JSON.parse(skin).default == "yes") {
      $$('.skin-list').append('<li><a href="javascript:applySkin(\''+JSON.parse(skin).url+'\');" class="item-link item-content"><div class="item-media"><img src="'+safe(json.logo)+'" width="44" style="border-radius:5px;" /></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+safe(json.name)+'</div></div><div class="item-subtitle">'+safe(json.author)+'</div></div></a></li>');
    } else {
      $$('.skin-list').append('<li class="swipeout"><a href="javascript:applySkin(\''+JSON.parse(skin).url+'\');" class="item-link item-content swipeout-content"><div class="item-media"><img src="'+safe(json.logo)+'" width="44" style="border-radius:5px;" /></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+safe(json.name)+'</div></div><div class="item-subtitle">'+safe(json.author)+'</div></div></a><div class="swipeout-actions-right"><a href="#" onclick="deleteSkin(\''+JSON.parse(skin).url+'\');" class="swipeout-delete">Delete</a></div></li>');
    }
  });
}

function addSkin() {
  var skins = JSON.parse(localStorage.getItem('skins'));
  
  app.dialog.prompt('Enter the skin URL', function(url) {
    url = safe(url);
    if (!url.startsWith("assets/")) {
      url = "http://skitty.xyz/aurora/go/dl.php?link=" + url;
    }
    if (url == '' || url.substring(url.lastIndexOf('.')) !== '.json') {
      app.dialog.alert('That is not a valid skin.');
      return;
    }
    for (var i = 0; i < skins.length; i++) {
      if(JSON.parse(skins[i]).url == url) {
        app.dialog.alert('You already have that skin.');
        return;
      }
    }
    app.request.json(url, function(data) {
      var json = '{"url":"'+url+'", "default":"no"}';
      skins.push(json);
      localStorage.setItem('skins', JSON.stringify(skins));
      loadSkins();
      app.dialog.alert('The skin was added to your list.');
    }, function(e) {
      app.dialog.alert('That is not a valid skin.');
    });
  });
}

function deleteSkin(url) {
  var skins = JSON.parse(localStorage.getItem('skins'));
  for (var i = 0; i < skins.length; i++) {
    if(JSON.parse(skins[i]).url == url) {
      skins.splice(i, 1);
      localStorage.setItem('skins', JSON.stringify(skins));
    }
  }
}

function applySkin(url) {
  //OpenSkin.get(url, true);
  localStorage.setItem('currentSkin', url);
  loadSkins();
  //app.dialog.alert('The skin was applied.');
}