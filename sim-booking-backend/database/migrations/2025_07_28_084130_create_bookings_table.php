<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('kode_booking')->unique();
            $table->enum('jenis_permohonan', ['baru', 'perpanjang']);
            $table->date('tanggal_booking');
            $table->integer('nomor_antrian');
            $table->enum('status', [
                'menunggu_verifikasi',
                'menunggu_kesehatan',
                'menunggu_pembayaran',
                'menunggu_foto',
                'menunggu_penyerahan',
                'selesai'
            ])->default('menunggu_verifikasi');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
