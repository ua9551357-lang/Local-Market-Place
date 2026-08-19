import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VoiceService {
  constructor(private prisma: PrismaService) {}

  async parseIntent(transcript: string) {
    const text = transcript.toLowerCase();

    // Match category by keyword
    const categories = await this.prisma.category.findMany();
    const categoryKeywords: Record<string, string[]> = {
      Plumbing: ['plumber', 'plumbing', 'pipe', 'leak', 'sink', 'faucet', 'tap'],
      Electrician: ['electrician', 'electrical', 'wiring', 'switch', 'socket', 'light'],
      Tutoring: ['tutor', 'tutoring', 'teacher', 'lesson', 'study', 'homework'],
      Cleaning: ['cleaning', 'cleaner', 'clean', 'housekeeping', 'maid'],
      Carpentry: ['carpenter', 'carpentry', 'wood', 'furniture', 'door', 'cabinet'],
    };

    let matchedCategory: string | null = null;
    for (const cat of categories) {
      const keywords = categoryKeywords[cat.name] || [];
      if (keywords.some((kw) => text.includes(kw))) {
        matchedCategory = cat.name;
        break;
      }
    }

    // Match city by keyword
    const cities = ['rawalpindi', 'islamabad', 'lahore', 'karachi'];
    const matchedCity = cities.find((c) => text.includes(c));

    // Detect "near me" intent
    const isNearMe = text.includes('near me') || text.includes('nearby') || text.includes('near my');

    // Detect booking intent vs search intent
    const isBookingIntent = text.includes('book') || text.includes('schedule') || text.includes('appointment');

    if (!matchedCategory) {
      return {
        intent: 'unknown',
        message: "I couldn't understand which service you need. Try saying something like 'I need a plumber'.",
      };
    }

    return {
      intent: isBookingIntent ? 'booking' : 'search',
      category: matchedCategory,
      city: matchedCity ? matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1) : null,
      nearMe: isNearMe,
      redirectUrl: `/browse?category=${matchedCategory}${matchedCity ? `&city=${matchedCity}` : ''}`,
      message: `Sure! I found some trusted ${matchedCategory.toLowerCase()} providers ${matchedCity ? `in ${matchedCity}` : 'near you'}.`,
    };
  }
}