const StructureViewer = ({ selectedTable }) => {
  if (!selectedTable) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏗️</div>
        <div className="text-gray-600">Selecione uma tabela</div>
        <div className="text-sm text-gray-400 mt-2">Escolha uma tabela no Explorer para ver sua estrutura</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          🗃️ {selectedTable.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Database: {selectedTable.database} • {selectedTable.rows} registros
        </p>
      </div>

      {/* Columns */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">COLUNAS</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Null</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Padrão</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Extra</th>
              </tr>
            </thead>
            <tbody>
              {selectedTable.columns.map(function(column, index) {
                return (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        {column.isPrimary && <span className="text-yellow-500">🔑</span>}
                        {column.isForeign && <span className="text-blue-500">🔗</span>}
                        {column.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-blue-600">{column.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        column.nullable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {column.nullable ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono">
                      {column.defaultValue || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {column.extra || <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Indexes */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">ÍNDICES</h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Colunas</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Único</th>
              </tr>
            </thead>
            <tbody>
              {selectedTable.indexes.map(function(index, i) {
                return (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{index.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        index.type === 'PRIMARY' ? 'bg-yellow-100 text-yellow-800' :
                        index.type === 'UNIQUE' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {index.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{index.columns.join(', ')}</td>
                    <td className="px-4 py-3">
                      {index.unique ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
          📝 Query Table
        </button>
        <button className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600">
          ➕ Insert Row
        </button>
        <button className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
          🔄 Refresh
        </button>
        <button className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600">
          🗑️ Drop Table
        </button>
      </div>
    </div>
  );
};