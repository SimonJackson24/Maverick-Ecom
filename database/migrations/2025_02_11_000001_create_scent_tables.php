<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScentTables extends Migration
{
    public function up()
    {
        // Scent Categories
        Schema::create('scent_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('parent_id')
                  ->references('id')
                  ->on('scent_categories')
                  ->onDelete('cascade');
        });

        // Scent Notes
        Schema::create('scent_notes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('category_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')
                  ->references('id')
                  ->on('scent_categories')
                  ->onDelete('cascade');
        });

        // Customer Scent Preferences
        Schema::create('customer_scent_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->json('favorite_notes');
            $table->json('avoided_notes');
            $table->json('preferred_intensity');
            $table->json('seasonal_preferences');
            $table->timestamps();

            $table->foreign('customer_id')
                  ->references('id')
                  ->on('customers')
                  ->onDelete('cascade');
        });

        // Product Scent Profiles
        Schema::create('product_scent_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('product_sku')->unique();
            $table->json('primary_notes');
            $table->json('middle_notes');
            $table->json('base_notes');
            $table->enum('intensity', ['LIGHT', 'MODERATE', 'STRONG']);
            $table->json('mood');
            $table->json('season');
            $table->timestamps();

            $table->index('product_sku');
        });

        // Similar Scents
        Schema::create('similar_scents', function (Blueprint $table) {
            $table->id();
            $table->string('product_sku');
            $table->string('similar_product_sku');
            $table->float('match_score');
            $table->string('match_reason');
            $table->timestamps();

            $table->unique(['product_sku', 'similar_product_sku']);
            $table->index(['product_sku', 'match_score']);
        });

        // Scent Search Index
        Schema::create('scent_search_index', function (Blueprint $table) {
            $table->id();
            $table->string('product_sku');
            $table->text('searchable_text');
            $table->json('indexed_attributes');
            $table->timestamp('last_indexed_at');

            $table->unique('product_sku');
            $table->fulltext('searchable_text');
        });
    }

    public function down()
    {
        Schema::dropIfExists('scent_search_index');
        Schema::dropIfExists('similar_scents');
        Schema::dropIfExists('product_scent_profiles');
        Schema::dropIfExists('customer_scent_preferences');
        Schema::dropIfExists('scent_notes');
        Schema::dropIfExists('scent_categories');
    }
}
