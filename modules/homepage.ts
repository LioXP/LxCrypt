import figlet from "npm:figlet";
import chalk from "npm:chalk";

export function start() {
  console.clear();
  console.log(
    figlet.textSync("LxCrypt", {
      font: "Big Money-nw",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );
}

export function instructions() {
  console.log(
    chalk.underline.cyan("\nFiles") +
      chalk.cyan(
        ": Please drag-and-drop the File you want to encrypt or decrypt into the terminal\n"
      )
  );
  console.log(
    chalk.underline.cyan("Text") +
      chalk.cyan(
        ": Please enter/paste the Text you want to encrypt or decrypt\n"
      )
  );
}
