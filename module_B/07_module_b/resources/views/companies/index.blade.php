<x-layout>

    <h2>Company List: </h2>
    <a href="{{ url('/companies/new') }}">Create new Company</a>
    @if(session('success'))
        <p style="color: green">{{session('success')}}</p>
    @endif
    <h3>Active</h3>
    @foreach ($companies as $company )
        @if ($company->active)
            <h4><a href="{{ url('/companies/' . $company->id) }}">{{$company->name}}</a></h4>
            <p>{{$company->address}}</p>
            <p>{{$company->telephone}}</p>
            <p>{{$company->email}}</p>
        @endif
    @endforeach
    <h3>Inactive</h3>
    @foreach ($companies as $company )
        @if (!$company->active)
            <h4><a href="{{ url('/companies/' . $company->id) }}">{{$company->name}}</a></h4>
            <p>{{$company->address}}</p>
            <p>{{$company->telephone}}</p>
            <p>{{$company->email}}</p>
        @endif
    @endforeach
</x-layout>