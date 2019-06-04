
//class
var Character=function(){
    //contructor
    var Character=function(name="Character"){
        this.name=name;
        this.iconSrc="img/defaultCharacter.jpg";
        let charaDiv=document.createElement("div");
        charaDiv.classList.add("character");

        let iconAndName=document.createElement("div");

        let charaName=document.createElement("input");
        charaName.type="text";
        charaName.value=this.name;
        charaName.style.width="100px";
        charaName.addEventListener("change",(event)=>{
            this.updateName(event.target.value);
        });

        let img=document.createElement("img");
        img.src=this.iconSrc;
        iconAndName.appendChild(charaName);
        iconAndName.appendChild(document.createElement("br"));
        iconAndName.appendChild(img);
        iconAndName.classList.add("souschara");

        charaDiv.appendChild(iconAndName);

        let buttons=document.createElement("div");
        buttons.classList.add("souschara");
        let removeButton=document.createElement("button");
        removeButton.innerText="-";
        removeButton.addEventListener("click",()=>{
            this.removeCharacter();
        });

        let referenceButton=document.createElement("button");
        referenceButton.innerText="create ref";
        referenceButton.addEventListener("click",()=>{
            this.createReference();
        })

        buttons.appendChild(removeButton);
        buttons.appendChild(document.createElement("br"));
        buttons.appendChild(referenceButton);
        charaDiv.appendChild(buttons);

        charas.appendChild(charaDiv);
        this.icon=img;
        this.div=charaDiv;
        this.references=[];
        return this;
    }

    Character.prototype.setIconSrc=function(iconSrc){
        this.iconSrc=iconSrc;
        this.icon.src=this.iconSrc;
    }

    Character.prototype.removeCharacter=function(){
        //check for references...
        this.div.parentElement.removeChild(this.div);

    }


    Character.prototype.createReference=function(){
        let chara=new Node(this.name);
        chara.width=NODE_WIDTH/2;
        chara.height=NODE_HEIGHT/2;
        chara.x=-gridOffset.x+(window.innerWidth/2-chara.width/2)/zoom;
        chara.y=-gridOffset.y+(window.innerHeight/2-chara.height/2)/zoom;
        chara.addOutput("",PropertyType.CharacterReference);
        chara.setImage(this.icon);
        nodes.push(chara);
        this.references.push(chara);
    }


    Character.prototype.updateName=function(name){
        this.name=name;
        for (var i=0,length=this.references.length;i<length;i++){
            this.references[i].name.content=this.name;
        }
    }


    return Character;
}();