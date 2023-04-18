import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {  ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Crud-operations';
  displayedColumns: string[] = ['productName', 'category', 'price', 'comment','date','freshness','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog : MatDialog , private api : ApiService){}

  ngOnInit(): void {
    this.getAllProducts();
  }
  
    openDialog() {
      this.dialog.open(DialogComponent, {
      width:'35%'
      
      }).afterClosed().subscribe(val=>{
        if(val == 'save'){
          this.getAllProducts();
        }
      });
    }
    getAllProducts(){
      this.api.getProduct()
      .subscribe({
        next:(res)=>{
         this.dataSource = new MatTableDataSource(res);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;

          
        },
        error:(error)=>{
          alert("ERROR while fetching the record!")
        }
      })
    }
    editProduct(row : any){
       this.dialog.open(DialogComponent,{
        width:'35%',
        data:row
       }).afterClosed().subscribe(val=>{
        if(val == 'update'){
          this.getAllProducts();
        }
       })
    }
    deleteProduct(id : number){
      this.api.deleteProduct(id)
      .subscribe({
        next:(res)=>{
          // alert("DELETED !")
          this.getAllProducts();
        },
        error:()=>{
          alert("ERROR WHILE DELETING !")
        }
      })

    }
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
}
