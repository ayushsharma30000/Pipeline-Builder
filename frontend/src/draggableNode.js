// draggableNode.js
export const DraggableNode = ({ type, label }) => {
    const nodeColors = {
        customInput: { bg: '#3b82f6', light: '#60a5fa' },
        customOutput: { bg: '#10b981', light: '#34d399' },
        llm: { bg: '#f59e0b', light: '#fbbf24' },
        text: { bg: '#8b5cf6', light: '#a78bfa' },
        apiCall: { bg: '#ef4444', light: '#f87171' },
        dataTransform: { bg: '#6366f1', light: '#818cf8' },
        conditional: { bg: '#eab308', light: '#facc15' },
        loop: { bg: '#a855f7', light: '#c084fc' },
        database: { bg: '#14b8a6', light: '#2dd4bf' }
    };

    const color = nodeColors[type] || { bg: '#6b7280', light: '#9ca3af' };

    const onDragStart = (event, nodeType) => {
        const appData = { nodeType }
        event.target.style.cursor = 'grabbing';
        event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className={type}
            onDragStart={(event) => onDragStart(event, type)}
            onDragEnd={(event) => (event.target.style.cursor = 'grab')}
            style={{ 
                cursor: 'grab',
                minWidth: '120px',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius)',
                background: color.bg,
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: 'var(--shadow)',
                transition: 'all var(--transition)',
                userSelect: 'none',
                transform: 'translateY(0)'
            }}
            draggable
            onMouseEnter={(e) => {
                e.currentTarget.style.background = color.light;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = color.bg;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
        >
            <span>{label}</span>
        </div>
    );
};