# KalaMitra 🎨
preview : https://kala-mitra-hack2code-hackathon.vercel.app/
**AI-Powered Assistant for Indian Artisans**

KalaMitra helps Indian artisans create professional marketplace listings with AI-generated descriptions, fair pricing, and social media content in multiple languages (English, Hindi, Gujarati) with automatic photo enhancement and cropping.

## ✨ Features

### 🌐 Multilingual Support
- **Input in Regional Languages**: Hindi (हिंदी) and Gujarati (ગુજરાતી)
- **Auto-Translation**: Generate listings in English, Hindi, and Gujarati
- **Smart Language Detection**: Automatically handles regional language inputs

### 📸 Photo Enhancement
- **AI-Powered Enhancement**: Automatic brightness, contrast, and saturation optimization
- **Smart Cropping**: Auto-crop for different social media platforms:
  - Instagram Posts (1:1 square)
  - Instagram Stories (9:16 vertical)
  - WhatsApp Status (9:16 vertical)
  - Facebook Posts (16:9 landscape)
- **One-Click Download**: Download optimized images for each platform

### 💰 Smart Pricing
- **Rule-Based Algorithm**: Fair pricing using materials and labor hours
- **Regional Material Recognition**: Supports Hindi and Gujarati material names
- **Transparent Calculation**: Clear breakdown of pricing factors

### 📱 Social Media Ready
- **Platform-Optimized Content**: Captions and hashtags for Instagram and WhatsApp
- **Multilingual Captions**: Generate captions in English, Hindi, and Gujarati
- **Hashtag Generation**: Relevant hashtags including regional language tags
- **Instagram Preview**: Mock Instagram post preview with your enhanced photos

## 🚀 Live Demo

