
interface VoiceTrainingModule {
  module: string;
  welcomeMessage: string;
  navigationGuide: string;
  actionInstructions: string[];
  tips: string[];
  shortcuts: string[];
  commonTasks: string[];
}

class VoiceTrainingService {
  private static instance: VoiceTrainingService;
  private trainingModules: Map<string, VoiceTrainingModule> = new Map();

  private constructor() {
    this.initializeTrainingModules();
  }

  public static getInstance(): VoiceTrainingService {
    if (!VoiceTrainingService.instance) {
      VoiceTrainingService.instance = new VoiceTrainingService();
    }
    return VoiceTrainingService.instance;
  }

  private initializeTrainingModules() {
    // Dashboard training
    this.trainingModules.set('dashboard', {
      module: 'Dashboard',
      welcomeMessage: 'Welcome to your comprehensive HR dashboard. This is your central command center for monitoring all HR operations, tracking key metrics, and accessing quick navigation to all modules.',
      navigationGuide: 'The dashboard features responsive quick access cards, real-time statistics overview, recent employee activity listings, comprehensive activity logs, and voice-controlled navigation. All elements are fully responsive and adapt to your screen size.',
      actionInstructions: [
        'Click on statistics cards to hear detailed metrics and performance indicators',
        'Use quick access cards to navigate directly to specific modules with voice guidance',
        'Hover over employee entries to hear comprehensive information about their profiles',
        'Star favorite cards using the star icon for priority display and faster access',
        'Access voice controls in the top navigation bar to customize your experience',
        'Use the help button to get contextual assistance for any feature'
      ],
      tips: [
        'Favorite cards appear first in the grid for immediate access to your most-used functions',
        'Recent activities show system-wide changes and updates from all departments',
        'Voice controls can be adjusted for volume, speed, and can be temporarily disabled',
        'Dashboard adapts to mobile, tablet, and desktop views automatically',
        'All hover actions provide voice feedback for accessibility'
      ],
      shortcuts: [
        'Press space on cards to activate them with keyboard navigation',
        'Use tab key to navigate through all interactive elements',
        'Voice controls can be toggled with the microphone button'
      ],
      commonTasks: [
        'Review daily statistics and key performance indicators',
        'Navigate to leave management for pending approvals',
        'Check recent employee activities and updates',
        'Access recruitment pipeline for urgent hiring needs'
      ]
    });

    // Organization training
    this.trainingModules.set('organization', {
      module: 'Organization Management',
      welcomeMessage: 'Organization management provides comprehensive tools for structuring your company effectively with detailed department management, contact information, and organizational hierarchy.',
      navigationGuide: 'This fully responsive module includes company information management, detailed department creation and editing, job position tracking, organizational charts, and comprehensive contact management.',
      actionInstructions: [
        'Create new departments using the responsive Add Department button with comprehensive form fields',
        'Edit department details by clicking the edit icon to access the full-featured dialog',
        'View complete employee counts, budgets, contact information, and operational status for each department',
        'Use the comprehensive form dialogs to input detailed department information including phone, email, cost centers',
        'Track department status, establishment dates, and organizational hierarchy',
        'Manage contact information and location details for each department'
      ],
      tips: [
        'Department managers can be assigned during creation with full contact details',
        'Budget tracking includes annual budgets and cost center management for financial planning',
        'Location information assists with office management and space allocation',
        'Contact information helps with interdepartmental communication',
        'Status tracking allows for active and inactive department management',
        'Forms are fully responsive and adapt to all screen sizes'
      ],
      shortcuts: [
        'Use keyboard navigation to move through form fields efficiently',
        'Tab through all input fields in the department creation dialog',
        'Press enter to save department information quickly'
      ],
      commonTasks: [
        'Create new departments with comprehensive details',
        'Update existing department information and contact details',
        'Review department budgets and employee allocations',
        'Manage department status and organizational changes'
      ]
    });

    // Attendance training
    this.trainingModules.set('attendance', {
      module: 'Attendance and Leave Management',
      welcomeMessage: 'Attendance management provides comprehensive tools for streamlining employee time tracking, leave approvals, holiday management, and work-from-home coordination with full responsive design.',
      navigationGuide: 'Access detailed leave requests with approval workflows, comprehensive attendance tracking with analytics, holiday management systems, work-from-home coordination, and time-off balance tracking.',
      actionInstructions: [
        'Review pending leave requests in the priority section with detailed employee information',
        'Approve or reject requests with detailed comments and reasoning in responsive dialogs',
        'Track attendance patterns and identify trends using comprehensive analytics',
        'Manage holiday calendars and company events with full calendar integration',
        'Monitor work-from-home requests and coordinate remote work schedules',
        'Access employee time-off balances and accrual information'
      ],
      tips: [
        'Pending requests require immediate attention and are highlighted for visibility',
        'Detailed comments help communicate decisions clearly to employees',
        'Regular attendance review improves workforce planning and scheduling',
        'Holiday management affects payroll calculations and should be kept current',
        'Work-from-home coordination helps with office space planning',
        'All interfaces are mobile-responsive for approvals on the go'
      ],
      shortcuts: [
        'Use quick approval buttons for common leave types',
        'Bulk actions available for multiple leave requests',
        'Keyboard shortcuts for rapid approval workflows'
      ],
      commonTasks: [
        'Review and approve pending leave requests daily',
        'Update holiday calendars for upcoming periods',
        'Monitor attendance trends and patterns',
        'Coordinate work-from-home schedules and office capacity'
      ]
    });

    // Recruitment training
    this.trainingModules.set('recruitment', {
      module: 'Recruitment and Hiring',
      welcomeMessage: 'Recruitment module provides comprehensive management of your complete hiring pipeline with detailed job postings, applicant tracking, interview coordination, and offer management.',
      navigationGuide: 'Create detailed job postings with comprehensive requirements, track applications through all stages, schedule and coordinate interviews, manage offers and negotiations, and analyze recruitment metrics.',
      actionInstructions: [
        'Create comprehensive job postings with detailed requirements, benefits, and company information',
        'Set competitive salary ranges and specify employment types for accurate candidate matching',
        'Track applicant counts, application status, and recruitment funnel metrics',
        'Schedule interviews and coordinate with hiring teams using integrated calendar systems',
        'Manage offer letters, negotiations, and onboarding coordination',
        'Edit or close postings as needed with automatic candidate notifications'
      ],
      tips: [
        'Detailed job descriptions with clear requirements attract higher quality candidates',
        'Competitive salary ranges and comprehensive benefits increase application rates significantly',
        'Regular posting updates and refreshes keep content current and improve visibility',
        'Interview coordination tools help streamline the hiring process',
        'Offer management ensures consistent and professional candidate experience',
        'Analytics help optimize recruitment strategies and improve hire quality'
      ],
      shortcuts: [
        'Template job postings for common roles speed up creation process',
        'Bulk actions for managing multiple candidates simultaneously',
        'Quick status updates for moving candidates through pipeline stages'
      ],
      commonTasks: [
        'Create and publish new job postings with comprehensive details',
        'Review and screen incoming applications',
        'Schedule interviews and coordinate with hiring managers',
        'Manage offer processes and candidate communications'
      ]
    });

    // Add more modules with similar comprehensive detail
    this.trainingModules.set('employees', {
      module: 'Employee Management',
      welcomeMessage: 'Employee management serves as your central hub for comprehensive employee data, profile management, document handling, and workforce analytics.',
      navigationGuide: 'Access detailed employee profiles, manage personal and professional information, track employment history, handle document management, and analyze workforce demographics.',
      actionInstructions: [
        'View and edit comprehensive employee profiles with personal and professional details',
        'Track employment history, promotions, and career progression',
        'Manage employee documents, contracts, and certifications',
        'Update contact information, emergency contacts, and personal details',
        'Access performance history and training records',
        'Generate employee reports and analytics'
      ],
      tips: [
        'Keep employee information current for accurate reporting and compliance',
        'Document management ensures important files are easily accessible',
        'Regular profile updates help with career development planning',
        'Emergency contact information is crucial for workplace safety',
        'Performance tracking integration provides holistic employee view'
      ],
      shortcuts: [
        'Quick search functionality for finding employees rapidly',
        'Bulk update options for common information changes',
        'Export options for reporting and analytics'
      ],
      commonTasks: [
        'Update employee personal and professional information',
        'Review and manage employee documents',
        'Track employee performance and development',
        'Generate employee reports and analytics'
      ]
    });
  }

