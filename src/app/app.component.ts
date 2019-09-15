import { Component, OnInit } from '@angular/core';

import { BookEntity } from './book.entity';
import { Utils } from './utils';

declare var Dropbox: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  CLIENT_ID: string = '8maalb7vqusxn9s';
  FILE_NAME: string = "/BookList.txt";
  newBook: BookEntity;
  authUrl: string;
  dropboxToken: string
  isAuthenticated: boolean
  static books: BookEntity[];
  static isLoading: boolean;

  constructor() {
    this.isAuthenticated = false;
    this.newBook = new BookEntity;
    AppComponent.books = [];
    AppComponent.isLoading = false;

    var dbx = new Dropbox({ clientId: this.CLIENT_ID });
    this.authUrl = dbx.getAuthenticationUrl('http://localhost:8080/auth');
    
    this.dropboxToken = Utils.getAccessTokenFromUrl();
    this.isAuthenticated = this.dropboxToken !== undefined;
  }

  ngOnInit() {
    if (this.dropboxToken !== undefined) {
    var dbx = new Dropbox({ accessToken: this.dropboxToken });
    AppComponent.isLoading = true;
    dbx.filesDownload({path:  this.FILE_NAME}).then(function(response) {
    let reader = new FileReader();
    let blob: Blob = response.fileBlob;
					reader.addEventListener("loadend", function(e) {
            AppComponent.books = JSON.parse(<string>reader.result);
            AppComponent.isLoading = false;
          });
         reader.readAsText(blob);
    })
    .catch(function(error: any) {
      AppComponent.isLoading = false;
    });
  }
 }

  get Books():BookEntity[] {
    return AppComponent.books;
  }

  get IsLoading():boolean {
    return AppComponent.isLoading;
  }

  public addBook() {
    let b: BookEntity = new BookEntity;
    b.Title = this.newBook.Title
    b.Author = this.newBook.Author;
    b.Length = this.newBook.Length;
    b.PublishedDate = this.newBook.PublishedDate;
    AppComponent.books.push(b);

    this.saveToDropbox();
    this.newBook.Reset();
  }

  public removeBook(i) {
     AppComponent.books.splice(i, 1);
     this.saveToDropbox();
  }

  private saveToDropbox() {
    var dbx = new Dropbox({ accessToken: this.dropboxToken });
    dbx.filesUpload({contents:JSON.stringify(AppComponent.books), path: this.FILE_NAME, mode: {".tag": 'overwrite'}, autorename: false, mute: true }).then(function(response) {
    }).catch(function(error) {
      // If it errors because of a dropbox problem, reload the page so the user can re-connect to dropbox	
      alert("Failed to save to dropbox");
      console.log(JSON.stringify(error));
      window.location.href = '/';
    });
  }
}
