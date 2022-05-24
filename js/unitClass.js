//Отдельный класс для змеюки
class Snake {
    constructor(p) {
        this.player = p;
        if(this.player == 'p1'){
            this.x = stageParams['stage' + stage][4];
            this.y = stageParams['stage' + stage][5];
            this.cName = 'unit';
            this.cNameH = 'unit__head';
            this.info = document.getElementById("score");
            this.infoLvl = document.getElementById('lvl');   //Для вывода уровня
            this.infoSize = document.getElementById('size'); //Для вывода длины змеи
        } else if (this.player == 'p2'){
            this.x = stageParams['stage' + stage][6];
            this.y = stageParams['stage' + stage][7];
            this.cName = 'unit__foe';
            this.cNameH = 'unit__foe__head';
            this.info = document.getElementById("scoreP2");
            this.infoLvl = document.getElementById('lvlP2');   //Для вывода уровня
            this.infoSize = document.getElementById('sizeP2'); //Для вывода длины змеи
        }
        this.speed = stageParams['stage' + stage][1];; //Число кадров перед обновлением
        this.level = 0;  //Начальный уровень
        this.score = 0;
        this.orientation = [];
        this.orientation.push('');
        this.unitCellX = []; //Хранилище координат X для отображения всей длины змеи
        this.unitCellY = []; //Хранилище координат Y для отображения всей длины змеи
        this.unitCellX.push(this.x); //Добавляем первую ячейку в хранилище змеи
        this.unitCellY.push(this.y); //Добавляем первую ячейку в хранилище змеи
        this.unitSize = 1;
        this.field = field;
        this.count = 0;
        
    }

    unitReverse() {
        this.unitCellX.reverse();
        this.unitCellY.reverse();
        this.x = this.unitCellX[0];
        this.y = this.unitCellY[0];
        this.orientation.reverse();

        for(let i = 0; i < this.unitSize; i++){
            switch(this.orientation[i]){
                case 'ArrowUp': this.orientation[i] = 'ArrowDown';
                break;
                case 'ArrowDown': this.orientation[i] = 'ArrowUp';
                break;
                case 'ArrowRight': this.orientation[i] = 'ArrowLeft';
                break;
                case 'ArrowLeft': this.orientation[i] = 'ArrowRight';
                break;
            }
        }
    }

    move(event){
        if(!fail){
            if((event == 'ArrowUp' && this.orientation[0] == 'ArrowDown')||
                (event == 'ArrowDown' && this.orientation[0] == 'ArrowUp')||
                (event == 'ArrowRight' && this.orientation[0] == 'ArrowLeft')||
                (event == 'ArrowLeft' && this.orientation[0] == 'ArrowRight')
            ){
                if(reverse){
                    this.unitReverse();
                    return;
                } else {
                    return;
                }
            }

            this.orientation.unshift(event);

            switch(this.orientation[0]){
                case 'ArrowUp': --this.x;
                break;
                case 'ArrowDown': ++this.x;
                break;
                case 'ArrowRight': ++this.y;
                break;
                case 'ArrowLeft': --this.y;
                break;
                default: return;
            }
            this.count = 0;
            colCheck(this);
            this.unitCellX.unshift(this.x);
            this.unitCellY.unshift(this.y);
            this.unitCellX.pop();
            this.unitCellY.pop();
            this.orientation.pop();
            drawField();
        }
    }
            
    //Отрисовка змеи
    initUnit() {
        for(let i = this.unitSize-1; i >= 0; i--){
            let tmpX = this.unitCellX[i];
            let tmpY = this.unitCellY[i];
            
            this.field[tmpX][tmpY].className = this.cName;
            if(i == 0){
                field[tmpX][tmpY].className = this.cNameH;
            }  
        }
    }

    //Рост змеи при поглощении предмета
    unitGrowUp() {
        this.unitCellX.push(this.x);
        this.unitCellY.push(this.y);
        switch(this.orientation[0]) {
                case 'ArrowUp': this.orientation.push('ArrowUp');
                break;
                case 'ArrowDown': this.orientation.push('ArrowDown');
                break;
                case 'ArrowRight': this.orientation.push('ArrowRight');
                break;
                case 'ArrowLeft': this.orientation.push('ArrowLeft');
                break;
        }
    }
}