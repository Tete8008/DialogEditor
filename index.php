<!DOCTYPE html>

<html>

    <head>
        <meta charset="utf-8"/>
        <title>Dialogue editor</title>
        <link rel="stylesheet" type="text/css" href="css/reset.css"/>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>
    </head>
    <body>

        <div id="mainMenu">
            <input id="newButton" type="button" value="New"/>
            |
            <select id="openFileSelect">
                <option value="" selected disabled hidden>Open</option>
                <?php
                if ($handle = opendir('Saves/')) {

                    while (false !== ($entry = readdir($handle))) {
                
                        if ($entry != "." && $entry != "..") {
                
                            echo "<option value=".$entry.">".$entry."</option>\n";
                        }
                    }
                
                    closedir($handle);
                }
                ?>
                
            </select>
            |
            <div>
                <input id="fileNameInput" type="text" placeholder="file name"/>
                <input id="saveAsButton" type="button" value="Save as"/>
            </div>
            |
            <input id="saveButton" type="button" value="Save"/>

        </div>


        <div id="debug">
            

        </div>

        <div id="gridContextMenu" class="contextMenu">
            <ul>
                <li><button onclick="AddMessageNode();">Message</button></li>
                <li><button onclick="AddQuestNode();">Quest</button></li>
                <li><button onclick="AddDialogueNode();">Dialogue</button></li>
                <li><button onclick="PasteNode();">Paste</button></li>
            </ul>
        </div>


        <div id="nodeContextMenu" class="contextMenu">
            <ul>
                <li><button onclick="DeleteNode();">Delete</button></li>
                <li><button onclick="RenameNode();">Rename</button></li>
                <li><button onclick="CopyNode();">Copy</button></li>
            </ul>

        </div>

        <div id="characters">
            <div style="text-align: center;">
                <label style="font-size: 24px;">Characters</label>
            </div>

            <div id="charas">

            </div>

            <button style="margin:10px;" onclick="AddCharacter();">
                +
            </button>

        </div>

        <canvas id='canvas'>

        </canvas>

        <script src="js/jquery-3.2.1.js"></script>
        <script src="js/Node.js"></script>
        <script src="js/Button.js"></script>
        <script src="js/Character.js"></script>
        <script src="js/NodeInput.js"></script>
        <script src="js/InputField.js"></script>
        <script src="js/NodeOutput.js"></script>
        <script src="js/NodeLink.js"></script>
        <script src="js/Debug.js"></script>
        <script src="js/main.js"></script>
    </body>

</html>