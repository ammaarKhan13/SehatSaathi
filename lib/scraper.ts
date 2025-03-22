import * as cheerio from 'cheerio';

export interface ScrapedMedicine {
  id: string;
  name: string;
  genericName: string;
  description: string;
  usages: string[];
  sideEffects: string[];
  warnings: string[];
  dosage: string;
  manufacturer: string;
  image: string;
}

export async function scrapeMedicineData(searchTerm: string): Promise<ScrapedMedicine[]> {
  try {
    // First fetch the search results
    const searchResponse = await fetch(
      `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(searchTerm)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    );
    
    const searchHtml = await searchResponse.text();
    const $ = cheerio.load(searchHtml);
    const medicines: ScrapedMedicine[] = [];

    // Get the first few result links
    const medicineLinks = $('.ddc-media-title')
      .slice(0, 5)  // Limit to first 5 results
      .map((_, el) => $(el).attr('href'))
      .get();

    // Fetch details for each medicine
    for (const link of medicineLinks) {
      if (!link) continue;

      const fullLink = link.startsWith('http') ? link : `https://www.drugs.com${link}`;
      const detailsResponse = await fetch(fullLink, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });
      
      const detailsHtml = await detailsResponse.text();
      const $details = cheerio.load(detailsHtml);

      const medicine: ScrapedMedicine = {
        id: Math.random().toString(36).substring(7),
        name: $details('h1').first().text().trim(),
        genericName: $details('.drug-subtitle').first().text().trim(),
        description: $details('#uses').next('p').text().trim(),
        usages: $details('#uses')
          .nextUntil('h2')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0),
        sideEffects: $details('#side-effects')
          .nextUntil('h2')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0),
        warnings: $details('#warnings')
          .nextUntil('h2')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 0),
        dosage: $details('#dosage')
          .nextUntil('h2')
          .first()
          .text()
          .trim(),
        manufacturer: $details('.drug-manufacturer')
          .first()
          .text()
          .trim() || 'Not specified',
        image: $details('img').first().attr('src') || 'Not available'
      };

      medicines.push(medicine);
    }

    return medicines;
  } catch (error) {
    console.error('Scraping failed:', error);
    throw error;
  }
}