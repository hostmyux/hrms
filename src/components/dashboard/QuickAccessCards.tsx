
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
      icon: <Calendar className="h-8 w-8 text-primary mb-2" />,
      destination: 'attendance',
      message: 'Navigating to leave management screen where you can review and manage employee leave requests.',
      isFavorite: false
    },
    {
      id: 'performance-goals',
      title: 'Performance Goals',
      description: 'Create and manage goals',
      icon: <BarChart className="h-8 w-8 text-primary mb-2" />,
      destination: 'performance',
      message: 'Navigating to performance goals section where you can set and track employee objectives.',
      isFavorite: false
    },
    {
      id: 'payroll',
      title: 'Payroll',
      description: 'Process employee payments',
      icon: <FileText className="h-8 w-8 text-primary mb-2" />,
      destination: 'payroll',
      message: 'Navigating to payroll management where you can run payroll processes and review compensation reports.',
      isFavorite: false
    },
    {
      id: 'recruitment',
      title: 'Recruitment',
      description: 'Manage hiring pipeline',
      icon: <UserPlus className="h-8 w-8 text-primary mb-2" />,
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
        // Merge saved preferences with default cards
        return prevCards.map(defaultCard => {
          const savedCard = savedCards.find(sc => sc.id === defaultCard.id);
          return savedCard ? { ...defaultCard, isFavorite: savedCard.isFavorite } : defaultCard;
        });
      });
    }

    // Voice training for quick access cards
    speak("Quick access cards loaded. These cards provide shortcuts to frequently used HR modules. You can favorite cards by clicking the star icon.");
  }, [speak]);

  // Save preferences whenever they change
  useEffect(() => {
    try {
      localStorageService.setItem('quick_access_cards', cards.map(card => ({
        id: card.id,
        isFavorite: card.isFavorite
      })));
    } catch (error) {
      console.error('Error saving card preferences:', error);
      toast('Error saving preferences', {
        description: 'Unable to save your favorite card preferences'
      });
    }
  }, [cards]);

  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      )
    );
    
    // Get the card that was toggled
    const card = cards.find(c => c.id === id);
    
    // Log the action
    addAction({
      type: "preference",
      description: `${card?.isFavorite ? 'Removed' : 'Added'} ${card?.title} ${card?.isFavorite ? 'from' : 'to'} favorites`,
      module: "Dashboard"
    });
    
    // Voice feedback
    const action = card?.isFavorite ? 'removed from' : 'added to';
    speak(`${card?.title} ${action} favorites`);
    
    // Toast notification
    toast(`${card?.title} ${card?.isFavorite ? 'removed from' : 'added to'} favorites`);
  };

  const handleCardClick = (card: QuickAccessCard) => {
    speak(`Clicking on ${card.title}. ${card.message}`);
    onCardClick(card.destination, card.message);
  };

  const handleCardHover = (card: QuickAccessCard) => {
    speak(`${card.title}: ${card.description}. Click to navigate to this module.`);
  };

  // Sort cards to show favorites first
  const sortedCards = [...cards].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {sortedCards.map((card) => (
        <Card 
          key={card.id}
          className={`cursor-pointer hover:bg-muted/50 transition-colors ${card.isFavorite ? 'border-primary' : ''}`} 
          onClick={() => handleCardClick(card)}
          onMouseEnter={() => handleCardHover(card)}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center text-center relative">
            <Button
              variant="ghost" 
              size="icon"
              className={`absolute top-2 right-2 h-8 w-8 ${card.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
              onClick={(e) => toggleFavorite(card.id, e)}
              onMouseEnter={() => speak('Click to toggle favorite status')}
            >
              <Star className="h-4 w-4" fill={card.isFavorite ? "currentColor" : "none"} />
            </Button>
            {card.icon}
            <h3 className="font-medium">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
