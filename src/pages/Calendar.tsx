
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Search } from 'lucide-react';
import { format, isSameDay, addDays } from 'date-fns';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import refactored components
import CalendarSidebar from '@/components/calendar/CalendarSidebar';
import MonthView from '@/components/calendar/MonthView';
import DayView from '@/components/calendar/DayView';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import EventDetails from '@/components/calendar/EventDetails';
import { EventForm } from '@/components/calendar/EventForm';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  type: 'meeting' | 'task' | 'reminder';
  attendees?: string[];
}

const Calendar: React.FC = () => {
  const { speak } = useVoice();
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [mode, setMode] = useState<'month' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  // Sample event data
  useEffect(() => {
    const today = new Date();
    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'Team Meeting',
        description: 'Weekly team status update meeting',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
        type: 'meeting',
        attendees: ['John Doe', 'Jane Smith', 'Robert Johnson']
      },
      {
        id: '2',
        title: 'Project Deadline',
        description: 'Final submission for the Q2 project',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 18, 0),
        type: 'task'
      },
      {
        id: '3',
        title: 'Performance Review',
        description: 'Annual performance review with manager',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
        type: 'meeting',
        attendees: ['Jane Smith']
      },
      {
        id: '4',
        title: 'Training Session',
        description: 'New compliance training',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0),
        type: 'reminder'
      },
      {
        id: '5',
        title: 'Budget Planning',
        description: 'Q3 budget planning meeting',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 9, 0),
        type: 'meeting',
        attendees: ['Robert Johnson', 'Alice Williams', 'David Brown']
      }
    ];

    setEvents(sampleEvents);
    speak("Calendar page loaded. You have 5 upcoming events this week. Use the controls to add new events, switch between month and day view, or search for specific events.");
  }, [speak]);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      speak(`Date changed to ${format(newDate, 'MMMM d, yyyy')}`);
    }
  };

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

  const addNewEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
    speak("Adding a new event. Please fill in the event details.");
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setSelectedEvent(null);
    setShowEventForm(true);
    speak("Editing event. You can modify the event details.");
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === editingEvent.id ? { ...eventData, id: event.id } : event
      );
      setEvents(updatedEvents);
      toast.success("Event updated successfully");
      speak("Event has been updated successfully");
    } else {
      // Add new event
      const newEvent: Event = {
        ...eventData,
        id: (events.length + 1).toString(),
      };
      setEvents([...events, newEvent]);
      toast.success("New event added");
      speak("New event has been added to your calendar");
    }
    setShowEventForm(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    setSelectedEvent(null);
    toast.success("Event deleted");
    speak("Event has been deleted from your calendar");
  };

  const handlePreviousDate = () => {
    setDate(prev => {
      const newDate = new Date(prev);
      if (mode === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  };

  const handleNextDate = () => {
    setDate(prev => {
      const newDate = new Date(prev);
      if (mode === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };

  const toggleCalendarMode = () => {
    setMode(mode === 'month' ? 'day' : 'month');
    speak(`Switched to ${mode === 'month' ? 'day' : 'month'} view`);
  };

  const filteredEvents = events.filter(event => {
    let match = true;
    
    if (searchTerm) {
      match = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              event.description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    if (match && filterType) {
      match = event.type === filterType;
    }
    
    return match;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your schedule and events.
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search events"
            />
          </div>
        </div>
        <div className="w-[150px]">
          <Select value={filterType || ""} onValueChange={(value) => setFilterType(value || null)}>
            <SelectTrigger aria-label="Filter by type">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="reminder">Reminders</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="whitespace-nowrap"
          onClick={addNewEvent}
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Sidebar */}
        <CalendarSidebar 
          date={date}
          onDateChange={handleDateChange}
          mode={mode}
          onModeToggle={toggleCalendarMode}
          events={events}
          onSelectEvent={setSelectedEvent}
          onAddEvent={addNewEvent}
          filteredEvents={filteredEvents}
        />

        {/* Main Calendar Content */}
        <div className="flex-1">
          <Card className="h-full">
            <CalendarHeader 
              date={date}
              mode={mode}
              eventCount={getDayEvents(date).length}
              onPrevious={handlePreviousDate}
              onNext={handleNextDate}
            />
            <CardContent>
              {mode === 'day' ? (
                <DayView 
                  date={date}
                  events={events}
                  filterType={filterType}
                  searchTerm={searchTerm}
                  onSelectEvent={setSelectedEvent}
                  onAddEvent={addNewEvent}
                  onEditEvent={editEvent}
                />
              ) : (
                <MonthView 
                  date={date}
                  events={events}
                  filterType={filterType}
                  searchTerm={searchTerm}
                  onSelectEvent={setSelectedEvent}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event details popover */}
      <EventDetails
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={editEvent}
        onDelete={deleteEvent}
      />

      {/* Event form */}
      <EventForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
      />
    </div>
  );
};

export default Calendar;
