import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { ExecutionPanel } from './ExecutionPanel';
import { useStore } from './store';
import './styles/theme.css';

function App() {
  const clearPipeline = useStore((state) => state.clearPipeline);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--gray-200)',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 10
      }}>
        <div style={{
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--gray-800)',
            margin: 0
          }}>
            Pipeline Builder
          </h1>
          <button
            onClick={clearPipeline}
            style={{
              minWidth: '120px',
              padding: '0.75rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius)',
              background: '#ef4444',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxShadow: 'var(--shadow)',
              transition: 'all var(--transition)',
              userSelect: 'none',
              border: 'none',
              cursor: 'pointer',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f87171';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
          >
            Clear Pipeline
          </button>
        </div>
        <PipelineToolbar />
      </div>
      
      {/* Main Content */}
      <PipelineUI />
      
      {/* Submit Button */}
      <SubmitButton />
      
      {/* Execution Panel */}
      <ExecutionPanel />
    </div>
  );
}

export default App;