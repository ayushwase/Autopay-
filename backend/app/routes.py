# File: backend/app/routes.py

from flask import Blueprint, request, jsonify, current_app
from app import db # app इन्स्टन्स आणि db
from app.models import User, Payment # तुमच्या मॉडेल फाईलनुसार बदला
from sqlalchemy.orm import joinedload
from datetime import datetime
import pandas as pd # CSV and XLSX for reading
import io # File Handling
import openpyxl # XLSX for read (pip install openpyxl importent)

api = Blueprint('api', __name__)

# ----------------------------------------------------
# User API Routes
# ----------------------------------------------------
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user_data(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user:
        failed_payments_count = Payment.query.filter_by(user_id=user.id, status='FAILED').count()
        user_data = {
            'id': user.id,
            'name': user.name,
            'bankName': user.bank_name,
            'balance': user.balance,
            'failed_payments_count': failed_payments_count
        }
        return jsonify(user_data), 200
    return jsonify({'message': 'User not found'}), 404

# ----------------------------------------------------
# Payments API Routes
# ----------------------------------------------------
@api.route('/payments/<int:user_id>', methods=['GET'])
def get_user_payments(user_id):
    # 'FAILED' स्टेटस नसलेले पेमेंट्सच फेच करा
    payments = Payment.query.filter(
        Payment.user_id == user_id,
        Payment.status != 'FAILED' # ही लाइन ऍड करा / बदला
    ).order_by(Payment.due_date.desc()).all()
    
    payments_data = []
    for payment in payments:
        payments_data.append({
            'id': payment.id,
            'payee': payment.payee,
            'amount': float(payment.amount),
            'due_date': payment.due_date.strftime('%Y-%m-%d'),
            'method': payment.method,
            'status': payment.status,
            'created_at': payment.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(payments_data), 200

@api.route('/schedule-payment', methods=['POST'])
def schedule_payment():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    print(f"Received data for schedule-payment: {data}")
    print(f"Value of 'due_date' field: {data.get('due_date')}")
    
    user = User.query.filter_by(id=1).first()
    if not user:
        return jsonify({'message': 'User ID 1 not found'}), 404

    try:
        due_date_str = data.get('due_date')
        if not due_date_str:
            return jsonify({'message': 'Payment date (due_date) is required'}), 400

        try:
            parsed_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError as ve:
            return jsonify({'message': f'Invalid date format for "{due_date_str}". Expected YYYY-MM-DD.', 'error': str(ve)}), 400

        payment_method = data.get('method', 'Other')

        new_payment = Payment(
            user_id=user.id,
            payee=data['payee'],
            amount=data['amount'],
            due_date=parsed_date,
            status='SCHEDULED',
            method=payment_method
        )
        db.session.add(new_payment)
        db.session.commit()
        return jsonify({'message': 'Payment scheduled successfully', 'payment_id': new_payment.id}), 201
    except KeyError as ke:
        db.session.rollback()
        print(f"Missing data key during scheduling: {ke}")
        return jsonify({'message': f"Missing data: {str(ke)}. Make sure 'payee', 'amount', and 'due_date' are provided."}), 400
    except Exception as e:
        db.session.rollback()
        print(f"An unexpected error occurred during scheduling: {e}")
        return jsonify({'message': 'An unexpected error occurred during scheduling', 'error': str(e)}), 500

# ----------------------------------------------------
# Bulk Upload API Endpoint 
# ----------------------------------------------------
@api.route('/bulk-upload-payments', methods=['POST'])
def bulk_upload_payments():
    # --- डीबगिंग प्रिंट ऍड करा ---
    print("--- Bulk Upload Request Received ---")

    if 'file' not in request.files:
        print("Error: No file part in the request.")
        return jsonify({'message': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        print("Error: No selected file.")
        return jsonify({'message': 'No selected file'}), 400

    # फाईलचा प्रकार तपासा
    if file.filename.endswith('.csv'):
        file_type = 'csv'
    elif file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
        file_type = 'excel'
    else:
        print(f"Error: Invalid file type detected: {file.filename}")
        return jsonify({'message': 'Invalid file type. Please upload a .csv or .xlsx file.'}), 400

    print(f"File received: {file.filename}, Type: {file_type}")

    try:
        if file_type == 'csv':
            df = pd.read_csv(io.StringIO(file.read().decode('utf-8')))
        else: # excel
            df = pd.read_excel(file)

        print(f"DataFrame loaded. Columns: {df.columns.tolist()}")

        # आवश्यक कॉलम तपासा (आता 'user_id' काढून टाकले आहे)
        required_columns = ['amount', 'due_date', 'payee', 'method']
        # **सुधारित लाइन 135:**
        if not all(col in df.columns for col in required_columns):
            missing_cols = [col for col in required_columns if col not in df.columns]
            print(f"Error: Missing required columns: {missing_cols}. File columns: {df.columns.tolist()}")
            return jsonify({'message': f'Missing required columns in file. Required: {", ".join(required_columns)}. Missing: {", ".join(missing_cols)}'}), 400

        target_user_id = 1
        user = User.query.get(target_user_id)
        if not user:
            print(f"Error: Target User ID {target_user_id} not found in database.")
            return jsonify({'message': f'Target User ID {target_user_id} not found in database.'}), 404

        processed_count = 0
        failed_rows = []

        print(f"Processing {len(df)} rows from the file...")
        for index, row in df.iterrows():
            try:
                current_payment_user_id = target_user_id

                amount = float(row['amount'])
                payee = str(row['payee'])
                method = str(row['method'])

                due_date_val = row['due_date']
                if isinstance(due_date_val, (float, int)):
                    due_date = datetime.fromtimestamp((due_date_val - 25569) * 86400).date()
                else:
                    due_date = datetime.strptime(str(due_date_val), '%Y-%m-%d').date()

                new_payment = Payment(
                    user_id=current_payment_user_id,
                    amount=amount,
                    due_date=due_date,
                    payee=payee,
                    method=method,
                    status='SCHEDULED'
                )
                db.session.add(new_payment)
                processed_count += 1
                # print(f"Row {index+1} processed for payment: {payee}, Amount: {amount}") # खूप जास्त लॉगिंग टाळण्यासाठी कमेंट केले
            except Exception as e:
                failed_rows.append({'row_number': index + 1, 'error': str(e), 'data': row.to_dict()})
                print(f"Error processing row {index+1}: {e}. Data: {row.to_dict()}")
                db.session.rollback() # रोलबॅक एका रोच्या एररवर
                continue

        db.session.commit() # सर्व यशस्वी पेमेंट एकाच वेळी कमिट करा
        print(f"Successfully processed {processed_count} payments. Failed: {len(failed_rows)}.")

        return jsonify({
            'message': f'Bulk upload completed. {processed_count} payments processed.',
            'total_rows': len(df),
            'processed_count': processed_count,
            'failed_count': len(failed_rows),
            'failed_details': failed_rows
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"An unhandled error occurred during bulk upload processing: {e}") # अधिक स्पष्ट मेसेज
        return jsonify({'message': f'Error processing file: {str(e)}'}), 500

# ----------------------------------------------------
# Automatic Payment Processing (Scheduler & Manual Trigger)
# ----------------------------------------------------

@api.route('/process-due-payments', methods=['POST'])
def process_due_payments_route():
    return process_due_payments(current_app)

def process_due_payments(app):
    print(f"[{datetime.now()}] Attempting to process due payments...")

    with app.app_context():
        today = datetime.now().date()

        payments_to_process = Payment.query.options(joinedload(Payment.user)).filter(
            Payment.status == 'SCHEDULED',
            Payment.due_date <= today
        ).all()

        processed_count = 0
        failed_count = 0

        for payment in payments_to_process:
            user = payment.user
            if user and user.balance >= payment.amount:
                user.balance -= payment.amount
                payment.status = 'PAID'
                processed_count += 1
                print(f"Processed payment ID {payment.id} for user {user.name}. New balance: {user.balance}")
            else:
                payment.status = 'FAILED'
                failed_count += 1
                print(f"Failed to process payment ID {payment.id} for user {user.name}. Insufficient balance or user not found.")

        try:
            db.session.commit()
            print(f"[{datetime.now()}] Payment processing complete. Processed: {processed_count}, Failed: {failed_count}")
            return jsonify({'message': 'Payments processed successfully', 'processed': processed_count, 'failed': failed_count}), 200
        except Exception as e:
            db.session.rollback()
            print(f"[{datetime.now()}] Error committing payments: {e}")
            return jsonify({'message': 'Error processing payments', 'error': str(e)}), 500

# ----------------------------------------------------
# Payment Cancel API
# ----------------------------------------------------
@api.route('/payment/<int:payment_id>/cancel', methods=['POST'])
def cancel_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({'message': 'Payment not found'}), 404

    # फक्त SCHEDULED किंवा PENDING पेमेंट रद्द करण्याची परवानगी द्या
    if payment.status == 'SCHEDULED' or payment.status == 'PENDING':
        payment.status = 'CANCELLED'
        try:
            db.session.commit()
            return jsonify({'message': f'Payment {payment_id} cancelled successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Error cancelling payment', 'error': str(e)}), 500
    else:
        return jsonify({'message': f'Payment cannot be cancelled (current status: {payment.status})'}), 400

# ----------------------------------------------------
# Get All Failed Payments for a User API (New)
# ----------------------------------------------------
@api.route('/failed-payments/<int:user_id>', methods=['GET'])
def get_failed_payments_for_user(user_id):
    # 'FAILED' किंवा 'PENDING' स्टेटस नसलेले पेमेंट्सच फेच करा
    # इथे status 'FAILED' किंवा 'PENDING' असेल अशी क्वेरी करायची आहे
    failed_or_pending_payments = Payment.query.filter(
        Payment.user_id == user_id,
        Payment.status.in_(['FAILED', 'PENDING']) # ही लाइन ऍड करा / बदला
    ).all()

    if not failed_or_pending_payments:
        return jsonify({'message': 'No failed or pending payments found for this user'}), 404
    
    payments_data = []
    for payment in failed_or_pending_payments:
        payments_data.append({
            'id': payment.id,
            'user_id': payment.user_id,
            'payee': payment.payee,
            'amount': payment.amount,
            'due_date': payment.due_date.strftime('%Y-%m-%d'),
            'status': payment.status,
            'method': payment.method,
            'created_at': payment.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(payments_data), 200

# ----------------------------------------------------
# Update Payment API (for rescheduling) (New)
# ----------------------------------------------------
@api.route('/payment/<int:payment_id>', methods=['PUT'])
def update_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({'message': 'Payment not found'}), 404

    data = request.get_json()
    
    # Update fields if provided in the request
    if 'amount' in data:
        payment.amount = data['amount']
    if 'due_date' in data:
        # datetime object madhe convert kara
        from datetime import datetime
        payment.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
    if 'method' in data:
        payment.method = data['method']
    if 'status' in data:
        # Ensure status is valid before updating
        valid_statuses = ['SCHEDULED', 'PENDING', 'PAID', 'FAILED', 'CANCELLED'] # SCHEDULED status add kele
        if data['status'] in valid_statuses:
            payment.status = data['status']
        else:
            return jsonify({'error': 'Invalid status provided'}), 400
    
    try:
        db.session.commit()
        return jsonify({'message': 'Payment updated successfully!', 'payment': {
            'id': payment.id,
            'payee': payment.payee,
            'amount': payment.amount,
            'due_date': payment.due_date.strftime('%Y-%m-%d'),
            'status': payment.status,
            'method': payment.method
        }}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
