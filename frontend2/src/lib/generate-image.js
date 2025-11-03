'use server';

import puppeteer from 'puppeteer';

export async function generateBirthdayImage(requestedDate, name) {
  let browser;
  try {
    let baseUrl = 'https://pophits.org'; // Alltid pophits.org
    
    if (process.env.NODE_ENV === 'development') {
      baseUrl = 'http://localhost:3001'; // Lokalt (port 3001!)
    }
    
    console.log('Puppeteer baseUrl:', baseUrl, '| NODE_ENV:', process.env.NODE_ENV);

    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });

    const url = `${baseUrl}/birthday/${requestedDate}${
      name ? `?name=${encodeURIComponent(name)}&screenshot=true` : '?screenshot=true'
    }`;

    console.log('Navigating to:', url);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    
    // Wait for chart to render
    await page.waitForSelector('[data-chart="birthday"]', { timeout: 8000 });

    // Screenshot ONLY the chart element
    const chartElement = await page.$('[data-chart="birthday"]');
    const screenshot = await chartElement.screenshot({ type: 'png' });

    await browser.close();

    return screenshot;
  } catch (error) {
    console.error('Screenshot error:', error);
    if (browser) await browser.close();
    throw error;
  }
}
