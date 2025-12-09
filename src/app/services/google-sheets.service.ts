import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FormularioData {
  nombre: string;
  apellido: string;
  tieneAcompanante: boolean;
  nombreAcompanante: string;
  apellidoAcompanante: string;
  alergenos: string;
}

export interface RespuestaAPI {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  // URL del Google Apps Script - Actualizada
  // ID de la hoja: 1p6XPsm2sLWwf0_Cfqndo4Z-FCtnn_e_EM4oKIwYUgUk
  private readonly SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwceMpXiW3h-qKvVpmrSKM1t1CBOBAVKxfPwXvuYgTgV9TpwUo3v_Nv7RvQAvY-Mc4G/exec';

  constructor(private http: HttpClient) { }

  enviarDatos(datos: FormularioData): Observable<any> {
    // Crear los parámetros URL
    const params = new HttpParams()
      .set('nombre', datos.nombre)
      .set('apellido', datos.apellido)
      .set('tieneAcompanante', datos.tieneAcompanante.toString())
      .set('nombreAcompanante', datos.nombreAcompanante)
      .set('apellidoAcompanante', datos.apellidoAcompanante)
      .set('alergenos', datos.alergenos);

    // Usar GET con parámetros para evitar problemas de CORS
    return this.http.get(this.SCRIPT_URL, { params });
  }
}
