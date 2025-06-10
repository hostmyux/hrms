
interface VoiceTrainingModule {
  module: string;
  welcomeMessage: string;
  navigationGuide: string;
  actionInstructions: string[];
  tips: string[];
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
      welcomeMessage: 'Welcome to your HR dashboard. This is your command center for all HR operations.',
      navigationGuide: 'The dashboard contains quick access cards, statistics overview, recent employee listings, and activity logs. Use the voice controls in the top navigation to enable or disable guidance.',
      actionInstructions: [
        'Click on statistics cards to hear detailed metrics',
        'Use quick access cards to navigate to specific modules',
        'Hover over employee entries to hear their information',
        'Star favorite cards for priority display'
      ],
      tips: [
        'Favorite cards appear first for faster access',
        'Recent activities show system-wide changes',
        'Voice controls can be adjusted for volume and disabled when needed'
      ]
    });

    // Organization training
    this.trainingModules.set('organization', {
      module: 'Organization Management',
      welcomeMessage: 'Organization management helps you structure your company effectively.',
      navigationGuide: 'This module includes company information, department management, job positions, and organizational charts.',
      actionInstructions: [
        'Create new departments with the Add Department button',
        'Edit department details by clicking the edit icon',
        'View employee counts and budgets for each department',
        'Use the form dialogs to input comprehensive department information'
      ],
      tips: [
        'Department managers can be assigned during creation',
        'Budget tracking helps with financial planning',
        'Location information assists with office management'
      ]
    });

    // Attendance training
    this.trainingModules.set('attendance', {
      module: 'Attendance and Leave Management',
      welcomeMessage: 'Attendance management streamlines employee time tracking and leave approvals.',
      navigationGuide: 'Access leave requests, attendance tracking, holiday management, and work-from-home coordination.',
      actionInstructions: [
        'Review pending leave requests in the priority section',
        'Approve or reject requests with detailed comments',
        'Track attendance patterns and identify trends',
        'Manage holiday calendars and company events'
      ],
      tips: [
        'Pending requests require immediate attention',
        'Comments help communicate decisions clearly',
        'Regular attendance review improves workforce planning'
      ]
    });

    // Recruitment training
    this.trainingModules.set('recruitment', {
      module: 'Recruitment and Hiring',
      welcomeMessage: 'Recruitment module manages your complete hiring pipeline.',
      navigationGuide: 'Create job postings, track applications, schedule interviews, and manage offers.',
      actionInstructions: [
        'Create detailed job postings with requirements and benefits',
        'Set salary ranges and employment types',
        'Track applicant counts and application status',
        'Edit or close postings as needed'
      ],
      tips: [
        'Detailed job descriptions attract better candidates',
        'Competitive salary ranges increase application rates',
        'Regular posting updates keep content fresh'
      ]
    });
  }

  public getModuleTraining(moduleName: string): VoiceTrainingModule | null {
    return this.trainingModules.get(moduleName.toLowerCase()) || null;
  }

  public provideContextualHelp(moduleName: string, action?: string): string {
    const training = this.getModuleTraining(moduleName);
    if (!training) {
      return 'Voice guidance is available for this module. Explore the interface to learn about available features.';
    }

    if (action) {
      // Provide specific action guidance
      const actionGuide = training.actionInstructions.find(instruction => 
        instruction.toLowerCase().includes(action.toLowerCase())
      );
      return actionGuide || `In ${training.module}, you can perform various actions. ${training.navigationGuide}`;
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

  public provideDetailedGuidance(moduleName: string): string {
    const training = this.getModuleTraining(moduleName);
    if (!training) return '';

    const guidance = [
      training.welcomeMessage,
      training.navigationGuide,
      'Available actions include:',
      ...training.actionInstructions,
      'Helpful tips:',
      ...training.tips
    ];

    return guidance.join(' ');
  }
}

export const voiceTrainingService = VoiceTrainingService.getInstance();
