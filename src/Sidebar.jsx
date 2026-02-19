const Sidebar = ({ activeTab, setActiveTab, databases, selectedDb, setSelectedDb, tables, setSelectedTable }) => {
  const [expandedNodes, setExpandedNodes] = React.useState({});

  const toggleNode = function(path) {
    setExpandedNodes(function(prev) {
      return { ...prev, [path]: !prev[path] };
    });
  };

  const menuItems = [
    { id: 'explorer', icon: '🗂️', label: 'Explorer' },
    { id: 'query', icon: '📝', label: 'Query' },
    { id: 'data', icon: '📊', label: 'Data' },
    { id: 'structure', icon: '🏗️', label: 'Structure' },
    { id: 'connections', icon: '🔗', label: 'Connections' }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Menu Tabs */}
      <div className="flex border-b border-gray-200">
        {menuItems.map(function(item) {
          return (
            <button
              key={item.id}
              onClick={function() { setActiveTab(item.id); }}
              className={`flex-1 px-3 py-2 text-xs font-medium border-r border-gray-200 last:border-r-0 ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-b-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div>{item.icon}</div>
              <div>{item.label}</div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === 'explorer' && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">DATABASE EXPLORER</div>
            {databases.map(function(db) {
              const isExpanded = expandedNodes[db.name];
              return (
                <div key={db.name} className="mb-2">
                  <div 
                    className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-gray-50 ${
                      selectedDb === db.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                    onClick={function() {
                      setSelectedDb(db.name);
                      toggleNode(db.name);
                    }}
                  >
                    <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                    <span>💾</span>
                    <span className="font-medium">{db.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{db.type}</span>
                  </div>
                  
                  {isExpanded && (
                    <div className="ml-6 mt-1">
                      <div 
                        className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 rounded"
                        onClick={function() { toggleNode(db.name + '/tables'); }}
                      >
                        <span className={`text-xs transition-transform ${expandedNodes[db.name + '/tables'] ? 'rotate-90' : ''}`}>▶</span>
                        <span>📋</span>
                        <span>Tables ({tables.filter(function(t) { return t.database === db.name; }).length})</span>
                      </div>
                      
                      {expandedNodes[db.name + '/tables'] && (
                        <div className="ml-6 mt-1">
                          {tables.filter(function(t) { return t.database === db.name; }).map(function(table) {
                            return (
                              <div 
                                key={table.name}
                                className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 rounded"
                                onClick={function() { setSelectedTable(table); }}
                              >
                                <span>🗃️</span>
                                <span>{table.name}</span>
                                <span className="text-xs text-gray-400 ml-auto">{table.rows}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'connections' && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">CONNECTIONS</div>
            <button className="w-full mb-3 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              + New Connection
            </button>
            {databases.map(function(db) {
              return (
                <div key={db.name} className="flex items-center gap-3 p-2 border border-gray-200 rounded mb-2 hover:bg-gray-50">
                  <div className={`w-3 h-3 rounded-full ${db.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{db.name}</div>
                    <div className="text-xs text-gray-500">{db.host}:{db.port}</div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">⚙️</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};