import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { SpotifyService } from '../spotify.service';

@Component({
    selector: 'app-search',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {
    spotifyService = inject(SpotifyService);
    searchForm = new FormGroup({
        artist: new FormControl('', Validators.required)
    })

    searchArtist(){
        if(this.searchForm.valid){
            this.spotifyService.getArtist(this.searchForm.get('artist')?.value as string)
                .subscribe((res) => console.log(res));
        }
    }

    getControlName(controlName: string){
        return this.searchForm.get(controlName)?.value;
    }
}
