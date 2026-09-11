import os
import json
from typing import Dict, Any, List, Optional
import firebase_admin
from firebase_admin import credentials, firestore

class MockFirestoreDocument:
    def __init__(self, doc_id: str, data: Dict[str, Any], store_ref):
        self.id = doc_id
        self._data = data
        self._store_ref = store_ref

    def to_dict(self) -> Dict[str, Any]:
        return dict(self._data)

    def set(self, data: Dict[str, Any], merge: bool = False):
        if merge and self.id in self._store_ref:
            self._store_ref[self.id].update(data)
        else:
            self._store_ref[self.id] = dict(data)
        self._data = self._store_ref[self.id]

    def update(self, data: Dict[str, Any]):
        if self.id in self._store_ref:
            self._store_ref[self.id].update(data)
            self._data = self._store_ref[self.id]

    def get(self):
        return self

    @property
    def exists(self) -> bool:
        return self.id in self._store_ref

class MockFirestoreCollection:
    def __init__(self, name: str, db_store: Dict[str, Dict[str, Any]]):
        self.name = name
        if name not in db_store:
            db_store[name] = {}
        self._store = db_store[name]

    def document(self, doc_id: str) -> MockFirestoreDocument:
        data = self._store.get(doc_id, {})
        return MockFirestoreDocument(doc_id, data, self._store)

    def add(self, data: Dict[str, Any]) -> tuple:
        import uuid
        doc_id = str(uuid.uuid4())[:8]
        self._store[doc_id] = dict(data)
        return None, MockFirestoreDocument(doc_id, self._store[doc_id], self._store)

    def stream(self) -> List[MockFirestoreDocument]:
        return [MockFirestoreDocument(k, v, self._store) for k, v in self._store.items()]

    def where(self, field: str, op: str, value: Any):
        # simple filtering
        class Query:
            def __init__(self, items):
                self._items = items
            def stream(self):
                return self._items
        
        filtered = []
        for k, v in self._store.items():
            if op == '==' and v.get(field) == value:
                filtered.append(MockFirestoreDocument(k, v, self._store))
        return Query(filtered)

class MockFirestoreClient:
    def __init__(self):
        self._db_store: Dict[str, Dict[str, Any]] = {}
        self._seed_initial_data()

    def _seed_initial_data(self):
        # Pre-populate some tickets
        self._db_store['tickets'] = {
            'TKT-8841-VIP': {
                'id': 'TKT-8841-VIP',
                'attendee': 'Elena Rostova',
                'tier': 'VIP Access',
                'zone': 'zone-arena-bowl',
                'gate': 'Gate VIP-1',
                'used': False,
                'timestamp': None
            },
            'TKT-7729-GEN': {
                'id': 'TKT-7729-GEN',
                'attendee': 'Marcus Chen',
                'tier': 'General Admission',
                'zone': 'zone-north-gate',
                'gate': 'Gate North-A',
                'used': True,
                'timestamp': '18:22:10'
            },
            'TKT-9912-STF': {
                'id': 'TKT-9912-STF',
                'attendee': 'Sarah Jenkins',
                'tier': 'Security / Staff',
                'zone': 'ALL-ZONES',
                'gate': 'Gate All',
                'used': False,
                'timestamp': None
            }
        }
        self._db_store['alerts'] = {}
        self._db_store['telemetry_history'] = {}

    def collection(self, name: str) -> MockFirestoreCollection:
        return MockFirestoreCollection(name, self._db_store)

# Firebase initialization
_db = None
_is_firebase_live = False

def get_firebase_db():
    global _db, _is_firebase_live
    if _db is not None:
        return _db, _is_firebase_live

    cred_path = os.environ.get('FIREBASE_CREDENTIALS_PATH', 'serviceAccountKey.json')
    backend_cred_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')

    if os.path.exists(cred_path):
        target_path = cred_path
    elif os.path.exists(backend_cred_path):
        target_path = backend_cred_path
    else:
        target_path = None

    if target_path:
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(target_path)
                firebase_admin.initialize_app(cred)
            _db = firestore.client()
            _is_firebase_live = True
            print(f"[Firebase] Successfully connected to live Firebase Firestore using {target_path}")
            return _db, True
        except Exception as e:
            print(f"[Firebase Warning] Failed to init Firebase with {target_path}: {e}. Falling back to in-memory emulator.")

    # Fallback to in-memory Firestore emulator
    _db = MockFirestoreClient()
    _is_firebase_live = False
    print("[Firebase] Running in-memory Firestore database emulator (Drop serviceAccountKey.json in backend/ to enable live cloud Firestore)")
    return _db, False
