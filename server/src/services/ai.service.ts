import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeMedicalReport = async (fileBuffer: Buffer) => {
  const base64Image = fileBuffer.toString('base64');

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Ti si stručni asistent za interpretaciju laboratorijskih nalaza. 
        Tvoj zadatak je da analiziraš sliku i vratiš strukturiran JSON na SRPSKOM jeziku.
        
        Za svaki parametar koji pronađeš, moraš pružiti:
        1. "parameter": Pun naziv (npr. "Srednja zapremina eritrocita (MCV)")
        2. "abbreviation": Skraćenica (npr. "MCV")
        3. "description": Kratko objašnjenje šta taj parametar meri.
        4. "value" i "unit": Brojčana vrednost i merna jedinica.
        5. "status": Identifikuj da li je "normal", "high" ili "low" na osnovu referentnih vrednosti sa slike.
        6. "advice": Konkretan savet o ishrani ili navikama ako je status "high" ili "low". Ako je "normal", napiši "Nastavite sa trenutnim navikama".

        Format odgovora mora biti isključivo JSON:
        {
          "summary": "Opšti rezime zdravstvenog stanja na osnovu nalaza.",
          "results": [
            {
              "parameter": "Naziv",
              "abbreviation": "SKR",
              "description": "Šta je ovo?",
              "value": 0.0,
              "unit": "jedinica",
              "status": "normal/high/low",
              "referenceRange": "0.0 - 0.0",
              "advice": "Savet za poboljšanje"
            }
          ]
        }`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Detaljno analiziraj ovaj nalaz, objasni skraćenice i daj savete za odstupanja:" },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content || "{}");
};