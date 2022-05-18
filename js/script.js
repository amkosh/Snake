let first = document.getElementById("first");
let info = document.getElementById("score");
let field = [20];
let items = [20];
let score = 0;
let x = 9;
let y = 9;
let unitCellX = [];
let unitCellY = [];
unitCellX.push(x);
unitCellY.push(y);
let unitSize = 1;
let fail = false;
let isPause = false;

let direction = 'ArrowUp';
let speed = 10;

// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null; 
//Счетчик кадров
let count = 0;

for(let i = 0; i < 20; i++) {
    field[i] = [20];
}

for(let i = 0; i < 20; i++) {
    items[i] = [20];
}

initItems();
initField();
drawField();
addItem();
document.body.addEventListener("keydown", controls);

function controls(event){
    console.log(event);
    if(event.key == ' '){
        pause();
    } else if (isPause == true) {
        move(event.key);
    }
    
}

function initItems() {
    for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++){
            items[i][j] = 0;
        }
    }
}

function addItem() {
    let a = getRandomInt(0, 19);
    let b = getRandomInt(0, 19);
    while(field[a][b].className != "field"){
        a = getRandomInt(0, 19);
        b = getRandomInt(0, 19);
    }
    items[a][b] = 1;
    drawField();
}

function initField(){
    let id = 0;
    for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++){
            let div = document.createElement('div');
            div.id = ++id;
            field[i][j] = div;
            first.appendChild(field[i][j]);
        }
    }
}

function drawField(){
    if(fail == false){
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                if(items[i][j] == 1){
                    field[i][j].className = "item";
                } else {
                    field[i][j].className = "field";
                }
                
            }
        }
        initUnit();
        info.innerText = score;
    }
}

function colCheck(){
    //Проверка на стены
    if(x < 0 || x > 19 || y < 0 || y > 19) {
        fail = true;
        info.parentElement.innerHTML = 'GAME OVER!'
        cancelAnimationFrame(rAF);
    } //Проверка на предмет
    else if(items[x][y]){
        addItem();
        items[x][y] = 0;
        score++;
        unitSize++;
        unitGrowUp();
        
    } //Проверка на змею
    else if (field[x][y].className == "unit") {
        fail = true;
        info.parentElement.innerHTML = 'GAME OVER!'
        cancelAnimationFrame(rAF);
    }
}

function unitGrowUp() {
    unitCellX.push(x);
    unitCellY.push(y);
}

function initUnit() {
    for(let i = 0; i < unitSize; i++){
        let tmpX = unitCellX[i];
        let tmpY = unitCellY[i];
        field[tmpX][tmpY].className = "unit";
    }
    //field[x][y].style.background = "#00ff00";
}

function move(event){
    if(fail == false){
        switch(event){
            case 'ArrowUp': --x;    direction = event;
            break;
            case 'ArrowDown': ++x;  direction = event;
            break;
            case 'ArrowRight': ++y; direction = event;
            break;
            case 'ArrowLeft': --y;  direction = event;
            break;
            default: return;
        }
        count = 0;
        colCheck();
        unitCellX.unshift(x);
        unitCellY.unshift(y);
        unitCellX.pop();
        unitCellY.pop();
        drawField();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loop() {
    // начинаем анимацию
    rAF = requestAnimationFrame(loop);
    // фигура сдвигается вниз каждые 35 кадров
    if (++count > speed) {
		//Движение змеи
        move(direction);
      count = 0;
    }
}

function pause() {
    let button = document.getElementById('pause');
    isPause = !isPause;
    if(isPause){
        rAF = requestAnimationFrame(loop);
        button.innerText = 'PAUSE';
    } else {
        cancelAnimationFrame(rAF);
        button.innerText = 'RESUME';
    }
    
}

//rAF = requestAnimationFrame(loop);