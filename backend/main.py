from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import requests
import json
import base64
from PIL import Image, ImageEnhance, ImageFilter
import io

app = FastAPI(title="KalaMitra API", description="AI-powered assistant for Indian artisans")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face API configuration
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")
TRANSLATION_MODEL = "facebook/nllb-200-distilled-600M"

class ProductRequest(BaseModel):
    product_name: str
    materials: Optional[str] = None
    dimensions: Optional[str] = None
    handmade_hours: Optional[float] = None
    style: Optional[str] = None
    notes: Optional[str] = None
    language: str = "en"  # en, hi, gu

class ProductListing(BaseModel):
    title: str
    price_inr: int
    description_en: str
    description_hi: Optional[str] = None
    description_gu: Optional[str] = None
    hashtags: list[str]
    instagram_caption_en: str
    instagram_caption_hi: Optional[str] = None
    instagram_caption_gu: Optional[str] = None

class PhotoEnhancement(BaseModel):
    original: str
    enhanced: str
    instagram_square: str
    instagram_story: str
    whatsapp_status: str

def calculate_price(product: ProductRequest) -> int:
    """Calculate fair price based on materials and labor hours"""
    base_price = 100  # Base price in INR
    
    # Material-based pricing (support multilingual input)
    if product.materials:
        materials = product.materials.lower()
        # English terms
        if any(term in materials for term in ["silk", "रेशम", "રેશમ"]):
            base_price += 200
        elif any(term in materials for term in ["cotton", "कपास", "કપાસ"]):
            base_price += 100
        elif any(term in materials for term in ["wood", "लकड़ी", "લાકડું"]):
            base_price += 150
        elif any(term in materials for term in ["metal", "brass", "धातु", "ધાતુ"]):
            base_price += 180
        elif any(term in materials for term in ["clay", "ceramic", "मिट्टी", "માટી"]):
            base_price += 120
        elif any(term in materials for term in ["leather", "चमड़ा", "ચામડું"]):
            base_price += 160
    
    # Labor hours pricing (₹50 per hour)
    if product.handmade_hours:
        base_price += int(product.handmade_hours * 50)
    
    return base_price

def translate_text(text: str, target_lang: str) -> Optional[str]:
    """Translate text using Hugging Face API or fallback to basic translation"""
    if not HUGGINGFACE_API_TOKEN:
        return get_basic_translation(text, target_lang)
    
    try:
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}"}
        
        # Language codes for NLLB model
        lang_codes = {
            "hi": "hin_Deva",  # Hindi
            "gu": "guj_Gujr",  # Gujarati
            "en": "eng_Latn"   # English
        }
        
        payload = {
            "inputs": text,
            "parameters": {
                "src_lang": "eng_Latn",
                "tgt_lang": lang_codes.get(target_lang, "hin_Deva")
            }
        }
        
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{TRANSLATION_MODEL}",
            headers=headers,
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("translation_text", text)
        else:
            return get_basic_translation(text, target_lang)
            
    except Exception as e:
        print(f"Translation error: {e}")
        return get_basic_translation(text, target_lang)

def get_basic_translation(text: str, target_lang: str) -> str:
    """Basic translation using predefined mappings"""
    if target_lang == "hi":
        hindi_translations = {
            "This beautiful handcrafted": "यह सुंदर हस्तनिर्मित",
            "traditional techniques": "पारंपरिक तकनीकों",
            "Indian artisans": "भारतीय कारीगरों",
            "cultural heritage": "सांस्कृतिक विरासत",
            "authentic touch": "प्रामाणिक स्पर्श",
            "Perfect for festivals": "त्योहारों के लिए एकदम सही"
        }
        
        translated = text
        for en, hi in hindi_translations.items():
            translated = translated.replace(en, hi)
        return translated
        
    elif target_lang == "gu":
        gujarati_translations = {
            "This beautiful handcrafted": "આ સુંદર હસ્તનિર્મિત",
            "traditional techniques": "પરંપરાગત તકનીકો",
            "Indian artisans": "ભારતીય કારીગરો",
            "cultural heritage": "સાંસ્કૃતિક વારસો",
            "authentic touch": "અધિકૃત સ્પર્શ",
            "Perfect for festivals": "તહેવારો માટે સંપૂર્ણ"
        }
        
        translated = text
        for en, gu in gujarati_translations.items():
            translated = translated.replace(en, gu)
        return translated
    
    return text

