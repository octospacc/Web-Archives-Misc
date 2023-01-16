// AURORA MOBILE CONTROLLER JS
// Created by Skitty

var currentButton = "";
var currentPad = "";
var currentTouching = "";
var touchA = false;
var touchB = false;
var touchUp = false;
var touchDown = false;
var touchLeft = false;
var touchRight = false;
var touchStart = false;
var touchSelect = false;

// Key Event Functions
function doKeyDown(key) {
  e = $.Event('keydown');
  e.keyCode = key;
  $('.nes-emu').trigger(e);
}
function keyUp(key) {
  e = $.Event('keyup');
  e.keyCode = key;
  $('.nes-emu').trigger(e);
}

// A Button
$(".emu-controls .a").bind("touchstart touchenter touchup mousedown", function() {
  if (player == 1) {
    doKeyDown(90);
  } else {
    doKeyDown(103);
  }
}).bind("touchend touchleave touchcancel mouseup", function() {
  if (player == 1) {
    keyUp(90);
  } else {
    keyUp(103);
  }
});

// B Button
$(".emu-controls .b").bind("touchstart touchenter touchup mousedown", function(e) {
  if (player == 1) {
    doKeyDown(88);
  } else {
    doKeyDown(105);
  }
}).bind("touchend touchleave mouseup", function() {
  if (player == 1) {
    keyUp(88);
  } else {
    keyUp(105);
  }
});

// D-Pad Up
$(".emu-controls .d-up").bind("touchstart touchenter touchup mousedown", function() {
  if (player == 1) {
    doKeyDown(38);
  } else {
    doKeyDown(104);
  }
}).bind("touchend touchleave mouseup", function() {
  if (player == 1) {
    keyUp(38);
  } else {
    keyUp(104);
  }
});

// D-Pad Left
$(".emu-controls .d-left").bind("touchstart touchenter touchup mousedown", function() {
  if (player == 1) {
    doKeyDown(37);
  } else {
    doKeyDown(100);
  }
}).bind("touchend touchleave mouseup", function() {
  if (player == 1) {
    keyUp(37);
  } else {
    keyUp(100);
  }
});

// D-Pad Right
$(".emu-controls .d-right").bind("touchstart touchenter touchup mousedown", function() {
  if (player == 1) {
    doKeyDown(39);
  } else {
    doKeyDown(102);
  }
}).bind("touchend touchleave mouseup", function() {
  if (player == 1) {
    keyUp(39);
  } else {
    keyUp(102);
  }
});

// D-Pad Down
$(".emu-controls .d-down").bind("touchstart touchenter touchup mousedown", function() {
  if (player == 1) {
    doKeyDown(40);
  } else {
    doKeyDown(98);
  }
}).bind("touchend touchleave mouseup", function() {
  if (player == 1) {
    keyUp(40);
  } else {
    keyUp(98);
  }
});

// Start
$(".emu-controls .start").bind("touchstart touchenter touchup mousedown", function() {
  if (player == 1) {
    doKeyDown(16);
  } else {
    doKeyDown(97);
  }
}).bind("touchend touchleave mouseup", function() {
  if (player == 1) {
    keyUp(16);
  } else {
    keyUp(97);
  }
});

// Select
$(".emu-controls .select").bind("touchstart touchenter touchup mousedown", function() {
  if (player == 1) {
    doKeyDown(13);
  } else {
    doKeyDown(99);
  }
}).bind("touchend touchleave mouseup", function() {
  if (player == 1) {
    keyUp(13);
  } else {
    keyUp(99);
  }
});

