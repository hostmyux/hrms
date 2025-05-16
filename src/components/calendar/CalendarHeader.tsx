
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription, CardHeader } from '@/components/ui/card';

interface CalendarHeaderProps {
  date: Date;
  mode: 'month' | 'day';
  eventCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  mode,
  eventCount,
  onPrevious,
  onNext,
}) => {
  return (
    <CardHeader className="flex flex-row items-center">
      <div>
        <CardTitle>
          {mode === 'month' ? format(date, 'MMMM yyyy') : format(date, 'EEEE, MMMM d, yyyy')}
        </CardTitle>
        <CardDescription>
          {mode === 'month' ? 'Monthly overview' : `${eventCount} events scheduled`}
        </CardDescription>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          aria-label={mode === 'month' ? "Previous month" : "Previous day"}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          aria-label={mode === 'month' ? "Next month" : "Next day"}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default CalendarHeader;