def generate_description(product: ProductRequest) -> str:
    """Generate English product description"""
    # Translate product name to English if needed
    product_name = product.product_name
    if product.language == "hi":
        product_name = translate_hindi_to_english(product.product_name)
    elif product.language == "gu":
        product_name = translate_gujarati_to_english(product.product_name)
    
    description = f"This beautiful handcrafted {product_name.lower()} "
    
    if product.materials:
        description += f"is made with premium {product.materials} using traditional techniques. "
    else:
        description += "is crafted using traditional Indian techniques. "
    
    if product.style:
        description += f"Featuring {product.style.lower()} style craftsmanship, "
    
    if product.dimensions:
        description += f"measuring {product.dimensions}, "
    
    description += "this piece represents the rich cultural heritage of Indian artisans. "
    
    if product.handmade_hours:
        description += f"Carefully crafted over {product.handmade_hours} hours, "
    
    description += "each piece is unique and perfect for adding an authentic touch to your home. "
    
    if product.notes:
        description += f"{product.notes}"
    else:
        description += "Perfect for festivals, gifting, or everyday use."
    
    return description

def translate_hindi_to_english(text: str) -> str:
    """Basic Hindi to English translation for product names"""
    hindi_to_english = {
        'दिया': 'Diya',
        'कटोरा': 'Bowl',
        'मूर्ति': 'Sculpture',
        'गहने': 'Jewelry',
        'कपड़ा': 'Fabric',
        'चादर': 'Sheet',
        'तकिया': 'Pillow',
        'बैग': 'Bag',
        'जूते': 'Shoes',
        'थाली': 'Plate',
        'लैंप': 'Lamp',
        'फूलदान': 'Vase'
    }
    
    for hindi, english in hindi_to_english.items():
        if hindi in text:
            return english
    return text

def translate_gujarati_to_english(text: str) -> str:
    """Basic Gujarati to English translation for product names"""
    gujarati_to_english = {
        'દિવો': 'Diya',
        'બાઉલ': 'Bowl',
        'મૂર્તિ': 'Sculpture',
        'દાગીના': 'Jewelry',
        'કપડું': 'Fabric',
        'ચાદર': 'Sheet',
        'ઓશીકું': 'Pillow',
        'બેગ': 'Bag',
        'જૂતા': 'Shoes',
        'થાળી': 'Plate',
        'લેમ્પ': 'Lamp',
        'ફૂલદાની': 'Vase'
    }
    
    for gujarati, english in gujarati_to_english.items():
        if gujarati in text:
            return english
    return text

def generate_hashtags(product: ProductRequest) -> list[str]:
    """Generate relevant hashtags based on input language"""
    base_hashtags = [
        "#HandmadeInIndia", "#IndianCrafts", "#ArtisanMade", 
        "#TraditionalArt", "#MadeInIndia", "#SupportLocal",
        "#HandcraftedWithLove", "#AuthenticIndian"
    ]
    
    # Add language-specific hashtags
    if product.language == "hi":
        base_hashtags.extend(["#हस्तनिर्मित", "#भारतीयकला", "#पारंपरिकशिल्प"])
    elif product.language == "gu":
        base_hashtags.extend(["#હસ્તનિર્મિત", "#ગુજરાતીકલા", "#પરંપરાગતશિલ્પ"])
    
    # Add product-specific hashtags
    product_hashtags = [f"#{product.product_name.replace(' ', '')}"]
    
    if product.materials:
        material_tags = [f"#{material.strip().replace(' ', '')}" 
                        for material in product.materials.split(',')]
        product_hashtags.extend(material_tags)
    
    if product.style:
        product_hashtags.append(f"#{product.style.replace(' ', '')}")
    
    # Combine and limit to 15 hashtags
    all_hashtags = base_hashtags + product_hashtags
    return list(set(all_hashtags))[:15]

