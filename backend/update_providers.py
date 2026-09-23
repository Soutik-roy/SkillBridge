import sqlite3
import os

db_path = 'skillbridge.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("UPDATE courses SET provider = 'SkillBridge'")
    conn.commit()
    print(f"Updated {c.rowcount} courses to use provider 'SkillBridge'")
    conn.close()
else:
    print("DB not found")
