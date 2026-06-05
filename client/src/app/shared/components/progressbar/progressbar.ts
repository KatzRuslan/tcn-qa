import { Component, computed, input } from '@angular/core';
import { SharedModule } from '@shared-module';

@Component({
    selector: 'progressbar',
    imports: [SharedModule],
    templateUrl: './progressbar.html',
    styleUrl: './progressbar.scss',
})
export class Progressbar {
    readonly vmodel = input.required<{ current: number; total: number }>();
    readonly percent = computed(() => {
        const { current, total } = this.vmodel();
        if (!total) return 0;
        return Math.floor((current / total) * 100);
    });
}
