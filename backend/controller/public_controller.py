from flask_restful import Resource
import json
from model.public import Public

public_model = Public()
class GetMenu(Resource):
    def get(self):
        result = public_model.findAllMenu()
        if result['status']:
            return result['data'], 200
        else:
            return {'message': 'Menu Not Found!'}, 404