const EditEvent={
    name:0,
    message:1
}


var testNode=new Node({x:0,y:0});

var gridOffset={x:0,y:0};

var canvas=document.getElementById("canvas");
canvas.width=window.innerWidth-3;
canvas.height=window.innerHeight-3;
var ctx=canvas.getContext("2d");
ctx.font = '24px serif';
ctx.textBaseline="hanging";

var zoom=1;
var gridSelected=false;


var charactersDiv=document.getElementById("characters");
charactersDiv.style.height=canvas.height+"px";

testNode.draw(ctx);


var lastTime=performance.now();
var debug=document.getElementById("debug");


function AddMessageNode(){
    let node=new Node({x:(-gridOffset.x+mousePosition.x)/zoom,y:(-gridOffset.y+mousePosition.y)/zoom},"Message");
    node.addInput("Character",PropertyType.CharacterReference);
    node.addInput("Content",PropertyType.InputField)
    nodes.push(node);
    closeContextMenu();
}

function AddQuestNode(){
    nodes.push(new Node({x:(-gridOffset.x+mousePosition.x)/zoom,y:(-gridOffset.y+mousePosition.y)/zoom},"Quest"));
    closeContextMenu();
}


function AddCharacter(){

    closeContextMenu();
}

function closeContextMenu(){
    contextmenu.style.display="none";
    contextMenuOpen=false;
}



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
var characters=[];

nodes.push(testNode);



var hoveredNode=null;
var hoveredProperty=null;

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
        let node=nodes[i];
        if (node.checkMouseCollision(mousePosition)){
            hoveredNode=node;
        }
        ctx.fillStyle=node.color;


        if (node.x<(-gridOffset.x*zoom+window.innerWidth/zoom) && node.x>-gridOffset.x-node.width && node.y<(-gridOffset.y+window.innerHeight) && node.y>-gridOffset.y-node.height){
            node.draw(ctx);
        }
        
    }
    

    
    

    lastTime=time;
}


window.onkeydown=function(event){
    if (editing.node!=null){
        switch(editing.event){
            case EditEvent.name:
            var str=editing.node.name.content;
            switch(event.keyCode){
                case 13:case 27:
                    editing.node.name.selected=false;
                    editing.node=null;
                    editing.event=null;
                break;

                case 8:
                    editing.node.name.content=str.slice(0,str.length-1);
                break;

                default:
                    if (event.key.length<=1){
                        editing.node.name.content+=event.key;
                    }
                    
                break;
            }
                

            break;
            case EditEvent.message:
                var str=editing.property.content;
                switch(event.keyCode){
                    case 13:case 27:
                        editing.property.selected=false;
                        editing.node=null;
                        editing.event=null;
                        editing.property.textSelected="";
                        editing.property=null;
                        
                    break;

                    case 8:
                        editing.property.content=str.slice(0,str.length-1);
                    break;

                    default:
                        if (event.key.length<=1){
                            if (editing.property.textSelected!=""){
                                editing.property.content="";
                                editing.property.textSelected="";
                            }
                            editing.property.content+=event.key;
                        }
                    break;
                }
            break;
        }
    }
}


function drawBackground(){
    var count=(Math.trunc(1/zoom)+1)*1.5;
    let startX=-Math.round((gridOffset.x/zoom)/backgroundStartSize.width-0.5)*backgroundStartSize.width*zoom;
    let startY=-Math.round((gridOffset.y/zoom)/backgroundStartSize.height-0.8)*backgroundStartSize.height*zoom;

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
        //deselect previous node

        if (editing.property!=null && editing.property!=hoveredProperty){
            editing.property.selected=false;
            editing.property.textSelected="";
    
        }
        



        selectedNode=hoveredNode;
        nodeOffset={x:event.clientX-selectedNode.x*zoom,y:event.clientY-selectedNode.y*zoom};
        if (hoveredProperty!=null){
            editing.node=hoveredNode;
            editing.property=hoveredProperty;
            editing.event=EditEvent.message;
            editing.property.selected=true;
            if (editing.property.textSelected==""){
                editing.property.textSelected=editing.property.content;
            }else{
                editing.property.textSelected="";
            }
            
        }
        
    }else{
        gridSelected=true;

        if(contextMenuOpen){
            if (event.target==canvas){
                contextmenu.style.display="none";
                contextMenuOpen=false;
            }
        }
        

        if (editing.node!=null){
            editing.node.name.selected=false;
            editing.node=null;
            editing.event=null;
            editing.property.selected=false;
            editing.property.textSelected="";
        }

    }
}

var editing={
    node:null,
    event:null,
    property:null
};


window.onmouseup=function(){
    event.preventDefault();
    selectedNode=null;
    gridSelected=false;
    if (hoveredNode!=null){
        if (hoveredNode.checkNameCollision(mousePosition)){
            editing.node=hoveredNode;
            editing.event=EditEvent.name;
            hoveredNode.name.selected=true;
        }
    }
    
}

window.onmousewheel=function(event){
    if (zoom-(event.deltaY/500)>0.2 && zoom-(event.deltaY/500)<2){
        zoom+=-(event.deltaY)/500;
    }
}

var contextmenu=document.getElementById("menu");
var contextMenuOpen=false;
window.oncontextmenu=function(event){
    event.preventDefault();
    contextmenu.style.display="block";
    contextmenu.style.left=event.pageX+"px";
    contextmenu.style.top=event.pageY+"px";
    contextMenuOpen=true;
}


function save(){

}