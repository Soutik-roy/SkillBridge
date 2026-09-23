import requests

r = requests.get('http://localhost:8000/api/v1/courses')
courses = r.json()
print(f"Total courses: {len(courses)}")
for c in courses:
    print(f"  - [{c['skill_name']}] {c['title']} ({c['lesson_count']} lessons)")

# Test first course detail
if courses:
    course_id = courses[0]['id']
    detail = requests.get(f'http://localhost:8000/api/v1/courses/{course_id}').json()
    print(f"\nFirst course lessons in '{detail['title']}':")
    for lesson in detail['lessons']:
        print(f"  L{lesson['order']}: {lesson['title']} ({lesson['duration_mins']} min)")
