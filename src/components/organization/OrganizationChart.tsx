
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVoice } from '../../contexts/VoiceContext';
import { getOrganizationChart, type OrgChartNode } from '../../services/organizationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

export const OrganizationChart: React.FC = () => {
  const { toast } = useToast();
  const { speak } = useVoice();
  const [orgChart, setOrgChart] = useState<OrgChartNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const loadOrgChart = async () => {
      try {
        const data = await getOrganizationChart();
        setOrgChart(data);
        speak("Organization chart loaded. View your company's hierarchy structure.");
      } catch (error) {
        toast({
          title: "Error loading organization chart",
          description: "Failed to load organization chart. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrgChart();
  }, [speak, toast]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
  };

  const handleDownloadChart = () => {
    toast({
      title: "Download started",
      description: "Organization chart download initiated.",
    });
    // In a real implementation, this would generate and download a PNG/PDF of the org chart
  };

  // Recursive function to render organization chart nodes
  const renderOrgNode = (node: OrgChartNode, level = 0) => {
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className="org-node border rounded-lg p-3 bg-card w-64 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {node.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{node.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{node.role}</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t text-xs">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span>{node.department}</span>
            </p>
            <p className="flex justify-between mt-1">
              <span className="text-muted-foreground">Email:</span>
              <span className="truncate ml-2">{node.email}</span>
            </p>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <>
            <div className="w-px h-4 bg-border"></div>
            <div className="relative flex">
              <div className="absolute left-0 right-0 top-0 h-4 border-l border-r border-t border-border"></div>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {node.children.map(child => renderOrgNode(child, level + 1))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!orgChart) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-4 text-muted-foreground">
            Organization chart could not be loaded.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6 space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <Network className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Organization Chart</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-muted rounded-md flex items-center">
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm">{Math.round(zoomLevel * 100)}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadChart}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Chart container with horizontal scroll */}
        <div className="overflow-x-auto pb-6">
          <div 
            className="org-chart-container min-w-fit flex justify-center py-6 px-4"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            {renderOrgNode(orgChart)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
