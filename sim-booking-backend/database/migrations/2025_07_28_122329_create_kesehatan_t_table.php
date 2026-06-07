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
        Schema::create('kesehatan_t', function (Blueprint $table) {
            $table->id();
            $table->string('tekanan_darah', 50)->nullable();
            $table->integer('tinggi_badan')->nullable();
            $table->integer('berat_badan')->nullable();
            $table->decimal('suhu', 4, 1)->nullable();
            $table->integer('nadi')->nullable();
            $table->integer('pernafasan')->nullable();
            $table->boolean('statusenabled')->default(true);
            $table->foreignId('reservasi_id')->nullable()->constrained('reservasis')->onDelete('cascade');
            $table->integer('no_urut')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kesehatan_t');
    }
};
