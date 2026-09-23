import sqlite3

try:
    conn = sqlite3.connect('skillbridge.db')
    cursor = conn.cursor()
    cursor.execute("SELECT count(*) FROM users")
    print(f"Total Users: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT count(*) FROM institution_profiles")
    print(f"Total Teacher Profiles: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT count(*) FROM student_profiles")
    print(f"Total Student Profiles: {cursor.fetchone()[0]}")
    
except Exception as e:
    print(f"Error: {e}")
