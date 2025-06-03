from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Load config from parent directory
    app.config.from_pyfile('../config.py')

    # Enable CORS (for React frontend)
    CORS(app)

    # Initialize DB
    db.init_app(app)

    # Register routes
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app
