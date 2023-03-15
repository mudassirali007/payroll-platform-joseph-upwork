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
        Schema::create('invoices', function (Blueprint $table) {
         $table->id();
         $table->string('currency');
         $table->integer('quantity')->default('1');
         $table->string('creationDate');
         $table->string('unit_price');
         $table->string('invoice_number');
         $table->string('invoice_id');
         $table->string('request_id');
         $table->string('payment_address');
         $table->string('payment_currency');
         $table->json('data')->nullable();
         $table->json('dataOnChain')->nullable();
         $table->foreignId('employee_id')
                                     ->constrained()
                                     ->onUpdate('cascade')
                                     ->onDelete('cascade');
         $table->foreignId('user_id')
                                ->constrained()
                                ->onUpdate('cascade')
                                ->onDelete('cascade');
         $table->timestamp('created_at')->useCurrent();
         $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
         $table->softDeletes();
         });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
