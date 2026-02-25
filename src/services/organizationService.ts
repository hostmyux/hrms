
// Mock data services for organization management
// In a real application, these would connect to your backend API

export interface Company {
  id: string;
  name: string;
  legalName: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
  industry: string;
  description: string;
  foundedYear: number;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
  parentDepartmentId: string | null;
  createdAt: string;
}

export interface Designation {
  id: string;
  title: string;
  department: string;
  description: string;
  responsibilities: string[];
  minSalary: number;
  maxSalary: number;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'Headquarters' | 'Branch Office' | 'Remote Hub' | 'Other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  employees: number;
  isActive: boolean;
  createdAt: string;
}

// Mock company data
const mockCompany: Company = {
  id: "1",
  name: "HRMS Nexus Inc.",
  legalName: "HRMS Nexus Incorporated",
  email: "contact@hrmsnexus.com",
  phone: "+1 (555) 123-4567",
  website: "https://hrmsnexus.com",
  taxId: "12-3456789",
  industry: "Software & Technology",
  description: "HRMS Nexus is a leading provider of human resource management solutions designed to streamline and optimize HR operations across organizations of all sizes.",
  foundedYear: 2018,
  address: {
    street: "123 Corporate Drive, Suite 500",
    city: "San Francisco",
    state: "California",
    zipCode: "94107",
    country: "United States"
  }
};

// Mock departments data - 20 entries
const mockDepartments: Department[] = [
  { id: "dept-1", name: "Human Resources", description: "Manages employee relations, recruitment, and workplace policies", managerId: "emp-103", managerName: "Emily Rodriguez", employeeCount: 12, parentDepartmentId: null, createdAt: "2021-03-15T09:00:00Z" },
  { id: "dept-2", name: "Engineering", description: "Develops and maintains software products and infrastructure", managerId: "emp-205", managerName: "Michael Chen", employeeCount: 45, parentDepartmentId: null, createdAt: "2021-01-10T08:30:00Z" },
  { id: "dept-3", name: "Marketing", description: "Handles brand strategy, digital marketing, and communications", managerId: "emp-301", managerName: "Sarah Johnson", employeeCount: 18, parentDepartmentId: null, createdAt: "2021-02-22T10:15:00Z" },
  { id: "dept-4", name: "Finance", description: "Manages financial planning, accounting, and compliance", managerId: "emp-407", managerName: "David Williams", employeeCount: 9, parentDepartmentId: null, createdAt: "2021-04-05T11:00:00Z" },
  { id: "dept-5", name: "Product Development", description: "Oversees product design, development, and improvement", managerId: "emp-512", managerName: "Jessica Taylor", employeeCount: 21, parentDepartmentId: "dept-2", createdAt: "2021-05-18T09:45:00Z" },
  { id: "dept-6", name: "Sales", description: "Drives revenue through client acquisition and account management", managerId: "emp-601", managerName: "Robert Anderson", employeeCount: 28, parentDepartmentId: null, createdAt: "2021-06-10T08:00:00Z" },
  { id: "dept-7", name: "Customer Support", description: "Provides technical and service support to clients", managerId: "emp-702", managerName: "Linda Martinez", employeeCount: 15, parentDepartmentId: null, createdAt: "2021-07-01T10:30:00Z" },
  { id: "dept-8", name: "Operations", description: "Manages day-to-day business operations and logistics", managerId: "emp-803", managerName: "James Brown", employeeCount: 10, parentDepartmentId: null, createdAt: "2021-08-15T09:00:00Z" },
  { id: "dept-9", name: "Legal & Compliance", description: "Handles legal matters, contracts, and regulatory compliance", managerId: "emp-904", managerName: "Patricia Wilson", employeeCount: 6, parentDepartmentId: null, createdAt: "2021-09-20T11:15:00Z" },
  { id: "dept-10", name: "Quality Assurance", description: "Ensures product quality through testing and process improvement", managerId: "emp-1005", managerName: "Thomas Garcia", employeeCount: 14, parentDepartmentId: "dept-2", createdAt: "2021-10-05T08:45:00Z" },
  { id: "dept-11", name: "Data Science", description: "Leverages data analytics and machine learning for business insights", managerId: "emp-1106", managerName: "Sophia Lee", employeeCount: 8, parentDepartmentId: "dept-2", createdAt: "2022-01-12T09:30:00Z" },
  { id: "dept-12", name: "DevOps", description: "Manages CI/CD pipelines, cloud infrastructure, and deployment", managerId: "emp-1207", managerName: "Daniel Kim", employeeCount: 7, parentDepartmentId: "dept-2", createdAt: "2022-02-28T10:00:00Z" },
  { id: "dept-13", name: "Design", description: "Creates user interfaces, brand assets, and visual experiences", managerId: "emp-1308", managerName: "Olivia Clark", employeeCount: 11, parentDepartmentId: null, createdAt: "2022-03-15T08:15:00Z" },
  { id: "dept-14", name: "Research & Development", description: "Explores new technologies and innovation opportunities", managerId: "emp-1409", managerName: "William Turner", employeeCount: 9, parentDepartmentId: null, createdAt: "2022-04-20T09:00:00Z" },
  { id: "dept-15", name: "Administration", description: "Handles office management, facilities, and administrative services", managerId: "emp-1510", managerName: "Emma Davis", employeeCount: 5, parentDepartmentId: null, createdAt: "2022-05-10T11:00:00Z" },
  { id: "dept-16", name: "Training & Development", description: "Designs and delivers employee learning and development programs", managerId: "emp-1611", managerName: "Alexander White", employeeCount: 6, parentDepartmentId: "dept-1", createdAt: "2022-06-01T08:30:00Z" },
  { id: "dept-17", name: "Procurement", description: "Manages vendor relationships and organizational purchasing", managerId: "emp-1712", managerName: "Grace Harris", employeeCount: 4, parentDepartmentId: "dept-8", createdAt: "2022-07-18T10:00:00Z" },
  { id: "dept-18", name: "Security", description: "Oversees information security, cybersecurity, and physical security", managerId: "emp-1813", managerName: "Nathan Scott", employeeCount: 8, parentDepartmentId: null, createdAt: "2022-08-25T09:15:00Z" },
  { id: "dept-19", name: "Business Intelligence", description: "Provides reporting, dashboards, and strategic analytics", managerId: "emp-1914", managerName: "Mia Robinson", employeeCount: 5, parentDepartmentId: "dept-11", createdAt: "2022-09-10T08:00:00Z" },
  { id: "dept-20", name: "Public Relations", description: "Manages media relations, press releases, and corporate communications", managerId: "emp-2015", managerName: "Ethan Lewis", employeeCount: 4, parentDepartmentId: "dept-3", createdAt: "2022-10-05T11:30:00Z" },
];

