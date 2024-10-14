import {Component, HostListener, OnInit} from '@angular/core';
import {PrimeModule} from "../../prime/prime.module";
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PrimeModule, MenubarModule, OverlayPanelModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;
  isMobileView = true;
  username = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    const user = auth.getUser();
    if (user) {
      this.username = user.nombre
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkMobileView();
  }

  ngOnInit() {
    this.checkMobileView();
  }

  checkMobileView() {
    this.isMobileView = window.innerWidth <= 960;
  }

  logOut(): void {
    this.auth.logout();
    this.router.navigate(["/"]).then();
  }
}
