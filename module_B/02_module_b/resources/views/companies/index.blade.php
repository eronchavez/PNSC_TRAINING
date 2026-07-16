<x-layout>

    <h1>Companies: </h1>
    @if (session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif


    <a href="{{ url('/companies/new') }}">Create new company</a>
    <h2>Active: </h2>
    @foreach ($companies as $company)
        @if ($company->active)
            <h3><a href="{{ url('/companies/' . $company->id) }}">{{$company->name}}</a></h3>
            <p>{{$company->address}}</p>
            <p>{{$company->telephone}}</p>
            <p>{{$company->email}}</p>
        @endif
    @endforeach

    <h2>Inactive: </h2>
    @foreach ($companies as $company)
        @if (!$company->active)
            <h3><a href="{{ url('/companies/' . $company->id) }}">{{$company->name}}</a></h3>
            <p>{{$company->address}}</p>
            <p>{{$company->telephone}}</p>
            <p>{{$company->email}}</p>
        @endif
    @endforeach
</x-layout>