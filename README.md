# Kunstig intelligens for utviklere i Domsolen
Jeg har gått gjennom standard løype for å bli kjent med ki-assistert utvikling;

1. Starter med chatting.
2. Tar i bruk agenter.
3. Bedre kontrollerer hva jeg ønsker.

Dette er et kurs som går gjennom hva jeg har lært, steg for steg, slik at andre kan komme raskere i gang.

## Hva trenger du for å gjennomføre kurset?
1. En Github-bruker.
2. Abonnement for Copilot hos Github.
3. [VSCode](https://code.visualstudio.com) installert på din PC.

> Kurset legger opp til å bruke Github 100%, så vi slipper bruke tid på oppsett, men du kan gjennomføre kurset lokalt på din egen PC med eget KI-abonnement også, på egen risiko.

## Kurset
[Start her!](kurs/01-start.md)

## Hvem er kurset for?
### Utvikler uten erfaring med KI-agenter
Få en rask innføring i hva som er mulig og hvordan du gjør det.

### Utvikler med erfaring med AI-agenter
Del erfaringer med andre, snakk med likesinnede, hjelp andre som er ny.

### Ikke-utvikler som lurer på hva det handler om
Følg anvisningene og opplev hvordan utvikling kan gjøres med vanlig norsk, uten detaljert kjennskap til programmeringsspråk.

## Innhold

### Del 1 – Oppsett og kom i gang
Sett opp verktøyene, klargjør kodebasen og kontroller at Copilot fungerer.
- Installer Git, Visual Studio Code og GitHub CLI
- Sjekk at du har GitHub Copilot Enterprise og opprett et eget Git-worktree
- Test chatten ved å lage et sammendrag av kurset og lagre resultatet i Git

### Del 2 – Chat som verktøy
Bruk chatten til spørsmål, små endringer og utforskning av kodebasen.
- Spør om ukjent teknologi og kodebasen med naturlig norsk
- Gjør små, kontekstavhengige endringer i kode
- Utforsk teknologien i eksempelapplikasjonen _lovisa-web_

### Del 3 – Kontekst
Dårlige svar skyldes ofte manglende kontekst – her lærer du å styre modellen.
- Legg til filer som kontekst for mer presise svar
- Marker enkeltlinjer for å holde modellen fokusert
- Hent oppdatert informasjon fra internett og se kostnaden ved en chat-sesjon

### Del 4 – Agenter
Agenter kan gjøre mer enn å svare – de kan endre koden din.
- La agenten implementere en tilfeldig testperson-knapp og verifisere resultatet
- Gi agenten en full arbeidsliste med TDD, dokumentasjon, sikkerhetsvurdering og commit-melding
- Bruk `AGENTS.md` for å gjenbruke standardinstruksene

### Del 5 – Feilsøking
KI er svært god på feilmeldinger og stack traces.
- Analyser en produksjonsfeil ved hjelp av stack trace og Git SHA
- Gi agenten tilgang til logger gjennom den integrerte nettleseren

### Del 6 – Utforskning og skills
Bruk KI som sparringspartner og utvid agenten med gjenbrukbare skills.
- Utforsk en innloggingshjelp for testbrukere med agenten
- Installer og bruk _grill-me_-skill for strukturert problemutforskning
- Lag en implementasjonsplan som kan brukes i neste del

### Del 7 – Planer
En god plan lar agenten jobbe selvstendig over lengre tid.
- Vurder og utvid implementasjonsplanen til den kan gjennomføres selvstendig
- Bruk Playwright MCP-server og OpenCode CLI for å undersøke innloggingsflyten
- La Copilot implementere planen med subagenter og ende-til-ende-tester

### Del 8 – Veien videre
Lær videre om selvstendig agentarbeid, verifikasjon og gode arbeidsmåter.
- Forbedre agentens resultater når den jobber uten oppfølging
- Håndter feil, fullt kontekstvindu og flere agenter med Git-worktrees
- Vurder tester, modellvalg, kostnad, lokal kjøring og kodekvalitet
