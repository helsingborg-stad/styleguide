@extends('layout.master')

@section('content')
<article>

    {!! markdown("

        #Accessibility

        We have followed the [Web Content Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/TR/WCAG21/) when designing this styelguide. Below is a summary of the rules that we have applied.

        * Validerad markup.
        * Använd html-elementen på rätt sätt.
        * Använd i första hand standardkomponenter som finns i html.
        * Flexibel layout som fungerar vid förstoring, förminskning och olika skärmstorlekar.
        * Märk upp formulärfält med rätt attribut i koden.
        * Använd inte enbart färg för att förmedla information. T.ex. komplettera notiser med färgbakrund med en ikon.
        * Popup-funktioner ska kunna hanteras och stängas av alla.
        * Använd tillräckliga kontraster i komponenter och grafik.
        * Använd tillräcklig kontrast mellan text och bakgrund.
        * Det ska vara möjligt att förstora texten till åtminstone dubbel höjd och bredd utan att problem uppstår.
        * Möjlighet att navigera med endast tangentbord.
        * Markera tydligt vilket fält eller element som är i fokus.

    ") !!}

</article>
@stop
