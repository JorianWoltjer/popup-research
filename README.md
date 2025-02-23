# Popup Research

This repo includes the proof-of-concepts from my ["Pressing Buttons with Popups (on Twitch, LinkedIn and more)"](https://jorianwoltjer.com/blog/p/hacking/pressing-buttons-with-popups) post. The post explains the source code in this repository.

**Experiments**:
* [**Click Through**](experiments/click-through/): The [Sandwich Technique by Paulos Yibelo](https://www.paulosyibelo.com/2024/02/cross-window-forgery-web-attack-vector.html) with extra `.moveTo()` to allow the victim to click anywhere on the attacker's page
* [**Popunder**](experiments/popunder/): Using infinite interactions from holding a key down to open and hide a popup quickly. Also contains another proof of concept that assumes the user is typing quickly, and two consecutive key presses open and hide the popup.

**Real World PoCs**:
* [**Twitch**](real-world-pocs/twitch/): Simplest example with `autofocus` on button
* [**LinkedIn**](real-world-pocs/linkedin/): Most common example with `id=` attribute in hash to focus
* [**Redacted**](real-world-pocs/redacted/): OAuth 1.0 with an `origin` check bypassed using `origin = null`

---

All proof of concepts assume you enter their directory and host a simple HTTP server using:

```sh
python3 -m http.server
```

Then, the target domain will be at http://localhost:8000, and the attacker's domain at http://127.0.0.1:8000 (which are cross-origin). All attacks are tested on Chromium only.
