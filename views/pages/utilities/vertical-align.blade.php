@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Vertical alignments
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'vertical-align', 'config' => 'vertical-align']])
        
            <span class="u-align--baseline">baseline</span>
            <span class="u-align--top">top</span>
            <span class="u-align--middle">middle</span>
            <span class="u-align--bottom">bottom</span>
            <span class="u-align--text-top">text-top</span>
            <span class="u-align--text-bottom">text-bottom</span>

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
     
    @endutility_doc


</article>
@stop
