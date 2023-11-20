const fs = require("fs");
const path = require("path");
const parse = require("csv-parse").parse;

const generateTranslation = async (nameSpace, localeCodesConfig) => {
  const translationCsv = await fs.promises.readFile(
    path.resolve(__dirname, `assets/${nameSpace}.csv`),
    { encoding: "utf-8" }
  );
  const columns = translationCsv.split(/\r\n/)[0].split(",");
  parse(
    translationCsv,
    {
      delimiter: ",",
      columns
    },
    (err, res) => {
      if (err) {
        console.log(`Error parsing ${nameSpace}.csv: `, err);
        return;
      }
      const parsedLocale = res.slice(1).reduce((accumulator, localeMap) => {
        localeCodesConfig.forEach((localeCode) => {
          if (!accumulator[localeCode]) {
            accumulator[localeCode] = {};
          }
          accumulator[localeCode][localeMap.Keys] = localeMap[localeCode];
        });
        return accumulator;
      }, {});
      localeCodesConfig.forEach((localeCode) => {
        fs.mkdirSync(path.resolve(__dirname, `locales/${localeCode}`), {
          recursive: true,
        });
        fs.promises
          .writeFile(
            path.resolve(__dirname, `locales/${localeCode}/${nameSpace}.json`),
            JSON.stringify(parsedLocale[localeCode]),
            { encoding: "utf-8" }
          )
          .then(() => {
            console.log(
              `Successfully generated translations for namespace: ${nameSpace}, locale: ${localeCode}`
            );
          })
          .catch((err) => {
            if (err) {
              console.log(
                `Error generating translations for ${localeCode}: `,
                err
              );
              return;
            }
          });
      });
    }
  );
};

fs.rmSync(path.resolve(__dirname, "locales"), { recursive: true, force: true });
generateTranslation("common", process.argv.slice(2));
generateTranslation("textField", process.argv.slice(2));
generateTranslation("flightHub", process.argv.slice(2));
generateTranslation("AWBHub", process.argv.slice(2));
generateTranslation("errorToast", process.argv.slice(2));