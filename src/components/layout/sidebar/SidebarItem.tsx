
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { useVoice } from '../../../contexts/VoiceContext';
import { useUser } from '../../../contexts/UserContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  href, 
  isActive = false,
  onClick
}) => {
  const { speak } = useVoice();
  const { addAction } = useUser();
  
  const handleClick = () => {
    speak(`Navigating to ${label}`);
    
    // Log navigation if no custom onClick provided
    if (!onClick) {
      addAction({
        type: "navigation",
        description: `Navigated to ${label}`,
        module: label
      });
    } else {
      onClick();
    }
  };
  
  return (
    <Link
      to={href}
      onClick={handleClick}
      className={cn(
        "flex items-center py-2 px-3 mb-1 rounded-md font-medium text-sm transition-colors relative group",
        isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"
      )}
    >
      <span className="mr-3">{icon}</span>
      <span className="truncate">{label}</span>
      
      {isActive && (
        <span className="absolute inset-y-0 left-0 w-1 bg-primary-foreground/80 rounded-full my-1"></span>
      )}
    </Link>
  );
};
