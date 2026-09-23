# Scoreboard – Plan

## Problem
Kurset trenger en scoreboard som vises på storskjerm under kursøkten. Den skal vise deltagerenes fremdrift i sanntid og spille en gamification-lyd når noen fullfører et steg.

## Arkitektur

```
scoreboard/
  server.js       – Node.js HTTP-server (kun innebygde moduler)
  public/
    index.html    – Scoreboard-side (HTML/CSS/JS)
    sounds.js     – Web Audio API lyd-generator (ingen ekstern lib)
  worktrees/      – git worktrees per deltaker (gitignored)
    {login}/      – utsjekket fork, oppdateres hvert 10. sekund
```

### server.js
- Innebygd `node:http` – ingen Express eller andre biblioteker
- Innebygd `node:child_process` (`execFileSync`) – kjører git-kommandoer uten shell
- Serverer `public/index.html` og statiske filer
- Server-Sent Events (SSE) endpoint `GET /events` pusher tilstandsoppdateringer til nettleseren
- `GET /state` returnerer nåværende tilstand som JSON (for initial load)
- Én enkelt loop hvert **10. sekund**: hent deltakerbrancher → sync worktrees → sjekk tilstand → send SSE ved endring
- Når en deltaker fullfører nytt steg: sender SSE-event `progress` med deltaker og steg
- Det skal være mulig å eksludere brukernavn, i toppen av server.js kan listen med eksluderte brukernavn defineres.

### public/index.html
- Henter initial tilstand fra `/state`, deretter lytter på `/events` (SSE)
- CSS Grid som justerer kolonner/fontstørrelse basert på antall deltakere
- Hvert deltakerkort viser: brukernavn, avatar og fremdrifts-badges per modul
- Spiller lyd via `sounds.js` ved mottatt `progress`-event

### public/sounds.js
- Bruker **Web Audio API** (`AudioContext`, `OscillatorNode`, `GainNode`) – **ingen ekstern lib**
- Genererer en chiptune "power-up"-sekvens: en rekke stigende toner (f.eks. C4→E4→G4→C5) med kort varighet og fallende volum (decay)
- Eksponert som `playPowerUp()` funksjon

## Deltakere – oppdagelse
Hent brancher fra `domstolene/lovisa_core` med GitHub API hvert 10. sekund.
Brancher med navn `ki-{githubLogin}` oppdages som deltakere og gir `{login, branchName, avatarUrl}`.
Nye brukere legges til tilstanden og får opprettet worktree; eksisterende berøres ikke (tilstand bevares).

## Worktree-infrastruktur

For hver deltakerbranch opprettes et lokalt git worktree. All tilstandssjekk gjøres mot det lokale filsystemet – ingen GitHub API per modul.

Alle git-kommandoer kjøres med `{ cwd: repoRoot }` der `repoRoot = path.resolve(__dirname, '..')` (repo-roten, ikke `scoreboard/`).

Alle deltakerbrancher er basert på `ki` i `domstolene/lovisa_core`.

### initWorktree(login)
Kjøres for nye deltakere, og ved server-restart for deltakere der worktree-katalogen allerede eksisterer:
1. Bruk én remote `scoreboard_lovisa_core` for `https://github.com/domstolene/lovisa_core.git`.
2. Hent `ki` og `ki-{login}` til remote-tracking refs.
3. Opprett `scoreboard/worktrees/{login}` detached fra `scoreboard_lovisa_core/ki-{login}`, eller synkroniser eksisterende worktree.

### syncWorktree(login)
Kjøres hvert 10. sekund for eksisterende deltakere:
1. `git fetch scoreboard_lovisa_core --depth=50` for `ki` og `ki-{login}`.
2. `git -C scoreboard/worktrees/{login} reset --hard scoreboard_lovisa_core/ki-{login}`.

Feil (slettet branch, manglende tilgang, nettverk): fanges med try/catch, advarsel logges, deltaker hoppes over den runden – loopen fortsetter uavhengig.

## Fremdriftsdeteksjon per modul

Deteksjon er basert på signaler som allerede finnes i kursmaterialet – ingen ekstra script kreves av deltakere. All matching er **case-insensitive** (toLowerCase på begge sider). All sjekk skjer mot lokalt filsystem i `scoreboard/worktrees/{login}/`.

### Deteksjonsmetoder (prioritert rekkefølge)

1. **Fileksistens** – `fs.existsSync(path.join('scoreboard/worktrees', login, relPath))` → `true` = fullført. Rask og stabil.
2. **Commit-melding fuzzy-match** – sjekk de siste 20 commitene på `ki-{login}`, avgrenset til commits etter `scoreboard_lovisa_core/ki`, for å utelate kursrepoets startinnhold.
---

### Modul 01 – Start: Sjekk at det virker

**Kursoppgave:** `git add sammendrag.md && git commit -m "det virker!" && git push`

| Prioritet | Metode | Signal |
|-----------|--------|--------|
| 1 | Fileksistens | `sammendrag.md` finnes i rot |
| 2 | Commit fuzzy | Siste 20 commits i rot, melding inneholder `"virker"` |

---

### Modul 02 – Chat: Lagre resultatet

**Kursoppgave:**
```shell
git add **/lovisa-web.md
git commit -m "utforske en kodebase og dens teknologier"
git push
```

| Prioritet | Metode | Signal |
|-----------|--------|--------|
| 1 | Fileksistens | `lovisa-web.md` finnes, vanligvis under `products/lovisa-web/` |
| 2 | Commit fuzzy | Commit for `lovisa-web.md` inneholder `"utforske"`, `"kodebase"` eller `"teknologi"` |

---

### Modul 03 – Kontekst: Lagre resultater

