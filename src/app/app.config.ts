import {
	type ApplicationConfig,
	inject,
	provideAppInitializer,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { routes } from "./app.routes";
import { SupabaseService } from "./shared/supabase.service";

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withComponentInputBinding()),
		provideAnimationsAsync(),
		provideAppInitializer(() => {
			const supabaseService = inject(SupabaseService);
			return supabaseService.loadSession();
		}),
	],
};
