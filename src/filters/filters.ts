import {Pipe, PipeTransform} from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name:'Search',
  pure:false
})

export class searchPipe implements PipeTransform {
  transform(value: any, col: any, data: any,isDate:boolean) {
    if (value){
      if(isDate){

        let filters=data.replace(/-/g, "/");
        console.log(filters);
        console.log('filters ');
        return value.filter(item => item[col].split(' ')[0].replace(/-/g, "/"));
      }
      return value.filter(item => parseInt(item[col]) == data);
    }
  }
}
@Pipe({
  name:'notificationPortion',
  pure:false
})

export class NotificationPortionPipe implements PipeTransform {
  transform(value: any,selectedDate:any) {
    if (value){
        return value.filter(item => {
          let now=selectedDate.split(' ')[0].replace(/-/g, "/");
          let date=item['notification_datetime'].split(' ')[0].replace(/-/g, "/");
          if(now==date){
            return item;
          }
        }
    );
    }
  }
}


@Pipe({
  name: 'safe',
  pure:false
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(url) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}




@Pipe({
  name:'Cut',
  pure:false
})

export class CutPipe implements PipeTransform{
  transform(value:any,length:number,literals:string){
    if(value){
      let cutString=value.slice(0,length)+(literals?literals:'...');
      return (cutString.substring(0,1).toUpperCase()+cutString.substring(1));
    }
  }
}



@Pipe({
  name:'ChatFilter',
  pure:false
})


export class ChatFilterPipe implements PipeTransform{
  transform(value:any,column:string,colVal:any){
    if(value){
      if(colVal=='both'){
        return value;
      }else{
        let users=[];
        for(let i in value){
          if(value[i][column]==colVal){
            users.push(value[i]);
          }
        }
        return users;
      }

    }
  }
}



@Pipe({
  name:'DateFormat',
  pure:false
})



export class DateFormatPipe implements PipeTransform{
  transform(date){
    date = new Date(date);

    var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var strDate = "";

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);

    var tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (today.getTime() == date.getTime()) {
      strDate = "Today";
    } else if (yesterday.getTime() == date.getTime()) {
      strDate = "Yesterday";
    } else {
      strDate = date.getHours()+':'+date.getMinutes()+'   '+date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear().toString().substr(-2);
    }

    return strDate;
  }
}




@Pipe({
  name:'Uppercase',
  pure:false
})



export class UppercasePipe implements PipeTransform{
  transform(text:string) {
    if(text){
      return text.toUpperCase()

    }
  }
  }




  @Pipe({
    name:'NotEmpty',
    pure:false
  })


  export class NotEmptyPipe implements PipeTransform{
  transform(values:any,col:string){
    if(values)
        return values.filter(item => item[col]!='');

  }
  }