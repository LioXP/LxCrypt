import figlet from "npm:figlet";

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
