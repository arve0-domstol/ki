# Kontekst
Når du får dårlige resultat fra KI-modellen er det ofte fordi den mangler informasjonen den trenger for å svare deg i treningssettet sitt, at den ikke klarer selv å finne det i kodebasen du står i eller at det finnes mange måter å svare på. Da kan vi med hjelpe og styre modellen inn i riktig spor, ved å gi ekstra instruksjoner om hvor modellen kan finne informasjonen.

## Oppgave: Legge til kontekst fra fil
Du så kanskje at KI-modellen leste README.md-filen til testpersoner når du ba om introduksjon? For noen instrukser, vil den starte å lete etter filer selv. Dersom du allerede vet hva den trenger, kan en like godt sende med den aktuelle filen som kontekst.

1. Åpne filen testpersoner.d2
2. Start en ny chat.
3. I chaten, trykk på filen slik at den legges med i kontekst. Når filen er med, skal den være i vanlig tekst, kursiv _testpersoner.d2_ er kun navnet og ikke innholdet med.
4. Gi denne instruksen

> Hva slags språk er dette? Gi meg en konsis instruks for de vanligste tingene en kan gjøre med språket. Skriv svaret her og samtidig til d2.md

Godkjenn kommandoer agenten ønsker å kjøre.

Ettersom agenten skrev til en fil vil chaten vise dette og be om godkjenning. Trykk på _Keep_.

## Oppgave: Legg til deler av fil
1. Merk linje 6 i filen testpersoner.d2: `...@../classes`
2. Legg merke til at linjen allerede er lag til som kontekst, som `testpersoner.d2:6`.
3. Gi denne instruksen:

> Hva er dette? Skriv svaret her og samtidig utvid d2.md med eksempelet.

Merking av bestemte områder som er interessant hjelper modellen å holde fokus på det du lurer på og kan spare deg for en del kopiering, men ofte fungerer det å legge med hele filen også så lenge en klarer å beskrive hva en ønsker svar på. Mindre vedlegg gir også bedre ytelse og mindre kostnad, mer om det senere.

## Oppgave: Legg til kontekst fra internett
En vanlig feil KI-modellen gjør er å bruke gammel informasjon. Modellen har en cutoff for informasjonen sin, altså tidspunktet for data modellen var trent på.

Prøv disse to og se om du får ulike resultat:

> hvilke versjoner av d2 kjenner du til?

> hvilke versjoner av d2 finnes? ta med patch-nummeret også. jeg er spesielt interessert i hva siste versjon er i dag.

> hvilke versjoner av d2 finnes? bruk `gh release` kommandolinjeverktøy for å finne versjoner.

Legg merke til:
1. Første spørsmål leter ofte etter versjonsnummer i kodebasen.
2. Vi trenger ikke trenger å spesifisere hvordan modellen skal hente versjonen fra internett.
3. Vi må godta at KI-modellen bruker internett for å hente ekstra informasjon. Hvorfor er det slik?
4. Vi kan peke KI-modellen mot et effektivt verktøy for å finne versjonsnummer. Det sparer tid og tokens.

Tips: For nå kan du endre _Default Approvals_ til _Bypass Approvals_, som er trygt siden vi kjører agenten i Codespaces på et eksempelprosjekt. Sikkerhetsrisikoen i Codespaces er i hovedsak at agenten får skrivetilgang på repoet du jobber i.

## Hvor ser du kostnaden?
Nede i høyre hjørne av chat-dialogen er en sirkel. Klikker du på den finner du _Session Cost_. 10 credits = 1 krone.

![kontekstvinduet viser kostnad helt i toppen, her 3,6 credits = 36 øre](kontekstvindu.png)

## Oppgave: Lagre resultatene dine for scoreboard
```shell
git add **/d2.md
git commit -m "legge til kontekst"
git push
```

Neste steg er [04-agenter.md](04-agenter.md).

