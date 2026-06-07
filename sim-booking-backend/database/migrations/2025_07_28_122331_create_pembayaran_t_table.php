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
        Schema::create('pembayaran_t', function (Blueprint $table) {
            $table->id();
            $table->decimal('nominal', 15, 2)->nullable();
            $table->decimal('totaldibayar', 15, 2)->nullable();
            $table->decimal('kembali', 15, 2)->nullable();
            $table->boolean('statusenabled')->default(true);
            $table->foreignId('reservasi_id')->nullable()->constrained('reservasis')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran_t');
    }
};
