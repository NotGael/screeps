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
            
            if (creep.room.name == creep.memory.target) {
                
                var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
                
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    
                    creep.moveTo(source, {maxRooms: 1});
                }
            } else {
                
                var exit = creep.room .findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        } else {
            
            if (creep.room.name == creep.memory.home) {
                
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter : (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity });
                
                if (structure != undefined) {
                    
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        
                        creep.moveTo(structure, {maxRooms: 1});
                    }   
                }    
            } else {
                
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            
            
        }        
    }
};