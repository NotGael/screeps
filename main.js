// import modules
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var roleClaimer = require('role.claimer');
var roleDefender = require('role.defender');

var HOME = Game.spawns.Spawn1.room.name;
var E38N33 = 'E38N33';

module.exports.loop = function () {
    
    var debug = true;
    var enemyToStrong = true;
        
    // Clear memory
    for (let name in Memory.creeps) {
        
        if (Game.creeps[name] == undefined) {
            
            delete Memory.creeps[name];
        }    
    }
    
    // Creeps actions
    for (let name in Game.creeps) {
    
        var creep = Game.creeps[name];
    
        if (creep.memory.role == 'harvester') {
                
            roleHarvester.run(creep, debug);
        } else if (creep.memory.role == 'upgrader') {
                
            roleUpgrader.run(creep, debug);
        } else if (creep.memory.role == 'builder') {
                
            roleBuilder.run(creep, debug);
        } else if (creep.memory.role == 'repairer') {
                
            roleRepairer.run(creep, debug);
        } else if (creep.memory.role == 'wallRepairer') {
                
            roleWallRepairer.run(creep, debug);
        } else if (creep.memory.role == 'longDistanceHarvester') {
                
            roleLongDistanceHarvester.run(creep, debug);
        } else if (creep.memory.role == 'claimer') {
                
            roleClaimer.run(creep, debug);
        } else if (creep.memory.role == 'defender') {
            
            roleDefender.run(creep, debug);
        }
    }
    
    for (let spawnName in Game.spawns) {
        
        let spawn = Game.spawns[spawnName];
        let myCreepsInRoom = spawn.room.find(FIND_MY_CREEPS);
        let hostileCreepsInRoom = spawn.room.find(FIND_HOSTILE_CREEPS);
        
        var numberOfHarvesters = _.sum(myCreepsInRoom, (c) => c.memory.role == 'harvester');
        var numberOfUpgraders = _.sum(myCreepsInRoom, (c) => c.memory.role == 'upgrader');
        var numberOfBuilders = _.sum(myCreepsInRoom, (c) => c.memory.role == 'builder');
        var numberOfRepairers = _.sum(myCreepsInRoom, (c) => c.memory.role == 'repairer');
        var numberOfWallRepairers = _.sum(myCreepsInRoom, (c) => c.memory.role == 'wallRepairer');
        var numberOfLongDistanceHarvestersE38N33 = _.sum(Game.creeps, (c) => c.my && c.memory.role == 'longDistanceHarvester' && c.memory.target == 'E38N33');
        var numberOfClaimers = _.sum(Game.creeps, (c) => c.my && c.memory.role == 'claimer');
        var numberOfDefenders = _.sum(myCreepsInRoom, (c) => c.memory.role == 'defender');
        var numberOfInitRoomHarvesters = 0;
        var numberOfInitRoomUpgraders = 0;
        var numberOfInitRoomBuilders = 0;
        
        if (spawn.memory.initRoom != undefined) {
            
            var numberOfInitRoomHarvesters = _.sum(Game.creeps, (c) => c.my && c.memory.role == 'harvester' && c.memory.target == spawn.memory.initRoom);
            var numberOfInitRoomUpgraders = _.sum(Game.creeps, (c) => c.my && c.memory.role == 'upgrader' && c.memory.target == spawn.memory.initRoom);
            var numberOfInitRoomBuilders = _.sum(Game.creeps, (c) => c.my && c.memory.role == 'builder' && c.memory.target == spawn.memory.initRoom);
        }
        
        if (debug) {
            
            console.log('________________________________________________________________');
            console.log('________________________________________________________________');
            console.log(spawnName);
            console.log(' ');
            console.log('Harvesters : ' + numberOfHarvesters);
            console.log('Upgraders : ' + numberOfUpgraders);
            console.log('Builders : ' + numberOfBuilders);
            console.log('Repairers : ' + numberOfRepairers);
            console.log('Wall repairers : ' + numberOfWallRepairers);
            
            if (spawn.name == 'Spawn1') {
                
                console.log('Long distance harvesters E38N33 : ' + numberOfLongDistanceHarvestersE38N33);
            }
            
            if (numberOfClaimers > 0) {

                console.log('Claimers : ' + numberOfClaimers);
            }
            
            if (numberOfDefenders > 0) {
                
                console.log('Defender : ' + numberOfDefenders);
            }
            
            if (spawn.memory.initRoom != undefined) {
                
                console.log('Init. room harvesters ' + spawn.memory.claimRoom + ' : ' + numberOfInitRoomHarvesters);
                console.log('Init. room upgraders  ' + spawn.memory.claimRoom + ' : ' + numberOfInitRoomUpgraders);
                console.log('Init. room builders  ' + spawn.memory.claimRoom + ' : ' + numberOfInitRoomBuilders);
            }
            
            console.log('________________________________________________________________');
            console.log(' ');
        }
    
        // Defences
        
        var towers = Game.rooms[HOME].find(FIND_STRUCTURES, { filter : (s) => s.structureType == STRUCTURE_TOWER });
        
        for (let tower of towers) {
            
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            if (target != undefined) {
                
                tower.attack(target);
            }
        }
        
        // Creeps generation
        
        if (spawn.memory.minimumNumberOfHarvesters == undefined) {
            
            spawn.memory.minimumNumberOfHarvesters = 4;
        } else if (spawn.memory.minimumNumberOfUpgraders == undefined) {
            
            spawn.memory.minimumNumberOfHarvesters = 1;
        } else if (spawn.memory.minimumNumberOfBuilders == undefined) {
            
            spawn.memory.minimumNumberOfBuilders = 1;
        } else if (spawn.memory.minimumNumberOfRepairers == undefined) {
            
            spawn.memory.minimumNumberOfRepairers = 1;
        } else if (spawn.memory.minimumNumberOfWallRepairers == undefined) {
            
            spawn.memory.minimumNumberOfWallRepairers = 1;
        }
        
        var name = undefined;
        var energy = spawn.room.energyCapacityAvailable;

        if (numberOfHarvesters < spawn.memory.minimumNumberOfHarvesters) {
            
            name = spawn.createCustomCreep(energy, 'harvester');
            
            if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
                
                name = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester');
            }
        } else if (enemyToStrong == false && numberOfDefenders < hostileCreepsInRoom.length) {
            
            name = spawn.createDefender(energy);
        } else if (spawn.memory.claimRoom != undefined) {
          
            name = spawn.createClaimer(spawn.memory.claimRoom);
            
            if (!(name < 0)) {
                
                spawn.memory.initRoom = spawn.memory.claimRoom;
                delete spawn.memory.claimRoom;
            }
        } else if (numberOfUpgraders < spawn.memory.minimumNumberOfUpgraders) {
            
            name = spawn.createCustomCreep(energy, 'upgrader');
        } else if (spawn.memory.initRoom != undefined && numberOfInitRoomHarvesters < spawn.memory.minimumNumberOfInitRoomHarvesters) {
            
            name = spawn.createCustomTargetCreep(energy, 'harvester', spawn.memory.initRoom);
        } else if (spawn.memory.initRoom != undefined && numberOfInitRoomUpgraders < spawn.memory.minimumNumberOfInitRoomUpgraders) {
            
            name = spawn.createCustomTargetCreep(energy, 'upgrader', spawn.memory.initRoom);
        } else if (spawn.memory.initRoom != undefined && numberOfInitRoomBuilders < spawn.memory.minimumNumberOfInitRoomBuilders) {    
            
            name = spawn.createCustomTargetCreep(energy, 'builder', spawn.memory.initRoom);
        } else if (numberOfRepairers < spawn.memory.minimumNumberOfRepairers) {
            
            name = spawn.createCustomCreep(energy, 'repairer');
        } else if (numberOfBuilders < spawn.memory.minimumNumberOfBuilders) {
            
            name = spawn.createCustomCreep(energy, 'builder');
        } else if (numberOfWallRepairers < spawn.memory.minimumNumberOfWallRepairers) {
            
            name = spawn.createCustomCreep(energy, 'wallRepairer');
        } else if (spawn.name == 'Spawn1' && numberOfLongDistanceHarvestersE38N33 < spawn.memory.minimumNumberOfLongDistanceHarvestersE38N33) {
    
            name = spawn.createLongDistanceHarvester(energy, 3, HOME, E38N33, 0);
            //name = spawn.createLongDistanceHarvester(energy, 3, spawn.room.name, E38N33, 0);
        } else {
            
            name = spawn.createCustomCreep(energy, 'builder');
        }
           
        // End log
        if (debug) {
            
            console.log('________________________________________________________________');
            console.log('________________________________________________________________');
            console.log(' ');
            console.log(' ');
        }
    }
}