# Plan: katharinaniesche.de – vom Wix-Editor zu eigenem Astro-Frontend

## Stand

| Phase | Status |
|---|---|
| 0 – Grundlagen (Git, Archivordner, Kurzcheck Wix-Dashboard) | ✅ erledigt 29.10.2026 |
| 1 – Content-Archiv aller Seiten (`archive/`, Inventur in `archive/inventory.md`) | ✅ erledigt 29.10.2026 |
| 2 – Redesign Startseite + Designsystem (Astro) | offen |
| 3 – Inhaltsseiten | offen |
| 4 – Wix-Anbindung, Guide, Infocall-Buchung | offen |
| 5 – Launch | offen |

## Context

Die Website wurde im Wix-Editor gebaut. Ziel: Das komplette Frontend entsteht künftig als Code in diesem Projekt (Astro), Wix bleibt Hosting und Backend (Buchungen, Formulare, Kontakte, E-Mails, Events). Dabei wird das Design überarbeitet und als Designsystem festgehalten. Später soll im Wix-Editor nichts mehr manuell gestaltet werden.

Wix unterstützt genau diesen Fall offiziell („Wix-managed headless“, Astro + Wix CLI): neues Frontend als Vorschau bauen, Live-Seite bleibt unverändert, dann Umschalten – die Domain zieht auf das neue Frontend um.

### Bestandsaufnahme der Live-Seite (aus Sitemap + Seitenprüfung)

| Seite | Status | Wix-Funktion |
|---|---|---|
| `/` Startseite | aktiv, in Navigation | – (bereits lokal nachgebaut) |
| `/1-1-business-aufbau` | aktiv, lange Verkaufsseite (Laufband, Villa-Stockwerke, Ablauf, Testimonials) | Links → Bookings |
| `/guide` | aktiv | **Wix Forms** (Vorname, E-Mail, Newsletter-Einwilligung) → Guide per Mail (Automation) |
| `/ueber-mich` | aktiv | – |
| `/veranstaltungen` | aktiv (Retreat) | Buchungslink geht auf ein **Google-Drive-PDF** |
| `/impressum`, `/datenschutz` | aktiv | – |
| `/linktree` | aktiv (Instagram-Bio) | – |
| `/book-online`, `/service-page/…`, `/booking-calendar/…` | aktiv (Strategie-Infocall) | **Wix Bookings** |
| `/event-list`, `/event-details/…` | teils aktiv (Retreat), teils Beispiel-Events | **Wix Events** |
| `/blog` + 3 Posts, `/profile/…` | wirken wie Wix-Vorlagenreste (generische Texte) | Wix Blog, Members |
| `/challenges` + 3 Programme | wirken wie Vorlagenreste | Wix Online Programs |
| `/donate`, `/donation-thank-you-page` | wirken wie Vorlagenreste | Wix Donations |
| `/pricing-plans/…` | leer („Keine Preispläne verfügbar“) | Wix Pricing Plans |

## Kritisches Feedback zum vorgeschlagenen Plan

Grundrichtung stimmt (erst erfassen → Startseite überarbeiten → Designsystem → Seite für Seite in Astro). Fünf Punkte würde ich ändern:

1. **Erfassen ja, Nachbauen nein.** Die Startseite pixelgenau nachzubauen war aufwendig, und das Ergebnis (feste Positionen für 1440 px) wird für das Redesign ohnehin verworfen. Für die übrigen Seiten reicht ein **Content-Archiv**: Texte, Bilder, Screenshots (Desktop + Mobil), SEO-Daten, Linkziele, Funktionen. Das ist schneller und für das Redesign genauso nützlich – Inhalte werden übernommen, Layouts nicht.
2. **„Alles übernehmen wie es ist“ würde viel Arbeit in ungenutzte Seiten stecken.** Blog, Programme, Spenden, Preispläne und Beispiel-Events sehen nach Wix-Vorlagenresten aus. Im Headless-Betrieb muss für jede Wix-App die Oberfläche selbst gebaut werden (über die Wix-APIs). Vorschlag: pro Seite entscheiden – übernehmen oder streichen (mit Weiterleitung, damit keine Links ins Leere gehen).
3. **Das Risiko liegt bei den Funktionen, nicht beim Design.** Abgestimmt: Die Wix-Anbindung kommt erst nach den reinen Inhaltsseiten, aber **direkt vor** Guide und Infocall-Buchung – nicht ganz ans Ende. Deren Gestaltung hängt davon ab, was technisch geht (z. B. eigener Kalender vs. Weiterleitung auf die Wix-Buchungsseite). Voraussetzungen und Tarif prüft der/die Nutzer:in vorab kurz im Dashboard.
4. **Designsystem nicht nur aus der Startseite ableiten.** Die 1:1-Seite hat viele Bausteine, die auf der Startseite fehlen (Laufband, nummerierte Schritte, Zeitstrahl, Testimonial-Raster, Leistungsliste), der Guide braucht Formularfelder. Erst alle Bausteine aus dem Archiv sammeln, dann das System bauen – sonst wird es Seite für Seite nachträglich erweitert.
5. **Seite für Seite bauen, aber nur einmal live gehen.** Beim Umschalten zieht die ganze Domain auf das neue Frontend. Halbfertig live gehen geht nicht: Alle übernommenen Seiten (inkl. Impressum, Datenschutz, Buchung) müssen in der Vorschau fertig sein, dann wird einmal umgeschaltet.

