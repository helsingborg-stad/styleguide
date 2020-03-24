@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Filtering lists, tables, etc (search)
        Hide elements based on match with data attributes.
    @endmarkdown

    @script_doc(['viewDoc' => ['type' => 'script', 'root' => 'filter', 'config' => 'filter']])
        <div js-filter-container="5da57cccd46c6">
            
            @field([
                'type' => 'text',
                'attributeList' => [
                    'type' => 'search',
                    'name' => 'search',
                    'required' => true,
                    'js-filter-input' => '5da57cccd46c6'
                ],
                'label' => "Search"
            ])
            @endfield

            <div class="c-table table-striped table-bordered">
                <div class="c-table__inner">
                    <table class="c-table__table">
                        <thead class="c-table__head">
                            <tr class="c-table__line">
                                <th scope="col" class="c-table__column c-table__column-0">Attribute</th>
                                <th scope="col" class="c-table__column c-table__column-1">Description</th>
                                <th scope="col" class="c-table__column c-table__column-2">Example value</th>
                            </tr>
                        </thead>
                        <tbody class="c-table__body">
                            <tr class="c-table__line c-table__line-0" js-filter-item="">
                                <td scope="row" class="c-table__column c-table__column-0" js-filter-data="">js-filter-container</td>
                                <td scope="row" class="c-table__column c-table__column-1" js-filter-data="">Container of what should be filterable, has to contain unique id.</td>
                                <td scope="row" class="c-table__column c-table__column-2" js-filter-data="">unique_id</td>
                            </tr>

                            <tr class="c-table__line c-table__line-2" js-filter-item="">
                                <td scope="row" class="c-table__column c-table__column-0" js-filter-data="">js-filter-data</td>
                                <td scope="row" class="c-table__column c-table__column-1" js-filter-data="">Elements inside item that contain data which should be used in the filter.</td>
                                <td scope="row" class="c-table__column c-table__column-2" js-filter-data=""></td>
                            </tr>

                            <tr class="c-table__line c-table__line-3" js-filter-item="">
                                <td scope="row" class="c-table__column c-table__column-0" js-filter-data="">js-filter-input</td>
                                <td scope="row" class="c-table__column c-table__column-1" js-filter-data="">The input for a specific container, has to contain same id as parent.</td>
                                <td scope="row" class="c-table__column c-table__column-2" js-filter-data="">unique_id</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    @endscript_doc

@stop
