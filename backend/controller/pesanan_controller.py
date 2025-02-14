import argparse
from flask_restful import Resource, reqparse
from model.pesanan import Pesanan
from model.menu import Menu
from datetime import date, time, datetime

pesanan_model = Pesanan()
parser = reqparse.RequestParser()

# def parse_tanggal(tanggal_string):
#     try:
#         return datetime.strptime(tanggal_string, '%d-%m-%Y').date()
#     except ValueError:
#         raise argparse.ArgumentTypeError("Format tanggal harus YYYY-MM-DD")

parser.add_argument('Nama_Pelanggan', 
                    type=str, 
                    required=True, 
                    help="Parameter 'Nama Pelanggan' Can Not be Blank"
                    )
parser.add_argument('Tanggal', 
                    type=str, 
                    required=True, 
                    help="Parameter 'Tanggal' tidak boleh kosong (Format: DD-MM-YYYY)"
                    )
parser.add_argument('Waktu', 
                    type=str, 
                    required=True, 
                    help="Parameter 'Waktu' tidak boleh kosong (Format: HH:MM:SS)"
                    )
parser.add_argument('Detail',
                    type=dict,
                    action='append',
                    required=False
                    )

class GetAllPesanan(Resource):
    def get(self):
        result = pesanan_model.findAllPesanan()
        if result['status']:
            return result['data'], 200
        else:
            return{'message': 'Order Not Found'}, 404
        
class GetPesananById(Resource):
    def get(self, pesanan_id):
        result = pesanan_model.findPesanan(pesanan_id)
        if result['status']:
            return result['data'], 200
        else:
            return{'message': 'Order Not Found'}, 404
        
class GetPesananByTanggal(Resource):
    def get(self, tanggal):
        tanggal_obj = datetime.strptime(tanggal, '%d-%m-%Y').date()
        tanggal_str = tanggal_obj.strftime('%d-%m-%Y')
        result = pesanan_model.findPesananTanggal(tanggal_str)
        if result['status']:
            return result['data'], 200
        else:
            return{'message': 'No Orders Found for This Date'}, 404

class AddPesanan(Resource):
    def post(self):
        args = parser.parse_args()
        data = {
                'Nama_Pelanggan': args['Nama_Pelanggan'],
                'Tanggal': args['Tanggal'],
                'Waktu': args['Waktu'],
                'Detail':[]
                }
        
        temp = 0
        for menu in args['Detail']:
            # print(menu['Id Menu'])
            detailMenu = Menu().findMenu(menu_id=menu["Id Menu"])
            detail = {
                'Nama Menu': detailMenu['data']['Nama'],
                'Harga': detailMenu['data']['Harga'],
                'Jumlah': menu['Jumlah']
            }
            data['Detail'].append(detail)
            temp += detailMenu['data']['Harga'] * menu['Jumlah']
        data['total harga']= temp
        # print(data)
        result = pesanan_model.insertPesanan(data)
        if result['status']:
            return({'message': 'Order Added Successfully'}), 200
        else:
            return({'message': 'Failed to Add Order'})
        
class UpdatePesanan(Resource):
    def post(self, pesanan_id):
        try:
            args = parser.parse_args()
            data = args.copy()
            pesanan = pesanan_model.findPesanan(pesanan_id)
            if not pesanan['status']:
                return({'message': 'Order Not Found'}), 404
            
            result = pesanan_model.updatePesanan(pesanan_id, data)
            if result['status']:
                return({'message': 'Order Update Successfully'}), 200
            else:
                return({'message': result['message']}), 400
        except Exception as e:
            return({'message': str(e)}), 400
        
class DeletePesanan(Resource):
    def delete(self, pesanan_id):
        try:
            pesanan = pesanan_model.findPesanan({'_id': pesanan_id})
            if not pesanan['status']:
                return{'message': 'Order Not Found'}, 404
            
            result = pesanan_model.deletePesanan(pesanan_id)
            if result['status']:
                return{'message': 'Oder Successfully Deleted'}, 200
            else:
                return{'message': result['message']}, 400
        except Exception as e:
            return{'message': str(e)}, 400