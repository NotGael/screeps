module.exports = function() {
    
    StructureSpawn.prototype.createCustomCreep = function (energy, roleName) {
        
        var numberOfParts = Math.floor(energy / 200);
        var body = [];
        
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, { role: roleName, working: true });
    };
    
    StructureSpawn.prototype.createCustomTargetCreep = function (energy, roleName, target) {
        
        var numberOfParts = Math.floor(energy / 400);
        var body = [];
        
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, { role: roleName, working: true, target: target });
    };
    
    StructureSpawn.prototype.createLongDistanceHarvester = function (energy, numberOfWorkParts, home, target, sourceIndex) {

        var body = [];
        
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }
        
        energy -= 150 * numberOfWorkParts;
        
        var numberOfParts = Math.floor(energy / 100);

        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
            body.push(MOVE);
        }
        
        return this.createCreep(body, undefined, { role: 'longDistanceHarvester', home: home, target: target, sourceIndex: sourceIndex, working: true });
    };
    
    StructureSpawn.prototype.createClaimer = function (target) {

        return this.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', target: target });
    };
    
    StructureSpawn.prototype.createDefender = function (energy) {

        var numberOfHealParts = 1;
        
        if (energy <= 300) {
            
            numberOfHealParts = 0;
        }
        
        var numberOfParts = Math.floor((energy - numberOfHealParts * 250) / 290);
        var numberOfToughParts = Math.floor((energy - (numberOfHealParts * 250 + numberOfParts * 280)) / 10);
        var body = [];
        
        for (let i = 0; i < numberOfHealParts; i++) {
            body.push(HEAL);//250
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE); //50
            body.push(ATTACK);//80
            body.push(RANGED_ATTACK);//150 
        }
        for (let i = 0; i < numberOfToughParts; i++) {
            body.push(TOUGH);//10
        }

        return this.createCreep(body, undefined, { role: 'defender' });
    };
};