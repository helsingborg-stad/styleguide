@extends('layout.master')

@section('content')
    @markdown
        #Image
        Displays code.
    @endmarkdown

    @doc(['slug' => 'code'])

        @code(['language' => 'php', 'content' => ''])

        class Automobile
        {
            private $vehicleMake;
            private $vehicleModel;

            public function __construct($make, $model)
            {
                $this->vehicleMake = $make;
                $this->vehicleModel = $model;
            }

            public function getMakeAndModel()
            {
                return $this->vehicleMake . ' ' . $this->vehicleModel;
            }
        }

        class AutomobileFactory
        {
            public static function create($make, $model)
            {
                return new Automobile($make, $model);
            }
        }

        @endcode

    @enddoc
@stop

