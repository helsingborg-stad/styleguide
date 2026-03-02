@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Simulate click
        When a dom object is clicked with simulate click attrubute the default action of the object will be prevented. A click event will then be sent to the target defined in the data attribute.
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "sizeobserver", "config" => "sizeobserver"]])
        <style>
            .size-observer {
                position: relative;
                padding: 0 10px;
            }
            .size-observer__child {
                background-color: red;
                z-index: -1;
                top: 0;
                position: absolute;
            }
        </style>
        @markdown
            <h2 class="u-margin__top--0">Default implementation</h2>
            Only adding the *data-js-sizeobserver* attribute will result in the custom property name being --size-observer-width and --size-observer-height.
        @endmarkdown
        @element([
            'attributeList' => [
                'data-js-sizeobserver' => '',
            ],
            'classList' => [
                'size-observer',
                'u-display--inline-flex'
            ]
        ])
            Default implementation 
            <span class="size-observer__child" style="width: var(--size-observer-width); height: var(--size-observer-height);">
            </span>
        @endelement

        @markdown
            ## Using custom property name
            Adding a value like: *data-js-sizeobserver="name"*, will result in the custom property name being --name-width and --name-height.
        @endmarkdown
        @element([
            'attributeList' => [
                'data-js-sizeobserver' => 'name',
            ],
            'classList' => [
                'size-observer',
                'u-display--inline-flex'
            ]
        ])
            Using custom property name 
            <span class="size-observer__child" style="width: var(--name-width); height: var(--name-height);">
            </span>
        @endelement

        @markdown
            ## Using axis
            Adding a value like: *data-js-sizeobserver-axis="x"*, will result in the custom only the width property being set.
        @endmarkdown
        @element([
            'attributeList' => [
                'data-js-sizeobserver' => '',
                'data-js-sizeobserver-axis' => 'x'
            ],
            'classList' => [
                'size-observer',
                'u-display--inline-flex'
            ]
        ])
            Using axis attribute
            <span class="size-observer__child" style="width: var(--size-observer-width); height: 10px;">
            </span>
        @endelement

        @markdown
            ## Using box size
            Adding a value like: *data-js-sizeobserver-use-box-size*, will result in the observer using the box size instead of the content size. Its a boolean value so it does not need a value.
        @endmarkdown
        @element([
            'attributeList' => [
                'data-js-sizeobserver' => '',
                'data-js-sizeobserver-use-box-size' => ''
            ],
            'classList' => [
                'size-observer',
                'u-display--inline-flex'
            ]
        ])
            Using box size
            <span class="size-observer__child" style="left: 0; width: var(--size-observer-width); height: var(--size-observer-height);">
            </span>
        @endelement
    @endscript_doc
@stop
