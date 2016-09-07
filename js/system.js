/*
 JsAlto Xerox Alto Emulator
 Copyright (C) 2016  Seth J. Morabito

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see
 <http://www.gnu.org/licenses/>.
*/

//
// An Alto System
//

var altoSystem = function() {

    memoryBus.addDevice(memory);
    memoryBus.addDevice(keyboard);
    memoryBus.addDevice(mouse);
    memoryBus.addDevice(musicInterface);

    var pack = null;

    // Optionally load the system from the URL

    var system = {
        instTrace: false,
        diskTrace: false,

        clockedDevices: [
            memoryBus,
            cpu
        ],

        reset: function() {
            scheduler.reset();

            memoryBus.reset();
            memory.reset();
            alu.reset();
            shifter.reset();
            cpu.reset();
            diskController.reset();
            displayController.reset();
            uCodeMemory.reset();
            altoDisplay.reset();
            mouse.reset();
            keyboard.reset();
            musicInterface.reset();
        },

        step: function() {
            for (var i = 0; i < this.clockedDevices.length; i++) {
                this.clockedDevices[i].clock();
            }
            scheduler.clock();
            this.clocks++;
        },

        run: function(count) {
            for (var i = 0; i < count; i++) {
                this.step();
            }
        },

        stop: function() {
            this.run = false;
        },

        loadPack: function(url) {
            "use strict";

            if (url) {
                pack = new DiabloPack(DiabloDiskType.DIABLO_31);
                console.log("Downloading file " + url + "...");
                pack.load(url, false, function() {
                    console.log("Done.");
                    diskController.drives[0].loadPack(pack);
                });
            }

        }
    };

    system.reset();

    return system;
};