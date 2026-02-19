const DataGrid = ({ data, columns, loading }) => {
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(50);

  const handleSort = function(column) {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(function() {
    if (!sortColumn || !data) return data || [];
    
    return [...data].sort(function(a, b) {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal === null) return sortDirection === 'asc' ? 1 : -1;
      if (bVal === null) return sortDirection === 'asc' ? -1 : 1;
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const paginatedData = React.useMemo(function() {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil((data || []).length / pageSize);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Executando consulta...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <div className="text-gray-600">Nenhum resultado encontrado</div>
        <div className="text-sm text-gray-400 mt-2">Execute uma consulta SQL para ver os dados</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Stats */}
      <div className="flex items-center gap-4 p-3 border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
        <span>📊 {data.length} registros</span>
        <span>📋 {columns.length} colunas</span>
        <span>⏱️ Executado em 0.15s</span>
        <div className="ml-auto">
          <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
            📤 Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {columns.map(function(column) {
                return (
                  <th 
                    key={column}
                    className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-gray-200"
                    onClick={function() { handleSort(column); }}
                  >
                    <div className="flex items-center gap-2">
                      {column}
                      {sortColumn === column && (
                        <span className={`text-blue-500 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}>↑</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(function(row, index) {
              return (
                <tr key={index} className="hover:bg-gray-50 border-b border-gray-100">
                  {columns.map(function(column) {
                    const value = row[column];
                    return (
                      <td key={column} className="px-4 py-3 text-gray-700 font-mono text-xs">
                        {value === null ? (
                          <span className="text-gray-400 italic">NULL</span>
                        ) : typeof value === 'boolean' ? (
                          <span className={value ? 'text-green-600' : 'text-red-600'}>
                            {value.toString()}
                          </span>
                        ) : typeof value === 'number' ? (
                          <span className="text-blue-600">{value}</span>
                        ) : (
                          String(value)
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Página {currentPage} de {totalPages} • Mostrando {paginatedData.length} de {data.length} registros
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={function() { setCurrentPage(1); }}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              ⏮️
            </button>
            <button 
              onClick={function() { setCurrentPage(Math.max(1, currentPage - 1)); }}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              ◀️
            </button>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
              {currentPage}
            </span>
            <button 
              onClick={function() { setCurrentPage(Math.min(totalPages, currentPage + 1)); }}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              ▶️
            </button>
            <button 
              onClick={function() { setCurrentPage(totalPages); }}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              ⏭️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};