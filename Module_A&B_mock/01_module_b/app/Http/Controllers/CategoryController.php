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
            'name' => 'required'
        ]);

        Category::create($validated);

        return redirect('/categories')->with('success', 'Category successfully created!');
    }

    public function edit(Category $category)
    {
        return view('categories.edit',compact('category'));
    }

    public function update(Category $category, Request $req)
    {
        $validated = $req->validate([
            'name' => 'required'
        ]);

        $category->name = $validated['name'];
        $category->save();

        return redirect('/categories')->with('success', 'Category successfully updated!');
    }

    public function destroy(Category $category)
    {

        if($category->products()->count() > 0)
            {
                return redirect()->back()->with('warning', 'This category is associated with other product. This cannot be deleted');
            }
        $category->delete();

        return redirect('/categories')->with('success', 'Category Successfully deleted');
    }
}
