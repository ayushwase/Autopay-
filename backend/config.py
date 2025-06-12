# File: backend/config.py

DB_USER = 'postgres'
DB_PASS = 'Prasad%40123'
DB_NAME = 'autopay_db'
DB_HOST = 'localhost'

SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
SQLALCHEMY_TRACK_MODIFICATIONS = False

MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True

# हे Flask-Mail च्या ऑथेंटिकेशनसाठी अत्यंत महत्त्वाचे आहेत
MAIL_USERNAME = 'prasadpanchalps@gmail.com' # <--- हे तुमचे Gmail ऍड्रेस असावे
MAIL_PASSWORD = 'bwsl vohd qlog kjap'       # <--- हा 'prasadpanchalps@gmail.com' साठीचा ऍप पासवर्ड असावा

# तुम्ही तुमच्या सोयीनुसार हे अतिरिक्त व्हेरिएबल्स ठेवू शकता
HARDCODED_RECEIVER_EMAIL = 'prasadpanchalps@gmail.com'
SENDER_EMAIL = 'prasadpanchalps@gmail.com'

MAIL_DEFAULT_SENDER = 'prasadpanchalps@gmail.com'