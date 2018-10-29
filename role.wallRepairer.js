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
            
            var walls = creep.room.find(FIND_STRUCTURES, { filter : (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART});
            var target = undefined;
            
            for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001) {
                
                // target = creep.pos.findClosestByPath(walls, { filter : (w) => w.hits / w.hitsMax < percentage });
                // target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter : (s) => s.structureType == STRUCTURE_WALL && s.hits / s.hitsMax < percentage})
                
                for (let wall of walls) {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall;
                        break;
                    }
                }
                
                if (target != undefined) {
                    break;
                }
            }
            
            if (target != undefined) {
            
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {maxRooms: 1});
                }
            } else {
                if (debug) {
                    console.log(creep.memory.role + " " + creep.name + " is a builder.");
                }
                roleBuilder.run(creep, debug);
            }
        }        
    }
};