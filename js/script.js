let stage = 0;
let first = document.getElementById("first");   //Сегмент, куда будет помещено игровое поле
//let info = document.getElementById("score");    //Для вывода очков
//let infoLvl = document.getElementById('lvl');   //Для вывода уровня
//let infoSize = document.getElementById('size'); //Для вывода длины змеи
let message = document.getElementById('message'); //Для вывода информации
let field = [20];   //Создаем массив для игрового поля (количество рядов)
let items = [20];   //Создаем массив для предметов (той же величины, что и поле)
//let score = 0;  //Счетчик очков
let fail = false;   //Gameover
let isPause = false;    //Pause
let editor = false; //Запущенный редактор
//let speed = 20; //Число кадров перед обновлением
//let level = 0;  //Начальный уровень
let portal = false;
let lives = 2;
let liveScore = 100000;
let aFlags = [false,false,false,false];

let lvlGrow = 10;
let goal = stageParams['stage' + stage][0];

//Twin Snake
let player2 = false;

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
function twinsToggle(){
    player2 = !player2;
    document.getElementById('infoP2').classList.toggle('hidden');
    document.getElementById('infoP2').classList.toggle('info');
    restart();
}

function mode(){
    let button = document.getElementById('mode');
    player2 = !player2;
    document.getElementById('infoP2').classList.toggle('hidden');
    document.getElementById('infoP2').classList.toggle('info');
    if(button.innerText == 'SOLO'){
        button.innerText = 'TEAM';
    } else {
        button.innerText = 'SOLO';
    }
    restart();
}

//Таблица рекордов
let hiScore = [100000, 90000, 80000, 70000, 60000, 50000, 40000, 30000, 20000, 10000];

