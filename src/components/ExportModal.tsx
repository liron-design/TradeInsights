import React, { useState } from 'react';
import { X, Download, FileText, Mail, Share2, Printer } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  reportContent: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  reportContent
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv' | 'json'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeData, setIncludeData] = useState(true);
  const [emailAddress, setEmailAddress] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Generate export content based on format
      let content = '';
      let mimeType = '';
      let fileExtension = '';

      switch (exportFormat) {
        case 'pdf':
          content = await generatePDF();
          mimeType = 'application/pdf';
          fileExtension = 'pdf';
          break;
        case 'excel':
          content = await generateExcel();
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileExtension = 'xlsx';
          break;
        case 'csv':
          content = generateCSV();
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;
        case 'json':
          content = generateJSON();
          mimeType = 'application/json';
          fileExtension = 'json';
          break;
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTitle.replace(/\s+/g, '_')}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const generatePDF = async (): Promise<string> => {
    // In production, this would use a PDF library like jsPDF or Puppeteer
    return `
      PDF Export - ${reportTitle}
      Generated: ${new Date().toLocaleString()}
      
      ${reportContent}
      
      Charts included: ${includeCharts ? 'Yes' : 'No'}
      Raw data included: ${includeData ? 'Yes' : 'No'}
    `;
  };

  const generateExcel = async (): Promise<string> => {
    // In production, this would use a library like SheetJS
    const data = [
      ['Report Title', reportTitle],
      ['Generated', new Date().toLocaleString()],
      ['Content', reportContent],
      ['Charts Included', includeCharts ? 'Yes' : 'No'],
      ['Data Included', includeData ? 'Yes' : 'No']
    ];
    
    return data.map(row => row.join('\t')).join('\n');
  };

  const generateCSV = (): string => {
    const csvData = [
      ['Field', 'Value'],
      ['Report Title', reportTitle],
      ['Generated', new Date().toLocaleString()],
      ['Content', reportContent.replace(/,/g, ';')], // Escape commas
      ['Charts Included', includeCharts ? 'Yes' : 'No'],
      ['Data Included', includeData ? 'Yes' : 'No']
    ];
    
    return csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  };

  const generateJSON = (): string => {
    const jsonData = {
      reportTitle,
      generated: new Date().toISOString(),
      content: reportContent,
      options: {
        chartsIncluded: includeCharts,
        dataIncluded: includeData
      },
      metadata: {
        exportFormat: 'json',
        version: '1.0'
      }
    };
    
    return JSON.stringify(jsonData, null, 2);
  };

  const handleEmailSend = async () => {
    if (!emailAddress) return;
    
    setIsExporting(true);
    
    try {
      // In production, this would send via email service
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Report sent to ${emailAddress}`);
    } catch (error) {
      alert('Failed to send email. Please try again.');
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const handlePrint = () => {
    // Create a new window with the report content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1e293b; }
              .metadata { color: #64748b; font-size: 14px; margin-bottom: 20px; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${reportTitle}</h1>
            <div class="metadata">Generated: ${new Date().toLocaleString()}</div>
            <div class="content">${reportContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: reportTitle,
          text: 'TradeInsight AI Analysis Report',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Export Report</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Export Format</h4>
            <div className="space-y-2">
              {[
                { value: 'pdf', label: 'PDF Document', icon: FileText, desc: 'Professional report format' },
                { value: 'excel', label: 'Excel Spreadsheet', icon: Download, desc: 'Data analysis ready' },
                { value: 'csv', label: 'CSV Data', icon: Download, desc: 'Raw data export' },
                { value: 'json', label: 'JSON Format', icon: Download, desc: 'API integration ready' }
              ].map(({ value, label, icon: Icon, desc }) => (
                <label key={value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50">
                  <input
                    type="radio"
                    name="format"
                    value={value}
                    checked={exportFormat === value}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Icon className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <div className="text-slate-700 font-medium">{label}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Export Options</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">Include charts and visualizations</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeData}
                  onChange={(e) => setIncludeData(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">Include raw market data</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Download Report'}</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handlePrint}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <Printer className="w-4 h-4" />
                <span className="text-sm">Print</span>
              </button>
              
              <button
                onClick={handleShare}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>

              <button
                onClick={() => {
                  const email = prompt('Enter email address:');
                  if (email) {
                    setEmailAddress(email);
                    handleEmailSend();
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};