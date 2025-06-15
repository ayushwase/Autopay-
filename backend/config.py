# File: backend/config.py

DB_USER = 'postgres'
DB_PASS = 'Ayushs123'
DB_NAME = 'autopay_db' # Database name
DB_HOST = 'localhost'

SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
SQLALCHEMY_TRACK_MODIFICATIONS = False

MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True

# These are extremely important for Flask-Mail authentication.
MAIL_USERNAME = 'ayuwase66@gmail.com' # Sender Mail id
MAIL_PASSWORD = 'tulr qvmy axww rbsb'         # Sender App Password

# You can keep these additional variables as per your convenience.
HARDCODED_RECEIVER_EMAIL = 'ayuuwase@gmail.com'  # Receiver Mail id
SENDER_EMAIL = 'ayuwase66@gmail.com' # Sender Mail 

MAIL_DEFAULT_SENDER = 'ayuwase66@gmail.com' # Sender Mail
