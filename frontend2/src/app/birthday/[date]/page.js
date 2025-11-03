import { notFound } from 'next/navigation';
import { getChartByDate } from '@/lib/api';
import BirthdayClient from './BirthdayClient';

export async function generateMetadata({ params }) {
  const { date } = await params;
  const data = await getChartByDate(date);
  
  if (!data) return {};
  
  const chartDate = new Date(data.chart_date);
  const formatted = chartDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    title: `Top 10 - ${formatted} | PopHits.org`,
    description: `The Hot 100 chart for the week of ${formatted}`,
  };
}

export default async function BirthdayResultPage({ params }) {
  const { date } = await params;
  
  try {
    const data = await getChartByDate(date);
    
    if (!data || !data.entries) {
      notFound();
    }

    return <BirthdayClient chart={data} requestedDate={date} />;
  } catch (err) {
    console.error('Error fetching chart:', err);
    notFound();
  }
}
