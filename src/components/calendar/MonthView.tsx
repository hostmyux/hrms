
import React from 'react';
import { format, isSameDay, addDays, isToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/pages/Calendar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, List, Clock } from 'lucide-react';

interface MonthViewProps {
  date: Date;
  events: Event[];
  filterType: string | null;
  searchTerm: string;
  onSelectEvent: (event: Event) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  filterType,
  searchTerm,
  onSelectEvent,
}) => {
  const isMobile = useIsMobile();

  const getDayEvents = (day: Date) => {
    return events
      .filter(event => isSameDay(new Date(event.date), day))
      .filter(event => {
        if (searchTerm) {
          return event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 event.description.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      })
      .filter(event => {
        if (filterType) {
          return event.type === filterType;
        }
        return true;
      });
  };

  const getEventTypeIcon = (type: string) => {
    switch(type) {
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'task': return <List className="h-4 w-4" />;
      case 'reminder': 
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'task': return 'bg-green-100 text-green-700 border-green-200';
      case 'reminder': 
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isMobile ? '1' : '3'} gap-4`}>
      {[...Array(7)].map((_, index) => {
        const day = addDays(date, index);
        const dayEvents = getDayEvents(day);
        
        return (
          <Card 
            key={index} 
            className={isSameDay(day, new Date()) ? "border-primary" : ""}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{format(day, 'EEEE, MMM d')}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0 max-h-[230px] overflow-y-auto">
              {dayEvents.length > 0 ? (
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="p-2 text-sm rounded-md cursor-pointer hover:bg-accent/50 transition-colors flex items-start gap-2"
                      onClick={() => onSelectEvent(event)}
                    >
                      <div className={`mt-0.5 p-1 rounded-full ${getEventTypeColor(event.type)}`}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(new Date(event.date))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-center py-4 text-muted-foreground">No events</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MonthView;