  public getModuleTraining(moduleName: string): VoiceTrainingModule | null {
    return this.trainingModules.get(moduleName.toLowerCase()) || null;
  }

  public provideContextualHelp(moduleName: string, action?: string): string {
    const training = this.getModuleTraining(moduleName);
    if (!training) {
      return 'Comprehensive voice guidance is available for this module. Explore the responsive interface to learn about available features, shortcuts, and best practices for efficient workflow management.';
    }

    if (action) {
      const actionGuide = training.actionInstructions.find(instruction => 
        instruction.toLowerCase().includes(action.toLowerCase())
      );
      return actionGuide || `In ${training.module}, you can perform various comprehensive actions. ${training.navigationGuide}`;
    }

    return `${training.welcomeMessage} ${training.navigationGuide}`;
  }

  public getActionInstructions(moduleName: string): string[] {
    const training = this.getModuleTraining(moduleName);
    return training?.actionInstructions || [];
  }

  public getTips(moduleName: string): string[] {
    const training = this.getModuleTraining(moduleName);
    return training?.tips || [];
  }

  public getShortcuts(moduleName: string): string[] {
    const training = this.getModuleTraining(moduleName);
    return training?.shortcuts || [];
  }

  public getCommonTasks(moduleName: string): string[] {
    const training = this.getModuleTraining(moduleName);
    return training?.commonTasks || [];
  }

  public provideDetailedGuidance(moduleName: string): string {
    const training = this.getModuleTraining(moduleName);
    if (!training) return '';

    const guidance = [
      training.welcomeMessage,
      training.navigationGuide,
      'Available comprehensive actions include:',
      ...training.actionInstructions,
      'Helpful tips and best practices:',
      ...training.tips,
      'Keyboard shortcuts and efficiency tips:',
      ...training.shortcuts,
      'Common daily tasks you can perform:',
      ...training.commonTasks
    ];

    return guidance.join(' ');
  }

  public provideResponsiveGuidance(): string {
    return 'This application is fully responsive and adapts to all screen sizes. On mobile devices, forms become single-column layouts, buttons stack vertically, and touch-friendly interfaces are enabled. On tablets, you get optimized two-column layouts with enhanced touch targets. On desktop, you have access to full multi-column layouts with hover interactions and keyboard shortcuts. Voice guidance adapts to your current screen size and input method.';
  }
}

export const voiceTrainingService = VoiceTrainingService.getInstance();
