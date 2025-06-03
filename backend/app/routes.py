from flask import Blueprint, request, jsonify
from .models import db, Payment
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/', methods=['GET'])
def index():
    return jsonify({"message": "API is running"}), 200


@api.route('/schedule-payment', methods=['POST'])
def schedule_payment():
    try:
        data = request.json
        payment = Payment(
            payer=data['payer'],
            payee=data['payee'],
            amount=data['amount'],
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d'),
            method=data['method']
        )
        db.session.add(payment)
        db.session.commit()
        return jsonify({'message': 'Payment scheduled successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    return jsonify([
        {
            'id': p.id,
            'payer': p.payer,
            'payee': p.payee,
            'amount': p.amount,
            'due_date': p.due_date.strftime('%Y-%m-%d'),
            'status': p.status,
            'method': p.method,
            'created_at': p.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for p in payments
    ])
