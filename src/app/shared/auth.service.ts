import { BehaviorSubject, Subject } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  isLoggedIn$: Subject<boolean> = new BehaviorSubject<boolean>(false);
}
