<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    /**
     * Apply search filters to query.
     */
    public function scopeSearch(Builder $query, ?string $search, array $fields = []): Builder
    {
        if (!$search || empty($fields)) {
            return $query;
        }

        return $query->where(function ($q) use ($search, $fields) {
            foreach ($fields as $field) {
                $q->orWhere($field, 'ilike', "%{$search}%");
            }
        });
    }

    /**
     * Apply date range filter.
     */
    public function scopeFilterByDate(Builder $query, ?string $startDate, ?string $endDate, string $column = 'created_at'): Builder
    {
        if ($startDate) {
            $query->whereDate($column, '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate($column, '<=', $endDate);
        }

        return $query;
    }

    /**
     * Apply status filter.
     */
    public function scopeFilterByStatus(Builder $query, ?string $status, string $column = 'status'): Builder
    {
        if ($status) {
            $query->where($column, $status);
        }

        return $query;
    }

    /**
     * Apply sorting.
     */
    public function scopeSortBy(Builder $query, ?string $sortField = null, string $sortOrder = 'asc'): Builder
    {
        if ($sortField && in_array($sortField, $this->fillable)) {
            $query->orderBy($sortField, $sortOrder);
        }

        return $query;
    }
}