//Выдача очков в зависимости от сложности
function getScore(player){
    if(autoMove && borders && selfDestruct && !reverse){
        return 100 * (player.level+1);
    } else if(!autoMove && !borders && !selfDestruct){
        return 20 * (player.level+1);
    } else if (autoMove || borders || selfDestruct || reverse) {
        return 40 * (player.level+1);
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
function hiScoreSave(player){
    let pos = 10;
    for (let i = 0; i < hiScore.length; i++){
        if(player.score > hiScore[i]){
            pos = i;
            break;
        } else {
            continue;
        }
    }
    hiScore.splice(pos, 0, player.score);
    hiScore.pop();
    if(pos != 10){
        if(player.player == 'p1'){
            document.getElementById('p' + (pos+1)).style.color = '#0f0';
        } else {
            document.getElementById('p' + (pos+1)).style.color = '#f00';
        }
        
    }
    hiScoreDraw();
}

//Обновление счетчика очков
function drawScore(player) {
    for (let i = 0; i < hiScore.length; i++){
        if(player.score >= hiScore[i] && !player.gotHiScore){
            player.info.style.color = '#f00';
            player.talk.innerText = "Yeahhh!!";
            player.gotHiScore = true;
        }
    }
    if(player.score > liveScore){
        lives++;
        liveScore+= 50000;
        player.talk.innerText = '1UP !!!';
        document.getElementById("lives").innerText = lives;
    }
    player.info.innerText = player.score;
    if(!portal){
        if(player2){
            snake2.infoSize.innerText = goal - (snake.unitSize + snake2.unitSize - 2);
            snake.infoSize.innerText = goal - (snake.unitSize + snake2.unitSize - 2);
        } else {
            player.infoSize.innerText = goal - (snake.unitSize-1);
        }
    }
}

// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
//Счетчик кадров
//let count = 0;
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
        if(!aFlags[1] && isPause){
            kCode(event.key);
        }
        if(event.key == ' '){
            pause();
        } else if ((isPause == true) && (event.key == 'ArrowUp' || event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'ArrowDown')) {
            snake.moving = true;
            snake.move(event.key);
        } else if ((isPause == true) && (event.key == 'w' || event.key == 'a' || event.key == 'd' || event.key == 's')) {
            if(player2){
                snake.moving = true;
                switch(event.key){
                    case 'w': snake2.move('ArrowUp');
                    break;
                    case 'a': snake2.move('ArrowLeft');
                    break;
                    case 's': snake2.move('ArrowDown');
                    break;
                    case 'd': snake2.move('ArrowRight');
                    break;
                }
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
    //while(field[a][b].className != "field" || field[a][b].className == "grass"){
    while(field[a][b].className == "unit" || field[a][b].className == "block" || field[a][b].className == "unit__foe"){
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
        snake.initUnit();
        if(player2){
            snake2.initUnit();
        }
    }
    if(!aFlags[3]){
        cornCheck();
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
        player.score += getScore(player);
        drawScore(player);
    }
    //Проверка на бонус
    else if (items[player.x][player.y] == 2){
        items[player.x][player.y] = 0;
        player.score += 5000;
        drawScore(player);
        player.talk.innerText = "So Tasty!!";
    }
    //Проверка на портал
    else if (items[player.x][player.y] == 3){
        locks[stage+1] = 1;
        nextStage();
    }

    //Проверка на себя
    else if ((field[player.x][player.y].className == "unit" || field[player.x][player.y].className == "unit__head") && selfDestruct) {
        gameOver(player);
    }

    //Проверка на второго игрока
    else if ((field[player.x][player.y].className == "unit__foe" || field[player.x][player.y].className == "unit__foe__head") && selfDestruct) {
        gameOver(player);
    }

    //Проверка на блоки
    else if (field[player.x][player.y].className == "block") {
        gameOver(player);
    }
}


//Остановка игры при проигрыше
function gameOver(player) {
    if(!aFlags[0] && player.x == player.unitCellX[player.unitSize-1] && player.y == player.unitCellY[player.unitSize-1]){
        message.innerText = 'Achievment unlocked: UROBOROS!!!';
        player.score += 10000;
        document.getElementById('achiev').className = 'info';
        document.getElementById('urobor').classList.remove('locked');
        aFlags[0] = true;
    }
    lives--;
    if(lives < 0){
        hiScoreSave(player);
        for(let i = 0; i < player.unitSize; i++){
            let tmpX = player.unitCellX[i];
            let tmpY = player.unitCellY[i];
            field[tmpX][tmpY].className = "dead";
        }
        fail = true;
        player.talk.innerText = 'GAME OVER!';
        player.talk.className = 'gameover';
        message.innerText = 'Press RESTART for another try!'
        message.className = 'message'
        cancelAnimationFrame(rAF);
    } else {
        for(let i = 0; i < player.unitSize; i++){
            let tmpX = player.unitCellX[i];
            let tmpY = player.unitCellY[i];
            field[tmpX][tmpY].className = "dead";
        }
        
        if(player.player == 'p2'){
            let tmpScoreP2 = snake2.score;
            snake2 = new Snake('p2');
            snake2.score = tmpScoreP2;
        } else {
            let tmpScoreP1 = snake.score;
            snake = new Snake('p1');
            snake.score = tmpScoreP1;
        }
        //paramsLoad();
        
        if(isPause){
            //pause();
        }
        fail = false;
        //player.unitSize = 1;
        player.info.style.color = '#fff';
        drawScore(player);
        //level = 0;
        
        //document.getElementById("game_over").innerText = '';
        //document.getElementById("game_over").className = '';
        document.getElementById("lives").innerText = lives;
        player.talk.innerText = "Ouch!!";
        if(lives == 0){
            player.talk.innerText = "Last chance!"
        }
        player.infoLvl.innerText = player.level;
        //rAF = null;
        initItems();
        hiScoreDraw()
        //cancelAnimationFrame(rAF);
        addItem();
    }
}

//Рестарт, сброс параметров на начальное значение
function restart() {
    if(!editor){
        lives = 2;
        document.getElementById("lives").innerText = lives;
        portal = false;
        
        mapLoader();
        snake = new Snake('p1');
        if(player2){
            snake2 = new Snake('p2');
        }
        paramsLoad();
        mapDraw();
        if(isPause){
            pause();
        }
        fail = false;
        //unitSize = 1;
        //score = 0;
        info.style.color = '#fff';
        drawScore(snake);
        //level = 0;
        
        //document.getElementById("game_over").innerText = '';
        //document.getElementById("game_over").className = '';
        message.innerText = stageName['stage' + stage];
        message.className = 'message';
        snake.infoLvl.innerText = snake.level;
        if(player2){
            snake2.infoLvl.innerText = snake2.level;
        }
        rAF = null;

        initItems();
        hiScoreDraw()
        addItem();
        drawField();
    }
}

//Повышение уровня сложности, проверка на победу
function lvlUp(player) {
    let sum = 0;
    if(player2){
        sum = (snake.unitSize + snake2.unitSize) - 2;
    } else {
        sum = snake.unitSize;
    }

    if(player.unitSize % lvlGrow == 0) {
        player.speed--;
        if(!aFlags[2] && player.speed <= 0){
            message.innerText = 'Achievment unlocked: LIGHTSPEED!!!';
            player.score += 10000;
            document.getElementById('achiev').className = 'info';
            document.getElementById('lightspeed').classList.remove('locked');
            player.talk.innerText = 'Aaaahhhh!'
            aFlags[2] = true;
        }
        player.level++;
        player.infoLvl.innerText = player.level;
    }
    if(sum >= goal){
        player.talk.innerText = 'STAGE COMPLETE!';
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
    if (++snake.count > snake.speed && autoMove && snake.moving) {
		//Движение змеи
        snake.move(snake.orientation[0]);
        snake.count = 0; 
    }
    if(player2 && (++snake2.count > snake2.speed && autoMove && snake2.moving)){
        snake2.move(snake2.orientation[0]);
        snake2.count = 0;
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
        snake.talk.innerText = '';
        snake.talk.className = '';
        message.innerText = stageName['stage' + stage];
        message.className = 'message';
    } else {
        cancelAnimationFrame(rAF);
        button.innerText = 'RESUME';
        snake.talk.innerText = 'PAUSE';
        snake.talk.className = 'gameover';
        message.innerText = stageInfo['stage' + stage];
        message.className = 'message';
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
    let dummy = document.createElement('option');
    dummy.innerText = 'Select';
    document.getElementById("stage").appendChild(dummy);
    for(max in maps){
        if(locks[num]){
            let opt = document.createElement('option');
            opt.value = num;
            opt.id = num;
            opt.innerText = 'Stage ' + (num+1);
            document.getElementById("stage").appendChild(opt);
        }
        num++;
    }
}

//Переход на следующий уровень
function nextStage(){
    stage++;
    if(isPause){
        pause();
    }
    let tmpScoreP1 = snake.score;
    snake = new Snake('p1');
    snake.score = tmpScoreP1;
    if(player2){
        let tmpScoreP2 = snake2.score;
        snake2 = new Snake('p2');
        snake2.score = tmpScoreP2;
    }
    
    portal = false;
    mapDraw();
    mapLoader();
    
    fail = false;
    
    info.style.color = '#fff';
    drawScore(snake);
    level = 0;
    paramsLoad();
    //document.getElementById("game_over").innerText = '';
    //document.getElementById("game_over").className = '';
    message.innerText = stageName['stage' + stage];
    message.className = 'message';
    //infoLvl.innerText = level;
    rAF = null;

    initItems();
    hiScoreDraw()
    drawField();
    addItem();
}

let kCCheck = 0;
function kCode(key){
    if(kCCheck == 9){
        message.innerText = 'Achievment unlocked: KONAMI CODE!!!';
        if(player2){
            snake.score += 10000;
            snake2.score += 10000;
            drawScore(snake);
            drawScore(snake2);
            snake.talk.innerText = 'Awesome!'
            snake2.talk.innerText = 'Awesome!'
        } else {
            snake.score += 10000;
            snake.talk.innerText = 'Awesome!'
            drawScore(snake);
        }
        
        document.getElementById('achiev').className = 'info';
        document.getElementById('konami').classList.remove('locked');
        document.getElementById('cheats').className = 'params';
        aFlags[1] = true;
    }

    let kCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    if(key == kCode[kCCheck]){
        kCCheck++;
    } else {
        kCCheck = 0;
    }
}

function cornCheck() {
    let f1 = field[0][0].className;
    let f2 = field[19][0].className;
    let f3 = field[0][19].className;
    let f4 = field[19][19].className;
    if((f1 == 'unit' && f2 == 'unit' && f3 == 'unit' && f4 == 'unit') ||  (f1 == 'unit__head' && f2 == 'unit__head' && f3 == 'unit__head' && f4 == 'unit__head')){
        snake.score += 10000;
        snake.talk.innerText = 'Awesome!'
        message.innerText = 'Achievment unlocked: CORNERED!!!';
        document.getElementById('achiev').className = 'info';
        document.getElementById('fourdim').classList.remove('locked');
        aFlags[3] = true;
    }
    if((f1 == f2 == f3 == f4 == 'unit__foe') ||  (f1 == f2 == f3 == f4 == 'unit__foe__head')){
        snake2.score += 10000;
        snake2.talk.innerText = 'Awesome!'
        message.innerText = 'Achievment unlocked: CORNERED!!!';
        document.getElementById('achiev').className = 'info';
        document.getElementById('fourdim').classList.remove('locked');
        aFlags[3] = true;
    }
}