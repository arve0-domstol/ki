# Planer
Utforskningen fra forrige steg er et fint utgangspunkt for å lage en plan. En plan er et skriftlig selvstendig dokument som beskriver hva som skal lages, og som kan agenten kan jobbe med uten at du trenger å gi input. Her sparer en seg mye tid, for en har beskrevet et større stykke arbeid som agenten kan jobbe uavhengig med.

Hvis du ikke gjorde det i forrige steg, lagre oppsummeringen nå:

>  Lagre oppsummeringen til innlogging-testbrukere.md, slik at det kan benyttes som en implementasjonsplan.

## Oppgave: Vurder om det er nok informasjon
Skumles innlogging-testbrukere.md. Hvis du selv skulle implementert denne funksjonaliteten, ville du hatt nok informasjon til å lage den 100% uten å bruke andre kilder? Stemmer alle antakelser med slik du ønsker det?

Hvis du ikke holdt på lenge i grill-me-sesjonen, tipper jeg du ikke er 100% enig eller har nok informajon. Spesielt slike detaljer som hvor lenge en reservasjon skal vare, eller hvordan playwright skal gjennomføre innloggingen.

Dette er også årsaken til at vi bruker planer. Planer konkretiserer alle mulige detaljer som en normalt ikke tenker over. Agenten er laget for å komme seg i mål, hvordan den kommer seg dit, og derfor får en ofte dårlige resultater med "lag meg en side for testbrukere som hjelper å logge meg inn".

Hvis svaret ditt er "ja", da har du en plan 🙌 Hvis ikke, gjør oppgavene under.

## Playwright MCP-server og OpenCode CLI
Her skal vi bruke to verktøy for å utvide planen:

1. [Playwright MCP-server](https://playwright.dev/docs/getting-started-mcp)
2. [OpenCode CLI](https://opencode.ai)

_Playwright MCP-server_ gir oss muligheten til å styre en nettleser med naturlig språk, "gå til den siden", "trykk på det", osv. _OpenCode CLI_ er en AI-agent, tilsvarende Copilot.

Grunnen til at vi bruker OpenCode CLI er fordi organisasjonen har valgt å skru av MCP-støtte i VSCode for å unngå sikkerhetshendelser. Dette omgår vi ved å bruke OpenCode, og får samtidig erfaring med å bruke agenten fra kommandolinje. Det er ingen stor forskjell fra det vi har gjort til nå, det er fortsatt en chat, en gir instrukser og en kan legge til filer og nettsted som kontekst, den støtter AGENTS.md og skills, men grensesnittet er ulikt. Eksempelvis legger en til filer med `@filnavn` istedenfor å trykke på knappene i VSCode.

## Oppgave: Koble OpenCode på Github-abonnementet
Vi så tidligere at agenten kan hente nettsider selv og at den kan gjøre handlinger med innebygd nettleser. Dette er tilsvarende som å bruke innebygd nettleser, der vi skal bruke [Playwright](https://playwright.dev/) for å logge på og utbedre planen.

1. Åpne en terminal.
2. Installer opencode: `npm install --global @opencode/cli`
3. Start `opencode`
4. Skriv `/connect` og trykk enter
5. Søk etter _Github Copilot_
6. Velg _GitHub.com Public_
7. Følg anvisningen for å logge på Github
8. Skriv `/mcps`
7. Verifiser at den viser `playwright connected ✔️`

## Oppgave: Verifisere at Playwright fungerer
I OpenCode, skriv denne prompten:

> åpne localhost:3000 med playwrigh chromium

Verifiser at Chrome åpnet og gikk til innloggingssiden.

> Logg inn med testperson-hardhudet-avgrunn@domstoladministrasjonen.no med passord test.hardhudet78)=

Hvis OK, oppdater planen:

> @innlogging-testbrukere.md utvid planen med aktuelle ting en må trykke på for å teste innloggingen. Bruk selektorer som sannsynligvis ikke endrer seg, slik som tekst eller titler. Fjern eventuelle setninger om mocking av Entra.

Lagre endringene i innlogging-testbrukere.md:

```shell
git add **/innlogging-testbrukere.md
git commit -m "flere detaljer for testingen av implementasjonen"
git push
```

## Oppgave: Start implementasjon av planen
Nå skal vi la agenten implementere planen. Når vi implementerer en plan, starter vi alltid med en fersk sesjon. Dette er fordi planleggingen har lest mange filer som har fyllt konteksten, innhold som agenten ikke trenger å vite om nå.

1. I OpenCode, start en ny sesjon: `/clear`
2. Be agenten om å implementere planen.

> @innlogging-testbrukere.md implementer funksjonaliteten som er beskrevet

Neste steg er [08-veien-videre.md](08-veien-videre.md).
