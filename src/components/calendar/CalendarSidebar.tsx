
import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { Event } from '@/pages/Calendar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, List, Clock } from 'lucide-react';

interface CalendarSidebarProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
  mode: 'month' | 'day';
  onModeToggle: () => void;
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onAddEvent: () => void;
  filteredEvents: Event[];
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  date,
  onDateChange,
  mode,
  onModeToggle,
  events,
  onSelectEvent,
  filteredEvents,
}) => {
  const isMobile = useIsMobile();

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
    <div className="lg:w-64 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a date to view events</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={onDateChange}
            className="border rounded-md pointer-events-auto"
            components={{
              DayContent: (props) => {
                const day = new Date(props.date);
                const hasEvents = events.some(event => isSameDay(new Date(event.date), day));
                return (
                  <div className="relative flex items-center justify-center">
                    <div className={isToday(day) ? "font-bold" : ""}>{format(day, 'd')}</div>
                    {hasEvents && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"/>
                    )}
                  </div>
                );
              }
            }}
          />
          <div className="mt-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={onModeToggle}
              aria-label={`Switch to ${mode === 'month' ? 'day' : 'month'} view`}
            >
              <CalendarIcon className="h-4 w-4" />
              {mode === 'month' ? 'Day View' : 'Month View'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {!isMobile && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 3 events</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {filteredEvents.length > 0 ? (
              <div className="space-y-2">
                {filteredEvents.slice(0, 3).map((event) => (
                  <div 
                    key={event.id}
                    className="p-2 text-sm rounded-md cursor-pointer hover:bg-accent/50 transition-colors flex items-start gap-2"
                    onClick={() => onSelectEvent(event)}
                  >
                    <div className={`mt-0.5 p-1 rounded-full ${getEventTypeColor(event.type)}`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.date), 'MMM d, yyyy')} at {formatTime(new Date(event.date))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center py-4 text-muted-foreground">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarSidebar;
