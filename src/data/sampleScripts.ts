import type { Script } from '@/types';

export const SAMPLE_SCRIPTS: Script[] = [
  {
    id: 'sample-welcome',
    title: 'Welcome Announcement',
    announcementType: 'Welcome Speech',
    collegeName: 'SVR College',
    techFestName: 'Tech Fest 2026',
    eventName: 'Tech Fest 2026',
    content:
      'Good morning everyone! A warm and enthusiastic welcome to all the students, faculty members and guests joining us for Tech Fest 2026. Today, we come together to celebrate innovation, creativity and the limitless possibilities of technology. Get ready for an exciting day filled with ideas, competitions and technological challenges!',
    tone: 'Energetic',
    language: 'English',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sample-coding',
    title: 'Coding Competition Announcement',
    announcementType: 'Competition Announcement',
    collegeName: 'SVR College',
    techFestName: 'Tech Fest 2026',
    eventName: 'Coding Challenge',
    content:
      'Attention participants! The Coding Challenge is about to begin. All registered participants are requested to proceed to the competition venue and take their assigned seats. We wish everyone the very best. Let the coding begin!',
    tone: 'Energetic',
    language: 'English',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'sample-chief-guest',
    title: 'Chief Guest Introduction',
    announcementType: 'Chief Guest Introduction',
    collegeName: 'SVR College',
    techFestName: 'Tech Fest 2026',
    eventName: 'Tech Fest 2026',
    content:
      'Ladies and gentlemen, it is our privilege to welcome our distinguished chief guest to Tech Fest 2026. We are delighted to have you with us as we celebrate innovation, creativity and the spirit of technology.',
    tone: 'Professional',
    language: 'English',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sample-winner',
    title: 'Winner Announcement',
    announcementType: 'Winner Announcement',
    collegeName: 'SVR College',
    techFestName: 'Tech Fest 2026',
    eventName: 'Coding Challenge',
    content:
      "And now, the moment we have all been waiting for! Congratulations to our winners for their outstanding performance, creativity and innovation. Let's give them a huge round of applause!",
    tone: 'Dramatic',
    language: 'English',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-closing',
    title: 'Closing Ceremony',
    announcementType: 'Closing Ceremony',
    collegeName: 'SVR College',
    techFestName: 'Tech Fest 2026',
    eventName: 'Tech Fest 2026',
    content:
      'As we come to the end of Tech Fest 2026, we would like to thank all the students, faculty members, organizers and guests who made this event a memorable success. Keep innovating, keep learning and keep creating. Thank you and see you again!',
    tone: 'Friendly',
    language: 'English',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
