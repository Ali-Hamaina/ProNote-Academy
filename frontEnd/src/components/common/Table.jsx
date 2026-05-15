import { Inbox } from 'lucide-react';

const Table = ({
    columns,
    data,
    loading = false,
    emptyMessage = 'No data available',
    onRowClick,
    className = '',
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                    <div className="custom-spinner border-primary border-t-transparent size-8" />
                    <p className="text-sm text-slate-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`
                                    px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400
                                    ${column.align === 'right' ? 'text-right' : ''}
                                    ${column.align === 'center' ? 'text-center' : ''}
                                `}
                                style={{ width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-16 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                                    <p className="text-slate-400 font-medium">{emptyMessage}</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick?.(row, rowIndex)}
                                className={`
                                    hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors
                                    ${onRowClick ? 'cursor-pointer' : ''}
                                `}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`
                                            px-6 py-4 text-sm text-slate-600 dark:text-slate-400
                                            ${column.align === 'right' ? 'text-right' : ''}
                                            ${column.align === 'center' ? 'text-center' : ''}
                                        `}
                                    >
                                        {column.render
                                            ? column.render(row[column.accessor], row, rowIndex)
                                            : row[column.accessor]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
