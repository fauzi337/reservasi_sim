<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class kesehatan extends Model
{
    use HasFactory;
    protected $table = 'kesehatan_t';
    protected $guarded = ['id'];
}
