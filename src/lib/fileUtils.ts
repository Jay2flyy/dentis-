import { supabase } from './supabase';

// Upload file to Supabase Storage
export const uploadDocument = async (
  file: File,
  patientId: string,
  documentType: string
): Promise<{ url: string; path: string } | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${patientId}/${documentType}/${Date.now()}.${fileExt}`;

    const { data: _, error } = await supabase.storage
      .from('medical-documents')
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('medical-documents')
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
      path: fileName,
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
};

// Download file
export const downloadDocument = async (filePath: string, fileName: string) => {
  try {
    const { data: downloadData, error } = await supabase.storage
      .from('medical-documents')
      .download(filePath);

    if (error) throw error;

    // Create blob URL and trigger download
    const url = URL.createObjectURL(downloadData);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading document:', error);
  }
};

// Generate PDF from HTML
export const generatePDF = async (_elementId: string, _fileName: string) => {
  // For now, use window.print() as a simple solution
  // In production, you'd use jsPDF or similar
  window.print();
};

// Download invoice as PDF
export const downloadInvoicePDF = async (invoiceId: string) => {
  const element = document.getElementById(`invoice-${invoiceId}`);
  if (!element) return;

  // Simple print solution
  window.print();
};

// Download medical records as PDF
export const downloadMedicalRecordsPDF = async () => {
  window.print();
};

// Mock file upload for demo mode
export const mockUploadDocument = async (
  file: File,
  documentType: string
): Promise<{ url: string; path: string }> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock URL
  return {
    url: URL.createObjectURL(file),
    path: `demo/${documentType}/${file.name}`,
  };
};

// Mock file download for demo mode
export const mockDownloadDocument = (fileName: string) => {
  // Create a mock download
  const blob = new Blob(['This is a demo document'], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
