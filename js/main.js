var testNode=new Node({x:0,y:0});

var gridOffset={x:0,y:0};



var canvas=document.getElementById("canvas");
canvas.width=window.innerWidth-3;
canvas.height=window.innerHeight-3;
var ctx=canvas.getContext("2d");

var zoom=1;
var gridSelected=false;


testNode.draw(ctx);


var lastTime=performance.now();
var debug=document.getElementById("debug");



var backgroundStartSize;

window.onresize=function(){
    canvas.width=window.innerWidth-3;
    canvas.height=window.innerHeight-3;
}

var deltaTime;


var background=new Image();
background.src="img/grid.jpg";
background.onload=function(){
    backgroundStartSize={width:this.width,height:this.height};
    update();
    
}



setInterval(function(){
    debug.innerHTML="fps : "+Math.trunc(1/deltaTime*1000);
},300);

var nodes=[];

nodes.push(testNode);



var hoveredNode=null;

var mousePosition={x:-1000,y:-1000};


window.onmousemove=function(event){
    event.preventDefault();
    mousePosition={x:event.clientX,y:event.clientY};

    if (selectedNode!=null){
        selectedNode.x=(mousePosition.x-nodeOffset.x)/zoom;
        selectedNode.y=(mousePosition.y-nodeOffset.y)/zoom;
    }else if(gridSelected){
        gridOffset.x+=event.movementX;
        gridOffset.y+=event.movementY;
    }

}

function update(){
    requestAnimationFrame(update);

    let time=performance.now();
    deltaTime=time-lastTime;

    ctx.fillStyle="white";
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

    drawBackground();


    hoveredNode=null;

    for (var i=0,length=nodes.length;i<length;i++){
        if (nodes[i].checkMouseCollision(mousePosition)){
            hoveredNode=nodes[i];
        }
        ctx.fillStyle=nodes[i].color;
        nodes[i].draw(ctx);
    }
    
    //console.log(hoveredNode);

    
    

    lastTime=time;
}


function drawBackground(){
    var count=Math.trunc(1/zoom)+1;
    let startX=-Math.round((gridOffset.x/zoom)/backgroundStartSize.width*zoom-0.5)*backgroundStartSize.width;
    let startY=-Math.round((gridOffset.y/zoom)/backgroundStartSize.height*zoom-1)*backgroundStartSize.height;
    console.log(startX);

    for (var i=0;i<count;i++){
        for (var j=0;j<count;j++){
            ctx.drawImage(background,startX+gridOffset.x+backgroundStartSize.width*zoom*j,startY+gridOffset.y+backgroundStartSize.height*zoom*i,backgroundStartSize.width*zoom,backgroundStartSize.height*zoom);
            ctx.drawImage(background,startX+gridOffset.x+backgroundStartSize.width*zoom*j,startY+gridOffset.y-backgroundStartSize.height*zoom*(i+1),backgroundStartSize.width*zoom,backgroundStartSize.height*zoom);
            ctx.drawImage(background,startX+gridOffset.x-backgroundStartSize.width*zoom*(j+1),startY+gridOffset.y+backgroundStartSize.height*zoom*i,backgroundStartSize.width*zoom,backgroundStartSize.height*zoom);
            ctx.drawImage(background,startX+gridOffset.x-backgroundStartSize.width*zoom*(j+1),startY+gridOffset.y-backgroundStartSize.height*zoom*(i+1),backgroundStartSize.width*zoom,backgroundStartSize.height*zoom);
        }

    }
    

}


var selectedNode=null;
var nodeOffset;


window.onmousedown=function(event){
    event.preventDefault();
    if (hoveredNode!=null){
        selectedNode=hoveredNode;
        nodeOffset={x:event.clientX-selectedNode.x*zoom,y:event.clientY-selectedNode.y*zoom};
    }else{
        gridSelected=true;
    }
}

window.onmouseup=function(){
    event.preventDefault();
    if (selectedNode!=null){
        selectedNode=null;
    }else if (gridSelected){
        gridSelected=false;
    }
}

window.onmousewheel=function(event){
    if (zoom-(event.deltaY/300)>0.2){
        zoom+=-(event.deltaY)/300;
        console.log("zoom",zoom);
    }
}

