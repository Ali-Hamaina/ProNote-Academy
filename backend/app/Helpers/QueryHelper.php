<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;

class QueryHelper
{
    /**
     * Apply common filters - search, date range, status, sorting, pagination.
     */
    public static function applyFilters(Builder $query, array $filters, array $searchFields = []): Builder
    {
        // Search filter
        if (!empty($filters['search']) && !empty($searchFields)) {
            $query->where(function ($q) use ($filters, $searchFields) {
                foreach ($searchFields as $field) {
                    $q->orWhere($field, 'ilike', "%{$filters['search']}%");
                }
            });
        }

        // Status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Role filter
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        // Date range filter
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $column = $filters['date_column'] ?? 'created_at';
            $query->whereBetween($column, [$filters['start_date'], $filters['end_date']]);
        }

        // Type filter
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // Sorting
        if (!empty($filters['sort_by']) && !empty($filters['sort_order'])) {
            $query->orderBy($filters['sort_by'], $filters['sort_order']);
        }

        return $query;
    }

    /**
     * Get pagination params from request.
     */
    public static function getPaginationParams(array $params): array
    {
        return [
            'page' => $params['page'] ?? 1,
            'per_page' => min($params['per_page'] ?? 15, 100),
        ];
    }

    /**
     * Format paginated response.
     */
    public static function formatPaginatedResponse($paginated): array
    {
        return [
            'data' => $paginated->items(),
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ]
        ];
    }
}
