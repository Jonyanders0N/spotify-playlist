import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessToken } from '../shared/models/accessToken.model';

@Component({
    selector: 'app-callback',
    imports: [],
    templateUrl: './callback.component.html',
    styleUrl: './callback.component.scss'
})
export class CallbackComponent {
  accessToken?: string;
  error?: string;

  constructor(private authService: AuthService,
              private route: ActivatedRoute, private router: Router
  ){}

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      const authCode = params['code'];
      if(authCode) {
        this.authService.exchangeToken(authCode).subscribe({
        next: (response: AccessToken) => {
          this.accessToken = response.access_token;
          this.router.navigateByUrl('/search');
          console.log(response);
        }, error: (err: any) => {
          console.log('Token exchange error: ', err);
          this.error = 'Error exchange token';
        }
      })} else {
          this.error = 'No authorization code found';
      }
    })
  }
}
