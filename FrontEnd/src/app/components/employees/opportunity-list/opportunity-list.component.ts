import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeComponent } from '../employee/employee.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { Opportunity } from 'src/app/Models/opportunity';


@Component({
  selector: 'app-opportunity-list',
  templateUrl: './opportunity-list.component.html',
  styleUrls: ['./opportunity-list.component.css']
})
export class OpportunityListComponent implements OnInit {

  constructor(private service: EmployeeService, private dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef, private notificationService: NotificationService) { }
  listData = new MatTableDataSource<Opportunity>();
  message:string;

  displayedColumns: any = [ 'opportunityName', 'managerEmail', 'contactNumber', 'location', 'skills', 'hiringManager', 'expectedDuration', 'actions',];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(EmployeeComponent) emp:string;
  searchKey: string;
  ngOnInit(): void {

    this.refreshData();
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate() {
   // event.preventDefault();
    this.service.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(EmployeeComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(result => {

      this.listData.data=[...this.listData.data,result];

     });


  }



  onEdit(row) {
    //event.preventDefault();
    this.service.populateForm(row);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";

    const dialogRef = this.dialog.open(EmployeeComponent, dialogConfig);


    dialogRef.afterClosed().subscribe(result => {
      this.service.getOpportunities().subscribe(

        (data: any[]) => {

          this.listData.data = data;
          this.listData.sort = this.sort;
          setTimeout(() => this.listData.paginator = this.paginator);


        });

    });


  }

  onDelete(id) {
    //event.preventDefault();
    if (confirm('Are you sure to delete this the record?' + id)) {
      let res = this.service.deleteOpportunity(id);
      res.subscribe(data => {
        this.listData.data.splice(id, 1);
        this.changeDetectorRefs.detectChanges();
        this.refreshData();

      });
      this.notificationService.warn('! Deleted Successfully');

    }

  }

  refreshData() {
    this.listData = new MatTableDataSource<Opportunity>();
    this.service.getOpportunities().subscribe(

      (data: Opportunity[]) => {

        this.listData.data = data;
        this.listData.sort = this.sort;
        setTimeout(() => this.listData.paginator = this.paginator);


      });


  }
}
