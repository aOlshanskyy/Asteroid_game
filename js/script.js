const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.fillStyle = '#000';
var bg = new Image();
bg.src = "./image/bg.jpg";
bg.onload = function() {
    context.drawImage(bg, 0, 0);
    
}
var gameOver = false;

const ship = {
    live: true,
    angle: 0,
    pos: {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    move: {
        x: 0,
        y: 0
    },
    radius: 10,
    draw: drawShip = () =>{
        let radians = ship.angle * Math.PI / 180; 
        context.save();
        context.translate(ship.pos.x, ship.pos.y);
        context.rotate(radians);
    
        context.fillStyle = 'white';
        context.strokeStyle = '#11365c';
        var halfSize = 20 / 1.2;
        context.beginPath();
        context.moveTo(-20, -halfSize);
        context.lineTo(-20 + (halfSize / 2), 0);
        context.lineTo(-20, halfSize);
        context.lineTo(20, 0);
        context.lineTo(-20, -halfSize);
        context.closePath();
        context.fill();
        context.stroke();

        context.restore();
    },
    shots: [],
    killed: 1
}

function Shot(posX, posY, angleCos, angleSin, angle){
    this.live = true;
    this.pos = {
        x: posX,
        y: posY
    };
    this.angle = angle;
    this.move = {
        x: angleCos,
        y: -angleSin
    };
    this.radius = 2;
    this.draw = (item) => {
        context.translate(this.pos.x, this.pos.y);
        context.rotate(this.angle * Math.PI / 180);
        context.beginPath();
        context.arc(0, 0, 2, 0, 2 * Math.PI, true);
        context.fillStyle = 'white';
        context.fill();
        context.stroke();
        context.setTransform(1, 0, 0, 1, 0, 0);
    } 
}
let asteroidCount = [];
let positionAsteroid = [[0, Math.floor(Math.random() * (canvas.height - 1)) + 1],
                     [0, Math.floor(Math.random() * (canvas.width - 1)) + 1],
                      [canvas.height, Math.floor(Math.random() * (canvas.height - 1)) + 1],
                       [canvas.width, Math.floor(Math.random() * (canvas.width - 1)) + 1]];
function Asteroid(size, arrayXY = positionAsteroid[Math.floor(Math.random() * positionAsteroid.length)]){
    this.pos = {
        x: arrayXY[0],
        y: arrayXY[1]
    };
    this.angle = Math.floor(Math.random() * (180 - 1)) + 1;
    let radians = this.angle * Math.PI / 180; 
    this.move = {
        x: Math.cos(radians * Math.floor(Math.random() * (7 - 2)) + 2),
        y: Math.sin(radians * Math.floor(Math.random() * (7 - 2)) + 2)
    };
    this.radius = size;
    this.draw = (item) =>{
        context.translate(this.pos.x, this.pos.y);
        context.rotate(this.angle * Math.PI / 180);
        context.beginPath();
        context.fillStyle = '#BDBDBD';
        context.strokeStyle = '#BDBDBD';
        context.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
        context.fill();
        context.stroke();
        context.setTransform(1, 0, 0, 1, 0, 0);        
    }
}
for(let i = 0; i<5; i++){
    asteroidCount.push(new Asteroid(Math.floor(Math.random() * (50 - 15)) + 15));
}
document.addEventListener('keydown', event =>{ 
    let radians = ship.angle * Math.PI / 180;
    switch (event.keyCode){
        case 37:
            ship.angle -= 12;
            break;
        case 39:
            ship.angle += 12;
            break;
        case 38:
            ship.move.x = Math.cos(radians*3) ;
            ship.move.y = Math.sin(radians*3) ;
            break;
        case 40:
            // document.location.reload();
            break;
    }
});

document.addEventListener('keyup', event =>{
    let radians = ship.angle * Math.PI / 180;
    switch (event.keyCode){
        case 32:
            ship.shots.push(new Shot(ship.pos.x, ship.pos.y, Math.cos(radians)*3, -Math.sin(radians)*5, ship.angle));
            break;
        case 82:
            document.location.reload();
            break;
    }
})

function collision(obj1, obj2){
    let total = obj1.radius + obj2.radius;
    if (total > Math.sqrt(Math.pow(obj1.pos.x - obj2.pos.x, 2) + Math.pow(obj1.pos.y - obj2.pos.y, 2))) return true;    
    return false;
}

function update(){
    ship.pos.x += ship.move.x;
    ship.pos.y += ship.move.y;
    for(let i = 0; i<ship.shots.length; i++){
        ship.shots[i].pos.x += ship.shots[i].move.x;
        ship.shots[i].pos.y += ship.shots[i].move.y;
        if ((canvas.width < ship.shots[i].pos.x) || (0 > ship.shots[i].pos.x) || (canvas.height < ship.shots[i].pos.y) || (0 > ship.shots[i].pos.y)) {
            ship.shots[i].live = false;
            ship.shots.splice(i, 1);
        }
    }

    if (ship.pos.x > canvas.width) {
        ship.pos.x = 0;
    }
    if (ship.pos.x < 0) {
        ship.pos.x = canvas.width;
    }
    if (ship.pos.y < 0) {
        ship.pos.y = canvas.height;
    }
    if (ship.pos.y > canvas.height) {
        ship.pos.y = 0;
    }
    for(let i = 0; i < asteroidCount.length; i++){
        if(collision(asteroidCount[i], ship)) gameOver = true;
        if(asteroidCount.length != 0){
            if (asteroidCount[i].pos.x > canvas.width) {
                asteroidCount[i].pos.x = 0;
            }
            if (asteroidCount[i].pos.x < 0) {
                asteroidCount[i].pos.x = canvas.width;
            }
            if (asteroidCount[i].pos.y < 0) {
                asteroidCount[i].pos.y = canvas.height;
            }
            if (asteroidCount[i].pos.y > canvas.height) {
                asteroidCount[i].pos.y = 0;
            }
        }
        asteroidCount[i].pos.x += asteroidCount[i].move.x;
        asteroidCount[i].pos.y += asteroidCount[i].move.y; 
        for(let j = 0; j<ship.shots.length; j++){
            if(collision(asteroidCount[i], ship.shots[j])) {
                ship.shots[j].live = false;
                ship.shots.splice(j, 1);
                
                if(asteroidCount[i].radius > 15){
                    let newAsteroidCount = Math.floor(asteroidCount[i].radius/10);
                    let createAsteroid = 0;
                    while(createAsteroid < newAsteroidCount){
                        let coordinate = [asteroidCount[i].pos.x, asteroidCount[i].pos.y]
                        asteroidCount.push(new Asteroid(15, coordinate));
                        createAsteroid++;
                    }
                    asteroidCount.splice(i, 1);
                    console.log(newAsteroidCount);
                }else{
                    asteroidCount.splice(i, 1);
                    ship.killed++;
                }
            } 
        } 
    }
}

function run(){
    if(!gameOver){
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0,canvas.width, canvas.height )
        context.drawImage(bg, 0, 0);
        update();
        ship.draw();
        for(let i = 0; i<ship.shots.length; i++){
            if(ship.shots[i].live) ship.shots[i].draw(ship.shots[i]);
        }
        for(let i = 0; i< asteroidCount.length; i++){
            asteroidCount[i].draw();   
            if(asteroidCount.length < 3){
                asteroidCount.push(new Asteroid(30));
            }
        }
    }else{
        clearInterval(run);
        context.fillStyle = "#ffffff";
        context.font = "35px Arial";
        context.textBaseline = "top";
        context.fillText(`Гру завершено ! Вами знищенно астероїдів - ${ship.killed - 1}`, 320, 100);
        context.fillStyle = "#4AEAEF";
        context.fillText(`Спробувати ще тисни R`, canvas.width/2 - 100, 150);
    }
}
setInterval(run, 10);




