<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EventSeederModel;

class EventSeederController extends Controller
{
    public function index()
    {
        return response()->json(EventSeederModel::all());
    }
}
