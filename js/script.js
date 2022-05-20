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
let fail = false;   //Gameover
let isPause = false;    //Pause
let editor = false; //Запущенный редактор
let speed = 20; //Число кадров перед обновлением
let level = 0;  //Начальный уровень

//Параметры (читы)
let autoMove = true;
let borders = true;
let selfDestruct = true;
let reverse = false;

//Переключение параметров
function autoMoveToggle(){
    autoMove = !autoMove;
}
function bordersToggle(){
    borders = !borders;
}
function selfDestructToggle(){
    selfDestruct = !selfDestruct;
}
function reverseToggle(){
    reverse = !reverse;
}

//Таблица рекордов
let hiScore = [100000, 90000, 80000, 70000, 60000, 50000, 40000, 30000, 20000, 10000];

//Выдача очков в зависимости от сложности
function getScore(){
    if(autoMove && borders && selfDestruct && !reverse){
        return 100 * (level+1);
    } else if(!autoMove && !borders && !selfDestruct){
        return 20 * (level+1);
    } else if (autoMove || borders || selfDestruct || reverse) {
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

//Сохранение рекордов
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

//Обновление счетчика очков
function drawScore() {
    for (let i = 0; i < hiScore.length; i++){
        if(score > hiScore[i]){
            info.style.color = '#f00';
            message.innerText = 'You got a HI-Score!!!';
            message.className = 'message';
        }
    }
    info.innerText = score;
    infoSize.innerText = snake.unitSize;
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

let snake = new Snake();

initField();    //Заполнение поля div'ами
restart();  //Старт

//Обработчик ввода
function controls(event){
    if(!fail){
        if(event.key == ' '){
            pause();
        } else if (isPause == true) {
            snake.move(event.key);
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
        snake.initUnit();
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
        snake.unitSize++;
        snake.unitGrowUp();
        lvlUp();
        score += getScore();
        drawScore();
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
    for(let i = 0; i < snake.unitSize; i++){
        let tmpX = snake.unitCellX[i];
        let tmpY = snake.unitCellY[i];
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
        //direction = 'ArrowUp';
        rAF = null;
        snake.unitCellX = [];
        snake.unitCellY = [];
        snake.unitCellX.push(x);
        snake.unitCellY.push(y);
        initItems();
        hiScoreDraw()
        addItem();
        drawField();
    }
}

//Повышение уровня сложности, проверка на победу
function lvlUp() {
    if((snake.unitSize) % 10 == 0) {
        speed--;
        level++;
        infoLvl.innerText = level;
    }
    if(snake.unitSize >= 100){
        document.getElementById("game_over").innerText = 'YOU WON!!!';
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
        snake.move(snake.orientation[0]);
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

//Отрисовка карты
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

//Переключение текущего уровня
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

//Загрузчик карты
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