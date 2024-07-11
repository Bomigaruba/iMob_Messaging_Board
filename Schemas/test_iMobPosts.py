import pytest
from bson import ObjectId
from pymongo import MongoClient
from iMobPosts import iMobPosts

@pytest.fixture
def db():
    client = MongoClient('mongodb://localhost:27017/')
    db = client.test_db
    yield db
    client.drop_database('test_db')
    client.close()

def test_iMobPosts_schema(db):
    post_data = {
        "content": "Test post content",
        "authoredBy": ObjectId(),
        "Capping": True,
        "cosignFromMembers": [ObjectId(), ObjectId()],
        "cosignData": ObjectId(),
        "commentOn": ObjectId(),
        "comments": [ObjectId()],
        "crowns": [ObjectId()]
    }

    post = iMobPosts(**post_data)
    result = db.iMobPosts.insert_one(post.__dict__)
    assert result.acknowledged == True

    saved_post = db.iMobPosts.find_one({"_id": result.inserted_id})
    assert saved_post['content'] == post_data['content']
    assert saved_post['authoredBy'] == post_data['authoredBy']
    assert saved_post['Capping'] == post_data['Capping']
    assert saved_post['cosignFromMembers'] == post_data['cosignFromMembers']
    assert saved_post['cosignData'] == post_data['cosignData']
    assert saved_post['commentOn'] == post_data['commentOn']
    assert saved_post['comments'] == post_data['comments']
    assert saved_post['crowns'] == post_data['crowns']
