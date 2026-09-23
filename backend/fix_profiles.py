import sqlite3
import uuid

conn = sqlite3.connect('skillbridge.db')
c = conn.cursor()
c.execute("SELECT id FROM users")
users = c.fetchall()

for (u_id,) in users:
    c.execute("SELECT id FROM student_profiles WHERE user_id=?", (u_id,))
    if not c.fetchone():
        c.execute("INSERT INTO student_profiles (id, user_id, first_name, last_name) VALUES (?, ?, ?, ?)",
                  (str(uuid.uuid4()), u_id, "New", "Student"))
        print(f"Created profile for user {u_id}")

conn.commit()
conn.close()
