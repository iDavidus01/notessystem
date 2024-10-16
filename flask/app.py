from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

FILES_DIR = '../notes/'  

if not os.path.exists(FILES_DIR):
    os.makedirs(FILES_DIR)

@app.route('/save_note', methods=['POST'])
def save_note():
    data = request.json
    filename = data['filename']
    content = data['content']

    with open(os.path.join(FILES_DIR, f"{filename}.txt"), 'w') as f:
        f.write(content)
    
    return jsonify({"message": "Note saved successfully!"})

@app.route('/get_note/<filename>', methods=['GET'])
def get_note(filename):
    filepath = os.path.join(FILES_DIR, f"{filename}.txt")
    
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        return jsonify({"filename": filename, "content": content})
    else:
        return jsonify({"error": "File not found"}), 404

@app.route('/get_notes', methods=['GET'])
def get_notes():
    notes = os.listdir(FILES_DIR)
    notes = [note.replace(".txt", "") for note in notes if os.path.isfile(os.path.join(FILES_DIR, note))]
    return jsonify({"notes": notes})



if __name__ == '__main__':
    app.run(host='localhost', port=5000)
