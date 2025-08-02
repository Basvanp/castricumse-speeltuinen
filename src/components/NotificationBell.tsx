import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadNotifications, useMarkAllNotificationsRead } from '@/hooks/useSpeeltuinen';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { data: unreadNotifications = [] } = useUnreadNotifications(user?.id);
  const markAllRead = useMarkAllNotificationsRead();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync(user.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const unreadCount = unreadNotifications.length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Notificaties</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs"
                >
                  Alles als gelezen markeren
                </Button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {unreadNotifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Geen nieuwe notificaties
                </p>
              ) : (
                <div className="space-y-2">
                  {unreadNotifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                    >
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  ))}
                  {unreadNotifications.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      En {unreadNotifications.length - 5} meer...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell; 