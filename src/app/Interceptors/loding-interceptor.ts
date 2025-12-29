import { HttpInterceptorFn } from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const lodingInterceptor: HttpInterceptorFn = (req, next) => {

const ngxSpinnerService=inject(NgxSpinnerService);

  ngxSpinnerService.show();

  return next(req).pipe(finalize(()=>{
    ngxSpinnerService.hide();
  }));
};
