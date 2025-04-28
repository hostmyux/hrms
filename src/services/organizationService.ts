
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

// Mock departments data
const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Human Resources",
    description: "Manages employee relations, recruitment, and workplace policies",
    managerId: "emp-103",
    managerName: "Emily Rodriguez",
    employeeCount: 12,
    parentDepartmentId: null,
    createdAt: "2021-03-15T09:00:00Z"
  },
  {
    id: "dept-2",
    name: "Engineering",
    description: "Develops and maintains software products and infrastructure",
    managerId: "emp-205",
    managerName: "Michael Chen",
    employeeCount: 45,
    parentDepartmentId: null,
    createdAt: "2021-01-10T08:30:00Z"
  },
  {
    id: "dept-3",
    name: "Marketing",
    description: "Handles brand strategy, digital marketing, and communications",
    managerId: "emp-301",
    managerName: "Sarah Johnson",
    employeeCount: 18,
    parentDepartmentId: null,
    createdAt: "2021-02-22T10:15:00Z"
  },
  {
    id: "dept-4",
    name: "Finance",
    description: "Manages financial planning, accounting, and compliance",
    managerId: "emp-407",
    managerName: "David Williams",
    employeeCount: 9,
    parentDepartmentId: null,
    createdAt: "2021-04-05T11:00:00Z"
  },
  {
    id: "dept-5",
    name: "Product Development",
    description: "Oversees product design, development, and improvement",
    managerId: "emp-512",
    managerName: "Jessica Taylor",
    employeeCount: 21,
    parentDepartmentId: "dept-2",
    createdAt: "2021-05-18T09:45:00Z"
  }
];

// Mock designations data
const mockDesignations: Designation[] = [
  {
    id: "desig-1",
    title: "HR Manager",
    department: "Human Resources",
    description: "Leads the HR department and oversees all HR functions",
    responsibilities: [
      "Develop and implement HR strategies and initiatives",
      "Oversee recruitment and employee relations",
      "Ensure compliance with labor laws and regulations",
      "Manage performance evaluation systems"
    ],
    minSalary: 85000,
    maxSalary: 120000,
    createdAt: "2021-02-10T14:30:00Z"
  },
  {
    id: "desig-2",
    title: "Software Engineer",
    department: "Engineering",
    description: "Develops and maintains software applications",
    responsibilities: [
      "Write clean, efficient code",
      "Collaborate with cross-functional teams",
      "Troubleshoot and debug applications",
      "Participate in code reviews"
    ],
    minSalary: 75000,
    maxSalary: 110000,
    createdAt: "2021-01-15T10:00:00Z"
  },
  {
    id: "desig-3",
    title: "Marketing Specialist",
    department: "Marketing",
    description: "Implements marketing strategies and campaigns",
    responsibilities: [
      "Create marketing content",
      "Analyze campaign performance",
      "Manage social media presence",
      "Coordinate with design team"
    ],
    minSalary: 60000,
    maxSalary: 90000,
    createdAt: "2021-03-05T09:15:00Z"
  },
  {
    id: "desig-4",
    title: "Financial Analyst",
    department: "Finance",
    description: "Analyzes financial data and prepares reports",
    responsibilities: [
      "Prepare financial forecasts",
      "Analyze financial performance",
      "Assist with budgeting processes",
      "Create financial models"
    ],
    minSalary: 65000,
    maxSalary: 95000,
    createdAt: "2021-04-20T11:45:00Z"
  },
  {
    id: "desig-5",
    title: "Product Manager",
    department: "Product Development",
    description: "Oversees product strategy and development",
    responsibilities: [
      "Define product vision and roadmap",
      "Gather and prioritize requirements",
      "Work with engineering to deliver products",
      "Analyze market trends and competition"
    ],
    minSalary: 90000,
    maxSalary: 130000,
    createdAt: "2021-05-25T13:00:00Z"
  }
];

// Mock locations data
const mockLocations: Location[] = [
  {
    id: "loc-1",
    name: "San Francisco HQ",
    type: "Headquarters",
    address: {
      street: "123 Corporate Drive, Suite 500",
      city: "San Francisco",
      state: "California",
      zipCode: "94107",
      country: "United States"
    },
    phone: "+1 (555) 123-4567",
    email: "sf@hrmsnexus.com",
    employees: 120,
    isActive: true,
    createdAt: "2018-06-15T08:00:00Z"
  },
  {
    id: "loc-2",
    name: "New York Office",
    type: "Branch Office",
    address: {
      street: "456 Park Avenue, 8th Floor",
      city: "New York",
      state: "New York",
      zipCode: "10022",
      country: "United States"
    },
    phone: "+1 (555) 987-6543",
    email: "nyc@hrmsnexus.com",
    employees: 75,
    isActive: true,
    createdAt: "2019-03-20T09:30:00Z"
  },
  {
    id: "loc-3",
    name: "Austin Development Center",
    type: "Branch Office",
    address: {
      street: "789 Tech Blvd, Building C",
      city: "Austin",
      state: "Texas",
      zipCode: "78701",
      country: "United States"
    },
    phone: "+1 (555) 456-7890",
    email: "austin@hrmsnexus.com",
    employees: 45,
    isActive: true,
    createdAt: "2020-01-10T10:15:00Z"
  },
  {
    id: "loc-4",
    name: "London Office",
    type: "Branch Office",
    address: {
      street: "10 Canary Wharf",
      city: "London",
      state: "",
      zipCode: "E14 4PU",
      country: "United Kingdom"
    },
    phone: "+44 20 1234 5678",
    email: "london@hrmsnexus.com",
    employees: 30,
    isActive: true,
    createdAt: "2020-09-05T08:45:00Z"
  },
  {
    id: "loc-5",
    name: "Singapore Hub",
    type: "Remote Hub",
    address: {
      street: "1 Raffles Place, #20-01",
      city: "Singapore",
      state: "",
      zipCode: "048616",
      country: "Singapore"
    },
    phone: "+65 6123 4567",
    email: "singapore@hrmsnexus.com",
    employees: 15,
    isActive: true,
    createdAt: "2021-02-15T09:00:00Z"
  }
];

