DB_USER = 'postgres'
DB_PASS = 'admin123'
DB_NAME = 'autopay_db'
DB_HOST = 'localhost'

SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
SQLALCHEMY_TRACK_MODIFICATIONS = False
