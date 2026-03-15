import psycopg2
from psycopg2 import sql

DB_CONFIG = {
    'host':'localhost',
    'port':5432,
    'dbname': 'AI',
    'user':'postgres',
    'password': '123'
}

TABLES = {
    'users':"""
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            admin BOOLEAN NOT NULL
            )""" 
}

def init_db():
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()

        for table_name, create_sql in TABLES.items():
            print(f"Проверяем/создаём таблицу {table_name}...")
            cursor.execute(create_sql)

        print("Инициализация БД завершена.")
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    init_db()