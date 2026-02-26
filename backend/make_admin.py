import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'nika.db')

def make_admin():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET is_admin = 1 WHERE email = 'eseeva228@gmail.com'")
    conn.commit()
    print("Admin status updated for eseeva228@gmail.com.")
    conn.close()

if __name__ == '__main__':
    make_admin()
