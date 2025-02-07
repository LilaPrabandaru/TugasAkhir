from flask import request
from flask_restful import Resource, reqparse
from bson import ObjectId
from model.karyawan import Karyawan

Karyawan_model = Karyawan()

parser = reqparse.RequestParser()
parser.add_argument('Nama_Lengkap', type=str, required=True, help="Parameter 'Nama Lengkap' Tidak Boleh Kosong")
parser.add_argument('Email', type=str, required=True, help="Parameter 'Email' Tidak Boleh Kosong")
parser.add_argument('Nomor_Telp', type=str, required=True, help="Parameter 'Nomor Telp' Tidak Boleh Kosong")
parser.add_argument('Tanggal_Lahir', type=str, required=True, help="Parameter 'Tanggal Lahir' Tidak Boleh Kosong")

class GetKaryawan(Resource):
    def get(self):
        result = Karyawan_model.findAllKaryawan()
        if result['status']:
            return result['data'], 200
        else:
            return {'message': "Employee Not Found."}, 404
        
class AddKaryawan(Resource):
    def post(self):
            args = parser.parse_args()
            data = {
                'Nama_Lengkap': args['Nama_Lengkap'],
                'Email': args['Email'],
                'Nomor_Telp': args['Nomor_Telp'],
                'Tanggal_Lahir': args['Tanggal_Lahir'],
            }

            result = Karyawan_model.insertKaryawan(data)

            if result ['status']:
                return ({'message': "Employee Added Successfully."}), 200
            else:
                return ({'message': "Failed to Add Employee."}), 500
    
class DeleteKaryawan(Resource):
    def delete(self, karyawan_id):
        try:
            karyawan = Karyawan_model.findKaryawan({'_id': karyawan_id})
            if not karyawan ['status']:
                return {'message': "Emoloyee Not Found."}, 404
            
            result = Karyawan_model.deleteKaryawan(karyawan_id)
            if result ['status']:
                return {'message': "Employee Successfully Deleted."}, 200
            else:
                return {'message': result['message']}, 400
        except Exception as e:
            return {'message': str(e)}, 400
        
class UpdateKaryawan(Resource):
    def post(self, karyawan_id):
        try:
            args = parser.parse_args()
            data = args.copy()
            karyawan = Karyawan_model.findKaryawan({'_id': karyawan_id})
            if not karyawan ['status']:
                return ({'message': "Employee Not Found"}), 404
            
            result = Karyawan_model.updateKaryawan(karyawan_id, data)
            if result['status']:
                return ({'message': "Employee Updated Successfully."}), 200
            else:
                return ({'message': result['message']}), 400
            
        except Exception as e:
            return ({'message': str(e)}), 400