def generate_instagram_caption(product: ProductRequest, price: int, lang: str = "en") -> str:
    """Generate Instagram caption in specified language"""
    if lang == "hi":
        caption = f"✨ हस्तनिर्मित {product.product_name} की सुंदरता को खोजें! 🎨\n\n"
        if product.materials:
            caption += f"पारंपरिक तकनीकों और प्रीमियम {product.materials} के साथ प्रेम से बनाया गया। "
        caption += "हर टुकड़ा हमारी समृद्ध सांस्कृतिक विरासत की कहानी कहता है। 🇮🇳\n\n"
        if product.style:
            caption += f"शैली: {product.style}\n"
        if product.dimensions:
            caption += f"आकार: {product.dimensions}\n"
        caption += f"मूल्य: ₹{price}\n\n"
        caption += "स्थानीय कारीगरों का समर्थन करें! 🙏\n\n#हस्तनिर्मित #भारतीयकला #स्थानीयसमर्थन"
        
    elif lang == "gu":
        caption = f"✨ હસ્તનિર્મિત {product.product_name} ની સુંદરતા શોધો! 🎨\n\n"
        if product.materials:
            caption += f"પરંપરાગત તકનીકો અને પ્રીમિયમ {product.materials} સાથે પ્રેમથી બનાવવામાં આવ્યું। "
        caption += "દરેક ટુકડો આપણી સમૃદ્ધ સાંસ્કૃતિક વારસાની વાર્તા કહે છે। 🇮🇳\n\n"
        if product.style:
            caption += f"શૈલી: {product.style}\n"
        if product.dimensions:
            caption += f"માપ: {product.dimensions}\n"
        caption += f"કિંમત: ₹{price}\n\n"
        caption += "સ્થાનિક કારીગરોને ટેકો આપો! 🙏\n\n#હસ્તનિર્મિત #ગુજરાતીકલા #સ્થાનિકસમર્થન"
        
    else:  # English
        product_name = product.product_name
        if product.language == "hi":
            product_name = translate_hindi_to_english(product.product_name)
        elif product.language == "gu":
            product_name = translate_gujarati_to_english(product.product_name)
            
        caption = f"✨ Discover the beauty of handcrafted {product_name}! 🎨\n\n"
        if product.materials:
            caption += f"Made with love using traditional techniques and premium {product.materials}. "
        caption += "Each piece tells a story of our rich cultural heritage. 🇮🇳\n\n"
        if product.style:
            caption += f"Style: {product.style}\n"
        if product.dimensions:
            caption += f"Size: {product.dimensions}\n"
        caption += f"Price: ₹{price}\n\n"
        caption += "Support local artisans and bring home a piece of authentic Indian craftsmanship! 🙏\n\n#HandmadeInIndia #IndianCrafts #SupportLocal"
    
    return caption

def enhance_image(image_data: bytes) -> bytes:
    """Enhance image quality using PIL"""
    try:
        # Open image
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Enhance the image
        # Increase sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.2)
        
        # Increase contrast slightly
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.1)
        
        # Increase color saturation
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.15)
        
        # Apply subtle unsharp mask
        image = image.filter(ImageFilter.UnsharpMask(radius=1, percent=150, threshold=3))
        
        # Save enhanced image
        output = io.BytesIO()
        image.save(output, format='JPEG', quality=95, optimize=True)
        return output.getvalue()
        
    except Exception as e:
        print(f"Image enhancement error: {e}")
        return image_data