### Entscheidungen (aus Rückfragen)
- **Erfassung:** Content-Archiv statt pixelgenauer Nachbauten.
- **Retreat:** Buchung bleibt über den Google-Drive-PDF-Link. Wix-Event-Seiten (`/event-list`, `/event-details/…`) werden gestrichen → Weiterleitung auf `/veranstaltungen`.
- **Vorlagenreste:** Blog (+ Profil), Programme, Spenden, Preispläne und Beispiel-Events werden gestrichen und weitergeleitet – am 29.10.2026 bestätigt (Details in `archive/inventory.md`).
- **Anbindung:** an die bestehende Wix-Seite (kein neues Projekt). Neues Frontend läuft als Vorschau, Umschalten erst am Ende.
- **Zeitpunkt der Anbindung:** nach den Inhaltsseiten, direkt vor Guide und Infocall-Buchung (Phase 4).
- Damit bleiben als echte Wix-Funktionen im neuen Frontend nur **Wix Forms** (Guide) und **Wix Bookings** (Strategie-Infocall).

Zu „später nichts mehr in Wix anpassen“: Für Design und Seitentexte stimmt das – die liegen dann im Code (Änderungen über dieses Projekt). Im **Wix-Dashboard** bleiben aber weiterhin Termine/Verfügbarkeiten des Infocalls, Events, Kontakte, Newsletter und Automations-Mails. Das ist gewollt: Das sind Geschäftsdaten, kein Frontend.

## Empfohlenes Vorgehen

### Phase 0 – Grundlagen
- Git-Repository im Projektordner anlegen, erster Commit mit dem aktuellen Stand.
- Bisherigen Nachbau nach `archive/home-replica/` verschieben (`index.html`, `styles.css`, `assets/`); `.claude/launch.json` auf diesen Ordner zeigen lassen.
- **Kurzcheck im Wix-Dashboard (Nutzer:in, ohne Code, ~5 Min.):** Voraussetzungen für den Umstieg erfüllt (eigene Domain ✓, Inhaber:in der Seite, keine Sonderkomponenten aus einem App-Projekt) und was der Tarif abdeckt/kostet. Ein Haken hier würde den ganzen Plan ändern – deshalb vor der Design-Arbeit.

### Phase 1 – Content-Archiv (alle Seiten)
Pro Seite unter `archive/pages/<slug>/`:
- `content.md` – alle Texte in Reihenfolge, mit Abschnittsmarken
- `meta.json` – Title, Description, OG-Bild, Linkziele, genutzte Wix-Funktion
- `desktop.png`, `mobile.png` – Ganzseiten-Screenshots
- Bilder in Originalauflösung (Wix-Medien-URLs ohne Skalierung)

Dazu `archive/inventory.md`: Seitenliste, Funktionen, Entscheidung (übernehmen / streichen + Weiterleitung), Liste aller Bausteine (Komponenten) über alle Seiten.
Werkzeug: Built-in-Browser (Text, Links, Screenshots) + `curl` für Sitemaps und Bilder – wie bei der Startseite.

