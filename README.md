# Aven Roleplay — APV-website

Statische regelsite (MkDocs Material, Nederlands, donker Aven-thema). De volledige APV staat op één pagina (`docs/index.md`), net als bij een wetboek: de regels zijn direct zichtbaar, de zijbalk toont alle hoofdstukken en artikelen, en de zoekbalk zoekt per artikel.

## Regels aanpassen
- Alles staat in `docs/index.md`. Elk hoofdstuk is een `## N. Titel { #hoofdstuk-N }`; elk artikel een `<div class="regel" markdown>` met `### Artikel X.Y { #artikel-X-Y }` en de regeltekst eronder.
- Het anker (`#artikel-1-9`) is de directe link naar een artikel. Houd het gelijk aan het artikelnummer. Klik op de **#** naast een artikel om de link te kopiëren.
- Logo en favicon staan in `docs/assets/`.

## Lokaal bekijken
```powershell
.venv\Scripts\mkdocs serve
```
Open daarna http://127.0.0.1:8000. De site ververst automatisch.

## Bouwen
```powershell
.venv\Scripts\mkdocs build --strict
```
De statische site komt in `site/` (hosting is nog niet bepaald). Nieuwe venv: `python -m venv .venv` en `.venv\Scripts\pip install mkdocs-material`.
