# GameMastersTable
Tabletop Game Master's assistance app. Aiming to be an ALL IN ONE app for Game Masters who are overburdened or just need an extra hand. If you are looking for a Player version I will be developing another app called "Adventurers Toolkit"

Please note if you would like to add your own creatures to the Beastiary you must: 
1. Create your creature data following the same format as the other JSON files
2. Create an image for your creature saved as a PNG
3. Input them into a folder sharing the following format: CreatureName (Folder) CreatureName.JSON CreatureName.PNG
4. Input the CreatureName (Folder) into the chosen CR# folder
5. Run the update_creatures_json.py using command prompt on a windows computer this file is located inside of the GameMastersTable folder.
5B. If you cannot run the Python script then you can manually enter the file path to your creature files by making a new entry into the "GameMastersTable\assets\libraries\Beastiary\creatures.json"