### Phase 2 – Redesign Startseite + Designsystem (Astro)
- Astro-Projekt unter `web/` als normales Astro-Projekt anlegen (noch ohne Wix; lässt sich laut Wix-Doku später verknüpfen). Lokale Vorschau per Astro-Dev-Server.
- Startseite gemeinsam überarbeiten (Ansatzpunkte: Kontrast der Podcast-Pills ~1,9:1, gemischte Fließtext-Schriften, kleines Hero-Foto, fehlende/falsche Links).
- Daraus: `web/src/styles/tokens.css` (Farben, Typo-Skala, Abstände, Radien, Schatten, Animationen), Komponenten in `web/src/components/` (Button, Eyebrow, Section, Card, NoteCard, Testimonial, TornEdge, Marquee, FormField …), Layout `web/src/layouts/Base.astro` (Header, Footer, SEO, Consent).
- Lebendes Designsystem: `web/src/pages/styleguide.astro` zeigt alle Bausteine – Prüfstelle für jede spätere Seite.
- Wiederverwenden aus dem Nachbau: Farbwerte und Maße aus `styles.css`, Animationswerte (Float-in 1200 ms / 60 px, Grow-in, Reveal, Laufband 53 px/s) aus `index.html`.
- Nicht übernehmen: Medien aus der Wix-Bibliothek (Stockfoto im Mentoring-Teaser, Papierkanten-Form) – Lizenz nur für Wix-Seiten. Papierkante neu zeichnen, Teaserbild durch eigenes Foto ersetzen.
- Poppins lokal einbinden (DSGVO), nicht von Google laden.

### Phase 3 – Inhaltsseiten (ohne Wix-Funktionen)
Reihenfolge: 1:1 Business is Calling → Über mich → Veranstaltungen (Buchung per PDF-Link) → Linktree → Impressum/Datenschutz.
Seitentexte als Astro-Inhalte im Repo. Bisherige URLs bleiben gleich. CTAs „Strategie-Infocall buchen“ zeigen vorerst auf `/book-online` (Platzhalter bis Phase 4).

### Phase 4 – Wix-Anbindung, dann Guide und Infocall-Buchung
Sicherheit laut Wix: Die bestehende Seite bleibt live und unverändert, das neue Frontend läuft als separate Vorschau. Erst beim Umschalten wird die alte Seite unveröffentlicht (nicht gelöscht), „Switch back“ ist möglich. Achtung: Testanmeldungen/-buchungen aus der Vorschau landen in den echten Wix-Daten → mit eigener E-Mail testen, Testbuchungen danach stornieren.
- Astro-Projekt `web/` mit der bestehenden Wix-Seite verknüpfen (Login im Browser macht der/die Nutzer:in selbst); Vorschau-URL per `npx wix preview`.
- **Guide:** Formular anbinden → Prüfen: Kontakt erscheint in Wix, Guide-Mail kommt an, Newsletter-Einwilligung wird gespeichert. Erst danach Seite fertig gestalten.
- **Strategie-Infocall:** Weg festlegen (eigene Kalenderoberfläche über Bookings-API oder Wix-gehostete Buchungsseite), dann Buchungsseite im Designsystem bauen und Platzhalter-Links ersetzen.
- Cookie-Banner (Usercentrics) und Analytics im neuen Frontend einbinden.

### Phase 5 – Launch
- Gestrichene Seiten: Weiterleitungen laut `archive/inventory.md` (Event-Seiten → `/veranstaltungen`, Profil → `/ueber-mich`, Blog, Programme, Spenden, Preispläne → `/`).
- SEO: Titles/Descriptions aus dem Archiv übernehmen, Sitemap, OG-Bilder.
- Vollständige Abnahme in der Vorschau, dann Umschalten über Wix.

## Verifikation
- Phase 1: Jede URL aus den Wix-Sitemaps hat einen Archiv-Eintrag mit Entscheidung.
- Phase 0: Kurzcheck im Dashboard ohne Haken (oder Plan wird angepasst).
- Phase 4: Testanmeldung über das neue Guide-Formular erscheint in den Wix-Kontakten, Guide-Mail kommt an; Testbuchung des Infocalls erscheint im Wix-Kalender und wird danach storniert.
- Phase 2–4: Jede Seite im Browser auf 1440 px und 375 px geprüft, gegen Archiv-Screenshots abgeglichen; Kontrast ≥ 4,5:1; Formulare/Buchung in der Vorschau einmal komplett durchgespielt; Lighthouse für Performance/Accessibility/SEO.
- Phase 5: Alle alten URLs liefern 200 oder 301; Impressum/Datenschutz erreichbar; Cookie-Banner blockiert Tracking bis zur Zustimmung.