// Slide on to buttons
// This makes buttons work by sliding on to them! Unfortunatly the touchenter event doesn't work, so I had to come up with a replacement.
// Only works with a+b buttons. I got some bugs to figure out.
/*document.querySelector('.emu-controls').addEventListener('touchmove', function(e){
  var touch = e.changedTouches[0]
  var touching = document.elementFromPoint(touch.clientX, touch.clientY);
  if (touching.id != currentTouching) {
    currentTouching = touching.id;
    if (touchA == true) {
      touchA = false;
      if (player == 1) {
        keyUp(90);
      } else {
        keyUp(103);
      }
    }
    if (touchB == true) {
      touchB = false;
      if (player == 1) {
        keyUp(88);
      } else {
        keyUp(105);
      }
    }
    /*if (touchUp == true) {
      touchUp = false;
      if (player == 1) {
        keyUp(38);
      } else {
        keyUp(104);
      }
    }
    if (touchDown == true) {
      touchDown = false;
      if (player == 1) {
        keyUp(40);
      } else {
        keyUp(98);
      }
    }
    if (touchLeft == true) {
      touchLeft = false;
      if (player == 1) {
        keyUp(37);
      } else {
        keyUp(100);
      }
    }
    if (touchRight == true) {
      touchRight = false;
      if (player == 1) {
        keyUp(90);
      } else {
        keyUp(103);
      }
    }
    if (touchStart == true) {
      touchStart = false;
      if (player == 1) {
        keyUp(16);
      } else {
        keyUp(97);
      }
    }
    if (touchSelect == true) {
      touchSelect = false;
      if (player == 1) {
        keyUp(13);
      } else {
        keyUp(99);
      }
    }
    if (touching.id == "aBtn" && touchA == false) {
      touchA = true;
      if (player == 1) {
        doKeyDown(90);
      } else {
        doKeyDown(103);
      }
    }
    if (touching.id == "bBtn" && touchB == false) {
      touchB = true;
      if (player == 1) {
        doKeyDown(88);
      } else {
        doKeyDown(105);
      }
    }
    /*if (touching.id == "up" && touchUp == false) {
      touchUp = true;
      touchDown = false;
      if (player == 1) {
        doKeyDown(38);
      } else {
        doKeyDown(104);
      }
    }
    if (touching.id == "down" && touchDown == false) {
      touchDown = true;
      touchUp = false;
      if (player == 1) {
        doKeyDown(40);
      } else {
        doKeyDown(98);
      }
    }
    if (touching.id == "left" && touchLeft == false) {
      touchLeft = true;
      touchRight = false;
      if (player == 1) {
        doKeyDown(37);
      } else {
        doKeyDown(100);
      }
    }
    if (touching.id == "right" && touchRight == false) {
      touchRight = true;
      touchLeft = false;
      if (player == 1) {
        doKeyDown(39);
      } else {
        doKeyDown(102);
      }
    }
    if (touching.id == "startbtn" && touchStart == false) {
      touchStart = true;
      if (player == 1) {
        doKeyDown(16);
      } else {
        doKeyDown(97);
      }
    }
    if (touching.id == "select" && touchSelect == false) {
      touchSelect = true;
      if (player == 1) {
        doKeyDown(13);
      } else {
        doKeyDown(99);
      }
    }
  }
});
document.querySelector('.emu-controls').addEventListener("touchend", function(e){
    currentTouching = "";
});

// buggy disabled stuff
/*document.querySelector('.ab').addEventListener('touchmove', function(e){
  for (var i = 0; i < e.touches.length; i++) {
  var touch = e.touches[i];
  var touching = document.elementFromPoint(touch.clientX, touch.clientY);
  if (touching.id !== currentButton) {
    currentButton = touching.id;
    if (touchA) {
      touchA = false;
      if (player == 1) {
        keyUp(90);
      } else {
        keyUp(103);
      }
    }
    if (touchB) {
      touchB = false;
      if (player == 1) {
        keyUp(88);
      } else {
        keyUp(105);
      }
    }
    if (touchStart) {
      touchStart = false;
      if (player == 1) {
        keyUp(16);
      } else {
        keyUp(97);
      }
    }
    if (touchSelect) {
      touchSelect = false;
      if (player == 1) {
        keyUp(13);
      } else {
        keyUp(99);
      }
    }
    if (touching.id == "aBtn" && touchA == false) {
      touchA = true;
      if (player == 1) {
        doKeyDown(90);
      } else {
        doKeyDown(103);
      }
    }
    if (touching.id == "bBtn" && touchB == false) {
      touchB = true;
      if (player == 1) {
        doKeyDown(88);
      } else {
        doKeyDown(105);
      }
    }
    if (touching.id == "startbtn" && touchStart == false) {
      touchStart = true;
      if (player == 1) {
        doKeyDown(16);
      } else {
        doKeyDown(97);
      }
    }
    if (touching.id == "select" && touchSelect == false) {
      touchSelect = true;
      if (player == 1) {
        doKeyDown(13);
      } else {
        doKeyDown(99);
      }
    }
  }
  }
});
document.querySelector('.ab').addEventListener("touchend", function(e){
    currentButton = "";
});

// UGH. Can't figure out how to use d-pad touchmove without it interrupting the ab buttons, or vice versa. Disabling for now.
document.querySelector('.emu-controls').addEventListener('touchstart touchenter touchup mousedown touchmove', function(e){
  for (var i = 0; i < e.touches.length; i++) {
  var touch = e.touches[i];
  var touching = document.elementFromPoint(touch.clientX, touch.clientY);
  if (touching.id !== currentPad) {
    currentPad = touching.id;
    if (touchUp) {
      touchUp = false;
      if (player == 1) {
        keyUp(38);
      } else {
        keyUp(104);
      }
    }
    if (touchDown) {
      touchDown = false;
      if (player == 1) {
        keyUp(40);
      } else {
        keyUp(98);
      }
    }
    if (touchLeft) {
      touchLeft = false;
      $('.bar').html(1);
      if (player == 1) {
        keyUp(37);
      } else {
        keyUp(100);
      }
    }
    if (touchRight) {
      touchRight = false;
      $('.bar').html(2);
      if (player == 1) {
        keyUp(39);
      } else {
        keyUp(102);
      }
    }
    if (touching.id == "up" && touchUp == false) {
      touchUp = true;
      if (player == 1) {
        doKeyDown(38);
      } else {
        doKeyDown(104);
      }
    } else if (touching.id == "down" && touchDown == false) {
      touchDown = true;
      if (player == 1) {
        doKeyDown(40);
      } else {
        doKeyDown(98);
      }
    } else if (touching.id == "left" && touchLeft == false) {
      touchLeft = true;
      if (player == 1) {
        doKeyDown(37);
      } else {
        doKeyDown(100);
      }
    } else if (touching.id == "right" && touchRight == false) {
      touchRight = true;
      if (player == 1) {
        doKeyDown(39);
      } else {
        doKeyDown(102);
      }
    }
  }
  }
});
document.querySelector('.emu-controls').addEventListener("touchend mouseleave touchup", function(e){
  if (touchUp) {
      touchUp = false;
      if (player == 1) {
        keyUp(38);
      } else {
        keyUp(104);
      }
    }
    if (touchDown) {
      touchDown = false;
      if (player == 1) {
        keyUp(40);
      } else {
        keyUp(98);
      }
    }
    if (touchLeft) {
      touchLeft = false;
      $('.bar').html(1);
      if (player == 1) {
        keyUp(37);
      } else {
        keyUp(100);
      }
    }
    if (touchRight) {
      touchRight = false;
      $('.bar').html(2);
      if (player == 1) {
        keyUp(39);
      } else {
        keyUp(102);
      }
    }
    currentPad = "";
});*/