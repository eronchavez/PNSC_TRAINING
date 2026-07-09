<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Owner;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    //
    public function index()
    {
        $companies = Company::all();

        return view('companies.index', compact('companies'));
    }

    public function show(Company $company)
    {   
        return view('companies.show', compact('company'));
    }

    public function create()
    {
        return view('companies.create');
    }

    public function store(Request $req)
    {
        $validated = $req->validate([
            'name' => 'required',
            'address' => 'required',
            'telephone' => 'required',
            'email' => 'required|email',
            'owner_name' => 'required',
            'owner_mobile' => 'required',
            'owner_email' => 'required|email',
            'contact_name' => 'required',
            'contact_mobile' => 'required',
            'contact_email' => 'required|email'
        ]);

        $company = new Company();
        $company->name = $validated['name'];
        $company->address = $validated['address'];
        $company->telephone = $validated['telephone'];
        $company->email = $validated['email'];

        $owner = new Owner();
        $owner->name = $validated['owner_name'];
        $owner->mobile = $validated['owner_mobile'];
        $owner->email = $validated['owner_email'];
        $owner->save();

        $contact = new Contact();
        $contact->name = $validated['contact_name'];
        $contact->mobile = $validated['contact_mobile'];
        $contact->email = $validated['contact_email'];
        $contact->save();

        $company->owner_id = $owner->id;
        $company->contact_id = $contact->id;
        $company->save();

        return redirect("/companies")->with('success', 'Company successfully created!');
    }

    public function edit(Company $company)
    {   
        return view('companies.edit', compact('company'));
    }

    public function update(Company $company, Request $req)
    {
        $validated = $req->validate([
            'name' => 'required',
            'address' => 'required',
            'telephone' => 'required',
            'email' => 'required|email',
            'owner_name' => 'required',
            'owner_mobile' => 'required',
            'owner_email' => 'required',
            'contact_name' => 'required',
            'contact_mobile' => 'required',
            'contact_email' => 'required|email'
        ]);


        $company->name = $validated['name'];
        $company->address = $validated['address'];
        $company->telephone = $validated['telephone'];
        $company->email = $validated['email'];

        $company->owner->name = $validated['owner_name'];
        $company->owner->mobile = $validated['owner_mobile'];
        $company->owner->email = $validated['owner_email'];
        $company->owner->save();

        $company->contact->name = $validated['contact_name'];
        $company->contact->mobile = $validated['contact_mobile'];
        $company->contact->email = $validated['contact_email'];
        $company->contact->save();

        $company->owner_id = $company->owner->id;
        $company->contact_id = $company->contact->id;
        $company->save();
        

        return redirect("/companies")->with('success', 'Company successfully changed!');
    }

    public function deactivate(Company $company)
    {
        $company->active = 0;
        $company->products()->update(['hidden' => 1]);
        $company->save();
     
        return redirect('/companies')->with('success', 'Company Successfully Deactivated!');
    }


}
