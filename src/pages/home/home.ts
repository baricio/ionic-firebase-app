import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore} from 'angularfire2/firestore';
import { map, tap, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  events = new BehaviorSubject<any[]>([]);
  limit:number = 5;
  lastKey:any = '';
  finished:boolean = false;

  constructor(public navCtrl: NavController, private fireStore: AngularFirestore) {
    this.getNext()
        .pipe(take(1))
        .subscribe();
  }

  getItems(limit, lastKey) {
      return this.fireStore
      .collection<any>('events', ref => {
          const query = ref.orderBy('id').limit(limit)
          console.log('ver lastkey', lastKey)
          return (lastKey)? query.startAt(lastKey) : query;
      })
      .snapshotChanges()
      .pipe(map(actions => {
          return actions.map(action => ({key: action.payload.doc.id, ...action.payload.doc.data()}))
      }));
  }

  getNext() {
      if (this.finished) { return this.events; }

      return this.getItems(this.limit + 1, this.lastKey)
      .pipe(tap(items => {
          this.lastKey = items[items.length -1]['id']
          const newEvent = items.slice(0, this.limit)
          const currentEvent = this.events.getValue()
          if (this.lastKey === newEvent[newEvent.length -1]['id']) {
              this.finished = true;
          }
          this.events.next(currentEvent.concat(newEvent))
      }));
  }

  doInfinite(infiniteScroll): Promise<void>  {
       if (!this.finished) {
        return new Promise((resolve, reject) => {
          this.getNext()
          .pipe(take(1))
          .subscribe(()=>resolve());
        })
       }
       return Promise.resolve();
    }

}
