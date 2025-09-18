'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Heart, MessageCircle, Send, Sparkles, Upload, Instagram, IndianRupee, Globe, Languages, Camera, Download, Crop, Palette } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface ProductForm {
  product_name: string;
  materials: string;
  dimensions: string;
  handmade_hours: string;
  style: string;
  notes: string;
  language: 'en' | 'hi' | 'gu';
}

interface GeneratedListing {
  title: string;
  price_inr: number;
  description_en: string;
  description_hi?: string;
  description_gu?: string;
  hashtags: string[];
  instagram_caption_en: string;
  instagram_caption_hi?: string;
  instagram_caption_gu?: string;
}

interface PhotoEnhancement {
  original: string;
  enhanced: string;
  instagram_square: string;
  instagram_story: string;
  whatsapp_status: string;
}

interface SharingData {
  price: string;
  contact: string;
  caption: string;
  hashtags: string;
}
export default function Home() {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [enhancedPhotos, setEnhancedPhotos] = useState<PhotoEnhancement | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sharingData, setSharingData] = useState<SharingData>({
    price: '',
    contact: '',
    caption: '',
    hashtags: ''
  });
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'gu'>('en');
  
  const [formData, setFormData] = useState<ProductForm>({
    product_name: '',
    materials: '',
    dimensions: '',
    handmade_hours: '',
    style: '',
    notes: '',
    language: 'en'
  });
  const [listing, setListing] = useState<GeneratedListing | null>(null);

  const languageLabels = {
    en: { 
      name: 'English',
      productName: 'Product Name',
      materials: 'Materials',
      dimensions: 'Dimensions', 
      hours: 'Handmade Hours',
      style: 'Style/Design',
      notes: 'Additional Notes',
      placeholders: {
        productName: 'e.g., Diwali Diya, Wooden Bowl',
        materials: 'e.g., Clay, Wood, Silk, Cotton',
        dimensions: 'e.g., 10cm x 8cm, Medium',
        style: 'e.g., Traditional, Contemporary, Rajasthani',
        notes: 'Any special features, occasions, or details about your product'
      }
    },
    hi: { 
      name: 'हिंदी',
      productName: 'उत्पाद का नाम',
      materials: 'सामग्री',
      dimensions: 'आकार', 
      hours: 'हस्तनिर्मित घंटे',
      style: 'शैली/डिज़ाइन',
      notes: 'अतिरिक्त नोट्स',
      placeholders: {
        productName: 'जैसे, दिवाली दिया, लकड़ी का कटोरा',
        materials: 'जैसे, मिट्टी, लकड़ी, रेशम, कपास',
        dimensions: 'जैसे, 10 सेमी x 8 सेमी, मध्यम',
        style: 'जैसे, पारंपरिक, समकालीन, राजस्थानी',
        notes: 'आपके उत्पाद के बारे में कोई विशेष विशेषताएं या विवरण'
      }
    },
    gu: { 
      name: 'ગુજરાતી',
      productName: 'ઉત્પાદનું નામ',
      materials: 'સામગ્રી',
      dimensions: 'માપ', 
      hours: 'હસ્તનિર્મિત કલાકો',
      style: 'શૈલી/ડિઝાઇન',
      notes: 'વધારાની નોંધો',
      placeholders: {
        productName: 'જેમ કે, દિવાળી દિવો, લાકડાનો બાઉલ',
        materials: 'જેમ કે, માટી, લાકડું, રેશમ, કપાસ',
        dimensions: 'જેમ કે, 10 સેમી x 8 સેમી, મધ્યમ',
        style: 'જેમ કે, પરંપરાગત, સમકાલીન, રાજસ્થાની',
        notes: 'તમારા ઉત્પાદન વિશે કોઈ વિશેષ લક્ષણો અથવા વિગતો'
      }
    }
  };

  const currentLang = languageLabels[formData.language];

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setIsProcessingPhoto(true);
    
    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const originalImage = e.target?.result as string;
        setUploadedPhoto(originalImage);
        
        // Simulate photo enhancement and cropping
        await enhanceAndCropPhoto(originalImage);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Error processing image');
      setIsProcessingPhoto(false);
    }
  };

  const enhanceAndCropPhoto = async (originalImage: string) => {
    // Simulate AI enhancement and auto-cropping
    setTimeout(() => {
      const enhanced: PhotoEnhancement = {
        original: originalImage,
        enhanced: originalImage, // In production, this would be AI-enhanced
        instagram_square: originalImage, // 1:1 crop
        instagram_story: originalImage, // 9:16 crop
        whatsapp_status: originalImage // 9:16 crop
      };
      
      setEnhancedPhotos(enhanced);
      setIsProcessingPhoto(false);
      toast.success('Photo processed successfully!');
    }, 2000);
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filename} downloaded!`);
  };

  const generateListing = async () => {
    setIsLoading(true);
    
    // Simulate API call with language detection
    setTimeout(() => {
      const mockListing: GeneratedListing = {
        title: generateTitle(formData),
        price_inr: calculatePrice(formData),
        description_en: generateDescription(formData),
        description_hi: generateHindiDescription(formData),
        description_gu: generateGujaratiDescription(formData),
        hashtags: generateHashtags(formData),
        instagram_caption_en: generateInstagramCaption(formData),
        instagram_caption_hi: generateHindiInstagramCaption(formData),
        instagram_caption_gu: generateGujaratiInstagramCaption(formData)
      };
      
      setListing(mockListing);
      // Initialize sharing data with generated content
      setSharingData({
        price: `₹${mockListing.price_inr}`,
        contact: 'Add your contact details',
        caption: mockListing.instagram_caption_en,
        hashtags: mockListing.hashtags.join(' ')
      });
      setStep('results');
      setIsLoading(false);
    }, 2000);
  };

  const generateTitle = (data: ProductForm): string => {
    // If input is in regional language, translate to English for title
    if (data.language === 'hi') {
      return `Handcrafted ${data.style || 'Traditional'} ${translateHindiToEnglish(data.product_name)}`;
    } else if (data.language === 'gu') {
      return `Handcrafted ${data.style || 'Traditional'} ${translateGujaratiToEnglish(data.product_name)}`;
    }
    return `Handcrafted ${data.style || 'Traditional'} ${data.product_name}`;
  };

  const translateHindiToEnglish = (text: string): string => {
    // Basic Hindi to English mapping for common craft terms
    const hindiToEnglish: { [key: string]: string } = {
      'दिया': 'Diya',
      'कटोरा': 'Bowl',
      'मूर्ति': 'Sculpture',
      'गहने': 'Jewelry',
      'कपड़ा': 'Fabric',
      'चादर': 'Sheet',
      'तकिया': 'Pillow',
      'बैग': 'Bag',
      'जूते': 'Shoes'
    };
    
    for (const [hindi, english] of Object.entries(hindiToEnglish)) {
      if (text.includes(hindi)) {
        return english;
      }
    }
    return text; // Return original if no translation found
  };

  const translateGujaratiToEnglish = (text: string): string => {
    // Basic Gujarati to English mapping for common craft terms
    const gujaratiToEnglish: { [key: string]: string } = {
      'દિવો': 'Diya',
      'બાઉલ': 'Bowl',
      'મૂર્તિ': 'Sculpture',
      'દાગીના': 'Jewelry',
      'કપડું': 'Fabric',
      'ચાદર': 'Sheet',
      'ઓશીકું': 'Pillow',
      'બેગ': 'Bag',
      'જૂતા': 'Shoes'
    };
    
    for (const [gujarati, english] of Object.entries(gujaratiToEnglish)) {
      if (text.includes(gujarati)) {
        return english;
      }
    }
    return text;
  };

  const calculatePrice = (data: ProductForm): number => {
    let basePrice = 100;
    
    const materials = data.materials.toLowerCase();
    if (materials.includes('silk') || materials.includes('रेशम') || materials.includes('રેશમ')) basePrice += 200;
    if (materials.includes('cotton') || materials.includes('कपास') || materials.includes('કપાસ')) basePrice += 100;
    if (materials.includes('wood') || materials.includes('लकड़ी') || materials.includes('લાકડું')) basePrice += 150;
    if (materials.includes('metal') || materials.includes('brass') || materials.includes('धातु') || materials.includes('ધાતુ')) basePrice += 180;
    if (materials.includes('clay') || materials.includes('ceramic') || materials.includes('मिट्टी') || materials.includes('માટી')) basePrice += 120;
    
    const hours = parseFloat(data.handmade_hours) || 0;
    basePrice += hours * 50;
    
    return Math.round(basePrice);
  };

  const generateDescription = (data: ProductForm): string => {
    const productName = data.language === 'en' ? data.product_name : 
                       data.language === 'hi' ? translateHindiToEnglish(data.product_name) :
                       translateGujaratiToEnglish(data.product_name);
    
    return `This beautiful handcrafted ${productName.toLowerCase()} is made with premium ${data.materials} using traditional techniques. ${data.style ? `Featuring ${data.style.toLowerCase()} style craftsmanship, ` : ''}${data.dimensions ? `measuring ${data.dimensions}, ` : ''}this piece represents the rich cultural heritage of Indian artisans. ${data.handmade_hours ? `Carefully crafted over ${data.handmade_hours} hours, ` : ''}each piece is unique and perfect for adding an authentic touch to your home. ${data.notes || 'Perfect for festivals, gifting, or everyday use.'}`;
  };

  const generateHindiDescription = (data: ProductForm): string => {
    return `यह सुंदर हस्तनिर्मित ${data.product_name} पारंपरिक तकनीकों का उपयोग करके प्रीमियम ${data.materials} से बनाया गया है। यह भारतीय कारीगरों की समृद्ध सांस्कृतिक विरासत का प्रतिनिधित्व करता है और आपके घर में एक प्रामाणिक स्पर्श जोड़ने के लिए एकदम सही है। ${data.notes ? data.notes : 'त्योहारों, उपहार देने या रोजमर्रा के उपयोग के लिए बिल्कुल सही।'}`;
  };

  const generateGujaratiDescription = (data: ProductForm): string => {
    return `આ સુંદર હસ્તનિર્મિત ${data.product_name} પરંપરાગત તકનીકોનો ઉપયોગ કરીને પ્રીમિયમ ${data.materials} થી બનાવવામાં આવ્યું છે. તે ભારતીય કારીગરોની સમૃદ્ધ સાંસ્કૃતિક વારસાનું પ્રતિનિધિત્વ કરે છે અને તમારા ઘરમાં એક અધિકૃત સ્પર્શ ઉમેરવા માટે એકદમ યોગ્ય છે। ${data.notes ? data.notes : 'તહેવારો, ભેટ આપવા અથવા રોજિંદા ઉપયોગ માટે સંપૂર્ણ.'}`;
  };

  const generateHashtags = (data: ProductForm): string[] => {
    const baseHashtags = ['#HandmadeInIndia', '#IndianCrafts', '#ArtisanMade', '#TraditionalArt', '#MadeInIndia'];
    const productHashtags = [`#${data.product_name.replace(/\s+/g, '')}`];
    const materialHashtags = data.materials ? [`#${data.materials.replace(/\s+/g, '')}`] : [];
    const styleHashtags = data.style ? [`#${data.style.replace(/\s+/g, '')}`] : [];
    
    // Add language-specific hashtags
    if (data.language === 'hi') {
      baseHashtags.push('#हस्तनिर्मित', '#भारतीयकला');
    } else if (data.language === 'gu') {
      baseHashtags.push('#હસ્તનિર્મિત', '#ગુજરાતીકલા');
    }
    
    return [...baseHashtags, ...productHashtags, ...materialHashtags, ...styleHashtags].slice(0, 12);
  };

  const generateInstagramCaption = (data: ProductForm): string => {
    const productName = data.language === 'en' ? data.product_name : 
                       data.language === 'hi' ? translateHindiToEnglish(data.product_name) :
                       translateGujaratiToEnglish(data.product_name);
    
    return `✨ Discover the beauty of handcrafted ${productName}! 🎨\n\nMade with love using traditional techniques and premium ${data.materials}. Each piece tells a story of our rich cultural heritage. 🇮🇳\n\n${data.style ? `Style: ${data.style}\n` : ''}${data.dimensions ? `Size: ${data.dimensions}\n` : ''}\nSupport local artisans and bring home a piece of authentic Indian craftsmanship! 🙏\n\n#HandmadeInIndia #IndianCrafts #SupportLocal`;
  };

  const generateHindiInstagramCaption = (data: ProductForm): string => {
    return `✨ हस्तनिर्मित ${data.product_name} की सुंदरता को खोजें! 🎨\n\nपारंपरिक तकनीकों और प्रीमियम ${data.materials} के साथ प्रेम से बनाया गया। हर टुकड़ा हमारी समृद्ध सांस्कृतिक विरासत की कहानी कहता है। 🇮🇳\n\nस्थानीय कारीगरों का समर्थन करें और प्रामाणिक भारतीय शिल्पकला का एक टुकड़ा घर लाएं! 🙏\n\n#हस्तनिर्मित #भारतीयकला #स्थानीयसमर्थन`;
  };

  const generateGujaratiInstagramCaption = (data: ProductForm): string => {
    return `✨ હસ્તનિર્મિત ${data.product_name} ની સુંદરતા શોધો! 🎨\n\nપરંપરાગત તકનીકો અને પ્રીમિયમ ${data.materials} સાથે પ્રેમથી બનાવવામાં આવ્યું. દરેક ટુકડો આપણી સમૃદ્ધ સાંસ્કૃતિક વારસાની વાર્તા કહે છે। 🇮🇳\n\nસ્થાનિક કારીગરોને ટેકો આપો અને અધિકૃત ભારતીય હસ્તકલાનો એક ભાગ ઘરે લાવો! 🙏\n\n#હસ્તનિર્મિત #ગુજરાતીકલા #સ્થાનિકસમર્થન`;
  };
  const updateSharingData = (field: keyof SharingData, value: string) => {
    setSharingData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentCaption = () => {
    if (!listing) return '';
    
    switch (selectedLanguage) {
      case 'hi':
        return listing.instagram_caption_hi || listing.instagram_caption_en;
      case 'gu':
        return listing.instagram_caption_gu || listing.instagram_caption_en;
      default:
        return listing.instagram_caption_en;
    }
  };

  const shareToInstagram = (format: 'post' | 'story') => {
    if (!enhancedPhotos) {
      toast.error('Please upload a photo first');
      return;
    }

    const imageUrl = format === 'post' ? enhancedPhotos.instagram_square : enhancedPhotos.instagram_story;
    const caption = `${sharingData.caption}\n\nPrice: ${sharingData.price}\nContact: ${sharingData.contact}\n\n${sharingData.hashtags}`;
    
    // Create a temporary link to download the image with caption
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `instagram-${format}-${Date.now()}.jpg`;
    link.click();
    
    // Copy caption to clipboard
    navigator.clipboard.writeText(caption);
    
    // Try to open Instagram (mobile) or show instructions
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open Instagram app
      window.open('instagram://camera', '_blank');
      toast.success(`Image downloaded and caption copied! Open Instagram to share your ${format}.`);
    } else {
      // Desktop instructions
      toast.success(`Image downloaded and caption copied! Upload to Instagram on your mobile device.`);
    }
  };

  const shareToWhatsApp = () => {
    if (!enhancedPhotos) {
      toast.error('Please upload a photo first');
      return;
    }

    const message = `${sharingData.caption}\n\nPrice: ${sharingData.price}\nContact: ${sharingData.contact}\n\n${sharingData.hashtags}`;
    
    // Download image for WhatsApp
    const link = document.createElement('a');
    link.href = enhancedPhotos.whatsapp_status;
    link.download = `whatsapp-status-${Date.now()}.jpg`;
    link.click();
    
    // Open WhatsApp with message
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success('Image downloaded! Share via WhatsApp with the pre-filled message.');
  };

  const shareToFacebook = () => {
    const message = `${sharingData.caption}\n\nPrice: ${sharingData.price}\nContact: ${sharingData.contact}\n\n${sharingData.hashtags}`;
    
    if (enhancedPhotos) {
      // Download image
      const link = document.createElement('a');
      link.href = enhancedPhotos.enhanced;
      link.download = `facebook-post-${Date.now()}.jpg`;
      link.click();
    }
    
    // Copy message to clipboard
    navigator.clipboard.writeText(message);
    
    // Open Facebook
    window.open('https://www.facebook.com/', '_blank');
    toast.success('Caption copied! Upload your image to Facebook and paste the caption.');
  };

  const copyAllContent = () => {
    const fullContent = `${sharingData.caption}\n\nPrice: ${sharingData.price}\nContact: ${sharingData.contact}\n\n${sharingData.hashtags}`;
    navigator.clipboard.writeText(fullContent);
    toast.success('Complete post content copied to clipboard!');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  if (step === 'results' && listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
        <Toaster />
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-900">KalaMitra</h1>
            </div>
            <p className="text-gray-600">AI-Generated Marketplace Listing</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Photo Enhancement Results */}
            {enhancedPhotos && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Enhanced Photos
                  </CardTitle>
                  <CardDescription>
                    Auto-enhanced and cropped for different platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="enhanced" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="enhanced" className="text-xs">Enhanced</TabsTrigger>
                      <TabsTrigger value="instagram" className="text-xs">IG Post</TabsTrigger>
                      <TabsTrigger value="story" className="text-xs">IG Story</TabsTrigger>
                      <TabsTrigger value="whatsapp" className="text-xs">WhatsApp</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="enhanced" className="space-y-3">
                      <div className="relative">
                        <img 
                          src={enhancedPhotos.enhanced} 
                          alt="Enhanced" 
                          className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-600 text-white">
                            <Palette className="w-3 h-3 mr-1" />
                            Enhanced
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => downloadImage(enhancedPhotos.enhanced, 'enhanced-photo.jpg')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download Enhanced
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="instagram" className="space-y-3">
                      <div className="relative">
                        <img 
                          src={enhancedPhotos.instagram_square} 
                          alt="Instagram Square" 
                          className="w-full aspect-square object-cover rounded-lg border-2 border-pink-200"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-pink-600 text-white">
                            <Crop className="w-3 h-3 mr-1" />
                            1:1
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => downloadImage(enhancedPhotos.instagram_square, 'instagram-post.jpg')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download for IG Post
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="story" className="space-y-3">
                      <div className="relative">
                        <img 
                          src={enhancedPhotos.instagram_story} 
                          alt="Instagram Story" 
                          className="w-full aspect-[9/16] object-cover rounded-lg border-2 border-purple-200"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-purple-600 text-white">
                            <Crop className="w-3 h-3 mr-1" />
                            9:16
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => downloadImage(enhancedPhotos.instagram_story, 'instagram-story.jpg')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download for IG Story
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="whatsapp" className="space-y-3">
                      <div className="relative">
                        <img 
                          src={enhancedPhotos.whatsapp_status} 
                          alt="WhatsApp Status" 
                          className="w-full aspect-[9/16] object-cover rounded-lg border-2 border-green-200"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-600 text-white">
                            <Crop className="w-3 h-3 mr-1" />
                            9:16
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => downloadImage(enhancedPhotos.whatsapp_status, 'whatsapp-status.jpg')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download for WhatsApp
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Generated Listing */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Product Listing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{listing.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">₹{listing.price_inr}</span>
                  </div>
                </div>
                
                <Separator />
                
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                    <TabsTrigger value="gu">ગુજરાતી</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="en" className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">English Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{listing.description_en}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hi" className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Hindi Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{listing.description_hi}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="gu" className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Gujarati Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{listing.description_gu}</p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div>
                  <h4 className="font-semibold mb-2">Hashtags</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.hashtags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instagram Preview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="w-5 h-5" />
                  Share Your Post
                </CardTitle>
                <CardDescription>
                  Edit your price and contact, then share directly to social platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Editable Fields */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                      <Input
                        id="price"
                        value={sharingData.price}
                        onChange={(e) => updateSharingData('price', e.target.value)}
                        placeholder="₹299"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact" className="text-sm font-medium">Contact</Label>
                      <Input
                        id="contact"
                        value={sharingData.contact}
                        onChange={(e) => updateSharingData('contact', e.target.value)}
                        placeholder="WhatsApp: +91-XXXXX-XXXXX"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="caption" className="text-sm font-medium">Caption</Label>
                    <Textarea
                      id="caption"
                      value={sharingData.caption}
                      onChange={(e) => updateSharingData('caption', e.target.value)}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hashtags" className="text-sm font-medium">Hashtags</Label>
                    <Textarea
                      id="hashtags"
                      value={sharingData.hashtags}
                      onChange={(e) => updateSharingData('hashtags', e.target.value)}
                      rows={2}
                      className="mt-1"
                      placeholder="#HandmadeInIndia #IndianCrafts"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Mock Instagram Post */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
                  {/* Instagram Header */}
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm">kalamitra_official</span>
                    </div>
                    <div className="text-gray-500">•••</div>
                  </div>
                  
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center relative overflow-hidden">
                    {enhancedPhotos ? (
                      <img 
                        src={enhancedPhotos.instagram_square} 
                        alt="Product" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">🎨</div>
                    )}
                  </div>
                  
                  {/* Instagram Actions */}
                  <div className="p-3">
                    <div className="flex items-center gap-4 mb-2">
                      <Heart className="w-6 h-6" />
                      <MessageCircle className="w-6 h-6" />
                      <Send className="w-6 h-6" />
                    </div>
                    
                    <p className="text-sm mb-2">
                      <span className="font-semibold">kalamitra_official</span>{' '}
                      {`${sharingData.caption.substring(0, 80)}...`}
                      {listing.instagram_caption_en.substring(0, 100)}...
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Price:</span> {sharingData.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Contact:</span> {sharingData.contact}
                    </p>
                  </div>
                </div>
                
                {/* Direct Sharing Buttons */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Share Directly</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => shareToInstagram('post')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      disabled={!enhancedPhotos}
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      IG Post
                    </Button>
                    
                    <Button
                      onClick={() => shareToInstagram('story')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      disabled={!enhancedPhotos}
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      IG Story
                    </Button>
                    
                    <Button
                      onClick={shareToWhatsApp}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={!enhancedPhotos}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    
                    <Button
                      onClick={shareToFacebook}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={copyAllContent}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Content
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Actions */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => {
                setStep('form');
                setListing(null);
                setUploadedPhoto(null);
                setEnhancedPhotos(null);
                setSharingData({
                  price: '',
                  contact: '',
                  caption: '',
                  hashtags: ''
                });
                setFormData({
                  product_name: '',
                  materials: '',
                  dimensions: '',
                  handmade_hours: '',
                  style: '',
                  notes: '',
                  language: 'en'
                });
              }}
              variant="outline"
              className="mr-4"
            >
              Create Another Listing
            </Button>
            <Button
              onClick={copyAllContent}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Complete Post
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">KalaMitra</h1>
          </div>
          <p className="text-gray-600">AI-Powered Assistant for Indian Artisans</p>
          <p className="text-sm text-gray-500 mt-2">Create marketplace-ready product listings in seconds</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Photo Upload Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Product Photo
              </CardTitle>
              <CardDescription>
                Upload your product photo for auto-enhancement and social media cropping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!uploadedPhoto ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload product photo</p>
                  <p className="text-xs text-gray-500">Supports JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={uploadedPhoto} 
                      alt="Uploaded product" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {isProcessingPhoto && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <p className="text-sm">Enhancing photo...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {enhancedPhotos && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="w-full aspect-square bg-gray-100 rounded border mb-2 overflow-hidden">
                          <img 
                            src={enhancedPhotos.instagram_square} 
                            alt="Instagram" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-600">Instagram Post</p>
                      </div>
                      <div className="text-center">
                        <div className="w-full aspect-[9/16] bg-gray-100 rounded border mb-2 overflow-hidden">
                          <img 
                            src={enhancedPhotos.instagram_story} 
                            alt="Story" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-600">Story/Status</p>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setUploadedPhoto(null);
                      setEnhancedPhotos(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Upload Different Photo
                  </Button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Product Details
              </CardTitle>
              <CardDescription>
                Tell us about your handcrafted product in your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label htmlFor="language">Input Language</Label>
                <Select value={formData.language} onValueChange={(value: 'en' | 'hi' | 'gu') => handleInputChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="hi">🇮🇳 हिंदी (Hindi)</SelectItem>
                    <SelectItem value="gu">🇮🇳 ગુજરાતી (Gujarati)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">{currentLang.productName} *</Label>
                  <Input
                    id="product_name"
                    placeholder={currentLang.placeholders.productName}
                    value={formData.product_name}
                    onChange={(e) => handleInputChange('product_name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="materials">{currentLang.materials}</Label>
                  <Input
                    id="materials"
                    placeholder={currentLang.placeholders.materials}
                    value={formData.materials}
                    onChange={(e) => handleInputChange('materials', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">{currentLang.dimensions}</Label>
                  <Input
                    id="dimensions"
                    placeholder={currentLang.placeholders.dimensions}
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="handmade_hours">{currentLang.hours}</Label>
                  <Input
                    id="handmade_hours"
                    type="number"
                    step="0.5"
                    placeholder="2.5"
                    value={formData.handmade_hours}
                    onChange={(e) => handleInputChange('handmade_hours', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">{currentLang.style}</Label>
                <Input
                  id="style"
                  placeholder={currentLang.placeholders.style}
                  value={formData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{currentLang.notes}</Label>
                <Textarea
                  id="notes"
                  placeholder={currentLang.placeholders.notes}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              <Separator />

              <Button
                onClick={generateListing}
                disabled={!formData.product_name || isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating AI Listing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Listing
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <IndianRupee className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Smart Pricing</h3>
              <p className="text-xs text-gray-600">Fair prices based on materials & labor</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <Languages className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Multilingual</h3>
              <p className="text-xs text-gray-600">English, Hindi & Gujarati support</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Photo Enhancement</h3>
              <p className="text-xs text-gray-600">Auto-crop for social platforms</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <Instagram className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Social Ready</h3>
              <p className="text-xs text-gray-600">Instagram & WhatsApp optimized</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}