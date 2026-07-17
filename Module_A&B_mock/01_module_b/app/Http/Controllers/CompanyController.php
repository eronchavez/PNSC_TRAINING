<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Owner;
use App\Models\Product;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    //

    public function index()
    {
        $companies = Company::all();

        return view('companies.index',compact('companies'));
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
            'owner_email' => 'required',
            'contact_name' => 'required',
            'contact_mobile' => 'required',
            'contact_email' => 'required',
           
        ]);


        $company = new Company();
        $company->name = $validated['name'];
        $company->address = $validated['address'];
        $company->telephone = $validated['name'];
        $company->email = $validated['email'];


        $contact = new Contact();
        $contact->name = $validated['contact_name'];
        $contact->mobile = $validated['contact_mobile'];
        $contact->email = $validated['contact_email'];
        $contact->save();


        $owner = new Owner();
        $owner->name = $validated['owner_name'];
        $owner->mobile = $validated['owner_mobile'];
        $owner->email = $validated['owner_email'];
        $owner->save();

        $company->contact_id = $contact->id;
        $company->owner_id = $owner->id;
        $company->save();

        return redirect('/companies')->with('success', 'Company Successfully Created!');
    }

    public function show(Company $company)
    {
        return view('companies.show',compact('company'));
    }

    public function edit(Company $company)
    {
        return view('companies.edit',compact('company'));
    }

     public function update(Request $req, Company $company)
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
            'contact_email' => 'required',
           
        ]);


        
        $company->name = $validated['name'];
        $company->address = $validated['address'];
        $company->telephone = $validated['name'];
        $company->email = $validated['email'];


      
        $company->contact->name = $validated['contact_name'];
        $company->contact->mobile = $validated['contact_mobile'];
        $company->contact->email = $validated['contact_email'];
        $company->contact->save();


 
        $company->owner->name = $validated['owner_name'];
        $company->owner->mobile = $validated['owner_mobile'];
        $company->owner->email = $validated['owner_email'];
        $company->owner->save();

        $company->contact_id = $company->contact->id;
        $company->owner_id = $company->owner->id;
        $company->save();

        return redirect('/companies')->with('success', 'Company Successfully Updated!');
    }


    public function deactivate(Company $company)
    {
        $company->active = 0;
        $company->products()->update(['hidden' => 1]);
        $company->save();

        return redirect('/companies')->with('success', 'Company Successfully Deactivated!');
    }


}
