<?php

// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\BookingController;
// use App\Http\Controllers\AuthController;
// // use App\Http\Controllers\Api\ReservasiController;

// Route::get('/', function () {
//     return view('welcome');
// });

// // Route::prefix('api')->group(function () {
// //     Route::post('/bookings', [BookingController::class, 'store']);
// //     Route::get('/bookings/{id}', [BookingController::class, 'show']);
// //     Route::post('/reservasi', [ReservasiController::class, 'store']);
// // });

// Route::middleware('auth:sanctum')->prefix('api')->group(function () {
//     Route::get('/user', fn() => auth()->user());
// });

// Route::post('/login', [AuthController::class, 'login']);
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/me', fn() => Auth::user());
//     Route::post('/logout', [AuthController::class, 'logout']);

//     // Contoh: route booking yang dilindungi
//     Route::put('/booking/{id}/status', [BookingController::class, 'updateStatus']);
// });
