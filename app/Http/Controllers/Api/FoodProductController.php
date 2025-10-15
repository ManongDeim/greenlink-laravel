<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FoodProduct;

class FoodProductController extends Controller
{
     public function index()
    {
        return response()->json(FoodProduct::all());
    }
}
