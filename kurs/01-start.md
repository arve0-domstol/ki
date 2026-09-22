# Start

## Programvare
For å gjennomføre kurset, sørg for at du har:

1. Git: https://git-scm.com
2. Visual Studio Code: https://code.visualstudio.com
3. Github kommandolinjeverktøy `gh`: https://cli.github.com

## Test at Copilot-chaten fungerer
### Du har Copilot-lisens?
1. Gå til https://github.com/settings/copilot/features
2. Verifiser at du her _GitHub Copilot Enterprise is active for your account_. *Free* er ikke tilstrekkelig.

![Copilot Business via Domstolene](copilot-enterprise.png)

Dersom ikke OK, ta kontakt med [Nils Andreas på #ki-for-utviklere for å aktivere lisens](https://domstoladm.slack.com/archives/C09J322CV7H).

### Oppgave: Fork og klon dette repoet
1. Gå til https://github.com/arve0-domstol/ki
2. Trykk på _Fork_
3. Lagre til din egen bruker
4. Klon repoet til din egen maskin

```shell
export brukernavn=$(gh auth status --json hosts --jq '.hosts."github.com".[].login')
mkdir -p ~/domstolene
git clone https://github.com/$brukernavn$/ki ~/domstolene/ki
```

Tips: På Windows? Bruk _Git Bash_ til å kjøre kommandoene.

### Oppgave: Sjekk at det virker
1. Åpne chat-vinduet, om det ikke er åpent (Ctrl + Alt/Cmd + I)
2. Finn og velg modellen *GPT-5.6 Luna* (vi bruker denne modellen for alle oppgaver inntil vi ser på ulike modeller senere i kurset)
3. Skriv inn denne instruksen:

> lag et sammendrag av kurset

4. Høyreklikk på responsen og kopier.
5. Lagre til filen sammendrag.md.
6. Commit og push: `git add sammendrag.md && git commit -m "det virker!" && git push` (jeg bruker historikken i din fork til å lage scoreboarden)

Neste steg er [02-chatting.md](02-chatting.md).
