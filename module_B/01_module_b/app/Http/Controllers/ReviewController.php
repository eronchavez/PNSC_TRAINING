<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    //

    public function store(Request $req, Product $product)
    {
        $validated = $req->validate([
            'rating' => Auth::id(),
            'review' => 'nullable|string|max:200'
            
        ]);

        $product->reviews()->create([
            'user_id' => Auth::id(),
            'rating' => $validated['rating'],
            'review' => $validated['review'] ?? null,
        ]);

        return back()->with('success', 'Review submitted.');
    }
}
