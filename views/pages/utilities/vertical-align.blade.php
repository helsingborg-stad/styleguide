@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Vertical alignments
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'vertical-align', 'config' => 'vertical-align']])
        
        @grid([
            "container" => true,
            "col_gap" => 2
        ])
            @grid([
                "col" => [
                    "xs" => [1,13],
                    "sm" => [1,13],
                    "md" => [1,13],
                    "lg" => [1,7],
                    "xl" => [1,7]
                ],
                "row" => [
                    "xs" => [1,2],
                    "sm" => [1,2],
                    "md" => [1,2],
                    "lg" => [1,2],
                    "xl" => [1,2]
                ],
                "classList" => [
                    "u-color__bg--default",
                    "u-rounded",
                    "u-padding--2"
                ]
            ])
                <span class="u-align--baseline">baseline</span>
                <span class="u-align--top">top</span>
                <span class="u-align--middle">middle</span>
                <span class="u-align--bottom">bottom</span>
                <span class="u-align--text-top">text-top</span>
                <span class="u-align--text-bottom">text-bottom</span>
            @endgrid

            @grid([
                "col" => [
                    "xs" => [1,13],
                    "sm" => [1,13],
                    "md" => [1,13],
                    "lg" => [7,13],
                    "xl" => [7,13]
                ],
                "row" => [
                    "xs" => [2,4],
                    "sm" => [2,4],
                    "md" => [2,4],
                    "lg" => [1,2],
                    "xl" => [1,2]
                ],
                "classList" => [
                    "u-color__bg--default",
                    "u-rounded",
                    "u-padding--2"
                ]
            ])
                <table style="height: 100px;">
                    <tbody>
                        <tr>
                            <td class="u-align--baseline">baseline</td>
                            <td class="u-align--top">top</td>
                            <td class="u-align--middle">middle</td>
                            <td class="u-align--bottom">bottom</td>
                            <td class="u-align--text-top">text-top</td>
                            <td class="u-align--text-bottom">text-bottom</td>
                        </tr>
                    </tbody>
                </table>
            @endgrid
        @endgrid
    @endutility_doc
</article>
@stop
