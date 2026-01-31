'use client';

import { useState } from 'react';
import { useBulkImportProduct } from '@/hooks/useProduct';
import { toast } from '@/components/ui/Toast';
import { X, Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUIStore } from '@/store/useUIStore';

export default function BulkUploadModal() {
  const { isBulkUploadModalOpen, closeBulkUploadModal } = useUIStore();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  const bulkImportMutation = useBulkImportProduct();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === 'text/csv' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel' ||
        selectedFile.name.endsWith('.csv') ||
        selectedFile.name.endsWith('.xlsx')
      ) {
        setFile(selectedFile);
        setResult(null);
      } else {
        toast.error('Please upload a valid CSV or Excel file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await bulkImportMutation.mutateAsync(file);
      setResult(response.data);
      toast.success('Bulk import completed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload products');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = (type) => {
    const filename = type === 'csv' ? 'sample_products.csv' : 'sample_products.xlsx';
    // Link to the backend public folder
    window.open(`http://localhost:8000/api/public/templates/${filename}`, '_blank');
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    closeBulkUploadModal();
  };

  if (!isBulkUploadModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm shadow-2xl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#e09a74]" />
              Bulk Product Import
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!result ? (
            <div className="space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg flex items-start gap-3 border border-orange-100">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-1">Important Information</p>
                  <ul className="list-disc list-inside space-y-1 opacity-90 text-[13px]">
                    <li>"Category Name" must exist in the system (Level 3).</li>
                    <li>Required: Product Name, Category Name.</li>
                    <li>Slug & Descriptions will be auto-filled if empty.</li>
                  </ul>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept=".csv, .xlsx, .xls"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-[#e09a74]" />
                  </div>
                  {file ? (
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-gray-500 mt-1">Ready to import</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-gray-900">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">Excel (.xlsx) or CSV files only</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => downloadTemplate('csv')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  CSV Template
                </button>
                <button
                  onClick={() => downloadTemplate('xlsx')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Download className="w-4 h-4 text-green-600" />
                  Excel Template
                </button>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full bg-[#e09a74] text-white py-3.5 rounded-lg font-bold hover:bg-[#d08963] disabled:opacity-50 shadow-lg shadow-orange-100"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing File...
                    </div>
                  ) : 'Start Bulk Import'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Import Complete</h3>
              <p className="text-sm text-gray-600 mb-6 px-4">{result.message}</p>

              <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sync Summary</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Successfully Added</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">{result.details.success} products</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">Failed / Skipped</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">{result.details.failed} rows</span>
                  </div>
                </div>

                {result.details.errors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-red-500 mb-2">Error Logs:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                      {result.details.errors.map((err, idx) => (
                        <p key={idx} className="text-[11px] text-red-600 bg-red-50 p-1.5 rounded flex items-start gap-2">
                          <span className="shrink-0">•</span>
                          {err}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
              >
                Close & View Updates
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}