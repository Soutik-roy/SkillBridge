import requests
r = requests.post('http://localhost:8000/api/v1/quiz/start', json={'skill_name': 'python'})
print(r.status_code, r.json()['total_questions'], 'questions loaded')
r2 = requests.post('http://localhost:8000/api/v1/quiz/submit', json={'skill_name': 'python', 'answers': ['a','b','c','d','d']})
print('Submit:', r2.status_code, r2.json()['score'], r2.json()['proficiency'])
print('Skills:', requests.get('http://localhost:8000/api/v1/quiz/skills').json()['skills'])
