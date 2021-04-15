import { Ciudad } from './../models/ciudad.models';
import { Departamento } from './../models/departamento.models';
import { Cotizar } from './../models/cotizar.models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CotizarService {
  constructor(private http: HttpClient) {}
  headers: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/json',
  });

  save(cotizar: Cotizar) {
    let url_cotizar = 'https://prueba.gymapp.com.co/api/public/api/cotizacion/store';
    return this.http
      .post<Cotizar>(url_cotizar, cotizar, {
        headers: this.headers,
      })
      .pipe(map((data) => <any[]>data));
  }

  getModelos() {
    let url_modelos = 'https://integrador.processoft.com.co/api/menutest';
    return this.http
      .get<any>(url_modelos)
      .toPromise()
      .then((res) => <any[]>res);
  }
  getDepartamentos() {
    let url_departamentos =
      'https://prueba.gymapp.com.co/api/public/api/departamentos';
    return this.http
      .get<any>(url_departamentos)
      .toPromise()
      .then((res) => <Departamento[]>res);
  }
  getCiudad(departamento: number) {
    let url_ciudad = `https://prueba.gymapp.com.co/api/public/api/municipios?departamento=${departamento}`;
    return this.http
      .get<any>(url_ciudad)
      .toPromise()
      .then((res) => <Ciudad[]>res);
  }
}
