import { Component, OnInit } from '@angular/core';
import { UserServices } from './services/user.services';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserServices]
})
export class AppComponent implements OnInit{
  public title = 'SOUNDIC';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  
  constructor(
    private _userService: UserServices
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
  }
  
  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
    //this._userService.signup();
  }
  
  public onSubmit(){
    console.log(this.user);
    
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        
        if(!this.identity._id){
          alert('datos de usuario incorrectos');
        }else{
              localStorage.setItem('identity', JSON.stringify(identity));
          
              this._userService.signup(this.user,'true').subscribe(
                response => {
                  let token = response.token;
                  this.token = token;
                  
                  if(this.token.lenght <= 0){
                    alert('El token no se ha generado');
                  }else{
                    localStorage.setItem('token', token);
                    this.user = new User('','','','','','ROLE_USER','');
                    console.log(token);
                    console.log(identity);
                  }
                },
                error => {
                  var errorMessage = <any>error;
                  
                  if(errorMessage != null){
                    var body = JSON.parse(error._body);
                    this.errorMessage = body.message;
                    
                    console.log(error);
                  }
                }
              );
          
          
        }
      },
      error => {
        var errorMessage = <any>error;
        
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          
          console.log(error);
        }
      }
    );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.user = new User('','','','','','ROLE_USER','');
  }
  
  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;
        
        if(!this.user._id){
          this.alertRegister = "Error al registrar";
        }else{
          this.alertRegister = "Registro exitoso, identificate con tu correo" + this.user_register.email;
          this.user_register =  new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var errorMessage = <any>error;
        
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          
          console.log(error);
        }
      }
    );
  }
}
