const plantuml = require("node-plantuml");
const clonedeep = require("lodash/cloneDeep");

const defaultConfig = {
  format: "png",
  charset: "utf8",
  config: "classic",
};

module.exports = {
  blocks: {
    uml: {
      process: async function(block) {
        const config = clonedeep(defaultConfig);
        Object.assign(config, this.config.get("pluginsConfig.uml", {}));

        let uml = block.body;
        if (config.format === "ascii" || config.format === "unicode") {
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
          case "unicode":
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
      }
    }
  },

  hooks: {
    "page:before": function(page) {
      page.content = page.content.replace(/```(uml|puml|plantuml)/i, "{% uml %}").replace(/```/, "{% enduml %}");
      return page;
    }
  },
};