**Kursoppgave:**
```shell
git add **/drizzle.md
git commit -m "legge til kontekst"
git push
```

| Prioritet | Metode | Signal |
|-----------|--------|--------|
| 1 | Fileksistens | `drizzle.md` finnes, vanligvis under `products/lovisa-web/` |
| 2 | Commit fuzzy | Commit for `drizzle.md`, melding inneholder `"kontekst"` eller `"drizzle"` |

---

### Modul 04 – Agenter: tilfeldig testperson

**Kursoppgave:** Implementer en knapp i `products/testpersoner/testpersoner.html` som velger en tilfeldig person. Deretter legges utviklingsinstrukser i `products/testpersoner/AGENTS.md`, og endringen committes og pushes.

| Prioritet | Metode | Signal |
|-----------|--------|--------|
| 1 | Fileksistens | `products/testpersoner/AGENTS.md` finnes |
| 2 | Commit fuzzy | Commit under `products/testpersoner/` inneholder `"tilfeldig"` eller `"random"` |

---

### Modul 05 – Feilsøking: analyser produksjonslogger

**Kursoppgave:** Hent og analyser stack traces fra produksjon, lagre dem som `feil-$error.type-$timestamp.txt`, og push resultatet. Ingen kodefeil skal rettes i dette steget.

| Prioritet | Metode | Signal |
|-----------|--------|--------|
| 1 | Fileksistens | En rotfil matcher `feil-*.txt` |
| 2 | Commit fuzzy | Commit-melding inneholder `"analyserer rene logger"`, `"stack traces"` eller `"logganalyse"` |

### Modul 06 – Utforskning: grill-me og innloggingsplan

**Kursoppgave:** Installer `grill-me`, utforsk innloggingshjelp for nye Lovisa, og lagre planen `innlogging-testbrukere.md`.

```shell
git commit -m "la til grill-me skill"
git push
```
| Prioritet | Metode | Signal |
|-----------|--------|--------|
| 1 | Fileksistens | `.agents/skills/grill-me/SKILL.md` finnes |
| 2 | Commit fuzzy | Commits, melding inneholder `"grill"` eller `"skill"` |
| 3 | Fileksistens | `innlogging-testbrukere.md` finnes i rot eller `products/lovisa-web/` |

### Modul 07 – Planer: Playwright-detaljer i planen

**Kursoppgave:**
```shell
git add **/innlogging-testbrukere.md
git commit -m "flere detaljer for testingen av implementasjonen"
git push
```

Planen fra modul 06 utvides med konkrete Playwright-interaksjoner for å teste Entra-innloggingen.

| Prioritet | Metode | Signal |
|-----------|--------|--------|
| 1 | Commit fuzzy | Commit-melding inneholder `"detaljer for testingen"` eller `"testingen av implementasjonen"` |

---

### Modul 08 – Veien videre

Modul 08 er referansemateriell uten konkrete commit-oppgaver. Ingen automatisk deteksjon – markeres som fullført manuelt av kursholder eller settes alltid som «bonus/ekstra».

## Hovedloop

```
while true:
  participants = hentBrancher("domstolene/lovisa_core", "ki-*")
  for participant of participants:
    if ny: initWorktree(participant.login)
    else:  syncWorktree(participant.login)
  for login of state.participants:
    tidligere = [...completedModules]
    sjekkModuler(login)                      // lokalt filsystem
    if completedModules endret:
      send SSE-event "progress"
  vent 10 sekunder
```

## Tilstandsmodell (in-memory i server.js)

```js
{
  participants: {
    "githublogin": {
      login: "githublogin",
      avatarUrl: "https://...",
      branchName: "ki-githublogin",
      completedModules: [1, 2, 3],   // array av fullførte modulnummer
      lastChecked: "2026-05-19T...", // ISO timestamp
    }
  }
}
```

Tilstanden beholdes i minnet – ingen database. Restartes serveren, bygges tilstanden opp på nytt (tar maks 10 sekunder).

## HTML-layout

- Bakgrunn: mørk (gaming-estetikk)
- CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(Xrem, 1fr))` – tilpasser seg automatisk
- Fontstørrelse skaleres: `font-size: clamp(0.8rem, 2vw, 1.4rem)`
- Deltakerkort: avatar, brukernavn, progress-badges (emoji per modul: ✅ fullført, ⬜ ikke gjort)
- Liten animasjon (pulse/glow) på nylig fullført badge
- SSE reconnect-logikk i nettleseren

## Lyd

Implementeres med **Web Audio API** direkte i nettleseren, ingen server-kall, ingen ekstern lib:

```
playPowerUp():
  For note in [C4, E4, G4, C5]:
    OscillatorNode type=square, frequency=note
    GainNode envelope: attack 5ms, sustain, decay 150ms
    start ved t + offset (50ms mellom toner)
```

Alternativt kan du generere lydfila selv med [BeepBox](https://www.beepbox.co/) – nettleserbasert chiptune-editor, eksporter som .wav og legg i `public/`.

## Todos

1. Legg til `scoreboard/worktrees/` i `.gitignore`
2. Lag `scoreboard/server.js` med HTTP-server, SSE, worktree-infrastruktur og hovedloop
3. Lag `scoreboard/public/index.html` med grid-layout og SSE-klient
4. Lag `scoreboard/public/sounds.js` med Web Audio API power-up lyd
5. Test at ny deltaker dukker opp automatisk og at worktree opprettes
6. Test at fullføring av modul trigger lyd og oppdaterer board
7. (Valgfritt) Legg til `scoreboard/README.md` med kjøre-instrukser

## Kjøring

```shell
cd scoreboard
node server.js
# Åpne http://localhost:3000 i nettleseren
```
