from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# the JSON file is named 'data.json'
JSON_FILE_PATH = 'data.json'

@app.route('/data', methods=['GET'])
def get_data():
    try:
        with open(JSON_FILE_PATH, 'r') as file:
            data = json.load(file)
            return jsonify(data)
    except Exception as e:
        return jsonify({"error": f"Failed to read JSON file. Reason: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def homepage():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)