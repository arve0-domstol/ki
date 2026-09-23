# Utforskning
En ting jeg oppdaget tidlig er at agenten ofte har andre tilnærminger enn jeg har selv. Min første tanke var "idiot, du kan ikke", men en av gangene oppdaget jeg at agenten brukte noe funksjonalitet jeg ikke var klar over på et felt jeg anser meg selv som ekspert. En naturlig tanke er "joda, men jeg kan jo ikke vite om all funksjonalitet i alle produkter, grunnkunnskapen er den viktige", men en bedre holdning er å tenke "KI-modellen har hele verden som kunnskap, den vil alltid være mer kunnskapsrik enn meg".

Med denne innstillingen går ditt arbeid fra "å vite alt selv" til "jeg bruker hele verden som kunnskap til å ta mine valg". Dette har vært mulig før også, ved å tilegne seg verdens kunnskap i bøker, fra Google, på Stack Overflow og YouTube. Men nå er kostnaden gått fra timer til minutter for å bruke hele verdens kunnskap.

Til dere som sier: Du kan ikke stole på en KI-modell! Nei, du kan heller ikke stole på informasjon fra bøker og internett, du er bare vant til at innholdet ofte stemmer.

Så, la oss utforske!

## Oppgave: Hvordan få testpersoner ut i nye Lovisa
Den lokale HTML-siden sparer oss for noe klikking i [Confluence](https://domstol.atlassian.net/wiki/spaces/TEST/pages/4929093664/Liste+over+syntetiske+testmedarbeidere?xpis=eyJicmlkZ2UiOiJxdWlja0ZpbmQiLCJpZCI6IjE3OTAxNjY5MTE1NzUiLCJzb3VyY2UiOiJjb25mbHVlbmNlIn0%3D), 
men den største tidstyven i daglig arbeid er å vite om, finne frem og bruke kunnskapen om testbrukerne. 
La oss gjøre det enklere og putte testbrukerne rett i fleisen når en åpner nye Lovisa.

Her skal vi bruke en [skill](https://agentskills.io) for å hjelpe oss å finne ut hvordan problemet løses. En skill er tilsvarende AGENTS.md, men kun navnet og beskrivelsen legges til i kontekst. Agenten bestemmer selv når skillen skal tas i bruk. Å ta i bruk er her å legge hele innholdet til skillen i konteksten, altså utvide instruksen.

Vi starter med å legge til [grilling, også kalt grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md):

```shell
mkdir -p "$(git rev-parse --show-toplevel)/.agents/skills/grill-me"
curl --silent --location https://raw.githubusercontent.com/mattpocock/skills/refs/heads/main/skills/productivity/grilling/SKILL.md \
    | sed 's/name: grilling/name: grill-me/' \
    > "$(git rev-parse --show-toplevel)/.agents/skills/grill-me/SKILL.md"
git add .agents/skills
git commit -m "la til grill-me skill"
git push
```

Prøv nå denne instruksen:

> /grill-me Jeg skal bygge en innloggingshjelp som del av Next.js-applikasjonen i `products/lovisa-web`, basert på testpersonene i `products/testpersoner` og den eksisterende Entra-konfigurasjonen. Løsningen skal gjøre det enkelt å finne en relevant testbruker og starte ordinær Entra ID-innlogging med brukernavnet forhåndsutfylt og passordet klart på utklippstavlen. Innloggingshjelpen skal ikke autentisere brukeren selv, omgå Entra ID eller lagre aktive innloggingsøkter på vegne av testeren. Løsningen skal ha mulighet for å reservere en testbruker, der første gang blir en spurt om epost-adresse som lagres til localStorage. En skal bruke playwright til å spesifisere og drive utviklingen av siden, slik at en sjekker at all funksjonalitet fungerer.

Merk: _/grill-me_ aktiverer skillen. Aktivering kan også skje ved at beskrivelsen til skill inneholder "bruk denne instruksen hver gang du lager git commits" eller at din instruks er "bruk grill-me skill".

Typisk kan du gå videre med:

> Jeg ønsker følge dine anbefalninger.

eller

> q5: Løsningen skal ha mulighet for å reservere en testbruker, der resultatet lagres i mssql. første gang blir en spurt om epost-adresse som lagres til localStorage.

## Oppgave: Avslutte
Grill-me er omstendig og en kan sitte i en time og svare på spørsmål i noen tilfeller. Når du har gitt informasjon om hvordan timene skal føres inn, be om å avslutte:

> Det er nok nå. Lag en oppsummering av det du har så langt, og gjør antakelser for det du ikke vet. Skriv oppsummeringen her, men lagre resultatet også til innlogging-testbrukere.md, slik at det kan benyttes som en implementasjonsplan.

Lagre resultatet i git og push det.

## Når bruker en skills?
Tenk "jeg kommer til å bruke denne instruksen igjen, men den trengs ikke alltid". Jeg har brukt skills til å skrive gode git-commits, opprette pull requests basert på commits, oppgradere java, standardisere oppsett, sørge for at siste versjon benyttes for java-biblioteker, oppgradere github workflows, osv.

## Tips for skills
1. En skill er bare en vanlig instruks, tekst du kan skrive selv.
2. KI-modellen kan veldig mye, så du kan være unøyaktig i beskrivelsene.
3. En kan be om input fra brukeren underveis.
4. Skills kan installeres i din hjemmekatalog, slik at du kan benytte de på tvers av prosjekter.
5. Brukere som vet input up-front kan gi de i initiell instruks: "upgrade java, case number is GLAD-491"
6. Det finnes mange kataloger over skills på nett du kan prøve, eksempelvis [skills.sh](https://skills.sh).
7. KI-modeller er flinke til å skrive skills, be agenten hjelpe deg med å skrive en 🤓


Neste steg er [07-planer.md](07-planer.md).
