![Logo](https://raw.githubusercontent.com/LioXP/LioXP/main/img.png)

# LxCrypt

An easy-to-use, secure and still very powerful encryption software

<details>
<summary>Demo</summary>

![Demo](https://raw.githubusercontent.com/LioXP/LxCrypt/main/img/demo.gif)

</details>

## Features

- Encryption
- Decryption
- Certificate Store
- Easy-to-use UI

## Download

You can download the latest stable release below.

| Windows 🪟                                                                                | Linux 🐧                                                                            |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [Download](https://github.com/LioXP/LxCrypt/releases/latest/download/LxCrypt-windows.exe) | [Download](https://github.com/LioXP/LxCrypt/releases/latest/download/LxCrypt-linux) |

## Documentation

<details>
<summary>Windows 🪟</summary>

1. Download the LxCrypt-windows.exe file.
2. Execute (double-click) it and follow the instructions on your screen.

- For easier access, just put the file on your desktop.

</details>

<details>
<summary>Linux 🐧</summary>

1. Download the LxCrypt-linux file. For example like this:

```
curl -O -L https://github.com/LioXP/LxCrypt/releases/latest/download/LxCrypt-linux
```

2. Run `chmod +x LxCrypt-linux` (only needed once).
3. Run `./LxCrypt-linux` to start the application.

- For easier access, you can create an alias in your shell.
  - ZSH: [Tutorial](https://linuxhint.com/configure-use-aliases-zsh/)
  - Bash: [Tutorial](https://linuxize.com/post/how-to-create-bash-aliases/)

</details>

## FAQ

#### Is this secure?

**Yes!** LxCrypt uses [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) with a 256-bit key and [RSA](<https://en.wikipedia.org/wiki/RSA_(cryptosystem)>) with a 4096-bit key. Both of those algorithms are considered very safe.

#### What happens if I forget my password?

Because we encrypt your private key with this password and only store it on your machine, **there is no way for us to decrypt the private key for you**. Sadly, this means that you will have to reset the application and that you won't be able to decrypt any messages that were sent to you before the reset.

#### Is any data sent to your server?

**No!** Everything regarding the encryption is done locally. The only thing that is stored online is your _public_ key. But as the name already hints, it's supposed to be public :)

#### Why should I trust you?

You shouldn't trust anybody, which is why **I made this project completely open-source**. This means you can view the code yourself. The full project code is published in this GitHub repository!

## Detailed technical explanation

_Please note that this is advanced, and you don't have to understand it to use the software!_

LxCrypt uses a technology called hybrid-encryption with AES and RSA.
Here are two images showing how it's implemented in LxCrypt.

<details>
<summary>Encryption</summary>

![Encryption](https://raw.githubusercontent.com/LioXP/LxCrypt/main/img/LxCrypt-encryption.webp)

</details>

<details>
<summary>Decryption</summary>

![Decryption](https://raw.githubusercontent.com/LioXP/LxCrypt/main/img/LxCrypt-decryption.webp)

</details>

## Screenshots

<details>
<summary>Homepage</summary>

![Homepage](https://raw.githubusercontent.com/LioXP/LxCrypt/main/img/homepage.webp)

</details>

<details>
<summary>Encryption</summary>

![Encryption](https://raw.githubusercontent.com/LioXP/LxCrypt/main/img/encryption.webp)

</details>

<details>
<summary>Decryption</summary>

![Decryption](https://raw.githubusercontent.com/LioXP/LxCrypt/main/img/decryption.webp)

</details>

<details>
<summary>Contacts</summary>

![Contacts](https://raw.githubusercontent.com/LioXP/LxCrypt/main/img/contacts.webp)

</details>

## Authors

- [@LioXP](https://github.com/LioXP)

## License

- [AGPL-3.0](https://choosealicense.com/licenses/agpl-3.0/)
