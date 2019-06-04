const BUTTON_HEIGHT=30;




var Button=function(){
    var Button=function(content,node,id=Button.lastId++){
        this.content=content;
        this.node=node;
        this.size={width:this.node.width*0.8,height:24}
        this.relativePosition={
            x:this.node.width*0.1,
            y:this.node.leftOffset
        };
        this.node.leftOffset+=BUTTON_HEIGHT;
        this.hovered=false;
        this.color="white";
        this.id=id;
        return this;
    }


    Button.hoveredButton=null;
    Button.prototype.onClick=null;
    Button.lastId=0;

    Button.prototype.draw=function(ctx){
        ctx.textAlign=TextAlignment.Center;
        ctx.fillStyle="green";
        let localOffset=0;
            
                
        let textSize=ctx.measureText(this.content);
        ctx.fillStyle=this.color;
        ctx.fillRect(gridOffset.x+(localOffset+this.relativePosition.x+this.node.x)*zoom,gridOffset.y+(this.relativePosition.y+this.node.y)*zoom,this.size.width*zoom,24*zoom);
        ctx.fillStyle="black";
        ctx.fillText(this.content,gridOffset.x+this.size.width*zoom/2+(this.relativePosition.x+this.node.x)*zoom,gridOffset.y+(this.relativePosition.y+this.node.y)*zoom);
    }

    Button.prototype.checkMouseCollision=function(mousePosition){
        let x=(this.node.x+this.relativePosition.x)*zoom+gridOffset.x;
        let y=(this.node.y+this.relativePosition.y)*zoom+gridOffset.y;
        let colliding=(mousePosition.x>=x) && (mousePosition.x<=x+this.size.width*zoom) && (mousePosition.y>=y) && (mousePosition.y<=y+this.size.height*zoom);
        if (colliding){
            if (Button.hoveredButton==null){
                this.onMouseEnter();
            }
            
        }else{
            if (Button.hoveredButton==this){
                this.onMouseLeave();
            }
        }
        this.hovered=colliding;
        
        return colliding;
    }

    Button.prototype.onMouseEnter=function(){
        Button.hoveredButton=this;
        canvas.style.cursor="pointer";
    }

    Button.prototype.onMouseLeave=function(){
        Button.hoveredButton=null;
        canvas.style.cursor="default";
    }

    Button.prototype.onMouseDown=function(){
        this.onClick();
    }

    return Button;
}();