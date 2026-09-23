# Agenter
Du har allerede fått en forsmak på agenter. I de forrige oppgavene ba vi agenten om å lagre resultatet også til en fil. En kan skru av "agent"-modusen ved å velge _Ask_ på knappen til venstre for modellen, men typisk vil ikke agenten gjøre noe du ikke ber om. I verste tilfelle kan en alltids angre endringene ved å trykke på knappen _Undo_.

## Oppgave: Endre testpersoner-oversikt
Det finnes et oversikt over testpersoner i lovisa_core med et enkelt søk som vi skal utvide funksjonaliteten på.

1. Åpne testpersoner.html i en nettleser.
2. Legg merke til at siden har et fritekstfelt som kan søke på alle felt.
3. Prøv denne instruksen:

> I testpersoner.html ønsker jeg en knapp som plukker ut en tilfeldig person. Implementer knappen.

Verifiser at det virker.


## Oppgave: Spare mer tid
Det fungerte kanskje bra? Men det var også en veldig enkel endring. Dersom vi var kjent i kodebasen, sparte det oss kanskje for 1 minutt, dersom vi ikke var så kjent, noen minutter flere.

Det vi ønsker, er å spare oss så mange minutter som mulig, i en instruks.

Hva ville du typisk også gjort, når du legger til en ny feature? Kanskje lagt til en test, oppdatert dokumentasjon og kjørt testene?

**Fjern resultatet fra sist** og prøv denne instruksen:

> I testpersoner.html ønsker jeg en knapp som plukker ut en tilfeldig person. Legg til en enkel playwright e2e test ved siden av filen. Verifiser at testen feiler. Implementer knappen og verifiser at testen passerer. Gjør også en sikkerhetsvurdering, er det trygt å endre koden? Lag til slutt en commit-melding med tittel og body som forklarer hva som er endret og hvorfor, la output være en git-kommando jeg kan kjøre selv.


## Oppgave: Unngå å skrive samme instrukser på ny og ny
Instruksene i forrige melding er "standard" programvareutvikling. En ønsker alltid å gå gjennom samme liste med ting. Det tar kanskje ikke så lang tid å skrive, men det er fort gjort å glemme en ting. (Har du lest [the checklist manifesto](https://www.ark.no/produkt/boker/hobbyboker-og-fritid/the-checklist-manifesto-9781782835943)?)

Når du oppdager at du gir samme instruks på ny og på ny, kan du legge til instruksen i filen AGENTS.md. Den blir alltid lagt til i lag med instruksene dine fra chaten.

Repoet har allerede en [AGENTS.md fil](../../AGENTS.md) med mange instruksjoner, samt [spesifikke, slik som for lovisa-web](../../products/lovisa-web/frontend/AGENTS.md).

Legg til dette i products/testpersoner/AGENTS.md:

```markdown
Når du redigerer testpersoner.html, gjør alltid disse stegene:

1. Legg til en test som du sjekker at feiler, før du fikser implementasjonen og sjekker suksess for testen (TDD). Foretrekk ende-til-ende tester i playwright.
2. Kjør alle testene og bygg når du er ferdig.
3. Oppdatere dokumentasjonen i README.md og eventuelt andre relevante .md-filer.
4. Gjør en sikkerhetsvurdering, er det trygt å endre koden?
5. Lag til slutt en commit-melding med tittel og body som forklarer hva som er endret og hvorfor, la output være en git-kommando jeg kan kjøre selv, inklusive git push.
```

**Fjern endringene fra forrige instruks** og prøv denne den enklere instruksen:

> I testpersoner.html ønsker jeg en knapp som plukker ut en tilfeldig person. Implementer knappen.

Trykk på _Keep_ og bruk git kommando fra agenten for å lagre endringene.

Neste steg er [05-feilsøking.md](05-feilsøking.md).
