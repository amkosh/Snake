let stage = 0;
let first = document.getElementById("first");   //Сегмент, куда будет помещено игровое поле
let info = document.getElementById("score");    //Для вывода очков
let infoLvl = document.getElementById('lvl');   //Для вывода уровня
let infoSize = document.getElementById('size'); //Для вывода длины змеи
let message = document.getElementById('message'); //Для вывода информации
let field = [20];   //Создаем массив для игрового поля (количество рядов)
let items = [20];   //Создаем массив для предметов (той же величины, что и поле)
let score = 0;  //Счетчик очков
let x = 9;  //Начальная координата игрока
let y = 9;  //Начальная координата игрока
let unitCellX = []; //Хранилище координат X для отображения всей длины змеи
let unitCellY = []; //Хранилище координат Y для отображения всей длины змеи
unitCellX.push(x); //Добавляем первую ячейку в хранилище змеи
unitCellY.push(y); //Добавляем первую ячейку в хранилище змеи
let unitSize = 1;   //Счетчик длины змеи (для циклов)
let fail = false;   //Gameover
let isPause = false;    //Pause
let editor = false;

let direction = 'ArrowUp';  //Начальная ориентация змеи
let speed = 20; //Число кадров перед обновлением
let level = 0;  //Начальный уровень

//Параметры
let autoMove = true;
let borders = true;
let selfDestruct = true;

function autoMoveToggle(){
    autoMove = !autoMove;
}
function bordersToggle(){
    borders = !borders;
}
function selfDestructToggle(){
    selfDestruct = !selfDestruct;
}
//

//Таблица рекордов
let hiScore = [100000, 90000, 80000, 70000, 60000, 50000, 40000, 30000, 20000, 10000];

//Выдача очков в зависимости от сложности
function getScore(){
    if(autoMove && borders && selfDestruct){
        return 100 * (level+1);
    } else if(!autoMove && !borders && !selfDestruct){
        return 20 * (level+1);
    } else if (autoMove || borders || selfDestruct) {
        return 40 * (level+1);
    }
}

//Обновление таблицы рекордов
function hiScoreDraw() {
    for(let i = 0; i < 10; i++){
        if(i+1 == 10){
            document.getElementById('p' + (i+1)).innerText = (i+1) + '.' + hiScore[i];
        } else {
            document.getElementById('p' + (i+1)).innerText = (i+1) + '. ' + hiScore[i];
        }
    }
}

function hiScoreSave(){
    let pos = 10;
    for (let i = 0; i < hiScore.length; i++){
        if(score > hiScore[i]){
            pos = i;
            break;
        } else {
            continue;
        }
    }
    hiScore.splice(pos, 0, score);
    hiScore.pop();
    if(pos != 10){
        document.getElementById('p' + (pos+1)).style.color = '#f00';
    }
    hiScoreDraw();
}

function drawScore() {
    for (let i = 0; i < hiScore.length; i++){
        if(score > hiScore[i]){
            info.style.color = '#f00';
        }
    }

    info.innerText = score;
    infoSize.innerText = unitSize;
}

// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
//Счетчик кадров
let count = 0;
//Таймер бонуса
let bonusTimer = 0;
let bonusX = 0;
let bonusY = 0;

document.body.addEventListener("keydown", controls); //Обработчик ввода

//Заполнение массива поля
for(let i = 0; i < 20; i++) {
    field[i] = [20];
}

//Заполнение массива предметов
for(let i = 0; i < 20; i++) {
    items[i] = [20];
}

initField();    //Заполнение поля div'ами
restart();  //Старт

//Обработчик ввода
function controls(event){
    if(!fail){
        if(event.key == ' '){
            pause();
        } else if (isPause == true) {
            move(event.key);
        }
    }
}

//Заполнение массива с предметами нулями
function initItems() {
    for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++){
            items[i][j] = 0;
        }
    }
}

//Добавление предмета на поле
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

//Добавления бонуса на поле
function addBonusItem() {
    if(getRandomInt(0,1000) == 7 && bonusTimer == 0){
        let a = getRandomInt(0, 19);
        let b = getRandomInt(0, 19);
        while(field[a][b].className != "field"){
            a = getRandomInt(0, 19);
            b = getRandomInt(0, 19);
        }
        items[a][b] = 2;
        bonusX = a;
        bonusY = b;
        bonusTimer = 150;
        drawField();
    }
    if(bonusTimer == 0){
        items[bonusX][bonusY] = 0;
    }
}

//Заполнение массива div'ами и их размещение на странице
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

//Отрисовка текущего состояния поля
function drawField(){
    if(!fail && !editor){
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                if(items[i][j] != 0){
                    switch(items[i][j]){
                        case 1: field[i][j].className = "item";
                        break;
                        case 2: field[i][j].className = "bonus__item";
                        break;
                    }
                } else if (field[i][j].className != 'block') {
                    field[i][j].className = "field";
                }
            }
        }
        initUnit();
    }
}

