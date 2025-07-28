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
        Schema::create('reservasis', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_reservasi');
            $table->string('nik', 16);
            $table->string('sim_lama', 15);
            $table->string('nama_lengkap');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->integer('tinggi_badan');
            $table->string('pekerjaan');
            $table->string('no_hp');
            $table->text('alamat');
            $table->string('pendidikan');
            $table->string('fotocopy');
            $table->string('kacamata');
            $table->string('cacat');
            $table->string('sertifikat');
            $table->string('lokasi');
            $table->string('jenis_perpanjangan');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservasis');
    }
};
