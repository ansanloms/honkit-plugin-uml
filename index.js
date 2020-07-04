const plantuml = require("node-plantuml");
const clonedeep = require("lodash/cloneDeep");

const defaultConfig = {
  format: "png",
  charset: "utf8",
  config: "classic",
};

// https://stackoverflow.com/questions/5251520/how-do-i-escape-some-html-in-javascript/5251551
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

module.exports = {
  hooks: {
    "page:before": async function(page) {
      const config = clonedeep(defaultConfig);
      Object.assign(config, this.config.get("pluginsConfig.uml", {}));

      page.content = await replaceAsync(page.content, /```(plantuml|puml|uml)((.*[\r\n]+)+?)?```/igm, async (match, type, uml) => {
        if (config.format === "ascii") {
          uml = uml.replace("@startuml", "").replace("@enduml", "");
        }

        const gen = plantuml.generate(uml, {
          format: config.format,
          charset: config.charset,
          config: config.config
        });

        const chunks = [];
        for await (const chunk of gen.out) {
          chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        switch (config.format) {
          case "ascii":
            const asciiHtml = buffer.toString(config.charset)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');

            return `<pre>${asciiHtml}</pre>`;

          case "svg":
            return `<img src="data:image/svg+xml;base64,${buffer.toString("base64")}">`;

          case "png":
          default:
            return `<img src="data:image/png;base64,${buffer.toString("base64")}">`;
        }
      });

      return page;
    }
  },
};
