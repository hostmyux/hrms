
import React, { useEffect, useState } from 'react';
import { useVoice } from '../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, Search, Download, Share2, FileCheck, FolderPlus, 
  FileUp, ChevronRight, X, Calendar, Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img' | 'other';
  size: string;
  category: 'hr' | 'payroll' | 'personal' | 'training';
  uploadDate: Date;
  sharedWith?: string[];
}

const Documents: React.FC = () => {
  const { speak } = useVoice();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Sample document data
  useEffect(() => {
    const sampleDocuments: Document[] = [
      {
        id: '1',
        name: 'Employee Handbook 2023',
        type: 'pdf',
        size: '2.4 MB',
        category: 'hr',
        uploadDate: new Date(2023, 1, 15),
        sharedWith: ['All Employees']
      },
      {
        id: '2',
        name: 'Payroll Report Q1',
        type: 'xls',
        size: '1.7 MB',
        category: 'payroll',
        uploadDate: new Date(2023, 3, 5),
        sharedWith: ['Finance Team', 'HR Team']
      },
      {
        id: '3',
        name: 'Performance Review Template',
        type: 'doc',
        size: '540 KB',
        category: 'hr',
        uploadDate: new Date(2023, 2, 22),
        sharedWith: ['Managers']
      },
      {
        id: '4',
        name: 'Training Certificate',
        type: 'pdf',
        size: '890 KB',
        category: 'training',
        uploadDate: new Date(2023, 4, 10)
      },
      {
        id: '5',
        name: 'Expense Policy',
        type: 'pdf',
        size: '1.2 MB',
        category: 'hr',
        uploadDate: new Date(2023, 0, 30),
        sharedWith: ['All Employees']
      },
      {
        id: '6',
        name: 'Company Organization Chart',
        type: 'img',
        size: '3.1 MB',
        category: 'hr',
        uploadDate: new Date(2023, 5, 1),
        sharedWith: ['All Employees']
      }
    ];

    setDocuments(sampleDocuments);
    speak("Documents page loaded. You can view, search, and manage your documents here.");
  }, [speak]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredDocuments = (category: string) => {
    return documents.filter(doc => 
      (category === 'all' || doc.category === category) &&
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleUpload = () => {
    // Simulate file upload
    setTimeout(() => {
      const newDocument: Document = {
        id: (documents.length + 1).toString(),
        name: 'New Uploaded Document',
        type: 'pdf',
        size: '1.1 MB',
        category: 'personal',
        uploadDate: new Date()
      };
      
      setDocuments([...documents, newDocument]);
      setIsUploadDialogOpen(false);
      toast.success("Document uploaded successfully");
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc': return <FileText className="h-6 w-6 text-blue-500" />;
      case 'xls': return <FileText className="h-6 w-6 text-green-500" />;
      case 'img': return <FileText className="h-6 w-6 text-purple-500" />;
      default: return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          View and manage your documents and files.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <FileUp className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="hr">HR Documents</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>
        
        {['all', 'hr', 'payroll', 'training', 'personal'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{category === 'all' ? 'All Documents' : `${category.charAt(0).toUpperCase() + category.slice(1)} Documents`}</CardTitle>
                <CardDescription>
                  {filteredDocuments(category).length} documents found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredDocuments(category).length > 0 ? (
                  <div className="space-y-2">
                    {filteredDocuments(category).map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-3 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <div className="flex items-center gap-3">
                          {getTypeIcon(doc.type)}
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{doc.type.toUpperCase()}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(doc.uploadDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.sharedWith && (
                            <Badge variant="outline" className="text-xs">
                              Shared
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-xl font-medium text-center">No documents found</p>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      {searchQuery ? 'Try a different search term' : `Upload ${category !== 'all' ? category : ''} documents to get started`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Document Detail Dialog */}
      <ResponsiveDialog 
        open={!!selectedDocument} 
        onOpenChange={() => setSelectedDocument(null)}
        title={selectedDocument ? `${selectedDocument.name}` : "Document Details"}
        description={selectedDocument ? `${selectedDocument.type.toUpperCase()} • ${selectedDocument.size}` : ""}
        footer={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-between">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => toast.success("Document downloaded")}>
              <Download className="h-4 w-4" />
              Download
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => toast.success("Document shared")}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="destructive" onClick={() => {
                setDocuments(documents.filter(doc => doc.id !== selectedDocument?.id));
                setSelectedDocument(null);
                toast.success("Document deleted");
              }}>
                Delete
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium capitalize">{selectedDocument?.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Upload Date</p>
              <p className="font-medium">{selectedDocument && formatDate(selectedDocument.uploadDate)}</p>
            </div>
            {selectedDocument?.sharedWith && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Shared With</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedDocument.sharedWith.map((person, index) => (
                    <Badge key={index} variant="secondary">{person}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ResponsiveDialog>

      {/* Upload Dialog */}
      <ResponsiveDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        title="Upload Document"
        description="Upload a new document to your document library."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Upload
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-md p-8 text-center">
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="font-medium">Drag and drop files here</p>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button variant="outline">Browse Files</Button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Supported file types: PDF, DOCX, XLSX, JPG, PNG
            </p>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default Documents;
