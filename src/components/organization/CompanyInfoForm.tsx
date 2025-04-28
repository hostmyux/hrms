
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useVoice } from '../../contexts/VoiceContext';
import { getCompanyInfo, updateCompanyInfo, type Company } from '../../services/organizationService';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Building, Save } from 'lucide-react';

export const CompanyInfoForm: React.FC = () => {
  const { toast } = useToast();
  const { speak } = useVoice();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const data = await getCompanyInfo();
        setCompanyData(data);
        speak("Company information loaded. You can edit details like company name, contact information, and address.");
      } catch (error) {
        toast({
          title: "Error loading company information",
          description: "Failed to load company details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyInfo();
  }, [speak, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompanyData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof Company],
            [child]: value
          }
        };
      });
    } else {
      setCompanyData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: value
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData) return;
    
    setIsSaving(true);
    try {
      await updateCompanyInfo(companyData);
      toast({
        title: "Success",
        description: "Company information has been updated successfully.",
      });
      speak("Company information updated successfully.");
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "There was a problem updating the company information.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  if (!companyData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-4 text-muted-foreground">
            Company information could not be loaded.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Building className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={companyData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Legal Name</Label>
              <Input
                id="legalName"
                name="legalName"
                value={companyData.legalName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={companyData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={companyData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={companyData.website}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / VAT Number</Label>
              <Input
                id="taxId"
                name="taxId"
                value={companyData.taxId}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={companyData.industry}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                name="foundedYear"
                type="number"
                value={companyData.foundedYear}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              name="description"
              value={companyData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Address Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address.street">Street Address</Label>
              <Input
                id="address.street"
                name="address.street"
                value={companyData.address.street}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                name="address.city"
                value={companyData.address.city}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.state">State / Province</Label>
              <Input
                id="address.state"
                name="address.state"
                value={companyData.address.state}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.zipCode">Postal / Zip Code</Label>
              <Input
                id="address.zipCode"
                name="address.zipCode"
                value={companyData.address.zipCode}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.country">Country</Label>
              <Input
                id="address.country"
                name="address.country"
                value={companyData.address.country}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const MapPin: React.FC<{ className?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
