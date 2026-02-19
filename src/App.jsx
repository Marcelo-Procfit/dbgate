const App = () => {
  const [activeTab, setActiveTab] = React.useState('explorer');
  const [selectedDb, setSelectedDb] = React.useState('ecommerce_db');
  const [selectedTable, setSelectedTable] = React.useState(null);
  const [queryResults, setQueryResults] = React.useState(null);
  const [queryLoading, setQueryLoading] = React.useState(false);

  // Mock databases
  const [databases] = React.useState([
    { 
      name: 'ecommerce_db', 
      type: 'PostgreSQL', 
      host: 'localhost', 
      port: 5432, 
      connected: true 
    },
    { 
      name: 'analytics_db', 
      type: 'MySQL', 
      host: '192.168.1.100', 
      port: 3306, 
      connected: true 
    },
    { 
      name: 'logs_db', 
      type: 'MongoDB', 
      host: 'cluster.mongodb.net', 
      port: 27017, 
      connected: false 
    }
  ]);

  // Mock tables
  const [tables] = React.useState([
    {
      name: 'usuarios',
      database: 'ecommerce_db',
      rows: '1.2K',
      columns: [
        { name: 'id', type: 'SERIAL', nullable: false, isPrimary: true, defaultValue: 'AUTO_INCREMENT' },
        { name: 'nome', type: 'VARCHAR(100)', nullable: false },
        { name: 'email', type: 'VARCHAR(255)', nullable: false },
        { name: 'senha', type: 'VARCHAR(255)', nullable: false },
        { name: 'ativo', type: 'BOOLEAN', nullable: false, defaultValue: 'true' },
        { name: 'data_criacao', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
        { name: 'data_atualizacao', type: 'TIMESTAMP', nullable: true }
      ],
      indexes: [
        { name: 'PRIMARY', type: 'PRIMARY', columns: ['id'], unique: true },
        { name: 'idx_email', type: 'UNIQUE', columns: ['email'], unique: true },
        { name: 'idx_nome', type: 'INDEX', columns: ['nome'], unique: false }
      ]
    },
    {
      name: 'produtos',
      database: 'ecommerce_db',
      rows: '856',
      columns: [
        { name: 'id', type: 'SERIAL', nullable: false, isPrimary: true },
        { name: 'nome', type: 'VARCHAR(200)', nullable: false },
        { name: 'descricao', type: 'TEXT', nullable: true },
        { name: 'preco', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'categoria_id', type: 'INTEGER', nullable: false, isForeign: true },
        { name: 'estoque', type: 'INTEGER', nullable: false, defaultValue: '0' },
        { name: 'ativo', type: 'BOOLEAN', nullable: false, defaultValue: 'true' }
      ],
      indexes: [
        { name: 'PRIMARY', type: 'PRIMARY', columns: ['id'], unique: true },
        { name: 'fk_categoria', type: 'INDEX', columns: ['categoria_id'], unique: false },
        { name: 'idx_preco', type: 'INDEX', columns: ['preco'], unique: false }
      ]
    },
    {
      name: 'pedidos',
      database: 'ecommerce_db',
      rows: '3.4K',
      columns: [
        { name: 'id', type: 'SERIAL', nullable: false, isPrimary: true },
        { name: 'usuario_id', type: 'INTEGER', nullable: false, isForeign: true },
        { name: 'total', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'status', type: 'VARCHAR(50)', nullable: false, defaultValue: 'pendente' },
        { name: 'data_pedido', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP' }
      ],
      indexes: [
        { name: 'PRIMARY', type: 'PRIMARY', columns: ['id'], unique: true },
        { name: 'fk_usuario', type: 'INDEX', columns: ['usuario_id'], unique: false },
        { name: 'idx_status', type: 'INDEX', columns: ['status'], unique: false }
      ]
    },
    {
      name: 'vendas',
      database: 'analytics_db',
      rows: '25.8K',
      columns: [
        { name: 'id', type: 'INT', nullable: false, isPrimary: true },
        { name: 'produto', type: 'VARCHAR(100)', nullable: false },
        { name: 'valor', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'data_venda', type: 'DATE', nullable: false }
      ],
      indexes: [
        { name: 'PRIMARY', type: 'PRIMARY', columns: ['id'], unique: true }
      ]
    }
  ]);

  const handleRunQuery = function(query) {
    setQueryLoading(true);
    
    return new Promise(function(resolve) {
      setTimeout(function() {
        // Mock results based on query
        let mockData = [];
        let columns = [];
        
        if (query.toLowerCase().includes('usuarios')) {
          columns = ['id', 'nome', 'email', 'ativo', 'data_criacao'];
          mockData = [
            { id: 1, nome: 'João Silva', email: 'joao@email.com', ativo: true, data_criacao: '2024-01-15 10:30:00' },
            { id: 2, nome: 'Maria Santos', email: 'maria@email.com', ativo: true, data_criacao: '2024-01-16 14:22:15' },
            { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', ativo: false, data_criacao: '2024-01-17 09:45:30' },
            { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', ativo: true, data_criacao: '2024-01-18 16:15:45' },
            { id: 5, nome: 'Carlos Ferreira', email: 'carlos@email.com', ativo: true, data_criacao: '2024-01-19 11:30:20' }
          ];
        } else if (query.toLowerCase().includes('produtos')) {
          columns = ['id', 'nome', 'preco', 'estoque', 'ativo'];
          mockData = [
            { id: 1, nome: 'Notebook Dell', preco: 2499.99, estoque: 15, ativo: true },
            { id: 2, nome: 'Mouse Logitech', preco: 89.90, estoque: 45, ativo: true },
            { id: 3, nome: 'Teclado Mecânico', preco: 299.99, estoque: 23, ativo: true },
            { id: 4, nome: 'Monitor 24"', preco: 799.99, estoque: 8, ativo: false },
            { id: 5, nome: 'Webcam HD', preco: 199.99, estoque: 32, ativo: true }
          ];
        } else {
          columns = ['resultado'];
          mockData = [
            { resultado: 'Query executada com sucesso!' }
          ];
        }
        
        setQueryResults({ data: mockData, columns });
        setQueryLoading(false);
        resolve();
      }, 1500);
    });
  };

  const handleTableSelect = function(table) {
    setSelectedTable(table);
    setActiveTab('structure');
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        databases={databases}
        selectedDb={selectedDb}
        setSelectedDb={setSelectedDb}
        tables={tables}
        setSelectedTable={handleTableSelect}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                DB
              </div>
              <span className="font-semibold text-gray-800">DBGate Pro</span>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <button className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                🔄 Refresh
              </button>
              <button className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'explorer' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">🗂️</div>
                <div className="text-xl font-medium text-gray-700 mb-2">Database Explorer</div>
                <div className="text-gray-500">
                  Explore suas bases de dados na barra lateral
                </div>
              </div>
            </div>
          )}

          {activeTab === 'query' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 border-b border-gray-200">
                <QueryEditor onRunQuery={handleRunQuery} />
              </div>
              <div className="flex-1">
                <DataGrid 
                  data={queryResults?.data} 
                  columns={queryResults?.columns} 
                  loading={queryLoading}
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="h-full">
              <DataGrid 
                data={queryResults?.data} 
                columns={queryResults?.columns} 
                loading={queryLoading}
              />
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="h-full overflow-auto">
              <StructureViewer selectedTable={selectedTable} />
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">🔗</div>
                <div className="text-xl font-medium text-gray-700 mb-2">Gerenciar Conexões</div>
                <div className="text-gray-500">
                  Configure suas conexões na barra lateral
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};