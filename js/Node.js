
var NodeType={square:0,circle:1}

var NODE_WIDTH=50;
var NODE_HEIGHT=50;



//class

var Node=function (){

    //constructor

    var Node=function(position){
        this.name="newNode";
        this.x=position.x;
        this.y=position.y;
        this.type=NodeType.square;
        this.width=NODE_WIDTH;
        this.height=NODE_HEIGHT;
        this.radius=NODE_WIDTH;

        this.color="red";
        
        this.inputLinks=[];
        this.outputLinks=[];


        return this;
    }

    Node.prototype.draw=function(ctx){
        switch(this.type){
            case NodeType.square:
                ctx.fillRect(gridOffset.x+this.x*zoom,gridOffset.y+this.y*zoom,this.width*zoom,this.height*zoom);
                
            break;
            case NodeType.circle:
                ctx.beginPath();
                ctx.arc(gridOffset.x+this.x*zoom,gridOffset.y+this.y*zoom,this.radius*zoom,0,Math.PI*2);
                ctx.stroke();
            break;
        }
    }

    Node.prototype.checkMouseCollision=function(mousePosition){
        let colliding;
        switch(this.type){
            case NodeType.square:
                colliding=(mousePosition.x>=this.x*zoom+gridOffset.x) && (mousePosition.x<=(this.x+this.width)*zoom+gridOffset.x) && (mousePosition.y>=this.y*zoom+gridOffset.y) && (mousePosition.y<=(this.y+this.height)*zoom+gridOffset.y);
            break;
            case NodeType.circle:
                colliding=Math.sqrt((mousePosition.x-this.x*zoom+gridOffset.x)**2 + (mousePosition.y-this.y*zoom+gridOffset.y)** 2)<this.radius*zoom;
            break;
        }

        return colliding;
    }

    
    return Node;
}();