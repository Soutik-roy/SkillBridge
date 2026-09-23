import sqlite3
try:
    conn = sqlite3.connect('skillbridge.db')
    conn.execute('ALTER TABLE courses ADD COLUMN teacher_id VARCHAR(36)')
    conn.commit()
    print("Added teacher_id column")
except Exception as e:
    print(e)
