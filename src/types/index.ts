export type AnnouncementType =
  | 'Welcome Speech'
  | 'Inauguration'
  | 'Chief Guest Introduction'
  | 'Event Introduction'
  | 'Competition Announcement'
  | 'Participant Instructions'
  | 'Break Announcement'
  | 'Winner Announcement'
  | 'Prize Distribution'
  | 'Closing Ceremony'
  | 'Custom Announcement';

export type Tone = 'Professional' | 'Energetic' | 'Friendly' | 'Dramatic';

export type Language = 'English' | 'Kannada' | 'Hindi' | 'Tamil';

export interface Script {
  id: string;
  title: string;
  announcementType: AnnouncementType;
  collegeName: string;
  techFestName: string;
  eventName: string;
  content: string;
  tone: Tone;
  language: Language;
  createdAt: string;
}

export interface ScriptFormData {
  collegeName: string;
  techFestName: string;
  announcementType: AnnouncementType;
  eventName: string;
  details: string;
  tone: Tone;
  language: Language;
}

export interface VoiceSettings {
  voiceURI: string;
  style: Tone;
  rate: number;
  volume: number;
}

export const ANNOUNCEMENT_TYPES: AnnouncementType[] = [
  'Welcome Speech',
  'Inauguration',
  'Chief Guest Introduction',
  'Event Introduction',
  'Competition Announcement',
  'Participant Instructions',
  'Break Announcement',
  'Winner Announcement',
  'Prize Distribution',
  'Closing Ceremony',
  'Custom Announcement',
];

export const TONES: Tone[] = ['Professional', 'Energetic', 'Friendly', 'Dramatic'];

export const LANGUAGES: Language[] = ['English', 'Kannada', 'Hindi', 'Tamil'];

export const DEFAULT_FORM_DATA: ScriptFormData = {
  collegeName: 'SVR College',
  techFestName: 'Tech Fest 2026',
  announcementType: 'Competition Announcement',
  eventName: 'Coding Challenge',
  details: '',
  tone: 'Energetic',
  language: 'English',
};

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceURI: '',
  style: 'Energetic',
  rate: 1,
  volume: 1,
};
