//Отдельный класс для змеюки
class Snake {
    constructor() {
        this.unitCellX = []; //Хранилище координат X для отображения всей длины змеи
        this.unitCellY = []; //Хранилище координат Y для отображения всей длины змеи
        this.unitCellX.push(x); //Добавляем первую ячейку в хранилище змеи
        this.unitCellY.push(y); //Добавляем первую ячейку в хранилище змеи
        this.orientation = [];
        this.orientation.push('ArrowUp');
        this.unitSize = 1;
        this.field = field;
    }

    unitReverse() {
        this.unitCellX.reverse();
        this.unitCellY.reverse();
        x = this.unitCellX[0];
        y = this.unitCellY[0];
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
                case 'ArrowUp': --x;
                break;
                case 'ArrowDown': ++x;
                break;
                case 'ArrowRight': ++y;
                break;
                case 'ArrowLeft': --y;
                break;
                default: return;
            }
            //count = 0;
            colCheck();
            this.unitCellX.unshift(x);
            this.unitCellY.unshift(y);
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
            
            this.field[tmpX][tmpY].className = "unit";

            if(i == 0){
                field[tmpX][tmpY].className = "unit__head";
            }
        }
    }

    //Рост змеи при поглощении предмета
    unitGrowUp() {
        this.unitCellX.push(x);
        this.unitCellY.push(y);
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


//Отдельный класс для второй змеюки
class SolidSnake {
    constructor() {
        this.x = xP2;
        this.y = yP2;
        this.unitCellX = []; //Хранилище координат X для отображения всей длины змеи
        this.unitCellY = []; //Хранилище координат Y для отображения всей длины змеи
        this.unitCellX.push(this.x); //Добавляем первую ячейку в хранилище змеи
        this.unitCellY.push(this.y); //Добавляем первую ячейку в хранилище змеи
        this.orientation = [];
        this.orientation.push('w');
        this.unitSize = 1;
        this.field = field;
    }

    unitReverse() {
        this.unitCellX.reverse();
        this.unitCellY.reverse();
        this.x = this.unitCellX[0];
        this.y = this.unitCellY[0];
        this.orientation.reverse();

        for(let i = 0; i < this.unitSize; i++){
            switch(this.orientation[i]){
                case 'w': this.orientation[i] = 's';
                break;
                case 's': this.orientation[i] = 'w';
                break;
                case 'd': this.orientation[i] = 'a';
                break;
                case 'a': this.orientation[i] = 'd';
                break;
            }
        }
    }

    move(event){
        if(!fail){
            if((event == 'w' && this.orientation[0] == 's')||
                (event == 's' && this.orientation[0] == 'w')||
                (event == 'd' && this.orientation[0] == 'a')||
                (event == 'a' && this.orientation[0] == 'd')
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
                case 'w': --this.x;
                break;
                case 's': ++this.x;
                break;
                case 'd': ++this.y;
                break;
                case 'a': --this.y;
                break;
                default: return;
            }
            //count = 0;
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
            
            this.field[tmpX][tmpY].className = "unit__foe";

            if(i == 0){
                field[tmpX][tmpY].className = "unit__foe__head";
            }
        }
    }

    //Рост змеи при поглощении предмета
    unitGrowUp() {
        this.unitCellX.push(this.x);
        this.unitCellY.push(this.y);
        switch(this.orientation[0]) {
                case 'w': this.orientation.push('w');
                break;
                case 's': this.orientation.push('s');
                break;
                case 'd': this.orientation.push('d');
                break;
                case 'a': this.orientation.push('a');
                break;
        }
    }
}