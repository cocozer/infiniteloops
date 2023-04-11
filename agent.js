function Agent(xpos, ypos, xvel, yvel){
  
  this.pos = new p5.Vector(xpos, ypos);
  this.vel = new p5.Vector(xvel, yvel);
  
  this.draw = function(){
    ellipse(this.pos.x, this.pos.y, 2,2);
  }
  
  this.applyForce = function(force) {
    this.vel.add(force);
  }
  
  this.move3 = function(){
  	this.pos.add(this.vel); // vector addition
    this.vel.mult(friction); // decelerate
    // wrap
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y < 0) this.pos.y = height;
  }
  
  this.move2 = function(){
  	this.pos.add(this.vel); // vector addition
    this.pos.add(this.vel); // vector addition
    this.vel.mult(friction); // decelerate
    // wrap
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y < 0) this.pos.y = height;
  }
  this.move = function() {
    // Calculate the vector from the agent to the center of the circle
    var toCircle = createVector(circleX, circleY).sub(this.pos);

    // If the agent is within a certain distance of the circle, apply a force towards the circle
    if (toCircle.mag() < 200) {
      var attraction = toCircle.copy().normalize().mult(0.02);
      this.applyForce(attraction);
    }

    // Update position and velocity
    this.vel.mult(friction);
    this.pos.add(this.vel);

    // Wrap around the edges of the canvas
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }
  
  
  this.avoid = function(){ // avoidance - don't get too close to your neighbours
    var avoidVec = createVector(); // vector to store avoidance force 
    for (var neighbour of swarm){ // run through the swarm
      var nd = this.pos.dist(neighbour.pos); // neighbour distance
      if (nd < avoidRadius && nd > 0){// ignore neighbours that are far away
        var pushVec = p5.Vector.sub(this.pos,neighbour.pos); // repulsive push away from close neighbours
        pushVec.normalize(); // scale to 1
        avoidVec.add(pushVec); // add this push to the total avoidance 
      } 
		}
	  avoidVec.normalize(); //scale to 1.0
    avoidVec.mult(avoidStrength); // multiply by the strength variable
    this.vel.add(avoidVec); // add to velocity
  }
  
}