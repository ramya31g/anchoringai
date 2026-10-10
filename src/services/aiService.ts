import type { ScriptFormData } from '@/types';

export interface GenerateScriptResult {
  title: string;
  content: string;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const toneOpeners: Record<string, string[]> = {
  Professional: [
    'Good morning everyone.',
    'Esteemed guests, faculty members, and dear students,',
    'Respected dignitaries and valued participants,',
  ],
  Energetic: [
    'Good morning everyone!',
    'Hello and welcome, everyone!',
    'Are you ready? Let\'s get started!',
  ],
  Friendly: [
    'Hey everyone, welcome!',
    'Good morning, friends!',
    'Welcome, everyone — so glad to have you here!',
  ],
  Dramatic: [
    'Ladies and gentlemen, the moment has arrived.',
    'The stage is set, the anticipation is real — welcome, everyone.',
    'In a world driven by technology, today we gather to celebrate something extraordinary.',
  ],
};

const toneClosers: Record<string, string[]> = {
  Professional: [
    'Thank you for your attention.',
    'We look forward to a successful event.',
    'Your participation is greatly appreciated.',
  ],
  Energetic: [
    "Let's make this unforgettable!",
    'Get ready and give it your best!',
    "Let's go — this is going to be amazing!",
  ],
  Friendly: [
    'Thanks for being here, and enjoy the event!',
    'Have a great time, everyone!',
    "We're glad you're here — let's have fun!",
  ],
  Dramatic: [
    'Let the journey begin.',
    'This is a moment to remember.',
    'The future starts now.',
  ],
};

const typeTemplates: Record<string, (d: ScriptFormData, opener: string, closer: string) => string> = {
  'Welcome Speech': (d, opener, closer) =>
    `${opener} A warm and enthusiastic welcome to all the students, faculty members, and guests joining us for ${d.techFestName} at ${d.collegeName}. Today, we come together to celebrate innovation, creativity, and the limitless possibilities of technology. Get ready for an exciting day filled with ideas, competitions, and technological challenges! ${closer}`,

  Inauguration: (d, opener, closer) =>
    `${opener} It is my honor to inaugurate ${d.techFestName} at ${d.collegeName}. This event marks the beginning of a journey where ideas meet innovation, and talent meets opportunity. We are proud to launch this celebration of technology and creativity. ${d.details ? `A special note: ${d.details}` : ''} ${closer}`,

  'Chief Guest Introduction': (d, opener, closer) =>
    `${opener} It is our privilege to welcome our distinguished chief guest to ${d.techFestName} at ${d.collegeName}. We are delighted to have you with us as we celebrate innovation, creativity, and the spirit of technology. Your presence inspires every student and participant here today. ${d.details ? `About our chief guest: ${d.details}` : ''} ${closer}`,

  'Event Introduction': (d, opener, closer) =>
    `${opener} Welcome to ${d.eventName}, one of the most anticipated events of ${d.techFestName} at ${d.collegeName}. This is where talent meets challenge, and creativity takes center stage. ${d.details ? `Here's what you need to know: ${d.details}` : ''} Get ready for an incredible showcase! ${closer}`,

  'Competition Announcement': (d, opener, closer) =>
    `${opener} Attention participants! The ${d.eventName} is about to begin. All registered participants are requested to proceed to the competition venue and take their assigned seats. ${d.details ? `Important: ${d.details}` : ''} We wish everyone the very best. Let the challenge begin! ${closer}`,

  'Participant Instructions': (d, opener, closer) =>
    `${opener} To all participants of ${d.eventName} at ${d.techFestName}, please pay close attention. ${d.details ? d.details : 'Please follow the instructions given by the event coordinators.'} Make sure you are at the right venue on time. Good luck to all! ${closer}`,

  'Break Announcement': (d, opener, closer) =>
    `${opener} Attention everyone! We will now take a short break. Please return in 15 minutes for the next segment of ${d.techFestName}. ${d.details ? d.details : 'Refreshments are available in the lobby.'} See you all shortly! ${closer}`,

  'Winner Announcement': (d, opener, closer) =>
    `${opener} And now, the moment we have all been waiting for! The results of ${d.eventName} at ${d.techFestName} are here. ${d.details ? d.details : ''} Congratulations to our winners for their outstanding performance, creativity, and innovation. Let's give them a huge round of applause! ${closer}`,

  'Prize Distribution': (d, opener, closer) =>
    `${opener} It is time to recognize and reward excellence. We will now begin the prize distribution ceremony for ${d.eventName} at ${d.techFestName}. ${d.details ? d.details : ''} Congratulations to all the winners — your hard work has truly paid off! ${closer}`,

  'Closing Ceremony': (d, opener, closer) =>
    `${opener} As we come to the end of ${d.techFestName} at ${d.collegeName}, we would like to thank all the students, faculty members, organizers, and guests who made this event a memorable success. ${d.details ? d.details : ''} Keep innovating, keep learning, and keep creating. Thank you and see you again! ${closer}`,

  'Custom Announcement': (d, opener, closer) =>
    `${opener} ${d.details ? d.details : `This is a special announcement for ${d.eventName} at ${d.techFestName}.`} ${closer}`,
};

export function generateScript(data: ScriptFormData): GenerateScriptResult {
  const opener = pickRandom(toneOpeners[data.tone] ?? toneOpeners.Energetic);
  const closer = pickRandom(toneClosers[data.tone] ?? toneClosers.Energetic);
  const template = typeTemplates[data.announcementType] ?? typeTemplates['Custom Announcement'];
  const content = template(data, opener, closer).replace(/\s+/g, ' ').trim();

  const title = `${data.eventName} — ${data.announcementType}`;
  return { title, content };
}
