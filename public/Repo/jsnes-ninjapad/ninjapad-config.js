var DEBUG = false;
var DEADZONE = 2;
var DISPLAY = "emu-canvas";
var SCREEN = "emu-screen";
var EMULATOR = "jsnes";
var SINGLE_ROM = true;
var DEFAULT_ROM = JSON.parse(new URLSearchParams(window.location.hash).get('#')).RomUrl;