def crop_for_platform(image_data: bytes, platform: str) -> bytes:
    """Crop image for specific social media platform"""
    try:
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        width, height = image.size
        
        if platform == "instagram_square":
            # 1:1 aspect ratio for Instagram posts
            size = min(width, height)
            left = (width - size) // 2
            top = (height - size) // 2
            image = image.crop((left, top, left + size, top + size))
            image = image.resize((1080, 1080), Image.Resampling.LANCZOS)
            
        elif platform in ["instagram_story", "whatsapp_status"]:
            # 9:16 aspect ratio for stories and status
            target_ratio = 9 / 16
            current_ratio = width / height
            
            if current_ratio > target_ratio:
                # Image is too wide, crop width
                new_width = int(height * target_ratio)
                left = (width - new_width) // 2
                image = image.crop((left, 0, left + new_width, height))
            else:
                # Image is too tall, crop height
                new_height = int(width / target_ratio)
                top = (height - new_height) // 2
                image = image.crop((0, top, width, top + new_height))
            
            image = image.resize((1080, 1920), Image.Resampling.LANCZOS)
        
        # Save cropped image
        output = io.BytesIO()
        image.save(output, format='JPEG', quality=90, optimize=True)
        return output.getvalue()
        
    except Exception as e:
        print(f"Image cropping error: {e}")
        return image_data

@app.get("/")
async def root():
    return {"message": "KalaMitra API is running!", "version": "2.0.0", "features": ["multilingual", "photo_enhancement"]}

@app.post("/enhance_photo")
async def enhance_photo(file: UploadFile = File(...)):
    """Enhance and crop photo for different social media platforms"""
    
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await file.read()
        
        # Enhance the original image
        enhanced_data = enhance_image(image_data)
        
        # Create crops for different platforms
        instagram_square_data = crop_for_platform(enhanced_data, "instagram_square")
        instagram_story_data = crop_for_platform(enhanced_data, "instagram_story")
        whatsapp_status_data = crop_for_platform(enhanced_data, "whatsapp_status")
        
        # Convert to base64 for frontend
        original_b64 = base64.b64encode(image_data).decode()
        enhanced_b64 = base64.b64encode(enhanced_data).decode()
        instagram_square_b64 = base64.b64encode(instagram_square_data).decode()
        instagram_story_b64 = base64.b64encode(instagram_story_data).decode()
        whatsapp_status_b64 = base64.b64encode(whatsapp_status_data).decode()
        
        return PhotoEnhancement(
            original=f"data:image/jpeg;base64,{original_b64}",
            enhanced=f"data:image/jpeg;base64,{enhanced_b64}",
            instagram_square=f"data:image/jpeg;base64,{instagram_square_b64}",
            instagram_story=f"data:image/jpeg;base64,{instagram_story_b64}",
            whatsapp_status=f"data:image/jpeg;base64,{whatsapp_status_b64}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/generate_listing", response_model=ProductListing)
async def generate_listing(product: ProductRequest):
    """Generate complete marketplace listing for artisan product with multilingual support"""
    
    try:
        # Calculate price
        price = calculate_price(product)
        
        # Generate title (always in English for marketplace)
        product_name_en = product.product_name
        if product.language == "hi":
            product_name_en = translate_hindi_to_english(product.product_name)
        elif product.language == "gu":
            product_name_en = translate_gujarati_to_english(product.product_name)
        
        title = f"Handcrafted {product.style + ' ' if product.style else ''}{product_name_en}"
        
        # Generate English description
        description_en = generate_description(product)
        
        # Generate translations
        description_hi = translate_text(description_en, "hi")
        description_gu = translate_text(description_en, "gu")
        
        # Generate hashtags
        hashtags = generate_hashtags(product)
        
        # Generate Instagram captions in all languages
        instagram_caption_en = generate_instagram_caption(product, price, "en")
        instagram_caption_hi = generate_instagram_caption(product, price, "hi")
        instagram_caption_gu = generate_instagram_caption(product, price, "gu")
        
        return ProductListing(
            title=title,
            price_inr=price,
            description_en=description_en,
            description_hi=description_hi,
            description_gu=description_gu,
            hashtags=hashtags,
            instagram_caption_en=instagram_caption_en,
            instagram_caption_hi=instagram_caption_hi,
            instagram_caption_gu=instagram_caption_gu
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating listing: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "KalaMitra API", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)