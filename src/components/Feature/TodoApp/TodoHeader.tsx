// TodoHeader.tsx - Composant header séparé
import React from 'react';
import { IconListCheck } from '@tabler/icons-react';

interface TodoHeaderProps {
  title?: string;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({ 
  title = "Todo List" 
}) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #4A90E2 0%, #50C9C3 100%)',
      color: 'white',
      padding: '3rem 0',
      textAlign: 'center',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginBottom: '2rem'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '1rem' 
      }}>
        <IconListCheck size={40} />
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          margin: 0 
        }}>
          {title}
        </h1>
      </div>
    </div>
  );
};

export default TodoHeader;