const QueryEditor = ({ onRunQuery }) => {
  const [query, setQuery] = React.useState('SELECT * FROM usuarios LIMIT 10;');
  const [isRunning, setIsRunning] = React.useState(false);

  const handleRunQuery = function() {
    if (isRunning) return;
    
    setIsRunning(true);
    
    Promise.resolve(onRunQuery(query))
      .then(function() {
        setIsRunning(false);
      })
      .catch(function() {
        setIsRunning(false);
      });
  };

  const handleKeyDown = function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
        <button 
          onClick={handleRunQuery}
          disabled={isRunning}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded ${
            isRunning 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isRunning ? '⏳' : '▶️'} Run Query
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
          💾 Save
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600">
          📋 Format
        </button>
        <div className="ml-auto text-xs text-gray-500">
          Ctrl+Enter to run • F5 to refresh
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          value={query}
          onChange={function(e) { setQuery(e.target.value); }}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 pl-16 font-mono text-sm border-none resize-none focus:outline-none bg-gray-900 text-green-400"
          placeholder="-- Digite sua consulta SQL aqui
SELECT * FROM tabela WHERE coluna = 'valor';

-- Use Ctrl+Enter para executar"
          spellCheck="false"
        />
        
        {/* Line numbers */}
        <div className="absolute left-0 top-0 w-12 h-full bg-gray-800 text-gray-500 text-sm font-mono pt-4 pl-2 pointer-events-none border-r border-gray-700">
          {query.split('\n').map(function(_, index) {
            return (
              <div key={index} className="leading-6 text-right pr-2">{index + 1}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};