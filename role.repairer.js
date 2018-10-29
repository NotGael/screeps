var roleBuilder = require('role.builder');

module.exports = {
    
    run: function(creep, debug) {

        if(!creep.memory.working && creep.carry.energy == 0) {
            if (debug) {
                console.log(creep.memory.role + " " + creep.name + " start harvesting.");
            }
            creep.memory.working = true;
        } else if (creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            if (debug) {
                console.log(creep.memory.role + " " + creep.name + " stop harvesting.");
            }
            creep.memory.working = false;
        }
        
        if (creep.memory.working) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {maxRooms: 1});
            }
        } else {
            var rampart = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < 10 && s.structureType == STRUCTURE_RAMPART })
            if (rampart != undefined) {
               if (creep.repair(rampart) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(rampart, {maxRooms: 1});
                }
            } else {
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL });
                if (structure != undefined) {
                    if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure, {maxRooms: 1});
                    }
                } else {
                    if (debug) {
                        console.log(creep.memory.role + " " + creep.name + " is a builder.");
                    }
                    roleBuilder.run(creep, debug);
                }   
            }
        }        
    }
};