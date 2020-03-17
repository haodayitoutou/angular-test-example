import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Hero } from '../model/hero';
import { HeroDetailService } from './hero-detail.service';

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    styleUrls: ['./hero-detail.component.css'],
    providers: [HeroDetailService]
})
export class HeroDetailComponent implements OnInit {
    @Input() hero: Hero;

    constructor(
        private heroDetailService: HeroDetailService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(pmap => this.getHero(pmap.get('id')));
    }

    private getHero(id: string): void {
        if (!id) {
            this.hero = { id: 0, name: '' } as Hero;
            return;
        }
        this.heroDetailService.getHero(id).subscribe(hero => {
            if (hero) {
                this.hero = hero;
            } else {
                this.gotoList();
            }
        });
    }

    save(): void {
        this.heroDetailService.saveHero(this.hero).subscribe(() => this.gotoList());
    }

    cancel(): void {
        this.gotoList();
    }

    gotoList() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }
}
