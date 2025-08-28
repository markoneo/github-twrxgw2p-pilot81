import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Download, Copy, Check, Printer, FileImage, Share2, X, Save, MessageCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';

interface VoucherGeneratorProps {
  projectId: string;
  onClose?: () => void;
  displayMode?: 'modal' | 'page';
}

export default function VoucherGenerator({ projectId, onClose, displayMode = 'modal' }: VoucherGeneratorProps) {
  const { projects, companies, drivers, carTypes } = useData();
  const [copied, setCopied] = useState(false);
  const [shareMode, setShareMode] = useState<'copy' | null>(null);
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('jpeg');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{text: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const voucherRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const params = useParams();
  
  // If we're on the voucher/:id route, use the ID from the URL
  const effectiveProjectId = projectId || params.id || '';
  
  // Find the project
  const project = projects.find(p => p.id === effectiveProjectId);
  
  useEffect(() => {
    // Set up an event listener for share API
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setShowControls(false);
      }
    };

    // Only add listener if controls are showing
    if (showControls) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showControls]);
  
  // Show status message for 3 seconds then auto-hide
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);
  
  if (!project) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Project not found.</p>
      </div>
    );
  }

  // Get company, driver and car type details
  const company = companies.find(c => c.id === project.company);
  const driver = drivers.find(d => d.id === project.driver);
  const carType = carTypes.find(c => c.id === project.carType);
  
  // Format date for display
  const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Copy voucher text to clipboard
  const copyToClipboard = () => {
    const voucherText = `
TRANSFER VOUCHER #${project.bookingId || 'N/A'}
---------------------------------------
${company?.name || 'Company'}
Date: ${formattedDate}
Time: ${project.time}

CLIENT INFORMATION
Name: ${project.clientName}
Phone: ${project.clientPhone}

TRANSFER DETAILS
Pickup: ${project.pickupLocation}
Dropoff: ${project.dropoffLocation}
Passengers: ${project.passengers}
Vehicle: ${carType?.name || 'Standard'}

DRIVER
Name: ${driver?.name || 'TBA'}
Phone: ${driver?.phone || 'TBA'}

BOOKING REFERENCE: ${project.bookingId || 'N/A'}
---------------------------------------
${project.description ? `Notes: ${project.description}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(voucherText)
      .then(() => {
        setStatusMessage({
          text: 'Copied to clipboard!',
          type: 'success'
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setStatusMessage({
          text: 'Failed to copy to clipboard',
          type: 'error'
        });
      });
  };

  // WhatsApp share function
  const shareToWhatsApp = () => {
    const voucherText = `🚗 *TRANSFER VOUCHER* #${project.bookingId || 'N/A'}

📅 *Date:* ${formattedDate}
🕐 *Time:* ${project.time}

👤 *Client:* ${project.clientName}
📞 *Phone:* ${project.clientPhone}

📍 *Pickup:* ${project.pickupLocation}
📍 *Dropoff:* ${project.dropoffLocation}

👥 *Passengers:* ${project.passengers}
🚙 *Vehicle:* ${carType?.name || 'Standard'}

🚗 *Driver:* ${driver?.name || 'TBA'}
${driver?.phone ? `📞 *Driver Phone:* ${driver.phone}` : ''}

💰 *Price:* €${project.price.toFixed(2)}
${project.paymentStatus === 'paid' ? '✅ *Payment:* Paid' : '💳 *Payment:* To be charged'}

${project.description ? `📝 *Notes:* ${project.description}` : ''}

---
${company?.name || 'Transportation Service'}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(voucherText);
    
    // Try WhatsApp Web first (works on desktop and mobile web)
    const whatsappWebUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // For mobile devices, try the WhatsApp app scheme first
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      const whatsappAppUrl = `whatsapp://send?text=${encodedMessage}`;
      
      // Try to open WhatsApp app first, fallback to web
      const tempLink = document.createElement('a');
      tempLink.href = whatsappAppUrl;
      tempLink.click();
      
      // Fallback to WhatsApp Web after a short delay if app doesn't open
      setTimeout(() => {
        window.open(whatsappWebUrl, '_blank');
      }, 1000);
    } else {
      // Desktop - open WhatsApp Web
      window.open(whatsappWebUrl, '_blank');
    }
    
    setStatusMessage({
      text: 'Opening WhatsApp...',
      type: 'success'
    });
  };

  // Web Share API for mobile
  const shareVoucher = async () => {
    if (!navigator.share) {
      // Fallback to copy
      copyToClipboard();
      return;
    }

    try {
      await navigator.share({
        title: `Transfer Voucher #${project.bookingId || 'N/A'}`,
        text: `Transfer details for ${project.clientName} on ${formattedDate} at ${project.time}`,
        url: window.location.href
      });
      setStatusMessage({
        text: 'Shared successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('Share failed:', err);
      // User probably canceled
      if (err instanceof Error && err.name !== 'AbortError') {
        setStatusMessage({
          text: 'Failed to share',
          type: 'error'
        });
      }
    }
  };

  // Print the voucher
  const printVoucher = () => {
    const printContent = document.createElement('div');
    
    if (voucherRef.current) {
      printContent.innerHTML = voucherRef.current.innerHTML;
      const originalBody = document.body.innerHTML;
      document.body.innerHTML = `
        <style>
          @page { size: 80mm 210mm; margin: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 10mm; width: 80mm; margin: 0; background: white; }
          .voucher-header { margin-bottom: 15px; }
          .voucher-section { margin-bottom: 12px; }
          .voucher-section h3 { margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 5px; font-size: 14px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .info-label { font-size: 11px; color: #666; }
          .info-value { font-size: 13px; }
          .voucher-footer { margin-top: 15px; text-align: center; font-size: 10px; color: #666; }
          @media print {
            body { padding: 10mm; width: 80mm; }
            button { display: none; }
          }
        </style>
        <div class="voucher-print-container">
          ${printContent.innerHTML}
        </div>
      `;
      window.print();
      document.body.innerHTML = originalBody;
    }
  };

  

  // Generate download URL for a text file
  const generateDownloadUrl = () => {
    const voucherText = `
TRANSFER VOUCHER #${project.bookingId || 'N/A'}
---------------------------------------
${company?.name || 'Company'}
Date: ${formattedDate}
Time: ${project.time}

CLIENT INFORMATION
Name: ${project.clientName}
Phone: ${project.clientPhone}

TRANSFER DETAILS
Pickup: ${project.pickupLocation}
Dropoff: ${project.dropoffLocation}
Passengers: ${project.passengers}
Vehicle: ${carType?.name || 'Standard'}

DRIVER
Name: ${driver?.name || 'TBA'}
Phone: ${driver?.phone || 'TBA'}

BOOKING REFERENCE: ${project.bookingId || 'N/A'}
---------------------------------------
${project.description ? `Notes: ${project.description}` : ''}
    `.trim();
    
    const blob = new Blob([voucherText], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  };

  // Generate the voucher as an image
  const generateVoucherImage = async (): Promise<string | null> => {
    if (!voucherRef.current) return null;
    
    try {
      // Hide controls before capturing
      const controlsVisible = showControls;
      setShowControls(false);
      
      // Wait a bit for UI to update
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Add padding and styling for the image
      const originalPadding = voucherRef.current.style.padding;
      const originalBackground = voucherRef.current.style.backgroundColor;
      
      voucherRef.current.style.padding = '16px';
      voucherRef.current.style.backgroundColor = 'white';
      
      // Generate image
      const options = {
        quality: 0.95,
        backgroundColor: 'white',
        width: voucherRef.current.offsetWidth,
        height: voucherRef.current.offsetHeight,
        canvasWidth: voucherRef.current.offsetWidth * 2,
        canvasHeight: voucherRef.current.offsetHeight * 2,
        pixelRatio: 2,
        skipFonts: true, // Skip fonts to improve performance
      };
      
      let dataUrl;
      if (imageFormat === 'png') {
        dataUrl = await toPng(voucherRef.current, options);
      } else {
        dataUrl = await toJpeg(voucherRef.current, options);
      }
      
      // Reset styles
      voucherRef.current.style.padding = originalPadding;
      voucherRef.current.style.backgroundColor = originalBackground;
      
      // Restore controls if they were visible
      if (controlsVisible) {
        setShowControls(true);
      }
      
      return dataUrl;
    } catch (error) {
      console.error('Error generating voucher image:', error);
      return null;
    }
  };

  // Generate and download the voucher as an image
  const downloadAsImage = async () => {
    if (!voucherRef.current) return;
    
    try {
      setIsGeneratingImage(true);
      setStatusMessage({
        text: 'Generating image...',
        type: 'info'
      });
      
      const dataUrl = await generateVoucherImage();
      
      if (!dataUrl) {
        throw new Error('Failed to generate image');
      }
      
      // For mobile devices, use FileSaver to download directly
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        try {
          // Convert data URL to blob
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          
          // Save using FileSaver
          saveAs(blob, `voucher-${project.bookingId || 'transfer'}.${imageFormat}`);
          
          setStatusMessage({
            text: 'Image saved successfully!',
            type: 'success'
          });
        } catch (error) {
          console.error('Error saving with FileSaver:', error);
          // Fall back to showing preview
          setImagePreview(dataUrl);
        }
      } else {
        // Desktop behavior - direct download
        const link = document.createElement('a');
        link.download = `voucher-${project.bookingId || 'transfer'}.${imageFormat}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setStatusMessage({
          text: 'Image downloaded!',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setStatusMessage({
        text: 'Failed to generate image',
        type: 'error'
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Download image directly from preview
  const downloadImageFromPreview = async () => {
    if (!imagePreview) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      
      // Use FileSaver for better mobile compatibility
      saveAs(blob, `voucher-${project.bookingId || 'transfer'}.${imageFormat}`);
      
      setStatusMessage({
        text: 'Image saved successfully!',
        type: 'success'
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error downloading image:', error);
      setStatusMessage({
        text: 'Failed to download image',
        type: 'error'
      });
    }
  };

  // Share image from preview
  const shareImageFromPreview = async () => {
    if (!imagePreview || !navigator.share) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      
      // Create file object
      const file = new File([blob], `voucher-${project.bookingId || 'transfer'}.${imageFormat}`, { 
        type: imageFormat === 'png' ? 'image/png' : 'image/jpeg' 
      });
      
      // Share the file
      await navigator.share({
        files: [file],
        title: `Transfer Voucher #${project.bookingId || 'N/A'}`,
      });
      
      setStatusMessage({
        text: 'Image shared successfully!',
        type: 'success'
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error sharing image:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        setStatusMessage({
          text: 'Failed to share image',
          type: 'error'
        });
      }
    }
  };

  // Floating action button to show/hide controls on mobile
  const FloatingActionButton = () => (
    <button 
      onClick={() => setShowControls(!showControls)}
      className="fixed bottom-20 right-4 z-50 bg-green-500 text-white rounded-full p-3 shadow-lg md:hidden"
      aria-label={showControls ? "Hide controls" : "Show controls"}
    >
      {showControls ? (
        <X className="h-6 w-6" />
      ) : (
        <FileImage className="h-6 w-6" />
      )}
    </button>
  );

  return (
    <div className={`${displayMode === 'page' ? 'min-h-screen bg-gray-50 pt-16' : ''}`}>
      {displayMode === 'page' && (
        <div className="max-w-md mx-auto px-4 py-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <h2 className="text-xl font-bold mb-2">Transfer Voucher</h2>
        </div>
      )}
      
      <div className={displayMode === 'page' ? "max-w-md mx-auto px-4 pb-6" : ""}>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
          {/* Mobile-specific floating action button */}
          {displayMode === 'page' && <FloatingActionButton />}
          
          {/* Status message toast */}
          {statusMessage && (
            <div 
              className={`fixed top-20 right-2 left-2 md:left-auto md:right-4 z-50 p-3 rounded-lg shadow-lg max-w-xs mx-auto md:mx-0 transition-all duration-300 flex items-center justify-between ${
                statusMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
                statusMessage.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              <span>{statusMessage.text}</span>
              <button 
                onClick={() => setStatusMessage(null)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image Preview Modal for Mobile */}
          {imagePreview && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
                <div className="flex justify-between items-center border-b p-3">
                  <h3 className="text-lg font-medium">Your Voucher</h3>
                  <button 
                    onClick={() => setImagePreview(null)}
                    className="p-1 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-gray-100 overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Voucher" 
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="p-4 space-y-3">
                  <button
                    onClick={downloadImageFromPreview}
                    className="w-full py-3 bg-green-500 text-white rounded-lg font-medium flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Save to Device
                  </button>
                  
                  {navigator.share && (
                    <button
                      onClick={shareImageFromPreview}
                      className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share Voucher
                    </button>
                  )}
                  
                  <button
                    onClick={() => setImagePreview(null)}
                    className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Voucher Header with Controls */}
          <div className="bg-green-500 text-white px-4 py-3 flex justify-between items-center no-print">
            <h3 className="font-semibold">Transfer Voucher</h3>
            
            {/* Controls - hidden on mobile unless activated */}
            <div 
              ref={controlsRef}
              className={`${
                !showControls && displayMode === 'page' ? 'hidden md:flex' : 'flex'
              } space-x-3`}
            >
              {shareMode === null && (
                <>
                  <button
                    onClick={shareToWhatsApp}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-400 active:bg-green-600 text-white"
                    title="Share voucher directly to WhatsApp - client can save or print"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Share on WhatsApp</span>
                  </button>
                  
                  <button
                    onClick={downloadAsImage}
                    disabled={isGeneratingImage}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-400 active:bg-green-600 disabled:opacity-50 text-white"
                    title="Save voucher as image file - perfect for sharing via email or messaging"
                  >
                    <Save className="h-6 w-6" />
                    <span className="text-sm font-medium">Save as Image</span>
                  </button>
                  
                  <button
                    onClick={printVoucher}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-400 active:bg-green-600 text-white"
                    title="Print voucher on paper - give to client or keep for records"
                  >
                    <Printer className="h-6 w-6" />
                    <span className="text-sm font-medium">Print Voucher</span>
                  </button>
                </>
              )}
              
            </div>
          </div>
          
          

          {/* Image format selector - hidden on mobile to simplify UI */}
          {shareMode === null && showControls && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-end space-x-4 hidden md:flex no-print">
              <div className="flex items-center text-sm">
                <span className="mr-2 text-gray-600">Image format:</span>
                <select 
                  value={imageFormat}
                  onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpeg')}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
            </div>
          )}

          {/* Voucher Content */}
          <div ref={voucherRef} className="p-4">
            {/* Header with Logo and Reference */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center">
                <div className="bg-green-500 text-white p-2 rounded-full mr-3 flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-lg">{company?.name || 'RIDECONNECT'}</h2>
                  <p className="text-xs text-gray-500">{company?.phone || '+38670832530'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-500">Booking Ref</div>
                <div className="text-green-600 font-mono font-bold">#{project.bookingId || 'N/A'}</div>
              </div>
            </div>

            {/* Transfer Details Section */}
            <div className="mb-3 bg-gray-50 p-3 rounded">
              <h3 className="font-medium mb-2 text-gray-700">Transfer Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="font-medium">{formattedDate.split(',')[0]}, {formattedDate.split(',')[1]}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="font-medium">{project.time}</div>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="mb-3">
              <h3 className="font-medium mb-2 text-gray-700">Client Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="font-medium">{project.clientName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="font-medium">{project.clientPhone}</div>
                </div>
              </div>
            </div>

            {/* Pickup & Dropoff */}
            <div className="mb-3">
              <h3 className="font-medium mb-2 text-gray-700">Pickup & Dropoff</h3>
              <div className="space-y-2">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-500">Pickup Location</div>
                  <div className="font-medium break-words">{project.pickupLocation}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-500">Dropoff Location</div>
                  <div className="font-medium break-words">{project.dropoffLocation}</div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">Passengers</div>
                <div className="font-medium">{project.passengers}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Vehicle Type</div>
                <div className="font-medium">{carType?.name || 'STANDARD'}</div>
              </div>
            </div>

            {/* Driver Information */}
            <div className="mb-3 border-t border-gray-200 pt-3">
              <h3 className="font-medium mb-2 text-gray-700">Your Driver</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="font-medium">{driver?.name || 'To be assigned'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="font-medium">{driver?.phone || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-3 border-t border-gray-200 pt-3">
              <h3 className="font-medium mb-2 text-gray-700">Payment Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Price</div>
                  <div className="font-medium text-green-600 text-lg">€{project.price.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-medium">
                    {project.paymentStatus === 'paid' ? (
                      <span className="text-green-600">Paid</span>
                    ) : (
                      <span className="text-yellow-600">To be charged</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {project.description && (
              <div className="mb-3">
                <h3 className="font-medium mb-2 text-gray-700">Notes</h3>
                <div className="text-gray-600 text-sm bg-gray-50 p-3 rounded break-words">{project.description}</div>
              </div>
            )}

            {/* Footer with terms */}
            <div className="border-t border-gray-200 pt-3 text-xs text-gray-500 text-center">
              Please show this voucher to your driver. For assistance, contact us at {company?.phone || 'company phone'}. 
              Thank you for choosing {company?.name || 'our services'}.
            </div>
          </div>
        </div>

        {/* Simplified image download button for mobile */}
        {displayMode === 'page' && (
          <div className="fixed bottom-28 left-0 right-0 flex justify-center z-40 no-print md:hidden">
            <button
              onClick={downloadAsImage}
              disabled={isGeneratingImage}
              className="flex items-center justify-center bg-green-500 text-white px-4 py-3 rounded-full shadow-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              <span>{isGeneratingImage ? 'Saving...' : 'Save Voucher'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Close button for modal mode */}
      {displayMode === 'modal' && onClose && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}