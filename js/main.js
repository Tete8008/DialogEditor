const EditEvent={
    name:0,
    message:1
}

const saveFileName="DialogueSave.json";


var gridOffset={x:0,y:0};


var canvas=document.getElementById("canvas");
canvas.width=window.innerWidth-3;
canvas.height=window.innerHeight-3;
var ctx=canvas.getContext("2d");
ctx.font = '24px serif';
ctx.textBaseline="hanging";

var zoom=1;
var gridSelected=false;

var copiedNode=null;


var charactersDiv=document.getElementById("characters");
charactersDiv.style.height=canvas.height-25+"px";
charactersDiv.style.overflowY="scroll";



var lastTime=performance.now();
var debug=document.getElementById("debug");


const charas=document.getElementById("charas");

function AddMessageNode(){
    let node=new Node("Message");
    node.addInput("Character",PropertyType.CharacterReference);
    node.addInput("Content",PropertyType.InputField);
    node.addOutput("",PropertyType.MessageReference);
    nodes.push(node);
    closeContextMenu();
}

function AddQuestNode(){
    nodes.push(new Node("Quest"));
    closeContextMenu();
}

function AddDialogueNode(){
    let node=new Node("Dialogue");
    node.addButton("Add condition",function(){
        this.node.addInput("Condition",PropertyType.Condition,false);
    });
    node.addButton("Add message",function(){
        this.node.addInput("Message",PropertyType.MessageReference);
    })
    node.addInput("Message",PropertyType.MessageReference);
    nodes.push(node);
    closeContextMenu();

}

function AddCharacter(){
    characters.push(new Character());
}

function closeContextMenu(){
    if (contextMenu!=null){
        contextMenu.style.display="none";
        contextMenuOpen=false;
    }
}

function DeleteNode(){
    Node.selectedNode.delete();
    //reset
    Node.selectedNode=null;
    Node.hoveredNode=null;
    closeContextMenu();
}


function RenameNode(){
    editing.node=Node.selectedNode;
    editing.event=EditEvent.name;
    Node.selectedNode.name.selected=true;
    closeContextMenu();
}


function CopyNode(){
    copiedNode=Node.selectedNode;
    closeContextMenu();
}




function PasteNode(){
    if (copiedNode!=null){
        let node=new Node(copiedNode.name.content);
        node.type=copiedNode.type;
        node.width=copiedNode.width;
        node.height=copiedNode.height;
        node.radius=copiedNode.radius;
        node.name={content:copiedNode.name.content,size:{width:copiedNode.name.size.width,height:copiedNode.name.size.height},selected:false};
        node.color=copiedNode.color;
        node.img=copiedNode.img;
        node.selected=false;
        node.inputs=copiedNode.inputs.slice();
        node.outputs=copiedNode.outputs.slice();
        nodes.push(node);
        closeContextMenu();
    }
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
var links=[];



var hoveredNode=null;
var hoveredProperty=null;

var mousePosition={x:-1000,y:-1000};


window.onmousemove=function(event){
    mousePosition={x:event.clientX,y:event.clientY};


    if (mousePosition.x<window.innerWidth-200){
        event.preventDefault();
    }

    if (selectedNode!=null && !draggingLink){
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
        node.checkMouseCollision(mousePosition);
        ctx.fillStyle=node.color;
        
        let screenPos={x:(node.x+node.width)*zoom+gridOffset.x,y:(node.y+node.height)*zoom+gridOffset.y};
        if (screenPos.x>0 && screenPos.x<window.innerWidth && screenPos.y>0 && screenPos.y<window.innerHeight+node.height*zoom){
            node.visible=true;
        }else{
            node.visible=false;
        }
        if (node.visible){
            node.draw(ctx);
        }
    }

    for (var i=0,length=links.length;i<length;i++){
        if (links[i].input.node.visible){
            links[i].draw(ctx);
        }
    }


    if (draggingLink){
        ctx.strokeStyle=PropertyColor[NodeLink.currentProperty];
        ctx.beginPath();
        ctx.moveTo(gridOffset.x+(origin.node.x+origin.relativePosition.x)*zoom,gridOffset.y+(origin.node.y+origin.relativePosition.y)*zoom);
        ctx.lineTo(mousePosition.x,mousePosition.y);
        ctx.stroke();
    }

    lastTime=time;
}

var ctrlPressed=false;

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
    }else{
        switch(event.keyCode){
            case 46:    //suppr
                if (Node.selectedNode!=null){
                    DeleteNode();
                }
            break;

            case 17:    //CTRL
                ctrlPressed=true;
            break;

            case 83:    //S
                if (ctrlPressed){
                    event.preventDefault();
                    save(saveFileName);
                }
                
            break;
        }
    }
}


