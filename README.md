# Klaro

Klaro (Filipino for “clear”) is a booking + tech-rider **conforme** for freelance talent in Philippine production — shoots, engagements, workshops, and trainings.

It professionalizes the conversation. Asking for a holding room, a restroom nearby, water, food, an assistant, or a capped work day reads as a standard rider, not a personal ask and not a medical form.

There is no “I am neurodivergent” gate. The rider is simply how bookings work here.

## How it works

Klaro is two-sided.

1. **Talent** fills *their* terms only: name, role, ₱ fee, payment, overtime, day cap / hard stop, and rider requirements. They do **not** fill the client’s address, call time, or venue. When done, they copy a link and send it to production.
2. **Production** opens that link, sees the fee and rider as **questions**, and completes the booking: client name, job title, type, city, venue, dates, call, wrap, hours, plus Yes / We’ll arrange / No on each rider item.
3. The **conforme** (I agree to these terms) is a one-page A4 working agreement: talent terms + job details + rider answers, with signature lines for both parties. Print, download PDF, or share the link.

v1 is client-side. Terms and the finished conforme are encoded in the URL so a link works without a backend. Talent terms also save in this browser (`localStorage`) so you can continue later. Account login can sit on top of the same data later.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default [http://localhost:5173](http://localhost:5173)).

```bash
npm test      # unit tests for money, dates, encoding, rider copy
npm run build # production build
npm run preview
```

## Type

The UI is **Aileron** (Sora Sagano, CC0), self-hosted as woff2 under `public/fonts/` (light 300, regular 400, bold 700). `@font-face` lives in `src/styles/fonts.css`. Bold is for headlines, key labels, talent name, and the conforme title; regular/light for body.

## Routes

| Path | Who |
| --- | --- |
| `/` | Home |
| `/terms` | Talent creates terms. `?from=sample` or `?from=blank` |
| `/c?t=…` | Client completes the booking from a talent link. `?sample=1` loads the sample talent |
| `/conforme?b=…` | One-pager conforme. `?sample=1` is a finished Makati shoot |

## Sample

The sample talent is **Jordan Cruz**, on-camera, with a ₱18,000 fee and a production-world rider. The sample client is **Tala Production House for SM Lifestyle** filling a Makati stills shoot and answering every rider question.

Use **Start from sample**, **Try the sample as a client**, or **View sample conforme** from the home page.

## Donate

Klaro is free. There is no paywall.

Talent can open **Donate** from the home page or after copying a client link. That shows a QR meant for GCash or Maya. Production never sees it — the QR is not on the client form and not on the printed/PDF conforme.

Replace the placeholder image at `public/donate-qr.png` with the real GCash or Maya QR. Keep the filename the same.
