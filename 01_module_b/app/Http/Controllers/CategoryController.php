<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //

    public function index()
    {
        $categories = Category::all();
        return view('categories.index',compact('categories'));
    }

    public function create()
    {
        return view('categories.create');
    }

    public function store(Request $req)
    {
        $validated = $req->validate([
            'name' => 'required|unique:categories,name'
        ]);

        Category::create($validated);

        return redirect('/categories')->with('success', 'Category successfully created!');
    }

    public function edit(Category $category)
    {
        return view('categories.edit',compact('category'));
    }

    public function update(Request $req, Category $category)
    {
        $validated = $req->validate([
            'name' => 'required|unique:categories,name,' . $category->name
        ]);

        $category->update($validated);

        return redirect('/categories')->with('success', 'Category Updated Successfully!');
    }

    public function destroy(Category $category)
    {
        if($category->products()->count() > 0)
            {
                return redirect()->back()->with('warning', 'This category is associated with another product.');
            }
        $category->delete();

        return redirect('/categories')->with('success', 'Category successfully deleted!');
    }

   
}
