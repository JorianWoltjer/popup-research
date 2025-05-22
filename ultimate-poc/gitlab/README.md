# Ultimate PoC - Gitlab

Configurable proof of concept for Double-Clickjacking using a moving popup window in the background. Uses a fake Cloudflare captcha page for an initial click, and Flappy Bird to convince the user to consistently click at a spot chosen by them.

**Read ["The Ultimate Double-Clickjacking PoC"](https://jorianwoltjer.com/blog/p/hacking/ultimate-doubleclickjacking-poc) for more details.**

## Customization

The [main.py](main.py) script has a couple of global variables which define its configuration. These are set up to work for Gitlab at the moment, but can be changed for your target. The code assumes you are targetting an OAuth authorization code flow where you want to hit the "Authorize" button.

1. `CLIENT_ID` and `CLIENT_SECRET`: Details of an application created on your target configured with the scopes you want to gain, and an allowed redirect URI pointing to where this server is hosted ([instructions for Gitlab](https://docs.gitlab.com/integration/oauth_provider/#create-a-user-owned-application))
2. `REDIRECT_URI`: The host of this server + `/callback`, configured as allowed in application on the target
3. `GOOGLE_CLIENT_ID` A Google API Client configured as a *Web application* with the host of this server as a *Authorized JavaScript origin* ([instructions](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid))
4. `POPUP_SIZE`: Outer dimensions of the popup. Open your target URL using `window.open(url, "", "popup")` and then resize it to be as small as possible while still showing the button. You may not scroll the page, unless you can find an element with a predictable `id=` that you can put into the hash fragment (`#`) in order to scroll down to it. Use the following JavaScript to look for such elements and hover over them in the Console to find if they are close to your target button:
    ```js
    document.querySelectorAll(`[id]`).forEach(e => console.log(e))
    ```
    If you find a useful hash, add it to the `url = ` variable inside `def game():`. Resize the page so it still fits the button and run the following JavaScript in the Console to copy the correct value for this variable:

    ```js
    copy(JSON.stringify([window.outerWidth, window.outerHeight]))
    ```

5. `BUTTON_OFFSET` *or* `BUTTON_SELECTOR`: See [static/saved-target/](static/saved-target/README.md) for configuring `BUTTON_SELECTOR`, otherwise, `BUTTON_OFFSET` means the coordinates from the top-left of the screen to the top-left of the button and its size in x and y pixels. Open a your target URL using `` window.open(url, "", `width=${POPUP_SIZE[0]},height=${POPUP_SIZE[1]}`) ``, then use Inspect Element to select your target button. Finally, run the following JavaScript in the Console to copy the correct value for this variable (`BUTTON_OFFSET`):

    ```js
    copy((r=$0.getBoundingClientRect(),JSON.stringify({pos: [Math.floor(r.x), Math.floor(r.y)], size: [Math.floor(r.width), Math.floor(r.height)]})))
    ```

6. `USE_HISTORY_BACK`: Use [`history.back()`](https://developer.mozilla.org/en-US/docs/Web/API/History/back) or just open the URL again via [`.location`](https://developer.mozilla.org/en-US/docs/Web/API/Window/location). Check to see if your target page works after opening it, changing its location, and then pressing the browser's *Back* button (`←`). Set the value to `True` if this worked, or `False` if it didn't.

After changing all these variables, you still need to **implement the OAuth authorization code flow for your target**. This involves reading the documentation to craft an authorize URL, often containing a Client ID, Redirect URI, State and Scope. Put this URL in the `url = ` variable [`def game():`](main.py#L57).  
Then, implement the callback handler in [`def callback():`](main.py#L74) to exchance a code for an access token. Finally, do something with the access token in [`def index():`](main.py#L43) like retrieving user data, to prove that it works.

## Setup

```sh
pip install -r requirements.txt
python3 main.py
```

## Troubleshooting

If the *popunder* doesn't work even though you are logged in to Google, check the console for any of the following errors:

> FedCM was disabled in browser Site Settings.

**Solution**: Remove site from auto-denied in:
`chrome://settings/content/federatedIdentityApi`

> The given origin is not allowed for the given client ID

**Solution**: Add your current origin to your Google API Client, and make sure to add both with and without port for `localhost` ([source](https://stackoverflow.com/a/68469319/10508498))
