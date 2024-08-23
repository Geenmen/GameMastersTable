import os
import json

# Set the path to the Bestiary directory
bestiary_path = os.path.join('assets', 'libraries', 'Beastiary')

# Initialize the creatures dictionary
creatures = {}

# Iterate over each CR folder
for cr_folder in sorted(os.listdir(bestiary_path)):
    cr_path = os.path.join(bestiary_path, cr_folder)
    if os.path.isdir(cr_path) and cr_folder.startswith('CR'):
        creatures[cr_folder] = []
        
        # Iterate over each Creature folder in the CR folder
        for creature_folder in sorted(os.listdir(cr_path)):
            creature_path = os.path.join(cr_path, creature_folder)
            if os.path.isdir(creature_path):
                json_file_name = f"{creature_folder}.json"
                json_file_path = os.path.join(creature_path, json_file_name)
                image_file_name = f"{creature_folder}.png"
                image_file_path = os.path.join(creature_path, image_file_name)
                
                # If the JSON file exists, add it to the creatures.json
                if os.path.exists(json_file_path):
                    creature = {
                        'name': creature_folder,
                        'jsonPath': os.path.relpath(json_file_path, bestiary_path),
                        'imagePath': os.path.relpath(image_file_path, bestiary_path) if os.path.exists(image_file_path) else None
                    }
                    creatures[cr_folder].append(creature)

# Write the creatures dictionary to a JSON file
output_file = os.path.join(bestiary_path, 'creatures.json')
with open(output_file, 'w') as json_file:
    json.dump(creatures, json_file, indent=4)

print(f'creatures.json has been updated successfully in {output_file}')
