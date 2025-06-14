import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';

// --- Importações do Firebase ---
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'; // Para inicializar o app Firebase
import { getAuth, provideAuth } from '@angular/fire/auth'; // Para o serviço de Autenticação
// Importe a configuração do seu ambiente (onde está o firebaseConfig)
import { environment } from '../environments/environment';
// -----------------------------

import { routes } from './app.routes';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideEnvironmentNgxMask(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' }
    },
    // --- Providers do Firebase ---
    // Inicializa o app Firebase com a configuração do ambiente
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // Disponibiliza o serviço de Autenticação para injeção
    provideAuth(() => getAuth()),
    // Adicione outros providers do Firebase aqui se precisar (ex: provideFirestore, provideStorage, etc.)
    // ---------------------------
    provideCharts(withDefaultRegisterables())
  ],
};
