import {  Directive, Injector, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { distinctUntilChanged } from 'rxjs/operators';

@Directive({
    selector: '[appTimeMask]'
})
export class TimeMaskDirective implements OnInit {
    @Input() appMask: string;
    @Input() separator: string;
    control: NgControl;

    timeRange = {
        hh: 23,
        mm: 59,
        ss: 59
    };
    constructor(private injector: Injector) {
        this.control = this.injector.get(NgControl);
    }
    ngOnInit(): void {
        this.control.control.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(val => {
                if (val) {
                    const result = this._timeMask(val, this.appMask, this.separator);
                    this.validate(result, this.separator);
                    this._setVal(result);
                }
            });
    }
    private _setVal(val: string) {
        if (this.control.control) {
            this.control.control.setValue(val);
        }
    }

    private _timeMask(val: string, pattern: string, separator?: string): string {
        const resultArr: any = [];
        const patternArr: any = pattern.split('');
        const inputArr: any = val.split('').filter(elem => {
            return elem && !isNaN(<any>elem);
        });

        for (let i = 0; i < patternArr.length; i++) {
            if (separator && separator.indexOf(patternArr[i]) < 0) {
                resultArr[i] = 0;
            } else {
                resultArr[i] = patternArr[i];
            }
        }
        let resultArrCounter = resultArr.length - 1;
        let inputArrCounter = inputArr.length - 1;
        while (inputArrCounter >= 0) {
            if (separator && separator.indexOf(resultArr[resultArrCounter]) < 0) {
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

    validate (value: string, separatorChar: string) {
        const scope = this;
        if ( !value ) {
            return true;
        }

        const pattern = this.appMask.split(separatorChar);

        const splittedValue: number [] = value.toString().split(separatorChar)
        .filter((v: string) => {
            return !!v;
        }).map ( (elem: string) => {
            return parseInt(elem, 10);
        });
        splittedValue.forEach( (element, index) => {
            if ( element > this.timeRange[pattern[index].toLowerCase()]) {
                setTimeout(() => {
                    scope.control.control.setErrors({'invalidTime': true});
                });
            } else {
                scope.control.control.setErrors(null);
            }
        });
    }
}
