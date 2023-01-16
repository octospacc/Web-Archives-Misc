// AURORA MAIN JS
// Created by Skitty

var $$ = Dom7;

var app = new Framework7({
  id: 'xyz.skitty.aurora',
  root: '#app',
  theme: 'ios',
  dialog: {
    title: 'Aurora',
  },
  touch: {
    tapHold: true,
  },
  routes: [
    {
      path: '/',
      url: './index.html',
    },
    {
      path: '/settings/',
      url: './pages/settings.html',
    },
    {
      path: '/skins/',
      url: './pages/skins.html',
    },
    {
      path: '/codes/',
      url: './pages/codes.html',
    },
    {
      path: '/gbccodes/',
      url: './pages/gbccodes.html',
    },
    {
      path: '/import/',
      url: './pages/import.html',
    },
    {
      path: '/source/',
      url: './pages/source.html',
    },
    {
      path: '/drive/',
      url: './pages/drive.html',
    },
    {
      path: '(.*)',
      url: './pages/404.html',
    },
  ],
});

// LOADING
$$(document).on('page:beforeout', '.page[data-name="settings"],.page[data-name="import"]', function (e) {
  loadROMs();
  loadROMList();
  loadCodes();
});
$$(document).on('page:init', '.page[data-name="settings"]', function (e) {
  loadInfo();
});
$$(document).on('page:init', '.page[data-name="skins"]', function (e) {
  loadSkins();
});
$$(document).on('page:init', '.page[data-name="nes-codes"]', function (e) {
  loadCodeList('nes');
});
$$(document).on('page:init', '.page[data-name="gbc-codes"]', function (e) {
  loadCodeList('gbc');
});
$$(document).on('page:init', '.page[data-name="sources"]', function (e) {
  loadSources();
});
$$(document).on('page:afterout', '.page[data-name="codes"],.page[data-name="skins"],.page[data-name="sources"]', function (e) {
  loadInfo();
});

$$(document).on('page:init', '.page[data-name="import"]', function (e) {
  loadSources();
});

var player = 1;
  
window.onload = function() {
  onLoad();
  navigator.__defineGetter__('userAgent', function () {
    return "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0)"
  });
  //alert(navigator.userAgent);
}

function onLoad() {
  if(!localStorage.getItem('loaded')) {
    //app.popup.open('.first-screen');
    removeROMs();
    localStorage.setItem('nes-codes', JSON.stringify([]));
    localStorage.setItem('gbc-codes', JSON.stringify([]));
    localStorage.setItem('sources', JSON.stringify([]));
    var sources = JSON.parse(localStorage.getItem('sources'));
    sources.push('assets/json/romlist.json');
    localStorage.setItem('sources', JSON.stringify(sources));
    localStorage.setItem('skins', JSON.stringify([]));
    var skins = JSON.parse(localStorage.getItem('skins'));
    skins.push('{"url":"skins/default.json", "default":"yes"}');
    skins.push('{"url":"skins/dark.json", "default":"yes"}');
    skins.push('{"url":"skins/oled.json", "default":"yes"}');
    skins.push('{"url":"skins/retro.json", "default":"yes"}');
    skins.push('{"url":"skins/tdm.json", "default":"no"}');
    localStorage.setItem('skins', JSON.stringify(skins));
    localStorage.setItem('currentSkin', 'skins/default.json');
    localStorage.setItem('glinked', 'false');
    localStorage.setItem('loaded', true);
  }
  if(!localStorage.getItem('nes-codes')) {
    localStorage.setItem('nes-codes', JSON.stringify([]));
    localStorage.setItem('gbc-codes', JSON.stringify([]));
  }
  //isSafari();
  loadROMs();
  loadSkins();
  loadROMList();
  loadCodes();
  loadSources();
}

