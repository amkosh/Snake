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
let portal = false;
let lives = 2;
let liveScore = 50000;
let gotHiScore = false;
let lvlGrow = 10;
let goal = stageParams['stage' + stage][0];

//Twin Snake
let xP2 = 15;
let yP2 = 15;
let player2 = true;

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
        if(score > hiScore[i] && !gotHiScore){
            info.style.color = '#f00';
            message.innerText = 'You got a HI-Score!!!';
            message.className = 'message';
            gotHiScore = true;
        }
    }
    if(score > liveScore){
        lives++;
        liveScore+= 50000;
        message.innerText = '1UP !!!';
        message.className = 'message';
        document.getElementById("lives").innerText = lives;
    }
    info.innerText = score;
    if(!portal){
        //infoSize.innerText = goal - snake.unitSize; TODO: snake
        infoSize.innerText = goal - snake2.unitSize;
    }
    
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

//let snake = new Snake(); //TODO: snake
let snake2 = new SolidSnake();

initField();    //Заполнение поля div'ами
restart();  //Старт

//Обработчик ввода
function controls(event){
    if(!fail){
        if(event.key == ' '){
            pause();
        } else if ((isPause == true) && (event.key == 'ArrowUp' || event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'ArrowDown')) {
            snake.move(event.key);
        } else if ((isPause == true) && (event.key == 'w' || event.key == 'a' || event.key == 'd' || event.key == 's')) {
            if(player2){
                snake2.move(event.key);
            }
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
    while(field[a][b].className != "field" || field[a][b].className == "grass"){
        a = getRandomInt(0, 19);
        b = getRandomInt(0, 19);
    }
    items[a][b] = 1; //1: snack
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
        items[a][b] = 2; //2: bonus
        bonusX = a;
        bonusY = b;
        bonusTimer = 150;
        drawField();
    }
    if(bonusTimer == 0){
        items[bonusX][bonusY] = 0;
    }
}

//Добавления портала выхода на следующий уровень
function addPortal(){
    let a = getRandomInt(0, 19);
    let b = getRandomInt(0, 19);
    while(field[a][b].className != "field"){
        a = getRandomInt(0, 19);
        b = getRandomInt(0, 19);
    }
    items[a][b] = 3; //3: portal
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
        mapDraw();
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                if(items[i][j] != 0){
                    switch(items[i][j]){
                        case 1: field[i][j].className = "item";
                        break;
                        case 2: field[i][j].className = "bonus__item";
                        break;
                        case 3: field[i][j].className = "portal";
                        break;
                    }
                }
            }
        }
        //snake.initUnit(); TODO: snake
        if(player2){
            snake2.initUnit();
        }
    }
}

//Проверка столкновений
function colCheck(player){
    //Проверка на стены
    if((player.x < 0 || player.x > 19 || player.y < 0 || player.y > 19) && borders) {
        gameOver(player);
    }
    //Телепорт сквозь рамки
    else if (player.x < 0){
        player.x = 19;
    } else if (player.x > 19){
        player.x = 0;
    } else if (player.y < 0){
        player.y = 19;
    } else if (player.y > 19){
        player.y = 0;
    }
    //Проверка на предмет
    else if(items[player.x][player.y] == 1){
        addItem();
        items[player.x][player.y] = 0;
        player.unitSize++;
        player.unitGrowUp();
        lvlUp(player);
        score += getScore();
        drawScore();
    }
    //Проверка на бонус
    else if (items[player.x][player.y] == 2){
        items[player.x][player.y] = 0;
        score += 5000;
        drawScore();
    }
    //Проверка на портал
    else if (items[player.x][player.y] == 3){
        nextStage();
    }

    //Проверка на змею
    else if (field[player.x][player.y].className == "unit__foe" && selfDestruct) {
        gameOver(player);
    }

    //Проверка на блоки
    else if (field[player.x][player.y].className == "block") {
        gameOver(player);
    }
}


