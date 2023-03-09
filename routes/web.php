<?php

use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/{path?}', function () {
    return view('app');
})->where('path', '^(?!api).*?');
Route::group(['prefix' => 'api'], function () {
    Route::post('/login', [\App\Http\Controllers\Api\LoginController::class, 'login']);
    Route::post('/register', [\App\Http\Controllers\Api\RegisterController::class, 'register']);
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('/logout', [App\Http\Controllers\Api\LoginController::class, 'logout']);
        Route::post('/me', [App\Http\Controllers\Api\LoginController::class, 'me']);
        Route::put('/updateUser', [App\Http\Controllers\Api\UserController::class, 'updateUser']);
        Route::apiResource('employee', App\Http\Controllers\Api\EmployeeController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('invoice', App\Http\Controllers\Api\InvoiceController::class)->only(['index', 'store']);
    });
});
// Route::view('/{any}', 'app')->where('any', '.*');
// Route::get('/', fn() => view('welcome'));
