from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this'

# Data storage
DATA_FILE = 'data/algorithms.json'


def debug_json_file():
    """Debug function to check JSON file status"""
    file_path = 'data/algorithms.json'
    
    print(f"File exists: {os.path.exists(file_path)}")
    
    if os.path.exists(file_path):
        file_size = os.path.getsize(file_path)
        print(f"File size: {file_size} bytes")
        
        with open(file_path, 'r') as f:
            content = f.read()
            print(f"Raw content (first 100 chars): {repr(content[:100])}")
    
    return file_path

debug_json_file()

def load_data():
    """Load algorithms and data structures from JSON file with error handling"""
    if not os.path.exists(DATA_FILE):
        print(f"JSON file doesn't exist at {DATA_FILE}, creating default data")
        return create_default_data()
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            
            # Check if file is empty
            if not content:
                print("JSON file is empty, creating default data")
                return create_default_data()
            
            # Try to parse JSON
            data = json.loads(content)
            
            # Validate data structure
            if not isinstance(data, dict):
                print("Invalid JSON structure, creating default data")
                return create_default_data()
                
            return data
            
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        print("Creating backup of corrupted file and generating new data")
        
        # Backup corrupted file
        backup_file = DATA_FILE + '.backup'
        if os.path.exists(DATA_FILE):
            os.rename(DATA_FILE, backup_file)
            print(f"Corrupted file backed up to {backup_file}")
        
        return create_default_data()
    
    except Exception as e:
        print(f"Unexpected error loading data: {e}")
        return create_default_data()


def create_default_data():
    """Create and save default data structure"""
    default_data = {
        "data_structures": [
            {
                "id": 1,
                "name": "Array",
                "category": "Array",
                "description": "A collection of elements stored at contiguous memory locations",
                "time_complexity": {
                    "access": "O(1)",
                    "search": "O(n)",
                    "insertion": "O(n)",
                    "deletion": "O(n)"
                },
                "space_complexity": "O(n)",
                "use_cases": ["Random access to elements", "Mathematical operations", "Implementing other data structures"],
                "implementations": {
                    "python": "# Python Array Implementation\nclass Array:\n    def __init__(self, capacity):\n        self.data = [None] * capacity\n        self.size = 0\n        self.capacity = capacity\n    \n    def get(self, index):\n        if 0 <= index < self.size:\n            return self.data[index]\n        raise IndexError('Index out of bounds')\n    \n    def set(self, index, value):\n        if 0 <= index < self.size:\n            self.data[index] = value\n        else:\n            raise IndexError('Index out of bounds')\n    \n    def append(self, value):\n        if self.size < self.capacity:\n            self.data[self.size] = value\n            self.size += 1\n        else:\n            raise OverflowError('Array is full')",
                    "java": "// Java Array Implementation\npublic class Array<T> {\n    private Object[] data;\n    private int size;\n    private int capacity;\n    \n    public Array(int capacity) {\n        this.data = new Object[capacity];\n        this.size = 0;\n        this.capacity = capacity;\n    }\n    \n    @SuppressWarnings(\"unchecked\")\n    public T get(int index) {\n        if (index >= 0 && index < size) {\n            return (T) data[index];\n        }\n        throw new IndexOutOfBoundsException(\"Index out of bounds\");\n    }\n    \n    public void set(int index, T value) {\n        if (index >= 0 && index < size) {\n            data[index] = value;\n        } else {\n            throw new IndexOutOfBoundsException(\"Index out of bounds\");\n        }\n    }\n    \n    public void append(T value) {\n        if (size < capacity) {\n            data[size++] = value;\n        } else {\n            throw new RuntimeException(\"Array is full\");\n        }\n    }\n}",
                    "csharp": "// C# Array Implementation\npublic class Array<T>\n{\n    private T[] data;\n    private int size;\n    private int capacity;\n    \n    public Array(int capacity)\n    {\n        this.data = new T[capacity];\n        this.size = 0;\n        this.capacity = capacity;\n    }\n    \n    public T Get(int index)\n    {\n        if (index >= 0 && index < size)\n        {\n            return data[index];\n        }\n        throw new IndexOutOfRangeException(\"Index out of bounds\");\n    }\n    \n    public void Set(int index, T value)\n    {\n        if (index >= 0 && index < size)\n        {\n            data[index] = value;\n        }\n        else\n        {\n            throw new IndexOutOfRangeException(\"Index out of bounds\");\n        }\n    }\n    \n    public void Append(T value)\n    {\n        if (size < capacity)\n        {\n            data[size++] = value;\n        }\n        else\n        {\n            throw new InvalidOperationException(\"Array is full\");\n        }\n    }\n}"
                }
            }
        ],
        "algorithms": [
            {
                "id": 1,
                "name": "Binary Search",
                "category": "Searching",
                "description": "Efficiently search for an element in a sorted array by repeatedly dividing the search interval in half",
                "time_complexity": {
                    "best": "O(1)",
                    "average": "O(log n)",
                    "worst": "O(log n)"
                },
                "space_complexity": "O(1)",
                "prerequisites": ["Array must be sorted"],
                "use_cases": ["Searching in sorted arrays", "Finding insertion point", "Range queries"],
                "implementations": {
                    "python": "def binary_search(arr, target):\n    \"\"\"\n    Binary search implementation in Python\n    \"\"\"\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1  # Element not found\n\n# Example usage\narr = [1, 3, 5, 7, 9, 11, 13, 15]\ntarget = 7\nresult = binary_search(arr, target)\nprint(f\"Element found at index: {result}\")",
                    "java": "public class BinarySearch {\n    public static int binarySearch(int[] arr, int target) {\n        int left = 0;\n        int right = arr.length - 1;\n        \n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            \n            if (arr[mid] == target) {\n                return mid;\n            } else if (arr[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n        \n        return -1; // Element not found\n    }\n    \n    // Example usage\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 7, 9, 11, 13, 15};\n        int target = 7;\n        int result = binarySearch(arr, target);\n        System.out.println(\"Element found at index: \" + result);\n    }\n}",
                    "csharp": "public class BinarySearch\n{\n    public static int Search(int[] arr, int target)\n    {\n        int left = 0;\n        int right = arr.Length - 1;\n        \n        while (left <= right)\n        {\n            int mid = left + (right - left) / 2;\n            \n            if (arr[mid] == target)\n            {\n                return mid;\n            }\n            else if (arr[mid] < target)\n            {\n                left = mid + 1;\n            }\n            else\n            {\n                right = mid - 1;\n            }\n        }\n        \n        return -1; // Element not found\n    }\n    \n    // Example usage\n    static void Main(string[] args)\n    {\n        int[] arr = {1, 3, 5, 7, 9, 11, 13, 15};\n        int target = 7;\n        int result = Search(arr, target);\n        Console.WriteLine($\"Element found at index: {result}\");\n    }\n}"
                }
            }
        ],
        "categories": {
            "data_structures": ["Array", "Linked List", "Stack", "Queue", "Tree", "Graph", "Hash Table"],
            "algorithms": ["Sorting", "Searching", "Graph", "Dynamic Programming", "Greedy", "Divide & Conquer"]
        }
    }
    
    # Save the default data
    save_data(default_data)
    print(f"Default data created and saved to {DATA_FILE}")
    
    return default_data

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

