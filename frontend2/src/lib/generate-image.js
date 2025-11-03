'use server';

import puppeteer from 'puppeteer';

export async function generateBirthdayImage(requestedDate, name) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });

    const url = `${baseUrl}/birthday/${requestedDate}${
      name ? `?name=${encodeURIComponent(name)}&screenshot=true` : '?screenshot=true'
    }`;

    console.log('Navigating to:', url);

    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Wait for chart to render
    await page.waitForSelector('[data-chart="birthday"]', { timeout: 5000 });

    // Screenshot ONLY the chart element
    const chartElement = await page.$('[data-chart="birthday"]');
    const screenshot = await chartElement.screenshot({ type: 'png' });

    await browser.close();

    return screenshot;
  } catch (error) {
    console.error('Screenshot error:', error);
    throw error;
  }
}


