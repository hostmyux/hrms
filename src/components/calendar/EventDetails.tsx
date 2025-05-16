
import React from 'react';
import { format } from 'date-fns';
import { X, Users, List, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Event } from '@/pages/Calendar';

interface EventDetailsProps {
  event: Event | null;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!event) return null;

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
    <Popover open={!!event} onOpenChange={onClose}>
      <PopoverContent className="w-80" align="center">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${getEventTypeColor(event.type)}`}>
              {getEventTypeIcon(event.type)}
            </div>
            <h4 className="text-base font-semibold">{event.title}</h4>
          </div>
          <Button
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            aria-label="Close event details"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-muted-foreground text-sm">Date & Time</p>
            <p className="font-medium">
              {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} at {formatTime(new Date(event.date))}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Description</p>
            <p>{event.description}</p>
          </div>
          {event.attendees && event.attendees.length > 0 && (
            <div>
              <p className="text-muted-foreground text-sm">Attendees</p>
              <ul className="list-disc list-inside">
                {event.attendees.map((attendee, index) => (
                  <li key={index} className="text-sm">{attendee}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="pt-2 flex justify-between">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onEdit(event)}
            >
              Edit Event
            </Button>
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => onDelete(event.id)}
            >
              Delete Event
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EventDetails;
