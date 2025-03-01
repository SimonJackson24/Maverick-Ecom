import { ScentNote, ScentFamily, ScentCombination, ScentProfile } from '../admin/types/Scent';
import AdobeCommerceService from './AdobeCommerceService';

export class ScentService {
  private static instance: ScentService;
  private adobeCommerceService: AdobeCommerceService;

  private constructor() {
    this.adobeCommerceService = AdobeCommerceService.getInstance({
      baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL,
      accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN
    });
  }

  public static getInstance(): ScentService {
    if (!ScentService.instance) {
      ScentService.instance = new ScentService();
    }
    return ScentService.instance;
  }

  // Notes Management
  async getNotes(): Promise<ScentNote[]> {
    return this.adobeCommerceService.get('/scent-notes');
  }

  async createNote(note: Omit<ScentNote, 'id'>): Promise<ScentNote> {
    return this.adobeCommerceService.post('/scent-notes', note);
  }

  async updateNote(id: string, note: Partial<ScentNote>): Promise<ScentNote> {
    return this.adobeCommerceService.put(`/scent-notes/${id}`, note);
  }

  async deleteNote(id: string): Promise<void> {
    return this.adobeCommerceService.delete(`/scent-notes/${id}`);
  }

  // Families Management
  async getFamilies(): Promise<ScentFamily[]> {
    return this.adobeCommerceService.get('/scent-families');
  }

  async createFamily(family: Omit<ScentFamily, 'id'>): Promise<ScentFamily> {
    return this.adobeCommerceService.post('/scent-families', family);
  }

  async updateFamily(id: string, family: Partial<ScentFamily>): Promise<ScentFamily> {
    return this.adobeCommerceService.put(`/scent-families/${id}`, family);
  }

  async deleteFamily(id: string): Promise<void> {
    return this.adobeCommerceService.delete(`/scent-families/${id}`);
  }

  // Combinations Management
  async getCombinations(): Promise<ScentCombination[]> {
    return this.adobeCommerceService.get('/scent-combinations');
  }

  async createCombination(combination: Omit<ScentCombination, 'id'>): Promise<ScentCombination> {
    return this.adobeCommerceService.post('/scent-combinations', combination);
  }

  async updateCombination(id: string, combination: Partial<ScentCombination>): Promise<ScentCombination> {
    return this.adobeCommerceService.put(`/scent-combinations/${id}`, combination);
  }

  async deleteCombination(id: string): Promise<void> {
    return this.adobeCommerceService.delete(`/scent-combinations/${id}`);
  }

  // Profiles Management
  async getProfiles(): Promise<ScentProfile[]> {
    return this.adobeCommerceService.get('/scent-profiles');
  }

  async createProfile(profile: Omit<ScentProfile, 'id'>): Promise<ScentProfile> {
    return this.adobeCommerceService.post('/scent-profiles', profile);
  }

  async updateProfile(id: string, profile: Partial<ScentProfile>): Promise<ScentProfile> {
    return this.adobeCommerceService.put(`/scent-profiles/${id}`, profile);
  }

  async deleteProfile(id: string): Promise<void> {
    return this.adobeCommerceService.delete(`/scent-profiles/${id}`);
  }
}