// Mock designations data - 20 entries
const mockDesignations: Designation[] = [
  { id: "desig-1", title: "HR Manager", department: "Human Resources", description: "Leads the HR department and oversees all HR functions", responsibilities: ["Develop and implement HR strategies", "Oversee recruitment and employee relations", "Ensure compliance with labor laws", "Manage performance evaluation systems"], minSalary: 85000, maxSalary: 120000, createdAt: "2021-02-10T14:30:00Z" },
  { id: "desig-2", title: "Software Engineer", department: "Engineering", description: "Develops and maintains software applications", responsibilities: ["Write clean, efficient code", "Collaborate with cross-functional teams", "Troubleshoot and debug applications", "Participate in code reviews"], minSalary: 75000, maxSalary: 110000, createdAt: "2021-01-15T10:00:00Z" },
  { id: "desig-3", title: "Marketing Specialist", department: "Marketing", description: "Implements marketing strategies and campaigns", responsibilities: ["Create marketing content", "Analyze campaign performance", "Manage social media presence", "Coordinate with design team"], minSalary: 60000, maxSalary: 90000, createdAt: "2021-03-05T09:15:00Z" },
  { id: "desig-4", title: "Financial Analyst", department: "Finance", description: "Analyzes financial data and prepares reports", responsibilities: ["Prepare financial forecasts", "Analyze financial performance", "Assist with budgeting processes", "Create financial models"], minSalary: 65000, maxSalary: 95000, createdAt: "2021-04-20T11:45:00Z" },
  { id: "desig-5", title: "Product Manager", department: "Product Development", description: "Oversees product strategy and development", responsibilities: ["Define product vision and roadmap", "Gather and prioritize requirements", "Work with engineering to deliver products", "Analyze market trends"], minSalary: 90000, maxSalary: 130000, createdAt: "2021-05-25T13:00:00Z" },
  { id: "desig-6", title: "Sales Executive", department: "Sales", description: "Manages client relationships and drives revenue growth", responsibilities: ["Identify and pursue sales opportunities", "Maintain client relationships", "Meet quarterly sales targets", "Prepare sales reports"], minSalary: 55000, maxSalary: 95000, createdAt: "2021-06-15T10:00:00Z" },
  { id: "desig-7", title: "Senior Software Engineer", department: "Engineering", description: "Leads technical design and mentors junior developers", responsibilities: ["Architect scalable solutions", "Lead technical design reviews", "Mentor junior developers", "Drive technical standards"], minSalary: 110000, maxSalary: 160000, createdAt: "2021-07-10T09:00:00Z" },
  { id: "desig-8", title: "UX Designer", department: "Design", description: "Creates user-centered design solutions", responsibilities: ["Conduct user research", "Create wireframes and prototypes", "Design intuitive interfaces", "Collaborate with product teams"], minSalary: 70000, maxSalary: 105000, createdAt: "2021-08-01T08:30:00Z" },
  { id: "desig-9", title: "Data Scientist", department: "Data Science", description: "Builds predictive models and analyzes complex datasets", responsibilities: ["Build ML models", "Analyze large datasets", "Create data pipelines", "Present findings to stakeholders"], minSalary: 95000, maxSalary: 145000, createdAt: "2021-09-15T11:00:00Z" },
  { id: "desig-10", title: "DevOps Engineer", department: "DevOps", description: "Manages cloud infrastructure and deployment pipelines", responsibilities: ["Manage CI/CD pipelines", "Monitor system performance", "Automate deployment processes", "Ensure system reliability"], minSalary: 85000, maxSalary: 130000, createdAt: "2021-10-20T09:15:00Z" },
  { id: "desig-11", title: "QA Lead", department: "Quality Assurance", description: "Leads quality assurance testing processes", responsibilities: ["Define QA strategies", "Lead test automation initiatives", "Review test results", "Manage QA team"], minSalary: 80000, maxSalary: 115000, createdAt: "2021-11-05T10:30:00Z" },
  { id: "desig-12", title: "Customer Support Manager", department: "Customer Support", description: "Manages customer support operations and team", responsibilities: ["Oversee support tickets", "Train support staff", "Improve customer satisfaction", "Manage escalations"], minSalary: 65000, maxSalary: 90000, createdAt: "2021-12-01T08:00:00Z" },
  { id: "desig-13", title: "Legal Counsel", department: "Legal & Compliance", description: "Provides legal guidance on corporate matters", responsibilities: ["Review contracts", "Ensure regulatory compliance", "Handle legal disputes", "Advise on employment law"], minSalary: 100000, maxSalary: 150000, createdAt: "2022-01-10T09:45:00Z" },
  { id: "desig-14", title: "Operations Manager", department: "Operations", description: "Oversees daily business operations", responsibilities: ["Streamline business processes", "Manage operational budgets", "Coordinate cross-departmental projects", "Implement efficiency improvements"], minSalary: 75000, maxSalary: 110000, createdAt: "2022-02-15T10:00:00Z" },
  { id: "desig-15", title: "Training Coordinator", department: "Training & Development", description: "Designs and coordinates employee training programs", responsibilities: ["Develop training curricula", "Organize workshops and seminars", "Track training completion", "Evaluate training effectiveness"], minSalary: 50000, maxSalary: 75000, createdAt: "2022-03-20T08:30:00Z" },
  { id: "desig-16", title: "Security Analyst", department: "Security", description: "Monitors and protects information systems", responsibilities: ["Monitor security threats", "Conduct vulnerability assessments", "Implement security protocols", "Respond to security incidents"], minSalary: 80000, maxSalary: 120000, createdAt: "2022-04-10T11:15:00Z" },
  { id: "desig-17", title: "Business Analyst", department: "Business Intelligence", description: "Bridges business needs with technical solutions", responsibilities: ["Gather business requirements", "Create process documentation", "Analyze data for insights", "Support strategic decisions"], minSalary: 65000, maxSalary: 100000, createdAt: "2022-05-05T09:00:00Z" },
  { id: "desig-18", title: "PR Specialist", department: "Public Relations", description: "Manages public image and media communications", responsibilities: ["Write press releases", "Manage media inquiries", "Coordinate press events", "Monitor brand reputation"], minSalary: 55000, maxSalary: 85000, createdAt: "2022-06-15T10:30:00Z" },
  { id: "desig-19", title: "Procurement Officer", department: "Procurement", description: "Handles vendor management and purchasing", responsibilities: ["Negotiate vendor contracts", "Manage procurement processes", "Evaluate supplier performance", "Control purchasing budgets"], minSalary: 55000, maxSalary: 80000, createdAt: "2022-07-20T08:45:00Z" },
  { id: "desig-20", title: "Chief Technology Officer", department: "Engineering", description: "Leads technology strategy and innovation", responsibilities: ["Define technology vision", "Lead engineering organization", "Drive innovation initiatives", "Manage technology budgets"], minSalary: 180000, maxSalary: 280000, createdAt: "2022-08-01T09:00:00Z" },
];

