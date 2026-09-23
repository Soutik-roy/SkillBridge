"""
Quiz Engine — Question Bank + Answer Evaluation
-------------------------------------------------
Deterministic question bank for common skills.
OpenAI is used if available for question generation, else falls back to this bank.
"""

# ── Question Bank ─────────────────────────────────────────────────────────────
# Each question has: question, options (dict a-d), correct (a/b/c/d), explanation

QUESTION_BANK: dict[str, list[dict]] = {
    "python": [
        {
            "question": "What is the output of `print(type([]) == list)`?",
            "options": {"a": "True", "b": "False", "c": "None", "d": "Error"},
            "correct": "a",
            "explanation": "`type([])` returns `<class 'list'>`, which equals `list`."
        },
        {
            "question": "Which of these is used to handle exceptions in Python?",
            "options": {"a": "catch-throw", "b": "try-except", "c": "begin-rescue", "d": "try-catch"},
            "correct": "b",
            "explanation": "Python uses `try-except` blocks for exception handling."
        },
        {
            "question": "What does `*args` allow in a Python function?",
            "options": {"a": "Keyword-only arguments", "b": "Default arguments", "c": "Variable positional arguments", "d": "Dictionary arguments"},
            "correct": "c",
            "explanation": "`*args` collects extra positional arguments into a tuple."
        },
        {
            "question": "What is a Python decorator?",
            "options": {"a": "A class that wraps another class", "b": "A function that takes a function and extends its behavior", "c": "A type annotation", "d": "A built-in module"},
            "correct": "b",
            "explanation": "Decorators are functions that wrap another function to extend behavior."
        },
        {
            "question": "Which data structure is immutable in Python?",
            "options": {"a": "List", "b": "Dictionary", "c": "Set", "d": "Tuple"},
            "correct": "d",
            "explanation": "Tuples are immutable — they cannot be changed after creation."
        },
    ],
    "javascript": [
        {
            "question": "What does `===` check in JavaScript?",
            "options": {"a": "Value only", "b": "Type only", "c": "Value and type", "d": "Reference equality"},
            "correct": "c",
            "explanation": "`===` is strict equality — it checks both value AND type."
        },
        {
            "question": "What will `console.log(typeof null)` print?",
            "options": {"a": "null", "b": "undefined", "c": "object", "d": "error"},
            "correct": "c",
            "explanation": "This is a famous JS bug — `typeof null` returns `'object'`."
        },
        {
            "question": "What is a Promise used for?",
            "options": {"a": "Synchronous loops", "b": "Handling asynchronous operations", "c": "Creating classes", "d": "DOM manipulation"},
            "correct": "b",
            "explanation": "Promises represent eventual completion or failure of async operations."
        },
        {
            "question": "Which keyword creates a block-scoped variable?",
            "options": {"a": "var", "b": "int", "c": "let", "d": "def"},
            "correct": "c",
            "explanation": "`let` and `const` are block-scoped; `var` is function-scoped."
        },
        {
            "question": "What does the `map()` array method do?",
            "options": {"a": "Filters array elements", "b": "Reduces array to single value", "c": "Creates a new array by transforming each element", "d": "Sorts the array"},
            "correct": "c",
            "explanation": "`map()` creates a new array by applying a function to each element."
        },
    ],
    "sql": [
        {
            "question": "What does `SELECT DISTINCT` do?",
            "options": {"a": "Selects all rows including duplicates", "b": "Removes duplicate rows from results", "c": "Selects only null values", "d": "Selects random rows"},
            "correct": "b",
            "explanation": "`DISTINCT` ensures only unique values are returned in the result."
        },
        {
            "question": "Which JOIN returns only matching rows from both tables?",
            "options": {"a": "LEFT JOIN", "b": "RIGHT JOIN", "c": "FULL JOIN", "d": "INNER JOIN"},
            "correct": "d",
            "explanation": "`INNER JOIN` returns only rows with matching values in both tables."
        },
        {
            "question": "What does the `GROUP BY` clause do?",
            "options": {"a": "Sorts results", "b": "Filters results", "c": "Groups rows sharing a value for aggregate functions", "d": "Joins two tables"},
            "correct": "c",
            "explanation": "`GROUP BY` groups rows so aggregate functions (COUNT, SUM, AVG) apply per group."
        },
        {
            "question": "Which SQL constraint ensures no duplicate values in a column?",
            "options": {"a": "NOT NULL", "b": "PRIMARY KEY", "c": "UNIQUE", "d": "FOREIGN KEY"},
            "correct": "c",
            "explanation": "`UNIQUE` constraint prevents duplicate values in a column."
        },
        {
            "question": "What is an index used for in a database?",
            "options": {"a": "Storing backup data", "b": "Speeding up query lookups", "c": "Encrypting data", "d": "Creating relationships"},
            "correct": "b",
            "explanation": "Indexes speed up SELECT queries by allowing faster row lookups."
        },
    ],
    "react": [
        {
            "question": "What is the correct way to update state in a React functional component?",
            "options": {"a": "this.setState()", "b": "useState setter function", "c": "Directly mutating state variable", "d": "component.update()"},
            "correct": "b",
            "explanation": "In functional components, you use the setter from `useState` to update state."
        },
        {
            "question": "What does `useEffect(() => {}, [])` do?",
            "options": {"a": "Runs on every render", "b": "Never runs", "c": "Runs only on mount (once)", "d": "Runs only on unmount"},
            "correct": "c",
            "explanation": "An empty dependency array `[]` means the effect runs only once on mount."
        },
        {
            "question": "What is a React 'key' prop used for?",
            "options": {"a": "Styling elements", "b": "Passing data to child components", "c": "Helping React identify which items in a list changed", "d": "Encrypting component data"},
            "correct": "c",
            "explanation": "Keys help React efficiently update lists by tracking which items changed."
        },
        {
            "question": "Which hook would you use to avoid re-creating a function on every render?",
            "options": {"a": "useRef", "b": "useCallback", "c": "useMemo", "d": "useEffect"},
            "correct": "b",
            "explanation": "`useCallback` returns a memoized version of a callback function."
        },
        {
            "question": "What is JSX?",
            "options": {"a": "A database query language", "b": "A styling framework", "c": "A syntax extension that looks like HTML in JavaScript", "d": "A JavaScript testing tool"},
            "correct": "c",
            "explanation": "JSX is a syntax extension that lets you write HTML-like code inside JavaScript."
        },
    ],
    "machine learning": [
        {
            "question": "What is overfitting in machine learning?",
            "options": {"a": "Model performs well on training data but poorly on unseen data", "b": "Model performs poorly on training data", "c": "Model has too few parameters", "d": "Model trains too slowly"},
            "correct": "a",
            "explanation": "Overfitting means the model memorized training data and fails to generalize."
        },
        {
            "question": "Which algorithm is best suited for classification problems?",
            "options": {"a": "Linear Regression", "b": "K-Means Clustering", "c": "Random Forest", "d": "PCA"},
            "correct": "c",
            "explanation": "Random Forest is a powerful ensemble method for classification tasks."
        },
        {
            "question": "What does 'training data' refer to?",
            "options": {"a": "Data used to test model performance", "b": "Data used to learn model parameters", "c": "Data used to deploy the model", "d": "Data used for visualization"},
            "correct": "b",
            "explanation": "Training data is used by the model to learn patterns and adjust its parameters."
        },
        {
            "question": "What is the purpose of a validation set?",
            "options": {"a": "To train the model", "b": "To tune hyperparameters and detect overfitting", "c": "To deploy the model", "d": "To store raw data"},
            "correct": "b",
            "explanation": "Validation set helps tune hyperparameters and monitor for overfitting during training."
        },
        {
            "question": "What does a confusion matrix show?",
            "options": {"a": "Model training speed", "b": "Feature importance scores", "c": "True vs predicted classification results", "d": "Data distribution"},
            "correct": "c",
            "explanation": "A confusion matrix shows counts of true positives, false positives, true negatives, and false negatives."
        },
    ],
    "docker": [
        {
            "question": "What is a Docker container?",
            "options": {"a": "A virtual machine", "b": "A lightweight, isolated runtime environment for applications", "c": "A cloud server", "d": "A type of database"},
            "correct": "b",
            "explanation": "Containers are isolated environments that package code with its dependencies."
        },
        {
            "question": "What is a Dockerfile?",
            "options": {"a": "A config file for Docker Compose", "b": "A script to install Docker", "c": "A text file with instructions to build a Docker image", "d": "A Docker network configuration"},
            "correct": "c",
            "explanation": "A Dockerfile contains step-by-step instructions to build a Docker image."
        },
        {
            "question": "What does `docker-compose up` do?",
            "options": {"a": "Pulls images from Docker Hub", "b": "Starts all services defined in docker-compose.yml", "c": "Builds a Dockerfile", "d": "Lists running containers"},
            "correct": "b",
            "explanation": "`docker-compose up` reads docker-compose.yml and starts all defined services."
        },
        {
            "question": "What is the difference between an image and a container?",
            "options": {"a": "They are the same thing", "b": "An image is a running instance; a container is a blueprint", "c": "An image is a blueprint; a container is a running instance", "d": "Images are stored in the cloud only"},
            "correct": "c",
            "explanation": "An image is a read-only blueprint; a container is a running instance of an image."
        },
        {
            "question": "Which command shows all running containers?",
            "options": {"a": "docker images", "b": "docker list", "c": "docker ps", "d": "docker show"},
            "correct": "c",
            "explanation": "`docker ps` lists all currently running containers."
        },
    ],
    "aws": [
        {
            "question": "What does S3 stand for in AWS?",
            "options": {"a": "Simple Storage Service", "b": "Secure Server System", "c": "Scalable SQL Service", "d": "Standard Streaming Service"},
            "correct": "a",
            "explanation": "S3 stands for Simple Storage Service — used for object/file storage."
        },
        {
            "question": "Which AWS service is used to run serverless functions?",
            "options": {"a": "EC2", "b": "RDS", "c": "Lambda", "d": "ECS"},
            "correct": "c",
            "explanation": "AWS Lambda runs code without provisioning or managing servers."
        },
        {
            "question": "What is an EC2 instance?",
            "options": {"a": "A database service", "b": "A virtual server in the cloud", "c": "A CDN network", "d": "A DNS service"},
            "correct": "b",
            "explanation": "EC2 (Elastic Compute Cloud) provides resizable virtual servers in the cloud."
        },
        {
            "question": "What is the purpose of IAM in AWS?",
            "options": {"a": "Image and Asset Management", "b": "Identity and Access Management", "c": "Internet Application Monitoring", "d": "Instance Auto Management"},
            "correct": "b",
            "explanation": "IAM controls who can access AWS resources and what they can do."
        },
        {
            "question": "Which AWS service is a managed relational database?",
            "options": {"a": "DynamoDB", "b": "Redshift", "c": "RDS", "d": "ElastiCache"},
            "correct": "c",
            "explanation": "RDS (Relational Database Service) manages databases like MySQL, PostgreSQL, etc."
        },
    ],
    "fastapi": [
        {
            "question": "What Python type hints are required for FastAPI to auto-generate docs?",
            "options": {"a": "Docstrings", "b": "Pydantic models and type annotations", "c": "Comments", "d": "JSON schema files"},
            "correct": "b",
            "explanation": "FastAPI uses Pydantic models and Python type hints to generate OpenAPI docs automatically."
        },
        {
            "question": "What does `Depends()` do in FastAPI?",
            "options": {"a": "Creates database tables", "b": "Imports external modules", "c": "Declares dependencies for dependency injection", "d": "Configures CORS"},
            "correct": "c",
            "explanation": "`Depends()` is FastAPI's dependency injection system for shared logic like auth and DB sessions."
        },
        {
            "question": "Which HTTP status code should a successful POST (create) return?",
            "options": {"a": "200 OK", "b": "201 Created", "c": "204 No Content", "d": "301 Redirect"},
            "correct": "b",
            "explanation": "By convention, a successful resource creation returns 201 Created."
        },
        {
            "question": "What is the role of `APIRouter` in FastAPI?",
            "options": {"a": "Creates database connections", "b": "Organizes routes into separate modules", "c": "Handles authentication", "d": "Runs background tasks"},
            "correct": "b",
            "explanation": "`APIRouter` lets you split routes into separate files for better code organization."
        },
        {
            "question": "How does FastAPI handle async routes?",
            "options": {"a": "It doesn't support async", "b": "Using threads only", "c": "Using `async def` with Python's asyncio", "d": "Using separate processes"},
            "correct": "c",
            "explanation": "FastAPI supports `async def` routes natively, powered by Python's asyncio and Starlette."
        },
    ],
}

