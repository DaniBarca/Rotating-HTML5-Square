/*

Un GameObject es un objeto básico de nuestro juego, y todos los demás objetos derivarán de este
Todos los GameObject disponen de una matriz de transformación, la cual contiene toda la información
sobre la posición, rotación y escalado del objeto.

Antes de pintar un objeto determinado, deberemos utilizar el método setTransform para que el canvas sepa cual es su posición y orientación

Incluye los métodos
* **Clone**: Para copiar el objeto sin referenciarlo.
* **setPosition**: Para definir una posición respecto al Mundo.
* **setPositionV**: Lo mismo, pero permite definirla a través de un Array de 2 elementos.
* **lookTo**: Modifica la matriz de tal modo que apunte hacia el punto que le hemos especificado.
* **rotate**: Rota la matriz un cierto número de grados (en radianes) y en el eje "axis", especificado con un array de tres 1 o 0: [1,0,0] para el eje x, [0,1,0] para el y, etc.
* **move**: Cambia la posición de la matriz de forma local. Tenemos que visualizar unos ejes imaginarios sobre el objeto, si el objeto está rotado y movemos sobre x, el objeto no se moverá horizontalmente, sino hacia donde apunte este eje teniendo en cuenta la rotación. Es lo más útil para hacer un juego.
* **beMoved**: A diferencia del anterior, simplemente suma x e y a la posición actual. Si movemos sobre x, el objeto se moverá horizontalmente independientemente de su rotación.
* **setTransform**: Como hemos mencionado antes, "avisa" al canvas HTML5 sobre cómo tiene que pintar el objeto.

*/

function GObject(x,y){
    this.mt = new Matrix33();
    this.mt.setIdentity();
    this.mt.setPosition(x,y);

    this.id = this.idCount;
    
    this.idCount++;
    
    this.toString = "GObject" + this.idCount.toString();
}
GObject.idCount = 0;
GObject.tau = 2*Math.PI;

GObject.prototype.clone = function(b){
    this.mt = b.mt;
    this.id = b.id;
    this.toString = b.toString;
};

GObject.prototype.setPosition = function(x,y){
    this.mt.setPosition(x,y);
};

GObject.prototype.setPositionV = function(pos){
    this.mt.setPosition(pos[0],pos[1]);
};


GObject.prototype.lookTo = function(x,y){
    var pos = this.mt.getPosition();
    this.mt.setRotation(Math.atan2(y-pos[1], x-pos[0]),[0,0,1]);
};

/* We assume that coder is refering to a local rotation.
 * If you want a global rotation you can do it with (GObject).mt.rotate(radians,axis);
 */
GObject.prototype.rotate = function(radians,axis){
    this.mt.rotateLocal(radians,axis);
};

/* Not understanding the difference between move and beMoved can
 * induce unexpected behaviour.
 */
GObject.prototype.move = function(x,y){
    this.mt.translateLocal(x,y);
};

GObject.prototype.beMoved = function(x,y){
    this.mt.translate(x,y);
};

GObject.prototype.setTransform = function(ctx){
    ctx.setTransform(this.mt.get(0,0),
                 this.mt.get(1,0),
                 this.mt.get(0,1),
                 this.mt.get(1,1),
                 this.mt.get(0,2),
                 this.mt.get(1,2)
    );
};