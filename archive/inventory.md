# Inventur katharinaniesche.de (Wix-Bestand)

Erfasst am 29.10.2026 aus der Live-Seite. Grundlage für Redesign und Neubau in Astro.

Voraussetzungen für den Umstieg auf Wix Headless (eigene Domain, Inhaber:in der Seite, keine Sonderkomponenten) und Tarif: am 29.10.2026 im Wix-Dashboard geprüft und erfüllt.

## Aufbau des Archivs

```
archive/
  inventory.md            diese Datei
  home-replica/           pixelgenauer Nachbau der Startseite (Referenz für Maße, Farben, Animationen)
  pages/<slug>/
    content.md            alle Texte in Lesereihenfolge (Abschnitte, Überschriften, Buttons mit Linkziel, Bilder, FAQ-Antworten)
    content-mobile.md     nur falls die Wix-Mobilversion andere Inhalte zeigt
    meta.json             Title, Description, OG, Links, Bilder (mit Original-URL), Videos, Formulare, Wix-Apps, JSON-LD
    desktop.jpg           Ganzseiten-Screenshot 1440 px
    mobile.jpg            Ganzseiten-Screenshot der Wix-Mobilversion (375 px)
    images/               Originalbilder aus der Wix-Medienbibliothek (nur übernommene Seiten, nicht in Git)
  pages/_summary.json     Übersicht aller erfassten Seiten
```

Neu erfassen: `cd tools/capture && npm install && npm run capture` (einzelne Seiten: `npm run capture -- /guide`; in Git Bash davor `MSYS_NO_PATHCONV=1` setzen). Die Bilder sind nicht in Git, weil die Originale groß sind (~110 MB). Sie bleiben in der Wix-Medienbibliothek, und das Script lädt sie jederzeit neu.

## Seiten und Entscheidungen

### Übernehmen

| Pfad | Inhalt | Wix-Funktion | Neubau in |
|---|---|---|---|
| `/` | Startseite | – (Podcast-Laufband, Video im Mentoring-Teaser) | Phase 2 |
| `/1-1-business-aufbau` | Verkaufsseite 1:1-Mentoring | – (CTAs → Buchung) | Phase 3 |
| `/ueber-mich` | Story (Bank, Unfall, Pause, Neustart, Werte, Ziele) | – | Phase 3 |
| `/veranstaltungen` | WE ARE WORTHY Retreat + Bildergalerie | – (Buchung per Google-Drive-PDF) | Phase 3 |
| `/linktree` | Link-Seite für Instagram-Bio | – | Phase 3 |
| `/impressum` | Rechtstext | – | Phase 3 |
| `/datenschutz` | Rechtstext (~55 KB) | – | Phase 3 (Inhalt muss für das neue Frontend aktualisiert werden, s. u.) |
| `/guide` | Guide-Anmeldung | **Wix Forms** | Phase 4 |
| `/book-online` | Serviceliste (nur Infocall) | **Wix Bookings** | Phase 4 |
| `/service-page/kostenloser-strategie-infocall-1` | Servicedetails Infocall (45 Min., Zoom) | **Wix Bookings** | Phase 4 |
| `/booking-calendar/kostenloser-strategie-infocall` | Kalender / Terminwahl (Ziel aller Infocall-Buttons) | **Wix Bookings** | Phase 4 |

Ob die drei Buchungs-URLs im Neubau einzeln bleiben oder zu einer Buchungsseite zusammengefasst werden (mit Weiterleitungen), entscheiden wir in Phase 4.

### Streichen und weiterleiten – bestätigt am 29.10.2026

Alle Inhalte unten sind erkennbar Wix-Vorlagentexte: Sie-Form, generische Coaching-Themen, erfundene Orte, vergangene Termine. Sie werden nicht neu gebaut. Beim Launch (Phase 5) bekommen alle Pfade die angegebene Weiterleitung.

