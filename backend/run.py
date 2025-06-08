# File: run.py
from app import create_app

app = create_app()

# IMPORTANT: db.create_all() has been removed.
# Database schema will now be managed solely by Flask-Migrate.
# Make sure you run 'flask db init', 'flask db migrate', 'flask db upgrade'
# whenever your models.py changes or to set up the database initially.

if __name__ == '__main__':
    app.run(debug=True)