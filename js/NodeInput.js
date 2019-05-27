const NODE_INPUT_HEIGHT=30;
const NODE_INPUT_RADIUS=7;


var NodeInput=function(){

    var NodeInput=function(node,name,propertyType){
        this.name=name;
        this.link=null;
        this.propertyType=propertyType;
        this.node=node;
        let inputsCount=node.inputs.length;
        this.relativePosition={
            x:10,
            y:inputsCount*NODE_INPUT_HEIGHT+40
        };
        this.property;

        switch(this.propertyType){
            case PropertyType.CharacterReference:

            break;

            case PropertyType.InputField:
                this.property=new InputField(this.node,{x:this.relativePosition.x,y:this.relativePosition.y+10},{width:this.node.width-20,height:100},TextAlignment.Left,22);
            break;
        }
        return this;
    };

    NodeInput.prototype.draw=function(ctx){
        ctx.fillStyle="black";
        ctx.font = 22*zoom+'px serif';
        let x=gridOffset.x+(this.node.x+this.relativePosition.x)*zoom;
        let y=gridOffset.y+(this.node.y+this.relativePosition.y)*zoom;
        ctx.textAlign="left";
        ctx.beginPath();
        ctx.arc(x,y,NODE_INPUT_RADIUS*zoom,0,Math.PI*2);
        ctx.stroke();
        ctx.fillText(this.name,x+20*zoom,y-10*zoom);
        if (this.property!=null){
            this.property.draw(ctx);
        }
        
    };

    NodeInput.prototype.checkMouseCollision=function(mousePosition){
        if (this.property!=null){
            this.property.checkMouseCollision(mousePosition);
        }
        return Math.pow(mousePosition.x-(this.relativePosition.x+this.node.x),2)+Math.pow(mousePosition.y-(this.node.y+this.relativePosition.y),2)<Math.pow(NODE_INPUT_RADIUS,2);
    }

    return NodeInput;
}();