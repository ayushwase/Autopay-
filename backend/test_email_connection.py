# test_email_connection.py
import smtplib
import ssl

SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = 'prasadpanchalps@gmail.com' # तुमचा Gmail ऍड्रेस
APP_PASSWORD = 'htnu eeqy qhyg lppq'       # तुमचा Gmail App Password

print(f"SMTP सर्व्हरशी कनेक्ट करण्याचा प्रयत्न करत आहे: {SMTP_SERVER}:{SMTP_PORT}")

try:
    # SSL/TLS कॉन्टेक्स्ट तयार करा
    context = ssl.create_default_context()
    
    # SMTP सर्व्हरशी कनेक्ट करा
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.ehlo() # कनेक्शन स्थापित करा
        server.starttls(context=context) # TLS (सुरक्षित कनेक्शन) सुरू करा
        server.ehlo() # TLS सुरू झाल्यावर पुन्हा अभिवादन करा
        server.login(SENDER_EMAIL, APP_PASSWORD) # लॉगिन करा
        print("कनेक्शन आणि लॉगिन यशस्वी झाले!")
        print("ईमेल पाठवण्यासाठी सर्व्हर तयार आहे.")

        # टेस्ट ईमेल पाठवण्याचा प्रयत्न करा (ही लाइन तुम्ही डीबग करण्यासाठी वापरू शकता)
        # receiver_email = 'prasadpanchalps@gmail.com' # ज्याला टेस्ट ईमेल पाठवायचा आहे
        # message = "Subject: Test Email from Python Script\n\nThis is a test email sent from your Python application."
        # server.sendmail(SENDER_EMAIL, receiver_email, message)
        # print(f"टेस्ट ईमेल {receiver_email} ला पाठवला.")

except smtplib.SMTPAuthenticationError as e:
    print(f"SMTP लॉगिन अयशस्वी: युझरनेम किंवा पासवर्ड चुकीचा. त्रुटी: {e}")
    print("कृपया MAIL_USERNAME आणि MAIL_PASSWORD (ऍप पासवर्ड) योग्य आहेत याची खात्री करा.")
except smtplib.SMTPConnectError as e:
    print(f"SMTP कनेक्शन अयशस्वी: सर्व्हरशी कनेक्ट होऊ शकलो नाही. त्रुटी: {e}")
    print("तुमचे फायरवॉल, अँटीव्हायरस किंवा नेटवर्क सेटिंग्ज तपासा.")
except Exception as e:
    print(f"एक अनपेक्षित त्रुटी आली: {e}")