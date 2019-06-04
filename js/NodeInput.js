const NODE_INPUT_HEIGHT=30;
const NODE_INPUT_RADIUS=7;


var NodeInput=function(){

    var NodeInput=function(node,name,propertyType,id=NodeInput.lastId++){
        this.name=name;
        this.link=null;
        this.propertyType=propertyType;
        this.node=node;
        this.relativePosition={
            x:10,
            y:this.node.leftOffset
        };
        this.node.leftOffset+=NODE_INPUT_HEIGHT;
        this.property;
        this.color=PropertyColor[this.propertyType];

        switch(this.propertyType){
            case PropertyType.CharacterReference:

            break;

            case PropertyType.InputField:
                this.property=new InputField(this.node,{x:this.relativePosition.x,y:this.relativePosition.y+10},{width:this.node.width-20,height:100},TextAlignment.Left,22);
            break;
        }

        this.id=id;

        return this;
    };

    NodeInput.hoveredInput=null;
    NodeInput.lastId=0;

    NodeInput.prototype.draw=function(ctx){
        ctx.fillStyle="black";
        ctx.font = 22*zoom+'px serif';
        let x=gridOffset.x+(this.node.x+this.relativePosition.x)*zoom;
        let y=gridOffset.y+(this.node.y+this.relativePosition.y)*zoom;
        ctx.textAlign="left";
        ctx.strokeStyle=this.color;
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
        let colliding=Math.pow(mousePosition.x-(gridOffset.x+(this.relativePosition.x+this.node.x)*zoom),2)+Math.pow(mousePosition.y-(gridOffset.y+(this.node.y+this.relativePosition.y)*zoom),2)<Math.pow(NODE_INPUT_RADIUS,2);
        
        if (colliding){
            if (NodeInput.hoveredInput==null){
                this.onMouseEnter();
            }
            
        }else{
            if (NodeInput.hoveredInput==this){
                this.onMouseLeave();
            }
        }
        
        return colliding;
    }


    NodeInput.prototype.onMouseEnter=function(){
        let allowed=true;
        if (draggingLink){
            if (origin.constructor.name=="NodeOutput"){
                if (origin.propertyType!=this.propertyType){
                    allowed=false;
                }
            }else{
                allowed=false;
            }
            if (allowed){
                canvas.style.cursor="pointer";
            }else{
                canvas.style.cursor="not-allowed";
            }


        }else{
            canvas.style.cursor="pointer";
        }
        NodeInput.hoveredInput=this;
    }

    NodeInput.prototype.onMouseLeave=function(){
        canvas.style.cursor="default";
        NodeInput.hoveredInput=null;
    }

    NodeInput.prototype.onMouseDown=function(){

        if (draggingLink){
            
                if (origin.propertyType==this.propertyType){
                    let input;
                    let output;
                    if (origin.constructor.name=="NodeInput"){
                        input=origin;
                        output=this;
                    }else{
                        input=this;
                        output=origin;
                    }
                    
                
                    if (this.link!=null){
                        this.link.output.link=null;
                        links.splice(links.lastIndexOf(this.link),1);
                    
                    }
                    let link=new NodeLink(input,output,PropertyColor[NodeLink.currentProperty]);
                    origin.link=link;
                    this.link=link;
                    links.push(link);
                }else{
                    console.log("couldn't create link");
                }
            
            origin.checkMouseCollision(mousePosition);
            draggingLink=false;
            origin=null;
            
        }else{
            draggingLink=true;
            origin=this;
            NodeLink.currentProperty=this.propertyType;
        }

        
    }

    return NodeInput;
}();