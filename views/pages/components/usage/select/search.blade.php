@php $options = [
    'key1' => 'Apple',
    'key2' => 'Banana',
    'key3' => 'Cherry',
    'key4' => 'Date',
    'key5' => 'Elderberry',
    'key6' => 'Fig',
    'key7' => 'Grape',
    'key8' => 'Honeydew',
    'key9' => 'Indian Fig',
    'key10' => 'Jackfruit',
    'key11' => 'Kiwi',
    'key12' => 'Lemon',
    'key13' => 'Mango', 
    'key14' => 'Nectarine',
    'key15' => 'Orange',
    'key16' => 'Papaya',
    'key17' => 'Quince',
    'key18' => 'Raspberry',
    'key19' => 'Strawberry',
    'key20' => 'Tangerine'
]; @endphp

<div style="min-height: 100px">
    @form([
        'method' => 'GET',
        'action' => '?q=select-single'
    ])
        @select([
            'label' => 'Searchable Multi Select',
            'required' => true,
            'placeholder' => "Search for options",
            'preselected' => [],
            'multiple' => true,
            'search' => true,
            'options' => $options,
            'size' => 'md'
        ])
        @endselect
        <br>
        @select([
            'label' => 'Searchable Single Select',
            'required' => true,
            'placeholder' => "Search for options",
            'preselected' => [],
            'multiple' => false,
            'search' => true,
            'options' => $options,
            'size' => 'md'
        ])
        @endselect
    @endform
</div>
