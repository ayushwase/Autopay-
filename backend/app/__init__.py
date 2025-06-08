# File: backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate # <--- ADD THIS IMPORT

db = SQLAlchemy()
migrate = Migrate() # <--- ADD THIS LINE: Initialize Flask-Migrate

def create_app():
    app = Flask(__name__)

    # Load config from parent directory
    app.config.from_pyfile('../config.py')

    # Enable CORS (for React frontend)
    CORS(app)

    # Initialize DB
    db.init_app(app)

    # <--- ADD THIS LINE: Initialize Flask-Migrate with your app and db instance
    migrate.init_app(app, db)

    # Register routes
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app