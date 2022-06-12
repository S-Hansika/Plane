var sky,Aplane,fuel,bird;
var skyImg,planeImg,fuelImg,birdImg,plane2Img, gameOverImg, winImg;
var fuelCollection=50;
var score=0;
var fuelGroup, birdGroup;
var gameOver,gameWon;
var dest= ["Delhi", "Kashmir", "Los Angeles", "Japan"];
var r= Math.floor(Math.random() * 4);
var km= [500, 900, 2000, 1500];

//Game States
var play=1;
var end=0;
var wait=2;
var win= 3;
var gameState=wait;

function preload(){
    skyImg= loadImage("sky.png");
    planeImg= loadImage("Plane 2.png");
    fuelImg= loadImage("fuel.png");
    birdImg= loadAnimation("Bird1.png", "Bird 2.png");
    endImg= loadAnimation("gameOver.png");
    plane2Img= loadAnimation("plane1.png");
    gameOverImg = loadImage("gameOver.png");
    winImg= loadImage("win.png");

    collidedSound= loadSound("collided.wav");
    fuelSound= loadSound("fuel.mp3");
}

function setup() {
    createCanvas(600,400);

    sky= createSprite(0,200);
    sky.addImage(skyImg);
    sky.velocityX=-4;

    Aplane= createSprite(100,200,10,10);
    Aplane.addImage("plane", planeImg);
    Aplane.addAnimation("fly", plane2Img);
    Aplane.scale= 0.2;
    Aplane.velocityY=2;

    fuelGroup= new Group();
    birdGroup= new Group();

    gameOver= createSprite(300,200);
    gameOver.addImage(gameOverImg);
    gameOver.visible = false;

    gameWon=createSprite(300,200);
    gameWon.addImage(winImg);
    gameWon.visible= false;


    Aplane.setCollider("rectangle",0,0,900,300);
    //plane.debug= true;
    
 
}

function draw(){
    background(0);

    if(gameState===play){
        Aplane.visible= true;
        score= score+ Math.round(getFrameRate()/60);
        sky.velocityX= -(6+3*score/100);

        if(keyDown("SPACE")|| touches.length>0){
            Aplane.velocityY= -4;
            Aplane.changeImage("fly", plane2Img);
            touches=[];
        }
        if(keyWentUp("SPACE")|| touches.length<0){
            Aplane.changeImage("plane", plane2Img);
            touches=[];
        }
        Aplane.velocityY+= 0.3;

        if(sky.x< 0){
            sky.x= width/2;
        }

        spawnBirds();
        spawnFuel();

        if(fuelGroup.isTouching(Aplane)){
            fuelSound.play();
            fuelGroup.destroyEach();
            fuelCollection+= 1;
        }

        if(birdGroup.isTouching(Aplane)|| Aplane.y>400|| Aplane.y<0){
            collidedSound.play();
            gameState= end;
        }
    }

    else if(gameState === end){
        gameOver.visible= true;

        sky.velocityX= 0;
        birdGroup.setVelocityXEach(0);
        fuelGroup.setVelocityXEach(0);
        Aplane.visible= false;
        birdGroup.destroyEach();

        fuelGroup.setLifetimeEach(-1);

        if(keyDown("SPACE")||touches.length>0){
            reset();
            touches= [];
        }
    }else if(gameState===wait){
        sky.velocityX=0;
        birdGroup.setVelocityXEach(0);
        fuelGroup.setVelocityXEach(0);
        Aplane.visible= false;
        birdGroup.destroyEach();

        fuelGroup.setLifetimeEach(-1);

        if(keyDown("up")){
            gameState= play;
        }

    }else if(gameState===win){
        gameWon.visible= true;

        sky.velocityX= 0;
        birdGroup.setVelocityXEach(0);
        fuelGroup.setVelocityXEach(0);
        Aplane.visible= false;
        birdGroup.destroyEach();

        fuelGroup.setLifetimeEach(-1);

        if(keyDown("SPACE")||touches.length>0){
            reset();
            touches= [];
        }
    }
    if(score===km[r]){
        gameState= win;
    }

    if (fuelCollection > 0 && gameState===play) {
      fuelCollection-=0.3;
    }

    if (fuelCollection <= 0 && gameState===play) {
      gameState = end;
    }

    drawSprites();

    if(gameState===wait){
        textSize(20);
    fill(0);
    text("*Fly the plane safely to "+dest[r]+".",50,100);
    text("*Cover "+km[r]+"km to win the game.",50,130);
    text("*Avoid the obstacles",50,160);
    text(" and refil the fuel tank by collecting fuels.",50,190);
    text("*Tap the up arrow key to start.",50,220);
    }

    textSize(20);
    fill(0);
    text("Fuel: "+fuelCollection,10,30);
    text("Distance covered: "+score,100,30);
}

function spawnBirds(){
    if(frameCount%150===0){
        var bird= createSprite(600, Math.round(random(30,370)), 10,10);
        bird.addAnimation("bird",birdImg);
        bird.scale= 0.2;
        bird.velocityX= -(6+score/100);
        bird.lifetime= 300;
        //bird.debug= true;
        bird.setCollider("rectangle",0,0,250,100)
        birdGroup.add(bird);
    }
}

function spawnFuel(){
    if(frameCount%210===0){
        var fuel= createSprite(600, Math.round(random(30,370)), 10,10);
        fuel.addImage(fuelImg);
        fuel.scale= 0.02;
        fuel.velocityX= -(6+score/100);
        fuel.lifetime= 300;
        //fuel.debug= true;
        fuel.setCollider("rectangle",200,100)
        fuelGroup.add(fuel);
    }
}

function reset(){
    gameState= wait;
    gameOver.visible= false;
    gameWon.visible= false;

    fuelGroup.destroyEach();
    birdGroup.destroyEach();

    score=0;
    fuelCollection=50;
    Aplane.y=200;
}