| Pfad | Inhalt | Wix-App | Weiterleitung |
|---|---|---|---|
| `/event-list` | Event-Liste (zeigt nur das Retreat) | Events | → `/veranstaltungen` *(bereits entschieden)* |
| `/event-details/we-are-worthy-retreat` | Wix-Event des Retreats | Events | → `/veranstaltungen` *(bereits entschieden)* |
| `/event-details/einblicke-in-effektives-selbstmanagement` | Beispiel-Event („Coaching Center München“, 18. Aug.) | Events | → `/veranstaltungen` |
| `/event-details/zukunft-des-coachings-strategien-fur-2025` | Beispiel-Event | Events | → `/veranstaltungen` |
| `/event-details/netzwerkabend-fur-coaching-professionals` | Beispiel-Event („Stuttgart Art Lounge“) | Events | → `/veranstaltungen` |
| `/blog` | Blog mit 3 Beispielposts | Blog | → `/` |
| `/post/erreiche-deine-ziele-mit-coaching-methoden` | Beispielpost | Blog | → `/` |
| `/post/wie-coaching-dein-leben-verändern-kann` | Beispielpost | Blog | → `/` |
| `/post/coaching-für-persönliche-entwicklung-und-erfolg` | Beispielpost | Blog | → `/` |
| `/profile/katharinaniesche12371/profile` | Autorenprofil (vom Blog) | Members | → `/ueber-mich` |
| `/challenges` | 3 kostenlose Beispielprogramme | Online Programs | → `/` |
| `/challenge-page/…` (3 Seiten) | Programmdetails („Beruflicher Aufstieg durch gezieltes Mindset-Training“ u. a.) | Online Programs | → `/` |
| `/donate`, `/donation-thank-you-page` | „Jede Spende zählt“ | Donations | → `/` |
| `/pricing-plans/plans-pricing` | leer („Keine Preispläne verfügbar“) | Pricing Plans | → `/` |

Unabhängig vom Neubau kannst du diese Apps im Wix-Dashboard deinstallieren bzw. die Beispielinhalte löschen. Dann tauchen sie auch nicht mehr in der Sitemap bei Google auf.

## Globale Elemente

- **Kopfzeile:** Logo-Schriftzug „Katharina Niesche“ + Navigation: Startseite · 1:1 Business is Calling · Guide · Über mich · Veranstaltungen (aktive Seite gelb). Der Linktree hat weder Kopf- noch Fußzeile.
- **Fußzeile (3 Spalten):** Katharina Niesche (Über mich, Business is Calling, Kostenfreier Guide, Veranstaltungen, Mein Podcast) · Social Media (Instagram, Spotify, YouTube) · Rechtliches (Datenschutzerklärung, Impressum, © 2026).
- **Social- und Podcast-Links (aus dem Linktree, vollständigste Quelle):**
  - Instagram: https://www.instagram.com/katharinaniesche
  - TikTok: https://www.tiktok.com/@katharinaniesche
  - Spotify: https://open.spotify.com/show/3E35kanFLtbwVKBiv0YYSd
  - YouTube (Podcasts): https://www.youtube.com/@KatharinaNiesche/podcasts
  - Apple Podcasts: https://podcasts.apple.com/de/podcast/love-yourself-speak-yourself/id1783864488
- **Cookie-Banner:** Usercentrics.

## Wix-Funktionen, die im Neubau angebunden werden

1. **Guide-Formular (Wix Forms):** Vorname* · E-Mail-Adresse* · Checkbox* „Ja, schick mir den Guide und ab und zu Impulse, Podcastfolgen und Termine per Mail. Abmelden geht jederzeit. Mehr dazu in meiner Datenschutzerklärung.“ · Button „Guide per Mail erhalten“. Danach versendet eine Wix-Automation den Guide (in Phase 4 prüfen).
2. **Strategie-Infocall (Wix Bookings):** Service „Kostenloser Strategie-Infocall“, 45 Min., Zoom. Ablauf heute: Servicedetails → Kalender (Datum/Uhrzeit, MEZ) → Buchung. Hinweis aus der Beschreibung: „Kein Termin passt? Schreib mir eine DM auf Instagram …“.

Extern ohne Wix: Retreat-Buchung über Google-Drive-PDF (bleibt so).

## Bausteine über alle Seiten (Grundlage fürs Designsystem)