// BASIC FUNCTIONS
function safe(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&qot;').replace(/'/g, '').replace(/`/g, '').replace(/\\/g, '');
}

function resetData() {
  app.dialog.confirm('Are you sure? This will remove all Aurora\'s data, including your ROM library and skins.', function() {
    localStorage.clear();
    location.reload();
  });
}

function resetLibrary() {
  app.dialog.confirm('Are you sure? This will remove your whole ROM library.', function() {
    removeROMs();
    loadROMs();
    loadInfo();
    app.dialog.alert('Library cleared!');
  });
}

function isSafari() {
  if(!window.navigator.standalone) {
    app.dialog.preloader('Add Aurora to your home screen to use it!');
  }
}

// ROM LOAD FUNCTIONS
function openEmu(link, sys) {
  if (sys == "nes") {
    app.popup.open('.nes-emu');
    loadNESROM(link);
  } else if (sys == "sms" || sys == "gg") {
    app.popup.open('.sms-emu');
    loadSMSROM(link);
  } else if (sys == "gbc" || sys == "gb") {
    app.popup.open('.gbc-emu');
    gbc.loadROM(link, false);
    //loadGBCROM(link);
    gbc.paused = false;
  } else if (sys == "drive-nes") {
    gapi.client.drive.files.get({
      fileId: link,
      alt: 'media'
    }).then(function (file) {
      nes.loadRom(file.body);
      nes.start();
      app.popup.open('.nes-emu');
    }, function (err) {
      alert(JSON.stringify(err));
    });
  } else if (sys == "drive-sms" || sys == "drive-gg") {
    gapi.client.drive.files.get({
      fileId: link,
      alt: 'media'
    }).then(function (file) {
      sms.readRomDirectly(file.body, null);
      sms.reset();
      sms.vdp.forceFullRedraw();
      sms.start();
      app.popup.open('.sms-emu');
    }, function (err) {
      alert(JSON.stringify(err));
    });
  } else if (sys == "drive-gbc" || sys == "drive-gb") {
    gapi.client.drive.files.get({
      fileId: link,
      alt: 'media'
    }).then(function (file) {
      gbc.loadROMBuffer(file.body);
      gbc.paused = false;
      app.popup.open('.gbc-emu');
    }, function (err) {
      alert(JSON.stringify(err));
    });
  } else if (sys == "db-nes") {
    app.popup.open('.nes-emu');
    dbx.filesDownload({
      path: link
    }).then(function (response) {
      var blob = response.fileBlob;
      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        nes.loadRom(reader.result);
        nes.start();
      });
      reader.readAsBinaryString(blob);
    }).catch(function(error) {
      alert(JSON.stringify(error));
    });
  } else if (sys == "db-gbc" || sys == "db-gb") {
    app.popup.open('.gbc-emu');
    dbx.filesDownload({
      path: link
    }).then(function (response) {
      var blob = response.fileBlob;
      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        gbc.loadROMBuffer(reader.result);
        gbc.paused = false;
      });
      reader.readAsArrayBuffer(blob);
    }).catch(function(error) {
      alert(JSON.stringify(error));
    });
  } else if (sys == "db-sms" || sys == "db-gg") {
    app.popup.open('.sms-emu');
    dbx.filesDownload({
      path: link
    }).then(function (response) {
      var blob = response.fileBlob;
      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        sms.readRomDirectly(reader.result);
        sms.reset();
        sms.vdp.forceFullRedraw();
        sms.start();
      });
      reader.readAsBinaryString(blob);
    }).catch(function(error) {
      alert(JSON.stringify(error));
    });
  } else {
    app.dialog.alert('That system is not supported');
  }
}

function loadGBCROM(link) {
  var ajax = new XMLHttpRequest();
  ajax.open("GET", link, true);
  ajax.overrideMimeType("text/plain; charset=x-user-defined");
  ajax.onreadystatechange = function() {
    if (ajax.readyState === XMLHttpRequest.DONE) {
      gbc.loadROMBuffer(ajax.response);
    }
  }
  ajax.send(null);
}

function loadSMSROM(link) {
  $.ajax({
    url: encodeURI(link),
    xhr: function() {
      var xhr = $.ajaxSettings.xhr();
      if (xhr.overrideMimeType !== undefined) {
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
      }
      return xhr;
    },
    complete: function(xhr, status) {
      var data;

      if (status === 'error') {
        app.dialog.alert('The ROM could not be loaded.');
        return;
      }
      var data = xhr.responseText;
      sms.readRomDirectly(data, link);
      sms.reset();
      sms.vdp.forceFullRedraw();
      sms.start();
    }
  });
}

function loadNESROM(link) {
  var ajax = new XMLHttpRequest();
  ajax.open("GET", link, true);
  ajax.overrideMimeType("text/plain; charset=x-user-defined");
  ajax.onreadystatechange = function() {
    if (ajax.readyState === XMLHttpRequest.DONE) {
      nes.loadRom(ajax.responseText);
      nes.start();
    }
  }
  ajax.send(null);
}

function loadLocalROM() {
  if (0 !== document.getElementById("localROM").files.length) {
    var rom = document.getElementById("localROM");
    var sys = rom.value.substring(rom.value.lastIndexOf('.'));
    if (sys == ".sms" || sys == ".gg") {
      var fr = new FileReader;
      fr.onload = function(a) {
        sms.readRomDirectly(a.target.result, rom.files[0].name);
        sms.reset();
        sms.vdp.forceFullRedraw();
        sms.start();
        app.popup.close();
        app.popup.open('.sms-emu');
      };
      fr.readAsBinaryString(rom.files[0]);
    } else if (sys == ".nes" || sys == "nes") {
      loadNESFile(rom);
      app.popup.close();
      app.popup.open('.nes-emu');
    } else if (sys == ".gbc" || sys == ".gb") {
      var fr = new FileReader;
      fr.onload = function(a) {
        gbc.loadROMBuffer(a.target.result);
        gbc.paused = false;
        app.popup.close();
        app.popup.open('.gbc-emu');
      };
      fr.readAsArrayBuffer(rom.files[0]);
    } else {
      app.dialog.alert('That\'s not a valid ROM.');
    }
  } else {
    app.dialog.alert('You must upload a ROM first.');
  }
}

function loadNESFile(file) {
  //if (typeof file.files != "undefined") {
    if (file.files.length >= 1) {
      var f = new FileReader();
      f.onload = function() {
        //if (this.readyState == 2) {
          nes.loadRom(this.result);
          nes.start();
        //}
      }
      f.readAsBinaryString(file.files[file.files.length - 1]);
    }
  //}
}

// SAVE STATES
function nesSaveState() {
  try {
    var saveData = JSON.stringify(nes.toJSON());
    localStorage.setItem('saveData', saveData);
  } catch(oException){
    if (oException.name == 'QuotaExceededError') {
      app.dialog.alert('Not enough storage left!');
      localStorage.setItem('saveData', null);
    }
  }
}

function nesLoadState() {
  var saveData = localStorage.getItem('saveData');
  if (saveData == null) {
    app.dialog.alert("You must save a game first.");
    return;
  }
  var loadData = JSON.parse(saveData);
  var nowData = nes.toJSON();
  //nes.fromJSON(JSON.parse(saveData), nes.toJSON());
  nes.loadRom(loadData.romData);
  nes.cpu.fromJSON(loadData.cpu);
  //nes.mmap.fromJSON(loadData.mmap);
  nes.ppu.fromJSON(loadData.ppu);
}

function gbcSaveState() {
  try {
    var saveData = JSON.stringify(gbc.saveState());
    localStorage.setItem('gbcSaveData', saveData);
  } catch(oException){
    if (oException.name == 'QuotaExceededError') {
      app.dialog.alert('Not enough storage left!');
      localStorage.setItem('gbcSaveData', null);
    }
  }
}

function gbcLoadState() {
  var saveData = localStorage.getItem('gbcSaveData');
  if (saveData == null) {
    app.dialog.alert("You must save a game first.");
    return;
  }
  var loadData = JSON.parse(saveData);
  gbc.loadState(loadData);
}

// OTHER FUNCTIONS
function loadInfo() {
  var roms = JSON.parse(localStorage.getItem('roms'));
  var skins = JSON.parse(localStorage.getItem('skins'));
  var nescodes = JSON.parse(localStorage.getItem('nes-codes'));
  var gbccodes = JSON.parse(localStorage.getItem('gbc-codes'));
  var sources = JSON.parse(localStorage.getItem('sources'));
  
  $$('.gamenum').html(roms.length);
  $$('.skinnum').html(skins.length);
  $$('.nescodenum').html(nescodes.length);
  $$('.gbccodenum').html(gbccodes.length);
  $$('.sourcenum').html(sources.length);
  
  if (localStorage.getItem('glinked') == 'true') {
    $$('.glink').html('Linked');
  } else {
    //alert(localStorage.getItem('glinked'));
    $$('.glink').html('Not Linked');
  }
}

// MENUS
var addMenu = app.actions.create({
  buttons: [
    [
      {
        text: 'Sources',
        onClick: function() {
          app.router.navigate('/import/');
        }
      },
      {
        text: 'Upload',
        onClick: function() {
          app.popup.open('.upload-rom');
        }
      }
    ],
    [
      {
        text: 'Cancel'
      }
    ]
  ]
});

var driveMenu = app.actions.create({
  buttons: [
    [
      {
        text: 'Authorize',
        onClick: function() {
          if (localStorage.getItem('glinked') == 'true') {
            app.dialog.alert('You\'re already signed in.');
          } else {
            handleAuthClick();
            loadInfo();
          }
        }
      },
      {
        text: 'Sign Out',
        color: 'red',
        onClick: function() {
          if (localStorage.getItem('glinked') == 'true') {
            handleSignoutClick();
            loadInfo();
          } else {
            app.dialog.alert('You need to be signed in first.');
          }
        }
      }
    ],
    [
      {
        text: 'Cancel'
      }
    ]
  ]
});


var dropMenu = app.actions.create({
  buttons: [
    [
      {
        text: 'Authorize',
        onClick: function() {
          authAccount();
        }
      },
      {
        text: 'Sign Out',
        color: 'red',
        onClick: function() {
        }
      }
    ],
    [
      {
        text: 'Cancel'
      }
    ]
  ]
});

var nesMenu = app.actions.create({
  buttons: [
    [
      {
        text: 'Swap Player Controls',
        onClick: function() {
          if (player == 1) {
            player = 2;
          } else {
            player = 1;
          }
          nes.start();
        }
      },
      {
        text: 'Restart',
        onClick: function() {
          nes.reloadRom();
          nes.start();
        }
      },
      {
        text: 'Save State',
        onClick: function() {
          app.dialog.confirm('Are you sure you want to save? This will replace any previous save state. Keep in mind that this can also cause graphical glitches.', function() {
            nesSaveState();
          });
          nes.start();
        }
      },
      {
        text: 'Load State',
        onClick: function() {
          nesLoadState();
          nes.start();
        }
      },
      {
        text: 'Return to Library',
        color: 'red',
        onClick: function() {
          player = 1;
          nes.stop();
          nes.ui.resetCanvas();
          app.popup.close();
        }
      }
    ],
    [
      {
        text: 'Resume',
        onClick: function() {
          nes.start();
        }
      }
    ]
  ]
});

var smsMenu = app.actions.create({
  buttons: [
    [
      {
        text: 'Restart',
        onClick: function() {
          sms.reset();
          sms.start();
        }
      },
      {
        text: 'Return to Library',
        color: 'red',
        onClick: function() {
          sms.stop();
          sms.vdp.forceFullRedraw();
          app.popup.close();
        }
      }
    ],
    [
      {
        text: 'Resume',
        onClick: function() {
          sms.start();
        }
      }
    ]
  ]
});

var gbcMenu = app.actions.create({
  buttons: [
    [
      {
        text: 'Restart',
        onClick: function() {
          gbc.reset();
          gbc.paused = false;
        }
      },
      {
        text: 'Save State',
        onClick: function() {
          app.dialog.confirm('Are you sure you want to save? This will replace a previous gbc/gb save state.', function() {
            gbcSaveState();
          });
          gbc.paused = false;
        }
      },
      {
        text: 'Load State',
        onClick: function() {
          gbcLoadState();
          gbc.paused = false;
        }
      },
      {
        text: 'Return to Library',
        color: 'red',
        onClick: function() {
          gbc.reset();
          gbc.paused = true;
          app.popup.close();
        }
      }
    ],
    [
      {
        text: 'Resume',
        onClick: function() {
          gbc.paused = false;
        }
      }
    ]
  ]
});
