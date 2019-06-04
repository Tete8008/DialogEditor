
var NodeLink=function(){

    var NodeLink=function(input,output,color){
        this.input=input;
        this.output=output;
        this.color=color;
        return this;
    }

    NodeLink.currentProperty=null;

    NodeLink.prototype.draw=function(ctx){
        ctx.strokeStyle=this.color;
        ctx.beginPath();
        ctx.moveTo(gridOffset.x+(this.input.node.x+this.input.relativePosition.x)*zoom,gridOffset.y+(this.input.node.y+this.input.relativePosition.y)*zoom);
        ctx.lineTo(gridOffset.x+(this.output.node.x+this.output.relativePosition.x)*zoom,gridOffset.y+(this.output.node.y+this.output.relativePosition.y)*zoom);
        ctx.stroke();
    }

    return NodeLink;
}();