//Остановка игры при проигрыше
function gameOver(player) {
    lives--;
    if(lives < 0){
        hiScoreSave();
        for(let i = 0; i < player.unitSize; i++){
            let tmpX = player.unitCellX[i];
            let tmpY = player.unitCellY[i];
            field[tmpX][tmpY].className = "dead";
        }
        fail = true;
        document.getElementById("game_over").innerText = 'GAME OVER!';
        document.getElementById("game_over").className = 'gameover';
        message.innerText = 'Press RESTART for another try!'
        message.className = 'message'
        cancelAnimationFrame(rAF);
    } else {
        for(let i = 0; i < player.unitSize; i++){
            let tmpX = player.unitCellX[i];
            let tmpY = player.unitCellY[i];
            field[tmpX][tmpY].className = "dead";
        }
        
        x = 9;
        y = 9;
        xP2 = 15;
        yP2 = 15;
        //snake = new Snake(); TODO: snake
        snake2 = new SolidSnake();
        if(isPause){
            pause();
        }
        fail = false;
        player.unitSize = 1;
        info.style.color = '#fff';
        drawScore();
        level = 0;
        paramsLoad();
        document.getElementById("game_over").innerText = '';
        document.getElementById("game_over").className = '';
        document.getElementById("lives").innerText = lives;
        message.className = 'hidden_btn';
        if(lives == 0){
            message.innerText = "Last chance!"
            message.className = 'message';
        }
        infoLvl.innerText = level;
        rAF = null;
        initItems();
        hiScoreDraw()
        cancelAnimationFrame(rAF);
        addItem();
    }
}

//Рестарт, сброс параметров на начальное значение
function restart() {
    if(!editor){
        lives = 2;
        document.getElementById("lives").innerText = lives;
        portal = false;
        mapDraw();
        mapLoader();
        x = 9;
        y = 9;
        //snake = new Snake(); TODO: snake
        if(isPause){
            pause();
        }
        fail = false;
        unitSize = 1;
        score = 0;
        info.style.color = '#fff';
        drawScore();
        level = 0;
        paramsLoad();
        document.getElementById("game_over").innerText = '';
        document.getElementById("game_over").className = '';
        message.innerText = stageName['stage' + stage];
        message.className = 'message';
        infoLvl.innerText = level;
        rAF = null;

        initItems();
        hiScoreDraw()
        addItem();
        drawField();
    }
}

//Повышение уровня сложности, проверка на победу
function lvlUp(player) {
    if((player.unitSize) % lvlGrow == 0) {
        speed--;
        level++;
        infoLvl.innerText = level;
    }
    if(player.unitSize >= goal){
        document.getElementById("game_over").innerText = 'STAGE COMPLETE!';
        message.innerText = 'Go to the portal!'
        message.className = 'message';
        if(!portal){
            addPortal();
            portal = true;
        }
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
        //snake.move(snake.orientation[0]); TODO: snake
        if(player2){
            snake2.move(snake2.orientation[0]);
        }
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
                } else if(map[i][j] == 2){
                    field[i][j].className = 'grass';
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
    paramsLoad();
    restart();
    if(editor){
        let map = maps['stage' + stage];
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++){
                switch(map[i][j]){
                    case 1: field[i][j].className = 'block_edit';
                    break;
                    case 2: field[i][j].className = 'grass_edit';
                    break;
                    case 0: field[i][j].className = 'editor';
                    break;
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
        opt.innerText = 'Stage ' + (num+1);
        document.getElementById("stage").appendChild(opt);
        num++;
    }
}

//Переход на следующий уровень
function nextStage(){
    stage++;
    if(isPause){
        pause();
    }
    snake = new Snake();
    portal = false;
    mapDraw();
    mapLoader();
    x = 9;
    y = 9;
    fail = false;
    unitSize = 1;
    info.style.color = '#fff';
    drawScore();
    level = 0;
    paramsLoad();
    document.getElementById("game_over").innerText = '';
    document.getElementById("game_over").className = '';
    message.innerText = stageName['stage' + stage];
    message.className = 'message';
    infoLvl.innerText = level;
    rAF = null;
    snake.unitCellX = [];
    snake.unitCellY = [];
    snake.unitCellX.push(x);
    snake.unitCellY.push(y);
    initItems();
    hiScoreDraw()
    drawField();
    addItem();
}