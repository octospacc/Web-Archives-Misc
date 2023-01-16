// AURORA SOURCES JS
// Created by Skittyblock

function loadSources() {
  var sources = JSON.parse(localStorage.getItem('sources'));
  $$('.sources').html('');
  sources.forEach(function(url) {
    if (url == "assets/json/romlist.json") {
      app.request.json(url, function(data) {
        $$('.sources').append('<li><a onclick="loadSource(\'assets/json/romlist.json\', \''+data.name+'\');" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">'+data.name+'</div></div><div class="item-text">'+data.author+'</div></div></div></a></li>');
      });
    } else {
      app.request.json(url, function(data) {
        var name = "Unknown", author = "Unknown";
        //alert(JSON.stringify(data));
        if(data.name) name = data.name;
        if(data.author) author = data.author;
        $$('.sources').append('<li class="swipeout"><a onclick="loadSource(\''+safe(url)+'\', \''+safe(name)+'\');" class="item-link item-content swipeout-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">'+safe(name)+'</div></div><div class="item-text">'+safe(author)+'</div></div></a><div class="swipeout-actions-right"><a href="#" onclick="deleteSource(\''+safe(url)+'\');" class="swipeout-delete">Delete</a></div></li>');
      });
    }
  });
  
  /*if (localStorage.getItem('glinked') == 'true') {
    $$('.clouds').html('');
    $$('.clouds').append('<li><a onclick="loadDrive();" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Google Drive</div></div><div class="item-text">Import ROMs from your Drive</div></div></div></a></li>');
  }
  
    $$('.clouds').html('');
    $$('.clouds').append('<li><a onclick="loadDB();" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Dropbox</div></div><div class="item-text">Import ROMs from your Dropbox</div></div></div></a></li>');*/
}

function loadSource(url, name) {
  loadROMList(url);
  app.router.navigate('/source/');
  loadROMList(url);
}

function loadDB() {
  app.router.navigate('/drive/');
  loadDBROMs();
}

function loadDrive() {
  app.router.navigate('/drive/');
  loadDriveROMs();
}

function addSource() {
  app.dialog.prompt('Enter the URL to an Aurora Source', function(url) {
    url = safe(url);
    var sources = JSON.parse(localStorage.getItem('sources'));
    if (url == "") {
      app.dialog.alert('That is not a valid source.');
      return;
    }
    if (url !== "assets/json/romlist.json") {
      url = "https://skitty.xyz/aurora/go/dl.php?link=" + url;
    }
    for (var i = 0; i < sources.length; i++) {
      if(sources[i] == url) {
        app.dialog.alert('That source is already in your list.');
        return;
      }
    }
    app.request.json(url, function(data) {
      sources.push(url);
      localStorage.setItem('sources', JSON.stringify(sources));
      loadSources();
    }, function(e) {
      app.dialog.alert('That is not a valid source.');
    });
  });
}

function deleteSource(url) {
  var sources = JSON.parse(localStorage.getItem('sources'));
  for (var i = 0; i < sources.length; i++) {
    if(sources[i] == url) {
      sources.splice(i, 1);
      localStorage.setItem('sources', JSON.stringify(sources));
    }
  }
}
