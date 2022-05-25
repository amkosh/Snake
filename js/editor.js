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

                switch(map[i][j]){
                    case 1: field[i][j].className = 'block_edit';
                    break;
                    case 2: field[i][j].className = 'grass_edit';
                    break;
                    case 0: field[i][j].className = 'editor';
                    break;
                }
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

//Добавление/удаление блока в редакторе
function addBlock(event){
    id = event.target.id;
    if(document.getElementById(id).className == 'editor'){
        document.getElementById(id).className = 'block_edit';
    } else if (document.getElementById(id).className == 'block_edit'){
        document.getElementById(id).className = 'grass_edit';
    } else if (document.getElementById(id).className == 'grass_edit'){
        document.getElementById(id).className = 'editor';
    }
}

//Сохранить созданную карту
function saveMap(){
    for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++){
            if(field[i][j].className == 'block_edit'){
                editMap[i][j] = 1;
            } else if (field[i][j].className == 'grass_edit'){
                editMap[i][j] = 2;
            }
        }
    }
    let num = 0;
    for(max in maps){
        num++;
    }
    maps['stage' + num] = editMap;
    stageName['stage' + num] = 'Custom Map';
    stageParams['stage' + num] = [100, 20, true, 10, 10, 4, 10, 15];
    locks.push(1);
    mapLoader();
    runEditor();
}

//Удалить карту
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
