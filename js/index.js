<!DOCTYPE html>
<head>
    <title>Eat Snaker</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="css/main.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com"> 
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>

<body>
    <header>
        <p>MGS-22: EAT SNAKER</p>
    </header>

    <div class="play__field">

        <div id="info" class="info">
            <div>
                <p>Player 1</p>
            </div>
            <div>
                <p>Score: </p>
                <p id="score">0</p>
            </div>
            
            <div>
                <p>Level: </p>
                <p id="lvl">0</p>
            </div>

            <div>
                <p>Goal: </p>
                <p id="size"></p>
            </div>

            <div>
                <p>Lives: </p>
                <p id="lives"></p>
            </div>

            <div>
                <p id="game_over"></p>
            </div>
        </div>

        <section id="first"></section>

        <div id="infoP2" class="hidden">
            <div>
                <p>Player 2</p>
            </div>
            <div>
                <p>Score: </p>
                <p id="scoreP2">0</p>
            </div>
            
            <div>
                <p>Level: </p>
                <p id="lvlP2">0</p>
            </div>

            <div>
                <p>Goal: </p>
                <p id="sizeP2"></p>
            </div>

            <div>
                <p>Lives: </p>
                <p id="livesP2"></p>
            </div>
            
            <div>
                <p id="game_overP2"></p>
            </div>
        </div>

        <div id="cheats" class="hidden">
            <p>Cheats:</p>
            <div>
                <input type="checkbox" name="automove" id="autoOn"  onchange="autoMoveToggle(), this.blur()" checked>
                <label for="autoOn">Automove:</label>
            </div>
            <div>
                
                <input type="checkbox" name="borders" id="bordersOn"  onchange="bordersToggle(), this.blur()" checked>
                <label for="bordersOn">Borders: </label>
            </div>
            <div>
                
                <input type="checkbox" name="selfDestruct" id="selfDestructOn"  onchange="selfDestructToggle(), this.blur()" checked>
                <label for="selfDestructOn">Self destruct: </label>
            </div>
            <div>
                
                <input type="checkbox" name="reverse" id="reverseOff" onchange="reverseToggle(), this.blur()">
                <label for="reverseOff">Reverse: </label>
            </div>
            <div>
                <button onclick="addItem()">+Food</button>
            </div>
            <div>
                <button onclick="addBonusItem(1)">+Bonus</button>
            </div>
            <div>
                <button onclick="addPortal()">+Portal</button>
            </div>
            <br>
        </div>

        <div id="hiscore" class="info">
            <p>Hi-Score</p>
            <div id="p1"></div>
            <div id="p2"></div>
            <div id="p3"></div>
            <div id="p4"></div>
            <div id="p5"></div>
            <div id="p6"></div>
            <div id="p7"></div>
            <div id="p8"></div>
            <div id="p9"></div>
            <div id="p10"></div>

            <br>
            <br>
            <br>
            <div>
                <p>Stage:</p>
                <select id="stage" onchange="setStage(), this.blur()">
                </select>
            </div>
        </div>
        
        <div id="achiev" class="hidden">
            <div>
                <p>Achievements:</p>
            </div>

            <div id="urobor" class="locked">
                <p>UROBOROS</p>
            </div>

            <div id="konami" class="locked">
                <p>KONAMI CODE</p>
            </div>

            <div id="fourdim" class="locked">
                <p>CORNERED</p>
            </div>

            <div id="lightspeed" class="locked">
                <p>LIGHTSPEED</p>
            </div>
        </div>
    </div>
    <div class="buttons">
        <button id="pause" onclick="pause(), this.blur()">START</button>
        <button id="restart" onclick="restart(), this.blur()">RESTART</button>
        <button id="mode" onclick="mode(), this.blur()">SOLO</button>
        <button id="editor" onclick="runEditor(), this.blur()">EDITOR</button>
        <button id="save" class="hidden_btn" onclick="saveMap(), this.blur()">SAVE</button>
        <button id="delete" class="hidden_btn" onclick="deleteMap(), this.blur()">DELETE</button>
    </div>

    <div>
        <p class="message" id="message">MESSAGE!</p>
    </div>

    <div id="controls">
        <button onclick="pause()" class="controlBtn">Pause</button>
    </div>
    
    <script src="js/maps.js"></script>
    <script src="js/unitClass.js"></script>
    <script src="js/script.js"></script>
    <script src="js/editor.js"></script>
</body>