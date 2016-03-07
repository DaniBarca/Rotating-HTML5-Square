function SQMatrix(n){
    this.size = n*n;
    
    this.m = [];
    
    this.rows = n;
    this.cols = n;
    
    for(i = 0; i < this.size; ++i){
        this.m[i] = 0;
    }
}

SQMatrix.prototype.clone = function(mB){
    this.size = mB.size;
    this.rows = mB.rows;
    this.cols = mB.cols;
    this.m    = mB.getArr();
};

SQMatrix.prototype.clear = function(){
    for(i = 0; i < this.size; ++i){
        this.m[i] = 0;
    }
};

SQMatrix.prototype.setIdentity = function(){
    r = 0; c = 0;
    this.clear();
    while(r < this.rows && c < this.cols){
        this.set(r,c,1);
        r++;
        c++;
    }
};

SQMatrix.prototype.get = function(r,c){
    return this.m[r*this.cols + c];
};

SQMatrix.prototype.set = function(r,c,v){
    this.m[r*this.cols + c] = v;
};

SQMatrix.prototype.getArr = function(){
    return this.m;
};

SQMatrix.prototype.traspose = function(){
    var mB = new SQMatrix(1);
    mB.clone(this);
    
    for(r = 0; r < this.rows; ++r){
        for(c = 0; c < this.cols; ++c){
            this.set(c,r,mB.get(r,c));
        }
    }
};

//--Matrix33 has its own algoritm for multiplication--
SQMatrix.prototype.mult = function(mB){
    var res = new SQMatrix(this.rows);
    
    var temp;
    for(r = 0; r < this.rows; ++r){
        for(c = 0; c < this.cols; ++c){
            temp = 0;
            for(t = 0; t < this.cols; ++t){
                temp += this.get(r,t) * mB.get(t,c);
            }
            res.set(r,c,temp);
        }
    }
    
    return res;
};

SQMatrix.prototype.multVector = function(v){
    var res = [];

    var temp;
    for(r = 0; r < this.rows; ++r){
        temp = 0;
        for(t=0; t<this.cols; ++t){
            temp += this.get(r,t) * v[t];
        }
        res[r] = temp;
    }
    return res;
};

SQMatrix.prototype.print = function(){
    for(r = 0; r < this.rows; ++r){
        s = "";
        for(c = 0; c < this.cols; ++c){
            s += this.get(r,c);
        }
        console.log(s+"\n");
    }
};

Matrix33.prototype = new SQMatrix();
Matrix33.prototype.constructor = Matrix33();
function Matrix33(){
    this.size = 9;
    this.m = new Array(this.size);
    
    this.cols = 3;
    this.rows = 3;
    
   for(i = 0; i < this.size; ++i){
        this.m[i] = 0;
    }
}

/* This method erases previous data inside the matrix.
 * radians: rotation angle in rads
 * axis:    3 position Array with 1,0 values where:
 * axis[0] => x
 * axis[1] => y
 * axis[2] => z
 */
Matrix33.prototype.setRotationMatrix = function(radians, axis){
    this.setIdentity();
    
    var sinr = Math.sin(radians); sinr = (sinr === 0) ? 0 : sinr;
    var cosr = Math.cos(radians); cosr = (cosr === 0) ? 0 : cosr;
    
    var aux = new Matrix33();
    aux.setIdentity();

    if(axis[0] == 1){
        aux.set(1,1,cosr); aux.set(1,2,-sinr);
        aux.set(2,1,sinr); aux.set(2,2, cosr);
        this.clone(aux);
    }
    if(axis[1] == 1){
        aux.set(0,0, cosr); aux.set(0,2, sinr);
        aux.set(2,0,-sinr); aux.set(2,2, cosr);
        this.clone(aux);
    }
    if(axis[2] == 1){
        aux.set(0,0, cosr); aux.set(0,1,-sinr);
        aux.set(1,0, sinr); aux.set(1,1, cosr);
        this.clone(aux);
    }
};

Matrix33.prototype.setRotation = function(radians, axis){
    var x = this.m[2];
    var y = this.m[5];
    
    this.setRotationMatrix(radians,axis);
    this.setPosition(x,y);
};

