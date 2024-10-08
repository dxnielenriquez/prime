import {Component, HostListener, Input, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {DividerModule} from "primeng/divider";
import {MaterialModule} from "../../material/material.module";
import {CommonModule} from "@angular/common";

export interface MenuItem {
  label: string;
  icon: string;
  expandable?: boolean;
  expanded?: boolean;
  route?: string;
  subItems: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, HeaderComponent, FooterComponent, DividerModule],
  providers: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  isMobileView: boolean = false;

  constructor() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobileView();
  }

  ngOnInit(): void {
    this.checkMobileView();
  }

  checkMobileView() {
    this.isMobileView = window.innerWidth <= 960;
  }

}

