import { BehaviorSubject, Subject } from 'rxjs';
import { SupabaseService } from './supabase.service';

export class AuthService {
  constructor(private supabase: SupabaseService) {}

  isLoggedIn$: Subject<boolean> = new BehaviorSubject<boolean>(false);
}
