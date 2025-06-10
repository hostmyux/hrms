import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, BarChart, FileText, UserPlus, Star } from 'lucide-react';
import { localStorageService } from '../../services/localStorageService';
import { useUser } from '../../contexts/UserContext';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  destination: string;
  message: string;
  isFavorite: boolean;
}

interface QuickAccessCardsProps {
  onCardClick: (destination: string, message: string) => void;
}

export const QuickAccessCards: React.FC<QuickAccessCardsProps> = ({ onCardClick }) => {
  const { addAction } = useUser();
  const { speak } = useVoice();
  const [cards, setCards] = useState<QuickAccessCard[]>([
    {
      id: 'leave-management',
      title: 'Leave Management',
      description: 'Approve and manage leave requests',
      icon: <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />,
      destination: 'attendance',
      message: 'Navigating to leave management screen where you can review and manage employee leave requests.',
      isFavorite: false
    },
    {
      id: 'performance-goals',
      title: 'Performance Goals',
      description: 'Create and manage goals',
      icon: <BarChart className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />,
      destination: 'performance',
      message: 'Navigating to performance goals section where you can set and track employee objectives.',
      isFavorite: false
    },
    {
      id: 'payroll',
      title: 'Payroll',
      description: 'Process employee payments',
      icon: <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />,
      destination: 'payroll',
      message: 'Navigating to payroll management where you can run payroll processes and review compensation reports.',
      isFavorite: false
    },
    {
      id: 'recruitment',
      title: 'Recruitment',
      description: 'Manage hiring pipeline',
      icon: <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />,
      destination: 'recruitment',
      message: 'Navigating to recruitment section where you can manage job listings and review candidates.',
      isFavorite: false
    }
  ]);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedCards = localStorageService.getItem<QuickAccessCard[]>('quick_access_cards');
    
    if (savedCards && savedCards.length > 0) {
      setCards(prevCards => {
        return prevCards.map(defaultCard => {
          const savedCard = savedCards.find(sc => sc.id === defaultCard.id);
          return savedCard ? { ...defaultCard, isFavorite: savedCard.isFavorite } : defaultCard;
        });
      });
    }

    speak("Quick access cards loaded. You have four main modules available: Leave Management for handling employee time off requests, Performance Goals for setting and tracking objectives, Payroll for processing payments, and Recruitment for managing the hiring pipeline. Click the star icon on any card to add it to your favorites for priority display. Hover over cards to hear detailed descriptions of each module's capabilities.");
  }, [speak]);

  useEffect(() => {
    try {
      localStorageService.setItem('quick_access_cards', cards.map(card => ({
        id: card.id,
        isFavorite: card.isFavorite
      })));
    } catch (error) {
      console.error('Error saving card preferences:', error);
      toast.error("Unable to save your favorite card preferences");
    }
  }, [cards]);

  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      )
    );
    
    const card = cards.find(c => c.id === id);
    
    addAction({
      type: "preference",
      description: `${card?.isFavorite ? 'Removed' : 'Added'} ${card?.title} ${card?.isFavorite ? 'from' : 'to'} favorites`,
      module: "Dashboard"
    });
    
    const action = card?.isFavorite ? 'removed from' : 'added to';
    speak(`${card?.title} has been ${action} your favorites. ${card?.isFavorite ? 'This card will no longer be prioritized in your dashboard display.' : 'This card will now appear first in your quick access section for faster navigation.'}`);
    
    const favoriteAction = card?.isFavorite ? 'removed from' : 'added to';
    toast.success(`${card?.title} ${favoriteAction} favorites`);
  };

  const handleCardClick = (card: QuickAccessCard) => {
    speak(`Accessing ${card.title} module. ${card.message} This module contains comprehensive tools for ${card.description.toLowerCase()}. You'll find navigation options, data tables, and action buttons to manage all related tasks efficiently.`);
    onCardClick(card.destination, card.message);
  };

  const handleCardHover = (card: QuickAccessCard) => {
    const additionalInfo = {
      'leave-management': 'This module includes leave request approval workflows, attendance tracking, holiday management, and work-from-home coordination.',
      'performance-goals': 'Features include goal setting frameworks, progress tracking, performance reviews, employee feedback systems, and promotion management.',
      'payroll': 'Comprehensive payroll processing including salary calculations, tax deductions, benefits administration, and payslip generation.',
      'recruitment': 'Full recruitment lifecycle management with job posting creation, applicant tracking, interview scheduling, and offer management.'
    };
    
    speak(`${card.title}: ${card.description}. ${additionalInfo[card.id as keyof typeof additionalInfo]} Click to navigate to this module and explore its full functionality.`);
  };

  const sortedCards = [...cards].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {sortedCards.map((card) => (
        <Card 
          key={card.id}
          className={`cursor-pointer hover:bg-muted/50 transition-colors ${card.isFavorite ? 'border-primary ring-1 ring-primary/20' : ''}`} 
          onClick={() => handleCardClick(card)}
          onMouseEnter={() => handleCardHover(card)}
        >
          <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center relative">
            <Button
              variant="ghost" 
              size="icon"
              className={`absolute top-1 right-1 sm:top-2 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 ${card.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
              onClick={(e) => toggleFavorite(card.id, e)}
              onMouseEnter={() => speak(`Click to ${card.isFavorite ? 'remove this card from' : 'add this card to'} your favorites. Favorite cards appear first for quicker access to your most-used modules.`)}
            >
              <Star className="h-3 w-3 sm:h-4 sm:w-4" fill={card.isFavorite ? "currentColor" : "none"} />
            </Button>
            {card.icon}
            <h3 className="font-medium text-sm sm:text-base">{card.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
