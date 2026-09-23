import requests

try:
    res = requests.post("http://localhost:8000/api/v1/auth/login", data={"username": "itsdevilofficial710@gmail.com", "password": "password"})
    token = res.json().get("access_token")
    if token:
        headers = {"Authorization": f"Bearer {token}"}
        res2 = requests.post("http://localhost:8000/api/v1/engine/match-jobs", json={"student_skills": []}, headers=headers)
        print("Status:", res2.status_code)
        print("Response:", len(res2.json()), "jobs found")
    else:
        print("Failed to get token")
except Exception as e:
    print("Error:", str(e))