// Mock locations data - 20 entries
const mockLocations: Location[] = [
  { id: "loc-1", name: "San Francisco HQ", type: "Headquarters", address: { street: "123 Corporate Drive, Suite 500", city: "San Francisco", state: "California", zipCode: "94107", country: "United States" }, phone: "+1 (555) 123-4567", email: "sf@hrmsnexus.com", employees: 120, isActive: true, createdAt: "2018-06-15T08:00:00Z" },
  { id: "loc-2", name: "New York Office", type: "Branch Office", address: { street: "456 Park Avenue, 8th Floor", city: "New York", state: "New York", zipCode: "10022", country: "United States" }, phone: "+1 (555) 987-6543", email: "nyc@hrmsnexus.com", employees: 75, isActive: true, createdAt: "2019-03-20T09:30:00Z" },
  { id: "loc-3", name: "Austin Development Center", type: "Branch Office", address: { street: "789 Tech Blvd, Building C", city: "Austin", state: "Texas", zipCode: "78701", country: "United States" }, phone: "+1 (555) 456-7890", email: "austin@hrmsnexus.com", employees: 45, isActive: true, createdAt: "2020-01-10T10:15:00Z" },
  { id: "loc-4", name: "London Office", type: "Branch Office", address: { street: "10 Canary Wharf", city: "London", state: "", zipCode: "E14 4PU", country: "United Kingdom" }, phone: "+44 20 1234 5678", email: "london@hrmsnexus.com", employees: 30, isActive: true, createdAt: "2020-09-05T08:45:00Z" },
  { id: "loc-5", name: "Singapore Hub", type: "Remote Hub", address: { street: "1 Raffles Place, #20-01", city: "Singapore", state: "", zipCode: "048616", country: "Singapore" }, phone: "+65 6123 4567", email: "singapore@hrmsnexus.com", employees: 15, isActive: true, createdAt: "2021-02-15T09:00:00Z" },
  { id: "loc-6", name: "Chicago Office", type: "Branch Office", address: { street: "233 S Wacker Drive, Floor 12", city: "Chicago", state: "Illinois", zipCode: "60606", country: "United States" }, phone: "+1 (555) 321-9876", email: "chicago@hrmsnexus.com", employees: 35, isActive: true, createdAt: "2021-04-01T08:30:00Z" },
  { id: "loc-7", name: "Toronto Office", type: "Branch Office", address: { street: "100 King Street West, Suite 3000", city: "Toronto", state: "Ontario", zipCode: "M5X 1A9", country: "Canada" }, phone: "+1 (416) 555-0199", email: "toronto@hrmsnexus.com", employees: 22, isActive: true, createdAt: "2021-06-15T10:00:00Z" },
  { id: "loc-8", name: "Berlin Tech Hub", type: "Remote Hub", address: { street: "Friedrichstraße 76", city: "Berlin", state: "", zipCode: "10117", country: "Germany" }, phone: "+49 30 1234 5678", email: "berlin@hrmsnexus.com", employees: 18, isActive: true, createdAt: "2021-08-20T09:15:00Z" },
  { id: "loc-9", name: "Sydney Office", type: "Branch Office", address: { street: "1 Macquarie Place, Level 15", city: "Sydney", state: "NSW", zipCode: "2000", country: "Australia" }, phone: "+61 2 1234 5678", email: "sydney@hrmsnexus.com", employees: 12, isActive: true, createdAt: "2021-10-10T08:00:00Z" },
  { id: "loc-10", name: "Mumbai Office", type: "Branch Office", address: { street: "Bandra Kurla Complex, Tower A", city: "Mumbai", state: "Maharashtra", zipCode: "400051", country: "India" }, phone: "+91 22 1234 5678", email: "mumbai@hrmsnexus.com", employees: 40, isActive: true, createdAt: "2022-01-05T09:30:00Z" },
  { id: "loc-11", name: "Denver Remote Hub", type: "Remote Hub", address: { street: "1600 Stout Street", city: "Denver", state: "Colorado", zipCode: "80202", country: "United States" }, phone: "+1 (555) 654-3210", email: "denver@hrmsnexus.com", employees: 8, isActive: true, createdAt: "2022-03-15T10:00:00Z" },
  { id: "loc-12", name: "Seattle Office", type: "Branch Office", address: { street: "600 Pine Street, Suite 900", city: "Seattle", state: "Washington", zipCode: "98101", country: "United States" }, phone: "+1 (555) 789-4561", email: "seattle@hrmsnexus.com", employees: 25, isActive: true, createdAt: "2022-05-01T08:45:00Z" },
  { id: "loc-13", name: "Tokyo Office", type: "Branch Office", address: { street: "1-1-1 Marunouchi", city: "Tokyo", state: "Chiyoda", zipCode: "100-0005", country: "Japan" }, phone: "+81 3 1234 5678", email: "tokyo@hrmsnexus.com", employees: 10, isActive: true, createdAt: "2022-07-20T09:00:00Z" },
  { id: "loc-14", name: "Paris Hub", type: "Remote Hub", address: { street: "25 Avenue des Champs-Élysées", city: "Paris", state: "", zipCode: "75008", country: "France" }, phone: "+33 1 23 45 67 89", email: "paris@hrmsnexus.com", employees: 6, isActive: true, createdAt: "2022-09-10T10:30:00Z" },
  { id: "loc-15", name: "Miami Office", type: "Branch Office", address: { street: "1395 Brickell Avenue, Floor 8", city: "Miami", state: "Florida", zipCode: "33131", country: "United States" }, phone: "+1 (555) 234-8765", email: "miami@hrmsnexus.com", employees: 14, isActive: true, createdAt: "2022-11-01T08:15:00Z" },
  { id: "loc-16", name: "Dubai Regional Office", type: "Branch Office", address: { street: "DIFC Gate Avenue, Tower 2", city: "Dubai", state: "", zipCode: "507222", country: "UAE" }, phone: "+971 4 123 4567", email: "dubai@hrmsnexus.com", employees: 11, isActive: true, createdAt: "2023-01-15T09:00:00Z" },
  { id: "loc-17", name: "São Paulo Office", type: "Branch Office", address: { street: "Av. Paulista 1578, Floor 10", city: "São Paulo", state: "SP", zipCode: "01310-200", country: "Brazil" }, phone: "+55 11 1234 5678", email: "saopaulo@hrmsnexus.com", employees: 9, isActive: true, createdAt: "2023-03-20T10:00:00Z" },
  { id: "loc-18", name: "Boston Innovation Lab", type: "Other", address: { street: "1 Federal Street, Suite 400", city: "Boston", state: "Massachusetts", zipCode: "02110", country: "United States" }, phone: "+1 (555) 876-5432", email: "boston@hrmsnexus.com", employees: 7, isActive: true, createdAt: "2023-05-10T08:30:00Z" },
  { id: "loc-19", name: "Atlanta Office (Closed)", type: "Branch Office", address: { street: "191 Peachtree Street NE", city: "Atlanta", state: "Georgia", zipCode: "30303", country: "United States" }, phone: "+1 (555) 111-2222", email: "atlanta@hrmsnexus.com", employees: 0, isActive: false, createdAt: "2020-06-01T09:00:00Z" },
  { id: "loc-20", name: "Amsterdam Hub", type: "Remote Hub", address: { street: "Herengracht 450", city: "Amsterdam", state: "", zipCode: "1017 CA", country: "Netherlands" }, phone: "+31 20 123 4567", email: "amsterdam@hrmsnexus.com", employees: 5, isActive: true, createdAt: "2023-08-15T10:15:00Z" },
];