# Enhanced Flask routes with better error handling
@app.route('/api/search')
def api_search():
    """API endpoint for advanced search functionality"""
    query = request.args.get('q', '').lower()
    category = request.args.get('category', 'all')
    
    try:
        data = load_data()
        results = {
            'data_structures': [],
            'algorithms': []
        }
        
        # Search data structures
        for structure in data.get('data_structures', []):
            if category == 'all' or structure.get('category', '').lower() == category.lower():
                if (query in structure.get('name', '').lower() or 
                    query in structure.get('description', '').lower() or
                    any(query in use_case.lower() for use_case in structure.get('use_cases', []))):
                    results['data_structures'].append(structure)
        
        # Search algorithms
        for algorithm in data.get('algorithms', []):
            if category == 'all' or algorithm.get('category', '').lower() == category.lower():
                if (query in algorithm.get('name', '').lower() or 
                    query in algorithm.get('description', '').lower() or
                    any(query in use_case.lower() for use_case in algorithm.get('use_cases', []))):
                    results['algorithms'].append(algorithm)
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats')
def api_stats():
    """API endpoint for dashboard statistics"""
    try:
        data = load_data()
        
        stats = {
            'total_data_structures': len(data.get('data_structures', [])),
            'total_algorithms': len(data.get('algorithms', [])),
            'categories': {
                'data_structures': len(data.get('categories', {}).get('data_structures', [])),
                'algorithms': len(data.get('categories', {}).get('algorithms', []))
            },
            'complexity_distribution': calculate_complexity_distribution(data),
            'category_distribution': calculate_category_distribution(data)
        }
        
        return jsonify(stats)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_complexity_distribution(data):
    """Calculate time complexity distribution"""
    complexity_count = {}
    
    for item in data.get('data_structures', []) + data.get('algorithms', []):
        time_complexity = item.get('time_complexity', {})
        if isinstance(time_complexity, dict):
            for operation, complexity in time_complexity.items():
                if complexity not in complexity_count:
                    complexity_count[complexity] = 0
                complexity_count[complexity] += 1
        elif isinstance(time_complexity, str):
            if time_complexity not in complexity_count:
                complexity_count[time_complexity] = 0
            complexity_count[time_complexity] += 1
    
    return complexity_count

def calculate_category_distribution(data):
    """Calculate category distribution"""
    distribution = {
        'data_structures': {},
        'algorithms': {}
    }
    
    for structure in data.get('data_structures', []):
        category = structure.get('category', 'Other')
        if category not in distribution['data_structures']:
            distribution['data_structures'][category] = 0
        distribution['data_structures'][category] += 1
    
    for algorithm in data.get('algorithms', []):
        category = algorithm.get('category', 'Other')
        if category not in distribution['algorithms']:
            distribution['algorithms'][category] = 0
        distribution['algorithms'][category] += 1
    
    return distribution

# Add health check endpoint
@app.route('/health')
def health_check():
    """Health check endpoint"""
    try:
        # Test database access
        data = load_data()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'data_structures_count': len(data.get('data_structures', [])),
            'algorithms_count': len(data.get('algorithms', []))
        })
    
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5005)
