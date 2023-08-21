import sqlite3
import csv

def load_data_from_csv(csv_file):
    conn = sqlite3.connect('your_database_name.db')
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS Match (
                        ID INTEGER PRIMARY KEY,
                        Year INTEGER,
                        Stage TEXT,
                        Home_Team TEXT,
                        Home_Goals INTEGER,
                        Away_Goals INTEGER,
                        Away_Team TEXT,
                        Host_Team_or_not TEXT
                    )''')
    
    with open(csv_file, 'r') as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            cursor.execute('INSERT INTO Match (ID, Year, Stage, Home_Team, Home_Goals, Away_Goals, Away_Team, Host_Team_or_not) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                           (row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]))
    
    conn.commit()
    conn.close()

def read_data_from_database():
    conn = sqlite3.connect('your_database_name.db')
    cursor = conn.cursor()

    query = "SELECT * FROM Match WHERE Year = ?"
    year_to_query = 2018
    cursor.execute(query, (year_to_query,))

    results = cursor.fetchall()

    for row in results:
        print(row)

    conn.close()

if __name__ == "__main__":
    load_data_from_csv('world_cup_matches.csv')
    read_data_from_database()