// API service functions for Company Information
export const getCompanyInfo = async (): Promise<Company> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCompany;
};

export const updateCompanyInfo = async (updatedCompany: Partial<Company>): Promise<Company> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  Object.assign(mockCompany, updatedCompany);
  return mockCompany;
};

// API service functions for Departments
export const getDepartments = async (): Promise<Department[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockDepartments];
};

export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDepartments.find(dept => dept.id === id);
};

export const createDepartment = async (department: Omit<Department, 'id' | 'createdAt'>): Promise<Department> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newDepartment: Department = {
    ...department,
    id: `dept-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  mockDepartments.push(newDepartment);
  return newDepartment;
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  const index = mockDepartments.findIndex(dept => dept.id === id);
  if (index === -1) throw new Error("Department not found");
  mockDepartments[index] = { ...mockDepartments[index], ...updates };
  return mockDepartments[index];
};

export const deleteDepartment = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockDepartments.findIndex(dept => dept.id === id);
  if (index === -1) return false;
  mockDepartments.splice(index, 1);
  return true;
};

// API service functions for Designations
export const getDesignations = async (): Promise<Designation[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockDesignations];
};

export const getDesignationById = async (id: string): Promise<Designation | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDesignations.find(desig => desig.id === id);
};

export const createDesignation = async (designation: Omit<Designation, 'id' | 'createdAt'>): Promise<Designation> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newDesignation: Designation = {
    ...designation,
    id: `desig-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  mockDesignations.push(newDesignation);
  return newDesignation;
};

