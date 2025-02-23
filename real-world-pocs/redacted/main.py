from flask import Flask, jsonify, redirect, render_template, session, url_for, request
from requests_oauthlib.oauth1_session import OAuth1Session
import os

CONSUMER_KEY = ...  # TODO: Consumer Keys -> API Key
CONSUMER_SECRET = ...  # TODO: Consumer Keys -> Secret


app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route("/")
def index():
    oauth_session = OAuth1Session(CONSUMER_KEY, client_secret=CONSUMER_SECRET)
    print(session)

    if session.get("token"):
        oauth_session.token = session.get("token")
        print(oauth_session.token)

        # 4. Use token to make authenticated requests as user
        url = "https://api.redacted.tld/profile_info"
        response = oauth_session.get(url)
        return jsonify(response.json())

    # 1. Prepare oauth url to send to callback
    request_token_url = 'https://api.redacted.tld/oauth/...'
    token = oauth_session.fetch_request_token(request_token_url)["oauth_token"]
    url = f"https://api.redacted.tld/oauth/...?oauth_token={token}"

    return render_template("index.html", url=url)


@app.route("/clear")
def clear():
    session.clear()
    return redirect(url_for("index"))


@app.route("/callback")
def callback():
    # 2. Receive callback and save it in OAuth 1.0 session object
    oauth_session = OAuth1Session(CONSUMER_KEY, client_secret=CONSUMER_SECRET)
    print(oauth_session.parse_authorization_response(request.url))
    # 3. Fetch access token using callback parameters
    session["token"] = oauth_session.fetch_access_token(
        'https://api.redacted.tld/oauth/...')
    print(session)

    return '<script>window.close()</script>'


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")
