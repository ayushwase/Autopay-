# File: backend/config.py

DB_USER = 'postgres'
DB_PASS = 'Database Password'
DB_NAME = 'autopay_db' # Database name
DB_HOST = 'localhost'

SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
SQLALCHEMY_TRACK_MODIFICATIONS = False

MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True

# These are extremely important for Flask-Mail authentication.
MAIL_USERNAME = 'Sender Mail id' # Sender Mail id
MAIL_PASSWORD = 'Your_app_password'         # Sender App Password

# You can keep these additional variables as per your convenience.
HARDCODED_RECEIVER_EMAIL = 'Receiver Mail id'  # Receiver Mail id
SENDER_EMAIL = 'Sender Mail' # Sender Mail 

MAIL_DEFAULT_SENDER = 'Sender Mail' # Sender Mail
