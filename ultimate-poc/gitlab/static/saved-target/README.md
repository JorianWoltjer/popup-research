# Saved Target

This directory is for creating a *dynamic* button position, for if you don't want to hardcode coordinates that may change depending on how the browser renders your target page.

> [!NOTE]  
> While most sites can be copied with a single keyboard shortcut, some will break, requiring a bit of manual effort to fix whatever issue is causing it to render wrong.

You should visit the authorization page of your target in a popup as close as possible to how it's gonna look when opened, then hit <kbd>Ctrl+S</kbd>. Your browser should now prompt for a location of where to download the files, select this folder or move it here afterward. This action should have written `*.html` and `*_files` right inside of this `saved-target/` directory.

You can now configure the `BUTTON_SELECTOR` variable in [main.py](../../main.py) to match the button you want to target (using [CSS selector syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)).