window.onkeyup=function(event){
    switch(event.keyCode){
        case 17:
            ctrlPressed=false;
        break;
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
var hoveredInput=null;
var draggingLink=false;
var origin=null;



window.onmousedown=function(event){

    //on déselectionne la node sélectionnée
    if (event.target!=canvas){
        return;
    }


    if (Node.selectedNode!=null){
        Node.selectedNode.selected=false;
        Node.selectedNode=null;
    }
    if(contextMenuOpen){
        closeContextMenu();
    }
    
    if (event.button==0){
        if (Node.hoveredNode!=null){
    
            if (InputField.hoveredField!=null){
                InputField.hoveredField.onMouseDown();
                
            }else if (NodeInput.hoveredInput!=null){
                NodeInput.hoveredInput.onMouseDown();
            }else if (NodeOutput.hoveredOutput!=null){
                NodeOutput.hoveredOutput.onMouseDown();
            }else if(Button.hoveredButton!=null){
                Button.hoveredButton.onMouseDown();
            }else{
                Node.hoveredNode.onMouseDown();
                canvas.style.cursor="all-scroll";
            }
            
        }else{
            if (mousePosition.x<window.innerWidth-200){
                gridSelected=true;
                canvas.style.cursor="grabbing";
    
                
                
        
                if (editing.node!=null){
                    editing.node.name.selected=false;
                    editing.node=null;
                    editing.event=null;
                    editing.property.selected=false;
                    editing.property.textSelected="";
                }
        
                if (draggingLink){
                    origin=null;
                    draggingLink=false;
                }
            }
            
    
        }
    }
}
    

var editing={
    node:null,
    event:null,
    property:null
};


window.onmouseup=function(){
    selectedNode=null;
    gridSelected=false;
    canvas.style.cursor="default";
}

window.onmousewheel=function(event){
    if (zoom-(event.deltaY/500)>0.2 && zoom-(event.deltaY/500)<2){
        zoom+=-(event.deltaY)/500;
    }
}

const gridContextMenu=document.getElementById("gridContextMenu");
var contextMenuOpen=false;

const nodeContextMenu=document.getElementById("nodeContextMenu");
var contextMenu;

window.oncontextmenu=function(event){
    event.preventDefault();

    //on cache l'ancien contextMenu
    closeContextMenu();

    //on affiche le bon contextmenu en fonction de ce qui est sélectionné
    if (Node.hoveredNode!=null){
        contextMenu=nodeContextMenu;
        Node.selectedNode=Node.hoveredNode;
        Node.selectedNode.selected=true;
    }else{

        contextMenu=gridContextMenu;
    }
    contextMenu.style.display="block";
    contextMenu.style.left=event.pageX+"px";
    contextMenu.style.top=event.pageY+"px";
    contextMenuOpen=true;
}


function save(fileName){
    canvas.style.cursor="wait";
    let datajax={
        file:"../Saves/"+fileName,
        data:{
            nodes:[],
            characters:[]
        }  
    };

    //on construit les données à partir des références actuelles

    //nodes
    for (var i=0,length=nodes.length;i<length;i++){
        let node=nodes[i];
        let nodeData={
            position:{
                x:node.x,
                y:node.y
            },
            type:node.type,
            size:{
                width:node.width,
                height:node.height
            },
            radius:node.radius,
            name:node.name.content,
            inputs:[],
            outputs:[],
            buttons:[],
            imgSrc:(node.img!=null?node.img.src:""),
            id:node.id,
            color:node.color
        };

        //character reference
        if (node.character!=null){
            nodeData.characterId=node.character.id;
        }

        
        //inputs
        for (var j=0,l=node.inputs.length;j<l;j++){
            let input=node.inputs[j];
            let inputData={
                id:input.id,
                outputNodeId:(input.link!=null?input.link.output.node.id:-1),
                outputId:(input.link!=null?input.link.output.id:-1),
                name:input.name,
                propertyType:input.propertyType,
                propertyContent:(input.property!=null?input.property.content:"")
            };
            nodeData.inputs.push(inputData);
        }

        //outputs
        for (var j=0,l=node.outputs.length;j<l;j++){
            let output=node.outputs[j];
            let outputData={
                id:output.id,
                name:output.name,
                propertyType:output.propertyType
            };
            nodeData.outputs.push(outputData);
        }

        datajax.data.nodes.push(nodeData);
    }

    //characters
    for (var i=0,l=characters.length;i<l;i++){
        let character=characters[i];
        let characterData={
            id:character.id,
            name:character.name,
            iconSrc:character.iconSrc
        };
        datajax.data.characters.push(characterData);
    }


    $.ajax({
        type: 'post',
        url: 'php/saveToJson.php',
        data: JSON.stringify(datajax),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            canvas.style.cursor="default";
        }
    })   
}

const fileNameInput=document.getElementById("fileNameInput");
document.getElementById("saveAsButton").onclick=function(){
    let fileName=fileNameInput.value;
    if (fileName==""){return;}

    if (!fileName.endsWith(".json")){
        fileName+=".json";
    }
    save(fileName);
}

document.getElementById("saveButton").onclick=function(){
    if (currentFileName!=""){
        save(currentFileName);
    }else {
        console.log("enter a name please ");
    }
}

document.getElementById("newButton").onclick=function(){
    clearAll();
    openFileSelect.value="";
}

var currentFileName="";
const openFileSelect=document.getElementById("openFileSelect");
openFileSelect.onchange=function(){
    if (this.value!=""){
        canvas.style.cursor="wait";
        clearAll();
        currentFileName=this.value;
        $.getJSON("Saves/"+this.value,function(data){
            console.log(data);
            let nodesData=data.nodes;

            //on recrée toutes les nodes et on assigne les données
            for (var i=0,l=nodesData.length;i<l;i++){
                let nodeData=nodesData[i];
                


                let node=new Node();
                node.x=nodeData.position.x;
                node.y=nodeData.position.y;
                node.type=nodeData.type;
                node.width=nodeData.size.width;
                node.height=nodeData.size.height;
                node.radius=nodeData.radius;
                node.name.content=nodeData.name;
                node.color=nodeData.color;
                if (nodeData.imgSrc!=""){
                    node.img=new Image();
                    node.img.src=nodeData.imgSrc;
                }
                
                node.id=nodeData.id;

                for (var j=0,c=nodeData.inputs.length;j<c;j++){
                    let inputData=nodeData.inputs[j];
                    let input=new NodeInput(node,inputData.name,inputData.propertyType,inputData.id);
                    if (input.property!=null){
                        input.property.content=inputData.propertyContent;
                    }
                    node.inputs.push(input);   
                }

                for (var j=0,c=nodeData.outputs.length;j<c;j++){
                    let outputData=nodeData.outputs[j];
                    let output=new NodeOutput(node,outputData.name,outputData.propertyType,outputData.id);
                    node.outputs.push(output);   
                }

                nodes.push(node);
            }
            
            //on fait les links une fois que toutes les nodes sont là
            for (var i=0,l=nodesData.length;i<l;i++){
                let nodeData=nodesData[i];
                let node=nodes[i];
                for (var j=0,c=nodeData.inputs.length;j<c;j++){
                    let inputData=nodeData.inputs[j];
                    let input=node.inputs[j];
                    console.log(inputData);
                    if (inputData.outputNodeId!=-1){
                        let outputNode=getNodeById(inputData.outputNodeId);
                        console.log(outputNode);
                        let output=outputNode.getOutputById(inputData.outputId);
                        let link=new NodeLink(input,output,PropertyColor[input.propertyType]);
                        input.link=link;
                        output.links.push(link);
                        links.push(link);
                    }
                }
            }

            let charactersData=data.characters;

            //characters
            for (var i=0,l=charactersData.length;i<l;i++){
                let characterData=charactersData[i];
                let character=new Character(characterData.name,characterData.id,characterData.iconSrc);
                characters.push(character);
            }

            //on réassigne les références aux characters
            for (var i=0,l=nodesData.length;i<l;i++){
                let nodeData=nodesData[i];
                if (nodeData.hasOwnProperty("characterId")){
                    let character=getCharacterById(nodeData.characterId);
                    nodes[i].character=character;
                    character.references.push(nodes[i]);
                }
            }

            canvas.style.cursor="default";
        });
    }
}


function clearAll(){
    nodes=[];
    links=[];
}


function getNodeById(id){
    let node=null;
    for (var i=0,l=nodes.length;i<l;i++){
        if (nodes[i].id==id){
            node=nodes[i];
            break;
        }
    }
    return node;
}

function getCharacterById(id){
    let character=null;
    for (var i=0,l=characters.length;i<l;i++){
        if (characters[i].id==id){
            character=characters[i];
            break;
        }
    }
    return character;
}