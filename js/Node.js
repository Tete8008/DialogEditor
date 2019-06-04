
const NodeType={square:0,circle:1}

const NODE_WIDTH=200;
const NODE_HEIGHT=300;
const INITIAL_YOFFSET=35;

const PropertyType={InputField:0,CharacterReference:1,MessageReference:2,Condition:3};
const PropertyColor={0:"red",1:"indigo",2:"black",3:"darkgoldenrod"};

//class

var Node=function (){

    
    //constructor

    var Node=function(name="New node",position={x:(-gridOffset.x+mousePosition.x)/zoom,y:(-gridOffset.y+mousePosition.y)/zoom},id=Node.lastId++){
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
        };
        this.color="#ECECEC";
        
        this.inputs=[];
        this.outputs=[];
        this.buttons=[];
        this.img=null;
        this.selected=false;
        this.leftOffset=INITIAL_YOFFSET;
        this.visible=false;

        this.id=id;
        return this;
    }


    Node.hoveredNode=null;
    Node.selectedNode=null;
    Node.lastId=0;

    Node.prototype.draw=function(ctx){
        //draw shape
        ctx.fillStyle=this.color;
        ctx.font=24*zoom+"px serif";

        switch(this.type){
            case NodeType.square:
                ctx.fillRect(gridOffset.x+this.x*zoom,gridOffset.y+this.y*zoom,this.width*zoom,this.height*zoom);
                ctx.lineWidth=zoom*(this.selected?4:1);
                ctx.strokeStyle="snow";
                ctx.strokeRect(gridOffset.x+this.x*zoom,gridOffset.y+this.y*zoom,this.width*zoom,this.height*zoom);
            break;
            case NodeType.circle:
                ctx.beginPath();
                ctx.arc(gridOffset.x+this.x*zoom,gridOffset.y+this.y*zoom,this.radius*zoom,0,Math.PI*2);
                ctx.stroke();
            break;
        }
        
        //draw optional image
        if (this.img!=null){
            ctx.drawImage(this.img,gridOffset.x+(this.x+this.width*0.1)*zoom,gridOffset.y+(this.y+this.name.size.height)*zoom,this.width*zoom*0.8,(this.height-this.name.size.height)*zoom);
        }
        
        //write name
        ctx.fillStyle="#CDDAF3";
        ctx.fillRect(gridOffset.x+this.x*zoom,gridOffset.y+this.y*zoom,this.width*zoom,this.name.size.height*zoom);

        ctx.strokeStyle="black";
        ctx.lineWidth=zoom;
        ctx.textAlign="center";
        if (this.name.selected){
            ctx.fillStyle="grey";
        }else{
            ctx.fillStyle="black";
        }
        ctx.fillText(this.name.content, gridOffset.x+(this.x+this.width/2)*zoom,gridOffset.y+this.y*zoom);

        //draw inputs
        for (var i=0;i<this.inputs.length;i++){
            this.inputs[i].draw(ctx);
        }

        //draw outputs
        for (var i=0;i<this.outputs.length;i++){
            this.outputs[i].draw(ctx);
        }

        //draw buttons
        for (var i=0,length=this.buttons.length;i<length;i++){
            this.buttons[i].draw(ctx);
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
        if (colliding){
            if (Node.hoveredNode==null){
                this.onMouseEnter();
            }
            for (var i=0,length=this.inputs.length;i<length;i++){
                this.inputs[i].checkMouseCollision(mousePosition);
            }

            for (var i=0,length=this.outputs.length;i<length;i++){
                this.outputs[i].checkMouseCollision(mousePosition);
            }

            for (var i=0,length=this.buttons.length;i<length;i++){
                this.buttons[i].checkMouseCollision(mousePosition);
            }

        }else{
            if (Node.hoveredNode==this){
                this.onMouseLeave();
            }
            
        }

        return colliding;
    }

    Node.prototype.checkNameCollision=function(mousePosition){
        return (mousePosition.x>=this.x*zoom+gridOffset.x) && (mousePosition.x<=(this.x+this.name.size.width)*zoom+gridOffset.x) && (mousePosition.y>=this.y*zoom+gridOffset.y) && (mousePosition.y<=(this.y+this.name.size.height)*zoom+gridOffset.y);
    }

    Node.prototype.addInput=function(name,propertyType,fromEnd=true){
        let inputToAdd=new NodeInput(this,name,propertyType);
        if (fromEnd){
            this.inputs.push(inputToAdd);
        }else{
            this.inputs.unshift(inputToAdd);
            
        }
        this.recalculateInputsPositions();
    }

    Node.prototype.addOutput=function(name,propertyType){
        this.outputs.push(new NodeOutput(this,name,propertyType));
    }


    Node.prototype.onMouseEnter=function(){
        Node.hoveredNode=this;
    }

    Node.prototype.onMouseLeave=function(){
        Node.hoveredNode=null;
        if (InputField.hoveredField!=null){
            InputField.hoveredField.onMouseLeave();
        }
        if (NodeInput.hoveredInput!=null){
            NodeInput.hoveredInput.onMouseLeave();
        }
    }

    Node.prototype.onMouseDown=function(){
        selectedNode=this;
        Node.selectedNode=this;
        this.selected=true;
        nodeOffset={x:event.clientX-selectedNode.x*zoom,y:event.clientY-selectedNode.y*zoom};
    }

    Node.prototype.setImage=function(img){
        this.img=img;
    }


    Node.prototype.addButton=function(name,onclick){
        let button=new Button(name,this);
        button.onClick=onclick;
        this.buttons.push(button);
    }


    Node.prototype.recalculateInputsPositions=function(){
        let yOffset=INITIAL_YOFFSET;

        for (var i=0,length=this.buttons.length;i<length;i++){
            this.buttons[i].relativePosition.y=yOffset;
            yOffset+=BUTTON_HEIGHT;
        }        
        yOffset+=15;
        for (var i=0,length=this.inputs.length;i<length;i++){
            this.inputs[i].relativePosition.y=yOffset;
            yOffset+=NODE_INPUT_HEIGHT;
        }
    }
    
    return Node;
}();