AVAILABLE_SKILLS = sorted(QUESTION_BANK.keys())


import uuid
import random
from .ai_service import generate_quiz_questions

QUIZ_SESSIONS = {}

def get_questions(skill_name: str) -> tuple[str, list[dict]]:
    """Returns a session_id and 5 questions for the given skill."""
    skill_key = skill_name.lower().strip()
    
    # Try dynamic generation first
    questions = generate_quiz_questions(skill_name, 5)
    
    if not questions:
        # Fallback to random sample from bank
        bank = QUESTION_BANK.get(skill_key, [])
        num_q = min(5, len(bank))
        questions = random.sample(bank, num_q) if bank else []
        
    session_id = str(uuid.uuid4())
    QUIZ_SESSIONS[session_id] = {"skill": skill_name, "questions": questions}
    
    # Return without revealing correct answer to client
    client_questions = [
        {
            "id": i,
            "question": q["question"],
            "options": q["options"],
        }
        for i, q in enumerate(questions)
    ]
    return session_id, client_questions


def evaluate_answers(session_id: str, answers: list[str]) -> dict:
    """
    Evaluates submitted answers against the dynamically generated questions.
    """
    session = QUIZ_SESSIONS.get(session_id)
    if not session:
        return {"score": 0, "proficiency": "BEGINNER", "breakdown": [], "correct_count": 0}
        
    questions = session["questions"]
    
    if not questions or not answers:
        return {"score": 0, "proficiency": "BEGINNER", "breakdown": [], "correct_count": 0}

    total = len(questions)
    correct_count = 0
    breakdown = []

    for i, q in enumerate(questions):
        user_answer = answers[i].lower().strip() if i < len(answers) else ""
        is_correct = user_answer == q["correct"]
        if is_correct:
            correct_count += 1
        breakdown.append({
            "question": q["question"],
            "your_answer": q["options"].get(user_answer, "Not answered"),
            "correct_answer": q["options"].get(q["correct"], q["correct"]),
            "is_correct": is_correct,
            "explanation": q["explanation"],
        })

    score = round((correct_count / total) * 100) if total > 0 else 0

    if score >= 80:
        proficiency = "EXPERT"
    elif score >= 60:
        proficiency = "ADVANCED"
    elif score >= 40:
        proficiency = "INTERMEDIATE"
    else:
        proficiency = "BEGINNER"

    # Cleanup session
    del QUIZ_SESSIONS[session_id]

    return {
        "skill": session["skill"],
        "score": score,
        "correct_count": correct_count,
        "total_questions": total,
        "proficiency": proficiency,
        "breakdown": breakdown,
    }
