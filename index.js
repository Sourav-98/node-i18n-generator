const fs = require("fs");
const path = require("path");
const parse = require("csv-parse").parse;

const generateTranslation = async (nameSpace, localeCodesConfig) => {
  const commonCsvFile = await fs.promises.readFile(
    path.resolve(__dirname, `assets/${nameSpace}.csv`),
    { encoding: "utf-8" }
  );

  parse(
    commonCsvFile,
    {
      delimiter: ",",
      columns: [
        "Keys",
        "en_US",
        "en_GB",
        "de_DE",
        "fr_FR",
        "es_ES",
        "ar_AR",
        "ru_RU",
      ],
    },
    (err, res) => {
      if (err) {
        console.log(err);
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
        fs.writeFile(
          path.resolve(__dirname, `locales/${localeCode}/${nameSpace}.json`),
          JSON.stringify(parsedLocale[localeCode]),
          { encoding: "utf-8" },
          (err) => {
            if (err) {
              console.log(`Error parsing for ${localeCode}: `, err);
              return;
            }
          }
        );
      });
    }
  );
};

fs.rmSync(path.resolve(__dirname, "locales"), { recursive: true, force: true });
generateTranslation("common", process.argv.slice(2));
generateTranslation("textField", process.argv.slice(2));
