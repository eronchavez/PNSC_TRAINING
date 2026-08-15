<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Company;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    //

    public function index()
    {
        $products = Product::all();

        return view('products.index', compact('products'));
    }

    public function show(Product $product)
    {
        return view('products.show', compact('product'));
    }

    public function create()
    {

        $companies = Company::where('active', 1)->get();
        $categories = Category::all();

        return view('products.create', compact('companies', 'categories'));
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
            'hidden' => 'required',
            'image' => 'nullable|mimes:svg,png,jpeg,jpg,gif|max:2048',
            'company_id' => 'required'
        ]);

        if($req->hasFile('image'))
            {
                $image = $req->file('image');
                $imageName = time() . '.' . $image->extension();
                $image->move(public_path('images', $imageName));
                $validated['image'] = $imageName;
            }

        Product::create($validated);

        return redirect('/products')->with('success', 'Product Successfully Created!');
    }

    public function hide(Product $product)
    {
        $product->hidden = 1;
        $product->save();

        return redirect()->back()->with('success', 'Product Successfully Hidden!');
    }

    public function changeImage(Request $req, Product $product)
    {
        $validated = $req->validate([
            'image' => 'required|mimes:jpg,jpeg,gif,png,svg|max:2048'
        ]);

        $image = $req->file('image');
        $imageName = time() . '.' . $image->extension();
        $image->move(public_path('images'), $imageName);
        $product->image = $imageName;
        $product->save();
        
        return redirect()->back()->with('success', 'Product Successfully Changed!');
    }

    public function removeImage(Product $product)
    {
        $product->image = NULL;
        $product->save();

        return redirect()->back()->with('success', 'Image successfully removed!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect('/products')->with('success', 'Product Successfully Deleted!');
    }

}