//Проверка столкновений
function colCheck(){
    //Проверка на стены
    if((x < 0 || x > 19 || y < 0 || y > 19) && borders) {
        gameOver();
    }

    //Телепорт сквозь рамки
    else if (x < 0){
        x = 19;
    } else if (x > 19){
        x = 0;
    } else if (y < 0){
        y = 19;
    } else if (y > 19){
        y = 0;
    }
    
    //Проверка на предмет
    else if(items[x][y] == 1){
        addItem();
        items[x][y] = 0;
        score += getScore();
        drawScore();
        unitSize++;
        unitGrowUp();
        lvlUp();
    }

    //Проверка на бонус
    else if (items[x][y] == 2){
        items[x][y] = 0;
        score += 5000;
        drawScore();
    }

    //Проверка на змею
    else if (field[x][y].className == "unit" && selfDestruct) {
        gameOver();
    }

    //Проверка на блоки
    else if (field[x][y].className == "block" && borders) {
        gameOver();
    }
}

//Остановка игры при проигрыше
function gameOver() {
    hiScoreSave();
    for(let i = 0; i < unitSize; i++){
        let tmpX = unitCellX[i];
        let tmpY = unitCellY[i];
        field[tmpX][tmpY].className = "dead";
    }
    fail = true;
    document.getElementById("game_over").innerText = 'GAME OVER!';
    document.getElementById("game_over").className = 'gameover';
    message.innerText = 'Press RESTART for another try!'
    message.className = 'message'
    cancelAnimationFrame(rAF);
}

//Рестарт, сброс параметров на начальное значение
function restart() {
    if(!editor){
        mapDraw();
        mapLoader();
        x = 9;
        y = 9;
        isPause = false;
        fail = false;
        unitSize = 1;
        score = 0;
        info.style.color = '#fff';
        drawScore();
        level = 0;
        speed = 15;
        document.getElementById("game_over").innerText = '';
        document.getElementById("game_over").className = '';
        message.className = 'hidden_btn';
        infoLvl.innerText = level;
        direction = 'ArrowUp';
        rAF = null;
    
        unitCellX = [];
        unitCellY = [];
        unitCellX.push(x);
        unitCellY.push(y);
    
        initItems();
        drawField();
        addItem();
        hiScoreDraw()
    }
}

//Рост змеи при поглощении предмета
function unitGrowUp() { //TODO: Вынесено в класс
    unitCellX.push(x);
    unitCellY.push(y);
}

//Повышение уровня сложности, проверка на победу
function lvlUp() {
    if((unitSize) % 10 == 0) {
        speed--;
        level++;
        infoLvl.innerText = level;
    }
    if(unitSize >= 100){
        document.getElementById("game_over").innerText = 'YOU WON!!!';
    }
}

//Отрисовка змеи
function initUnit() { //TODO: Вынесено в класс
    for(let i = unitSize-1; i >= 0; i--){
        let tmpX = unitCellX[i];
        let tmpY = unitCellY[i];
        field[tmpX][tmpY].className = "unit";

        if(i == 0){
            field[tmpX][tmpY].className = "unit__head";
        }
    }
}

//Передвижение змеи
function move(event){ //TODO: Вынесено в класс
    if(fail == false){
        /*
        if((event == 'ArrowUp' && direction == 'ArrowDown')||
            (event == 'ArrowDown' && direction == 'ArrowUp')||
            (event == 'ArrowRight' && direction == 'ArrowLeft')||
            (event == 'ArrowLeft' && direction == 'ArrowRight')
        ){
            unitReverse();
        }
        */
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

//Рандомное целое число
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Цикл анимации
function loop() {
    // начинаем анимацию
    rAF = requestAnimationFrame(loop);
    // фигура сдвигается вниз каждые 35 кадров
    if (++count > speed && autoMove) {
		//Движение змеи
        move(direction);
      count = 0;
    }
    if(bonusTimer == 0){
        addBonusItem();
    } else {
        bonusTimer--;
    }
}

//Пауза
function pause() {
    let button = document.getElementById('pause');
    isPause = !isPause;
    if(isPause){
        rAF = requestAnimationFrame(loop);
        button.innerText = 'PAUSE';
        document.getElementById("game_over").innerText = '';
        document.getElementById("game_over").className = '';
    } else {
        cancelAnimationFrame(rAF);
        button.innerText = 'RESUME';
        document.getElementById("game_over").innerText = 'PAUSE';
        document.getElementById("game_over").className = 'gameover';
    }
}

//Загрузка карты
function mapDraw() {
    let map = maps['stage' + stage];
    if(map){
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                if(map[i][j] == 1){
                    field[i][j].className = 'block';
                } else {
                    field[i][j].className = 'field';
                }
            }
        }
    }
}

