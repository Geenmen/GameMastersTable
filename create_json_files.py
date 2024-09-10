import os
import json
import re

def create_json_files():
    # Ask the user for the base output directory
    output_dir = input("Please enter the full path to the directory where you want to save the JSON files: ")

    # Create the parent directory for all CR folders if it doesn't exist
    parent_dir = os.path.join(output_dir, "Generated JSONs")
    if not os.path.exists(parent_dir):
        os.makedirs(parent_dir)

    # Ask the user for the list of entries
    entries = input("Please enter the list of entries: ")

    # Split the entries by comma to find individual entries
    raw_entries = entries.split(',')
    
    for raw_entry in raw_entries:
        raw_entry = raw_entry.strip()
        if not raw_entry:
            continue
        
        # Extract the CR number and name using regex
        match = re.match(r"^CR\s+(\d+):\s*(.*)$", raw_entry)
        if match:
            cr_number = int(match.group(1))
            name = match.group(2).strip()

            # Format the CR folder name as CRXX
            cr_folder_name = f"CR{cr_number:02d}"

            # Create the CR folder inside the parent directory if it doesn't exist
            cr_folder_path = os.path.join(parent_dir, cr_folder_name)
            if not os.path.exists(cr_folder_path):
                os.makedirs(cr_folder_path)

            # Create the JSON data structure
            data = {"name": name}

            # Define the JSON file name and path
            file_name = f"{name}.json"
            file_path = os.path.join(cr_folder_path, file_name)

            # Write the data to the JSON file
            with open(file_path, 'w') as json_file:
                json.dump(data, json_file, indent=4)

            print(f"Created file: {file_path}")
        else:
            print(f"Invalid entry format: {raw_entry}")

if __name__ == "__main__":
    create_json_files()