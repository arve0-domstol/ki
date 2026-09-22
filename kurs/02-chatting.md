# Chat
Chat er en enkel måte å gjøre små oppgaver, der du jobber interaktivt med KI-modellen.

Passer bra til:
- Spørre om ting. Alt fra ting som vil finnes i dokumentasjon på et bibliotek til konkrete spørsmål om kodebasen. Eksempler:

  > Hvilken verktøy brukes i kotlin for å formatere kode?
  > Hva gjør denne kodebasen?
  > Hvordan kan jeg teste denne koden?

- Gjøre små endringer som er kontekstavhengig. Kontekstavhengig kan bety at deler av koden bruker variabler, der søk og erstatt ikke ville fungert, slik som `https://domstol.no/ting/tang` ett sted og `$api_url/tang` ett annet sted.  Eksempler:

  > Omdøp alle ..
  > Flytt denne seksjonen av koden.
  > Koden er repetiv, gjør koden DRY.
  > Endre URL for https://tjeneste.apps.test.firma.no til http://tjeneste.namespace.cluster.local.

- Utforske hvordan du skal løse et problem. Eksempler:

  > Jeg har denne feilen her, hva kan være problemet?
  > Jeg skal lage en ny ting, hvordan kan jeg gjøre det?

## Norsk eller engelsk?
Min erfaring er at norsk er like godt som engelsk, samt at min hjerne er flinkere å produsere fullstendige setninger på norsk og at det er enklere å diktere. Altså foretrekker jeg norsk når jeg chatter. Har du fått et dårlig svar og ønsker å prøve på engelsk, kan du enkelt ta en lang instruks og oversette den, før en prøver igjen på engelsk:

> Oversett dette til engelsk: ....

## Kodebase
Kurset baserer seg på kodebasen i [lovisa_core](https://github.com/domstolene/lovisa_core).

Start med å gå til repoet:

```shell
# dersom du ikke har klonet repoet fra før:
# mkdir -p ~/domstolene
# git clone https://github.com/domstolene/lovisa_core ~/domstolene/lovisa_core
cd ~/domstolene/lovisa_core
```

Sjekk ut branchen `ki` i et nytt worktree:

```shell
git worktree add ../lovisa_core-worktree-ki -b $(whoami)-ki ki
```

Åpne worktree i Visual Studio Code:

```shell
code ~/domstolene/lovisa_core-worktree-ki
```

Tips: Vet du ikke hva [git worktree](https://git-scm.com/docs/git-worktree) er? Spør Copilot.

## Oppgave: Bli kjent med kodebasen
Start en ny chat og prøv disse instruksene:

> I mappen products/testpersoner ligger det et program. Forklar meg hva det gjør, hvilken teknologi det bruker og hvordan jeg kommer i gang.

## Oppgave: Bli kjent med teknologien
Var det noe nytt her som du ikke kjenner til? Fortsett i samme chat og spør om teknologiene som er i bruk:

> Kan du forklare meg mer om teknologiene Entra, Maskinporten og Vault?

## Oppgave: Lagre resultatet
Høyreklikk, velg _Copy all_, lagre til testpersoner.md, commit og push:

```shell
git add testpersoner.md
git commit -m "utforske en kodebase og dens teknologier"
git push
```

Neste steg er [03-kontekst.md](03-kontekst.md).

