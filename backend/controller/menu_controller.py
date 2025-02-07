from flask_restful import Resource, reqparse
from model.menu import Menu

menu_model = Menu()
parser = reqparse.RequestParser()
parser.add_argument('Nama', type=str, required=True, help="Parameter 'Nama' Can Not be Blank")
parser.add_argument('Harga', type=float, required=True, help="Parameter 'Harga' Can Not be Blank")
parser.add_argument('Tipe', type=str, required=True, help="Parameter 'Tipe' Can Not be Blank (food/drink)")
parser.add_argument('Kategori', type=str, required=True, help="Parameter 'Kategori' Can Not be Blank")

class GetMenu(Resource):
    def get(self):
        result = menu_model.findAllMenu()
        if result['status']:
            return result['data'], 200
        else:
            return {'message': "Menu Not Found!!!"}, 404
        
class AddMenu(Resource):
    def post(self):
        args = parser.parse_args()
        data = {
            'Nama': args['Nama'],
            'Harga': args['Harga'],
            'Tipe': args['Tipe'],
            'Kategori': args['Kategori']
        }

        result = menu_model.insertMenu(data)
        if result['status']:
            return({'message': 'Menu Added Successfully'}), 200
        else:
            return({'message': result['message']}), 500

class UpdateMenu(Resource):
    def post(self, menu_id):
        try:
            args = parser.parse_args()
            data = args.copy()
            menu = menu_model.findMenu({'_id': menu_id})
            print(f"Update menu dengan ID: {menu_id}")
            if not menu['status']:
                print(f"Menu dengan ID {menu_id} tidak ditemukan")
                return ({'message': 'Menu Not Found'}), 404
            
            result = menu_model.updateMenu(menu_id, data)
            if result['status']:
                return({'message': 'Menu Updated Successfully'}), 200
            else:
                return({'message': result['message']}), 400
            
        except Exception as e:
            return({'message': str(e)}), 400

class DeleteMenu(Resource):
    def delete(self, menu_id):
        try:
            menu = menu_model.findMenu({'_id': menu_id})
            if not menu['status']:
                return{'message': 'Menu Not Found'}, 404
            
            result = menu_model.deleteMenu(menu_id)
            if result['status']:
                return {'message': 'Menu Successfully Deleted'}, 200
            else:
                return{'message': result['message']}, 400
        except Exception as e:
            return{'message': str(e)}, 400
