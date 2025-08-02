<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReservasiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\BookingController;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth:sanctum')->prefix('api')->group(function () {
    Route::get('/user', fn() => auth()->user());
});

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn() => Auth::user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Contoh: route booking yang dilindungi
    Route::put('/booking/{id}/status', [BookingController::class, 'updateStatus']);
});

//Modul Reservasi
Route::post('/reservasi', [ReservasiController::class, 'store']);
Route::post('/panggil-antrian', [ReservasiController::class, 'panggilAntrianKesehatan']);
Route::post('/getAntrian', [ReservasiController::class, 'getDataByNik']);

Route::get('/status-antrian', [ReservasiController::class, 'getStatusAntrian']);
Route::get('/get-status-journey', [ReservasiController::class, 'getStatusJourney']);