from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_jwt_extended import JWTManager, jwt_required
from config import JWT_SECRET_KEY, BLACKLIST
from controller.user_controller import Login, Register, Protected, Logout, RefreshToken, admin_required
from controller.karyawan_controller import GetKaryawan, AddKaryawan, UpdateKaryawan, DeleteKaryawan
from controller.menu_controller import GetMenu, AddMenu, UpdateMenu, DeleteMenu
from controller.pesanan_controller import GetAllPesanan, GetPesananById, GetPesananByTanggal, AddPesanan, UpdatePesanan, DeletePesanan
from controller.public_controller import GetMenu

app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
app.config['JWT_BLACKLIST_ENABLED'] = True  # Aktifkan blacklist
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

jwt = JWTManager(app)

@jwt.unauthorized_loader
def unauthorized_response(error):
    return {'message': 'Missing or invalid token'}, 401

@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLACKLIST

api.add_resource(Login, '/login')
api.add_resource(Register, '/register')
api.add_resource(Protected, '/protected')
api.add_resource(RefreshToken, '/refresh_token')
api.add_resource(Logout, '/logout')


# Karyawan Routes
class ProtectedGetKaryawan(GetKaryawan):
    @jwt_required()
    @admin_required
    def get(self):
        return super().get()

class ProtectedAddKaryawan(AddKaryawan):
    @jwt_required()
    @admin_required
    def post(self):
        return super().post()

class ProtectedUpdateKaryawan(UpdateKaryawan):
    @jwt_required()
    @admin_required
    def put(self, karyawan_id):
        return super().put(karyawan_id)

class ProtectedDeleteKaryawan(DeleteKaryawan):
    @jwt_required()
    @admin_required
    def delete(self, karyawan_id):
        return super().delete(karyawan_id)

# Menu Routes
class ProtectedGetMenu(GetMenu):
    @jwt_required()
    def get(self):
        return super().get()

class ProtectedAddMenu(AddMenu):
    @jwt_required()
    @admin_required
    def post(self):
        return super().post()

class ProtectedUpdateMenu(UpdateMenu):
    @jwt_required()
    @admin_required
    def put(self, menu_id):
        return super().put(menu_id)

class ProtectedDeleteMenu(DeleteMenu):
    @jwt_required()
    @admin_required
    def delete(self, menu_id):
        return super().delete(menu_id)

# Pesanan Routes
class ProtectedGetAllPesanan(GetAllPesanan):
    @jwt_required()
    @admin_required
    def get(self):
        return super().get()

class ProtectedGetPesananById(GetPesananById):
    @jwt_required()
    @admin_required
    def get(self, pesanan_id):
        return super().get(pesanan_id)

class ProtectedGetPesananByTanggal(GetPesananByTanggal):
    @jwt_required()
    @admin_required
    def get(self, tanggal):
        return super().get(tanggal)

class ProtectedAddPesanan(AddPesanan):
    @jwt_required()
    def post(self):
        return super().post()

class ProtectedUpdatePesanan(UpdatePesanan):
    @jwt_required()
    def put(self, pesanan_id):
        return super().put(pesanan_id)

class ProtectedDeletePesanan(DeletePesanan):
    @jwt_required()
    def delete(self, pesanan_id):
        return super().delete(pesanan_id)
    
class ProtectedUserMenu(GetMenu):
    @jwt_required()
    def get(self):
        return super().get()

# Register Protected Routes for Admin
api.add_resource(ProtectedGetKaryawan, '/admin/karyawan')
api.add_resource(ProtectedAddKaryawan, '/admin/add_karyawan')
api.add_resource(ProtectedUpdateKaryawan, '/admin/update_karyawan/<string:karyawan_id>')
api.add_resource(ProtectedDeleteKaryawan, '/admin/delete_karyawan/<string:karyawan_id>')

api.add_resource(ProtectedGetMenu, '/admin/menu')
api.add_resource(ProtectedAddMenu, '/admin/add_menu')
api.add_resource(ProtectedUpdateMenu, '/admin/update_menu/<string:menu_id>')
api.add_resource(ProtectedDeleteMenu, '/admin/delete_menu/<string:menu_id>')

api.add_resource(ProtectedGetAllPesanan, '/admin/pesanan')
api.add_resource(ProtectedGetPesananById, '/admin/pesanan_id/<string:pesanan_id>')
api.add_resource(ProtectedGetPesananByTanggal, '/admin/pesanan_tanggal/<string:tanggal>')
api.add_resource(ProtectedAddPesanan, '/admin/add_pesanan')
api.add_resource(ProtectedUpdatePesanan, '/admin/update_pesanan/<string:pesanan_id>')
api.add_resource(ProtectedDeletePesanan, '/admin/delete_pesanan/<string:pesanan_id>')

#Register Protected Routes for User
api.add_resource(ProtectedUserMenu, '/user/dashboard')

if __name__ == "__main__":
    app.run(debug=True, port=5000)