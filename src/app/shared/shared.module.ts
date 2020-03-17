import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from './title-case.pipe';

@NgModule({
    imports: [CommonModule],
    exports: [
        CommonModule,
        FormsModule,
        TitleCasePipe
    ],
    declarations: [TitleCasePipe]
})
export class SharedModule {}
