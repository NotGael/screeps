var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep, debug) {
        
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            
            var exit = creep.room.findExitTo(creep.memory.target);
            
            creep.moveTo(creep.pos.findClosestByRange(exit));
        } else {

            if (!creep.memory.working && creep.carry.energy == 0) {
                
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
                var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (constructionSite != undefined) {
                    if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite, {maxRooms: 1});
                    }     
                } else {
                    
                    if (debug) {
                        console.log(creep.memory.role + " " + creep.name + " is an upgrader.");
                    }
                    roleUpgrader.run(creep, debug);
                }
            }    
        }
    }
};