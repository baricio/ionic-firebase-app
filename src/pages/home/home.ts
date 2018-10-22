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
  limit:number = 10;
  lastKey;
  finished:boolean = false;

  constructor(public navCtrl: NavController, private fireStore: AngularFirestore) {
    this.getNext(()=>true)
  }

  getItems(limit, lastKey) {
      return this.fireStore
      .collection<any>('events', ref => {
          console.log('limit', limit)
          console.log('lastKey', lastKey)
          const query = ref.orderBy('id').limit(limit)
          return (lastKey)? query.startAt(lastKey) : query;
      })
      .snapshotChanges()
      .pipe(map(actions => {
          return actions.map(action => ({key: action.payload.doc.id, ...action.payload.doc.data()}))
      }));
  }

  getNext(cb) {
      if (this.finished) { return this.events; }

      return this.getItems(this.limit + 1, this.lastKey)
      .subscribe(items => {
          console.log('items', items)
          const newEvent = items.slice(0, this.limit)
          const currentEvent = this.events.getValue()
          this.lastKey = items[items.length -1]['id']
          if (this.lastKey['id'] === newEvent[newEvent.length -1]['id']) {
              this.finished = true;
          }
          this.events.next(currentEvent.concat(newEvent))
          if (cb){
            cb()
          }
      })
  }

  doInfinite(infiniteScroll): Promise<void>  {
       if (!this.finished) {
        return new Promise((resolve, reject) => {
          this.getNext(()=> resolve())
        })
       }
       return Promise.resolve();
    }

}
