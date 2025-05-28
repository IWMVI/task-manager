import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Detecção de mudanças otimizada
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Roteamento principal da aplicação
    provideRouter(routes),

    // Suporte a Server Side Rendering (SSR) com hidratação
    provideClientHydration(),

    // Animações carregadas de forma assíncrona (melhora performance)
    provideAnimationsAsync(),
  ],
};
