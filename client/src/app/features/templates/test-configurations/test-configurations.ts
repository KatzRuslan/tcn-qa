import { Component } from '@angular/core';
import { SharedModule } from '@shared-module';

@Component({
    selector: 'test-configurations',
    imports: [SharedModule],
    templateUrl: './test-configurations.html',
    styleUrl: './test-configurations.scss',
})
export class TestConfigurations {}
