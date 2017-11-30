import { Injectable } from '@angular/core';

const oneDayInMiliseconds = 1 * 24 * 3600 * 1000;

@Injectable()
export class DateService {
    public todayWithOffset(days: number) {
        const resultDate = new Date(Date.now() + oneDayInMiliseconds * days);
        resultDate.setHours(0, 0, 0, 0);
        return resultDate;
    }

    public dateWithOffset(date: Date, days: number): Date {
        return new Date((date.getTime() + oneDayInMiliseconds));
    }

    public formatDate(date: Date): string {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
}
