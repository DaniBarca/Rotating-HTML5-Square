/********
 ********Plantilla básica
 ********

function World(width,height){
    this.width = width;
    this.height= height;

    //Aquí, instanciamos los elementos de nuestro juego
    //Normalmente serán objetos con su propio update y su propio draw
}

//delta: diferencia de tiempo entre updates
World.prototype.update = function(delta){
    //Lo que queremos que ocurra en cada frame
}

//ctx: El contexto del canvas
World.prototype.draw = function(ctx){
    //Lo que queremos que se dibuje en cada frame (después del update)
}
*/


function World(width,height){
    this.width = width;
    this.height= height;

    CoreInstance(width*0.5,height*0.5);
}

//delta: diferencia de tiempo entre updates
World.prototype.update = function(delta){
    //Lo que queremos que ocurra en cada frame
    CoreInstance().update(delta);
}

//ctx: El contexto del canvas
World.prototype.draw = function(ctx){
    //Lo que queremos que se dibuje en cada frame (después del update)
    CoreInstance().draw(ctx);
}