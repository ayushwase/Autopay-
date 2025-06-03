from . import db
from datetime import datetime

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payer = db.Column(db.String(100), nullable=False)
    payee = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='Pending')
    method = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
