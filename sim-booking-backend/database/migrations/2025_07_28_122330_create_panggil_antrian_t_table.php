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
        Schema::create('panggil_antrian_t', function (Blueprint $table) {
            $table->id();
            $table->integer('no_urut')->nullable();
            $table->string('kdkebutuhan', 50)->nullable();
            $table->string('loket', 50)->nullable();
            $table->boolean('statusenabled')->default(true);
            $table->string('status', 50)->nullable();
            $table->foreignId('reservasi_id')->nullable()->constrained('reservasis')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('panggil_antrian_t');
    }
};