//Редактор уровней
let editMap = [20];
function runEditor(){
    let tempMap = [20];
    editor = !editor;
    if(editor){
        document.getElementById('save').className = 'button';
        document.getElementById('delete').className = 'button';
        first.addEventListener("click", addBlock);
        let map = maps['stage' + stage];
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                if(map[i][j] == 1){
                    field[i][j].className = 'block_edit';
                } else {
                    field[i][j].className = 'editor';
                }
            }
        }
        for(let i = 0; i < 20; i++) {
            tempMap[i] = [20];
        }
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                tempMap[i][j] = 0;
            }
        }
        editMap = tempMap;
    } else if (!editor){
        document.getElementById('save').className = 'hidden_btn';
        document.getElementById('delete').className = 'hidden_btn';
        first.removeEventListener("click", addBlock);
        restart();
    }
}

function addBlock(event){
    id = event.target.id;
    if(document.getElementById(id).className == 'editor'){
        document.getElementById(id).className = 'block_edit';
    } else if (document.getElementById(id).className == 'block_edit'){
        document.getElementById(id).className = 'editor';
    }
}

function saveMap(){
    for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++){
            if(field[i][j].className == 'block_edit'){
                editMap[i][j] = 1;
            }
        }
    }
    let num = 0;
    for(max in maps){
        num++;
    }
    maps['stage' + num] = editMap;
    mapLoader();
    runEditor();
}

function setStage(){
    e = document.getElementById("stage");
    stage = e.value;
    restart();
    if(editor){
        let map = maps['stage' + stage];
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                if(map[i][j] == 1){
                    field[i][j].className = 'block_edit';
                } else {
                    field[i][j].className = 'editor';
                }
            }
        }
    }
}

function deleteMap() {
    if (stage != 0){
        message.innerText = `Stage ${stage} deleted!`;
        message.className = 'message';
        delete maps['stage' + stage];
        stage = 0;
        runEditor();
        restart();
    } else {
        message.innerText = "Stage 1 can't be deleted!";
        message.className = 'message';
    }
}

function mapLoader() {
    document.getElementById("stage").innerHTML = '';
    let num = 0;
    for(max in maps){
        let opt = document.createElement('option');
        opt.value = num;
        opt.id = num;
        opt.innerText = num+1;
        document.getElementById("stage").appendChild(opt);
        num++;
    }
}

function unitReverse() { //TODO: Вынесено в класс
    //Помещаем в x и y последние элемента массивов Cell
    x = unitCellX[unitCellX.length-1];
    y = unitCellY[unitCellY.length-1];
    //Разворачиваем массивы
    unitCellX.reverse();
    unitCellY.reverse();
}

//Отдельный класс для змеюки
class Snake {
    constructor() {
        this.x = 9;  //Начальная координата игрока
        this.y = 9;  //Начальная координата игрока
        this.unitCellX = []; //Хранилище координат X для отображения всей длины змеи
        this.unitCellY = []; //Хранилище координат Y для отображения всей длины змеи

        unitCellX.push(x); //Добавляем первую ячейку в хранилище змеи
        unitCellY.push(y); //Добавляем первую ячейку в хранилище змеи
        this.orientation = [];
        this.orientation.push('U');
        this.unitSize = 1;
    }

    unitReverse() {
        //Помещаем в x и y последние элемента массивов Cell
        this.x = unitCellX[unitCellX.length-1];
        this.y = unitCellY[unitCellY.length-1];
        //Разворачиваем массивы
        this.unitCellX.reverse();
        this.unitCellY.reverse();
    }

    move(event){
        if(fail == false){
            /*
            if((event == 'ArrowUp' && direction == 'ArrowDown')||
                (event == 'ArrowDown' && direction == 'ArrowUp')||
                (event == 'ArrowRight' && direction == 'ArrowLeft')||
                (event == 'ArrowLeft' && direction == 'ArrowRight')
            ){
                unitReverse();
            }
            */
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
            this.unitCellX.unshift(x);
            this.unitCellY.unshift(y);
            this.unitCellX.pop();
            this.unitCellY.pop();
            drawField();
        }
    }

    //Отрисовка змеи
    initUnit() {
        for(let i = this.unitSize-1; i >= 0; i--){
            let tmpX = this.unitCellX[i];
            let tmpY = this.unitCellY[i];
            field[tmpX][tmpY].className = "unit";

            if(i == 0){
                field[tmpX][tmpY].className = "unit__head";
            }
        }
    }

    //Рост змеи при поглощении предмета
    unitGrowUp() {
        this.unitCellX.push(x);
        this.unitCellY.push(y);
        switch(direction) {
            case 'ArrowUp': this.orientation = 'U';
                break;
                case 'ArrowDown': this.orientation = 'D';
                break;
                case 'ArrowRight': this.orientation = 'R';
                break;
                case 'ArrowLeft': this.orientation = 'L';
                break;
        }
    }
}