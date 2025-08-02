import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell, Check, Trash2, MapPin, Star, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications, useUnreadNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useSpeeltuinen';
import { Notification } from '@/types/speeltuin';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { data: notifications = [] } = useNotifications(user?.id);
  const { data: unreadCount = 0 } = useUnreadNotifications(user?.id);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markRead.mutateAsync({ id: notificationId, userId: user.id });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon notificatie niet als gelezen markeren.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync(user.id);
      toast({
        title: "Alle notificaties gelezen",
        description: "Alle notificaties zijn gemarkeerd als gelezen.",
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Kon notificaties niet als gelezen markeren.",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_speeltuin':
        return <MapPin className="h-4 w-4 text-green-600" />;
      case 'review_response':
        return <Star className="h-4 w-4 text-yellow-600" />;
      case 'favorite_update':
        return <Heart className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'new_speeltuin':
        return 'border-l-green-500 bg-green-50';
      case 'review_response':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'favorite_update':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notificaties</CardTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Alles gelezen
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Geen notificaties</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border last:border-b-0 cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.is_read ? 'bg-muted/30' : ''
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      handleMarkRead(notification.id);
                    }
                    // Handle navigation based on notification type
                    if (notification.speeltuin_id) {
                      // Navigate to speeltuin
                      window.location.href = `/?speeltuin=${notification.speeltuin_id}`;
                    }
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), 'dd MMM HH:mm', { locale: nl })}
                        </span>
                        
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(notification.id);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell; 