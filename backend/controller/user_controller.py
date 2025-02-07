from flask import request, jsonify, make_response
from config import BLACKLIST
from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies, get_jwt, create_refresh_token
from functools import wraps
from model.user import UserModel

user_model = UserModel()
parser = reqparse.RequestParser()
parser.add_argument('email', type=str, required=True, help="Email is Required")
parser.add_argument('password', type=str, required=True, help="Password is Required")

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user.get('role') != 'admin':
            return {'message': 'Access Denied. Admins Only!'}, 403
        return fn(*args, **kwargs)
    return wrapper

class Login(Resource):
    def post(self):
        args = parser.parse_args()
        email = args['email']
        password = args['password']
        result = user_model.login(email, password)

        if result['status']:
            user = user_model.get_user_by_id(result['user_id'])
            role = user['data'].get('role', 'user')  # Default ke 'user' jika tidak ada role
            
            access_token = create_access_token(identity={
                'user_id': result['user_id'], 
                'email': result['email'], 
                'role': role
            })
            refresh_token = create_refresh_token(identity={
                'user_id': result['user_id'], 
                'email': result['email'], 
                'role': role
            })

            return {
                'user_id': result['user_id'],
                'message': result['message'],
                'access_token': access_token,
                'refresh_token': refresh_token,
                'role': role
            }, 200
        else:
            return {'message': result['message']}, 400
        
class Register(Resource):
    def post(self):
        args = parser.parse_args()
        email = args['email']
        password = args['password']
        role = request.json.get('role', 'user')

        result = user_model.register(email, password, role)
        if result['status']:
            return {'message': result['message'], 'user_id': result['user_id'], 'role': role}, 200
        else:
            return {'message': result['message']}, 500
        
class Protected(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            return {
                'logged_in_as': current_user,
                'message': 'Access to protected resource successful'
            }, 200
        except Exception as e:
            return {'error': str(e)}, 401
    
class Logout(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        BLACKLIST.add(jti)
        return {'message': 'Logout successful'}, 200
    
class RefreshToken(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return {'access_token': new_access_token}, 200