Matrix33.prototype.rotate = function(radians, axis){
    var rm = new Matrix33();
    rm.setRotationMatrix(radians,axis);
    this.clone(this.mult(rm));
};

/* For a local rotation:
 * 1: Put the Matrix at 0,0 coordinates
 * 2: Rotate the matrix normally
 * 3: Reset previous position
 */
Matrix33.prototype.rotateLocal = function(radians, axis){
    this.rotateFrom(radians,axis,0,0);
};

/*
 * The same as the rotateLocal, but lets you decide the rotation point
 * That's because sometimes we want to make an object rotate from its center.
 * Or another arbitrary point.
 */
Matrix33.prototype.rotateFrom = function(radians,axis,sx,sy){
    var x = this.m[2];
    var y = this.m[5];

    this.setPosition(sx,sy);
    this.rotate(radians, axis);
    this.setPosition(x,y);
};

Matrix33.prototype.setTranslationMatrix = function(x,y){
    this.setIdentity();
    this.setPosition(x,y);
};

Matrix33.prototype.setPosition = function(x,y){
    this.m[2] = x;
    this.m[5] = y;
};

/*
 * @returns array
 */
Matrix33.prototype.getPosition = function(){
    return [this.m[2],this.m[5]];
};

/* Be sure to understand the difference between translate and translateLocal
 * before touching anything. It's important.
 */
Matrix33.prototype.translateLocal = function(x,y){
    var t = new Matrix33();
    t.setTranslationMatrix(x,y);
    this.clone(this.mult(t));
};

Matrix33.prototype.translate = function(x,y){
    m[2] += x;
    m[5] += y;
};



//Cosas que se le ocurren a uno, y que no funcionan muy allá

var multiplyThread = function(o,res,mA,mB,callback){
    setTimeout(function() {
        res.m[o[0]] = mA.m[o[1]] * mB.m[o[2]] + mA.m[o[3]] * mB.m[o[4]] + mA.m[o[5]] * mB.m[o[6]];
        callback();
    }, 0);
}

Matrix33.prototype.multThread = function(mB){
    var res = new Matrix33();

    var order = [
        [0,0,0,1,3,2,6],
        [1,0,1,1,4,2,7],
        [2,0,2,1,5,2,8],
        [3,3,0,4,3,5,6],
        [4,3,1,4,4,5,7],
        [5,3,2,4,5,5,8],
        [6,5,0,7,3,8,6],
        [7,5,1,7,4,8,7],
        [8,5,2,7,5,8,8]
    ];

    var done = 0;
    var isFinished = function(){
        done++;
    }

    for(i = 0; i < 9; ++i){
        multiplyThread(order[i],res,this,mB, isFinished);
    }

    while(done < order.length-1){}

    return res;
}

Matrix33.prototype.mult = function(mB){
    var res = new Matrix33();

    res.m[0] = this.m[0] * mB.m[0] + this.m[1] * mB.m[3] + this.m[2] * mB.m[6];
    res.m[1] = this.m[0] * mB.m[1] + this.m[1] * mB.m[4] + this.m[2] * mB.m[7];
    res.m[2] = this.m[0] * mB.m[2] + this.m[1] * mB.m[5] + this.m[2] * mB.m[8];
    res.m[3] = this.m[3] * mB.m[0] + this.m[4] * mB.m[3] + this.m[5] * mB.m[6];
    res.m[4] = this.m[3] * mB.m[1] + this.m[4] * mB.m[4] + this.m[5] * mB.m[7];
    res.m[5] = this.m[3] * mB.m[2] + this.m[4] * mB.m[5] + this.m[5] * mB.m[8];
    res.m[6] = this.m[5] * mB.m[0] + this.m[7] * mB.m[3] + this.m[8] * mB.m[6];
    res.m[7] = this.m[5] * mB.m[1] + this.m[7] * mB.m[4] + this.m[8] * mB.m[7];
    res.m[8] = this.m[5] * mB.m[2] + this.m[7] * mB.m[5] + this.m[8] * mB.m[8];
    
    return res;
};