<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FarmProduct;

class FarmProductController extends Controller
{
    public function index()
    {
        $products = FarmProduct::all();
        return response()->json($products);
    }
}
