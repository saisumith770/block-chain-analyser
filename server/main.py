import requests
import pandas as pd

from flask import Flask,jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

resp = requests.get("https://api.covalenthq.com/v1/1/address/0xa79E63e78Eec28741e711f89A672A4C40876Ebf3/transactions_v2/?key=ckey_6961d2bb9cd940c2b2c33ac6d3b")
items = resp.json()["data"]["items"]

df = pd.DataFrame(items)

@app.route("/accounts",methods=["GET"])
def get_accounts():
    unique_accounts = pd.concat([df['from_address'],df['to_address']]).unique().tolist()
    return jsonify({"accounts":unique_accounts})

@app.route("/transaction-history/<account_address>",methods=["GET"])
def transaction_history(account_address):
    debited_transactions = df[df.from_address == account_address].to_dict(orient="records")
    credited_transactions = df[df.to_address == account_address].to_dict(orient="records")
    return jsonify({"debited_transactions":debited_transactions,"credited_transactions":credited_transactions})

if __name__ == '__main__':
   app.run()