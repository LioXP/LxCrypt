![Logo](https://raw.githubusercontent.com/LioXP/LioXP/main/img.png)

# LxCrypt

A easy to use and still very powerful encryption & decryption tool.

## Demo

![Demo](https://placehold.co/500x200)

## Documentation

## Features

- Encryption
- Decryption
- Certificate Database
- Easy and secure hybrid-encryption (AES + RSA)

## FAQ

#### Is this secure?

Yes! LxCrypt uses [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) with an 256bit key and [RSA](<https://en.wikipedia.org/wiki/RSA_(cryptosystem)>) with a 4096 bit key. Both of those algorithms are considered very safe.

#### What happens if I forget my password?

Because we encrypt your private key with this password, and only store it on your machine, there is no way for us to decrypt the key for you.
Sadly this means that you will have to reset the application, and that you won't be able to decrypt any messages which were send to you before the reset.

#### Is any data send to your server?

**No!** Everything regarding the encryption is done locally. The only thing which is stored online is your _public_-key. But like the name already hints, it's supposed to be public :)

#### Why should I trust you?

You shouldn't trust anybody, which is why I made this project completly open-source. This means you can view the Code yourself. The full project code is published in this GitHub repository!

## Detailed technical explanation

_Please note that this is advanced, and you don't have to understand it to use the software!_

LxCrypt uses a technology called [**hybrid-encryption**](https://en.wikipedia.org/wiki/Hybrid_cryptosystem) with AES and RSA.
Here is an image showing how it's implemented in LxCrypt.

![Image](https://raw.githubusercontent.com/LioXP/LxCrypt/dev/img/hybrid-encryption.png)

## Screenshots

|             Homepage              |            Encryption             |            Decryption             |             Contacts              |
| :-------------------------------: | :-------------------------------: | :-------------------------------: | :-------------------------------: |
| ![](https://placehold.co/100x100) | ![](https://placehold.co/100x100) | ![](https://placehold.co/100x100) | ![](https://placehold.co/100x100) |

## Authors

- [@LioXP](https://github.com/LioXP)

## License

- [AGPL-3.0](https://choosealicense.com/licenses/agpl-3.0/)