| Baustein | Vorkommen |
|---|---|
| Kopfzeile mit aktiver Seite, Fußzeile 3-spaltig | alle (außer Linktree: eigenes Layout ohne beides) |
| Buttons: gelb (primär), dunkel mit Lavendel-Rand, Lavendel, dunkel/weiß | alle |
| Plattform-Pills (Spotify/YouTube/Apple) | Startseite |
| Eyebrow (kleine Versalien mit Sperrung) | Startseite, 1:1, Über mich |
| Überschrift mit gelb-kursivem Highlight-Wort | alle Inhaltsseiten |
| Hero: Text + Foto (teils mit Klebestreifen) | Startseite, 1:1, Über mich, Guide |
| Foto mit Klebestreifen-Ecken / Polaroid mit Bildunterschrift | Startseite, Über mich (Hero, „Größenwahnsinnige Ziele“) |
| Gerissene Papierkante (Abschnittsübergang) | Startseite, 1:1, Über mich |
| Wellen-Übergang (mehrlagig) | Über mich („War das jetzt mein Leben?“) |
| Laufband / Ticker (Textband gelb, Bild-Karussell) | 1:1 („✦ DEINE WERTE ✦ …“), Über mich („MUT STATT PERFEKTION ✦ …“), Startseite (Podcast) |
| Notizzettel mit Klebestreifen | Startseite (Problem-Abschnitt) |
| Nummerierte Problem-Karten mit runden Fotos (01/02/03) | 1:1 |
| Villa-Grafik (Haus mit Stockwerken) | 1:1 |
| Vertikaler Zeitstrahl mit gelben Nummern-Kreisen | 1:1 („Der Ablauf“) |
| Karte mit Checkliste über Hintergrundbild | 1:1 („Was du konkret bekommst“), Startseite (Veranstaltungen) |
| Angebotskarten (hell/dunkel) mit Liste + Button | Startseite |
| Einzelnes Kundenzitat | Startseite |
| Testimonial-Wand: Chat-Screenshots + Zitatkarten | 1:1 („Was meine Kundinnen sagen“) |
| FAQ-Akkordeon | 1:1 (7 Fragen inkl. Antworten in `content.md`) |
| CTA-Band (große zentrierte Zeile + Button) | 1:1 (2×), Über mich |
| Story-Abschnitte Bild/Text im Wechsel mit Farbwechsel | Über mich (Bank, Unfall, Pause, Neustart, Warum) |
| Erfolgs-Chips („✓ Umzug in meine Traumstadt“ …) | Über mich |
| Statement-Liste (zentrierte Zeilen mit Highlights) | Über mich („Du hast nur dieses eine Leben …“) |
| Event-Teaser (Flyer-Bild + Info-Panel + Button) | Veranstaltungen |
| Bildergalerie / Mosaik | Veranstaltungen („Der Retreat Pinterest Vibe“) |
| Formular (Text, E-Mail, Checkbox, Absenden) in umrandeter Karte | Guide |
| Mockup-Bild (Laptop/Tablet) | Guide |
| Link-Seite: Avatar, Social-Icons, gestapelte Link-Buttons | Linktree |
| Kalender / Terminwahl, Servicedetails | Buchung (Phase 4) |
| Langtext-Typografie (Rechtstexte) | Impressum, Datenschutz |
| Video (Hintergrund/Teaser) | Startseite, Guide |

## Auffälligkeiten (für Redesign und Neubau)

- **Links:** „Mein Podcast“ im Footer führt nur zur Startseite. Die YouTube-Links sind uneinheitlich (Footer: Playlist, Linktree: Kanal/Podcasts). Den Apple-Podcasts-Link gibt es (s. o.), er fehlt nur im lokalen Nachbau.
- **SEO:** Keine Meta-Description bei Impressum, Datenschutz, Linktree, Buchungsseiten. Fast keine Seite hat ein eigenes Vorschaubild (OG-Image) für Social Media.
- **Datenschutzerklärung:** Sie erwähnt Wix, Usercentrics, Google Calendar, Zoom, Instagram, TikTok und YouTube. Vor dem Launch muss sie an das neue Frontend angepasst werden (Hosting, lokal eingebundene Schriften, Cookie-Banner). Den Inhalt musst du rechtlich verantworten.
- **Mobilversion:** Bei 6 übernommenen Seiten zeigt die Wix-Mobilversion andere Inhalte als Desktop (`content-mobile.md`). Im Neubau gibt es nur noch ein responsives Layout. Mobile-only-Texte beim Bau der jeweiligen Seite abgleichen.
- **Lesbarkeit:** Weiße Schrift auf Lavendel (Podcast-Pills) hat nur ~1,9:1 Kontrast.
- **Schreibweise:** Kalenderseite „Dein Strategie - Infocall“ vs. sonst „Strategie-Infocall“.