- **Frontend**: [Deploy to Vercel](https://vercel.com/new)
- **Backend**: [Deploy to Render](https://render.com/) or [Railway](https://railway.app/)

## 🛠 Local Development

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- Git

### Frontend Setup (Next.js)

1. **Clone and setup**
   ```bash
   git clone <your-repo>
   cd kalamitra
   npm install
   ```

2. **Environment configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

### Backend Setup (FastAPI)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Optional: Add your Hugging Face token for better translations
   ```

5. **Start the server**
   ```bash
   python main.py
   ```

6. **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🌐 Free Deployment Guide

### Frontend Deployment (Vercel)

1. **Push your code to GitHub**

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
     ```

3. **Deploy**: Vercel will automatically build and deploy

### Backend Deployment Options

#### Option 1: Render (Recommended)

1. **Go to [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configuration**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Environment Variables**:
     ```
     HUGGINGFACE_API_TOKEN=your_token_here (optional)
     ```

#### Option 2: Railway

1. **Go to [railway.app](https://railway.app)**
2. **Deploy from GitHub**
3. **Add environment variables** in the dashboard
4. **Railway will auto-detect Python** and deploy

## 🔧 API Endpoints

### `POST /generate_listing`

Generate a complete marketplace listing for an artisan product with multilingual support.

**Request Body:**
```json
{
  "product_name": "दिवाली दिया",
  "materials": "मिट्टी, सोने का रंग",
  "dimensions": "8cm x 6cm",
  "handmade_hours": 2.5,
  "style": "पारंपरिक",
  "notes": "त्योहारों के लिए एकदम सही",
  "language": "hi"
}
```

**Response:**
```json
{
  "title": "Handcrafted Traditional Diwali Diya",
  "price_inr": 225,
  "description_en": "This beautiful handcrafted diya is made with premium clay...",
  "description_hi": "यह सुंदर हस्तनिर्मित दिया...",
  "description_gu": "આ સુંદર હસ્તનિર્મિત દિવો...",
  "hashtags": ["#HandmadeInIndia", "#DiwaliDiya", "#हस्तनिर्मित"],
  "instagram_caption_en": "✨ Discover the beauty of handcrafted Diwali Diya! 🎨...",
  "instagram_caption_hi": "✨ हस्तनिर्मित दिवाली दिया की सुंदरता को खोजें!...",
  "instagram_caption_gu": "✨ હસ્તનિર્મિત દિવાળી દિવાની સુંદરતા શોધો!..."
}
```

### `POST /enhance_photo`

Upload and enhance photos with automatic cropping for social media platforms.

**Request**: Multipart form data with image file

**Response:**
```json
{
  "original": "data:image/jpeg;base64,...",
  "enhanced": "data:image/jpeg;base64,...",
  "instagram_square": "data:image/jpeg;base64,...",
  "instagram_story": "data:image/jpeg;base64,...",
  "whatsapp_status": "data:image/jpeg;base64,..."
}
```

## 🎯 Pricing Algorithm

The pricing algorithm considers:

- **Base Price**: ₹100
- **Materials** (supports multilingual terms):
  - Silk/रेशम/રેશમ: +₹200
  - Wood/लकड़ी/લાકડું: +₹150
  - Metal/धातु/ધાતુ: +₹180
  - Clay/मिट्टी/માટી: +₹120
  - Cotton/कपास/કપાસ: +₹100
- **Labor**: ₹50 per hour

## 🌏 Language Support

### Supported Languages
- **English**: Full support for input and output
- **Hindi (हिंदी)**: Input support with auto-translation to English
- **Gujarati (ગુજરાતી)**: Input support with auto-translation to English

### Translation Features
- **Free Tier**: Basic translation using rule-based approach
- **Premium**: Hugging Face API integration (`facebook/nllb-200-distilled-600M`)
- **Get Token**: [Hugging Face Settings](https://huggingface.co/settings/tokens)

## 📸 Photo Enhancement Features

### Auto-Enhancement
- **Brightness & Contrast**: Automatic optimization for better visibility
- **Color Saturation**: Enhanced colors for more appealing product photos
- **Sharpness**: Improved detail clarity
- **Noise Reduction**: Cleaner, professional-looking images

### Platform-Specific Cropping
- **Instagram Posts**: 1:1 square (1080x1080px)
- **Instagram Stories**: 9:16 vertical (1080x1920px)
- **WhatsApp Status**: 9:16 vertical (1080x1920px)
- **Facebook Posts**: 16:9 landscape (1200x675px)

### Download Options
- **High Quality**: JPEG format with 90-95% quality
- **Optimized Size**: Compressed for faster uploads
- **Batch Download**: Download all formats at once

## 📱 Mobile Optimization

- **Progressive Web App** ready
- **Touch-friendly** interface with large tap targets
- **Responsive Design**: Optimized for mobile-first usage
- **Fast Loading**: Optimized images and lazy loading
- **Offline Capability**: Basic functionality works offline

## 🎨 Design System

### Color Palette
- **Primary**: Orange gradient (#FF9933 to #FF6B35)
- **Secondary**: Green (#138808)
- **Accent**: Saffron (#FF9933)
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font**: Inter (clean, readable across languages)
- **Hierarchy**: Clear heading structure
- **Line Height**: 150% for body text, 120% for headings

### Components
- **Cards**: Soft shadows with rounded corners
- **Buttons**: Gradient backgrounds with hover states
- **Forms**: Clean inputs with proper validation
- **Tabs**: Organized content with smooth transitions

## 🤝 Contributing

We welcome contributions from the community!

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines
- **Code Style**: Follow existing patterns and conventions
- **Testing**: Add tests for new features
- **Documentation**: Update README for new features
- **Accessibility**: Ensure features work across devices and languages

## 🔒 Privacy & Security

- **No Data Storage**: Photos and product details are not stored permanently
- **Secure Processing**: All image processing happens server-side
- **API Security**: Rate limiting and input validation
- **CORS Protection**: Configured for secure cross-origin requests

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Artisan Community** for inspiration and feedback
- **Hugging Face** for free translation APIs
- **Vercel & Render** for free hosting solutions
- **Shadcn/ui** for beautiful, accessible components
- **PIL (Pillow)** for image processing capabilities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@kalamitra.com
- **WhatsApp**: +91-XXXX-XXXXXX (for artisan support)

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Multilingual input (English, Hindi, Gujarati)
- ✅ Photo enhancement and cropping
- ✅ Social media optimization
- ✅ Free deployment options

### Phase 2 (Upcoming)
- 🔄 Voice input in regional languages
- 🔄 Advanced AI image enhancement
- 🔄 Bulk listing generation
- 🔄 Integration with popular marketplaces

### Phase 3 (Future)
- 🔄 Mobile app (React Native)
- 🔄 Offline functionality
- 🔄 Community marketplace
- 🔄 Artisan networking features

---

**Made with ❤️ for Indian Artisans**

*Supporting local craftsmanship through technology*

**Languages Supported**: English | हिंदी | ગુજરાતી
