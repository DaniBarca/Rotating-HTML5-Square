function CoreInstance(x,y){
    if(this.coreInstance === undefined)
        this.coreInstance = new Core(x,y);
    return this.coreInstance;
};

Core.prototype   = new GObject();
Core.constructor = Core();
function Core(x,y){
    GObject.call(this,x,y);
    
    this.toString = "Core" + this.id;
    
    this.r = 0;
    this.size = 50;
}

Core.prototype.update = function(delta){
    if(this.r > GObject.tau)
        this.r = 0;
    this.r+=0.005;

    var sin = Math.sin(this.r);

    if((this.size = Math.abs(sin * 50) + 30) < 50)
        this.size = 50;

    this.mt.rotateFrom(sin*0.004*delta,[0,0,1],25,25);
};

Core.prototype.draw = function(ctx){
    this.setTransform(ctx);

    ctx.fillStyle   = "#4CCCAE";
    ctx.fillRect(-this.size*0.5,-this.size*0.5,this.size,this.size);
    
    ctx.fill();
}