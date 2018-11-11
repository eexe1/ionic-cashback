import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage {
  constructor(private camera: Camera, 
    private socialSharing: SocialSharing,
    public alertController: AlertController) { }
  
  async presentAlert(content: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: content,
      buttons: ['OK']
    });

    await alert.present();
  }

  shareViaWhatsApp(image: string) {
    // Check if sharing via whatsapp is supported
    this.socialSharing.canShareVia("whatsapp").then(() => {
      this.socialSharing.shareViaWhatsApp('Invoice', image).then(() => {
        // Success!
      }).catch(() => {
        // Error!
        this.presentAlert("fail to share")
      });
    }).catch(() => {
      this.presentAlert("unable to send via whatsapp")
      // Sharing via whatsapp is not possible
    });
  }

  shareWithOptions(image: string) {
    var options = {
      message: 'share this', // not supported on some apps (Facebook, Instagram)
      subject: 'the subject', // fi. for email
      files: [image, ''], // an array of filenames either locally or remotely
    };
    this.socialSharing.shareWithOptions(options)
  }

  capture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let fileUrl = imageData
      // this.presentAlert(fileUrl)
      this.shareWithOptions(fileUrl)
     }, (err) => {
      // Handle error
     });
  }
}