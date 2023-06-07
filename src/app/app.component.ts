import { Component, ElementRef, ViewChild } from '@angular/core';
import { decode } from 'base64-arraybuffer';
import * as moment from 'moment';
import { DropDownConfig } from 'search-multiselect-dropdown';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'rodins';
  isDragging = false;
  @ViewChild('FileSelectInputDialog') FileSelectInputDialog?: ElementRef;
  pageIndex = 0;
  isLoading = false;
  uid: string | null = null;
  downloadLink: string | null = null;
  downloadFileName = '';
  loadingMessage = "";

  public config: DropDownConfig = {
    displayKey: 'name',
    search: true,
    height: '300px',
    searchPlaceholder: 'Select an option',
    placeholder: 'Search and select',
    noResultsFound: 'No result found',
    multiple: false,
    disabled: false,
    filterBlankData: true,
    showSelectedAtDropdown: false,
    theme: {
      inputColor: '#288eca',
      containerListBackground: '#f8f8f8',
      ContainerListColor: '#288eca',
      selectedItemColor: '#fff',
      selectedItemBackground: '#288eca',
      listHoverBackground: '#288eca',
      listHoverColor: '#fff',
      searchInputColor: '#000',
    },
  };

  selectedOption: any = [];

  options: any[] = [];

  constructor(private appService: AppService) {}

  onDragOver(e: any) {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(e: any) {
    e.preventDefault();
    this.isDragging = false;
  }

  onDrop(e: any) {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer.items) {
      if (e.dataTransfer.items.length > 1) {
        return;
      }
      const item = e.dataTransfer.items[0];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        this.sendFile(file);
      }
    }
  }

  chooseFile() {
    if (this.FileSelectInputDialog) {
      this.FileSelectInputDialog.nativeElement.click();
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.sendFile(event.target.files[0]);
    }
  }

  sendFile(file: any) {
    let formdata = new FormData();
    formdata.append('file', file);
    this.loadingMessage = "Proccessing!\n This might take a while.";
    this.isLoading = true;
    this.appService.processZip(formdata).subscribe((res: any) => {
      const blob = new Blob([res.body], {
        type: res.headers.get('Content-Type'),
      });
      this.downloadLink = window.URL.createObjectURL(blob);
      this.downloadFileName = file.name.split(".")[0]+"_extract_"+this.getTime()+".zip";
      this.loadingMessage = "";
      this.isLoading = false;
      this.pageIndex = 1;
    });
  }

  sendSelectedOptions() {
    if (this.selectedOption && !Array.isArray(this.selectedOption)) {
      this.isLoading = true;
      this.appService
        .getFile({
          unzipFilePath: this.uid,
          choice: this.selectedOption['name'],
        })
        .subscribe((res: any) => {
          if (res['content']) {
            let buffer = decode(res['content']);
            let file = new File([buffer], res['fileName']);
            this.downloadLink = window.URL.createObjectURL(file);
            this.downloadFileName = res['fileName'];
          } else {
            alert(res['message']);
          }
          this.isLoading = false;
          this.pageIndex = 2;
        });
    } else {
      alert('Select option first');
    }
  }

  downloadFile() {
    if (this.downloadLink) {
      const downloadAncher = document.createElement('a');
      downloadAncher.style.display = 'none';
      downloadAncher.href = this.downloadLink;
      downloadAncher.download = this.downloadFileName;
      downloadAncher.click();
    }
  }

  resetAll() {
    this.pageIndex = 0;
    this.selectedOption = [];
    this.downloadLink = null;
    this.downloadFileName = '';
    this.uid = null;
    this.options = [];
  }

  getTime(){
    return moment().format("YMDHms");
  }
}
