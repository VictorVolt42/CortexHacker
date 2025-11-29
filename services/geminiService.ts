import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProfileData } from '../types';

// Fallback data in case of API failure or strictly for the requested demo text
const FALLBACK_DATA: ProfileData = {
  nome: "LEANDRO MONTEIRO FREITAS",
  cpf: "004.211.762-11",
  nascimento: "19/09/1987",
  sexo: "M",
  idade: 38,
  nome_mae: "HELENA MONTEIRO FREITAS",
  nome_pai: "LUIZ ARAUJO FREITAS",
  divida_serasa: true,
  renda: "3.081,37",
  poder_aquisitivo: "MEDIO",
  faixa_poder_aquisitivo: "De R$ 1.630 até R$ 4.082",
  telefones: ["94994695025", "94994092164"],
  emails: ["ADleandro@kdk.com"],
  endereco: {
    bairro: "CENTRO",
    cep: "68523-000",
    cidade: "SÃO LUIS",
    complemento: "SEM INFORMAÇÃO",
    logradouro: "BRASIL",
    numero: "235",
    uf: "MA"
  }
};

const addressSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bairro: { type: Type.STRING },
    cep: { type: Type.STRING },
    cidade: { type: Type.STRING },
    complemento: { type: Type.STRING },
    logradouro: { type: Type.STRING },
    numero: { type: Type.STRING },
    uf: { type: Type.STRING },
  },
  required: ["bairro", "cep", "cidade", "logradouro", "uf"]
};

const profileSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    nome: { type: Type.STRING },
    cpf: { type: Type.STRING },
    nascimento: { type: Type.STRING },
    sexo: { type: Type.STRING, enum: ["M", "F"] },
    idade: { type: Type.INTEGER },
    nome_mae: { type: Type.STRING },
    nome_pai: { type: Type.STRING },
    divida_serasa: { type: Type.BOOLEAN },
    renda: { type: Type.STRING },
    poder_aquisitivo: { type: Type.STRING },
    faixa_poder_aquisitivo: { type: Type.STRING },
    telefones: { type: Type.ARRAY, items: { type: Type.STRING } },
    emails: { type: Type.ARRAY, items: { type: Type.STRING } },
    endereco: addressSchema,
  },
  required: ["nome", "cpf", "nascimento", "sexo", "idade", "nome_mae", "nome_pai", "renda", "telefones", "emails", "endereco"]
};

export const generateProfile = async (targetName: string, locationHint: string): Promise<ProfileData> => {
  // If no API key is set, return the fallback/demo data immediately
  if (!process.env.API_KEY) {
    console.warn("No API_KEY found, using fallback data.");
    return { ...FALLBACK_DATA, nome: targetName.toUpperCase() };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Explicit instructions to enforce the user's specific constraints:
    // Location: São Luís, MA
    // Phone DDD: 94
    const prompt = `
      Create a realistic but FICTIONAL Brazilian personal data profile for a simulation game.
      The name is: ${targetName}.
      
      MANDATORY CONSTRAINTS FOR THIS SIMULATION:
      1. The address MUST be in the city of "SÃO LUIS", state "MA" (Maranhão).
      2. ALL phone numbers MUST start with the area code (DDD) 94.
      
      Generate realistic details for:
      CPF (generate a valid format string), Birth date, Mother's name, Father's name, Serasa Debt status, Income (R$), Purchasing Power Class, Phone numbers, Emails, and Address.
      
      The output must be strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: profileSchema,
        temperature: 0.8,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ProfileData;

  } catch (error) {
    console.error("Gemini generation failed, using fallback:", error);
    // Even in fallback, we respect the name entered if possible, but keep the hardcoded Leandro data structure 
    // which matches the location/DDD requirements.
    if (targetName.toLowerCase().includes("leandro")) {
        return FALLBACK_DATA;
    }
    return { ...FALLBACK_DATA, nome: targetName.toUpperCase() };
  }
};
