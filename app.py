from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this'

# Data storage
DATA_FILE = 'data/algorithms.json'

def load_data():
    """Load algorithms and data structures from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {
        "data_structures": [],
        "algorithms": [],
        "categories": {
            "data_structures": ["Array", "Linked List", "Stack", "Queue", "Tree", "Graph", "Hash Table"],
            "algorithms": ["Sorting", "Searching", "Graph", "Dynamic Programming", "Greedy", "Divide & Conquer"]
        }
    }

def save_data(data):
    """Save data to JSON file"""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    """Main dashboard"""
    data = load_data()
    return render_template('index.html', data=data)

@app.route('/data-structures')
def data_structures():
    """Data structures listing page"""
    data = load_data()
    return render_template('data_structures.html', 
                         structures=data['data_structures'],
                         categories=data['categories']['data_structures'])

@app.route('/algorithms')
def algorithms():
    """Algorithms listing page"""
    data = load_data()
    return render_template('algorithms.html', 
                         algorithms=data['algorithms'],
                         categories=data['categories']['algorithms'])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
