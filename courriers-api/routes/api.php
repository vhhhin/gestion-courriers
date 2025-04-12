<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CourierController;

Route::prefix('api')->group(function () {
    Route::post('/couriers', [CourierController::class, 'store']);
    Route::get('/couriers', [CourierController::class, 'index']);
    Route::get('/couriers/type/{type}', [CourierController::class, 'getByType']);
});
