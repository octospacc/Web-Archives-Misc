/* eslint-disable indent */
"use strict";
/*
 Copyright (C) 2012-2014 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function getInt8Array(size_t) {
	try {
		return new Int8Array(size_t);
	} catch (error) {
		return getArray(size_t);
	}
}

function getUint8Array(size_t) {
	try {
		return new Uint8Array(size_t);
	} catch (error) {
		return getArray(size_t);
	}
}

function getInt16Array(size_t) {
	try {
		return new Int16Array(size_t);
	} catch (error) {
		return getArray(size_t);
	}
}

function getUint16Array(size_t) {
	try {
		return new Uint16Array(size_t);
	} catch (error) {
		return getArray(size_t);
	}
}

function getUint16View(typed_array) {
	try {
		return new Uint16Array(typed_array.buffer);
	} catch (error) {
		return null;
	}
}

function getInt32Array(size_t) {
	try {
		return new Int32Array(size_t);
	} catch (error) {
		return getArray(size_t);
	}
}

function getInt32View(typed_array) {
	try {
		return new Int32Array(typed_array.buffer);
	} catch (error) {
		return null;
	}
}

function getInt32ViewCustom(typed_array, start, end) {
	try {
		return typed_array.subarray(start, end);
	} catch (error) {
		try {
			//Nightly Firefox 4 used to have the subarray function named as slice:
			return typed_array.slice(start, end);
		} catch (error) {
			return null;
		}
	}
}

function getUint32Array(size_t) {
	try {
		return new Uint32Array(size_t);
	} catch (error) {
		return getArray(size_t);
	}
}

function getFloat32Array(size_t) {
	try {
		return new Float32Array(size_t);
	} catch (error) {
		return getArray(size_t);
	}
}

function getArray(size_t) {
	var genericArray = [];
	for (var size_index = 0; size_index < size_t; ++size_index) {
		genericArray[size_index] = 0;
	}
	return genericArray;
}
var __VIEWS_SUPPORTED__ = getUint16View(getInt32Array(1)) !== null;
var __LITTLE_ENDIAN__ = (function () {
	if (__VIEWS_SUPPORTED__) {
		var test = getInt32Array(1);
		test[0] = 1;
		var test2 = getUint16View(test);
		if (test2[0] == 1) {
			return true;
		}
	}
	return false;
})();




"use strict";
/*
 Copyright (C) 2012-2014 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceCartridge(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceCartridge.prototype.initialize = function () {
	this.flash_is128 = false;
	this.flash_isAtmel = false;
	this.ROM = this.getROMArray(this.IOCore.ROM);
	this.ROM16 = getUint16View(this.ROM);
	this.ROM32 = getInt32View(this.ROM);
	this.decodeName();
	this.decodeFlashType();
}
GameBoyAdvanceCartridge.prototype.getROMArray = function (old_array) {
	this.ROMLength = Math.min((old_array.length >> 2) << 2, 0x2000000);
	this.EEPROMStart = ((this.ROMLength | 0) > 0x1000000) ? Math.max(this.ROMLength | 0, 0x1FFFF00) : 0x1000000;
	var newArray = getUint8Array(this.ROMLength | 0);
	for (var index = 0;
		(index | 0) < (this.ROMLength | 0); index = ((index | 0) + 1) | 0) {
		newArray[index | 0] = old_array[index | 0] | 0;
	}
	return newArray;
}
GameBoyAdvanceCartridge.prototype.decodeName = function () {
	this.name = "GUID_";
	if ((this.ROMLength | 0) >= 0xC0) {
		for (var address = 0xAC;
			(address | 0) < 0xB3; address = ((address | 0) + 1) | 0) {
			if ((this.ROM[address | 0] | 0) > 0) {
				this.name += String.fromCharCode(this.ROM[address | 0] | 0);
			} else {
				this.name += "_";
			}
		}
	}
}
GameBoyAdvanceCartridge.prototype.decodeFlashType = function () {
	this.flash_is128 = false;
	this.flash_isAtmel = false;
	var flash_types = 0;
	var F = ("F").charCodeAt(0) & 0xFF;
	var L = ("L").charCodeAt(0) & 0xFF;
	var A = ("A").charCodeAt(0) & 0xFF;
	var S = ("S").charCodeAt(0) & 0xFF;
	var H = ("H").charCodeAt(0) & 0xFF;
	var underScore = ("_").charCodeAt(0) & 0xFF;
	var five = ("5").charCodeAt(0) & 0xFF;
	var one = ("1").charCodeAt(0) & 0xFF;
	var two = ("2").charCodeAt(0) & 0xFF;
	var M = ("M").charCodeAt(0) & 0xFF;
	var V = ("V").charCodeAt(0) & 0xFF;
	var length = ((this.ROM.length | 0) - 12) | 0;
	for (var index = 0;
		(index | 0) < (length | 0); index = ((index | 0) + 4) | 0) {
		if ((this.ROM[index | 0] | 0) == (F | 0)) {
			if ((this.ROM[index | 1] | 0) == (L | 0)) {
				if ((this.ROM[index | 2] | 0) == (A | 0)) {
					if ((this.ROM[index | 3] | 0) == (S | 0)) {
						var tempIndex = ((index | 0) + 4) | 0;
						if ((this.ROM[tempIndex | 0] | 0) == (H | 0)) {
							if ((this.ROM[tempIndex | 1] | 0) == (underScore | 0)) {
								if ((this.ROM[tempIndex | 2] | 0) == (V | 0)) {
									flash_types |= 1;
								}
							} else if ((this.ROM[tempIndex | 1] | 0) == (five | 0)) {
								if ((this.ROM[tempIndex | 2] | 0) == (one | 0)) {
									if ((this.ROM[tempIndex | 3] | 0) == (two | 0)) {
										tempIndex = ((tempIndex | 0) + 4) | 0;
										if ((this.ROM[tempIndex | 0] | 0) == (underScore | 0)) {
											if ((this.ROM[tempIndex | 1] | 0) == (V | 0)) {
												flash_types |= 2;
											}
										}
									}
								}
							} else if ((this.ROM[tempIndex | 1] | 0) == (one | 0)) {
								if ((this.ROM[tempIndex | 2] | 0) == (M | 0)) {
									if ((this.ROM[tempIndex | 3] | 0) == (underScore | 0)) {
										tempIndex = ((tempIndex | 0) + 4) | 0;
										if ((this.ROM[tempIndex | 0] | 0) == (V | 0)) {
											flash_types |= 4;
											break;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	this.flash_is128 = ((flash_types | 0) >= 4);
	this.flash_isAtmel = ((flash_types | 0) <= 1);
}
GameBoyAdvanceCartridge.prototype.readROMOnly8 = function (address) {
	address = address | 0;
	var data = 0;
	if ((address | 0) < (this.ROMLength | 0)) {
		data = this.ROM[address & 0x1FFFFFF] | 0;
	}
	return data | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceCartridge.prototype.readROMOnly16 = function (address) {
		address = address | 0;
		var data = 0;
		if ((address | 0) < (this.ROMLength | 0)) {
			data = this.ROM16[(address >> 1) & 0xFFFFFF] | 0;
		}
		return data | 0;
	}
	GameBoyAdvanceCartridge.prototype.readROMOnly32 = function (address) {
		address = address | 0;
		var data = 0;
		if ((address | 0) < (this.ROMLength | 0)) {
			data = this.ROM32[(address >> 2) & 0x7FFFFF] | 0;
		}
		return data | 0;
	}
} else {
	GameBoyAdvanceCartridge.prototype.readROMOnly16 = function (address) {
		address = address | 0;
		var data = 0;
		if ((address | 0) < (this.ROMLength | 0)) {
			data = this.ROM[address] | (this.ROM[address | 1] << 8);
		}
		return data | 0;
	}
	GameBoyAdvanceCartridge.prototype.readROMOnly32 = function (address) {
		address = address | 0;
		var data = 0;
		if ((address | 0) < (this.ROMLength | 0)) {
			data = this.ROM[address] | (this.ROM[address | 1] << 8) | (this.ROM[address | 2] << 16) | (this.ROM[address | 3] << 24);
		}
		return data | 0;
	}
}
GameBoyAdvanceCartridge.prototype.readROM8 = function (address) {
	address = address | 0;
	var data = 0;
	if ((address | 0) > 0xC9) {
		//Definitely ROM:
		data = this.readROMOnly8(address | 0) | 0;
	} else {
		//Possibly GPIO:
		data = this.IOCore.saves.readGPIO8(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM16 = function (address) {
	address = address | 0;
	var data = 0;
	if ((address | 0) > 0xC9) {
		//Definitely ROM:
		data = this.readROMOnly16(address | 0) | 0;
	} else {
		//Possibly GPIO:
		data = this.IOCore.saves.readGPIO16(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM32 = function (address) {
	address = address | 0;
	var data = 0;
	if ((address | 0) > 0xC9) {
		//Definitely ROM:
		data = this.readROMOnly32(address | 0) | 0;
	} else {
		//Possibly GPIO:
		data = this.IOCore.saves.readGPIO32(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM8Space2 = function (address) {
	address = address | 0;
	var data = 0;
	if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
		//Possibly GPIO:
		data = this.IOCore.saves.readGPIO8(address | 0) | 0;
	} else if ((address | 0) >= (this.EEPROMStart | 0)) {
		//Possibly EEPROM:
		data = this.IOCore.saves.readEEPROM8(address | 0) | 0;
	} else {
		//Definitely ROM:
		data = this.readROMOnly8(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM16Space2 = function (address) {
	address = address | 0;
	var data = 0;
	if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
		//Possibly GPIO:
		data = this.IOCore.saves.readGPIO16(address | 0) | 0;
	} else if ((address | 0) >= (this.EEPROMStart | 0)) {
		//Possibly EEPROM:
		data = this.IOCore.saves.readEEPROM16(address | 0) | 0;
	} else {
		//Definitely ROM:
		data = this.readROMOnly16(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceCartridge.prototype.readROM32Space2 = function (address) {
	address = address | 0;
	var data = 0;
	if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
		//Possibly GPIO:
		data = this.IOCore.saves.readGPIO32(address | 0) | 0;
	} else if ((address | 0) >= (this.EEPROMStart | 0)) {
		//Possibly EEPROM:
		data = this.IOCore.saves.readEEPROM32(address | 0) | 0;
	} else {
		//Definitely ROM:
		data = this.readROMOnly32(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceCartridge.prototype.writeROM8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
		//GPIO Chip (RTC):
		this.IOCore.saves.writeGPIO8(address | 0, data | 0);
	}
}
GameBoyAdvanceCartridge.prototype.writeROM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
		//GPIO Chip (RTC):
		this.IOCore.saves.writeGPIO16(address | 0, data | 0);
	}
}
GameBoyAdvanceCartridge.prototype.writeROM16DMA = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
		//GPIO Chip (RTC):
		this.IOCore.saves.writeGPIO16(address | 0, data | 0);
	} else if ((address | 0) >= (this.EEPROMStart | 0)) {
		//Possibly EEPROM:
		this.IOCore.saves.writeEEPROM16(address | 0, data | 0);
	}
}
GameBoyAdvanceCartridge.prototype.writeROM32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((address | 0) >= 0xC4 && (address | 0) < 0xCA) {
		//GPIO Chip (RTC):
		this.IOCore.saves.writeGPIO32(address | 0, data | 0);
	}
}
GameBoyAdvanceCartridge.prototype.nextIRQEventTime = function () {
	//Nothing yet implement that would fire an IRQ:
	return 0x7FFFFFFF;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceDMA(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceDMA.prototype.initialize = function () {
	this.dmaChannel0 = this.IOCore.dmaChannel0;
	this.dmaChannel1 = this.IOCore.dmaChannel1;
	this.dmaChannel2 = this.IOCore.dmaChannel2;
	this.dmaChannel3 = this.IOCore.dmaChannel3;
	this.currentMatch = -1;
	this.fetch = 0;
}
GameBoyAdvanceDMA.prototype.getCurrentFetchValue = function () {
	return this.fetch | 0;
}
GameBoyAdvanceDMA.prototype.gfxHBlankRequest = function () {
	//Pass H-Blank signal to all DMA channels:
	this.requestDMA(0x4);
}
GameBoyAdvanceDMA.prototype.gfxVBlankRequest = function () {
	//Pass V-Blank signal to all DMA channels:
	this.requestDMA(0x2);
}
GameBoyAdvanceDMA.prototype.requestDMA = function (DMAType) {
	DMAType = DMAType | 0;
	this.dmaChannel0.requestDMA(DMAType | 0);
	this.dmaChannel1.requestDMA(DMAType | 0);
	this.dmaChannel2.requestDMA(DMAType | 0);
	this.dmaChannel3.requestDMA(DMAType | 0);
}
GameBoyAdvanceDMA.prototype.findLowestDMA = function () {
	if ((this.dmaChannel0.getMatchStatus() | 0) != 0) {
		return 0;
	}
	if ((this.dmaChannel1.getMatchStatus() | 0) != 0) {
		return 1;
	}
	if ((this.dmaChannel2.getMatchStatus() | 0) != 0) {
		return 2;
	}
	if ((this.dmaChannel3.getMatchStatus() | 0) != 0) {
		return 3;
	}
	return 4;
}
GameBoyAdvanceDMA.prototype.update = function () {
	var lowestDMAFound = this.findLowestDMA();
	if ((lowestDMAFound | 0) < 4) {
		//Found an active DMA:
		if ((this.currentMatch | 0) == -1) {
			this.IOCore.flagDMA();
		}
		if ((this.currentMatch | 0) != (lowestDMAFound | 0)) {
			//Re-broadcasting on address bus, so non-seq:
			this.IOCore.wait.NonSequentialBroadcast();
			this.currentMatch = lowestDMAFound | 0;
		}
	} else if ((this.currentMatch | 0) != -1) {
		//No active DMA found:
		this.currentMatch = -1;
		this.IOCore.deflagDMA();
		this.IOCore.updateCoreSpill();
	}
}
GameBoyAdvanceDMA.prototype.perform = function () {
	//Call the correct channel to process:
	switch (this.currentMatch | 0) {
		case 0:
			this.dmaChannel0.handleDMACopy();
			break;
		case 1:
			this.dmaChannel1.handleDMACopy();
			break;
		case 2:
			this.dmaChannel2.handleDMACopy();
			break;
		default:
			this.dmaChannel3.handleDMACopy();
	}
}
GameBoyAdvanceDMA.prototype.updateFetch = function (data) {
	data = data | 0;
	this.fetch = data | 0;
}
GameBoyAdvanceDMA.prototype.nextEventTime = function () {
	var clocks = Math.min(this.dmaChannel0.nextEventTime() | 0, this.dmaChannel1.nextEventTime() | 0, this.dmaChannel2.nextEventTime() | 0, this.dmaChannel3.nextEventTime() | 0) | 0;
	return clocks | 0;
}




"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceEmulator() {
	this.settings = {
		"SKIPBoot": true, //Skip the BIOS boot screen.
		"audioVolume": 1, //Starting audio volume.
		"audioBufferUnderrunLimit": 8, //Audio buffer minimum span amount over x interpreter iterations.
		"audioBufferDynamicLimit": 2, //Audio buffer dynamic minimum span amount over x interpreter iterations.
		"audioBufferSize": 20, //Audio buffer maximum span amount over x interpreter iterations.
		"timerIntervalRate": 16, //How often the emulator core is called into (in milliseconds).
		"emulatorSpeed": 1, //Speed multiplier of the emulator.
		"metricCollectionMinimum": 30, //How many cycles to collect before determining speed.
		"dynamicSpeed": true //Whether to actively change the target speed for best user experience.
	}
	this.audioFound = false; //Do we have audio output sink found yet?
	this.loaded = false; //Did we initialize IodineGBA?
	this.faultFound = false; //Did we run into a fatal error?
	this.paused = true; //Are we paused?
	this.offscreenWidth = 240; //Width of the GBA screen.
	this.offscreenHeight = 160; //Height of the GBA screen.
	this.BIOS = []; //Initialize BIOS as not existing.
	this.ROM = []; //Initialize BIOS as not existing.
	//Cache some frame buffer lengths:
	this.offscreenRGBCount = ((this.offscreenWidth | 0) * (this.offscreenHeight | 0) * 3) | 0;
	//Graphics buffers to generate in advance:
	this.frameBuffer = getInt32Array(this.offscreenRGBCount | 0); //The internal buffer to composite to.
	this.swizzledFrame = getUint8Array(this.offscreenRGBCount | 0); //The swizzled output buffer that syncs to the internal framebuffer on v-blank.
	this.audioUpdateState = false; //Do we need to update the sound core with new info?
	this.saveExportHandler = null; //Save export handler attached by GUI.
	this.saveImportHandler = null; //Save import handler attached by GUI.
	this.speedCallback = null; //Speed report handler attached by GUI.
	this.graphicsFrameCallback = null; //Graphics blitter handler attached by GUI.
	this.clockCyclesSinceStart = 0; //Clocking hueristics reference
	this.metricCollectionCounted = 0; //Clocking hueristics reference
	this.metricStart = null; //Date object reference.
	this.dynamicSpeedCounter = 0; //Rate limiter counter for dynamic speed.
	this.audioNumSamplesTotal = 0; //Buffer size.
	this.calculateTimings(); //Calculate some multipliers against the core emulator timer.
	this.generateCoreExposed(); //Generate a limit API for the core to call this shell object.
}
GameBoyAdvanceEmulator.prototype.generateCoreExposed = function () {
	var parentObj = this;
	this.coreExposed = {
		"outputAudio": function (l, r) {
			parentObj.outputAudio(l, r);
		},
		"frameBuffer": parentObj.frameBuffer,
		"prepareFrame": function () {
			parentObj.prepareFrame();
		}
	}
}
GameBoyAdvanceEmulator.prototype.play = function () {
	if (this.paused) {
		this.startTimer();
		this.paused = false;
		if (!this.loaded && this.BIOS && this.ROM) {
			this.initializeCore();
			this.loaded = true;
			this.importSave();
		}
	}
}
GameBoyAdvanceEmulator.prototype.pause = function () {
	if (!this.paused) {
		this.clearTimer();
		if (eclipseemu.data.currentCore.game != null) {
			this.exportSave(eclipseemu.data.currentCore.game.id);
		} else {
			this.exportSave();
		}
		this.paused = true;
	}
}
GameBoyAdvanceEmulator.prototype.stop = function () {
	this.faultFound = false;
	this.loaded = false;
	this.audioUpdateState = this.audioFound;
	this.pause();
}
GameBoyAdvanceEmulator.prototype.restart = function () {
	if (this.loaded) {
		this.faultFound = false;
		if (eclipseemu.data.currentCore.game != null) {
			this.exportSave(eclipseemu.data.currentCore.game.id);
		} else {
			this.exportSave();
		}
		this.initializeCore();
		this.importSave();
		this.audioUpdateState = this.audioFound;
		this.setSpeed(1);
	}
}
GameBoyAdvanceEmulator.prototype.clearTimer = function () {
	clearInterval(this.timer);
	this.resetMetrics();
}
GameBoyAdvanceEmulator.prototype.startTimer = function () {
	this.clearTimer();
	var parentObj = this;
	this.timer = setInterval(function () {
		parentObj.timerCallback()
	}, this.settings.timerIntervalRate);
}
GameBoyAdvanceEmulator.prototype.timerCallback = function () {
	//Check to see if web view is not hidden, if hidden don't run due to JS timers being inaccurate on page hide:
	if (!document.hidden && !document.msHidden && !document.mozHidden && !document.webkitHidden) {
		if (!this.faultFound && this.loaded) { //Any error pending or no ROM loaded is a show-stopper!
			this.iterationStartSequence(); //Run start of iteration stuff.
			this.IOCore.enter(this.CPUCyclesTotal | 0); //Step through the emulation core loop.
			this.iterationEndSequence(); //Run end of iteration stuff.
		} else {
			this.pause(); //Some pending error is preventing execution, so pause.
		}
	}
}
GameBoyAdvanceEmulator.prototype.iterationStartSequence = function () {
	this.calculateSpeedPercentage(); //Calculate the emulator realtime run speed heuristics.
	this.faultFound = true; //If the end routine doesn't unset this, then we are marked as having crashed.
	this.audioUnderrunAdjustment(); //If audio is enabled, look to see how much we should overclock by to maintain the audio buffer.
	this.audioPushNewState(); //Check to see if we need to update the audio core for any output changes.
}
GameBoyAdvanceEmulator.prototype.iterationEndSequence = function () {
	this.faultFound = false; //If core did not throw while running, unset the fatal error flag.
	this.clockCyclesSinceStart = ((this.clockCyclesSinceStart | 0) + (this.CPUCyclesTotal | 0)) | 0; //Accumulate tracking.
}
GameBoyAdvanceEmulator.prototype.attachROM = function (ROM) {
	this.stop();
	this.ROM = ROM;
}
GameBoyAdvanceEmulator.prototype.attachBIOS = function (BIOS) {
	this.stop();
	this.BIOS = BIOS;
}
GameBoyAdvanceEmulator.prototype.getGameName = function () {
	if (!this.faultFound && this.loaded) {
		return this.IOCore.cartridge.name;
	} else {
		return "";
	}
}
GameBoyAdvanceEmulator.prototype.attachSaveExportHandler = function (handler) {
	if (typeof handler == "function") {
		this.saveExportHandler = handler;
	}
}
GameBoyAdvanceEmulator.prototype.attachSaveImportHandler = function (handler) {
	if (typeof handler == "function") {
		this.saveImportHandler = handler;
	}
}
GameBoyAdvanceEmulator.prototype.attachSpeedHandler = function (handler) {
	if (typeof handler == "function") {
		this.speedCallback = handler;
	}
}
GameBoyAdvanceEmulator.prototype.importSave = function (game_id) {
	if (this.saveImportHandler) {
		var name = this.getGameName();
		if (name != "") {
			var save = this.saveImportHandler(name, game_id);
			var saveType = this.saveImportHandler("TYPE_" + name, game_id);
			if (save && saveType && !this.faultFound && this.loaded) {
				var length = save.length | 0;
				var convertedSave = getUint8Array(length | 0);
				if ((length | 0) > 0) {
					for (var index = 0;
						(index | 0) < (length | 0); index = ((index | 0) + 1) | 0) {
						convertedSave[index | 0] = save[index | 0] & 0xFF;
					}
					this.IOCore.saves.importSave(convertedSave, saveType | 0);
				}
			}
		}
	}
}
GameBoyAdvanceEmulator.prototype.exportSave = function (game_id) {
	if (this.saveExportHandler && !this.faultFound && this.loaded) {
		var save = this.IOCore.saves.exportSave();
		var saveType = this.IOCore.saves.exportSaveType();
		if (save != null && saveType != null) {
			this.saveExportHandler(this.IOCore.cartridge.name, save, game_id);
			this.saveExportHandler("TYPE_" + this.IOCore.cartridge.name, saveType | 0, game_id);
		}
	}
}
GameBoyAdvanceEmulator.prototype.setSpeed = function (speed) {
	var speed = Math.min(Math.max(parseFloat(speed), 0.01), 10);
	this.resetMetrics();
	if (speed != this.settings.emulatorSpeed) {
		this.settings.emulatorSpeed = speed;
		this.calculateTimings();
		this.reinitializeAudio();
	}
}
GameBoyAdvanceEmulator.prototype.incrementSpeed = function (delta) {
	this.setSpeed(parseFloat(delta) + this.settings.emulatorSpeed);
}
GameBoyAdvanceEmulator.prototype.getSpeed = function (speed) {
	return this.settings.emulatorSpeed;
}
GameBoyAdvanceEmulator.prototype.changeCoreTimer = function (newTimerIntervalRate) {
	this.settings.timerIntervalRate = Math.max(parseInt(newTimerIntervalRate, 10), 1);
	if (!this.paused) { //Set up the timer again if running.
		this.clearTimer();
		this.startTimer();
	}
	this.calculateTimings();
	this.reinitializeAudio();
}
GameBoyAdvanceEmulator.prototype.resetMetrics = function () {
	this.clockCyclesSinceStart = 0;
	this.metricCollectionCounted = 0;
	this.metricStart = new Date();
}
GameBoyAdvanceEmulator.prototype.calculateTimings = function () {
	this.clocksPerSecond = this.settings.emulatorSpeed * 0x1000000;
	this.CPUCyclesTotal = this.CPUCyclesPerIteration = (this.clocksPerSecond / 1000 * this.settings.timerIntervalRate) | 0;
	this.dynamicSpeedCounter = 0;
}
GameBoyAdvanceEmulator.prototype.calculateSpeedPercentage = function () {
	if (this.metricStart) {
		if ((this.metricCollectionCounted | 0) >= (this.settings.metricCollectionMinimum | 0)) {
			if (this.speedCallback) {
				var metricEnd = new Date();
				var timeDiff = Math.max(metricEnd.getTime() - this.metricStart.getTime(), 1);
				var result = ((this.settings.timerIntervalRate * (this.clockCyclesSinceStart | 0) / timeDiff) / (this.CPUCyclesPerIteration | 0)) * 100;
				this.speedCallback(result.toFixed(2) + "%");
			}
			this.resetMetrics();
		}
	} else {
		this.resetMetrics();
	}
	this.metricCollectionCounted = ((this.metricCollectionCounted | 0) + 1) | 0;
}
GameBoyAdvanceEmulator.prototype.initializeCore = function () {
	//Setup a new instance of the i/o core:
	this.IOCore = new GameBoyAdvanceIO(this.settings, this.coreExposed, this.BIOS, this.ROM);
}
GameBoyAdvanceEmulator.prototype.keyDown = function (keyPressed) {
	keyPressed = keyPressed | 0;
	if (!this.paused && (keyPressed | 0) >= 0 && (keyPressed | 0) <= 9) {
		this.IOCore.joypad.keyPress(keyPressed | 0);
	}
}
GameBoyAdvanceEmulator.prototype.keyUp = function (keyReleased) {
	keyReleased = keyReleased | 0;
	if (!this.paused && (keyReleased | 0) >= 0 && (keyReleased | 0) <= 9) {
		this.IOCore.joypad.keyRelease(keyReleased | 0);
	}
}
GameBoyAdvanceEmulator.prototype.attachGraphicsFrameHandler = function (handler) {
	if (typeof handler == "function") {
		this.graphicsFrameCallback = handler;
	}
}
GameBoyAdvanceEmulator.prototype.attachAudioHandler = function (mixerInputHandler) {
	if (mixerInputHandler) {
		this.audio = mixerInputHandler;
	}
}
GameBoyAdvanceEmulator.prototype.swizzleFrameBuffer = function () {
	//Convert our dirty 15-bit (15-bit, with internal render flags above it) framebuffer to an 8-bit buffer with separate indices for the RGB channels:
	var bufferIndex = 0;
	for (var canvasIndex = 0;
		(canvasIndex | 0) < (this.offscreenRGBCount | 0); bufferIndex = ((bufferIndex | 0) + 1) | 0) {
		this.swizzledFrame[canvasIndex | 0] = (this.frameBuffer[bufferIndex | 0] & 0x1F) << 3; //Red
		canvasIndex = ((canvasIndex | 0) + 1) | 0;
		this.swizzledFrame[canvasIndex | 0] = (this.frameBuffer[bufferIndex | 0] & 0x3E0) >> 2; //Green
		canvasIndex = ((canvasIndex | 0) + 1) | 0;
		this.swizzledFrame[canvasIndex | 0] = (this.frameBuffer[bufferIndex | 0] & 0x7C00) >> 7; //Blue
		canvasIndex = ((canvasIndex | 0) + 1) | 0;
	}
}
GameBoyAdvanceEmulator.prototype.prepareFrame = function () {
	//Copy the internal frame buffer to the output buffer:
	this.swizzleFrameBuffer();
	this.requestDraw();
}
GameBoyAdvanceEmulator.prototype.requestDraw = function () {
	if (this.graphicsFrameCallback) {
		//We actually updated the graphics internally, so copy out:
		this.graphicsFrameCallback(this.swizzledFrame);
	}
}
GameBoyAdvanceEmulator.prototype.enableAudio = function () {
	if (!this.audioFound && this.audio) {
		//Calculate the variables for the preliminary downsampler first:
		this.audioResamplerFirstPassFactor = Math.max(Math.min(Math.floor(this.clocksPerSecond / 44100), Math.floor(0x7FFFFFFF / 0x3FF)), 1);
		this.audioDownSampleInputDivider = (2 / 0x3FF) / this.audioResamplerFirstPassFactor;
		this.audioSetState(true); //Set audio to 'found' by default.
		//Attempt to enable audio:
		var parentObj = this;
		this.audio.initialize(2, this.clocksPerSecond / this.audioResamplerFirstPassFactor, Math.max((this.CPUCyclesPerIteration | 0) * this.settings.audioBufferSize / this.audioResamplerFirstPassFactor, 8192) << 1, this.settings.audioVolume, function () {
			//Disable audio in the callback here:
			parentObj.disableAudio();
		});
		this.audio.register();
		if (this.audioFound) {
			//Only run this if audio was found to save memory on disabled output:
			this.initializeAudioBuffering();
		}
	}
}
GameBoyAdvanceEmulator.prototype.disableAudio = function () {
	if (this.audioFound) {
		this.audio.unregister();
		this.audioSetState(false);
		this.calculateTimings(); //Re-Fix timing if it was adjusted by our audio code.
	}
}
GameBoyAdvanceEmulator.prototype.initializeAudioBuffering = function () {
	this.audioDestinationPosition = 0;
	this.audioBufferContainAmount = Math.max((this.CPUCyclesPerIteration | 0) * (this.settings.audioBufferUnderrunLimit | 0) / this.audioResamplerFirstPassFactor, 4096) << 1;
	this.audioBufferDynamicContainAmount = Math.max((this.CPUCyclesPerIteration | 0) * (this.settings.audioBufferDynamicLimit | 0) / this.audioResamplerFirstPassFactor, 2048) << 1;
	var audioNumSamplesTotal = Math.max((this.CPUCyclesPerIteration | 0) / this.audioResamplerFirstPassFactor, 1) << 1;
	if ((audioNumSamplesTotal | 0) != (this.audioNumSamplesTotal | 0)) {
		this.audioNumSamplesTotal = audioNumSamplesTotal | 0;
		this.audioBuffer = getFloat32Array(this.audioNumSamplesTotal | 0);
	}
}
GameBoyAdvanceEmulator.prototype.changeVolume = function (newVolume) {
	this.settings.audioVolume = Math.min(Math.max(parseFloat(newVolume), 0), 1);
	if (this.audioFound) {
		this.audio.changeVolume(this.settings.audioVolume);
	}
}
GameBoyAdvanceEmulator.prototype.incrementVolume = function (delta) {
	this.changeVolume(parseFloat(delta) + this.settings.audioVolume);
}
GameBoyAdvanceEmulator.prototype.outputAudio = function (downsampleInputLeft, downsampleInputRight) {
	downsampleInputLeft = downsampleInputLeft | 0;
	downsampleInputRight = downsampleInputRight | 0;
	this.audioBuffer[this.audioDestinationPosition | 0] = (downsampleInputLeft * this.audioDownSampleInputDivider) - 1;
	this.audioDestinationPosition = ((this.audioDestinationPosition | 0) + 1) | 0;
	this.audioBuffer[this.audioDestinationPosition | 0] = (downsampleInputRight * this.audioDownSampleInputDivider) - 1;
	this.audioDestinationPosition = ((this.audioDestinationPosition | 0) + 1) | 0;
	if ((this.audioDestinationPosition | 0) == (this.audioNumSamplesTotal | 0)) {
		this.audio.push(this.audioBuffer);
		this.audioDestinationPosition = 0;
	}
}
GameBoyAdvanceEmulator.prototype.audioUnderrunAdjustment = function () {
	this.CPUCyclesTotal = this.CPUCyclesPerIteration | 0;
	if (this.audioFound) {
		var remainingAmount = this.audio.remainingBuffer();
		if (typeof remainingAmount == "number") {
			remainingAmount = Math.max(remainingAmount | 0, 0) | 0;
			var underrunAmount = ((this.audioBufferContainAmount | 0) - (remainingAmount | 0)) | 0;
			if ((underrunAmount | 0) > 0) {
				if (this.settings.dynamicSpeed) {
					if ((this.dynamicSpeedCounter | 0) > (this.settings.metricCollectionMinimum | 0)) {
						if (((this.audioBufferDynamicContainAmount | 0) - (remainingAmount | 0)) > 0) {
							var speed = this.getSpeed();
							speed = Math.max(speed - 0.1, 0.1);
							this.setSpeed(speed);
						} else {
							this.dynamicSpeedCounter = this.settings.metricCollectionMinimum | 0;
						}
					}
					this.dynamicSpeedCounter = ((this.dynamicSpeedCounter | 0) + 1) | 0;
				}
				this.CPUCyclesTotal = Math.min(((this.CPUCyclesTotal | 0) + ((underrunAmount >> 1) * this.audioResamplerFirstPassFactor)) | 0, this.CPUCyclesTotal << 1, 0x7FFFFFFF) | 0;
			} else if (this.settings.dynamicSpeed) {
				if ((this.dynamicSpeedCounter | 0) > (this.settings.metricCollectionMinimum | 0)) {
					var speed = this.getSpeed();
					if (speed < 1) {
						speed = Math.min(speed + 0.05, 1);
						this.setSpeed(speed);
					} else {
						this.dynamicSpeedCounter = this.settings.metricCollectionMinimum | 0;
					}
				}
				this.dynamicSpeedCounter = ((this.dynamicSpeedCounter | 0) + 1) | 0;
			}
		}
	}
}
GameBoyAdvanceEmulator.prototype.audioPushNewState = function () {
	if (this.audioUpdateState) {
		this.IOCore.sound.initializeOutput(this.audioFound, this.audioResamplerFirstPassFactor);
		this.audioUpdateState = false;
	}
}
GameBoyAdvanceEmulator.prototype.audioSetState = function (audioFound) {
	if (this.audioFound != audioFound) {
		this.audioFound = audioFound;
		this.audioUpdateState = true;
	}
}
GameBoyAdvanceEmulator.prototype.reinitializeAudio = function () {
	if (this.audioFound) { //Set up the audio again if enabled.
		this.disableAudio();
		this.enableAudio();
	}
}
GameBoyAdvanceEmulator.prototype.enableSkipBootROM = function () {
	this.settings.SKIPBoot = true;
}
GameBoyAdvanceEmulator.prototype.disableSkipBootROM = function () {
	this.settings.SKIPBoot = false;
}
GameBoyAdvanceEmulator.prototype.enableDynamicSpeed = function () {
	this.settings.dynamicSpeed = true;
}
GameBoyAdvanceEmulator.prototype.disableDynamicSpeed = function () {
	this.settings.dynamicSpeed = false;
	this.setSpeed(1);
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceGraphics(IOCore) {
	//Build references:
	this.IOCore = IOCore;
}
GameBoyAdvanceGraphics.prototype.initialize = function () {
	this.gfxRenderer = this.IOCore.gfxRenderer;
	this.dma = this.IOCore.dma;
	this.dmaChannel3 = this.IOCore.dmaChannel3;
	this.irq = this.IOCore.irq;
	this.wait = this.IOCore.wait;
	this.initializeState();
}
GameBoyAdvanceGraphics.prototype.initializeState = function () {
	//Initialize Pre-Boot:
	this.renderedScanLine = false;
	this.statusFlags = 0;
	this.IRQFlags = 0;
	this.VCounter = 0;
	this.currentScanLine = 0;
	this.LCDTicks = 0;
	if (!this.IOCore.BIOSFound || this.IOCore.settings.SKIPBoot) {
		//BIOS entered the ROM at line 0x7C:
		this.currentScanLine = 0x7C;
	}
}
GameBoyAdvanceGraphics.prototype.addClocks = function (clocks) {
	clocks = clocks | 0;
	//Call this when clocking the state some more:
	this.LCDTicks = ((this.LCDTicks | 0) + (clocks | 0)) | 0;
	this.clockLCDState();
}
GameBoyAdvanceGraphics.prototype.clockLCDState = function () {
	if ((this.LCDTicks | 0) >= 960) {
		this.clockScanLine(); //Line finishes drawing at clock 960.
		this.clockLCDStatePostRender(); //Check for hblank and clocking into next line.
	}
}
GameBoyAdvanceGraphics.prototype.clockScanLine = function () {
	if (!this.renderedScanLine) { //If we rendered the scanline, don't run this again.
		this.renderedScanLine = true; //Mark rendering.
		if ((this.currentScanLine | 0) < 160) {
			this.gfxRenderer.incrementScanLineQueue(); //Tell the gfx JIT to queue another line to draw.
		}
	}
}
GameBoyAdvanceGraphics.prototype.clockLCDStatePostRender = function () {
	if ((this.LCDTicks | 0) >= 1006) {
		//HBlank Event Occurred:
		this.updateHBlank();
		if ((this.LCDTicks | 0) >= 1232) {
			//Clocking to next line occurred:
			this.clockLCDNextLine();
		}
	}
}
GameBoyAdvanceGraphics.prototype.clockLCDNextLine = function () {
	/*We've now overflowed the LCD scan line state machine counter,
	 which tells us we need to be on a new scan-line and refresh over.*/
	this.renderedScanLine = false; //Unmark line render.
	this.statusFlags = this.statusFlags & 0x5; //Un-mark HBlank.
	//De-clock for starting on new scan-line:
	this.LCDTicks = ((this.LCDTicks | 0) - 1232) | 0; //We start out at the beginning of the next line.
	//Increment scanline counter:
	this.currentScanLine = ((this.currentScanLine | 0) + 1) | 0; //Increment to the next scan line.
	//Handle switching in/out of vblank:
	if ((this.currentScanLine | 0) >= 160) {
		//Handle special case scan lines of vblank:
		switch (this.currentScanLine | 0) {
			case 160:
				this.updateVBlankStart(); //Update state for start of vblank.
			case 161:
				this.dmaChannel3.gfxDisplaySyncRequest(); //Display Sync. DMA trigger.
				break;
			case 162:
				this.dmaChannel3.gfxDisplaySyncEnableCheck(); //Display Sync. DMA reset on start of line 162.
				break;
			case 227:
				this.statusFlags = this.statusFlags & 0x6; //Un-mark VBlank on start of last vblank line.
				break;
			case 228:
				this.currentScanLine = 0; //Reset scan-line to zero (First line of draw).
		}
	} else if ((this.currentScanLine | 0) > 1) {
		this.dmaChannel3.gfxDisplaySyncRequest(); //Display Sync. DMA trigger.
	}
	this.checkVCounter(); //We're on a new scan line, so check the VCounter for match.
	this.isRenderingCheckPreprocess(); //Update a check value.
	//Recursive clocking of the LCD state:
	this.clockLCDState();
}
GameBoyAdvanceGraphics.prototype.updateHBlank = function () {
	if ((this.statusFlags & 0x2) == 0) { //If we were last in HBlank, don't run this again.
		this.statusFlags = this.statusFlags | 0x2; //Mark HBlank.
		if ((this.IRQFlags & 0x10) != 0) {
			this.irq.requestIRQ(0x2); //Check for IRQ.
		}
		if ((this.currentScanLine | 0) < 160) {
			this.dma.gfxHBlankRequest(); //Check for HDMA Trigger.
		}
		this.isRenderingCheckPreprocess(); //Update a check value.
	}
}
GameBoyAdvanceGraphics.prototype.checkVCounter = function () {
	if ((this.currentScanLine | 0) == (this.VCounter | 0)) { //Check for VCounter match.
		this.statusFlags = this.statusFlags | 0x4;
		if ((this.IRQFlags & 0x20) != 0) { //Check for VCounter IRQ.
			this.irq.requestIRQ(0x4);
		}
	} else {
		this.statusFlags = this.statusFlags & 0x3;
	}
}
GameBoyAdvanceGraphics.prototype.nextVBlankIRQEventTime = function () {
	var nextEventTime = 0x7FFFFFFF;
	if ((this.IRQFlags & 0x8) != 0) {
		//Only give a time if we're allowed to irq:
		nextEventTime = this.nextVBlankEventTime() | 0;
	}
	return nextEventTime | 0;
}
GameBoyAdvanceGraphics.prototype.nextHBlankEventTime = function () {
	var time = this.LCDTicks | 0;
	if ((time | 0) < 1006) {
		//Haven't reached hblank yet, so hblank offset - current:
		time = (1006 - (time | 0)) | 0;
	} else {
		//We're in hblank, so it's end clock - current + next scanline hblank offset:
		time = (2238 - (time | 0)) | 0;
	}
	return time | 0;
}
GameBoyAdvanceGraphics.prototype.nextHBlankIRQEventTime = function () {
	var nextEventTime = 0x7FFFFFFF;
	if ((this.IRQFlags & 0x10) != 0) {
		//Only give a time if we're allowed to irq:
		nextEventTime = this.nextHBlankEventTime() | 0;
	}
	return nextEventTime | 0;
}
GameBoyAdvanceGraphics.prototype.nextVCounterIRQEventTime = function () {
	var nextEventTime = 0x7FFFFFFF;
	if ((this.IRQFlags & 0x20) != 0) {
		//Only give a time if we're allowed to irq:
		nextEventTime = this.nextVCounterEventTime() | 0;
	}
	return nextEventTime | 0;
}
GameBoyAdvanceGraphics.prototype.nextVBlankEventTime = function () {
	var nextEventTime = this.currentScanLine | 0;
	if ((nextEventTime | 0) < 160) {
		//Haven't reached vblank yet, so vblank offset - current:
		nextEventTime = (160 - (nextEventTime | 0)) | 0;
	} else {
		//We're in vblank, so it's end clock - current + next frame vblank offset:
		nextEventTime = (388 - (nextEventTime | 0)) | 0;
	}
	//Convert line count to clocks:
	nextEventTime = this.convertScanlineToClocks(nextEventTime | 0) | 0;
	//Subtract scanline offset from clocks:
	nextEventTime = ((nextEventTime | 0) - (this.LCDTicks | 0)) | 0;
	return nextEventTime | 0;
}
GameBoyAdvanceGraphics.prototype.nextHBlankDMAEventTime = function () {
	var nextEventTime = this.nextHBlankEventTime() | 0;
	if ((this.currentScanLine | 0) > 159 || ((this.currentScanLine | 0) == 159 && (this.LCDTicks | 0) >= 1006)) {
		//No HBlank DMA in VBlank:
		var linesToSkip = (227 - (this.currentScanLine | 0)) | 0;
		linesToSkip = this.convertScanlineToClocks(linesToSkip | 0) | 0;
		nextEventTime = ((nextEventTime | 0) + (linesToSkip | 0)) | 0;
	}
	return nextEventTime | 0;
}
GameBoyAdvanceGraphics.prototype.nextVCounterEventTime = function () {
	var nextEventTime = 0x7FFFFFFF;
	if ((this.VCounter | 0) <= 227) {
		//Only match lines within screen or vblank:
		nextEventTime = ((this.VCounter | 0) - (this.currentScanLine | 0)) | 0;
		if ((nextEventTime | 0) <= 0) {
			nextEventTime = ((nextEventTime | 0) + 228) | 0;
		}
		nextEventTime = this.convertScanlineToClocks(nextEventTime | 0) | 0;
		nextEventTime = ((nextEventTime | 0) - (this.LCDTicks | 0)) | 0;
	}
	return nextEventTime | 0;
}
GameBoyAdvanceGraphics.prototype.nextDisplaySyncEventTime = function (delay) {
	delay = delay | 0;
	var nextEventTime = 0x7FFFFFFF;
	if ((this.currentScanLine | 0) >= 161 || (delay | 0) != 0) {
		//Skip to line 2 metrics:
		nextEventTime = (230 - (this.currentScanLine | 0)) | 0;
		nextEventTime = this.convertScanlineToClocks(nextEventTime | 0) | 0;
		nextEventTime = ((nextEventTime | 0) - (this.LCDTicks | 0)) | 0;
	} else if ((this.currentScanLine | 0) == 0) {
		//Doesn't start until line 2:
		nextEventTime = (2464 - (this.LCDTicks | 0)) | 0;
	} else {
		//Line 2 through line 161:
		nextEventTime = (1232 - (this.LCDTicks | 0)) | 0;
	}
	return nextEventTime | 0;
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceGraphics.prototype.convertScanlineToClocks = function (lines) {
		lines = lines | 0;
		lines = Math.imul(lines | 0, 1232) | 0;
		return lines | 0;
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceGraphics.prototype.convertScanlineToClocks = function (lines) {
		lines = lines | 0;
		lines = ((lines | 0) * 1232) | 0;
		return lines | 0;
	}
}
GameBoyAdvanceGraphics.prototype.updateVBlankStart = function () {
	this.statusFlags = this.statusFlags | 0x1; //Mark VBlank.
	if ((this.IRQFlags & 0x8) != 0) { //Check for VBlank IRQ.
		this.irq.requestIRQ(0x1);
	}
	this.gfxRenderer.ensureFraming();
	this.dma.gfxVBlankRequest();
}
GameBoyAdvanceGraphics.prototype.isRenderingCheckPreprocess = function () {
	var isInVisibleLines = ((this.gfxRenderer.IOData8[0] & 0x80) == 0 && (this.statusFlags & 0x1) == 0);
	var isRendering = (isInVisibleLines && (this.statusFlags & 0x2) == 0) ? 2 : 1;
	var isOAMRendering = (isInVisibleLines && ((this.statusFlags & 0x2) == 0 || (this.gfxRenderer.IOData8[0] & 0x20) == 0)) ? 2 : 1;
	this.wait.updateRenderStatus(isRendering | 0, isOAMRendering | 0);
}
GameBoyAdvanceGraphics.prototype.writeDISPSTAT8_0 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	//VBlank flag read only.
	//HBlank flag read only.
	//V-Counter flag read only.
	//Only LCD IRQ generation enablers can be set here:
	this.IRQFlags = data & 0x38;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceGraphics.prototype.writeDISPSTAT8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	//V-Counter match value:
	if ((data | 0) != (this.VCounter | 0)) {
		this.IOCore.updateCoreClocking();
		this.VCounter = data | 0;
		this.checkVCounter();
		this.IOCore.updateCoreEventTime();
	}
}
GameBoyAdvanceGraphics.prototype.writeDISPSTAT16 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	//VBlank flag read only.
	//HBlank flag read only.
	//V-Counter flag read only.
	//Only LCD IRQ generation enablers can be set here:
	this.IRQFlags = data & 0x38;
	data = (data >> 8) & 0xFF;
	//V-Counter match value:
	if ((data | 0) != (this.VCounter | 0)) {
		this.VCounter = data | 0;
		this.checkVCounter();
	}
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceGraphics.prototype.readDISPSTAT8_0 = function () {
	this.IOCore.updateGraphicsClocking();
	return (this.statusFlags | this.IRQFlags);
}
GameBoyAdvanceGraphics.prototype.readDISPSTAT8_1 = function () {
	return this.VCounter | 0;
}
GameBoyAdvanceGraphics.prototype.readDISPSTAT8_2 = function () {
	this.IOCore.updateGraphicsClocking();
	return this.currentScanLine | 0;
}
GameBoyAdvanceGraphics.prototype.readDISPSTAT16_0 = function () {
	this.IOCore.updateGraphicsClocking();
	return ((this.VCounter << 8) | this.statusFlags | this.IRQFlags);
}
GameBoyAdvanceGraphics.prototype.readDISPSTAT32 = function () {
	this.IOCore.updateGraphicsClocking();
	return ((this.currentScanLine << 16) | (this.VCounter << 8) | this.statusFlags | this.IRQFlags);
}




"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceIO(settings, coreExposed, BIOS, ROM) {
	//State Machine Tracking:
	this.systemStatus = 0;
	this.cyclesToIterate = 0;
	this.cyclesOveriteratedPreviously = 0;
	this.accumulatedClocks = 0;
	this.graphicsClocks = 0;
	this.timerClocks = 0;
	this.serialClocks = 0;
	this.nextEventClocks = 0;
	this.BIOSFound = false;
	//References passed to us:
	this.settings = settings;
	this.coreExposed = coreExposed;
	this.BIOS = BIOS;
	this.ROM = ROM;
	//Build the core object layout:
	this.memory = new GameBoyAdvanceMemory(this);
	this.dma = new GameBoyAdvanceDMA(this);
	this.dmaChannel0 = new GameBoyAdvanceDMA0(this);
	this.dmaChannel1 = new GameBoyAdvanceDMA1(this);
	this.dmaChannel2 = new GameBoyAdvanceDMA2(this);
	this.dmaChannel3 = new GameBoyAdvanceDMA3(this);
	this.gfxState = new GameBoyAdvanceGraphics(this);
	this.gfxRenderer = new GameBoyAdvanceRendererProxy(this);
	this.sound = new GameBoyAdvanceSound(this);
	this.timer = new GameBoyAdvanceTimer(this);
	this.irq = new GameBoyAdvanceIRQ(this);
	this.serial = new GameBoyAdvanceSerial(this);
	this.joypad = new GameBoyAdvanceJoyPad(this);
	this.cartridge = new GameBoyAdvanceCartridge(this);
	this.saves = new GameBoyAdvanceSaves(this);
	this.wait = new GameBoyAdvanceWait(this);
	this.cpu = new GameBoyAdvanceCPU(this);
	//Now initialize each component:
	this.memory.initialize();
	this.dma.initialize();
	this.dmaChannel0.initialize();
	this.dmaChannel1.initialize();
	this.dmaChannel2.initialize();
	this.dmaChannel3.initialize();
	this.gfxState.initialize();
	this.gfxRenderer.initialize();
	this.sound.initialize();
	this.timer.initialize();
	this.irq.initialize();
	this.serial.initialize();
	this.joypad.initialize();
	this.cartridge.initialize();
	this.saves.initialize();
	this.wait.initialize();
	this.cpu.initialize();
}
GameBoyAdvanceIO.prototype.assignInstructionCoreReferences = function (ARM, THUMB) {
	//Passed here once the CPU component is initialized:
	this.ARM = ARM;
	this.THUMB = THUMB;
}
GameBoyAdvanceIO.prototype.enter = function (CPUCyclesTotal) {
	//Find out how many clocks to iterate through this run:
	this.cyclesToIterate = ((CPUCyclesTotal | 0) + (this.cyclesOveriteratedPreviously | 0)) | 0;
	//An extra check to make sure we don't do stuff if we did too much last run:
	if ((this.cyclesToIterate | 0) > 0) {
		//Update our core event prediction:
		this.updateCoreEventTime();
		//If clocks remaining, run iterator:
		this.run();
		//Spill our core event clocking:
		this.updateCoreClocking();
		//Ensure audio buffers at least once per iteration:
		this.sound.audioJIT();
	}
	//If we clocked just a little too much, subtract the extra from the next run:
	this.cyclesOveriteratedPreviously = this.cyclesToIterate | 0;
}
GameBoyAdvanceIO.prototype.run = function () {
	//Clock through the state machine:
	while (true) {
		//Dispatch to optimized run loops:
		switch (this.systemStatus & 0x84) {
			case 0:
				//ARM instruction set:
				this.runARM();
				break;
			case 0x4:
				//THUMB instruction set:
				this.runTHUMB();
				break;
			default:
				//End of stepping:
				this.deflagIterationEnd();
				return;
		}
	}
}
GameBoyAdvanceIO.prototype.runARM = function () {
	//Clock through the state machine:
	while (true) {
		//Handle the current system state selected:
		switch (this.systemStatus | 0) {
			case 0: //CPU Handle State (Normal ARM)
				this.ARM.executeIteration();
				break;
			case 1:
			case 2: //CPU Handle State (Bubble ARM)
				this.ARM.executeBubble();
				this.tickBubble();
				break;
			default: //Handle lesser called / End of stepping
				//Dispatch on IRQ/DMA/HALT/STOP/END bit flags
				switch (this.systemStatus >> 2) {
					case 0x2:
						//IRQ Handle State:
						this.handleIRQARM();
						break;
					case 0x4:
					case 0x6:
						//DMA Handle State
					case 0xC:
					case 0xE:
						//DMA Inside Halt State
						this.handleDMA();
						break;
					case 0x8:
					case 0xA:
						//Handle Halt State
						this.handleHalt();
						break;
					default: //Handle Stop State
						//THUMB flagged stuff falls to here intentionally:
						//End of Stepping and/or CPU run loop switch:
						if ((this.systemStatus & 0x84) != 0) {
							return;
						}
						this.handleStop();
				}
		}
	}
}
GameBoyAdvanceIO.prototype.runTHUMB = function () {
	//Clock through the state machine:
	while (true) {
		//Handle the current system state selected:
		switch (this.systemStatus | 0) {
			case 4: //CPU Handle State (Normal THUMB)
				this.THUMB.executeIteration();
				break;
			case 5:
			case 6: //CPU Handle State (Bubble THUMB)
				this.THUMB.executeBubble();
				this.tickBubble();
				break;
			default: //Handle lesser called / End of stepping
				//Dispatch on IRQ/DMA/HALT/STOP/END bit flags
				switch (this.systemStatus >> 2) {
					case 0x3:
						//IRQ Handle State:
						this.handleIRQThumb();
						break;
					case 0x5:
					case 0x7:
						//DMA Handle State
					case 0xD:
					case 0xF:
						//DMA Inside Halt State
						this.handleDMA();
						break;
					case 0x9:
					case 0x11:
						//Handle Halt State
						this.handleHalt();
						break;
					default: //Handle Stop State
						//ARM flagged stuff falls to here intentionally:
						//End of Stepping and/or CPU run loop switch:
						if ((this.systemStatus & 0x84) != 0x4) {
							return;
						}
						this.handleStop();
				}
		}
	}
}
GameBoyAdvanceIO.prototype.updateCore = function (clocks) {
	clocks = clocks | 0;
	//This is used during normal/dma modes of operation:
	this.accumulatedClocks = ((this.accumulatedClocks | 0) + (clocks | 0)) | 0;
	if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
		this.updateCoreSpill();
	}
}
GameBoyAdvanceIO.prototype.updateCoreForce = function (clocks) {
	clocks = clocks | 0;
	//This is used during halt mode of operation:
	this.accumulatedClocks = ((this.accumulatedClocks | 0) + (clocks | 0)) | 0;
	this.updateCoreSpill();
}
GameBoyAdvanceIO.prototype.updateCoreNegative = function (clocks) {
	clocks = clocks | 0;
	//This is used during normal/dma modes of operation:
	this.accumulatedClocks = ((this.accumulatedClocks | 0) - (clocks | 0)) | 0;
	if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
		this.updateCoreSpill();
	}
}
GameBoyAdvanceIO.prototype.updateCoreSingle = function () {
	//This is used during normal/dma modes of operation:
	this.accumulatedClocks = ((this.accumulatedClocks | 0) + 1) | 0;
	if ((this.accumulatedClocks | 0) >= (this.nextEventClocks | 0)) {
		this.updateCoreSpill();
	}
}
GameBoyAdvanceIO.prototype.updateCoreSpill = function () {
	//Invalidate & recompute new event times:
	this.updateCoreClocking();
	this.updateCoreEventTime();
}
GameBoyAdvanceIO.prototype.updateCoreSpillRetain = function () {
	//Keep the last prediction, just decrement it out, as it's still valid:
	this.nextEventClocks = ((this.nextEventClocks | 0) - (this.accumulatedClocks | 0)) | 0;
	this.updateCoreClocking();
}
GameBoyAdvanceIO.prototype.updateCoreClocking = function () {
	var clocks = this.accumulatedClocks | 0;
	//Decrement the clocks per iteration counter:
	this.cyclesToIterate = ((this.cyclesToIterate | 0) - (clocks | 0)) | 0;
	//Clock all components:
	this.gfxState.addClocks(((clocks | 0) - (this.graphicsClocks | 0)) | 0);
	this.timer.addClocks(((clocks | 0) - (this.timerClocks | 0)) | 0);
	this.serial.addClocks(((clocks | 0) - (this.serialClocks | 0)) | 0);
	this.accumulatedClocks = 0;
	this.graphicsClocks = 0;
	this.timerClocks = 0;
	this.serialClocks = 0;
}
GameBoyAdvanceIO.prototype.updateGraphicsClocking = function () {
	//Clock gfx component:
	this.gfxState.addClocks(((this.accumulatedClocks | 0) - (this.graphicsClocks | 0)) | 0);
	this.graphicsClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateTimerClocking = function () {
	//Clock timer component:
	this.timer.addClocks(((this.accumulatedClocks | 0) - (this.timerClocks | 0)) | 0);
	this.timerClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateSerialClocking = function () {
	//Clock serial component:
	this.serial.addClocks(((this.accumulatedClocks | 0) - (this.serialClocks | 0)) | 0);
	this.serialClocks = this.accumulatedClocks | 0;
}
GameBoyAdvanceIO.prototype.updateCoreEventTime = function () {
	//Predict how many clocks until the next DMA or IRQ event:
	this.nextEventClocks = this.cyclesUntilNextEvent() | 0;
}
GameBoyAdvanceIO.prototype.getRemainingCycles = function () {
	//Return the number of cycles left until iteration end:
	if ((this.cyclesToIterate | 0) < 1) {
		//Change our stepper to our end sequence:
		this.flagIterationEnd();
		return 0;
	}
	return this.cyclesToIterate | 0;
}
GameBoyAdvanceIO.prototype.handleIRQARM = function () {
	if ((this.systemStatus | 0) > 0x8) {
		//CPU Handle State (Bubble ARM)
		this.ARM.executeBubble();
		this.tickBubble();
	} else {
		//CPU Handle State (IRQ)
		this.cpu.IRQinARM();
	}
}
GameBoyAdvanceIO.prototype.handleIRQThumb = function () {
	if ((this.systemStatus | 0) > 0xC) {
		//CPU Handle State (Bubble THUMB)
		this.THUMB.executeBubble();
		this.tickBubble();
	} else {
		//CPU Handle State (IRQ)
		this.cpu.IRQinTHUMB();
	}
}
GameBoyAdvanceIO.prototype.handleDMA = function () {
	/*
	 Loop our state status in here as
	 an optimized iteration, as DMA stepping instances
	 happen in quick succession of each other, and
	 aren't often done for one memory word only.
	 */
	do {
		//Perform a DMA read and write:
		this.dma.perform();
	} while ((this.systemStatus & 0x90) == 0x10);
}
GameBoyAdvanceIO.prototype.handleHalt = function () {
	if ((this.irq.IRQMatch() | 0) == 0) {
		//Clock up to next IRQ match or DMA:
		this.updateCoreForce(this.cyclesUntilNextHALTEvent() | 0);
	} else {
		//Exit HALT promptly:
		this.deflagHalt();
	}
}
GameBoyAdvanceIO.prototype.handleStop = function () {
	//Update sound system to add silence to buffer:
	this.sound.addClocks(this.getRemainingCycles() | 0);
	this.cyclesToIterate = 0;
	//Exits when user presses joypad or from an external irq outside of GBA internal.
}
GameBoyAdvanceIO.prototype.cyclesUntilNextHALTEvent = function () {
	//Find the clocks to the next HALT leave or DMA event:
	var haltClocks = this.irq.nextEventTime() | 0;
	var dmaClocks = this.dma.nextEventTime() | 0;
	return this.solveClosestTime(haltClocks | 0, dmaClocks | 0) | 0;
}
GameBoyAdvanceIO.prototype.cyclesUntilNextEvent = function () {
	//Find the clocks to the next IRQ or DMA event:
	var irqClocks = this.irq.nextIRQEventTime() | 0;
	var dmaClocks = this.dma.nextEventTime() | 0;
	return this.solveClosestTime(irqClocks | 0, dmaClocks | 0) | 0;
}
GameBoyAdvanceIO.prototype.solveClosestTime = function (clocks1, clocks2) {
	clocks1 = clocks1 | 0;
	clocks2 = clocks2 | 0;
	//Find the clocks closest to the next event:
	var clocks = this.getRemainingCycles() | 0;
	clocks = Math.min(clocks | 0, clocks1 | 0, clocks2 | 0);
	return clocks | 0;
}
GameBoyAdvanceIO.prototype.flagBubble = function () {
	//Flag a CPU pipeline bubble to step through:
	this.systemStatus = this.systemStatus | 0x2;
}
GameBoyAdvanceIO.prototype.tickBubble = function () {
	//Tick down a CPU pipeline bubble to step through:
	this.systemStatus = ((this.systemStatus | 0) - 1) | 0;
}
GameBoyAdvanceIO.prototype.flagTHUMB = function () {
	//Flag a CPU IRQ to step through:
	this.systemStatus = this.systemStatus | 0x4;
}
GameBoyAdvanceIO.prototype.deflagTHUMB = function () {
	//Deflag a CPU IRQ to step through:
	this.systemStatus = this.systemStatus & 0xFB;
}
GameBoyAdvanceIO.prototype.flagIRQ = function () {
	//Flag THUMB CPU mode to step through:
	this.systemStatus = this.systemStatus | 0x8;
}
GameBoyAdvanceIO.prototype.deflagIRQ = function () {
	//Deflag THUMB CPU mode to step through:
	this.systemStatus = this.systemStatus & 0xF7;
}
GameBoyAdvanceIO.prototype.flagDMA = function () {
	//Flag a DMA event to step through:
	this.systemStatus = this.systemStatus | 0x10;
}
GameBoyAdvanceIO.prototype.deflagDMA = function () {
	//Deflag a DMA event to step through:
	this.systemStatus = this.systemStatus & 0xEF;
}
GameBoyAdvanceIO.prototype.flagHalt = function () {
	//Flag a halt event to step through:
	this.systemStatus = this.systemStatus | 0x20;
}
GameBoyAdvanceIO.prototype.deflagHalt = function () {
	//Deflag a halt event to step through:
	this.systemStatus = this.systemStatus & 0xDF;
}
GameBoyAdvanceIO.prototype.flagStop = function () {
	//Flag a halt event to step through:
	this.systemStatus = this.systemStatus | 0x40;
}
GameBoyAdvanceIO.prototype.deflagStop = function () {
	//Deflag a halt event to step through:
	this.systemStatus = this.systemStatus & 0xBF;
}
GameBoyAdvanceIO.prototype.flagIterationEnd = function () {
	//Flag a run loop kill event to step through:
	this.systemStatus = this.systemStatus | 0x80;
}
GameBoyAdvanceIO.prototype.deflagIterationEnd = function () {
	//Deflag a run loop kill event to step through:
	this.systemStatus = this.systemStatus & 0x7F;
}
GameBoyAdvanceIO.prototype.isStopped = function () {
	//Sound system uses this to emulate a unpowered audio output:
	return ((this.systemStatus & 0x40) != 0);
}
GameBoyAdvanceIO.prototype.inDMA = function () {
	//Save system uses this to detect dma:
	return ((this.systemStatus & 0x10) != 0);
}
GameBoyAdvanceIO.prototype.getCurrentFetchValue = function () {
	//Last valid value output for bad reads:
	var fetch = 0;
	if ((this.systemStatus & 0x10) == 0) {
		fetch = this.cpu.getCurrentFetchValue() | 0;
	} else {
		fetch = this.dma.getCurrentFetchValue() | 0;
	}
	return fetch | 0;
}




"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceMemory(IOCore) {
	//Reference to the emulator core:
	this.IOCore = IOCore;
}
GameBoyAdvanceMemory.prototype.initialize = function () {
	//WRAM Map Control Stuff:
	this.WRAMControlFlags = 0x20;
	//Load the BIOS:
	this.BIOS = getUint8Array(0x4000);
	this.BIOS16 = getUint16View(this.BIOS);
	this.BIOS32 = getInt32View(this.BIOS);
	this.loadBIOS();
	//Initialize Some RAM:
	this.externalRAM = getUint8Array(0x40000);
	this.externalRAM16 = getUint16View(this.externalRAM);
	this.externalRAM32 = getInt32View(this.externalRAM);
	this.internalRAM = getUint8Array(0x8000);
	this.internalRAM16 = getUint16View(this.internalRAM);
	this.internalRAM32 = getInt32View(this.internalRAM);
	this.lastBIOSREAD = 0; //BIOS read bus last.
	//After all sub-objects initialized, initialize dispatches:
	this.memoryRead8 = this.memoryRead8Generated[1];
	this.memoryWrite8 = this.memoryWrite8Generated[1];
	this.memoryRead16 = this.memoryRead16Generated[1];
	this.memoryReadDMA16 = this.memoryReadDMA16Generated[1];
	this.memoryReadDMAFull16 = this.memoryReadDMA16FullGenerated[1];
	this.memoryReadCPU16 = this.memoryReadCPU16Generated[1];
	this.memoryWrite16 = this.memoryWrite16Generated[1];
	this.memoryWriteDMA16 = this.memoryWriteDMA16Generated[1];
	this.memoryWriteDMAFull16 = this.memoryWriteDMA16FullGenerated[1];
	this.memoryRead32 = this.memoryRead32Generated[1];
	this.memoryReadDMA32 = this.memoryReadDMA32Generated[1];
	this.memoryReadDMAFull32 = this.memoryReadDMA32FullGenerated[1];
	this.memoryReadCPU32 = this.memoryReadCPU32Generated[1];
	this.memoryWrite32 = this.memoryWrite32Generated[1];
	this.memoryWriteDMA32 = this.memoryWriteDMA32Generated[1];
	this.memoryWriteDMAFull32 = this.memoryWriteDMA32FullGenerated[1];
	//Initialize the various handler objects:
	this.dma = this.IOCore.dma;
	this.dmaChannel0 = this.IOCore.dmaChannel0;
	this.dmaChannel1 = this.IOCore.dmaChannel1;
	this.dmaChannel2 = this.IOCore.dmaChannel2;
	this.dmaChannel3 = this.IOCore.dmaChannel3;
	this.gfxState = this.IOCore.gfxState;
	this.gfxRenderer = this.IOCore.gfxRenderer;
	this.sound = this.IOCore.sound;
	this.timer = this.IOCore.timer;
	this.irq = this.IOCore.irq;
	this.serial = this.IOCore.serial;
	this.joypad = this.IOCore.joypad;
	this.cartridge = this.IOCore.cartridge;
	this.wait = this.IOCore.wait;
	this.cpu = this.IOCore.cpu;
	this.saves = this.IOCore.saves;
}
GameBoyAdvanceMemory.prototype.writeExternalWRAM8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	//External WRAM:
	this.wait.WRAMAccess();
	this.externalRAM[address & 0x3FFFF] = data & 0xFF;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceMemory.prototype.writeExternalWRAM16 = function (address, data) {
		address = address | 0;
		data = data | 0;
		//External WRAM:
		this.wait.WRAMAccess();
		this.externalRAM16[(address >> 1) & 0x1FFFF] = data & 0xFFFF;
	}
	GameBoyAdvanceMemory.prototype.writeExternalWRAM32 = function (address, data) {
		address = address | 0;
		data = data | 0;
		//External WRAM:
		this.wait.WRAMAccess32();
		this.externalRAM32[(address >> 2) & 0xFFFF] = data | 0;
	}
} else {
	GameBoyAdvanceMemory.prototype.writeExternalWRAM16 = function (address, data) {
		//External WRAM:
		this.wait.WRAMAccess();
		address &= 0x3FFFE;
		this.externalRAM[address++] = data & 0xFF;
		this.externalRAM[address] = (data >> 8) & 0xFF;
	}
	GameBoyAdvanceMemory.prototype.writeExternalWRAM32 = function (address, data) {
		//External WRAM:
		this.wait.WRAMAccess32();
		address &= 0x3FFFC;
		this.externalRAM[address++] = data & 0xFF;
		this.externalRAM[address++] = (data >> 8) & 0xFF;
		this.externalRAM[address++] = (data >> 16) & 0xFF;
		this.externalRAM[address] = data >>> 24;
	}
}
GameBoyAdvanceMemory.prototype.writeInternalWRAM8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	//Internal WRAM:
	this.wait.singleClock();
	this.internalRAM[address & 0x7FFF] = data & 0xFF;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceMemory.prototype.writeInternalWRAM16 = function (address, data) {
		address = address | 0;
		data = data | 0;
		//Internal WRAM:
		this.wait.singleClock();
		this.internalRAM16[(address >> 1) & 0x3FFF] = data & 0xFFFF;
	}
	GameBoyAdvanceMemory.prototype.writeInternalWRAM32 = function (address, data) {
		address = address | 0;
		data = data | 0;
		//Internal WRAM:
		this.wait.singleClock();
		this.internalRAM32[(address >> 2) & 0x1FFF] = data | 0;
	}
} else {
	GameBoyAdvanceMemory.prototype.writeInternalWRAM16 = function (address, data) {
		//Internal WRAM:
		this.wait.singleClock();
		address &= 0x7FFE;
		this.internalRAM[address++] = data & 0xFF;
		this.internalRAM[address] = (data >> 8) & 0xFF;
	}
	GameBoyAdvanceMemory.prototype.writeInternalWRAM32 = function (address, data) {
		//Internal WRAM:
		this.wait.singleClock();
		address &= 0x7FFC;
		this.internalRAM[address++] = data & 0xFF;
		this.internalRAM[address++] = (data >> 8) & 0xFF;
		this.internalRAM[address++] = (data >> 16) & 0xFF;
		this.internalRAM[address] = data >>> 24;
	}
}
GameBoyAdvanceMemory.prototype.writeIODispatch8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.singleClock();
	switch (address | 0) {
		//4000000h - DISPCNT - LCD Control (Read/Write)
		case 0x4000000:
			this.gfxRenderer.writeDISPCNT8_0(data | 0);
			break;
			//4000001h - DISPCNT - LCD Control (Read/Write)
		case 0x4000001:
			this.gfxRenderer.writeDISPCNT8_1(data | 0);
			break;
			//4000002h - Undocumented - Green Swap (R/W)
		case 0x4000002:
			this.gfxRenderer.writeDISPCNT8_2(data | 0);
			break;
			//4000003h - Undocumented - Green Swap (R/W)
			//4000004h - DISPSTAT - General LCD Status (Read/Write)
		case 0x4000004:
			this.gfxState.writeDISPSTAT8_0(data | 0);
			break;
			//4000005h - DISPSTAT - General LCD Status (Read/Write)
		case 0x4000005:
			this.gfxState.writeDISPSTAT8_1(data | 0);
			break;
			//4000006h - VCOUNT - Vertical Counter (Read only)
			//4000007h - VCOUNT - Vertical Counter (Read only)
			//4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
		case 0x4000008:
			this.gfxRenderer.writeBG0CNT8_0(data | 0);
			break;
			//4000009h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
		case 0x4000009:
			this.gfxRenderer.writeBG0CNT8_1(data | 0);
			break;
			//400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
		case 0x400000A:
			this.gfxRenderer.writeBG1CNT8_0(data | 0);
			break;
			//400000Bh - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
		case 0x400000B:
			this.gfxRenderer.writeBG1CNT8_1(data | 0);
			break;
			//400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
		case 0x400000C:
			this.gfxRenderer.writeBG2CNT8_0(data | 0);
			break;
			//400000Dh - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
		case 0x400000D:
			this.gfxRenderer.writeBG2CNT8_1(data | 0);
			break;
			//400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
		case 0x400000E:
			this.gfxRenderer.writeBG3CNT8_0(data | 0);
			break;
			//400000Fh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
		case 0x400000F:
			this.gfxRenderer.writeBG3CNT8_1(data | 0);
			break;
			//4000010h - BG0HOFS - BG0 X-Offset (W)
		case 0x4000010:
			this.gfxRenderer.writeBG0HOFS8_0(data | 0);
			break;
			//4000011h - BG0HOFS - BG0 X-Offset (W)
		case 0x4000011:
			this.gfxRenderer.writeBG0HOFS8_1(data | 0);
			break;
			//4000012h - BG0VOFS - BG0 Y-Offset (W)
		case 0x4000012:
			this.gfxRenderer.writeBG0VOFS8_0(data | 0);
			break;
			//4000013h - BG0VOFS - BG0 Y-Offset (W)
		case 0x4000013:
			this.gfxRenderer.writeBG0VOFS8_1(data | 0);
			break;
			//4000014h - BG1HOFS - BG1 X-Offset (W)
		case 0x4000014:
			this.gfxRenderer.writeBG1HOFS8_0(data | 0);
			break;
			//4000015h - BG1HOFS - BG1 X-Offset (W)
		case 0x4000015:
			this.gfxRenderer.writeBG1HOFS8_1(data | 0);
			break;
			//4000016h - BG1VOFS - BG1 Y-Offset (W)
		case 0x4000016:
			this.gfxRenderer.writeBG1VOFS8_0(data | 0);
			break;
			//4000017h - BG1VOFS - BG1 Y-Offset (W)
		case 0x4000017:
			this.gfxRenderer.writeBG1VOFS8_1(data | 0);
			break;
			//4000018h - BG2HOFS - BG2 X-Offset (W)
		case 0x4000018:
			this.gfxRenderer.writeBG2HOFS8_0(data | 0);
			break;
			//4000019h - BG2HOFS - BG2 X-Offset (W)
		case 0x4000019:
			this.gfxRenderer.writeBG2HOFS8_1(data | 0);
			break;
			//400001Ah - BG2VOFS - BG2 Y-Offset (W)
		case 0x400001A:
			this.gfxRenderer.writeBG2VOFS8_0(data | 0);
			break;
			//400001Bh - BG2VOFS - BG2 Y-Offset (W)
		case 0x400001B:
			this.gfxRenderer.writeBG2VOFS8_1(data | 0);
			break;
			//400001Ch - BG3HOFS - BG3 X-Offset (W)
		case 0x400001C:
			this.gfxRenderer.writeBG3HOFS8_0(data | 0);
			break;
			//400001Dh - BG3HOFS - BG3 X-Offset (W)
		case 0x400001D:
			this.gfxRenderer.writeBG3HOFS8_1(data | 0);
			break;
			//400001Eh - BG3VOFS - BG3 Y-Offset (W)
		case 0x400001E:
			this.gfxRenderer.writeBG3VOFS8_0(data | 0);
			break;
			//400001Fh - BG3VOFS - BG3 Y-Offset (W)
		case 0x400001F:
			this.gfxRenderer.writeBG3VOFS8_1(data | 0);
			break;
			//4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
		case 0x4000020:
			this.gfxRenderer.writeBG2PA8_0(data | 0);
			break;
			//4000021h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
		case 0x4000021:
			this.gfxRenderer.writeBG2PA8_1(data | 0);
			break;
			//4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
		case 0x4000022:
			this.gfxRenderer.writeBG2PB8_0(data | 0);
			break;
			//4000023h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
		case 0x4000023:
			this.gfxRenderer.writeBG2PB8_1(data | 0);
			break;
			//4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
		case 0x4000024:
			this.gfxRenderer.writeBG2PC8_0(data | 0);
			break;
			//4000025h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
		case 0x4000025:
			this.gfxRenderer.writeBG2PC8_1(data | 0);
			break;
			//4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
		case 0x4000026:
			this.gfxRenderer.writeBG2PD8_0(data | 0);
			break;
			//4000027h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
		case 0x4000027:
			this.gfxRenderer.writeBG2PD8_1(data | 0);
			break;
			//4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
		case 0x4000028:
			this.gfxRenderer.writeBG2X8_0(data | 0);
			break;
			//4000029h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
		case 0x4000029:
			this.gfxRenderer.writeBG2X8_1(data | 0);
			break;
			//400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
		case 0x400002A:
			this.gfxRenderer.writeBG2X8_2(data | 0);
			break;
			//400002Bh - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
		case 0x400002B:
			this.gfxRenderer.writeBG2X8_3(data | 0);
			break;
			//400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
		case 0x400002C:
			this.gfxRenderer.writeBG2Y8_0(data | 0);
			break;
			//400002Dh - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
		case 0x400002D:
			this.gfxRenderer.writeBG2Y8_1(data | 0);
			break;
			//400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
		case 0x400002E:
			this.gfxRenderer.writeBG2Y8_2(data | 0);
			break;
			//400002Fh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
		case 0x400002F:
			this.gfxRenderer.writeBG2Y8_3(data | 0);
			break;
			//4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
		case 0x4000030:
			this.gfxRenderer.writeBG3PA8_0(data | 0);
			break;
			//4000031h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
		case 0x4000031:
			this.gfxRenderer.writeBG3PA8_1(data | 0);
			break;
			//4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
		case 0x4000032:
			this.gfxRenderer.writeBG3PB8_0(data | 0);
			break;
			//4000033h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
		case 0x4000033:
			this.gfxRenderer.writeBG3PB8_1(data | 0);
			break;
			//4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
		case 0x4000034:
			this.gfxRenderer.writeBG3PC8_0(data | 0);
			break;
			//4000035h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
		case 0x4000035:
			this.gfxRenderer.writeBG3PC8_1(data | 0);
			break;
			//4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
		case 0x4000036:
			this.gfxRenderer.writeBG3PD8_0(data | 0);
			break;
			//4000037h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
		case 0x4000037:
			this.gfxRenderer.writeBG3PD8_1(data | 0);
			break;
			//4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
		case 0x4000038:
			this.gfxRenderer.writeBG3X8_0(data | 0);
			break;
			//4000039h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
		case 0x4000039:
			this.gfxRenderer.writeBG3X8_1(data | 0);
			break;
			//400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
		case 0x400003A:
			this.gfxRenderer.writeBG3X8_2(data | 0);
			break;
			//400003Bh - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
		case 0x400003B:
			this.gfxRenderer.writeBG3X8_3(data | 0);
			break;
			//400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
		case 0x400003C:
			this.gfxRenderer.writeBG3Y8_0(data | 0);
			break;
			//400003Dh - BGY_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
		case 0x400003D:
			this.gfxRenderer.writeBG3Y8_1(data | 0);
			break;
			//400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
		case 0x400003E:
			this.gfxRenderer.writeBG3Y8_2(data | 0);
			break;
			//400003Fh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
		case 0x400003F:
			this.gfxRenderer.writeBG3Y8_3(data | 0);
			break;
			//4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
		case 0x4000040:
			this.gfxRenderer.writeWIN0XCOORDRight8(data | 0);
			break;
			//4000041h - WIN0H - Window 0 Horizontal Dimensions (W)
		case 0x4000041:
			this.gfxRenderer.writeWIN0XCOORDLeft8(data | 0);
			break;
			//4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
		case 0x4000042:
			this.gfxRenderer.writeWIN1XCOORDRight8(data | 0);
			break;
			//4000043h - WIN1H - Window 1 Horizontal Dimensions (W)
		case 0x4000043:
			this.gfxRenderer.writeWIN1XCOORDLeft8(data | 0);
			break;
			//4000044h - WIN0V - Window 0 Vertical Dimensions (W)
		case 0x4000044:
			this.gfxRenderer.writeWIN0YCOORDBottom8(data | 0);
			break;
			//4000045h - WIN0V - Window 0 Vertical Dimensions (W)
		case 0x4000045:
			this.gfxRenderer.writeWIN0YCOORDTop8(data | 0);
			break;
			//4000046h - WIN1V - Window 1 Vertical Dimensions (W)
		case 0x4000046:
			this.gfxRenderer.writeWIN1YCOORDBottom8(data | 0);
			break;
			//4000047h - WIN1V - Window 1 Vertical Dimensions (W)
		case 0x4000047:
			this.gfxRenderer.writeWIN1YCOORDTop8(data | 0);
			break;
			//4000048h - WININ - Control of Inside of Window(s) (R/W)
		case 0x4000048:
			this.gfxRenderer.writeWIN0IN8(data | 0);
			break;
			//4000049h - WININ - Control of Inside of Window(s) (R/W)
		case 0x4000049:
			this.gfxRenderer.writeWIN1IN8(data | 0);
			break;
			//400004Ah- WINOUT - Control of Outside of Windows (R/W)
		case 0x400004A:
			this.gfxRenderer.writeWINOUT8(data | 0);
			break;
			//400004AB- WINOUT - Inside of OBJ Window (R/W)
		case 0x400004B:
			this.gfxRenderer.writeWINOBJIN8(data | 0);
			break;
			//400004Ch - MOSAIC - Mosaic Size (W)
		case 0x400004C:
			this.gfxRenderer.writeMOSAIC8_0(data | 0);
			break;
			//400004Dh - MOSAIC - Mosaic Size (W)
		case 0x400004D:
			this.gfxRenderer.writeMOSAIC8_1(data | 0);
			break;
			//400004Eh - NOT USED - ZERO
			//400004Fh - NOT USED - ZERO
			//4000050h - BLDCNT - Color Special Effects Selection (R/W)
		case 0x4000050:
			this.gfxRenderer.writeBLDCNT8_0(data | 0);
			break;
			//4000051h - BLDCNT - Color Special Effects Selection (R/W)
		case 0x4000051:
			this.gfxRenderer.writeBLDCNT8_1(data | 0);
			break;
			//4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
		case 0x4000052:
			this.gfxRenderer.writeBLDALPHA8_0(data | 0);
			break;
			//4000053h - BLDALPHA - Alpha Blending Coefficients (R/W)
		case 0x4000053:
			this.gfxRenderer.writeBLDALPHA8_1(data | 0);
			break;
			//4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
		case 0x4000054:
			this.gfxRenderer.writeBLDY8(data | 0);
			break;
			//4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
			//4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
		case 0x4000060:
			//NR10:
			this.sound.writeSOUND1CNT8_0(data | 0);
			break;
			//4000061h - NOT USED - ZERO
			//4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
		case 0x4000062:
			//NR11:
			this.sound.writeSOUND1CNT8_2(data | 0);
			break;
			//4000063h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
		case 0x4000063:
			//NR12:
			this.sound.writeSOUND1CNT8_3(data | 0);
			break;
			//4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
		case 0x4000064:
			//NR13:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND1CNT_X0(data & 0xFF);
			break;
			//4000065h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
		case 0x4000065:
			//NR14:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND1CNT_X1(data & 0xFF);
			break;
			//4000066h - NOT USED - ZERO
			//4000067h - NOT USED - ZERO
			//4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
		case 0x4000068:
			//NR21:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND2CNT_L0(data & 0xFF);
			break;
			//4000069h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
		case 0x4000069:
			//NR22:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND2CNT_L1(data & 0xFF);
			break;
			//400006Ah - NOT USED - ZERO
			//400006Bh - NOT USED - ZERO
			//400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
		case 0x400006C:
			//NR23:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND2CNT_H0(data & 0xFF);
			break;
			//400006Dh - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
		case 0x400006D:
			//NR24:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND2CNT_H1(data & 0xFF);
			break;
			//400006Eh - NOT USED - ZERO
			//400006Fh - NOT USED - ZERO
			//4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
		case 0x4000070:
			//NR30:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_L(data & 0xFF);
			break;
			//4000071h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
			//4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
		case 0x4000072:
			//NR31:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_H0(data & 0xFF);
			break;
			//4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
		case 0x4000073:
			//NR32:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_H1(data & 0xFF);
			break;
			//4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
		case 0x4000074:
			//NR33:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_X0(data & 0xFF);
			break;
			//4000075h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
		case 0x4000075:
			//NR34:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_X1(data & 0xFF);
			break;
			//4000076h - NOT USED - ZERO
			//4000077h - NOT USED - ZERO
			//4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
		case 0x4000078:
			//NR41:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND4CNT_L0(data & 0xFF);
			break;
			//4000079h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
		case 0x4000079:
			//NR42:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND4CNT_L1(data & 0xFF);
			break;
			//400007Ah - NOT USED - ZERO
			//400007Bh - NOT USED - ZERO
			//400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
		case 0x400007C:
			//NR43:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND4CNT_H0(data & 0xFF);
			break;
			//400007Dh - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
		case 0x400007D:
			//NR44:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND4CNT_H1(data & 0xFF);
			break;
			//400007Eh - NOT USED - ZERO
			//400007Fh - NOT USED - ZERO
			//4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
		case 0x4000080:
			//NR50:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_L0(data & 0xFF);
			break;
			//4000081h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
		case 0x4000081:
			//NR51:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_L1(data & 0xFF);
			break;
			//4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
		case 0x4000082:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_H0(data & 0xFF);
			break;
			//4000083h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
		case 0x4000083:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_H1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
		case 0x4000084:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_X(data & 0xFF);
			break;
			//4000085h - NOT USED - ZERO
			//4000086h - NOT USED - ZERO
			//4000087h - NOT USED - ZERO
			//4000088h - SOUNDBIAS - Sound PWM Control (R/W)
		case 0x4000088:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDBIAS0(data & 0xFF);
			break;
			//4000089h - SOUNDBIAS - Sound PWM Control (R/W)
		case 0x4000089:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDBIAS1(data & 0xFF);
			break;
			//400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
			//4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000090:
			//4000091h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000091:
			//4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000092:
			//4000093h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000093:
			//4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000094:
			//4000095h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000095:
			//4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000096:
			//4000097h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000097:
			//4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000098:
			//4000099h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000099:
			//400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009A:
			//400009Bh - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009B:
			//400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009C:
			//400009Dh - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009D:
			//400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009E:
			//400009Fh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009F:
			this.sound.writeWAVE8(address & 0xF, data | 0);
			break;
			//40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
		case 0x40000A0:
			//40000A1h - FIFO_A_L - FIFO Channel A First Word (W)
		case 0x40000A1:
			//40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
		case 0x40000A2:
			//40000A3h - FIFO_A_H - FIFO Channel A Second Word (W)
		case 0x40000A3:
			this.sound.writeFIFOA8(data | 0);
			break;
			//40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
		case 0x40000A4:
			//40000A5h - FIFO_B_L - FIFO Channel B First Word (W)
		case 0x40000A5:
			//40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
		case 0x40000A6:
			//40000A7h - FIFO_B_H - FIFO Channel B Second Word (W)
		case 0x40000A7:
			this.sound.writeFIFOB8(data | 0);
			break;
			//40000A8h through 40000AFh - NOT USED - GLITCHED
			//40000B0h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
		case 0x40000B0:
			this.dmaChannel0.writeDMASource8_0(data | 0);
			break;
			//40000B1h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
		case 0x40000B1:
			this.dmaChannel0.writeDMASource8_1(data | 0);
			break;
			//40000B2h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
		case 0x40000B2:
			this.dmaChannel0.writeDMASource8_2(data | 0);
			break;
			//40000B3h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
		case 0x40000B3:
			this.dmaChannel0.writeDMASource8_3(data | 0);
			break;
			//40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
		case 0x40000B4:
			this.dmaChannel0.writeDMADestination8_0(data | 0);
			break;
			//40000B5h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
		case 0x40000B5:
			this.dmaChannel0.writeDMADestination8_1(data | 0);
			break;
			//40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
		case 0x40000B6:
			this.dmaChannel0.writeDMADestination8_2(data | 0);
			break;
			//40000B7h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
		case 0x40000B7:
			this.dmaChannel0.writeDMADestination8_3(data | 0);
			break;
			//40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
		case 0x40000B8:
			this.dmaChannel0.writeDMAWordCount8_0(data | 0);
			break;
			//40000B9h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
		case 0x40000B9:
			this.dmaChannel0.writeDMAWordCount8_1(data | 0);
			break;
			//40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
		case 0x40000BA:
			this.dmaChannel0.writeDMAControl8_0(data | 0);
			break;
			//40000BBh - DMA0CNT_H - DMA 0 Control (R/W)
		case 0x40000BB:
			this.dmaChannel0.writeDMAControl8_1(data | 0);
			break;
			//40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
		case 0x40000BC:
			this.dmaChannel1.writeDMASource8_0(data | 0);
			break;
			//40000BDh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
		case 0x40000BD:
			this.dmaChannel1.writeDMASource8_1(data | 0);
			break;
			//40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
		case 0x40000BE:
			this.dmaChannel1.writeDMASource8_2(data | 0);
			break;
			//40000BFh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
		case 0x40000BF:
			this.dmaChannel1.writeDMASource8_3(data | 0);
			break;
			//40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
		case 0x40000C0:
			this.dmaChannel1.writeDMADestination8_0(data | 0);
			break;
			//40000C1h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
		case 0x40000C1:
			this.dmaChannel1.writeDMADestination8_1(data | 0);
			break;
			//40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
		case 0x40000C2:
			this.dmaChannel1.writeDMADestination8_2(data | 0);
			break;
			//40000C3h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
		case 0x40000C3:
			this.dmaChannel1.writeDMADestination8_3(data | 0);
			break;
			//40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
		case 0x40000C4:
			this.dmaChannel1.writeDMAWordCount8_0(data | 0);
			break;
			//40000C5h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
		case 0x40000C5:
			this.dmaChannel1.writeDMAWordCount8_1(data | 0);
			break;
			//40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
		case 0x40000C6:
			this.dmaChannel1.writeDMAControl8_0(data | 0);
			break;
			//40000C7h - DMA1CNT_H - DMA 1 Control (R/W)
		case 0x40000C7:
			this.dmaChannel1.writeDMAControl8_1(data | 0);
			break;
			//40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
		case 0x40000C8:
			this.dmaChannel2.writeDMASource8_0(data | 0);
			break;
			//40000C9h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
		case 0x40000C9:
			this.dmaChannel2.writeDMASource8_1(data | 0);
			break;
			//40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
		case 0x40000CA:
			this.dmaChannel2.writeDMASource8_2(data | 0);
			break;
			//40000CBh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
		case 0x40000CB:
			this.dmaChannel2.writeDMASource8_3(data | 0);
			break;
			//40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
		case 0x40000CC:
			this.dmaChannel2.writeDMADestination8_0(data | 0);
			break;
			//40000CDh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
		case 0x40000CD:
			this.dmaChannel2.writeDMADestination8_1(data | 0);
			break;
			//40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
		case 0x40000CE:
			this.dmaChannel2.writeDMADestination8_2(data | 0);
			break;
			//40000CFh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
		case 0x40000CF:
			this.dmaChannel2.writeDMADestination8_3(data | 0);
			break;
			//40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
		case 0x40000D0:
			this.dmaChannel2.writeDMAWordCount8_0(data | 0);
			break;
			//40000D1h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
		case 0x40000D1:
			this.dmaChannel2.writeDMAWordCount8_1(data | 0);
			break;
			//40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
		case 0x40000D2:
			this.dmaChannel2.writeDMAControl8_0(data | 0);
			break;
			//40000D3h - DMA2CNT_H - DMA 2 Control (R/W)
		case 0x40000D3:
			this.dmaChannel2.writeDMAControl8_1(data | 0);
			break;
			//40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
		case 0x40000D4:
			this.dmaChannel3.writeDMASource8_0(data | 0);
			break;
			//40000D5h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
		case 0x40000D5:
			this.dmaChannel3.writeDMASource8_1(data | 0);
			break;
			//40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
		case 0x40000D6:
			this.dmaChannel3.writeDMASource8_2(data | 0);
			break;
			//40000D7h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
		case 0x40000D7:
			this.dmaChannel3.writeDMASource8_3(data | 0);
			break;
			//40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
		case 0x40000D8:
			this.dmaChannel3.writeDMADestination8_0(data | 0);
			break;
			//40000D9h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
		case 0x40000D9:
			this.dmaChannel3.writeDMADestination8_1(data | 0);
			break;
			//40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
		case 0x40000DA:
			this.dmaChannel3.writeDMADestination8_2(data | 0);
			break;
			//40000DBh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
		case 0x40000DB:
			this.dmaChannel3.writeDMADestination8_3(data | 0);
			break;
			//40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
		case 0x40000DC:
			this.dmaChannel3.writeDMAWordCount8_0(data | 0);
			break;
			//40000DDh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
		case 0x40000DD:
			this.dmaChannel3.writeDMAWordCount8_1(data | 0);
			break;
			//40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
		case 0x40000DE:
			this.dmaChannel3.writeDMAControl8_0(data | 0);
			break;
			//40000DFh - DMA3CNT_H - DMA 3 Control (R/W)
		case 0x40000DF:
			this.dmaChannel3.writeDMAControl8_1(data | 0);
			break;
			//40000E0h through 40000FFh - NOT USED - GLITCHED
			//4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
		case 0x4000100:
			this.timer.writeTM0CNT8_0(data | 0);
			break;
			//4000101h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
		case 0x4000101:
			this.timer.writeTM0CNT8_1(data | 0);
			break;
			//4000102h - TM0CNT_H - Timer 0 Control (R/W)
		case 0x4000102:
			this.timer.writeTM0CNT8_2(data | 0);
			break;
			//4000103h - TM0CNT_H - Timer 0 Control (R/W)
			//4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
		case 0x4000104:
			this.timer.writeTM1CNT8_0(data | 0);
			break;
			//4000105h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
		case 0x4000105:
			this.timer.writeTM1CNT8_1(data | 0);
			break;
			//4000106h - TM1CNT_H - Timer 1 Control (R/W)
		case 0x4000106:
			this.timer.writeTM1CNT8_2(data | 0);
			break;
			//4000107h - TM1CNT_H - Timer 1 Control (R/W)
			//4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
		case 0x4000108:
			this.timer.writeTM2CNT8_0(data | 0);
			break;
			//4000109h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
		case 0x4000109:
			this.timer.writeTM2CNT8_1(data | 0);
			break;
			//400010Ah - TM2CNT_H - Timer 2 Control (R/W)
		case 0x400010A:
			this.timer.writeTM2CNT8_2(data | 0);
			break;
			//400010Bh - TM2CNT_H - Timer 2 Control (R/W)
			//400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
		case 0x400010C:
			this.timer.writeTM3CNT8_0(data | 0);
			break;
			//400010Dh - TM3CNT_L - Timer 3 Counter/Reload (R/W)
		case 0x400010D:
			this.timer.writeTM3CNT8_1(data | 0);
			break;
			//400010Eh - TM3CNT_H - Timer 3 Control (R/W)
		case 0x400010E:
			this.timer.writeTM3CNT8_2(data | 0);
			break;
			//400010Fh - TM3CNT_H - Timer 3 Control (R/W)
			//4000110h through 400011Fh - NOT USED - GLITCHED
			//4000120h - Serial Data A (R/W)
		case 0x4000120:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_A0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000121h - Serial Data A (R/W)
		case 0x4000121:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_A1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000122h - Serial Data B (R/W)
		case 0x4000122:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_B0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000123h - Serial Data B (R/W)
		case 0x4000123:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_B1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000124h - Serial Data C (R/W)
		case 0x4000124:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_C0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000125h - Serial Data C (R/W)
		case 0x4000125:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_C1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000126h - Serial Data D (R/W)
		case 0x4000126:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_D0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000127h - Serial Data D (R/W)
		case 0x4000127:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_D1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000128h - SIOCNT - SIO Sub Mode Control (R/W)
		case 0x4000128:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIOCNT0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000129h - SIOCNT - SIO Sub Mode Control (R/W)
		case 0x4000129:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIOCNT1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//400012Ah - SIOMLT_SEND - Data Send Register (R/W)
		case 0x400012A:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA8_0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//400012Bh - SIOMLT_SEND - Data Send Register (R/W)
		case 0x400012B:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA8_1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//400012Ch through 400012Fh - NOT USED - GLITCHED
			//4000130h - KEYINPUT - Key Status (R)
			//4000131h - KEYINPUT - Key Status (R)
			//4000132h - KEYCNT - Key Interrupt Control (R/W)
		case 0x4000132:
			this.joypad.writeKeyControl8_0(data | 0);
			break;
			//4000133h - KEYCNT - Key Interrupt Control (R/W)
		case 0x4000133:
			this.joypad.writeKeyControl8_1(data | 0);
			break;
			//4000134h - RCNT (R/W) - Mode Selection
		case 0x4000134:
			this.IOCore.updateSerialClocking();
			this.serial.writeRCNT0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000135h - RCNT (R/W) - Mode Selection
		case 0x4000135:
			this.IOCore.updateSerialClocking();
			this.serial.writeRCNT1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000136h through 400013Fh - NOT USED - GLITCHED
			//4000140h - JOYCNT - JOY BUS Control Register (R/W)
		case 0x4000140:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYCNT(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000141h - JOYCNT - JOY BUS Control Register (R/W)
			//4000142h through 400014Fh - NOT USED - GLITCHED
			//4000150h - JoyBus Receive (R/W)
		case 0x4000150:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_RECV0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000151h - JoyBus Receive (R/W)
		case 0x4000151:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_RECV1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000152h - JoyBus Receive (R/W)
		case 0x4000152:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_RECV2(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000153h - JoyBus Receive (R/W)
		case 0x4000153:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_RECV3(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000154h - JoyBus Send (R/W)
		case 0x4000154:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_SEND0(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000155h - JoyBus Send (R/W)
		case 0x4000155:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_SEND1(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000156h - JoyBus Send (R/W)
		case 0x4000156:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_SEND2(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000157h - JoyBus Send (R/W)
		case 0x4000157:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_SEND3(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000158h - JoyBus Stat (R/W)
		case 0x4000158:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_STAT(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000159h through 40001FFh - NOT USED - GLITCHED
			//4000200h - IE - Interrupt Enable Register (R/W)
		case 0x4000200:
			this.irq.writeIE8_0(data | 0);
			break;
			//4000201h - IE - Interrupt Enable Register (R/W)
		case 0x4000201:
			this.irq.writeIE8_1(data | 0);
			break;
			//4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
		case 0x4000202:
			this.irq.writeIF8_0(data | 0);
			break;
			//4000203h - IF - Interrupt Request Flags / IRQ Acknowledge
		case 0x4000203:
			this.irq.writeIF8_1(data | 0);
			break;
			//4000204h - WAITCNT - Waitstate Control (R/W)
		case 0x4000204:
			this.wait.writeWAITCNT0(data & 0xFF);
			break;
			//4000205h - WAITCNT - Waitstate Control (R/W)
		case 0x4000205:
			this.wait.writeWAITCNT1(data & 0xFF);
			break;
			//4000206h - WAITCNT - Waitstate Control (R/W)
			//4000207h - WAITCNT - Waitstate Control (R/W)
			//4000208h - IME - Interrupt Master Enable Register (R/W)
		case 0x4000208:
			this.irq.writeIME(data | 0);
			break;
			//4000209h through 40002FFh - NOT USED - GLITCHED
			//4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
		case 0x4000300:
			this.wait.writePOSTBOOT(data & 0xFF);
			break;
			//4000301h - HALTCNT - BYTE - Undocumented - Low Power Mode Control (W)
		case 0x4000301:
			this.wait.writeHALTCNT(data & 0xFF);
			break;
		default:
			if ((address & 0xFFFC) == 0x800) {
				//WRAM wait state control:
				this.wait.writeConfigureWRAM8(address | 0, data & 0xFF);
			}
	}
}
GameBoyAdvanceMemory.prototype.writeIODispatch16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.singleClock();
	switch (address & -2) {
		//4000000h - DISPCNT - LCD Control (Read/Write)
		case 0x4000000:
			this.gfxRenderer.writeDISPCNT16(data | 0);
			break;
			//4000002h - Undocumented - Green Swap (R/W)
		case 0x4000002:
			this.gfxRenderer.writeDISPCNT8_2(data | 0);
			break;
			//4000004h - DISPSTAT - General LCD Status (Read/Write)
		case 0x4000004:
			this.gfxState.writeDISPSTAT16(data | 0);
			break;
			//4000006h - VCOUNT - Vertical Counter (Read only)
			//4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
		case 0x4000008:
			this.gfxRenderer.writeBG0CNT16(data | 0);
			break;
			//400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
		case 0x400000A:
			this.gfxRenderer.writeBG1CNT16(data | 0);
			break;
			//400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
		case 0x400000C:
			this.gfxRenderer.writeBG2CNT16(data | 0);
			break;
			//400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
		case 0x400000E:
			this.gfxRenderer.writeBG3CNT16(data | 0);
			break;
			//4000010h - BG0HOFS - BG0 X-Offset (W)
		case 0x4000010:
			this.gfxRenderer.writeBG0HOFS16(data | 0);
			break;
			//4000012h - BG0VOFS - BG0 Y-Offset (W)
		case 0x4000012:
			this.gfxRenderer.writeBG0VOFS16(data | 0);
			break;
			//4000014h - BG1HOFS - BG1 X-Offset (W)
		case 0x4000014:
			this.gfxRenderer.writeBG1HOFS16(data | 0);
			break;
			//4000016h - BG1VOFS - BG1 Y-Offset (W)
		case 0x4000016:
			this.gfxRenderer.writeBG1VOFS16(data | 0);
			break;
			//4000018h - BG2HOFS - BG2 X-Offset (W)
		case 0x4000018:
			this.gfxRenderer.writeBG2HOFS16(data | 0);
			break;
			//400001Ah - BG2VOFS - BG2 Y-Offset (W)
		case 0x400001A:
			this.gfxRenderer.writeBG2VOFS16(data | 0);
			break;
			//400001Ch - BG3HOFS - BG3 X-Offset (W)
		case 0x400001C:
			this.gfxRenderer.writeBG3HOFS16(data | 0);
			break;
			//400001Eh - BG3VOFS - BG3 Y-Offset (W)
		case 0x400001E:
			this.gfxRenderer.writeBG3VOFS16(data | 0);
			break;
			//4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
		case 0x4000020:
			this.gfxRenderer.writeBG2PA16(data | 0);
			break;
			//4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
		case 0x4000022:
			this.gfxRenderer.writeBG2PB16(data | 0);
			break;
			//4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
		case 0x4000024:
			this.gfxRenderer.writeBG2PC16(data | 0);
			break;
			//4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
		case 0x4000026:
			this.gfxRenderer.writeBG2PD16(data | 0);
			break;
			//4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
		case 0x4000028:
			this.gfxRenderer.writeBG2X16_0(data | 0);
			break;
			//400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
		case 0x400002A:
			this.gfxRenderer.writeBG2X16_1(data | 0);
			break;
			//400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
		case 0x400002C:
			this.gfxRenderer.writeBG2Y16_0(data | 0);
			break;
			//400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
		case 0x400002E:
			this.gfxRenderer.writeBG2Y16_1(data | 0);
			break;
			//4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
		case 0x4000030:
			this.gfxRenderer.writeBG3PA16(data | 0);
			break;
			//4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
		case 0x4000032:
			this.gfxRenderer.writeBG3PB16(data | 0);
			break;
			//4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
		case 0x4000034:
			this.gfxRenderer.writeBG3PC16(data | 0);
			break;
			//4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
		case 0x4000036:
			this.gfxRenderer.writeBG3PD16(data | 0);
			break;
			//4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
		case 0x4000038:
			this.gfxRenderer.writeBG3X16_0(data | 0);
			break;
			//400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
		case 0x400003A:
			this.gfxRenderer.writeBG3X16_1(data | 0);
			break;
			//400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
		case 0x400003C:
			this.gfxRenderer.writeBG3Y16_0(data | 0);
			break;
			//400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
		case 0x400003E:
			this.gfxRenderer.writeBG3Y16_1(data | 0);
			break;
			//4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
		case 0x4000040:
			this.gfxRenderer.writeWIN0XCOORD16(data | 0);
			break;
			//4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
		case 0x4000042:
			this.gfxRenderer.writeWIN1XCOORD16(data | 0);
			break;
			//4000044h - WIN0V - Window 0 Vertical Dimensions (W)
		case 0x4000044:
			this.gfxRenderer.writeWIN0YCOORD16(data | 0);
			break;
			//4000046h - WIN1V - Window 1 Vertical Dimensions (W)
		case 0x4000046:
			this.gfxRenderer.writeWIN1YCOORD16(data | 0);
			break;
			//4000048h - WININ - Control of Inside of Window(s) (R/W)
		case 0x4000048:
			this.gfxRenderer.writeWININ16(data | 0);
			break;
			//400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
		case 0x400004A:
			this.gfxRenderer.writeWINOUT16(data | 0);
			break;
			//400004Ch - MOSAIC - Mosaic Size (W)
		case 0x400004C:
			this.gfxRenderer.writeMOSAIC16(data | 0);
			break;
			//400004Eh - NOT USED - ZERO
			//4000050h - BLDCNT - Color Special Effects Selection (R/W)
		case 0x4000050:
			this.gfxRenderer.writeBLDCNT16(data | 0);
			break;
			//4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
		case 0x4000052:
			this.gfxRenderer.writeBLDALPHA16(data | 0);
			break;
			//4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
		case 0x4000054:
			this.gfxRenderer.writeBLDY8(data | 0);
			break;
			//4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
			//4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
		case 0x4000060:
			//NR10:
			this.sound.writeSOUND1CNT8_0(data | 0);
			break;
			//4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
		case 0x4000062:
			this.sound.writeSOUND1CNT16(data | 0);
			break;
			//4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
		case 0x4000064:
			//NR13:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND1CNT_X0(data & 0xFF);
			//NR14:
			this.sound.writeSOUND1CNT_X1((data >> 8) & 0xFF);
			break;
			//4000066h - NOT USED - ZERO
			//4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
		case 0x4000068:
			//NR21:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND2CNT_L0(data & 0xFF);
			//NR22:
			this.sound.writeSOUND2CNT_L1((data >> 8) & 0xFF);
			break;
			//400006Ah - NOT USED - ZERO
			//400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
		case 0x400006C:
			//NR23:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND2CNT_H0(data & 0xFF);
			//NR24:
			this.sound.writeSOUND2CNT_H1((data >> 8) & 0xFF);
			break;
			//400006Eh - NOT USED - ZERO
			//4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
		case 0x4000070:
			//NR30:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_L(data & 0xFF);
			break;
			//4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
		case 0x4000072:
			//NR31:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_H0(data & 0xFF);
			//NR32:
			this.sound.writeSOUND3CNT_H1((data >> 8) & 0xFF);
			break;
			//4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
		case 0x4000074:
			//NR33:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_X0(data & 0xFF);
			//NR34:
			this.sound.writeSOUND3CNT_X1((data >> 8) & 0xFF);
			break;
			//4000076h - NOT USED - ZERO
			//4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
		case 0x4000078:
			//NR41:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND4CNT_L0(data & 0xFF);
			//NR42:
			this.sound.writeSOUND4CNT_L1((data >> 8) & 0xFF);
			break;
			//400007Ah - NOT USED - ZERO
			//400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
		case 0x400007C:
			//NR43:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND4CNT_H0(data & 0xFF);
			//NR44:
			this.sound.writeSOUND4CNT_H1((data >> 8) & 0xFF);
			break;
			//400007Eh - NOT USED - ZERO
			//4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
		case 0x4000080:
			//NR50:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_L0(data & 0xFF);
			//NR51:
			this.sound.writeSOUNDCNT_L1((data >> 8) & 0xFF);
			break;
			//4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
		case 0x4000082:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_H0(data & 0xFF);
			this.sound.writeSOUNDCNT_H1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
		case 0x4000084:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_X(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000086h - NOT USED - ZERO
			//4000088h - SOUNDBIAS - Sound PWM Control (R/W)
		case 0x4000088:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDBIAS0(data & 0xFF);
			this.sound.writeSOUNDBIAS1((data >> 8) & 0xFF);
			break;
			//400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
			//4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000090:
			//4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000092:
			//4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000094:
			//4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000096:
			//4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000098:
			//400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009A:
			//400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009C:
			//400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009E:
			this.sound.writeWAVE16(address & 0xF, data | 0);
			break;
			//40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
		case 0x40000A0:
			//40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
		case 0x40000A2:
			this.sound.writeFIFOA16(data | 0);
			break;
			//40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
		case 0x40000A4:
			//40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
		case 0x40000A6:
			this.sound.writeFIFOB16(data | 0);
			break;
			//40000A8h through 40000AFh - NOT USED - GLITCHED
			//40000B0h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
		case 0x40000B0:
			this.dmaChannel0.writeDMASource16_0(data | 0);
			break;
			//40000B2h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
		case 0x40000B2:
			this.dmaChannel0.writeDMASource16_1(data | 0);
			break;
			//40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
		case 0x40000B4:
			this.dmaChannel0.writeDMADestination16_0(data | 0);
			break;
			//40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
		case 0x40000B6:
			this.dmaChannel0.writeDMADestination16_1(data | 0);
			break;
			//40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
		case 0x40000B8:
			this.dmaChannel0.writeDMAWordCount16(data | 0);
			break;
			//40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
		case 0x40000BA:
			this.dmaChannel0.writeDMAControl16(data | 0);
			break;
			//40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
		case 0x40000BC:
			this.dmaChannel1.writeDMASource16_0(data | 0);
			break;
			//40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
		case 0x40000BE:
			this.dmaChannel1.writeDMASource16_1(data | 0);
			break;
			//40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
		case 0x40000C0:
			this.dmaChannel1.writeDMADestination16_0(data | 0);
			break;
			//40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
		case 0x40000C2:
			this.dmaChannel1.writeDMADestination16_1(data | 0);
			break;
			//40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
		case 0x40000C4:
			this.dmaChannel1.writeDMAWordCount16(data | 0);
			break;
			//40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
		case 0x40000C6:
			this.dmaChannel1.writeDMAControl16(data | 0);
			break;
			//40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
		case 0x40000C8:
			this.dmaChannel2.writeDMASource16_0(data | 0);
			break;
			//40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
		case 0x40000CA:
			this.dmaChannel2.writeDMASource16_1(data | 0);
			break;
			//40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
		case 0x40000CC:
			this.dmaChannel2.writeDMADestination16_0(data | 0);
			break;
			//40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
		case 0x40000CE:
			this.dmaChannel2.writeDMADestination16_1(data | 0);
			break;
			//40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
		case 0x40000D0:
			this.dmaChannel2.writeDMAWordCount16(data | 0);
			break;
			//40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
		case 0x40000D2:
			this.dmaChannel2.writeDMAControl16(data | 0);
			break;
			//40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
		case 0x40000D4:
			this.dmaChannel3.writeDMASource16_0(data | 0);
			break;
			//40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
		case 0x40000D6:
			this.dmaChannel3.writeDMASource16_1(data | 0);
			break;
			//40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
		case 0x40000D8:
			this.dmaChannel3.writeDMADestination16_0(data | 0);
			break;
			//40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
		case 0x40000DA:
			this.dmaChannel3.writeDMADestination16_1(data | 0);
			break;
			//40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
		case 0x40000DC:
			this.dmaChannel3.writeDMAWordCount16(data | 0);
			break;
			//40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
		case 0x40000DE:
			this.dmaChannel3.writeDMAControl16(data | 0);
			break;
			//40000E0h through 40000FFh - NOT USED - GLITCHED
			//4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
		case 0x4000100:
			this.timer.writeTM0CNT16(data | 0);
			break;
			//4000102h - TM0CNT_H - Timer 0 Control (R/W)
		case 0x4000102:
			this.timer.writeTM0CNT8_2(data | 0);
			break;
			//4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
		case 0x4000104:
			this.timer.writeTM1CNT16(data | 0);
			break;
			//4000106h - TM1CNT_H - Timer 1 Control (R/W)
		case 0x4000106:
			this.timer.writeTM1CNT8_2(data | 0);
			break;
			//4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
		case 0x4000108:
			this.timer.writeTM2CNT16(data | 0);
			break;
			//400010Ah - TM2CNT_H - Timer 2 Control (R/W)
		case 0x400010A:
			this.timer.writeTM2CNT8_2(data | 0);
			break;
			//400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
		case 0x400010C:
			this.timer.writeTM3CNT16(data | 0);
			break;
			//400010Eh - TM3CNT_H - Timer 3 Control (R/W)
		case 0x400010E:
			this.timer.writeTM3CNT8_2(data | 0);
			break;
			//4000110h through 400011Fh - NOT USED - GLITCHED
			//4000120h - Serial Data A (R/W)
		case 0x4000120:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_A0(data & 0xFF);
			this.serial.writeSIODATA_A1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000122h - Serial Data B (R/W)
		case 0x4000122:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_B0(data & 0xFF);
			this.serial.writeSIODATA_B1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000124h - Serial Data C (R/W)
		case 0x4000124:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_C0(data & 0xFF);
			this.serial.writeSIODATA_C1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000126h - Serial Data D (R/W)
		case 0x4000126:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_D0(data & 0xFF);
			this.serial.writeSIODATA_D1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000128h - SIOCNT - SIO Sub Mode Control (R/W)
		case 0x4000128:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIOCNT0(data & 0xFF);
			this.serial.writeSIOCNT1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//400012Ah - SIOMLT_SEND - Data Send Register (R/W)
		case 0x400012A:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA8_0(data & 0xFF);
			this.serial.writeSIODATA8_1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//400012Ch through 400012Fh - NOT USED - GLITCHED
			//4000130h - KEYINPUT - Key Status (R)
			//4000132h - KEYCNT - Key Interrupt Control (R/W)
		case 0x4000132:
			this.joypad.writeKeyControl16(data | 0);
			break;
			//4000134h - RCNT (R/W) - Mode Selection
		case 0x4000134:
			this.IOCore.updateSerialClocking();
			this.serial.writeRCNT0(data & 0xFF);
			this.serial.writeRCNT1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000136h through 400013Fh - NOT USED - GLITCHED
			//4000140h - JOYCNT - JOY BUS Control Register (R/W)
		case 0x4000140:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYCNT(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000142h through 400014Fh - NOT USED - GLITCHED
			//4000150h - JoyBus Receive (R/W)
		case 0x4000150:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_RECV0(data & 0xFF);
			this.serial.writeJOYBUS_RECV1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000152h - JoyBus Receive (R/W)
		case 0x4000152:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_RECV2(data & 0xFF);
			this.serial.writeJOYBUS_RECV3((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000154h - JoyBus Send (R/W)
		case 0x4000154:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_SEND0(data & 0xFF);
			this.serial.writeJOYBUS_SEND1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000156h - JoyBus Send (R/W)
		case 0x4000156:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_SEND2(data & 0xFF);
			this.serial.writeJOYBUS_SEND3((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000158h - JoyBus Stat (R/W)
		case 0x4000158:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_STAT(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000159h through 40001FFh - NOT USED - GLITCHED
			//4000200h - IE - Interrupt Enable Register (R/W)
		case 0x4000200:
			this.irq.writeIE16(data | 0);
			break;
			//4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
		case 0x4000202:
			this.irq.writeIF16(data | 0);
			break;
			//4000204h - WAITCNT - Waitstate Control (R/W)
		case 0x4000204:
			this.wait.writeWAITCNT0(data & 0xFF);
			this.wait.writeWAITCNT1((data >> 8) & 0xFF);
			break;
			//4000206h - WAITCNT - Waitstate Control (R/W)
			//4000208h - IME - Interrupt Master Enable Register (R/W)
		case 0x4000208:
			this.irq.writeIME(data | 0);
			break;
			//4000209h through 40002FFh - NOT USED - GLITCHED
			//4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
		case 0x4000300:
			this.wait.writePOSTBOOT(data & 0xFF);
			this.wait.writeHALTCNT((data >> 8) & 0xFF);
			break;
		default:
			if ((address & 0xFFFC) == 0x800) {
				//WRAM wait state control:
				this.wait.writeConfigureWRAM16(address | 0, data & 0xFFFF);
			}
	}
}
GameBoyAdvanceMemory.prototype.writeIODispatch32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.singleClock();
	switch (address & -4) {
		//4000000h - DISPCNT - LCD Control (Read/Write)
		//4000002h - Undocumented - Green Swap (R/W)
		case 0x4000000:
			this.gfxRenderer.writeDISPCNT32(data | 0);
			break;
			//4000004h - DISPSTAT - General LCD Status (Read/Write)
			//4000006h - VCOUNT - Vertical Counter (Read only)
		case 0x4000004:
			this.gfxState.writeDISPSTAT16(data | 0);
			break;
			//4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
			//400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
		case 0x4000008:
			this.gfxRenderer.writeBG0BG1CNT32(data | 0);
			break;
			//400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
			//400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
		case 0x400000C:
			this.gfxRenderer.writeBG2BG3CNT32(data | 0);
			break;
			//4000010h - BG0HOFS - BG0 X-Offset (W)
			//4000012h - BG0VOFS - BG0 Y-Offset (W)
		case 0x4000010:
			this.gfxRenderer.writeBG0OFS32(data | 0);
			break;
			//4000014h - BG1HOFS - BG1 X-Offset (W)
			//4000016h - BG1VOFS - BG1 Y-Offset (W)
		case 0x4000014:
			this.gfxRenderer.writeBG1OFS32(data | 0);
			break;
			//4000018h - BG2HOFS - BG2 X-Offset (W)
			//400001Ah - BG2VOFS - BG2 Y-Offset (W)
		case 0x4000018:
			this.gfxRenderer.writeBG2OFS32(data | 0);
			break;
			//400001Ch - BG3HOFS - BG3 X-Offset (W)
			//400001Eh - BG3VOFS - BG3 Y-Offset (W)
		case 0x400001C:
			this.gfxRenderer.writeBG3OFS32(data | 0);
			break;
			//4000020h - BG2PA - BG2 Rotation/Scaling Parameter A (alias dx) (W)
			//4000022h - BG2PB - BG2 Rotation/Scaling Parameter B (alias dmx) (W)
		case 0x4000020:
			this.gfxRenderer.writeBG2PAB32(data | 0);
			break;
			//4000024h - BG2PC - BG2 Rotation/Scaling Parameter C (alias dy) (W)
			//4000026h - BG2PD - BG2 Rotation/Scaling Parameter D (alias dmy) (W)
		case 0x4000024:
			this.gfxRenderer.writeBG2PCD32(data | 0);
			break;
			//4000028h - BG2X_L - BG2 Reference Point X-Coordinate, lower 16 bit (W)
			//400002Ah - BG2X_H - BG2 Reference Point X-Coordinate, upper 12 bit (W)
		case 0x4000028:
			this.gfxRenderer.writeBG2X32(data | 0);
			break;
			//400002Ch - BG2Y_L - BG2 Reference Point Y-Coordinate, lower 16 bit (W)
			//400002Eh - BG2Y_H - BG2 Reference Point Y-Coordinate, upper 12 bit (W)
		case 0x400002C:
			this.gfxRenderer.writeBG2Y32(data | 0);
			break;
			//4000030h - BG3PA - BG3 Rotation/Scaling Parameter A (alias dx) (W)
			//4000032h - BG3PB - BG3 Rotation/Scaling Parameter B (alias dmx) (W)
		case 0x4000030:
			this.gfxRenderer.writeBG3PAB32(data | 0);
			break;
			//4000034h - BG3PC - BG3 Rotation/Scaling Parameter C (alias dy) (W)
			//4000036h - BG3PD - BG3 Rotation/Scaling Parameter D (alias dmy) (W)
		case 0x4000034:
			this.gfxRenderer.writeBG3PCD32(data | 0);
			break;
			//4000038h - BG3X_L - BG3 Reference Point X-Coordinate, lower 16 bit (W)
			//400003Ah - BG3X_H - BG3 Reference Point X-Coordinate, upper 12 bit (W)
		case 0x4000038:
			this.gfxRenderer.writeBG3X32(data | 0);
			break;
			//400003Ch - BG3Y_L - BG3 Reference Point Y-Coordinate, lower 16 bit (W)
			//400003Eh - BG3Y_H - BG3 Reference Point Y-Coordinate, upper 12 bit (W)
		case 0x400003C:
			this.gfxRenderer.writeBG3Y32(data | 0);
			break;
			//4000040h - WIN0H - Window 0 Horizontal Dimensions (W)
			//4000042h - WIN1H - Window 1 Horizontal Dimensions (W)
		case 0x4000040:
			this.gfxRenderer.writeWINXCOORD32(data | 0);
			break;
			//4000044h - WIN0V - Window 0 Vertical Dimensions (W)
			//4000046h - WIN1V - Window 1 Vertical Dimensions (W)
		case 0x4000044:
			this.gfxRenderer.writeWINYCOORD32(data | 0);
			break;
			//4000048h - WININ - Control of Inside of Window(s) (R/W)
			//400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
		case 0x4000048:
			this.gfxRenderer.writeWINCONTROL32(data | 0);
			break;
			//400004Ch - MOSAIC - Mosaic Size (W)
			//400004Eh - NOT USED - ZERO
		case 0x400004C:
			this.gfxRenderer.writeMOSAIC16(data | 0);
			break;
			//4000050h - BLDCNT - Color Special Effects Selection (R/W)
			//4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
		case 0x4000050:
			this.gfxRenderer.writeBLDCNT32(data | 0);
			break;
			//4000054h - BLDY - Brightness (Fade-In/Out) Coefficient (W)
		case 0x4000054:
			this.gfxRenderer.writeBLDY8(data | 0);
			break;
			//4000055h through 400005Fh - NOT USED - ZERO/GLITCHED
			//4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
			//4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
		case 0x4000060:
			//NR10:
			this.sound.writeSOUND1CNT32(data | 0);
			break;
			//4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
			//4000066h - NOT USED - ZERO
		case 0x4000064:
			//NR13:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND1CNT_X0(data & 0xFF);
			//NR14:
			this.sound.writeSOUND1CNT_X1((data >> 8) & 0xFF);
			break;
			//4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
			//400006Ah - NOT USED - ZERO
		case 0x4000068:
			//NR21:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND2CNT_L0(data & 0xFF);
			//NR22:
			this.sound.writeSOUND2CNT_L1((data >> 8) & 0xFF);
			break;
			//400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
			//400006Eh - NOT USED - ZERO
		case 0x400006C:
			//NR23:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND2CNT_H0(data & 0xFF);
			//NR24:
			this.sound.writeSOUND2CNT_H1((data >> 8) & 0xFF);
			break;
			//4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
			//4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
		case 0x4000070:
			//NR30:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_L(data & 0xFF);
			//NR31:
			this.sound.writeSOUND3CNT_H0((data >> 16) & 0xFF);
			//NR32:
			this.sound.writeSOUND3CNT_H1(data >>> 24);
			break;
			//4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
			//4000076h - NOT USED - ZERO
		case 0x4000074:
			//NR33:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND3CNT_X0(data & 0xFF);
			//NR34:
			this.sound.writeSOUND3CNT_X1((data >> 8) & 0xFF);
			break;
			//4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
			//400007Ah - NOT USED - ZERO
		case 0x4000078:
			//NR41:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND4CNT_L0(data & 0xFF);
			//NR42:
			this.sound.writeSOUND4CNT_L1((data >> 8) & 0xFF);
			break;
			//400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
			//400007Eh - NOT USED - ZERO
		case 0x400007C:
			//NR43:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUND4CNT_H0(data & 0xFF);
			//NR44:
			this.sound.writeSOUND4CNT_H1((data >> 8) & 0xFF);
			break;
			//4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
			//4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
		case 0x4000080:
			//NR50:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_L0(data & 0xFF);
			//NR51:
			this.sound.writeSOUNDCNT_L1((data >> 8) & 0xFF);
			this.sound.writeSOUNDCNT_H0((data >> 16) & 0xFF);
			this.sound.writeSOUNDCNT_H1(data >>> 24);
			this.IOCore.updateCoreEventTime();
			break;
			//4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
			//4000086h - NOT USED - ZERO
		case 0x4000084:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDCNT_X(data & 0xFF);
			break;
			//4000088h - SOUNDBIAS - Sound PWM Control (R/W)
		case 0x4000088:
			this.IOCore.updateTimerClocking();
			this.sound.writeSOUNDBIAS0(data & 0xFF);
			this.sound.writeSOUNDBIAS1((data >> 8) & 0xFF);
			break;
			//400008Ah through 400008Fh - NOT USED - ZERO/GLITCHED
			//4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
			//4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000090:
			//4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
			//4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000094:
			//4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
			//400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000098:
			//400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
			//400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009C:
			this.sound.writeWAVE32(address & 0xF, data | 0);
			break;
			//40000A0h - FIFO_A_L - FIFO Channel A First Word (W)
			//40000A2h - FIFO_A_H - FIFO Channel A Second Word (W)
		case 0x40000A0:
			this.sound.writeFIFOA32(data | 0);
			break;
			//40000A4h - FIFO_B_L - FIFO Channel B First Word (W)
			//40000A6h - FIFO_B_H - FIFO Channel B Second Word (W)
		case 0x40000A4:
			this.sound.writeFIFOB32(data | 0);
			break;
			//40000A8h through 40000AFh - NOT USED - GLITCHED
			//40000B0h - DMA0SAH - DMA 0 Source Address (W) (internal memory)
			//40000B2h - DMA0SAD - DMA 0 Source Address (W) (internal memory)
		case 0x40000B0:
			this.dmaChannel0.writeDMASource32(data | 0);
			break;
			//40000B4h - DMA0DAD - DMA 0 Destination Address (W) (internal memory)
			//40000B6h - DMA0DAH - DMA 0 Destination Address (W) (internal memory)
		case 0x40000B4:
			this.dmaChannel0.writeDMADestination32(data | 0);
			break;
			//40000B8h - DMA0CNT_L - DMA 0 Word Count (W) (14 bit, 1..4000h)
			//40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
		case 0x40000B8:
			this.dmaChannel0.writeDMAControl32(data | 0);
			break;
			//40000BCh - DMA1SAD - DMA 1 Source Address (W) (internal memory)
			//40000BEh - DMA1SAH - DMA 1 Source Address (W) (internal memory)
		case 0x40000BC:
			this.dmaChannel1.writeDMASource32(data | 0);
			break;
			//40000C0h - DMA1DAD - DMA 1 Destination Address (W) (internal memory)
			//40000C2h - DMA1DAH - DMA 1 Destination Address (W) (internal memory)
		case 0x40000C0:
			this.dmaChannel1.writeDMADestination32(data | 0);
			break;
			//40000C4h - DMA1CNT_L - DMA 1 Word Count (W) (14 bit, 1..4000h)
			//40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
		case 0x40000C4:
			this.dmaChannel1.writeDMAControl32(data | 0);
			break;
			//40000C8h - DMA2SAD - DMA 2 Source Address (W) (internal memory)
			//40000CAh - DMA2SAH - DMA 2 Source Address (W) (internal memory)
		case 0x40000C8:
			this.dmaChannel2.writeDMASource32(data | 0);
			break;
			//40000CCh - DMA2DAD - DMA 2 Destination Address (W) (internal memory)
			//40000CEh - DMA2DAH - DMA 2 Destination Address (W) (internal memory)
		case 0x40000CC:
			this.dmaChannel2.writeDMADestination32(data | 0);
			break;
			//40000D0h - DMA2CNT_L - DMA 2 Word Count (W) (14 bit, 1..4000h)
			//40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
		case 0x40000D0:
			this.dmaChannel2.writeDMAControl32(data | 0);
			break;
			//40000D4h - DMA3SAD - DMA 3 Source Address (W) (internal memory)
			//40000D6h - DMA3SAH - DMA 3 Source Address (W) (internal memory)
		case 0x40000D4:
			this.dmaChannel3.writeDMASource32(data | 0);
			break;
			//40000D8h - DMA3DAD - DMA 3 Destination Address (W) (internal memory)
			//40000DAh - DMA3DAH - DMA 3 Destination Address (W) (internal memory)
		case 0x40000D8:
			this.dmaChannel3.writeDMADestination32(data | 0);
			break;
			//40000DCh - DMA3CNT_L - DMA 3 Word Count (W) (16 bit, 1..10000h)
			//40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
		case 0x40000DC:
			this.dmaChannel3.writeDMAControl32(data | 0);
			break;
			//40000E0h through 40000FFh - NOT USED - GLITCHED
			//4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
			//4000102h - TM0CNT_H - Timer 0 Control (R/W)
		case 0x4000100:
			this.timer.writeTM0CNT32(data | 0);
			break;
			//4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
			//4000106h - TM1CNT_H - Timer 1 Control (R/W)
		case 0x4000104:
			this.timer.writeTM1CNT32(data | 0);
			break;
			//4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
			//400010Ah - TM2CNT_H - Timer 2 Control (R/W)
		case 0x4000108:
			this.timer.writeTM2CNT32(data | 0);
			break;
			//400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
			//400010Eh - TM3CNT_H - Timer 3 Control (R/W)
		case 0x400010C:
			this.timer.writeTM3CNT32(data | 0);
			break;
			//4000110h through 400011Fh - NOT USED - GLITCHED
			//4000120h - Serial Data A (R/W)
			//4000122h - Serial Data B (R/W)
		case 0x4000120:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_A0(data & 0xFF);
			this.serial.writeSIODATA_A1((data >> 8) & 0xFF);
			this.serial.writeSIODATA_B0((data >> 16) & 0xFF);
			this.serial.writeSIODATA_B1(data >>> 24);
			this.IOCore.updateCoreEventTime();
			break;
			//4000124h - Serial Data C (R/W)
			//4000126h - Serial Data D (R/W)
		case 0x4000124:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIODATA_C0(data & 0xFF);
			this.serial.writeSIODATA_C1((data >> 8) & 0xFF);
			this.serial.writeSIODATA_D0((data >> 16) & 0xFF);
			this.serial.writeSIODATA_D1(data >>> 24);
			this.IOCore.updateCoreEventTime();
			break;
			//4000128h - SIOCNT - SIO Sub Mode Control (R/W)
			//400012Ah - SIOMLT_SEND - Data Send Register (R/W)
		case 0x4000128:
			this.IOCore.updateSerialClocking();
			this.serial.writeSIOCNT0(data & 0xFF);
			this.serial.writeSIOCNT1((data >> 8) & 0xFF);
			this.serial.writeSIODATA8_0((data >> 16) & 0xFF);
			this.serial.writeSIODATA8_1(data >>> 24);
			this.IOCore.updateCoreEventTime();
			break;
			//400012Ch through 400012Fh - NOT USED - GLITCHED
			//4000130h - KEYINPUT - Key Status (R)
			//4000132h - KEYCNT - Key Interrupt Control (R/W)
		case 0x4000130:
			this.joypad.writeKeyControl16(data >> 16);
			break;
			//4000134h - RCNT (R/W) - Mode Selection
		case 0x4000134:
			this.IOCore.updateSerialClocking();
			this.serial.writeRCNT0(data & 0xFF);
			this.serial.writeRCNT1((data >> 8) & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000136h through 400013Fh - NOT USED - GLITCHED
			//4000140h - JOYCNT - JOY BUS Control Register (R/W)
		case 0x4000140:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYCNT(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000142h through 400014Fh - NOT USED - GLITCHED
			//4000150h - JoyBus Receive (R/W)
			//4000152h - JoyBus Receive (R/W)
		case 0x4000150:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_RECV0(data & 0xFF);
			this.serial.writeJOYBUS_RECV1((data >> 8) & 0xFF);
			this.serial.writeJOYBUS_RECV2((data >> 16) & 0xFF);
			this.serial.writeJOYBUS_RECV3(data >>> 24);
			this.IOCore.updateCoreEventTime();
			break;
			//4000154h - JoyBus Send (R/W)
			//4000156h - JoyBus Send (R/W)
		case 0x4000154:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_SEND0(data & 0xFF);
			this.serial.writeJOYBUS_SEND1((data >> 8) & 0xFF);
			this.serial.writeJOYBUS_SEND2((data >> 16) & 0xFF);
			this.serial.writeJOYBUS_SEND3(data >>> 24);
			this.IOCore.updateCoreEventTime();
			break;
			//4000158h - JoyBus Stat (R/W)
		case 0x4000158:
			this.IOCore.updateSerialClocking();
			this.serial.writeJOYBUS_STAT(data & 0xFF);
			this.IOCore.updateCoreEventTime();
			break;
			//4000159h through 40001FFh - NOT USED - GLITCHED
			//4000200h - IE - Interrupt Enable Register (R/W)
			//4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
		case 0x4000200:
			this.irq.writeIRQ32(data | 0);
			break;
			//4000204h - WAITCNT - Waitstate Control (R/W)
			//4000206h - WAITCNT - Waitstate Control (R/W)
		case 0x4000204:
			this.wait.writeWAITCNT0(data & 0xFF);
			this.wait.writeWAITCNT1((data >> 8) & 0xFF);
			break;
			//4000208h - IME - Interrupt Master Enable Register (R/W)
		case 0x4000208:
			this.irq.writeIME(data | 0);
			break;
			//4000209h through 40002FFh - NOT USED - GLITCHED
			//4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
			//4000302h - NOT USED - ZERO
		case 0x4000300:
			this.wait.writePOSTBOOT(data & 0xFF);
			this.wait.writeHALTCNT((data >> 8) & 0xFF);
			break;
		default:
			if ((address & 0xFFFC) == 0x800) {
				//WRAM wait state control:
				this.wait.writeConfigureWRAM32(data | 0);
			}
	}
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceMemory.prototype.writeVRAM8Preliminary = function (address, data) {
		address = address | 0;
		data = data | 0;
		this.IOCore.updateGraphicsClocking();
		switch (address >> 24) {
			case 0x5:
				this.wait.VRAMAccess();
				this.gfxRenderer.writePalette16(address & 0x3FE, Math.imul(data & 0xFF, 0x101) | 0);
				break;
			case 0x6:
				this.wait.VRAMAccess();
				this.gfxRenderer.writeVRAM8(address | 0, data | 0);
				break;
			default:
				this.wait.OAMAccess();
		}
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceMemory.prototype.writeVRAM8Preliminary = function (address, data) {
		this.IOCore.updateGraphicsClocking();
		switch (address >> 24) {
			case 0x5:
				this.wait.VRAMAccess();
				this.gfxRenderer.writePalette16(address & 0x3FE, (data & 0xFF) * 0x101);
				break;
			case 0x6:
				this.wait.VRAMAccess();
				this.gfxRenderer.writeVRAM8(address, data);
				break;
			default:
				this.wait.OAMAccess();
		}
	}
}
GameBoyAdvanceMemory.prototype.writePalette16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.wait.VRAMAccess();
	this.gfxRenderer.writePalette16(address & 0x3FE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writeVRAM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.wait.VRAMAccess();
	this.gfxRenderer.writeVRAM16(address | 0, data | 0);
}
GameBoyAdvanceMemory.prototype.writeOBJ16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.wait.OAMAccess();
	this.gfxRenderer.writeOAM16(address & 0x3FE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writePalette32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.wait.VRAMAccess32();
	this.gfxRenderer.writePalette32(address & 0x3FC, data | 0);
}
GameBoyAdvanceMemory.prototype.writeVRAM32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.wait.VRAMAccess32();
	this.gfxRenderer.writeVRAM32(address | 0, data | 0);
}
GameBoyAdvanceMemory.prototype.writeOBJ32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.wait.OAMAccess();
	this.gfxRenderer.writeOAM32(address & 0x3FC, data | 0);
}
GameBoyAdvanceMemory.prototype.writeROM8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.ROMAccess(address | 0);
	this.cartridge.writeROM8(address & 0x1FFFFFF, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeROM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.ROMAccess(address | 0);
	this.cartridge.writeROM16(address & 0x1FFFFFE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writeROM16DMA = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.ROMAccess(address | 0);
	this.cartridge.writeROM16DMA(address & 0x1FFFFFE, data & 0xFFFF);
}
GameBoyAdvanceMemory.prototype.writeROM32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.ROMAccess32(address | 0);
	this.cartridge.writeROM32(address & 0x1FFFFFC, data | 0);
}
GameBoyAdvanceMemory.prototype.writeSRAM8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.SRAMAccess();
	this.saves.writeSRAM(address & 0xFFFF, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeSRAM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.SRAMAccess();
	this.saves.writeSRAM(address & 0xFFFE, (data >> ((address & 0x2) << 3)) & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeSRAM32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.wait.SRAMAccess();
	this.saves.writeSRAM(address & 0xFFFC, data & 0xFF);
}
GameBoyAdvanceMemory.prototype.writeUnused = function () {
	//Ignore the data write...
	this.wait.singleClock();
}
GameBoyAdvanceMemory.prototype.remapWRAM = function (data) {
	data = data & 0x21;
	if ((data | 0) != (this.WRAMControlFlags | 0)) {
		switch (data | 0) {
			case 0:
				//Mirror Internal RAM to External:
				this.memoryRead8 = this.memoryRead8Generated[0];
				this.memoryWrite8 = this.memoryWrite8Generated[0];
				this.memoryRead16 = this.memoryRead16Generated[0];
				this.memoryReadDMA16 = this.memoryReadDMA16Generated[0];
				this.memoryReadDMAFull16 = this.memoryReadDMA16FullGenerated[0];
				this.memoryReadCPU16 = this.memoryReadCPU16Generated[0];
				this.memoryWrite16 = this.memoryWrite16Generated[0];
				this.memoryWriteDMA16 = this.memoryWriteDMA16Generated[0];
				this.memoryWriteDMAFull16 = this.memoryWriteDMA16FullGenerated[0];
				this.memoryRead32 = this.memoryRead32Generated[0];
				this.memoryReadDMA32 = this.memoryReadDMA32Generated[0];
				this.memoryReadDMAFull32 = this.memoryReadDMA32FullGenerated[0];
				this.memoryReadCPU32 = this.memoryReadCPU32Generated[0];
				this.memoryWrite32 = this.memoryWrite32Generated[0];
				this.memoryWriteDMA32 = this.memoryWriteDMA32Generated[0];
				this.memoryWriteDMAFull32 = this.memoryWriteDMA32FullGenerated[0];
				break;
			case 0x20:
				//Use External RAM:
				this.memoryRead8 = this.memoryRead8Generated[1];
				this.memoryWrite8 = this.memoryWrite8Generated[1];
				this.memoryRead16 = this.memoryRead16Generated[1];
				this.memoryReadDMA16 = this.memoryReadDMA16Generated[1];
				this.memoryReadDMAFull16 = this.memoryReadDMA16FullGenerated[1];
				this.memoryReadCPU16 = this.memoryReadCPU16Generated[1];
				this.memoryWrite16 = this.memoryWrite16Generated[1];
				this.memoryWriteDMA16 = this.memoryWriteDMA16Generated[1];
				this.memoryWriteDMAFull16 = this.memoryWriteDMA16FullGenerated[1];
				this.memoryRead32 = this.memoryRead32Generated[1];
				this.memoryReadDMA32 = this.memoryReadDMA32Generated[1];
				this.memoryReadDMAFull32 = this.memoryReadDMA32FullGenerated[1];
				this.memoryReadCPU32 = this.memoryReadCPU32Generated[1];
				this.memoryWrite32 = this.memoryWrite32Generated[1];
				this.memoryWriteDMA32 = this.memoryWriteDMA32Generated[1];
				this.memoryWriteDMAFull32 = this.memoryWriteDMA32FullGenerated[1];
				break;
			default:
				//WRAM Disabled:
				this.memoryRead8 = this.memoryRead8Generated[2];
				this.memoryWrite8 = this.memoryWrite8Generated[2];
				this.memoryRead16 = this.memoryRead16Generated[2];
				this.memoryReadDMA16 = this.memoryReadDMA16Generated[2];
				this.memoryReadDMAFull16 = this.memoryReadDMA16FullGenerated[2];
				this.memoryReadCPU16 = this.memoryReadCPU16Generated[2];
				this.memoryWrite16 = this.memoryWrite16Generated[2];
				this.memoryWriteDMA16 = this.memoryWriteDMA16Generated[2];
				this.memoryWriteDMAFull16 = this.memoryWriteDMA16FullGenerated[2];
				this.memoryRead32 = this.memoryRead32Generated[2];
				this.memoryReadDMA32 = this.memoryReadDMA32Generated[2];
				this.memoryReadDMAFull32 = this.memoryReadDMA32FullGenerated[2];
				this.memoryReadCPU32 = this.memoryReadCPU32Generated[2];
				this.memoryWrite32 = this.memoryWrite32Generated[2];
				this.memoryWriteDMA32 = this.memoryWriteDMA32Generated[2];
				this.memoryWriteDMAFull32 = this.memoryWriteDMA32FullGenerated[2];
		}
		this.WRAMControlFlags = data | 0;
	}
}
GameBoyAdvanceMemory.prototype.readBIOS8 = function (address) {
	address = address | 0;
	var data = 0;
	this.wait.singleClock();
	if ((address | 0) < 0x4000) {
		if ((this.cpu.registers[15] | 0) < 0x4000) {
			//If reading from BIOS while executing it:
			data = this.BIOS[address & 0x3FFF] | 0;
		} else {
			//Not allowed to read from BIOS while executing outside of it:
			data = (this.lastBIOSREAD >> ((address & 0x3) << 3)) & 0xFF;
		}
	} else {
		data = this.readUnused8CPUBase(address | 0) | 0;
	}
	return data | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceMemory.prototype.readBIOS16 = function (address) {
		address = address | 0;
		var data = 0;
		this.wait.singleClock();
		if ((address | 0) < 0x4000) {
			address = address >> 1;
			if ((this.cpu.registers[15] | 0) < 0x4000) {
				//If reading from BIOS while executing it:
				data = this.BIOS16[address & 0x1FFF] | 0;
			} else {
				//Not allowed to read from BIOS while executing outside of it:
				data = (this.lastBIOSREAD >> ((address & 0x1) << 4)) & 0xFFFF;
			}
		} else {
			data = this.readUnused16CPUBase(address | 0) | 0;
		}
		return data | 0;
	}
	GameBoyAdvanceMemory.prototype.readBIOS16DMA = function (address) {
		address = address | 0;
		var data = 0;
		this.wait.singleClock();
		if ((address | 0) < 0x4000) {
			address = address >> 1;
			if ((this.cpu.registers[15] | 0) < 0x4000) {
				//If reading from BIOS while executing it:
				data = this.BIOS16[address & 0x1FFF] | 0;
			}
		} else {
			data = this.readUnused16DMABase(address | 0) | 0;
		}
		return data | 0;
	}
	GameBoyAdvanceMemory.prototype.readBIOS16CPU = function (address) {
		address = address | 0;
		var data = 0;
		this.IOCore.updateCoreSingle();
		if ((address | 0) < 0x4000) {
			address = address >> 1;
			//If reading from BIOS while executing it:
			data = this.BIOS16[address & 0x1FFF] | 0;
			this.lastBIOSREAD = data | 0;
		} else {
			data = this.readUnused16CPUBase(address | 0) | 0;
		}
		return data | 0;
	}
	GameBoyAdvanceMemory.prototype.readBIOS32 = function (address) {
		address = address | 0;
		var data = 0;
		this.wait.singleClock();
		if ((address | 0) < 0x4000) {
			address = address >> 2;
			if ((this.cpu.registers[15] | 0) < 0x4000) {
				//If reading from BIOS while executing it:
				data = this.BIOS32[address & 0xFFF] | 0;
			} else {
				//Not allowed to read from BIOS while executing outside of it:
				data = this.lastBIOSREAD | 0;
			}
		} else {
			data = this.cpu.getCurrentFetchValue() | 0;
		}
		return data | 0;
	}
	GameBoyAdvanceMemory.prototype.readBIOS32DMA = function (address) {
		address = address | 0;
		var data = 0;
		this.wait.singleClock();
		if ((address | 0) < 0x4000) {
			address = address >> 2;
			if ((this.cpu.registers[15] | 0) < 0x4000) {
				//If reading from BIOS while executing it:
				data = this.BIOS32[address & 0xFFF] | 0;
			}
		} else {
			data = this.dma.getCurrentFetchValue() | 0;
		}
		return data | 0;
	}
	GameBoyAdvanceMemory.prototype.readBIOS32CPU = function (address) {
		address = address | 0;
		var data = 0;
		this.IOCore.updateCoreSingle();
		if ((address | 0) < 0x4000) {
			address = address >> 2;
			//If reading from BIOS while executing it:
			data = this.BIOS32[address & 0xFFF] | 0;
			this.lastBIOSREAD = data | 0;
		} else {
			data = this.cpu.getCurrentFetchValue() | 0;
		}
		return data | 0;
	}
} else {
	GameBoyAdvanceMemory.prototype.readBIOS16 = function (address) {
		this.wait.singleClock();
		if (address < 0x4000) {
			if (this.cpu.registers[15] < 0x4000) {
				//If reading from BIOS while executing it:
				return this.BIOS[address & -2] | (this.BIOS[address | 1] << 8);
			} else {
				//Not allowed to read from BIOS while executing outside of it:
				return (this.lastBIOSREAD >> ((address & 0x2) << 3)) & 0xFFFF;
			}
		} else {
			return this.readUnused16CPUBase(address);
		}
	}
	GameBoyAdvanceMemory.prototype.readBIOS16DMA = function (address) {
		this.wait.singleClock();
		if (address < 0x4000) {
			if (this.cpu.registers[15] < 0x4000) {
				//If reading from BIOS while executing it:
				return this.BIOS[address & -2] | (this.BIOS[address | 1] << 8);
			} else {
				//Not allowed to read from BIOS while executing outside of it:
				return 0;
			}
		} else {
			return this.readUnused16DMABase(address);
		}
	}
	GameBoyAdvanceMemory.prototype.readBIOS16CPU = function (address) {
		this.IOCore.updateCoreSingle();
		if (address < 0x4000) {
			//If reading from BIOS while executing it:
			var data = this.BIOS[address & -2] | (this.BIOS[address | 1] << 8);
			this.lastBIOSREAD = data;
			return data;
		} else {
			return this.readUnused16CPUBase(address);
		}
	}
	GameBoyAdvanceMemory.prototype.readBIOS32 = function (address) {
		this.wait.singleClock();
		if (address < 0x4000) {
			if (this.cpu.registers[15] < 0x4000) {
				//If reading from BIOS while executing it:
				address &= -4;
				return this.BIOS[address] | (this.BIOS[address + 1] << 8) | (this.BIOS[address + 2] << 16) | (this.BIOS[address + 3] << 24);
			} else {
				//Not allowed to read from BIOS while executing outside of it:
				return this.lastBIOSREAD;
			}
		} else {
			return this.cpu.getCurrentFetchValue();
		}
	}
	GameBoyAdvanceMemory.prototype.readBIOS32DMA = function (address) {
		this.wait.singleClock();
		if (address < 0x4000) {
			if (this.cpu.registers[15] < 0x4000) {
				//If reading from BIOS while executing it:
				address &= -4;
				return this.BIOS[address] | (this.BIOS[address + 1] << 8) | (this.BIOS[address + 2] << 16) | (this.BIOS[address + 3] << 24);
			} else {
				//Not allowed to read from BIOS while executing outside of it:
				return 0;
			}
		} else {
			return this.dma.getCurrentFetchValue();
		}
	}
	GameBoyAdvanceMemory.prototype.readBIOS32CPU = function (address) {
		this.IOCore.updateCoreSingle();
		if (address < 0x4000) {
			//If reading from BIOS while executing it:
			address &= -4;
			var data = this.BIOS[address] | (this.BIOS[address + 1] << 8) | (this.BIOS[address + 2] << 16) | (this.BIOS[address + 3] << 24);
			this.lastBIOSREAD = data;
			return data;
		} else {
			return this.cpu.getCurrentFetchValue();
		}
	}
}
GameBoyAdvanceMemory.prototype.readExternalWRAM8 = function (address) {
	address = address | 0;
	//External WRAM:
	this.wait.WRAMAccess();
	return this.externalRAM[address & 0x3FFFF] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceMemory.prototype.readExternalWRAM16 = function (address) {
		address = address | 0;
		//External WRAM:
		this.wait.WRAMAccess();
		return this.externalRAM16[(address >> 1) & 0x1FFFF] | 0;
	}
	GameBoyAdvanceMemory.prototype.readExternalWRAM16CPU = function (address) {
		address = address | 0;
		//External WRAM:
		this.wait.WRAMAccess16CPU();
		return this.externalRAM16[(address >> 1) & 0x1FFFF] | 0;
	}
	GameBoyAdvanceMemory.prototype.readExternalWRAM32 = function (address) {
		address = address | 0;
		//External WRAM:
		this.wait.WRAMAccess32();
		return this.externalRAM32[(address >> 2) & 0xFFFF] | 0;
	}
	GameBoyAdvanceMemory.prototype.readExternalWRAM32CPU = function (address) {
		address = address | 0;
		//External WRAM:
		this.wait.WRAMAccess32CPU();
		return this.externalRAM32[(address >> 2) & 0xFFFF] | 0;
	}
} else {
	GameBoyAdvanceMemory.prototype.readExternalWRAM16 = function (address) {
		//External WRAM:
		this.wait.WRAMAccess();
		address &= 0x3FFFE;
		return this.externalRAM[address] | (this.externalRAM[address + 1] << 8);
	}
	GameBoyAdvanceMemory.prototype.readExternalWRAM16CPU = function (address) {
		//External WRAM:
		this.wait.WRAMAccess16CPU();
		address &= 0x3FFFE;
		return this.externalRAM[address] | (this.externalRAM[address + 1] << 8);
	}
	GameBoyAdvanceMemory.prototype.readExternalWRAM32 = function (address) {
		//External WRAM:
		this.wait.WRAMAccess32();
		address &= 0x3FFFC;
		return this.externalRAM[address] | (this.externalRAM[address + 1] << 8) | (this.externalRAM[address + 2] << 16) | (this.externalRAM[address + 3] << 24);
	}
	GameBoyAdvanceMemory.prototype.readExternalWRAM32CPU = function (address) {
		//External WRAM:
		this.wait.WRAMAccess32CPU();
		address &= 0x3FFFC;
		return this.externalRAM[address] | (this.externalRAM[address + 1] << 8) | (this.externalRAM[address + 2] << 16) | (this.externalRAM[address + 3] << 24);
	}
}
GameBoyAdvanceMemory.prototype.readInternalWRAM8 = function (address) {
	address = address | 0;
	//Internal WRAM:
	this.wait.singleClock();
	return this.internalRAM[address & 0x7FFF] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceMemory.prototype.readInternalWRAM16 = function (address) {
		address = address | 0;
		//Internal WRAM:
		this.wait.singleClock();
		return this.internalRAM16[(address >> 1) & 0x3FFF] | 0;
	}
	GameBoyAdvanceMemory.prototype.readInternalWRAM16CPU = function (address) {
		address = address | 0;
		//Internal WRAM:
		this.IOCore.updateCoreSingle();
		return this.internalRAM16[(address >> 1) & 0x3FFF] | 0;
	}
	GameBoyAdvanceMemory.prototype.readInternalWRAM32 = function (address) {
		address = address | 0;
		//Internal WRAM:
		this.wait.singleClock();
		return this.internalRAM32[(address >> 2) & 0x1FFF] | 0;
	}
	GameBoyAdvanceMemory.prototype.readInternalWRAM32CPU = function (address) {
		address = address | 0;
		//Internal WRAM:
		this.IOCore.updateCoreSingle();
		return this.internalRAM32[(address >> 2) & 0x1FFF] | 0;
	}
} else {
	GameBoyAdvanceMemory.prototype.readInternalWRAM16 = function (address) {
		//Internal WRAM:
		this.wait.singleClock();
		address &= 0x7FFE;
		return this.internalRAM[address] | (this.internalRAM[address + 1] << 8);
	}
	GameBoyAdvanceMemory.prototype.readInternalWRAM16CPU = function (address) {
		//Internal WRAM:
		this.IOCore.updateCoreSingle();
		address &= 0x7FFE;
		return this.internalRAM[address] | (this.internalRAM[address + 1] << 8);
	}
	GameBoyAdvanceMemory.prototype.readInternalWRAM32 = function (address) {
		//Internal WRAM:
		this.wait.singleClock();
		address &= 0x7FFC;
		return this.internalRAM[address] | (this.internalRAM[address + 1] << 8) | (this.internalRAM[address + 2] << 16) | (this.internalRAM[address + 3] << 24);
	}
	GameBoyAdvanceMemory.prototype.readInternalWRAM32CPU = function (address) {
		//Internal WRAM:
		this.IOCore.updateCoreSingle();
		address &= 0x7FFC;
		return this.internalRAM[address] | (this.internalRAM[address + 1] << 8) | (this.internalRAM[address + 2] << 16) | (this.internalRAM[address + 3] << 24);
	}
}
GameBoyAdvanceMemory.prototype.readIODispatch8 = function (address) {
	address = address | 0;
	this.wait.singleClock();
	var data = 0;
	switch (address | 0) {
		//4000000h - DISPCNT - LCD Control (Read/Write)
		case 0x4000000:
			data = this.gfxRenderer.readDISPCNT8_0() | 0;
			break;
			//4000001h - DISPCNT - LCD Control (Read/Write)
		case 0x4000001:
			data = this.gfxRenderer.readDISPCNT8_1() | 0;
			break;
			//4000002h - Undocumented - Green Swap (R/W)
		case 0x4000002:
			data = this.gfxRenderer.readDISPCNT8_2() | 0;
			break;
			//4000004h - DISPSTAT - General LCD Status (Read/Write)
		case 0x4000004:
			data = this.gfxState.readDISPSTAT8_0() | 0;
			break;
			//4000005h - DISPSTAT - General LCD Status (Read/Write)
		case 0x4000005:
			data = this.gfxState.readDISPSTAT8_1() | 0;
			break;
			//4000006h - VCOUNT - Vertical Counter (Read only)
		case 0x4000006:
			data = this.gfxState.readDISPSTAT8_2() | 0;
			break;
			//4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
		case 0x4000008:
			data = this.gfxRenderer.readBG0CNT8_0() | 0;
			break;
			//4000009h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
		case 0x4000009:
			data = this.gfxRenderer.readBG0CNT8_1() | 0;
			break;
			//400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
		case 0x400000A:
			data = this.gfxRenderer.readBG1CNT8_0() | 0;
			break;
			//400000Bh - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
		case 0x400000B:
			data = this.gfxRenderer.readBG1CNT8_1() | 0;
			break;
			//400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
		case 0x400000C:
			data = this.gfxRenderer.readBG2CNT8_0() | 0;
			break;
			//400000Dh - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
		case 0x400000D:
			data = this.gfxRenderer.readBG2CNT8_1() | 0;
			break;
			//400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
		case 0x400000E:
			data = this.gfxRenderer.readBG3CNT8_0() | 0;
			break;
			//400000Fh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
		case 0x400000F:
			data = this.gfxRenderer.readBG3CNT8_1() | 0;
			break;
			//4000010h through 4000047h - WRITE ONLY
			//4000048h - WININ - Control of Inside of Window(s) (R/W)
		case 0x4000048:
			data = this.gfxRenderer.readWIN0IN8() | 0;
			break;
			//4000049h - WININ - Control of Inside of Window(s) (R/W)
		case 0x4000049:
			data = this.gfxRenderer.readWIN1IN8() | 0;
			break;
			//400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
		case 0x400004A:
			data = this.gfxRenderer.readWINOUT8() | 0;
			break;
			//400004AB- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
		case 0x400004B:
			data = this.gfxRenderer.readWINOBJIN8() | 0;
			break;
			//4000050h - BLDCNT - Color Special Effects Selection (R/W)
		case 0x4000050:
			data = this.gfxRenderer.readBLDCNT8_0() | 0;
			break;
			//4000051h - BLDCNT - Color Special Effects Selection (R/W)
		case 0x4000051:
			data = this.gfxRenderer.readBLDCNT8_1() | 0;
			break;
			//4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
		case 0x4000052:
			data = this.gfxRenderer.readBLDALPHA8_0() | 0;
			break;
			//4000053h - BLDALPHA - Alpha Blending Coefficients (R/W)
		case 0x4000053:
			data = this.gfxRenderer.readBLDALPHA8_1() | 0;
			break;
			//4000054h through 400005Fh - NOT USED - GLITCHED
			//4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
		case 0x4000060:
			//NR10:
			data = this.sound.readSOUND1CNT8_0() | 0;
			break;
			//4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
		case 0x4000062:
			//NR11:
			data = this.sound.readSOUND1CNT8_2() | 0;
			break;
			//4000063h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
		case 0x4000063:
			//NR12:
			data = this.sound.readSOUND1CNT8_3() | 0;
			break;
			//4000065h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
		case 0x4000065:
			//NR14:
			data = this.sound.readSOUND1CNT_X() | 0;
			break;
			//4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
		case 0x4000068:
			//NR21:
			data = this.sound.readSOUND2CNT_L0() | 0;
			break;
			//4000069h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
		case 0x4000069:
			//NR22:
			data = this.sound.readSOUND2CNT_L1() | 0;
			break;
			//400006Dh - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
		case 0x400006D:
			//NR24:
			data = this.sound.readSOUND2CNT_H() | 0;
			break;
			//4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
		case 0x4000070:
			//NR30:
			data = this.sound.readSOUND3CNT_L() | 0;
			break;
			//4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
		case 0x4000073:
			//NR32:
			data = this.sound.readSOUND3CNT_H() | 0;
			break;
			//4000075h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
		case 0x4000075:
			//NR34:
			data = this.sound.readSOUND3CNT_X() | 0;
			break;
			//4000079h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
		case 0x4000079:
			//NR42:
			data = this.sound.readSOUND4CNT_L() | 0;
			break;
			//400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
		case 0x400007C:
			//NR43:
			data = this.sound.readSOUND4CNT_H0() | 0;
			break;
			//400007Dh - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
		case 0x400007D:
			//NR44:
			data = this.sound.readSOUND4CNT_H1() | 0;
			break;
			//4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
		case 0x4000080:
			//NR50:
			data = this.sound.readSOUNDCNT_L0() | 0;
			break;
			//4000081h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
		case 0x4000081:
			//NR51:
			data = this.sound.readSOUNDCNT_L1() | 0;
			break;
			//4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
		case 0x4000082:
			data = this.sound.readSOUNDCNT_H0() | 0;
			break;
			//4000083h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
		case 0x4000083:
			data = this.sound.readSOUNDCNT_H1() | 0;
			break;
			//4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
		case 0x4000084:
			this.IOCore.updateTimerClocking();
			data = this.sound.readSOUNDCNT_X() | 0;
			break;
			//4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
		case 0x4000088:
			data = this.sound.readSOUNDBIAS0() | 0;
			break;
			//4000089h - SOUNDBIAS - Sound PWM Control (R/W, see below)
		case 0x4000089:
			data = this.sound.readSOUNDBIAS1() | 0;
			break;
			//400008Ch - NOT USED - GLITCHED
			//400008Dh - NOT USED - GLITCHED
			//400008Eh - NOT USED - GLITCHED
			//400008Fh - NOT USED - GLITCHED
			//4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000090:
			//4000091h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000091:
			//4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000092:
			//4000093h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000093:
			//4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000094:
			//4000095h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000095:
			//4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000096:
			//4000097h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000097:
			//4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000098:
			//4000099h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000099:
			//400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009A:
			//400009Bh - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009B:
			//400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009C:
			//400009Dh - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009D:
			//400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009E:
			//400009Fh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009F:
			data = this.sound.readWAVE8(address & 0xF) | 0;
			break;
			//40000A0h through 40000B9h - WRITE ONLY
			//40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
		case 0x40000BA:
			data = this.dmaChannel0.readDMAControl8_0() | 0;
			break;
			//40000BBh - DMA0CNT_H - DMA 0 Control (R/W)
		case 0x40000BB:
			data = this.dmaChannel0.readDMAControl8_1() | 0;
			break;
			//40000BCh through 40000C5h - WRITE ONLY
			//40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
		case 0x40000C6:
			data = this.dmaChannel1.readDMAControl8_0() | 0;
			break;
			//40000C7h - DMA1CNT_H - DMA 1 Control (R/W)
		case 0x40000C7:
			data = this.dmaChannel1.readDMAControl8_1() | 0;
			break;
			//40000C8h through 40000D1h - WRITE ONLY
			//40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
		case 0x40000D2:
			data = this.dmaChannel2.readDMAControl8_0() | 0;
			break;
			//40000D3h - DMA2CNT_H - DMA 2 Control (R/W)
		case 0x40000D3:
			data = this.dmaChannel2.readDMAControl8_1() | 0;
			break;
			//40000D4h through 40000DDh - WRITE ONLY
			//40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
		case 0x40000DE:
			data = this.dmaChannel3.readDMAControl8_0() | 0;
			break;
			//40000DFh - DMA3CNT_H - DMA 3 Control (R/W)
		case 0x40000DF:
			data = this.dmaChannel3.readDMAControl8_1() | 0;
			break;
			//40000E0h through 40000FFh - NOT USED - GLITCHED
			//4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
		case 0x4000100:
			data = this.timer.readTM0CNT8_0() | 0;
			break;
			//4000101h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
		case 0x4000101:
			data = this.timer.readTM0CNT8_1() | 0;
			break;
			//4000102h - TM0CNT_H - Timer 0 Control (R/W)
		case 0x4000102:
			data = this.timer.readTM0CNT8_2() | 0;
			break;
			//4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
		case 0x4000104:
			data = this.timer.readTM1CNT8_0() | 0;
			break;
			//4000105h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
		case 0x4000105:
			data = this.timer.readTM1CNT8_1() | 0;
			break;
			//4000106h - TM1CNT_H - Timer 1 Control (R/W)
		case 0x4000106:
			data = this.timer.readTM1CNT8_2() | 0;
			break;
			//4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
		case 0x4000108:
			data = this.timer.readTM2CNT8_0() | 0;
			break;
			//4000109h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
		case 0x4000109:
			data = this.timer.readTM2CNT8_1() | 0;
			break;
			//400010Ah - TM2CNT_H - Timer 2 Control (R/W)
		case 0x400010A:
			data = this.timer.readTM2CNT8_2() | 0;
			break;
			//400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
		case 0x400010C:
			data = this.timer.readTM3CNT8_0() | 0;
			break;
			//400010Dh - TM3CNT_L - Timer 3 Counter/Reload (R/W)
		case 0x400010D:
			data = this.timer.readTM3CNT8_1() | 0;
			break;
			//400010Eh - TM3CNT_H - Timer 3 Control (R/W)
		case 0x400010E:
			data = this.timer.readTM3CNT8_2() | 0;
			break;
			//4000110h through 400011Fh - NOT USED - GLITCHED
			//4000120h - Serial Data A (R/W)
		case 0x4000120:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_A0() | 0;
			break;
			//4000121h - Serial Data A (R/W)
		case 0x4000121:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_A1() | 0;
			break;
			//4000122h - Serial Data B (R/W)
		case 0x4000122:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_B0() | 0;
			break;
			//4000123h - Serial Data B (R/W)
		case 0x4000123:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_B1() | 0;
			break;
			//4000124h - Serial Data C (R/W)
		case 0x4000124:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_C0() | 0;
			break;
			//4000125h - Serial Data C (R/W)
		case 0x4000125:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_C1() | 0;
			break;
			//4000126h - Serial Data D (R/W)
		case 0x4000126:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_D0() | 0;
			break;
			//4000127h - Serial Data D (R/W)
		case 0x4000127:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_D1() | 0;
			break;
			//4000128h - SIOCNT - SIO Sub Mode Control (R/W)
		case 0x4000128:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIOCNT0() | 0;
			break;
			//4000129h - SIOCNT - SIO Sub Mode Control (R/W)
		case 0x4000129:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIOCNT1() | 0;
			break;
			//400012Ah - SIOMLT_SEND - Data Send Register (R/W)
		case 0x400012A:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA8_0() | 0;
			break;
			//400012Bh - SIOMLT_SEND - Data Send Register (R/W)
		case 0x400012B:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA8_1() | 0;
			break;
			//400012Ch through 400012Fh - NOT USED - GLITCHED
			//4000130h - KEYINPUT - Key Status (R)
		case 0x4000130:
			data = this.joypad.readKeyStatus8_0() | 0;
			break;
			//4000131h - KEYINPUT - Key Status (R)
		case 0x4000131:
			data = this.joypad.readKeyStatus8_1() | 0;
			break;
			//4000132h - KEYCNT - Key Interrupt Control (R/W)
		case 0x4000132:
			data = this.joypad.readKeyControl8_0() | 0;
			break;
			//4000133h - KEYCNT - Key Interrupt Control (R/W)
		case 0x4000133:
			data = this.joypad.readKeyControl8_1() | 0;
			break;
			//4000134h - RCNT (R/W) - Mode Selection
		case 0x4000134:
			this.IOCore.updateSerialClocking();
			data = this.serial.readRCNT0() | 0;
			break;
			//4000135h - RCNT (R/W) - Mode Selection
		case 0x4000135:
			this.IOCore.updateSerialClocking();
			data = this.serial.readRCNT1() | 0;
			break;
			//4000138h through 400013Fh - NOT USED - GLITCHED
			//4000140h - JOYCNT - JOY BUS Control Register (R/W)
		case 0x4000140:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYCNT() | 0;
			break;
			//4000144h through 400014Fh - NOT USED - GLITCHED
			//4000150h - JoyBus Receive (R/W)
		case 0x4000150:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_RECV0() | 0;
			break;
			//4000151h - JoyBus Receive (R/W)
		case 0x4000151:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_RECV1() | 0;
			break;
			//4000152h - JoyBus Receive (R/W)
		case 0x4000152:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_RECV2() | 0;
			break;
			//4000153h - JoyBus Receive (R/W)
		case 0x4000153:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_RECV3() | 0;
			break;
			//4000154h - JoyBus Send (R/W)
		case 0x4000154:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_SEND0() | 0;
			break;
			//4000155h - JoyBus Send (R/W)
		case 0x4000155:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_SEND1() | 0;
			break;
			//4000156h - JoyBus Send (R/W)
		case 0x4000156:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_SEND2() | 0;
			break;
			//4000157h - JoyBus Send (R/W)
		case 0x4000157:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_SEND3() | 0;
			break;
			//4000158h - JoyBus Stat (R/W)
		case 0x4000158:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_STAT() | 0;
			break;
			//400015Ch through 40001FFh - NOT USED - GLITCHED
			//4000200h - IE - Interrupt Enable Register (R/W)
		case 0x4000200:
			data = this.irq.readIE8_0() | 0;
			break;
			//4000201h - IE - Interrupt Enable Register (R/W)
		case 0x4000201:
			data = this.irq.readIE8_1() | 0;
			break;
			//4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
		case 0x4000202:
			data = this.irq.readIF8_0() | 0;
			break;
			//4000203h - IF - Interrupt Request Flags / IRQ Acknowledge
		case 0x4000203:
			data = this.irq.readIF8_1() | 0;
			break;
			//4000204h - WAITCNT - Waitstate Control (R/W)
		case 0x4000204:
			data = this.wait.readWAITCNT0() | 0;
			break;
			//4000205h - WAITCNT - Waitstate Control (R/W)
		case 0x4000205:
			data = this.wait.readWAITCNT1() | 0;
			break;
			//4000208h - IME - Interrupt Master Enable Register (R/W)
		case 0x4000208:
			data = this.irq.readIME() | 0;
			break;
			//400020Ch through 40002FFh - NOT USED - GLITCHED
			//4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
		case 0x4000300:
			data = this.wait.readPOSTBOOT() | 0;
			break;
		default:
			data = this.readIO8LessCalled(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readIO8LessCalled = function (address) {
	address = address | 0;
	var data = 0;
	switch (address | 0) {
		//4000003h - Undocumented - Green Swap (R/W)
		case 0x4000003:
			//4000007h - VCOUNT - Vertical Counter (Read only)
		case 0x4000007:
			//400004Ch - MOSAIC - Mosaic Size (W)
		case 0x400004C:
			//400004Dh - MOSAIC - Mosaic Size (W)
		case 0x400004D:
			//400004Eh - NOT USED - ZERO
		case 0x400004E:
			//400004Fh - NOT USED - ZERO
		case 0x400004F:
			//4000061h - NOT USED - ZERO
		case 0x4000061:
			//4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
		case 0x4000064:
			//4000066h - NOT USED - ZERO
		case 0x4000066:
			//4000067h - NOT USED - ZERO
		case 0x4000067:
			//400006Ah - NOT USED - ZERO
		case 0x400006A:
			//400006Bh - NOT USED - ZERO
		case 0x400006B:
			//400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
		case 0x400006C:
			//400006Eh - NOT USED - ZERO
		case 0x400006E:
			//400006Fh - NOT USED - ZERO
		case 0x400006F:
			//4000071h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
		case 0x4000071:
			//4000072h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
		case 0x4000072:
			//4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
		case 0x4000074:
			//4000076h - NOT USED - ZERO
		case 0x4000076:
			//4000077h - NOT USED - ZERO
		case 0x4000077:
			//4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
		case 0x4000078:
			//400007Ah - NOT USED - ZERO
		case 0x400007A:
			//400007Bh - NOT USED - ZERO
		case 0x400007B:
			//400007Eh - NOT USED - ZERO
		case 0x400007E:
			//400007Fh - NOT USED - ZERO
		case 0x400007F:
			//4000085h - NOT USED - ZERO
		case 0x4000085:
			//4000086h - NOT USED - ZERO
		case 0x4000086:
			//4000087h - NOT USED - ZERO
		case 0x4000087:
			//400008Ah - NOT USED - ZERO
		case 0x400008A:
			//400008Bh - NOT USED - ZERO
		case 0x400008B:
			//4000103h - TM0CNT_H - Timer 0 Control (R/W)
		case 0x4000103:
			//4000107h - TM1CNT_H - Timer 1 Control (R/W)
		case 0x4000107:
			//400010Bh - TM2CNT_H - Timer 2 Control (R/W)
		case 0x400010B:
			//400010Fh - TM3CNT_H - Timer 3 Control (R/W)
		case 0x400010F:
			//4000136h - NOT USED - ZERO
		case 0x4000136:
			//4000137h - NOT USED - ZERO
		case 0x4000137:
			//4000141h - JOYCNT - JOY BUS Control Register (R/W)
		case 0x4000141:
			//4000142h - NOT USED - ZERO
		case 0x4000142:
			//4000143h - NOT USED - ZERO
		case 0x4000143:
			//4000159h - JoyBus Stat (R/W)
		case 0x4000159:
			//400015Ah - NOT USED - ZERO
		case 0x400015A:
			//400015Bh - NOT USED - ZERO
		case 0x400015B:
			//4000206h - NOT USED - ZERO
		case 0x4000206:
			//4000207h - NOT USED - ZERO
		case 0x4000207:
			//4000209h - IME - Interrupt Master Enable Register (R/W)
		case 0x4000209:
			//400020Ah - NOT USED - ZERO
		case 0x400020A:
			//400020Bh - NOT USED - ZERO
		case 0x400020B:
			//4000301h - HALTCNT - BYTE - Undocumented - Low Power Mode Control (W)
		case 0x4000301:
			//4000302h - NOT USED - ZERO
		case 0x4000302:
			//4000303h - NOT USED - ZERO
		case 0x4000303:
			break;
		default:
			if ((address & 0xFFFC) == 0x800) {
				//WRAM wait state control:
				data = this.wait.readConfigureWRAM8(address | 0) | 0;
			} else {
				//Undefined Illegal I/O:
				data = this.readUnused8CPUBase(address | 0) | 0;
			}
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch16 = function (address) {
	address = address | 0;
	var data = 0;
	this.wait.singleClock();
	var data = this.readIO16(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch16CPU = function (address) {
	address = address | 0;
	this.IOCore.updateCoreSingle();
	var data = this.readIO16(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readIO16 = function (address) {
	address = address | 0;
	var data = 0;
	switch (address & -2) {
		//4000000h - DISPCNT - LCD Control (Read/Write)
		case 0x4000000:
			data = this.gfxRenderer.readDISPCNT16() | 0;
			break;
			//4000002h - Undocumented - Green Swap (R/W)
		case 0x4000002:
			data = this.gfxRenderer.readDISPCNT8_2() | 0;
			break;
			//4000004h - DISPSTAT - General LCD Status (Read/Write)
		case 0x4000004:
			data = this.gfxState.readDISPSTAT16_0() | 0;
			break;
			//4000006h - VCOUNT - Vertical Counter (Read only)
		case 0x4000006:
			data = this.gfxState.readDISPSTAT8_2() | 0;
			break;
			//4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
		case 0x4000008:
			data = this.gfxRenderer.readBG0CNT16() | 0;
			break;
			//400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
		case 0x400000A:
			data = this.gfxRenderer.readBG1CNT16() | 0;
			break;
			//400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
		case 0x400000C:
			data = this.gfxRenderer.readBG2CNT16() | 0;
			break;
			//400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
		case 0x400000E:
			data = this.gfxRenderer.readBG3CNT16() | 0;
			break;
			//4000010h through 4000047h - WRITE ONLY
			//4000048h - WININ - Control of Inside of Window(s) (R/W)
		case 0x4000048:
			data = this.gfxRenderer.readWININ16() | 0;
			break;
			//400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
		case 0x400004A:
			data = this.gfxRenderer.readWINOUT16() | 0;
			break;
			//4000050h - BLDCNT - Color Special Effects Selection (R/W)
		case 0x4000050:
			data = this.gfxRenderer.readBLDCNT16() | 0;
			break;
			//4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
		case 0x4000052:
			data = this.gfxRenderer.readBLDALPHA16() | 0;
			break;
			//4000054h through 400005Fh - NOT USED - GLITCHED
			//4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
		case 0x4000060:
			//NR10:
			data = this.sound.readSOUND1CNT8_0() | 0;
			break;
			//4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
		case 0x4000062:
			//NR11:
			//NR12:
			data = this.sound.readSOUND1CNT8_2() | (this.sound.readSOUND1CNT8_3() << 8);
			break;
			//4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
		case 0x4000064:
			//NR14:
			data = this.sound.readSOUND1CNT_X() << 8;
			break;
			//4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
		case 0x4000068:
			//NR21:
			//NR22:
			data = this.sound.readSOUND2CNT_L0() | (this.sound.readSOUND2CNT_L1() << 8);
			break;
			//400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
		case 0x400006C:
			//NR24:
			data = this.sound.readSOUND2CNT_H() << 8;
			break;
			//4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
		case 0x4000070:
			//NR30:
			data = this.sound.readSOUND3CNT_L() | 0;
			break;
			//4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
		case 0x4000072:
			//NR32:
			data = this.sound.readSOUND3CNT_H() << 8;
			break;
			//4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
		case 0x4000074:
			//NR34:
			data = this.sound.readSOUND3CNT_X() << 8;
			break;
			//4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
		case 0x4000078:
			//NR42:
			data = this.sound.readSOUND4CNT_L() << 8;
			break;
			//400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
		case 0x400007C:
			//NR43:
			//NR44:
			data = this.sound.readSOUND4CNT_H0() | (this.sound.readSOUND4CNT_H1() << 8);
			break;
			//4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
		case 0x4000080:
			//NR50:
			//NR51:
			data = this.sound.readSOUNDCNT_L0() | (this.sound.readSOUNDCNT_L1() << 8);
			break;
			//4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
		case 0x4000082:
			data = this.sound.readSOUNDCNT_H0() | (this.sound.readSOUNDCNT_H1() << 8);
			break;
			//4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
		case 0x4000084:
			this.IOCore.updateTimerClocking();
			data = this.sound.readSOUNDCNT_X() | 0;
			break;
			//4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
		case 0x4000088:
			data = this.sound.readSOUNDBIAS0() | (this.sound.readSOUNDBIAS1() << 8);
			break;
			//400008Ch - NOT USED - GLITCHED
			//400008Eh - NOT USED - GLITCHED
			//4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000090:
			//4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000092:
			//4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000094:
			//4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000096:
			//4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000098:
			//400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009A:
			//400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009C:
			//400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009E:
			data = this.sound.readWAVE16(address & 0xF) | 0;
			break;
			//40000A0h through 40000B9h - WRITE ONLY
			//40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
		case 0x40000BA:
			data = this.dmaChannel0.readDMAControl16() | 0;
			break;
			//40000BCh through 40000C5h - WRITE ONLY
			//40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
		case 0x40000C6:
			data = this.dmaChannel1.readDMAControl16() | 0;
			break;
			//40000C8h through 40000D1h - WRITE ONLY
			//40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
		case 0x40000D2:
			data = this.dmaChannel2.readDMAControl16() | 0;
			break;
			//40000D4h through 40000DDh - WRITE ONLY
			//40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
		case 0x40000DE:
			data = this.dmaChannel3.readDMAControl16() | 0;
			break;
			//40000E0h through 40000FFh - NOT USED - GLITCHED
			//4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
		case 0x4000100:
			data = this.timer.readTM0CNT16() | 0;
			break;
			//4000102h - TM0CNT_H - Timer 0 Control (R/W)
		case 0x4000102:
			data = this.timer.readTM0CNT8_2() | 0;
			break;
			//4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
		case 0x4000104:
			data = this.timer.readTM1CNT16() | 0;
			break;
			//4000106h - TM1CNT_H - Timer 1 Control (R/W)
		case 0x4000106:
			data = this.timer.readTM1CNT8_2() | 0;
			break;
			//4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
		case 0x4000108:
			data = this.timer.readTM2CNT16() | 0;
			break;
			//400010Ah - TM2CNT_H - Timer 2 Control (R/W)
		case 0x400010A:
			data = this.timer.readTM2CNT8_2() | 0;
			break;
			//400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
		case 0x400010C:
			data = this.timer.readTM3CNT16() | 0;
			break;
			//400010Eh - TM3CNT_H - Timer 3 Control (R/W)
		case 0x400010E:
			data = this.timer.readTM3CNT8_2() | 0;
			break;
			//4000110h through 400011Fh - NOT USED - GLITCHED
			//4000120h - Serial Data A (R/W)
		case 0x4000120:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_A0() | (this.serial.readSIODATA_A1() << 8);
			break;
			//4000122h - Serial Data B (R/W)
		case 0x4000122:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_B0() | (this.serial.readSIODATA_B1() << 8);
			break;
			//4000124h - Serial Data C (R/W)
		case 0x4000124:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_C0() | (this.serial.readSIODATA_C1() << 8);
			break;
			//4000126h - Serial Data D (R/W)
		case 0x4000126:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_D0() | (this.serial.readSIODATA_D1() << 8);
			break;
			//4000128h - SIOCNT - SIO Sub Mode Control (R/W)
		case 0x4000128:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIOCNT0() | (this.serial.readSIOCNT1() << 8);
			break;
			//400012Ah - SIOMLT_SEND - Data Send Register (R/W)
		case 0x400012A:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA8_0() | (this.serial.readSIODATA8_1() << 8);
			break;
			//400012Ch through 400012Fh - NOT USED - GLITCHED
			//4000130h - KEYINPUT - Key Status (R)
		case 0x4000130:
			data = this.joypad.readKeyStatus16() | 0;
			break;
			//4000132h - KEYCNT - Key Interrupt Control (R/W)
		case 0x4000132:
			data = this.joypad.readKeyControl16() | 0;
			break;
			//4000134h - RCNT (R/W) - Mode Selection
		case 0x4000134:
			this.IOCore.updateSerialClocking();
			data = this.serial.readRCNT0() | (this.serial.readRCNT1() << 8);
			break;
			//4000138h through 400013Fh - NOT USED - GLITCHED
			//4000140h - JOYCNT - JOY BUS Control Register (R/W)
		case 0x4000140:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYCNT() | 0;
			break;
			//4000144h through 400014Fh - NOT USED - GLITCHED
			//4000150h - JoyBus Receive (R/W)
		case 0x4000150:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_RECV0() | (this.serial.readJOYBUS_RECV1() << 8);
			break;
			//4000152h - JoyBus Receive (R/W)
		case 0x4000152:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_RECV2() | (this.serial.readJOYBUS_RECV3() << 8);
			break;
			//4000154h - JoyBus Send (R/W)
		case 0x4000154:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_SEND0() | (this.serial.readJOYBUS_SEND1() << 8);
			break;
			//4000156h - JoyBus Send (R/W)
		case 0x4000156:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_SEND2() | (this.serial.readJOYBUS_SEND3() << 8);
			break;
			//4000158h - JoyBus Stat (R/W)
		case 0x4000158:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_STAT() | 0;
			break;
			//400015Ch through 40001FFh - NOT USED - GLITCHED
			//4000200h - IE - Interrupt Enable Register (R/W)
		case 0x4000200:
			data = this.irq.readIE16() | 0;
			break;
			//4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
		case 0x4000202:
			data = this.irq.readIF16() | 0;
			break;
			//4000204h - WAITCNT - Waitstate Control (R/W)
		case 0x4000204:
			data = this.wait.readWAITCNT0() | (this.wait.readWAITCNT1() << 8);
			break;
			//4000208h - IME - Interrupt Master Enable Register (R/W)
		case 0x4000208:
			data = this.irq.readIME() | 0;
			break;
			//400020Ch through 40002FFh - NOT USED - GLITCHED
			//4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
		case 0x4000300:
			data = this.wait.readPOSTBOOT() | 0;
			break;
		default:
			data = this.readIO16LessCalled(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readIO16LessCalled = function (address) {
	address = address | 0;
	var data = 0;
	switch (address & -2) {
		//400004Ch - MOSAIC - Mosaic Size (W)
		case 0x400004C:
			//400004Eh - NOT USED - ZERO
		case 0x400004E:
			//4000066h - NOT USED - ZERO
		case 0x4000066:
			//400006Ah - NOT USED - ZERO
		case 0x400006A:
			//400006Eh - NOT USED - ZERO
		case 0x400006E:
			//4000076h - NOT USED - ZERO
		case 0x4000076:
			//400007Ah - NOT USED - ZERO
		case 0x400007A:
			//400007Eh - NOT USED - ZERO
		case 0x400007E:
			//4000086h - NOT USED - ZERO
		case 0x4000086:
			//400008Ah - NOT USED - ZERO
		case 0x400008A:
			//4000136h - NOT USED - ZERO
		case 0x4000136:
			//4000142h - NOT USED - ZERO
		case 0x4000142:
			//400015Ah - NOT USED - ZERO
		case 0x400015A:
			//4000206h - NOT USED - ZERO
		case 0x4000206:
			//400020Ah - NOT USED - ZERO
		case 0x400020A:
			//4000302h - NOT USED - ZERO
		case 0x4000302:
			break;
		default:
			if ((address & 0xFFFC) == 0x800) {
				//WRAM wait state control:
				data = this.wait.readConfigureWRAM16(address | 0) | 0;
			} else {
				//Undefined Illegal I/O:
				data = this.readUnused16MultiBase(address | 0) | 0;
			}
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch32 = function (address) {
	address = address | 0;
	this.wait.singleClock();
	var data = this.readIO32(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readIODispatch32CPU = function (address) {
	address = address | 0;
	this.IOCore.updateCoreSingle();
	var data = this.readIO32(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readIO32 = function (address) {
	address = address | 0;
	var data = 0;
	switch (address & -4) {
		//4000000h - DISPCNT - LCD Control (Read/Write)
		//4000002h - Undocumented - Green Swap (R/W)
		case 0x4000000:
			data = this.gfxRenderer.readDISPCNT32() | 0;
			break;
			//4000004h - DISPSTAT - General LCD Status (Read/Write)
			//4000006h - VCOUNT - Vertical Counter (Read only)
		case 0x4000004:
			data = this.gfxState.readDISPSTAT32() | 0;
			break;
			//4000008h - BG0CNT - BG0 Control (R/W) (BG Modes 0,1 only)
			//400000Ah - BG1CNT - BG1 Control (R/W) (BG Modes 0,1 only)
		case 0x4000008:
			data = this.gfxRenderer.readBG0BG1CNT32() | 0;
			break;
			//400000Ch - BG2CNT - BG2 Control (R/W) (BG Modes 0,1,2 only)
			//400000Eh - BG3CNT - BG3 Control (R/W) (BG Modes 0,2 only)
		case 0x400000C:
			data = this.gfxRenderer.readBG2BG3CNT32() | 0;
			break;
			//4000010h through 4000047h - WRITE ONLY
			//4000048h - WININ - Control of Inside of Window(s) (R/W)
			//400004Ah- WINOUT - Control of Outside of Windows & Inside of OBJ Window (R/W)
		case 0x4000048:
			data = this.gfxRenderer.readWINCONTROL32() | 0;
			break;
			//400004Ch - MOSAIC - Mosaic Size (W)
			//4000050h - BLDCNT - Color Special Effects Selection (R/W)
			//4000052h - BLDALPHA - Alpha Blending Coefficients (R/W)
		case 0x4000050:
			data = this.gfxRenderer.readBLDCNT32() | 0;
			break;
			//4000054h through 400005Fh - NOT USED - GLITCHED
			//4000060h - SOUND1CNT_L (NR10) - Channel 1 Sweep register (R/W)
			//4000062h - SOUND1CNT_H (NR11, NR12) - Channel 1 Duty/Len/Envelope (R/W)
		case 0x4000060:
			//NR10:
			//NR11:
			//NR12:
			data = this.sound.readSOUND1CNT8_0() |
				(this.sound.readSOUND1CNT8_2() << 16) |
				(this.sound.readSOUND1CNT8_3() << 24);
			break;
			//4000064h - SOUND1CNT_X (NR13, NR14) - Channel 1 Frequency/Control (R/W)
			//4000066h - NOT USED - ZERO
		case 0x4000064:
			//NR14:
			data = this.sound.readSOUND1CNT_X() << 8;
			break;
			//4000068h - SOUND2CNT_L (NR21, NR22) - Channel 2 Duty/Length/Envelope (R/W)
			//400006Ah - NOT USED - ZERO
		case 0x4000068:
			//NR21:
			//NR22:
			data = this.sound.readSOUND2CNT_L0() | (this.sound.readSOUND2CNT_L1() << 8);
			break;
			//400006Ch - SOUND2CNT_H (NR23, NR24) - Channel 2 Frequency/Control (R/W)
			//400006Eh - NOT USED - ZERO
		case 0x400006C:
			//NR24:
			data = this.sound.readSOUND2CNT_H() << 8;
			break;
			//4000070h - SOUND3CNT_L (NR30) - Channel 3 Stop/Wave RAM select (R/W)
			//4000073h - SOUND3CNT_H (NR31, NR32) - Channel 3 Length/Volume (R/W)
		case 0x4000070:
			//NR30:
			//NR32:
			data = this.sound.readSOUND3CNT_L() | (this.sound.readSOUND3CNT_H() << 24);
			break;
			//4000074h - SOUND3CNT_X (NR33, NR34) - Channel 3 Frequency/Control (R/W)
			//4000076h - NOT USED - ZERO
		case 0x4000074:
			//NR34:
			data = this.sound.readSOUND3CNT_X() << 8;
			break;
			//4000078h - SOUND4CNT_L (NR41, NR42) - Channel 4 Length/Envelope (R/W)
			//400007Ah - NOT USED - ZERO
		case 0x4000078:
			//NR42:
			data = this.sound.readSOUND4CNT_L() << 8;
			break;
			//400007Ch - SOUND4CNT_H (NR43, NR44) - Channel 4 Frequency/Control (R/W)
			//400007Eh - NOT USED - ZERO
		case 0x400007C:
			//NR43:
			//NR44:
			data = this.sound.readSOUND4CNT_H0() | (this.sound.readSOUND4CNT_H1() << 8);
			break;
			//4000080h - SOUNDCNT_L (NR50, NR51) - Channel L/R Volume/Enable (R/W)
			//4000082h - SOUNDCNT_H (GBA only) - DMA Sound Control/Mixing (R/W)
		case 0x4000080:
			//NR50:
			//NR51:
			data = this.sound.readSOUNDCNT_L0() |
				(this.sound.readSOUNDCNT_L1() << 8) |
				(this.sound.readSOUNDCNT_H0() << 16) |
				(this.sound.readSOUNDCNT_H1() << 24);
			break;
			//4000084h - SOUNDCNT_X (NR52) - Sound on/off (R/W)
			//4000086h - NOT USED - ZERO
		case 0x4000084:
			this.IOCore.updateTimerClocking();
			data = this.sound.readSOUNDCNT_X() | 0;
			break;
			//4000088h - SOUNDBIAS - Sound PWM Control (R/W, see below)
			//400008Ah - NOT USED - ZERO
		case 0x4000088:
			data = this.sound.readSOUNDBIAS0() | (this.sound.readSOUNDBIAS1() << 8);
			break;
			//400008Ch - NOT USED - GLITCHED
			//400008Eh - NOT USED - GLITCHED
			//4000090h - WAVE_RAM0_L - Channel 3 Wave Pattern RAM (W/R)
			//4000092h - WAVE_RAM0_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000090:
			//4000094h - WAVE_RAM1_L - Channel 3 Wave Pattern RAM (W/R)
			//4000096h - WAVE_RAM1_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000094:
			//4000098h - WAVE_RAM2_L - Channel 3 Wave Pattern RAM (W/R)
			//400009Ah - WAVE_RAM2_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x4000098:
			//400009Ch - WAVE_RAM3_L - Channel 3 Wave Pattern RAM (W/R)
			//400009Eh - WAVE_RAM3_H - Channel 3 Wave Pattern RAM (W/R)
		case 0x400009C:
			data = this.sound.readWAVE32(address & 0xF) | 0;
			break;
			//40000A0h through 40000B9h - WRITE ONLY
			//40000BAh - DMA0CNT_H - DMA 0 Control (R/W)
		case 0x40000B8:
			data = this.dmaChannel0.readDMAControl16() << 16;
			break;
			//40000BCh through 40000C5h - WRITE ONLY
			//40000C6h - DMA1CNT_H - DMA 1 Control (R/W)
		case 0x40000C4:
			data = this.dmaChannel1.readDMAControl16() << 16;
			break;
			//40000C8h through 40000D1h - WRITE ONLY
			//40000D2h - DMA2CNT_H - DMA 2 Control (R/W)
		case 0x40000D0:
			data = this.dmaChannel2.readDMAControl16() << 16;
			break;
			//40000D4h through 40000DDh - WRITE ONLY
			//40000DEh - DMA3CNT_H - DMA 3 Control (R/W)
		case 0x40000DC:
			data = this.dmaChannel3.readDMAControl16() << 16;
			break;
			//40000E0h through 40000FFh - NOT USED - GLITCHED
			//4000100h - TM0CNT_L - Timer 0 Counter/Reload (R/W)
			//4000102h - TM0CNT_H - Timer 0 Control (R/W)
		case 0x4000100:
			data = this.timer.readTM0CNT32() | 0;
			break;
			//4000104h - TM1CNT_L - Timer 1 Counter/Reload (R/W)
			//4000106h - TM1CNT_H - Timer 1 Control (R/W)
		case 0x4000104:
			data = this.timer.readTM1CNT32() | 0;
			break;
			//4000108h - TM2CNT_L - Timer 2 Counter/Reload (R/W)
			//400010Ah - TM2CNT_H - Timer 2 Control (R/W)
		case 0x4000108:
			data = this.timer.readTM2CNT32() | 0;
			break;
			//400010Ch - TM3CNT_L - Timer 3 Counter/Reload (R/W)
			//400010Eh - TM3CNT_H - Timer 3 Control (R/W)
		case 0x400010C:
			data = this.timer.readTM3CNT32() | 0;
			break;
			//4000110h through 400011Fh - NOT USED - GLITCHED
			//4000120h - Serial Data A (R/W)
			//4000122h - Serial Data B (R/W)
		case 0x4000110:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_A0() |
				(this.serial.readSIODATA_A1() << 8) |
				(this.serial.readSIODATA_B0() << 16) |
				(this.serial.readSIODATA_B1() << 24);
			break;
			//4000124h - Serial Data C (R/W)
			//4000126h - Serial Data D (R/W)
		case 0x4000124:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIODATA_C0() |
				(this.serial.readSIODATA_C1() << 8) |
				(this.serial.readSIODATA_D0() << 16) |
				(this.serial.readSIODATA_D1() << 24);
			break;
			//4000128h - SIOCNT - SIO Sub Mode Control (R/W)
			//400012Ah - SIOMLT_SEND - Data Send Register (R/W)
		case 0x4000128:
			this.IOCore.updateSerialClocking();
			data = this.serial.readSIOCNT0() |
				(this.serial.readSIOCNT1() << 8) |
				(this.serial.readSIODATA8_0() << 16) |
				(this.serial.readSIODATA8_1() << 24);
			break;
			//400012Ch through 400012Fh - NOT USED - GLITCHED
			//4000130h - KEYINPUT - Key Status (R)
			//4000132h - KEYCNT - Key Interrupt Control (R/W)
		case 0x4000130:
			data = this.joypad.readKeyStatusControl32() | 0;
			break;
			//4000134h - RCNT (R/W) - Mode Selection
			//4000136h - NOT USED - ZERO
		case 0x4000134:
			this.IOCore.updateSerialClocking();
			data = this.serial.readRCNT0() | (this.serial.readRCNT1() << 8);
			break;
			//4000138h through 400013Fh - NOT USED - GLITCHED
			//4000140h - JOYCNT - JOY BUS Control Register (R/W)
			//4000142h - NOT USED - ZERO
		case 0x4000138:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYCNT() | 0;
			break;
			//4000144h through 400014Fh - NOT USED - GLITCHED
			//4000150h - JoyBus Receive (R/W)
			//4000152h - JoyBus Receive (R/W)
		case 0x4000144:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_RECV0() |
				(this.serial.readJOYBUS_RECV1() << 8) |
				(this.serial.readJOYBUS_RECV2() << 16) |
				(this.serial.readJOYBUS_RECV3() << 24);
			break;
			//4000154h - JoyBus Send (R/W)
			//4000156h - JoyBus Send (R/W)
		case 0x4000154:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_SEND0() |
				(this.serial.readJOYBUS_SEND1() << 8) |
				(this.serial.readJOYBUS_SEND2() << 16) |
				(this.serial.readJOYBUS_SEND3() << 24);
			break;
			//4000158h - JoyBus Stat (R/W)
			//400015Ah - NOT USED - ZERO
		case 0x4000158:
			this.IOCore.updateSerialClocking();
			data = this.serial.readJOYBUS_STAT() | 0;
			break;
			//400015Ch through 40001FFh - NOT USED - GLITCHED
			//4000200h - IE - Interrupt Enable Register (R/W)
			//4000202h - IF - Interrupt Request Flags / IRQ Acknowledge
		case 0x4000200:
			data = this.irq.readIRQ32() | 0;
			break;
			//4000204h - WAITCNT - Waitstate Control (R/W)
			//4000206h - NOT USED - ZERO
		case 0x4000204:
			data = this.wait.readWAITCNT0() | (this.wait.readWAITCNT1() << 8);
			break;
			//4000208h - IME - Interrupt Master Enable Register (R/W)
			//400020Ah - NOT USED - ZERO
		case 0x4000208:
			data = this.irq.readIME() | 0;
			break;
			//400020Ch through 40002FFh - NOT USED - GLITCHED
			//4000300h - POSTFLG - BYTE - Undocumented - Post Boot / Debug Control (R/W)
			//4000302h - NOT USED - ZERO
		case 0x4000300:
			data = this.wait.readPOSTBOOT() | 0;
			break;
			//UNDEFINED / ILLEGAL:
		default:
			if ((address & 0xFFFC) == 0x800) {
				//WRAM wait state control:
				data = this.wait.readConfigureWRAM32() | 0;
			} else {
				//Undefined Illegal I/O:
				data = this.readUnused32MultiBase() | 0;
			}
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM8Preliminary = function (address) {
	address = address | 0;
	this.IOCore.updateGraphicsClocking();
	var data = 0;
	switch (address >> 24) {
		case 0x5:
			this.wait.VRAMAccess();
			data = this.gfxRenderer.readPalette8(address | 0) | 0;
			break;
		case 0x6:
			this.wait.VRAMAccess();
			data = this.gfxRenderer.readVRAM8(address | 0) | 0;
			break;
		default:
			this.wait.OAMAccess();
			data = this.gfxRenderer.readOAM(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM16Preliminary = function (address) {
	address = address | 0;
	this.IOCore.updateGraphicsClocking();
	var data = 0;
	switch (address >> 24) {
		case 0x5:
			this.wait.VRAMAccess();
			data = this.gfxRenderer.readPalette16(address | 0) | 0;
			break;
		case 0x6:
			this.wait.VRAMAccess();
			data = this.gfxRenderer.readVRAM16(address | 0) | 0;
			break;
		default:
			this.wait.OAMAccess();
			data = this.gfxRenderer.readOAM16(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM16CPUPreliminary = function (address) {
	address = address | 0;
	this.IOCore.updateGraphicsClocking();
	var data = 0;
	switch (address >> 24) {
		case 0x5:
			this.wait.VRAMAccess16CPU();
			data = this.gfxRenderer.readPalette16(address | 0) | 0;
			break;
		case 0x6:
			this.wait.VRAMAccess16CPU();
			data = this.gfxRenderer.readVRAM16(address | 0) | 0;
			break;
		default:
			this.wait.OAMAccessCPU();
			data = this.gfxRenderer.readOAM16(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM32Preliminary = function (address) {
	address = address | 0;
	this.IOCore.updateGraphicsClocking();
	var data = 0;
	switch (address >> 24) {
		case 0x5:
			this.wait.VRAMAccess32();
			data = this.gfxRenderer.readPalette32(address | 0) | 0;
			break;
		case 0x6:
			this.wait.VRAMAccess32();
			data = this.gfxRenderer.readVRAM32(address | 0) | 0;
			break;
		default:
			this.wait.OAMAccess();
			data = this.gfxRenderer.readOAM32(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readVRAM32CPUPreliminary = function (address) {
	address = address | 0;
	this.IOCore.updateGraphicsClocking();
	var data = 0;
	switch (address >> 24) {
		case 0x5:
			this.wait.VRAMAccess32CPU();
			data = this.gfxRenderer.readPalette32(address | 0) | 0;
			break;
		case 0x6:
			this.wait.VRAMAccess32CPU();
			data = this.gfxRenderer.readVRAM32(address | 0) | 0;
			break;
		default:
			this.wait.OAMAccessCPU();
			data = this.gfxRenderer.readOAM32(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceMemory.prototype.readROM8 = function (address) {
	address = address | 0;
	this.wait.ROMAccess(address | 0);
	return this.cartridge.readROM8(address & 0x1FFFFFF) | 0;
}
GameBoyAdvanceMemory.prototype.readROM16 = function (address) {
	address = address | 0;
	this.wait.ROMAccess(address | 0);
	return this.cartridge.readROM16(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM16CPU = function (address) {
	address = address | 0;
	this.wait.ROMAccess16CPU(address | 0);
	return this.cartridge.readROM16(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM32 = function (address) {
	address = address | 0;
	this.wait.ROMAccess32(address | 0);
	return this.cartridge.readROM32(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM32CPU = function (address) {
	address = address | 0;
	this.wait.ROMAccess32CPU(address | 0);
	return this.cartridge.readROM32(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM28 = function (address) {
	address = address | 0;
	this.wait.ROMAccess(address | 0);
	return this.cartridge.readROM8Space2(address & 0x1FFFFFF) | 0;
}
GameBoyAdvanceMemory.prototype.readROM216 = function (address) {
	address = address | 0;
	this.wait.ROMAccess(address | 0);
	return this.cartridge.readROM16Space2(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM216CPU = function (address) {
	address = address | 0;
	this.wait.ROMAccess16CPU(address | 0);
	return this.cartridge.readROM16Space2(address & 0x1FFFFFE) | 0;
}
GameBoyAdvanceMemory.prototype.readROM232 = function (address) {
	address = address | 0;
	this.wait.ROMAccess32(address | 0);
	return this.cartridge.readROM32Space2(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readROM232CPU = function (address) {
	address = address | 0;
	this.wait.ROMAccess32CPU(address | 0);
	return this.cartridge.readROM32Space2(address & 0x1FFFFFC) | 0;
}
GameBoyAdvanceMemory.prototype.readSRAM8 = function (address) {
	address = address | 0;
	this.wait.SRAMAccess();
	return this.saves.readSRAM(address & 0xFFFF) | 0;
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceMemory.prototype.readSRAM16 = function (address) {
		address = address | 0;
		this.wait.SRAMAccess();
		return Math.imul(this.saves.readSRAM(address & 0xFFFE) | 0, 0x101) | 0;
	}
	GameBoyAdvanceMemory.prototype.readSRAM16CPU = function (address) {
		address = address | 0;
		this.wait.SRAMAccessCPU();
		return Math.imul(this.saves.readSRAM(address & 0xFFFE) | 0, 0x101) | 0;
	}
	GameBoyAdvanceMemory.prototype.readSRAM32 = function (address) {
		address = address | 0;
		this.wait.SRAMAccess();
		return Math.imul(this.saves.readSRAM(address & 0xFFFC) | 0, 0x1010101) | 0;
	}
	GameBoyAdvanceMemory.prototype.readSRAM32CPU = function (address) {
		address = address | 0;
		this.wait.SRAMAccessCPU();
		return Math.imul(this.saves.readSRAM(address & 0xFFFC) | 0, 0x1010101) | 0;
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceMemory.prototype.readSRAM16 = function (address) {
		address = address | 0;
		this.wait.SRAMAccess();
		return ((this.saves.readSRAM(address & 0xFFFE) | 0) * 0x101) | 0;
	}
	GameBoyAdvanceMemory.prototype.readSRAM16CPU = function (address) {
		address = address | 0;
		this.wait.SRAMAccessCPU();
		return ((this.saves.readSRAM(address & 0xFFFE) | 0) * 0x101) | 0;
	}
	GameBoyAdvanceMemory.prototype.readSRAM32 = function (address) {
		address = address | 0;
		this.wait.SRAMAccess();
		return ((this.saves.readSRAM(address & 0xFFFC) | 0) * 0x1010101) | 0;
	}
	GameBoyAdvanceMemory.prototype.readSRAM32CPU = function (address) {
		address = address | 0;
		this.wait.SRAMAccessCPU();
		return ((this.saves.readSRAM(address & 0xFFFC) | 0) * 0x1010101) | 0;
	}
}
GameBoyAdvanceMemory.prototype.readUnused8 = function (address) {
	address = address | 0;
	this.wait.singleClock();
	return this.readUnused8CPUBase(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readUnused8CPUBase = function (address) {
	address = address | 0;
	return (this.cpu.getCurrentFetchValue() >> ((address & 0x3) << 3)) & 0xFF;
}
GameBoyAdvanceMemory.prototype.readUnused16 = function (address) {
	address = address | 0;
	this.wait.singleClock();
	return this.readUnused16CPUBase(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readUnused16CPU = function (address) {
	address = address | 0;
	this.IOCore.updateCoreSingle();
	return this.readUnused16CPUBase(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readUnused16CPUBase = function (address) {
	address = address | 0;
	return (this.cpu.getCurrentFetchValue() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused16DMA = function (address) {
	address = address | 0;
	this.wait.singleClock();
	return this.readUnused16DMABase(address | 0) | 0;
}
GameBoyAdvanceMemory.prototype.readUnused16DMABase = function (address) {
	address = address | 0;
	return (this.dma.getCurrentFetchValue() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused16MultiBase = function (address) {
	address = address | 0;
	return (this.readUnused32MultiBase() >> ((address & 0x2) << 3)) & 0xFFFF;
}
GameBoyAdvanceMemory.prototype.readUnused32 = function () {
	this.wait.singleClock();
	return this.cpu.getCurrentFetchValue() | 0;
}
GameBoyAdvanceMemory.prototype.readUnused32CPU = function () {
	this.IOCore.updateCoreSingle();
	return this.cpu.getCurrentFetchValue() | 0;
}
GameBoyAdvanceMemory.prototype.readUnused32DMA = function () {
	this.wait.singleClock();
	return this.dma.getCurrentFetchValue() | 0;
}
GameBoyAdvanceMemory.prototype.readUnused32MultiBase = function () {
	return this.IOCore.getCurrentFetchValue() | 0;
}
GameBoyAdvanceMemory.prototype.loadBIOS = function () {
	//Ensure BIOS is of correct length:
	if ((this.IOCore.BIOS.length | 0) == 0x4000) {
		this.IOCore.BIOSFound = true;
		for (var index = 0;
			(index | 0) < 0x4000; index = ((index | 0) + 1) | 0) {
			this.BIOS[index & 0x3FFF] = this.IOCore.BIOS[index & 0x3FFF] & 0xFF;
		}
	} else {
		this.IOCore.BIOSFound = false;
		throw (new Error("BIOS invalid."));
	}
}

function generateMemoryTopLevelDispatch() {
	//Generic memory read dispatch generator:
	function compileMemoryReadDispatch(readUnused, readExternalWRAM, readInternalWRAM,
		readIODispatch, readVRAM, readROM, readROM2, readSRAM, readBIOS) {
		var code = "address = address | 0;var data = 0;switch (address >> 24) {";
		/*
		 Decoder for the nibble at bits 24-27
		 (Top 4 bits of the address falls through to default (unused),
		 so the next nibble down is used for dispatch.):
		 */
		/*
		 BIOS Area (00000000-00003FFF)
		 Unused (00004000-01FFFFFF)
		 */
		code += "case 0:{data = this." + readBIOS + "(address | 0) | 0;break};";
		/*
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 WRAM - On-board Work RAM (02000000-0203FFFF)
		 Unused (02040000-02FFFFFF)
		 */
		if (readExternalWRAM.slice(0, 10) != "readUnused") {
			code += "case 0x2:";
			if (readExternalWRAM.slice(0, 12) != "readInternal") {
				code += "{data = this." + readExternalWRAM + "(address | 0) | 0;break};";
			}
		}
		/*
		 WRAM - In-Chip Work RAM (03000000-03007FFF)
		 Unused (03008000-03FFFFFF)
		 */
		if (readInternalWRAM.slice(0, 10) != "readUnused") {
			code += "case 0x3:{data = this." + readInternalWRAM + "(address | 0) | 0;break};";
		}
		/*
		 I/O Registers (04000000-040003FE)
		 Unused (04000400-04FFFFFF)
		 */
		code += "case 0x4:{data = this." + readIODispatch + "(address | 0) | 0;break};";
		/*
		 BG/OBJ Palette RAM (05000000-050003FF)
		 Unused (05000400-05FFFFFF)
		 */
		code += "case 0x5:";
		/*
		 VRAM - Video RAM (06000000-06017FFF)
		 Unused (06018000-06FFFFFF)
		 */
		code += "case 0x6:";
		/*
		 OAM - OBJ Attributes (07000000-070003FF)
		 Unused (07000400-07FFFFFF)
		 */
		code += "case 0x7:{data = this." + readVRAM + "(address | 0) | 0;break};";
		/*
		 Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
		 */
		code += "case 0x8:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
		 */
		code += "case 0x9:";
		/*
		 Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
		 */
		code += "case 0xA:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
		 */
		code += "case 0xB:{data = this." + readROM + "(address | 0) | 0;break};";
		/*
		 Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
		 */
		code += "case 0xC:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
		 */
		code += "case 0xD:{data = this." + readROM2 + "(address | 0) | 0;break};";
		/*
		 Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
		 */
		code += "case 0xE:";
		/*
		 Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
		 Mirrored up to 0FFFFFFF
		 */
		code += "case 0xF:{data = this." + readSRAM + "(address | 0) | 0;break};";
		/*
		 Unused (10000000-FFFFFFFF)
		 */
		code += "default:{data = this." + readUnused + "(" + ((readUnused.slice(0, 12) == "readUnused32") ? "" : "address | 0") + ") | 0};";
		//Generate the function:
		code += "}return data | 0;";
		return Function("address", code);
	}
	//Optimized for DMA 0:
	function compileMemoryDMA0ReadDispatch(readUnused, readExternalWRAM, readInternalWRAM,
		readIODispatch, readVRAM, readBIOS) {
		var code = "address = address | 0;var data = 0;switch (address >> 24) {";
		/*
		 Decoder for the nibble at bits 24-27
		 (Top 4 bits of the address falls through to default (unused),
		 so the next nibble down is used for dispatch.):
		 */
		/*
		 BIOS Area (00000000-00003FFF)
		 Unused (00004000-01FFFFFF)
		 */
		code += "case 0:{data = this." + readBIOS + "(address | 0) | 0;break};";
		/*
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 WRAM - On-board Work RAM (02000000-0203FFFF)
		 Unused (02040000-02FFFFFF)
		 */
		if (readExternalWRAM.slice(0, 10) != "readUnused") {
			code += "case 0x2:";
			if (readExternalWRAM.slice(0, 12) != "readInternal") {
				code += "{data = this." + readExternalWRAM + "(address | 0) | 0;break};";
			}
		}
		/*
		 WRAM - In-Chip Work RAM (03000000-03007FFF)
		 Unused (03008000-03FFFFFF)
		 */
		if (readInternalWRAM.slice(0, 10) != "readUnused") {
			code += "case 0x3:{data = this." + readInternalWRAM + "(address | 0) | 0;break};";
		}
		/*
		 I/O Registers (04000000-040003FE)
		 Unused (04000400-04FFFFFF)
		 */
		code += "case 0x4:{data = this." + readIODispatch + "(address | 0) | 0;break};";
		/*
		 BG/OBJ Palette RAM (05000000-050003FF)
		 Unused (05000400-05FFFFFF)
		 */
		code += "case 0x5:";
		/*
		 VRAM - Video RAM (06000000-06017FFF)
		 Unused (06018000-06FFFFFF)
		 */
		code += "case 0x6:";
		/*
		 OAM - OBJ Attributes (07000000-070003FF)
		 Unused (07000400-07FFFFFF)
		 */
		code += "case 0x7:{data = this." + readVRAM + "(address | 0) | 0;break};";
		/*
		 Unused, DMA 0 cannot read past 07FFFFFF:
		 */
		code += "default:{data = this." + readUnused + "(" + ((readUnused.slice(0, 12) == "readUnused32") ? "" : "address | 0") + ") | 0};";
		//Generate the function:
		code += "}return data | 0;";
		return Function("address", code);
	}
	//Optimized for DMA 1-3:
	function compileMemoryDMAReadDispatch(readUnused, readExternalWRAM, readInternalWRAM,
		readIODispatch, readVRAM, readROM, readROM2, readBIOS) {
		var code = "address = address | 0;var data = 0;switch (address >> 24) {";
		/*
		 Decoder for the nibble at bits 24-27
		 (Top 4 bits of the address falls through to default (unused),
		 so the next nibble down is used for dispatch.):
		 */
		/*
		 BIOS Area (00000000-00003FFF)
		 Unused (00004000-01FFFFFF)
		 */
		code += "case 0:{data = this." + readBIOS + "(address | 0) | 0;break};";
		/*
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 WRAM - On-board Work RAM (02000000-0203FFFF)
		 Unused (02040000-02FFFFFF)
		 */
		if (readExternalWRAM.slice(0, 10) != "readUnused") {
			code += "case 0x2:";
			if (readExternalWRAM.slice(0, 12) != "readInternal") {
				code += "{data = this." + readExternalWRAM + "(address | 0) | 0;break};";
			}
		}
		/*
		 WRAM - In-Chip Work RAM (03000000-03007FFF)
		 Unused (03008000-03FFFFFF)
		 */
		if (readInternalWRAM.slice(0, 10) != "readUnused") {
			code += "case 0x3:{data = this." + readInternalWRAM + "(address | 0) | 0;break};";
		}
		/*
		 I/O Registers (04000000-040003FE)
		 Unused (04000400-04FFFFFF)
		 */
		code += "case 0x4:{data = this." + readIODispatch + "(address | 0) | 0;break};";
		/*
		 BG/OBJ Palette RAM (05000000-050003FF)
		 Unused (05000400-05FFFFFF)
		 */
		code += "case 0x5:";
		/*
		 VRAM - Video RAM (06000000-06017FFF)
		 Unused (06018000-06FFFFFF)
		 */
		code += "case 0x6:";
		/*
		 OAM - OBJ Attributes (07000000-070003FF)
		 Unused (07000400-07FFFFFF)
		 */
		code += "case 0x7:{data = this." + readVRAM + "(address | 0) | 0;break};";
		/*
		 Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
		 */
		code += "case 0x8:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
		 */
		code += "case 0x9:";
		/*
		 Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
		 */
		code += "case 0xA:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
		 */
		code += "case 0xB:{data = this." + readROM + "(address | 0) | 0;break};";
		/*
		 Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
		 */
		code += "case 0xC:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
		 */
		code += "case 0xD:{data = this." + readROM2 + "(address | 0) | 0;break};";
		/*
		 Unused, DMA 1-3 cannot read past 0DFFFFFF:
		 */
		code += "default:{data = this." + readUnused + "(" + ((readUnused.slice(0, 12) == "readUnused32") ? "" : "address | 0") + ") | 0};";
		//Generate the function:
		code += "}return data | 0;";
		return Function("address", code);
	}
	//Graphics should not be handled as often for this one:
	function compileMemoryWriteDispatch(writeUnused, writeExternalWRAM, writeInternalWRAM,
		writeIODispatch, writeVRAM, writeROM, writeSRAM) {
		var code = "address = address | 0;data = data | 0;switch (address >> 24) {";
		/*
		 Decoder for the nibble at bits 24-27
		 (Top 4 bits of the address falls through to default (unused),
		 so the next nibble down is used for dispatch.):
		 */
		/*
		 BIOS Area (00000000-00003FFF)
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 WRAM - On-board Work RAM (02000000-0203FFFF)
		 Unused (02040000-02FFFFFF)
		 */
		if (writeExternalWRAM != "writeUnused") {
			code += "case 0x2:";
			if (writeExternalWRAM.slice(0, 13) != "writeInternal") {
				code += "{this." + writeExternalWRAM + "(address | 0, data | 0);break};";
			}
		}
		/*
		 WRAM - In-Chip Work RAM (03000000-03007FFF)
		 Unused (03008000-03FFFFFF)
		 */
		if (writeInternalWRAM != "writeUnused") {
			code += "case 0x3:{this." + writeInternalWRAM + "(address | 0, data | 0);break};";
		}
		/*
		 I/O Registers (04000000-040003FE)
		 Unused (04000400-04FFFFFF)
		 */
		code += "case 0x4:{this." + writeIODispatch + "(address | 0, data | 0);break};";
		/*
		 BG/OBJ Palette RAM (05000000-050003FF)
		 Unused (05000400-05FFFFFF)
		 */
		code += "case 0x5:";
		/*
		 VRAM - Video RAM (06000000-06017FFF)
		 Unused (06018000-06FFFFFF)
		 */
		code += "case 0x6:";
		/*
		 OAM - OBJ Attributes (07000000-070003FF)
		 Unused (07000400-07FFFFFF)
		 */
		code += "case 0x7:{this." + writeVRAM + "(address | 0, data | 0);break};";
		/*
		 Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
		 */
		code += "case 0x8:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
		 */
		code += "case 0x9:";
		/*
		 Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
		 */
		code += "case 0xA:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
		 */
		code += "case 0xB:";
		/*
		 Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
		 */
		code += "case 0xC:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
		 */
		code += "case 0xD:{this." + writeROM + "(address | 0, data | 0);break};";
		/*
		 Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
		 */
		code += "case 0xE:";
		/*
		 Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
		 Mirrored up to 0FFFFFFF
		 */
		code += "case 0xF:{this." + writeSRAM + "(address | 0, data | 0);break};";
		/*
		 Unused (10000000-FFFFFFFF)
		 */
		code += "default:{this." + writeUnused + "()}";
		//Generate the function:
		code += "}";
		return Function("address", "data", code);
	}
	//Graphics calls slightly faster in this one, at the expense of other calls:
	function compileMemoryWriteDispatch2(writeUnused, writeExternalWRAM, writeInternalWRAM,
		writeIODispatch, writePalette, writeVRAM, writeOAM, writeROM, writeSRAM) {
		var code = "address = address | 0;data = data | 0;switch (address >> 24) {";
		/*
		 Decoder for the nibble at bits 24-27
		 (Top 4 bits of the address falls through to default (unused),
		 so the next nibble down is used for dispatch.):
		 */
		/*
		 BIOS Area (00000000-00003FFF)
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 WRAM - On-board Work RAM (02000000-0203FFFF)
		 Unused (02040000-02FFFFFF)
		 */
		if (writeExternalWRAM != "writeUnused") {
			code += "case 0x2:";
			if (writeExternalWRAM.slice(0, 13) != "writeInternal") {
				code += "{this." + writeExternalWRAM + "(address | 0, data | 0);break};";
			}
		}
		/*
		 WRAM - In-Chip Work RAM (03000000-03007FFF)
		 Unused (03008000-03FFFFFF)
		 */
		if (writeInternalWRAM != "writeUnused") {
			code += "case 0x3:{this." + writeInternalWRAM + "(address | 0, data | 0);break};";
		}
		/*
		 I/O Registers (04000000-040003FE)
		 Unused (04000400-04FFFFFF)
		 */
		code += "case 0x4:{this." + writeIODispatch + "(address | 0, data | 0);break};";
		/*
		 BG/OBJ Palette RAM (05000000-050003FF)
		 Unused (05000400-05FFFFFF)
		 */
		code += "case 0x5:{this." + writePalette + "(address | 0, data | 0);break};";
		/*
		 VRAM - Video RAM (06000000-06017FFF)
		 Unused (06018000-06FFFFFF)
		 */
		code += "case 0x6:{this." + writeVRAM + "(address | 0, data | 0);break};";
		/*
		 OAM - OBJ Attributes (07000000-070003FF)
		 Unused (07000400-07FFFFFF)
		 */
		code += "case 0x7:{this." + writeOAM + "(address | 0, data | 0);break};";
		/*
		 Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
		 */
		code += "case 0x8:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
		 */
		code += "case 0x9:";
		/*
		 Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
		 */
		code += "case 0xA:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
		 */
		code += "case 0xB:";
		/*
		 Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
		 */
		code += "case 0xC:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
		 */
		code += "case 0xD:{this." + writeROM + "(address | 0, data | 0);break};";
		/*
		 Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
		 */
		code += "case 0xE:";
		/*
		 Game Pak SRAM  (max 64 KBytes) - 8bit Bus width (0E000000-0E00FFFF)
		 Mirrored up to 0FFFFFFF
		 */
		code += "case 0xF:{this." + writeSRAM + "(address | 0, data | 0);break};";
		/*
		 Unused (10000000-FFFFFFFF)
		 */
		code += "default:{this." + writeUnused + "()}";
		//Generate the function:
		code += "}";
		return Function("address", "data", code);
	}
	//Optimized for DMA 0-2:
	function compileMemoryDMAWriteDispatch(writeUnused, writeExternalWRAM, writeInternalWRAM,
		writeIODispatch, writePalette, writeVRAM, writeOAM) {
		var code = "address = address | 0;data = data | 0;switch (address >> 24) {";
		/*
		 Decoder for the nibble at bits 24-27
		 (Top 4 bits of the address falls through to default (unused),
		 so the next nibble down is used for dispatch.):
		 */
		/*
		 BIOS Area (00000000-00003FFF)
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 WRAM - On-board Work RAM (02000000-0203FFFF)
		 Unused (02040000-02FFFFFF)
		 */
		if (writeExternalWRAM != "writeUnused") {
			code += "case 0x2:";
			if (writeExternalWRAM.slice(0, 13) != "writeInternal") {
				code += "{this." + writeExternalWRAM + "(address | 0, data | 0);break};";
			}
		}
		/*
		 WRAM - In-Chip Work RAM (03000000-03007FFF)
		 Unused (03008000-03FFFFFF)
		 */
		if (writeInternalWRAM != "writeUnused") {
			code += "case 0x3:{this." + writeInternalWRAM + "(address | 0, data | 0);break};";
		}
		/*
		 I/O Registers (04000000-040003FE)
		 Unused (04000400-04FFFFFF)
		 */
		code += "case 0x4:{this." + writeIODispatch + "(address | 0, data | 0);break};";
		/*
		 BG/OBJ Palette RAM (05000000-050003FF)
		 Unused (05000400-05FFFFFF)
		 */
		code += "case 0x5:{this." + writePalette + "(address | 0, data | 0);break};";
		/*
		 VRAM - Video RAM (06000000-06017FFF)
		 Unused (06018000-06FFFFFF)
		 */
		code += "case 0x6:{this." + writeVRAM + "(address | 0, data | 0);break};";
		/*
		 OAM - OBJ Attributes (07000000-070003FF)
		 Unused (07000400-07FFFFFF)
		 */
		code += "case 0x7:{this." + writeOAM + "(address | 0, data | 0);break};";
		/*
		 Unused, DMA 0-2 cannot write past 07FFFFFF:
		 */
		code += "default:{this." + writeUnused + "()}";
		//Generate the function:
		code += "}";
		return Function("address", "data", code);
	}
	//Optimized for DMA 3:
	function compileMemoryDMA3WriteDispatch(writeUnused, writeExternalWRAM, writeInternalWRAM,
		writeIODispatch, writePalette, writeVRAM, writeOAM, writeROM) {
		var code = "address = address | 0;data = data | 0;switch (address >> 24) {";
		/*
		 Decoder for the nibble at bits 24-27
		 (Top 4 bits of the address falls through to default (unused),
		 so the next nibble down is used for dispatch.):
		 */
		/*
		 BIOS Area (00000000-00003FFF)
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 Unused (00004000-01FFFFFF)
		 */
		/*
		 WRAM - On-board Work RAM (02000000-0203FFFF)
		 Unused (02040000-02FFFFFF)
		 */
		if (writeExternalWRAM != "writeUnused") {
			code += "case 0x2:";
			if (writeExternalWRAM.slice(0, 13) != "writeInternal") {
				code += "{this." + writeExternalWRAM + "(address | 0, data | 0);break};";
			}
		}
		/*
		 WRAM - In-Chip Work RAM (03000000-03007FFF)
		 Unused (03008000-03FFFFFF)
		 */
		if (writeInternalWRAM != "writeUnused") {
			code += "case 0x3:{this." + writeInternalWRAM + "(address | 0, data | 0);break};";
		}
		/*
		 I/O Registers (04000000-040003FE)
		 Unused (04000400-04FFFFFF)
		 */
		code += "case 0x4:{this." + writeIODispatch + "(address | 0, data | 0);break};";
		/*
		 BG/OBJ Palette RAM (05000000-050003FF)
		 Unused (05000400-05FFFFFF)
		 */
		code += "case 0x5:{this." + writePalette + "(address | 0, data | 0);break};";
		/*
		 VRAM - Video RAM (06000000-06017FFF)
		 Unused (06018000-06FFFFFF)
		 */
		code += "case 0x6:{this." + writeVRAM + "(address | 0, data | 0);break};";
		/*
		 OAM - OBJ Attributes (07000000-070003FF)
		 Unused (07000400-07FFFFFF)
		 */
		code += "case 0x7:{this." + writeOAM + "(address | 0, data | 0);break};";
		/*
		 Game Pak ROM (max 16MB) - Wait State 0 (08000000-08FFFFFF)
		 */
		code += "case 0x8:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 0 (09000000-09FFFFFF)
		 */
		code += "case 0x9:";
		/*
		 Game Pak ROM (max 16MB) - Wait State 1 (0A000000-0AFFFFFF)
		 */
		code += "case 0xA:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 1 (0B000000-0BFFFFFF)
		 */
		code += "case 0xB:";
		/*
		 Game Pak ROM (max 16MB) - Wait State 2 (0C000000-0CFFFFFF)
		 */
		code += "case 0xC:";
		/*
		 Game Pak ROM/FlashROM (max 16MB) - Wait State 2 (0D000000-0DFFFFFF)
		 */
		code += "case 0xD:{this." + writeROM + "(address | 0, data | 0);break};";
		/*
		 Unused, DMA 3 cannot write past 0DFFFFFF:
		 */
		code += "default:{this." + writeUnused + "()}";
		//Generate the function:
		code += "}";
		return Function("address", "data", code);
	}
	//Generic 8-Bit Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryRead8Generated = [
		compileMemoryReadDispatch(
			"readUnused8",
			"readInternalWRAM8",
			"readInternalWRAM8",
			"readIODispatch8",
			"readVRAM8Preliminary",
			"readROM8",
			"readROM28",
			"readSRAM8",
			"readBIOS8"
		),
		compileMemoryReadDispatch(
			"readUnused8",
			"readExternalWRAM8",
			"readInternalWRAM8",
			"readIODispatch8",
			"readVRAM8Preliminary",
			"readROM8",
			"readROM28",
			"readSRAM8",
			"readBIOS8"
		),
		compileMemoryReadDispatch(
			"readUnused8",
			"readUnused8",
			"readUnused8",
			"readIODispatch8",
			"readVRAM8Preliminary",
			"readROM8",
			"readROM28",
			"readSRAM8",
			"readBIOS8"
		)
	];
	//Generic 8-Bit Write Dispatch:
	GameBoyAdvanceMemory.prototype.memoryWrite8Generated = [
		compileMemoryWriteDispatch(
			"writeUnused",
			"writeInternalWRAM8",
			"writeInternalWRAM8",
			"writeIODispatch8",
			"writeVRAM8Preliminary",
			"writeROM8",
			"writeSRAM8"
		),
		compileMemoryWriteDispatch(
			"writeUnused",
			"writeExternalWRAM8",
			"writeInternalWRAM8",
			"writeIODispatch8",
			"writeVRAM8Preliminary",
			"writeROM8",
			"writeSRAM8"
		),
		compileMemoryWriteDispatch(
			"writeUnused",
			"writeUnused",
			"writeUnused",
			"writeIODispatch8",
			"writeVRAM8Preliminary",
			"writeROM8",
			"writeSRAM8"
		)
	];
	//Generic 16-Bit Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryRead16Generated = [
		compileMemoryReadDispatch(
			"readUnused16",
			"readInternalWRAM16",
			"readInternalWRAM16",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readROM16",
			"readROM216",
			"readSRAM16",
			"readBIOS16"
		),
		compileMemoryReadDispatch(
			"readUnused16",
			"readExternalWRAM16",
			"readInternalWRAM16",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readROM16",
			"readROM216",
			"readSRAM16",
			"readBIOS16"
		),
		compileMemoryReadDispatch(
			"readUnused16",
			"readUnused16",
			"readUnused16",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readROM16",
			"readROM216",
			"readSRAM16",
			"readBIOS16"
		)
	];
	//DMA 0 Optimized 16-Bit Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryReadDMA16Generated = [
		compileMemoryDMA0ReadDispatch(
			"readUnused16DMA",
			"readInternalWRAM16",
			"readInternalWRAM16",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readBIOS16DMA"
		),
		compileMemoryDMA0ReadDispatch(
			"readUnused16DMA",
			"readExternalWRAM16",
			"readInternalWRAM16",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readBIOS16DMA"
		),
		compileMemoryDMA0ReadDispatch(
			"readUnused16DMA",
			"readUnused16DMA",
			"readUnused16DMA",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readBIOS16DMA"
		)
	];
	//DMA 1-3 Optimized 16-Bit Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryReadDMA16FullGenerated = [
		compileMemoryDMAReadDispatch(
			"readUnused16DMA",
			"readInternalWRAM16",
			"readInternalWRAM16",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readROM16",
			"readROM216",
			"readBIOS16DMA"
		),
		compileMemoryDMAReadDispatch(
			"readUnused16DMA",
			"readExternalWRAM16",
			"readInternalWRAM16",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readROM16",
			"readROM216",
			"readBIOS16DMA"
		),
		compileMemoryDMAReadDispatch(
			"readUnused16DMA",
			"readUnused16DMA",
			"readUnused16DMA",
			"readIODispatch16",
			"readVRAM16Preliminary",
			"readROM16",
			"readROM216",
			"readBIOS16DMA"
		)
	];
	//Generic 16-Bit Instruction Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryReadCPU16Generated = [
		compileMemoryReadDispatch(
			"readUnused16CPU",
			"readInternalWRAM16CPU",
			"readInternalWRAM16CPU",
			"readIODispatch16CPU",
			"readVRAM16CPUPreliminary",
			"readROM16CPU",
			"readROM216CPU",
			"readSRAM16CPU",
			"readBIOS16CPU"
		),
		compileMemoryReadDispatch(
			"readUnused16CPU",
			"readExternalWRAM16CPU",
			"readInternalWRAM16CPU",
			"readIODispatch16CPU",
			"readVRAM16CPUPreliminary",
			"readROM16CPU",
			"readROM216CPU",
			"readSRAM16CPU",
			"readBIOS16CPU"
		),
		compileMemoryReadDispatch(
			"readUnused16CPU",
			"readUnused16CPU",
			"readUnused16CPU",
			"readIODispatch16CPU",
			"readVRAM16CPUPreliminary",
			"readROM16CPU",
			"readROM216CPU",
			"readSRAM16CPU",
			"readBIOS16CPU"
		)
	];
	//Generic 16-Bit Write Dispatch:
	GameBoyAdvanceMemory.prototype.memoryWrite16Generated = [
		compileMemoryWriteDispatch2(
			"writeUnused",
			"writeInternalWRAM16",
			"writeInternalWRAM16",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16",
			"writeROM16",
			"writeSRAM16"
		),
		compileMemoryWriteDispatch2(
			"writeUnused",
			"writeExternalWRAM16",
			"writeInternalWRAM16",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16",
			"writeROM16",
			"writeSRAM16"
		),
		compileMemoryWriteDispatch2(
			"writeUnused",
			"writeUnused",
			"writeUnused",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16",
			"writeROM16",
			"writeSRAM16"
		)
	];
	//DMA 0-2 Optimized 16-Bit Write Dispatch:
	GameBoyAdvanceMemory.prototype.memoryWriteDMA16Generated = [
		compileMemoryDMAWriteDispatch(
			"writeUnused",
			"writeInternalWRAM16",
			"writeInternalWRAM16",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16"
		),
		compileMemoryDMAWriteDispatch(
			"writeUnused",
			"writeExternalWRAM16",
			"writeInternalWRAM16",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16"
		),
		compileMemoryDMAWriteDispatch(
			"writeUnused",
			"writeUnused",
			"writeUnused",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16"
		)
	];
	//DMA 3 Optimized 16-Bit Write Dispatch:
	GameBoyAdvanceMemory.prototype.memoryWriteDMA16FullGenerated = [
		compileMemoryDMA3WriteDispatch(
			"writeUnused",
			"writeInternalWRAM16",
			"writeInternalWRAM16",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16",
			"writeROM16DMA"
		),
		compileMemoryDMA3WriteDispatch(
			"writeUnused",
			"writeExternalWRAM16",
			"writeInternalWRAM16",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16",
			"writeROM16DMA"
		),
		compileMemoryDMA3WriteDispatch(
			"writeUnused",
			"writeUnused",
			"writeUnused",
			"writeIODispatch16",
			"writePalette16",
			"writeVRAM16",
			"writeOBJ16",
			"writeROM16DMA"
		)
	];
	//Generic 32-Bit Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryRead32Generated = [
		compileMemoryReadDispatch(
			"readUnused32",
			"readInternalWRAM32",
			"readInternalWRAM32",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readROM32",
			"readROM232",
			"readSRAM32",
			"readBIOS32"
		),
		compileMemoryReadDispatch(
			"readUnused32",
			"readExternalWRAM32",
			"readInternalWRAM32",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readROM32",
			"readROM232",
			"readSRAM32",
			"readBIOS32"
		),
		compileMemoryReadDispatch(
			"readUnused32",
			"readUnused32",
			"readUnused32",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readROM32",
			"readROM232",
			"readSRAM32",
			"readBIOS32"
		)
	];
	//DMA 0 Optimized 32-Bit Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryReadDMA32Generated = [
		compileMemoryDMA0ReadDispatch(
			"readUnused32DMA",
			"readInternalWRAM32",
			"readInternalWRAM32",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readBIOS32DMA"
		),
		compileMemoryDMA0ReadDispatch(
			"readUnused32DMA",
			"readExternalWRAM32",
			"readInternalWRAM32",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readBIOS32DMA"
		),
		compileMemoryDMA0ReadDispatch(
			"readUnused32DMA",
			"readUnused32DMA",
			"readUnused32DMA",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readBIOS32DMA"
		)
	];
	//DMA 1-3 Optimized 32-Bit Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryReadDMA32FullGenerated = [
		compileMemoryDMAReadDispatch(
			"readUnused32DMA",
			"readInternalWRAM32",
			"readInternalWRAM32",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readROM32",
			"readROM232",
			"readBIOS32DMA"
		),
		compileMemoryDMAReadDispatch(
			"readUnused32DMA",
			"readExternalWRAM32",
			"readInternalWRAM32",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readROM32",
			"readROM232",
			"readBIOS32DMA"
		),
		compileMemoryDMAReadDispatch(
			"readUnused32DMA",
			"readUnused32DMA",
			"readUnused32DMA",
			"readIODispatch32",
			"readVRAM32Preliminary",
			"readROM32",
			"readROM232",
			"readBIOS32DMA"
		)
	];
	//Generic 32-Bit Instruction Read Dispatch:
	GameBoyAdvanceMemory.prototype.memoryReadCPU32Generated = [
		compileMemoryReadDispatch(
			"readUnused32CPU",
			"readInternalWRAM32CPU",
			"readInternalWRAM32CPU",
			"readIODispatch32CPU",
			"readVRAM32CPUPreliminary",
			"readROM32CPU",
			"readROM232CPU",
			"readSRAM32CPU",
			"readBIOS32CPU"
		),
		compileMemoryReadDispatch(
			"readUnused32CPU",
			"readExternalWRAM32CPU",
			"readInternalWRAM32CPU",
			"readIODispatch32CPU",
			"readVRAM32CPUPreliminary",
			"readROM32CPU",
			"readROM232CPU",
			"readSRAM32CPU",
			"readBIOS32CPU"
		),
		compileMemoryReadDispatch(
			"readUnused32CPU",
			"readUnused32CPU",
			"readUnused32CPU",
			"readIODispatch32CPU",
			"readVRAM32CPUPreliminary",
			"readROM32CPU",
			"readROM232CPU",
			"readSRAM32CPU",
			"readBIOS32CPU"
		)
	];
	//Generic 32-Bit Write Dispatch:
	GameBoyAdvanceMemory.prototype.memoryWrite32Generated = [
		compileMemoryWriteDispatch2(
			"writeUnused",
			"writeInternalWRAM32",
			"writeInternalWRAM32",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32",
			"writeROM32",
			"writeSRAM32"
		),
		compileMemoryWriteDispatch2(
			"writeUnused",
			"writeExternalWRAM32",
			"writeInternalWRAM32",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32",
			"writeROM32",
			"writeSRAM32"
		),
		compileMemoryWriteDispatch2(
			"writeUnused",
			"writeUnused",
			"writeUnused",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32",
			"writeROM32",
			"writeSRAM32"
		)
	];
	//DMA 0-2 Optimized 32-Bit Write Dispatch:
	GameBoyAdvanceMemory.prototype.memoryWriteDMA32Generated = [
		compileMemoryDMAWriteDispatch(
			"writeUnused",
			"writeInternalWRAM32",
			"writeInternalWRAM32",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32"
		),
		compileMemoryDMAWriteDispatch(
			"writeUnused",
			"writeExternalWRAM32",
			"writeInternalWRAM32",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32"
		),
		compileMemoryDMAWriteDispatch(
			"writeUnused",
			"writeUnused",
			"writeUnused",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32"
		)
	];
	//DMA 3 Optimized 32-Bit Write Dispatch:
	GameBoyAdvanceMemory.prototype.memoryWriteDMA32FullGenerated = [
		compileMemoryDMA3WriteDispatch(
			"writeUnused",
			"writeInternalWRAM32",
			"writeInternalWRAM32",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32",
			"writeROM32"
		),
		compileMemoryDMA3WriteDispatch(
			"writeUnused",
			"writeExternalWRAM32",
			"writeInternalWRAM32",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32",
			"writeROM32"
		),
		compileMemoryDMA3WriteDispatch(
			"writeUnused",
			"writeUnused",
			"writeUnused",
			"writeIODispatch32",
			"writePalette32",
			"writeVRAM32",
			"writeOBJ32",
			"writeROM32"
		)
	];
}
generateMemoryTopLevelDispatch();







"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceIRQ(IOCore) {
	//Build references:
	this.IOCore = IOCore;
}
GameBoyAdvanceIRQ.prototype.initialize = function () {
	this.interruptsEnabled = 0;
	this.interruptsRequested = 0;
	this.IME = 0;
	this.gfxState = this.IOCore.gfxState;
	this.timer = this.IOCore.timer;
	this.dmaChannel0 = this.IOCore.dmaChannel0;
	this.dmaChannel1 = this.IOCore.dmaChannel1;
	this.dmaChannel2 = this.IOCore.dmaChannel2;
	this.dmaChannel3 = this.IOCore.dmaChannel3;
}
GameBoyAdvanceIRQ.prototype.IRQMatch = function () {
	//Used to exit HALT:
	return (this.interruptsEnabled & this.interruptsRequested);
}
GameBoyAdvanceIRQ.prototype.checkForIRQFire = function () {
	//Tell the CPU core when the emulated hardware is triggering an IRQ:
	this.IOCore.cpu.triggerIRQ(this.interruptsEnabled & this.interruptsRequested & this.IME);
}
GameBoyAdvanceIRQ.prototype.requestIRQ = function (irqLineToSet) {
	irqLineToSet = irqLineToSet | 0;
	this.interruptsRequested = this.interruptsRequested | irqLineToSet;
	this.checkForIRQFire();
}
GameBoyAdvanceIRQ.prototype.writeIME = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	this.IME = (data << 31) >> 31;
	this.checkForIRQFire();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceIRQ.prototype.writeIE8_0 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	var oldValue = this.interruptsEnabled & 0x3F00;
	data = data & 0xFF;
	data = data | oldValue;
	this.interruptsEnabled = data | 0;
	this.checkForIRQFire();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceIRQ.prototype.writeIE8_1 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	var oldValue = this.interruptsEnabled & 0xFF;
	data = (data & 0x3F) << 8;
	data = data | oldValue;
	this.interruptsEnabled = data | 0;
	this.checkForIRQFire();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceIRQ.prototype.writeIE16 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	this.interruptsEnabled = data & 0x3FFF;
	this.checkForIRQFire();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceIRQ.prototype.writeIF8_0 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	data = ~(data & 0xFF);
	this.interruptsRequested = this.interruptsRequested & data;
	this.checkForIRQFire();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceIRQ.prototype.writeIF8_1 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	data = ~((data & 0xFF) << 8);
	this.interruptsRequested = this.interruptsRequested & data;
	this.checkForIRQFire();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceIRQ.prototype.writeIF16 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	data = ~data;
	this.interruptsRequested = this.interruptsRequested & data;
	this.checkForIRQFire();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceIRQ.prototype.writeIRQ32 = function (data) {
	data = data | 0;
	this.IOCore.updateCoreClocking();
	this.interruptsEnabled = data & 0x3FFF;
	data = ~(data >> 16);
	this.interruptsRequested = this.interruptsRequested & data;
	this.checkForIRQFire();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceIRQ.prototype.readIME = function () {
	var data = this.IME & 0x1;
	return data | 0;
}
GameBoyAdvanceIRQ.prototype.readIE8_0 = function () {
	var data = this.interruptsEnabled & 0xFF;
	return data | 0;
}
GameBoyAdvanceIRQ.prototype.readIE8_1 = function () {
	var data = this.interruptsEnabled >> 8;
	return data | 0;
}
GameBoyAdvanceIRQ.prototype.readIE16 = function () {
	var data = this.interruptsEnabled | 0;
	return data | 0;
}
GameBoyAdvanceIRQ.prototype.readIF8_0 = function () {
	this.IOCore.updateCoreSpillRetain();
	var data = this.interruptsRequested & 0xFF;
	return data | 0;
}
GameBoyAdvanceIRQ.prototype.readIF8_1 = function () {
	this.IOCore.updateCoreSpillRetain();
	var data = this.interruptsRequested >> 8;
	return data | 0;
}
GameBoyAdvanceIRQ.prototype.readIF16 = function () {
	this.IOCore.updateCoreSpillRetain();
	var data = this.interruptsRequested | 0;
	return data | 0;
}
GameBoyAdvanceIRQ.prototype.readIRQ32 = function () {
	this.IOCore.updateCoreSpillRetain();
	var data = (this.interruptsRequested << 16) | this.interruptsEnabled;
	return data | 0;
}
GameBoyAdvanceIRQ.prototype.nextEventTime = function () {
	var clocks = 0x7FFFFFFF;
	if ((this.interruptsEnabled & 0x1) != 0) {
		clocks = this.gfxState.nextVBlankIRQEventTime() | 0;
	}
	if ((this.interruptsEnabled & 0x2) != 0) {
		clocks = Math.min(clocks | 0, this.gfxState.nextHBlankIRQEventTime() | 0) | 0;
	}
	if ((this.interruptsEnabled & 0x4) != 0) {
		clocks = Math.min(clocks | 0, this.gfxState.nextVCounterIRQEventTime() | 0) | 0;
	}
	if ((this.interruptsEnabled & 0x8) != 0) {
		clocks = Math.min(clocks | 0, this.timer.nextTimer0IRQEventTime() | 0) | 0;
	}
	if ((this.interruptsEnabled & 0x10) != 0) {
		clocks = Math.min(clocks | 0, this.timer.nextTimer1IRQEventTime() | 0) | 0;
	}
	if ((this.interruptsEnabled & 0x20) != 0) {
		clocks = Math.min(clocks | 0, this.timer.nextTimer2IRQEventTime() | 0) | 0;
	}
	if ((this.interruptsEnabled & 0x40) != 0) {
		clocks = Math.min(clocks | 0, this.timer.nextTimer3IRQEventTime() | 0) | 0;
	}
	/*if ((this.interruptsEnabled & 0x80) != 0) {
		clocks = Math.min(clocks | 0, this.IOCore.serial.nextIRQEventTime() | 0) | 0;
	}
	if ((this.interruptsEnabled & 0x2000) != 0) {
		clocks = Math.min(clocks | 0, this.IOCore.cartridge.nextIRQEventTime() | 0) | 0;
	}*/
	return clocks | 0;
}
GameBoyAdvanceIRQ.prototype.nextIRQEventTime = function () {
	var clocks = 0x7FFFFFFF;
	//Checks IME:
	if ((this.IME | 0) != 0) {
		clocks = this.nextEventTime() | 0;
	}
	return clocks | 0;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceJoyPad(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceJoyPad.prototype.initialize = function () {
	this.keyInput = 0x3FF;
	this.keyInterrupt = 0;
}
GameBoyAdvanceJoyPad.prototype.keyPress = function (keyPressed) {
	keyPressed = keyPressed | 0;
	keyPressed = 1 << (keyPressed | 0);
	this.keyInput = this.keyInput & (~keyPressed);
	this.checkForMatch();
}
GameBoyAdvanceJoyPad.prototype.keyRelease = function (keyReleased) {
	keyReleased = keyReleased | 0;
	keyReleased = 1 << (keyReleased | 0);
	this.keyInput = this.keyInput | keyReleased;
	this.checkForMatch();
}
GameBoyAdvanceJoyPad.prototype.checkForMatch = function () {
	if ((this.keyInterrupt & 0x8000) != 0) {
		if (((~this.keyInput) & this.keyInterrupt & 0x3FF) == (this.keyInterrupt & 0x3FF)) {
			this.IOCore.deflagStop();
			this.checkForIRQ();
		}
	} else if (((~this.keyInput) & this.keyInterrupt & 0x3FF) != 0) {
		this.IOCore.deflagStop();
		this.checkForIRQ();
	}
}
GameBoyAdvanceJoyPad.prototype.checkForIRQ = function () {
	if ((this.keyInterrupt & 0x4000) != 0) {
		this.IOCore.irq.requestIRQ(0x1000);
	}
}
GameBoyAdvanceJoyPad.prototype.readKeyStatus8_0 = function () {
	return this.keyInput & 0xFF;
}
GameBoyAdvanceJoyPad.prototype.readKeyStatus8_1 = function () {
	return (this.keyInput >> 8) | 0;
}
GameBoyAdvanceJoyPad.prototype.readKeyStatus16 = function () {
	return this.keyInput | 0;
}
GameBoyAdvanceJoyPad.prototype.writeKeyControl8_0 = function (data) {
	data = data | 0;
	this.keyInterrupt = this.keyInterrupt & 0xC300;
	data = data & 0xFF;
	this.keyInterrupt = this.keyInterrupt | data;
}
GameBoyAdvanceJoyPad.prototype.writeKeyControl8_1 = function (data) {
	data = data | 0;
	this.keyInterrupt = this.keyInterrupt & 0xFF;
	data = data & 0xC3;
	this.keyInterrupt = this.keyInterrupt | (data << 8);
}
GameBoyAdvanceJoyPad.prototype.writeKeyControl16 = function (data) {
	data = data | 0;
	this.keyInterrupt = data & 0xC3FF;
}
GameBoyAdvanceJoyPad.prototype.readKeyControl8_0 = function () {
	return this.keyInterrupt & 0xFF;
}
GameBoyAdvanceJoyPad.prototype.readKeyControl8_1 = function () {
	return (this.keyInterrupt >> 8) | 0;
}
GameBoyAdvanceJoyPad.prototype.readKeyControl16 = function () {
	return this.keyInterrupt | 0;
}
GameBoyAdvanceJoyPad.prototype.readKeyStatusControl32 = function () {
	return this.keyInput | (this.keyInterrupt << 16);
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceSerial(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceSerial.prototype.initialize = function () {
	this.SIODATA_A = 0xFFFF;
	this.SIODATA_B = 0xFFFF;
	this.SIODATA_C = 0xFFFF;
	this.SIODATA_D = 0xFFFF;
	this.SIOShiftClockExternal = 0;
	this.SIOShiftClockDivider = 0x40;
	this.SIOCNT0_DATA = 0x0C;
	this.SIOTransferStarted = false;
	this.SIOMULT_PLAYER_NUMBER = 0;
	this.SIOCOMMERROR = false;
	this.SIOBaudRate = 0;
	this.SIOCNT_UART_CTS = false;
	this.SIOCNT_UART_MISC = 0;
	this.SIOCNT_UART_FIFO = 0;
	this.SIOCNT_IRQ = 0;
	this.SIOCNT_MODE = 0;
	this.SIOCNT_UART_RECV_ENABLE = false;
	this.SIOCNT_UART_SEND_ENABLE = false;
	this.SIOCNT_UART_PARITY_ENABLE = false;
	this.SIOCNT_UART_FIFO_ENABLE = false;
	this.SIODATA8 = 0xFFFF;
	this.RCNTMode = 0;
	this.RCNTIRQ = false;
	this.RCNTDataBits = 0;
	this.RCNTDataBitFlow = 0;
	this.JOYBUS_IRQ = 0;
	this.JOYBUS_CNTL_FLAGS = 0;
	this.JOYBUS_RECV0 = 0xFF;
	this.JOYBUS_RECV1 = 0xFF;
	this.JOYBUS_RECV2 = 0xFF;
	this.JOYBUS_RECV3 = 0xFF;
	this.JOYBUS_SEND0 = 0xFF;
	this.JOYBUS_SEND1 = 0xFF;
	this.JOYBUS_SEND2 = 0xFF;
	this.JOYBUS_SEND3 = 0xFF;
	this.JOYBUS_STAT = 0;
	this.shiftClocks = 0;
	this.serialBitsShifted = 0;
}
GameBoyAdvanceSerial.prototype.SIOMultiplayerBaudRate = [
	9600,
	38400,
	57600,
	115200
];
GameBoyAdvanceSerial.prototype.addClocks = function (clocks) {
	clocks = clocks | 0;
	if ((this.RCNTMode | 0) < 2) {
		switch (this.SIOCNT_MODE | 0) {
			case 0:
			case 1:
				if (this.SIOTransferStarted && (this.SIOShiftClockExternal | 0) == 0) {
					this.shiftClocks = ((this.shiftClocks | 0) + (clocks | 0)) | 0;
					while ((this.shiftClocks | 0) >= (this.SIOShiftClockDivider | 0)) {
						this.shiftClocks = ((this.shiftClocks | 0) - (this.SIOShiftClockDivider | 0)) | 0;
						this.clockSerial();
					}
				}
				break;
			case 2:
				if (this.SIOTransferStarted && (this.SIOMULT_PLAYER_NUMBER | 0) == 0) {
					this.shiftClocks = ((this.shiftClocks | 0) + (clocks | 0)) | 0;
					while ((this.shiftClocks | 0) >= (this.SIOShiftClockDivider | 0)) {
						this.shiftClocks = ((this.shiftClocks | 0) - (this.SIOShiftClockDivider | 0)) | 0;
						this.clockMultiplayer();
					}
				}
				break;
			case 3:
				if (this.SIOCNT_UART_SEND_ENABLE && !this.SIOCNT_UART_CTS) {
					this.shiftClocks = ((this.shiftClocks | 0) + (clocks | 0)) | 0;
					while ((this.shiftClocks | 0) >= (this.SIOShiftClockDivider | 0)) {
						this.shiftClocks = ((this.shiftClocks | 0) - (this.SIOShiftClockDivider | 0)) | 0;
						this.clockUART();
					}
				}
		}
	}
}
GameBoyAdvanceSerial.prototype.clockSerial = function () {
	//Emulate as if no slaves connected:
	this.serialBitsShifted = ((this.serialBitsShifted | 0) + 1) | 0;
	if ((this.SIOCNT_MODE | 0) == 0) {
		//8-bit
		this.SIODATA8 = ((this.SIODATA8 << 1) | 1) & 0xFFFF;
		if ((this.serialBitsShifted | 0) == 8) {
			this.SIOTransferStarted = false;
			this.serialBitsShifted = 0;
			if ((this.SIOCNT_IRQ | 0) != 0) {
				//this.IOCore.irq.requestIRQ(0x80);
			}
		}
	} else {
		//32-bit
		this.SIODATA_D = ((this.SIODATA_D << 1) & 0xFE) | (this.SIODATA_C >> 7);
		this.SIODATA_C = ((this.SIODATA_C << 1) & 0xFE) | (this.SIODATA_B >> 7);
		this.SIODATA_B = ((this.SIODATA_B << 1) & 0xFE) | (this.SIODATA_A >> 7);
		this.SIODATA_A = ((this.SIODATA_A << 1) & 0xFE) | 1;
		if ((this.serialBitsShifted | 0) == 32) {
			this.SIOTransferStarted = false;
			this.serialBitsShifted = 0;
			if ((this.SIOCNT_IRQ | 0) != 0) {
				//this.IOCore.irq.requestIRQ(0x80);
			}
		}
	}
}
GameBoyAdvanceSerial.prototype.clockMultiplayer = function () {
	//Emulate as if no slaves connected:
	this.SIODATA_A = this.SIODATA8 | 0;
	this.SIODATA_B = 0xFFFF;
	this.SIODATA_C = 0xFFFF;
	this.SIODATA_D = 0xFFFF;
	this.SIOTransferStarted = false;
	this.SIOCOMMERROR = true;
	if ((this.SIOCNT_IRQ | 0) != 0) {
		//this.IOCore.irq.requestIRQ(0x80);
	}
}
GameBoyAdvanceSerial.prototype.clockUART = function () {
	this.serialBitsShifted = ((this.serialBitsShifted | 0) + 1) | 0;
	if (this.SIOCNT_UART_FIFO_ENABLE) {
		if ((this.serialBitsShifted | 0) == 8) {
			this.serialBitsShifted = 0;
			this.SIOCNT_UART_FIFO = Math.max(((this.SIOCNT_UART_FIFO | 0) - 1) | 0, 0) | 0;
			if ((this.SIOCNT_UART_FIFO | 0) == 0 && (this.SIOCNT_IRQ | 0) != 0) {
				//this.IOCore.irq.requestIRQ(0x80);
			}
		}
	} else {
		if ((this.serialBitsShifted | 0) == 8) {
			this.serialBitsShifted = 0;
			if ((this.SIOCNT_IRQ | 0) != 0) {
				//this.IOCore.irq.requestIRQ(0x80);
			}
		}
	}
}
GameBoyAdvanceSerial.prototype.writeSIODATA_A0 = function (data) {
	data = data | 0;
	this.SIODATA_A = (this.SIODATA_A & 0xFF00) | data;
}
GameBoyAdvanceSerial.prototype.readSIODATA_A0 = function () {
	return this.SIODATA_A & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_A1 = function (data) {
	data = data | 0;
	this.SIODATA_A = (this.SIODATA_A & 0xFF) | (data << 8);
}
GameBoyAdvanceSerial.prototype.readSIODATA_A1 = function () {
	return this.SIODATA_A >> 8;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_B0 = function (data) {
	data = data | 0;
	this.SIODATA_B = (this.SIODATA_B & 0xFF00) | data;
}
GameBoyAdvanceSerial.prototype.readSIODATA_B0 = function () {
	return this.SIODATA_B & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_B1 = function (data) {
	data = data | 0;
	this.SIODATA_B = (this.SIODATA_B & 0xFF) | (data << 8);
}
GameBoyAdvanceSerial.prototype.readSIODATA_B1 = function () {
	return this.SIODATA_B >> 8;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_C0 = function (data) {
	data = data | 0;
	this.SIODATA_C = (this.SIODATA_C & 0xFF00) | data;
}
GameBoyAdvanceSerial.prototype.readSIODATA_C0 = function () {
	return this.SIODATA_C & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_C1 = function (data) {
	data = data | 0;
	this.SIODATA_C = (this.SIODATA_C & 0xFF) | (data << 8);
}
GameBoyAdvanceSerial.prototype.readSIODATA_C1 = function () {
	return this.SIODATA_C >> 8;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_D0 = function (data) {
	data = data | 0;
	this.SIODATA_D = (this.SIODATA_D & 0xFF00) | data;
}
GameBoyAdvanceSerial.prototype.readSIODATA_D0 = function () {
	return this.SIODATA_D & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA_D1 = function (data) {
	data = data | 0;
	this.SIODATA_D = (this.SIODATA_D & 0xFF) | (data << 8);
}
GameBoyAdvanceSerial.prototype.readSIODATA_D1 = function () {
	return this.SIODATA_D >> 8;
}
GameBoyAdvanceSerial.prototype.writeSIOCNT0 = function (data) {
	if ((this.RCNTMode | 0) < 0x2) {
		switch (this.SIOCNT_MODE | 0) {
			//8-Bit:
			case 0:
				//32-Bit:
			case 1:
				this.SIOShiftClockExternal = data & 0x1;
				this.SIOShiftClockDivider = ((data & 0x2) != 0) ? 0x8 : 0x40;
				this.SIOCNT0_DATA = data & 0xB;
				if ((data & 0x80) != 0) {
					if (!this.SIOTransferStarted) {
						this.SIOTransferStarted = true;
						this.serialBitsShifted = 0;
						this.shiftClocks = 0;
					}
				} else {
					this.SIOTransferStarted = false;
				}
				break;
				//Multiplayer:
			case 2:
				this.SIOBaudRate = data & 0x3;
				this.SIOShiftClockDivider = this.SIOMultiplayerBaudRate[this.SIOBaudRate | 0] | 0;
				this.SIOMULT_PLAYER_NUMBER = (data >> 4) & 0x3;
				this.SIOCOMMERROR = ((data & 0x40) != 0);
				if ((data & 0x80) != 0) {
					if (!this.SIOTransferStarted) {
						this.SIOTransferStarted = true;
						if ((this.SIOMULT_PLAYER_NUMBER | 0) == 0) {
							this.SIODATA_A = 0xFFFF;
							this.SIODATA_B = 0xFFFF;
							this.SIODATA_C = 0xFFFF;
							this.SIODATA_D = 0xFFFF;
						}
						this.serialBitsShifted = 0;
						this.shiftClocks = 0;
					}
				} else {
					this.SIOTransferStarted = false;
				}
				break;
				//UART:
			case 3:
				this.SIOBaudRate = data & 0x3;
				this.SIOShiftClockDivider = this.SIOMultiplayerBaudRate[this.SIOBaudRate | 0] | 0;
				this.SIOCNT_UART_MISC = (data & 0xCF) >> 2;
				this.SIOCNT_UART_CTS = ((data & 0x4) != 0);
		}
	}
}
GameBoyAdvanceSerial.prototype.readSIOCNT0 = function () {
	if (this.RCNTMode < 0x2) {
		switch (this.SIOCNT_MODE) {
			//8-Bit:
			case 0:
				//32-Bit:
			case 1:
				return ((this.SIOTransferStarted) ? 0x80 : 0) | 0x74 | this.SIOCNT0_DATA;
				//Multiplayer:
			case 2:
				return ((this.SIOTransferStarted) ? 0x80 : 0) | ((this.SIOCOMMERROR) ? 0x40 : 0) | (this.SIOMULT_PLAYER_NUMBER << 4) | this.SIOBaudRate;
				//UART:
			case 3:
				return (this.SIOCNT_UART_MISC << 2) | ((this.SIOCNT_UART_FIFO == 4) ? 0x30 : 0x20) | this.SIOBaudRate;
		}
	}
	return 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIOCNT1 = function (data) {
	this.SIOCNT_IRQ = data & 0x40;
	this.SIOCNT_MODE = (data >> 4) & 0x3;
	this.SIOCNT_UART_RECV_ENABLE = ((data & 0x8) != 0);
	this.SIOCNT_UART_SEND_ENABLE = ((data & 0x4) != 0);
	this.SIOCNT_UART_PARITY_ENABLE = ((data & 0x2) != 0);
	this.SIOCNT_UART_FIFO_ENABLE = ((data & 0x1) != 0);
}
GameBoyAdvanceSerial.prototype.readSIOCNT1 = function () {
	return (0x80 | this.SIOCNT_IRQ | (this.SIOCNT_MODE << 4) | ((this.SIOCNT_UART_RECV_ENABLE) ? 0x8 : 0) |
		((this.SIOCNT_UART_SEND_ENABLE) ? 0x4 : 0) | ((this.SIOCNT_UART_PARITY_ENABLE) ? 0x2 : 0) | ((this.SIOCNT_UART_FIFO_ENABLE) ? 0x2 : 0));
}
GameBoyAdvanceSerial.prototype.writeSIODATA8_0 = function (data) {
	data = data | 0;
	this.SIODATA8 = (this.SIODATA8 & 0xFF00) | data;
	if ((this.RCNTMode | 0) < 0x2 && (this.SIOCNT_MODE | 0) == 3 && this.SIOCNT_UART_FIFO_ENABLE) {
		this.SIOCNT_UART_FIFO = Math.min(((this.SIOCNT_UART_FIFO | 0) + 1) | 0, 4) | 0;
	}
}
GameBoyAdvanceSerial.prototype.readSIODATA8_0 = function () {
	return this.SIODATA8 & 0xFF;
}
GameBoyAdvanceSerial.prototype.writeSIODATA8_1 = function (data) {
	data = data | 0;
	this.SIODATA8 = (this.SIODATA8 & 0xFF) | (data << 8);
}
GameBoyAdvanceSerial.prototype.readSIODATA8_1 = function () {
	return this.SIODATA8 >> 8;
}
GameBoyAdvanceSerial.prototype.writeRCNT0 = function (data) {
	if ((this.RCNTMode | 0) == 0x2) {
		//General Comm:
		var oldDataBits = this.RCNTDataBits | 0;
		this.RCNTDataBits = data & 0xF; //Device manually controls SI/SO/SC/SD here.
		this.RCNTDataBitFlow = data >> 4;
		if (this.RCNTIRQ && ((oldDataBits ^ this.RCNTDataBits) & oldDataBits & 0x4) != 0) {
			//SI fell low, trigger IRQ:
			//this.IOCore.irq.requestIRQ(0x80);
		}
	}
}
GameBoyAdvanceSerial.prototype.readRCNT0 = function () {
	return (this.RCNTDataBitFlow << 4) | this.RCNTDataBits;
}
GameBoyAdvanceSerial.prototype.writeRCNT1 = function (data) {
	this.RCNTMode = data >> 6;
	this.RCNTIRQ = ((data & 0x1) != 0);
	if ((this.RCNTMode | 0) != 0x2) {
		//Force SI/SO/SC/SD to low as we're never "hooked" up:
		this.RCNTDataBits = 0;
		this.RCNTDataBitFlow = 0;
	}
}
GameBoyAdvanceSerial.prototype.readRCNT1 = function () {
	return (this.RCNTMode << 6) | ((this.RCNTIRQ) ? 0x3F : 0x3E);
}
GameBoyAdvanceSerial.prototype.writeJOYCNT = function (data) {
	this.JOYBUS_IRQ = (data << 25) >> 31;
	this.JOYBUS_CNTL_FLAGS &= ~(data & 0x7);
}
GameBoyAdvanceSerial.prototype.readJOYCNT = function () {
	return (this.JOYBUS_CNTL_FLAGS | 0x40) | (0xB8 & this.JOYBUS_IRQ);
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV0 = function (data) {
	this.JOYBUS_RECV0 = data | 0;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_RECV0 = function () {
	this.JOYBUS_STAT = this.JOYBUS_STAT & 0xF7;
	return this.JOYBUS_RECV0 | 0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV1 = function (data) {
	this.JOYBUS_RECV1 = data | 0;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_RECV1 = function () {
	this.JOYBUS_STAT = this.JOYBUS_STAT & 0xF7;
	return this.JOYBUS_RECV1 | 0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV2 = function (data) {
	this.JOYBUS_RECV2 = data | 0;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_RECV2 = function () {
	this.JOYBUS_STAT = this.JOYBUS_STAT & 0xF7;
	return this.JOYBUS_RECV2 | 0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV3 = function (data) {
	this.JOYBUS_RECV3 = data | 0;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_RECV3 = function () {
	this.JOYBUS_STAT = this.JOYBUS_STAT & 0xF7;
	return this.JOYBUS_RECV3 | 0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND0 = function (data) {
	this.JOYBUS_SEND0 = data | 0;
	this.JOYBUS_STAT = this.JOYBUS_STAT | 0x2;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_SEND0 = function () {
	return this.JOYBUS_SEND0 | 0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND1 = function (data) {
	this.JOYBUS_SEND1 = data | 0;
	this.JOYBUS_STAT = this.JOYBUS_STAT | 0x2;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_SEND1 = function () {
	return this.JOYBUS_SEND1 | 0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND2 = function (data) {
	this.JOYBUS_SEND2 = data | 0;
	this.JOYBUS_STAT = this.JOYBUS_STAT | 0x2;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_SEND2 = function () {
	return this.JOYBUS_SEND2 | 0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND3 = function (data) {
	this.JOYBUS_SEND3 = data | 0;
	this.JOYBUS_STAT = this.JOYBUS_STAT | 0x2;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_SEND3 = function () {
	return this.JOYBUS_SEND3 | 0;
}
GameBoyAdvanceSerial.prototype.writeJOYBUS_STAT = function (data) {
	this.JOYBUS_STAT = data | 0;
}
GameBoyAdvanceSerial.prototype.readJOYBUS_STAT = function () {
	return 0xC5 | this.JOYBUS_STAT;
}
/*GameBoyAdvanceSerial.prototype.nextIRQEventTime = function (clocks) {
	if ((this.SIOCNT_IRQ | 0) != 0 && (this.RCNTMode | 0) < 2) {
		switch (this.SIOCNT_MODE | 0) {
			case 0:
			case 1:
				if (this.SIOTransferStarted && (this.SIOShiftClockExternal | 0) == 0) {
					return ((((this.SIOCNT_MODE == 1) ? 31 : 7) - this.serialBitsShifted) * this.SIOShiftClockDivider) + (this.SIOShiftClockDivider - this.shiftClocks);
				}
				else {
					return 0x7FFFFFFF;
				}
			case 2:
				if (this.SIOTransferStarted && this.SIOMULT_PLAYER_NUMBER == 0) {
					return this.SIOShiftClockDivider - this.shiftClocks;
				}
				else {
					return 0x7FFFFFFF;
				}
			case 3:
				if (this.SIOCNT_UART_SEND_ENABLE && !this.SIOCNT_UART_CTS) {
					return (Math.max(((this.SIOCNT_UART_FIFO_ENABLE) ? (this.SIOCNT_UART_FIFO * 8) : 8) - 1, 0) * this.SIOShiftClockDivider) + (this.SIOShiftClockDivider - this.shiftClocks);
				}
				else {
					return 0x7FFFFFFF;
				}
		}
	}
	else {
		return 0x7FFFFFFF;
	}
}*/





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceSound(IOCore) {
	//Build references:
	this.IOCore = IOCore;
}
GameBoyAdvanceSound.prototype.initialize = function () {
	this.coreExposed = this.IOCore.coreExposed;
	this.dmaChannel1 = this.IOCore.dmaChannel1;
	this.dmaChannel2 = this.IOCore.dmaChannel2;
	//Did the emulator core initialize us for output yet?
	this.preprocessInitialization(false);
	//Initialize start:
	this.audioTicks = 0;
	this.initializeAudioStartState();
}
GameBoyAdvanceSound.prototype.initializeOutput = function (enabled, audioResamplerFirstPassFactor) {
	this.preprocessInitialization(enabled);
	this.audioIndex = 0;
	this.downsampleInputLeft = 0;
	this.downsampleInputRight = 0;
	this.audioResamplerFirstPassFactor = audioResamplerFirstPassFactor | 0;
}
GameBoyAdvanceSound.prototype.initializeAudioStartState = function () {
	//NOTE: NR 60-63 never get reset in audio halting:
	this.nr60 = 0;
	this.nr61 = 0;
	this.nr62 = (this.IOCore.BIOSFound && !this.IOCore.settings.SKIPBoot) ? 0 : 0xFF;
	this.nr63 = (this.IOCore.BIOSFound && !this.IOCore.settings.SKIPBoot) ? 0 : 0x2;
	this.soundMasterEnabled = (!this.IOCore.BIOSFound || this.IOCore.settings.SKIPBoot);
	this.mixerSoundBIAS = (this.IOCore.BIOSFound && !this.IOCore.settings.SKIPBoot) ? 0 : 0x200;
	this.channel1 = new GameBoyAdvanceChannel1Synth(this);
	this.channel2 = new GameBoyAdvanceChannel2Synth(this);
	this.channel3 = new GameBoyAdvanceChannel3Synth(this);
	this.channel4 = new GameBoyAdvanceChannel4Synth(this);
	this.CGBMixerOutputCacheLeft = 0;
	this.CGBMixerOutputCacheLeftFolded = 0;
	this.CGBMixerOutputCacheRight = 0;
	this.CGBMixerOutputCacheRightFolded = 0;
	this.AGBDirectSoundATimer = 0;
	this.AGBDirectSoundBTimer = 0;
	this.AGBDirectSoundA = 0;
	this.AGBDirectSoundAFolded = 0;
	this.AGBDirectSoundB = 0;
	this.AGBDirectSoundBFolded = 0;
	this.AGBDirectSoundAShifter = 0;
	this.AGBDirectSoundBShifter = 0;
	this.AGBDirectSoundALeftCanPlay = false;
	this.AGBDirectSoundBLeftCanPlay = false;
	this.AGBDirectSoundARightCanPlay = false;
	this.AGBDirectSoundBRightCanPlay = false;
	this.CGBOutputRatio = 2;
	this.FIFOABuffer = new GameBoyAdvanceFIFO();
	this.FIFOBBuffer = new GameBoyAdvanceFIFO();
	this.audioDisabled(); //Clear legacy PAPU registers:
}
GameBoyAdvanceSound.prototype.audioDisabled = function () {
	this.channel1.disabled();
	this.channel2.disabled();
	this.channel3.disabled();
	this.channel4.disabled();
	//Clear FIFO:
	this.AGBDirectSoundAFIFOClear();
	this.AGBDirectSoundBFIFOClear();
	//Clear NR50:
	this.nr50 = 0;
	this.VinLeftChannelMasterVolume = 1;
	this.VinRightChannelMasterVolume = 1;
	//Clear NR51:
	this.nr51 = 0;
	this.rightChannel1 = false;
	this.rightChannel2 = false;
	this.rightChannel3 = false;
	this.rightChannel4 = false;
	this.leftChannel1 = false;
	this.leftChannel2 = false;
	this.leftChannel3 = false;
	this.leftChannel4 = false;
	//Clear NR52:
	this.nr52 = 0;
	this.soundMasterEnabled = false;
	this.mixerOutputCacheLeft = this.mixerSoundBIAS | 0;
	this.mixerOutputCacheRight = this.mixerSoundBIAS | 0;
	this.audioClocksUntilNextEventCounter = 0;
	this.audioClocksUntilNextEvent = 0;
	this.sequencePosition = 0;
	this.sequencerClocks = 0x8000;
	this.PWMWidth = 0x200;
	this.PWMWidthOld = 0x200;
	this.PWMWidthShadow = 0x200;
	this.PWMBitDepthMask = 0x3FE;
	this.PWMBitDepthMaskShadow = 0x3FE;
	this.channel1.outputLevelCache();
	this.channel2.outputLevelCache();
	this.channel3.updateCache();
	this.channel4.updateCache();
}
GameBoyAdvanceSound.prototype.audioEnabled = function () {
	//Set NR52:
	this.nr52 = 0x80;
	this.soundMasterEnabled = true;
}
GameBoyAdvanceSound.prototype.addClocks = function (clocks) {
	clocks = clocks | 0;
	this.audioTicks = ((this.audioTicks | 0) + (clocks | 0)) | 0;
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceSound.prototype.generateAudioReal = function (numSamples) {
		numSamples = numSamples | 0;
		var multiplier = 0;
		if (this.soundMasterEnabled && !this.IOCore.isStopped()) {
			for (var clockUpTo = 0;
				(numSamples | 0) > 0;) {
				clockUpTo = Math.min(this.PWMWidth | 0, numSamples | 0) | 0;
				this.PWMWidth = ((this.PWMWidth | 0) - (clockUpTo | 0)) | 0;
				numSamples = ((numSamples | 0) - (clockUpTo | 0)) | 0;
				while ((clockUpTo | 0) > 0) {
					multiplier = Math.min(clockUpTo | 0, ((this.audioResamplerFirstPassFactor | 0) - (this.audioIndex | 0)) | 0) | 0;
					clockUpTo = ((clockUpTo | 0) - (multiplier | 0)) | 0;
					this.audioIndex = ((this.audioIndex | 0) + (multiplier | 0)) | 0;
					this.downsampleInputLeft = ((this.downsampleInputLeft | 0) + Math.imul(this.mixerOutputCacheLeft | 0, multiplier | 0)) | 0;
					this.downsampleInputRight = ((this.downsampleInputRight | 0) + Math.imul(this.mixerOutputCacheRight | 0, multiplier | 0)) | 0;
					if ((this.audioIndex | 0) == (this.audioResamplerFirstPassFactor | 0)) {
						this.audioIndex = 0;
						this.coreExposed.outputAudio(this.downsampleInputLeft | 0, this.downsampleInputRight | 0);
						this.downsampleInputLeft = 0;
						this.downsampleInputRight = 0;
					}
				}
				if ((this.PWMWidth | 0) == 0) {
					this.computeNextPWMInterval();
					this.PWMWidthOld = this.PWMWidthShadow | 0;
					this.PWMWidth = this.PWMWidthShadow | 0;
				}
			}
		} else {
			//SILENT OUTPUT:
			while ((numSamples | 0) > 0) {
				multiplier = Math.min(numSamples | 0, ((this.audioResamplerFirstPassFactor | 0) - (this.audioIndex | 0)) | 0) | 0;
				numSamples = ((numSamples | 0) - (multiplier | 0)) | 0;
				this.audioIndex = ((this.audioIndex | 0) + (multiplier | 0)) | 0;
				if ((this.audioIndex | 0) == (this.audioResamplerFirstPassFactor | 0)) {
					this.audioIndex = 0;
					this.coreExposed.outputAudio(this.downsampleInputLeft | 0, this.downsampleInputRight | 0);
					this.downsampleInputLeft = 0;
					this.downsampleInputRight = 0;
				}
			}
		}
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceSound.prototype.generateAudioReal = function (numSamples) {
		var multiplier = 0;
		if (this.soundMasterEnabled && !this.IOCore.isStopped()) {
			for (var clockUpTo = 0; numSamples > 0;) {
				clockUpTo = Math.min(this.PWMWidth, numSamples);
				this.PWMWidth = this.PWMWidth - clockUpTo;
				numSamples -= clockUpTo;
				while (clockUpTo > 0) {
					multiplier = Math.min(clockUpTo, this.audioResamplerFirstPassFactor - this.audioIndex);
					clockUpTo -= multiplier;
					this.audioIndex += multiplier;
					this.downsampleInputLeft += this.mixerOutputCacheLeft * multiplier;
					this.downsampleInputRight += this.mixerOutputCacheRight * multiplier;
					if (this.audioIndex == this.audioResamplerFirstPassFactor) {
						this.audioIndex = 0;
						this.coreExposed.outputAudio(this.downsampleInputLeft, this.downsampleInputRight);
						this.downsampleInputLeft = 0;
						this.downsampleInputRight = 0;
					}
				}
				if (this.PWMWidth == 0) {
					this.computeNextPWMInterval();
					this.PWMWidthOld = this.PWMWidthShadow;
					this.PWMWidth = this.PWMWidthShadow;
				}
			}
		} else {
			//SILENT OUTPUT:
			while (numSamples > 0) {
				multiplier = Math.min(numSamples, this.audioResamplerFirstPassFactor - this.audioIndex);
				numSamples -= multiplier;
				this.audioIndex += multiplier;
				if (this.audioIndex == this.audioResamplerFirstPassFactor) {
					this.audioIndex = 0;
					this.coreExposed.outputAudio(this.downsampleInputLeft, this.downsampleInputRight);
					this.downsampleInputLeft = 0;
					this.downsampleInputRight = 0;
				}
			}
		}
	}
}
//Generate audio, but don't actually output it (Used for when sound is disabled by user/browser):
GameBoyAdvanceSound.prototype.generateAudioFake = function (numSamples) {
	numSamples = numSamples | 0;
	if (this.soundMasterEnabled && !this.IOCore.isStopped()) {
		for (var clockUpTo = 0;
			(numSamples | 0) > 0;) {
			clockUpTo = Math.min(this.PWMWidth | 0, numSamples | 0) | 0;
			this.PWMWidth = ((this.PWMWidth | 0) - (clockUpTo | 0)) | 0;
			numSamples = ((numSamples | 0) - (clockUpTo | 0)) | 0;
			if ((this.PWMWidth | 0) == 0) {
				this.computeNextPWMInterval();
				this.PWMWidthOld = this.PWMWidthShadow | 0;
				this.PWMWidth = this.PWMWidthShadow | 0;
			}
		}
	}
}
GameBoyAdvanceSound.prototype.preprocessInitialization = function (audioInitialized) {
	if (audioInitialized) {
		this.generateAudio = this.generateAudioReal;
		this.audioInitialized = true;
	} else {
		this.generateAudio = this.generateAudioFake;
		this.audioInitialized = false;
	}
}
GameBoyAdvanceSound.prototype.audioJIT = function () {
	//Audio Sample Generation Timing:
	this.generateAudio(this.audioTicks | 0);
	this.audioTicks = 0;
}
GameBoyAdvanceSound.prototype.computeNextPWMInterval = function () {
	//Clock down the PSG system:
	for (var numSamples = this.PWMWidthOld | 0, clockUpTo = 0;
		(numSamples | 0) > 0; numSamples = ((numSamples | 0) - 1) | 0) {
		clockUpTo = Math.min(this.audioClocksUntilNextEventCounter | 0, this.sequencerClocks | 0, numSamples | 0) | 0;
		this.audioClocksUntilNextEventCounter = ((this.audioClocksUntilNextEventCounter | 0) - (clockUpTo | 0)) | 0;
		this.sequencerClocks = ((this.sequencerClocks | 0) - (clockUpTo | 0)) | 0;
		numSamples = ((numSamples | 0) - (clockUpTo | 0)) | 0;
		if ((this.sequencerClocks | 0) == 0) {
			this.audioComputeSequencer();
			this.sequencerClocks = 0x8000;
		}
		if ((this.audioClocksUntilNextEventCounter | 0) == 0) {
			this.computeAudioChannels();
		}
	}
	//Copy the new bit-depth mask for the next counter interval:
	this.PWMBitDepthMask = this.PWMBitDepthMaskShadow | 0;
	//Compute next sample for the PWM output:
	this.channel1.outputLevelCache();
	this.channel2.outputLevelCache();
	this.channel3.updateCache();
	this.channel4.updateCache();
	this.CGBMixerOutputLevelCache();
	this.mixerOutputLevelCache();
}
GameBoyAdvanceSound.prototype.audioComputeSequencer = function () {
	switch (this.sequencePosition++) {
		case 0:
			this.clockAudioLength();
			break;
		case 2:
			this.clockAudioLength();
			this.channel1.clockAudioSweep();
			break;
		case 4:
			this.clockAudioLength();
			break;
		case 6:
			this.clockAudioLength();
			this.channel1.clockAudioSweep();
			break;
		case 7:
			this.clockAudioEnvelope();
			this.sequencePosition = 0;
	}
}
GameBoyAdvanceSound.prototype.clockAudioLength = function () {
	//Channel 1:
	this.channel1.clockAudioLength();
	//Channel 2:
	this.channel2.clockAudioLength();
	//Channel 3:
	this.channel3.clockAudioLength();
	//Channel 4:
	this.channel4.clockAudioLength();
}
GameBoyAdvanceSound.prototype.clockAudioEnvelope = function () {
	//Channel 1:
	this.channel1.clockAudioEnvelope();
	//Channel 2:
	this.channel2.clockAudioEnvelope();
	//Channel 4:
	this.channel4.clockAudioEnvelope();
}
GameBoyAdvanceSound.prototype.computeAudioChannels = function () {
	//Clock down the four audio channels to the next closest audio event:
	this.channel1.FrequencyCounter = ((this.channel1.FrequencyCounter | 0) - (this.audioClocksUntilNextEvent | 0)) | 0;
	this.channel2.FrequencyCounter = ((this.channel2.FrequencyCounter | 0) - (this.audioClocksUntilNextEvent | 0)) | 0;
	this.channel3.counter = ((this.channel3.counter | 0) - (this.audioClocksUntilNextEvent | 0)) | 0;
	this.channel4.counter = ((this.channel4.counter | 0) - (this.audioClocksUntilNextEvent | 0)) | 0;
	//Channel 1 counter:
	this.channel1.computeAudioChannel();
	//Channel 2 counter:
	this.channel2.computeAudioChannel();
	//Channel 3 counter:
	this.channel3.computeAudioChannel();
	//Channel 4 counter:
	this.channel4.computeAudioChannel();
	//Find the number of clocks to next closest counter event:
	this.audioClocksUntilNextEventCounter = this.audioClocksUntilNextEvent = Math.min(this.channel1.FrequencyCounter | 0, this.channel2.FrequencyCounter | 0, this.channel3.counter | 0, this.channel4.counter | 0) | 0;
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceSound.prototype.CGBMixerOutputLevelCache = function () {
		this.CGBMixerOutputCacheLeft = Math.imul(((this.channel1.currentSampleLeftTrimary | 0) + (this.channel2.currentSampleLeftTrimary | 0) + (this.channel3.currentSampleLeftSecondary | 0) + (this.channel4.currentSampleLeftSecondary | 0)) | 0, this.VinLeftChannelMasterVolume | 0) | 0;
		this.CGBMixerOutputCacheRight = Math.imul(((this.channel1.currentSampleRightTrimary | 0) + (this.channel2.currentSampleRightTrimary | 0) + (this.channel3.currentSampleRightSecondary | 0) + (this.channel4.currentSampleRightSecondary | 0)) | 0, this.VinRightChannelMasterVolume | 0) | 0;
		this.CGBFolder();
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceSound.prototype.CGBMixerOutputLevelCache = function () {
		this.CGBMixerOutputCacheLeft = (this.channel1.currentSampleLeftTrimary + this.channel2.currentSampleLeftTrimary + this.channel3.currentSampleLeftSecondary + this.channel4.currentSampleLeftSecondary) * this.VinLeftChannelMasterVolume;
		this.CGBMixerOutputCacheRight = (this.channel1.currentSampleRightTrimary + this.channel2.currentSampleRightTrimary + this.channel3.currentSampleRightSecondary + this.channel4.currentSampleRightSecondary) * this.VinRightChannelMasterVolume;
		this.CGBFolder();
	}
}
GameBoyAdvanceSound.prototype.writeWAVE8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.channel3.writeWAVE8(address | 0, data | 0);
}
GameBoyAdvanceSound.prototype.readWAVE8 = function (address) {
	address = address | 0;
	this.IOCore.updateTimerClocking();
	return this.channel3.readWAVE8(address | 0) | 0;
}
GameBoyAdvanceSound.prototype.writeWAVE16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.channel3.writeWAVE16(address >> 1, data | 0);
}
GameBoyAdvanceSound.prototype.readWAVE16 = function (address) {
	address = address | 0;
	this.IOCore.updateTimerClocking();
	return this.channel3.readWAVE16(address >> 1) | 0;
}
GameBoyAdvanceSound.prototype.writeWAVE32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.channel3.writeWAVE32(address >> 2, data | 0);
}
GameBoyAdvanceSound.prototype.readWAVE32 = function (address) {
	address = address | 0;
	this.IOCore.updateTimerClocking();
	return this.channel3.readWAVE32(address >> 2) | 0;
}
GameBoyAdvanceSound.prototype.writeFIFOA8 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.FIFOABuffer.push8(data | 0);
	this.checkFIFOAPendingSignal();
}
GameBoyAdvanceSound.prototype.writeFIFOB8 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.FIFOBBuffer.push8(data | 0);
	this.checkFIFOBPendingSignal();
}
GameBoyAdvanceSound.prototype.writeFIFOA16 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.FIFOABuffer.push16(data | 0);
	this.checkFIFOAPendingSignal();
}
GameBoyAdvanceSound.prototype.writeFIFOB16 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.FIFOBBuffer.push16(data | 0);
	this.checkFIFOBPendingSignal();
}
GameBoyAdvanceSound.prototype.writeFIFOA32 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.FIFOABuffer.push32(data | 0);
	this.checkFIFOAPendingSignal();
}
GameBoyAdvanceSound.prototype.writeFIFOB32 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.FIFOBBuffer.push32(data | 0);
	this.checkFIFOBPendingSignal();
}
GameBoyAdvanceSound.prototype.checkFIFOAPendingSignal = function () {
	if (this.FIFOABuffer.requestingDMA()) {
		this.dmaChannel1.soundFIFOARequest();
	}
}
GameBoyAdvanceSound.prototype.checkFIFOBPendingSignal = function () {
	if (this.FIFOBBuffer.requestingDMA()) {
		this.dmaChannel2.soundFIFOBRequest();
	}
}
GameBoyAdvanceSound.prototype.AGBDirectSoundAFIFOClear = function () {
	this.FIFOABuffer.clear();
	this.AGBDirectSoundATimerIncrement();
}
GameBoyAdvanceSound.prototype.AGBDirectSoundBFIFOClear = function () {
	this.FIFOBBuffer.clear();
	this.AGBDirectSoundBTimerIncrement();
}
GameBoyAdvanceSound.prototype.AGBDirectSoundTimer0ClockTick = function () {
	this.audioJIT();
	if (this.soundMasterEnabled) {
		if ((this.AGBDirectSoundATimer | 0) == 0) {
			this.AGBDirectSoundATimerIncrement();
		}
		if ((this.AGBDirectSoundBTimer | 0) == 0) {
			this.AGBDirectSoundBTimerIncrement();
		}
	}
}
GameBoyAdvanceSound.prototype.AGBDirectSoundTimer1ClockTick = function () {
	this.audioJIT();
	if (this.soundMasterEnabled) {
		if ((this.AGBDirectSoundATimer | 0) == 1) {
			this.AGBDirectSoundATimerIncrement();
		}
		if ((this.AGBDirectSoundBTimer | 0) == 1) {
			this.AGBDirectSoundBTimerIncrement();
		}
	}
}
GameBoyAdvanceSound.prototype.nextFIFOAEventTime = function () {
	var nextEventTime = 0x7FFFFFFF;
	if (this.soundMasterEnabled) {
		if (!this.FIFOABuffer.requestingDMA()) {
			var samplesUntilDMA = this.FIFOABuffer.samplesUntilDMATrigger() | 0;
			if ((this.AGBDirectSoundATimer | 0) == 0) {
				nextEventTime = this.IOCore.timer.nextTimer0Overflow(samplesUntilDMA | 0) | 0;
			} else {
				nextEventTime = this.IOCore.timer.nextTimer1Overflow(samplesUntilDMA | 0) | 0;
			}
		} else {
			nextEventTime = 0;
		}
	}
	return nextEventTime | 0;
}
GameBoyAdvanceSound.prototype.nextFIFOBEventTime = function () {
	var nextEventTime = 0x7FFFFFFF;
	if (this.soundMasterEnabled) {
		if (!this.FIFOBBuffer.requestingDMA()) {
			var samplesUntilDMA = this.FIFOBBuffer.samplesUntilDMATrigger() | 0;
			if ((this.AGBDirectSoundBTimer | 0) == 0) {
				nextEventTime = this.IOCore.timer.nextTimer0Overflow(samplesUntilDMA | 0) | 0;
			} else {
				nextEventTime = this.IOCore.timer.nextTimer1Overflow(samplesUntilDMA | 0) | 0;
			}
		} else {
			nextEventTime = 0;
		}
	}
	return nextEventTime | 0;
}
GameBoyAdvanceSound.prototype.AGBDirectSoundATimerIncrement = function () {
	this.AGBDirectSoundA = this.FIFOABuffer.shift() | 0;
	this.checkFIFOAPendingSignal();
	this.AGBFIFOAFolder();
}
GameBoyAdvanceSound.prototype.AGBDirectSoundBTimerIncrement = function () {
	this.AGBDirectSoundB = this.FIFOBBuffer.shift() | 0;
	this.checkFIFOBPendingSignal();
	this.AGBFIFOBFolder();
}
GameBoyAdvanceSound.prototype.AGBFIFOAFolder = function () {
	this.AGBDirectSoundAFolded = this.AGBDirectSoundA >> (this.AGBDirectSoundAShifter | 0);
}
GameBoyAdvanceSound.prototype.AGBFIFOBFolder = function () {
	this.AGBDirectSoundBFolded = this.AGBDirectSoundB >> (this.AGBDirectSoundBShifter | 0);
}
GameBoyAdvanceSound.prototype.CGBFolder = function () {
	this.CGBMixerOutputCacheLeftFolded = (this.CGBMixerOutputCacheLeft << (this.CGBOutputRatio | 0)) >> 1;
	this.CGBMixerOutputCacheRightFolded = (this.CGBMixerOutputCacheRight << (this.CGBOutputRatio | 0)) >> 1;
}
GameBoyAdvanceSound.prototype.mixerOutputLevelCache = function () {
	this.mixerOutputCacheLeft = Math.min(Math.max((((this.AGBDirectSoundALeftCanPlay) ? (this.AGBDirectSoundAFolded | 0) : 0) +
		((this.AGBDirectSoundBLeftCanPlay) ? (this.AGBDirectSoundBFolded | 0) : 0) +
		(this.CGBMixerOutputCacheLeftFolded | 0) + (this.mixerSoundBIAS | 0)) | 0, 0) | 0, 0x3FF) & this.PWMBitDepthMask;
	this.mixerOutputCacheRight = Math.min(Math.max((((this.AGBDirectSoundARightCanPlay) ? (this.AGBDirectSoundAFolded | 0) : 0) +
		((this.AGBDirectSoundBRightCanPlay) ? (this.AGBDirectSoundBFolded | 0) : 0) +
		(this.CGBMixerOutputCacheRightFolded | 0) + (this.mixerSoundBIAS | 0)) | 0, 0) | 0, 0x3FF) & this.PWMBitDepthMask;
}
GameBoyAdvanceSound.prototype.setNR52 = function (data) {
	data = data | 0;
	this.nr52 = data | this.nr52;
}
GameBoyAdvanceSound.prototype.unsetNR52 = function (data) {
	data = data | 0;
	this.nr52 = data & this.nr52;
}
GameBoyAdvanceSound.prototype.readSOUND1CNT8_0 = function () {
	//NR10:
	return this.channel1.readSOUND1CNT8_0() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT8_0 = function (data) {
	//NR10:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.IOCore.updateTimerClocking();
		this.audioJIT();
		this.channel1.writeSOUND1CNT8_0(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND1CNT8_2 = function () {
	//NR11:
	return this.channel1.readSOUND1CNT8_2() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT8_2 = function (data) {
	//NR11:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.IOCore.updateTimerClocking();
		this.audioJIT();
		this.channel1.writeSOUND1CNT8_2(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND1CNT8_3 = function () {
	//NR12:
	return this.channel1.readSOUND1CNT8_3() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT8_3 = function (data) {
	//NR12:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.IOCore.updateTimerClocking();
		this.audioJIT();
		this.channel1.writeSOUND1CNT8_3(data | 0);
	}
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT16 = function (data) {
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.IOCore.updateTimerClocking();
		this.audioJIT();
		//NR11:
		this.channel1.writeSOUND1CNT8_2(data | 0);
		//NR12:
		this.channel1.writeSOUND1CNT8_3(data >> 8);
	}
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT32 = function (data) {
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.IOCore.updateTimerClocking();
		this.audioJIT();
		//NR10:
		this.channel1.writeSOUND1CNT8_0(data | 0);
		//NR11:
		this.channel1.writeSOUND1CNT8_2(data >> 16);
		//NR12:
		this.channel1.writeSOUND1CNT8_3(data >> 24);
	}
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT_X0 = function (data) {
	//NR13:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel1.writeSOUND1CNT_X0(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND1CNT_X = function () {
	//NR14:
	return this.channel1.readSOUND1CNT_X() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND1CNT_X1 = function (data) {
	//NR14:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel1.writeSOUND1CNT_X1(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND2CNT_L0 = function () {
	//NR21:
	return this.channel2.readSOUND2CNT_L0() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND2CNT_L0 = function (data) {
	data = data | 0;
	//NR21:
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel2.writeSOUND2CNT_L0(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND2CNT_L1 = function () {
	//NR22:
	return this.channel2.readSOUND2CNT_L1() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND2CNT_L1 = function (data) {
	data = data | 0;
	//NR22:
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel2.writeSOUND2CNT_L1(data | 0);
	}
}
GameBoyAdvanceSound.prototype.writeSOUND2CNT_H0 = function (data) {
	data = data | 0;
	//NR23:
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel2.writeSOUND2CNT_H0(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND2CNT_H = function () {
	//NR24:
	return this.channel2.readSOUND2CNT_H() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND2CNT_H1 = function (data) {
	data = data | 0;
	//NR24:
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel2.writeSOUND2CNT_H1(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND3CNT_L = function () {
	//NR30:
	return this.channel3.readSOUND3CNT_L() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_L = function (data) {
	//NR30:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel3.writeSOUND3CNT_L(data | 0);
	}
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_H0 = function (data) {
	//NR31:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel3.writeSOUND3CNT_H0(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND3CNT_H = function () {
	//NR32:
	return this.channel3.readSOUND3CNT_H() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_H1 = function (data) {
	//NR32:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel3.writeSOUND3CNT_H1(data | 0);
	}
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_X0 = function (data) {
	//NR33:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel3.writeSOUND3CNT_X0(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND3CNT_X = function () {
	//NR34:
	return this.channel3.readSOUND3CNT_X() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND3CNT_X1 = function (data) {
	//NR34:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel3.writeSOUND3CNT_X1(data | 0);
	}
}
GameBoyAdvanceSound.prototype.writeSOUND4CNT_L0 = function (data) {
	//NR41:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel4.writeSOUND4CNT_L0(data | 0);
	}
}
GameBoyAdvanceSound.prototype.writeSOUND4CNT_L1 = function (data) {
	//NR42:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel4.writeSOUND4CNT_L1(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND4CNT_L = function () {
	//NR42:
	return this.channel4.readSOUND4CNT_L() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND4CNT_H0 = function (data) {
	//NR43:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel4.writeSOUND4CNT_H0(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND4CNT_H0 = function () {
	//NR43:
	return this.channel4.readSOUND4CNT_H0() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUND4CNT_H1 = function (data) {
	//NR44:
	data = data | 0;
	if (this.soundMasterEnabled) {
		this.audioJIT();
		this.channel4.writeSOUND4CNT_H1(data | 0);
	}
}
GameBoyAdvanceSound.prototype.readSOUND4CNT_H1 = function () {
	//NR44:
	return this.channel4.readSOUND4CNT_H1() | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_L0 = function (data) {
	//NR50:
	data = data | 0;
	if (this.soundMasterEnabled && (this.nr50 | 0) != (data | 0)) {
		this.audioJIT();
		this.nr50 = data | 0;
		this.VinLeftChannelMasterVolume = (((data >> 4) & 0x07) + 1) | 0;
		this.VinRightChannelMasterVolume = ((data & 0x07) + 1) | 0;
	}
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_L0 = function () {
	//NR50:
	return 0x88 | this.nr50;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_L1 = function (data) {
	//NR51:
	data = data | 0;
	if (this.soundMasterEnabled && (this.nr51 | 0) != (data | 0)) {
		this.audioJIT();
		this.nr51 = data | 0;
		this.rightChannel1 = ((data & 0x01) == 0x01);
		this.rightChannel2 = ((data & 0x02) == 0x02);
		this.rightChannel3 = ((data & 0x04) == 0x04);
		this.rightChannel4 = ((data & 0x08) == 0x08);
		this.leftChannel1 = ((data & 0x10) == 0x10);
		this.leftChannel2 = ((data & 0x20) == 0x20);
		this.leftChannel3 = ((data & 0x40) == 0x40);
		this.leftChannel4 = (data > 0x7F);
	}
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_L1 = function () {
	//NR51:
	return this.nr51 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_H0 = function (data) {
	//NR60:
	data = data | 0;
	this.audioJIT();
	this.CGBOutputRatio = data & 0x3;
	this.AGBDirectSoundAShifter = (data & 0x04) >> 2;
	this.AGBDirectSoundBShifter = (data & 0x08) >> 3;
	this.nr60 = data | 0;
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_H0 = function () {
	//NR60:
	return this.nr60 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_H1 = function (data) {
	//NR61:
	data = data | 0;
	this.audioJIT();
	this.AGBDirectSoundARightCanPlay = ((data & 0x1) != 0);
	this.AGBDirectSoundALeftCanPlay = ((data & 0x2) != 0);
	this.AGBDirectSoundATimer = (data & 0x4) >> 2;
	if ((data & 0x08) != 0) {
		this.AGBDirectSoundAFIFOClear();
	}
	this.AGBDirectSoundBRightCanPlay = ((data & 0x10) != 0);
	this.AGBDirectSoundBLeftCanPlay = ((data & 0x20) != 0);
	this.AGBDirectSoundBTimer = (data & 0x40) >> 6;
	if ((data & 0x80) != 0) {
		this.AGBDirectSoundBFIFOClear();
	}
	this.nr61 = data | 0;
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_H1 = function () {
	//NR61:
	return this.nr61 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDCNT_X = function (data) {
	//NR52:
	data = data | 0;
	if (!this.soundMasterEnabled && (data | 0) > 0x7F) {
		this.audioJIT();
		this.audioEnabled();
	} else if (this.soundMasterEnabled && (data | 0) < 0x80) {
		this.audioJIT();
		this.audioDisabled();
	}
}
GameBoyAdvanceSound.prototype.readSOUNDCNT_X = function () {
	//NR52:
	return this.nr52 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDBIAS0 = function (data) {
	//NR62:
	data = data | 0;
	this.audioJIT();
	this.mixerSoundBIAS = this.mixerSoundBIAS & 0x300;
	this.mixerSoundBIAS = this.mixerSoundBIAS | data;
	this.nr62 = data | 0;
}
GameBoyAdvanceSound.prototype.readSOUNDBIAS0 = function () {
	//NR62:
	return this.nr62 | 0;
}
GameBoyAdvanceSound.prototype.writeSOUNDBIAS1 = function (data) {
	//NR63:
	data = data | 0;
	this.audioJIT();
	this.mixerSoundBIAS = this.mixerSoundBIAS & 0xFF;
	this.mixerSoundBIAS = this.mixerSoundBIAS | ((data & 0x3) << 8);
	this.PWMWidthShadow = 0x200 >> ((data & 0xC0) >> 6);
	this.PWMBitDepthMaskShadow = ((this.PWMWidthShadow | 0) - 1) << (1 + ((data & 0xC0) >> 6));
	this.nr63 = data | 0;
}
GameBoyAdvanceSound.prototype.readSOUNDBIAS1 = function () {
	//NR63:
	return this.nr63 | 0;
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceTimer(IOCore) {
	//Build references:
	this.IOCore = IOCore;
}
GameBoyAdvanceTimer.prototype.prescalarLookup = [
	0,
	0x6,
	0x8,
	0xA
];
GameBoyAdvanceTimer.prototype.initialize = function () {
	this.timer0Counter = 0;
	this.timer0Reload = 0;
	this.timer0Control = 0;
	this.timer0Enabled = false;
	this.timer0IRQ = false;
	this.timer0Precounter = 0;
	this.timer0Prescalar = 1;
	this.timer0PrescalarShifted = 0;
	this.timer1Counter = 0;
	this.timer1Reload = 0;
	this.timer1Control = 0;
	this.timer1Enabled = false;
	this.timer1IRQ = false;
	this.timer1Precounter = 0;
	this.timer1Prescalar = 1;
	this.timer1PrescalarShifted = 0;
	this.timer1CountUp = false;
	this.timer2Counter = 0;
	this.timer2Reload = 0;
	this.timer2Control = 0;
	this.timer2Enabled = false;
	this.timer2IRQ = false;
	this.timer2Precounter = 0;
	this.timer2Prescalar = 1;
	this.timer2PrescalarShifted = 0;
	this.timer2CountUp = false;
	this.timer3Counter = 0;
	this.timer3Reload = 0;
	this.timer3Control = 0;
	this.timer3Enabled = false;
	this.timer3IRQ = false;
	this.timer3Precounter = 0;
	this.timer3Prescalar = 1;
	this.timer3PrescalarShifted = 0;
	this.timer3CountUp = false;
	this.timer1UseMainClocks = false;
	this.timer1UseChainedClocks = false;
	this.timer2UseMainClocks = false;
	this.timer2UseChainedClocks = false;
	this.timer3UseMainClocks = false;
	this.timer3UseChainedClocks = false;
}
GameBoyAdvanceTimer.prototype.addClocks = function (clocks) {
	clocks = clocks | 0;
	//See if timer channels 0 and 1 are enabled:
	this.clockSoundTimers(clocks | 0);
	//See if timer channel 2 is enabled:
	this.clockTimer2(clocks | 0);
	//See if timer channel 3 is enabled:
	this.clockTimer3(clocks | 0);
}
GameBoyAdvanceTimer.prototype.clockSoundTimers = function (audioClocks) {
	audioClocks = audioClocks | 0;
	for (var predictedClocks = 0, overflowClocks = 0;
		(audioClocks | 0) > 0; audioClocks = ((audioClocks | 0) - (predictedClocks | 0)) | 0) {
		overflowClocks = this.nextAudioTimerOverflow() | 0;
		predictedClocks = Math.min(audioClocks | 0, overflowClocks | 0) | 0;
		//See if timer channel 0 is enabled:
		this.clockTimer0(predictedClocks | 0);
		//See if timer channel 1 is enabled:
		this.clockTimer1(predictedClocks | 0);
		//Clock audio system up to latest timer:
		this.IOCore.sound.addClocks(predictedClocks | 0);
		//Only jit if overflow was seen:
		if ((overflowClocks | 0) == (predictedClocks | 0)) {
			this.IOCore.sound.audioJIT();
		}
	}
}
GameBoyAdvanceTimer.prototype.clockTimer0 = function (clocks) {
	clocks = clocks | 0;
	if (this.timer0Enabled) {
		this.timer0Precounter = ((this.timer0Precounter | 0) + (clocks | 0)) | 0;
		while ((this.timer0Precounter | 0) >= (this.timer0Prescalar | 0)) {
			var iterations = Math.min(this.timer0Precounter >> (this.timer0PrescalarShifted | 0), (0x10000 - (this.timer0Counter | 0)) | 0) | 0;
			this.timer0Precounter = ((this.timer0Precounter | 0) - ((iterations | 0) << (this.timer0PrescalarShifted | 0))) | 0;
			this.timer0Counter = ((this.timer0Counter | 0) + (iterations | 0)) | 0;
			if ((this.timer0Counter | 0) > 0xFFFF) {
				this.timer0Counter = this.timer0Reload | 0;
				this.timer0ExternalTriggerCheck();
				this.timer1ClockUpTickCheck();
			}
		}
	}
}
GameBoyAdvanceTimer.prototype.clockTimer1 = function (clocks) {
	clocks = clocks | 0;
	if (this.timer1UseMainClocks) {
		this.timer1Precounter = ((this.timer1Precounter | 0) + (clocks | 0)) | 0;
		while ((this.timer1Precounter | 0) >= (this.timer1Prescalar | 0)) {
			var iterations = Math.min(this.timer1Precounter >> (this.timer1PrescalarShifted | 0), (0x10000 - (this.timer1Counter | 0)) | 0) | 0;
			this.timer1Precounter = ((this.timer1Precounter | 0) - ((iterations | 0) << (this.timer1PrescalarShifted | 0))) | 0;
			this.timer1Counter = ((this.timer1Counter | 0) + (iterations | 0)) | 0;
			if ((this.timer1Counter | 0) > 0xFFFF) {
				this.timer1Counter = this.timer1Reload | 0;
				this.timer1ExternalTriggerCheck();
				this.timer2ClockUpTickCheck();
			}
		}
	}
}
GameBoyAdvanceTimer.prototype.clockTimer2 = function (clocks) {
	clocks = clocks | 0;
	if (this.timer2UseMainClocks) {
		this.timer2Precounter = ((this.timer2Precounter | 0) + (clocks | 0)) | 0;
		while ((this.timer2Precounter | 0) >= (this.timer2Prescalar | 0)) {
			var iterations = Math.min(this.timer2Precounter >> (this.timer2PrescalarShifted | 0), (0x10000 - (this.timer2Counter | 0)) | 0) | 0;
			this.timer2Precounter = ((this.timer2Precounter | 0) - ((iterations | 0) << (this.timer2PrescalarShifted | 0))) | 0;
			this.timer2Counter = ((this.timer2Counter | 0) + (iterations | 0)) | 0;
			if ((this.timer2Counter | 0) > 0xFFFF) {
				this.timer2Counter = this.timer2Reload | 0;
				this.timer2ExternalTriggerCheck();
				this.timer3ClockUpTickCheck();
			}
		}
	}
}
GameBoyAdvanceTimer.prototype.clockTimer3 = function (clocks) {
	clocks = clocks | 0;
	if (this.timer3UseMainClocks) {
		this.timer3Precounter = ((this.timer3Precounter | 0) + (clocks | 0)) | 0;
		while ((this.timer3Precounter | 0) >= (this.timer3Prescalar | 0)) {
			var iterations = Math.min(this.timer3Precounter >> (this.timer3PrescalarShifted | 0), (0x10000 - (this.timer3Counter | 0)) | 0) | 0;
			this.timer3Precounter = ((this.timer3Precounter | 0) - ((iterations | 0) << (this.timer3PrescalarShifted | 0))) | 0;
			this.timer3Counter = ((this.timer3Counter | 0) + (iterations | 0)) | 0;
			if ((this.timer3Counter | 0) > 0xFFFF) {
				this.timer3Counter = this.timer3Reload | 0;
				this.timer3ExternalTriggerCheck();
			}
		}
	}
}
GameBoyAdvanceTimer.prototype.timer1ClockUpTickCheck = function () {
	if (this.timer1UseChainedClocks) {
		this.timer1Counter = ((this.timer1Counter | 0) + 1) | 0;
		if ((this.timer1Counter | 0) > 0xFFFF) {
			this.timer1Counter = this.timer1Reload | 0;
			this.timer1ExternalTriggerCheck();
			this.timer2ClockUpTickCheck();
		}
	}
}
GameBoyAdvanceTimer.prototype.timer2ClockUpTickCheck = function () {
	if (this.timer2UseChainedClocks) {
		this.timer2Counter = ((this.timer2Counter | 0) + 1) | 0;
		if ((this.timer2Counter | 0) > 0xFFFF) {
			this.timer2Counter = this.timer2Reload | 0;
			this.timer2ExternalTriggerCheck();
			this.timer3ClockUpTickCheck();
		}
	}
}
GameBoyAdvanceTimer.prototype.timer3ClockUpTickCheck = function () {
	if (this.timer3UseChainedClocks) {
		this.timer3Counter = ((this.timer3Counter | 0) + 1) | 0;
		if ((this.timer3Counter | 0) > 0xFFFF) {
			this.timer3Counter = this.timer3Reload | 0;
			this.timer3ExternalTriggerCheck();
		}
	}
}
GameBoyAdvanceTimer.prototype.timer0ExternalTriggerCheck = function () {
	if (this.timer0IRQ) {
		this.IOCore.irq.requestIRQ(0x08);
	}
	this.IOCore.sound.AGBDirectSoundTimer0ClockTick();
}
GameBoyAdvanceTimer.prototype.timer1ExternalTriggerCheck = function () {
	if (this.timer1IRQ) {
		this.IOCore.irq.requestIRQ(0x10);
	}
	this.IOCore.sound.AGBDirectSoundTimer1ClockTick();
}
GameBoyAdvanceTimer.prototype.timer2ExternalTriggerCheck = function () {
	if (this.timer2IRQ) {
		this.IOCore.irq.requestIRQ(0x20);
	}
}
GameBoyAdvanceTimer.prototype.timer3ExternalTriggerCheck = function () {
	if (this.timer3IRQ) {
		this.IOCore.irq.requestIRQ(0x40);
	}
}
GameBoyAdvanceTimer.prototype.writeTM0CNT8_0 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer0Reload = this.timer0Reload & 0xFF00;
	data = data & 0xFF;
	this.timer0Reload = this.timer0Reload | data;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM0CNT8_1 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer0Reload = this.timer0Reload & 0xFF;
	data = data & 0xFF;
	this.timer0Reload = this.timer0Reload | (data << 8);
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM0CNT8_2 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer0Control = data & 0xFF;
	if ((data & 0x80) != 0) {
		if (!this.timer0Enabled) {
			this.timer0Counter = this.timer0Reload | 0;
			this.timer0Enabled = true;
			this.timer0Precounter = 0;
		}
	} else {
		this.timer0Enabled = false;
	}
	this.timer0IRQ = ((data & 0x40) != 0);
	this.timer0PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
	this.timer0Prescalar = 1 << (this.timer0PrescalarShifted | 0);
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM0CNT16 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer0Reload = data & 0xFFFF;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM0CNT32 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer0Reload = data & 0xFFFF;
	this.timer0Control = data >> 16;
	if ((data & 0x800000) != 0) {
		if (!this.timer0Enabled) {
			this.timer0Counter = this.timer0Reload | 0;
			this.timer0Enabled = true;
			this.timer0Precounter = 0;
		}
	} else {
		this.timer0Enabled = false;
	}
	this.timer0IRQ = ((data & 0x400000) != 0);
	this.timer0PrescalarShifted = this.prescalarLookup[(data >> 16) & 0x03] | 0;
	this.timer0Prescalar = 1 << (this.timer0PrescalarShifted | 0);
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.readTM0CNT8_0 = function () {
	this.IOCore.updateTimerClocking();
	return this.timer0Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM0CNT8_1 = function () {
	this.IOCore.updateTimerClocking();
	return (this.timer0Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM0CNT8_2 = function () {
	return this.timer0Control & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM0CNT16 = function () {
	this.IOCore.updateTimerClocking();
	return this.timer0Counter | 0;
}
GameBoyAdvanceTimer.prototype.readTM0CNT32 = function () {
	this.IOCore.updateTimerClocking();
	var data = (this.timer0Control & 0xFF) << 16;
	data = data | this.timer0Counter;
	return data | 0;
}
GameBoyAdvanceTimer.prototype.writeTM1CNT8_0 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer1Reload = this.timer1Reload & 0xFF00;
	data = data & 0xFF;
	this.timer1Reload = this.timer1Reload | data;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM1CNT8_1 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer1Reload = this.timer1Reload & 0xFF;
	data = data & 0xFF;
	this.timer1Reload = this.timer1Reload | (data << 8);
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM1CNT8_2 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer1Control = data & 0xFF;
	if ((data & 0x80) != 0) {
		if (!this.timer1Enabled) {
			this.timer1Counter = this.timer1Reload | 0;
			this.timer1Enabled = true;
			this.timer1Precounter = 0;
		}
	} else {
		this.timer1Enabled = false;
	}
	this.timer1IRQ = ((data & 0x40) != 0);
	this.timer1CountUp = ((data & 0x4) != 0);
	this.timer1PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
	this.timer1Prescalar = 1 << (this.timer1PrescalarShifted | 0);
	this.preprocessTimer1();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM1CNT16 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer1Reload = data & 0xFFFF;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM1CNT32 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.IOCore.sound.audioJIT();
	this.timer1Reload = data & 0xFFFF;
	this.timer1Control = data >> 16;
	if ((data & 0x800000) != 0) {
		if (!this.timer1Enabled) {
			this.timer1Counter = this.timer1Reload | 0;
			this.timer1Enabled = true;
			this.timer1Precounter = 0;
		}
	} else {
		this.timer1Enabled = false;
	}
	this.timer1IRQ = ((data & 0x400000) != 0);
	this.timer1CountUp = ((data & 0x40000) != 0);
	this.timer1PrescalarShifted = this.prescalarLookup[(data >> 16) & 0x03] | 0;
	this.timer1Prescalar = 1 << (this.timer1PrescalarShifted | 0);
	this.preprocessTimer1();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.readTM1CNT8_0 = function () {
	this.IOCore.updateTimerClocking();
	return this.timer1Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM1CNT8_1 = function () {
	this.IOCore.updateTimerClocking();
	return (this.timer1Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM1CNT8_2 = function () {
	return this.timer1Control & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM1CNT16 = function () {
	this.IOCore.updateTimerClocking();
	return this.timer1Counter | 0;
}
GameBoyAdvanceTimer.prototype.readTM1CNT32 = function () {
	this.IOCore.updateTimerClocking();
	var data = (this.timer1Control & 0xFF) << 16;
	data = data | this.timer1Counter;
	return data | 0;
}
GameBoyAdvanceTimer.prototype.writeTM2CNT8_0 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer2Reload = this.timer2Reload & 0xFF00;
	data = data & 0xFF;
	this.timer2Reload = this.timer2Reload | data;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM2CNT8_1 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer2Reload = this.timer2Reload & 0xFF;
	data = data & 0xFF;
	this.timer2Reload = this.timer2Reload | (data << 8);
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM2CNT8_2 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer2Control = data & 0xFF;
	if ((data & 0x80) != 0) {
		if (!this.timer2Enabled) {
			this.timer2Counter = this.timer2Reload | 0;
			this.timer2Enabled = true;
			this.timer2Precounter = 0;
		}
	} else {
		this.timer2Enabled = false;
	}
	this.timer2IRQ = ((data & 0x40) != 0);
	this.timer2CountUp = ((data & 0x4) != 0);
	this.timer2PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
	this.timer2Prescalar = 1 << (this.timer2PrescalarShifted | 0);
	this.preprocessTimer2();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM2CNT16 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer2Reload = data & 0xFFFF;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM2CNT32 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer2Reload = data & 0xFFFF;
	this.timer2Control = data >> 16;
	if ((data & 0x800000) != 0) {
		if (!this.timer2Enabled) {
			this.timer2Counter = this.timer2Reload | 0;
			this.timer2Enabled = true;
			this.timer2Precounter = 0;
		}
	} else {
		this.timer2Enabled = false;
	}
	this.timer2IRQ = ((data & 0x400000) != 0);
	this.timer2CountUp = ((data & 0x40000) != 0);
	this.timer2PrescalarShifted = this.prescalarLookup[(data >> 16) & 0x03] | 0;
	this.timer2Prescalar = 1 << (this.timer2PrescalarShifted | 0);
	this.preprocessTimer2();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.readTM2CNT8_0 = function () {
	this.IOCore.updateTimerClocking();
	return this.timer2Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM2CNT8_1 = function () {
	this.IOCore.updateTimerClocking();
	return (this.timer2Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM2CNT8_2 = function () {
	return this.timer2Control & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM2CNT16 = function () {
	this.IOCore.updateTimerClocking();
	return this.timer2Counter | 0;
}
GameBoyAdvanceTimer.prototype.readTM2CNT32 = function () {
	this.IOCore.updateTimerClocking();
	var data = (this.timer2Control & 0xFF) << 16;
	data = data | this.timer2Counter;
	return data | 0;
}
GameBoyAdvanceTimer.prototype.writeTM3CNT8_0 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer3Reload = this.timer3Reload & 0xFF00;
	data = data & 0xFF;
	this.timer3Reload = this.timer3Reload | data;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM3CNT8_1 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer3Reload = this.timer3Reload & 0xFF;
	data = data & 0xFF;
	this.timer3Reload = this.timer3Reload | (data << 8);
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM3CNT8_2 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer3Control = data & 0xFF;
	if ((data & 0x80) != 0) {
		if (!this.timer3Enabled) {
			this.timer3Counter = this.timer3Reload | 0;
			this.timer3Enabled = true;
			this.timer3Precounter = 0;
		}
	} else {
		this.timer3Enabled = false;
	}
	this.timer3IRQ = ((data & 0x40) != 0);
	this.timer3CountUp = ((data & 0x4) != 0);
	this.timer3PrescalarShifted = this.prescalarLookup[data & 0x03] | 0;
	this.timer3Prescalar = 1 << (this.timer3PrescalarShifted | 0);
	this.preprocessTimer3();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM3CNT16 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer3Reload = data & 0xFFFF;
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.writeTM3CNT32 = function (data) {
	data = data | 0;
	this.IOCore.updateTimerClocking();
	this.timer3Reload = data & 0xFFFF;
	this.timer3Control = data >> 16;
	if ((data & 0x800000) != 0) {
		if (!this.timer3Enabled) {
			this.timer3Counter = this.timer3Reload | 0;
			this.timer3Enabled = true;
			this.timer3Precounter = 0;
		}
	} else {
		this.timer3Enabled = false;
	}
	this.timer3IRQ = ((data & 0x400000) != 0);
	this.timer3CountUp = ((data & 0x40000) != 0);
	this.timer3PrescalarShifted = this.prescalarLookup[(data >> 16) & 0x03] | 0;
	this.timer3Prescalar = 1 << (this.timer3PrescalarShifted | 0);
	this.preprocessTimer3();
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceTimer.prototype.readTM3CNT8_0 = function () {
	this.IOCore.updateTimerClocking();
	return this.timer3Counter & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM3CNT8_1 = function () {
	this.IOCore.updateTimerClocking();
	return (this.timer3Counter & 0xFF00) >> 8;
}
GameBoyAdvanceTimer.prototype.readTM3CNT8_2 = function () {
	return this.timer3Control & 0xFF;
}
GameBoyAdvanceTimer.prototype.readTM3CNT16 = function () {
	this.IOCore.updateTimerClocking();
	return this.timer3Counter | 0;
}
GameBoyAdvanceTimer.prototype.readTM3CNT32 = function () {
	this.IOCore.updateTimerClocking();
	var data = (this.timer3Control & 0xFF) << 16;
	data = data | this.timer3Counter;
	return data | 0;
}
GameBoyAdvanceTimer.prototype.preprocessTimer1 = function () {
	this.timer1UseMainClocks = (this.timer1Enabled && !this.timer1CountUp);
	this.timer1UseChainedClocks = (this.timer1Enabled && this.timer1CountUp);
}
GameBoyAdvanceTimer.prototype.preprocessTimer2 = function () {
	this.timer2UseMainClocks = (this.timer2Enabled && !this.timer2CountUp);
	this.timer2UseChainedClocks = (this.timer2Enabled && this.timer2CountUp);
}
GameBoyAdvanceTimer.prototype.preprocessTimer3 = function () {
	this.timer3UseMainClocks = (this.timer3Enabled && !this.timer3CountUp);
	this.timer3UseChainedClocks = (this.timer3Enabled && this.timer3CountUp);
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceTimer.prototype.nextTimer0OverflowBase = function () {
		var countUntilReload = (0x10000 - (this.timer0Counter | 0)) | 0;
		countUntilReload = Math.imul(countUntilReload | 0, this.timer0Prescalar | 0) | 0;
		countUntilReload = ((countUntilReload | 0) - (this.timer0Precounter | 0)) | 0;
		return countUntilReload | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer0OverflowSingle = function () {
		var eventTime = 0x7FFFFFFF;
		if (this.timer0Enabled) {
			eventTime = this.nextTimer0OverflowBase() | 0;
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer0Overflow = function (numOverflows) {
		numOverflows = numOverflows | 0;
		var eventTime = 0x7FFFFFFF;
		if (this.timer0Enabled) {
			numOverflows = ((numOverflows | 0) - 1) | 0;
			var countUntilReload = this.nextTimer0OverflowBase() | 0;
			var reloadClocks = (0x10000 - (this.timer0Reload | 0)) | 0;
			reloadClocks = Math.imul(reloadClocks | 0, this.timer0Prescalar | 0) | 0;
			reloadClocks = (reloadClocks | 0) * (numOverflows | 0);
			eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer1OverflowBase = function () {
		var countUntilReload = (0x10000 - (this.timer1Counter | 0)) | 0;
		countUntilReload = Math.imul(countUntilReload | 0, this.timer1Prescalar | 0) | 0;
		countUntilReload = ((countUntilReload | 0) - (this.timer1Precounter | 0)) | 0;
		return countUntilReload | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer1Overflow = function (numOverflows) {
		numOverflows = numOverflows | 0;
		var eventTime = 0x7FFFFFFF;
		if (this.timer1Enabled) {
			var reloadClocks = (0x10000 - (this.timer1Reload | 0)) | 0;
			if (this.timer1CountUp) {
				var countUntilReload = (0x10000 - (this.timer1Counter | 0)) | 0;
				reloadClocks = (reloadClocks | 0) * (numOverflows | 0);
				eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
				eventTime = this.nextTimer0Overflow(eventTime | 0) | 0;
			} else {
				numOverflows = ((numOverflows | 0) - 1) | 0;
				var countUntilReload = this.nextTimer1OverflowBase() | 0;
				reloadClocks = Math.imul(reloadClocks | 0, this.timer1Prescalar | 0) | 0;
				reloadClocks = reloadClocks * numOverflows;
				eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
			}
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer1OverflowSingle = function () {
		var eventTime = 0x7FFFFFFF;
		if (this.timer1Enabled) {
			if (this.timer1CountUp) {
				var countUntilReload = (0x10000 - (this.timer1Counter | 0)) | 0;
				eventTime = this.nextTimer0Overflow(countUntilReload | 0) | 0;
			} else {
				eventTime = this.nextTimer1OverflowBase() | 0;
			}
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer2OverflowBase = function () {
		var countUntilReload = (0x10000 - (this.timer2Counter | 0)) | 0;
		countUntilReload = Math.imul(countUntilReload | 0, this.timer2Prescalar | 0) | 0;
		countUntilReload = ((countUntilReload | 0) - (this.timer2Precounter | 0)) | 0;
		return countUntilReload | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer2Overflow = function (numOverflows) {
		numOverflows = numOverflows | 0;
		var eventTime = 0x7FFFFFFF;
		if (this.timer2Enabled) {
			var reloadClocks = (0x10000 - (this.timer2Reload | 0)) | 0;
			if (this.timer2CountUp) {
				var countUntilReload = (0x10000 - (this.timer2Counter | 0)) | 0;
				reloadClocks = (reloadClocks | 0) * (numOverflows | 0);
				eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
				eventTime = this.nextTimer1Overflow(eventTime | 0) | 0;
			} else {
				numOverflows = ((numOverflows | 0) - 1) | 0;
				var countUntilReload = this.nextTimer2OverflowBase() | 0;
				reloadClocks = Math.imul(reloadClocks | 0, this.timer2Prescalar | 0) | 0;
				reloadClocks = reloadClocks * numOverflows;
				eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
			}
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer2OverflowSingle = function () {
		var eventTime = 0x7FFFFFFF;
		if (this.timer2Enabled) {
			if (this.timer2CountUp) {
				var countUntilReload = (0x10000 - (this.timer2Counter | 0)) | 0;
				eventTime = this.nextTimer1Overflow(countUntilReload | 0) | 0;
			} else {
				eventTime = this.nextTimer2OverflowBase() | 0;
			}
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer3OverflowSingle = function () {
		var eventTime = 0x7FFFFFFF;
		if (this.timer3Enabled) {
			if (this.timer3CountUp) {
				var countUntilReload = (0x10000 - (this.timer3Counter | 0)) | 0;
				eventTime = this.nextTimer2Overflow(countUntilReload | 0) | 0;
			} else {
				eventTime = (0x10000 - (this.timer3Counter | 0)) | 0;
				eventTime = Math.imul(eventTime | 0, this.timer3Prescalar | 0) | 0;
				eventTime = ((eventTime | 0) - (this.timer3Precounter | 0)) | 0;
			}
		}
		return eventTime | 0;
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceTimer.prototype.nextTimer0OverflowBase = function () {
		var countUntilReload = (0x10000 - (this.timer0Counter | 0)) | 0;
		countUntilReload = ((countUntilReload | 0) * (this.timer0Prescalar | 0)) | 0;
		countUntilReload = ((countUntilReload | 0) - (this.timer0Precounter | 0)) | 0;
		return countUntilReload | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer0OverflowSingle = function () {
		var eventTime = 0x7FFFFFFF;
		if (this.timer0Enabled) {
			eventTime = this.nextTimer0OverflowBase() | 0;
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer0Overflow = function (numOverflows) {
		numOverflows = numOverflows | 0;
		var eventTime = 0x7FFFFFFF;
		if (this.timer0Enabled) {
			numOverflows = ((numOverflows | 0) - 1) | 0;
			var countUntilReload = this.nextTimer0OverflowBase() | 0;
			var reloadClocks = (0x10000 - (this.timer0Reload | 0)) | 0;
			reloadClocks = ((reloadClocks | 0) * (this.timer0Prescalar | 0)) | 0;
			reloadClocks = (reloadClocks | 0) * (numOverflows | 0);
			eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer1OverflowBase = function () {
		var countUntilReload = (0x10000 - (this.timer1Counter | 0)) | 0;
		countUntilReload = ((countUntilReload | 0) * (this.timer1Prescalar | 0)) | 0;
		countUntilReload = ((countUntilReload | 0) - (this.timer1Precounter | 0)) | 0;
		return countUntilReload | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer1Overflow = function (numOverflows) {
		numOverflows = numOverflows | 0;
		var eventTime = 0x7FFFFFFF;
		if (this.timer1Enabled) {
			var reloadClocks = (0x10000 - (this.timer1Reload | 0)) | 0;
			if (this.timer1CountUp) {
				var countUntilReload = (0x10000 - (this.timer1Counter | 0)) | 0;
				reloadClocks = (reloadClocks | 0) * (numOverflows | 0);
				eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
				eventTime = this.nextTimer0Overflow(eventTime | 0) | 0;
			} else {
				numOverflows = ((numOverflows | 0) - 1) | 0;
				var countUntilReload = this.nextTimer1OverflowBase() | 0;
				reloadClocks = ((reloadClocks | 0) * (this.timer1Prescalar | 0)) | 0;
				reloadClocks = reloadClocks * numOverflows;
				eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
			}
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer1OverflowSingle = function () {
		var eventTime = 0x7FFFFFFF;
		if (this.timer1Enabled) {
			if (this.timer1CountUp) {
				var countUntilReload = (0x10000 - (this.timer1Counter | 0)) | 0;
				eventTime = this.nextTimer0Overflow(countUntilReload | 0) | 0;
			} else {
				eventTime = this.nextTimer1OverflowBase() | 0;
			}
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer2OverflowBase = function () {
		var countUntilReload = (0x10000 - (this.timer2Counter | 0)) | 0;
		countUntilReload = ((countUntilReload | 0) * (this.timer2Prescalar | 0)) | 0;
		countUntilReload = ((countUntilReload | 0) - (this.timer2Precounter | 0)) | 0;
		return countUntilReload | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer2Overflow = function (numOverflows) {
		numOverflows = numOverflows | 0;
		var eventTime = 0x7FFFFFFF;
		if (this.timer2Enabled) {
			var reloadClocks = (0x10000 - (this.timer2Reload | 0)) | 0;
			if (this.timer2CountUp) {
				var countUntilReload = (0x10000 - (this.timer2Counter | 0)) | 0;
				reloadClocks = (reloadClocks | 0) * (numOverflows | 0);
				eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
				eventTime = this.nextTimer1Overflow(eventTime | 0) | 0;
			} else {
				numOverflows = ((numOverflows | 0) - 1) | 0;
				var countUntilReload = this.nextTimer2OverflowBase() | 0;
				reloadClocks = ((reloadClocks | 0) * (this.timer2Prescalar | 0)) | 0;
				reloadClocks = reloadClocks * numOverflows;
				eventTime = Math.min((countUntilReload | 0) + reloadClocks, 0x7FFFFFFF) | 0;
			}
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer2OverflowSingle = function () {
		var eventTime = 0x7FFFFFFF;
		if (this.timer2Enabled) {
			if (this.timer2CountUp) {
				var countUntilReload = (0x10000 - (this.timer2Counter | 0)) | 0;
				eventTime = this.nextTimer1Overflow(countUntilReload | 0) | 0;
			} else {
				eventTime = this.nextTimer2OverflowBase() | 0;
			}
		}
		return eventTime | 0;
	}
	GameBoyAdvanceTimer.prototype.nextTimer3OverflowSingle = function () {
		var eventTime = 0x7FFFFFFF;
		if (this.timer3Enabled) {
			if (this.timer3CountUp) {
				var countUntilReload = (0x10000 - (this.timer3Counter | 0)) | 0;
				eventTime = this.nextTimer2Overflow(countUntilReload | 0) | 0;
			} else {
				eventTime = (0x10000 - (this.timer3Counter | 0)) | 0;
				eventTime = ((eventTime | 0) * (this.timer3Prescalar | 0)) | 0;
				eventTime = ((eventTime | 0) - (this.timer3Precounter | 0)) | 0;
			}
		}
		return eventTime | 0;
	}
}
GameBoyAdvanceTimer.prototype.nextAudioTimerOverflow = function () {
	var timer0 = this.nextTimer0OverflowSingle() | 0;
	var timer1 = this.nextTimer1OverflowSingle() | 0;
	return Math.min(timer0 | 0, timer1 | 0) | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer0IRQEventTime = function () {
	var clocks = 0x7FFFFFFF;
	if (this.timer0Enabled && this.timer0IRQ) {
		clocks = this.nextTimer0OverflowSingle() | 0;
	}
	return clocks | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer1IRQEventTime = function () {
	var clocks = 0x7FFFFFFF;
	if (this.timer1Enabled && this.timer1IRQ) {
		clocks = this.nextTimer1OverflowSingle() | 0;
	}
	return clocks | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer2IRQEventTime = function () {
	var clocks = 0x7FFFFFFF;
	if (this.timer2Enabled && this.timer2IRQ) {
		clocks = this.nextTimer2OverflowSingle() | 0;
	}
	return clocks | 0;
}
GameBoyAdvanceTimer.prototype.nextTimer3IRQEventTime = function () {
	var clocks = 0x7FFFFFFF;
	if (this.timer3Enabled && this.timer3IRQ) {
		clocks = this.nextTimer3OverflowSingle() | 0;
	}
	return clocks | 0;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceWait(IOCore) {
	//Build references:
	this.IOCore = IOCore;
}
GameBoyAdvanceWait.prototype.initialize = function () {
	this.memory = this.IOCore.memory;
	this.cpu = this.IOCore.cpu;
	this.WRAMConfiguration = 0xD000020; //WRAM configuration control register current data.
	this.WRAMWaitState = 3; //External WRAM wait state.
	this.SRAMWaitState = 5; //SRAM wait state.
	this.WAITCNT0 = 0; //WAITCNT0 control register data.
	this.WAITCNT1 = 0; //WAITCNT1 control register data.
	this.POSTBOOT = 0; //POSTBOOT control register data.
	this.isRendering = 1; //Are we doing memory during screen draw?
	this.isOAMRendering = 1; //Are we doing memory during OAM draw?
	this.nonSequential = 0x10; //Non-sequential access bit-flag.
	this.buffer = 0; //Tracking of the size of the prebuffer cache.
	this.clocks = 0; //Tracking clocks for prebuffer cache.
	//Create the wait state address translation cache:
	this.waitStateClocks16 = getUint8Array(0x20);
	this.waitStateClocks32 = getUint8Array(0x20);
	//Wait State 0:
	this.setWaitState(0, 0);
	//Wait State 1:
	this.setWaitState(1, 0);
	//Wait State 2:
	this.setWaitState(2, 0);
	//Initialize out some dynamic references:
	this.getROMRead16 = this.getROMRead16NoPrefetch;
	this.getROMRead32 = this.getROMRead32NoPrefetch;
	this.CPUInternalCyclePrefetch = this.CPUInternalCycleNoPrefetch;
	this.CPUInternalSingleCyclePrefetch = this.CPUInternalSingleCycleNoPrefetch;
}
GameBoyAdvanceWait.prototype.getWaitStateFirstAccess = function (data) {
	//Get the first access timing:
	data = data | 0;
	data = data & 0x3;
	if ((data | 0) < 0x3) {
		data = (5 - (data | 0)) | 0;
	} else {
		data = 9;
	}
	return data | 0;
}
GameBoyAdvanceWait.prototype.getWaitStateSecondAccess = function (region, data) {
	//Get the second access timing:
	region = region | 0;
	data = data | 0;
	if ((data & 0x4) == 0) {
		data = 0x2 << (region | 0);
		data = ((data | 0) + 1) | 0;
	} else {
		data = 0x2;
	}
	return data | 0;
}
GameBoyAdvanceWait.prototype.setWaitState = function (region, data) {
	region = region | 0;
	data = data | 0;
	//Wait State First Access:
	var firstAccess = this.getWaitStateFirstAccess(data & 0x3) | 0;
	//Wait State Second Access:
	var secondAccess = this.getWaitStateSecondAccess(region | 0, data | 0) | 0;
	region = region << 1;
	//Computing First Access:
	//8-16 bit access:
	this.waitStateClocks16[0x18 | region] = firstAccess | 0;
	this.waitStateClocks16[0x19 | region] = firstAccess | 0;
	//32 bit access:
	var accessTime = ((firstAccess | 0) + (secondAccess | 0)) | 0;
	this.waitStateClocks32[0x18 | region] = accessTime | 0;
	this.waitStateClocks32[0x19 | region] = accessTime | 0;
	//Computing Second Access:
	//8-16 bit access:
	this.waitStateClocks16[0x8 | region] = secondAccess | 0;
	this.waitStateClocks16[0x9 | region] = secondAccess | 0;
	//32 bit access:
	this.waitStateClocks32[0x8 | region] = secondAccess << 1;
	this.waitStateClocks32[0x9 | region] = secondAccess << 1;
}
GameBoyAdvanceWait.prototype.writeWAITCNT0 = function (data) {
	data = data | 0;
	//Set SRAM Wait State:
	if ((data & 0x3) < 0x3) {
		this.SRAMWaitState = (5 - (data & 0x3)) | 0;
	} else {
		this.SRAMWaitState = 9;
	}
	//Set Wait State 0:
	this.setWaitState(0, data >> 2);
	//Set Wait State 1:
	this.setWaitState(1, data >> 5);
	this.WAITCNT0 = data | 0;
}
GameBoyAdvanceWait.prototype.readWAITCNT0 = function () {
	return this.WAITCNT0 | 0;
}
GameBoyAdvanceWait.prototype.writeWAITCNT1 = function (data) {
	data = data | 0;
	//Set Wait State 2:
	this.setWaitState(2, data | 0);
	//Set Prefetch Mode:
	if ((data & 0x40) == 0) {
		//No Prefetch:
		this.resetPrebuffer();
		this.getROMRead16 = this.getROMRead16NoPrefetch;
		this.getROMRead32 = this.getROMRead32NoPrefetch;
		this.CPUInternalCyclePrefetch = this.CPUInternalCycleNoPrefetch;
		this.CPUInternalSingleCyclePrefetch = this.CPUInternalSingleCycleNoPrefetch;
	} else {
		//Prefetch Enabled:
		this.getROMRead16 = this.getROMRead16Prefetch;
		this.getROMRead32 = this.getROMRead32Prefetch;
		this.CPUInternalCyclePrefetch = this.multiClock;
		this.CPUInternalSingleCyclePrefetch = this.singleClock;
	}
	this.WAITCNT1 = data & 0x5F;
}
GameBoyAdvanceWait.prototype.readWAITCNT1 = function () {
	return this.WAITCNT1 | 0;
}
GameBoyAdvanceWait.prototype.writePOSTBOOT = function (data) {
	this.POSTBOOT = data | 0;
}
GameBoyAdvanceWait.prototype.readPOSTBOOT = function () {
	return this.POSTBOOT | 0;
}
GameBoyAdvanceWait.prototype.writeHALTCNT = function (data) {
	data = data | 0;
	this.IOCore.updateCoreSpillRetain();
	//HALT/STOP mode entrance:
	if ((data & 0x80) == 0) {
		//Halt:
		this.IOCore.flagHalt();
	} else {
		//Stop:
		this.IOCore.flagStop();
	}
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	switch (address & 0x3) {
		case 0:
			this.memory.remapWRAM(data & 0x21);
			this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFFFF00) | data;
			break;
		case 1:
			this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFF00FF) | (data << 8);
			break;
		case 2:
			this.WRAMConfiguration = (this.WRAMConfiguration & 0xFF00FFFF) | (data << 16);
			break;
		default:
			this.WRAMWaitState = (0x10 - (data & 0xF)) | 0;
			this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFFFF) | (data << 24);
	}
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((address & 0x2) == 0) {
		this.WRAMConfiguration = (this.WRAMConfiguration & 0xFFFF0000) | (data & 0xFFFF);
		this.memory.remapWRAM(data & 0x21);
	} else {
		this.WRAMConfiguration = (data << 16) | (this.WRAMConfiguration & 0xFFFF);
		this.WRAMWaitState = (0x10 - ((data >> 8) & 0xF)) | 0;
	}
}
GameBoyAdvanceWait.prototype.writeConfigureWRAM32 = function (data) {
	data = data | 0;
	this.WRAMConfiguration = data | 0;
	this.WRAMWaitState = (0x10 - ((data >> 24) & 0xF)) | 0;
	this.memory.remapWRAM(data & 0x21);
}
GameBoyAdvanceWait.prototype.readConfigureWRAM8 = function (address) {
	address = address | 0;
	var data = 0;
	switch (address & 0x3) {
		case 0:
			data = this.WRAMConfiguration & 0x2F;
			break;
		case 3:
			data = this.WRAMConfiguration >>> 24;
	}
	return data | 0;
}
GameBoyAdvanceWait.prototype.readConfigureWRAM16 = function (address) {
	address = address | 0;
	var data = 0;
	if ((address & 0x2) == 0) {
		data = this.WRAMConfiguration & 0x2F;
	} else {
		data = (this.WRAMConfiguration >> 16) & 0xFF00;
	}
	return data | 0;
}
GameBoyAdvanceWait.prototype.readConfigureWRAM32 = function () {
	return this.WRAMConfiguration & 0xFF00002F;
}
GameBoyAdvanceWait.prototype.CPUInternalCycleNoPrefetch = function (clocks) {
	clocks = clocks | 0;
	//Clock for idle CPU time:
	this.IOCore.updateCore(clocks | 0);
	//Prebuffer bug:
	this.checkPrebufferBug();
}
GameBoyAdvanceWait.prototype.CPUInternalSingleCycleNoPrefetch = function () {
	//Clock for idle CPU time:
	this.IOCore.updateCoreSingle();
	//Not enough time for prebuffer buffering, so skip it.
	//Prebuffer bug:
	this.checkPrebufferBug();
}
GameBoyAdvanceWait.prototype.checkPrebufferBug = function () {
	//Issue a non-sequential cycle for the next read if we did an I-cycle:
	var address = this.cpu.registers[15] | 0;
	if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000) {
		this.NonSequentialBroadcast();
	}
}
GameBoyAdvanceWait.prototype.NonSequentialBroadcast = function () {
	//Flag as N cycle:
	this.nonSequential = 0x10;
}
GameBoyAdvanceWait.prototype.NonSequentialBroadcastClear = function () {
	//PC branched:
	this.NonSequentialBroadcast();
	this.resetPrebuffer();
}
GameBoyAdvanceWait.prototype.check128kAlignmentBug = function (address) {
	address = address | 0;
	if ((address & 0x1FFFF) == 0) {
		this.NonSequentialBroadcast();
	}
}
GameBoyAdvanceWait.prototype.multiClock = function (clocks) {
	clocks = clocks | 0;
	this.IOCore.updateCore(clocks | 0);
	var address = this.cpu.registers[15] | 0;
	if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000) {
		if ((this.clocks | 0) < 0xFF) {
			this.clocks = ((this.clocks | 0) + (clocks | 0)) | 0;
		}
	} else {
		this.resetPrebuffer();
	}
}
GameBoyAdvanceWait.prototype.singleClock = function () {
	this.IOCore.updateCoreSingle();
	var address = this.cpu.registers[15] | 0;
	if ((address | 0) >= 0x8000000 && (address | 0) < 0xE000000) {
		if ((this.clocks | 0) < 0xFF) {
			this.clocks = ((this.clocks | 0) + 1) | 0;
		}
	} else {
		this.resetPrebuffer();
	}
}
GameBoyAdvanceWait.prototype.addPrebufferSingleClock = function () {
	this.clocks = ((this.clocks | 0) + 1) | 0;
}
GameBoyAdvanceWait.prototype.decrementBufferSingle = function () {
	this.buffer = ((this.buffer | 0) - 1) | 0;
}
GameBoyAdvanceWait.prototype.decrementBufferDouble = function () {
	this.buffer = ((this.buffer | 0) - 2) | 0;
}
GameBoyAdvanceWait.prototype.resetPrebuffer = function () {
	//Reset the buffering:
	this.clocks = 0;
	this.buffer = 0;
}
GameBoyAdvanceWait.prototype.drainOverdueClocks = function () {
	if ((this.clocks | 0) > 0 && (this.buffer | 0) < 8) {
		var address = this.cpu.registers[15] >>> 24;
		//Convert built up clocks to 16 bit word buffer units:
		do {
			this.clocks = ((this.clocks | 0) - (this.waitStateClocks16[address | 0] | 0)) | 0;
			this.buffer = ((this.buffer | 0) + 1) | 0;
		} while ((this.clocks | 0) > 0 && (this.buffer | 0) < 8);
		//If we're deficient in clocks, fit them in before the access:
		if ((this.clocks | 0) < 0) {
			this.IOCore.updateCoreNegative(this.clocks | 0);
			this.clocks = 0;
		}
	}
}
GameBoyAdvanceWait.prototype.computeClocks = function (address) {
	address = address | 0;
	//Convert built up clocks to 16 bit word buffer units:
	while ((this.buffer | 0) < 8 && (this.clocks | 0) >= (this.waitStateClocks16[address | 0] | 0)) {
		this.clocks = ((this.clocks | 0) - (this.waitStateClocks16[address | 0] | 0)) | 0;
		this.buffer = ((this.buffer | 0) + 1) | 0;
	}
}
GameBoyAdvanceWait.prototype.drainOverdueClocksCPU = function () {
	if ((this.clocks | 0) < 0) {
		//Compute "overdue" clocks:
		this.IOCore.updateCoreNegative(this.clocks | 0);
		this.clocks = 0;
	} else {
		//Buffer satiated, clock 1:
		this.IOCore.updateCoreSingle();
	}
}
GameBoyAdvanceWait.prototype.doGamePakFetch16 = function (address) {
	address = address | 0;
	//Fetch 16 bit word into buffer:
	this.clocks = ((this.clocks | 0) - (this.waitStateClocks16[address | this.nonSequential] | 0)) | 0;
	this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.doGamePakFetch32 = function (address) {
	address = address | 0;
	//Fetch 16 bit word into buffer:
	this.clocks = ((this.clocks | 0) - (this.waitStateClocks32[address | this.nonSequential] | 0)) | 0;
	this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.getROMRead16Prefetch = function (address) {
	//Caching enabled:
	address = address | 0;
	//Resolve clocks to buffer units:
	this.computeClocks(address | 0);
	//Need 16 bits minimum buffered:
	switch (this.buffer | 0) {
		case 0:
			//Fetch 16 bit word into buffer:
			this.doGamePakFetch16(address | 0);
			break;
		default:
			//Instruction fetch is 1 clock wide minimum:
			this.addPrebufferSingleClock();
			//Decrement the buffer:
			this.decrementBufferSingle();
	}
	//Clock the state:
	this.drainOverdueClocksCPU();
}
GameBoyAdvanceWait.prototype.getROMRead16NoPrefetch = function (address) {
	//Caching disabled:
	address = address | 0;
	this.IOCore.updateCore(this.waitStateClocks16[address | this.nonSequential] | 0);
	this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.getROMRead32Prefetch = function (address) {
	//Caching enabled:
	address = address | 0;
	//Resolve clocks to buffer units:
	this.computeClocks(address | 0);
	//Need 32 bits minimum buffered:
	switch (this.buffer | 0) {
		case 0:
			//Fetch two 16 bit words into buffer:
			this.doGamePakFetch32(address | 0);
			break;
		case 1:
			//Fetch a 16 bit word into buffer:
			this.doGamePakFetch16(address | 0);
			this.buffer = 0;
			break;
		default:
			//Instruction fetch is 1 clock wide minimum:
			this.addPrebufferSingleClock();
			//Decrement the buffer:
			this.decrementBufferDouble();
	}
	//Clock the state:
	this.drainOverdueClocksCPU();
}
GameBoyAdvanceWait.prototype.getROMRead32NoPrefetch = function (address) {
	//Caching disabled:
	address = address | 0;
	this.IOCore.updateCore(this.waitStateClocks32[address | this.nonSequential] | 0);
	this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.WRAMAccess = function () {
	this.multiClock(this.WRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.WRAMAccess16CPU = function () {
	this.IOCore.updateCore(this.WRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.WRAMAccess32 = function () {
	this.multiClock(this.WRAMWaitState << 1);
}
GameBoyAdvanceWait.prototype.WRAMAccess32CPU = function () {
	this.IOCore.updateCore(this.WRAMWaitState << 1);
}
GameBoyAdvanceWait.prototype.ROMAccess = function (address) {
	address = address | 0;
	this.drainOverdueClocks();
	this.check128kAlignmentBug(address | 0);
	this.IOCore.updateCore(this.waitStateClocks16[(address >> 24) | this.nonSequential] | 0);
	this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.ROMAccess16CPU = function (address) {
	address = address | 0;
	this.check128kAlignmentBug(address | 0);
	this.getROMRead16(address >> 24);
}
GameBoyAdvanceWait.prototype.ROMAccess32 = function (address) {
	address = address | 0;
	this.drainOverdueClocks();
	this.check128kAlignmentBug(address | 0);
	this.IOCore.updateCore(this.waitStateClocks32[(address >> 24) | this.nonSequential] | 0);
	this.nonSequential = 0;
}
GameBoyAdvanceWait.prototype.ROMAccess32CPU = function (address) {
	address = address | 0;
	this.check128kAlignmentBug(address | 0);
	this.getROMRead32(address >> 24);
}
GameBoyAdvanceWait.prototype.SRAMAccess = function () {
	this.multiClock(this.SRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.SRAMAccessCPU = function () {
	this.resetPrebuffer();
	this.IOCore.updateCore(this.SRAMWaitState | 0);
}
GameBoyAdvanceWait.prototype.VRAMAccess = function () {
	this.multiClock(this.isRendering | 0);
}
GameBoyAdvanceWait.prototype.VRAMAccess16CPU = function () {
	this.IOCore.updateCore(this.isRendering | 0);
}
GameBoyAdvanceWait.prototype.VRAMAccess32 = function () {
	this.multiClock(this.isRendering << 1);
}
GameBoyAdvanceWait.prototype.VRAMAccess32CPU = function () {
	this.IOCore.updateCore(this.isRendering << 1);
}
GameBoyAdvanceWait.prototype.OAMAccess = function () {
	this.multiClock(this.isOAMRendering | 0);
}
GameBoyAdvanceWait.prototype.OAMAccessCPU = function () {
	this.IOCore.updateCore(this.isOAMRendering | 0);
}
GameBoyAdvanceWait.prototype.updateRenderStatus = function (isRendering, isOAMRendering) {
	this.isRendering = isRendering | 0;
	this.isOAMRendering = isOAMRendering | 0;
}








"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceCPU(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceCPU.prototype.initialize = function () {
	this.memory = this.IOCore.memory;
	this.wait = this.IOCore.wait;
	this.mul64ResultHigh = 0; //Scratch MUL64.
	this.mul64ResultLow = 0; //Scratch MUL64.
	this.initializeRegisters();
	this.ARM = new ARMInstructionSet(this);
	this.THUMB = new THUMBInstructionSet(this);
	//this.swi = new GameBoyAdvanceSWI(this);
	this.IOCore.assignInstructionCoreReferences(this.ARM, this.THUMB);
}
GameBoyAdvanceCPU.prototype.initializeRegisters = function () {
	/*
		R0-R7 Are known as the low registers.
		R8-R12 Are the high registers.
		R13 is the stack pointer.
		R14 is the link register.
		R15 is the program counter.
		CPSR is the program status register.
		SPSR is the saved program status register.
	*/
	//Normal R0-R15 Registers:
	this.registers = getInt32Array(16);
	//Used to copy back the R8-R14 state for normal operations:
	this.registersUSR = getInt32Array(7);
	//Fast IRQ mode registers (R8-R14):
	this.registersFIQ = getInt32Array(7);
	//Supervisor mode registers (R13-R14):
	this.registersSVC = getInt32Array(2);
	//Abort mode registers (R13-R14):
	this.registersABT = getInt32Array(2);
	//IRQ mode registers (R13-R14):
	this.registersIRQ = getInt32Array(2);
	//Undefined mode registers (R13-R14):
	this.registersUND = getInt32Array(2);
	//CPSR Register:
	this.branchFlags = ARMCPSRAttributeTable();
	this.modeFlags = 0xD3;
	//Banked SPSR Registers:
	this.SPSR = getUint16Array(5);
	this.SPSR[0] = 0xD3; //FIQ
	this.SPSR[1] = 0xD3; //IRQ
	this.SPSR[2] = 0xD3; //Supervisor
	this.SPSR[3] = 0xD3; //Abort
	this.SPSR[4] = 0xD3; //Undefined
	this.triggeredIRQ = 0; //Pending IRQ found.
	//Pre-initialize stack pointers if no BIOS loaded:
	if (!this.IOCore.BIOSFound || this.IOCore.settings.SKIPBoot) {
		this.HLEReset();
	}
	//Start in fully bubbled pipeline mode:
	this.IOCore.flagBubble();
}
GameBoyAdvanceCPU.prototype.HLEReset = function () {
	this.registersSVC[0] = 0x3007FE0;
	this.registersIRQ[0] = 0x3007FA0;
	this.registers[13] = 0x3007F00;
	this.registers[15] = 0x8000000;
	this.modeFlags = this.modeFlags | 0x1f;
}
GameBoyAdvanceCPU.prototype.branch = function (branchTo) {
	branchTo = branchTo | 0;
	//if ((branchTo | 0) > 0x3FFF || this.IOCore.BIOSFound) {
	//Branch to new address:
	this.registers[15] = branchTo | 0;
	//Mark pipeline as invalid:
	this.IOCore.flagBubble();
	//Next PC fetch has to update the address bus:
	this.wait.NonSequentialBroadcastClear();
	/*}
	else {
		//We're branching into BIOS, handle specially:
		if ((branchTo | 0) == 0x130) {
			//IRQ mode exit handling:
			//ROM IRQ handling returns back from its own subroutine back to BIOS at this address.
			this.HLEIRQExit();
		}
		else {
			//Reset to start of ROM if no BIOS ROM found:
			this.HLEReset();
		}
	}*/
}
GameBoyAdvanceCPU.prototype.triggerIRQ = function (didFire) {
	this.triggeredIRQ = didFire | 0;
	this.assertIRQ();
}
GameBoyAdvanceCPU.prototype.assertIRQ = function () {
	if ((this.triggeredIRQ | 0) != 0 && (this.modeFlags & 0x80) == 0) {
		this.IOCore.flagIRQ();
	}
}
GameBoyAdvanceCPU.prototype.getCurrentFetchValue = function () {
	if ((this.modeFlags & 0x20) != 0) {
		return this.THUMB.getCurrentFetchValue() | 0;
	} else {
		return this.ARM.getCurrentFetchValue() | 0;
	}
}
GameBoyAdvanceCPU.prototype.enterARM = function () {
	this.modeFlags = this.modeFlags & 0xdf;
	this.THUMBBitModify(false);
}
GameBoyAdvanceCPU.prototype.enterTHUMB = function () {
	this.modeFlags = this.modeFlags | 0x20;
	this.THUMBBitModify(true);
}
GameBoyAdvanceCPU.prototype.getLR = function () {
	//Get the previous instruction address:
	if ((this.modeFlags & 0x20) != 0) {
		return this.THUMB.getLR() | 0;
	} else {
		return this.ARM.getLR() | 0;
	}
}
GameBoyAdvanceCPU.prototype.THUMBBitModify = function (isThumb) {
	if (isThumb) {
		this.IOCore.flagTHUMB();
	} else {
		this.IOCore.deflagTHUMB();
	}
}
GameBoyAdvanceCPU.prototype.IRQinARM = function () {
	//Mode bits are set to IRQ:
	this.switchMode(0x12);
	//Save link register:
	this.registers[14] = this.ARM.getIRQLR() | 0;
	//Disable IRQ:
	this.modeFlags = this.modeFlags | 0x80;
	//if (this.IOCore.BIOSFound) {
	//IRQ exception vector:
	this.branch(0x18);
	/*}
	else {
		//HLE the IRQ entrance:
		this.HLEIRQEnter();
	}*/
	//Deflag IRQ from state:
	this.IOCore.deflagIRQ();
}
GameBoyAdvanceCPU.prototype.IRQinTHUMB = function () {
	//Mode bits are set to IRQ:
	this.switchMode(0x12);
	//Save link register:
	this.registers[14] = this.THUMB.getIRQLR() | 0;
	//Disable IRQ:
	this.modeFlags = this.modeFlags | 0x80;
	//Exception always enter ARM mode:
	this.enterARM();
	//if (this.IOCore.BIOSFound) {
	//IRQ exception vector:
	this.branch(0x18);
	/*}
	else {
		//HLE the IRQ entrance:
		this.HLEIRQEnter();
	}*/
	//Deflag IRQ from state:
	this.IOCore.deflagIRQ();
}
GameBoyAdvanceCPU.prototype.HLEIRQEnter = function () {
	//Get the base address:
	var currentAddress = this.registers[0xD] | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	//Push register(s) into memory:
	for (var rListPosition = 0xF;
		(rListPosition | 0) > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
		if ((0x500F & (1 << (rListPosition | 0))) != 0) {
			//Push a register into memory:
			currentAddress = ((currentAddress | 0) - 4) | 0;
			this.memory.memoryWrite32(currentAddress | 0, this.registers[rListPosition | 0] | 0);
		}
	}
	//Store the updated base address back into register:
	this.registers[0xD] = currentAddress | 0;
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	this.registers[0] = 0x4000000;
	//Save link register:
	this.registers[14] = 0x130;
	//Skip BIOS ROM processing:
	this.branch(this.read32(0x3FFFFFC) & -0x4);
}
GameBoyAdvanceCPU.prototype.HLEIRQExit = function () {
	//Get the base address:
	var currentAddress = this.registers[0xD] | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	//Load register(s) from memory:
	for (var rListPosition = 0;
		(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
		if ((0x500F & (1 << (rListPosition | 0))) != 0) {
			//Load a register from memory:
			this.registers[rListPosition & 0xF] = this.memory.memoryRead32(currentAddress | 0) | 0;
			currentAddress = ((currentAddress | 0) + 4) | 0;
		}
	}
	//Store the updated base address back into register:
	this.registers[0xD] = currentAddress | 0;
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Return from an exception mode:
	var data = this.branchFlags.setSUBFlags(this.registers[0xE] | 0, 4) | 0;
	//Restore SPSR to CPSR:
	data = data & (-4 >> (this.SPSRtoCPSR() >> 5));
	//We performed a branch:
	this.branch(data | 0);
}
GameBoyAdvanceCPU.prototype.SWI = function () {
	//if (this.IOCore.BIOSFound) {
	//Mode bits are set to SWI:
	this.switchMode(0x13);
	//Save link register:
	this.registers[14] = this.getLR() | 0;
	//Disable IRQ:
	this.modeFlags = this.modeFlags | 0x80;
	//Exception always enter ARM mode:
	this.enterARM();
	//SWI exception vector:
	this.branch(0x8);
	/*}
	else {
		if ((this.modeFlags & 0x20) != 0) {
			this.THUMB.incrementProgramCounter();
			//HLE the SWI command:
			this.swi.execute(this.THUMB.getSWICode() | 0);
		}
		else {
			this.ARM.incrementProgramCounter();
			//HLE the SWI command:
			this.swi.execute(this.ARM.getSWICode() | 0);
		}
	}*/
}
GameBoyAdvanceCPU.prototype.UNDEFINED = function () {
	//Only process undefined instruction if BIOS loaded:
	//if (this.IOCore.BIOSFound) {
	//Mode bits are set to SWI:
	this.switchMode(0x1B);
	//Save link register:
	this.registers[14] = this.getLR() | 0;
	//Disable IRQ:
	this.modeFlags = this.modeFlags | 0x80;
	//Exception always enter ARM mode:
	this.enterARM();
	//Undefined exception vector:
	this.branch(0x4);
	/*}
	else {
		//Pretend we didn't execute the bad instruction then:
		if ((this.modeFlags & 0x20) != 0) {
			this.THUMB.incrementProgramCounter();
		}
		else {
			this.ARM.incrementProgramCounter();
		}
	}*/
}
GameBoyAdvanceCPU.prototype.SPSRtoCPSR = function () {
	//Used for leaving an exception and returning to the previous state:
	var bank = 1;
	switch (this.modeFlags & 0x1f) {
		case 0x12: //IRQ
			break;
		case 0x13: //Supervisor
			bank = 2;
			break;
		case 0x11: //FIQ
			bank = 0;
			break;
		case 0x17: //Abort
			bank = 3;
			break;
		case 0x1B: //Undefined
			bank = 4;
			break;
		default: //User & system lacks SPSR
			return this.modeFlags & 0x20;
	}
	var spsr = this.SPSR[bank | 0] | 0;
	this.branchFlags.setNZCV(spsr << 20);
	this.switchRegisterBank(spsr & 0x1F);
	this.modeFlags = spsr & 0xFF;
	this.assertIRQ();
	this.THUMBBitModify((spsr & 0x20) != 0);
	return spsr & 0x20;
}
GameBoyAdvanceCPU.prototype.switchMode = function (newMode) {
	newMode = newMode | 0;
	this.CPSRtoSPSR(newMode | 0);
	this.switchRegisterBank(newMode | 0);
	this.modeFlags = (this.modeFlags & 0xe0) | (newMode | 0);
}
GameBoyAdvanceCPU.prototype.CPSRtoSPSR = function (newMode) {
	//Used for entering an exception and saving the previous state:
	var spsr = this.modeFlags & 0xFF;
	spsr = spsr | (this.branchFlags.getNZCV() >> 20);
	switch (newMode | 0) {
		case 0x12: //IRQ
			this.SPSR[1] = spsr | 0;
			break;
		case 0x13: //Supervisor
			this.SPSR[2] = spsr | 0;
			break;
		case 0x11: //FIQ
			this.SPSR[0] = spsr | 0;
			break;
		case 0x17: //Abort
			this.SPSR[3] = spsr | 0;
			break;
		case 0x1B: //Undefined
			this.SPSR[4] = spsr | 0;
	}
}
GameBoyAdvanceCPU.prototype.switchRegisterBank = function (newMode) {
	newMode = newMode | 0;
	switch (this.modeFlags & 0x1F) {
		case 0x10:
		case 0x1F:
			this.registersUSR[0] = this.registers[8] | 0;
			this.registersUSR[1] = this.registers[9] | 0;
			this.registersUSR[2] = this.registers[10] | 0;
			this.registersUSR[3] = this.registers[11] | 0;
			this.registersUSR[4] = this.registers[12] | 0;
			this.registersUSR[5] = this.registers[13] | 0;
			this.registersUSR[6] = this.registers[14] | 0;
			break;
		case 0x11:
			this.registersFIQ[0] = this.registers[8] | 0;
			this.registersFIQ[1] = this.registers[9] | 0;
			this.registersFIQ[2] = this.registers[10] | 0;
			this.registersFIQ[3] = this.registers[11] | 0;
			this.registersFIQ[4] = this.registers[12] | 0;
			this.registersFIQ[5] = this.registers[13] | 0;
			this.registersFIQ[6] = this.registers[14] | 0;
			break;
		case 0x12:
			this.registersUSR[0] = this.registers[8] | 0;
			this.registersUSR[1] = this.registers[9] | 0;
			this.registersUSR[2] = this.registers[10] | 0;
			this.registersUSR[3] = this.registers[11] | 0;
			this.registersUSR[4] = this.registers[12] | 0;
			this.registersIRQ[0] = this.registers[13] | 0;
			this.registersIRQ[1] = this.registers[14] | 0;
			break;
		case 0x13:
			this.registersUSR[0] = this.registers[8] | 0;
			this.registersUSR[1] = this.registers[9] | 0;
			this.registersUSR[2] = this.registers[10] | 0;
			this.registersUSR[3] = this.registers[11] | 0;
			this.registersUSR[4] = this.registers[12] | 0;
			this.registersSVC[0] = this.registers[13] | 0;
			this.registersSVC[1] = this.registers[14] | 0;
			break;
		case 0x17:
			this.registersUSR[0] = this.registers[8] | 0;
			this.registersUSR[1] = this.registers[9] | 0;
			this.registersUSR[2] = this.registers[10] | 0;
			this.registersUSR[3] = this.registers[11] | 0;
			this.registersUSR[4] = this.registers[12] | 0;
			this.registersABT[0] = this.registers[13] | 0;
			this.registersABT[1] = this.registers[14] | 0;
			break;
		case 0x1B:
			this.registersUSR[0] = this.registers[8] | 0;
			this.registersUSR[1] = this.registers[9] | 0;
			this.registersUSR[2] = this.registers[10] | 0;
			this.registersUSR[3] = this.registers[11] | 0;
			this.registersUSR[4] = this.registers[12] | 0;
			this.registersUND[0] = this.registers[13] | 0;
			this.registersUND[1] = this.registers[14] | 0;
	}
	switch (newMode | 0) {
		case 0x10:
		case 0x1F:
			this.registers[8] = this.registersUSR[0] | 0;
			this.registers[9] = this.registersUSR[1] | 0;
			this.registers[10] = this.registersUSR[2] | 0;
			this.registers[11] = this.registersUSR[3] | 0;
			this.registers[12] = this.registersUSR[4] | 0;
			this.registers[13] = this.registersUSR[5] | 0;
			this.registers[14] = this.registersUSR[6] | 0;
			break;
		case 0x11:
			this.registers[8] = this.registersFIQ[0] | 0;
			this.registers[9] = this.registersFIQ[1] | 0;
			this.registers[10] = this.registersFIQ[2] | 0;
			this.registers[11] = this.registersFIQ[3] | 0;
			this.registers[12] = this.registersFIQ[4] | 0;
			this.registers[13] = this.registersFIQ[5] | 0;
			this.registers[14] = this.registersFIQ[6] | 0;
			break;
		case 0x12:
			this.registers[8] = this.registersUSR[0] | 0;
			this.registers[9] = this.registersUSR[1] | 0;
			this.registers[10] = this.registersUSR[2] | 0;
			this.registers[11] = this.registersUSR[3] | 0;
			this.registers[12] = this.registersUSR[4] | 0;
			this.registers[13] = this.registersIRQ[0] | 0;
			this.registers[14] = this.registersIRQ[1] | 0;
			break;
		case 0x13:
			this.registers[8] = this.registersUSR[0] | 0;
			this.registers[9] = this.registersUSR[1] | 0;
			this.registers[10] = this.registersUSR[2] | 0;
			this.registers[11] = this.registersUSR[3] | 0;
			this.registers[12] = this.registersUSR[4] | 0;
			this.registers[13] = this.registersSVC[0] | 0;
			this.registers[14] = this.registersSVC[1] | 0;
			break;
		case 0x17:
			this.registers[8] = this.registersUSR[0] | 0;
			this.registers[9] = this.registersUSR[1] | 0;
			this.registers[10] = this.registersUSR[2] | 0;
			this.registers[11] = this.registersUSR[3] | 0;
			this.registers[12] = this.registersUSR[4] | 0;
			this.registers[13] = this.registersABT[0] | 0;
			this.registers[14] = this.registersABT[1] | 0;
			break;
		case 0x1B:
			this.registers[8] = this.registersUSR[0] | 0;
			this.registers[9] = this.registersUSR[1] | 0;
			this.registers[10] = this.registersUSR[2] | 0;
			this.registers[11] = this.registersUSR[3] | 0;
			this.registers[12] = this.registersUSR[4] | 0;
			this.registers[13] = this.registersUND[0] | 0;
			this.registers[14] = this.registersUND[1] | 0;
	}
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceCPU.prototype.calculateMUL32 = Math.imul;
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceCPU.prototype.calculateMUL32 = function (rs, rd) {
		rs = rs | 0;
		rd = rd | 0;
		/*
		 We have to split up the 32 bit multiplication,
		 as JavaScript does multiplication on the FPU
		 as double floats, which drops the low bits
		 rather than the high bits.
		 */
		var lowMul = (rs & 0xFFFF) * rd;
		var highMul = (rs >> 16) * rd;
		//Cut off bits above bit 31 and return with proper sign:
		return ((highMul << 16) + lowMul) | 0;
	}
}
GameBoyAdvanceCPU.prototype.performMUL32 = function (rs, rd) {
	rs = rs | 0;
	rd = rd | 0;
	//Predict the internal cycle time:
	if ((rd >>> 8) == 0 || (rd >>> 8) == 0xFFFFFF) {
		this.IOCore.wait.CPUInternalSingleCyclePrefetch();
	} else if ((rd >>> 16) == 0 || (rd >>> 16) == 0xFFFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(2);
	} else if ((rd >>> 24) == 0 || (rd >>> 24) == 0xFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(3);
	} else {
		this.IOCore.wait.CPUInternalCyclePrefetch(4);
	}
	return this.calculateMUL32(rs | 0, rd | 0) | 0;
}
GameBoyAdvanceCPU.prototype.performMUL32MLA = function (rs, rd) {
	rs = rs | 0;
	rd = rd | 0;
	//Predict the internal cycle time:
	if ((rd >>> 8) == 0 || (rd >>> 8) == 0xFFFFFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(2);
	} else if ((rd >>> 16) == 0 || (rd >>> 16) == 0xFFFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(3);
	} else if ((rd >>> 24) == 0 || (rd >>> 24) == 0xFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(4);
	} else {
		this.IOCore.wait.CPUInternalCyclePrefetch(5);
	}
	return this.calculateMUL32(rs | 0, rd | 0) | 0;
}
GameBoyAdvanceCPU.prototype.performMUL64 = function (rs, rd) {
	rs = rs | 0;
	rd = rd | 0;
	//Predict the internal cycle time:
	if ((rd >>> 8) == 0 || (rd >>> 8) == 0xFFFFFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(2);
	} else if ((rd >>> 16) == 0 || (rd >>> 16) == 0xFFFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(3);
	} else if ((rd >>> 24) == 0 || (rd >>> 24) == 0xFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(4);
	} else {
		this.IOCore.wait.CPUInternalCyclePrefetch(5);
	}
	//Solve for the high word (Do FPU double divide to bring down high word into the low word):
	this.mul64ResultHigh = Math.floor((rs * rd) / 0x100000000) | 0;
	this.mul64ResultLow = this.calculateMUL32(rs | 0, rd | 0) | 0;
}
GameBoyAdvanceCPU.prototype.performMLA64 = function (rs, rd, mlaHigh, mlaLow) {
	rs = rs | 0;
	rd = rd | 0;
	mlaHigh = mlaHigh | 0;
	mlaLow = mlaLow | 0;
	//Predict the internal cycle time:
	if ((rd >>> 8) == 0 || (rd >>> 8) == 0xFFFFFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(3);
	} else if ((rd >>> 16) == 0 || (rd >>> 16) == 0xFFFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(4);
	} else if ((rd >>> 24) == 0 || (rd >>> 24) == 0xFF) {
		this.IOCore.wait.CPUInternalCyclePrefetch(5);
	} else {
		this.IOCore.wait.CPUInternalCyclePrefetch(6);
	}
	//Solve for the high word (Do FPU double divide to bring down high word into the low word):
	var mulTop = Math.floor((rs * rd) / 0x100000000) | 0;
	var dirty = (this.calculateMUL32(rs | 0, rd | 0) >>> 0) + (mlaLow >>> 0);
	this.mul64ResultHigh = ((mulTop | 0) + (mlaHigh | 0) + Math.floor(dirty / 0x100000000)) | 0;
	this.mul64ResultLow = dirty | 0;
}
GameBoyAdvanceCPU.prototype.performUMUL64 = function (rs, rd) {
	rs = rs | 0;
	rd = rd | 0;
	//Predict the internal cycle time:
	if ((rd >>> 8) == 0) {
		this.IOCore.wait.CPUInternalCyclePrefetch(2);
	} else if ((rd >>> 16) == 0) {
		this.IOCore.wait.CPUInternalCyclePrefetch(3);
	} else if ((rd >>> 24) == 0) {
		this.IOCore.wait.CPUInternalCyclePrefetch(4);
	} else {
		this.IOCore.wait.CPUInternalCyclePrefetch(5);
	}
	//Solve for the high word (Do FPU double divide to bring down high word into the low word):
	this.mul64ResultHigh = (((rs >>> 0) * (rd >>> 0)) / 0x100000000) | 0;
	this.mul64ResultLow = this.calculateMUL32(rs | 0, rd | 0) | 0;
}
GameBoyAdvanceCPU.prototype.performUMLA64 = function (rs, rd, mlaHigh, mlaLow) {
	rs = rs | 0;
	rd = rd | 0;
	mlaHigh = mlaHigh | 0;
	mlaLow = mlaLow | 0;
	//Predict the internal cycle time:
	if ((rd >>> 8) == 0) {
		this.IOCore.wait.CPUInternalCyclePrefetch(3);
	} else if ((rd >>> 16) == 0) {
		this.IOCore.wait.CPUInternalCyclePrefetch(4);
	} else if ((rd >>> 24) == 0) {
		this.IOCore.wait.CPUInternalCyclePrefetch(5);
	} else {
		this.IOCore.wait.CPUInternalCyclePrefetch(6);
	}
	//Solve for the high word (Do FPU double divide to bring down high word into the low word):
	var mulTop = Math.floor(((rs >>> 0) * (rd >>> 0)) / 0x100000000) | 0;
	var dirty = (this.calculateMUL32(rs | 0, rd | 0) >>> 0) + (mlaLow >>> 0);
	this.mul64ResultHigh = ((mulTop | 0) + (mlaHigh | 0) + Math.floor(dirty / 0x100000000)) | 0;
	this.mul64ResultLow = dirty | 0;
}
GameBoyAdvanceCPU.prototype.write32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	//Updating the address bus away from PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	this.memory.memoryWrite32(address | 0, data | 0);
	//Updating the address bus back to PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
}
GameBoyAdvanceCPU.prototype.write16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	//Updating the address bus away from PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	this.memory.memoryWrite16(address | 0, data | 0);
	//Updating the address bus back to PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
}
GameBoyAdvanceCPU.prototype.write8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	//Updating the address bus away from PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	this.memory.memoryWrite8(address | 0, data | 0);
	//Updating the address bus back to PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
}
GameBoyAdvanceCPU.prototype.read32 = function (address) {
	address = address | 0;
	//Updating the address bus away from PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	var data = this.memory.memoryRead32(address | 0) | 0;
	//Unaligned access gets data rotated right:
	if ((address & 0x3) != 0) {
		//Rotate word right:
		data = (data << ((4 - (address & 0x3)) << 3)) | (data >>> ((address & 0x3) << 3));
	}
	//Updating the address bus back to PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	return data | 0;
}
GameBoyAdvanceCPU.prototype.read16 = function (address) {
	address = address | 0;
	//Updating the address bus away from PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	var data = this.memory.memoryRead16(address | 0) | 0;
	//Unaligned access gets data rotated right:
	if ((address & 0x1) != 0) {
		//Rotate word right:
		data = (data << 24) | (data >>> 8);
	}
	//Updating the address bus back to PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	return data | 0;
}
GameBoyAdvanceCPU.prototype.read8 = function (address) {
	address = address | 0;
	//Updating the address bus away from PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	var data = this.memory.memoryRead8(address | 0) | 0;
	//Updating the address bus back to PC fetch:
	this.IOCore.wait.NonSequentialBroadcast();
	return data | 0;
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceSaves(IOCore) {
	this.cartridge = IOCore.cartridge;
}
GameBoyAdvanceSaves.prototype.initialize = function () {
	this.saveType = 0;
	this.gpioType = 0;
	this.GPIOChip = null;
	this.UNDETERMINED = new GameBoyAdvanceSaveDeterminer(this);
	this.SRAMChip = new GameBoyAdvanceSRAMChip();
	this.FLASHChip = new GameBoyAdvanceFLASHChip(this.cartridge.flash_is128, this.cartridge.flash_isAtmel);
	this.EEPROMChip = new GameBoyAdvanceEEPROMChip(this.cartridge.IOCore);
	this.currentChip = this.UNDETERMINED;
	this.referenceSave(this.saveType);
}
GameBoyAdvanceSaves.prototype.referenceSave = function (saveType) {
	saveType = saveType | 0;
	switch (saveType | 0) {
		case 0:
			this.currentChip = this.UNDETERMINED;
			break;
		case 1:
			this.currentChip = this.SRAMChip;
			break;
		case 2:
			this.currentChip = this.FLASHChip;
			break;
		case 3:
			this.currentChip = this.EEPROMChip;
	}
	this.currentChip.initialize();
	this.saveType = saveType | 0;
}
GameBoyAdvanceSaves.prototype.importSave = function (saves, saveType) {
	this.UNDETERMINED.load(saves);
	this.SRAMChip.load(saves);
	this.FLASHChip.load(saves);
	this.EEPROMChip.load(saves);
	this.referenceSave(saveType | 0);
}
GameBoyAdvanceSaves.prototype.exportSave = function () {
	return this.currentChip.saves;
}
GameBoyAdvanceSaves.prototype.exportSaveType = function () {
	return this.saveType | 0;
}
GameBoyAdvanceSaves.prototype.readGPIO8 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.gpioType | 0) > 0) {
		//GPIO:
		data = this.GPIOChip.read8(address | 0) | 0;
	} else {
		//ROM:
		data = this.cartridge.readROMOnly8(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceSaves.prototype.readEEPROM8 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.saveType | 0) == 3) {
		//EEPROM:
		data = this.EEPROMChip.read8() | 0;
	} else {
		//UNKNOWN:
		data = this.UNDETERMINED.readEEPROM8(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceSaves.prototype.readGPIO16 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.gpioType | 0) > 0) {
		//GPIO:
		data = this.GPIOChip.read16(address | 0) | 0;
	} else {
		//ROM:
		data = this.cartridge.readROMOnly16(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceSaves.prototype.readEEPROM16 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.saveType | 0) == 3) {
		//EEPROM:
		data = this.EEPROMChip.read16() | 0;
	} else {
		//UNKNOWN:
		data = this.UNDETERMINED.readEEPROM16(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceSaves.prototype.readGPIO32 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.gpioType | 0) > 0) {
		//GPIO:
		data = this.GPIOChip.read32(address | 0) | 0;
	} else {
		//ROM:
		data = this.cartridge.readROMOnly32(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceSaves.prototype.readEEPROM32 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.saveType | 0) == 3) {
		//EEPROM:
		data = this.EEPROMChip.read32() | 0;
	} else {
		//UNKNOWN:
		data = this.UNDETERMINED.readEEPROM32(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceSaves.prototype.readSRAM = function (address) {
	address = address | 0;
	var data = 0;
	switch (this.saveType | 0) {
		case 0:
			//UNKNOWN:
			data = this.UNDETERMINED.readSRAM(address | 0) | 0;
			break;
		case 1:
			//SRAM:
			data = this.SRAMChip.read(address | 0) | 0;
			break;
		case 2:
			//FLASH:
			data = this.FLASHChip.read(address | 0) | 0;
	}
	return data | 0;
}
GameBoyAdvanceSaves.prototype.writeGPIO8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((this.gpioType | 0) > 0) {
		//GPIO:
		this.GPIOChip.write8(address | 0, data | 0);
	} else {
		//Unknown:
		this.UNDETERMINED.writeGPIO8(address | 0, data | 0);
	}
}
GameBoyAdvanceSaves.prototype.writeGPIO16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((this.gpioType | 0) > 0) {
		//GPIO:
		this.GPIOChip.write16(address | 0, data | 0);
	} else {
		//Unknown:
		this.UNDETERMINED.writeGPIO16(address | 0, data | 0);
	}
}
GameBoyAdvanceSaves.prototype.writeEEPROM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((this.saveType | 0) == 3) {
		//EEPROM:
		this.EEPROMChip.write16(data | 0);
	} else {
		//Unknown:
		this.UNDETERMINED.writeEEPROM16(address | 0, data | 0);
	}
}
GameBoyAdvanceSaves.prototype.writeGPIO32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((this.gpioType | 0) > 0) {
		//GPIO:
		this.GPIOChip.write32(address | 0, data | 0);
	} else {
		//Unknown:
		this.UNDETERMINED.writeGPIO32(address | 0, data | 0);
	}
}
GameBoyAdvanceSaves.prototype.writeSRAM = function (address, data) {
	address = address | 0;
	data = data | 0;
	switch (this.saveType | 0) {
		case 0:
			//Unknown:
			this.UNDETERMINED.writeSRAM(address | 0, data | 0);
			break;
		case 1:
			//SRAM:
			this.SRAMChip.write(address | 0, data | 0);
			break;
		case 2:
			//FLASH:
			this.FLASHChip.write(address | 0, data | 0);
	}
}
GameBoyAdvanceSaves.prototype.writeSRAMIfDefined = function (address, data) {
	address = address | 0;
	data = data | 0;
	switch (this.saveType | 0) {
		case 0:
			//UNKNOWN:
			this.SRAMChip.initialize();
		case 1:
			//SRAM:
			this.SRAMChip.write(address | 0, data | 0);
			break;
		case 2:
			//FLASH:
			this.FLASHChip.write(address | 0, data | 0);
	}
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceChannel1Synth(sound) {
	this.sound = sound;
	this.currentSampleLeft = 0;
	this.currentSampleLeftSecondary = 0;
	this.currentSampleLeftTrimary = 0;
	this.currentSampleRight = 0;
	this.currentSampleRightSecondary = 0;
	this.currentSampleRightTrimary = 0;
	this.SweepFault = false;
	this.lastTimeSweep = 0;
	this.timeSweep = 0;
	this.frequencySweepDivider = 0;
	this.decreaseSweep = false;
	this.nr11 = 0;
	this.CachedDuty = this.dutyLookup[0];
	this.totalLength = 0x40;
	this.nr12 = 0;
	this.envelopeVolume = 0;
	this.frequency = 0;
	this.FrequencyTracker = 0x8000;
	this.nr14 = 0;
	this.consecutive = true;
	this.ShadowFrequency = 0x8000;
	this.canPlay = false;
	this.Enabled = false;
	this.envelopeSweeps = 0;
	this.envelopeSweepsLast = -1;
	this.FrequencyCounter = 0;
	this.DutyTracker = 0;
	this.Swept = false;
}
GameBoyAdvanceChannel1Synth.prototype.dutyLookup = [
	[false, false, false, false, false, false, false, true],
	[true, false, false, false, false, false, false, true],
	[true, false, false, false, false, true, true, true],
	[false, true, true, true, true, true, true, false]
];
GameBoyAdvanceChannel1Synth.prototype.disabled = function () {
	//Clear NR10:
	this.nr10 = 0;
	this.SweepFault = false;
	this.lastTimeSweep = 0;
	this.timeSweep = 0;
	this.frequencySweepDivider = 0;
	this.decreaseSweep = false;
	//Clear NR11:
	this.nr11 = 0;
	this.CachedDuty = this.dutyLookup[0];
	this.totalLength = 0x40;
	//Clear NR12:
	this.nr12 = 0;
	this.envelopeVolume = 0;
	//Clear NR13:
	this.frequency = 0;
	this.FrequencyTracker = 0x8000;
	//Clear NR14:
	this.nr14 = 0;
	this.consecutive = true;
	this.ShadowFrequency = 0x8000;
	this.canPlay = false;
	this.Enabled = false;
	this.envelopeSweeps = 0;
	this.envelopeSweepsLast = -1;
	this.FrequencyCounter = 0;
	this.DutyTracker = 0;
}
GameBoyAdvanceChannel1Synth.prototype.clockAudioLength = function () {
	if ((this.totalLength | 0) > 1) {
		this.totalLength = ((this.totalLength | 0) - 1) | 0;
	} else if ((this.totalLength | 0) == 1) {
		this.totalLength = 0;
		this.enableCheck();
		this.sound.unsetNR52(0xFE); //Channel #1 On Flag Off
	}
}
GameBoyAdvanceChannel1Synth.prototype.enableCheck = function () {
	this.Enabled = ((this.consecutive || (this.totalLength | 0) > 0) && !this.SweepFault && this.canPlay);
}
GameBoyAdvanceChannel1Synth.prototype.volumeEnableCheck = function () {
	this.canPlay = ((this.nr12 | 0) > 7);
	this.enableCheck();
}
GameBoyAdvanceChannel1Synth.prototype.outputLevelCache = function () {
	this.currentSampleLeft = (this.sound.leftChannel1) ? (this.envelopeVolume | 0) : 0;
	this.currentSampleRight = (this.sound.rightChannel1) ? (this.envelopeVolume | 0) : 0;
	this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel1Synth.prototype.outputLevelSecondaryCache = function () {
	if (this.Enabled) {
		this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
		this.currentSampleRightSecondary = this.currentSampleRight | 0;
	} else {
		this.currentSampleLeftSecondary = 0;
		this.currentSampleRightSecondary = 0;
	}
	this.outputLevelTrimaryCache();
}
GameBoyAdvanceChannel1Synth.prototype.outputLevelTrimaryCache = function () {
	if (this.CachedDuty[this.DutyTracker | 0]) {
		this.currentSampleLeftTrimary = this.currentSampleLeftSecondary | 0;
		this.currentSampleRightTrimary = this.currentSampleRightSecondary | 0;
	} else {
		this.currentSampleLeftTrimary = 0;
		this.currentSampleRightTrimary = 0;
	}
}
GameBoyAdvanceChannel1Synth.prototype.clockAudioSweep = function () {
	//Channel 1:
	if (!this.SweepFault && (this.timeSweep | 0) > 0) {
		this.timeSweep = ((this.timeSweep | 0) - 1) | 0
		if ((this.timeSweep | 0) == 0) {
			this.runAudioSweep();
		}
	}
}
GameBoyAdvanceChannel1Synth.prototype.runAudioSweep = function () {
	//Channel 1:
	if ((this.lastTimeSweep | 0) > 0) {
		if ((this.frequencySweepDivider | 0) > 0) {
			this.Swept = true;
			if (this.decreaseSweep) {
				this.ShadowFrequency = ((this.ShadowFrequency | 0) - (this.ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0;
				this.frequency = this.ShadowFrequency & 0x7FF;
				this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
			} else {
				this.ShadowFrequency = ((this.ShadowFrequency | 0) + (this.ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0;
				this.frequency = this.ShadowFrequency | 0;
				if ((this.ShadowFrequency | 0) <= 0x7FF) {
					this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
					//Run overflow check twice:
					if ((((this.ShadowFrequency | 0) + (this.ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0) > 0x7FF) {
						this.SweepFault = true;
						this.enableCheck();
						this.sound.unsetNR52(0xFE); //Channel #1 On Flag Off
					}
				} else {
					this.frequency &= 0x7FF;
					this.SweepFault = true;
					this.enableCheck();
					this.sound.unsetNR52(0xFE); //Channel #1 On Flag Off
				}
			}
			this.timeSweep = this.lastTimeSweep | 0;
		} else {
			//Channel has sweep disabled and timer becomes a length counter:
			this.SweepFault = true;
			this.enableCheck();
		}
	}
}
GameBoyAdvanceChannel1Synth.prototype.audioSweepPerformDummy = function () {
	//Channel 1:
	if ((this.frequencySweepDivider | 0) > 0) {
		if (!this.decreaseSweep) {
			var channel1ShadowFrequency = ((this.ShadowFrequency | 0) + (this.ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0;
			if ((channel1ShadowFrequency | 0) <= 0x7FF) {
				//Run overflow check twice:
				if ((((channel1ShadowFrequency | 0) + (channel1ShadowFrequency >> (this.frequencySweepDivider | 0))) | 0) > 0x7FF) {
					this.SweepFault = true;
					this.enableCheck();
					this.sound.unsetNR52(0xFE); //Channel #1 On Flag Off
				}
			} else {
				this.SweepFault = true;
				this.enableCheck();
				this.sound.unsetNR52(0xFE); //Channel #1 On Flag Off
			}
		}
	}
}
GameBoyAdvanceChannel1Synth.prototype.clockAudioEnvelope = function () {
	if ((this.envelopeSweepsLast | 0) > -1) {
		if ((this.envelopeSweeps | 0) > 0) {
			this.envelopeSweeps = ((this.envelopeSweeps | 0) - 1) | 0;
		} else {
			if (!this.envelopeType) {
				if ((this.envelopeVolume | 0) > 0) {
					this.envelopeVolume = ((this.envelopeVolume | 0) - 1) | 0;
					this.envelopeSweeps = this.envelopeSweepsLast | 0;
				} else {
					this.envelopeSweepsLast = -1;
				}
			} else if ((this.envelopeVolume | 0) < 0xF) {
				this.envelopeVolume = ((this.envelopeVolume | 0) + 1) | 0;
				this.envelopeSweeps = this.envelopeSweepsLast | 0;
			} else {
				this.envelopeSweepsLast = -1;
			}
		}
	}
}
GameBoyAdvanceChannel1Synth.prototype.computeAudioChannel = function () {
	if ((this.FrequencyCounter | 0) == 0) {
		this.FrequencyCounter = this.FrequencyTracker | 0;
		this.DutyTracker = ((this.DutyTracker | 0) + 1) & 0x7;
	}
}
GameBoyAdvanceChannel1Synth.prototype.readSOUND1CNT8_0 = function () {
	//NR10:
	return this.nr10 | 0;
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT8_0 = function (data) {
	data = data | 0;
	//NR10:
	if (this.decreaseSweep && (data & 0x08) == 0) {
		if (this.Swept) {
			this.SweepFault = true;
		}
	}
	this.lastTimeSweep = (data & 0x70) >> 4;
	this.frequencySweepDivider = data & 0x07;
	this.decreaseSweep = ((data & 0x08) != 0);
	this.nr10 = data & 0xFF;
	this.enableCheck();
}
GameBoyAdvanceChannel1Synth.prototype.readSOUND1CNT8_2 = function () {
	//NR11:
	return this.nr11 | 0;
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT8_2 = function (data) {
	data = data | 0;
	//NR11:
	this.CachedDuty = this.dutyLookup[(data >> 6) & 0x2];
	this.totalLength = (0x40 - (data & 0x3F)) | 0;
	this.nr11 = data & 0xFF;
	this.enableCheck();
}
GameBoyAdvanceChannel1Synth.prototype.readSOUND1CNT8_3 = function () {
	//NR12:
	return this.nr12 | 0;
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT8_3 = function (data) {
	data = data | 0;
	//NR12:
	this.envelopeType = ((data & 0x08) != 0);
	this.nr12 = data & 0xFF;
	this.volumeEnableCheck();
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT_X0 = function (data) {
	data = data | 0;
	//NR13:
	this.frequency = (this.frequency & 0x700) | data;
	this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
}
GameBoyAdvanceChannel1Synth.prototype.readSOUND1CNT_X = function () {
	//NR14:
	return this.nr14 | 0;
}
GameBoyAdvanceChannel1Synth.prototype.writeSOUND1CNT_X1 = function (data) {
	data = data | 0;
	//NR14:
	this.consecutive = ((data & 0x40) == 0);
	this.frequency = ((data & 0x7) << 8) | (this.frequency & 0xFF);
	this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
	if (data > 0x7F) {
		//Reload nr10:
		this.timeSweep = this.lastTimeSweep | 0;
		this.Swept = false;
		//Reload nr12:
		this.envelopeVolume = this.nr12 >> 4;
		this.envelopeSweepsLast = ((this.nr12 & 0x7) - 1) | 0;
		if ((this.totalLength | 0) == 0) {
			this.totalLength = 0x40;
		}
		if ((this.lastTimeSweep | 0) > 0 || (this.frequencySweepDivider | 0) > 0) {
			this.sound.setNR52(0x1);
		} else {
			this.sound.unsetNR52(0xFE);
		}
		if ((data & 0x40) != 0) {
			this.sound.setNR52(0x1);
		}
		this.ShadowFrequency = this.frequency | 0;
		//Reset frequency overflow check + frequency sweep type check:
		this.SweepFault = false;
		//Supposed to run immediately:
		this.audioSweepPerformDummy();
	}
	this.enableCheck();
	this.nr14 = data | 0;
}







"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceChannel2Synth(sound) {
	this.sound = sound;
	this.currentSampleLeft = 0;
	this.currentSampleLeftSecondary = 0;
	this.currentSampleLeftTrimary = 0;
	this.currentSampleRight = 0;
	this.currentSampleRightSecondary = 0;
	this.currentSampleRightTrimary = 0;
	this.CachedDuty = this.dutyLookup[0];
	this.totalLength = 0x40;
	this.envelopeVolume = 0;
	this.frequency = 0;
	this.FrequencyTracker = 0x8000;
	this.consecutive = true;
	this.ShadowFrequency = 0x8000;
	this.canPlay = false;
	this.Enabled = false;
	this.envelopeSweeps = 0;
	this.envelopeSweepsLast = -1;
	this.FrequencyCounter = 0;
	this.DutyTracker = 0;
	this.nr21 = 0;
	this.nr22 = 0;
	this.nr23 = 0;
	this.nr24 = 0;
}
GameBoyAdvanceChannel2Synth.prototype.dutyLookup = [
	[false, false, false, false, false, false, false, true],
	[true, false, false, false, false, false, false, true],
	[true, false, false, false, false, true, true, true],
	[false, true, true, true, true, true, true, false]
];
GameBoyAdvanceChannel2Synth.prototype.disabled = function () {
	//Clear NR21:
	this.nr21 = 0;
	this.CachedDuty = this.dutyLookup[0];
	this.totalLength = 0x40;
	//Clear NR22:
	this.nr22 = 0;
	this.envelopeVolume = 0;
	//Clear NR23:
	this.nr23 = 0;
	this.frequency = 0;
	this.FrequencyTracker = 0x8000;
	//Clear NR24:
	this.nr24 = 0;
	this.consecutive = true;
	this.canPlay = false;
	this.Enabled = false;
	this.envelopeSweeps = 0;
	this.envelopeSweepsLast = -1;
	this.FrequencyCounter = 0;
	this.DutyTracker = 0;
}
GameBoyAdvanceChannel2Synth.prototype.clockAudioLength = function () {
	if ((this.totalLength | 0) > 1) {
		this.totalLength = ((this.totalLength | 0) - 1) | 0;
	} else if ((this.totalLength | 0) == 1) {
		this.totalLength = 0;
		this.enableCheck();
		this.sound.unsetNR52(0xFD); //Channel #2 On Flag Off
	}
}
GameBoyAdvanceChannel2Synth.prototype.clockAudioEnvelope = function () {
	if ((this.envelopeSweepsLast | 0) > -1) {
		if ((this.envelopeSweeps | 0) > 0) {
			this.envelopeSweeps = ((this.envelopeSweeps | 0) - 1) | 0;
		} else {
			if (!this.envelopeType) {
				if ((this.envelopeVolume | 0) > 0) {
					this.envelopeVolume = ((this.envelopeVolume | 0) - 1) | 0;
					this.envelopeSweeps = this.envelopeSweepsLast | 0;
				} else {
					this.envelopeSweepsLast = -1;
				}
			} else if ((this.envelopeVolume | 0) < 0xF) {
				this.envelopeVolume = ((this.envelopeVolume | 0) + 1) | 0;
				this.envelopeSweeps = this.envelopeSweepsLast | 0;
			} else {
				this.envelopeSweepsLast = -1;
			}
		}
	}
}
GameBoyAdvanceChannel2Synth.prototype.computeAudioChannel = function () {
	if ((this.FrequencyCounter | 0) == 0) {
		this.FrequencyCounter = this.FrequencyTracker | 0;
		this.DutyTracker = ((this.DutyTracker | 0) + 1) & 0x7;
	}
}
GameBoyAdvanceChannel2Synth.prototype.enableCheck = function () {
	this.Enabled = ((this.consecutive || (this.totalLength | 0) > 0) && this.canPlay);
}
GameBoyAdvanceChannel2Synth.prototype.volumeEnableCheck = function () {
	this.canPlay = ((this.nr22 | 0) > 7);
	this.enableCheck();
}
GameBoyAdvanceChannel2Synth.prototype.outputLevelCache = function () {
	this.currentSampleLeft = (this.sound.leftChannel2) ? (this.envelopeVolume | 0) : 0;
	this.currentSampleRight = (this.sound.rightChannel2) ? (this.envelopeVolume | 0) : 0;
	this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel2Synth.prototype.outputLevelSecondaryCache = function () {
	if (this.Enabled) {
		this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
		this.currentSampleRightSecondary = this.currentSampleRight | 0;
	} else {
		this.currentSampleLeftSecondary = 0;
		this.currentSampleRightSecondary = 0;
	}
	this.outputLevelTrimaryCache();
}
GameBoyAdvanceChannel2Synth.prototype.outputLevelTrimaryCache = function () {
	if (this.CachedDuty[this.DutyTracker | 0]) {
		this.currentSampleLeftTrimary = this.currentSampleLeftSecondary | 0;
		this.currentSampleRightTrimary = this.currentSampleRightSecondary | 0;
	} else {
		this.currentSampleLeftTrimary = 0;
		this.currentSampleRightTrimary = 0;
	}
}
GameBoyAdvanceChannel2Synth.prototype.readSOUND2CNT_L0 = function () {
	//NR21:
	return this.nr21 | 0;
}
GameBoyAdvanceChannel2Synth.prototype.writeSOUND2CNT_L0 = function (data) {
	data = data | 0;
	//NR21:
	this.CachedDuty = this.dutyLookup[data >> 6];
	this.totalLength = (0x40 - (data & 0x3F)) | 0;
	this.nr21 = data | 0;
	this.enableCheck();
}
GameBoyAdvanceChannel2Synth.prototype.readSOUND2CNT_L1 = function () {
	//NR22:
	return this.nr22 | 0;
}
GameBoyAdvanceChannel2Synth.prototype.writeSOUND2CNT_L1 = function (data) {
	data = data | 0;
	//NR22:
	this.envelopeType = ((data & 0x08) != 0);
	this.nr22 = data | 0;
	this.volumeEnableCheck();
}
GameBoyAdvanceChannel2Synth.prototype.writeSOUND2CNT_H0 = function (data) {
	data = data | 0;
	//NR23:
	this.frequency = (this.frequency & 0x700) | data;
	this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
}
GameBoyAdvanceChannel2Synth.prototype.readSOUND2CNT_H = function () {
	//NR24:
	return this.nr24 | 0;
}
GameBoyAdvanceChannel2Synth.prototype.writeSOUND2CNT_H1 = function (data) {
	data = data | 0;
	//NR24:
	if (data > 0x7F) {
		//Reload nr22:
		this.envelopeVolume = this.nr22 >> 4;
		this.envelopeSweepsLast = ((this.nr22 & 0x7) - 1) | 0;
		if ((this.totalLength | 0) == 0) {
			this.totalLength = 0x40;
		}
		if ((data & 0x40) != 0) {
			this.sound.setNR52(0x2); //Channel #1 On Flag Off
		}
	}
	this.consecutive = ((data & 0x40) == 0x0);
	this.frequency = ((data & 0x7) << 8) | (this.frequency & 0xFF);
	this.FrequencyTracker = (0x800 - (this.frequency | 0)) << 4;
	this.nr24 = data | 0;
	this.enableCheck();
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceChannel3Synth(sound) {
	this.sound = sound;
	this.currentSampleLeft = 0;
	this.currentSampleLeftSecondary = 0;
	this.currentSampleRight = 0;
	this.currentSampleRightSecondary = 0;
	this.lastSampleLookup = 0;
	this.canPlay = false;
	this.WAVERAMBankSpecified = 0;
	this.WAVERAMBankAccessed = 0x20;
	this.WaveRAMBankSize = 0x1F;
	this.totalLength = 0x100;
	this.patternType = 4;
	this.frequency = 0;
	this.FrequencyPeriod = 0x4000;
	this.consecutive = true;
	this.Enabled = false;
	this.nr30 = 0;
	this.nr31 = 0;
	this.nr32 = 0;
	this.nr33 = 0;
	this.nr34 = 0;
	this.cachedSample = 0;
	this.PCM = getInt8Array(0x40);
	this.PCM16 = getUint16View(this.PCM);
	this.PCM32 = getInt32View(this.PCM);
	this.WAVERAM8 = getUint8Array(0x20);
	this.WAVERAM16 = getUint16View(this.WAVERAM8);
	this.WAVERAM32 = getInt32View(this.WAVERAM8);
}
GameBoyAdvanceChannel3Synth.prototype.disabled = function () {
	//Clear NR30:
	this.nr30 = 0;
	this.lastSampleLookup = 0;
	this.canPlay = false;
	this.WAVERAMBankSpecified = 0;
	this.WAVERAMBankAccessed = 0x20;
	this.WaveRAMBankSize = 0x1F;
	//Clear NR31:
	this.totalLength = 0x100;
	//Clear NR32:
	this.nr32 = 0;
	this.patternType = 4;
	//Clear NR33:
	this.nr33 = 0;
	this.frequency = 0;
	this.FrequencyPeriod = 0x4000;
	//Clear NR34:
	this.nr34 = 0;
	this.consecutive = true;
	this.Enabled = false;
	this.counter = 0;
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceChannel3Synth.prototype.updateCache = function () {
		if ((this.patternType | 0) != 3) {
			this.cachedSample = this.PCM[this.lastSampleLookup | 0] >> (this.patternType | 0);
		} else {
			this.cachedSample = Math.imul(this.PCM[this.lastSampleLookup | 0] | 0, 3) >> 2;
		}
		this.outputLevelCache();
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceChannel3Synth.prototype.updateCache = function () {
		if ((this.patternType | 0) != 3) {
			this.cachedSample = this.PCM[this.lastSampleLookup | 0] >> (this.patternType | 0);
		} else {
			this.cachedSample = (this.PCM[this.lastSampleLookup | 0] * 0.75) | 0;
		}
		this.outputLevelCache();
	}
}
GameBoyAdvanceChannel3Synth.prototype.outputLevelCache = function () {
	this.currentSampleLeft = (this.sound.leftChannel3) ? (this.cachedSample | 0) : 0;
	this.currentSampleRight = (this.sound.rightChannel3) ? (this.cachedSample | 0) : 0;
	this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel3Synth.prototype.outputLevelSecondaryCache = function () {
	if (this.Enabled) {
		this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
		this.currentSampleRightSecondary = this.currentSampleRight | 0;
	} else {
		this.currentSampleLeftSecondary = 0;
		this.currentSampleRightSecondary = 0;
	}
}
GameBoyAdvanceChannel3Synth.prototype.readWAVE8 = function (address) {
	address = ((address | 0) + (this.WAVERAMBankAccessed >> 1)) | 0;
	return this.WAVERAM8[address | 0] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceChannel3Synth.prototype.writeWAVE8 = function (address, data) {
		address = address | 0;
		data = data | 0;
		if (this.canPlay) {
			this.sound.audioJIT();
		}
		address = ((address | 0) + (this.WAVERAMBankAccessed >> 1)) | 0;
		this.WAVERAM8[address | 0] = data & 0xFF;
		var temp = ((data >> 4) & 0xF);
		temp = temp | ((data & 0xF) << 8);
		this.PCM16[address | 0] = temp | 0;
	}
	GameBoyAdvanceChannel3Synth.prototype.writeWAVE16 = function (address, data) {
		address = address | 0;
		data = data | 0;
		if (this.canPlay) {
			this.sound.audioJIT();
		}
		address = ((address | 0) + (this.WAVERAMBankAccessed >> 2)) | 0;
		this.WAVERAM16[address | 0] = data & 0xFFFF;
		var temp = ((data >> 4) & 0xF);
		temp = temp | ((data & 0xF) << 8);
		temp = temp | ((data & 0xF000) << 4);
		temp = temp | ((data & 0xF00) << 16);
		this.PCM32[address | 0] = temp | 0;
	}
	GameBoyAdvanceChannel3Synth.prototype.writeWAVE32 = function (address, data) {
		address = address | 0;
		data = data | 0;
		if (this.canPlay) {
			this.sound.audioJIT();
		}
		address = ((address | 0) + (this.WAVERAMBankAccessed >> 3)) | 0;
		this.WAVERAM32[address | 0] = data | 0;
		var temp = (data >> 4) & 0xF;
		temp = temp | ((data & 0xF) << 8);
		temp = temp | ((data & 0xF000) << 4);
		temp = temp | ((data & 0xF00) << 16);
		address = address << 1;
		this.PCM32[address | 0] = temp | 0;
		temp = (data >> 20) & 0xF;
		temp = temp | ((data >> 8) & 0xF00);
		temp = temp | ((data >> 12) & 0xF0000);
		temp = temp | (data & 0xF000000);
		this.PCM32[address | 1] = temp | 0;
	}
	GameBoyAdvanceChannel3Synth.prototype.readWAVE16 = function (address) {
		address = ((address | 0) + (this.WAVERAMBankAccessed >> 2)) | 0;
		return this.WAVERAM16[address | 0] | 0;
	}
	GameBoyAdvanceChannel3Synth.prototype.readWAVE32 = function (address) {
		address = ((address | 0) + (this.WAVERAMBankAccessed >> 3)) | 0;
		return this.WAVERAM32[address | 0] | 0;
	}
} else {
	GameBoyAdvanceChannel3Synth.prototype.writeWAVE8 = function (address, data) {
		if (this.canPlay) {
			this.sound.audioJIT();
		}
		address += this.WAVERAMBankAccessed >> 1;
		this.WAVERAM8[address] = data & 0xFF;
		address <<= 1;
		this.PCM[address] = (data >> 4) & 0xF;
		this.PCM[address | 1] = data & 0xF;
	}
	GameBoyAdvanceChannel3Synth.prototype.writeWAVE16 = function (address, data) {
		if (this.canPlay) {
			this.sound.audioJIT();
		}
		address += this.WAVERAMBankAccessed >> 2;
		address <<= 1;
		this.WAVERAM8[address] = data & 0xFF;
		this.WAVERAM8[address | 1] = (data >> 8) & 0xFF;
		address <<= 1;
		this.PCM[address] = (data >> 4) & 0xF;
		this.PCM[address | 1] = data & 0xF;
		this.PCM[address | 2] = (data >> 12) & 0xF;
		this.PCM[address | 3] = (data >> 8) & 0xF;
	}
	GameBoyAdvanceChannel3Synth.prototype.writeWAVE32 = function (address, data) {
		if (this.canPlay) {
			this.sound.audioJIT();
		}
		address += this.WAVERAMBankAccessed >> 3;
		address <<= 2;
		this.WAVERAM8[address] = data & 0xFF;
		this.WAVERAM8[address | 1] = (data >> 8) & 0xFF;
		this.WAVERAM8[address | 2] = (data >> 16) & 0xFF;
		this.WAVERAM8[address | 3] = data >>> 24;
		address <<= 1;
		this.PCM[address] = (data >> 4) & 0xF;
		this.PCM[address | 1] = data & 0xF;
		this.PCM[address | 2] = (data >> 12) & 0xF;
		this.PCM[address | 3] = (data >> 8) & 0xF;
		this.PCM[address | 4] = (data >> 20) & 0xF;
		this.PCM[address | 5] = (data >> 16) & 0xF;
		this.PCM[address | 6] = data >>> 28;
		this.PCM[address | 7] = (data >> 24) & 0xF;
	}
	GameBoyAdvanceChannel3Synth.prototype.readWAVE16 = function (address) {
		address += this.WAVERAMBankAccessed >> 1;
		return (this.WAVERAM8[address] | (this.WAVERAM8[address | 1] << 8));
	}
	GameBoyAdvanceChannel3Synth.prototype.readWAVE32 = function (address) {
		address += this.WAVERAMBankAccessed >> 1;
		return (this.WAVERAM8[address] | (this.WAVERAM8[address | 1] << 8) |
			(this.WAVERAM8[address | 2] << 16) | (this.WAVERAM8[address | 3] << 24));
	}
}
GameBoyAdvanceChannel3Synth.prototype.enableCheck = function () {
	this.Enabled = ( /*this.canPlay && */ (this.consecutive || (this.totalLength | 0) > 0));
}
GameBoyAdvanceChannel3Synth.prototype.clockAudioLength = function () {
	if ((this.totalLength | 0) > 1) {
		this.totalLength = ((this.totalLength | 0) - 1) | 0;
	} else if ((this.totalLength | 0) == 1) {
		this.totalLength = 0;
		this.enableCheck();
		this.sound.unsetNR52(0xFB); //Channel #3 On Flag Off
	}
}
GameBoyAdvanceChannel3Synth.prototype.computeAudioChannel = function () {
	if ((this.counter | 0) == 0) {
		if (this.canPlay) {
			this.lastSampleLookup = (((this.lastSampleLookup | 0) + 1) & this.WaveRAMBankSize) | this.WAVERAMBankSpecified;
		}
		this.counter = this.FrequencyPeriod | 0;
	}
}

GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_L = function () {
	//NR30:
	return this.nr30 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_L = function (data) {
	data = data | 0;
	//NR30:
	if (!this.canPlay && (data | 0) >= 0x80) {
		this.lastSampleLookup = 0;
	}
	this.canPlay = (data > 0x7F);
	this.WaveRAMBankSize = (data & 0x20) | 0x1F;
	this.WAVERAMBankSpecified = ((data & 0x40) >> 1) ^ (data & 0x20);
	this.WAVERAMBankAccessed = ((data & 0x40) >> 1) ^ 0x20;
	if (this.canPlay && (this.nr30 | 0) > 0x7F && !this.consecutive) {
		this.sound.setNR52(0x4);
	}
	this.nr30 = data | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_H0 = function (data) {
	data = data | 0;
	//NR31:
	this.totalLength = (0x100 - (data | 0)) | 0;
	this.enableCheck();
}
GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_H = function () {
	//NR32:
	return this.nr32 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_H1 = function (data) {
	data = data | 0;
	//NR32:
	switch (data >> 5) {
		case 0:
			this.patternType = 4;
			break;
		case 1:
			this.patternType = 0;
			break;
		case 2:
			this.patternType = 1;
			break;
		case 3:
			this.patternType = 2;
			break;
		default:
			this.patternType = 3;
	}
	this.nr32 = data | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_X0 = function (data) {
	data = data | 0;
	//NR33:
	this.frequency = (this.frequency & 0x700) | data;
	this.FrequencyPeriod = (0x800 - (this.frequency | 0)) << 3;
}
GameBoyAdvanceChannel3Synth.prototype.readSOUND3CNT_X = function () {
	//NR34:
	return this.nr34 | 0;
}
GameBoyAdvanceChannel3Synth.prototype.writeSOUND3CNT_X1 = function (data) {
	data = data | 0;
	//NR34:
	if ((data | 0) > 0x7F) {
		if ((this.totalLength | 0) == 0) {
			this.totalLength = 0x100;
		}
		this.lastSampleLookup = 0;
		if ((data & 0x40) != 0) {
			this.sound.setNR52(0x4);
		}
	}
	this.consecutive = ((data & 0x40) == 0x0);
	this.frequency = ((data & 0x7) << 8) | (this.frequency & 0xFF);
	this.FrequencyPeriod = (0x800 - (this.frequency | 0)) << 3;
	this.enableCheck();
	this.nr34 = data | 0;
}








"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceChannel4Synth(sound) {
	this.sound = sound;
	this.currentSampleLeft = 0;
	this.currentSampleLeftSecondary = 0;
	this.currentSampleRight = 0;
	this.currentSampleRightSecondary = 0;
	this.totalLength = 0x40;
	this.envelopeVolume = 0;
	this.FrequencyPeriod = 32;
	this.lastSampleLookup = 0;
	this.BitRange = 0x7FFF;
	this.VolumeShifter = 15;
	this.currentVolume = 0;
	this.consecutive = true;
	this.envelopeSweeps = 0;
	this.envelopeSweepsLast = -1;
	this.canPlay = false;
	this.Enabled = false;
	this.counter = 0;
	this.nr42 = 0;
	this.nr43 = 0;
	this.nr44 = 0;
	this.cachedSample = 0;
	this.intializeWhiteNoise();
	this.noiseSampleTable = this.LSFR15Table;
}
GameBoyAdvanceChannel4Synth.prototype.intializeWhiteNoise = function () {
	//Noise Sample Tables:
	var randomFactor = 1;
	//15-bit LSFR Cache Generation:
	this.LSFR15Table = getInt8Array(0x80000);
	var LSFR = 0x7FFF; //Seed value has all its bits set.
	var LSFRShifted = 0x3FFF;
	for (var index = 0; index < 0x8000; ++index) {
		//Normalize the last LSFR value for usage:
		randomFactor = 1 - (LSFR & 1); //Docs say it's the inverse.
		//Cache the different volume level results:
		this.LSFR15Table[0x08000 | index] = randomFactor;
		this.LSFR15Table[0x10000 | index] = randomFactor * 0x2;
		this.LSFR15Table[0x18000 | index] = randomFactor * 0x3;
		this.LSFR15Table[0x20000 | index] = randomFactor * 0x4;
		this.LSFR15Table[0x28000 | index] = randomFactor * 0x5;
		this.LSFR15Table[0x30000 | index] = randomFactor * 0x6;
		this.LSFR15Table[0x38000 | index] = randomFactor * 0x7;
		this.LSFR15Table[0x40000 | index] = randomFactor * 0x8;
		this.LSFR15Table[0x48000 | index] = randomFactor * 0x9;
		this.LSFR15Table[0x50000 | index] = randomFactor * 0xA;
		this.LSFR15Table[0x58000 | index] = randomFactor * 0xB;
		this.LSFR15Table[0x60000 | index] = randomFactor * 0xC;
		this.LSFR15Table[0x68000 | index] = randomFactor * 0xD;
		this.LSFR15Table[0x70000 | index] = randomFactor * 0xE;
		this.LSFR15Table[0x78000 | index] = randomFactor * 0xF;
		//Recompute the LSFR algorithm:
		LSFRShifted = LSFR >> 1;
		LSFR = LSFRShifted | (((LSFRShifted ^ LSFR) & 0x1) << 14);
	}
	//7-bit LSFR Cache Generation:
	this.LSFR7Table = getInt8Array(0x800);
	LSFR = 0x7F; //Seed value has all its bits set.
	for (index = 0; index < 0x80; ++index) {
		//Normalize the last LSFR value for usage:
		randomFactor = 1 - (LSFR & 1); //Docs say it's the inverse.
		//Cache the different volume level results:
		this.LSFR7Table[0x080 | index] = randomFactor;
		this.LSFR7Table[0x100 | index] = randomFactor * 0x2;
		this.LSFR7Table[0x180 | index] = randomFactor * 0x3;
		this.LSFR7Table[0x200 | index] = randomFactor * 0x4;
		this.LSFR7Table[0x280 | index] = randomFactor * 0x5;
		this.LSFR7Table[0x300 | index] = randomFactor * 0x6;
		this.LSFR7Table[0x380 | index] = randomFactor * 0x7;
		this.LSFR7Table[0x400 | index] = randomFactor * 0x8;
		this.LSFR7Table[0x480 | index] = randomFactor * 0x9;
		this.LSFR7Table[0x500 | index] = randomFactor * 0xA;
		this.LSFR7Table[0x580 | index] = randomFactor * 0xB;
		this.LSFR7Table[0x600 | index] = randomFactor * 0xC;
		this.LSFR7Table[0x680 | index] = randomFactor * 0xD;
		this.LSFR7Table[0x700 | index] = randomFactor * 0xE;
		this.LSFR7Table[0x780 | index] = randomFactor * 0xF;
		//Recompute the LSFR algorithm:
		LSFRShifted = LSFR >> 1;
		LSFR = LSFRShifted | (((LSFRShifted ^ LSFR) & 0x1) << 6);
	}
}
GameBoyAdvanceChannel4Synth.prototype.disabled = function () {
	//Clear NR41:
	this.totalLength = 0x40;
	//Clear NR42:
	this.nr42 = 0;
	this.envelopeVolume = 0;
	//Clear NR43:
	this.nr43 = 0;
	this.FrequencyPeriod = 32;
	this.lastSampleLookup = 0;
	this.BitRange = 0x7FFF;
	this.VolumeShifter = 15;
	this.currentVolume = 0;
	this.noiseSampleTable = this.LSFR15Table;
	//Clear NR44:
	this.nr44 = 0;
	this.consecutive = true;
	this.envelopeSweeps = 0;
	this.envelopeSweepsLast = -1;
	this.canPlay = false;
	this.Enabled = false;
	this.counter = 0;
}
GameBoyAdvanceChannel4Synth.prototype.clockAudioLength = function () {
	if ((this.totalLength | 0) > 1) {
		this.totalLength = ((this.totalLength | 0) - 1) | 0;
	} else if ((this.totalLength | 0) == 1) {
		this.totalLength = 0;
		this.enableCheck();
		this.sound.unsetNR52(0xF7); //Channel #4 On Flag Off
	}
}
GameBoyAdvanceChannel4Synth.prototype.clockAudioEnvelope = function () {
	if ((this.envelopeSweepsLast | 0) > -1) {
		if ((this.envelopeSweeps | 0) > 0) {
			this.envelopeSweeps = ((this.envelopeSweeps | 0) - 1) | 0;
		} else {
			if (!this.envelopeType) {
				if ((this.envelopeVolume | 0) > 0) {
					this.envelopeVolume = ((this.envelopeVolume | 0) - 1) | 0;
					this.currentVolume = (this.envelopeVolume | 0) << (this.VolumeShifter | 0);
					this.envelopeSweeps = this.envelopeSweepsLast | 0;
				} else {
					this.envelopeSweepsLast = -1;
				}
			} else if ((this.envelopeVolume | 0) < 0xF) {
				this.envelopeVolume = ((this.envelopeVolume | 0) + 1) | 0;
				this.currentVolume = (this.envelopeVolume | 0) << (this.VolumeShifter | 0);
				this.envelopeSweeps = this.envelopeSweepsLast | 0;
			} else {
				this.envelopeSweepsLast = -1;
			}
		}
	}
}
GameBoyAdvanceChannel4Synth.prototype.computeAudioChannel = function () {
	if ((this.counter | 0) == 0) {
		this.lastSampleLookup = ((this.lastSampleLookup | 0) + 1) & this.BitRange;
		this.counter = this.FrequencyPeriod | 0;
	}
}
GameBoyAdvanceChannel4Synth.prototype.enableCheck = function () {
	this.Enabled = ((this.consecutive || (this.totalLength | 0) > 0) && this.canPlay);
}
GameBoyAdvanceChannel4Synth.prototype.volumeEnableCheck = function () {
	this.canPlay = ((this.nr42 | 0) > 7);
	this.enableCheck();
}
GameBoyAdvanceChannel4Synth.prototype.outputLevelCache = function () {
	this.currentSampleLeft = (this.sound.leftChannel4) ? (this.cachedSample | 0) : 0;
	this.currentSampleRight = (this.sound.rightChannel4) ? (this.cachedSample | 0) : 0;
	this.outputLevelSecondaryCache();
}
GameBoyAdvanceChannel4Synth.prototype.outputLevelSecondaryCache = function () {
	if (this.Enabled) {
		this.currentSampleLeftSecondary = this.currentSampleLeft | 0;
		this.currentSampleRightSecondary = this.currentSampleRight | 0;
	} else {
		this.currentSampleLeftSecondary = 0;
		this.currentSampleRightSecondary = 0;
	}
}
GameBoyAdvanceChannel4Synth.prototype.updateCache = function () {
	this.cachedSample = this.noiseSampleTable[this.currentVolume | this.lastSampleLookup] | 0;
	this.outputLevelCache();
}
GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_L0 = function (data) {
	data = data | 0;
	//NR41:
	this.totalLength = (0x40 - (data & 0x3F)) | 0;
	this.enableCheck();
}
GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_L1 = function (data) {
	data = data | 0;
	//NR42:
	this.envelopeType = ((data & 0x08) != 0);
	this.nr42 = data | 0;
	this.volumeEnableCheck();
}
GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_L = function () {
	//NR42:
	return this.nr42 | 0;
}
GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_H0 = function (data) {
	data = data | 0;
	//NR43:
	this.FrequencyPeriod = Math.max((data & 0x7) << 4, 8) << (((data >> 4) + 2) | 0);
	var bitWidth = data & 0x8;
	if (((bitWidth | 0) == 0x8 && (this.BitRange | 0) == 0x7FFF) || ((bitWidth | 0) == 0 && (this.BitRange | 0) == 0x7F)) {
		this.lastSampleLookup = 0;
		this.BitRange = ((bitWidth | 0) == 0x8) ? 0x7F : 0x7FFF;
		this.VolumeShifter = ((bitWidth | 0) == 0x8) ? 7 : 15;
		this.currentVolume = this.envelopeVolume << (this.VolumeShifter | 0);
		this.noiseSampleTable = ((bitWidth | 0) == 0x8) ? this.LSFR7Table : this.LSFR15Table;
	}
	this.nr43 = data | 0;
}
GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_H0 = function () {
	//NR43:
	return this.nr43 | 0;
}
GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_H1 = function (data) {
	data = data | 0;
	//NR44:
	this.nr44 = data | 0;
	this.consecutive = ((data & 0x40) == 0x0);
	if ((data | 0) > 0x7F) {
		this.envelopeVolume = this.nr42 >> 4;
		this.currentVolume = this.envelopeVolume << (this.VolumeShifter | 0);
		this.envelopeSweepsLast = ((this.nr42 & 0x7) - 1) | 0;
		if ((this.totalLength | 0) == 0) {
			this.totalLength = 0x40;
		}
		if ((data & 0x40) != 0) {
			this.sound.setNR52(0x8);
		}
	}
	this.enableCheck();
}
GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_H1 = function () {
	//NR44:
	return this.nr44 | 0;
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceFIFO() {
	this.count = 0;
	this.position = 0;
	this.buffer = getInt8Array(0x20);
}
GameBoyAdvanceFIFO.prototype.push = function (sample) {
	sample = sample | 0;
	var writePosition = ((this.position | 0) + (this.count | 0)) | 0;
	this.buffer[writePosition & 0x1F] = (sample << 24) >> 24;
	if ((this.count | 0) < 0x20) {
		//Should we cap at 0x20 or overflow back to 0 and reset queue?
		this.count = ((this.count | 0) + 1) | 0;
	}
}
GameBoyAdvanceFIFO.prototype.push8 = function (sample) {
	sample = sample | 0;
	this.push(sample | 0);
	this.push(sample | 0);
	this.push(sample | 0);
	this.push(sample | 0);
}
GameBoyAdvanceFIFO.prototype.push16 = function (sample) {
	sample = sample | 0;
	this.push(sample | 0);
	this.push(sample >> 8);
	this.push(sample | 0);
	this.push(sample >> 8);
}
GameBoyAdvanceFIFO.prototype.push32 = function (sample) {
	sample = sample | 0;
	this.push(sample | 0);
	this.push(sample >> 8);
	this.push(sample >> 16);
	this.push(sample >> 24);
}
GameBoyAdvanceFIFO.prototype.shift = function () {
	var output = 0;
	if ((this.count | 0) > 0) {
		this.count = ((this.count | 0) - 1) | 0;
		output = this.buffer[this.position & 0x1F] << 3;
		this.position = ((this.position | 0) + 1) & 0x1F;
	}
	return output | 0;
}
GameBoyAdvanceFIFO.prototype.requestingDMA = function () {
	return ((this.count | 0) <= 0x10);
}
GameBoyAdvanceFIFO.prototype.samplesUntilDMATrigger = function () {
	return ((this.count | 0) - 0x10) | 0;
}
GameBoyAdvanceFIFO.prototype.clear = function () {
	this.count = 0;
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function ARMInstructionSet(CPUCore) {
	this.CPUCore = CPUCore;
	this.initialize();
}
ARMInstructionSet.prototype.initialize = function () {
	this.wait = this.CPUCore.wait;
	this.registers = this.CPUCore.registers;
	this.registersUSR = this.CPUCore.registersUSR;
	this.branchFlags = this.CPUCore.branchFlags;
	this.fetch = 0;
	this.decode = 0;
	this.execute = 0;
	this.memory = this.CPUCore.memory;
}
ARMInstructionSet.prototype.executeIteration = function () {
	//Push the new fetch access:
	this.fetch = this.memory.memoryReadCPU32(this.readPC() | 0) | 0;
	//Execute Conditional Instruction:
	this.executeConditionalCode();
	//Update the pipelining state:
	this.execute = this.decode | 0;
	this.decode = this.fetch | 0;
}
ARMInstructionSet.prototype.executeConditionalCode = function () {
	//LSB of condition code is used to reverse the test logic:
	if (((this.execute << 3) ^ this.branchFlags.checkConditionalCode(this.execute | 0)) >= 0) {
		//Passed the condition code test, so execute:
		this.executeDecoded();
	} else {
		//Increment the program counter if we failed the test:
		this.incrementProgramCounter();
	}
}

ARMInstructionSet.prototype.executeBubble = function () {
	//Push the new fetch access:
	this.fetch = this.memory.memoryReadCPU32(this.readPC() | 0) | 0;
	//Update the Program Counter:
	this.incrementProgramCounter();
	//Update the pipelining state:
	this.execute = this.decode | 0;
	this.decode = this.fetch | 0;
}
ARMInstructionSet.prototype.incrementProgramCounter = function () {
	//Increment The Program Counter:
	this.registers[15] = ((this.registers[15] | 0) + 4) | 0;
}
ARMInstructionSet.prototype.getLR = function () {
	return ((this.readPC() | 0) - 4) | 0;
}
ARMInstructionSet.prototype.getIRQLR = function () {
	return this.getLR() | 0;
}
ARMInstructionSet.prototype.getCurrentFetchValue = function () {
	return this.fetch | 0;
}
ARMInstructionSet.prototype.getSWICode = function () {
	return (this.execute >> 16) & 0xFF;
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	ARMInstructionSet.prototype.getPopCount = function () {
		var temp = this.execute & 0xFFFF;
		temp = ((temp | 0) - ((temp >> 1) & 0x55555555)) | 0;
		temp = ((temp & 0x33333333) + ((temp >> 2) & 0x33333333)) | 0;
		temp = (((temp | 0) + (temp >> 4)) & 0xF0F0F0F) | 0;
		temp = Math.imul(temp | 0, 0x1010101) >> 24;
		return temp | 0;
	}
} else {
	//Math.imul not found, use the compatibility method:
	ARMInstructionSet.prototype.getPopCount = function () {
		var temp = this.execute & 0xFFFF;
		temp = ((temp | 0) - ((temp >> 1) & 0x55555555)) | 0;
		temp = ((temp & 0x33333333) + ((temp >> 2) & 0x33333333)) | 0;
		temp = (((temp | 0) + (temp >> 4)) & 0xF0F0F0F) | 0;
		temp = (temp * 0x1010101) >> 24;
		return temp | 0;
	}
}
ARMInstructionSet.prototype.getNegativeOffsetStartAddress = function (currentAddress) {
	//Used for LDMD/STMD:
	currentAddress = currentAddress | 0;
	var offset = this.getPopCount() << 2;
	currentAddress = ((currentAddress | 0) - (offset | 0)) | 0;
	return currentAddress | 0;
}
ARMInstructionSet.prototype.getPositiveOffsetStartAddress = function (currentAddress) {
	//Used for LDMD/STMD:
	currentAddress = currentAddress | 0;
	var offset = this.getPopCount() << 2;
	currentAddress = ((currentAddress | 0) + (offset | 0)) | 0;
	return currentAddress | 0;
}
ARMInstructionSet.prototype.writeRegister = function (address, data) {
	//Unguarded non-pc register write:
	address = address | 0;
	data = data | 0;
	this.registers[address & 0xF] = data | 0;
}
ARMInstructionSet.prototype.writeUserRegister = function (address, data) {
	//Unguarded non-pc user mode register write:
	address = address | 0;
	data = data | 0;
	this.registersUSR[address & 0x7] = data | 0;
}
ARMInstructionSet.prototype.guardRegisterWrite = function (address, data) {
	//Guarded register write:
	address = address | 0;
	data = data | 0;
	if ((address | 0) < 0xF) {
		//Non-PC Write:
		this.writeRegister(address | 0, data | 0);
	} else {
		//We performed a branch:
		this.CPUCore.branch(data & -4);
	}
}
ARMInstructionSet.prototype.multiplyGuard12OffsetRegisterWrite = function (data) {
	//Writes to R15 ignored in the multiply instruction!
	data = data | 0;
	var address = (this.execute >> 0xC) & 0xF;
	if ((address | 0) != 0xF) {
		this.writeRegister(address | 0, data | 0);
	}
}
ARMInstructionSet.prototype.multiplyGuard16OffsetRegisterWrite = function (data) {
	//Writes to R15 ignored in the multiply instruction!
	data = data | 0;
	var address = (this.execute >> 0x10) & 0xF;
	this.incrementProgramCounter();
	if ((address | 0) != 0xF) {
		this.writeRegister(address | 0, data | 0);
	}
}
ARMInstructionSet.prototype.performMUL32 = function () {
	var result = 0;
	if (((this.execute >> 16) & 0xF) != (this.execute & 0xF)) {
		/*
		 http://www.chiark.greenend.org.uk/~theom/riscos/docs/ultimate/a252armc.txt

		 Due to the way that Booth's algorithm has been implemented, certain
		 combinations of operand registers should be avoided. (The assembler will
		 issue a warning if these restrictions are overlooked.)
		 The destination register (Rd) should not be the same as the Rm operand
		 register, as Rd is used to hold intermediate values and Rm is used
		 repeatedly during the multiply. A MUL will give a zero result if Rm=Rd, and
		 a MLA will give a meaningless result.
		 */
		result = this.CPUCore.performMUL32(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0) | 0;
	}
	return result | 0;
}
ARMInstructionSet.prototype.performMUL32MLA = function () {
	var result = 0;
	if (((this.execute >> 16) & 0xF) != (this.execute & 0xF)) {
		/*
		 http://www.chiark.greenend.org.uk/~theom/riscos/docs/ultimate/a252armc.txt

		 Due to the way that Booth's algorithm has been implemented, certain
		 combinations of operand registers should be avoided. (The assembler will
		 issue a warning if these restrictions are overlooked.)
		 The destination register (Rd) should not be the same as the Rm operand
		 register, as Rd is used to hold intermediate values and Rm is used
		 repeatedly during the multiply. A MUL will give a zero result if Rm=Rd, and
		 a MLA will give a meaningless result.
		 */
		result = this.CPUCore.performMUL32MLA(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0) | 0;
	}
	return result | 0;
}
ARMInstructionSet.prototype.guard12OffsetRegisterWrite = function (data) {
	data = data | 0;
	this.incrementProgramCounter();
	this.guard12OffsetRegisterWrite2(data | 0);
}
ARMInstructionSet.prototype.guard12OffsetRegisterWrite2 = function (data) {
	data = data | 0;
	this.guardRegisterWrite((this.execute >> 0xC) & 0xF, data | 0);
}
ARMInstructionSet.prototype.guard16OffsetRegisterWrite = function (data) {
	data = data | 0;
	this.guardRegisterWrite((this.execute >> 0x10) & 0xF, data | 0);
}
ARMInstructionSet.prototype.guardProgramCounterRegisterWriteCPSR = function (data) {
	data = data | 0;
	//Restore SPSR to CPSR:
	data = data & (-4 >> (this.CPUCore.SPSRtoCPSR() >> 5));
	//We performed a branch:
	this.CPUCore.branch(data | 0);
}
ARMInstructionSet.prototype.guardRegisterWriteCPSR = function (address, data) {
	//Guard for possible pc write with cpsr update:
	address = address | 0;
	data = data | 0;
	if ((address | 0) < 0xF) {
		//Non-PC Write:
		this.writeRegister(address | 0, data | 0);
	} else {
		//Restore SPSR to CPSR:
		this.guardProgramCounterRegisterWriteCPSR(data | 0);
	}
}
ARMInstructionSet.prototype.guard12OffsetRegisterWriteCPSR = function (data) {
	data = data | 0;
	this.incrementProgramCounter();
	this.guard12OffsetRegisterWriteCPSR2(data | 0);
}
ARMInstructionSet.prototype.guard12OffsetRegisterWriteCPSR2 = function (data) {
	data = data | 0;
	this.guardRegisterWriteCPSR((this.execute >> 0xC) & 0xF, data | 0);
}
ARMInstructionSet.prototype.guard16OffsetRegisterWriteCPSR = function (data) {
	data = data | 0;
	this.guardRegisterWriteCPSR((this.execute >> 0x10) & 0xF, data | 0);
}
ARMInstructionSet.prototype.guardUserRegisterWrite = function (address, data) {
	//Guard only on user access, not PC!:
	address = address | 0;
	data = data | 0;
	switch (this.CPUCore.modeFlags & 0x1f) {
		case 0x10:
		case 0x1F:
			this.writeRegister(address | 0, data | 0);
			break;
		case 0x11:
			if ((address | 0) < 8) {
				this.writeRegister(address | 0, data | 0);
			} else {
				//User-Mode Register Write Inside Non-User-Mode:
				this.writeUserRegister(address | 0, data | 0);
			}
			break;
		default:
			if ((address | 0) < 13) {
				this.writeRegister(address | 0, data | 0);
			} else {
				//User-Mode Register Write Inside Non-User-Mode:
				this.writeUserRegister(address | 0, data | 0);
			}
	}
}
ARMInstructionSet.prototype.guardRegisterWriteLDM = function (address, data) {
	//Proxy guarded register write for LDM:
	address = address | 0;
	data = data | 0;
	this.guardRegisterWrite(address | 0, data | 0);
}
ARMInstructionSet.prototype.guardUserRegisterWriteLDM = function (address, data) {
	//Proxy guarded user mode register write with PC guard for LDM:
	address = address | 0;
	data = data | 0;
	if ((address | 0) < 0xF) {
		if ((this.execute & 0x8000) != 0) {
			//PC is in the list, don't do user-mode:
			this.writeRegister(address | 0, data | 0);
		} else {
			//PC isn't in the list, do user-mode:
			this.guardUserRegisterWrite(address | 0, data | 0);
		}
	} else {
		this.guardProgramCounterRegisterWriteCPSR(data | 0);
	}
}
ARMInstructionSet.prototype.baseRegisterWrite = function (data, userMode) {
	//Update writeback for offset+base modes:
	data = data | 0;
	userMode = userMode | 0;
	var address = (this.execute >> 16) & 0xF;
	if ((address | userMode) == 0xF) {
		this.guardRegisterWrite(address | 0, data | 0);
	} else {
		this.guardUserRegisterWrite(address | 0, data | 0);
	}
}
ARMInstructionSet.prototype.readPC = function () {
	//PC register read:
	return this.registers[0xF] | 0;
}
ARMInstructionSet.prototype.readRegister = function (address) {
	//Unguarded register read:
	address = address | 0;
	return this.registers[address & 0xF] | 0;
}
ARMInstructionSet.prototype.readUserRegister = function (address) {
	//Unguarded user mode register read:
	address = address | 0;
	return this.registersUSR[address & 0x7] | 0;
}
ARMInstructionSet.prototype.read0OffsetRegister = function () {
	//Unguarded register read at position 0:
	return this.readRegister(this.execute | 0) | 0;
}
ARMInstructionSet.prototype.read8OffsetRegister = function () {
	//Unguarded register read at position 0x8:
	return this.readRegister(this.execute >> 0x8) | 0;
}
ARMInstructionSet.prototype.read12OffsetRegister = function () {
	//Unguarded register read at position 0xC:
	return this.readRegister(this.execute >> 0xC) | 0;
}
ARMInstructionSet.prototype.read16OffsetRegister = function () {
	//Unguarded register read at position 0x10:
	return this.readRegister(this.execute >> 0x10) | 0;
}
ARMInstructionSet.prototype.guard12OffsetRegisterRead = function () {
	this.incrementProgramCounter();
	return this.readRegister((this.execute >> 12) & 0xF) | 0;
}
ARMInstructionSet.prototype.guardUserRegisterRead = function (address) {
	//Guard only on user access, not PC!:
	address = address | 0;
	switch (this.CPUCore.modeFlags & 0x1f) {
		case 0x10:
		case 0x1F:
			return this.readRegister(address | 0) | 0;
		case 0x11:
			if ((address | 0) < 8) {
				return this.readRegister(address | 0) | 0;
			} else {
				//User-Mode Register Read Inside Non-User-Mode:
				return this.readUserRegister(address | 0) | 0;
			}
			break;
		default:
			if ((address | 0) < 13) {
				return this.readRegister(address | 0) | 0;
			} else {
				//User-Mode Register Read Inside Non-User-Mode:
				return this.readUserRegister(address | 0) | 0;
			}
	}
}
ARMInstructionSet.prototype.guardUserRegisterReadSTM = function (address) {
	//Proxy guarded user mode read (used by STM*):
	address = address | 0;
	if ((address | 0) < 0xF) {
		return this.guardUserRegisterRead(address | 0) | 0;
	} else {
		//Get Special Case PC Read:
		return this.readPC() | 0;
	}
}
ARMInstructionSet.prototype.baseRegisterRead = function (userMode) {
	//Read specially for offset+base modes:
	userMode = userMode | 0;
	var address = (this.execute >> 16) & 0xF;
	if ((address | userMode) == 0xF) {
		return this.readRegister(address | 0) | 0;
	} else {
		return this.guardUserRegisterRead(address | 0) | 0;
	}
}
ARMInstructionSet.prototype.BX = function () {
	//Branch & eXchange:
	var address = this.read0OffsetRegister() | 0;
	if ((address & 0x1) == 0) {
		//Stay in ARM mode:
		this.CPUCore.branch(address & -4);
	} else {
		//Enter THUMB mode:
		this.CPUCore.enterTHUMB();
		this.CPUCore.branch(address & -2);
	}
}
ARMInstructionSet.prototype.B = function () {
	//Branch:
	this.CPUCore.branch(((this.readPC() | 0) + ((this.execute << 8) >> 6)) | 0);
}
ARMInstructionSet.prototype.BL = function () {
	//Branch with Link:
	this.writeRegister(0xE, this.getLR() | 0);
	this.B();
}
ARMInstructionSet.prototype.AND = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform bitwise AND:
	//Update destination register:
	this.guard12OffsetRegisterWrite(operand1 & operand2);
}
ARMInstructionSet.prototype.AND2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform bitwise AND:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(operand1 & operand2);
}
ARMInstructionSet.prototype.ANDS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing2() | 0;
	//Perform bitwise AND:
	var result = operand1 & operand2;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR(result | 0);
}
ARMInstructionSet.prototype.ANDS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing4() | 0;
	//Perform bitwise AND:
	var result = operand1 & operand2;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR2(result | 0);
}
ARMInstructionSet.prototype.EOR = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform bitwise EOR:
	//Update destination register:
	this.guard12OffsetRegisterWrite(operand1 ^ operand2);
}
ARMInstructionSet.prototype.EOR2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform bitwise EOR:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(operand1 ^ operand2);
}
ARMInstructionSet.prototype.EORS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing2() | 0;
	//Perform bitwise EOR:
	var result = operand1 ^ operand2;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR(result | 0);
}
ARMInstructionSet.prototype.EORS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing4() | 0;
	//Perform bitwise EOR:
	var result = operand1 ^ operand2;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR2(result | 0);
}
ARMInstructionSet.prototype.SUB = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform Subtraction:
	//Update destination register:
	this.guard12OffsetRegisterWrite(((operand1 | 0) - (operand2 | 0)) | 0);
}
ARMInstructionSet.prototype.SUB2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform Subtraction:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(((operand1 | 0) - (operand2 | 0)) | 0);
}
ARMInstructionSet.prototype.SUBS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.SUBS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.RSB = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform Subtraction:
	//Update destination register:
	this.guard12OffsetRegisterWrite(((operand2 | 0) - (operand1 | 0)) | 0);
}
ARMInstructionSet.prototype.RSB2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform Subtraction:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(((operand2 | 0) - (operand1 | 0)) | 0);
}
ARMInstructionSet.prototype.RSBS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setSUBFlags(operand2 | 0, operand1 | 0) | 0);
}
ARMInstructionSet.prototype.RSBS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setSUBFlags(operand2 | 0, operand1 | 0) | 0);
}
ARMInstructionSet.prototype.ADD = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform Addition:
	//Update destination register:
	this.guard12OffsetRegisterWrite(((operand1 | 0) + (operand2 | 0)) | 0);
}
ARMInstructionSet.prototype.ADD2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform Addition:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(((operand1 | 0) + (operand2 | 0)) | 0);
}
ARMInstructionSet.prototype.ADDS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.ADDS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.ADC = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform Addition w/ Carry:
	//Update destination register:
	operand1 = ((operand1 | 0) + (operand2 | 0)) | 0;
	operand1 = ((operand1 | 0) + (this.branchFlags.getCarry() >>> 31)) | 0;
	this.guard12OffsetRegisterWrite(operand1 | 0);
}
ARMInstructionSet.prototype.ADC2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform Addition w/ Carry:
	//Update destination register:
	operand1 = ((operand1 | 0) + (operand2 | 0)) | 0;
	operand1 = ((operand1 | 0) + (this.branchFlags.getCarry() >>> 31)) | 0;
	this.guard12OffsetRegisterWrite2(operand1 | 0);
}
ARMInstructionSet.prototype.ADCS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setADCFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.ADCS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setADCFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.SBC = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform Subtraction w/ Carry:
	//Update destination register:
	operand1 = ((operand1 | 0) - (operand2 | 0)) | 0;
	operand1 = ((operand1 | 0) - (this.branchFlags.getCarryReverse() >>> 31)) | 0;
	this.guard12OffsetRegisterWrite(operand1 | 0);
}
ARMInstructionSet.prototype.SBC2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform Subtraction w/ Carry:
	//Update destination register:
	operand1 = ((operand1 | 0) - (operand2 | 0)) | 0;
	operand1 = ((operand1 | 0) - (this.branchFlags.getCarryReverse() >>> 31)) | 0;
	this.guard12OffsetRegisterWrite2(operand1 | 0);
}
ARMInstructionSet.prototype.SBCS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setSBCFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.SBCS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setSBCFlags(operand1 | 0, operand2 | 0) | 0);
}
ARMInstructionSet.prototype.RSC = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform Reverse Subtraction w/ Carry:
	//Update destination register:
	operand1 = ((operand2 | 0) - (operand1 | 0)) | 0;
	operand1 = ((operand1 | 0) - (this.branchFlags.getCarryReverse() >>> 31)) | 0;
	this.guard12OffsetRegisterWrite(operand1 | 0);
}
ARMInstructionSet.prototype.RSC2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform Reverse Subtraction w/ Carry:
	//Update destination register:
	operand1 = ((operand2 | 0) - (operand1 | 0)) | 0;
	operand1 = ((operand1 | 0) - (this.branchFlags.getCarryReverse() >>> 31)) | 0;
	this.guard12OffsetRegisterWrite2(operand1 | 0);
}
ARMInstructionSet.prototype.RSCS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR(this.branchFlags.setSBCFlags(operand2 | 0, operand1 | 0) | 0);
}
ARMInstructionSet.prototype.RSCS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Update destination register:
	this.guard12OffsetRegisterWriteCPSR2(this.branchFlags.setSBCFlags(operand2 | 0, operand1 | 0) | 0);
}
ARMInstructionSet.prototype.TSTS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing2() | 0;
	//Perform bitwise AND:
	var result = operand1 & operand2;
	this.branchFlags.setNZInt(result | 0);
	//Increment PC:
	this.incrementProgramCounter();
}
ARMInstructionSet.prototype.TSTS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing4() | 0;
	//Perform bitwise AND:
	var result = operand1 & operand2;
	this.branchFlags.setNZInt(result | 0);
}
ARMInstructionSet.prototype.TEQS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing2() | 0;
	//Perform bitwise EOR:
	var result = operand1 ^ operand2;
	this.branchFlags.setNZInt(result | 0);
	//Increment PC:
	this.incrementProgramCounter();
}
ARMInstructionSet.prototype.TEQS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing4() | 0;
	//Perform bitwise EOR:
	var result = operand1 ^ operand2;
	this.branchFlags.setNZInt(result | 0);
}
ARMInstructionSet.prototype.CMPS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
	//Increment PC:
	this.incrementProgramCounter();
}
ARMInstructionSet.prototype.CMPS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
}
ARMInstructionSet.prototype.CMNS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1();
	this.branchFlags.setCMNFlags(operand1 | 0, operand2 | 0);
	//Increment PC:
	this.incrementProgramCounter();
}
ARMInstructionSet.prototype.CMNS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3();
	this.branchFlags.setCMNFlags(operand1 | 0, operand2 | 0);
}
ARMInstructionSet.prototype.ORR = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing1() | 0;
	//Perform bitwise OR:
	//Update destination register:
	this.guard12OffsetRegisterWrite(operand1 | operand2);
}
ARMInstructionSet.prototype.ORR2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing3() | 0;
	//Perform bitwise OR:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(operand1 | operand2);
}
ARMInstructionSet.prototype.ORRS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing2() | 0;
	//Perform bitwise OR:
	var result = operand1 | operand2;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR(result | 0);
}
ARMInstructionSet.prototype.ORRS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	var operand2 = this.operand2OP_DataProcessing4() | 0;
	//Perform bitwise OR:
	var result = operand1 | operand2;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR2(result | 0);
}
ARMInstructionSet.prototype.MOV = function () {
	//Perform move:
	//Update destination register:
	this.guard12OffsetRegisterWrite(this.operand2OP_DataProcessing1() | 0);
}
ARMInstructionSet.prototype.MOV2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	//Perform move:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(this.operand2OP_DataProcessing3() | 0);
}
ARMInstructionSet.prototype.MOVS = function () {
	var operand2 = this.operand2OP_DataProcessing2() | 0;
	//Perform move:
	this.branchFlags.setNZInt(operand2 | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR(operand2 | 0);
}
ARMInstructionSet.prototype.MOVS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand2 = this.operand2OP_DataProcessing4() | 0;
	//Perform move:
	this.branchFlags.setNZInt(operand2 | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR2(operand2 | 0);
}
ARMInstructionSet.prototype.BIC = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	//NOT operand 2:
	var operand2 = ~this.operand2OP_DataProcessing1();
	//Perform bitwise AND:
	//Update destination register:
	this.guard12OffsetRegisterWrite(operand1 & operand2);
}
ARMInstructionSet.prototype.BIC2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	//NOT operand 2:
	var operand2 = ~this.operand2OP_DataProcessing3();
	//Perform bitwise AND:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(operand1 & operand2);
}
ARMInstructionSet.prototype.BICS = function () {
	var operand1 = this.read16OffsetRegister() | 0;
	//NOT operand 2:
	var operand2 = ~this.operand2OP_DataProcessing2();
	//Perform bitwise AND:
	var result = operand1 & operand2;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR(result | 0);
}
ARMInstructionSet.prototype.BICS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand1 = this.read16OffsetRegister() | 0;
	//NOT operand 2:
	var operand2 = ~this.operand2OP_DataProcessing4();
	//Perform bitwise AND:
	var result = operand1 & operand2;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR2(result | 0);
}
ARMInstructionSet.prototype.MVN = function () {
	//Perform move negative:
	//Update destination register:
	this.guard12OffsetRegisterWrite(~this.operand2OP_DataProcessing1());
}
ARMInstructionSet.prototype.MVN2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	//Perform move negative:
	//Update destination register:
	this.guard12OffsetRegisterWrite2(~this.operand2OP_DataProcessing3());
}
ARMInstructionSet.prototype.MVNS = function () {
	var operand2 = ~this.operand2OP_DataProcessing2();
	//Perform move negative:
	this.branchFlags.setNZInt(operand2 | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR(operand2 | 0);
}
ARMInstructionSet.prototype.MVNS2 = function () {
	//Increment PC:
	this.incrementProgramCounter();
	var operand2 = ~this.operand2OP_DataProcessing4();
	//Perform move negative:
	this.branchFlags.setNZInt(operand2 | 0);
	//Update destination register and guard CPSR for PC:
	this.guard12OffsetRegisterWriteCPSR2(operand2 | 0);
}
ARMInstructionSet.prototype.MRS = function () {
	//Transfer PSR to Register:
	var psr = 0;
	if ((this.execute & 0x400000) == 0) {
		//CPSR->Register
		psr = this.rc() | 0;
	} else {
		//SPSR->Register
		psr = this.rs() | 0;
	}
	this.guard12OffsetRegisterWrite(psr | 0);
}
ARMInstructionSet.prototype.MSR = function () {
	switch (this.execute & 0x2400000) {
		case 0:
			//Reg->CPSR
			this.MSR1();
			break;
		case 0x400000:
			//Reg->SPSR
			this.MSR2();
			break;
		case 0x2000000:
			//Immediate->CPSR
			this.MSR3();
			break;
		default:
			//Immediate->SPSR
			this.MSR4();
	}
	//Increment PC:
	this.incrementProgramCounter();
}
ARMInstructionSet.prototype.MSR1 = function () {
	var newcpsr = this.read0OffsetRegister() | 0;
	this.branchFlags.setNZCV(newcpsr | 0);
	if ((this.execute & 0x10000) == 0x10000 && (this.CPUCore.modeFlags & 0x1f) != 0x10) {
		this.CPUCore.switchRegisterBank(newcpsr & 0x1F);
		this.CPUCore.modeFlags = newcpsr & 0xdf;
		this.CPUCore.assertIRQ();
	}
}
ARMInstructionSet.prototype.MSR2 = function () {
	var operand = this.read0OffsetRegister() | 0;
	var bank = 1;
	switch (this.CPUCore.modeFlags & 0x1f) {
		case 0x12: //IRQ
			break;
		case 0x13: //Supervisor
			bank = 2;
			break;
		case 0x11: //FIQ
			bank = 0;
			break;
		case 0x17: //Abort
			bank = 3;
			break;
		case 0x1B: //Undefined
			bank = 4;
			break;
		default:
			return;
	}
	var spsr = (operand >> 20) & 0xF00;
	if ((this.execute & 0x10000) == 0x10000) {
		spsr = spsr | (operand & 0xFF);
	} else {
		spsr = spsr | (this.CPUCore.SPSR[bank | 0] & 0xFF);
	}
	this.CPUCore.SPSR[bank | 0] = spsr | 0;
}
ARMInstructionSet.prototype.MSR3 = function () {
	var operand = this.imm() | 0;
	this.branchFlags.setNZCV(operand | 0);
}
ARMInstructionSet.prototype.MSR4 = function () {
	var operand = this.imm() >> 20;
	var bank = 1;
	switch (this.CPUCore.modeFlags & 0x1f) {
		case 0x12: //IRQ
			break;
		case 0x13: //Supervisor
			bank = 2;
			break;
		case 0x11: //FIQ
			bank = 0;
			break;
		case 0x17: //Abort
			bank = 3;
			break;
		case 0x1B: //Undefined
			bank = 4;
			break;
		default:
			return;
	}
	var spsr = this.CPUCore.SPSR[bank | 0] & 0xFF;
	this.CPUCore.SPSR[bank | 0] = spsr | (operand & 0xF00);
}
ARMInstructionSet.prototype.MUL = function () {
	//Perform multiplication:
	var result = this.performMUL32() | 0;
	//Update destination register:
	this.multiplyGuard16OffsetRegisterWrite(result | 0);
}
ARMInstructionSet.prototype.MULS = function () {
	//Perform multiplication:
	var result = this.performMUL32() | 0;
	this.branchFlags.setCarryFalse();
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.multiplyGuard16OffsetRegisterWrite(result | 0);
}
ARMInstructionSet.prototype.MLA = function () {
	//Perform multiplication:
	var result = this.performMUL32MLA() | 0;
	//Perform addition:
	result = ((result | 0) + (this.read12OffsetRegister() | 0)) | 0;
	//Update destination register:
	this.multiplyGuard16OffsetRegisterWrite(result | 0);
}
ARMInstructionSet.prototype.MLAS = function () {
	//Perform multiplication:
	var result = this.performMUL32MLA() | 0;
	//Perform addition:
	result = ((result | 0) + (this.read12OffsetRegister() | 0)) | 0;
	this.branchFlags.setCarryFalse();
	this.branchFlags.setNZInt(result | 0);
	//Update destination register and guard CPSR for PC:
	this.multiplyGuard16OffsetRegisterWrite(result | 0);
}
ARMInstructionSet.prototype.UMULL = function () {
	//Perform multiplication:
	this.CPUCore.performUMUL64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0);
	//Update destination register:
	this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
	this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.UMULLS = function () {
	//Perform multiplication:
	this.CPUCore.performUMUL64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0);
	this.branchFlags.setCarryFalse();
	this.branchFlags.setNegative(this.CPUCore.mul64ResultHigh | 0);
	this.branchFlags.setZero(this.CPUCore.mul64ResultHigh | this.CPUCore.mul64ResultLow);
	//Update destination register and guard CPSR for PC:
	this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
	this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.UMLAL = function () {
	//Perform multiplication:
	this.CPUCore.performUMLA64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0, this.read16OffsetRegister() | 0, this.read12OffsetRegister() | 0);
	//Update destination register:
	this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
	this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.UMLALS = function () {
	//Perform multiplication:
	this.CPUCore.performUMLA64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0, this.read16OffsetRegister() | 0, this.read12OffsetRegister() | 0);
	this.branchFlags.setCarryFalse();
	this.branchFlags.setNegative(this.CPUCore.mul64ResultHigh | 0);
	this.branchFlags.setZero(this.CPUCore.mul64ResultHigh | this.CPUCore.mul64ResultLow);
	//Update destination register and guard CPSR for PC:
	this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
	this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.SMULL = function () {
	//Perform multiplication:
	this.CPUCore.performMUL64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0);
	//Update destination register:
	this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
	this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.SMULLS = function () {
	//Perform multiplication:
	this.CPUCore.performMUL64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0);
	this.branchFlags.setCarryFalse();
	this.branchFlags.setNegative(this.CPUCore.mul64ResultHigh | 0);
	this.branchFlags.setZero(this.CPUCore.mul64ResultHigh | this.CPUCore.mul64ResultLow);
	//Update destination register and guard CPSR for PC:
	this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
	this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.SMLAL = function () {
	//Perform multiplication:
	this.CPUCore.performMLA64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0, this.read16OffsetRegister() | 0, this.read12OffsetRegister() | 0);
	//Update destination register:
	this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
	this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.SMLALS = function () {
	//Perform multiplication:
	this.CPUCore.performMLA64(this.read0OffsetRegister() | 0, this.read8OffsetRegister() | 0, this.read16OffsetRegister() | 0, this.read12OffsetRegister() | 0);
	this.branchFlags.setCarryFalse();
	this.branchFlags.setNegative(this.CPUCore.mul64ResultHigh | 0);
	this.branchFlags.setZero(this.CPUCore.mul64ResultHigh | this.CPUCore.mul64ResultLow);
	//Update destination register and guard CPSR for PC:
	this.multiplyGuard16OffsetRegisterWrite(this.CPUCore.mul64ResultHigh | 0);
	this.multiplyGuard12OffsetRegisterWrite(this.CPUCore.mul64ResultLow | 0);
}
ARMInstructionSet.prototype.STRH = function () {
	//Perform halfword store calculations:
	var address = this.operand2OP_LoadStore1() | 0;
	//Write to memory location:
	this.CPUCore.write16(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRH = function () {
	//Perform halfword load calculations:
	var address = this.operand2OP_LoadStore1() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read16(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDRSH = function () {
	//Perform signed halfword load calculations:
	var address = this.operand2OP_LoadStore1() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite((this.CPUCore.read16(address | 0) << 16) >> 16);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDRSB = function () {
	//Perform signed byte load calculations:
	var address = this.operand2OP_LoadStore1() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite((this.CPUCore.read8(address | 0) << 24) >> 24);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRH2 = function () {
	//Perform halfword store calculations:
	var address = this.operand2OP_LoadStore2() | 0;
	//Write to memory location:
	this.CPUCore.write16(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRH2 = function () {
	//Perform halfword load calculations:
	var address = this.operand2OP_LoadStore2() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read16(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDRSH2 = function () {
	//Perform signed halfword load calculations:
	var address = this.operand2OP_LoadStore2() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite((this.CPUCore.read16(address | 0) << 16) >> 16);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDRSB2 = function () {
	//Perform signed byte load calculations:
	var address = this.operand2OP_LoadStore2() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite((this.CPUCore.read8(address | 0) << 24) >> 24);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STR = function () {
	//Perform word store calculations:
	var address = this.operand2OP_LoadStore3(0) | 0;
	//Write to memory location:
	this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDR = function () {
	//Perform word load calculations:
	var address = this.operand2OP_LoadStore3(0) | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRB = function () {
	//Perform byte store calculations:
	var address = this.operand2OP_LoadStore3(0) | 0;
	//Write to memory location:
	this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRB = function () {
	//Perform byte store calculations:
	var address = this.operand2OP_LoadStore3(0) | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STR4 = function () {
	//Perform word store calculations:
	var address = this.operand2OP_LoadStore4() | 0;
	//Write to memory location:
	this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDR4 = function () {
	//Perform word load calculations:
	var address = this.operand2OP_LoadStore4() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRB4 = function () {
	//Perform byte store calculations:
	var address = this.operand2OP_LoadStore4() | 0;
	//Write to memory location:
	this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRB4 = function () {
	//Perform byte store calculations:
	var address = this.operand2OP_LoadStore4() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRT = function () {
	//Perform word store calculations (forced user-mode):
	var address = this.operand2OP_LoadStore3(0xF) | 0;
	//Write to memory location:
	this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRT = function () {
	//Perform word load calculations (forced user-mode):
	var address = this.operand2OP_LoadStore3(0xF) | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRBT = function () {
	//Perform byte store calculations (forced user-mode):
	var address = this.operand2OP_LoadStore3(0xF) | 0;
	//Write to memory location:
	this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRBT = function () {
	//Perform byte load calculations (forced user-mode):
	var address = this.operand2OP_LoadStore3(0xF) | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STR2 = function () {
	//Perform word store calculations:
	var address = this.operand2OP_LoadStore5(0) | 0;
	//Write to memory location:
	this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDR2 = function () {
	//Perform word load calculations:
	var address = this.operand2OP_LoadStore5(0) | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRB2 = function () {
	//Perform byte store calculations:
	var address = this.operand2OP_LoadStore5(0) | 0;
	//Write to memory location:
	this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRB2 = function () {
	//Perform byte store calculations:
	var address = this.operand2OP_LoadStore5(0) | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRT2 = function () {
	//Perform word store calculations (forced user-mode):
	var address = this.operand2OP_LoadStore5(0xF) | 0;
	//Write to memory location:
	this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRT2 = function () {
	//Perform word load calculations (forced user-mode):
	var address = this.operand2OP_LoadStore5(0xF) | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRBT2 = function () {
	//Perform byte store calculations (forced user-mode):
	var address = this.operand2OP_LoadStore5(0xF) | 0;
	//Write to memory location:
	this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRBT2 = function () {
	//Perform byte load calculations (forced user-mode):
	var address = this.operand2OP_LoadStore5(0xF) | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STR3 = function () {
	//Perform word store calculations:
	var address = this.operand2OP_LoadStore6() | 0;
	//Write to memory location:
	this.CPUCore.write32(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDR3 = function () {
	//Perform word load calculations:
	var address = this.operand2OP_LoadStore6() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read32(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STRB3 = function () {
	//Perform byte store calculations:
	var address = this.operand2OP_LoadStore6() | 0;
	//Write to memory location:
	this.CPUCore.write8(address | 0, this.guard12OffsetRegisterRead() | 0);
}
ARMInstructionSet.prototype.LDRB3 = function () {
	//Perform byte store calculations:
	var address = this.operand2OP_LoadStore6() | 0;
	//Read from memory location:
	this.guard12OffsetRegisterWrite(this.CPUCore.read8(address | 0) | 0);
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.STMIA = function () {
	//Only initialize the STMIA sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMIAW = function () {
	//Only initialize the STMIA sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		var finalAddress = this.getPositiveOffsetStartAddress(currentAddress | 0) | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		var count = 0;
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
				//Compute writeback immediately after the first register load:
				if ((count | 0) == 0) {
					count = 1;
					//Store the updated base address back into register:
					this.guard16OffsetRegisterWrite(finalAddress | 0);
				}
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMDA = function () {
	//Only initialize the STMDA sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Get offset start address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMDAW = function () {
	//Only initialize the STMDA sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Get offset start address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		var finalAddress = currentAddress | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		var count = 0;
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
				//Compute writeback immediately after the first register load:
				if ((count | 0) == 0) {
					count = 1;
					//Store the updated base address back into register:
					this.guard16OffsetRegisterWrite(finalAddress | 0);
				}
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMIB = function () {
	//Only initialize the STMIB sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMIBW = function () {
	//Only initialize the STMIB sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		var finalAddress = this.getPositiveOffsetStartAddress(currentAddress | 0) | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		var count = 0;
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
				//Compute writeback immediately after the first register load:
				if ((count | 0) == 0) {
					count = 1;
					//Store the updated base address back into register:
					this.guard16OffsetRegisterWrite(finalAddress | 0);
				}
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMDB = function () {
	//Only initialize the STMDB sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Get offset start address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMDBW = function () {
	//Only initialize the STMDB sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Get offset start address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		var finalAddress = currentAddress | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		var count = 0;
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.readRegister(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
				//Compute writeback immediately after the first register load:
				if ((count | 0) == 0) {
					count = 1;
					//Store the updated base address back into register:
					this.guard16OffsetRegisterWrite(finalAddress | 0);
				}
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMIAG = function () {
	//Only initialize the STMIA sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMIAWG = function () {
	//Only initialize the STMIA sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		var finalAddress = this.getPositiveOffsetStartAddress(currentAddress | 0) | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		var count = 0;
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
				//Compute writeback immediately after the first register load:
				if ((count | 0) == 0) {
					count = 1;
					//Store the updated base address back into register:
					this.guard16OffsetRegisterWrite(finalAddress | 0);
				}
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMDAG = function () {
	//Only initialize the STMDA sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Get offset start address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMDAWG = function () {
	//Only initialize the STMDA sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Get offset start address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		var finalAddress = currentAddress | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		var count = 0;
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
				//Compute writeback immediately after the first register load:
				if ((count | 0) == 0) {
					count = 1;
					//Store the updated base address back into register:
					this.guard16OffsetRegisterWrite(finalAddress | 0);
				}
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMIBG = function () {
	//Only initialize the STMIB sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMIBWG = function () {
	//Only initialize the STMIB sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		var finalAddress = this.getPositiveOffsetStartAddress(currentAddress | 0) | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		var count = 0;
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
				//Compute writeback immediately after the first register load:
				if ((count | 0) == 0) {
					count = 1;
					//Store the updated base address back into register:
					this.guard16OffsetRegisterWrite(finalAddress | 0);
				}
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMDBG = function () {
	//Only initialize the STMDB sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Get offset start address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.STMDBWG = function () {
	//Only initialize the STMDB sequence if the register list is non-empty:
	if ((this.execute & 0xFFFF) > 0) {
		//Get the base address:
		var currentAddress = this.read16OffsetRegister() | 0;
		//Get offset start address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		var finalAddress = currentAddress | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		var count = 0;
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.guardUserRegisterReadSTM(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
				//Compute writeback immediately after the first register load:
				if ((count | 0) == 0) {
					count = 1;
					//Store the updated base address back into register:
					this.guard16OffsetRegisterWrite(finalAddress | 0);
				}
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
}
ARMInstructionSet.prototype.LDMIA = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
	} else {
		//Empty reglist loads PC:
		this.guardRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMIAW = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
	} else {
		//Empty reglist loads PC:
		this.guardRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
		currentAddress = ((currentAddress | 0) + 0x40) | 0;
	}
	//Store the updated base address back into register:
	this.guard16OffsetRegisterWrite(currentAddress | 0);
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMDA = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Get the offset address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		//Load register(s) from memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	} else {
		//Empty reglist loads PC:
		this.guardRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMDAW = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Get the offset address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		var writebackAddress = currentAddress | 0;
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
			}
		}
		//Store the updated base address back into register:
		this.guard16OffsetRegisterWrite(writebackAddress | 0);
	} else {
		//Empty reglist loads PC:
		this.guardRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
		currentAddress = ((currentAddress | 0) - 0x40) | 0;
		//Store the updated base address back into register:
		this.guard16OffsetRegisterWrite(currentAddress | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMIB = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
			}
		}
	} else {
		//Empty reglist loads PC:
		currentAddress = ((currentAddress | 0) + 4) | 0;
		this.guardRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMIBW = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
			}
		}
	} else {
		//Empty reglist loads PC:
		currentAddress = ((currentAddress | 0) + 0x40) | 0;
		this.guardRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Store the updated base address back into register:
	this.guard16OffsetRegisterWrite(currentAddress | 0);
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMDB = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Get the offset address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		//Load register(s) from memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
	} else {
		//Empty reglist loads PC:
		currentAddress = ((currentAddress | 0) - 4) | 0;
		this.guardRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMDBW = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Get the offset address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		var writebackAddress = currentAddress | 0;
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.guardRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
		//Store the updated base address back into register:
		this.guard16OffsetRegisterWrite(writebackAddress | 0);
	} else {
		//Empty reglist loads PC:
		currentAddress = ((currentAddress | 0) - 0x40) | 0;
		this.guardRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
		//Store the updated base address back into register:
		this.guard16OffsetRegisterWrite(currentAddress | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMIAG = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
	} else {
		//Empty reglist loads PC:
		this.guardProgramCounterRegisterWriteCPSR(this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMIAWG = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
	} else {
		//Empty reglist loads PC:
		this.guardProgramCounterRegisterWriteCPSR(this.memory.memoryRead32(currentAddress | 0) | 0);
		currentAddress = ((currentAddress | 0) + 0x40) | 0;
	}
	//Store the updated base address back into register:
	this.guard16OffsetRegisterWrite(currentAddress | 0);
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMDAG = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Get the offset address:
	currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
			}
		}
	} else {
		//Empty reglist loads PC:
		this.guardUserRegisterWriteLDM(0xF, this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMDAWG = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Get the offset address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		var writebackAddress = currentAddress | 0;
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
			}
		}
		//Store the updated base address back into register:
		this.guard16OffsetRegisterWrite(writebackAddress | 0);
	} else {
		//Empty reglist loads PC:
		this.guardProgramCounterRegisterWriteCPSR(this.memory.memoryRead32(currentAddress | 0) | 0);
		currentAddress = ((currentAddress | 0) - 0x40) | 0;
		//Store the updated base address back into register:
		this.guard16OffsetRegisterWrite(currentAddress | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMIBG = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
			}
		}
	} else {
		//Empty reglist loads PC:
		currentAddress = ((currentAddress | 0) + 4) | 0;
		this.guardProgramCounterRegisterWriteCPSR(this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMIBWG = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				currentAddress = ((currentAddress | 0) + 4) | 0;
				this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
			}
		}
	} else {
		//Empty reglist loads PC:
		currentAddress = ((currentAddress | 0) + 0x40) | 0;
		this.guardProgramCounterRegisterWriteCPSR(this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Store the updated base address back into register:
	this.guard16OffsetRegisterWrite(currentAddress | 0);
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMDBG = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Get the offset address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		//Load register(s) from memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
	} else {
		//Empty reglist loads PC:
		currentAddress = ((currentAddress | 0) - 4) | 0;
		this.guardProgramCounterRegisterWriteCPSR(this.memory.memoryRead32(currentAddress | 0) | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LDMDBWG = function () {
	//Get the base address:
	var currentAddress = this.read16OffsetRegister() | 0;
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	if ((this.execute & 0xFFFF) > 0) {
		//Get the offset address:
		currentAddress = this.getNegativeOffsetStartAddress(currentAddress | 0) | 0;
		var writebackAddress = currentAddress | 0;
		//Load register(s) from memory:
		for (var rListPosition = 0; rListPosition < 0x10; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.guardUserRegisterWriteLDM(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
		//Store the updated base address back into register:
		this.guard16OffsetRegisterWrite(writebackAddress | 0);
	} else {
		//Empty reglist loads PC:
		currentAddress = ((currentAddress | 0) - 0x40) | 0;
		this.guardProgramCounterRegisterWriteCPSR(this.memory.memoryRead32(currentAddress | 0) | 0);
		//Store the updated base address back into register:
		this.guard16OffsetRegisterWrite(currentAddress | 0);
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
ARMInstructionSet.prototype.LoadStoreMultiple = function () {
	this.incrementProgramCounter();
	switch ((this.execute >> 20) & 0x1F) {
		case 0:
			this.STMDA();
			break;
		case 0x1:
			this.LDMDA();
			break;
		case 0x2:
			this.STMDAW();
			break;
		case 0x3:
			this.LDMDAW();
			break;
		case 0x4:
			this.STMDAG();
			break;
		case 0x5:
			this.LDMDAG();
			break;
		case 0x6:
			this.STMDAWG();
			break;
		case 0x7:
			this.LDMDAWG();
			break;
		case 0x8:
			this.STMIA();
			break;
		case 0x9:
			this.LDMIA();
			break;
		case 0xA:
			this.STMIAW();
			break;
		case 0xB:
			this.LDMIAW();
			break;
		case 0xC:
			this.STMIAG();
			break;
		case 0xD:
			this.LDMIAG();
			break;
		case 0xE:
			this.STMIAWG();
			break;
		case 0xF:
			this.LDMIAWG();
			break;
		case 0x10:
			this.STMDB();
			break;
		case 0x11:
			this.LDMDB();
			break;
		case 0x12:
			this.STMDBW();
			break;
		case 0x13:
			this.LDMDBW();
			break;
		case 0x14:
			this.STMDBG();
			break;
		case 0x15:
			this.LDMDBG();
			break;
		case 0x16:
			this.STMDBWG();
			break;
		case 0x17:
			this.LDMDBWG();
			break;
		case 0x18:
			this.STMIB();
			break;
		case 0x19:
			this.LDMIB();
			break;
		case 0x1A:
			this.STMIBW();
			break;
		case 0x1B:
			this.LDMIBW();
			break;
		case 0x1C:
			this.STMIBG();
			break;
		case 0x1D:
			this.LDMIBG();
			break;
		case 0x1E:
			this.STMIBWG();
			break;
		default:
			this.LDMIBWG();
	}
}
ARMInstructionSet.prototype.SWP = function () {
	var base = this.read16OffsetRegister() | 0;
	var data = this.CPUCore.read32(base | 0) | 0;
	//Clock a cycle for the processing delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	this.CPUCore.write32(base | 0, this.read0OffsetRegister() | 0);
	this.guard12OffsetRegisterWrite(data | 0);
}
ARMInstructionSet.prototype.SWPB = function () {
	var base = this.read16OffsetRegister() | 0;
	var data = this.CPUCore.read8(base | 0) | 0;
	//Clock a cycle for the processing delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	this.CPUCore.write8(base | 0, this.read0OffsetRegister() | 0);
	this.guard12OffsetRegisterWrite(data | 0);
}
ARMInstructionSet.prototype.SWI = function () {
	//Software Interrupt:
	this.CPUCore.SWI();
}
ARMInstructionSet.prototype.UNDEFINED = function () {
	//Undefined Exception:
	this.CPUCore.UNDEFINED();
}
ARMInstructionSet.prototype.operand2OP_DataProcessing1 = function () {
	var data = 0;
	switch ((this.execute & 0x2000060) >> 5) {
		case 0:
			data = this.lli() | 0;
			break;
		case 1:
			data = this.lri() | 0;
			break;
		case 2:
			data = this.ari() | 0;
			break;
		case 3:
			data = this.rri() | 0;
			break;
		default:
			data = this.imm() | 0;
	}
	return data | 0;
}
ARMInstructionSet.prototype.operand2OP_DataProcessing2 = function () {
	var data = 0;
	switch ((this.execute & 0x2000060) >> 5) {
		case 0:
			data = this.llis() | 0;
			break;
		case 1:
			data = this.lris() | 0;
			break;
		case 2:
			data = this.aris() | 0;
			break;
		case 3:
			data = this.rris() | 0;
			break;
		default:
			data = this.imms() | 0;
	}
	return data | 0;
}
ARMInstructionSet.prototype.operand2OP_DataProcessing3 = function () {
	var data = 0;
	switch ((this.execute >> 5) & 0x3) {
		case 0:
			data = this.llr() | 0;
			break;
		case 1:
			data = this.lrr() | 0;
			break;
		case 2:
			data = this.arr() | 0;
			break;
		default:
			data = this.rrr() | 0;
	}
	return data | 0;
}
ARMInstructionSet.prototype.operand2OP_DataProcessing4 = function () {
	var data = 0;
	switch ((this.execute >> 5) & 0x3) {
		case 0:
			data = this.llrs() | 0;
			break;
		case 1:
			data = this.lrrs() | 0;
			break;
		case 2:
			data = this.arrs() | 0;
			break;
		default:
			data = this.rrrs() | 0;
	}
	return data | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStoreOffsetGen = function () {
	var data = 0;
	switch ((this.execute >> 5) & 0x3) {
		case 0:
			data = this.lli() | 0;
			break;
		case 1:
			data = this.lri() | 0;
			break;
		case 2:
			data = this.ari() | 0;
			break;
		default:
			data = this.rri() | 0;
	}
	return data | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStoreOperandDetermine = function () {
	var offset = 0;
	if ((this.execute & 0x400000) == 0) {
		offset = this.read0OffsetRegister() | 0;
	} else {
		offset = ((this.execute & 0xF00) >> 4) | (this.execute & 0xF);
	}
	return offset | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStorePostT = function (offset, userMode) {
	offset = offset | 0;
	userMode = userMode | 0;
	var base = this.baseRegisterRead(userMode | 0) | 0;
	if ((this.execute & 0x800000) == 0) {
		offset = ((base | 0) - (offset | 0)) | 0;
	} else {
		offset = ((base | 0) + (offset | 0)) | 0;
	}
	this.baseRegisterWrite(offset | 0, userMode | 0);
	return base | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStoreNotT = function (offset) {
	offset = offset | 0;
	var base = this.read16OffsetRegister() | 0;
	if ((this.execute & 0x800000) == 0) {
		offset = ((base | 0) - (offset | 0)) | 0;
	} else {
		offset = ((base | 0) + (offset | 0)) | 0;
	}
	if ((this.execute & 0x200000) == 0x200000) {
		this.guard16OffsetRegisterWrite(offset | 0);
	}
	return offset | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore1 = function () {
	return this.operand2OP_LoadStorePostT(this.operand2OP_LoadStoreOperandDetermine() | 0, 0) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore2 = function () {
	return this.operand2OP_LoadStoreNotT(this.operand2OP_LoadStoreOperandDetermine() | 0) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore3 = function (userMode) {
	userMode = userMode | 0;
	return this.operand2OP_LoadStorePostT(this.execute & 0xFFF, userMode | 0) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore4 = function () {
	return this.operand2OP_LoadStoreNotT(this.execute & 0xFFF) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore5 = function (userMode) {
	userMode = userMode | 0;
	return this.operand2OP_LoadStorePostT(this.operand2OP_LoadStoreOffsetGen() | 0, userMode | 0) | 0;
}
ARMInstructionSet.prototype.operand2OP_LoadStore6 = function () {
	return this.operand2OP_LoadStoreNotT(this.operand2OP_LoadStoreOffsetGen() | 0) | 0;
}
ARMInstructionSet.prototype.lli = function () {
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Shift the register data left:
	var shifter = (this.execute >> 7) & 0x1F;
	return register << (shifter | 0);
}
ARMInstructionSet.prototype.llis = function () {
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Get the shift amount:
	var shifter = (this.execute >> 7) & 0x1F;
	//Check to see if we need to update CPSR:
	if ((shifter | 0) > 0) {
		this.branchFlags.setCarry(register << (((shifter | 0) - 1) | 0));
	}
	//Shift the register data left:
	return register << (shifter | 0);
}
ARMInstructionSet.prototype.llr = function () {
	//Logical Left Shift with Register:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Clock a cycle for the shift delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	//Shift the register data left:
	var shifter = this.read8OffsetRegister() & 0xFF;
	if ((shifter | 0) < 0x20) {
		register = register << (shifter | 0);
	} else {
		register = 0;
	}
	return register | 0;
}
ARMInstructionSet.prototype.llrs = function () {
	//Logical Left Shift with Register and CPSR:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Clock a cycle for the shift delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	//Get the shift amount:
	var shifter = this.read8OffsetRegister() & 0xFF;
	//Check to see if we need to update CPSR:
	if ((shifter | 0) > 0) {
		if ((shifter | 0) < 0x20) {
			//Shift the register data left:
			this.branchFlags.setCarry(register << (((shifter | 0) - 1) | 0));
			register = register << (shifter | 0);
		} else {
			if ((shifter | 0) == 0x20) {
				//Shift bit 0 into carry:
				this.branchFlags.setCarry(register << 31);
			} else {
				//Everything Zero'd:
				this.branchFlags.setCarryFalse();
			}
			register = 0;
		}
	}
	//If shift is 0, just return the register without mod:
	return register | 0;
}
ARMInstructionSet.prototype.lri = function () {
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Shift the register data right logically:
	var shifter = (this.execute >> 7) & 0x1F;
	if ((shifter | 0) == 0) {
		//Return 0:
		register = 0;
	} else {
		register = (register >>> (shifter | 0)) | 0;
	}
	return register | 0;
}
ARMInstructionSet.prototype.lris = function () {
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Get the shift amount:
	var shifter = (this.execute >> 7) & 0x1F;
	//Check to see if we need to update CPSR:
	if ((shifter | 0) > 0) {
		this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
		//Shift the register data right logically:
		register = (register >>> (shifter | 0)) | 0;
	} else {
		this.branchFlags.setCarry(register | 0);
		//Return 0:
		register = 0;
	}
	return register | 0;
}
ARMInstructionSet.prototype.lrr = function () {
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Clock a cycle for the shift delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	//Shift the register data right logically:
	var shifter = this.read8OffsetRegister() & 0xFF;
	if ((shifter | 0) < 0x20) {
		register = (register >>> (shifter | 0)) | 0;
	} else {
		register = 0;
	}
	return register | 0;
}
ARMInstructionSet.prototype.lrrs = function () {
	//Logical Right Shift with Register and CPSR:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Clock a cycle for the shift delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	//Get the shift amount:
	var shifter = this.read8OffsetRegister() & 0xFF;
	//Check to see if we need to update CPSR:
	if ((shifter | 0) > 0) {
		if ((shifter | 0) < 0x20) {
			//Shift the register data right logically:
			this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
			register = (register >>> (shifter | 0)) | 0;
		} else {
			if ((shifter | 0) == 0x20) {
				//Shift bit 31 into carry:
				this.branchFlags.setCarry(register | 0);
			} else {
				//Everything Zero'd:
				this.branchFlags.setCarryFalse();
			}
			register = 0;
		}
	}
	//If shift is 0, just return the register without mod:
	return register | 0;
}
ARMInstructionSet.prototype.ari = function () {
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Get the shift amount:
	var shifter = (this.execute >> 7) & 0x1F;
	if ((shifter | 0) == 0) {
		//Shift full length if shifter is zero:
		shifter = 0x1F;
	}
	//Shift the register data right:
	return register >> (shifter | 0);
}
ARMInstructionSet.prototype.aris = function () {
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Get the shift amount:
	var shifter = (this.execute >> 7) & 0x1F;
	//Check to see if we need to update CPSR:
	if ((shifter | 0) > 0) {
		this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
	} else {
		//Shift full length if shifter is zero:
		shifter = 0x1F;
		this.branchFlags.setCarry(register | 0);
	}
	//Shift the register data right:
	return register >> (shifter | 0);
}
ARMInstructionSet.prototype.arr = function () {
	//Arithmetic Right Shift with Register:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Clock a cycle for the shift delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	//Shift the register data right:
	return register >> Math.min(this.read8OffsetRegister() & 0xFF, 0x1F);
}
ARMInstructionSet.prototype.arrs = function () {
	//Arithmetic Right Shift with Register and CPSR:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Clock a cycle for the shift delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	//Get the shift amount:
	var shifter = this.read8OffsetRegister() & 0xFF;
	//Check to see if we need to update CPSR:
	if ((shifter | 0) > 0) {
		if ((shifter | 0) < 0x20) {
			//Shift the register data right arithmetically:
			this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
			register = register >> (shifter | 0);
		} else {
			//Set all bits with bit 31:
			this.branchFlags.setCarry(register | 0);
			register = register >> 0x1F;
		}
	}
	//If shift is 0, just return the register without mod:
	return register | 0;
}
ARMInstructionSet.prototype.rri = function () {
	//Rotate Right with Immediate:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Rotate the register right:
	var shifter = (this.execute >> 7) & 0x1F;
	if ((shifter | 0) > 0) {
		//ROR
		register = (register << (0x20 - (shifter | 0))) | (register >>> (shifter | 0));
	} else {
		//RRX
		register = (this.branchFlags.getCarry() & 0x80000000) | (register >>> 0x1);
	}
	return register | 0;
}
ARMInstructionSet.prototype.rris = function () {
	//Rotate Right with Immediate and CPSR:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Rotate the register right:
	var shifter = (this.execute >> 7) & 0x1F;
	if ((shifter | 0) > 0) {
		//ROR
		this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
		register = (register << (0x20 - (shifter | 0))) | (register >>> (shifter | 0));
	} else {
		//RRX
		var rrxValue = (this.branchFlags.getCarry() & 0x80000000) | (register >>> 0x1);
		this.branchFlags.setCarry(register << 31);
		register = rrxValue | 0;
	}
	return register | 0;
}
ARMInstructionSet.prototype.rrr = function () {
	//Rotate Right with Register:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Clock a cycle for the shift delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	//Rotate the register right:
	var shifter = this.read8OffsetRegister() & 0x1F;
	if ((shifter | 0) > 0) {
		//ROR
		register = (register << (0x20 - (shifter | 0))) | (register >>> (shifter | 0));
	}
	//If shift is 0, just return the register without mod:
	return register | 0;
}
ARMInstructionSet.prototype.rrrs = function () {
	//Rotate Right with Register and CPSR:
	//Get the register data to be shifted:
	var register = this.read0OffsetRegister() | 0;
	//Clock a cycle for the shift delaying the CPU:
	this.wait.CPUInternalSingleCyclePrefetch();
	//Rotate the register right:
	var shifter = this.read8OffsetRegister() & 0xFF;
	if ((shifter | 0) > 0) {
		shifter = shifter & 0x1F;
		if ((shifter | 0) > 0) {
			//ROR
			this.branchFlags.setCarry((register >> (((shifter | 0) - 1) | 0)) << 31);
			register = (register << (0x20 - (shifter | 0))) | (register >>> (shifter | 0));
		} else {
			//No shift, but make carry set to bit 31:
			this.branchFlags.setCarry(register | 0);
		}
	}
	//If shift is 0, just return the register without mod:
	return register | 0;
}
ARMInstructionSet.prototype.imm = function () {
	//Get the immediate data to be shifted:
	var immediate = this.execute & 0xFF;
	//Rotate the immediate right:
	var shifter = (this.execute >> 7) & 0x1E;
	if ((shifter | 0) > 0) {
		immediate = (immediate << (0x20 - (shifter | 0))) | (immediate >>> (shifter | 0));
	}
	return immediate | 0;
}
ARMInstructionSet.prototype.imms = function () {
	//Get the immediate data to be shifted:
	var immediate = this.execute & 0xFF;
	//Rotate the immediate right:
	var shifter = (this.execute >> 7) & 0x1E;
	if ((shifter | 0) > 0) {
		immediate = (immediate << (0x20 - (shifter | 0))) | (immediate >>> (shifter | 0));
		this.branchFlags.setCarry(immediate | 0);
	}
	return immediate | 0;
}
ARMInstructionSet.prototype.rc = function () {
	return (this.branchFlags.getNZCV() | this.CPUCore.modeFlags);
}
ARMInstructionSet.prototype.rs = function () {
	var spsr = 0;
	switch (this.CPUCore.modeFlags & 0x1f) {
		case 0x12: //IRQ
			spsr = this.CPUCore.SPSR[1] | 0;
			break;
		case 0x13: //Supervisor
			spsr = this.CPUCore.SPSR[2] | 0;
			break;
		case 0x11: //FIQ
			spsr = this.CPUCore.SPSR[0] | 0;
			break;
		case 0x17: //Abort
			spsr = this.CPUCore.SPSR[3] | 0;
			break;
		case 0x1B: //Undefined
			spsr = this.CPUCore.SPSR[4] | 0;
			break;
		default:
			//Instruction hit an invalid SPSR request:
			return this.rc() | 0;
	}
	return ((spsr & 0xF00) << 20) | (spsr & 0xFF);
}

function compileARMInstructionDecodeMap() {
	var pseudoCodes = [
		"BX",
		"B",
		"BL",
		"AND",
		"AND2",
		"ANDS",
		"ANDS2",
		"EOR",
		"EOR2",
		"EORS",
		"EORS2",
		"SUB",
		"SUB2",
		"SUBS",
		"SUBS2",
		"RSB",
		"RSB2",
		"RSBS",
		"RSBS2",
		"ADD",
		"ADD2",
		"ADDS",
		"ADDS2",
		"ADC",
		"ADC2",
		"ADCS",
		"ADCS2",
		"SBC",
		"SBC2",
		"SBCS",
		"SBCS2",
		"RSC",
		"RSC2",
		"RSCS",
		"RSCS2",
		"TSTS",
		"TSTS2",
		"TEQS",
		"TEQS2",
		"CMPS",
		"CMPS2",
		"CMNS",
		"CMNS2",
		"ORR",
		"ORR2",
		"ORRS",
		"ORRS2",
		"MOV",
		"MOV2",
		"MOVS",
		"MOVS2",
		"BIC",
		"BIC2",
		"BICS",
		"BICS2",
		"MVN",
		"MVN2",
		"MVNS",
		"MVNS2",
		"MRS",
		"MSR",
		"MUL",
		"MULS",
		"MLA",
		"MLAS",
		"UMULL",
		"UMULLS",
		"UMLAL",
		"UMLALS",
		"SMULL",
		"SMULLS",
		"SMLAL",
		"SMLALS",
		"STRH",
		"LDRH",
		"LDRSH",
		"LDRSB",
		"STRH2",
		"LDRH2",
		"LDRSH2",
		"LDRSB2",
		"STR",
		"LDR",
		"STRB",
		"LDRB",
		"STRT",
		"LDRT",
		"STRBT",
		"LDRBT",
		"STR2",
		"LDR2",
		"STRB2",
		"LDRB2",
		"STRT2",
		"LDRT2",
		"STRBT2",
		"LDRBT2",
		"STR3",
		"LDR3",
		"STRB3",
		"LDRB3",
		"STR4",
		"LDR4",
		"STRB4",
		"LDRB4",
		"LoadStoreMultiple",
		"SWP",
		"SWPB",
		"SWI"
	];

	function compileARMInstructionDecodeOpcodeMap(codeMap) {
		var opcodeIndice = 0;
		var instructionMap = getUint8Array(4096);

		function generateMap1(instruction) {
			for (var index = 0; index < 0x10; ++index) {
				instructionMap[opcodeIndice++] = codeMap[instruction[index]];
			}
		}

		function generateMap2(instruction) {
			var translatedOpcode = codeMap[instruction];
			for (var index = 0; index < 0x10; ++index) {
				instructionMap[opcodeIndice++] = translatedOpcode;
			}
		}

		function generateMap3(instruction) {
			var translatedOpcode = codeMap[instruction];
			for (var index = 0; index < 0x100; ++index) {
				instructionMap[opcodeIndice++] = translatedOpcode;
			}
		}

		function generateMap4(instruction) {
			var translatedOpcode = codeMap[instruction];
			for (var index = 0; index < 0x200; ++index) {
				instructionMap[opcodeIndice++] = translatedOpcode;
			}
		}

		function generateMap5(instruction) {
			var translatedOpcode = codeMap[instruction];
			for (var index = 0; index < 0x300; ++index) {
				instructionMap[opcodeIndice++] = translatedOpcode;
			}
		}

		function generateStoreLoadInstructionSector1() {
			var instrMap = [
				"STR2",
				"LDR2",
				"STRT2",
				"LDRT2",
				"STRB2",
				"LDRB2",
				"STRBT2",
				"LDRBT2"
			];
			for (var instrIndex = 0; instrIndex < 0x10; ++instrIndex) {
				for (var dataIndex = 0; dataIndex < 0x10; ++dataIndex) {
					if ((dataIndex & 0x1) == 0) {
						instructionMap[opcodeIndice++] = codeMap[instrMap[instrIndex & 0x7]];
					} else {
						instructionMap[opcodeIndice++] = codeMap["UNDEFINED"];
					}
				}
			}
		}

		function generateStoreLoadInstructionSector2() {
			var instrMap = [
				"STR3",
				"LDR3",
				"STRB3",
				"LDRB3"
			];
			for (var instrIndex = 0; instrIndex < 0x10; ++instrIndex) {
				for (var dataIndex = 0; dataIndex < 0x10; ++dataIndex) {
					if ((dataIndex & 0x1) == 0) {
						instructionMap[opcodeIndice++] = codeMap[instrMap[((instrIndex >> 1) & 0x2) | (instrIndex & 0x1)]];
					} else {
						instructionMap[opcodeIndice++] = codeMap["UNDEFINED"];
					}
				}
			}
		}
		//0
		generateMap1([
			"AND",
			"AND2",
			"AND",
			"AND2",
			"AND",
			"AND2",
			"AND",
			"AND2",
			"AND",
			"MUL",
			"AND",
			"STRH",
			"AND",
			"UNDEFINED",
			"AND",
			"UNDEFINED"
		]);
		//1
		generateMap1([
			"ANDS",
			"ANDS2",
			"ANDS",
			"ANDS2",
			"ANDS",
			"ANDS2",
			"ANDS",
			"ANDS2",
			"ANDS",
			"MULS",
			"ANDS",
			"LDRH",
			"ANDS",
			"LDRSB",
			"ANDS",
			"LDRSH"
		]);
		//2
		generateMap1([
			"EOR",
			"EOR2",
			"EOR",
			"EOR2",
			"EOR",
			"EOR2",
			"EOR",
			"EOR2",
			"EOR",
			"MLA",
			"EOR",
			"STRH",
			"EOR",
			"UNDEFINED",
			"EOR",
			"UNDEFINED"
		]);
		//3
		generateMap1([
			"EORS",
			"EORS2",
			"EORS",
			"EORS2",
			"EORS",
			"EORS2",
			"EORS",
			"EORS2",
			"EORS",
			"MLAS",
			"EORS",
			"LDRH",
			"EORS",
			"LDRSB",
			"EORS",
			"LDRSH"
		]);
		//4
		generateMap1([
			"SUB",
			"SUB2",
			"SUB",
			"SUB2",
			"SUB",
			"SUB2",
			"SUB",
			"SUB2",
			"SUB",
			"UNDEFINED",
			"SUB",
			"STRH",
			"SUB",
			"UNDEFINED",
			"SUB",
			"UNDEFINED"
		]);
		//5
		generateMap1([
			"SUBS",
			"SUBS2",
			"SUBS",
			"SUBS2",
			"SUBS",
			"SUBS2",
			"SUBS",
			"SUBS2",
			"SUBS",
			"UNDEFINED",
			"SUBS",
			"LDRH",
			"SUBS",
			"LDRSB",
			"SUBS",
			"LDRSH"
		]);
		//6
		generateMap1([
			"RSB",
			"RSB2",
			"RSB",
			"RSB2",
			"RSB",
			"RSB2",
			"RSB",
			"RSB2",
			"RSB",
			"UNDEFINED",
			"RSB",
			"STRH",
			"RSB",
			"UNDEFINED",
			"RSB",
			"UNDEFINED"
		]);
		//7
		generateMap1([
			"RSBS",
			"RSBS2",
			"RSBS",
			"RSBS2",
			"RSBS",
			"RSBS2",
			"RSBS",
			"RSBS2",
			"RSBS",
			"UNDEFINED",
			"RSBS",
			"LDRH",
			"RSBS",
			"LDRSB",
			"RSBS",
			"LDRSH"
		]);
		//8
		generateMap1([
			"ADD",
			"ADD2",
			"ADD",
			"ADD2",
			"ADD",
			"ADD2",
			"ADD",
			"ADD2",
			"ADD",
			"UMULL",
			"ADD",
			"STRH",
			"ADD",
			"UNDEFINED",
			"ADD",
			"UNDEFINED"
		]);
		//9
		generateMap1([
			"ADDS",
			"ADDS2",
			"ADDS",
			"ADDS2",
			"ADDS",
			"ADDS2",
			"ADDS",
			"ADDS2",
			"ADDS",
			"UMULLS",
			"ADDS",
			"LDRH",
			"ADDS",
			"LDRSB",
			"ADDS",
			"LDRSH"
		]);
		//A
		generateMap1([
			"ADC",
			"ADC2",
			"ADC",
			"ADC2",
			"ADC",
			"ADC2",
			"ADC",
			"ADC2",
			"ADC",
			"UMLAL",
			"ADC",
			"STRH",
			"ADC",
			"UNDEFINED",
			"ADC",
			"UNDEFINED"
		]);
		//B
		generateMap1([
			"ADCS",
			"ADCS2",
			"ADCS",
			"ADCS2",
			"ADCS",
			"ADCS2",
			"ADCS",
			"ADCS2",
			"ADCS",
			"UMLALS",
			"ADCS",
			"LDRH",
			"ADCS",
			"LDRSB",
			"ADCS",
			"LDRSH"
		]);
		//C
		generateMap1([
			"SBC",
			"SBC2",
			"SBC",
			"SBC2",
			"SBC",
			"SBC2",
			"SBC",
			"SBC2",
			"SBC",
			"SMULL",
			"SBC",
			"STRH",
			"SBC",
			"UNDEFINED",
			"SBC",
			"UNDEFINED"
		]);
		//D
		generateMap1([
			"SBCS",
			"SBCS2",
			"SBCS",
			"SBCS2",
			"SBCS",
			"SBCS2",
			"SBCS",
			"SBCS2",
			"SBCS",
			"SMULLS",
			"SBCS",
			"LDRH",
			"SBCS",
			"LDRSB",
			"SBCS",
			"LDRSH"
		]);
		//E
		generateMap1([
			"RSC",
			"RSC2",
			"RSC",
			"RSC2",
			"RSC",
			"RSC2",
			"RSC",
			"RSC2",
			"RSC",
			"SMLAL",
			"RSC",
			"STRH",
			"RSC",
			"UNDEFINED",
			"RSC",
			"UNDEFINED"
		]);
		//F
		generateMap1([
			"RSCS",
			"RSCS2",
			"RSCS",
			"RSCS2",
			"RSCS",
			"RSCS2",
			"RSCS",
			"RSCS2",
			"RSCS",
			"SMLALS",
			"RSCS",
			"LDRH",
			"RSCS",
			"LDRSB",
			"RSCS",
			"LDRSH"
		]);
		//10
		generateMap1([
			"MRS",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"SWP",
			"UNDEFINED",
			"STRH2",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED"
		]);
		//11
		generateMap1([
			"TSTS",
			"TSTS2",
			"TSTS",
			"TSTS2",
			"TSTS",
			"TSTS2",
			"TSTS",
			"TSTS2",
			"TSTS",
			"UNDEFINED",
			"TSTS",
			"LDRH2",
			"TSTS",
			"LDRSB2",
			"TSTS",
			"LDRSH2"
		]);
		//12
		generateMap1([
			"MSR",
			"BX",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"STRH2",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED"
		]);
		//13
		generateMap1([
			"TEQS",
			"TEQS2",
			"TEQS",
			"TEQS2",
			"TEQS",
			"TEQS2",
			"TEQS",
			"TEQS2",
			"TEQS",
			"UNDEFINED",
			"TEQS",
			"LDRH2",
			"TEQS",
			"LDRSB2",
			"TEQS",
			"LDRSH2"
		]);
		//14
		generateMap1([
			"MRS",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"SWPB",
			"UNDEFINED",
			"STRH2",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED"
		]);
		//15
		generateMap1([
			"CMPS",
			"CMPS2",
			"CMPS",
			"CMPS2",
			"CMPS",
			"CMPS2",
			"CMPS",
			"CMPS2",
			"CMPS",
			"UNDEFINED",
			"CMPS",
			"LDRH2",
			"CMPS",
			"LDRSB2",
			"CMPS",
			"LDRSH2"
		]);
		//16
		generateMap1([
			"MSR",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"STRH2",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED",
			"UNDEFINED"
		]);
		//17
		generateMap1([
			"CMNS",
			"CMNS2",
			"CMNS",
			"CMNS2",
			"CMNS",
			"CMNS2",
			"CMNS",
			"CMNS2",
			"CMNS",
			"UNDEFINED",
			"CMNS",
			"LDRH2",
			"CMNS",
			"LDRSB2",
			"CMNS",
			"LDRSH2"
		]);
		//18
		generateMap1([
			"ORR",
			"ORR2",
			"ORR",
			"ORR2",
			"ORR",
			"ORR2",
			"ORR",
			"ORR2",
			"ORR",
			"UNDEFINED",
			"ORR",
			"STRH2",
			"ORR",
			"UNDEFINED",
			"ORR",
			"UNDEFINED"
		]);
		//19
		generateMap1([
			"ORRS",
			"ORRS2",
			"ORRS",
			"ORRS2",
			"ORRS",
			"ORRS2",
			"ORRS",
			"ORRS2",
			"ORRS",
			"UNDEFINED",
			"ORRS",
			"LDRH2",
			"ORRS",
			"LDRSB2",
			"ORRS",
			"LDRSH2"
		]);
		//1A
		generateMap1([
			"MOV",
			"MOV2",
			"MOV",
			"MOV2",
			"MOV",
			"MOV2",
			"MOV",
			"MOV2",
			"MOV",
			"UNDEFINED",
			"MOV",
			"STRH2",
			"MOV",
			"UNDEFINED",
			"MOV",
			"UNDEFINED"
		]);
		//1B
		generateMap1([
			"MOVS",
			"MOVS2",
			"MOVS",
			"MOVS2",
			"MOVS",
			"MOVS2",
			"MOVS",
			"MOVS2",
			"MOVS",
			"UNDEFINED",
			"MOVS",
			"LDRH2",
			"MOVS",
			"LDRSB2",
			"MOVS",
			"LDRSH2"
		]);
		//1C
		generateMap1([
			"BIC",
			"BIC2",
			"BIC",
			"BIC2",
			"BIC",
			"BIC2",
			"BIC",
			"BIC2",
			"BIC",
			"UNDEFINED",
			"BIC",
			"STRH2",
			"BIC",
			"UNDEFINED",
			"BIC",
			"UNDEFINED"
		]);
		//1D
		generateMap1([
			"BICS",
			"BICS2",
			"BICS",
			"BICS2",
			"BICS",
			"BICS2",
			"BICS",
			"BICS2",
			"BICS",
			"UNDEFINED",
			"BICS",
			"LDRH2",
			"BICS",
			"LDRSB2",
			"BICS",
			"LDRSH2"
		]);
		//1E
		generateMap1([
			"MVN",
			"MVN2",
			"MVN",
			"MVN2",
			"MVN",
			"MVN2",
			"MVN",
			"MVN2",
			"MVN",
			"UNDEFINED",
			"MVN",
			"STRH2",
			"MVN",
			"UNDEFINED",
			"MVN",
			"UNDEFINED"
		]);
		//1F
		generateMap1([
			"MVNS",
			"MVNS2",
			"MVNS",
			"MVNS2",
			"MVNS",
			"MVNS2",
			"MVNS",
			"MVNS2",
			"MVNS",
			"UNDEFINED",
			"MVNS",
			"LDRH2",
			"MVNS",
			"LDRSB2",
			"MVNS",
			"LDRSH2"
		]);
		//20
		generateMap2("AND");
		//21
		generateMap2("ANDS");
		//22
		generateMap2("EOR");
		//23
		generateMap2("EORS");
		//24
		generateMap2("SUB");
		//25
		generateMap2("SUBS");
		//26
		generateMap2("RSB");
		//27
		generateMap2("RSBS");
		//28
		generateMap2("ADD");
		//29
		generateMap2("ADDS");
		//2A
		generateMap2("ADC");
		//2B
		generateMap2("ADCS");
		//2C
		generateMap2("SBC");
		//2D
		generateMap2("SBCS");
		//2E
		generateMap2("RSC");
		//2F
		generateMap2("RSCS");
		//30
		generateMap2("UNDEFINED");
		//31
		generateMap2("TSTS");
		//32
		generateMap2("MSR");
		//33
		generateMap2("TEQS");
		//34
		generateMap2("UNDEFINED");
		//35
		generateMap2("CMPS");
		//36
		generateMap2("MSR");
		//37
		generateMap2("CMNS");
		//38
		generateMap2("ORR");
		//39
		generateMap2("ORRS");
		//3A
		generateMap2("MOV");
		//3B
		generateMap2("MOVS");
		//3C
		generateMap2("BIC");
		//3D
		generateMap2("BICS");
		//3E
		generateMap2("MVN");
		//3F
		generateMap2("MVNS");
		//40
		generateMap2("STR");
		//41
		generateMap2("LDR");
		//42
		generateMap2("STRT");
		//43
		generateMap2("LDRT");
		//44
		generateMap2("STRB");
		//45
		generateMap2("LDRB");
		//46
		generateMap2("STRBT");
		//47
		generateMap2("LDRBT");
		//48
		generateMap2("STR");
		//49
		generateMap2("LDR");
		//4A
		generateMap2("STRT");
		//4B
		generateMap2("LDRT");
		//4C
		generateMap2("STRB");
		//4D
		generateMap2("LDRB");
		//4E
		generateMap2("STRBT");
		//4F
		generateMap2("LDRBT");
		//50
		generateMap2("STR4");
		//51
		generateMap2("LDR4");
		//52
		generateMap2("STR4");
		//53
		generateMap2("LDR4");
		//54
		generateMap2("STRB4");
		//55
		generateMap2("LDRB4");
		//56
		generateMap2("STRB4");
		//57
		generateMap2("LDRB4");
		//58
		generateMap2("STR4");
		//59
		generateMap2("LDR4");
		//5A
		generateMap2("STR4");
		//5B
		generateMap2("LDR4");
		//5C
		generateMap2("STRB4");
		//5D
		generateMap2("LDRB4");
		//5E
		generateMap2("STRB4");
		//5F
		generateMap2("LDRB4");
		//60-6F
		generateStoreLoadInstructionSector1();
		//70-7F
		generateStoreLoadInstructionSector2();
		//80-9F
		generateMap4("LoadStoreMultiple");
		//A0-AF
		generateMap3("B");
		//B0-BF
		generateMap3("BL");
		//C0-EF
		generateMap5("UNDEFINED");
		//F0-FF
		generateMap3("SWI");
		//Set to prototype:
		ARMInstructionSet.prototype.instructionMap = instructionMap;
	}

	function compileARMInstructionDecodeOpcodeSwitch() {
		var opcodeNameMap = {};
		var code = "switch (this.instructionMap[((this.execute >> 16) & 0xFF0) | ((this.execute >> 4) & 0xF)] & 0xFF) {";
		for (var opcodeNumber = 0; opcodeNumber < pseudoCodes.length; ++opcodeNumber) {
			var opcodeName = pseudoCodes[opcodeNumber];
			opcodeNameMap[opcodeName] = opcodeNumber;
			code += "case " + opcodeNumber + ":{this." + opcodeName + "();break};";
		}
		code += "default:{this.UNDEFINED()}}";
		opcodeNameMap["UNDEFINED"] = opcodeNumber;
		ARMInstructionSet.prototype.executeDecoded = Function(code);
		return opcodeNameMap;
	}
	compileARMInstructionDecodeOpcodeMap(compileARMInstructionDecodeOpcodeSwitch());
}
compileARMInstructionDecodeMap();





"use strict";
/*
 Copyright (C) 2012-2014 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function THUMBInstructionSet(CPUCore) {
	this.CPUCore = CPUCore;
	this.initialize();
}
THUMBInstructionSet.prototype.initialize = function () {
	this.wait = this.CPUCore.wait;
	this.registers = this.CPUCore.registers;
	this.branchFlags = this.CPUCore.branchFlags;
	this.fetch = 0;
	this.decode = 0;
	this.execute = 0;
	this.memory = this.CPUCore.memory;
}
THUMBInstructionSet.prototype.executeIteration = function () {
	//Push the new fetch access:
	this.fetch = this.memory.memoryReadCPU16(this.readPC() | 0) | 0;
	//Execute Instruction:
	this.executeDecoded();
	//Update the pipelining state:
	this.execute = this.decode | 0;
	this.decode = this.fetch | 0;
}
THUMBInstructionSet.prototype.executeDecoded = function () {
	/*
	 Instruction Decode Pattern:
	  X = Possible opcode bit; N = Data Bit, definitely not an opcode bit
	 OPCODE: XXXXXXXXXXNNNNNN

	 Since many of those "X"s are redundant and possibly data, we can "process"
	 it and use a table to further decide what unique opcode it is, leaving us with
	 a dense switch statement. Not "processing" the opcode beforehand would leave us
	 with a 10 bit wide switch, which is slow in JS, and using a function in array computed
	 goto trick is not optimal in JavaScript.
	 */
	switch (this.instructionMap[this.execute >> 6] & 0xFF) { //Leave the "& 0xFF" there, it's a uint8 type guard.
		case 0:
			this.CMPimm8();
			break;
		case 1:
			this.BEQ();
			break;
		case 2:
			this.MOVH_LH();
			break;
		case 3:
			this.LDRimm5();
			break;
		case 4:
			this.AND();
			break;
		case 5:
			this.LDRBimm5();
			break;
		case 6:
			this.LSLimm();
			break;
		case 7:
			this.LSRimm();
			break;
		case 8:
			this.MOVimm8();
			break;
		case 9:
			this.CMP();
			break;
		case 10:
			this.LDRSP();
			break;
		case 11:
			this.ADDimm3();
			break;
		case 12:
			this.ADDreg();
			break;
		case 13:
			this.STRSP();
			break;
		case 14:
			this.B();
			break;
		case 15:
			this.LDRPC();
			break;
		case 16:
			this.MOVH_HL();
			break;
		case 17:
			this.ADDimm8();
			break;
		case 18:
			this.SUBreg();
			break;
		case 19:
			this.BCC();
			break;
		case 20:
			this.STRimm5();
			break;
		case 21:
			this.ORR();
			break;
		case 22:
			this.LDRHimm5();
			break;
		case 23:
			this.BCS();
			break;
		case 24:
			this.BNE();
			break;
		case 25:
			this.BGE();
			break;
		case 26:
			this.POP();
			break;
		case 27:
			this.ADDH_HL();
			break;
		case 28:
			this.STRHimm5();
			break;
		case 29:
			this.BLE();
			break;
		case 30:
			this.ASRimm();
			break;
		case 31:
			this.MUL();
			break;
		case 32:
			this.BLsetup();
			break;
		case 33:
			this.BLoff();
			break;
		case 34:
			this.BGT();
			break;
		case 35:
			this.STRHreg();
			break;
		case 36:
			this.LDRHreg();
			break;
		case 37:
			this.BX_L();
			break;
		case 38:
			this.BLT();
			break;
		case 39:
			this.ADDSPimm7();
			break;
		case 40:
			this.PUSHlr();
			break;
		case 41:
			this.PUSH();
			break;
		case 42:
			this.SUBimm8();
			break;
		case 43:
			this.ROR();
			break;
		case 44:
			this.LDRSHreg();
			break;
		case 45:
			this.STRBimm5();
			break;
		case 46:
			this.NEG();
			break;
		case 47:
			this.BHI();
			break;
		case 48:
			this.TST();
			break;
		case 49:
			this.BX_H();
			break;
		case 50:
			this.STMIA();
			break;
		case 51:
			this.BLS();
			break;
		case 52:
			this.SWI();
			break;
		case 53:
			this.LDMIA();
			break;
		case 54:
			this.MOVH_HH();
			break;
		case 55:
			this.LSL();
			break;
		case 56:
			this.POPpc();
			break;
		case 57:
			this.LSR();
			break;
		case 58:
			this.CMPH_LH();
			break;
		case 59:
			this.EOR();
			break;
		case 60:
			this.SUBimm3();
			break;
		case 61:
			this.ADDH_LH();
			break;
		case 62:
			this.BPL();
			break;
		case 63:
			this.CMPH_HL();
			break;
		case 64:
			this.ADDPC();
			break;
		case 65:
			this.LDRSBreg();
			break;
		case 66:
			this.BIC();
			break;
		case 67:
			this.ADDSP();
			break;
		case 68:
			this.MVN();
			break;
		case 69:
			this.ASR();
			break;
		case 70:
			this.LDRreg();
			break;
		case 71:
			this.ADC();
			break;
		case 72:
			this.SBC();
			break;
		case 73:
			this.BMI();
			break;
		case 74:
			this.STRreg();
			break;
		case 75:
			this.CMN();
			break;
		case 76:
			this.LDRBreg();
			break;
		case 77:
			this.ADDH_HH();
			break;
		case 78:
			this.CMPH_HH();
			break;
		case 79:
			this.STRBreg();
			break;
		case 80:
			this.BVS();
			break;
		case 81:
			this.BVC();
			break;
		default:
			this.UNDEFINED();
	}
}
THUMBInstructionSet.prototype.executeBubble = function () {
	//Push the new fetch access:
	this.fetch = this.memory.memoryReadCPU16(this.readPC() | 0) | 0;
	//Update the Program Counter:
	this.incrementProgramCounter();
	//Update the pipelining state:
	this.execute = this.decode | 0;
	this.decode = this.fetch | 0;
}
THUMBInstructionSet.prototype.incrementProgramCounter = function () {
	//Increment The Program Counter:
	this.registers[15] = ((this.registers[15] | 0) + 2) | 0;
}
THUMBInstructionSet.prototype.readLowRegister = function (address) {
	//Low register read:
	address = address | 0;
	return this.registers[address & 0x7] | 0;
}
THUMBInstructionSet.prototype.read0OffsetLowRegister = function () {
	//Low register read at 0 bit offset:
	return this.readLowRegister(this.execute | 0) | 0;
}
THUMBInstructionSet.prototype.read3OffsetLowRegister = function () {
	//Low register read at 3 bit offset:
	return this.readLowRegister(this.execute >> 3) | 0;
}
THUMBInstructionSet.prototype.read6OffsetLowRegister = function () {
	//Low register read at 6 bit offset:
	return this.readLowRegister(this.execute >> 6) | 0;
}
THUMBInstructionSet.prototype.read8OffsetLowRegister = function () {
	//Low register read at 8 bit offset:
	return this.readLowRegister(this.execute >> 8) | 0;
}
THUMBInstructionSet.prototype.readHighRegister = function (address) {
	//High register read:
	address = address | 0x8;
	return this.registers[address & 0xF] | 0;
}
THUMBInstructionSet.prototype.writeLowRegister = function (address, data) {
	//Low register write:
	address = address | 0;
	data = data | 0;
	this.registers[address & 0x7] = data | 0;
}
THUMBInstructionSet.prototype.write0OffsetLowRegister = function (data) {
	//Low register write at 0 bit offset:
	data = data | 0;
	this.writeLowRegister(this.execute | 0, data | 0);
}
THUMBInstructionSet.prototype.write8OffsetLowRegister = function (data) {
	//Low register write at 8 bit offset:
	data = data | 0;
	this.writeLowRegister(this.execute >> 8, data | 0);
}
THUMBInstructionSet.prototype.guardHighRegisterWrite = function (data) {
	data = data | 0;
	var address = 0x8 | (this.execute & 0x7);
	if ((address | 0) == 0xF) {
		//We performed a branch:
		this.CPUCore.branch(data & -2);
	} else {
		//Regular Data Write:
		this.registers[address & 0xF] = data | 0;
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.writeSP = function (data) {
	//Update the stack pointer:
	data = data | 0;
	this.registers[0xD] = data | 0;
}
THUMBInstructionSet.prototype.SPDecrementWord = function () {
	//Decrement the stack pointer by one word:
	this.registers[0xD] = ((this.registers[0xD] | 0) - 4) | 0;
}
THUMBInstructionSet.prototype.SPIncrementWord = function () {
	//Increment the stack pointer by one word:
	this.registers[0xD] = ((this.registers[0xD] | 0) + 4) | 0;
}
THUMBInstructionSet.prototype.writeLR = function (data) {
	//Update the link register:
	data = data | 0;
	this.registers[0xE] = data | 0;
}
THUMBInstructionSet.prototype.writePC = function (data) {
	data = data | 0;
	//We performed a branch:
	//Update the program counter to branch address:
	this.CPUCore.branch(data & -2);
}
THUMBInstructionSet.prototype.offsetPC = function () {
	//We performed a branch:
	//Update the program counter to branch address:
	this.CPUCore.branch(((this.readPC() | 0) + ((this.execute << 24) >> 23)) | 0);
}
THUMBInstructionSet.prototype.getLR = function () {
	//Read back the value for the LR register upon Exception:
	return ((this.readPC() | 0) - 2) | 0;
}
THUMBInstructionSet.prototype.getIRQLR = function () {
	//Read back the value for the LR register upon IRQ:
	return this.readPC() | 0;
}
THUMBInstructionSet.prototype.readSP = function () {
	//Read back the current SP:
	return this.registers[0xD] | 0;
}
THUMBInstructionSet.prototype.readLR = function () {
	//Read back the current LR:
	return this.registers[0xE] | 0;
}
THUMBInstructionSet.prototype.readPC = function () {
	//Read back the current PC:
	return this.registers[0xF] | 0;
}
THUMBInstructionSet.prototype.getCurrentFetchValue = function () {
	return this.fetch | (this.fetch << 16);
}
THUMBInstructionSet.prototype.getSWICode = function () {
	return this.execute & 0xFF;
}
THUMBInstructionSet.prototype.LSLimm = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var offset = (this.execute >> 6) & 0x1F;
	if ((offset | 0) > 0) {
		//CPSR Carry is set by the last bit shifted out:
		this.branchFlags.setCarry((source << (((offset | 0) - 1) | 0)) | 0);
		//Perform shift:
		source = source << (offset | 0);
	}
	//Perform CPSR updates for N and Z (But not V):
	this.branchFlags.setNZInt(source | 0);
	//Update destination register:
	this.write0OffsetLowRegister(source | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LSRimm = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var offset = (this.execute >> 6) & 0x1F;
	if ((offset | 0) > 0) {
		//CPSR Carry is set by the last bit shifted out:
		this.branchFlags.setCarry((source >> (((offset | 0) - 1) | 0)) << 31);
		//Perform shift:
		source = (source >>> (offset | 0)) | 0;
	} else {
		this.branchFlags.setCarry(source | 0);
		source = 0;
	}
	//Perform CPSR updates for N and Z (But not V):
	this.branchFlags.setNZInt(source | 0);
	//Update destination register:
	this.write0OffsetLowRegister(source | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ASRimm = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var offset = (this.execute >> 6) & 0x1F;
	if ((offset | 0) > 0) {
		//CPSR Carry is set by the last bit shifted out:
		this.branchFlags.setCarry((source >> (((offset | 0) - 1) | 0)) << 31);
		//Perform shift:
		source = source >> (offset | 0);
	} else {
		this.branchFlags.setCarry(source | 0);
		source = source >> 0x1F;
	}
	//Perform CPSR updates for N and Z (But not V):
	this.branchFlags.setNZInt(source | 0);
	//Update destination register:
	this.write0OffsetLowRegister(source | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDreg = function () {
	var operand1 = this.read3OffsetLowRegister() | 0;
	var operand2 = this.read6OffsetLowRegister() | 0;
	//Update destination register:
	this.write0OffsetLowRegister(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.SUBreg = function () {
	var operand1 = this.read3OffsetLowRegister() | 0;
	var operand2 = this.read6OffsetLowRegister() | 0;
	//Update destination register:
	this.write0OffsetLowRegister(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDimm3 = function () {
	var operand1 = this.read3OffsetLowRegister() | 0;
	var operand2 = (this.execute >> 6) & 0x7;
	//Update destination register:
	this.write0OffsetLowRegister(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.SUBimm3 = function () {
	var operand1 = this.read3OffsetLowRegister() | 0;
	var operand2 = (this.execute >> 6) & 0x7;
	//Update destination register:
	this.write0OffsetLowRegister(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MOVimm8 = function () {
	//Get the 8-bit value to move into the register:
	var result = this.execute & 0xFF;
	this.branchFlags.setNegativeFalse();
	this.branchFlags.setZero(result | 0);
	//Update destination register:
	this.write8OffsetLowRegister(result | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMPimm8 = function () {
	//Compare an 8-bit immediate value with a register:
	var operand1 = this.read8OffsetLowRegister() | 0;
	var operand2 = this.execute & 0xFF;
	this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDimm8 = function () {
	//Add an 8-bit immediate value with a register:
	var operand1 = this.read8OffsetLowRegister() | 0;
	var operand2 = this.execute & 0xFF;
	this.write8OffsetLowRegister(this.branchFlags.setADDFlags(operand1 | 0, operand2 | 0) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.SUBimm8 = function () {
	//Subtract an 8-bit immediate value from a register:
	var operand1 = this.read8OffsetLowRegister() | 0;
	var operand2 = this.execute & 0xFF;
	this.write8OffsetLowRegister(this.branchFlags.setSUBFlags(operand1 | 0, operand2 | 0) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.AND = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var destination = this.read0OffsetLowRegister() | 0;
	//Perform bitwise AND:
	var result = source & destination;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register:
	this.write0OffsetLowRegister(result | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.EOR = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var destination = this.read0OffsetLowRegister() | 0;
	//Perform bitwise EOR:
	var result = source ^ destination;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register:
	this.write0OffsetLowRegister(result | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LSL = function () {
	var source = this.read3OffsetLowRegister() & 0xFF;
	var destination = this.read0OffsetLowRegister() | 0;
	//Check to see if we need to update CPSR:
	if ((source | 0) > 0) {
		if ((source | 0) < 0x20) {
			//Shift the register data left:
			this.branchFlags.setCarry(destination << (((source | 0) - 1) | 0));
			destination = destination << (source | 0);
		} else if ((source | 0) == 0x20) {
			//Shift bit 0 into carry:
			this.branchFlags.setCarry(destination << 31);
			destination = 0;
		} else {
			//Everything Zero'd:
			this.branchFlags.setCarryFalse();
			destination = 0;
		}
	}
	//Perform CPSR updates for N and Z (But not V):
	this.branchFlags.setNZInt(destination | 0);
	//Update destination register:
	this.write0OffsetLowRegister(destination | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LSR = function () {
	var source = this.read3OffsetLowRegister() & 0xFF;
	var destination = this.read0OffsetLowRegister() | 0;
	//Check to see if we need to update CPSR:
	if ((source | 0) > 0) {
		if ((source | 0) < 0x20) {
			//Shift the register data right logically:
			this.branchFlags.setCarry((destination >> (((source | 0) - 1) | 0)) << 31);
			destination = (destination >>> (source | 0)) | 0;
		} else if (source == 0x20) {
			//Shift bit 31 into carry:
			this.branchFlags.setCarry(destination | 0);
			destination = 0;
		} else {
			//Everything Zero'd:
			this.branchFlags.setCarryFalse();
			destination = 0;
		}
	}
	//Perform CPSR updates for N and Z (But not V):
	this.branchFlags.setNZInt(destination | 0);
	//Update destination register:
	this.write0OffsetLowRegister(destination | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ASR = function () {
	var source = this.read3OffsetLowRegister() & 0xFF;
	var destination = this.read0OffsetLowRegister() | 0;
	//Check to see if we need to update CPSR:
	if ((source | 0) > 0) {
		if ((source | 0) < 0x20) {
			//Shift the register data right arithmetically:
			this.branchFlags.setCarry((destination >> (((source | 0) - 1) | 0)) << 31);
			destination = destination >> (source | 0);
		} else {
			//Set all bits with bit 31:
			this.branchFlags.setCarry(destination | 0);
			destination = destination >> 0x1F;
		}
	}
	//Perform CPSR updates for N and Z (But not V):
	this.branchFlags.setNZInt(destination | 0);
	//Update destination register:
	this.write0OffsetLowRegister(destination | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADC = function () {
	var operand1 = this.read0OffsetLowRegister() | 0;
	var operand2 = this.read3OffsetLowRegister() | 0;
	//Update destination register:
	this.write0OffsetLowRegister(this.branchFlags.setADCFlags(operand1 | 0, operand2 | 0) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.SBC = function () {
	var operand1 = this.read0OffsetLowRegister() | 0;
	var operand2 = this.read3OffsetLowRegister() | 0;
	//Update destination register:
	this.write0OffsetLowRegister(this.branchFlags.setSBCFlags(operand1 | 0, operand2 | 0) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ROR = function () {
	var source = this.read3OffsetLowRegister() & 0xFF;
	var destination = this.read0OffsetLowRegister() | 0;
	if ((source | 0) > 0) {
		source = source & 0x1F;
		if ((source | 0) > 0) {
			//CPSR Carry is set by the last bit shifted out:
			this.branchFlags.setCarry((destination >> ((source - 1) | 0)) << 31);
			//Perform rotate:
			destination = (destination << ((0x20 - (source | 0)) | 0)) | (destination >>> (source | 0));
		} else {
			this.branchFlags.setCarry(destination | 0);
		}
	}
	//Perform CPSR updates for N and Z (But not V):
	this.branchFlags.setNZInt(destination | 0);
	//Update destination register:
	this.write0OffsetLowRegister(destination | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.TST = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var destination = this.read0OffsetLowRegister() | 0;
	//Perform bitwise AND:
	var result = source & destination;
	this.branchFlags.setNZInt(result | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.NEG = function () {
	var source = this.read3OffsetLowRegister() | 0;
	if ((source | 0) != -0x80000000) {
		//Perform Subtraction:
		source = (-(source | 0)) | 0;
		this.branchFlags.setOverflowFalse();
	} else {
		//Negation of MIN_INT overflows!
		this.branchFlags.setOverflowTrue();
	}
	this.branchFlags.setNZInt(source | 0);
	//Update destination register:
	this.write0OffsetLowRegister(source | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMP = function () {
	//Compare two registers:
	var operand1 = this.read0OffsetLowRegister() | 0;
	var operand2 = this.read3OffsetLowRegister() | 0;
	this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMN = function () {
	//Compare two registers:
	var operand1 = this.read0OffsetLowRegister() | 0;
	var operand2 = this.read3OffsetLowRegister() | 0;
	this.branchFlags.setCMNFlags(operand1 | 0, operand2 | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ORR = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var destination = this.read0OffsetLowRegister() | 0;
	//Perform bitwise OR:
	var result = source | destination;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register:
	this.write0OffsetLowRegister(result | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MUL = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var destination = this.read0OffsetLowRegister() | 0;
	//Perform MUL32:
	var result = this.CPUCore.performMUL32(source | 0, destination | 0, 0) | 0;
	this.branchFlags.setCarryFalse();
	this.branchFlags.setNZInt(result | 0);
	//Update destination register:
	this.write0OffsetLowRegister(result | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.BIC = function () {
	var source = this.read3OffsetLowRegister() | 0;
	var destination = this.read0OffsetLowRegister() | 0;
	//Perform bitwise AND with a bitwise NOT on source:
	var result = (~source) & destination;
	this.branchFlags.setNZInt(result | 0);
	//Update destination register:
	this.write0OffsetLowRegister(result | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MVN = function () {
	//Perform bitwise NOT on source:
	var source = ~this.read3OffsetLowRegister();
	this.branchFlags.setNZInt(source | 0);
	//Update destination register:
	this.write0OffsetLowRegister(source | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDH_LH = function () {
	var operand1 = this.read0OffsetLowRegister() | 0;
	var operand2 = this.readHighRegister(this.execute >> 3) | 0;
	//Perform Addition:
	//Update destination register:
	this.write0OffsetLowRegister(((operand1 | 0) + (operand2 | 0)) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDH_HL = function () {
	var operand1 = this.readHighRegister(this.execute | 0) | 0;
	var operand2 = this.read3OffsetLowRegister() | 0;
	//Perform Addition:
	//Update destination register:
	this.guardHighRegisterWrite(((operand1 | 0) + (operand2 | 0)) | 0);
}
THUMBInstructionSet.prototype.ADDH_HH = function () {
	var operand1 = this.readHighRegister(this.execute | 0) | 0;
	var operand2 = this.readHighRegister(this.execute >> 3) | 0;
	//Perform Addition:
	//Update destination register:
	this.guardHighRegisterWrite(((operand1 | 0) + (operand2 | 0)) | 0);
}
THUMBInstructionSet.prototype.CMPH_LH = function () {
	//Compare two registers:
	var operand1 = this.read0OffsetLowRegister() | 0;
	var operand2 = this.readHighRegister(this.execute >> 3) | 0;
	this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMPH_HL = function () {
	//Compare two registers:
	var operand1 = this.readHighRegister(this.execute | 0) | 0;
	var operand2 = this.read3OffsetLowRegister() | 0;
	this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.CMPH_HH = function () {
	//Compare two registers:
	var operand1 = this.readHighRegister(this.execute | 0) | 0;
	var operand2 = this.readHighRegister(this.execute >> 3) | 0;
	this.branchFlags.setCMPFlags(operand1 | 0, operand2 | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MOVH_LH = function () {
	//Move a register to another register:
	this.write0OffsetLowRegister(this.readHighRegister(this.execute >> 3) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.MOVH_HL = function () {
	//Move a register to another register:
	this.guardHighRegisterWrite(this.read3OffsetLowRegister() | 0);
}
THUMBInstructionSet.prototype.MOVH_HH = function () {
	//Move a register to another register:
	this.guardHighRegisterWrite(this.readHighRegister(this.execute >> 3) | 0);
}
THUMBInstructionSet.prototype.BX_L = function () {
	//Branch & eXchange:
	var address = this.read3OffsetLowRegister() | 0;
	if ((address & 0x1) == 0) {
		//Enter ARM mode:
		this.CPUCore.enterARM();
		this.CPUCore.branch(address & -0x4);
	} else {
		//Stay in THUMB mode:
		this.CPUCore.branch(address & -0x2);
	}
}
THUMBInstructionSet.prototype.BX_H = function () {
	//Branch & eXchange:
	var address = this.readHighRegister(this.execute >> 3) | 0;
	if ((address & 0x1) == 0) {
		//Enter ARM mode:
		this.CPUCore.enterARM();
		this.CPUCore.branch(address & -0x4);
	} else {
		//Stay in THUMB mode:
		this.CPUCore.branch(address & -0x2);
	}
}
THUMBInstructionSet.prototype.LDRPC = function () {
	//PC-Relative Load
	var data = this.CPUCore.read32(((this.readPC() & -3) + ((this.execute & 0xFF) << 2)) | 0) | 0;
	this.write8OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.STRreg = function () {
	//Store Word From Register
	var address = ((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0;
	this.CPUCore.write32(address | 0, this.read0OffsetLowRegister() | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRHreg = function () {
	//Store Half-Word From Register
	var address = ((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0;
	this.CPUCore.write16(address | 0, this.read0OffsetLowRegister() | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.STRBreg = function () {
	//Store Byte From Register
	var address = ((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0;
	this.CPUCore.write8(address | 0, this.read0OffsetLowRegister() | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRSBreg = function () {
	//Load Signed Byte Into Register
	var data = (this.CPUCore.read8(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) << 24) >> 24;
	this.write0OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.LDRreg = function () {
	//Load Word Into Register
	var data = this.CPUCore.read32(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
	this.write0OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.LDRHreg = function () {
	//Load Half-Word Into Register
	var data = this.CPUCore.read16(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
	this.write0OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.LDRBreg = function () {
	//Load Byte Into Register
	var data = this.CPUCore.read8(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
	this.write0OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.LDRSHreg = function () {
	//Load Signed Half-Word Into Register
	var data = (this.CPUCore.read16(((this.read6OffsetLowRegister() | 0) + (this.read3OffsetLowRegister() | 0)) | 0) << 16) >> 16;
	this.write0OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.STRimm5 = function () {
	//Store Word From Register
	var address = (((this.execute >> 4) & 0x7C) + (this.read3OffsetLowRegister() | 0)) | 0;
	this.CPUCore.write32(address | 0, this.read0OffsetLowRegister() | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRimm5 = function () {
	//Load Word Into Register
	var data = this.CPUCore.read32((((this.execute >> 4) & 0x7C) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
	this.write0OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.STRBimm5 = function () {
	//Store Byte From Register
	var address = (((this.execute >> 6) & 0x1F) + (this.read3OffsetLowRegister() | 0)) | 0;
	this.CPUCore.write8(address | 0, this.read0OffsetLowRegister() | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRBimm5 = function () {
	//Load Byte Into Register
	var data = this.CPUCore.read8((((this.execute >> 6) & 0x1F) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
	this.write0OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.STRHimm5 = function () {
	//Store Half-Word From Register
	var address = (((this.execute >> 5) & 0x3E) + (this.read3OffsetLowRegister() | 0)) | 0;
	this.CPUCore.write16(address | 0, this.read0OffsetLowRegister() | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRHimm5 = function () {
	//Load Half-Word Into Register
	var data = this.CPUCore.read16((((this.execute >> 5) & 0x3E) + (this.read3OffsetLowRegister() | 0)) | 0) | 0;
	this.write0OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.STRSP = function () {
	//Store Word From Register
	var address = (((this.execute & 0xFF) << 2) + (this.readSP() | 0)) | 0;
	this.CPUCore.write32(address | 0, this.read8OffsetLowRegister() | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDRSP = function () {
	//Load Word Into Register
	var data = this.CPUCore.read32((((this.execute & 0xFF) << 2) + (this.readSP() | 0)) | 0) | 0;
	this.write8OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.ADDPC = function () {
	//Add PC With Offset Into Register
	var data = ((this.readPC() & -3) + ((this.execute & 0xFF) << 2)) | 0;
	this.write8OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDSP = function () {
	//Add SP With Offset Into Register
	var data = (((this.execute & 0xFF) << 2) + (this.readSP() | 0)) | 0;
	this.write8OffsetLowRegister(data | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.ADDSPimm7 = function () {
	//Add Signed Offset Into SP
	if ((this.execute & 0x80) != 0) {
		this.writeSP(((this.readSP() | 0) - ((this.execute & 0x7F) << 2)) | 0);
	} else {
		this.writeSP(((this.readSP() | 0) + ((this.execute & 0x7F) << 2)) | 0);
	}
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.PUSH = function () {
	//Only initialize the PUSH sequence if the register list is non-empty:
	if ((this.execute & 0xFF) > 0) {
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) onto the stack:
		for (var rListPosition = 7;
			(rListPosition | 0) > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push register onto the stack:
				this.SPDecrementWord();
				this.memory.memoryWrite32(this.readSP() | 0, this.readLowRegister(rListPosition | 0) | 0);
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.PUSHlr = function () {
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	//Push link register onto the stack:
	this.SPDecrementWord();
	this.memory.memoryWrite32(this.readSP() | 0, this.readLR() | 0);
	//Push register(s) onto the stack:
	for (var rListPosition = 7;
		(rListPosition | 0) > -1; rListPosition = ((rListPosition | 0) - 1) | 0) {
		if ((this.execute & (1 << rListPosition)) != 0) {
			//Push register onto the stack:
			this.SPDecrementWord();
			this.memory.memoryWrite32(this.readSP() | 0, this.readLowRegister(rListPosition | 0) | 0);
		}
	}
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.POP = function () {
	//Only initialize the POP sequence if the register list is non-empty:
	if ((this.execute & 0xFF) > 0) {
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//POP stack into register(s):
		for (var rListPosition = 0;
			(rListPosition | 0) < 8; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//POP stack into a register:
				this.writeLowRegister(rListPosition | 0, this.memory.memoryRead32(this.readSP() | 0) | 0);
				this.SPIncrementWord();
			}
		}
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.POPpc = function () {
	//Updating the address bus away from PC fetch:
	this.wait.NonSequentialBroadcast();
	//POP stack into register(s):
	for (var rListPosition = 0;
		(rListPosition | 0) < 8; rListPosition = ((rListPosition | 0) + 1) | 0) {
		if ((this.execute & (1 << rListPosition)) != 0) {
			//POP stack into a register:
			this.writeLowRegister(rListPosition | 0, this.memory.memoryRead32(this.readSP() | 0) | 0);
			this.SPIncrementWord();
		}
	}
	//POP stack into the program counter (r15):
	this.writePC(this.memory.memoryRead32(this.readSP() | 0) | 0);
	this.SPIncrementWord();
	//Updating the address bus back to PC fetch:
	this.wait.NonSequentialBroadcast();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.STMIA = function () {
	//Only initialize the STMIA sequence if the register list is non-empty:
	if ((this.execute & 0xFF) > 0) {
		//Get the base address:
		var currentAddress = this.read8OffsetLowRegister() | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Push register(s) into memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 8; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Push a register into memory:
				this.memory.memoryWrite32(currentAddress | 0, this.readLowRegister(rListPosition | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
		//Store the updated base address back into register:
		this.write8OffsetLowRegister(currentAddress | 0);
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.LDMIA = function () {
	//Only initialize the LDMIA sequence if the register list is non-empty:
	if ((this.execute & 0xFF) > 0) {
		//Get the base address:
		var currentAddress = this.read8OffsetLowRegister() | 0;
		//Updating the address bus away from PC fetch:
		this.wait.NonSequentialBroadcast();
		//Load  register(s) from memory:
		for (var rListPosition = 0;
			(rListPosition | 0) < 8; rListPosition = ((rListPosition | 0) + 1) | 0) {
			if ((this.execute & (1 << rListPosition)) != 0) {
				//Load a register from memory:
				this.writeLowRegister(rListPosition | 0, this.memory.memoryRead32(currentAddress | 0) | 0);
				currentAddress = ((currentAddress | 0) + 4) | 0;
			}
		}
		//Store the updated base address back into register:
		this.write8OffsetLowRegister(currentAddress | 0);
		//Updating the address bus back to PC fetch:
		this.wait.NonSequentialBroadcast();
	}
	//Update PC:
	this.incrementProgramCounter();
	//Internal Cycle:
	this.wait.CPUInternalSingleCyclePrefetch();
}
THUMBInstructionSet.prototype.BEQ = function () {
	//Branch if EQual:
	if ((this.branchFlags.getZero() | 0) == 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BNE = function () {
	//Branch if Not Equal:
	if ((this.branchFlags.getZero() | 0) != 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BCS = function () {
	//Branch if Carry Set:
	if ((this.branchFlags.getCarry() | 0) < 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BCC = function () {
	//Branch if Carry Clear:
	if ((this.branchFlags.getCarry() | 0) >= 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BMI = function () {
	//Branch if Negative Set:
	if ((this.branchFlags.getNegative() | 0) < 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BPL = function () {
	//Branch if Negative Clear:
	if ((this.branchFlags.getNegative() | 0) >= 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BVS = function () {
	//Branch if Overflow Set:
	if ((this.branchFlags.getOverflow() | 0) < 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BVC = function () {
	//Branch if Overflow Clear:
	if ((this.branchFlags.getOverflow() | 0) >= 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BHI = function () {
	//Branch if Carry & Non-Zero:
	if ((this.branchFlags.getCarry() | 0) < 0 && (this.branchFlags.getZero() | 0) != 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BLS = function () {
	//Branch if Carry Clear or is Zero Set:
	if ((this.branchFlags.getCarry() | 0) < 0 && (this.branchFlags.getZero() | 0) != 0) {
		//Update PC:
		this.incrementProgramCounter();
	} else {
		this.offsetPC();
	}
}
THUMBInstructionSet.prototype.BGE = function () {
	//Branch if Negative equal to Overflow
	if ((this.branchFlags.BGE() | 0) >= 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BLT = function () {
	//Branch if Negative NOT equal to Overflow
	if ((this.branchFlags.BGE() | 0) < 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BGT = function () {
	//Branch if Zero Clear and Negative equal to Overflow
	if ((this.branchFlags.getZero() | 0) != 0 && (this.branchFlags.BGE() | 0) >= 0) {
		this.offsetPC();
	} else {
		//Update PC:
		this.incrementProgramCounter();
	}
}
THUMBInstructionSet.prototype.BLE = function () {
	//Branch if Zero Set or Negative NOT equal to Overflow
	if ((this.branchFlags.getZero() | 0) != 0 && (this.branchFlags.BGE() | 0) >= 0) {
		//Update PC:
		this.incrementProgramCounter();
	} else {
		this.offsetPC();
	}
}
THUMBInstructionSet.prototype.SWI = function () {
	//Software Interrupt:
	this.CPUCore.SWI();
}
THUMBInstructionSet.prototype.B = function () {
	//Unconditional Branch:
	//Update the program counter to branch address:
	this.CPUCore.branch(((this.readPC() | 0) + ((this.execute << 21) >> 20)) | 0);
}
THUMBInstructionSet.prototype.BLsetup = function () {
	//Brank with Link (High offset)
	//Update the link register to branch address:
	this.writeLR(((this.readPC() | 0) + ((this.execute << 21) >> 9)) | 0);
	//Update PC:
	this.incrementProgramCounter();
}
THUMBInstructionSet.prototype.BLoff = function () {
	//Brank with Link (Low offset)
	//Update the link register to branch address:
	this.writeLR(((this.readLR() | 0) + ((this.execute & 0x7FF) << 1)) | 0);
	//Copy LR to PC:
	var oldPC = this.readPC() | 0;
	//Flush Pipeline & Block PC Increment:
	this.CPUCore.branch(this.readLR() & -0x2);
	//Set bit 0 of LR high:
	this.writeLR(((oldPC | 0) - 0x2) | 0x1);
}
THUMBInstructionSet.prototype.UNDEFINED = function () {
	//Undefined Exception:
	this.CPUCore.UNDEFINED();
}

function compileTHUMBInstructionDecodeMap() {
	var opcodeIndice = 0;
	var instructionMap = getUint8Array(1024);

	function generateLowMap(instruction) {
		for (var index = 0; index < 0x20; ++index) {
			instructionMap[opcodeIndice++] = instruction;
		}
	}

	function generateLowMap2(instruction) {
		for (var index = 0; index < 0x8; ++index) {
			instructionMap[opcodeIndice++] = instruction;
		}
	}

	function generateLowMap3(instruction) {
		for (var index = 0; index < 0x4; ++index) {
			instructionMap[opcodeIndice++] = instruction;
		}
	}

	function generateLowMap4(instruction1, instruction2, instruction3, instruction4) {
		instructionMap[opcodeIndice++] = instruction1;
		instructionMap[opcodeIndice++] = instruction2;
		instructionMap[opcodeIndice++] = instruction3;
		instructionMap[opcodeIndice++] = instruction4;
	}
	//0-7
	generateLowMap(6);
	//8-F
	generateLowMap(7);
	//10-17
	generateLowMap(30);
	//18-19
	generateLowMap2(12);
	//1A-1B
	generateLowMap2(18);
	//1C-1D
	generateLowMap2(11);
	//1E-1F
	generateLowMap2(60);
	//20-27
	generateLowMap(8);
	//28-2F
	generateLowMap(0);
	//30-37
	generateLowMap(17);
	//38-3F
	generateLowMap(42);
	//40
	generateLowMap4(4, 59, 55, 57);
	//41
	generateLowMap4(69, 71, 72, 43);
	//42
	generateLowMap4(48, 46, 9, 75);
	//43
	generateLowMap4(21, 31, 66, 68);
	//44
	generateLowMap4(82, 61, 27, 77);
	//45
	generateLowMap4(82, 58, 63, 78);
	//46
	generateLowMap4(82, 2, 16, 54);
	//47
	generateLowMap4(37, 49, 82, 82);
	//48-4F
	generateLowMap(15);
	//50-51
	generateLowMap2(74);
	//52-53
	generateLowMap2(35);
	//54-55
	generateLowMap2(79);
	//56-57
	generateLowMap2(65);
	//58-59
	generateLowMap2(70);
	//5A-5B
	generateLowMap2(36);
	//5C-5D
	generateLowMap2(76);
	//5E-5F
	generateLowMap2(44);
	//60-67
	generateLowMap(20);
	//68-6F
	generateLowMap(3);
	//70-77
	generateLowMap(45);
	//78-7F
	generateLowMap(5);
	//80-87
	generateLowMap(28);
	//88-8F
	generateLowMap(22);
	//90-97
	generateLowMap(13);
	//98-9F
	generateLowMap(10);
	//A0-A7
	generateLowMap(64);
	//A8-AF
	generateLowMap(67);
	//B0
	generateLowMap3(39);
	//B1
	generateLowMap3(82);
	//B2
	generateLowMap3(82);
	//B3
	generateLowMap3(82);
	//B4
	generateLowMap3(41);
	//B5
	generateLowMap3(40);
	//B6
	generateLowMap3(82);
	//B7
	generateLowMap3(82);
	//B8
	generateLowMap3(82);
	//B9
	generateLowMap3(82);
	//BA
	generateLowMap3(82);
	//BB
	generateLowMap3(82);
	//BC
	generateLowMap3(26);
	//BD
	generateLowMap3(56);
	//BE
	generateLowMap3(82);
	//BF
	generateLowMap3(82);
	//C0-C7
	generateLowMap(50);
	//C8-CF
	generateLowMap(53);
	//D0
	generateLowMap3(1);
	//D1
	generateLowMap3(24);
	//D2
	generateLowMap3(23);
	//D3
	generateLowMap3(19);
	//D4
	generateLowMap3(73);
	//D5
	generateLowMap3(62);
	//D6
	generateLowMap3(80);
	//D7
	generateLowMap3(81);
	//D8
	generateLowMap3(47);
	//D9
	generateLowMap3(51);
	//DA
	generateLowMap3(25);
	//DB
	generateLowMap3(38);
	//DC
	generateLowMap3(34);
	//DD
	generateLowMap3(29);
	//DE
	generateLowMap3(82);
	//DF
	generateLowMap3(52);
	//E0-E7
	generateLowMap(14);
	//E8-EF
	generateLowMap(82);
	//F0-F7
	generateLowMap(32);
	//F8-FF
	generateLowMap(33);
	//Set to prototype:
	THUMBInstructionSet.prototype.instructionMap = instructionMap;
}
compileTHUMBInstructionDecodeMap();





"use strict";
/*
 Copyright (C) 2012-2014 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function ARMCPSRAttributeTable() {
	//"use asm";
	var negative = 0;
	var zero = 1;
	var carry = 0;
	var overflow = 0;

	function setNegative(toSet) {
		toSet = toSet | 0;
		negative = toSet | 0;
	};

	function setNegativeFalse() {
		negative = 0;
	};

	function getNegative() {
		return negative | 0;
	};

	function setZero(toSet) {
		toSet = toSet | 0;
		zero = toSet | 0;
	};

	function setZeroTrue() {
		zero = 0;
	};

	function setZeroFalse() {
		zero = 1;
	};

	function getZero() {
		return zero | 0;
	};

	function setOverflowTrue() {
		overflow = -1;
	};

	function setOverflowFalse() {
		overflow = 0;
	};

	function getOverflow() {
		return overflow | 0;
	};

	function setCarry(toSet) {
		toSet = toSet | 0;
		carry = toSet | 0;
	};

	function setCarryFalse() {
		carry = 0;
	};

	function getCarry() {
		return carry | 0;
	};

	function getCarryReverse() {
		return (~carry) | 0;
	};

	function checkConditionalCode(execute) {
		execute = execute | 0;
		/*
		 Instruction Decode Pattern:
		 C = Conditional Code Bit;
		 X = Possible opcode bit;
		 N = Data Bit, definitely not an opcode bit
		 OPCODE: CCCCXXXXXXXXXXXXNNNNNNNNXXXXNNNN

		 For this function, we decode the top 3 bits for the conditional code test:
		 */
		switch ((execute >>> 29) | 0) {
			case 0x4:
				if ((zero | 0) == 0) {
					execute = -1;
					break;
				}
				case 0x1:
					execute = ~carry;
					break;
				case 0x2:
					execute = ~negative;
					break;
				case 0x3:
					execute = ~overflow;
					break;
				case 0x6:
					if ((zero | 0) == 0) {
						execute = -1;
						break;
					}
					case 0x5:
						execute = negative ^ overflow;
						break;
					case 0x0:
						if ((zero | 0) != 0) {
							execute = -1;
							break;
						}
						default:
							execute = 0;
		}
		return execute | 0;
	};

	function setNZInt(toSet) {
		toSet = toSet | 0;
		negative = toSet | 0;
		zero = toSet | 0;
	};

	function setNZCV(toSet) {
		toSet = toSet | 0;
		negative = toSet | 0;
		zero = (~toSet) & 0x40000000;
		carry = toSet << 2;
		overflow = toSet << 3;
	};

	function getNZCV() {
		var toSet = 0;
		toSet = negative & 0x80000000;
		if ((zero | 0) == 0) {
			toSet = toSet | 0x40000000;
		}
		toSet = toSet | ((carry >>> 31) << 29);
		toSet = toSet | ((overflow >>> 31) << 28);
		return toSet | 0;
	};

	function setADDFlags(operand1, operand2) {
		//Update flags for an addition operation:
		operand1 = operand1 | 0;
		operand2 = operand2 | 0;
		negative = ((operand1 | 0) + (operand2 | 0)) | 0;
		zero = negative | 0;
		if ((negative >>> 0) < (operand1 >>> 0)) {
			carry = -1;
		} else {
			carry = 0;
		}
		overflow = (~(operand1 ^ operand2)) & (operand1 ^ negative);
		return negative | 0;
	};

	function setADCFlags(operand1, operand2) {
		//Update flags for an addition operation:
		operand1 = operand1 | 0;
		operand2 = operand2 | 0;
		negative = ((operand1 | 0) + (operand2 | 0)) | 0;
		negative = ((negative | 0) + (carry >>> 31)) | 0;
		zero = negative | 0;
		if ((negative >>> 0) < (operand1 >>> 0)) {
			carry = -1;
		} else if ((negative >>> 0) > (operand1 >>> 0)) {
			carry = 0;
		}
		overflow = (~(operand1 ^ operand2)) & (operand1 ^ negative);
		return negative | 0;
	};

	function setSUBFlags(operand1, operand2) {
		//Update flags for a subtraction operation:
		operand1 = operand1 | 0;
		operand2 = operand2 | 0;
		negative = ((operand1 | 0) - (operand2 | 0)) | 0;
		zero = negative | 0;
		if ((operand1 >>> 0) >= (operand2 >>> 0)) {
			carry = -1;
		} else {
			carry = 0;
		}
		overflow = (operand1 ^ operand2) & (operand1 ^ negative);
		return negative | 0;
	};

	function setSBCFlags(operand1, operand2) {
		//Update flags for a subtraction operation:
		operand1 = operand1 | 0;
		operand2 = operand2 | 0;
		negative = ((operand1 | 0) - (operand2 | 0)) | 0;
		negative = ((negative | 0) - ((~carry) >>> 31)) | 0
		zero = negative | 0;
		if ((negative >>> 0) < (operand1 >>> 0)) {
			carry = -1;
		} else if ((negative >>> 0) > (operand1 >>> 0)) {
			carry = 0;
		}
		overflow = (operand1 ^ operand2) & (operand1 ^ negative);
		return negative | 0;
	};

	function setCMPFlags(operand1, operand2) {
		//Update flags for a subtraction operation:
		operand1 = operand1 | 0;
		operand2 = operand2 | 0;
		negative = ((operand1 | 0) - (operand2 | 0)) | 0;
		zero = negative | 0;
		if ((operand1 >>> 0) >= (operand2 >>> 0)) {
			carry = -1;
		} else {
			carry = 0;
		}
		overflow = (operand1 ^ operand2) & (operand1 ^ negative);
	};

	function setCMNFlags(operand1, operand2) {
		//Update flags for an addition operation:
		operand1 = operand1 | 0;
		operand2 = operand2 | 0;
		negative = ((operand1 | 0) + (operand2 | 0)) | 0;
		zero = negative | 0;
		if ((negative >>> 0) < (operand1 >>> 0)) {
			carry = -1;
		} else {
			carry = 0;
		}
		overflow = (~(operand1 ^ operand2)) & (operand1 ^ negative);
	};

	function BGE() {
		//Branch if Negative equal to Overflow
		return (negative ^ overflow) | 0;
	};
	return {
		setNegative: setNegative,
		setNegativeFalse: setNegativeFalse,
		getNegative: getNegative,
		setZero: setZero,
		setZeroTrue: setZeroTrue,
		setZeroFalse: setZeroFalse,
		getZero: getZero,
		setOverflowTrue: setOverflowTrue,
		setOverflowFalse: setOverflowFalse,
		getOverflow: getOverflow,
		setCarry: setCarry,
		setCarryFalse: setCarryFalse,
		getCarry: getCarry,
		getCarryReverse: getCarryReverse,
		checkConditionalCode: checkConditionalCode,
		setNZInt: setNZInt,
		setNZCV: setNZCV,
		getNZCV: getNZCV,
		setADDFlags: setADDFlags,
		setADCFlags: setADCFlags,
		setSUBFlags: setSUBFlags,
		setSBCFlags: setSBCFlags,
		setCMPFlags: setCMPFlags,
		setCMNFlags: setCMNFlags,
		BGE: BGE
	};
}




"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceGraphicsRenderer(coreExposed, skippingBIOS) {
	this.coreExposed = coreExposed;
	this.initializeIO(skippingBIOS);
	this.initializePaletteStorage();
	this.generateRenderers();
	this.initializeRenderers();
}
if (__VIEWS_SUPPORTED__) {
	GameBoyAdvanceGraphicsRenderer.prototype.initializeIO = function (skippingBIOS) {
		//Initialize Pre-Boot:
		this.displayControl = 0x80;
		this.display = 0;
		this.greenSwap = 0;
		this.BGPriority = getUint8Array(0x4);
		this.BGCharacterBaseBlock = getUint8Array(0x4);
		this.BGMosaic = getUint8Array(0x4);
		this.BGScreenBaseBlock = getUint8Array(0x4);
		this.BGScreenSize = getUint8Array(0x4);
		this.WINOutside = 0;
		this.paletteRAM = getUint8Array(0x400);
		this.VRAM = getUint8Array(0x18000);
		this.VRAM16 = getUint16View(this.VRAM);
		this.VRAM32 = getInt32View(this.VRAM);
		this.paletteRAM16 = getUint16View(this.paletteRAM);
		this.paletteRAM32 = getInt32View(this.paletteRAM);
		this.buffer = getInt32Array(0x600);
		this.lineBuffer = getInt32ViewCustom(this.buffer, 0, 240);
		this.frameBuffer = this.coreExposed.frameBuffer;
		this.totalLinesPassed = 0;
		this.queuedScanLines = 0;
		this.lastUnrenderedLine = 0;
		if (skippingBIOS) {
			//BIOS entered the ROM at line 0x7C:
			this.lastUnrenderedLine = 0x7C;
		}
		this.backdrop = 0x3A00000;
	}
} else {
	GameBoyAdvanceGraphicsRenderer.prototype.initializeIO = function (skippingBIOS) {
		//Initialize Pre-Boot:
		this.displayControl = 0x80;
		this.display = 0;
		this.greenSwap = 0;
		this.BGPriority = getUint8Array(0x4);
		this.BGCharacterBaseBlock = getUint8Array(0x4);
		this.BGMosaic = [false, false, false, false];
		this.BGScreenBaseBlock = getUint8Array(0x4);
		this.BGScreenSize = getUint8Array(0x4);
		this.WINOutside = 0;
		this.paletteRAM = getUint8Array(0x400);
		this.VRAM = getUint8Array(0x18000);
		this.VRAM16 = getUint16View(this.VRAM);
		this.VRAM32 = getInt32View(this.VRAM);
		this.paletteRAM16 = getUint16View(this.paletteRAM);
		this.paletteRAM32 = getInt32View(this.paletteRAM);
		this.buffer = getInt32Array(0x600);
		this.frameBuffer = this.coreExposed.frameBuffer;
		this.totalLinesPassed = 0;
		this.queuedScanLines = 0;
		this.lastUnrenderedLine = 0;
		if (skippingBIOS) {
			//BIOS entered the ROM at line 0x7C:
			this.lastUnrenderedLine = 0x7C;
		}
		this.backdrop = 0x3A00000;
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.generateRenderers = function () {
	this.compositor = new GameBoyAdvanceCompositor(this);
	this.bg0Renderer = new GameBoyAdvanceBGTEXTRenderer(this, 0);
	this.bg1Renderer = new GameBoyAdvanceBGTEXTRenderer(this, 1);
	this.bg2TextRenderer = new GameBoyAdvanceBGTEXTRenderer(this, 2);
	this.bg3TextRenderer = new GameBoyAdvanceBGTEXTRenderer(this, 3);
	this.bgAffineRenderer0 = new GameBoyAdvanceAffineBGRenderer(this, 2);
	this.bgAffineRenderer1 = new GameBoyAdvanceAffineBGRenderer(this, 3);
	this.bg2MatrixRenderer = new GameBoyAdvanceBGMatrixRenderer(this, 2);
	this.bg3MatrixRenderer = new GameBoyAdvanceBGMatrixRenderer(this, 3);
	this.bg2FrameBufferRenderer = new GameBoyAdvanceBG2FrameBufferRenderer(this);
	this.objRenderer = new GameBoyAdvanceOBJRenderer(this);
	this.window0Renderer = new GameBoyAdvanceWindowRenderer(new GameBoyAdvanceWindowCompositor(this));
	this.window1Renderer = new GameBoyAdvanceWindowRenderer(new GameBoyAdvanceWindowCompositor(this));
	this.objWindowRenderer = new GameBoyAdvanceOBJWindowRenderer(new GameBoyAdvanceOBJWindowCompositor(this));
	this.mosaicRenderer = new GameBoyAdvanceMosaicRenderer(this.buffer);
	this.colorEffectsRenderer = new GameBoyAdvanceColorEffectsRenderer();
}
GameBoyAdvanceGraphicsRenderer.prototype.initializeRenderers = function () {
	this.compositor.initialize();
	this.compositorPreprocess();
	this.bg0Renderer.initialize();
	this.bg1Renderer.initialize();
	this.bg2TextRenderer.initialize();
	this.bg3TextRenderer.initialize();
	this.bgAffineRenderer0.initialize();
	this.bgAffineRenderer1.initialize();
	this.bg2MatrixRenderer.initialize();
	this.bg3MatrixRenderer.initialize();
	this.bg2FrameBufferRenderer.initialize();
	this.objRenderer.initialize();
	this.window0Renderer.initialize();
	this.window1Renderer.initialize();
	this.objWindowRenderer.initialize();
}
GameBoyAdvanceGraphicsRenderer.prototype.initializePaletteStorage = function () {
	//Both BG and OAM in unified storage:
	this.palette256 = getInt32Array(0x100);
	this.palette256[0] = 0x3800000;
	this.paletteOBJ256 = getInt32Array(0x100);
	this.paletteOBJ256[0] = 0x3800000;
	this.palette16 = getInt32Array(0x100);
	this.paletteOBJ16 = getInt32Array(0x100);
	for (var index = 0;
		(index | 0) < 0x10; index = ((index | 0) + 1) | 0) {
		this.palette16[index << 4] = 0x3800000;
		this.paletteOBJ16[index << 4] = 0x3800000;
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.ensureFraming = function () {
	//Ensure JIT framing alignment:
	if ((this.totalLinesPassed | 0) < 160) {
		//Make sure our gfx are up-to-date:
		this.graphicsJITVBlank();
		//Draw the frame:
		this.coreExposed.prepareFrame();
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.graphicsJIT = function () {
	this.totalLinesPassed = 0; //Mark frame for ensuring a JIT pass for the next framebuffer output.
	this.graphicsJITScanlineGroup();
}
GameBoyAdvanceGraphicsRenderer.prototype.graphicsJITVBlank = function () {
	//JIT the graphics to v-blank framing:
	this.totalLinesPassed = ((this.totalLinesPassed | 0) + (this.queuedScanLines | 0)) | 0;
	this.graphicsJITScanlineGroup();
}
GameBoyAdvanceGraphicsRenderer.prototype.graphicsJITScanlineGroup = function () {
	//Normal rendering JIT, where we try to do groups of scanlines at once:
	while ((this.queuedScanLines | 0) > 0) {
		this.renderScanLine();
		if ((this.lastUnrenderedLine | 0) < 159) {
			this.lastUnrenderedLine = ((this.lastUnrenderedLine | 0) + 1) | 0;
		} else {
			this.lastUnrenderedLine = 0;
		}
		this.queuedScanLines = ((this.queuedScanLines | 0) - 1) | 0;
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.incrementScanLineQueue = function () {
	if ((this.queuedScanLines | 0) < 160) {
		this.queuedScanLines = ((this.queuedScanLines | 0) + 1) | 0;
	} else {
		if ((this.lastUnrenderedLine | 0) < 159) {
			this.lastUnrenderedLine = ((this.lastUnrenderedLine | 0) + 1) | 0;
		} else {
			this.lastUnrenderedLine = 0;
		}
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.renderScanLine = function () {
	var line = this.lastUnrenderedLine | 0;
	if ((this.displayControl & 0x80) == 0) {
		//Render with the current mode selected:
		switch (this.displayControl & 0x7) {
			case 0:
				//Mode 0:
				this.renderMode0(line | 0);
				break;
			case 1:
				//Mode 1:
				this.renderMode1(line | 0);
				break;
			case 2:
				//Mode 2:
				this.renderMode2(line | 0);
				break;
			default:
				//Modes 3-5:
				this.renderModeFrameBuffer(line | 0);
		}
		//Copy line to our framebuffer:
		this.copyLineToFrameBuffer(line | 0);
	} else {
		//Forced blank is on, rendering disabled:
		this.renderForcedBlank(line | 0);
	}
	//Update the affine bg counters:
	this.updateReferenceCounters();
}
GameBoyAdvanceGraphicsRenderer.prototype.renderMode0 = function (line) {
	line = line | 0;
	//Mode 0 Rendering Selected:
	var toRender = this.display & 0x1F;
	if ((toRender & 0x1) != 0) {
		//Render the BG0 layer:
		this.bg0Renderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x2) != 0) {
		//Render the BG1 layer:
		this.bg1Renderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x4) != 0) {
		//Render the BG2 layer:
		this.bg2TextRenderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x8) != 0) {
		//Render the BG3 layer:
		this.bg3TextRenderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x10) != 0) {
		//Render the sprite layer:
		this.objRenderer.renderScanLine(line | 0);
	}
	//Composite the non-windowed result:
	this.compositeLayers(toRender | 0);
	//Composite the windowed result:
	this.compositeWindowedLayers(line | 0, toRender | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.renderMode1 = function (line) {
	line = line | 0;
	//Mode 1 Rendering Selected:
	var toRender = this.display & 0x17;
	if ((toRender & 0x1) != 0) {
		//Render the BG0 layer:
		this.bg0Renderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x2) != 0) {
		//Render the BG1 layer:
		this.bg1Renderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x4) != 0) {
		//Render the BG2 layer:
		this.bg2MatrixRenderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x10) != 0) {
		//Render the sprite layer:
		this.objRenderer.renderScanLine(line | 0);
	}
	//Composite the non-windowed result:
	this.compositeLayers(toRender | 0);
	//Composite the windowed result:
	this.compositeWindowedLayers(line | 0, toRender | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.renderMode2 = function (line) {
	line = line | 0;
	//Mode 2 Rendering Selected:
	var toRender = this.display & 0x1C;
	if ((toRender & 0x4) != 0) {
		//Render the BG2 layer:
		this.bg2MatrixRenderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x8) != 0) {
		//Render the BG3 layer:
		this.bg3MatrixRenderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x10) != 0) {
		//Render the sprite layer:
		this.objRenderer.renderScanLine(line | 0);
	}
	//Composite the non-windowed result:
	this.compositeLayers(toRender | 0);
	//Composite the windowed result:
	this.compositeWindowedLayers(line | 0, toRender | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.renderModeFrameBuffer = function (line) {
	line = line | 0;
	//Mode 3/4/5 Rendering Selected:
	var toRender = this.display & 0x14;
	if ((toRender & 0x4) != 0) {
		this.bg2FrameBufferRenderer.renderScanLine(line | 0);
	}
	if ((toRender & 0x10) != 0) {
		//Render the sprite layer:
		this.objRenderer.renderScanLine(line | 0);
	}
	//Composite the non-windowed result:
	this.compositeLayers(toRender | 0);
	//Composite the windowed result:
	this.compositeWindowedLayers(line | 0, toRender | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.compositeLayers = function (toRender) {
	toRender = toRender | 0;
	if ((this.display & 0xE0) > 0) {
		//Window registers can further disable background layers if one or more window layers enabled:
		toRender = toRender & this.WINOutside;
	}
	//Composite the non-windowed result:
	this.compositor.renderScanLine(toRender | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.compositeWindowedLayers = function (line, toRender) {
	line = line | 0;
	toRender = toRender | 0;
	//Composite the windowed result:
	if ((this.display & 0x90) == 0x90) {
		//Object Window:
		this.objWindowRenderer.renderScanLine(line | 0, toRender | 0);
	}
	if ((this.display & 0x40) != 0) {
		//Window 1:
		this.window1Renderer.renderScanLine(line | 0, toRender | 0);
	}
	if ((this.display & 0x20) != 0) {
		//Window 0:
		this.window0Renderer.renderScanLine(line | 0, toRender | 0);
	}
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceGraphicsRenderer.prototype.copyLineToFrameBuffer = function (line) {
		line = line | 0;
		var offsetStart = Math.imul(line | 0, 240) | 0;
		if ((this.greenSwap | 0) == 0) {
			//Blit normally:
			this.copyLineToFrameBufferNormal(offsetStart | 0);
		} else {
			//Blit with green swap:
			this.copyLineToFrameBufferGreenSwapped(offsetStart | 0);
		}
	}
	if (__LITTLE_ENDIAN__ && typeof Uint8Array.prototype.fill == "function") {
		GameBoyAdvanceGraphicsRenderer.prototype.renderForcedBlank = function (line) {
			line = line | 0;
			var offsetStart = Math.imul(line | 0, 240) | 0;
			//Render a blank line:
			var offsetEnd = ((offsetStart | 0) + 240) | 0;
			this.frameBuffer.fill(0x7FFF, offsetStart | 0, offsetEnd | 0);
		}
	} else {
		GameBoyAdvanceGraphicsRenderer.prototype.renderForcedBlank = function (line) {
			line = line | 0;
			var offsetStart = Math.imul(line | 0, 240) | 0;
			//Render a blank line:
			for (var position = 0;
				(position | 0) < 240; position = ((position | 0) + 1) | 0) {
				this.frameBuffer[offsetStart | 0] = 0x7FFF;
				offsetStart = ((offsetStart | 0) + 1) | 0;
			}
		}
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceGraphicsRenderer.prototype.copyLineToFrameBuffer = function (line) {
		var offsetStart = line * 240;
		if (this.greenSwap == 0) {
			//Blit normally:
			this.copyLineToFrameBufferNormal(offsetStart);
		} else {
			//Blit with green swap:
			this.copyLineToFrameBufferGreenSwapped(offsetStart);
		}
	}
	GameBoyAdvanceGraphicsRenderer.prototype.renderForcedBlank = function (line) {
		var offsetStart = line * 240;
		//Render a blank line:
		for (var position = 0; position < 240; ++position) {
			this.frameBuffer[offsetStart++] = 0x7FFF;
		}
	}
}
if (__VIEWS_SUPPORTED__ && typeof Uint8Array.prototype.set == "function") {
	GameBoyAdvanceGraphicsRenderer.prototype.copyLineToFrameBufferNormal = function (offsetStart) {
		offsetStart = offsetStart | 0;
		//Render a line:
		this.frameBuffer.set(this.lineBuffer, offsetStart | 0);
	}
} else {
	GameBoyAdvanceGraphicsRenderer.prototype.copyLineToFrameBufferNormal = function (offsetStart) {
		offsetStart = offsetStart | 0;
		//Render a line:
		for (var position = 0;
			(position | 0) < 240; position = ((position | 0) + 1) | 0) {
			this.frameBuffer[offsetStart | 0] = this.buffer[position | 0] | 0;
			offsetStart = ((offsetStart | 0) + 1) | 0;
		}
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.copyLineToFrameBufferGreenSwapped = function (offsetStart) {
	offsetStart = offsetStart | 0;
	//Render a line with green swap effect:
	var position = 0;
	var pixel0 = 0;
	var pixel1 = 0;
	while ((position | 0) < 240) {
		pixel0 = this.buffer[position | 0] | 0;
		position = ((position | 0) + 1) | 0;
		pixel1 = this.buffer[position | 0] | 0;
		position = ((position | 0) + 1) | 0;
		this.frameBuffer[offsetStart | 0] = (pixel0 & 0x7C1F) | (pixel1 & 0x3E0);
		offsetStart = ((offsetStart | 0) + 1) | 0;
		this.frameBuffer[offsetStart | 0] = (pixel1 & 0x7C1F) | (pixel0 & 0x3E0);
		offsetStart = ((offsetStart | 0) + 1) | 0;
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.updateReferenceCounters = function () {
	if ((this.lastUnrenderedLine | 0) == 159) {
		//Reset some affine bg counters on roll-over to line 0:
		this.bgAffineRenderer0.resetReferenceCounters();
		this.bgAffineRenderer1.resetReferenceCounters();
	} else {
		//Increment the affine bg counters:
		this.bgAffineRenderer0.incrementReferenceCounters();
		this.bgAffineRenderer1.incrementReferenceCounters();
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.compositorPreprocess = function () {
	var controlBits = this.WINOutside & 0x20;
	if ((this.display & 0xE0) == 0) {
		controlBits = controlBits | 1;
	}
	this.compositor.preprocess(controlBits | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.frameBufferModePreprocess = function (displayControl) {
	displayControl = displayControl | 0;
	displayControl = Math.min(displayControl & 0x7, 5) | 0;
	//Set up pixel fetcher ahead of time:
	if ((displayControl | 0) > 2) {
		this.bg2FrameBufferRenderer.selectMode(displayControl | 0);
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.writeDISPCNT8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2FrameBufferRenderer.writeFrameSelect((data & 0x10) << 27);
	this.objRenderer.setHBlankIntervalFreeStatus(data & 0x20);
	this.frameBufferModePreprocess(data | 0);
	this.displayControl = data | 0;
}
GameBoyAdvanceGraphicsRenderer.prototype.writeDISPCNT8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.display = data & 0xFF;
	this.compositorPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeDISPCNT8_2 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.greenSwap = data & 0x01;
}
GameBoyAdvanceGraphicsRenderer.prototype.writeDISPCNT16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2FrameBufferRenderer.writeFrameSelect((data & 0x10) << 27);
	this.objRenderer.setHBlankIntervalFreeStatus(data & 0x20);
	this.frameBufferModePreprocess(data | 0);
	this.displayControl = data | 0;
	this.display = data >> 8;
	this.compositorPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeDISPCNT32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2FrameBufferRenderer.writeFrameSelect((data & 0x10) << 27);
	this.objRenderer.setHBlankIntervalFreeStatus(data & 0x20);
	this.frameBufferModePreprocess(data | 0);
	this.displayControl = data | 0;
	this.display = (data >> 8) & 0xFF;
	this.compositorPreprocess();
	this.greenSwap = data & 0x10000;
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0CNT8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[0] = data & 0x3;
	this.BGCharacterBaseBlock[0] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[0] = data & 0x40;
	this.bg0Renderer.paletteModeSelect(data & 0x80);
	this.bg0Renderer.priorityPreprocess();
	this.bg0Renderer.characterBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0CNT8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGScreenBaseBlock[0] = data & 0x1F;
	this.BGScreenSize[0] = (data & 0xC0) >> 6;
	this.bg0Renderer.screenSizePreprocess();
	this.bg0Renderer.screenBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0CNT16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[0] = data & 0x3;
	this.BGCharacterBaseBlock[0] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[0] = data & 0x40;
	this.bg0Renderer.paletteModeSelect(data & 0x80);
	this.bg0Renderer.priorityPreprocess();
	this.bg0Renderer.characterBaseBlockPreprocess();
	this.BGScreenBaseBlock[0] = (data >> 8) & 0x1F;
	this.BGScreenSize[0] = (data & 0xC000) >> 14;
	this.bg0Renderer.screenSizePreprocess();
	this.bg0Renderer.screenBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1CNT8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[1] = data & 0x3;
	this.BGCharacterBaseBlock[1] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[1] = data & 0x40;
	this.bg1Renderer.paletteModeSelect(data & 0x80);
	this.bg1Renderer.priorityPreprocess();
	this.bg1Renderer.characterBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1CNT8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGScreenBaseBlock[1] = data & 0x1F;
	this.BGScreenSize[1] = (data & 0xC0) >> 6;
	this.bg1Renderer.screenSizePreprocess();
	this.bg1Renderer.screenBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1CNT16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[1] = data & 0x3;
	this.BGCharacterBaseBlock[1] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[1] = data & 0x40;
	this.bg1Renderer.paletteModeSelect(data & 0x80);
	this.bg1Renderer.priorityPreprocess();
	this.bg1Renderer.characterBaseBlockPreprocess();
	this.BGScreenBaseBlock[1] = (data >> 8) & 0x1F;
	this.BGScreenSize[1] = (data & 0xC000) >> 14;
	this.bg1Renderer.screenSizePreprocess();
	this.bg1Renderer.screenBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0BG1CNT32 = function (data) {
	this.BGPriority[0] = data & 0x3;
	this.BGCharacterBaseBlock[0] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[0] = data & 0x40;
	this.bg0Renderer.paletteModeSelect(data & 0x80);
	this.bg0Renderer.priorityPreprocess();
	this.bg0Renderer.characterBaseBlockPreprocess();
	this.BGScreenBaseBlock[0] = (data >> 8) & 0x1F;
	this.BGScreenSize[0] = (data & 0xC000) >> 14;
	this.bg0Renderer.screenSizePreprocess();
	this.bg0Renderer.screenBaseBlockPreprocess();
	this.BGPriority[1] = (data >> 16) & 0x3;
	this.BGCharacterBaseBlock[1] = (data & 0xC0000) >> 18;
	//Bits 5-6 always 0.
	this.BGMosaic[1] = data & 0x400000;
	this.bg1Renderer.paletteModeSelect((data >> 16) & 0x80);
	this.bg1Renderer.priorityPreprocess();
	this.bg1Renderer.characterBaseBlockPreprocess();
	this.BGScreenBaseBlock[1] = (data >> 24) & 0x1F;
	this.BGScreenSize[1] = data >>> 30;
	this.bg1Renderer.screenSizePreprocess();
	this.bg1Renderer.screenBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2CNT8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[2] = data & 0x3;
	this.BGCharacterBaseBlock[2] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[2] = data & 0x40;
	this.bg2TextRenderer.paletteModeSelect(data & 0x80);
	this.bg2TextRenderer.priorityPreprocess();
	this.bgAffineRenderer0.priorityPreprocess();
	this.bg2TextRenderer.characterBaseBlockPreprocess();
	this.bg2MatrixRenderer.characterBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2CNT8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGScreenBaseBlock[2] = data & 0x1F;
	this.BGScreenSize[2] = (data & 0xC0) >> 6;
	this.bg2TextRenderer.screenSizePreprocess();
	this.bg2MatrixRenderer.screenSizePreprocess();
	this.bg2TextRenderer.screenBaseBlockPreprocess();
	this.bg2MatrixRenderer.screenBaseBlockPreprocess();
	this.bg2MatrixRenderer.displayOverflowPreprocess(data & 0x20);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2CNT16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[2] = data & 0x3;
	this.BGCharacterBaseBlock[2] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[2] = data & 0x40;
	this.bg2TextRenderer.paletteModeSelect(data & 0x80);
	this.bg2TextRenderer.priorityPreprocess();
	this.bgAffineRenderer0.priorityPreprocess();
	this.bg2TextRenderer.characterBaseBlockPreprocess();
	this.bg2MatrixRenderer.characterBaseBlockPreprocess();
	this.BGScreenBaseBlock[2] = (data >> 8) & 0x1F;
	this.BGScreenSize[2] = (data & 0xC000) >> 14;
	this.bg2TextRenderer.screenSizePreprocess();
	this.bg2MatrixRenderer.screenSizePreprocess();
	this.bg2TextRenderer.screenBaseBlockPreprocess();
	this.bg2MatrixRenderer.screenBaseBlockPreprocess();
	this.bg2MatrixRenderer.displayOverflowPreprocess((data >> 8) & 0x20);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3CNT8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[3] = data & 0x3;
	this.BGCharacterBaseBlock[3] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[3] = data & 0x40;
	this.bg3TextRenderer.paletteModeSelect(data & 0x80);
	this.bg3TextRenderer.priorityPreprocess();
	this.bgAffineRenderer1.priorityPreprocess();
	this.bg3TextRenderer.characterBaseBlockPreprocess();
	this.bg3MatrixRenderer.characterBaseBlockPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3CNT8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGScreenBaseBlock[3] = data & 0x1F;
	this.BGScreenSize[3] = (data & 0xC0) >> 6;
	this.bg3TextRenderer.screenSizePreprocess();
	this.bg3MatrixRenderer.screenSizePreprocess();
	this.bg3TextRenderer.screenBaseBlockPreprocess();
	this.bg3MatrixRenderer.screenBaseBlockPreprocess();
	this.bg3MatrixRenderer.displayOverflowPreprocess(data & 0x20);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3CNT16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[3] = data & 0x3;
	this.BGCharacterBaseBlock[3] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[3] = data & 0x40;
	this.bg3TextRenderer.paletteModeSelect(data & 0x80);
	this.bg3TextRenderer.priorityPreprocess();
	this.bgAffineRenderer1.priorityPreprocess();
	this.bg3TextRenderer.characterBaseBlockPreprocess();
	this.bg3MatrixRenderer.characterBaseBlockPreprocess();
	this.BGScreenBaseBlock[3] = (data >> 8) & 0x1F;
	this.BGScreenSize[3] = (data & 0xC000) >> 14;
	this.bg3TextRenderer.screenSizePreprocess();
	this.bg3MatrixRenderer.screenSizePreprocess();
	this.bg3TextRenderer.screenBaseBlockPreprocess();
	this.bg3MatrixRenderer.screenBaseBlockPreprocess();
	this.bg3MatrixRenderer.displayOverflowPreprocess((data >> 8) & 0x20);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2BG3CNT32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.BGPriority[2] = data & 0x3;
	this.BGCharacterBaseBlock[2] = (data & 0xC) >> 2;
	//Bits 5-6 always 0.
	this.BGMosaic[2] = data & 0x40;
	this.bg2TextRenderer.paletteModeSelect(data & 0x80);
	this.bg2TextRenderer.priorityPreprocess();
	this.bgAffineRenderer0.priorityPreprocess();
	this.bg2TextRenderer.characterBaseBlockPreprocess();
	this.bg2MatrixRenderer.characterBaseBlockPreprocess();
	this.BGScreenBaseBlock[2] = (data >> 8) & 0x1F;
	this.BGScreenSize[2] = (data & 0xC000) >> 14;
	this.bg2TextRenderer.screenSizePreprocess();
	this.bg2MatrixRenderer.screenSizePreprocess();
	this.bg2TextRenderer.screenBaseBlockPreprocess();
	this.bg2MatrixRenderer.screenBaseBlockPreprocess();
	this.bg2MatrixRenderer.displayOverflowPreprocess((data >> 8) & 0x20);
	this.BGPriority[3] = (data >> 16) & 0x3;
	this.BGCharacterBaseBlock[3] = (data & 0xC0000) >> 18;
	//Bits 5-6 always 0.
	this.BGMosaic[3] = data & 0x400000;
	this.bg3TextRenderer.paletteModeSelect((data >> 16) & 0x80);
	this.bg3TextRenderer.priorityPreprocess();
	this.bgAffineRenderer1.priorityPreprocess();
	this.bg3TextRenderer.characterBaseBlockPreprocess();
	this.bg3MatrixRenderer.characterBaseBlockPreprocess();
	this.BGScreenBaseBlock[3] = (data >> 24) & 0x1F;
	this.BGScreenSize[3] = data >>> 30;
	this.bg3TextRenderer.screenSizePreprocess();
	this.bg3MatrixRenderer.screenSizePreprocess();
	this.bg3TextRenderer.screenBaseBlockPreprocess();
	this.bg3MatrixRenderer.screenBaseBlockPreprocess();
	this.bg3MatrixRenderer.displayOverflowPreprocess((data >> 24) & 0x20);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0HOFS8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg0Renderer.writeBGHOFS8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0HOFS8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg0Renderer.writeBGHOFS8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0HOFS16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg0Renderer.writeBGHOFS16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0VOFS8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg0Renderer.writeBGVOFS8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0VOFS8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg0Renderer.writeBGVOFS8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0VOFS16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg0Renderer.writeBGVOFS16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG0OFS32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg0Renderer.writeBGOFS32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1HOFS8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg1Renderer.writeBGHOFS8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1HOFS8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg1Renderer.writeBGHOFS8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1HOFS16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg1Renderer.writeBGHOFS16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1VOFS8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg1Renderer.writeBGVOFS8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1VOFS8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg1Renderer.writeBGVOFS8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1VOFS16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg1Renderer.writeBGVOFS16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG1OFS32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg1Renderer.writeBGOFS32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2HOFS8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2TextRenderer.writeBGHOFS8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2HOFS8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2TextRenderer.writeBGHOFS8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2HOFS16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2TextRenderer.writeBGHOFS16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2VOFS8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2TextRenderer.writeBGVOFS8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2VOFS8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2TextRenderer.writeBGVOFS8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2VOFS16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2TextRenderer.writeBGVOFS16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2OFS32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg2TextRenderer.writeBGOFS32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3HOFS8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg3TextRenderer.writeBGHOFS8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3HOFS8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg3TextRenderer.writeBGHOFS8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3HOFS16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg3TextRenderer.writeBGHOFS16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3VOFS8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg3TextRenderer.writeBGVOFS8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3VOFS8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg3TextRenderer.writeBGVOFS8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3VOFS16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg3TextRenderer.writeBGVOFS16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3OFS32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bg3TextRenderer.writeBGOFS32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PA8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPA8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PA8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPA8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PA16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPA16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PB8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPB8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PB8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPB8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PB16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPB16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PAB32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPAB32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PC8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPC8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PC8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPC8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PC16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPC16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PD8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPD8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PD8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPD8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PD16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPD16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2PCD32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGPCD32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PA8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPA8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PA8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPA8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PA16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPA16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PB8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPB8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PB8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPB8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PB16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPB16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PAB32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPAB32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PC8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPC8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PC8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPC8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PC16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPC16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PD8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPD8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PD8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPD8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PD16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPD16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3PCD32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGPCD32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2X8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGX8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2X8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGX8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2X8_2 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGX8_2(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2X8_3 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGX8_3(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2X16_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGX16_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2X16_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGX16_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2X32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGX32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2Y8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGY8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2Y8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGY8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2Y8_2 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGY8_2(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2Y8_3 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGY8_3(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2Y16_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGY16_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2Y16_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGY16_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG2Y32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer0.writeBGY32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3X8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGX8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3X8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGX8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3X8_2 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGX8_2(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3X8_3 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGX8_3(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3X16_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGX16_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3X16_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGX16_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3X32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGX32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3Y8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGY8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3Y8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGY8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3Y8_2 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGY8_2(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3Y8_3 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGY8_3(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3Y16_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGY16_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3Y16_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGY16_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBG3Y32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.bgAffineRenderer1.writeBGY32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN0XCOORDRight8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window0Renderer.writeWINXCOORDRight8(data | 0); //Window x-coord goes up to this minus 1.
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN0XCOORDLeft8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window0Renderer.writeWINXCOORDLeft8(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN0XCOORD16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window0Renderer.writeWINXCOORD16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN1XCOORDRight8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window1Renderer.writeWINXCOORDRight8(data | 0); //Window x-coord goes up to this minus 1.
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN1XCOORDLeft8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window1Renderer.writeWINXCOORDLeft8(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN1XCOORD16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window1Renderer.writeWINXCOORD16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWINXCOORD32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window0Renderer.writeWINXCOORD16(data & 0xFFFF);
	this.window1Renderer.writeWINXCOORD16(data >>> 16);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN0YCOORDBottom8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window0Renderer.writeWINYCOORDBottom8(data | 0); //Window y-coord goes up to this minus 1.
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN0YCOORDTop8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window0Renderer.writeWINYCOORDTop8(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN0YCOORD16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window0Renderer.writeWINYCOORD16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN1YCOORDBottom8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window1Renderer.writeWINYCOORDBottom8(data | 0); //Window y-coord goes up to this minus 1.
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN1YCOORDTop8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window1Renderer.writeWINYCOORDTop8(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN1YCOORD16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window1Renderer.writeWINYCOORD16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWINYCOORD32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.window0Renderer.writeWINYCOORD16(data & 0xFFFF);
	this.window1Renderer.writeWINYCOORD16(data >>> 16);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN0IN8 = function (data) {
	data = data | 0;
	//Window 0:
	this.graphicsJIT();
	this.window0Renderer.writeWININ8(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWIN1IN8 = function (data) {
	data = data | 0;
	//Window 1:
	this.graphicsJIT();
	this.window1Renderer.writeWININ8(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWININ16 = function (data) {
	data = data | 0;
	//Window 0:
	this.graphicsJIT();
	this.window0Renderer.writeWININ8(data & 0xFF);
	//Window 1:
	this.window1Renderer.writeWININ8(data >> 8);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWINOUT8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.WINOutside = data | 0;
	this.compositorPreprocess();
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWINOBJIN8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.objWindowRenderer.writeWINOBJIN8(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWINOUT16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.WINOutside = data | 0;
	this.compositorPreprocess();
	this.objWindowRenderer.writeWINOBJIN8(data >> 8);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeWINCONTROL32 = function (data) {
	data = data | 0;
	//Window 0:
	this.graphicsJIT();
	this.window0Renderer.writeWININ8(data & 0xFF);
	//Window 1:
	this.window1Renderer.writeWININ8((data >> 8) & 0xFF);
	this.WINOutside = data >> 16;
	this.compositorPreprocess();
	this.objWindowRenderer.writeWINOBJIN8(data >>> 24);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeMOSAIC8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.mosaicRenderer.writeMOSAIC8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeMOSAIC8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.mosaicRenderer.writeMOSAIC8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeMOSAIC16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.mosaicRenderer.writeMOSAIC16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBLDCNT8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.colorEffectsRenderer.writeBLDCNT8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBLDCNT8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.colorEffectsRenderer.writeBLDCNT8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBLDCNT16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.colorEffectsRenderer.writeBLDCNT16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBLDALPHA8_0 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.colorEffectsRenderer.writeBLDALPHA8_0(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBLDALPHA8_1 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.colorEffectsRenderer.writeBLDALPHA8_1(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBLDALPHA16 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.colorEffectsRenderer.writeBLDALPHA16(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBLDCNT32 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.colorEffectsRenderer.writeBLDCNT32(data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeBLDY8 = function (data) {
	data = data | 0;
	this.graphicsJIT();
	this.colorEffectsRenderer.writeBLDY8(data | 0);
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceGraphicsRenderer.prototype.writeVRAM8 = function (address, data) {
		address = address | 0;
		data = data | 0;
		if ((address & 0x10000) == 0 || ((address & 0x17FFF) < 0x14000 && (this.displayControl & 0x7) >= 3)) {
			this.graphicsJIT();
			address = address & (((address & 0x10000) >> 1) ^ address);
			this.VRAM16[(address >> 1) & 0xFFFF] = Math.imul(data & 0xFF, 0x101) | 0;
		}
	}
	GameBoyAdvanceGraphicsRenderer.prototype.writeVRAM16 = function (address, data) {
		address = address | 0;
		data = data | 0;
		this.graphicsJIT();
		address = address & (((address & 0x10000) >> 1) ^ address);
		this.VRAM16[(address >> 1) & 0xFFFF] = data & 0xFFFF;
	}
	GameBoyAdvanceGraphicsRenderer.prototype.writeVRAM32 = function (address, data) {
		address = address | 0;
		data = data | 0;
		this.graphicsJIT();
		address = address & (((address & 0x10000) >> 1) ^ address);
		this.VRAM32[(address >> 2) & 0x7FFF] = data | 0;
	}
	GameBoyAdvanceGraphicsRenderer.prototype.readVRAM16 = function (address) {
		address = address | 0;
		address = address & (((address & 0x10000) >> 1) ^ address);
		return this.VRAM16[(address >> 1) & 0xFFFF] | 0;
	}
	GameBoyAdvanceGraphicsRenderer.prototype.readVRAM32 = function (address) {
		address = address | 0;
		address = address & (((address & 0x10000) >> 1) ^ address);
		return this.VRAM32[(address >> 2) & 0x7FFF] | 0;
	}
	GameBoyAdvanceGraphicsRenderer.prototype.writePalette16 = function (address, data) {
		data = data | 0;
		address = address >> 1;
		this.graphicsJIT();
		this.paletteRAM16[address & 0x1FF] = data | 0;
		data = data & 0x7FFF;
		this.writePalette256Color(address | 0, data | 0);
		this.writePalette16Color(address | 0, data | 0);
	}
	GameBoyAdvanceGraphicsRenderer.prototype.writePalette32 = function (address, data) {
		data = data | 0;
		address = address >> 1;
		this.graphicsJIT();
		this.paletteRAM32[(address >> 1) & 0xFF] = data | 0;
		var palette = data & 0x7FFF;
		this.writePalette256Color(address | 0, palette | 0);
		this.writePalette16Color(address | 0, palette | 0);
		palette = (data >> 16) & 0x7FFF;
		this.writePalette256Color(address | 1, palette | 0);
		this.writePalette16Color(address | 1, palette | 0);
	}
	GameBoyAdvanceGraphicsRenderer.prototype.readPalette16 = function (address) {
		address = address | 0;
		return this.paletteRAM16[(address >> 1) & 0x1FF] | 0;
	}
	GameBoyAdvanceGraphicsRenderer.prototype.readPalette32 = function (address) {
		address = address | 0;
		return this.paletteRAM32[(address >> 2) & 0xFF] | 0;
	}
} else {
	GameBoyAdvanceGraphicsRenderer.prototype.writeVRAM8 = function (address, data) {
		address &= 0x1FFFE & (((address & 0x10000) >> 1) ^ address);
		if (address < 0x10000 || ((address & 0x17FFF) < 0x14000 && (this.displayControl & 0x7) >= 3)) {
			this.graphicsJIT();
			this.VRAM[address++] = data & 0xFF;
			this.VRAM[address] = data & 0xFF;
		}
	}
	GameBoyAdvanceGraphicsRenderer.prototype.writeVRAM16 = function (address, data) {
		address &= 0x1FFFE & (((address & 0x10000) >> 1) ^ address);
		this.graphicsJIT();
		this.VRAM[address++] = data & 0xFF;
		this.VRAM[address] = (data >> 8) & 0xFF;
	}
	GameBoyAdvanceGraphicsRenderer.prototype.writeVRAM32 = function (address, data) {
		address &= 0x1FFFC & (((address & 0x10000) >> 1) ^ address);
		this.graphicsJIT();
		this.VRAM[address++] = data & 0xFF;
		this.VRAM[address++] = (data >> 8) & 0xFF;
		this.VRAM[address++] = (data >> 16) & 0xFF;
		this.VRAM[address] = data >>> 24;
	}
	GameBoyAdvanceGraphicsRenderer.prototype.readVRAM16 = function (address) {
		address &= 0x1FFFE & (((address & 0x10000) >> 1) ^ address);
		return this.VRAM[address] | (this.VRAM[address + 1] << 8);
	}
	GameBoyAdvanceGraphicsRenderer.prototype.readVRAM32 = function (address) {
		address &= 0x1FFFC & (((address & 0x10000) >> 1) ^ address);
		return this.VRAM[address] | (this.VRAM[address + 1] << 8) | (this.VRAM[address + 2] << 16) | (this.VRAM[address + 3] << 24);
	}
	GameBoyAdvanceGraphicsRenderer.prototype.writePalette16 = function (address, data) {
		this.graphicsJIT();
		this.paletteRAM[address] = data & 0xFF;
		this.paletteRAM[address | 1] = data >> 8;
		data &= 0x7FFF;
		address >>= 1;
		this.writePalette256Color(address, data);
		this.writePalette16Color(address, data);
	}
	GameBoyAdvanceGraphicsRenderer.prototype.writePalette32 = function (address, data) {
		this.graphicsJIT();
		this.paletteRAM[address] = data & 0xFF;
		this.paletteRAM[address | 1] = (data >> 8) & 0xFF;
		this.paletteRAM[address | 2] = (data >> 16) & 0xFF;
		this.paletteRAM[address | 3] = data >>> 24;
		address >>= 1;
		var palette = data & 0x7FFF;
		this.writePalette256Color(address, palette);
		this.writePalette16Color(address, palette);
		palette = (data >> 16) & 0x7FFF;
		address |= 1;
		this.writePalette256Color(address, palette);
		this.writePalette16Color(address, palette);
	}
	GameBoyAdvanceGraphicsRenderer.prototype.readPalette16 = function (address) {
		address &= 0x3FE;
		return this.paletteRAM[address] | (this.paletteRAM[address | 1] << 8);
	}
	GameBoyAdvanceGraphicsRenderer.prototype.readPalette32 = function (address) {
		address &= 0x3FC;
		return this.paletteRAM[address] | (this.paletteRAM[address | 1] << 8) | (this.paletteRAM[address | 2] << 16) | (this.paletteRAM[address | 3] << 24);
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.readVRAM8 = function (address) {
	address = address | 0;
	address = address & (((address & 0x10000) >> 1) ^ address);
	return this.VRAM[address & 0x1FFFF] | 0;
}
GameBoyAdvanceGraphicsRenderer.prototype.writeOAM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.graphicsJIT();
	this.objRenderer.writeOAM16(address >> 1, data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.writeOAM32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.graphicsJIT();
	this.objRenderer.writeOAM32(address >> 2, data | 0);
}
GameBoyAdvanceGraphicsRenderer.prototype.readOAM = function (address) {
	return this.objRenderer.readOAM(address | 0) | 0;
}
GameBoyAdvanceGraphicsRenderer.prototype.readOAM16 = function (address) {
	return this.objRenderer.readOAM16(address | 0) | 0;
}
GameBoyAdvanceGraphicsRenderer.prototype.readOAM32 = function (address) {
	return this.objRenderer.readOAM32(address | 0) | 0;
}
GameBoyAdvanceGraphicsRenderer.prototype.writePalette256Color = function (address, palette) {
	address = address | 0;
	palette = palette | 0;
	if ((address & 0xFF) == 0) {
		palette = 0x3800000 | palette;
		if (address == 0) {
			this.backdrop = palette | 0x200000;
		}
	}
	if ((address | 0) < 0x100) {
		this.palette256[address & 0xFF] = palette | 0;
	} else {
		this.paletteOBJ256[address & 0xFF] = palette | 0;
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.writePalette16Color = function (address, palette) {
	address = address | 0;
	palette = palette | 0;
	if ((address & 0xF) == 0) {
		palette = 0x3800000 | palette;
	}
	if ((address | 0) < 0x100) {
		//BG Layer Palette:
		this.palette16[address & 0xFF] = palette | 0;
	} else {
		//OBJ Layer Palette:
		this.paletteOBJ16[address & 0xFF] = palette | 0;
	}
}
GameBoyAdvanceGraphicsRenderer.prototype.readPalette8 = function (address) {
	return this.paletteRAM[address & 0x3FF] | 0;
}




"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceRendererProxy(IOCore) {
	//Build references:
	this.IOCore = IOCore;
}
GameBoyAdvanceRendererProxy.prototype.initialize = function () {
	this.IOData8 = getUint8Array(20);
	this.IOData16 = getUint16View(this.IOData8);
	this.IOData32 = getInt32View(this.IOData8);
	this.gfxState = this.IOCore.gfxState;
	this.renderer = new GameBoyAdvanceGraphicsRenderer(this.IOCore.coreExposed, !this.IOCore.BIOSFound || this.IOCore.settings.SKIPBoot);
}
GameBoyAdvanceRendererProxy.prototype.incrementScanLineQueue = function () {
	this.renderer.incrementScanLineQueue();
}
GameBoyAdvanceRendererProxy.prototype.ensureFraming = function () {
	this.renderer.ensureFraming();
}
GameBoyAdvanceRendererProxy.prototype.writeDISPCNT8_0 = function (data) {
	data = data | 0;
	data = data & 0xF7;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[0] = data | 0;
	this.renderer.writeDISPCNT8_0(data | 0);
	this.gfxState.isRenderingCheckPreprocess();
}
GameBoyAdvanceRendererProxy.prototype.readDISPCNT8_0 = function () {
	return this.IOData8[0] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeDISPCNT8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[1] = data | 0;
	this.renderer.writeDISPCNT8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readDISPCNT8_1 = function () {
	return this.IOData8[1] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeDISPCNT8_2 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[2] = data | 0;
	this.renderer.writeDISPCNT8_2(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readDISPCNT8_2 = function () {
	return this.IOData8[2] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceRendererProxy.prototype.writeDISPCNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFF7;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[0] = data | 0;
		this.renderer.writeDISPCNT16(data | 0);
		this.gfxState.isRenderingCheckPreprocess();
	}
	GameBoyAdvanceRendererProxy.prototype.readDISPCNT16 = function () {
		return this.IOData16[0] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.writeDISPCNT32 = function (data) {
		data = data | 0;
		data = data & 0x1FFF7;
		this.IOCore.updateGraphicsClocking();
		this.IOData32[0] = data | 0;
		this.renderer.writeDISPCNT32(data | 0);
		this.gfxState.isRenderingCheckPreprocess();
	}
	GameBoyAdvanceRendererProxy.prototype.readDISPCNT32 = function () {
		return this.IOData32[0] | 0;
	}
} else {
	GameBoyAdvanceRendererProxy.prototype.writeDISPCNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFF7;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[0] = data & 0xF7;
		this.IOData8[1] = data >> 8;
		this.renderer.writeDISPCNT16(data | 0);
		this.gfxState.isRenderingCheckPreprocess();
	}
	GameBoyAdvanceRendererProxy.prototype.readDISPCNT16 = function () {
		return this.IOData8[0] | (this.IOData8[1] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.writeDISPCNT32 = function (data) {
		data = data | 0;
		data = data & 0x1FFF7;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[0] = data & 0xF7;
		this.IOData8[1] = (data >> 8) & 0xFF;
		this.IOData8[2] = data >> 16;
		this.renderer.writeDISPCNT32(data | 0);
		this.gfxState.isRenderingCheckPreprocess();
	}
	GameBoyAdvanceRendererProxy.prototype.readDISPCNT32 = function () {
		return this.IOData8[0] | (this.IOData8[1] << 8) | (this.IOData8[2] << 16);
	}
}
GameBoyAdvanceRendererProxy.prototype.writeBG0CNT8_0 = function (data) {
	data = data | 0;
	data = data & 0xCF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[4] = data | 0;
	this.renderer.writeBG0CNT8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBG0CNT8_0 = function () {
	return this.IOData8[4] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBG0CNT8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[5] = data | 0;
	this.renderer.writeBG0CNT8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBG0CNT8_1 = function () {
	return this.IOData8[5] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBG1CNT8_0 = function (data) {
	data = data | 0;
	data = data & 0xCF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[6] = data | 0;
	this.renderer.writeBG1CNT8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBG1CNT8_0 = function () {
	return this.IOData8[6] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBG1CNT8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[7] = data | 0;
	this.renderer.writeBG1CNT8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBG1CNT8_1 = function () {
	return this.IOData8[7] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceRendererProxy.prototype.writeBG0CNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[2] = data | 0;
		this.renderer.writeBG0CNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBG1CNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[3] = data | 0;
		this.renderer.writeBG1CNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBG0BG1CNT32 = function (data) {
		data = data | 0;
		data = data & 0xFFCFFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData32[1] = data | 0;
		this.renderer.writeBG0BG1CNT32(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.readBG0CNT16 = function () {
		return this.IOData16[2] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.readBG1CNT16 = function () {
		return this.IOData16[3] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.readBG0BG1CNT32 = function () {
		return this.IOData32[1] | 0;
	}
} else {
	GameBoyAdvanceRendererProxy.prototype.writeBG0CNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[4] = data & 0xFF;
		this.IOData8[5] = data >> 8;
		this.renderer.writeBG0CNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBG1CNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[6] = data & 0xFF;
		this.IOData8[7] = data >> 8;
		this.renderer.writeBG1CNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBG0BG1CNT32 = function (data) {
		data = data | 0;
		data = data & 0xFFCFFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[4] = data & 0xFF;
		this.IOData8[5] = (data >> 8) & 0xFF;
		this.IOData8[6] = (data >> 16) & 0xFF;
		this.IOData8[7] = data >>> 24;
		this.renderer.writeBG0BG1CNT32(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.readBG0CNT16 = function () {
		return this.IOData8[4] | (this.IOData8[5] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.readBG1CNT16 = function () {
		return this.IOData8[6] | (this.IOData8[7] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.readBG0BG1CNT32 = function () {
		return this.IOData8[4] | (this.IOData8[5] << 8) | (this.IOData8[6] << 16) | (this.IOData8[7] << 24);
	}
}
GameBoyAdvanceRendererProxy.prototype.writeBG2CNT8_0 = function (data) {
	data = data | 0;
	data = data & 0xCF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[8] = data | 0;
	this.renderer.writeBG2CNT8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBG2CNT8_0 = function () {
	return this.IOData8[8] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBG2CNT8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[9] = data | 0;
	this.renderer.writeBG2CNT8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBG2CNT8_1 = function () {
	return this.IOData8[9] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBG3CNT8_0 = function (data) {
	data = data | 0;
	data = data & 0xCF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[10] = data | 0;
	this.renderer.writeBG3CNT8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBG3CNT8_0 = function () {
	return this.IOData8[10] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBG3CNT8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[11] = data | 0;
	this.renderer.writeBG3CNT8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBG3CNT8_1 = function () {
	return this.IOData8[11] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceRendererProxy.prototype.writeBG2CNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[4] = data | 0;
		this.renderer.writeBG2CNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBG3CNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[5] = data | 0;
		this.renderer.writeBG3CNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBG2BG3CNT32 = function (data) {
		data = data | 0;
		data = data & 0xFFCFFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData32[2] = data | 0;
		this.renderer.writeBG2BG3CNT32(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.readBG2CNT16 = function () {
		return this.IOData16[4] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.readBG3CNT16 = function () {
		return this.IOData16[5] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.readBG2BG3CNT32 = function () {
		return this.IOData32[2] | 0;
	}
} else {
	GameBoyAdvanceRendererProxy.prototype.writeBG2CNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[8] = data & 0xFF;
		this.IOData8[9] = data >> 8;
		this.renderer.writeBG2CNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBG3CNT16 = function (data) {
		data = data | 0;
		data = data & 0xFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[10] = data & 0xFF;
		this.IOData8[11] = data >> 8;
		this.renderer.writeBG3CNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBG2BG3CNT32 = function (data) {
		data = data | 0;
		data = data & 0xFFCFFFCF;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[8] = data & 0xFF;
		this.IOData8[9] = (data >> 8) & 0xFF;
		this.IOData8[10] = (data >> 16) & 0xFF;
		this.IOData8[11] = data >>> 24;
		this.renderer.writeBG2BG3CNT32(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.readBG2CNT16 = function () {
		return this.IOData8[8] | (this.IOData8[9] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.readBG3CNT16 = function () {
		return this.IOData8[10] | (this.IOData8[11] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.readBG2BG3CNT32 = function () {
		return this.IOData8[8] | (this.IOData8[9] << 8) | (this.IOData8[10] << 16) | (this.IOData8[11] << 24);
	}
}
GameBoyAdvanceRendererProxy.prototype.writeBG0HOFS8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG0HOFS8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG0HOFS8_1 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG0HOFS8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG0HOFS16 = function (data) {
	data = data | 0;
	data = data & 0x1FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG0HOFS16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG0VOFS8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG0VOFS8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG0VOFS8_1 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG0VOFS8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG0VOFS16 = function (data) {
	data = data | 0;
	data = data & 0x1FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG0VOFS16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG0OFS32 = function (data) {
	data = data | 0;
	data = data & 0x1FF01FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG0OFS32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG1HOFS8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG1HOFS8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG1HOFS8_1 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG1HOFS8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG1HOFS16 = function (data) {
	data = data | 0;
	data = data & 0x1FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG1HOFS16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG1VOFS8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG1VOFS8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG1VOFS8_1 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG1VOFS8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG1VOFS16 = function (data) {
	data = data | 0;
	data = data & 0x1FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG1VOFS16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG1OFS32 = function (data) {
	data = data | 0;
	data = data & 0x1FF01FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG1OFS32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2HOFS8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2HOFS8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2HOFS8_1 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2HOFS8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2HOFS16 = function (data) {
	data = data | 0;
	data = data & 0x1FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2HOFS16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2VOFS8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2VOFS8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2VOFS8_1 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2VOFS8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2VOFS16 = function (data) {
	data = data | 0;
	data = data & 0x1FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2VOFS16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2OFS32 = function (data) {
	data = data | 0;
	data = data & 0x1FF01FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2OFS32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3HOFS8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3HOFS8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3HOFS8_1 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3HOFS8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3HOFS16 = function (data) {
	data = data | 0;
	data = data & 0x1FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3HOFS16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3VOFS8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3VOFS8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3VOFS8_1 = function (data) {
	data = data | 0;
	data = data & 0x1;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3VOFS8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3VOFS16 = function (data) {
	data = data | 0;
	data = data & 0x1FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3VOFS16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3OFS32 = function (data) {
	data = data | 0;
	data = data & 0x1FF01FF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3OFS32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PA8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PA8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PA8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PA8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PA16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PA16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PB8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PB8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PB8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PB8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PB16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PB16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PAB32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PAB32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PC8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PC8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PC8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PC8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PC16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PC16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PD8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PD8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PD8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PD8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PD16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PD16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2PCD32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2PCD32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PA8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PA8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PA8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PA8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PA16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PA16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PB8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PB8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PB8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PB8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PB16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PB16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PAB32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PAB32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PC8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PC8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PC8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PC8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PC16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PC16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PD8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PD8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PD8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PD8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PD16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PD16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3PCD32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3PCD32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2X8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2X8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2X8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2X8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2X8_2 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2X8_2(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2X8_3 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2X8_3(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2X16_0 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2X16_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2X16_1 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2X16_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2X32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2X32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2Y8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2Y8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2Y8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2Y8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2Y8_2 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2Y8_2(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2Y8_3 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2Y8_3(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2Y16_0 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2Y16_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2Y16_1 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2Y16_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG2Y32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG2Y32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3X8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3X8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3X8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3X8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3X8_2 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3X8_2(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3X8_3 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3X8_3(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3X16_0 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3X16_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3X16_1 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3X16_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3X32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3X32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3Y8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3Y8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3Y8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3Y8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3Y8_2 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3Y8_2(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3Y8_3 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3Y8_3(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3Y16_0 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3Y16_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3Y16_1 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3Y16_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBG3Y32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBG3Y32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN0XCOORDRight8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN0XCOORDRight8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN0XCOORDLeft8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN0XCOORDLeft8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN0XCOORD16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN0XCOORD16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN1XCOORDRight8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN1XCOORDRight8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN1XCOORDLeft8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN1XCOORDLeft8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN1XCOORD16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN1XCOORD16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWINXCOORD32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWINXCOORD32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN0YCOORDBottom8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN0YCOORDBottom8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN0YCOORDTop8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN0YCOORDTop8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN0YCOORD16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN0YCOORD16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN1YCOORDBottom8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN1YCOORDBottom8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN1YCOORDTop8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN1YCOORDTop8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN1YCOORD16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWIN1YCOORD16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWINYCOORD32 = function (data) {
	data = data | 0;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeWINYCOORD32(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeWIN0IN8 = function (data) {
	data = data | 0;
	data = data & 0x3F;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[12] = data | 0;
	this.renderer.writeWIN0IN8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readWIN0IN8 = function () {
	return this.IOData8[12] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeWIN1IN8 = function (data) {
	data = data | 0;
	data = data & 0x3F;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[13] = data | 0;
	this.renderer.writeWIN1IN8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readWIN1IN8 = function () {
	return this.IOData8[13] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeWINOUT8 = function (data) {
	data = data | 0;
	data = data & 0x3F;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[14] = data | 0;
	this.renderer.writeWINOUT8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readWINOUT8 = function () {
	return this.IOData8[14] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeWINOBJIN8 = function (data) {
	data = data | 0;
	data = data & 0x3F;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[15] = data | 0;
	this.renderer.writeWINOBJIN8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readWINOBJIN8 = function () {
	return this.IOData8[15] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceRendererProxy.prototype.writeWININ16 = function (data) {
		data = data | 0;
		data = data & 0x3F3F;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[6] = data | 0;
		this.renderer.writeWININ16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeWINOUT16 = function (data) {
		data = data | 0;
		data = data & 0x3F3F;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[7] = data | 0;
		this.renderer.writeWINOUT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeWINCONTROL32 = function (data) {
		data = data | 0;
		data = data & 0x3F3F3F3F;
		this.IOCore.updateGraphicsClocking();
		this.IOData32[3] = data | 0;
		this.renderer.writeWINCONTROL32(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.readWININ16 = function () {
		return this.IOData16[6] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.readWINOUT16 = function () {
		return this.IOData16[7] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.readWINCONTROL32 = function () {
		return this.IOData32[3] | 0;
	}
} else {
	GameBoyAdvanceRendererProxy.prototype.writeWININ16 = function (data) {
		data = data | 0;
		data = data & 0x3F3F;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[12] = data & 0xFF;
		this.IOData8[13] = data >> 8;
		this.renderer.writeWININ16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeWINOUT16 = function (data) {
		data = data | 0;
		data = data & 0x3F3F;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[14] = data & 0xFF;
		this.IOData8[15] = data >> 8;
		this.renderer.writeWINOUT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeWINCONTROL32 = function (data) {
		data = data | 0;
		data = data & 0x3F3F3F3F;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[12] = data & 0xFF;
		this.IOData8[13] = (data >> 8) & 0xFF;
		this.IOData8[14] = (data >> 16) & 0xFF;
		this.IOData8[15] = data >>> 24;
		this.renderer.writeWINCONTROL32(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.readWININ16 = function () {
		return this.IOData8[12] | (this.IOData8[13] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.readWINOUT16 = function () {
		return this.IOData8[14] | (this.IOData8[15] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.readWINCONTROL32 = function () {
		return this.IOData8[12] | (this.IOData8[13] << 8) | (this.IOData8[14] << 16) | (this.IOData8[15] << 24);
	}
}
GameBoyAdvanceRendererProxy.prototype.writeMOSAIC8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeMOSAIC8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeMOSAIC8_1 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeMOSAIC8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeMOSAIC16 = function (data) {
	data = data | 0;
	data = data & 0xFFFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeMOSAIC16(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeBLDCNT8_0 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[16] = data | 0;
	this.renderer.writeBLDCNT8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBLDCNT8_0 = function () {
	return this.IOData8[16] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBLDCNT8_1 = function (data) {
	data = data | 0;
	data = data & 0x3F;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[17] = data | 0;
	this.renderer.writeBLDCNT8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBLDCNT8_1 = function () {
	return this.IOData8[17] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBLDALPHA8_0 = function (data) {
	data = data | 0;
	data = data & 0x1F;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[18] = data | 0;
	this.renderer.writeBLDALPHA8_0(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBLDALPHA8_0 = function () {
	return this.IOData8[18] | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeBLDALPHA8_1 = function (data) {
	data = data | 0;
	data = data & 0x1F;
	this.IOCore.updateGraphicsClocking();
	this.IOData8[19] = data | 0;
	this.renderer.writeBLDALPHA8_1(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readBLDALPHA8_1 = function () {
	return this.IOData8[19] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceRendererProxy.prototype.writeBLDCNT16 = function (data) {
		data = data | 0;
		data = data & 0x3FFF;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[8] = data | 0;
		this.renderer.writeBLDCNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBLDALPHA16 = function (data) {
		data = data | 0;
		data = data & 0x1F1F;
		this.IOCore.updateGraphicsClocking();
		this.IOData16[9] = data | 0;
		this.renderer.writeBLDALPHA16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBLDCNT32 = function (data) {
		data = data | 0;
		data = data & 0x1F1F3FFF;
		this.IOCore.updateGraphicsClocking();
		this.IOData32[4] = data | 0;
		this.renderer.writeBLDCNT32(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.readBLDCNT16 = function () {
		return this.IOData16[8] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.readBLDALPHA16 = function () {
		return this.IOData16[9] | 0;
	}
	GameBoyAdvanceRendererProxy.prototype.readBLDCNT32 = function () {
		return this.IOData32[4] | 0;
	}
} else {
	GameBoyAdvanceRendererProxy.prototype.writeBLDCNT16 = function (data) {
		data = data | 0;
		data = data & 0x3FFF;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[16] = data & 0xFF;
		this.IOData8[17] = data >> 8;
		this.renderer.writeBLDCNT16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBLDALPHA16 = function (data) {
		data = data | 0;
		data = data & 0x1F1F;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[18] = data & 0xFF;
		this.IOData8[19] = data >> 8;
		this.renderer.writeBLDALPHA16(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.writeBLDCNT32 = function (data) {
		data = data | 0;
		data = data & 0x1F1F3FFF;
		this.IOCore.updateGraphicsClocking();
		this.IOData8[16] = data & 0xFF;
		this.IOData8[17] = (data >> 8) & 0xFF;
		this.IOData8[18] = (data >> 16) & 0xFF;
		this.IOData8[19] = data >>> 24;
		this.renderer.writeBLDCNT32(data | 0);
	}
	GameBoyAdvanceRendererProxy.prototype.readBLDCNT16 = function () {
		return this.IOData8[16] | (this.IOData8[17] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.readBLDALPHA16 = function () {
		return this.IOData8[18] | (this.IOData8[19] << 8);
	}
	GameBoyAdvanceRendererProxy.prototype.readBLDCNT32 = function () {
		return this.IOData8[16] | (this.IOData8[17] << 8) | (this.IOData8[18] << 16) | (this.IOData8[19] << 24);
	}
}
GameBoyAdvanceRendererProxy.prototype.writeBLDY8 = function (data) {
	data = data | 0;
	data = data & 0xFF;
	this.IOCore.updateGraphicsClocking();
	this.renderer.writeBLDY8(data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeVRAM8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.renderer.writeVRAM8(address | 0, data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeVRAM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.renderer.writeVRAM16(address | 0, data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeVRAM32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.renderer.writeVRAM32(address | 0, data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readVRAM16 = function (address) {
	address = address | 0;
	var data = this.renderer.readVRAM16(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceRendererProxy.prototype.readVRAM32 = function (address) {
	address = address | 0;
	var data = this.renderer.readVRAM32(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceRendererProxy.prototype.writePalette16 = function (address, data) {
	data = data | 0;
	address = address | 0;
	this.renderer.writePalette16(address | 0, data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writePalette32 = function (address, data) {
	data = data | 0;
	address = address | 0;
	this.renderer.writePalette32(address | 0, data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readPalette16 = function (address) {
	address = address | 0;
	var data = this.renderer.readPalette16(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceRendererProxy.prototype.readPalette32 = function (address) {
	address = address | 0;
	var data = this.renderer.readPalette32(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceRendererProxy.prototype.readVRAM8 = function (address) {
	address = address | 0;
	var data = this.renderer.readVRAM8(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceRendererProxy.prototype.writeOAM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.renderer.writeOAM16(address | 0, data | 0);
}
GameBoyAdvanceRendererProxy.prototype.writeOAM32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.renderer.writeOAM32(address | 0, data | 0);
}
GameBoyAdvanceRendererProxy.prototype.readOAM = function (address) {
	address = address | 0;
	var data = this.renderer.readOAM(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceRendererProxy.prototype.readOAM16 = function (address) {
	address = address | 0;
	var data = this.renderer.readOAM16(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceRendererProxy.prototype.readOAM32 = function (address) {
	address = address | 0;
	var data = this.renderer.readOAM32(address | 0) | 0;
	return data | 0;
}
GameBoyAdvanceRendererProxy.prototype.readPalette8 = function (address) {
	address = address | 0;
	var data = this.renderer.readPalette8(address | 0) | 0;
	return data | 0;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceBGTEXTRenderer(gfx, BGLayer) {
	BGLayer = BGLayer | 0;
	this.gfx = gfx;
	this.BGLayer = BGLayer | 0;
}
if (__VIEWS_SUPPORTED__) {
	GameBoyAdvanceBGTEXTRenderer.prototype.initialize = function () {
		this.VRAM = this.gfx.VRAM;
		this.VRAM16 = this.gfx.VRAM16;
		this.VRAM32 = this.gfx.VRAM32;
		this.palette16 = this.gfx.palette16;
		this.palette256 = this.gfx.palette256;
		this.offset = ((this.BGLayer << 8) + 0x100) | 0;
		this.scratchBuffer = getInt32ViewCustom(this.gfx.buffer, this.offset | 0, ((this.offset | 0) + 248) | 0);
		this.tileFetched = getInt32ViewCustom(this.gfx.buffer, ((this.offset | 0) + 0xF8) | 0, ((this.offset | 0) + 0x100) | 0);
		this.BGXCoord = 0;
		this.BGYCoord = 0;
		this.do256 = 0;
		this.screenSizePreprocess();
		this.priorityPreprocess();
		this.screenBaseBlockPreprocess();
		this.characterBaseBlockPreprocess();
	}
	GameBoyAdvanceBGTEXTRenderer.prototype.renderWholeTiles8BIT = function (xTileStart, yTileStart, yTileOffset) {
		xTileStart = xTileStart | 0;
		yTileStart = yTileStart | 0;
		yTileOffset = yTileOffset | 0;
		//Process full 8 pixels at a time:
		for (var position = (8 - (this.BGXCoord & 0x7)) | 0;
			(position | 0) < 240; position = ((position | 0) + 8) | 0) {
			//Fetch tile attributes:
			//Get 8 pixels of data:
			this.process8BitVRAM(this.fetchTile(yTileStart | 0, xTileStart | 0) | 0, yTileOffset | 0);
			//Copy the buffered tile to line:
			this.scratchBuffer[position | 0] = this.tileFetched[0] | 0;
			this.scratchBuffer[((position | 0) + 1) | 0] = this.tileFetched[1] | 0;
			this.scratchBuffer[((position | 0) + 2) | 0] = this.tileFetched[2] | 0;
			this.scratchBuffer[((position | 0) + 3) | 0] = this.tileFetched[3] | 0;
			this.scratchBuffer[((position | 0) + 4) | 0] = this.tileFetched[4] | 0;
			this.scratchBuffer[((position | 0) + 5) | 0] = this.tileFetched[5] | 0;
			this.scratchBuffer[((position | 0) + 6) | 0] = this.tileFetched[6] | 0;
			this.scratchBuffer[((position | 0) + 7) | 0] = this.tileFetched[7] | 0;
			//Increment a tile counter:
			xTileStart = ((xTileStart | 0) + 1) | 0;
		}
	}
	GameBoyAdvanceBGTEXTRenderer.prototype.renderWholeTiles4BIT = function (xTileStart, yTileStart, yTileOffset) {
		xTileStart = xTileStart | 0;
		yTileStart = yTileStart | 0;
		yTileOffset = yTileOffset | 0;
		//Process full 8 pixels at a time:
		for (var position = (8 - (this.BGXCoord & 0x7)) | 0;
			(position | 0) < 240; position = ((position | 0) + 8) | 0) {
			//Fetch tile attributes:
			//Get 8 pixels of data:
			this.process4BitVRAM(this.fetchTile(yTileStart | 0, xTileStart | 0) | 0, yTileOffset | 0);
			//Copy the buffered tile to line:
			this.scratchBuffer[position | 0] = this.tileFetched[0] | 0;
			this.scratchBuffer[((position | 0) + 1) | 0] = this.tileFetched[1] | 0;
			this.scratchBuffer[((position | 0) + 2) | 0] = this.tileFetched[2] | 0;
			this.scratchBuffer[((position | 0) + 3) | 0] = this.tileFetched[3] | 0;
			this.scratchBuffer[((position | 0) + 4) | 0] = this.tileFetched[4] | 0;
			this.scratchBuffer[((position | 0) + 5) | 0] = this.tileFetched[5] | 0;
			this.scratchBuffer[((position | 0) + 6) | 0] = this.tileFetched[6] | 0;
			this.scratchBuffer[((position | 0) + 7) | 0] = this.tileFetched[7] | 0;
			//Increment a tile counter:
			xTileStart = ((xTileStart | 0) + 1) | 0;
		}
	}
	GameBoyAdvanceBGTEXTRenderer.prototype.fetchVRAMStart = function () {
		//Handle the the first tile of the scan-line specially:
		var pixelPipelinePosition = this.BGXCoord & 0x7;
		switch (pixelPipelinePosition | 0) {
			case 0:
				this.scratchBuffer[0] = this.tileFetched[0] | 0;
			case 1:
				this.scratchBuffer[(1 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[1] | 0;
			case 2:
				this.scratchBuffer[(2 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[2] | 0;
			case 3:
				this.scratchBuffer[(3 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[3] | 0;
			case 4:
				this.scratchBuffer[(4 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[4] | 0;
			case 5:
				this.scratchBuffer[(5 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[5] | 0;
			case 6:
				this.scratchBuffer[(6 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[6] | 0;
			default:
				this.scratchBuffer[(7 - (pixelPipelinePosition | 0)) | 0] = this.tileFetched[7] | 0;
		}
	}
} else {
	GameBoyAdvanceBGTEXTRenderer.prototype.initialize = function () {
		this.VRAM = this.gfx.VRAM;
		this.VRAM16 = this.gfx.VRAM16;
		this.VRAM32 = this.gfx.VRAM32;
		this.palette16 = this.gfx.palette16;
		this.palette256 = this.gfx.palette256;
		this.offset = (this.BGLayer << 8) + 0x100;
		this.offsetEnd = this.offset + 240;
		this.scratchBuffer = this.gfx.buffer;
		this.tileFetched = getInt32Array(8);
		this.BGXCoord = 0;
		this.BGYCoord = 0;
		this.do256 = 0;
		this.screenSizePreprocess();
		this.priorityPreprocess();
		this.screenBaseBlockPreprocess();
		this.characterBaseBlockPreprocess();
	}
	GameBoyAdvanceBGTEXTRenderer.prototype.renderWholeTiles8BIT = function (xTileStart, yTileStart, yTileOffset) {
		//Process full 8 pixels at a time:
		for (var position = 8 - (this.BGXCoord & 0x7) + this.offset; position < this.offsetEnd;) {
			//Fetch tile attributes:
			//Get 8 pixels of data:
			this.process8BitVRAM(this.fetchTile(yTileStart, xTileStart++), yTileOffset);
			//Copy the buffered tile to line:
			this.scratchBuffer[position++] = this.tileFetched[0];
			this.scratchBuffer[position++] = this.tileFetched[1];
			this.scratchBuffer[position++] = this.tileFetched[2];
			this.scratchBuffer[position++] = this.tileFetched[3];
			this.scratchBuffer[position++] = this.tileFetched[4];
			this.scratchBuffer[position++] = this.tileFetched[5];
			this.scratchBuffer[position++] = this.tileFetched[6];
			this.scratchBuffer[position++] = this.tileFetched[7];
		}
	}
	GameBoyAdvanceBGTEXTRenderer.prototype.renderWholeTiles4BIT = function (xTileStart, yTileStart, yTileOffset) {
		//Process full 8 pixels at a time:
		for (var position = 8 - (this.BGXCoord & 0x7) + this.offset; position < this.offsetEnd;) {
			//Fetch tile attributes:
			//Get 8 pixels of data:
			this.process4BitVRAM(this.fetchTile(yTileStart, xTileStart++), yTileOffset);
			//Copy the buffered tile to line:
			this.scratchBuffer[position++] = this.tileFetched[0];
			this.scratchBuffer[position++] = this.tileFetched[1];
			this.scratchBuffer[position++] = this.tileFetched[2];
			this.scratchBuffer[position++] = this.tileFetched[3];
			this.scratchBuffer[position++] = this.tileFetched[4];
			this.scratchBuffer[position++] = this.tileFetched[5];
			this.scratchBuffer[position++] = this.tileFetched[6];
			this.scratchBuffer[position++] = this.tileFetched[7];
		}
	}
	GameBoyAdvanceBGTEXTRenderer.prototype.fetchVRAMStart = function () {
		//Handle the the first tile of the scan-line specially:
		var pixelPipelinePosition = this.BGXCoord & 0x7;
		var offset = pixelPipelinePosition - this.offset;
		switch (pixelPipelinePosition | 0) {
			case 0:
				this.scratchBuffer[offset] = this.tileFetched[0];
			case 1:
				this.scratchBuffer[1 - offset] = this.tileFetched[1];
			case 2:
				this.scratchBuffer[2 - offset] = this.tileFetched[2];
			case 3:
				this.scratchBuffer[3 - offset] = this.tileFetched[3];
			case 4:
				this.scratchBuffer[4 - offset] = this.tileFetched[4];
			case 5:
				this.scratchBuffer[5 - offset] = this.tileFetched[5];
			case 6:
				this.scratchBuffer[6 - offset] = this.tileFetched[6];
			default:
				this.scratchBuffer[7 - offset] = this.tileFetched[7];
		}
	}
}
GameBoyAdvanceBGTEXTRenderer.prototype.renderScanLine = function (line) {
	line = line | 0;
	if ((this.gfx.BGMosaic[this.BGLayer & 3] | 0) != 0) {
		//Correct line number for mosaic:
		line = ((line | 0) - (this.gfx.mosaicRenderer.getMosaicYOffset(line | 0) | 0)) | 0;
	}
	var yTileOffset = ((line | 0) + (this.BGYCoord | 0)) & 0x7;
	var yTileStart = ((line | 0) + (this.BGYCoord | 0)) >> 3;
	var xTileStart = this.BGXCoord >> 3;
	//Render the tiles:
	if ((this.do256 | 0) != 0) {
		//8-bit palette mode:
		this.render8BITLine(yTileStart | 0, xTileStart | 0, yTileOffset | 0);
	} else {
		//4-bit palette mode:
		this.render4BITLine(yTileStart | 0, xTileStart | 0, yTileOffset | 0);
	}
	if ((this.gfx.BGMosaic[this.BGLayer & 3] | 0) != 0) {
		//Pixelize the line horizontally:
		this.gfx.mosaicRenderer.renderMosaicHorizontal(this.offset | 0);
	}
}
GameBoyAdvanceBGTEXTRenderer.prototype.render8BITLine = function (yTileStart, xTileStart, yTileOffset) {
	yTileStart = yTileStart | 0;
	xTileStart = xTileStart | 0;
	yTileOffset = yTileOffset | 0;
	//Fetch tile attributes:
	var chrData = this.fetchTile(yTileStart | 0, xTileStart | 0) | 0;
	xTileStart = ((xTileStart | 0) + 1) | 0;
	//Get 8 pixels of data:
	this.process8BitVRAM(chrData | 0, yTileOffset | 0);
	//Copy the buffered tile to line:
	this.fetchVRAMStart();
	//Render the rest of the tiles fast:
	this.renderWholeTiles8BIT(xTileStart | 0, yTileStart | 0, yTileOffset | 0);
}
GameBoyAdvanceBGTEXTRenderer.prototype.render4BITLine = function (yTileStart, xTileStart, yTileOffset) {
	//Fetch tile attributes:
	var chrData = this.fetchTile(yTileStart | 0, xTileStart | 0) | 0;
	xTileStart = ((xTileStart | 0) + 1) | 0;
	//Get 8 pixels of data:
	this.process4BitVRAM(chrData | 0, yTileOffset | 0);
	//Copy the buffered tile to line:
	this.fetchVRAMStart();
	//Render the rest of the tiles fast:
	this.renderWholeTiles4BIT(xTileStart | 0, yTileStart | 0, yTileOffset | 0);
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceBGTEXTRenderer.prototype.fetchTile = function (yTileStart, xTileStart) {
		yTileStart = yTileStart | 0;
		xTileStart = xTileStart | 0;
		//Find the tile code to locate the tile block:
		var address = ((this.computeTileNumber(yTileStart | 0, xTileStart | 0) | 0) + (this.BGScreenBaseBlock | 0)) | 0;
		return this.VRAM16[address & 0x7FFF] | 0;
	}
} else {
	GameBoyAdvanceBGTEXTRenderer.prototype.fetchTile = function (yTileStart, xTileStart) {
		//Find the tile code to locate the tile block:
		var address = ((this.computeTileNumber(yTileStart, xTileStart) + this.BGScreenBaseBlock) << 1) & 0xFFFF;
		return (this.VRAM[address | 1] << 8) | this.VRAM[address];
	}
}
GameBoyAdvanceBGTEXTRenderer.prototype.computeTileNumber = function (yTile, xTile) {
	//Return the true tile number:
	yTile = yTile | 0;
	xTile = xTile | 0;
	var tileNumber = xTile & 0x1F;
	switch (this.tileMode | 0) {
		//1x1
		case 0:
			tileNumber = tileNumber | ((yTile & 0x1F) << 5);
			break;
			//2x1
		case 1:
			tileNumber = tileNumber | (((xTile & 0x20) | (yTile & 0x1F)) << 5);
			break;
			//1x2
		case 2:
			tileNumber = tileNumber | ((yTile & 0x3F) << 5);
			break;
			//2x2
		default:
			tileNumber = tileNumber | (((xTile & 0x20) | (yTile & 0x1F)) << 5) | ((yTile & 0x20) << 6);
	}
	return tileNumber | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.process4BitVRAM = function (chrData, yOffset) {
	//16 color tile mode:
	chrData = chrData | 0;
	yOffset = yOffset | 0;
	//Parse flip attributes, grab palette, and then output pixel:
	var address = (chrData & 0x3FF) << 3;
	address = ((address | 0) + (this.BGCharacterBaseBlock | 0)) | 0;
	if ((chrData & 0x800) == 0) {
		//No vertical flip:
		address = ((address | 0) + (yOffset | 0)) | 0;

	} else {
		//Vertical flip:
		address = ((address | 0) + 7) | 0;
		address = ((address | 0) - (yOffset | 0)) | 0;
	}
	//Copy out our pixels:
	this.render4BitVRAM(chrData >> 8, address | 0);
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceBGTEXTRenderer.prototype.render4BitVRAM = function (chrData, address) {
		chrData = chrData | 0;
		address = address | 0;
		//Unrolled data tile line fetch:
		if ((address | 0) < 0x4000) {
			//Tile address valid:
			var paletteOffset = chrData & 0xF0;
			var data = this.VRAM32[address | 0] | 0;
			if ((chrData & 0x4) == 0) {
				//Normal Horizontal:
				this.tileFetched[0] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[1] = this.palette16[paletteOffset | ((data >> 4) & 0xF)] | this.priorityFlag;
				this.tileFetched[2] = this.palette16[paletteOffset | ((data >> 8) & 0xF)] | this.priorityFlag;
				this.tileFetched[3] = this.palette16[paletteOffset | ((data >> 12) & 0xF)] | this.priorityFlag;
				this.tileFetched[4] = this.palette16[paletteOffset | ((data >> 16) & 0xF)] | this.priorityFlag;
				this.tileFetched[5] = this.palette16[paletteOffset | ((data >> 20) & 0xF)] | this.priorityFlag;
				this.tileFetched[6] = this.palette16[paletteOffset | ((data >> 24) & 0xF)] | this.priorityFlag;
				this.tileFetched[7] = this.palette16[paletteOffset | (data >>> 28)] | this.priorityFlag;
			} else {
				//Flipped Horizontally:
				this.tileFetched[0] = this.palette16[paletteOffset | (data >>> 28)] | this.priorityFlag;
				this.tileFetched[1] = this.palette16[paletteOffset | ((data >> 24) & 0xF)] | this.priorityFlag;
				this.tileFetched[2] = this.palette16[paletteOffset | ((data >> 20) & 0xF)] | this.priorityFlag;
				this.tileFetched[3] = this.palette16[paletteOffset | ((data >> 16) & 0xF)] | this.priorityFlag;
				this.tileFetched[4] = this.palette16[paletteOffset | ((data >> 12) & 0xF)] | this.priorityFlag;
				this.tileFetched[5] = this.palette16[paletteOffset | ((data >> 8) & 0xF)] | this.priorityFlag;
				this.tileFetched[6] = this.palette16[paletteOffset | ((data >> 4) & 0xF)] | this.priorityFlag;
				this.tileFetched[7] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
			}
		} else {
			//Tile address invalid:
			this.addressInvalidRender();
		}
	}
} else {
	GameBoyAdvanceBGTEXTRenderer.prototype.render4BitVRAM = function (chrData, address) {
		address <<= 2;
		//Unrolled data tile line fetch:
		if (address < 0x10000) {
			//Tile address valid:
			var paletteOffset = chrData & 0xF0;
			var data = this.VRAM[address];
			if ((chrData & 0x4) == 0) {
				//Normal Horizontal:
				this.tileFetched[0] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[1] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
				data = this.VRAM[address | 1];
				this.tileFetched[2] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[3] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
				data = this.VRAM[address | 2];
				this.tileFetched[4] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[5] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
				data = this.VRAM[address | 3];
				this.tileFetched[6] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[7] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
			} else {
				//Flipped Horizontally:
				this.tileFetched[7] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[6] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
				data = this.VRAM[address | 1];
				this.tileFetched[5] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[4] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
				data = this.VRAM[address | 2];
				this.tileFetched[3] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[2] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
				data = this.VRAM[address | 3];
				this.tileFetched[1] = this.palette16[paletteOffset | (data & 0xF)] | this.priorityFlag;
				this.tileFetched[0] = this.palette16[paletteOffset | (data >> 4)] | this.priorityFlag;
			}
		} else {
			//Tile address invalid:
			this.addressInvalidRender();
		}
	}
}
/*
 If there was 64 bit typed array support,
 then process8BitVRAM, render8BitVRAMNormal,
 and render8BitVRAMFlipped could be optimized further.
 Namely make one fetch for tile data instead of two,
 and cancel a y-offset shift.
 */
GameBoyAdvanceBGTEXTRenderer.prototype.process8BitVRAM = function (chrData, yOffset) {
	//16 color tile mode:
	chrData = chrData | 0;
	yOffset = yOffset | 0;
	//Parse flip attributes, grab palette, and then output pixel:
	var address = (chrData & 0x3FF) << 4;
	address = ((address | 0) + (this.BGCharacterBaseBlock | 0)) | 0;
	//Copy out our pixels:
	switch (chrData & 0xC00) {
		//No Flip:
		case 0:
			address = ((address | 0) + (yOffset << 1)) | 0;
			this.render8BitVRAMNormal(address | 0);
			break;
			//Horizontal Flip:
		case 0x400:
			address = ((address | 0) + (yOffset << 1)) | 0;
			this.render8BitVRAMFlipped(address | 0);
			break;
			//Vertical Flip:
		case 0x800:
			address = ((address | 0) + 14) | 0;
			address = ((address | 0) - (yOffset << 1)) | 0;
			this.render8BitVRAMNormal(address | 0);
			break;
			//Horizontal & Vertical Flip:
		default:
			address = ((address | 0) + 14) | 0;
			address = ((address | 0) - (yOffset << 1)) | 0;
			this.render8BitVRAMFlipped(address | 0);
	}
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceBGTEXTRenderer.prototype.render8BitVRAMNormal = function (address) {
		address = address | 0;
		if ((address | 0) < 0x4000) {
			//Tile address valid:
			//Normal Horizontal:
			var data = this.VRAM32[address | 0] | 0;
			this.tileFetched[0] = this.palette256[data & 0xFF] | this.priorityFlag;
			this.tileFetched[1] = this.palette256[(data >> 8) & 0xFF] | this.priorityFlag;
			this.tileFetched[2] = this.palette256[(data >> 16) & 0xFF] | this.priorityFlag;
			this.tileFetched[3] = this.palette256[data >>> 24] | this.priorityFlag;
			data = this.VRAM32[address | 1] | 0;
			this.tileFetched[4] = this.palette256[data & 0xFF] | this.priorityFlag;
			this.tileFetched[5] = this.palette256[(data >> 8) & 0xFF] | this.priorityFlag;
			this.tileFetched[6] = this.palette256[(data >> 16) & 0xFF] | this.priorityFlag;
			this.tileFetched[7] = this.palette256[data >>> 24] | this.priorityFlag;
		} else {
			//Tile address invalid:
			this.addressInvalidRender();
		}
	}
	GameBoyAdvanceBGTEXTRenderer.prototype.render8BitVRAMFlipped = function (address) {
		address = address | 0;
		if ((address | 0) < 0x4000) {
			//Tile address valid:
			//Flipped Horizontally:
			var data = this.VRAM32[address | 0] | 0;
			this.tileFetched[4] = this.palette256[data >>> 24] | this.priorityFlag;
			this.tileFetched[5] = this.palette256[(data >> 16) & 0xFF] | this.priorityFlag;
			this.tileFetched[6] = this.palette256[(data >> 8) & 0xFF] | this.priorityFlag;
			this.tileFetched[7] = this.palette256[data & 0xFF] | this.priorityFlag;
			data = this.VRAM32[address | 1] | 0;
			this.tileFetched[0] = this.palette256[data >>> 24] | this.priorityFlag;
			this.tileFetched[1] = this.palette256[(data >> 16) & 0xFF] | this.priorityFlag;
			this.tileFetched[2] = this.palette256[(data >> 8) & 0xFF] | this.priorityFlag;
			this.tileFetched[3] = this.palette256[data & 0xFF] | this.priorityFlag;
		} else {
			//Tile address invalid:
			this.addressInvalidRender();
		}
	}
} else {
	GameBoyAdvanceBGTEXTRenderer.prototype.render8BitVRAMNormal = function (address) {
		address <<= 2;
		if (address < 0x10000) {
			//Tile address valid:
			//Normal Horizontal:
			this.tileFetched[0] = this.palette256[this.VRAM[address]] | this.priorityFlag;
			this.tileFetched[1] = this.palette256[this.VRAM[address | 1]] | this.priorityFlag;
			this.tileFetched[2] = this.palette256[this.VRAM[address | 2]] | this.priorityFlag;
			this.tileFetched[3] = this.palette256[this.VRAM[address | 3]] | this.priorityFlag;
			this.tileFetched[4] = this.palette256[this.VRAM[address | 4]] | this.priorityFlag;
			this.tileFetched[5] = this.palette256[this.VRAM[address | 5]] | this.priorityFlag;
			this.tileFetched[6] = this.palette256[this.VRAM[address | 6]] | this.priorityFlag;
			this.tileFetched[7] = this.palette256[this.VRAM[address | 7]] | this.priorityFlag;
		} else {
			//Tile address invalid:
			this.addressInvalidRender();
		}
	}
	GameBoyAdvanceBGTEXTRenderer.prototype.render8BitVRAMFlipped = function (address) {
		address <<= 2;
		if (address < 0x10000) {
			//Tile address valid:
			//Flipped Horizontally:
			this.tileFetched[7] = this.palette256[this.VRAM[address]] | this.priorityFlag;
			this.tileFetched[6] = this.palette256[this.VRAM[address | 1]] | this.priorityFlag;
			this.tileFetched[5] = this.palette256[this.VRAM[address | 2]] | this.priorityFlag;
			this.tileFetched[4] = this.palette256[this.VRAM[address | 3]] | this.priorityFlag;
			this.tileFetched[3] = this.palette256[this.VRAM[address | 4]] | this.priorityFlag;
			this.tileFetched[2] = this.palette256[this.VRAM[address | 5]] | this.priorityFlag;
			this.tileFetched[1] = this.palette256[this.VRAM[address | 6]] | this.priorityFlag;
			this.tileFetched[0] = this.palette256[this.VRAM[address | 7]] | this.priorityFlag;
		} else {
			//Tile address invalid:
			this.addressInvalidRender();
		}
	}
}
GameBoyAdvanceBGTEXTRenderer.prototype.addressInvalidRender = function () {
	//In GBA mode on NDS, we display transparency on invalid tiles:
	var data = this.gfx.transparency | this.priorityFlag;
	this.tileFetched[0] = data | 0;
	this.tileFetched[1] = data | 0;
	this.tileFetched[2] = data | 0;
	this.tileFetched[3] = data | 0;
	this.tileFetched[4] = data | 0;
	this.tileFetched[5] = data | 0;
	this.tileFetched[6] = data | 0;
	this.tileFetched[7] = data | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.paletteModeSelect = function (do256) {
	do256 = do256 | 0;
	this.do256 = do256 | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.screenSizePreprocess = function () {
	this.tileMode = this.gfx.BGScreenSize[this.BGLayer & 0x3] | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.priorityPreprocess = function () {
	this.priorityFlag = (this.gfx.BGPriority[this.BGLayer & 3] << 23) | (1 << (this.BGLayer | 0x10));
}
GameBoyAdvanceBGTEXTRenderer.prototype.screenBaseBlockPreprocess = function () {
	this.BGScreenBaseBlock = this.gfx.BGScreenBaseBlock[this.BGLayer & 3] << 10;
}
GameBoyAdvanceBGTEXTRenderer.prototype.characterBaseBlockPreprocess = function () {
	this.BGCharacterBaseBlock = this.gfx.BGCharacterBaseBlock[this.BGLayer & 3] << 12;
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGHOFS8_0 = function (data) {
	data = data | 0;
	this.BGXCoord = (this.BGXCoord & 0x100) | data;
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGHOFS8_1 = function (data) {
	data = data | 0;
	this.BGXCoord = (data << 8) | (this.BGXCoord & 0xFF);
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGHOFS16 = function (data) {
	data = data | 0;
	this.BGXCoord = data | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGVOFS8_0 = function (data) {
	data = data | 0;
	this.BGYCoord = (this.BGYCoord & 0x100) | data;
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGVOFS8_1 = function (data) {
	data = data | 0;
	this.BGYCoord = (data << 8) | (this.BGYCoord & 0xFF);
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGVOFS16 = function (data) {
	data = data | 0;
	this.BGYCoord = data | 0;
}
GameBoyAdvanceBGTEXTRenderer.prototype.writeBGOFS32 = function (data) {
	data = data | 0;
	this.BGXCoord = data & 0x1FF;
	this.BGYCoord = data >> 16;
}




"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceBG2FrameBufferRenderer(gfx) {
	this.gfx = gfx;
}
GameBoyAdvanceBG2FrameBufferRenderer.prototype.initialize = function () {
	this.palette = this.gfx.palette256;
	this.VRAM = this.gfx.VRAM;
	this.VRAM16 = this.gfx.VRAM16;
	this.fetchPixel = this.fetchMode3Pixel;
	this.bgAffineRenderer = this.gfx.bgAffineRenderer0;
	this.frameSelect = 0;
}
GameBoyAdvanceBG2FrameBufferRenderer.prototype.selectMode = function (mode) {
	mode = mode | 0;
	switch (mode | 0) {
		case 3:
			this.fetchPixel = this.fetchMode3Pixel;
			break;
		case 4:
			this.fetchPixel = this.fetchMode4Pixel;
			break;
		case 5:
			this.fetchPixel = this.fetchMode5Pixel;
	}
}
GameBoyAdvanceBG2FrameBufferRenderer.prototype.renderScanLine = function (line) {
	line = line | 0;
	this.bgAffineRenderer.renderScanLine(line | 0, this);
}
if (__LITTLE_ENDIAN__) {
	if (typeof Math.imul == "function") {
		//Math.imul found, insert the optimized path in:
		GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode3Pixel = function (x, y) {
			x = x | 0;
			y = y | 0;
			//Output pixel:
			if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 240 && (y | 0) < 160) {
				var address = (Math.imul(y | 0, 240) + (x | 0)) | 0;
				return this.VRAM16[address & 0xFFFF] & 0x7FFF;
			}
			//Out of range, output transparency:
			return 0x3800000;
		}
		GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode5Pixel = function (x, y) {
			x = x | 0;
			y = y | 0;
			//Output pixel:
			if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 160 && (y | 0) < 128) {
				var address = ((this.frameSelect | 0) + Math.imul(y | 0, 160) + (x | 0)) | 0;
				return this.VRAM16[address & 0xFFFF] & 0x7FFF;
			}
			//Out of range, output transparency:
			return 0x3800000;
		}
	} else {
		//Math.imul not found, use the compatibility method:
		GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode3Pixel = function (x, y) {
			x = x | 0;
			y = y | 0;
			//Output pixel:
			if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 240 && (y | 0) < 160) {
				var address = (((y * 240) | 0) + (x | 0)) | 0;
				return this.VRAM16[address & 0xFFFF] & 0x7FFF;
			}
			//Out of range, output transparency:
			return 0x3800000;
		}
		GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode5Pixel = function (x, y) {
			x = x | 0;
			y = y | 0;
			//Output pixel:
			if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 160 && (y | 0) < 128) {
				var address = ((this.frameSelect | 0) + ((y * 160) | 0) + (x | 0)) | 0;
				return this.VRAM16[address & 0xFFFF] & 0x7FFF;
			}
			//Out of range, output transparency:
			return 0x3800000;
		}
	}
} else {
	if (typeof Math.imul == "function") {
		//Math.imul found, insert the optimized path in:
		GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode3Pixel = function (x, y) {
			x = x | 0;
			y = y | 0;
			//Output pixel:
			if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 240 && (y | 0) < 160) {
				var address = (Math.imul(y | 0, 240) + (x | 0)) << 1;
				return ((this.VRAM[address | 1] << 8) | this.VRAM[address | 0]) & 0x7FFF;
			}
			//Out of range, output transparency:
			return 0x3800000;
		}
		GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode5Pixel = function (x, y) {
			x = x | 0;
			y = y | 0;
			//Output pixel:
			if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 160 && (y | 0) < 128) {
				var address = ((this.frameSelect | 0) + ((Math.imul(y | 0, 160) + (x | 0)) << 1)) | 0;
				return ((this.VRAM[address | 1] << 8) | this.VRAM[address | 0]) & 0x7FFF;
			}
			//Out of range, output transparency:
			return 0x3800000;
		}
	} else {
		//Math.imul not found, use the compatibility method:
		GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode3Pixel = function (x, y) {
			//Output pixel:
			if (x > -1 && y > -1 && x < 240 && y < 160) {
				var address = ((y * 240) + x) << 1;
				return ((this.VRAM[address | 1] << 8) | this.VRAM[address]) & 0x7FFF;
			}
			//Out of range, output transparency:
			return 0x3800000;
		}
		GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode5Pixel = function (x, y) {
			//Output pixel:
			if (x > -1 && y > -1 && x < 160 && y < 128) {
				var address = this.frameSelect + (((y * 160) + x) << 1);
				return ((this.VRAM[address | 1] << 8) | this.VRAM[address]) & 0x7FFF;
			}
			//Out of range, output transparency:
			return 0x3800000;
		}
	}
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode4Pixel = function (x, y) {
		x = x | 0;
		y = y | 0;
		//Output pixel:
		if ((x | 0) > -1 && (y | 0) > -1 && (x | 0) < 240 && (y | 0) < 160) {
			var address = ((this.frameSelect | 0) + (Math.imul(y | 0, 240) | 0) + (x | 0)) | 0;
			return this.palette[this.VRAM[address | 0] & 0xFF] | 0;
		}
		//Out of range, output transparency:
		return 0x3800000;
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceBG2FrameBufferRenderer.prototype.fetchMode4Pixel = function (x, y) {
		//Output pixel:
		if (x > -1 && y > -1 && x < 240 && y < 160) {
			return this.palette[this.VRAM[this.frameSelect + (y * 240) + x]];
		}
		//Out of range, output transparency:
		return 0x3800000;
	}
}
GameBoyAdvanceBG2FrameBufferRenderer.prototype.writeFrameSelect = function (frameSelect) {
	frameSelect = frameSelect >> 31;
	this.frameSelect = frameSelect & 0xA000;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceBGMatrixRenderer(gfx, BGLayer) {
	BGLayer = BGLayer | 0;
	this.gfx = gfx;
	this.BGLayer = BGLayer | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.initialize = function () {
	this.VRAM = this.gfx.VRAM;
	this.palette = this.gfx.palette256;
	if ((this.BGLayer & 0x1) == 0) {
		this.bgAffineRenderer = this.gfx.bgAffineRenderer0;
	} else {
		this.bgAffineRenderer = this.gfx.bgAffineRenderer1;
	}
	this.screenSizePreprocess();
	this.screenBaseBlockPreprocess();
	this.characterBaseBlockPreprocess();
	this.displayOverflowProcess(0);
}
GameBoyAdvanceBGMatrixRenderer.prototype.renderScanLine = function (line) {
	line = line | 0;
	this.bgAffineRenderer.renderScanLine(line | 0, this);
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceBGMatrixRenderer.prototype.fetchTile = function (x, y) {
		//Compute address for tile VRAM to address:
		x = x | 0;
		y = y | 0;
		var tileNumber = ((x | 0) + Math.imul(y | 0, this.mapSize | 0)) | 0;
		return this.VRAM[((tileNumber | 0) + (this.BGScreenBaseBlock | 0)) & 0xFFFF] | 0;
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceBGMatrixRenderer.prototype.fetchTile = function (x, y) {
		//Compute address for tile VRAM to address:
		var tileNumber = x + (y * this.mapSize);
		return this.VRAM[(tileNumber + this.BGScreenBaseBlock) & 0xFFFF];
	}
}
GameBoyAdvanceBGMatrixRenderer.prototype.computeScreenAddress = function (x, y) {
	//Compute address for character VRAM to address:
	x = x | 0;
	y = y | 0;
	var address = this.fetchTile(x >> 3, y >> 3) << 6;
	address = ((address | 0) + (this.BGCharacterBaseBlock | 0)) | 0;
	address = ((address | 0) + ((y & 0x7) << 3)) | 0;
	address = ((address | 0) + (x & 0x7)) | 0;
	return address | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.fetchPixelOverflow = function (x, y) {
	//Fetch the pixel:
	x = x | 0;
	y = y | 0;
	//Output pixel:
	var address = this.computeScreenAddress(x & this.mapSizeComparer, y & this.mapSizeComparer) | 0;
	return this.palette[this.VRAM[address & 0xFFFF] & 0xFF] | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.fetchPixelNoOverflow = function (x, y) {
	//Fetch the pixel:
	x = x | 0;
	y = y | 0;
	//Output pixel:
	if ((x | 0) != (x & this.mapSizeComparer) || (y | 0) != (y & this.mapSizeComparer)) {
		//Overflow Handling:
		//Out of bounds with no overflow allowed:
		return 0x3800000;
	}
	var address = this.computeScreenAddress(x | 0, y | 0) | 0;
	return this.palette[this.VRAM[address & 0xFFFF] & 0xFF] | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.screenBaseBlockPreprocess = function () {
	this.BGScreenBaseBlock = this.gfx.BGScreenBaseBlock[this.BGLayer & 3] << 11;
}
GameBoyAdvanceBGMatrixRenderer.prototype.characterBaseBlockPreprocess = function () {
	this.BGCharacterBaseBlock = this.gfx.BGCharacterBaseBlock[this.BGLayer & 3] << 14;
}
GameBoyAdvanceBGMatrixRenderer.prototype.screenSizePreprocess = function () {
	this.mapSize = 0x10 << (this.gfx.BGScreenSize[this.BGLayer & 3] | 0);
	this.mapSizeComparer = ((this.mapSize << 3) - 1) | 0;
}
GameBoyAdvanceBGMatrixRenderer.prototype.displayOverflowPreprocess = function (doOverflow) {
	doOverflow = doOverflow | 0;
	if ((doOverflow | 0) != (this.BGDisplayOverflow | 0)) {
		this.displayOverflowProcess(doOverflow | 0);
	}
}
GameBoyAdvanceBGMatrixRenderer.prototype.displayOverflowProcess = function (doOverflow) {
	doOverflow = doOverflow | 0;
	this.BGDisplayOverflow = doOverflow | 0;
	if ((doOverflow | 0) != 0) {
		this.fetchPixel = this.fetchPixelOverflow;
	} else {
		this.fetchPixel = this.fetchPixelNoOverflow;
	}
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceAffineBGRenderer(gfx, BGLayer) {
	BGLayer = BGLayer | 0;
	this.gfx = gfx;
	this.BGLayer = BGLayer | 0;
}
if (__VIEWS_SUPPORTED__) {
	GameBoyAdvanceAffineBGRenderer.prototype.initialize = function () {
		this.offset = ((this.BGLayer << 8) + 0x100) | 0;
		this.scratchBuffer = getInt32ViewCustom(this.gfx.buffer, this.offset | 0, ((this.offset | 0) + 240) | 0);
		this.BGdx = 0x100;
		this.BGdmx = 0;
		this.BGdy = 0;
		this.BGdmy = 0x100;
		this.BGReferenceX = 0;
		this.BGReferenceY = 0;
		this.pb = 0;
		this.pd = 0;
		this.priorityPreprocess();
		this.offsetReferenceCounters();
	}
	if (typeof Math.imul == "function") {
		//Math.imul found, insert the optimized path in:
		GameBoyAdvanceAffineBGRenderer.prototype.renderScanLine = function (line, BGObject) {
			line = line | 0;
			var x = this.pb | 0;
			var y = this.pd | 0;
			if ((this.gfx.BGMosaic[this.BGLayer & 3] | 0) != 0) {
				//Correct line number for mosaic:
				var mosaicY = this.gfx.mosaicRenderer.getMosaicYOffset(line | 0) | 0;
				x = ((x | 0) - Math.imul(this.BGdmx | 0, mosaicY | 0)) | 0;
				y = ((y | 0) - Math.imul(this.BGdmy | 0, mosaicY | 0)) | 0;
			}
			for (var position = 0;
				(position | 0) < 240; position = ((position | 0) + 1) | 0, x = ((x | 0) + (this.BGdx | 0)) | 0, y = ((y | 0) + (this.BGdy | 0)) | 0) {
				//Fetch pixel:
				this.scratchBuffer[position | 0] = this.priorityFlag | BGObject.fetchPixel(x >> 8, y >> 8);
			}
			if ((this.gfx.BGMosaic[this.BGLayer & 3] | 0) != 0) {
				//Pixelize the line horizontally:
				this.gfx.mosaicRenderer.renderMosaicHorizontal(this.offset | 0);
			}
		}
		GameBoyAdvanceAffineBGRenderer.prototype.offsetReferenceCounters = function () {
			var end = this.gfx.lastUnrenderedLine | 0;
			this.pb = Math.imul(((this.pb | 0) + (this.BGdmx | 0)) | 0, end | 0) | 0;
			this.pd = Math.imul(((this.pd | 0) + (this.BGdmy | 0)) | 0, end | 0) | 0;
		}
	} else {
		//Math.imul not found, use the compatibility method:
		GameBoyAdvanceAffineBGRenderer.prototype.renderScanLine = function (line, BGObject) {
			var x = this.pb;
			var y = this.pd;
			if ((this.gfx.BGMosaic[this.BGLayer & 3] | 0) != 0) {
				//Correct line number for mosaic:
				var mosaicY = this.gfx.mosaicRenderer.getMosaicYOffset(line | 0);
				x -= this.BGdmx * mosaicY;
				y -= this.BGdmy * mosaicY;
			}
			for (var position = 0; position < 240; ++position, x += this.BGdx, y += this.BGdy) {
				//Fetch pixel:
				this.scratchBuffer[position] = this.priorityFlag | BGObject.fetchPixel(x >> 8, y >> 8);
			}
			if ((this.gfx.BGMosaic[this.BGLayer & 3] | 0) != 0) {
				//Pixelize the line horizontally:
				this.gfx.mosaicRenderer.renderMosaicHorizontal(this.offset | 0);
			}
		}
		GameBoyAdvanceAffineBGRenderer.prototype.offsetReferenceCounters = function () {
			var end = this.gfx.lastUnrenderedLine | 0;
			this.pb = (((this.pb | 0) + (this.BGdmx | 0)) * (end | 0)) | 0;
			this.pd = (((this.pd | 0) + (this.BGdmy | 0)) * (end | 0)) | 0;
		}
	}
} else {
	GameBoyAdvanceAffineBGRenderer.prototype.initialize = function () {
		this.offset = (this.BGLayer << 8) + 0x100;
		this.scratchBuffer = this.gfx.buffer;
		this.BGdx = 0x100;
		this.BGdmx = 0;
		this.BGdy = 0;
		this.BGdmy = 0x100;
		this.BGReferenceX = 0;
		this.BGReferenceY = 0;
		this.pb = 0;
		this.pd = 0;
		this.priorityPreprocess();
		this.offsetReferenceCounters();
	}
	GameBoyAdvanceAffineBGRenderer.prototype.renderScanLine = function (line, BGObject) {
		var x = this.pb;
		var y = this.pd;
		if ((this.gfx.BGMosaic[this.BGLayer & 3] | 0) != 0) {
			//Correct line number for mosaic:
			var mosaicY = this.gfx.mosaicRenderer.getMosaicYOffset(line | 0);
			x -= this.BGdmx * mosaicY;
			y -= this.BGdmy * mosaicY;
		}
		for (var position = 0; position < 240; ++position, x += this.BGdx, y += this.BGdy) {
			//Fetch pixel:
			this.scratchBuffer[this.offset + position] = this.priorityFlag | BGObject.fetchPixel(x >> 8, y >> 8);
		}
		if ((this.gfx.BGMosaic[this.BGLayer & 3] | 0) != 0) {
			//Pixelize the line horizontally:
			this.gfx.mosaicRenderer.renderMosaicHorizontal(this.offset);
		}
	}
	GameBoyAdvanceAffineBGRenderer.prototype.offsetReferenceCounters = function () {
		var end = this.gfx.lastUnrenderedLine | 0;
		this.pb = (((this.pb | 0) + (this.BGdmx | 0)) * (end | 0)) | 0;
		this.pd = (((this.pd | 0) + (this.BGdmy | 0)) * (end | 0)) | 0;
	}
}
GameBoyAdvanceAffineBGRenderer.prototype.incrementReferenceCounters = function () {
	this.pb = ((this.pb | 0) + (this.BGdmx | 0)) | 0;
	this.pd = ((this.pd | 0) + (this.BGdmy | 0)) | 0;
}
GameBoyAdvanceAffineBGRenderer.prototype.resetReferenceCounters = function () {
	this.pb = this.BGReferenceX | 0;
	this.pd = this.BGReferenceY | 0;
}
GameBoyAdvanceAffineBGRenderer.prototype.priorityPreprocess = function () {
	this.priorityFlag = (this.gfx.BGPriority[this.BGLayer | 0] << 23) | (1 << (this.BGLayer | 0x10));
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPA8_0 = function (data) {
	data = data | 0;
	this.BGdx = (this.BGdx & 0xFFFFFF00) | data;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPA8_1 = function (data) {
	data = data | 0;
	data = (data << 24) >> 16;
	this.BGdx = data | (this.BGdx & 0xFF);
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPA16 = function (data) {
	data = data | 0;
	this.BGdx = (data << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPB8_0 = function (data) {
	data = data | 0;
	this.BGdmx = (this.BGdmx & 0xFFFFFF00) | data;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPB8_1 = function (data) {
	data = data | 0;
	data = (data << 24) >> 16;
	this.BGdmx = data | (this.BGdmx & 0xFF);
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPB16 = function (data) {
	data = data | 0;
	this.BGdmx = (data << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPAB32 = function (data) {
	data = data | 0;
	this.BGdx = (data << 16) >> 16;
	this.BGdmx = data >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPC8_0 = function (data) {
	data = data | 0;
	this.BGdy = (this.BGdy & 0xFFFFFF00) | data;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPC8_1 = function (data) {
	data = data | 0;
	data = (data << 24) >> 16;
	this.BGdy = data | (this.BGdy & 0xFF);
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPC16 = function (data) {
	data = data | 0;
	this.BGdy = (data << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPD8_0 = function (data) {
	data = data | 0;
	this.BGdmy = (this.BGdmy & 0xFFFFFF00) | data;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPD8_1 = function (data) {
	data = data | 0;
	data = (data << 24) >> 16;
	this.BGdmy = data | (this.BGdmy & 0xFF);
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPD16 = function (data) {
	data = data | 0;
	this.BGdmy = (data << 16) >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGPCD32 = function (data) {
	data = data | 0;
	this.BGdy = (data << 16) >> 16;
	this.BGdmy = data >> 16;
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX8_0 = function (data) {
	data = data | 0;
	this.BGReferenceX = (this.BGReferenceX & 0xFFFFFF00) | data;
	//Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX8_1 = function (data) {
	data = data | 0;
	this.BGReferenceX = (data << 8) | (this.BGReferenceX & 0xFFFF00FF);
	//Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX8_2 = function (data) {
	data = data | 0;
	this.BGReferenceX = (data << 16) | (this.BGReferenceX & 0xFF00FFFF);
	//Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX8_3 = function (data) {
	data = data | 0;
	data = (data << 28) >> 4;
	this.BGReferenceX = data | (this.BGReferenceX & 0xFFFFFF);
	//Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX16_0 = function (data) {
	data = data | 0;
	this.BGReferenceX = (this.BGReferenceX & 0xFFFF0000) | data;
	//Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX16_1 = function (data) {
	data = data | 0;
	data = (data << 20) >> 4;
	this.BGReferenceX = (this.BGReferenceX & 0xFFFF) | data;
	//Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGX32 = function (data) {
	data = data | 0;
	this.BGReferenceX = (data << 4) >> 4;
	//Writing to the x reference doesn't reset the counters during draw!
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY8_0 = function (data) {
	data = data | 0;
	this.BGReferenceY = (this.BGReferenceY & 0xFFFFFF00) | data;
	this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY8_1 = function (data) {
	data = data | 0;
	this.BGReferenceY = (data << 8) | (this.BGReferenceY & 0xFFFF00FF);
	this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY8_2 = function (data) {
	data = data | 0;
	this.BGReferenceY = (data << 16) | (this.BGReferenceY & 0xFF00FFFF);
	this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY8_3 = function (data) {
	data = data | 0;
	data = (data << 28) >> 4;
	this.BGReferenceY = data | (this.BGReferenceY & 0xFFFFFF);
	this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY16_0 = function (data) {
	data = data | 0;
	this.BGReferenceY = (this.BGReferenceY & 0xFFFF0000) | data;
	this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY16_1 = function (data) {
	data = data | 0;
	data = (data << 20) >> 4;
	this.BGReferenceY = (this.BGReferenceY & 0xFFFF) | data;
	this.resetReferenceCounters();
}
GameBoyAdvanceAffineBGRenderer.prototype.writeBGY32 = function (data) {
	data = data | 0;
	this.BGReferenceY = (data << 4) >> 4;
	this.resetReferenceCounters();
}




"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceColorEffectsRenderer() {
	this.alphaBlendAmountTarget1 = 0;
	this.alphaBlendAmountTarget2 = 0;
	this.effectsTarget1 = 0;
	this.colorEffectsType = 0;
	this.effectsTarget2 = 0;
	this.brightnessEffectAmount = 0;
	this.alphaBlendOptimizationChecks();
}
GameBoyAdvanceColorEffectsRenderer.prototype.processOAMSemiTransparent = function (lowerPixel, topPixel) {
	lowerPixel = lowerPixel | 0;
	topPixel = topPixel | 0;
	if (((lowerPixel | 0) & (this.effectsTarget2 | 0)) != 0) {
		return this.alphaBlend(topPixel | 0, lowerPixel | 0) | 0;
	} else if (((topPixel | 0) & (this.effectsTarget1 | 0)) != 0) {
		switch (this.colorEffectsType | 0) {
			case 2:
				return this.brightnessIncrease(topPixel | 0) | 0;
			case 3:
				return this.brightnessDecrease(topPixel | 0) | 0;
		}
	}
	return topPixel | 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.process = function (lowerPixel, topPixel) {
	lowerPixel = lowerPixel | 0;
	topPixel = topPixel | 0;
	if (((topPixel | 0) & (this.effectsTarget1 | 0)) != 0) {
		switch (this.colorEffectsType | 0) {
			case 1:
				if (((lowerPixel | 0) & (this.effectsTarget2 | 0)) != 0 && (topPixel | 0) != (lowerPixel | 0)) {
					return this.alphaBlend(topPixel | 0, lowerPixel | 0) | 0;
				}
				break;
			case 2:
				return this.brightnessIncrease(topPixel | 0) | 0;
			case 3:
				return this.brightnessDecrease(topPixel | 0) | 0;
		}
	}
	return topPixel | 0;
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendNormal = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = topPixel & 0x1F;
		var b2 = (lowerPixel >> 10) & 0x1F;
		var g2 = (lowerPixel >> 5) & 0x1F;
		var r2 = lowerPixel & 0x1F;
		b1 = Math.imul(b1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		g1 = Math.imul(g1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		r1 = Math.imul(r1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		b2 = Math.imul(b2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		g2 = Math.imul(g2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		r2 = Math.imul(r2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		//Keep this not inlined in the return, firefox 22 grinds on it:
		var b = Math.min(((b1 | 0) + (b2 | 0)) >> 4, 0x1F) | 0;
		var g = Math.min(((g1 | 0) + (g2 | 0)) >> 4, 0x1F) | 0;
		var r = Math.min(((r1 | 0) + (r2 | 0)) >> 4, 0x1F) | 0;
		return (b << 10) | (g << 5) | r;
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendTop = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b = (topPixel >> 10) & 0x1F;
		var g = (topPixel >> 5) & 0x1F;
		var r = topPixel & 0x1F;
		b = Math.imul(b | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		g = Math.imul(g | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		r = Math.imul(r | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		return ((b >> 4) << 10) | ((g >> 4) << 5) | (r >> 4);
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendLow = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b = (lowerPixel >> 10) & 0x1F;
		var g = (lowerPixel >> 5) & 0x1F;
		var r = lowerPixel & 0x1F;
		b = Math.imul(b | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		g = Math.imul(g | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		r = Math.imul(r | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		return ((b >> 4) << 10) | ((g >> 4) << 5) | (r >> 4);
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddLow = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = topPixel & 0x1F;
		var b2 = (lowerPixel >> 10) & 0x1F;
		var g2 = (lowerPixel >> 5) & 0x1F;
		var r2 = lowerPixel & 0x1F;
		b1 = Math.imul(b1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		g1 = Math.imul(g1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		r1 = Math.imul(r1 | 0, this.alphaBlendAmountTarget1 | 0) | 0;
		//Keep this not inlined in the return, firefox 22 grinds on it:
		var b = Math.min(((b1 | 0) + (b2 << 4)) >> 4, 0x1F) | 0;
		var g = Math.min(((g1 | 0) + (g2 << 4)) >> 4, 0x1F) | 0;
		var r = Math.min(((r1 | 0) + (r2 << 4)) >> 4, 0x1F) | 0;
		return (b << 10) | (g << 5) | r;
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddTop = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = topPixel & 0x1F;
		var b2 = (lowerPixel >> 10) & 0x1F;
		var g2 = (lowerPixel >> 5) & 0x1F;
		var r2 = lowerPixel & 0x1F;
		b2 = Math.imul(b2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		g2 = Math.imul(g2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		r2 = Math.imul(r2 | 0, this.alphaBlendAmountTarget2 | 0) | 0;
		//Keep this not inlined in the return, firefox 22 grinds on it:
		var b = Math.min(((b1 << 4) + (b2 | 0)) >> 4, 0x1F) | 0;
		var g = Math.min(((g1 << 4) + (g2 | 0)) >> 4, 0x1F) | 0;
		var r = Math.min(((r1 << 4) + (r2 | 0)) >> 4, 0x1F) | 0;
		return (b << 10) | (g << 5) | r;
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.brightnessIncrease = function (topPixel) {
		topPixel = topPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = topPixel & 0x1F;
		b1 = ((b1 | 0) + (Math.imul((0x1F - (b1 | 0)) | 0, this.brightnessEffectAmount | 0) >> 4)) | 0;
		g1 = ((g1 | 0) + (Math.imul((0x1F - (g1 | 0)) | 0, this.brightnessEffectAmount | 0) >> 4)) | 0;
		r1 = ((r1 | 0) + (Math.imul((0x1F - (r1 | 0)) | 0, this.brightnessEffectAmount | 0) >> 4)) | 0;
		return (b1 << 10) | (g1 << 5) | r1;
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.brightnessDecrease = function (topPixel) {
		topPixel = topPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = topPixel & 0x1F;
		var decreaseMultiplier = (0x10 - (this.brightnessEffectAmount | 0)) | 0;
		b1 = Math.imul(b1 | 0, decreaseMultiplier | 0) >> 4;
		g1 = Math.imul(g1 | 0, decreaseMultiplier | 0) >> 4;
		r1 = Math.imul(r1 | 0, decreaseMultiplier | 0) >> 4;
		return (b1 << 10) | (g1 << 5) | r1;
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendNormal = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = (topPixel & 0x1F);
		var b2 = (lowerPixel >> 10) & 0x1F;
		var g2 = (lowerPixel >> 5) & 0x1F;
		var r2 = lowerPixel & 0x1F;
		b1 = b1 * this.alphaBlendAmountTarget1;
		g1 = g1 * this.alphaBlendAmountTarget1;
		r1 = r1 * this.alphaBlendAmountTarget1;
		b2 = b2 * this.alphaBlendAmountTarget2;
		g2 = g2 * this.alphaBlendAmountTarget2;
		r2 = r2 * this.alphaBlendAmountTarget2;
		return (Math.min((b1 + b2) >> 4, 0x1F) << 10) | (Math.min((g1 + g2) >> 4, 0x1F) << 5) | Math.min((r1 + r2) >> 4, 0x1F);
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendTop = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b = (topPixel >> 10) & 0x1F;
		var g = (topPixel >> 5) & 0x1F;
		var r = (topPixel & 0x1F);
		b = b * this.alphaBlendAmountTarget1;
		g = g * this.alphaBlendAmountTarget1;
		r = r * this.alphaBlendAmountTarget1;
		return ((b >> 4) << 10) | ((g >> 4) << 5) | (r >> 4);
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendLow = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b = (lowerPixel >> 10) & 0x1F;
		var g = (lowerPixel >> 5) & 0x1F;
		var r = (lowerPixel & 0x1F);
		b = b * this.alphaBlendAmountTarget2;
		g = g * this.alphaBlendAmountTarget2;
		r = r * this.alphaBlendAmountTarget2;
		return ((b >> 4) << 10) | ((g >> 4) << 5) | (r >> 4);
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddLow = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = (topPixel & 0x1F);
		var b2 = (lowerPixel >> 10) & 0x1F;
		var g2 = (lowerPixel >> 5) & 0x1F;
		var r2 = lowerPixel & 0x1F;
		b1 = b1 * this.alphaBlendAmountTarget1;
		g1 = g1 * this.alphaBlendAmountTarget1;
		r1 = r1 * this.alphaBlendAmountTarget1;
		b2 = b2 << 4;
		g2 = g2 << 4;
		r2 = r2 << 4;
		return (Math.min((b1 + b2) >> 4, 0x1F) << 10) | (Math.min((g1 + g2) >> 4, 0x1F) << 5) | Math.min((r1 + r2) >> 4, 0x1F);
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddTop = function (topPixel, lowerPixel) {
		topPixel = topPixel | 0;
		lowerPixel = lowerPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = (topPixel & 0x1F);
		var b2 = (lowerPixel >> 10) & 0x1F;
		var g2 = (lowerPixel >> 5) & 0x1F;
		var r2 = lowerPixel & 0x1F;
		b1 = b1 << 4;
		g1 = g1 << 4;
		r1 = r1 << 4;
		b2 = b2 * this.alphaBlendAmountTarget2;
		g2 = g2 * this.alphaBlendAmountTarget2;
		r2 = r2 * this.alphaBlendAmountTarget2;
		return (Math.min((b1 + b2) >> 4, 0x1F) << 10) | (Math.min((g1 + g2) >> 4, 0x1F) << 5) | Math.min((r1 + r2) >> 4, 0x1F);
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.brightnessIncrease = function (topPixel) {
		topPixel = topPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = topPixel & 0x1F;
		b1 += ((0x1F - b1) * this.brightnessEffectAmount) >> 4;
		g1 += ((0x1F - g1) * this.brightnessEffectAmount) >> 4;
		r1 += ((0x1F - r1) * this.brightnessEffectAmount) >> 4;
		return (b1 << 10) | (g1 << 5) | r1;
	}
	GameBoyAdvanceColorEffectsRenderer.prototype.brightnessDecrease = function (topPixel) {
		topPixel = topPixel | 0;
		var b1 = (topPixel >> 10) & 0x1F;
		var g1 = (topPixel >> 5) & 0x1F;
		var r1 = topPixel & 0x1F;
		var decreaseMultiplier = 0x10 - this.brightnessEffectAmount;
		b1 = (b1 * decreaseMultiplier) >> 4;
		g1 = (g1 * decreaseMultiplier) >> 4;
		r1 = (r1 * decreaseMultiplier) >> 4;
		return (b1 << 10) | (g1 << 5) | r1;
	}
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendTopPass = function (topPixel, lowerPixel) {
	return topPixel | 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendBottomPass = function (topPixel, lowerPixel) {
	return lowerPixel | 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendZero = function (topPixel, lowerPixel) {
	return 0;
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendAddBoth = function (topPixel, lowerPixel) {
	topPixel = topPixel | 0;
	lowerPixel = lowerPixel | 0;
	var b1 = (topPixel >> 10) & 0x1F;
	var g1 = (topPixel >> 5) & 0x1F;
	var r1 = topPixel & 0x1F;
	var b2 = (lowerPixel >> 10) & 0x1F;
	var g2 = (lowerPixel >> 5) & 0x1F;
	var r2 = lowerPixel & 0x1F;
	//Keep this not inlined in the return, firefox 22 grinds on it:
	var b = Math.min(((b1 << 4) + (b2 << 4)) >> 4, 0x1F) | 0;
	var g = Math.min(((g1 << 4) + (g2 << 4)) >> 4, 0x1F) | 0;
	var r = Math.min(((r1 << 4) + (r2 << 4)) >> 4, 0x1F) | 0;
	return (b << 10) | (g << 5) | r;
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDCNT8_0 = function (data) {
	data = data | 0;
	//Select target 1 and color effects mode:
	this.effectsTarget1 = (data & 0x3F) << 16;
	this.colorEffectsType = data >> 6;
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDCNT8_1 = function (data) {
	data = data | 0;
	//Select target 2:
	this.effectsTarget2 = (data & 0x3F) << 16;
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDCNT16 = function (data) {
	data = data | 0;
	//Select target 1 and color effects mode:
	this.effectsTarget1 = (data & 0x3F) << 16;
	this.colorEffectsType = (data >> 6) & 0x3;
	//Select target 2:
	this.effectsTarget2 = (data & 0x3F00) << 8;
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDALPHA8_0 = function (data) {
	data = data | 0;
	this.alphaBlendAmountTarget1Scratch = data & 0x1F;
	this.alphaBlendAmountTarget1 = Math.min(this.alphaBlendAmountTarget1Scratch | 0, 0x10) | 0;
	this.alphaBlendOptimizationChecks();
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDALPHA8_1 = function (data) {
	data = data | 0;
	this.alphaBlendAmountTarget2Scratch = data & 0x1F;
	this.alphaBlendAmountTarget2 = Math.min(this.alphaBlendAmountTarget2Scratch | 0, 0x10) | 0;
	this.alphaBlendOptimizationChecks();
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDALPHA16 = function (data) {
	data = data | 0;
	this.alphaBlendAmountTarget1Scratch = data & 0x1F;
	this.alphaBlendAmountTarget1 = Math.min(this.alphaBlendAmountTarget1Scratch | 0, 0x10) | 0;
	this.alphaBlendAmountTarget2Scratch = (data >> 8) & 0x1F;
	this.alphaBlendAmountTarget2 = Math.min(this.alphaBlendAmountTarget2Scratch | 0, 0x10) | 0;
	this.alphaBlendOptimizationChecks();
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDCNT32 = function (data) {
	data = data | 0;
	//Select target 1 and color effects mode:
	this.effectsTarget1 = (data & 0x3F) << 16;
	this.colorEffectsType = (data >> 6) & 0x3;
	//Select target 2:
	this.effectsTarget2 = (data & 0x3F00) << 8;
	this.alphaBlendAmountTarget1Scratch = (data >> 16) & 0x1F;
	this.alphaBlendAmountTarget1 = Math.min(this.alphaBlendAmountTarget1Scratch | 0, 0x10) | 0;
	this.alphaBlendAmountTarget2Scratch = (data >> 24) & 0x1F;
	this.alphaBlendAmountTarget2 = Math.min(this.alphaBlendAmountTarget2Scratch | 0, 0x10) | 0;
	this.alphaBlendOptimizationChecks();
}
GameBoyAdvanceColorEffectsRenderer.prototype.alphaBlendOptimizationChecks = function () {
	//Check for ways to speed up blending:
	if ((this.alphaBlendAmountTarget1 | 0) == 0) {
		if ((this.alphaBlendAmountTarget2 | 0) == 0) {
			this.alphaBlend = this.alphaBlendZero;
		} else if ((this.alphaBlendAmountTarget2 | 0) < 0x10) {
			this.alphaBlend = this.alphaBlendLow;
		} else {
			this.alphaBlend = this.alphaBlendBottomPass;
		}
	} else if ((this.alphaBlendAmountTarget1 | 0) < 0x10) {
		if ((this.alphaBlendAmountTarget2 | 0) == 0) {
			this.alphaBlend = this.alphaBlendTop;
		} else if ((this.alphaBlendAmountTarget2 | 0) < 0x10) {
			this.alphaBlend = this.alphaBlendNormal;
		} else {
			this.alphaBlend = this.alphaBlendAddLow;
		}
	} else {
		if ((this.alphaBlendAmountTarget2 | 0) == 0) {
			this.alphaBlend = this.alphaBlendTopPass;
		} else if ((this.alphaBlendAmountTarget2 | 0) < 0x10) {
			this.alphaBlend = this.alphaBlendAddTop;
		} else {
			this.alphaBlend = this.alphaBlendAddBoth;
		}
	}
}
GameBoyAdvanceColorEffectsRenderer.prototype.writeBLDY8 = function (data) {
	data = data | 0;
	this.brightnessEffectAmount = Math.min(data & 0x1F, 0x10) | 0;
}



"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceMosaicRenderer(buffer) {
	this.BGMosaicHSize = 0;
	this.BGMosaicVSize = 0;
	this.OBJMosaicHSize = 0;
	this.OBJMosaicVSize = 0;
	this.buffer = buffer;
}
GameBoyAdvanceMosaicRenderer.prototype.renderMosaicHorizontal = function (offset) {
	offset = offset | 0;
	var currentPixel = 0;
	var mosaicBlur = ((this.BGMosaicHSize | 0) + 1) | 0;
	if ((mosaicBlur | 0) > 1) { //Don't perform a useless loop.
		for (var position = 0;
			(position | 0) < 240; position = ((position | 0) + 1) | 0) {
			if ((((position | 0) % (mosaicBlur | 0)) | 0) == 0) {
				currentPixel = this.buffer[position | offset] | 0;
			} else {
				this.buffer[position | offset] = currentPixel | 0;
			}
		}
	}
}
GameBoyAdvanceMosaicRenderer.prototype.renderOBJMosaicHorizontal = function (layer, xOffset, xSize) {
	xOffset = xOffset | 0;
	xSize = xSize | 0;
	var currentPixel = 0x3800000;
	var mosaicBlur = ((this.OBJMosaicHSize | 0) + 1) | 0;
	if ((mosaicBlur | 0) > 1) { //Don't perform a useless loop.
		for (var position = ((xOffset | 0) % (mosaicBlur | 0)) | 0;
			(position | 0) < (xSize | 0); position = ((position | 0) + 1) | 0) {
			if ((((position | 0) % (mosaicBlur | 0)) | 0) == 0) {
				currentPixel = layer[position | 0] | 0;
			}
			layer[position | 0] = currentPixel | 0;
		}
	}
}
GameBoyAdvanceMosaicRenderer.prototype.getMosaicYOffset = function (line) {
	line = line | 0;
	return ((line | 0) % (((this.BGMosaicVSize | 0) + 1) | 0)) | 0;
}
GameBoyAdvanceMosaicRenderer.prototype.getOBJMosaicYOffset = function (line) {
	line = line | 0;
	return ((line | 0) % (((this.OBJMosaicVSize | 0) + 1) | 0)) | 0;
}
GameBoyAdvanceMosaicRenderer.prototype.writeMOSAIC8_0 = function (data) {
	data = data | 0;
	this.BGMosaicHSize = data & 0xF;
	this.BGMosaicVSize = data >> 4;
}
GameBoyAdvanceMosaicRenderer.prototype.writeMOSAIC8_1 = function (data) {
	data = data | 0;
	this.OBJMosaicHSize = data & 0xF;
	this.OBJMosaicVSize = data >> 4;
}
GameBoyAdvanceMosaicRenderer.prototype.writeMOSAIC16 = function (data) {
	data = data | 0;
	this.BGMosaicHSize = data & 0xF;
	this.BGMosaicVSize = (data >> 4) & 0xF;
	this.OBJMosaicHSize = (data >> 8) & 0xF;
	this.OBJMosaicVSize = data >> 12;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceOBJRenderer(gfx) {
	this.gfx = gfx;
}
GameBoyAdvanceOBJRenderer.prototype.lookupXSize = [
	//Square:
	8, 16, 32, 64,
	//Vertical Rectangle:
	16, 32, 32, 64,
	//Horizontal Rectangle:
	8, 8, 16, 32
];
GameBoyAdvanceOBJRenderer.prototype.lookupYSize = [
	//Square:
	8, 16, 32, 64,
	//Vertical Rectangle:
	8, 8, 16, 32,
	//Horizontal Rectangle:
	16, 32, 32, 64
];
if (__VIEWS_SUPPORTED__) {
	if (typeof getUint8Array(1).fill == "function") {
		GameBoyAdvanceOBJRenderer.prototype.initialize = function () {
			this.paletteOBJ256 = this.gfx.paletteOBJ256;
			this.paletteOBJ16 = this.gfx.paletteOBJ16;
			this.VRAM = this.gfx.VRAM;
			this.cyclesToRender = 1210;
			this.VRAM32 = this.gfx.VRAM32;
			this.OAMRAM = getUint8Array(0x400);
			this.OAMRAM16 = getUint16View(this.OAMRAM);
			this.OAMRAM32 = getInt32View(this.OAMRAM);
			this.offset = 0x500;
			this.scratchBuffer = getInt32ViewCustom(this.gfx.buffer, this.offset | 0, ((this.offset | 0) + 240) | 0);
			this.scratchWindowBuffer = getInt32Array(240);
			this.scratchOBJBuffer = getInt32Array(128);
			this.OBJMatrixParameters = getInt32Array(0x80);
			this.initializeOAMTable();
		}
		GameBoyAdvanceOBJRenderer.prototype.clearScratch = function () {
			this.scratchBuffer.fill(0x3800000);
			this.scratchWindowBuffer.fill(0x3800000);
		}
	} else {
		GameBoyAdvanceOBJRenderer.prototype.initialize = function () {
			this.paletteOBJ256 = this.gfx.paletteOBJ256;
			this.paletteOBJ16 = this.gfx.paletteOBJ16;
			this.VRAM = this.gfx.VRAM;
			this.cyclesToRender = 1210;
			this.VRAM32 = this.gfx.VRAM32;
			this.OAMRAM = getUint8Array(0x400);
			this.OAMRAM16 = getUint16View(this.OAMRAM);
			this.OAMRAM32 = getInt32View(this.OAMRAM);
			this.offset = 0x500;
			this.scratchBuffer = getInt32ViewCustom(this.gfx.buffer, this.offset | 0, ((this.offset | 0) + 240) | 0);
			this.scratchWindowBuffer = getInt32Array(240);
			this.scratchOBJBuffer = getInt32Array(128);
			this.clearingBuffer = getInt32Array(240);
			this.initializeClearingBuffer();
			this.OBJMatrixParameters = getInt32Array(0x80);
			this.initializeOAMTable();
		}
		GameBoyAdvanceOBJRenderer.prototype.clearScratch = function () {
			this.scratchBuffer.set(this.clearingBuffer);
			this.scratchWindowBuffer.set(this.clearingBuffer);
		}
		GameBoyAdvanceOBJRenderer.prototype.initializeClearingBuffer = function () {
			for (var position = 0;
				(position | 0) < 240; position = ((position | 0) + 1) | 0) {
				this.clearingBuffer[position | 0] = 0x3800000;
			}
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.outputSpriteNormal = function (xcoord, xcoordEnd, bitFlags) {
		xcoord = xcoord | 0;
		xcoordEnd = xcoordEnd | 0;
		bitFlags = bitFlags | 0;
		for (var xSource = 0;
			(xcoord | 0) < (xcoordEnd | 0); xcoord = ((xcoord | 0) + 1) | 0, xSource = ((xSource | 0) + 1) | 0) {
			var pixel = bitFlags | this.scratchOBJBuffer[xSource | 0];
			//Overwrite by priority:
			if ((xcoord | 0) > -1 && (pixel & 0x3800000) < (this.scratchBuffer[xcoord | 0] & 0x3800000)) {
				this.scratchBuffer[xcoord | 0] = pixel | 0;
			}
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.outputSpriteFlipped = function (xcoord, xcoordEnd, bitFlags, xSize) {
		xcoord = xcoord | 0;
		xcoordEnd = xcoordEnd | 0;
		bitFlags = bitFlags | 0;
		xSize = xSize | 0;
		for (var xSource = ((xSize | 0) - 1) | 0;
			(xcoord | 0) < (xcoordEnd | 0); xcoord = ((xcoord | 0) + 1) | 0, xSource = ((xSource | 0) - 1) | 0) {
			var pixel = bitFlags | this.scratchOBJBuffer[xSource | 0];
			//Overwrite by priority:
			if ((xcoord | 0) > -1 && (pixel & 0x3800000) < (this.scratchBuffer[xcoord | 0] & 0x3800000)) {
				this.scratchBuffer[xcoord | 0] = pixel | 0;
			}
		}
	}
} else {
	GameBoyAdvanceOBJRenderer.prototype.initialize = function () {
		this.paletteOBJ256 = this.gfx.paletteOBJ256;
		this.paletteOBJ16 = this.gfx.paletteOBJ16;
		this.VRAM = this.gfx.VRAM;
		this.cyclesToRender = 1210;
		this.OAMRAM = getUint8Array(0x400);
		this.offset = 0x500;
		this.scratchBuffer = this.gfx.buffer;
		this.scratchWindowBuffer = getInt32Array(240);
		this.scratchOBJBuffer = getInt32Array(128);
		this.OBJMatrixParameters = getInt32Array(0x80);
		this.initializeOAMTable();
	}
	GameBoyAdvanceOBJRenderer.prototype.clearScratch = function () {
		for (var position = 0; position < 240; ++position) {
			this.scratchBuffer[position | this.offset] = 0x3800000;
			this.scratchWindowBuffer[position] = 0x3800000;
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.outputSpriteNormal = function (xcoord, xcoordEnd, bitFlags) {
		for (var xSource = 0; xcoord < xcoordEnd; ++xcoord, ++xSource) {
			var pixel = bitFlags | this.scratchOBJBuffer[xSource];
			//Overwrite by priority:
			if ((xcoord | 0) > -1 && (pixel & 0x3800000) < (this.scratchBuffer[xcoord | this.offset] & 0x3800000)) {
				this.scratchBuffer[xcoord | this.offset] = pixel;
			}
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.outputSpriteFlipped = function (xcoord, xcoordEnd, bitFlags, xSize) {
		for (var xSource = xSize - 1; xcoord < xcoordEnd; ++xcoord, --xSource) {
			var pixel = bitFlags | this.scratchOBJBuffer[xSource];
			//Overwrite by priority:
			if (xcoord > -1 && (pixel & 0x3800000) < (this.scratchBuffer[xcoord | this.offset] & 0x3800000)) {
				this.scratchBuffer[xcoord | this.offset] = pixel;
			}
		}
	}
}
GameBoyAdvanceOBJRenderer.prototype.initializeOAMTable = function () {
	this.OAMTable = [];
	for (var spriteNumber = 0;
		(spriteNumber | 0) < 128; spriteNumber = ((spriteNumber | 0) + 1) | 0) {
		this.OAMTable[spriteNumber | 0] = this.makeOAMAttributeTable();
	}
}
if (typeof TypedObject == "object" && typeof TypedObject.StructType == "object") {
	GameBoyAdvanceOBJRenderer.prototype.makeOAMAttributeTable = function () {
		return new TypedObject.StructType({
			ycoord: TypedObject.int32,
			matrix2D: TypedObject.int32,
			doubleSizeOrDisabled: TypedObject.int32,
			mode: TypedObject.int32,
			mosaic: TypedObject.int32,
			monolithicPalette: TypedObject.int32,
			shape: TypedObject.int32,
			xcoord: TypedObject.int32,
			matrixParameters: TypedObject.int32,
			horizontalFlip: TypedObject.int32,
			verticalFlip: TypedObject.int32,
			size: TypedObject.int32,
			tileNumber: TypedObject.int32,
			priority: TypedObject.int32,
			paletteNumber: TypedObject.int32
		});
	}
} else {
	GameBoyAdvanceOBJRenderer.prototype.makeOAMAttributeTable = function () {
		return {
			ycoord: 0,
			matrix2D: 0,
			doubleSizeOrDisabled: 0,
			mode: 0,
			mosaic: 0,
			monolithicPalette: 0,
			shape: 0,
			xcoord: 0,
			matrixParameters: 0,
			horizontalFlip: 0,
			verticalFlip: 0,
			size: 0,
			tileNumber: 0,
			priority: 0,
			paletteNumber: 0
		};
	}
}
GameBoyAdvanceOBJRenderer.prototype.renderScanLine = function (line) {
	line = line | 0;
	this.performRenderLoop(line | 0);
}
GameBoyAdvanceOBJRenderer.prototype.performRenderLoop = function (line) {
	line = line | 0;
	this.clearScratch();
	var cycles = this.cyclesToRender | 0;
	for (var objNumber = 0;
		(objNumber | 0) < 0x80; objNumber = ((objNumber | 0) + 1) | 0) {
		cycles = this.renderSprite(line | 0, this.OAMTable[objNumber | 0], cycles | 0) | 0;
	}
}
GameBoyAdvanceOBJRenderer.prototype.renderSprite = function (line, sprite, cycles) {
	line = line | 0;
	cycles = cycles | 0;
	if (this.isDrawable(sprite)) {
		if ((sprite.mosaic | 0) != 0) {
			//Correct line number for mosaic:
			line = ((line | 0) - (this.gfx.mosaicRenderer.getOBJMosaicYOffset(line | 0) | 0)) | 0;
		}
		//Obtain horizontal size info:
		var xSize = this.lookupXSize[(sprite.shape << 2) | sprite.size] << (sprite.doubleSizeOrDisabled | 0);
		//Obtain vertical size info:
		var ySize = this.lookupYSize[(sprite.shape << 2) | sprite.size] << (sprite.doubleSizeOrDisabled | 0);
		//Obtain some offsets:
		var ycoord = sprite.ycoord | 0;
		var yOffset = ((line | 0) - (ycoord | 0)) | 0;
		//Overflow Correction:
		if ((yOffset | 0) < 0 || (((ycoord | 0) + (ySize | 0)) | 0) > 0x100) {
			/*
			 HW re-offsets any "negative" y-coord values to on-screen unsigned.
			 Also a bug triggers this on 8-bit ending coordinate overflow from large sprites.
			 */
			yOffset = ((yOffset | 0) + 0x100) | 0;
		}
		//Make a sprite line:
		ySize = ((ySize | 0) - 1) | 0;
		if ((yOffset & ySize) == (yOffset | 0)) {
			//Compute clocks required to draw the sprite:
			cycles = this.computeCycles(cycles | 0, sprite.matrix2D | 0, xSize | 0) | 0;
			//If there's enough cycles, render:
			if ((cycles | 0) >= 0) {
				switch (sprite.mode | 0) {
					case 0:
						//Normal/Semi-transparent Sprite:
						this.renderRegularSprite(sprite, xSize | 0, ySize | 0, yOffset | 0);
						break;
					case 1:
						//Semi-transparent Sprite:
						this.renderSemiTransparentSprite(sprite, xSize | 0, ySize | 0, yOffset | 0);
						break;
					case 2:
						//OBJ-WIN Sprite:
						this.renderOBJWINSprite(sprite, xSize | 0, ySize | 0, yOffset | 0);
				}
			}
		}
	}
	return cycles | 0;
}
GameBoyAdvanceOBJRenderer.prototype.computeCycles = function (cycles, matrix2D, cyclesToSubtract) {
	cycles = cycles | 0;
	matrix2D = matrix2D | 0;
	cyclesToSubtract = cyclesToSubtract | 0;
	if ((matrix2D | 0) != 0) {
		//Scale & Rotation:
		cyclesToSubtract = cyclesToSubtract << 1;
		cyclesToSubtract = ((cyclesToSubtract | 0) + 10) | 0;
		cycles = ((cycles | 0) - (cyclesToSubtract | 0)) | 0;

	} else {
		//Regular Scrolling:
		cycles = ((cycles | 0) - (cyclesToSubtract | 0)) | 0;
	}
	return cycles | 0;
}
GameBoyAdvanceOBJRenderer.prototype.renderRegularSprite = function (sprite, xSize, ySize, yOffset) {
	xSize = xSize | 0;
	ySize = ySize | 0;
	yOffset = yOffset | 0;
	if ((sprite.matrix2D | 0) != 0) {
		//Scale & Rotation:
		this.renderMatrixSprite(sprite, xSize | 0, ((ySize | 0) + 1) | 0, yOffset | 0);
	} else {
		//Regular Scrolling:
		this.renderNormalSprite(sprite, xSize | 0, ySize | 0, yOffset | 0);
	}
	//Copy OBJ scratch buffer to scratch line buffer:
	this.outputSpriteToScratch(sprite, xSize | 0);
}
GameBoyAdvanceOBJRenderer.prototype.renderSemiTransparentSprite = function (sprite, xSize, ySize, yOffset) {
	xSize = xSize | 0;
	ySize = ySize | 0;
	yOffset = yOffset | 0;
	if ((sprite.matrix2D | 0) != 0) {
		//Scale & Rotation:
		this.renderMatrixSprite(sprite, xSize | 0, ((ySize | 0) + 1) | 0, yOffset | 0);
	} else {
		//Regular Scrolling:
		this.renderNormalSprite(sprite, xSize | 0, ySize | 0, yOffset | 0);
	}
	//Copy OBJ scratch buffer to scratch line buffer:
	this.outputSemiTransparentSpriteToScratch(sprite, xSize | 0);
}
GameBoyAdvanceOBJRenderer.prototype.renderOBJWINSprite = function (sprite, xSize, ySize, yOffset) {
	xSize = xSize | 0;
	ySize = ySize | 0;
	yOffset = yOffset | 0;
	if ((sprite.matrix2D | 0) != 0) {
		//Scale & Rotation:
		this.renderMatrixSpriteOBJWIN(sprite, xSize | 0, ((ySize | 0) + 1) | 0, yOffset | 0);
	} else {
		//Regular Scrolling:
		this.renderNormalSpriteOBJWIN(sprite, xSize | 0, ySize | 0, yOffset | 0);
	}
	//Copy OBJ scratch buffer to scratch obj-window line buffer:
	this.outputSpriteToOBJWINScratch(sprite, xSize | 0);
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceOBJRenderer.prototype.renderMatrixSprite = function (sprite, xSize, ySize, yOffset) {
		xSize = xSize | 0;
		ySize = ySize | 0;
		yOffset = yOffset | 0;
		var xDiff = (-(xSize >> 1)) | 0;
		var yDiff = ((yOffset | 0) - (ySize >> 1)) | 0;
		var xSizeOriginal = xSize >> (sprite.doubleSizeOrDisabled | 0);
		var xSizeFixed = xSizeOriginal << 8;
		var ySizeOriginal = ySize >> (sprite.doubleSizeOrDisabled | 0);
		var ySizeFixed = ySizeOriginal << 8;
		var dx = this.OBJMatrixParameters[sprite.matrixParameters | 0] | 0;
		var dmx = this.OBJMatrixParameters[sprite.matrixParameters | 1] | 0;
		var dy = this.OBJMatrixParameters[sprite.matrixParameters | 2] | 0;
		var dmy = this.OBJMatrixParameters[sprite.matrixParameters | 3] | 0;
		var pa = Math.imul(dx | 0, xDiff | 0) | 0;
		var pb = Math.imul(dmx | 0, yDiff | 0) | 0;
		var pc = Math.imul(dy | 0, xDiff | 0) | 0;
		var pd = Math.imul(dmy | 0, yDiff | 0) | 0;
		var x = ((pa | 0) + (pb | 0)) | 0;
		x = ((x | 0) + (xSizeFixed >> 1)) | 0;
		var y = ((pc | 0) + (pd | 0)) | 0;
		y = ((y | 0) + (ySizeFixed >> 1)) | 0;
		for (var position = 0;
			(position | 0) < (xSize | 0); position = (position + 1) | 0, x = ((x | 0) + (dx | 0)) | 0, y = ((y | 0) + (dy | 0)) | 0) {
			if ((x | 0) >= 0 && (y | 0) >= 0 && (x | 0) < (xSizeFixed | 0) && (y | 0) < (ySizeFixed | 0)) {
				//Coordinates in range, fetch pixel:
				this.scratchOBJBuffer[position | 0] = this.fetchMatrixPixel(sprite, x >> 8, y >> 8, xSizeOriginal | 0) | 0;
			} else {
				//Coordinates outside of range, transparency defaulted:
				this.scratchOBJBuffer[position | 0] = 0x3800000;
			}
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.renderMatrixSpriteOBJWIN = function (sprite, xSize, ySize, yOffset) {
		xSize = xSize | 0;
		ySize = ySize | 0;
		yOffset = yOffset | 0;
		var xDiff = (-(xSize >> 1)) | 0;
		var yDiff = ((yOffset | 0) - (ySize >> 1)) | 0;
		var xSizeOriginal = xSize >> (sprite.doubleSizeOrDisabled | 0);
		var xSizeFixed = xSizeOriginal << 8;
		var ySizeOriginal = ySize >> (sprite.doubleSizeOrDisabled | 0);
		var ySizeFixed = ySizeOriginal << 8;
		var dx = this.OBJMatrixParameters[sprite.matrixParameters | 0] | 0;
		var dmx = this.OBJMatrixParameters[sprite.matrixParameters | 1] | 0;
		var dy = this.OBJMatrixParameters[sprite.matrixParameters | 2] | 0;
		var dmy = this.OBJMatrixParameters[sprite.matrixParameters | 3] | 0;
		var pa = Math.imul(dx | 0, xDiff | 0) | 0;
		var pb = Math.imul(dmx | 0, yDiff | 0) | 0;
		var pc = Math.imul(dy | 0, xDiff | 0) | 0;
		var pd = Math.imul(dmy | 0, yDiff | 0) | 0;
		var x = ((pa | 0) + (pb | 0)) | 0;
		x = ((x | 0) + (xSizeFixed >> 1)) | 0;
		var y = ((pc | 0) + (pd | 0)) | 0;
		y = ((y | 0) + (ySizeFixed >> 1)) | 0;
		for (var position = 0;
			(position | 0) < (xSize | 0); position = (position + 1) | 0, x = ((x | 0) + (dx | 0)) | 0, y = ((y | 0) + (dy | 0)) | 0) {
			if ((x | 0) >= 0 && (y | 0) >= 0 && (x | 0) < (xSizeFixed | 0) && (y | 0) < (ySizeFixed | 0)) {
				//Coordinates in range, fetch pixel:
				this.scratchOBJBuffer[position | 0] = this.fetchMatrixPixelOBJWIN(sprite, x >> 8, y >> 8, xSizeOriginal | 0) | 0;
			} else {
				//Coordinates outside of range, transparency defaulted:
				this.scratchOBJBuffer[position | 0] = 0;
			}
		}
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceOBJRenderer.prototype.renderMatrixSprite = function (sprite, xSize, ySize, yOffset) {
		var xDiff = -(xSize >> 1);
		var yDiff = yOffset - (ySize >> 1);
		var xSizeOriginal = xSize >> sprite.doubleSizeOrDisabled;
		var xSizeFixed = xSizeOriginal << 8;
		var ySizeOriginal = ySize >> sprite.doubleSizeOrDisabled;
		var ySizeFixed = ySizeOriginal << 8;
		var dx = this.OBJMatrixParameters[sprite.matrixParameters];
		var dmx = this.OBJMatrixParameters[sprite.matrixParameters | 1];
		var dy = this.OBJMatrixParameters[sprite.matrixParameters | 2];
		var dmy = this.OBJMatrixParameters[sprite.matrixParameters | 3];
		var pa = dx * xDiff;
		var pb = dmx * yDiff;
		var pc = dy * xDiff;
		var pd = dmy * yDiff;
		var x = pa + pb + (xSizeFixed >> 1);
		var y = pc + pd + (ySizeFixed >> 1);
		for (var position = 0; position < xSize; ++position, x += dx, y += dy) {
			if (x >= 0 && y >= 0 && x < xSizeFixed && y < ySizeFixed) {
				//Coordinates in range, fetch pixel:
				this.scratchOBJBuffer[position] = this.fetchMatrixPixel(sprite, x >> 8, y >> 8, xSizeOriginal);
			} else {
				//Coordinates outside of range, transparency defaulted:
				this.scratchOBJBuffer[position] = 0x3800000;
			}
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.renderMatrixSpriteOBJWIN = function (sprite, xSize, ySize, yOffset) {
		var xDiff = -(xSize >> 1);
		var yDiff = yOffset - (ySize >> 1);
		var xSizeOriginal = xSize >> sprite.doubleSizeOrDisabled;
		var xSizeFixed = xSizeOriginal << 8;
		var ySizeOriginal = ySize >> sprite.doubleSizeOrDisabled;
		var ySizeFixed = ySizeOriginal << 8;
		var dx = this.OBJMatrixParameters[sprite.matrixParameters];
		var dmx = this.OBJMatrixParameters[sprite.matrixParameters | 1];
		var dy = this.OBJMatrixParameters[sprite.matrixParameters | 2];
		var dmy = this.OBJMatrixParameters[sprite.matrixParameters | 3];
		var pa = dx * xDiff;
		var pb = dmx * yDiff;
		var pc = dy * xDiff;
		var pd = dmy * yDiff;
		var x = pa + pb + (xSizeFixed >> 1);
		var y = pc + pd + (ySizeFixed >> 1);
		for (var position = 0; position < xSize; ++position, x += dx, y += dy) {
			if (x >= 0 && y >= 0 && x < xSizeFixed && y < ySizeFixed) {
				//Coordinates in range, fetch pixel:
				this.scratchOBJBuffer[position] = this.fetchMatrixPixelOBJWIN(sprite, x >> 8, y >> 8, xSizeOriginal);
			} else {
				//Coordinates outside of range, transparency defaulted:
				this.scratchOBJBuffer[position] = 0;
			}
		}
	}
}
GameBoyAdvanceOBJRenderer.prototype.fetchMatrixPixel = function (sprite, x, y, xSize) {
	x = x | 0;
	y = y | 0;
	xSize = xSize | 0;
	if ((sprite.monolithicPalette | 0) != 0) {
		//256 Colors / 1 Palette:
		var address = this.tileNumberToAddress256(sprite.tileNumber | 0, xSize | 0, y | 0) | 0;
		address = ((address | 0) + (this.tileRelativeAddressOffset(x | 0, y | 0) | 0)) | 0;
		return this.paletteOBJ256[this.VRAM[address | 0] | 0] | 0;
	} else {
		//16 Colors / 16 palettes:
		var address = this.tileNumberToAddress16(sprite.tileNumber | 0, xSize | 0, y | 0) | 0;
		address = ((address | 0) + ((this.tileRelativeAddressOffset(x | 0, y | 0) >> 1) | 0)) | 0;
		if ((x & 0x1) == 0) {
			return this.paletteOBJ16[sprite.paletteNumber | this.VRAM[address | 0] & 0xF] | 0;
		} else {
			return this.paletteOBJ16[sprite.paletteNumber | this.VRAM[address | 0] >> 4] | 0;
		}
	}
}
GameBoyAdvanceOBJRenderer.prototype.fetchMatrixPixelOBJWIN = function (sprite, x, y, xSize) {
	x = x | 0;
	y = y | 0;
	xSize = xSize | 0;
	if ((sprite.monolithicPalette | 0) != 0) {
		//256 Colors / 1 Palette:
		var address = this.tileNumberToAddress256(sprite.tileNumber | 0, xSize | 0, y | 0) | 0;
		address = ((address | 0) + (this.tileRelativeAddressOffset(x | 0, y | 0) | 0)) | 0;
		return this.VRAM[address | 0] | 0;
	} else {
		//16 Colors / 16 palettes:
		var address = this.tileNumberToAddress16(sprite.tileNumber | 0, xSize | 0, y | 0) | 0;
		address = ((address | 0) + ((this.tileRelativeAddressOffset(x | 0, y | 0) >> 1) | 0)) | 0;
		if ((x & 0x1) == 0) {
			return this.VRAM[address | 0] & 0xF;
		} else {
			return this.VRAM[address | 0] >> 4;
		}
	}
}
GameBoyAdvanceOBJRenderer.prototype.tileRelativeAddressOffset = function (x, y) {
	x = x | 0;
	y = y | 0;
	return ((((y & 7) + (x & -8)) << 3) + (x & 0x7)) | 0;
}
GameBoyAdvanceOBJRenderer.prototype.renderNormalSprite = function (sprite, xSize, ySize, yOffset) {
	xSize = xSize | 0;
	ySize = ySize | 0;
	yOffset = yOffset | 0;
	if ((sprite.verticalFlip | 0) != 0) {
		//Flip y-coordinate offset:
		yOffset = ((ySize | 0) - (yOffset | 0)) | 0;
	}
	if ((sprite.monolithicPalette | 0) != 0) {
		//256 Colors / 1 Palette:
		var address = this.tileNumberToAddress256(sprite.tileNumber | 0, xSize | 0, yOffset | 0) | 0;
		address = ((address | 0) + ((yOffset & 7) << 3)) | 0;
		this.render256ColorPaletteSprite(address | 0, xSize | 0);
	} else {
		//16 Colors / 16 palettes:
		var address = this.tileNumberToAddress16(sprite.tileNumber | 0, xSize | 0, yOffset | 0) | 0;
		address = ((address | 0) + ((yOffset & 7) << 2)) | 0;
		this.render16ColorPaletteSprite(address | 0, xSize | 0, sprite.paletteNumber | 0);
	}
}
GameBoyAdvanceOBJRenderer.prototype.renderNormalSpriteOBJWIN = function (sprite, xSize, ySize, yOffset) {
	xSize = xSize | 0;
	ySize = ySize | 0;
	yOffset = yOffset | 0;
	if ((sprite.verticalFlip | 0) != 0) {
		//Flip y-coordinate offset:
		yOffset = ((ySize | 0) - (yOffset | 0)) | 0;
	}
	if ((sprite.monolithicPalette | 0) != 0) {
		//256 Colors / 1 Palette:
		var address = this.tileNumberToAddress256(sprite.tileNumber | 0, xSize | 0, yOffset | 0) | 0;
		address = ((address | 0) + ((yOffset & 7) << 3)) | 0;
		this.render256ColorPaletteSpriteOBJWIN(address | 0, xSize | 0);
	} else {
		//16 Colors / 16 palettes:
		var address = this.tileNumberToAddress16(sprite.tileNumber | 0, xSize | 0, yOffset | 0) | 0;
		address = ((address | 0) + ((yOffset & 7) << 2)) | 0;
		this.render16ColorPaletteSpriteOBJWIN(address | 0, xSize | 0);
	}
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceOBJRenderer.prototype.render256ColorPaletteSprite = function (address, xSize) {
		address = address >> 2;
		xSize = xSize | 0;
		var data = 0;
		for (var objBufferPos = 0;
			(objBufferPos | 0) < (xSize | 0); objBufferPos = ((objBufferPos | 0) + 8) | 0) {
			data = this.VRAM32[address | 0] | 0;
			this.scratchOBJBuffer[objBufferPos | 0] = this.paletteOBJ256[data & 0xFF] | 0;
			this.scratchOBJBuffer[objBufferPos | 1] = this.paletteOBJ256[(data >> 8) & 0xFF] | 0;
			this.scratchOBJBuffer[objBufferPos | 2] = this.paletteOBJ256[(data >> 16) & 0xFF] | 0;
			this.scratchOBJBuffer[objBufferPos | 3] = this.paletteOBJ256[data >>> 24] | 0;
			data = this.VRAM32[address | 1] | 0;
			this.scratchOBJBuffer[objBufferPos | 4] = this.paletteOBJ256[data & 0xFF] | 0;
			this.scratchOBJBuffer[objBufferPos | 5] = this.paletteOBJ256[(data >> 8) & 0xFF] | 0;
			this.scratchOBJBuffer[objBufferPos | 6] = this.paletteOBJ256[(data >> 16) & 0xFF] | 0;
			this.scratchOBJBuffer[objBufferPos | 7] = this.paletteOBJ256[data >>> 24] | 0;
			address = ((address | 0) + 0x10) | 0;
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.render256ColorPaletteSpriteOBJWIN = function (address, xSize) {
		address = address >> 2;
		xSize = xSize | 0;
		var data = 0;
		for (var objBufferPos = 0;
			(objBufferPos | 0) < (xSize | 0); objBufferPos = ((objBufferPos | 0) + 8) | 0) {
			data = this.VRAM32[address | 0] | 0;
			this.scratchOBJBuffer[objBufferPos | 0] = data & 0xFF;
			this.scratchOBJBuffer[objBufferPos | 1] = (data >> 8) & 0xFF;
			this.scratchOBJBuffer[objBufferPos | 2] = (data >> 16) & 0xFF;
			this.scratchOBJBuffer[objBufferPos | 3] = data >>> 24;
			data = this.VRAM32[address | 1] | 0;
			this.scratchOBJBuffer[objBufferPos | 4] = data & 0xFF;
			this.scratchOBJBuffer[objBufferPos | 5] = (data >> 8) & 0xFF;
			this.scratchOBJBuffer[objBufferPos | 6] = (data >> 16) & 0xFF;
			this.scratchOBJBuffer[objBufferPos | 7] = data >>> 24;
			address = ((address | 0) + 0x10) | 0;
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.render16ColorPaletteSprite = function (address, xSize, paletteOffset) {
		address = address >> 2;
		xSize = xSize | 0;
		paletteOffset = paletteOffset | 0;
		var data = 0;
		for (var objBufferPos = 0;
			(objBufferPos | 0) < (xSize | 0); objBufferPos = ((objBufferPos | 0) + 8) | 0) {
			data = this.VRAM32[address | 0] | 0;
			this.scratchOBJBuffer[objBufferPos | 0] = this.paletteOBJ16[paletteOffset | (data & 0xF)] | 0;
			this.scratchOBJBuffer[objBufferPos | 1] = this.paletteOBJ16[paletteOffset | ((data >> 4) & 0xF)] | 0;
			this.scratchOBJBuffer[objBufferPos | 2] = this.paletteOBJ16[paletteOffset | ((data >> 8) & 0xF)] | 0;
			this.scratchOBJBuffer[objBufferPos | 3] = this.paletteOBJ16[paletteOffset | ((data >> 12) & 0xF)] | 0;
			this.scratchOBJBuffer[objBufferPos | 4] = this.paletteOBJ16[paletteOffset | ((data >> 16) & 0xF)] | 0;
			this.scratchOBJBuffer[objBufferPos | 5] = this.paletteOBJ16[paletteOffset | ((data >> 20) & 0xF)] | 0;
			this.scratchOBJBuffer[objBufferPos | 6] = this.paletteOBJ16[paletteOffset | ((data >> 24) & 0xF)] | 0;
			this.scratchOBJBuffer[objBufferPos | 7] = this.paletteOBJ16[paletteOffset | (data >>> 28)] | 0;
			address = ((address | 0) + 0x8) | 0;
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.render16ColorPaletteSpriteOBJWIN = function (address, xSize) {
		address = address >> 2;
		xSize = xSize | 0;
		var data = 0;
		for (var objBufferPos = 0;
			(objBufferPos | 0) < (xSize | 0); objBufferPos = ((objBufferPos | 0) + 8) | 0) {
			data = this.VRAM32[address | 0] | 0;
			this.scratchOBJBuffer[objBufferPos | 0] = data & 0xF;
			this.scratchOBJBuffer[objBufferPos | 1] = (data >> 4) & 0xF;
			this.scratchOBJBuffer[objBufferPos | 2] = (data >> 8) & 0xF;
			this.scratchOBJBuffer[objBufferPos | 3] = (data >> 12) & 0xF;
			this.scratchOBJBuffer[objBufferPos | 4] = (data >> 16) & 0xF;
			this.scratchOBJBuffer[objBufferPos | 5] = (data >> 20) & 0xF;
			this.scratchOBJBuffer[objBufferPos | 6] = (data >> 24) & 0xF;
			this.scratchOBJBuffer[objBufferPos | 7] = data >>> 28;
			address = ((address | 0) + 0x8) | 0;
		}
	}
} else {
	GameBoyAdvanceOBJRenderer.prototype.render256ColorPaletteSprite = function (address, xSize) {
		for (var objBufferPos = 0; objBufferPos < xSize;) {
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address++]];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ256[this.VRAM[address]];
			address += 0x39;
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.render256ColorPaletteSpriteOBJWIN = function (address, xSize) {
		for (var objBufferPos = 0; objBufferPos < xSize;) {
			this.scratchOBJBuffer[objBufferPos++] = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.VRAM[address];
			address += 0x39;
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.render16ColorPaletteSprite = function (address, xSize, paletteOffset) {
		var data = 0;
		for (var objBufferPos = 0; objBufferPos < xSize;) {
			data = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data & 0xF)];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data >> 4)];
			data = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data & 0xF)];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data >> 4)];
			data = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data & 0xF)];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data >> 4)];
			data = this.VRAM[address];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data & 0xF)];
			this.scratchOBJBuffer[objBufferPos++] = this.paletteOBJ16[paletteOffset | (data >> 4)];
			address += 0x1D;
		}
	}
	GameBoyAdvanceOBJRenderer.prototype.render16ColorPaletteSpriteOBJWIN = function (address, xSize) {
		var data = 0;
		for (var objBufferPos = 0; objBufferPos < xSize;) {
			data = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = data & 0xF;
			this.scratchOBJBuffer[objBufferPos++] = data >> 4;
			data = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = data & 0xF;
			this.scratchOBJBuffer[objBufferPos++] = data >> 4;
			data = this.VRAM[address++];
			this.scratchOBJBuffer[objBufferPos++] = data & 0xF;
			this.scratchOBJBuffer[objBufferPos++] = data >> 4;
			data = this.VRAM[address];
			this.scratchOBJBuffer[objBufferPos++] = data & 0xF;
			this.scratchOBJBuffer[objBufferPos++] = data >> 4;
			address += 0x1D;
		}
	}
}
if (typeof Math.imul == "function") {
	//Math.imul found, insert the optimized path in:
	GameBoyAdvanceOBJRenderer.prototype.tileNumberToAddress256 = function (tileNumber, xSize, yOffset) {
		tileNumber = tileNumber | 0;
		xSize = xSize | 0;
		yOffset = yOffset | 0;
		if ((this.gfx.displayControl & 0x40) == 0) {
			//2D Mapping (32 8x8 tiles by 32 8x8 tiles):
			//Hardware ignores the LSB in this case:
			tileNumber = ((tileNumber & -2) + (Math.imul(yOffset >> 3, 0x20) | 0)) | 0;
		} else {
			//1D Mapping:
			//256 Color Palette:
			tileNumber = ((tileNumber | 0) + (Math.imul(yOffset >> 3, xSize >> 2) | 0)) | 0;
		}
		//Starting address of currently drawing sprite line:
		return ((tileNumber << 5) + 0x10000) | 0;
	}
	GameBoyAdvanceOBJRenderer.prototype.tileNumberToAddress16 = function (tileNumber, xSize, yOffset) {
		tileNumber = tileNumber | 0;
		xSize = xSize | 0;
		yOffset = yOffset | 0;
		if ((this.gfx.displayControl & 0x40) == 0) {
			//2D Mapping (32 8x8 tiles by 32 8x8 tiles):
			tileNumber = ((tileNumber | 0) + (Math.imul(yOffset >> 3, 0x20) | 0)) | 0;
		} else {
			//1D Mapping:
			//16 Color Palette:
			tileNumber = ((tileNumber | 0) + (Math.imul(yOffset >> 3, xSize >> 3) | 0)) | 0;
		}
		//Starting address of currently drawing sprite line:
		return ((tileNumber << 5) + 0x10000) | 0;
	}
} else {
	//Math.imul not found, use the compatibility method:
	GameBoyAdvanceOBJRenderer.prototype.tileNumberToAddress256 = function (tileNumber, xSize, yOffset) {
		if ((this.gfx.displayControl & 0x40) == 0) {
			//2D Mapping (32 8x8 tiles by 32 8x8 tiles):
			//Hardware ignores the LSB in this case:
			tileNumber &= -2;
			tileNumber += (yOffset >> 3) * 0x20;
		} else {
			//1D Mapping:
			tileNumber += (yOffset >> 3) * (xSize >> 2);
		}
		//Starting address of currently drawing sprite line:
		return (tileNumber << 5) + 0x10000;
	}
	GameBoyAdvanceOBJRenderer.prototype.tileNumberToAddress16 = function (tileNumber, xSize, yOffset) {
		if ((this.gfx.displayControl & 0x40) == 0) {
			//2D Mapping (32 8x8 tiles by 32 8x8 tiles):
			tileNumber += (yOffset >> 3) * 0x20;
		} else {
			//1D Mapping:
			tileNumber += (yOffset >> 3) * (xSize >> 3);
		}
		//Starting address of currently drawing sprite line:
		return (tileNumber << 5) + 0x10000;
	}
}
GameBoyAdvanceOBJRenderer.prototype.outputSpriteToScratch = function (sprite, xSize) {
	xSize = xSize | 0;
	//Simulate x-coord wrap around logic:
	var xcoord = sprite.xcoord | 0;
	if ((xcoord | 0) > ((0x200 - (xSize | 0)) | 0)) {
		xcoord = ((xcoord | 0) - 0x200) | 0;
	}
	//Perform the mosaic transform:
	if ((sprite.mosaic | 0) != 0) {
		this.gfx.mosaicRenderer.renderOBJMosaicHorizontal(this.scratchOBJBuffer, xcoord | 0, xSize | 0);
	}
	//Resolve end point:
	var xcoordEnd = Math.min(((xcoord | 0) + (xSize | 0)) | 0, 240) | 0;
	//Flag for compositor to ID the pixels as OBJ:
	var bitFlags = (sprite.priority << 23) | 0x100000;
	if ((sprite.horizontalFlip | 0) == 0 || (sprite.matrix2D | 0) != 0) {
		//Normal:
		this.outputSpriteNormal(xcoord | 0, xcoordEnd | 0, bitFlags | 0);
	} else {
		//Flipped Horizontally:
		this.outputSpriteFlipped(xcoord | 0, xcoordEnd | 0, bitFlags | 0, xSize | 0);
	}
}
GameBoyAdvanceOBJRenderer.prototype.outputSemiTransparentSpriteToScratch = function (sprite, xSize) {
	xSize = xSize | 0;
	//Simulate x-coord wrap around logic:
	var xcoord = sprite.xcoord | 0;
	if ((xcoord | 0) > ((0x200 - (xSize | 0)) | 0)) {
		xcoord = ((xcoord | 0) - 0x200) | 0;
	}
	//Perform the mosaic transform:
	if ((sprite.mosaic | 0) != 0) {
		this.gfx.mosaicRenderer.renderOBJMosaicHorizontal(this.scratchOBJBuffer, xcoord | 0, xSize | 0);
	}
	//Resolve end point:
	var xcoordEnd = Math.min(((xcoord | 0) + (xSize | 0)) | 0, 240) | 0;
	//Flag for compositor to ID the pixels as OBJ:
	var bitFlags = (sprite.priority << 23) | 0x500000;
	if ((sprite.horizontalFlip | 0) == 0 || (sprite.matrix2D | 0) != 0) {
		//Normal:
		this.outputSpriteNormal(xcoord | 0, xcoordEnd | 0, bitFlags | 0);
	} else {
		//Flipped Horizontally:
		this.outputSpriteFlipped(xcoord | 0, xcoordEnd | 0, bitFlags | 0, xSize | 0);
	}
}
GameBoyAdvanceOBJRenderer.prototype.outputSpriteToOBJWINScratch = function (sprite, xSize) {
	xSize = xSize | 0;
	//Simulate x-coord wrap around logic:
	var xcoord = sprite.xcoord | 0;
	if ((xcoord | 0) > ((0x200 - (xSize | 0)) | 0)) {
		xcoord = ((xcoord | 0) - 0x200) | 0;
	}
	//Perform the mosaic transform:
	if ((sprite.mosaic | 0) != 0) {
		this.gfx.mosaicRenderer.renderOBJMosaicHorizontal(this.scratchOBJBuffer, xcoord | 0, xSize | 0);
	}
	//Resolve end point:
	var xcoordEnd = Math.min(((xcoord | 0) + (xSize | 0)) | 0, 240) | 0;
	for (var xSource = 0;
		(xcoord | 0) < (xcoordEnd | 0); xcoord = ((xcoord | 0) + 1) | 0, xSource = ((xSource | 0) + 1) | 0) {
		if ((xcoord | 0) > -1 && (this.scratchOBJBuffer[xSource | 0] | 0) != 0) {
			this.scratchWindowBuffer[xcoord | 0] = 0;
		}
	}
}
GameBoyAdvanceOBJRenderer.prototype.isDrawable = function (sprite) {
	//Make sure we pass some checks that real hardware does:
	if ((sprite.mode | 0) <= 2) {
		if ((sprite.doubleSizeOrDisabled | 0) == 0 || (sprite.matrix2D | 0) != 0) {
			if ((sprite.shape | 0) < 3) {
				if ((this.gfx.displayControl & 0x7) < 3 || (sprite.tileNumber | 0) >= 0x200) {
					return true;
				}
			}
		}
	}
	return false;
}
GameBoyAdvanceOBJRenderer.prototype.setHBlankIntervalFreeStatus = function (data) {
	data = data | 0;
	if ((data | 0) != 0) {
		this.cyclesToRender = 954;
	} else {
		this.cyclesToRender = 1210;
	}
}
GameBoyAdvanceOBJRenderer.prototype.readOAM = function (address) {
	return this.OAMRAM[address & 0x3FF] | 0;
}
if (__LITTLE_ENDIAN__) {
	GameBoyAdvanceOBJRenderer.prototype.writeOAM16 = function (address, data) {
		address = address | 0;
		data = data | 0;
		var OAMTable = this.OAMTable[address >> 2];
		switch (address & 0x3) {
			//Attrib 0:
			case 0:
				OAMTable.ycoord = data & 0xFF;
				OAMTable.matrix2D = data & 0x100;
				OAMTable.doubleSizeOrDisabled = (data & 0x200) >> 9;
				OAMTable.mode = (data >> 10) & 0x3;
				OAMTable.mosaic = data & 0x1000;
				OAMTable.monolithicPalette = data & 0x2000;
				OAMTable.shape = data >> 14;
				break;
				//Attrib 1:
			case 1:
				OAMTable.xcoord = data & 0x1FF;
				OAMTable.matrixParameters = (data >> 7) & 0x7C;
				OAMTable.horizontalFlip = data & 0x1000;
				OAMTable.verticalFlip = data & 0x2000;
				OAMTable.size = data >> 14;
				break;
				//Attrib 2:
			case 2:
				OAMTable.tileNumber = data & 0x3FF;
				OAMTable.priority = (data >> 10) & 0x3;
				OAMTable.paletteNumber = (data >> 8) & 0xF0;
				break;
				//Scaling/Rotation Parameter:
			default:
				this.OBJMatrixParameters[address >> 2] = (data << 16) >> 16;
		}
		this.OAMRAM16[address | 0] = data | 0;
	}
	GameBoyAdvanceOBJRenderer.prototype.writeOAM32 = function (address, data) {
		address = address | 0;
		data = data | 0;
		var OAMTable = this.OAMTable[address >> 1];
		if ((address & 0x1) == 0) {
			//Attrib 0:
			OAMTable.ycoord = data & 0xFF;
			OAMTable.matrix2D = data & 0x100;
			OAMTable.doubleSizeOrDisabled = (data & 0x200) >> 9;
			OAMTable.mode = (data >> 10) & 0x3;
			OAMTable.mosaic = data & 0x1000;
			OAMTable.monolithicPalette = data & 0x2000;
			OAMTable.shape = (data >> 14) & 0x3;
			//Attrib 1:
			OAMTable.xcoord = (data >> 16) & 0x1FF;
			OAMTable.matrixParameters = (data >> 23) & 0x7C;
			OAMTable.horizontalFlip = data & 0x10000000;
			OAMTable.verticalFlip = data & 0x20000000;
			OAMTable.size = data >>> 30;
		} else {
			//Attrib 2:
			OAMTable.tileNumber = data & 0x3FF;
			OAMTable.priority = (data >> 10) & 0x3;
			OAMTable.paletteNumber = (data >> 8) & 0xF0;
			//Scaling/Rotation Parameter:
			this.OBJMatrixParameters[address >> 1] = data >> 16;
		}
		this.OAMRAM32[address | 0] = data | 0;
	}
	GameBoyAdvanceOBJRenderer.prototype.readOAM16 = function (address) {
		address = address | 0;
		return this.OAMRAM16[(address >> 1) & 0x1FF] | 0;
	}
	GameBoyAdvanceOBJRenderer.prototype.readOAM32 = function (address) {
		address = address | 0;
		return this.OAMRAM32[(address >> 2) & 0xFF] | 0;
	}
} else {
	GameBoyAdvanceOBJRenderer.prototype.writeOAM16 = function (address, data) {
		address = address | 0;
		data = data | 0;
		var OAMTable = this.OAMTable[address >> 2];
		switch (address & 0x3) {
			//Attrib 0:
			case 0:
				OAMTable.ycoord = data & 0xFF;
				OAMTable.matrix2D = data & 0x100;
				OAMTable.doubleSizeOrDisabled = (data & 0x200) >> 9;
				OAMTable.mode = (data >> 10) & 0x3;
				OAMTable.mosaic = data & 0x1000;
				OAMTable.monolithicPalette = data & 0x2000;
				OAMTable.shape = data >> 14;
				break;
				//Attrib 1:
			case 1:
				OAMTable.xcoord = data & 0x1FF;
				OAMTable.matrixParameters = (data >> 7) & 0x7C;
				OAMTable.horizontalFlip = data & 0x1000;
				OAMTable.verticalFlip = data & 0x2000;
				OAMTable.size = data >> 14;
				break;
				//Attrib 2:
			case 2:
				OAMTable.tileNumber = data & 0x3FF;
				OAMTable.priority = (data >> 10) & 0x3;
				OAMTable.paletteNumber = (data >> 8) & 0xF0;
				break;
				//Scaling/Rotation Parameter:
			default:
				this.OBJMatrixParameters[address >> 2] = (data << 16) >> 16;
		}
		address = address << 1;
		this.OAMRAM[address | 0] = data & 0xFF;
		this.OAMRAM[address | 1] = data >> 8;
	}
	GameBoyAdvanceOBJRenderer.prototype.writeOAM32 = function (address, data) {
		address = address | 0;
		data = data | 0;
		var OAMTable = this.OAMTable[address >> 1];
		if ((address & 0x1) == 0) {
			//Attrib 0:
			OAMTable.ycoord = data & 0xFF;
			OAMTable.matrix2D = data & 0x100;
			OAMTable.doubleSizeOrDisabled = (data & 0x200) >> 9;
			OAMTable.mode = (data >> 10) & 0x3;
			OAMTable.mosaic = data & 0x1000;
			OAMTable.monolithicPalette = data & 0x2000;
			OAMTable.shape = (data >> 14) & 0x3;
			//Attrib 1:
			OAMTable.xcoord = (data >> 16) & 0x1FF;
			OAMTable.matrixParameters = (data >> 23) & 0x7C;
			OAMTable.horizontalFlip = data & 0x10000000;
			OAMTable.verticalFlip = data & 0x20000000;
			OAMTable.size = data >>> 30;
		} else {
			//Attrib 2:
			OAMTable.tileNumber = data & 0x3FF;
			OAMTable.priority = (data >> 10) & 0x3;
			OAMTable.paletteNumber = (data >> 8) & 0xF0;
			//Scaling/Rotation Parameter:
			this.OBJMatrixParameters[address >> 1] = data >> 16;
		}
		address = address << 2;
		this.OAMRAM[address | 0] = data & 0xFF;
		this.OAMRAM[address | 1] = (data >> 8) & 0xFF;
		this.OAMRAM[address | 2] = (data >> 16) & 0xFF;
		this.OAMRAM[address | 3] = data >>> 24;
	}
	GameBoyAdvanceOBJRenderer.prototype.readOAM16 = function (address) {
		address &= 0x3FE;
		return this.OAMRAM[address] | (this.OAMRAM[address | 1] << 8);
	}
	GameBoyAdvanceOBJRenderer.prototype.readOAM32 = function (address) {
		address &= 0x3FC;
		return this.OAMRAM[address] | (this.OAMRAM[address | 1] << 8) | (this.OAMRAM[address | 2] << 16) | (this.OAMRAM[address | 3] << 24);
	}
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceOBJWindowRenderer(compositor) {
	//Get a layer compositor that we'll send our parameters for windowing to:
	this.compositor = compositor;
}
GameBoyAdvanceOBJWindowRenderer.prototype.initialize = function () {
	//Initialize the compositor:
	this.compositor.initialize();
	//Layer masking & color effects control:
	this.WINOBJOutside = 0;
	//Need to update the color effects status in the compositor:
	this.preprocess();
}
GameBoyAdvanceOBJWindowRenderer.prototype.renderScanLine = function (line, toRender) {
	line = line | 0;
	toRender = toRender | 0;
	//Windowing can disable out further layers:
	toRender = toRender & this.WINOBJOutside;
	//Windowing occurs where there is a non-transparent "obj-win" sprite:
	this.compositor.renderScanLine(toRender | 0);
}
GameBoyAdvanceOBJWindowRenderer.prototype.writeWINOBJIN8 = function (data) {
	data = data | 0;
	//Layer masking & color effects control:
	this.WINOBJOutside = data | 0;
	//Need to update the color effects status in the compositor:
	this.preprocess();
}
GameBoyAdvanceOBJWindowRenderer.prototype.preprocess = function () {
	//Update the color effects status in the compositor:
	this.compositor.preprocess(this.WINOBJOutside & 0x20);
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceWindowRenderer(compositor) {
	//Get a layer compositor that we'll send our parameters for windowing to:
	this.compositor = compositor;
}
GameBoyAdvanceWindowRenderer.prototype.initialize = function () {
	//Initialize the compositor:
	this.compositor.initialize();
	//Right windowing coordinate:
	this.WINXCoordRight = 0;
	//Left windowing coordinate:
	this.WINXCoordLeft = 0;
	//Bottom windowing coordinate:
	this.WINYCoordBottom = 0;
	//Top windowing coordinate:
	this.WINYCoordTop = 0;
	//Layer masking & color effects control:
	this.windowDisplayControl = 0;
	//Need to update the color effects status in the compositor:
	this.preprocess();
}
GameBoyAdvanceWindowRenderer.prototype.renderScanLine = function (line, toRender) {
	line = line | 0;
	toRender = toRender | 0;
	//Windowing can disable out further layers:
	toRender = toRender & this.windowDisplayControl;
	//Check if we're doing windowing for the current line:
	if (this.checkYRange(line | 0)) {
		//Windowing is active for the current line:
		var right = this.WINXCoordRight | 0;
		var left = this.WINXCoordLeft | 0;
		if ((left | 0) <= (right | 0)) {
			//Windowing is left to right like expected:
			left = Math.min(left | 0, 240) | 0;
			right = Math.min(right | 0, 240) | 0;
			//Render left coordinate to right coordinate:
			this.compositor.renderScanLine(left | 0, right | 0, toRender | 0);
		} else {
			//Invalid horizontal windowing coordinates, so invert horizontal windowing range:
			left = Math.min(left | 0, 240) | 0;
			right = Math.min(right | 0, 240) | 0;
			//Render pixel 0 to right coordinate:
			this.compositor.renderScanLine(0, right | 0, toRender | 0);
			//Render left coordinate to last pixel:
			this.compositor.renderScanLine(left | 0, 240, toRender | 0);
		}
	}
}
GameBoyAdvanceWindowRenderer.prototype.checkYRange = function (line) {
	line = line | 0;
	var bottom = this.WINYCoordBottom | 0;
	var top = this.WINYCoordTop | 0;
	if ((top | 0) <= (bottom | 0)) {
		//Windowing is top to bottom like expected:
		return ((line | 0) >= (top | 0) && (line | 0) < (bottom | 0));
	} else {
		//Invalid vertical windowing coordinates, so invert vertical windowing range:
		return ((line | 0) < (top | 0) || (line | 0) >= (bottom | 0));
	}
}
GameBoyAdvanceWindowRenderer.prototype.preprocess = function () {
	//Update the color effects status in the compositor:
	this.compositor.preprocess(this.windowDisplayControl & 0x20);
}
GameBoyAdvanceWindowRenderer.prototype.writeWINXCOORDRight8 = function (data) {
	data = data | 0;
	//Right windowing coordinate:
	this.WINXCoordRight = data | 0;
}
GameBoyAdvanceWindowRenderer.prototype.writeWINXCOORDLeft8 = function (data) {
	data = data | 0;
	//Left windowing coordinate:
	this.WINXCoordLeft = data | 0;
}
GameBoyAdvanceWindowRenderer.prototype.writeWINYCOORDBottom8 = function (data) {
	data = data | 0;
	//Bottom windowing coordinate:
	this.WINYCoordBottom = data | 0;
}
GameBoyAdvanceWindowRenderer.prototype.writeWINYCOORDTop8 = function (data) {
	data = data | 0;
	//Top windowing coordinate:
	this.WINYCoordTop = data | 0;
}
GameBoyAdvanceWindowRenderer.prototype.writeWINXCOORD16 = function (data) {
	data = data | 0;
	//Right windowing coordinate:
	this.WINXCoordRight = data & 0xFF;
	//Left windowing coordinate:
	this.WINXCoordLeft = data >> 8;
}
GameBoyAdvanceWindowRenderer.prototype.writeWINYCOORD16 = function (data) {
	data = data | 0;
	//Bottom windowing coordinate:
	this.WINYCoordBottom = data & 0xFF;
	//Top windowing coordinate:
	this.WINYCoordTop = data >> 8;
}
GameBoyAdvanceWindowRenderer.prototype.writeWININ8 = function (data) {
	data = data | 0;
	//Layer masking & color effects control:
	this.windowDisplayControl = data | 0;
	//Need to update the color effects status in the compositor:
	this.preprocess();
}






"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceCompositor(gfx) {
	this.gfx = gfx;
	this.doEffects = 0;
}

function GameBoyAdvanceWindowCompositor(gfx) {
	this.gfx = gfx;
	this.doEffects = 0;
}

function GameBoyAdvanceOBJWindowCompositor(gfx) {
	this.gfx = gfx;
	this.doEffects = 0;
}
GameBoyAdvanceCompositor.prototype.initialize = GameBoyAdvanceWindowCompositor.prototype.initialize = function () {
	this.buffer = this.gfx.buffer;
	this.colorEffectsRenderer = this.gfx.colorEffectsRenderer;
}
GameBoyAdvanceOBJWindowCompositor.prototype.initialize = function () {
	this.buffer = this.gfx.buffer;
	this.colorEffectsRenderer = this.gfx.colorEffectsRenderer;
	this.OBJWindowBuffer = this.gfx.objRenderer.scratchWindowBuffer;
}
GameBoyAdvanceCompositor.prototype.preprocess = GameBoyAdvanceWindowCompositor.prototype.preprocess = GameBoyAdvanceOBJWindowCompositor.prototype.preprocess = function (doEffects) {
	doEffects = doEffects | 0;
	this.doEffects = doEffects | 0;
}
GameBoyAdvanceOBJWindowCompositor.prototype.renderScanLine = GameBoyAdvanceCompositor.prototype.renderScanLine = function (layers) {
	layers = layers | 0;
	if ((this.doEffects | 0) == 0) {
		this.renderNormalScanLine(layers | 0);
	} else {
		this.renderScanLineWithEffects(layers | 0);
	}
}
GameBoyAdvanceWindowCompositor.prototype.renderScanLine = function (xStart, xEnd, layers) {
	xStart = xStart | 0;
	xEnd = xEnd | 0;
	layers = layers | 0;
	if ((this.doEffects | 0) == 0) {
		this.renderNormalScanLine(xStart | 0, xEnd | 0, layers | 0);
	} else {
		this.renderScanLineWithEffects(xStart | 0, xEnd | 0, layers | 0);
	}
}
GameBoyAdvanceOBJWindowCompositor.prototype.renderNormalScanLine = GameBoyAdvanceCompositor.prototype.renderNormalScanLine = function (layers) {
	layers = layers | 0;
	switch (layers | 0) {
		case 0:
			this.normal0();
			break;
		case 1:
			this.normal1();
			break;
		case 2:
			this.normal2();
			break;
		case 3:
			this.normal3();
			break;
		case 4:
			this.normal4();
			break;
		case 5:
			this.normal5();
			break;
		case 6:
			this.normal6();
			break;
		case 7:
			this.normal7();
			break;
		case 8:
			this.normal8();
			break;
		case 9:
			this.normal9();
			break;
		case 10:
			this.normal10();
			break;
		case 11:
			this.normal11();
			break;
		case 12:
			this.normal12();
			break;
		case 13:
			this.normal13();
			break;
		case 14:
			this.normal14();
			break;
		case 15:
			this.normal15();
			break;
		case 16:
			this.normal16();
			break;
		case 17:
			this.normal17();
			break;
		case 18:
			this.normal18();
			break;
		case 19:
			this.normal19();
			break;
		case 20:
			this.normal20();
			break;
		case 21:
			this.normal21();
			break;
		case 22:
			this.normal22();
			break;
		case 23:
			this.normal23();
			break;
		case 24:
			this.normal24();
			break;
		case 25:
			this.normal25();
			break;
		case 26:
			this.normal26();
			break;
		case 27:
			this.normal27();
			break;
		case 28:
			this.normal28();
			break;
		case 29:
			this.normal29();
			break;
		case 30:
			this.normal30();
			break;
		default:
			this.normal31();
	}
}
GameBoyAdvanceWindowCompositor.prototype.renderNormalScanLine = function (xStart, xEnd, layers) {
	xStart = xStart | 0;
	xEnd = xEnd | 0;
	layers = layers | 0;
	switch (layers | 0) {
		case 0:
			this.normal0(xStart | 0, xEnd | 0);
			break;
		case 1:
			this.normal1(xStart | 0, xEnd | 0);
			break;
		case 2:
			this.normal2(xStart | 0, xEnd | 0);
			break;
		case 3:
			this.normal3(xStart | 0, xEnd | 0);
			break;
		case 4:
			this.normal4(xStart | 0, xEnd | 0);
			break;
		case 5:
			this.normal5(xStart | 0, xEnd | 0);
			break;
		case 6:
			this.normal6(xStart | 0, xEnd | 0);
			break;
		case 7:
			this.normal7(xStart | 0, xEnd | 0);
			break;
		case 8:
			this.normal8(xStart | 0, xEnd | 0);
			break;
		case 9:
			this.normal9(xStart | 0, xEnd | 0);
			break;
		case 10:
			this.normal10(xStart | 0, xEnd | 0);
			break;
		case 11:
			this.normal11(xStart | 0, xEnd | 0);
			break;
		case 12:
			this.normal12(xStart | 0, xEnd | 0);
			break;
		case 13:
			this.normal13(xStart | 0, xEnd | 0);
			break;
		case 14:
			this.normal14(xStart | 0, xEnd | 0);
			break;
		case 15:
			this.normal15(xStart | 0, xEnd | 0);
			break;
		case 16:
			this.normal16(xStart | 0, xEnd | 0);
			break;
		case 17:
			this.normal17(xStart | 0, xEnd | 0);
			break;
		case 18:
			this.normal18(xStart | 0, xEnd | 0);
			break;
		case 19:
			this.normal19(xStart | 0, xEnd | 0);
			break;
		case 20:
			this.normal20(xStart | 0, xEnd | 0);
			break;
		case 21:
			this.normal21(xStart | 0, xEnd | 0);
			break;
		case 22:
			this.normal22(xStart | 0, xEnd | 0);
			break;
		case 23:
			this.normal23(xStart | 0, xEnd | 0);
			break;
		case 24:
			this.normal24(xStart | 0, xEnd | 0);
			break;
		case 25:
			this.normal25(xStart | 0, xEnd | 0);
			break;
		case 26:
			this.normal26(xStart | 0, xEnd | 0);
			break;
		case 27:
			this.normal27(xStart | 0, xEnd | 0);
			break;
		case 28:
			this.normal28(xStart | 0, xEnd | 0);
			break;
		case 29:
			this.normal29(xStart | 0, xEnd | 0);
			break;
		case 30:
			this.normal30(xStart | 0, xEnd | 0);
			break;
		default:
			this.normal31(xStart | 0, xEnd | 0);
	}
}
GameBoyAdvanceOBJWindowCompositor.prototype.renderScanLineWithEffects = GameBoyAdvanceCompositor.prototype.renderScanLineWithEffects = function (layers) {
	layers = layers | 0;
	switch (layers | 0) {
		case 0:
			this.special0();
			break;
		case 1:
			this.special1();
			break;
		case 2:
			this.special2();
			break;
		case 3:
			this.special3();
			break;
		case 4:
			this.special4();
			break;
		case 5:
			this.special5();
			break;
		case 6:
			this.special6();
			break;
		case 7:
			this.special7();
			break;
		case 8:
			this.special8();
			break;
		case 9:
			this.special9();
			break;
		case 10:
			this.special10();
			break;
		case 11:
			this.special11();
			break;
		case 12:
			this.special12();
			break;
		case 13:
			this.special13();
			break;
		case 14:
			this.special14();
			break;
		case 15:
			this.special15();
			break;
		case 16:
			this.special16();
			break;
		case 17:
			this.special17();
			break;
		case 18:
			this.special18();
			break;
		case 19:
			this.special19();
			break;
		case 20:
			this.special20();
			break;
		case 21:
			this.special21();
			break;
		case 22:
			this.special22();
			break;
		case 23:
			this.special23();
			break;
		case 24:
			this.special24();
			break;
		case 25:
			this.special25();
			break;
		case 26:
			this.special26();
			break;
		case 27:
			this.special27();
			break;
		case 28:
			this.special28();
			break;
		case 29:
			this.special29();
			break;
		case 30:
			this.special30();
			break;
		default:
			this.special31();
	}
}
GameBoyAdvanceWindowCompositor.prototype.renderScanLineWithEffects = function (xStart, xEnd, layers) {
	xStart = xStart | 0;
	xEnd = xEnd | 0;
	layers = layers | 0;
	switch (layers | 0) {
		case 0:
			this.special0(xStart | 0, xEnd | 0);
			break;
		case 1:
			this.special1(xStart | 0, xEnd | 0);
			break;
		case 2:
			this.special2(xStart | 0, xEnd | 0);
			break;
		case 3:
			this.special3(xStart | 0, xEnd | 0);
			break;
		case 4:
			this.special4(xStart | 0, xEnd | 0);
			break;
		case 5:
			this.special5(xStart | 0, xEnd | 0);
			break;
		case 6:
			this.special6(xStart | 0, xEnd | 0);
			break;
		case 7:
			this.special7(xStart | 0, xEnd | 0);
			break;
		case 8:
			this.special8(xStart | 0, xEnd | 0);
			break;
		case 9:
			this.special9(xStart | 0, xEnd | 0);
			break;
		case 10:
			this.special10(xStart | 0, xEnd | 0);
			break;
		case 11:
			this.special11(xStart | 0, xEnd | 0);
			break;
		case 12:
			this.special12(xStart | 0, xEnd | 0);
			break;
		case 13:
			this.special13(xStart | 0, xEnd | 0);
			break;
		case 14:
			this.special14(xStart | 0, xEnd | 0);
			break;
		case 15:
			this.special15(xStart | 0, xEnd | 0);
			break;
		case 16:
			this.special16(xStart | 0, xEnd | 0);
			break;
		case 17:
			this.special17(xStart | 0, xEnd | 0);
			break;
		case 18:
			this.special18(xStart | 0, xEnd | 0);
			break;
		case 19:
			this.special19(xStart | 0, xEnd | 0);
			break;
		case 20:
			this.special20(xStart | 0, xEnd | 0);
			break;
		case 21:
			this.special21(xStart | 0, xEnd | 0);
			break;
		case 22:
			this.special22(xStart | 0, xEnd | 0);
			break;
		case 23:
			this.special23(xStart | 0, xEnd | 0);
			break;
		case 24:
			this.special24(xStart | 0, xEnd | 0);
			break;
		case 25:
			this.special25(xStart | 0, xEnd | 0);
			break;
		case 26:
			this.special26(xStart | 0, xEnd | 0);
			break;
		case 27:
			this.special27(xStart | 0, xEnd | 0);
			break;
		case 28:
			this.special28(xStart | 0, xEnd | 0);
			break;
		case 29:
			this.special29(xStart | 0, xEnd | 0);
			break;
		case 30:
			this.special30(xStart | 0, xEnd | 0);
			break;
		default:
			this.special31(xStart | 0, xEnd | 0);
	}
}

function generateCompositor() {
	function generateLocalScopeInit(count) {
		var code = "";
		switch (count | 0) {
			case 0:
				break;
			default:
				code = "var workingPixel = 0;";
			case 1:
				code += "var currentPixel = 0;";
				code += "var lowerPixel = 0;";
		}
		return code;
	}

	function generateLoopHead(compositeType, count, bodyCode) {
		var code = generateLocalScopeInit(count);
		switch (compositeType) {
			case 0:
				code += "for (var xStart = 0; (xStart | 0) < 240; xStart = ((xStart | 0) + 1) | 0) {" + bodyCode + "}";
				break;
			case 1:
				code = "xStart = xStart | 0; xEnd = xEnd | 0;" + code;
				code += "while ((xStart | 0) < (xEnd | 0)) {" + bodyCode + "xStart = ((xStart | 0) + 1) | 0;}";
				break;
			case 2:
				code += "for (var xStart = 0; (xStart | 0) < 240; xStart = ((xStart | 0) + 1) | 0) {" +
					"if ((this.OBJWindowBuffer[xStart | 0] | 0) < 0x3800000) {" +
					bodyCode +
					"}" +
					"}";
		}
		return code;
	}

	function generateLayerCompare(layerOffset) {
		var code = "workingPixel = this.buffer[xStart | " + layerOffset + "] | 0;" +
			"if ((workingPixel & 0x3800000) <= (currentPixel & 0x1800000)) {" +
			"lowerPixel = currentPixel | 0;" +
			"currentPixel = workingPixel | 0;" +
			"}" +
			"else if ((workingPixel & 0x3800000) <= (lowerPixel & 0x1800000)) {" +
			"lowerPixel = workingPixel | 0;" +
			"}";
		return code;
	}

	function generateLayerCompareSingle(layerOffset) {
		var code = "currentPixel = this.buffer[xStart | " + layerOffset + "] | 0;";
		code += "if ((currentPixel & 0x2000000) != 0) {";
		code += "currentPixel = lowerPixel | 0;";
		code += "}";
		return code;
	}

	function generateColorEffects(doEffects, layerCount) {
		if (layerCount > 0) {
			var code = "if ((currentPixel & 0x400000) == 0) {";
			if (doEffects) {
				code += "this.buffer[xStart | 0] = this.colorEffectsRenderer.process(lowerPixel | 0, currentPixel | 0) | 0;";
			} else {
				code += "this.buffer[xStart | 0] = currentPixel | 0;";
			}
			code += "}"
			code += "else {"
			code += "this.buffer[xStart | 0] = this.colorEffectsRenderer.processOAMSemiTransparent(lowerPixel | 0, currentPixel | 0) | 0;"
			code += "}";
			return code;
		} else {
			if (doEffects) {
				return "this.buffer[xStart | 0] = this.colorEffectsRenderer.process(0, this.gfx.backdrop | 0) | 0;";
			} else {
				return "this.buffer[xStart | 0] = this.gfx.backdrop | 0;"
			}
		}
	}

	function generateLoopBody(compositeType, doEffects, layers) {
		var code = "";
		var count = 0;
		if ((layers & 0x1F) == 0x8) {
			count++;
			code += generateLayerCompareSingle(0x400);
		} else if ((layers & 0x8) != 0) {
			count++;
			code += generateLayerCompare(0x400);
		}
		if ((layers & 0x1F) == 0x4) {
			count++;
			code += generateLayerCompareSingle(0x300);
		} else if ((layers & 0x4) != 0) {
			count++;
			code += generateLayerCompare(0x300);
		}
		if ((layers & 0x1F) == 0x2) {
			count++;
			code += generateLayerCompareSingle(0x200);
		} else if ((layers & 0x2) != 0) {
			count++;
			code += generateLayerCompare(0x200);
		}
		if ((layers & 0x1F) == 0x1) {
			count++;
			code += generateLayerCompareSingle(0x100);
		} else if ((layers & 0x1) != 0) {
			count++;
			code += generateLayerCompare(0x100);
		}
		if ((layers & 0x1F) == 0x10) {
			count++;
			code += generateLayerCompareSingle(0x500);
		} else if ((layers & 0x10) != 0) {
			count++;
			code += generateLayerCompare(0x500);
		}
		switch (count) {
			case 0:
				break;
			case 1:
				code = "lowerPixel = this.gfx.backdrop | 0;" + code;
				break;
			default:
				code = "lowerPixel = this.gfx.backdrop | 0; currentPixel = lowerPixel | 0;" + code;
		}
		code += generateColorEffects(doEffects, count);
		return generateLoopHead(compositeType, count, code);
	}

	function generateBlock(compositeType, doEffects) {
		var effectsPrefix = (doEffects) ? "special" : "normal";
		for (var layers = 0; layers < 0x20; layers++) {
			var code = generateLoopBody(compositeType, doEffects, layers);
			switch (compositeType) {
				case 0:
					GameBoyAdvanceCompositor.prototype[effectsPrefix + layers] = Function(code);
					break;
				case 1:
					GameBoyAdvanceWindowCompositor.prototype[effectsPrefix + layers] = Function("xStart", "xEnd", code);
					break;
				default:
					GameBoyAdvanceOBJWindowCompositor.prototype[effectsPrefix + layers] = Function(code);
			}
		}
	}

	function generateAll() {
		for (var compositeType = 0; compositeType < 3; compositeType++) {
			generateBlock(compositeType, false);
			generateBlock(compositeType, true);
		}
	}
	generateAll();
}
generateCompositor();





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceDMA0(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceDMA0.prototype.DMA_ENABLE_TYPE = [ //DMA Channel 0 Mapping:
	0x1,
	0x2,
	0x4,
	0x40
];
GameBoyAdvanceDMA0.prototype.initialize = function () {
	this.enabled = 0;
	this.pending = 0;
	this.source = 0;
	this.sourceShadow = 0;
	this.destination = 0;
	this.destinationShadow = 0;
	this.wordCount = 0;
	this.wordCountShadow = 0;
	this.irqFlagging = 0;
	this.dmaType = 0;
	this.is32Bit = 0;
	this.repeat = 0;
	this.sourceControl = 0;
	this.destinationControl = 0;
	this.DMACore = this.IOCore.dma;
	this.memory = this.IOCore.memory;
	this.gfxState = this.IOCore.gfxState;
	this.irq = this.IOCore.irq;
}
GameBoyAdvanceDMA0.prototype.writeDMASource8_0 = function (data) {
	data = data | 0;
	this.source = this.source & 0x7FFFF00;
	data = data & 0xFF;
	this.source = this.source | data;
}
GameBoyAdvanceDMA0.prototype.writeDMASource8_1 = function (data) {
	data = data | 0;
	this.source = this.source & 0x7FF00FF;
	data = data & 0xFF;
	this.source = this.source | (data << 8);
}
GameBoyAdvanceDMA0.prototype.writeDMASource8_2 = function (data) {
	data = data | 0;
	this.source = this.source & 0x700FFFF;
	data = data & 0xFF;
	this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA0.prototype.writeDMASource8_3 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFFFF;
	data = data & 0x7;
	this.source = this.source | (data << 24);
}
GameBoyAdvanceDMA0.prototype.writeDMASource16_0 = function (data) {
	data = data | 0;
	this.source = this.source & 0x7FF0000;
	data = data & 0xFFFF;
	this.source = this.source | data;
}
GameBoyAdvanceDMA0.prototype.writeDMASource16_1 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFF;
	data = data & 0x7FF;
	this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA0.prototype.writeDMASource32 = function (data) {
	data = data | 0;
	this.source = data & 0x7FFFFFF;
}
GameBoyAdvanceDMA0.prototype.writeDMADestination8_0 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FFFF00;
	data = data & 0xFF;
	this.destination = this.destination | data;
}
GameBoyAdvanceDMA0.prototype.writeDMADestination8_1 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FF00FF;
	data = data & 0xFF;
	this.destination = this.destination | (data << 8);
}
GameBoyAdvanceDMA0.prototype.writeDMADestination8_2 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x700FFFF;
	data = data & 0xFF;
	this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA0.prototype.writeDMADestination8_3 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFFFF;
	data = data & 0x7;
	this.destination = this.destination | (data << 24);
}
GameBoyAdvanceDMA0.prototype.writeDMADestination16_0 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FF0000;
	data = data & 0xFFFF;
	this.destination = this.destination | data;
}
GameBoyAdvanceDMA0.prototype.writeDMADestination16_1 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFF;
	data = data & 0x7FF;
	this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA0.prototype.writeDMADestination32 = function (data) {
	data = data | 0;
	this.destination = data & 0x7FFFFFF;
}
GameBoyAdvanceDMA0.prototype.writeDMAWordCount8_0 = function (data) {
	data = data | 0;
	this.wordCount = this.wordCount & 0x3F00;
	data = data & 0xFF;
	this.wordCount = this.wordCount | data;
}
GameBoyAdvanceDMA0.prototype.writeDMAWordCount8_1 = function (data) {
	data = data | 0;
	this.wordCount = this.wordCount & 0xFF;
	data = data & 0x3F;
	this.wordCount = this.wordCount | (data << 8);
}
GameBoyAdvanceDMA0.prototype.writeDMAWordCount16 = function (data) {
	data = data | 0;
	this.wordCount = data & 0x3FFF;
}
GameBoyAdvanceDMA0.prototype.writeDMAControl8_0 = function (data) {
	data = data | 0;
	this.destinationControl = (data >> 5) & 0x3;
	this.sourceControl = this.sourceControl & 0x2;
	this.sourceControl = this.sourceControl | ((data >> 7) & 0x1);
}
GameBoyAdvanceDMA0.prototype.writeDMAControl8_1 = function (data) {
	data = data | 0;
	//Spill state machine clocks:
	this.IOCore.updateCoreClocking();
	this.sourceControl = (this.sourceControl & 0x1) | ((data & 0x1) << 1);
	this.repeat = data & 0x2;
	this.is32Bit = data & 0x4;
	this.dmaType = (data >> 4) & 0x3;
	this.irqFlagging = data & 0x40;
	this.enableDMAChannel(data & 0x80);
	//Calculate next event:
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceDMA0.prototype.writeDMAControl16 = function (data) {
	data = data | 0;
	//Spill state machine clocks:
	this.IOCore.updateCoreClocking();
	this.destinationControl = (data >> 5) & 0x3;
	this.sourceControl = (data >> 7) & 0x3;
	this.repeat = (data >> 8) & 0x2;
	this.is32Bit = (data >> 8) & 0x4;
	this.dmaType = (data >> 12) & 0x3;
	this.irqFlagging = (data >> 8) & 0x40;
	this.enableDMAChannel(data & 0x8000);
	//Calculate next event:
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceDMA0.prototype.writeDMAControl32 = function (data) {
	data = data | 0;
	this.writeDMAWordCount16(data | 0);
	this.writeDMAControl16(data >> 16);
}
GameBoyAdvanceDMA0.prototype.readDMAControl8_0 = function () {
	var data = this.destinationControl << 5;
	data = data | ((this.sourceControl & 0x1) << 7);
	return data | 0;
}
GameBoyAdvanceDMA0.prototype.readDMAControl8_1 = function () {
	var data = this.sourceControl >> 1;
	data = data | this.repeat;
	data = data | this.is32Bit;
	data = data | (this.dmaType << 4);
	data = data | this.irqFlagging;
	if ((this.enabled | 0) != 0) {
		data = data | 0x80;
	}
	return data | 0;
}
GameBoyAdvanceDMA0.prototype.readDMAControl16 = function () {
	var data = this.destinationControl << 5;
	data = data | (this.sourceControl << 7);
	data = data | (this.repeat << 8);
	data = data | (this.is32Bit << 8);
	data = data | (this.dmaType << 12);
	data = data | (this.irqFlagging << 8);
	if ((this.enabled | 0) != 0) {
		data = data | 0x8000;
	}
	return data | 0;
}
GameBoyAdvanceDMA0.prototype.getMatchStatus = function () {
	return this.enabled & this.pending;
}
GameBoyAdvanceDMA0.prototype.requestDMA = function (DMAType) {
	DMAType = DMAType | 0;
	if ((this.enabled & DMAType) != 0) {
		this.pending = DMAType | 0;
		this.DMACore.update();
	}
}
GameBoyAdvanceDMA0.prototype.enableDMAChannel = function (enabled) {
	enabled = enabled | 0;
	if ((enabled | 0) != 0) {
		//If DMA was previously disabled, reload control registers:
		if ((this.enabled | 0) == 0) {
			//Flag immediate DMA transfers for processing now:
			this.pending = 0x1;
			//Shadow copy the word count:
			this.wordCountShadow = this.wordCount | 0;
			//Shadow copy the source address:
			this.sourceShadow = this.source | 0;
			//Shadow copy the destination address:
			this.destinationShadow = this.destination | 0;
		}
		//DMA type changed:
		this.enabled = this.DMA_ENABLE_TYPE[this.dmaType | 0] | 0;
		this.pending = this.pending & this.enabled;
	} else {
		//DMA Disabled:
		this.enabled = 0;
	}
	//Run some DMA channel activity checks:
	this.DMACore.update();
}
GameBoyAdvanceDMA0.prototype.handleDMACopy = function () {
	//Get the addesses:
	var source = this.sourceShadow | 0;
	var destination = this.destinationShadow | 0;
	//Transfer Data:
	if ((this.is32Bit | 0) == 4) {
		//32-bit Transfer:
		this.copy32(source | 0, destination | 0);
	} else {
		//16-bit Transfer:
		this.copy16(source | 0, destination | 0);
	}
}
GameBoyAdvanceDMA0.prototype.copy16 = function (source, destination) {
	source = source | 0;
	destination = destination | 0;
	var data = this.memory.memoryReadDMA16(source | 0) | 0;
	this.memory.memoryWriteDMA16(destination | 0, data | 0);
	this.decrementWordCount(source | 0, destination | 0, 2);
	this.DMACore.updateFetch(data | (data << 16));
}
GameBoyAdvanceDMA0.prototype.copy32 = function (source, destination) {
	source = source | 0;
	destination = destination | 0;
	var data = this.memory.memoryReadDMA32(source | 0) | 0;
	this.memory.memoryWriteDMA32(destination | 0, data | 0);
	this.decrementWordCount(source | 0, destination | 0, 4);
	this.DMACore.updateFetch(data | 0);
}
GameBoyAdvanceDMA0.prototype.decrementWordCount = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Decrement the word count:
	var wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0x3FFF;
	if ((wordCountShadow | 0) == 0) {
		//DMA transfer ended, handle accordingly:
		wordCountShadow = this.finalizeDMA(source | 0, destination | 0, transferred | 0) | 0;
	} else {
		//Update addresses:
		this.incrementDMAAddresses(source | 0, destination | 0, transferred | 0);
	}
	//Save the new word count:
	this.wordCountShadow = wordCountShadow | 0;
}
GameBoyAdvanceDMA0.prototype.finalizeDMA = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	var wordCountShadow = 0;
	//Reset pending requests:
	this.pending = 0;
	//Check Repeat Status:
	if ((this.repeat | 0) == 0 || (this.enabled | 0) == 0x1) {
		//Disable the enable bit:
		this.enabled = 0;
	} else {
		//Reload word count:
		wordCountShadow = this.wordCount | 0;
	}
	//Run the DMA channel checks:
	this.DMACore.update();
	//Check to see if we should flag for IRQ:
	this.checkIRQTrigger();
	//Update addresses:
	this.finalDMAAddresses(source | 0, destination | 0, transferred | 0);
	return wordCountShadow | 0;
}
GameBoyAdvanceDMA0.prototype.checkIRQTrigger = function () {
	if ((this.irqFlagging | 0) != 0) {
		this.irq.requestIRQ(0x100);
	}
}
GameBoyAdvanceDMA0.prototype.finalDMAAddresses = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
	}
	//Update destination address:
	switch (this.destinationControl | 0) {
		case 0: //Increment
			this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
			break;
		case 3: //Reload
			this.destinationShadow = this.destination | 0;
	}
}
GameBoyAdvanceDMA0.prototype.incrementDMAAddresses = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
			break;
		case 1:
			this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
	}
	//Update destination address:
	switch (this.destinationControl | 0) {
		case 0: //Increment
		case 3: //Increment
			this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
	}
}
GameBoyAdvanceDMA0.prototype.nextEventTime = function () {
	var clocks = 0x7FFFFFFF;
	switch (this.enabled | 0) {
		//V_BLANK
		case 0x2:
			clocks = this.gfxState.nextVBlankEventTime() | 0;
			break;
			//H_BLANK:
		case 0x4:
			clocks = this.gfxState.nextHBlankDMAEventTime() | 0;
	}
	return clocks | 0;
}




"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceDMA1(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceDMA1.prototype.DMA_ENABLE_TYPE = [ //DMA Channel 1 Mapping:
	0x1,
	0x2,
	0x4,
	0x8
];
GameBoyAdvanceDMA1.prototype.initialize = function () {
	this.enabled = 0;
	this.pending = 0;
	this.source = 0;
	this.sourceShadow = 0;
	this.destination = 0;
	this.destinationShadow = 0;
	this.wordCount = 0;
	this.wordCountShadow = 0;
	this.irqFlagging = 0;
	this.dmaType = 0;
	this.is32Bit = 0;
	this.repeat = 0;
	this.sourceControl = 0;
	this.destinationControl = 0;
	this.DMACore = this.IOCore.dma;
	this.memory = this.IOCore.memory;
	this.gfxState = this.IOCore.gfxState;
	this.irq = this.IOCore.irq;
	this.sound = this.IOCore.sound;
	this.wait = this.IOCore.wait;
}
GameBoyAdvanceDMA1.prototype.writeDMASource8_0 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFFF00;
	data = data & 0xFF;
	this.source = this.source | data;
}
GameBoyAdvanceDMA1.prototype.writeDMASource8_1 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFF00FF;
	data = data & 0xFF;
	this.source = this.source | (data << 8);
}
GameBoyAdvanceDMA1.prototype.writeDMASource8_2 = function (data) {
	data = data | 0;
	this.source = this.source & 0xF00FFFF;
	data = data & 0xFF;
	this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA1.prototype.writeDMASource8_3 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFFFF;
	data = data & 0xF;
	this.source = this.source | (data << 24);
}
GameBoyAdvanceDMA1.prototype.writeDMASource16_0 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFF0000;
	data = data & 0xFFFF;
	this.source = this.source | data;
}
GameBoyAdvanceDMA1.prototype.writeDMASource16_1 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFF;
	data = data & 0xFFF;
	this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA1.prototype.writeDMASource32 = function (data) {
	data = data | 0;
	this.source = data & 0xFFFFFFF;
}
GameBoyAdvanceDMA1.prototype.writeDMADestination8_0 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FFFF00;
	data = data & 0xFF;
	this.destination = this.destination | data;
}
GameBoyAdvanceDMA1.prototype.writeDMADestination8_1 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FF00FF;
	data = data & 0xFF;
	this.destination = this.destination | (data << 8);
}
GameBoyAdvanceDMA1.prototype.writeDMADestination8_2 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x700FFFF;
	data = data & 0xFF;
	this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA1.prototype.writeDMADestination8_3 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFFFF;
	data = data & 0x7;
	this.destination = this.destination | (data << 24);
}
GameBoyAdvanceDMA1.prototype.writeDMADestination16_0 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FF0000;
	data = data & 0xFFFF;
	this.destination = this.destination | data;
}
GameBoyAdvanceDMA1.prototype.writeDMADestination16_1 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFF;
	data = data & 0x7FF;
	this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA1.prototype.writeDMADestination32 = function (data) {
	data = data | 0;
	this.destination = data & 0x7FFFFFF;
}
GameBoyAdvanceDMA1.prototype.writeDMAWordCount8_0 = function (data) {
	data = data | 0;
	this.wordCount = this.wordCount & 0x3F00;
	data = data & 0xFF;
	this.wordCount = this.wordCount | data;
}
GameBoyAdvanceDMA1.prototype.writeDMAWordCount8_1 = function (data) {
	data = data | 0;
	this.wordCount = this.wordCount & 0xFF;
	data = data & 0x3F;
	this.wordCount = this.wordCount | (data << 8);
}
GameBoyAdvanceDMA1.prototype.writeDMAWordCount16 = function (data) {
	data = data | 0;
	this.wordCount = data & 0x3FFF;
}
GameBoyAdvanceDMA1.prototype.writeDMAControl8_0 = function (data) {
	data = data | 0;
	this.destinationControl = (data >> 5) & 0x3;
	this.sourceControl = this.sourceControl & 0x2;
	this.sourceControl = this.sourceControl | ((data >> 7) & 0x1);
}
GameBoyAdvanceDMA1.prototype.writeDMAControl8_1 = function (data) {
	data = data | 0;
	//Spill state machine clocks:
	this.IOCore.updateCoreClocking();
	this.sourceControl = (this.sourceControl & 0x1) | ((data & 0x1) << 1);
	this.repeat = data & 0x2;
	this.is32Bit = data & 0x4;
	this.dmaType = (data >> 4) & 0x3;
	this.irqFlagging = data & 0x40;
	this.enableDMAChannel(data & 0x80);
	//Calculate next event:
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceDMA1.prototype.writeDMAControl16 = function (data) {
	data = data | 0;
	//Spill state machine clocks:
	this.IOCore.updateCoreClocking();
	this.destinationControl = (data >> 5) & 0x3;
	this.sourceControl = (data >> 7) & 0x3;
	this.repeat = (data >> 8) & 0x2;
	this.is32Bit = (data >> 8) & 0x4;
	this.dmaType = (data >> 12) & 0x3;
	this.irqFlagging = (data >> 8) & 0x40;
	this.enableDMAChannel(data & 0x8000);
	//Calculate next event:
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceDMA1.prototype.writeDMAControl32 = function (data) {
	data = data | 0;
	this.writeDMAWordCount16(data | 0);
	this.writeDMAControl16(data >> 16);
}
GameBoyAdvanceDMA1.prototype.readDMAControl8_0 = function () {
	var data = this.destinationControl << 5;
	data = data | ((this.sourceControl & 0x1) << 7);
	return data | 0;
}
GameBoyAdvanceDMA1.prototype.readDMAControl8_1 = function () {
	var data = this.sourceControl >> 1;
	data = data | this.repeat;
	data = data | this.is32Bit;
	data = data | (this.dmaType << 4);
	data = data | this.irqFlagging;
	if ((this.enabled | 0) != 0) {
		data = data | 0x80;
	}
	return data | 0;
}
GameBoyAdvanceDMA1.prototype.readDMAControl16 = function () {
	var data = this.destinationControl << 5;
	data = data | (this.sourceControl << 7);
	data = data | (this.repeat << 8);
	data = data | (this.is32Bit << 8);
	data = data | (this.dmaType << 12);
	data = data | (this.irqFlagging << 8);
	if ((this.enabled | 0) != 0) {
		data = data | 0x8000;
	}
	return data | 0;
}
GameBoyAdvanceDMA1.prototype.getMatchStatus = function () {
	return this.enabled & this.pending;
}
GameBoyAdvanceDMA1.prototype.soundFIFOARequest = function () {
	this.requestDMA(0x8);
}
GameBoyAdvanceDMA1.prototype.requestDMA = function (DMAType) {
	DMAType = DMAType | 0;
	if ((this.enabled & DMAType) != 0) {
		this.pending = DMAType | 0;
		this.DMACore.update();
	}
}
GameBoyAdvanceDMA1.prototype.enableDMAChannel = function (enabled) {
	enabled = enabled | 0;
	if ((enabled | 0) != 0) {
		//If DMA was previously disabled, reload control registers:
		if ((this.enabled | 0) == 0) {
			switch (this.dmaType | 0) {
				case 0x3:
					//Direct Sound DMA Hardwired To Wordcount Of 4:
					this.wordCountShadow = 0x4;
					break;
				case 0:
					//Flag immediate DMA transfers for processing now:
					this.pending = 0x1;
				default:
					//Shadow copy the word count:
					this.wordCountShadow = this.wordCount | 0;

			}
			//Shadow copy the source address:
			this.sourceShadow = this.source | 0;
			//Shadow copy the destination address:
			this.destinationShadow = this.destination | 0;
		}
		//DMA type changed:
		this.enabled = this.DMA_ENABLE_TYPE[this.dmaType | 0] | 0;
		this.pending = this.pending & this.enabled;
		//Assert the FIFO A DMA request signal:
		this.sound.checkFIFOAPendingSignal();
	} else {
		//DMA Disabled:
		this.enabled = 0;
	}
	//Run some DMA channel activity checks:
	this.DMACore.update();
}
GameBoyAdvanceDMA1.prototype.handleDMACopy = function () {
	//Get the source addess:
	var source = this.sourceShadow | 0;
	//Transfer Data:
	if ((this.enabled | 0) == 0x8) {
		//32-bit Transfer:
		this.copySound(source | 0);
	} else {
		//Get the destination address:
		var destination = this.destinationShadow | 0;
		if ((this.is32Bit | 0) == 4) {
			//32-bit Transfer:
			this.copy32(source | 0, destination | 0);
		} else {
			//16-bit Transfer:
			this.copy16(source | 0, destination | 0);
		}
	}
}
GameBoyAdvanceDMA1.prototype.copy16 = function (source, destination) {
	source = source | 0;
	destination = destination | 0;
	var data = this.memory.memoryReadDMAFull16(source | 0) | 0;
	this.memory.memoryWriteDMA16(destination | 0, data | 0);
	this.decrementWordCount(source | 0, destination | 0, 2);
	this.DMACore.updateFetch(data | (data << 16));
}
GameBoyAdvanceDMA1.prototype.copy32 = function (source, destination) {
	source = source | 0;
	destination = destination | 0;
	var data = this.memory.memoryReadDMAFull32(source | 0) | 0;
	this.memory.memoryWriteDMA32(destination | 0, data | 0);
	this.decrementWordCount(source | 0, destination | 0, 4);
	this.DMACore.updateFetch(data | 0);
}
GameBoyAdvanceDMA1.prototype.copySound = function (source) {
	source = source | 0;
	var data = this.memory.memoryReadDMAFull32(source | 0) | 0;
	this.wait.singleClock();
	this.IOCore.updateTimerClocking();
	this.sound.writeFIFOA32(data | 0);
	this.soundDMAUpdate(source | 0);
	this.DMACore.updateFetch(data | 0);
}
GameBoyAdvanceDMA1.prototype.decrementWordCount = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Decrement the word count:
	var wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0x3FFF;
	if ((wordCountShadow | 0) == 0) {
		//DMA transfer ended, handle accordingly:
		wordCountShadow = this.finalizeDMA(source | 0, destination | 0, transferred | 0) | 0;
	} else {
		//Update addresses:
		this.incrementDMAAddresses(source | 0, destination | 0, transferred | 0);
	}
	//Save the new word count:
	this.wordCountShadow = wordCountShadow | 0;
}
GameBoyAdvanceDMA1.prototype.soundDMAUpdate = function (source) {
	source = source | 0;
	//Decrement the word count:
	this.wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0x3FFF;
	if ((this.wordCountShadow | 0) == 0) {
		//DMA transfer ended, handle accordingly:
		//Reset pending requests:
		this.pending = 0;
		//Check Repeat Status:
		if ((this.repeat | 0) == 0) {
			//Disable the enable bit:
			this.enabled = 0;
		} else {
			//Repeating the dma:
			//Direct Sound DMA Hardwired To Wordcount Of 4:
			this.wordCountShadow = 0x4;
		}
		//Assert the FIFO A DMA request signal:
		this.sound.checkFIFOAPendingSignal();
		//Run the DMA channel checks:
		this.DMACore.update();
		//Check to see if we should flag for IRQ:
		this.checkIRQTrigger();
	}
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + 4) | 0;
			break;
		case 1:
			this.sourceShadow = ((source | 0) - 4) | 0;
	}
}
GameBoyAdvanceDMA1.prototype.finalizeDMA = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	var wordCountShadow = 0;
	//Reset pending requests:
	this.pending = 0;
	//Check Repeat Status:
	if ((this.repeat | 0) == 0 || (this.enabled | 0) == 0x1) {
		//Disable the enable bit:
		this.enabled = 0;
	} else {
		//Repeating the dma:
		//Reload word count:
		wordCountShadow = this.wordCount | 0;
	}
	//Assert the FIFO A DMA request signal:
	this.sound.checkFIFOAPendingSignal();
	//Run the DMA channel checks:
	this.DMACore.update();
	//Check to see if we should flag for IRQ:
	this.checkIRQTrigger();
	//Update addresses:
	this.finalDMAAddresses(source | 0, destination | 0, transferred | 0);
	return wordCountShadow | 0;
}
GameBoyAdvanceDMA1.prototype.checkIRQTrigger = function () {
	if ((this.irqFlagging | 0) != 0) {
		this.irq.requestIRQ(0x200);
	}
}
GameBoyAdvanceDMA1.prototype.finalDMAAddresses = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
	}
	//Update destination address:
	switch (this.destinationControl | 0) {
		case 0: //Increment
			this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
			break;
		case 3: //Reload
			this.destinationShadow = this.destination | 0;
	}
}
GameBoyAdvanceDMA1.prototype.incrementDMAAddresses = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
			break;
		case 1:
			this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
	}
	//Update destination address:
	switch (this.destinationControl | 0) {
		case 0: //Increment
		case 3: //Increment
			this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
	}
}
GameBoyAdvanceDMA1.prototype.nextEventTime = function () {
	var clocks = 0x7FFFFFFF;
	switch (this.enabled | 0) {
		//V_BLANK
		case 0x2:
			clocks = this.gfxState.nextVBlankEventTime() | 0;
			break;
			//H_BLANK:
		case 0x4:
			clocks = this.gfxState.nextHBlankDMAEventTime() | 0;
			break;
			//FIFO_A:
		case 0x8:
			clocks = this.sound.nextFIFOAEventTime() | 0;
	}
	return clocks | 0;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceDMA2(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceDMA2.prototype.DMA_ENABLE_TYPE = [ //DMA Channel 2 Mapping:
	0x1,
	0x2,
	0x4,
	0x10
];
GameBoyAdvanceDMA2.prototype.initialize = function () {
	this.enabled = 0;
	this.pending = 0;
	this.source = 0;
	this.sourceShadow = 0;
	this.destination = 0;
	this.destinationShadow = 0;
	this.wordCount = 0;
	this.wordCountShadow = 0;
	this.irqFlagging = 0;
	this.dmaType = 0;
	this.is32Bit = 0;
	this.repeat = 0;
	this.sourceControl = 0;
	this.destinationControl = 0;
	this.DMACore = this.IOCore.dma;
	this.memory = this.IOCore.memory;
	this.gfxState = this.IOCore.gfxState;
	this.irq = this.IOCore.irq;
	this.sound = this.IOCore.sound;
	this.wait = this.IOCore.wait;
}
GameBoyAdvanceDMA2.prototype.writeDMASource8_0 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFFF00;
	data = data & 0xFF;
	this.source = this.source | data;
}
GameBoyAdvanceDMA2.prototype.writeDMASource8_1 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFF00FF;
	data = data & 0xFF;
	this.source = this.source | (data << 8);
}
GameBoyAdvanceDMA2.prototype.writeDMASource8_2 = function (data) {
	data = data | 0;
	this.source = this.source & 0xF00FFFF;
	data = data & 0xFF;
	this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA2.prototype.writeDMASource8_3 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFFFF;
	data = data & 0xF;
	this.source = this.source | (data << 24);
}
GameBoyAdvanceDMA2.prototype.writeDMASource16_0 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFF0000;
	data = data & 0xFFFF;
	this.source = this.source | data;
}
GameBoyAdvanceDMA2.prototype.writeDMASource16_1 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFF;
	data = data & 0xFFF;
	this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA2.prototype.writeDMASource32 = function (data) {
	data = data | 0;
	this.source = data & 0xFFFFFFF;
}
GameBoyAdvanceDMA2.prototype.writeDMADestination8_0 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FFFF00;
	data = data & 0xFF;
	this.destination = this.destination | data;
}
GameBoyAdvanceDMA2.prototype.writeDMADestination8_1 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FF00FF;
	data = data & 0xFF;
	this.destination = this.destination | (data << 8);
}
GameBoyAdvanceDMA2.prototype.writeDMADestination8_2 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x700FFFF;
	data = data & 0xFF;
	this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA2.prototype.writeDMADestination8_3 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFFFF;
	data = data & 0x7;
	this.destination = this.destination | (data << 24);
}
GameBoyAdvanceDMA2.prototype.writeDMADestination16_0 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0x7FF0000;
	data = data & 0xFFFF;
	this.destination = this.destination | data;
}
GameBoyAdvanceDMA2.prototype.writeDMADestination16_1 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFF;
	data = data & 0x7FF;
	this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA2.prototype.writeDMADestination32 = function (data) {
	data = data | 0;
	this.destination = data & 0x7FFFFFF;
}
GameBoyAdvanceDMA2.prototype.writeDMAWordCount8_0 = function (data) {
	data = data | 0;
	this.wordCount = this.wordCount & 0x3F00;
	data = data & 0xFF;
	this.wordCount = this.wordCount | data;
}
GameBoyAdvanceDMA2.prototype.writeDMAWordCount8_1 = function (data) {
	data = data | 0;
	this.wordCount = this.wordCount & 0xFF;
	data = data & 0x3F;
	this.wordCount = this.wordCount | (data << 8);
}
GameBoyAdvanceDMA2.prototype.writeDMAWordCount16 = function (data) {
	data = data | 0;
	this.wordCount = data & 0x3FFF;
}
GameBoyAdvanceDMA2.prototype.writeDMAControl8_0 = function (data) {
	data = data | 0;
	this.destinationControl = (data >> 5) & 0x3;
	this.sourceControl = this.sourceControl & 0x2;
	this.sourceControl = this.sourceControl | ((data >> 7) & 0x1);
}
GameBoyAdvanceDMA2.prototype.writeDMAControl8_1 = function (data) {
	data = data | 0;
	//Spill state machine clocks:
	this.IOCore.updateCoreClocking();
	this.sourceControl = (this.sourceControl & 0x1) | ((data & 0x1) << 1);
	this.repeat = data & 0x2;
	this.is32Bit = data & 0x4;
	this.dmaType = (data >> 4) & 0x3;
	this.irqFlagging = data & 0x40;
	this.enableDMAChannel(data & 0x80);
	//Calculate next event:
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceDMA2.prototype.writeDMAControl16 = function (data) {
	data = data | 0;
	//Spill state machine clocks:
	this.IOCore.updateCoreClocking();
	this.destinationControl = (data >> 5) & 0x3;
	this.sourceControl = (data >> 7) & 0x3;
	this.repeat = (data >> 8) & 0x2;
	this.is32Bit = (data >> 8) & 0x4;
	this.dmaType = (data >> 12) & 0x3;
	this.irqFlagging = (data >> 8) & 0x40;
	this.enableDMAChannel(data & 0x8000);
	//Calculate next event:
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceDMA2.prototype.writeDMAControl32 = function (data) {
	data = data | 0;
	this.writeDMAWordCount16(data | 0);
	this.writeDMAControl16(data >> 16);
}
GameBoyAdvanceDMA2.prototype.readDMAControl8_0 = function () {
	var data = this.destinationControl << 5;
	data = data | ((this.sourceControl & 0x1) << 7);
	return data | 0;
}
GameBoyAdvanceDMA2.prototype.readDMAControl8_1 = function () {
	var data = this.sourceControl >> 1;
	data = data | this.repeat;
	data = data | this.is32Bit;
	data = data | (this.dmaType << 4);
	data = data | this.irqFlagging;
	if ((this.enabled | 0) != 0) {
		data = data | 0x80;
	}
	return data | 0;
}
GameBoyAdvanceDMA2.prototype.readDMAControl16 = function () {
	var data = this.destinationControl << 5;
	data = data | (this.sourceControl << 7);
	data = data | (this.repeat << 8);
	data = data | (this.is32Bit << 8);
	data = data | (this.dmaType << 12);
	data = data | (this.irqFlagging << 8);
	if ((this.enabled | 0) != 0) {
		data = data | 0x8000;
	}
	return data | 0;
}
GameBoyAdvanceDMA2.prototype.getMatchStatus = function () {
	return this.enabled & this.pending;
}
GameBoyAdvanceDMA2.prototype.soundFIFOBRequest = function () {
	this.requestDMA(0x10);
}
GameBoyAdvanceDMA2.prototype.requestDMA = function (DMAType) {
	DMAType = DMAType | 0;
	if ((this.enabled & DMAType) != 0) {
		this.pending = DMAType | 0;
		this.DMACore.update();
	}
}
GameBoyAdvanceDMA2.prototype.enableDMAChannel = function (enabled) {
	enabled = enabled | 0;
	if ((enabled | 0) != 0) {
		//If DMA was previously disabled, reload control registers:
		if ((this.enabled | 0) == 0) {
			switch (this.dmaType | 0) {
				case 0x3:
					//Direct Sound DMA Hardwired To Wordcount Of 4:
					this.wordCountShadow = 0x4;
					break;
				case 0:
					//Flag immediate DMA transfers for processing now:
					this.pending = 0x1;
				default:
					//Shadow copy the word count:
					this.wordCountShadow = this.wordCount | 0;
			}
			//Shadow copy the source address:
			this.sourceShadow = this.source | 0;
			//Shadow copy the destination address:
			this.destinationShadow = this.destination | 0;
		}
		//DMA type changed:
		this.enabled = this.DMA_ENABLE_TYPE[this.dmaType | 0] | 0;
		//this.pending = this.pending & this.enabled;
		//Assert the FIFO A DMA request signal:
		this.sound.checkFIFOBPendingSignal();
	} else {
		//DMA Disabled:
		this.enabled = 0;
	}
	//Run some DMA channel activity checks:
	this.DMACore.update();
}
GameBoyAdvanceDMA2.prototype.handleDMACopy = function () {
	//Get the source addess:
	var source = this.sourceShadow | 0;
	//Transfer Data:
	if ((this.enabled | 0) == 0x10) {
		//32-bit Transfer:
		this.copySound(source | 0);
	} else {
		//Get the destination address:
		var destination = this.destinationShadow | 0;
		if ((this.is32Bit | 0) == 4) {
			//32-bit Transfer:
			this.copy32(source | 0, destination | 0);
		} else {
			//16-bit Transfer:
			this.copy16(source | 0, destination | 0);
		}
	}
}
GameBoyAdvanceDMA2.prototype.copy16 = function (source, destination) {
	source = source | 0;
	destination = destination | 0;
	var data = this.memory.memoryReadDMAFull16(source | 0) | 0;
	this.memory.memoryWriteDMA16(destination | 0, data | 0);
	this.decrementWordCount(source | 0, destination | 0, 2);
	this.DMACore.updateFetch(data | (data << 16));
}
GameBoyAdvanceDMA2.prototype.copy32 = function (source, destination) {
	source = source | 0;
	destination = destination | 0;
	var data = this.memory.memoryReadDMAFull32(source | 0) | 0;
	this.memory.memoryWriteDMA32(destination | 0, data | 0);
	this.decrementWordCount(source | 0, destination | 0, 4);
	this.DMACore.updateFetch(data | 0);
}
GameBoyAdvanceDMA2.prototype.copySound = function (source) {
	source = source | 0;
	var data = this.memory.memoryReadDMAFull32(source | 0) | 0;
	this.wait.singleClock();
	this.IOCore.updateTimerClocking();
	this.sound.writeFIFOB32(data | 0);
	this.soundDMAUpdate(source | 0);
	this.DMACore.updateFetch(data | 0);
}
GameBoyAdvanceDMA2.prototype.decrementWordCount = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Decrement the word count:
	var wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0x3FFF;
	if ((wordCountShadow | 0) == 0) {
		//DMA transfer ended, handle accordingly:
		wordCountShadow = this.finalizeDMA(source | 0, destination | 0, transferred | 0) | 0;
	} else {
		//Update addresses:
		this.incrementDMAAddresses(source | 0, destination | 0, transferred | 0);
	}
	//Save the new word count:
	this.wordCountShadow = wordCountShadow | 0;
}
GameBoyAdvanceDMA2.prototype.soundDMAUpdate = function (source) {
	source = source | 0;
	//Decrement the word count:
	this.wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0x3FFF;
	if ((this.wordCountShadow | 0) == 0) {
		//DMA transfer ended, handle accordingly:
		//Reset pending requests:
		this.pending = 0;
		//Check Repeat Status:
		if ((this.repeat | 0) == 0) {
			//Disable the enable bit:
			this.enabled = 0;
		} else {
			//Repeating the dma:
			//Direct Sound DMA Hardwired To Wordcount Of 4:
			this.wordCountShadow = 0x4;
		}
		//Assert the FIFO B DMA request signal:
		this.sound.checkFIFOBPendingSignal();
		//Run the DMA channel checks:
		this.DMACore.update();
		//Check to see if we should flag for IRQ:
		this.checkIRQTrigger();
	}
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + 4) | 0;
			break;
		case 1:
			this.sourceShadow = ((source | 0) - 4) | 0;
	}
}
GameBoyAdvanceDMA2.prototype.finalizeDMA = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	var wordCountShadow = 0;
	//Reset pending requests:
	this.pending = 0;
	//Check Repeat Status:
	if ((this.repeat | 0) == 0 || (this.enabled | 0) == 0x1) {
		//Disable the enable bit:
		this.enabled = 0;
	} else {
		//Repeating the dma:
		//Reload word count:
		wordCountShadow = this.wordCount | 0;
	}
	//Assert the FIFO B DMA request signal:
	this.sound.checkFIFOBPendingSignal();
	//Run the DMA channel checks:
	this.DMACore.update();
	//Check to see if we should flag for IRQ:
	this.checkIRQTrigger();
	//Update addresses:
	this.finalDMAAddresses(source | 0, destination | 0, transferred | 0);
	return wordCountShadow | 0;
}
GameBoyAdvanceDMA2.prototype.checkIRQTrigger = function () {
	if ((this.irqFlagging | 0) != 0) {
		this.irq.requestIRQ(0x400);
	}
}
GameBoyAdvanceDMA2.prototype.finalDMAAddresses = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
	}
	//Update destination address:
	switch (this.destinationControl | 0) {
		case 0: //Increment
			this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
			break;
		case 3: //Reload
			this.destinationShadow = this.destination | 0;
	}
}
GameBoyAdvanceDMA2.prototype.incrementDMAAddresses = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
			break;
		case 1:
			this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
	}
	//Update destination address:
	switch (this.destinationControl | 0) {
		case 0: //Increment
		case 3: //Increment
			this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
	}
}
GameBoyAdvanceDMA2.prototype.nextEventTime = function () {
	var clocks = 0x7FFFFFFF;
	switch (this.enabled | 0) {
		//V_BLANK
		case 0x2:
			clocks = this.gfxState.nextVBlankEventTime() | 0;
			break;
			//H_BLANK:
		case 0x4:
			clocks = this.gfxState.nextHBlankDMAEventTime() | 0;
			break;
			//FIFO_B:
		case 0x10:
			clocks = this.sound.nextFIFOBEventTime() | 0;
	}
	return clocks | 0;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceDMA3(IOCore) {
	this.IOCore = IOCore;
}
GameBoyAdvanceDMA3.prototype.DMA_ENABLE_TYPE = [ //DMA Channel 3 Mapping:
	0x1,
	0x2,
	0x4,
	0x20
];
GameBoyAdvanceDMA3.prototype.initialize = function () {
	this.enabled = 0;
	this.pending = 0;
	this.source = 0;
	this.sourceShadow = 0;
	this.destination = 0;
	this.destinationShadow = 0;
	this.wordCount = 0;
	this.wordCountShadow = 0;
	this.irqFlagging = 0;
	this.dmaType = 0;
	this.is32Bit = 0;
	this.repeat = 0;
	this.sourceControl = 0;
	this.destinationControl = 0;
	this.gamePakDMA = 0;
	this.displaySyncEnableDelay = 0;
	this.DMACore = this.IOCore.dma;
	this.memory = this.IOCore.memory;
	this.gfxState = this.IOCore.gfxState;
	this.irq = this.IOCore.irq;
}
GameBoyAdvanceDMA3.prototype.writeDMASource8_0 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFFF00;
	data = data & 0xFF;
	this.source = this.source | data;
}
GameBoyAdvanceDMA3.prototype.writeDMASource8_1 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFF00FF;
	data = data & 0xFF;
	this.source = this.source | (data << 8);
}
GameBoyAdvanceDMA3.prototype.writeDMASource8_2 = function (data) {
	data = data | 0;
	this.source = this.source & 0xF00FFFF;
	data = data & 0xFF;
	this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA3.prototype.writeDMASource8_3 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFFFF;
	data = data & 0xF;
	this.source = this.source | (data << 24);
}
GameBoyAdvanceDMA3.prototype.writeDMASource16_0 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFF0000;
	data = data & 0xFFFF;
	this.source = this.source | data;
}
GameBoyAdvanceDMA3.prototype.writeDMASource16_1 = function (data) {
	data = data | 0;
	this.source = this.source & 0xFFFF;
	data = data & 0xFFF;
	this.source = this.source | (data << 16);
}
GameBoyAdvanceDMA3.prototype.writeDMASource32 = function (data) {
	data = data | 0;
	this.source = data & 0xFFFFFFF;
}
GameBoyAdvanceDMA3.prototype.writeDMADestination8_0 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFFF00;
	data = data & 0xFF;
	this.destination = this.destination | data;
}
GameBoyAdvanceDMA3.prototype.writeDMADestination8_1 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFF00FF;
	data = data & 0xFF;
	this.destination = this.destination | (data << 8);
}
GameBoyAdvanceDMA3.prototype.writeDMADestination8_2 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xF00FFFF;
	data = data & 0xFF;
	this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA3.prototype.writeDMADestination8_3 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFFFF;
	data = data & 0xF;
	this.destination = this.destination | (data << 24);
}
GameBoyAdvanceDMA3.prototype.writeDMADestination16_0 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFF0000;
	data = data & 0xFFFF;
	this.destination = this.destination | data;
}
GameBoyAdvanceDMA3.prototype.writeDMADestination16_1 = function (data) {
	data = data | 0;
	this.destination = this.destination & 0xFFFF;
	data = data & 0xFFF;
	this.destination = this.destination | (data << 16);
}
GameBoyAdvanceDMA3.prototype.writeDMADestination32 = function (data) {
	data = data | 0;
	this.destination = data & 0xFFFFFFF;
}
GameBoyAdvanceDMA3.prototype.writeDMAWordCount8_0 = function (data) {
	data = data | 0;
	this.wordCount = this.wordCount & 0xFF00;
	data = data & 0xFF;
	this.wordCount = this.wordCount | data;
}
GameBoyAdvanceDMA3.prototype.writeDMAWordCount8_1 = function (data) {
	data = data | 0;
	this.wordCount = this.wordCount & 0xFF;
	data = data & 0xFF;
	this.wordCount = this.wordCount | (data << 8);
}
GameBoyAdvanceDMA3.prototype.writeDMAWordCount16 = function (data) {
	data = data | 0;
	this.wordCount = data & 0xFFFF;
}
GameBoyAdvanceDMA3.prototype.writeDMAControl8_0 = function (data) {
	data = data | 0;
	this.destinationControl = (data >> 5) & 0x3;
	this.sourceControl = this.sourceControl & 0x2;
	this.sourceControl = this.sourceControl | ((data >> 7) & 0x1);
}
GameBoyAdvanceDMA3.prototype.writeDMAControl8_1 = function (data) {
	data = data | 0;
	//Spill state machine clocks:
	this.IOCore.updateCoreClocking();
	this.sourceControl = (this.sourceControl & 0x1) | ((data & 0x1) << 1);
	this.repeat = data & 0x2;
	this.is32Bit = data & 0x4;
	this.gamePakDMA = data & 0x8;
	this.dmaType = (data >> 4) & 0x3;
	this.irqFlagging = data & 0x40;
	this.enableDMAChannel(data & 0x80);
	//Calculate next event:
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceDMA3.prototype.writeDMAControl16 = function (data) {
	data = data | 0;
	//Spill state machine clocks:
	this.IOCore.updateCoreClocking();
	this.destinationControl = (data >> 5) & 0x3;
	this.sourceControl = (data >> 7) & 0x3;
	this.repeat = (data >> 8) & 0x2;
	this.is32Bit = (data >> 8) & 0x4;
	this.gamePakDMA = (data >> 8) & 0x8;
	this.dmaType = (data >> 12) & 0x3;
	this.irqFlagging = (data >> 8) & 0x40;
	this.enableDMAChannel(data & 0x8000);
	//Calculate next event:
	this.IOCore.updateCoreEventTime();
}
GameBoyAdvanceDMA3.prototype.writeDMAControl32 = function (data) {
	data = data | 0;
	this.writeDMAWordCount16(data | 0);
	this.writeDMAControl16(data >> 16);
}
GameBoyAdvanceDMA3.prototype.readDMAControl8_0 = function () {
	var data = this.destinationControl << 5;
	data = data | ((this.sourceControl & 0x1) << 7);
	return data | 0;
}
GameBoyAdvanceDMA3.prototype.readDMAControl8_1 = function () {
	var data = this.sourceControl >> 1;
	data = data | this.repeat;
	data = data | this.is32Bit;
	data = data | this.gamePakDMA;
	data = data | (this.dmaType << 4);
	data = data | this.irqFlagging;
	if ((this.enabled | 0) != 0) {
		data = data | 0x80;
	}
	return data | 0;
}
GameBoyAdvanceDMA3.prototype.readDMAControl16 = function () {
	var data = this.destinationControl << 5;
	data = data | (this.sourceControl << 7);
	data = data | (this.repeat << 8);
	data = data | (this.is32Bit << 8);
	data = data | (this.gamePakDMA << 8);
	data = data | (this.dmaType << 12);
	data = data | (this.irqFlagging << 8);
	if ((this.enabled | 0) != 0) {
		data = data | 0x8000;
	}
	return data | 0;
}
GameBoyAdvanceDMA3.prototype.getMatchStatus = function () {
	return this.enabled & this.pending;
}
GameBoyAdvanceDMA3.prototype.gfxDisplaySyncRequest = function () {
	this.requestDMA(0x20 ^ this.displaySyncEnableDelay);
}
GameBoyAdvanceDMA3.prototype.gfxDisplaySyncEnableCheck = function () {
	//Reset the display sync & reassert DMA enable line:
	if ((this.enabled | 0) == 0x20) {
		if ((this.displaySyncEnableDelay | 0) == 0x20) {
			this.displaySyncEnableDelay = 0;
		} else {
			this.enabled = 0;
			this.DMACore.update();
		}
	}
}
GameBoyAdvanceDMA3.prototype.requestDMA = function (DMAType) {
	DMAType = DMAType | 0;
	if ((this.enabled & DMAType) != 0) {
		this.pending = DMAType | 0;
		this.DMACore.update();
	}
}
GameBoyAdvanceDMA3.prototype.enableDMAChannel = function (enabled) {
	enabled = enabled | 0;
	if ((enabled | 0) != 0) {
		//If DMA was previously disabled, reload control registers:
		if ((this.enabled | 0) == 0) {
			switch (this.dmaType | 0) {
				case 0:
					//Flag immediate DMA transfers for processing now:
					this.pending = 0x1;
					break;
				case 0x3:
					//Trigger display sync DMA shadow enable and auto-check on line 162:
					this.displaySyncEnableDelay = 0x20;
			}
			//Shadow copy the word count:
			this.wordCountShadow = this.wordCount | 0;
			//Shadow copy the source address:
			this.sourceShadow = this.source | 0;
			//Shadow copy the destination address:
			this.destinationShadow = this.destination | 0;
		}
		//DMA type changed:
		this.enabled = this.DMA_ENABLE_TYPE[this.dmaType | 0] | 0;
		this.pending = this.pending & this.enabled;
	} else {
		//DMA Disabled:
		this.enabled = 0;
	}
	//Run some DMA channel activity checks:
	this.DMACore.update();
}
GameBoyAdvanceDMA3.prototype.handleDMACopy = function () {
	//Get the addesses:
	var source = this.sourceShadow | 0;
	var destination = this.destinationShadow | 0;
	//Transfer Data:
	if ((this.is32Bit | 0) == 4) {
		//32-bit Transfer:
		this.copy32(source | 0, destination | 0);
	} else {
		//16-bit Transfer:
		this.copy16(source | 0, destination | 0);
	}
}
GameBoyAdvanceDMA3.prototype.copy16 = function (source, destination) {
	source = source | 0;
	destination = destination | 0;
	var data = this.memory.memoryReadDMAFull16(source | 0) | 0;
	this.memory.memoryWriteDMAFull16(destination | 0, data | 0);
	this.decrementWordCount(source | 0, destination | 0, 2);
	this.DMACore.updateFetch(data | (data << 16));
}
GameBoyAdvanceDMA3.prototype.copy32 = function (source, destination) {
	source = source | 0;
	destination = destination | 0;
	var data = this.memory.memoryReadDMAFull32(source | 0) | 0;
	this.memory.memoryWriteDMAFull32(destination | 0, data | 0);
	this.decrementWordCount(source | 0, destination | 0, 4);
	this.DMACore.updateFetch(data | 0);
}
GameBoyAdvanceDMA3.prototype.decrementWordCount = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Decrement the word count:
	var wordCountShadow = ((this.wordCountShadow | 0) - 1) & 0xFFFF;
	if ((wordCountShadow | 0) == 0) {
		//DMA transfer ended, handle accordingly:
		wordCountShadow = this.finalizeDMA(source | 0, destination | 0, transferred | 0) | 0;
	} else {
		//Update addresses:
		this.incrementDMAAddresses(source | 0, destination | 0, transferred | 0);
	}
	//Save the new word count:
	this.wordCountShadow = wordCountShadow | 0;
}
GameBoyAdvanceDMA3.prototype.finalizeDMA = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	var wordCountShadow = 0;
	//Reset pending requests:
	this.pending = 0;
	//Check Repeat Status:
	if ((this.repeat | 0) == 0 || (this.enabled | 0) == 0x1) {
		//Disable the enable bit:
		this.enabled = 0;
	} else {
		//Reload word count:
		wordCountShadow = this.wordCount | 0;
	}
	//Run the DMA channel checks:
	this.DMACore.update();
	//Check to see if we should flag for IRQ:
	this.checkIRQTrigger();
	//Update addresses:
	this.finalDMAAddresses(source | 0, destination | 0, transferred | 0);
	return wordCountShadow | 0;
}
GameBoyAdvanceDMA3.prototype.checkIRQTrigger = function () {
	if ((this.irqFlagging | 0) != 0) {
		this.irq.requestIRQ(0x800);
	}
}
GameBoyAdvanceDMA3.prototype.finalDMAAddresses = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
	}
	//Update destination address:
	switch (this.destinationControl | 0) {
		case 0: //Increment
			this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
			break;
		case 3: //Reload
			this.destinationShadow = this.destination | 0;
	}
}
GameBoyAdvanceDMA3.prototype.incrementDMAAddresses = function (source, destination, transferred) {
	source = source | 0;
	destination = destination | 0;
	transferred = transferred | 0;
	//Update source address:
	switch (this.sourceControl | 0) {
		case 0: //Increment
		case 3: //Forbidden (VBA has it increment)
			this.sourceShadow = ((source | 0) + (transferred | 0)) | 0;
			break;
		case 1:
			this.sourceShadow = ((source | 0) - (transferred | 0)) | 0;
	}
	//Update destination address:
	switch (this.destinationControl | 0) {
		case 0: //Increment
		case 3: //Increment
			this.destinationShadow = ((destination | 0) + (transferred | 0)) | 0;
			break;
		case 1: //Decrement
			this.destinationShadow = ((destination | 0) - (transferred | 0)) | 0;
	}
}
GameBoyAdvanceDMA3.prototype.nextEventTime = function () {
	var clocks = 0x7FFFFFFF;
	switch (this.enabled | 0) {
		//V_BLANK
		case 0x2:
			clocks = this.gfxState.nextVBlankEventTime() | 0;
			break;
			//H_BLANK:
		case 0x4:
			clocks = this.gfxState.nextHBlankDMAEventTime() | 0;
			break;
			//DISPLAY_SYNC:
		case 0x20:
			clocks = this.gfxState.nextDisplaySyncEventTime(this.displaySyncEnableDelay | 0) | 0;
	}
	return clocks | 0;
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceSaveDeterminer(saveCore) {
	this.saves = null;
	this.saveCore = saveCore;
	this.possible = 0x7;
}
GameBoyAdvanceSaveDeterminer.prototype.flags = {
	SRAM: 1,
	FLASH: 2,
	EEPROM: 4
}
GameBoyAdvanceSaveDeterminer.prototype.initialize = function () {

}
GameBoyAdvanceSaveDeterminer.prototype.load = function (save) {
	this.saves = save;
	var length = save.length | 0;
	switch (length | 0) {
		case 0x200:
		case 0x2000:
			this.possible = this.flags.EEPROM | 0;
			break;
		case 0x8000:
			this.possible = this.flags.SRAM | 0;
			break;
		case 0x10000:
		case 0x20000:
			this.possible = this.flags.FLASH | 0;
	}
	this.checkDetermination();
}
GameBoyAdvanceSaveDeterminer.prototype.checkDetermination = function () {
	switch (this.possible) {
		case 0x1:
			this.saveCore.referenceSave(0x1);
			break;
		case 0x2:
			this.saveCore.referenceSave(0x2);
			break;
		case 0x4:
			this.saveCore.referenceSave(0x3);
	}
}
GameBoyAdvanceSaveDeterminer.prototype.readSRAM = function (address) {
	address = address | 0;
	var data = 0;
	//Is not EEPROM:
	this.possible &= ~this.flags.EEPROM;
	if (this.saves != null) {
		if ((this.possible & this.flags.FLASH) == (this.flags.FLASH | 0) || (this.possible & this.flags.SRAM) == (this.flags.SRAM | 0)) {
			//Read is the same between SRAM and FLASH for the most part:
			data = this.saves[(address | 0) % (this.saves.length | 0)] | 0;
		}
	}
	return data | 0;
}
GameBoyAdvanceSaveDeterminer.prototype.writeGPIO8 = function (address, data) {
	address = address | 0;
	data = data | 0;
	//GPIO (TODO):
}
GameBoyAdvanceSaveDeterminer.prototype.writeGPIO16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	//GPIO (TODO):
}
GameBoyAdvanceSaveDeterminer.prototype.writeGPIO32 = function (address, data) {
	address = address | 0;
	data = data | 0;
	//GPIO (TODO):
}
GameBoyAdvanceSaveDeterminer.prototype.writeEEPROM16 = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
		//EEPROM:
		this.possible = this.flags.EEPROM | 0;
		this.checkDetermination();
		this.saveCore.writeEEPROM16(address | 0, data | 0);
	}
}
GameBoyAdvanceSaveDeterminer.prototype.readEEPROM8 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
		//EEPROM:
		this.possible = this.flags.EEPROM | 0;
		this.checkDetermination();
		return this.saveCore.readEEPROM8(address | 0) | 0;
	}
}
GameBoyAdvanceSaveDeterminer.prototype.readEEPROM16 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
		//EEPROM:
		this.possible = this.flags.EEPROM | 0;
		this.checkDetermination();
		return this.saveCore.readEEPROM16(address | 0) | 0;
	}
}
GameBoyAdvanceSaveDeterminer.prototype.readEEPROM32 = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.possible & this.flags.EEPROM) == (this.flags.EEPROM | 0)) {
		//EEPROM:
		this.possible = this.flags.EEPROM | 0;
		this.checkDetermination();
		return this.saveCore.readEEPROM32(address | 0) | 0;
	}
}
GameBoyAdvanceSaveDeterminer.prototype.writeSRAM = function (address, data) {
	address = address | 0;
	data = data | 0;
	//Is not EEPROM:
	this.possible &= ~this.flags.EEPROM;
	if ((this.possible & this.flags.FLASH) == (this.flags.FLASH | 0)) {
		if ((this.possible & this.flags.SRAM) == (this.flags.SRAM | 0)) {
			if ((address | 0) == 0x5555) {
				if ((data | 0) == 0xAA) {
					//FLASH
					this.possible = this.flags.FLASH | 0;
				} else {
					//SRAM
					this.possible = this.flags.SRAM | 0;
				}
			}
		} else {
			if ((address | 0) == 0x5555) {
				if ((data | 0) == 0xAA) {
					//FLASH
					this.possible = this.flags.FLASH | 0;
				} else {
					//Is not Flash:
					this.possible &= ~this.flags.FLASH;
				}
			}
		}
	} else if ((this.possible & this.flags.SRAM) == (this.flags.SRAM | 0)) {
		//SRAM
		this.possible = this.flags.SRAM | 0;
	}
	this.checkDetermination();
	this.saveCore.writeSRAMIfDefined(address | 0, data | 0);
}





"use strict";
/*
 Copyright (C) 2012-2013 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceSRAMChip() {
	this.saves = null;
	this.TILTChip = null;
	this.TILTChipUnlocked = 0;
}
GameBoyAdvanceSRAMChip.prototype.initialize = function () {
	if (this.saves == null || (this.saves.length | 0) != 0x8000) {
		this.saves = getUint8Array(0x8000);
	}
}
GameBoyAdvanceSRAMChip.prototype.load = function (save) {
	if ((save.length | 0) == 0x8000) {
		this.saves = save;
	}
}
GameBoyAdvanceSRAMChip.prototype.read = function (address) {
	address = address | 0;
	var data = 0;
	if ((address | 0) < 0x8000 || (this.TILTChipUnlocked | 0) != 3) {
		data = this.saves[address & 0x7FFF] | 0;
	} else {
		switch (address | 0) {
			case 0x8200:
				data = this.TILTChip.readXLow() | 0;
				break;
			case 0x8300:
				data = this.TILTChip.readXHigh() | 0;
				break;
			case 0x8400:
				data = this.TILTChip.readYLow() | 0;
				break;
			case 0x8500:
				data = this.TILTChip.readYHigh() | 0;
				break;
			default:
				data = this.saves[address & 0x7FFF] | 0;
		}
	}
	return data | 0;
}
GameBoyAdvanceSRAMChip.prototype.write = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((address | 0) < 0x8000 || (this.TILTChipUnlocked | 0) >= 4) {
		//Normal SRAM write:
		this.saves[address & 0x7FFF] = data | 0;
	} else {
		switch (address | 0) {
			case 0x8000:
				if ((data | 0) == 0x55) { //Magic Combo.
					this.TILTChipUnlocked |= 0x1; //Tilt unlock stage 1.
				} else {
					this.TILTChipUnlocked |= 0x4; //Definitely not using a tilt sensor.
				}
				break;
			case 0x8100:
				if ((data | 0) == 0xAA) { //Magic Combo.
					this.TILTChipUnlocked |= 0x2; //Tilt unlock stage 2.
				} else {
					this.TILTChipUnlocked |= 0x4; //Definitely not using a tilt sensor.
				}
				break;
			default:
				//Check for mirroring while not tilt chip:
				if ((this.TILTChipUnlocked | 0) == 0) {
					this.saves[address & 0x7FFF] = data | 0;
					this.TILTChipUnlocked |= 0x4; //Definitely not using a tilt sensor.
				}
		}
	}
}






"use strict";
/*
 Copyright (C) 2012-2013 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceFLASHChip(is128, isAteml) {
	this.largestSizePossible = (!!is128) ? 0x20000 : 0x10000;
	this.notATMEL = !isAteml;
	this.saves = null;
	this.BANKOffset = 0;
	this.flashCommandUnlockStage = 0;
	this.flashCommand = 0;
	this.writeBytesLeft = 0;
}
GameBoyAdvanceFLASHChip.prototype.initialize = function () {
	this.allocate();
}
GameBoyAdvanceFLASHChip.prototype.allocate = function () {
	if (this.saves == null || (this.saves.length | 0) < (this.largestSizePossible | 0)) {
		//Allocate the new array:
		var newSave = getUint8Array(this.largestSizePossible | 0);
		//Init to default value:
		for (var index = 0;
			(index | 0) < (this.largestSizePossible | 0); index = ((index | 0) + 1) | 0) {
			newSave[index | 0] = 0xFF;
		}
		//Copy the old save data out:
		if (this.saves != null) {
			for (var index = 0;
				(index | 0) < (this.saves.length | 0); index = ((index | 0) + 1) | 0) {
				newSave[index | 0] = this.saves[index | 0] | 0;
			}
		}
		//Assign the new array out:
		this.saves = newSave;
	}
}
GameBoyAdvanceFLASHChip.prototype.load = function (save) {
	if ((save.length | 0) == 0x10000 || (save.length | 0) == 0x20000) {
		this.saves = save;
		if ((save.length | 0) == 0x20000) {
			this.notATMEL = true;
		}
	}
}
GameBoyAdvanceFLASHChip.prototype.read = function (address) {
	address = address | 0;
	var data = 0;
	if ((this.flashCommand | 0) != 2 || (address | 0) > 1) {
		data = this.saves[address | this.BANKOffset] | 0;
	} else {
		if ((address | 0) == 0) {
			if (this.notATMEL) {
				data = ((this.largestSizePossible | 0) == 0x20000) ? 0x62 : 0xBF;
			} else {
				data = 0x1F;
			}
		} else {
			if (this.notATMEL) {
				data = ((this.largestSizePossible | 0) == 0x20000) ? 0x13 : 0xD4;
			} else {
				data = 0x3D;
			}
		}
	}
	return data | 0;
}
GameBoyAdvanceFLASHChip.prototype.write = function (address, data) {
	address = address | 0;
	data = data | 0;
	switch (this.writeBytesLeft | 0) {
		case 0:
			this.writeControlBits(address | 0, data | 0);
			break;
		case 0x80:
			var addressToErase = (address & 0xFF80) | this.BANKOffset;
			for (var index = 0;
				(index | 0) < 0x80; index = ((index | 0) + 1) | 0) {
				this.saves[addressToErase | index] = 0xFF;
			}
			default:
				this.writeByte(address | 0, data | 0);

	}
}
GameBoyAdvanceFLASHChip.prototype.writeControlBits = function (address, data) {
	address = address | 0;
	data = data | 0;
	switch (address | 0) {
		case 0:
			this.sectorEraseOrBankSwitch(address | 0, data | 0);
			break;
		case 0x5555:
			this.controlWriteStage2(data | 0);
			break;
		case 0x2AAA:
			this.controlWriteStageIncrement(data | 0);
			break;
		default:
			this.sectorErase(address | 0, data | 0);
	}
}
GameBoyAdvanceFLASHChip.prototype.writeByte = function (address, data) {
	address = address | 0;
	data = data | 0;
	this.saves[address | this.BANKOffset] = data | 0;
	this.writeBytesLeft = ((this.writeBytesLeft | 0) - 1) | 0;
}
GameBoyAdvanceFLASHChip.prototype.selectBank = function (bankNumber) {
	bankNumber = bankNumber | 0;
	this.BANKOffset = (bankNumber & 0x1) << 16;
	this.largestSizePossible = Math.max((0x10000 + (this.BANKOffset | 0)) | 0, this.largestSizePossible | 0) | 0;
	this.notATMEL = true;
	this.allocate();
}
GameBoyAdvanceFLASHChip.prototype.controlWriteStage2 = function (data) {
	data = data | 0;
	if ((data | 0) == 0xAA) {
		//Initial Command:
		this.flashCommandUnlockStage = 1;
	} else if ((this.flashCommandUnlockStage | 0) == 2) {
		switch (data | 0) {
			case 0x10:
				//Command Erase Chip:
				if ((this.flashCommand | 0) == 1) {
					for (var index = 0;
						(index | 0) < (this.largestSizePossible | 0); index = ((index | 0) + 1) | 0) {
						this.saves[index | 0] = 0xFF;
					}
				}
				this.flashCommand = 0;
				break;
			case 0x80:
				//Command Erase:
				this.flashCommand = 1;
				break;
			case 0x90:
				//Command ID:
				this.flashCommand = 2;
				break;
			case 0xA0:
				//Command Write:
				this.writeCommandTrigger();
				break;
			case 0xB0:
				//Command Bank Switch:
				this.flashCommand = 3;
				break;
			default:
				this.flashCommand = 0;
		}
		//Reset the command state:
		this.flashCommandUnlockStage = 0;
	} else if ((data | 0) == 0xF0) {
		//Command Clear:
		this.flashCommand = 0;
		this.flashCommandUnlockStage = 0;
		this.notATMEL = true;
	}
}
GameBoyAdvanceFLASHChip.prototype.writeCommandTrigger = function () {
	if ((this.flashCommandUnlockStage | 0) == 2) {
		if (this.notATMEL) {
			this.writeBytesLeft = 1;
		} else {
			this.writeBytesLeft = 0x80;
		}
	}
}
GameBoyAdvanceFLASHChip.prototype.sectorErase = function (address, data) {
	address = (address << 12) >> 12;
	data = data | 0;
	if ((this.flashCommand | 0) == 1 && (this.flashCommandUnlockStage | 0) == 2 && ((data | 0) == 0x30)) {
		var addressEnd = ((address | this.BANKOffset) + 0x1000) | 0;
		for (var index = address | this.BANKOffset;
			(index | 0) < (addressEnd | 0); index = ((index | 0) + 1) | 0) {
			this.saves[index | 0] = 0xFF;
		}
		this.notATMEL = true;
	}
	this.flashCommand = 0;
	this.flashCommandUnlockStage = 0;
}
GameBoyAdvanceFLASHChip.prototype.sectorEraseOrBankSwitch = function (address, data) {
	address = address | 0;
	data = data | 0;
	if ((this.flashCommandUnlockStage | 0) == 2) {
		this.sectorErase(address | 0, data | 0);
	} else if ((this.flashCommand | 0) == 3 && (this.flashCommandUnlockStage | 0) == 0) {
		this.selectBank(data & 0x1);
	}
	this.flashCommand = 0;
	this.flashCommandUnlockStage = 0;
}
GameBoyAdvanceFLASHChip.prototype.controlWriteStageIncrement = function (data) {
	if ((data | 0) == 0x55 && (this.flashCommandUnlockStage | 0) == 1) {
		this.flashCommandUnlockStage = ((this.flashCommandUnlockStage | 0) + 1) | 0;
	} else {
		this.flashCommandUnlockStage = 0;
	}
}





"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GameBoyAdvanceEEPROMChip(IOCore) {
	this.saves = null;
	this.largestSizePossible = 0x200;
	this.mode = 0;
	this.bitsProcessed = 0;
	this.address = 0;
	this.buffer = getUint8Array(8);
	this.IOCore = IOCore;
	//Special note to emulator authors: EEPROM command ending bit "0" can also be a "1"...
}
GameBoyAdvanceEEPROMChip.prototype.initialize = function () {
	this.allocate();
}
GameBoyAdvanceEEPROMChip.prototype.allocate = function () {
	if (this.saves == null || (this.saves.length | 0) < (this.largestSizePossible | 0)) {
		//Allocate the new array:
		var newSave = getUint8Array(this.largestSizePossible | 0);
		//Init to default value:
		for (var index = 0;
			(index | 0) < (this.largestSizePossible | 0); index = ((index | 0) + 1) | 0) {
			newSave[index | 0] = 0xFF;
		}
		//Copy the old save data out:
		if (this.saves != null) {
			for (var index = 0;
				(index | 0) < (this.saves.length | 0); index = ((index | 0) + 1) | 0) {
				newSave[index | 0] = this.saves[index | 0] | 0;
			}
		}
		//Assign the new array out:
		this.saves = newSave;
	}
}
GameBoyAdvanceEEPROMChip.prototype.load = function (save) {
	if ((save.length | 0) == 0x200 || (save.length | 0) == 0x2000) {
		this.saves = save;
	}
}
GameBoyAdvanceEEPROMChip.prototype.read8 = function () {
	//Can't do real reading with 8-bit reads:
	return 0x1;
}
GameBoyAdvanceEEPROMChip.prototype.read16 = function () {
	var data = 1;
	switch (this.mode | 0) {
		case 0x7:
			//Return 4 junk 0 bits:
			data = 0;
			if ((this.bitsProcessed | 0) < 3) {
				//Increment our bits counter:
				this.bitsProcessed = ((this.bitsProcessed | 0) + 1) | 0;
			} else {
				//Reset our bits counter:
				this.bitsProcessed = 0;
				//Change mode for the actual reads:
				this.mode = 8;
			}
			break;
		case 0x8:
			//Return actual serial style data:
			var address = ((this.bitsProcessed >> 3) + (this.address | 0)) | 0;
			data = (this.saves[address | 0] >> ((0x7 - (this.bitsProcessed & 0x7)) | 0)) & 0x1;
			//Check for end of read:
			if ((this.bitsProcessed | 0) < 0x3F) {
				//Increment our bits counter:
				this.bitsProcessed = ((this.bitsProcessed | 0) + 1) | 0;
			} else {
				//Finished read and now idle:
				this.resetMode();
			}
	}
	return data | 0;
}
GameBoyAdvanceEEPROMChip.prototype.read32 = function () {
	//Can't do real reading with 32-bit reads:
	return 0x10001;
}
GameBoyAdvanceEEPROMChip.prototype.write16 = function (data) {
	data = data | 0;
	data = data & 0x1;
	//Writes only work in DMA:
	switch (this.mode | 0) {
		//Idle Mode:
		case 0:
			this.mode = data | 0;
			break;
			//Select Mode:
		case 0x1:
			this.selectMode(data | 0);
			break;
			//Address Mode (Write):
		case 0x2:
			//Address Mode (Read):
		case 0x3:
			this.addressMode(data | 0);
			break;
			//Write Mode:
		case 0x4:
			this.writeMode(data | 0);
			break;
			//Ending bit of addressing:
		case 0x5:
		case 0x6:
			this.endAddressing();
			break;
			//Read Mode:
		default:
			this.resetMode();
	}
}
GameBoyAdvanceEEPROMChip.prototype.selectMode = function (data) {
	data = data | 0;
	//Reset our address:
	this.address = 0;
	//Reset our bits counter:
	this.bitsProcessed = 0;
	//Read the mode bit:
	this.mode = 0x2 | data;
}
GameBoyAdvanceEEPROMChip.prototype.addressMode = function (data) {
	data = data | 0;
	//Shift in our address bit:
	this.address = (this.address << 1) | data;
	//Increment our bits counter:
	this.bitsProcessed = ((this.bitsProcessed | 0) + 1) | 0;
	//Check for how many bits we've shifted in:
	switch (this.bitsProcessed | 0) {
		//6 bit address mode:
		case 0x6:
			if ((this.IOCore.dmaChannel3.wordCountShadow | 0) >= (((this.mode | 0) == 2) ? 0x4A : 0xA)) {
				this.largestSizePossible = 0x2000;
				this.allocate();
				break;
			}
			//14 bit address mode:
			case 0xE:
				this.changeModeToActive();
	}
}
GameBoyAdvanceEEPROMChip.prototype.changeModeToActive = function () {
	//Ensure the address range:
	this.address &= 0x3FF;
	//Addressing in units of 8 bytes:
	this.address <<= 3;
	//Reset our bits counter:
	this.bitsProcessed = 0;
	//Change to R/W Mode:
	this.mode = ((this.mode | 0) + 2) | 0;
}
GameBoyAdvanceEEPROMChip.prototype.writeMode = function (data) {
	data = data | 0;
	//Push a bit into the buffer:
	this.pushBuffer(data | 0);
	//Save on last write bit push:
	if ((this.bitsProcessed | 0) == 0x40) {
		//64 bits buffered, so copy our buffer to the save data:
		this.copyBuffer();
		this.mode = 6;
	}
}
GameBoyAdvanceEEPROMChip.prototype.pushBuffer = function (data) {
	data = data | 0;
	//Push a bit through our serial buffer:
	var bufferPosition = this.bitsProcessed >> 3;
	this.buffer[bufferPosition & 0x7] = ((this.buffer[bufferPosition & 0x7] << 1) & 0xFE) | data;
	this.bitsProcessed = ((this.bitsProcessed | 0) + 1) | 0;
}
GameBoyAdvanceEEPROMChip.prototype.copyBuffer = function () {
	//Copy 8 bytes from buffer to EEPROM save data starting at address offset:
	for (var index = 0;
		(index | 0) < 8; index = ((index | 0) + 1) | 0) {
		this.saves[this.address | index] = this.buffer[index & 0x7] & 0xFF;
	}
}
GameBoyAdvanceEEPROMChip.prototype.endAddressing = function () {
	this.mode = ((this.mode | 0) + 2) | 0;
}
GameBoyAdvanceEEPROMChip.prototype.resetMode = function () {
	//Reset back to idle:
	this.mode = 0;
}








"use strict";
/*
 Copyright (C) 2012-2013 Grant Galitz

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



/*
Core
*/


var Iodine = null;
var Blitter = null;
var Mixer = null;
var MixerInput = null;
var timerID = null;

function registerBlitterHandler() {
	Blitter = new GlueCodeGfx();
	Blitter.attachCanvas(document.getElementById("emu_screen_canvas"));
	Blitter.setSmoothScaling(false);
	Iodine.attachGraphicsFrameHandler(function (buffer) {
		Blitter.copyBuffer(buffer);
	});
}

function loadIodineCoreGlue(url) {
	// Initialize Iodine:
	Iodine = new GameBoyAdvanceEmulator();
	// Initialize the graphics:
	registerBlitterHandler();
	// Initialize the audio:
	registerAudioHandler();
	// Register the save handler callbacks:
	registerSaveHandlers();
	// Hook the GUI controls.
	registerGUIEvents();
	// Enable Sound:
	Iodine.enableAudio();
	Iodine.endAllProcesses = function () {
		Blitter.detachCanvas();
		Iodine.audioUpdateState = Iodine.audioFound;
		Iodine.audio = null;
	}
	// Download BIOS & ROM, then hide the preloader.
	downloadBIOS(function () {
		downloadROM(url, function () {})
	});
}

function loadControls(controls) {
	keyZones = [
		//Use this to control the key mapping:
		//A:
		[controls.a, controls.a],
		//B:
		[controls.b, controls.b, controls.b],
		//Select:
		[controls.select],
		//Start:
		[controls.start],
		//Right:
		[controls.right],
		//Left:
		[controls.left],
		//Up:
		[controls.up],
		//Down:
		[controls.down],
		//R:
		[controls.r],
		//L:
		[controls.l]
	];
}

function loadUploadedGBAGame(url) {
	//Initialize Iodine:
	Iodine = new GameBoyAdvanceEmulator();
	//Initialize the graphics:
	registerBlitterHandler();
	//Initialize the audio:
	registerAudioHandler();
	//Register the save handler callbacks:
	registerSaveHandlers();
	//Hook the GUI controls.
	registerGUIEvents();
	//Enable Sound:
	Iodine.enableAudio();
	//Download the BIOS:
	downloadBIOS(function () {});
	downloadROM(url);
}

function downloadBIOS(callbackFunc) {
	downloadFile("static/js/cores/gba/gba_bios.bin", registerBIOS);
	callbackFunc();
}

function registerBIOS() {
	console.log(this);
	processDownload(this, attachBIOS);
	Iodine.play();
}

function downloadROM(file) {
	clearTempString();
	Iodine.pause();
	showTempString("Downloading ROM");
	try {
		attachHandler(new Uint8Array(file));
	} catch (error) {
		var data = file;
		var length = data.length;
		var dataArray = [];
		for (var index = 0; index < length; index++) {
			dataArray[index] = data.charCodeAt(index) & 0xFF;
		}
		attachROM(dataArray);
	}
	var audioStatus = localStorage.getItem('audioStatus');
	if (audioStatus == "false") {
		Iodine.disableAudio();
	} else {
		Iodine.enableAudio();
	}
}

function registerROM() {
	clearTempString();
	processDownload(this, attachROM);
	var audioStatus = localStorage.getItem('audioStatus');
	if (audioStatus == "false") {
		Iodine.disableAudio();
	} else {
		Iodine.enableAudio();
	}
	Iodine.play();
}

function registerGUIEvents() {
	addEvent("keydown", document, keyDown);
	addEvent("keyup", document, keyUpPreprocess);
	addEvent("unload", window, ExportSave);
	window.addEventListener("blur", function (evt) {
		ExportSave()
	}, false);
}

function registerAudioHandler() {
	Mixer = new GlueCodeMixer();
	MixerInput = new GlueCodeMixerInput(Mixer);
	Iodine.attachAudioHandler(MixerInput);
}

function lowerVolume() {
	Iodine.incrementVolume(-0.04);
}

function raiseVolume() {
	Iodine.incrementVolume(0.04);
}

function writeRedTemporaryText(textString) {
	if (timerID) {
		clearTimeout(timerID);
	}
	showTempString(textString);
	timerID = setTimeout(clearTempString, 5000);
}

function showTempString(textString) {
	document.getElementById("tempMessage").style.display = "block";
	document.getElementById("tempMessage").textContent = textString;
}

function clearTempString() {
	document.getElementById("tempMessage").style.display = "none";
}
//Some wrappers and extensions for non-DOM3 browsers:
function addEvent(sEvent, oElement, fListener) {
	try {
		oElement.addEventListener(sEvent, fListener, false);
	} catch (error) {
		oElement.attachEvent("on" + sEvent, fListener); //Pity for IE.
	}
}

function removeEvent(sEvent, oElement, fListener) {
	try {
		oElement.removeEventListener(sEvent, fListener, false);
	} catch (error) {
		oElement.detachEvent("on" + sEvent, fListener); //Pity for IE.
	}
}

function setupAudio() {
	localStorage.setItem('audioStatus', "true");
}

function closeEmulator() {
	Iodine.stop();
	keyZones = [];
	iGBA.closeModal('.popup-load');
}

function setupAutoSave() {
	localStorage.setItem('autoSave', "true");
}

function toggleAutoSave() {
	var audioStatus = localStorage.getItem('autoSave');
	if (audioStatus == "false") {
		localStorage.setItem('autoSave', "true");
		setInterval(function () {
			ExportSave();
		}, 60 * 1000);
	} else {
		localStorage.setItem('autoSave', "false");
		setInterval(function () {
			ExportSave();
		}, 60 * 1000);
	}
}


/*
Audio
*/


function GlueCodeMixer() {
	var parentObj = this;
	this.audio = new XAudioServer(2, this.sampleRate, 0, this.bufferAmount, null, 1, function () {
		//Disable audio in the callback here:
		parentObj.disableAudio();
	});
	this.outputUnits = [];
	this.outputUnitsValid = [];
	setInterval(function () {
		parentObj.checkAudio();
	}, 16);
	this.initializeBuffer();
}
GlueCodeMixer.prototype.sampleRate = 44100;
GlueCodeMixer.prototype.bufferAmount = 44100;
GlueCodeMixer.prototype.channelCount = 2;
GlueCodeMixer.prototype.initializeBuffer = function () {
	this.buffer = new AudioSimpleBuffer(this.channelCount,
		this.bufferAmount);
}
GlueCodeMixer.prototype.appendInput = function (inUnit) {
	if (this.audio) {
		for (var index = 0; index < this.outputUnits.length; index++) {
			if (!this.outputUnits[index]) {
				break;
			}
		}
		this.outputUnits[index] = inUnit;
		this.outputUnitsValid.push(inUnit);
		inUnit.registerStackPosition(index);
	} else if (typeof inUnit.errorCallback == "function") {
		inUnit.errorCallback();
	}
}
GlueCodeMixer.prototype.unregister = function (stackPosition) {
	this.outputUnits[stackPosition] = null;
	this.outputUnitsValid = [];
	for (var index = 0, length = this.outputUnits.length; index < length; ++index) {
		if (this.outputUnits[index]) {
			this.outputUnitsValid.push(this.outputUnits);
		}
	}
}
GlueCodeMixer.prototype.checkAudio = function () {
	if (this.audio) {
		var inputCount = this.outputUnitsValid.length;
		for (var inputIndex = 0, output = 0; inputIndex < inputCount; ++inputIndex) {
			this.outputUnitsValid[inputIndex].prepareShift();
		}
		for (var count = 0, requested = this.findLowestBufferCount(); count < requested; ++count) {
			for (var inputIndex = 0, output = 0; inputIndex < inputCount; ++inputIndex) {
				output += this.outputUnitsValid[inputIndex].shift();
			}
			this.buffer.push(output);
		}
		this.audio.writeAudioNoCallback(this.buffer.getSlice());
	}
}
GlueCodeMixer.prototype.findLowestBufferCount = function () {
	var count = 0;
	for (var inputIndex = 0, inputCount = this.outputUnitsValid.length; inputIndex < inputCount; ++inputIndex) {
		var tempCount = this.outputUnitsValid[inputIndex].buffer.remainingBuffer();
		if (tempCount > 0) {
			if (count > 0) {
				count = Math.min(count, tempCount);
			} else {
				count = tempCount;
			}
		}
	}
	return count;
}
GlueCodeMixer.prototype.disableAudio = function () {
	this.audio = null;
}

function GlueCodeMixerInput(mixer) {
	this.mixer = mixer;
}
GlueCodeMixerInput.prototype.initialize = function (channelCount, sampleRate, bufferAmount, startingVolume, errorCallback) {
	this.channelCount = channelCount;
	this.sampleRate = sampleRate;
	this.bufferAmount = bufferAmount;
	this.volume = startingVolume;
	this.errorCallback = errorCallback;
	this.buffer = new AudioBufferWrapper(this.channelCount,
		this.mixer.channelCount,
		this.bufferAmount,
		this.sampleRate,
		this.mixer.sampleRate);

}
GlueCodeMixerInput.prototype.register = function (volume) {
	this.mixer.appendInput(this);
}
GlueCodeMixerInput.prototype.changeVolume = function (volume) {
	this.volume = volume;
}
GlueCodeMixerInput.prototype.prepareShift = function () {
	this.buffer.resampleRefill();
}
GlueCodeMixerInput.prototype.shift = function () {
	return this.buffer.shift() * this.volume;
}
GlueCodeMixerInput.prototype.push = function (buffer) {
	this.buffer.push(buffer);
	this.mixer.checkAudio();
}
GlueCodeMixerInput.prototype.remainingBuffer = function () {
	return this.buffer.remainingBuffer() + (Math.floor((this.mixer.audio.remainingBuffer() * this.sampleRate / this.mixer.sampleRate) / this.mixer.channelCount) * this.mixer.channelCount);
}
GlueCodeMixerInput.prototype.registerStackPosition = function (stackPosition) {
	this.stackPosition = stackPosition;
}
GlueCodeMixerInput.prototype.unregister = function () {
	this.mixer.unregister(this.stackPosition);
}

function AudioBufferWrapper(channelCount,
	mixerChannelCount,
	bufferAmount,
	sampleRate,
	mixerSampleRate) {
	this.channelCount = channelCount;
	this.mixerChannelCount = mixerChannelCount;
	this.bufferAmount = bufferAmount;
	this.sampleRate = sampleRate;
	this.mixerSampleRate = mixerSampleRate;
	this.initialize();
}
AudioBufferWrapper.prototype.initialize = function () {
	this.inBufferSize = this.bufferAmount * this.mixerChannelCount;
	this.inBuffer = getFloat32Array(this.inBufferSize);
	this.outBufferSize = (Math.ceil(this.inBufferSize * this.mixerSampleRate / this.sampleRate / this.mixerChannelCount) * this.mixerChannelCount) + this.mixerChannelCount;
	this.outBuffer = getFloat32Array(this.outBufferSize);
	this.resampler = new Resampler(this.sampleRate, this.mixerSampleRate, this.mixerChannelCount, this.outBufferSize, true);
	this.inputOffset = 0;
	this.resampleBufferStart = 0;
	this.resampleBufferEnd = 0;
}
AudioBufferWrapper.prototype.push = function (buffer) {
	var length = buffer.length;
	if (this.channelCount < this.mixerChannelCount) {
		for (var bufferCounter = 0; bufferCounter < length && this.inputOffset < this.inBufferSize;) {
			for (var index = this.channelCount; index < this.mixerChannelCount; ++index) {
				this.inBuffer[this.inputOffset++] = buffer[bufferCounter];
			}
			for (index = 0; index < this.channelCount && bufferCounter < length; ++index) {
				this.inBuffer[this.inputOffset++] = buffer[bufferCounter++];
			}
		}
	} else if (this.channelCount == this.mixerChannelCount) {
		for (var bufferCounter = 0; bufferCounter < length && this.inputOffset < this.inBufferSize;) {
			this.inBuffer[this.inputOffset++] = buffer[bufferCounter++];
		}
	} else {
		for (var bufferCounter = 0; bufferCounter < length && this.inputOffset < this.inBufferSize;) {
			for (index = 0; index < this.mixerChannelCount && bufferCounter < length; ++index) {
				this.inBuffer[this.inputOffset++] = buffer[bufferCounter++];
			}
			bufferCounter += this.channelCount - this.mixerChannelCount;
		}
	}
}
AudioBufferWrapper.prototype.shift = function () {
	var output = 0;
	if (this.resampleBufferStart != this.resampleBufferEnd) {
		output = this.outBuffer[this.resampleBufferStart++];
		if (this.resampleBufferStart == this.outBufferSize) {
			this.resampleBufferStart = 0;
		}
	}
	return output;
}
AudioBufferWrapper.prototype.resampleRefill = function () {
	if (this.inputOffset > 0) {
		//Resample a chunk of audio:
		var resampleLength = this.resampler.resampler(this.getSlice(this.inBuffer, this.inputOffset));
		var resampledResult = this.resampler.outputBuffer;
		for (var index2 = 0; index2 < resampleLength;) {
			this.outBuffer[this.resampleBufferEnd++] = resampledResult[index2++];
			if (this.resampleBufferEnd == this.outBufferSize) {
				this.resampleBufferEnd = 0;
			}
			if (this.resampleBufferStart == this.resampleBufferEnd) {
				this.resampleBufferStart += this.mixerChannelCount;
				if (this.resampleBufferStart == this.outBufferSize) {
					this.resampleBufferStart = 0;
				}
			}
		}
		this.inputOffset = 0;
	}
}
AudioBufferWrapper.prototype.remainingBuffer = function () {
	return (Math.floor((this.resampledSamplesLeft() * this.resampler.ratioWeight) / this.mixerChannelCount) * this.mixerChannelCount) + this.inputOffset;
}
AudioBufferWrapper.prototype.resampledSamplesLeft = function () {
	return ((this.resampleBufferStart <= this.resampleBufferEnd) ? 0 : this.outBufferSize) + this.resampleBufferEnd - this.resampleBufferStart;
}
AudioBufferWrapper.prototype.getSlice = function (buffer, lengthOf) {
	//Typed array and normal array buffer section referencing:
	try {
		return buffer.subarray(0, lengthOf);
	} catch (error) {
		try {
			//Regular array pass:
			buffer.length = lengthOf;
			return buffer;
		} catch (error) {
			//Nightly Firefox 4 used to have the subarray function named as slice:
			return buffer.slice(0, lengthOf);
		}
	}
}

function AudioSimpleBuffer(channelCount, bufferAmount) {
	this.channelCount = channelCount;
	this.bufferAmount = bufferAmount;
	this.outBufferSize = this.channelCount * this.bufferAmount;
	this.stackLength = 0;
	this.buffer = getFloat32Array(this.outBufferSize);
}
AudioSimpleBuffer.prototype.push = function (data) {
	if (this.stackLength < this.outBufferSize) {
		this.buffer[this.stackLength++] = data;
	}
}
AudioSimpleBuffer.prototype.getSlice = function () {
	var lengthOf = this.stackLength;
	this.stackLength = 0;
	//Typed array and normal array buffer section referencing:
	try {
		return this.buffer.subarray(0, lengthOf);
	} catch (error) {
		try {
			//Regular array pass:
			this.buffer.length = lengthOf;
			return this.buffer;
		} catch (error) {
			//Nightly Firefox 4 used to have the subarray function named as slice:
			return this.buffer.slice(0, lengthOf);
		}
	}
}


/*
Graphics
*/


function GlueCodeGfx() {
	this.didRAF = false; //Set when rAF has been used.
	this.graphicsFound = 0; //Do we have graphics output sink found yet?
	this.offscreenWidth = 240; //Width of the GBA screen.
	this.offscreenHeight = 160; //Height of the GBA screen.
	this.doSmoothing = true;
	//Cache some frame buffer lengths:
	var offscreenRGBCount = this.offscreenWidth * this.offscreenHeight * 3;
	this.swizzledFrameFree = [getUint8Array(offscreenRGBCount), getUint8Array(offscreenRGBCount)];
	this.swizzledFrameReady = [];
	this.initializeGraphicsBuffer(); //Pre-set the swizzled buffer for first frame.
}
GlueCodeGfx.prototype.attachCanvas = function (canvas) {
	this.canvas = canvas;
	this.canvas.width = 240;
	this.canvas.height = 160;
	this.graphicsFound = this.initializeCanvasTarget();
	this.setSmoothScaling(this.doSmoothing);
}
GlueCodeGfx.prototype.detachCanvas = function () {
	this.canvas = null;
}
GlueCodeGfx.prototype.recomputeDimension = function () {
	//Cache some dimension info:
	this.canvasLastWidth = this.canvas.clientWidth;
	this.canvasLastHeight = this.canvas.clientHeight;
	this.onscreenWidth = this.canvas.width;
	this.onscreenHeight = this.canvas.height;
}
GlueCodeGfx.prototype.initializeCanvasTarget = function () {
	try {
		//Obtain dimensional information:
		this.recomputeDimension();
		//Get handles on the canvases:
		this.canvasOffscreen = document.createElement("canvas");
		this.canvasOffscreen.width = this.canvas.width;
		this.canvasOffscreen.height = this.canvas.height;
		this.drawContextOffscreen = this.canvasOffscreen.getContext("2d");
		this.drawContextOnscreen = this.canvas.getContext("2d");
		//Get a CanvasPixelArray buffer:
		this.canvasBuffer = this.getBuffer(this.drawContextOffscreen, this.offscreenWidth, this.offscreenHeight);
		//Initialize Alpha Channel:
		this.initializeAlpha(this.canvasBuffer.data);
		//Draw swizzled buffer out as a test:
		this.requestDraw();
		this.checkRAF();
		//Success:
		return true;
	} catch (error) {
		//Failure:
		return false;
	}
}
GlueCodeGfx.prototype.setSmoothScaling = function (doSmoothing) {
	this.doSmoothing = doSmoothing;
	if (this.graphicsFound) {
		this.drawContextOnscreen.mozImageSmoothingEnabled = doSmoothing;
		this.drawContextOnscreen.webkitImageSmoothingEnabled = doSmoothing;
		this.drawContextOnscreen.imageSmoothingEnabled = doSmoothing;
	}
}
GlueCodeGfx.prototype.initializeAlpha = function (canvasData) {
	var length = canvasData.length;
	for (var indexGFXIterate = 3; indexGFXIterate < length; indexGFXIterate += 4) {
		canvasData[indexGFXIterate] = 0xFF;
	}
}
GlueCodeGfx.prototype.getBuffer = function (canvasContext, width, height) {
	//Get a CanvasPixelArray buffer:
	var buffer = null;
	try {
		buffer = this.drawContextOffscreen.createImageData(width, height);
	} catch (error) {
		buffer = this.drawContextOffscreen.getImageData(0, 0, width, height);
	}
	return buffer;
}
GlueCodeGfx.prototype.copyBuffer = function (buffer) {
	if (this.graphicsFound) {
		if (this.swizzledFrameFree.length == 0) {
			if (this.didRAF) {
				this.requestDrawSingle();
			} else {
				this.swizzledFrameFree.push(this.swizzledFrameReady.shift());
			}
		}
		var swizzledFrame = this.swizzledFrameFree.shift();
		var length = swizzledFrame.length;
		if (buffer.buffer) {
			swizzledFrame.set(buffer);
		} else {
			for (var bufferIndex = 0; bufferIndex < length; ++bufferIndex) {
				swizzledFrame[bufferIndex] = buffer[bufferIndex];
			}
		}
		this.swizzledFrameReady.push(swizzledFrame);
		if (!window.requestAnimationFrame) {
			this.requestDraw();
		} else if (!this.didRAF) {
			//Prime RAF draw:
			var parentObj = this;
			window.requestAnimationFrame(function () {
				if (parentObj.canvas) {
					parentObj.requestRAFDraw();
				}
			});
		}
	}
}
GlueCodeGfx.prototype.requestRAFDraw = function () {
	this.didRAF = true;
	this.requestDraw();
}
GlueCodeGfx.prototype.requestDrawSingle = function () {
	if (this.swizzledFrameReady.length > 0) {
		var canvasData = this.canvasBuffer.data;
		var bufferIndex = 0;
		var swizzledFrame = this.swizzledFrameReady.shift();
		var length = canvasData.length;
		for (var canvasIndex = 0; canvasIndex < length; ++canvasIndex) {
			canvasData[canvasIndex++] = swizzledFrame[bufferIndex++];
			canvasData[canvasIndex++] = swizzledFrame[bufferIndex++];
			canvasData[canvasIndex++] = swizzledFrame[bufferIndex++];
		}
		this.swizzledFrameFree.push(swizzledFrame);
		this.graphicsBlit();
	}
}
GlueCodeGfx.prototype.requestDraw = function () {
	this.requestDrawSingle();
	if (this.didRAF) {
		var parentObj = this;
		window.requestAnimationFrame(function () {
			if (parentObj.canvas) {
				parentObj.requestDraw();
			}
		});
	}
}
GlueCodeGfx.prototype.graphicsBlit = function () {
	if (this.canvasLastWidth != this.canvas.clientWidth || this.canvasLastHeight != this.canvas.clientHeight) {
		this.recomputeDimension();
		this.setSmoothScaling(this.doSmoothing);
	}
	if (this.offscreenWidth == this.onscreenWidth && this.offscreenHeight == this.onscreenHeight) {
		//Canvas does not need to scale, draw directly to final:
		this.drawContextOnscreen.putImageData(this.canvasBuffer, 0, 0);
	} else {
		//Canvas needs to scale, draw to offscreen first:
		this.drawContextOffscreen.putImageData(this.canvasBuffer, 0, 0);
		//Scale offscreen canvas image onto the final:
		this.drawContextOnscreen.drawImage(this.canvasOffscreen, 0, 0, this.onscreenWidth, this.onscreenHeight);
	}
}
GlueCodeGfx.prototype.initializeGraphicsBuffer = function () {
	//Initialize the first frame to a white screen:
	var swizzledFrame = this.swizzledFrameFree.shift();
	var length = swizzledFrame.length;
	for (var bufferIndex = 0; bufferIndex < length; ++bufferIndex) {
		swizzledFrame[bufferIndex] = 0xF8;
	}
	this.swizzledFrameReady.push(swizzledFrame);
}
GlueCodeGfx.prototype.checkRAF = function () {
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}


/*
Joy Pad
*/

var keyZones = []

function keyDown(e) {
	var keyCode = e.keyCode | 0;
	for (var keyMapIndex = 0;
		(keyMapIndex | 0) < 10; keyMapIndex = ((keyMapIndex | 0) + 1) | 0) {
		var keysMapped = keyZones[keyMapIndex | 0];
		var keysTotal = keysMapped.length | 0;
		for (var matchingIndex = 0;
			(matchingIndex | 0) < (keysTotal | 0); matchingIndex = ((matchingIndex | 0) + 1) | 0) {
			if ((keysMapped[matchingIndex | 0] | 0) == (keyCode | 0)) {
				Iodine.keyDown(keyMapIndex | 0);
				if (e.preventDefault) {
					e.preventDefault();
				}
			}
		}
	}
}

function keyUp(keyCode) {
	keyCode = keyCode | 0;
	for (var keyMapIndex = 0;
		(keyMapIndex | 0) < 10; keyMapIndex = ((keyMapIndex | 0) + 1) | 0) {
		var keysMapped = keyZones[keyMapIndex | 0];
		var keysTotal = keysMapped.length | 0;
		for (var matchingIndex = 0;
			(matchingIndex | 0) < (keysTotal | 0); matchingIndex = ((matchingIndex | 0) + 1) | 0) {
			if ((keysMapped[matchingIndex | 0] | 0) == (keyCode | 0)) {
				Iodine.keyUp(keyMapIndex | 0);
			}
		}
	}
}

function keyUpPreprocess(e) {
	var keyCode = e.keyCode | 0;
	switch (keyCode | 0) {
		default:
			//Control keys / other
			keyUp(keyCode);
	}
}

/*
ROM Load
*/


function attachBIOS(BIOS) {
	try {
		Iodine.attachBIOS(new Uint8Array(BIOS));
	} catch (error) {
		Iodine.attachBIOS(BIOS);
	}
}

function attachROM(ROM) {
	try {
		Iodine.attachROM(new Uint8Array(ROM));
	} catch (error) {
		Iodine.attachROM(ROM);
	}
}

function fileLoadShimCode(file, attachHandler) {
	if (typeof files != "undefined") {
		if (file.files.length >= 1) {
			//Gecko 1.9.2+ (Standard Method)
			try {
				var binaryHandle = new FileReader();
				binaryHandle.onloadend = function () {
					attachHandler(this.result);
				}
				binaryHandle.readAsArrayBuffer(file.files[file.files.length - 1]);
			} catch (error) {
				try {
					var result = file.files[file.files.length - 1].getAsBinary();
					var resultConverted = [];
					for (var index = 0; index < result.length; ++index) {
						resultConverted[index] = result.charCodeAt(index) & 0xFF;
					}
					attachHandler(resultConverted);
				} catch (error) {
					alert("Could not load the processed ROM file!");
				}
			}
		}
	}
}

function fileLoadBIOS() {
	fileLoadShimCode(this.files, attachBIOS);
}

function fileLoadROM(file) {
	fileLoadShimCode(file, attachROM);
}

function downloadFile(fileName, registrationHandler) {
	var ajax = new XMLHttpRequest();
	ajax.onload = registrationHandler;
	ajax.open("GET", fileName, true);
	ajax.responseType = "arraybuffer";
	ajax.overrideMimeType("text/plain; charset=x-user-defined");
	ajax.send(null);
	ajax.onreadystatechange = function () {
		if (ajax.readyState === XMLHttpRequest.DONE) {
			if (ajax.status === 404) {
				eclipseemu.dialog.alert("An error occured (" + ajax.status + ")")
			}
			console.log("ROM downloaded with HTTP status " + ajax.status);
		}
	}
}

function processDownload(parentObj, attachHandler) {
	try {
		attachHandler(new Uint8Array(parentObj.response));
	} catch (error) {
		var data = parentObj.responseText;
		var length = data.length;
		var dataArray = [];
		for (var index = 0; index < length; index++) {
			dataArray[index] = data.charCodeAt(index) & 0xFF;
		}
		attachHandler(dataArray);
	}
}


/*
Saves
*/


function ImportSaveCallback(name, game_id) {
	try {
		var save = findValue("SAVE_" + name);
		if (game_id != null) {
			setValue("SAVE_" + game_id, name.replace("TYPE_", ""));
		}
		if (save != null) {
			writeRedTemporaryText("Loaded save");
			return base64ToArray(save);
		} else {
			console.log("Save not loaded");
		}
	} catch (error) {
		alert("Could not read save: " + error.message);
	}
	return null;
}

function ExportSave() {
	if (eclipseemu.data.currentCore.game != null) {
		Iodine.exportSave(eclipseemu.data.currentCore.game.id);
	} else {
		Iodine.exportSave();
	}
	console.log('Game Saved');
}

function ExportSaveCallback(name, save, game_id) {
	if (name != "") {
		try {
			setValue("SAVE_" + name, arrayToBase64(save));
			if (game_id != null) {
				setValue("SAVE_" + game_id, name.replace("TYPE_", ""));
			}
		} catch (error) {
			alert("Could not store save: " + error.message);
		}
	}
}

function registerSaveHandlers() {
	Iodine.attachSaveExportHandler(ExportSaveCallback);
	Iodine.attachSaveImportHandler(ImportSaveCallback);
}
//Wrapper for localStorage getItem, so that data can be retrieved in various types.
function findValue(key) {
	try {
		if (localStorage.getItem(key) != null) {
			return JSON.parse(localStorage.getItem(key));
			console.log(JSON.parse(localStorage.getItem(key)));
		}
	} catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		if (globalStorage[location.hostname].getItem(key) != null) {
			return JSON.parse(globalStorage[location.hostname].getItem(key));
		}
	}
	return null;
}
//Wrapper for localStorage setItem, so that data can be set in various types.
function setValue(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		// console.log(key + " - " + value)
	} catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		globalStorage[location.hostname].setItem(key, JSON.stringify(value));
	}
}
//Wrapper for localStorage removeItem, so that data can be set in various types.
function deleteValue(key) {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		globalStorage[location.hostname].removeItem(key);
	}
}
// Text here
// Text here
// Text here
// Text here
// Text here
// Text here
// Text here
// Text here





"use strict";
var toBase64 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/", "="
];
var fromBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function base64(data) {
	try {
		var base64 = window.btoa(data); //Use this native function when it's available, as it's a magnitude faster than the non-native code below.
	} catch (error) {
		//Defaulting to non-native base64 encoding...
		var base64 = "";
		var dataLength = data.length;
		if (dataLength > 0) {
			var bytes = [0, 0, 0];
			var index = 0;
			var remainder = dataLength % 3;
			while (data.length % 3 > 0) {
				//Make sure we don't do fuzzy math in the next loop...
				data[data.length] = " ";
			}
			while (index < dataLength) {
				//Keep this loop small for speed.
				bytes = [data.charCodeAt(index++) & 0xFF, data.charCodeAt(index++) & 0xFF, data.charCodeAt(index++) & 0xFF];
				base64 += toBase64[bytes[0] >> 2] + toBase64[((bytes[0] & 0x3) << 4) | (bytes[1] >> 4)] + toBase64[((bytes[1] & 0xF) << 2) | (bytes[2] >> 6)] + toBase64[bytes[2] & 0x3F];
			}
			if (remainder > 0) {
				//Fill in the padding and recalulate the trailing six-bit group...
				base64[base64.length - 1] = "=";
				if (remainder == 2) {
					base64[base64.length - 2] = "=";
					base64[base64.length - 3] = toBase64[(bytes[0] & 0x3) << 4];
				} else {
					base64[base64.length - 2] = toBase64[(bytes[1] & 0xF) << 2];
				}
			}
		}
	}
	return base64;
}

function base64_decode(data) {
	try {
		var decode64 = window.atob(data); //Use this native function when it's available, as it's a magnitude faster than the non-native code below.
	} catch (error) {
		//Defaulting to non-native base64 decoding...
		var decode64 = "";
		var dataLength = data.length;
		if (dataLength > 3 && dataLength % 4 == 0) {
			var sixbits = [0, 0, 0, 0]; //Declare this out of the loop, to speed up the ops.
			var index = 0;
			while (index < dataLength) {
				//Keep this loop small for speed.
				sixbits = [fromBase64.indexOf(data.charAt(index++)), fromBase64.indexOf(data.charAt(index++)), fromBase64.indexOf(data.charAt(index++)), fromBase64.indexOf(data.charAt(index++))];
				decode64 += String.fromCharCode((sixbits[0] << 2) | (sixbits[1] >> 4)) + String.fromCharCode(((sixbits[1] & 0x0F) << 4) | (sixbits[2] >> 2)) + String.fromCharCode(((sixbits[2] & 0x03) << 6) | sixbits[3]);
			}
			//Check for the '=' character after the loop, so we don't hose it up.
			if (sixbits[3] >= 0x40) {
				decode64.length -= 1;
				if (sixbits[2] >= 0x40) {
					decode64.length -= 1;
				}
			}
		}
	}
	return decode64;
}

function arrayToBase64(arrayIn) {
	var binString = "";
	var length = arrayIn.length;
	for (var index = 0; index < length; ++index) {
		if (typeof arrayIn[index] == "number") {
			binString += String.fromCharCode(arrayIn[index]);
		}
	}
	return base64(binString);
}

function base64ToArray(b64String) {
	var binString = base64_decode(b64String);
	var outArray = [];
	var length = binString.length;
	for (var index = 0; index < length;) {
		outArray.push(binString.charCodeAt(index++) & 0xFF);
	}
	return outArray;
}