import requests

try:
    res = requests.post("http://localhost:8000/api/v1/auth/login", data={"username": "itsdevilofficial710@gmail.com", "password": "password"})
    print("Status:", res.status_code)
    print("Body:", res.text)
except Exception as e:
    print("Error:", str(e))
