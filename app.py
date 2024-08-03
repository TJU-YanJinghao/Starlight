from flask import Flask, jsonify,request,session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request
from werkzeug.datastructures import Headers
from datetime import timedelta
from decorators import login_limit

dir_path_base='../DZLGZ_vue/'
app = Flask(__name__,
static_folder=dir_path_base+'src/assets',  
template_folder = dir_path_base+"src/components")  
CORS(app,supports_credentials=True) #解决跨域服务问题
jwt = JWTManager(app)


@app.before_request
def load_token():
    headers = Headers(request.headers)
    headers.add('Access-Control-Allow-Origin', 'http://localhost:8080')
    headers.add('Access-Control-Allow-Credentials', 'true')
    token = request.cookies.get('access_token')
    if token:
        headers['Authorization'] = f'Bearer {token}'
        request.headers = headers

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5000)