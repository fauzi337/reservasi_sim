<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanggilAntrian extends Model
{
    use HasFactory;
    protected $table = 'panggil_antrian_t';
    protected $guarded = ['id'];
    // protected $fillable = [
    // 'id',
    // 'no_urut',
    // 'kdkebutuhan',
    // 'loket',
    // 'status',
    // 'created_at',
    // 'updated_at',
    // 'statusenabled'
    // ];

}
