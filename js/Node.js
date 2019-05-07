
var NodeType={square:0,circle:1}

var NODE_WIDTH=200;
var NODE_HEIGHT=300;



//class

var Node=function (){

    //constructor

    var Node=function(position,name="New node"){
        this.x=position.x;
        this.y=position.y;
        this.type=NodeType.square;
        this.width=NODE_WIDTH;
        this.height=NODE_HEIGHT;
        this.radius=NODE_WIDTH;
        this.name={
            content:name,
            size:{
                width:this.width,
                height:24
            },
            selected:false
        }
        this.color="red";
        
        this.inputLinks=[];
        this.outputLinks=[];


        return this;
    }

    Node.prototype.draw=function(ctx){
        ctx.fillStyle="lightblue";
        ctx.font=24*zoom+"px serif";
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
        
        if (this.name.selected){
            ctx.fillStyle="grey";
        }else{
            ctx.fillStyle="black";
        }
        ctx.fillText(this.name.content, gridOffset.x+(this.x+this.width/2)*zoom,gridOffset.y+this.y*zoom);
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

    Node.prototype.checkNameCollision=function(mousePosition){
        return (mousePosition.x>=this.x*zoom+gridOffset.x) && (mousePosition.x<=(this.x+this.name.size.width)*zoom+gridOffset.x) && (mousePosition.y>=this.y*zoom+gridOffset.y) && (mousePosition.y<=(this.y+this.name.size.height)*zoom+gridOffset.y);
    }

    
    return Node;
}();