
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarPlus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  List, 
  Users, 
  Calendar as CalendarIcon, 
  X,
  Filter,
  Search
} from 'lucide-react';
import { format, isSameDay, addDays, parseISO, isValid, isToday } from 'date-fns';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { EventForm } from '@/components/calendar/EventForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const isMobile = useIsMobile();

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

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
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
              <SelectItem value="">All types</SelectItem>
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
                onSelect={handleDateChange}
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
                  onClick={() => {
                    setMode(mode === 'month' ? 'day' : 'month');
                    speak(`Switched to ${mode === 'month' ? 'day' : 'month'} view`);
                  }}
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
                        onClick={() => setSelectedEvent(event)}
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

        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>
                  {mode === 'month' ? format(date, 'MMMM yyyy') : format(date, 'EEEE, MMMM d, yyyy')}
                </CardTitle>
                <CardDescription>
                  {mode === 'month' ? 'Monthly overview' : `${getDayEvents(date).length} events scheduled`}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate(prev => {
                    const newDate = new Date(prev);
                    if (mode === 'month') {
                      newDate.setMonth(newDate.getMonth() - 1);
                    } else {
                      newDate.setDate(newDate.getDate() - 1);
                    }
                    return newDate;
                  })}
                  aria-label={mode === 'month' ? "Previous month" : "Previous day"}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate(prev => {
                    const newDate = new Date(prev);
                    if (mode === 'month') {
                      newDate.setMonth(newDate.getMonth() + 1);
                    } else {
                      newDate.setDate(newDate.getDate() + 1);
                    }
                    return newDate;
                  })}
                  aria-label={mode === 'month' ? "Next month" : "Next day"}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mode === 'day' ? (
                <div className="space-y-4">
                  {getDayEvents(date).length > 0 ? (
                    getDayEvents(date).map((event) => (
                      <Card 
                        key={event.id} 
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => setSelectedEvent(event)}
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
                                  editEvent(event);
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
                      <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No events scheduled for this day</p>
                      <Button 
                        variant="outline"
                        className="mt-4"
                        onClick={addNewEvent}
                      >
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
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
                                  onClick={() => setSelectedEvent(event)}
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event details popover */}
      {selectedEvent && (
        <Popover open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <PopoverContent className="w-80" align="center">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${getEventTypeColor(selectedEvent.type)}`}>
                  {getEventTypeIcon(selectedEvent.type)}
                </div>
                <h4 className="text-base font-semibold">{selectedEvent.title}</h4>
              </div>
              <Button
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedEvent(null)}
                aria-label="Close event details"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-muted-foreground text-sm">Date & Time</p>
                <p className="font-medium">
                  {format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')} at {formatTime(new Date(selectedEvent.date))}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Description</p>
                <p>{selectedEvent.description}</p>
              </div>
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-sm">Attendees</p>
                  <ul className="list-disc list-inside">
                    {selectedEvent.attendees.map((attendee, index) => (
                      <li key={index} className="text-sm">{attendee}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="pt-2 flex justify-between">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    editEvent(selectedEvent);
                  }}
                >
                  Edit Event
                </Button>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteEvent(selectedEvent.id)}
                >
                  Delete Event
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

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
