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
document.body.addEventListener("keydown", move);

function initItems() {
    for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++){
            items[i][j] = 0;
        }
    }
}

function addItem() {
    let a = Math.floor(Math.random(9)*10) + Math.floor(Math.random(9)*10);
    let b = Math.floor(Math.random(9)*10) + Math.floor(Math.random(9)*10);
    while(field[a][b].style.background != ""){
        a = Math.floor(Math.random(9)*10) + Math.floor(Math.random(9)*10);
        b = Math.floor(Math.random(9)*10) + Math.floor(Math.random(9)*10);
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
        }
    }
}
function drawField(){
    if(fail == false){
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                if(items[i][j] == 1){
                    field[i][j].style.background = "#ff0000";
                } else {
                    field[i][j].style.background = "";
                }            
                first.appendChild(field[i][j]);
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
    } //Проверка на предмет
    else if(items[x][y]){
        addItem();
        items[x][y] = 0;
        score++;
        unitSize++;
        unitGrowUp();
        
    } //Проверка на змею
    else if (field[x][y].style.background == "rgb(0, 255, 0)") {
        fail = true;
        info.parentElement.innerHTML = 'GAME OVER!'
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
        field[tmpX][tmpY].style.background = "#00ff00";
    }
    //field[x][y].style.background = "#00ff00";
}

function move(event){
    if(fail == false){
        switch(event.key){
            case 'ArrowUp': --x;
            break;
            case 'ArrowDown': ++x;
            break;
            case 'ArrowRight': ++y;
            break;
            case 'ArrowLeft': --y;
            break;
        }
        colCheck();
        unitCellX.unshift(x);
        unitCellY.unshift(y);
        unitCellX.pop();
        unitCellY.pop();
        drawField();
    }
}


