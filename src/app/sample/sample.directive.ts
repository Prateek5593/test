import {  Directive, Injector, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { distinctUntilChanged } from 'rxjs/operators';

@Directive({
    selector: '[appPhoneMask]'
})
export class PhoneMaskDirective implements OnInit {
    @Input() appMask: string;
    @Input() appSpecialCharecter: string[];
    control: any;
    constructor(private injector: Injector) {
        this.control = this.injector.get(NgControl);
    }
    ngOnInit(): void {
        this.control.control.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(val => {
                if (val) {
                    this._setVal(this._timeMask(val, this.appMask, this.appSpecialCharecter));
                }
            });
    }
    private _setVal(val: string) {
        if (this.control.control) {
            this.control.control.setValue(val);
        }
    }

    private _timeMask(val: string, pattern: string, separators?: string[]): string {
        const resultArr: any = [];
        const patternArr: any = pattern.split('');
        const inputArr: any = val.split('').filter(elem => {
            return elem && !isNaN(<any>elem);
        });

        for (let i = 0; i < patternArr.length; i++) {
            if (separators && separators.indexOf(patternArr[i]) < 0) {
                resultArr[i] = 0;
            } else {
                resultArr[i] = patternArr[i];
            }
        }
        let resultArrCounter = resultArr.length - 1;
        let inputArrCounter = inputArr.length - 1;
        while (inputArrCounter >= 0) {
            if (separators && separators.indexOf(resultArr[resultArrCounter]) < 0) {
                resultArr[resultArrCounter] = inputArr[inputArrCounter];
                inputArrCounter--;
            }
            resultArrCounter--;
        }

        if (resultArr[0] === 0 || resultArr[0] === '0') {
            resultArr.shift();
        }

        if (parseInt(resultArr.join('').replace(/:/g, ''), 10) === 0) {
            return '';
        }

        return resultArr.join('');
    }
}
