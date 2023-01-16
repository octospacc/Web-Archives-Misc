// AURORA CHEAT CODES JS
// Created by Skitty

var gbcpatches = [];

function loadCodeList(sys) {
  var e = sys + "-codes";
  var codes = JSON.parse(localStorage.getItem(e));
  if (codes == [] || !codes[0]) {
    return;
  }
  $$('.'+e).html('');
  codes.forEach(function(code) { 
    $$('.'+e).append('<li class="swipeout"><div class="item-content swipeout-content"><div class="item-inner"><div class="item-title">'+code+'</div></div></div><div class="swipeout-actions-right"><a href="#" onclick="deleteCode(\''+code+'\', \''+sys+'\');" class="swipeout-delete">Delete</a></div></li>');
  });
}

function loadCodes() {
  var nescodes = JSON.parse(localStorage.getItem('nes-codes'));
  var gbccodes = JSON.parse(localStorage.getItem('gbc-codes'));
  for (var i = 0; i < nescodes.length; i++) {
    nes.gg.addCode(nescodes[i]);
  }
  for (var i = 0; i < gbccodes.length; i++) {
    addGBCCode(gbccodes[i]);
  }
}

function addCode(sys) {
  app.dialog.prompt('Enter a cheat code', function(code) {
    code = safe(code.toUpperCase());
    var codes = JSON.parse(localStorage.getItem(sys+'-codes'));
    if (code == "" || sys == "nes" && code.length !== 6 && code.length !== 7) {
      app.dialog.alert('That is not a valid code.');
      return;
    }
    if (sys == "gbc" && code.length !== 8 /*|| sys == "gbc" && code.substring(0, 2) !== "01"*/) {
      app.dialog.alert('That is not a valid code.');
      return;
    }
    for (var i = 0; i < codes.length; i++) {
      if(codes[i] == code) {
        app.dialog.alert('That code is already in your list.');
        return;
      }
    }
    codes.push(code);
    localStorage.setItem(sys+'-codes', JSON.stringify(codes));
    loadCodeList(sys);
  });
}

function deleteCode(code, sys) {
  var codes = JSON.parse(localStorage.getItem(sys+'-codes'));
  for (var i = 0; i < codes.length; i++) {
    if(codes[i] == code) {
      codes.splice(i, 1);
      localStorage.setItem(sys+'-codes', JSON.stringify(codes));
    }
  }
}

function addGBCCode(code) {
  code = code.substr(2); // deletes 01
  code = code.substr(0, 2) + code.substr(4, 6) + code.substr(2, 2); // rearranges address
  gbcpatches.push(code);
}

function patchMem(addr) {
  /*for (var i = 0; i < gbcpatches.length; i++) {
    var val = gbcpatches[i].substr(0, 2);
    var paddr = gbcpatches[i].substr(2);
    if (addr == 0x+Number(paddr)) {
      return 0x+Number(val);
    } else {
      
      var pointer = addr;
		if ((pointer < 0x100) && biosActive) {
			if (CGB) return CGBbios[pointer];
			else return bios[pointer];
		} else if (pointer < 0x8000) {
			if (CGB && biosActive && (pointer >= 0x200) && (pointer < 0x900)) return CGBbios[pointer];
			else return MBCReadHandler(pointer) | 0; //can be undefined if stupid stuff happens
		} else if (pointer < 0xA000) {
			if (CGB) return VRAM[pointer-0x8000+0x2000*IORAM[0x4F]];
			else return VRAM[pointer-0x8000];
		} else if (pointer < 0xC000) {
			return MBCReadHandler(pointer) | 0; //even the RAM
		} else if (pointer < 0xE000) {
			if (CGB) {
				if (pointer < 0xD000) return RAM[pointer-0xC000];
				else return RAM[(pointer-0xD000)+0x1000*IORAM[0x70]];
			} else return RAM[pointer-0xC000];
		} else if (pointer < 0xFE00) {
			if (CGB) {
				if (pointer < 0xF000) return RAM[pointer-0xE000];
				else return RAM[(pointer-0xF000)+0x1000*IORAM[0x70]];
			} else return RAM[pointer-0xE000];
		} else if (pointer < 0xFEA0) {
			return OAM[pointer-0xFE00];
		} else if (pointer < 0xFF00) {
			return 0; //unusable
		} else if (pointer < 0xFF80) {
			return IOReadFunctions[pointer-0xFF00](pointer-0xFF00);
		} else {
			return ZRAM[pointer-0xFF80];
		}
      
    /*}
  }*/
}