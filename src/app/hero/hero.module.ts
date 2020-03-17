import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { routedComponent } from './hero-routing.module';

@NgModule({
    imports: [SharedModule],
    declarations: [routedComponent]
})
export class HeroModule {}
