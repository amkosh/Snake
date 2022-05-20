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
        //Помещаем в x и y последние элемента массивов Cell
        x = this.unitCellX[0];
        y = this.unitCellY[0];
        //Разворачиваем массивы
        //this.unitCellX[0] = this.unitCellX[this.unitCellX.length-1];
        //this.unitCellY[0] = this.unitCellY[this.unitCellY.length-1];
        //this.unitCellX[this.unitCellX.length-1] = this.tmpX;
        //this.unitCellY[this.unitCellY.length-1] = this.tmpY;

        this.unitCellX.reverse();
        this.unitCellY.reverse();
        x = this.unitCellX[0];
        y = this.unitCellY[0];
        this.orientation.reverse();
        switch(this.orientation[0]){
            case 'U': direction = 'ArrowDown';
            break;
            case 'D': direction = 'ArrowUp';
            break;
            case 'R': direction = 'ArrowLeft';
            break;
            case 'L': direction = 'ArrowRight';
            break;
        }
    }

    /*
    move(event){
        if(fail == false){
            
            if((event == 'ArrowUp' && direction == 'ArrowDown')||
                (event == 'ArrowDown' && direction == 'ArrowUp')||
                (event == 'ArrowRight' && direction == 'ArrowLeft')||
                (event == 'ArrowLeft' && direction == 'ArrowRight')
            ){
                this.unitReverse();
            }

            switch(event){
                case 'ArrowUp': this.orientation[0] = 'U';
                break;
                case 'ArrowDown': this.orientation[0] = 'D';
                break;
                case 'ArrowRight': this.orientation[0] = 'R';
                break;
                case 'ArrowLeft': this.orientation[0] = 'L';
                break;
                default: return;
            }
            
            switch(event){
                case 'ArrowUp': --x;    direction = event, this.orientation.unshift('U');
                break;
                case 'ArrowDown': ++x;  direction = event, this.orientation.unshift('D');
                break;
                case 'ArrowRight': ++y; direction = event, this.orientation.unshift('R');
                break;
                case 'ArrowLeft': --y;  direction = event, this.orientation.unshift('L');
                break;
                default: return;
            }
            count = 0;
            colCheck();
            this.unitCellX.unshift(x);
            this.unitCellY.unshift(y);
            this.unitCellX.pop();
            this.unitCellY.pop();
            this.orientation.pop();
            drawField();
        }
        console.log(direction);
        console.log(snake.orientation);
    }
    */

    move(event){
        if(!fail){

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
        switch(direction) {
            case 'ArrowUp': this.orientation.push('U');
                break;
                case 'ArrowDown': this.orientation.push('S');
                break;
                case 'ArrowRight': this.orientation.push('R');
                break;
                case 'ArrowLeft': this.orientation.push('L');
                break;
        }
    }
}
