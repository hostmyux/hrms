
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { Event } from '@/pages/Calendar';
import { Users, List, Clock } from 'lucide-react';

interface DayViewProps {
  date: Date;
  events: Event[];
  filterType: string | null;
  searchTerm: string;
  onSelectEvent: (event: Event) => void;
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  filterType,
  searchTerm,
  onSelectEvent,
  onAddEvent,
  onEditEvent,
}) => {
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

  const dayEvents = getDayEvents(date);

  return (
    <div className="space-y-4">
      {dayEvents.length > 0 ? (
        dayEvents.map((event) => (
          <Card 
            key={event.id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onSelectEvent(event)}
          >
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-full ${getEventTypeColor(event.type)}`}>
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {formatTime(new Date(event.date))}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(event);
                    }}
                    aria-label={`Edit ${event.title}`}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-32">
          <Clock className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No events scheduled for this day</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={onAddEvent}
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      )}
    </div>
  );
};

export default DayView;
