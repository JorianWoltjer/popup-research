from flask import Flask, jsonify, redirect, render_template, session, url_for, request
import requests
import os

CLIENT_ID = ...  # TODO: Client ID
CLIENT_SECRET = ...  # TODO: Client Secret
REDIRECT_URI = "http://localhost:5000/callback"


app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route("/")
def index():
    print(session)
    # 3. Upon reload, get token from session
    if session.get("access_token"):
        access_token = session.get("access_token")

        r = requests.get("https://api.linkedin.com/v2/userinfo", headers={
            "Authorization": f"Bearer {access_token}"
        })

        return jsonify(r.json())

    # 1. Prepare oauth url to send to callback
    url = f"https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&state={os.urandom(16).hex()}&scope=openid%20profile%20email"
    return render_template("index.html", url=url)


@app.route("/clear")
def clear():
    session.clear()
    return redirect(url_for("index"))


@app.route("/callback")
def callback():
    # 2. Receive callback and exchange code for token
    print(request.args)
    code = request.args.get("code")

    r = requests.post("https://www.linkedin.com/oauth/v2/accessToken", data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    })
    json = r.json()
    print(json)
    session["access_token"] = json.get("access_token")

    return '<script>window.close()</script>'


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")
