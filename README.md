# BrunchPass — Landing Page

A static "coming soon" landing for brunchpass.com. Three files, no build step.

```
index.html   — markup
styles.css   — visual design
script.js    — modal + Web3Forms submit
```

---

## 1. Get a Web3Forms access key

The Notify Me form won't work until you paste in your own key.

1. Go to **https://web3forms.com/**
2. Enter the email where you want signup notifications delivered (probably `info@brunchpass.com`).
3. They'll email you a free access key — a UUID-looking string.
4. Open `index.html` and find this line:

   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```

   Replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key from the email.

That's it. Every form submission will email you the email, city/zip, and brunch frequency the visitor entered.

**Why this works for a static site:** Web3Forms relays the submission from the browser → their server → your email. No backend code, no Cloudflare Workers, nothing to maintain.

---

## 2. Preview locally

Open `index.html` directly in a browser, or run a tiny static server so paths behave like production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## 3. Deploy to Cloudflare Pages

Two options — pick whichever feels easier.

### Option A: Drag & drop (zero setup)

1. Log in to https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
2. Name the project `brunchpass`.
3. Drag this whole folder into the upload box.
4. Hit **Deploy**. You'll get a `brunchpass.pages.dev` URL in ~30 seconds.

For future updates, click **Create new deployment** and drag the folder again.

### Option B: Wrangler CLI (better for repeat deploys)

```bash
# one-time
npm install -g wrangler
wrangler login

# every deploy
wrangler pages deploy . --project-name=brunchpass
```

---

## 4. Point brunchpass.com at Cloudflare Pages

Your domain is registered with **Squarespace** but you can keep it there and just change DNS — no need to transfer.

### 4a. Add the custom domain in Cloudflare

1. In your Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `brunchpass.com`. Cloudflare will show you the DNS records you need to add.
3. Add `www.brunchpass.com` too while you're there.

Cloudflare will tell you to add either:
- A `CNAME` pointing to `<your-project>.pages.dev`, **or**
- An `A`/`AAAA` record set if your DNS host can't `CNAME` an apex domain.

### 4b. Add those DNS records in Squarespace

1. Squarespace → **Settings** → **Domains** → click `brunchpass.com` → **DNS Settings**.
2. **Important — keep your Google Workspace MX records intact.** Don't touch any record where Type is `MX`. Those route your `@brunchpass.com` email through Google.
3. Add the records Cloudflare gave you:
   - For the apex (`brunchpass.com`): usually an `A` record (Squarespace doesn't allow CNAMEs at the apex). Cloudflare provides specific IPs for this.
   - For `www`: a `CNAME` pointing to `<your-project>.pages.dev`.
4. Save. DNS propagation usually takes 5–30 minutes.

### 4c. Verify

- `dig brunchpass.com` should return the Cloudflare IPs.
- `dig MX brunchpass.com` should still return Google's mail servers (`aspmx.l.google.com`, etc.) — confirming email is untouched.
- Visit `https://brunchpass.com` and confirm the page loads with a valid certificate (Cloudflare provisions SSL automatically).

---

## 5. Things to know

- **Email forwarding:** `info@brunchpass.com` is a `mailto:` link, so the user's email client handles it. Make sure that address actually exists in Google Workspace.
- **Instagram:** the link goes to `https://www.instagram.com/brunchpass/` — update if the handle changes.
- **Honeypot:** there's a hidden `botcheck` field — Web3Forms uses it to silently drop bot submissions. Don't remove it.
- **Custom branding:** edit `--mimosa`, `--berry`, etc. in `styles.css` to retheme the palette in one place.
