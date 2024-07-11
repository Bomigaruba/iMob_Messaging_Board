import pytest
from pymongo import MongoClient
from iMobMember import iMobMember

@pytest.fixture
def db():
    client = MongoClient("mongodb://localhost:27017/")
    db = client.test_database
    yield db
    client.drop_database("test_database")
    client.close()

def test_create_iMobMember(db):
    member = iMobMember(
        FirstName="Chrystia",
        LastName="Freeland",
        UserName="C_Free",
        Email="Freeland@example.com",
        Password="securepassword123"
    )
    db.iMobMember.insert_one(member)
    retrieved_member = db.iMobMember.find_one({"UserName": "C_Free"})
    assert retrieved_member is not None
    assert retrieved_member["FirstName"] == "Chrystia"
    assert retrieved_member["LastName"] == "Freeland"
    assert retrieved_member["UserName"] == "C_Free"
    assert retrieved_member["Email"] == "Freeland@example.com"
    assert retrieved_member["Password"] == "securepassword123"
