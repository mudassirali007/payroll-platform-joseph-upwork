<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected function data(): Attribute
        {
            return Attribute::make(
                get: fn ($value) => json_decode($value, true),
                set: fn ($value) => json_encode($value),
            );
        }
}
