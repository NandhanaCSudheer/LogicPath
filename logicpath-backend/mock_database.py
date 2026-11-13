"""
In-memory MongoDB-compatible fallback used when no MongoDB server is available.
Supports enough of the pymongo API for LogicPath auth, questions, and submissions.
"""

from datetime import datetime
from bson import ObjectId


class MockCursor(list):
    def __init__(self, items):
        super().__init__(items)

    def sort(self, key, direction=1):
        reverse = direction == -1
        super().sort(
            key=lambda d: d.get(key) if d.get(key) is not None else "",
            reverse=reverse,
        )
        return self

    def limit(self, n):
        return MockCursor(self[:n])

    def count(self):
        return len(self)


def _get_nested(doc, dotted_key):
    """Resolve dotted paths like verification_result.passed."""
    parts = dotted_key.split(".")
    cur = doc
    for part in parts:
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


def _compare_op(doc_val, op_dict):
    """Evaluate Mongo-style operator dict against a document value."""
    if "$in" in op_dict:
        targets = op_dict["$in"]
        str_vals = [str(item) for item in targets]
        if str(doc_val) not in str_vals and doc_val not in targets:
            return False
    if "$ne" in op_dict:
        if doc_val == op_dict["$ne"]:
            return False
    if "$gt" in op_dict:
        try:
            if not (doc_val is not None and doc_val > op_dict["$gt"]):
                return False
        except TypeError:
            return False
    if "$gte" in op_dict:
        try:
            if not (doc_val is not None and doc_val >= op_dict["$gte"]):
                return False
        except TypeError:
            return False
    if "$lt" in op_dict:
        try:
            if not (doc_val is not None and doc_val < op_dict["$lt"]):
                return False
        except TypeError:
            return False
    if "$lte" in op_dict:
        try:
            if not (doc_val is not None and doc_val <= op_dict["$lte"]):
                return False
        except TypeError:
            return False
    if "$exists" in op_dict:
        exists = doc_val is not None
        if bool(op_dict["$exists"]) != exists:
            return False
    return True


class MockCollection:
    def __init__(self, name):
        self.name = name
        self.docs = {}

    def create_index(self, keys, unique=False):
        pass

    def count_documents(self, query=None):
        return len(self.find(query))

    def insert_one(self, doc):
        d = dict(doc)
        if "_id" not in d:
            d["_id"] = ObjectId()
        self.docs[str(d["_id"])] = d
        return type("InsertResult", (), {"inserted_id": d["_id"]})()

    def _matches(self, doc, query):
        if not query:
            return True
        for k, v in query.items():
            if k == "$and":
                if not all(self._matches(doc, sub) for sub in v):
                    return False
                continue
            if k == "$or":
                if not any(self._matches(doc, sub) for sub in v):
                    return False
                continue

            doc_val = doc.get("_id") if k == "_id" else _get_nested(doc, k) if "." in k else doc.get(k)

            if k == "_id":
                if str(doc.get("_id")) != str(v):
                    return False
            elif isinstance(v, dict) and any(op.startswith("$") for op in v):
                if not _compare_op(doc_val, v):
                    return False
            else:
                if doc_val != v and str(doc_val) != str(v):
                    return False
        return True

    def find_one(self, query=None):
        query = query or {}
        for d in self.docs.values():
            if self._matches(d, query):
                return dict(d)
        return None

    def find(self, query=None):
        query = query or {}
        results = []
        for d in self.docs.values():
            if self._matches(d, query):
                results.append(dict(d))
        return MockCursor(results)

    def update_one(self, query, update):
        target = self.find_one(query)
        if not target:
            return type("UpdateResult", (), {"matched_count": 0, "modified_count": 0})()

        target_id = str(target["_id"])
        if "$set" in update:
            for k, v in update["$set"].items():
                if "." in k:
                    parts = k.split(".")
                    cur = self.docs[target_id]
                    for part in parts[:-1]:
                        if part not in cur or not isinstance(cur[part], dict):
                            cur[part] = {}
                        cur = cur[part]
                    cur[parts[-1]] = v
                else:
                    self.docs[target_id][k] = v
        if "$inc" in update:
            for k, v in update["$inc"].items():
                self.docs[target_id][k] = self.docs[target_id].get(k, 0) + v
        if "$addToSet" in update:
            for k, v in update["$addToSet"].items():
                arr = self.docs[target_id].setdefault(k, [])
                if v not in arr:
                    arr.append(v)
        if "$unset" in update:
            for k in update["$unset"]:
                self.docs[target_id].pop(k, None)
        return type("UpdateResult", (), {"matched_count": 1, "modified_count": 1})()

    def delete_one(self, query):
        target = self.find_one(query)
        if not target:
            return type("DeleteResult", (), {"deleted_count": 0})()
        del self.docs[str(target["_id"])]
        return type("DeleteResult", (), {"deleted_count": 1})()

    def delete_many(self, query):
        matches = list(self.find(query))
        for m in matches:
            self.docs.pop(str(m["_id"]), None)
        return type("DeleteResult", (), {"deleted_count": len(matches)})()


class MockDatabase:
    def __init__(self):
        self.collections = {}

    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection(name)
        return self.collections[name]
