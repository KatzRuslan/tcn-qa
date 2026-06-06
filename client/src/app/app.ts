import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainHeader } from '@shared-components/main-header/main-header';
import { MainNavigation } from '@shared-components/main-navigation/main-navigation';
import { SharedModule } from '@shared-module';

@Component({
    selector: 'app-root',
    imports: [
        SharedModule ,RouterOutlet,
        MainHeader, MainNavigation
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    host: { class: 'flex flex-column w-full h-full' },
})
export class App {
}
