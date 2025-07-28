<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'jenis_permohonan' => 'required|in:baru,perpanjang',
            'tanggal_booking' => 'required|date',
        ]);

        $user = $request->user(); // via Sanctum (jika sudah setup)

        // Hitung nomor antrian
        $nomor = \App\Models\Booking::whereDate('tanggal_booking', $request->tanggal_booking)->count() + 1;

        $booking = Booking::create([
            'user_id' => $user->id,
            'kode_booking' => strtoupper(Str::random(8)),
            'jenis_permohonan' => $request->jenis_permohonan,
            'tanggal_booking' => $request->tanggal_booking,
            'nomor_antrian' => $nomor,
        ]);

        return response()->json($booking, 201);
    }

}
