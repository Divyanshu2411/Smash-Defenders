//alert("Js loaded");
let startBtn= document.querySelector(".start");
let box= document.querySelector(".box");
let canvas= document.getElementById("board");
//to draw on canvas
let tool = canvas.getContext("2d");
//resizing canva

let scoreEle= document.querySelector("span");
let powerEle=document.querySelector(".meter span");
let restartBtn=document.querySelector(".restart")

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;


//loading image through javascript
let spaceImg= new Image();
spaceImg.src="space.jpeg";
let earthImg=new Image();
earthImg.src="earth.png";
let coronaImg=new Image();
coronaImg.src="corona.png";
let lifeImg=new Image();
lifeImg.src="heart.png";

let eHeight=40;
let eWidth=40;

let ePosX=canvas.width/2-20;
let ePosY= canvas.height/2-20;

let score=0;
let fullPower=100;

class Planet{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y; 
        this.width=width;
        this.height=height;
    }

    draw(){
//draw logic 
tool.drawImage(earthImg,this.x,this.y,this.width,this.height);
    }

}

class Bullet{
    constructor(x,y,width,height,velocity){
        this.x=x;
        this.y=y; 
        this.width=width; 
        this.height=height;
        this.velocity=velocity;
       // console.log(this);
    }

    draw()
    {
        tool.fillStyle="white";
        tool.fillRect(this.x,this.y,this.width,this.height); 
    
    }

    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    
    }
}

class Corona{
    constructor(x,y,width,height,velocity){
        this.x=x;
        this.y=y; 
        this.width=width; 
        this.height=height;
        this.velocity=velocity;
      //  console.log(this);
    }

    draw()
    {
       // tool.fillStyle="white";
        tool.drawImage(coronaImg,this.x,this.y,this.width,this.height); 
    
    }

    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    
    }
}

class Particle {
    constructor(x,y,radius,velocity)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.velocity=velocity;
        this.alpha=1;
    }

    draw(){
        tool.save();
        tool.globalAlpha=this.alpha;
        tool.beginPath();
        tool.fillStyle="white";
        tool.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        tool.fill();
        tool.restore();
    }

    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
        this.alpha-=0.01;
    }
}

class Heart{
    constructor(x,y,width,height){
        this.x=x-50;
        this.y=y; 
        this.width=width;
        this.height=height;
        this.len=5;
    }

    draw(){
//draw logic 
for(let i=0; i<this.len; i++)
{
    tool.drawImage(lifeImg,this.x-(50*(i+1)),this.y,this.width,this.height);
}
}

    update()
    {
        this.len-=1;
        this.draw();
        console.log(this.len);
    }

    
}

let bullets=[];
let coronas=[];
let particles= [];
let animID;
let heart=new Heart(canvas.width,0,160,90);

function animate(){
    //to clear cavas at each step to achieve animation
    tool.clearRect(0,0,canvas.width, canvas.height);

    //draw black rect
    tool.fillRect(0,0,canvas.width,canvas.height);
    
    //load space image
    tool.drawImage(spaceImg,0,0,canvas.width,canvas.height);

    //earthImg
     let earth= new Planet(ePosX,ePosY,eWidth,eHeight);
    earth.draw();

    heart.draw();
    

    //particles update

    particles.forEach(function(particle, index){
        particle.update();

        if(particle.alpha<0)
        {
            particles.splice(index,1);
        }
    })
    
   
    let bLen=bullets.length; 
    for(let i=0; i<bLen; i++)
    {
        bullets[i].update();
        if(bullets[i].x<0||bullets[i].y<0||bullets[i].x>canvas.width||bullets[i].y>canvas.height)//taki bullet ko hata sake
        {
            setTimeout(function(){
                bullets.splice(i,1);//is index pe jake itne bande remove
            })
        }
    }


    let cLen=coronas.length;

    coronas.forEach(function(corona,i){
            corona.update();

        //collison with earth
        if(colRec(earth,corona))
        {
            fullPower-=20;
            powerEle.style.width= `${fullPower}%`; 
            coronas.splice(i,1);
            heart.update();
            if(fullPower==0)
            {
                cancelAnimationFrame(animID);
                //alert("Game Over");
                restart();
            }
            
           
        }

        bullets.forEach(function(bullet,bulletIndex){ 
            if(colRec(corona,bullet)){
              //explosion
            
              for(let i=0; i<corona.width*4;i++){
                  particles.push(new Particle(bullet.x, bullet.y,Math.random()*2,
                  {
                      x : (Math.random()-0.5)*(Math.random()*4) ,
                      y : (Math.random()-0.5)*(Math.random()*4)
                    }));
              }

                setTimeout(()=> {
                    coronas.splice(i,1);
                    bullets.splice(bulletIndex,1);
                    score+=100;
                    scoreEle.innerText=score;
                },0)
            }
        })  
    })
    

    animID=requestAnimationFrame(animate);
}

function createCorona(){
    setInterval(function(){

        let x= 0;
        let y=0;
        let delta= Math.random();//generates value between 0 and 1

        if(delta <0.5)
        {
            //horizontal
            x=Math.random()<0.5?0:canvas.width;
            y=Math.random()*canvas.height;
        }

        else
        {
            //vertical
            y=Math.random()<0.5?0:canvas.height;
            x=Math.random()*canvas.width;

        }

        let angle= Math.atan2(canvas.height/2-20-y,canvas.width/2-20-x);
        let velocity={
            x:Math.cos(angle)*2,
            y:Math.sin(angle)*2
        }

        let corona= new Corona(x,y,40,40,velocity);
        coronas.push(corona);

    },1000)
}
startBtn.addEventListener("click",function(e){
    e.stopImmediatePropagation();//bar bar click hone pe issue na aaye kuki bad me pure screen pe click event
  //  alert("start the game");
  //box hide
box.style.display="none";

    

    //bullet
    animate();
    createCorona();
    window.addEventListener("click",function(e){

        let angle= Math.atan2(e.clientY-canvas.height/2,e.clientX- canvas.width/2);
        let velocity={
            x:Math.cos(angle)*5,
            y:Math.sin(angle)*5
        }

       let bullet= new Bullet(canvas.width/2,canvas.height/2,7,7,velocity);
       bullet.draw();
       bullets.push(bullet);
       //console.log(bullets);
    })
    
})


function colRec(entity1, entity2){
    let l1=entity1.x;
    let l2=entity2.x;
    let r1=entity1.x+ entity1.width;
    let r2=entity2.x+ entity2.width;
    let t1=entity1.y + entity1.height;
    let t2=entity2.y + entity2.height;
    let b1= entity1.y;
    let b2=entity2.y;

    if(l1<r2&& l2<r1 && t1>b2 && t2>b1)
      { return true;}

    return false;
}

window.addEventListener("resize",function(){
    window.location.reload();
})

function restart(){
    window.location.reload();
    startBtn.style.display="none";
    powerEle.style.display="none";
    restartBtn.style.display="block";
    box.style.display="block";
    document.body.style.backgroundColor="white";
    canvas.height="0px";
    // restartBtn.addEventListener("click",function(){
       
    // })
     
}