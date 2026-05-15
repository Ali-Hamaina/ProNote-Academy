<?php

namespace App\Helpers;

class ApiResponse
{
    /**
     * Success response with data.
     */
    public static function success($data, string $message = 'Success', int $status = 200): array
    {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];
    }

    /**
     * Success response with pagination.
     */
    public static function paginated($items, array $pagination, string $message = 'Success'): array
    {
        return [
            'success' => true,
            'message' => $message,
            'data' => $items,
            'pagination' => $pagination,
        ];
    }

    /**
     * Error response.
     */
    public static function error(string $error, array $errors = [], int $status = 400): array
    {
        return [
            'success' => false,
            'error' => $error,
            'errors' => $errors,
        ];
    }

    /**
     * Validation error response.
     */
    public static function validation(array $errors, string $message = 'Validation failed'): array
    {
        return [
            'success' => false,
            'error' => $message,
            'errors' => $errors,
        ];
    }

    /**
     * Unauthorized response.
     */
    public static function unauthorized(string $message = 'Unauthorized'): array
    {
        return [
            'success' => false,
            'error' => $message,
        ];
    }

    /**
     * Not found response.
     */
    public static function notFound(string $message = 'Resource not found'): array
    {
        return [
            'success' => false,
            'error' => $message,
        ];
    }
}
