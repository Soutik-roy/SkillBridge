import sqlite3
import json

conn = sqlite3.connect('skillbridge.db')
conn.execute('UPDATE job_postings SET required_skills = ?', (json.dumps(["Python", "React"]),))
conn.commit()
conn.close()
