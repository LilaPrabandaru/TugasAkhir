from model import Database
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session
from config import MONGO_USERS_COLLECTION,MONGO_DB
import random
import string

class UserModel:
    def __init__(self):
        self.connection = Database(MONGO_DB)

    def generatedId(self):
        randomString = ''.join(random.choices(string.digits, k=4))
        generatedId = f"USR{randomString}"
        filter = {'_id': generatedId}
        _, data = self.connection.find(collection_name=MONGO_USERS_COLLECTION, filter=filter)
        if data is None:
            return generatedId
        return self.generatedId()
    
    def login(self, email, password):
        result = {'status': False, 'message': ''}
        user = self.connection.find_one(MONGO_USERS_COLLECTION, {'email': email})
        
        if user['status'] and check_password_hash(user['data']['password'], password):
            result = {
                'status': True,
                'message': 'Login Successful',
                'user_id': str(user['data']['_id']),
                'email': user['data']['email']
            }
            # session['email'] = email
            # session['user_id'] = str(user['data']['_id'])
            # result = {'status': True, 'message': 'Login Succesful', 'user_id': str(user['data']['_id'])}
        else:
            result = {'status': False, 'message': 'Wrong Email or Password'}
        return result
    
    def register(self, email, password, role="user"):  # Default role = user
        result = {'status': False, 'message': ''}
        emails = self.connection.find_one(MONGO_USERS_COLLECTION, {'email': email})

        if emails['status']:
            result = {'status': False, 'message': 'Email Already Exists'}
        else:
            user_id = self.generatedId()
            hashed_password = generate_password_hash(password)
            resultInsert = self.connection.insert(MONGO_USERS_COLLECTION, {
                '_id': user_id,
                'email': email,
                'password': hashed_password,
                'role': role
            })
            if resultInsert[0]:
                result = {
                    'status': True,
                    'message': 'Registration Successful',
                    'user_id': user_id
                }
            else:
                result = {'status': False, 'message': 'An Error Occurred During Registration'}
        return result
    
    def get_user_by_id(self, user_id):
        user = self.connection.find_one(MONGO_USERS_COLLECTION, {'_id': user_id})
        return user