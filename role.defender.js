module.exports = {
    
    run: function(creep, debug) {
        
        if (creep.body.lastIndexOf.hits < 33) {
            
            creep.heal(creep);
        } else {
            console.log('Look for enemies.');
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            console.log(target);
                
            if (target != undefined) {
                
                if (debug == true) {
                    
                    console.log('Hostile in the room!');
                    console.log(target);
                    console.log(creep.attack(target));
                }
                
                if (creep.attack(target) < 0) {
                    
                    if (debug == true) {
                    
                        console.log(creep.rangedAttack(target));
                    }
                    
                    if (creep.rangedAttack(target) < 0) {
                    
                        if (debug == true) {
                            
                            console.log('Moving to nearest enemy.')
                        }
                        
                        creep.moveTo(target, {maxRooms: 1});
                    }
                }
            } else {
                
                if (debug) {
                    
                    console.log('No hostile in the room.')
                }
            }
        }
    }
};