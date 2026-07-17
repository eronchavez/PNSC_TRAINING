<x-layout>

    <h1>Companies: </h1>
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif

    <a href="{{ url('/companies/new') }}">create new company</a>

    <h1>Active: </h1>
    @foreach ($companies as $company)
        @if ($company->active)
        
            <h2><a href="{{ url('/companies/' . $company->id) }}">{{$company->name}}</a></h2>
            <p>{{$company->address}}</p>
            <p>{{$company->telephone}}</p>
            <p>{{$company->email}}</p>
        @endif
    @endforeach

    <h1>Inactive: </h1>
    @foreach ($companies as $company)
        @if (!$company->active)
        
            <h2><a href="{{ url('/companies/' . $company->id) }}">{{$company->name}}</a></h2>
            <p>{{$company->address}}</p>
            <p>{{$company->telephone}}</p>
            <p>{{$company->email}}</p>
        @endif
    @endforeach

</x-layout>