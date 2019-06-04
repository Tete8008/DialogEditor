const TextAlignment={Left:"left",Right:"right",Center:"center"};



//class
var InputField=function(){

    //contructor
    var InputField=function(node,position,size,textAlignment=TextAlignment.Left,fontSize=24){
        this.textAlignment=textAlignment;
        this.fontSize=fontSize;
        this.size=size;
        this.node=node;
        this.relativePosition=position;
        this.content="zbeub";
        this.hovered=false;
        this.selected=false;
        this.textSelected="";
        return this;
    }


    //static fields
    InputField.hoveredField=null;
    InputField.selectedText="";

    InputField.prototype.draw=function(ctx){
        ctx.textAlign=this.textAlignment;
        ctx.font=this.fontSize*zoom+"px serif";
        ctx.fillStyle="white";
        let localOffset;
        switch(this.textAlignment){
            case TextAlignment.Left:
            localOffset=0;
            break;

            case TextAlignment.Right:
            localOffset=-this.size.width;
            break;

            case TextAlignment.Center:
            localOffset=-this.size.width/2;
            break;
        }
        //background
        ctx.fillRect(gridOffset.x+(localOffset+this.relativePosition.x+this.node.x)*zoom,gridOffset.y+(this.relativePosition.y+this.node.y)*zoom,this.size.width*zoom,this.size.height*zoom);
        
        ctx.fillStyle="cornflowerblue";
        if (this.textSelected!=""){
            let textSize=ctx.measureText(this.content);
            ctx.fillRect(gridOffset.x+(localOffset+this.relativePosition.x+this.node.x)*zoom,gridOffset.y+(this.relativePosition.y+this.node.y)*zoom,textSize.width,this.fontSize*zoom);
            ctx.fillStyle="white";
        }else{
            ctx.fillStyle="black";
        }

        this.drawText(ctx);
        
    }

    InputField.prototype.drawText=function(ctx){
        let str="";
        let index=0;
        let contentLength=this.content.length;
        let yIndex=0;
        

        while(index<contentLength){
            
            if (ctx.measureText(str).width<(this.size.width-10)*zoom){
                str+=this.content[index];
                if (index==contentLength-1){
                    ctx.fillText(str, gridOffset.x+(this.relativePosition.x+this.node.x)*zoom,gridOffset.y+(this.relativePosition.y+this.node.y+yIndex*this.fontSize)*zoom);
                }
            }else{
                ctx.fillText(str, gridOffset.x+(this.relativePosition.x+this.node.x)*zoom,gridOffset.y+(this.relativePosition.y+this.node.y+yIndex*this.fontSize)*zoom);
                str="";
                yIndex++;
            }
            
            
            index++;
        }
    }


    InputField.prototype.checkMouseCollision=function(mousePosition){
        let x=(this.node.x+this.relativePosition.x)*zoom+gridOffset.x;
        let y=(this.node.y+this.relativePosition.y)*zoom+gridOffset.y;
        let colliding=(mousePosition.x>=x) && (mousePosition.x<=x+this.size.width*zoom) && (mousePosition.y>=y) && (mousePosition.y<=y+this.size.height*zoom);
        if (colliding){
            if (InputField.hoveredField==null){
                this.onMouseEnter();
            }
            
        }else{
            if (InputField.hoveredField==this){
                this.onMouseLeave();
            }
        }
        this.hovered=colliding;
        
        return colliding;
    }

    InputField.prototype.select=function(on){
        this.selected=on;
    }


    InputField.prototype.onMouseEnter=function(){
        canvas.style.cursor="text";
        InputField.hoveredField=this;
    }


    InputField.prototype.onMouseLeave=function(){
        canvas.style.cursor="default";
        InputField.hoveredField=null;
    }


    InputField.prototype.onMouseDown=function(){

        editing.node=Node.hoveredNode;
        editing.property=this;
        editing.event=EditEvent.message;
        editing.property.selected=true;

        if (editing.property.textSelected==""){
            editing.property.textSelected=editing.property.content;
        }else{
            editing.property.textSelected="";
            
        }
    }


    return InputField;
}();