export const updateDesignation = async (id: string, updates: Partial<Designation>): Promise<Designation> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  const index = mockDesignations.findIndex(desig => desig.id === id);
  if (index === -1) throw new Error("Designation not found");
  mockDesignations[index] = { ...mockDesignations[index], ...updates };
  return mockDesignations[index];
};

export const deleteDesignation = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockDesignations.findIndex(desig => desig.id === id);
  if (index === -1) return false;
  mockDesignations.splice(index, 1);
  return true;
};

// API service functions for Locations
export const getLocations = async (): Promise<Location[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockLocations];
};

export const getLocationById = async (id: string): Promise<Location | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLocations.find(loc => loc.id === id);
};

export const createLocation = async (location: Omit<Location, 'id' | 'createdAt'>): Promise<Location> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newLocation: Location = {
    ...location,
    id: `loc-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  mockLocations.push(newLocation);
  return newLocation;
};

export const updateLocation = async (id: string, updates: Partial<Location>): Promise<Location> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  const index = mockLocations.findIndex(loc => loc.id === id);
  if (index === -1) throw new Error("Location not found");
  mockLocations[index] = { ...mockLocations[index], ...updates };
  return mockLocations[index];
};

export const deleteLocation = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockLocations.findIndex(loc => loc.id === id);
  if (index === -1) return false;
  mockLocations.splice(index, 1);
  return true;
};

// Organization Chart related functions
export interface OrgChartNode {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  imageUrl?: string;
  children?: OrgChartNode[];
}

export const getOrganizationChart = async (): Promise<OrgChartNode> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: "emp-101",
    name: "John Smith",
    role: "CEO",
    department: "Executive",
    email: "john.smith@hrmsnexus.com",
    children: [
      {
        id: "emp-102",
        name: "James Wilson",
        role: "CTO",
        department: "Engineering",
        email: "james.wilson@hrmsnexus.com",
        children: [
          { id: "emp-205", name: "Michael Chen", role: "VP Engineering", department: "Engineering", email: "michael.chen@hrmsnexus.com" },
          { id: "emp-512", name: "Jessica Taylor", role: "VP Product", department: "Product Development", email: "jessica.taylor@hrmsnexus.com" },
          { id: "emp-1005", name: "Thomas Garcia", role: "QA Lead", department: "Quality Assurance", email: "thomas.garcia@hrmsnexus.com" },
        ]
      },
      {
        id: "emp-103",
        name: "Emily Rodriguez",
        role: "VP Human Resources",
        department: "Human Resources",
        email: "emily.rodriguez@hrmsnexus.com",
        children: [
          { id: "emp-1611", name: "Alexander White", role: "Training Lead", department: "Training & Development", email: "alexander.white@hrmsnexus.com" }
        ]
      },
      {
        id: "emp-301",
        name: "Sarah Johnson",
        role: "VP Marketing",
        department: "Marketing",
        email: "sarah.johnson@hrmsnexus.com",
        children: [
          { id: "emp-2015", name: "Ethan Lewis", role: "PR Manager", department: "Public Relations", email: "ethan.lewis@hrmsnexus.com" }
        ]
      },
      {
        id: "emp-407",
        name: "David Williams",
        role: "CFO",
        department: "Finance",
        email: "david.williams@hrmsnexus.com"
      },
      {
        id: "emp-601",
        name: "Robert Anderson",
        role: "VP Sales",
        department: "Sales",
        email: "robert.anderson@hrmsnexus.com"
      }
    ]
  };
};
