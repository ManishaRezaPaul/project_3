from flask import Flask, jsonify, render_template
from flask_cors import CORS
import json

# the JSON file is named 'data.json'
JSON_FILE_PATH = 'data.json'
JSON_FILE_PATH_ANNUAL = 'annual_data.json'
JSON_FILE_PATH_MATCHDATA = 'matchdata.json'
JSON_FILE_PATH_LATLONG = 'map.json'


app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# ########## BACK END ROUTES

# please move to /api/data
@app.route('/data', methods=['GET'])
def get_data():
    try:
        with open(JSON_FILE_PATH, 'r') as file:
            data = json.load(file)
            return jsonify(data)
    except Exception as e:
        return jsonify({"error": f"Failed to read JSON file. Reason: {str(e)}"}), 500
    
@app.route('/annual', methods=['GET'])
def get_annual():
    try:
        with open(JSON_FILE_PATH_ANNUAL, 'r') as file:
            annual_data = json.load(file)
            print(annual_data)  # Print the loaded data
            return jsonify(annual_data)
    except Exception as e:
        return jsonify({"error": f"Failed to read JSON file. Reason: {str(e)}"}), 500
    
@app.route('/matchdata', methods=['GET'])
def get_matchdata():
    try:
        with open(JSON_FILE_PATH_MATCHDATA, 'r') as file:
            matchdata = json.load(file)
            print(matchdata)  # Print the loaded data
            return jsonify(matchdata)
    except Exception as e:
        return jsonify({"error": f"Failed to read JSON file. Reason: {str(e)}"}), 500
    
@app.route('/latlong', methods=['GET'])
def get_latlong():
    try:
        with open(JSON_FILE_PATH_LATLONG, 'r') as file:
            latlong = json.load(file)
            print(latlong)  # Print the loaded data
            return jsonify(latlong)
    except Exception as e:
        return jsonify({"error": f"Failed to read JSON file. Reason: {str(e)}"}), 500


# ########## FRONT END ROUTES 
@app.route('/', methods=['GET'])
def homepage():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)