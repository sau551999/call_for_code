import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
const nlu = new NaturalLanguageUnderstandingV1({
  version: '2021-08-01', 
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY,
  }),
  serviceUrl: process.env.IBM_SERVICE_URL,
});
export async function POST(request) {
  const { city, dates } = await request.json();
  try {
    const analyzeParams = {
      text: `Create a detailed itinerary for a trip to ${city} from ${dates[0]} to ${dates[1]}.`,
      features: {
        keywords: {},
        categories: {},
        emotion: {},
      },
    };
    const response = await nlu.analyze(analyzeParams);
    const itinerary = response.result.keywords.map(keyword => keyword.text).join(', ');
    return new Response(JSON.stringify({ itinerary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('IBM Watsonx API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch itinerary' }), {
      status: 500,
    });
  }
}