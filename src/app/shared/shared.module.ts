import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from './title-case.pipe';
import { HighlightDirective } from './highlight.directive';

@NgModule({
    imports: [CommonModule],
    exports: [
        CommonModule,
        FormsModule,
        HighlightDirective,
        TitleCasePipe
    ],
    declarations: [HighlightDirective, TitleCasePipe]
})
export class SharedModule {}
