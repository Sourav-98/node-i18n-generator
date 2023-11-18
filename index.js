const fs = require("fs");
const path = require("path");
const parse = require("csv-parse").parse;

const generateTranslation = async (nameSpace) => {
  const commonCsvFile = await fs.promises.readFile(
    path.resolve(__dirname, `translations/inputCSV/${nameSpace}.csv`),
    { encoding: "utf-8" }
  );

  parse(
    commonCsvFile,
    {
      delimiter: ",",
      columns: ["Keys", "en_US", "en_GB", "de_DE", "fr_FR", "es_ES"],
    },
    (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      const parsedLocale = res.reduce(
        (accumulator, localeMap) => {
          accumulator["en_US"][localeMap.Keys] = localeMap.en_US;
          accumulator["en_GB"][localeMap.Keys] = localeMap.en_GB;
          accumulator["de_DE"][localeMap.Keys] = localeMap.de_DE;
          accumulator["fr_FR"][localeMap.Keys] = localeMap.fr_FR;
          accumulator["es_ES"][localeMap.Keys] = localeMap.es_ES;
          return accumulator;
        },
        {
          en_US: {},
          en_GB: {},
          de_DE: {},
          fr_FR: {},
          es_ES: {},
        }
      );
      fs.mkdirSync(path.resolve(__dirname, "translations/outputJSON/en_US"), {
        recursive: true,
      });
      fs.writeFile(
        path.resolve(
          __dirname,
          `translations/outputJSON/en_US/${nameSpace}.json`
        ),
        JSON.stringify(parsedLocale.en_US),
        { encoding: "utf-8" },
        (err) => {
          if (err) {
            console.log('Error parsing for en_US: ', err);
            return;
          }
        }
      );
      fs.mkdirSync(path.resolve(__dirname, "translations/outputJSON/en_GB"), {
        recursive: true,
      });
      fs.writeFile(
        path.resolve(
          __dirname,
          `translations/outputJSON/en_GB/${nameSpace}.json`
        ),
        JSON.stringify(parsedLocale.en_GB),
        { encoding: "utf-8" },
        (err) => {
          if (err) {
            console.log('Error parsing for en_GB: ', err);
            return;
          }
        }
      );
      fs.mkdirSync(path.resolve(__dirname, "translations/outputJSON/de_DE"), {
        recursive: true,
      });
      fs.writeFile(
        path.resolve(
          __dirname,
          `translations/outputJSON/de_DE/${nameSpace}.json`
        ),
        JSON.stringify(parsedLocale.de_DE),
        { encoding: "utf-8" },
        (err) => {
          if (err) {
            console.log('Error parsing for de_DE: ', err);
            return;
          }
        }
      );
      fs.mkdirSync(path.resolve(__dirname, "translations/outputJSON/fr_FR"), {
        recursive: true,
      });
      fs.writeFile(
        path.resolve(
          __dirname,
          `translations/outputJSON/fr_FR/${nameSpace}.json`
        ),
        JSON.stringify(parsedLocale.fr_FR),
        { encoding: "utf-8" },
        (err) => {
          if (err) {
            console.log('Error parsing for fr_FR: ', err);
            return;
          }
        }
      );
      fs.mkdirSync(path.resolve(__dirname, "translations/outputJSON/es_ES"), {
        recursive: true,
      });
      fs.writeFile(
        path.resolve(
          __dirname,
          `translations/outputJSON/es_ES/${nameSpace}.json`
        ),
        JSON.stringify(parsedLocale.es_ES),
        { encoding: "utf-8" },
        (err) => {
          if (err) {
            console.log('Error parsing for es_ES: ', err);
            return;
          }
        }
      );
    }
  );
};

generateTranslation("common");
generateTranslation("textField");
