@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Vertical alignments
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'vertical-align', 'config' => 'vertical-align']])
        <div class="u-color__bg--secondary u-margin__bottom--2 u-display--inline-block">
            <span class="u-align--baseline">baseline</span>
            <span class="u-align--top">top</span>
            <span class="u-align--middle">middle</span>
            <span class="u-align--bottom">bottom</span>
            <span class="u-align--text-top">text-top</span>
            <span class="u-align--text-bottom">text-bottom</span>
        </div>

        <table class="u-color__bg--secondary" style="height: 100px;">
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
    @endutility_doc


</article>
@stop
