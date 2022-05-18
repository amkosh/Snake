let first = document.getElementById("first");   //Сегмент, куда будет помещено игровое поле
let info = document.getElementById("score");    //Для вывода очков
let infoLvl = document.getElementById('lvl');   //Для вывода уровня
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

let direction = 'ArrowUp';  //Начальная ориентация змеи
let speed = 15; //Число кадров перед обновлением
let level = 0;  //Начальный уровень

// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
//Счетчик кадров
let count = 0;

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
    if(event.key == ' '){
        pause();
    } else if (isPause == true) {
        move(event.key);
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

//Проверка столкновений
function colCheck(){
    //Проверка на стены
    if(x < 0 || x > 19 || y < 0 || y > 19) {
        gameOver();
    } //Проверка на предмет
    else if(items[x][y]){
        addItem();
        items[x][y] = 0;
        score += 100;
        unitSize++;
        unitGrowUp();
        lvlUp();
    } //Проверка на змею
    else if (field[x][y].className == "unit") {
        gameOver();
    }
}

//Остановка игры при проигрыше
function gameOver() {
    for(let i = 0; i < unitSize; i++){
        let tmpX = unitCellX[i];
        let tmpY = unitCellY[i];
        field[tmpX][tmpY].className = "dead";
    }
    fail = true;
    document.getElementById("game_over").innerText = 'GAME OVER!';
    cancelAnimationFrame(rAF);
}

//Рестарт, сброс параметров на начальное значение
function restart() {
    x = 9;
    y = 9;
    isPause = false;
    fail = false;
    unitSize = 1;
    score = 0;
    level = 0;
    speed = 15;
    document.getElementById("game_over").innerText = '';
    infoLvl.innerText = level;
    direction = 'ArrowUp';

    unitCellX = [];
    unitCellY = [];
    unitCellX.push(x);
    unitCellY.push(y);

    initItems();
    drawField();
    addItem();
}

//Рост змеи при поглощении предмета
function unitGrowUp() {
    unitCellX.push(x);
    unitCellY.push(y);
}

//Повышение уровня сложности, проверка на победу
function lvlUp() {
    if(score % 1000 == 0) {
        speed--;
        level++;
        infoLvl.innerText = level;
    }
    if(unitSize == 400){
        document.getElementById("game_over").innerText = 'YOU WON!!!';
    }
}

//Отрисовка змеи
function initUnit() {
    for(let i = 0; i < unitSize; i++){
        let tmpX = unitCellX[i];
        let tmpY = unitCellY[i];
        field[tmpX][tmpY].className = "unit";
    }
}

//Передвижение змеи
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
    if (++count > speed) {
		//Движение змеи
        move(direction);
      count = 0;
    }
}

//Пауза
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