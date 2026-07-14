<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Company;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
 

   


    public function verifyGTINs(Request $req)
    {
        $validated = $req->validate([
            'gtins' => 'required'
        ]);

        $gtins = explode("\n", $validated['gtins']);
        $gtins = array_map('trim', $gtins);
        $products = Product::whereIn('gtin', $gtins)->where('hidden',0)->get();

        return view('public.result',compact('gtins', 'products'));
    }



    public function getProductPublic(Product $product)
    {
        if($product->hidden) abort(404);
        $product->load(['reviews.user', 'company', 'category']);
        $avgRating = $product->reviews->avg('rating');
        $reviewCount = $product->reviews->count();
        return view('public.product', compact('product','avgRating', 'reviewCount'));
    }

    
    public function getProductsPublic(Request $req)
    {
        $company = $req->input('company');
        $category = $req->input('category');
        $productsQuery = Product::where('hidden', 0);

        if($company)
            {
                $productsQuery->where('company_id', $company);
            }
        if($category)
            {
                $productsQuery->where('category_id', $category);
            }

        $products = $productsQuery->get();
        $companies = Company::where('active', 1)->get();
        $categories = Category::all();

        return view('public.products', compact('products', 'companies', 'categories'));
    }

    public function getProductJson(Product $product)
    {
        if($product->hidden) abort(404);

        return response()->json([
            'name' => [
                        'en' => $product->name,
                        'fr' => $product->french_name
                    ],
                    'description' => [
                        'en' => $product->description,
                        'fr' => $product->french_description
                    ],
                    'gtin' => $product->gtin,
                    'brand' => $product->brand,
                    'category' => $product->category?->name,
                    'countryOfOrigin' => $product->country,
                    'weight' => [
                        'gross' => $product->gross_weight,
                        'net' => $product->net_weight,
                        'unit' => $product->weight_unit
                    ],
                    'company' => [
                        'companyName' => $product->company?->name,
                        'companyAddress' => $product->company?->address,
                        'companyTelephone' => $product->company?->telephone,
                        'companyEmail' => $product->company?->email,
                        'owner' => [
                            'name' => $product->company?->owner?->name,
                            'mobileNumber' => $product->company?->owner->mobile,
                            'email' => $product->company?->owner?->email,
                        ],
                        'contact' => [
                            'name' => $product->company?->contact?->name,
                            'mobileNumber' => $product->company?->contact->mobile,
                            'email' => $product->company?->contact?->email,
                        ],
                    ]
        ]);
    }


    public function getProductsJson(Request $req)
    {
        $query = $req->input('query');
        $productsQuery = Product::where('hidden', 0);

        if($query)
            {
                $productsQuery->where(function($p) use ($query){
                    $p->where('name', 'like', '%' . $query . '%')
                        ->orWhere('french_name', 'like', '%' . $query . '%')
                        ->orWhere('description', 'like', '%' . $query . '%')
                        ->orWhere('french_description', 'like', '%' . $query . '%');
                });
            }

        $products = $productsQuery->paginate(10);


        return response()->json([
            'data' => $products->map(function($product){
                return [
                    'name' => [
                        'en' => $product->name,
                        'fr' => $product->french_name
                    ],
                    'description' => [
                        'en' => $product->description,
                        'fr' => $product->french_description
                    ],
                    'gtin' => $product->gtin,
                    'brand' => $product->brand,
                    'category' => $product->category?->name,
                    'countryOfOrigin' => $product->country,
                    'weight' => [
                        'gross' => $product->gross_weight,
                        'net' => $product->net_weight,
                        'unit' => $product->weight_unit
                    ],
                    'company' => [
                        'companyName' => $product->company?->name,
                        'companyAddress' => $product->company?->address,
                        'companyTelephone' => $product->company?->telephone,
                        'companyEmail' => $product->company?->email,
                        'owner' => [
                            'name' => $product->company?->owner?->name,
                            'mobileNumber' => $product->company?->owner->mobile,
                            'email' => $product->company?->owner?->email,
                        ],
                        'contact' => [
                            'name' => $product->company?->contact?->name,
                            'mobileNumber' => $product->company?->contact->mobile,
                            'email' => $product->company?->contact?->email,
                        ],
                    ]
                ];
            }),
            // put pagination here
            'pagination' => [
                'current_page' => $products->currentPage(),
                'total_pages' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'next_page_url' => $products->nextPageUrl(),
                'prev_page_url' => $products->previousPageUrl()
            ]
        ]);
    }
  


    public function index()
    {
        $products = Product::all();

        return view('products.index', compact('products'));
    }

    public function show(Product $product)
    {
       
        return view('products.show',compact('product'));
    }

    public function create()
    {
        $companies = Company::where('active', 1)->get();
        $categories = Category::all();
        return view('products.create',compact('companies', 'categories'));
    }

    public function store(Request $req)
    {
        $validated = $req->validate([
            'name' => 'required',
            'french_name' => 'required',
            'gtin' => 'required|min:13|max:14|unique:products,gtin',
            'description' => 'required',
            'french_description' => 'required',
            'brand' => 'required',
            'category_id' => 'required',
            'country' => 'required',
            'gross_weight' => 'required',
            'net_weight' => 'required',
            'weight_unit' => 'required',
            'image' => 'nullable|mimes:jpg,png,jpeg,gif,svg|max:2048',
            'company_id' => 'required'
        ]);

        Product::create($validated);

        return redirect('/products')->with('success', 'Product successfully created!');
    }

    public function changeImage(Request $req, Product $product)
    {
        $req->validate([
            'image' => 'required|mimes:jpeg,jpg,png,gif,svg|max:2048'
        ]);

        $image = $req->file('image');

        $imageName = time() . '.' . $image->extension();
        $image->move(public_path('images'), $imageName);
        $product->image = $imageName;
        $product->save();

        return redirect()->back()->with('success', 'Image successfully Changed!');
        
    }

    public function removeImage(Product $product)
    {
        $product->image = NULL;
        $product->save();

        return redirect()->back()->with('success', 'Image successfully removed');
    }

    public function hide(Product $product)
    {   
        $product->hidden = 1;
        $product->save();

        return redirect()->back()->with('success', 'Product successfully hidden');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        
        return redirect('/products')->with('success', 'Product Successfully deleted!');
    }





}
