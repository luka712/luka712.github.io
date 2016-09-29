

function Camera() {
       
    this.position =  vec3.fromValues(0, 5, 0)
    this.pitch = 0;
    this.roll = 0;
    this.yaw = 0;
    this.speed = 0.2;
    
}

Camera.prototype = {
    move: function () {
        if(Keyboard.isKeyDown("KeyW")){
            this.position[2] -= this.speed;
        }
        
        if(Keyboard.isKeyDown("KeyS")){
             this.position[2] += this.speed;
        }
        
        if(Keyboard.isKeyDown("KeyD")){
            this.position[0] += this.speed;
        }
        
        if(Keyboard.isKeyDown("KeyA")){
            this.position[0] -= this.speed;
        }
        
          
        if(Keyboard.isKeyDown("KeyR")){
            this.position[1] += this.speed;
        }
        
        if(Keyboard.isKeyDown("KeyF")){
            this.position[1] -= this.speed;
        }
    }
}
