import secrets, os, base64

MONGO_DB = 'db_reservation'
MONGO_USERS_COLLECTION = 'users_reservation'
MONGO_KARYAWAN_COLLECTION = 'karyawan_reservation'
MONGO_MENU_COLLECTION = 'menu_reservation'
MONGO_PESANAN_COLLECTION = 'pesanan_reservation'

def get_jwt_secret_key():
    env_secret_key = os.environ.get('JWT_SECRET_KEY')
    
    if env_secret_key:
        return env_secret_key
    
    secret_key = secrets.token_hex(32)
    os.environ['JWT_SECRET_KEY'] = secret_key
    
    return secret_key

JWT_SECRET_KEY = get_jwt_secret_key()
BLACKLIST = set()

# Token Expiration (dalam detik)
JWT_ACCESS_TOKEN_EXPIRES = 28.800  # 8 jam
JWT_REFRESH_TOKEN_EXPIRES = 24 * 3600  # 1 hari
JWT_BLACKLIST_ENABLED = True
JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

MONGO_URI = 'mongodb+srv://672021017:TA672021017@tugasakhir.rjawo.mongodb.net/?retryWrites=true&w=majority&appName=TugasAkhir'

SERVER_KEY = 'SB-Mid-server-X_RYyIKttvuQ_YFn0EmKCTql:'
MIDTRANS_SERVER_KEY = 'SB-Mid-server-X_RYyIKttvuQ_YFn0EmKCTql'
MIDTRANS_CLIENT_KEY = 'SB-Mid-client-GNfvee5tAmeNzI9L'