```python
import pytest
import requests
from pymongo import MongoClient
from requests.sessions import Session

@pytest.fixture(scope="module")
def mongo_client():
    client = MongoClient('mongodb+srv://Garubabomi:Gb2050!!@imobapp.lwcxb.mongodb.net/iMobDB?retryWrites=true&w=majority')
    yield client
    client.close()

@pytest.fixture(scope="module")
def session():
    with requests.Session() as s:
        yield s

def test_app_running():
    response = requests.get("http://localhost:3005")
    assert response.status_code == 200

def test_database_connection(mongo_client):
    db = mongo_client['iMobDB']
    assert db.name == 'iMobDB'

def test_login(session):
    login_url = "http://localhost:3005/login"
    data = {"username": "testuser", "password": "password"}
    response = session.post(login_url, data=data)
    assert response.status_code == 200

def test_protected_route(session):
    protected_url = "http://localhost:3005/iMobPostPage"
    response = session.get(protected_url)
    assert response.status_code == 200

def test_websocket_connection():
    import socketio
    sio = socketio.Client()
    
    @sio.event
    def connect():
        print("connection established")

    @sio.event
    def message(data):
        print("message received with ", data)
    
    sio.connect('http://localhost:3005')
    sio.wait()
```
