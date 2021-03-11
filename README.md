# Accessability

Målet med denna sektionen är att dokumenetera hur vi arbetar medd tillgänglighet, hur man ska använda verktyg och vilka metoder som bör appliceras. Detta dokumentet arbetas fortfarande på.

**Hur används HTML:en?**

Koden börjar som HTML som sedan används för att bygga upp en DOM, denna DOM:en sen pressenteras som ett GUI till användaren. För de som använder sig av assistansprogram som skärmläsare använder sig av en annan struktur som byggs av DOM:en, ett accessability tree. 
Detta trädet innehåller noder (som DOM:en) men man har filltrerat ut onödiga noder som inte har något "informativt" värde. Detta kan DIV:ar som bygger en layout. Detta trädet är det som skärmläsaranvändare använder för att navigera hemsidan.

DOM:en använder sig mycket av ID för att skapa relativa förhållanden, t.ex. `<Label>` har ett `for=""` attribute för att säga vad det är en etikett för.

## Nedsatt syn

### Våra mål
Besökare på våra hemsidor  ska alla kunna ta in vår information. Därför är det viktigt att vi har design som har ordentlig kontrast och bra textstorlekar. Detta ska dock även kunna anpassa sig för individers behov om de väljer att ha större text eller extra kontrast

- Vi *ska* uppnå WCAG AA
- Vi *siktar* på WCAG AAA

## Blindhet
### Våra mål
Våra hemsidor ska vara tillgängliga och användbara även för de som inte kan se dem. Därför är det viktigt att våra hemsidor har bra syntax och följer standardiserad semantik. Strukturen ska vara väl organiserad och innehållet ska ha betydelse.


### Skärmläsare
####  MacOS

MacOS kommer med ett program som heter *VoiceOver*. Detta aktiveras genom att trycka <kbd>cmd</kbd>+<kbd>F5</kbd>.

VoicerOver modifier (VO)*: <kbd>option </kbd>+<kbd>control</kbd>.
Nästa: <kbd>VO</kbd>+<kbd>&#8592;</kbd>
Föregående: <kbd>VO</kbd>+<kbd>&#8594;</kbd> 
För att gå in i ett område: <kbd>shift</kbd>+<kbd>VO</kbd>+<kbd>&#8593;</kbd>
För att gå ur ett område: <kbd>shift</kbd>+<kbd>VO</kbd>+<kbd>&#8595;</kbd>

##### *Kan ändras i inställningar.

#### Windows
Behöver dokumenteras

#### Linux
Finns säkert något paket

### Exempel hur accessibilty ser ut

```
<label for="carBrand">Select a car brand</label>
<select name="carBrandSelect" id="carBrand">
	<option value="0">None</option>
	<option value="1">BMW</option>
	<option value="2">Mercedes Benz</option>
</select>
```
Ser ut för accessabilty:

```
Role: "combobox"
Name: "Select a car brand"
State: collapsed
Vale: "BMW"

```

`Role` står för vad det är för komponent och berättar hur användaren ska använda komponenten
`Name` är namnet på komponenten, i detta fallet kommer det från en `<label>`
`State` används av visa komponenter, t.ex. kan en checkbox vara `checked`
`Value` vissa controller har värden som här har man valt "BMW" och därför är värdet BMW

I Firefox och Chrome (och troligtvis fler webbläsare) kan man se alla värden som finns i Accessibility trädet och vilka värden som skickas till skärmläsaren.

#### Innefattade värden
Inputfält med rolen "textfield", knappar med rolen "button" och  selectboxar med rolen "combobox" kommer ha innefattad semantik

#### Landmärken
Dessa används av skärmläsaranvändare för att hoppa runt på sidan. Om en användare just nu får en text läst för sig men vill navigera till en annan sida. Då kan användaren direkt hoppa till landmärket `<nav>`.  Kanske användaren letar efter en viss del i text, då hoppar läsaren kanske mellan `<h3>`-element, så fort användaren har hittat det den letade efter kommer den hoppa till t.ex. `<p>` för att läsa innehållet.

#### Generiska element
Inbyggda element, t.ex. `<button>`, `<input>`, etc, har inbyggd semantik som vi såg innan. Det finns även generiska element, t.ex. `<div>`, som saknar dessa semantiker. Därför bör man undvika att använda dessa som interaktiva element.

*HTML:*
```
<div class="c-button" tabindex="0">
	Registrera
</div>
```
*Skärmläsare*
```
Registrera, group
```

Detta kan hända om man inte använder semantiken rätt. DIV:en kanske får visuell stil av `c-button`-klassen men den saknar semantik som vi får gratis av `<button>`-elementet. I detta fallet skulle användaren bara fått höra `Registrera, group` och missat helt att detta är en knapp för att registrera sig som användare.

#### WAI-ARIA
Vi nämnde precis att man ska använda sig av inbyggda element för att se till att all semantik finns. Vad händer om vi måste bygga en accordion som det inte finns ett inbyggt element för. 
Då har vi WAI-ARIA! WAI-ARIA är ett initiativ för att ge utökad semantik som vi kan använda oss för element som inte finns inbyggt.
Det WAI-ARIA inte gör är att ändra bettendet. Det kommer inte göra att accordion kan expanderas och kollapsa åt oss, detta måste vi göra med CSS eller JS.

WAI-ARIA ska användas för att komplettera informationen som skickas till skärmläsaren.

##### Exempel på användning av WAI-ARIA
*HTML*
```
<div id="checkbox" class="c-checkbox" tabindex="0">
</div>
```
Skärmläsare:
```
group
```

Detta lämnar mycket att önska. Kollar vi dock i *[WAI-ARIA checkbox](https://www.w3.org/TR/wai-aria-practices-1.1/#checkbox)*-dokumentationen så ser vi vad vi behöver lägga till. 
Dokumentationen säger att vi måste ha: 
 - Role, checkbox
 - aria-checked, true/false

*HTML*
```
<div id="checkbox" class="c-checkbox" tabindex="0" role="checkbox" aria-checked="true">
</div>
```
*Skärmläsare*
```
checked, checkbox
```
Nu vet webbläsaren att det är en checkbox och att den är ibockad. Men användaren vet inte vad det är som bockas i. Därför måste vi lägga till en label.
*HTML*
```
<label id="checkbox_label">Prenumerera</label>
<div id="checkbox" class="c-checkbox" tabindex="0" role="checkbox" aria-checked="true" aria-labelledby="checkbox_label">
</div>
```
*Skärmläsare*
```
Prenumerera, checked, checkbox
```

Det finns även ett attribut som heter `aria-label`. Då skriver man ettiketten som ett värde till attributet. Detta kan användas om det inte finns en visuell etiktett t.ex. på en hamburgarmeny eller en ikon för social media.


## Motorik
Tangentbords implementation


## Läs mer:
[WebAIM](https://webaim.org/)
[WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/)
