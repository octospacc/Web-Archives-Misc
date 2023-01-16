// AURORA ROMS JS
// Created by Skitty

function loadROMList(source) {
  var sources = JSON.parse(localStorage.getItem('sources'));
  
  for (var i = 0; i < sources.length; i++) {
    if (sources[i] == source) {
    var i2 = i;
    $.getJSON(sources[i2], function(json) {
      //alert(1);
      var name = "Unknown";
      if (json.name) name = safe(json.name);
      $$('.sourcename').html(name);
      setTimeout(function() {
        if (document.getElementsByClassName('sourcename') && document.getElementsByClassName('sourcename')[0].innerHTML == "Loading") {
          loadROMList(source);
          return;
        }
      },500);
      if (json.nes) {
        $$('.nes-roms').html('<div class="block-title">NES</div><div class="list media-list"><ul class="nes-roms"></ul></div>');
        json.nes.forEach(function(e) { loadROMCell(e, 'nes', sources[i2]); });
      }
      if (json.sms) {
        $$('.sms-roms').html('<div class="block-title">SMS</div><div class="list media-list"><ul class="sms-roms"></ul></div>');
        json.sms.forEach(function(e) { loadROMCell(e, 'sms', sources[i2]); });
      }
      if (json.gg) {
        $$('.gg-roms').html('<div class="block-title">GG</div><div class="list media-list"><ul class="gg-roms"></ul></div>');
        json.gg.forEach(function(e) { loadROMCell(e, 'gg', sources[i2]); });
      }
      if (json.gbc) {
        $$('.gbc-roms').html('<div class="block-title">GBC</div><div class="list media-list"><ul class="gbc-roms"></ul></div>');
        json.gbc.forEach(function(e) { loadROMCell(e, 'gbc', sources[i2]); });
      }
      if (json.gb) {
        $$('.gb-roms').html('<div class="block-title">GB</div><div class="list media-list"><ul class="gb-roms"></ul></div>');
        json.gb.forEach(function(e) { loadROMCell(e, 'gb', sources[i2]); });
      }
    });
    }
  }
}

function loadROMCell(json, type, source) {
  var link = json.link;
  if (source !== "assets/json/romlist.json") {
    link = "https://skitty.xyz/aurora/go/dl.php?link=" + json.link;
  }
  $$('ul.'+type+'-roms').append('<li><a href="javascript:addROM(\''+safe(json.name)+'\', \''+safe(link)+'\', \''+safe(json.icon)+'\', null, \''+(json.sys ? safe(json.sys) : type)+'\');" class="item-link item-content"><div class="item-media"><img src="'+safe(json.icon)+'" class="lazy" width="44" /></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+safe(json.name)+'</div></div><div class="item-text">'+type.toUpperCase()+'</div></div></div></a></li>');
}

function loadROMs() {
  var roms = JSON.parse(localStorage.getItem('roms'));
  
  $$('.library').html('');
  
  for (var i = 0; i < roms.length; i++) {
    var romsi = JSON.parse(roms[i]);
    var sys;
    var ext = romsi.link.substring(romsi.link.lastIndexOf('.'));
    if (ext.includes('?dl=1')) {
      ext = ext.substr(0, ext.length - 5);
    }
    if (romsi.cloud) {
      sys = romsi.cloud;
    } else if (romsi.sys) {
      sys = romsi.sys;
    } else if (ext == '.nes') {
      sys = "nes";
    } else if (ext == '.sms') {
      sys = "sms";
    } else if (ext == '.gg') {
      sys = "gg";
    } else if (ext == '.gbc') {
      sys = "gbc";
    } else if (ext == '.gb') {
      sys = "gb";
    } else {
      sys = "none";
    }
    $$('.library').append('<li class="col-33 tablet-20 slot-li" id="rom'+i+'"><a href="javascript:openEmu(\''+safe(romsi.link)+'\', \''+sys+'\');" class="slot"><img src="'+romsi.art+'" class="slot-img" /><div class="item-title slot-title">'+safe(romsi.name)+'</div><div class="slot-subtitle">'+sys.toUpperCase()+'</div></a></li>');
    $$('#rom'+i).on('taphold', function() {
      //alert(this.id);
      deleteROM(this);
    });
  }
}

function addROM(name, link, art, cloud, sys) {
  var roms = JSON.parse(localStorage.getItem('roms'));
  for (var i = 0; i < roms.length; i++) {
    if(JSON.parse(roms[i]).link == link) {
      app.dialog.alert(name + ' is already in your library.');
      return;
    }
  }
  var json = {
    "name": name,
    "art": art,
    "link": link,
    "sys": sys
  }
  //var json = '{"name":"' + name + '", "art":"' + art + '", "link":"' + link + '"}'; //, "sys": "'+sys+'"}';
  roms.push(JSON.stringify(json));
  localStorage.setItem('roms', JSON.stringify(roms));
  
  app.dialog.alert(name + ' was added to your library.');
  loadROMs();
}

function deleteROM(ele) {
  var roms = JSON.parse(localStorage.getItem('roms'));
  
  for (var i = 0; i < roms.length; i++) {
    if ("rom"+i == ele.id) {
      var i2 = i;
      app.dialog.confirm('Are you sure you want to remove ' + JSON.parse(roms[i]).name + '?', function () {
        //app.dialog.alert(JSON.parse(roms[i]).name + ' was removed.');
        roms.splice(i2, 1);
        localStorage.setItem('roms', JSON.stringify(roms));
        loadROMs();
      });
    }
  }
}

function removeROMs() {
  var roms = [];
  localStorage.setItem('roms', JSON.stringify(roms));
}