// API service functions for Company Information
export const getCompanyInfo = async (): Promise<Company> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCompany;
};

export const updateCompanyInfo = async (updatedCompany: Partial<Company>): Promise<Company> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, this would send data to the server
  // Here we just merge the updates with the mock data
  Object.assign(mockCompany, updatedCompany);
  
  return mockCompany;
};

// API service functions for Departments
export const getDepartments = async (): Promise<Department[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockDepartments];
};

export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDepartments.find(dept => dept.id === id);
};

export const createDepartment = async (department: Omit<Department, 'id' | 'createdAt'>): Promise<Department> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newDepartment: Department = {
    ...department,
    id: `dept-${mockDepartments.length + 1}`,
    createdAt: new Date().toISOString()
  };
  
  mockDepartments.push(newDepartment);
  return newDepartment;
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const index = mockDepartments.findIndex(dept => dept.id === id);
  if (index === -1) throw new Error("Department not found");
  
  mockDepartments[index] = { ...mockDepartments[index], ...updates };
  return mockDepartments[index];
};

export const deleteDepartment = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockDepartments.findIndex(dept => dept.id === id);
  if (index === -1) return false;
  
  mockDepartments.splice(index, 1);
  return true;
};

// API service functions for Designations
export const getDesignations = async (): Promise<Designation[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockDesignations];
};

export const getDesignationById = async (id: string): Promise<Designation | undefined> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDesignations.find(desig => desig.id === id);
};

export const createDesignation = async (designation: Omit<Designation, 'id' | 'createdAt'>): Promise<Designation> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newDesignation: Designation = {
    ...designation,
    id: `desig-${mockDesignations.length + 1}`,
    createdAt: new Date().toISOString()
  };
  
  mockDesignations.push(newDesignation);
  return newDesignation;
};

export const updateDesignation = async (id: string, updates: Partial<Designation>): Promise<Designation> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const index = mockDesignations.findIndex(desig => desig.id === id);
  if (index === -1) throw new Error("Designation not found");
  
  mockDesignations[index] = { ...mockDesignations[index], ...updates };
  return mockDesignations[index];
};

export const deleteDesignation = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockDesignations.findIndex(desig => desig.id === id);
  if (index === -1) return false;
  
  mockDesignations.splice(index, 1);
  return true;
};

// API service functions for Locations
export const getLocations = async (): Promise<Location[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockLocations];
};

export const getLocationById = async (id: string): Promise<Location | undefined> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLocations.find(loc => loc.id === id);
};

export const createLocation = async (location: Omit<Location, 'id' | 'createdAt'>): Promise<Location> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newLocation: Location = {
    ...location,
    id: `loc-${mockLocations.length + 1}`,
    createdAt: new Date().toISOString()
  };
  
  mockLocations.push(newLocation);
  return newLocation;
};

export const updateLocation = async (id: string, updates: Partial<Location>): Promise<Location> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const index = mockLocations.findIndex(loc => loc.id === id);
  if (index === -1) throw new Error("Location not found");
  
  mockLocations[index] = { ...mockLocations[index], ...updates };
  return mockLocations[index];
};

export const deleteLocation = async (id: string): Promise<boolean> => {
  // Simulate API call delay
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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock organization chart data
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
        department: "Technology",
        email: "james.wilson@hrmsnexus.com",
        children: [
          {
            id: "emp-205",
            name: "Michael Chen",
            role: "Engineering Director",
            department: "Engineering",
            email: "michael.chen@hrmsnexus.com",
            children: [
              {
                id: "emp-206",
                name: "Lisa Davis",
                role: "Senior Developer",
                department: "Engineering",
                email: "lisa.davis@hrmsnexus.com"
              },
              {
                id: "emp-207",
                name: "Robert Garcia",
                role: "Senior Developer",
                department: "Engineering",
                email: "robert.garcia@hrmsnexus.com"
              }
            ]
          },
          {
            id: "emp-512",
            name: "Jessica Taylor",
            role: "Product Director",
            department: "Product Development",
            email: "jessica.taylor@hrmsnexus.com"
          }
        ]
      },
      {
        id: "emp-103",
        name: "Emily Rodriguez",
        role: "HR Director",
        department: "Human Resources",
        email: "emily.rodriguez@hrmsnexus.com",
        children: [
          {
            id: "emp-104",
            name: "Daniel Lee",
            role: "Recruitment Manager",
            department: "Human Resources",
            email: "daniel.lee@hrmsnexus.com"
          }
        ]
      },
      {
        id: "emp-301",
        name: "Sarah Johnson",
        role: "Marketing Director",
        department: "Marketing",
        email: "sarah.johnson@hrmsnexus.com"
      },
      {
        id: "emp-407",
        name: "David Williams",
        role: "Finance Director",
        department: "Finance",
        email: "david.williams@hrmsnexus.com"
      }
    ]
  };
};

export const updateOrganizationChart = async (orgChart: OrgChartNode): Promise<OrgChartNode> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real app, this would send updated org chart to server
  return orgChart;
};
