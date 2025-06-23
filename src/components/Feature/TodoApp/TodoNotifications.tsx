// TodoNotifications.tsx - Composant notifications séparé
import React from 'react';
import AlertMessage from '../../Common/AlertMessage';

interface NotificationData {
  type: 'success' | 'error';
  message: string;
}

interface TodoNotificationsProps {
  notification: NotificationData | null;
  onClose: () => void;
}

const TodoNotifications: React.FC<TodoNotificationsProps> = ({
  notification,
  onClose
}) => {
  
  if (!notification) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      zIndex: 1000, 
      width: '90%', 
      maxWidth: '500px' 
    }}>
      <AlertMessage
        type={notification.type}
        message={notification.message}
        title={notification.type === 'error' ? 'Erreur' : 'Succès'}
        animated={true}
        animationType="slide"
        withCloseButton={true}
        onClose={onClose}
        autoClose={notification.type === 'error' ? 5000 : 3000}
        showProgress={true}
      />
    </div>
  );
};

export default TodoNotifications;