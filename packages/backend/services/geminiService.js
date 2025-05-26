const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI with the API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeInfluencers = async (campaign, applications) => {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Prepare the prompt
    const prompt = `
      Bir pazarlama uzmanı olarak, aşağıdaki kampanya ve influencer başvurularını analiz ederek en uygun eşleşmeleri öner.
      
      Kampanya Detayları:
      Başlık: ${campaign.title}
      Açıklama: ${campaign.description}
      Gereksinimler: ${campaign.requirements}
      Marka: ${campaign.brand}
      
      Influencer Başvuruları:
      ${applications.map(app => `
        İsim: ${app.influencer.name}
        Takipçi Sayısı: ${app.influencer.influencerProfile?.followers || 'Belirtilmemiş'}
        Kategoriler: ${app.influencer.influencerProfile?.categories?.join(', ') || 'Belirtilmemiş'}
        Başvuru Mesajı: ${app.message}
      `).join('\n')}
      
      Lütfen bu başvuruları analiz et ve:
      1. Influencer'ları en uygun olandan en az uygun olana doğru sırala
      2. Her sıralama için kısa bir açıklama yap
      3. Kararını etkileyen önemli faktörleri belirt
      
      ÖNEMLİ: Sadece geçerli bir JSON nesnesi olarak yanıt ver, markdown formatı veya ek metin kullanma. Tam olarak bu yapıyı kullan:
      {
        "rankings": [
          {
            "influencerId": "id",
            "name": "isim",
            "rank": 1,
            "explanation": "açıklama",
            "keyFactors": ["faktör1", "faktör2"]
          }
        ],
        "summary": "Genel analiz özeti"
      }
    `;

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure it's valid JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      // Parse the JSON response
      const analysis = JSON.parse(cleanText);
      return analysis;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', text);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error in Gemini AI analysis:', error);
    throw new Error('Failed to analyze influencers');
  }
};

const analyzeProfileWithGemini = async (profile) => {
  try {
    // Modeli ve ayarları başvuru analizindeki gibi belirle
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    // Promptu daha açık ve JSON zorunlu olacak şekilde hazırla
    const prompt = `
      Bir sosyal medya profilinin gerçek bir kullanıcıya mı ait yoksa sahte mi olduğunu analiz et.
      Profilin doğruluk oranını yüzde olarak (0-100 arası) ve kısa bir açıklama ile birlikte döndür.
      Profil: ${JSON.stringify(profile, null, 2)}
      
      ÖNEMLİ: Sadece geçerli bir JSON nesnesi olarak yanıt ver, markdown formatı veya ek metin kullanma. Tam olarak bu yapıyı kullan:
      {
        "oran": 85,
        "aciklama": "Profil gerçek görünüyor çünkü ..."
      }
    `;
    // AI'dan yanıt al
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const response = await result.response;
    const text = response.text();
    // Yanıtı temizle ve JSON'a parse et
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    try {
      const analysis = JSON.parse(cleanText);
      return analysis;
    } catch (e) {
      console.error('Gemini yanıtı parse edilemedi:', text);
      throw new Error('Yapay zeka yanıtı işlenemedi.');
    }
  } catch (error) {
    console.error('AI analiz hatası:', error);
    throw new Error('AI analiz hatası: ' + error.message);
  }
};

module.exports = {
  analyzeInfluencers,
  analyzeProfileWithGemini
}; 