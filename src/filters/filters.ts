import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as locales from 'moment/min/locales';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], term): any {
        console.log('term', term);
      
        return term 
            ? items.filter(item => item.title.indexOf(term) !== -1)
            : items;
    }
}

@Pipe({
    name: 'dateEvent'
})
export class dateByPipe implements PipeTransform {
    transform(date: string): any {
        return moment(date).format("dddd, D [de] MMMM YYYY, H:mm")
    }
}