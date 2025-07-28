<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservasi extends Model
{
    use HasFactory;
    protected $table = 'reservasis';
    protected $guarded = ['id'];
    protected $fillable = [
        'tanggal_reservasi',
        'nik',
        'sim_lama',
        'nama_lengkap',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'tinggi_badan',
        'pekerjaan',
        'no_hp',
        'alamat',
        'pendidikan',
        'fotocopy',
        'kacamata',
        'cacat',
        'sertifikat',
        'lokasi',
        'jenis_perpanjangan',
    ];

}
